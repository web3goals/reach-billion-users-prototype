import { accountAbi } from "@/contracts/abi/account";
import { accountFactoryAbi } from "@/contracts/abi/accountFactory";
import { entryPointAbi } from "@/contracts/abi/entryPoint";
import { getTonEthAccount } from "@/lib/localStorage";
import { packUserOperation, UserOperation } from "@/lib/userOperations";
import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Address,
  Chain,
  createPublicClient,
  createWalletClient,
  decodeErrorResult,
  encodeFunctionData,
  Hex,
  http,
  slice,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimismSepolia } from "viem/chains";

type Contracts = {
  chain: Chain;
  entryPoint: Address;
  accountFactory: Address;
  paymaster: Address;
};

type RBAContextType = {
  tonAddress?: string;
  tonConnect?: () => Promise<void>;
  tonDisconnect?: () => Promise<void>;
  ethAddress?: Address;
  ethExecute?: (
    network: string,
    executeDestination: Address,
    executeFunction: Hex
  ) => Promise<Address>;
  getEthAaAddress?: () => Promise<Address>;
};

const contracts: { [key: string]: Contracts } = {
  optimismSepolia: {
    chain: optimismSepolia,
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
  },
};

const RBAContext = createContext<RBAContextType>({});

function RBAProvider({ children }: { children: React.ReactNode }) {
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();
  const [ethAddress, setEthAddress] = useState<Address | undefined>();

  async function initEthAddress() {
    try {
      const tonEthAccount = getTonEthAccount(tonAddress);
      const ethAccount = privateKeyToAccount(tonEthAccount.ethPrivateKey);
      setEthAddress(ethAccount.address);
    } catch (error) {
      console.error("Failed to init address:", error);
    }
  }

  // TODO: Hide fake bundler in API
  async function ethExecute(
    network: string,
    executeDestination: Address,
    executeFunction: Hex
  ): Promise<Hex> {
    if (!ethAddress) {
      throw new Error("Ethereum address is not defined");
    }

    let chain = contracts[network]?.chain;
    if (!chain) {
      throw new Error("Network is not supported");
    }

    const fakeBundlerAccount = privateKeyToAccount(
      process.env.NEXT_PUBLIC_FAKE_BUNDLER_ACCOUNT_PRIVATE_KEY as `0x${string}`
    );
    console.log("fakeBundler:", fakeBundlerAccount.address);

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const fakeBundlerWalletClient = createWalletClient({
      account: fakeBundlerAccount,
      chain: chain,
      transport: http(),
    });

    let chainContracts = contracts[network];
    if (!chainContracts) {
      throw new Error("Contracts are not defined");
    }

    let initCode =
      chainContracts.accountFactory +
      encodeFunctionData({
        abi: accountFactoryAbi,
        functionName: "createAccount",
        args: [ethAddress],
      }).slice(2);
    console.log("initCode:", initCode);

    let sender;
    try {
      await fakeBundlerWalletClient.writeContract({
        address: chainContracts.entryPoint,
        abi: entryPointAbi,
        functionName: "getSenderAddress",
        args: [initCode as `0x${string}`],
      });
    } catch (error: any) {
      const value = decodeErrorResult({
        abi: entryPointAbi,
        data: error?.cause?.cause?.cause?.cause?.cause?.data as `0x${string}`,
      });
      sender = value.args[0];
    }
    console.log("sender:", sender);

    const code = await publicClient.getBytecode({
      address: sender as `0x${string}`,
    });
    if (code) {
      initCode = "0x";
    }
    console.log("code:", code);

    const nonce = await publicClient.readContract({
      address: chainContracts.entryPoint,
      abi: entryPointAbi,
      functionName: "getNonce",
      args: [sender as `0x${string}`, BigInt(0)],
    });
    console.log("nonce:", nonce);

    const callData = encodeFunctionData({
      abi: accountAbi,
      functionName: "execute",
      args: [executeDestination, BigInt(0), executeFunction],
    });
    console.log("callData:", callData);

    const initCallGasLimit = await publicClient.estimateGas({
      account: chainContracts.entryPoint,
      to: sender as `0x${string}`,
      data: callData,
    });
    console.log("initCallGasLimit:", initCallGasLimit);

    const initAddr = slice(initCode as `0x${string}`, 0, 20);
    const initCallData = slice(initCode as `0x${string}`, 20);
    const initVerificationGasLimit = await publicClient.estimateGas({
      account: chainContracts.entryPoint,
      to: initAddr,
      data: initCallData,
    });
    console.log("initVerificationGasLimit:", initVerificationGasLimit);

    const block = await publicClient.getBlock({ blockTag: "latest" });

    const userOp: UserOperation = {
      sender: sender as Address,
      nonce: nonce,
      initCode: initCode as Hex,
      callData: callData,
      callGasLimit: initCallGasLimit + BigInt(55_000),
      verificationGasLimit: initVerificationGasLimit + BigInt(150_000),
      preVerificationGas: BigInt(21_000),
      maxFeePerGas: block!.baseFeePerGas! + BigInt(1e9),
      maxPriorityFeePerGas: BigInt(1e9), // 1 gwei
      paymaster: chainContracts.paymaster,
      paymasterData: "0x",
      paymasterVerificationGasLimit: BigInt(30000),
      paymasterPostOpGasLimit: BigInt(0),
      signature: "0x",
    };
    let packedUserOp: any = packUserOperation(userOp);
    console.log("packedUserOp:", packedUserOp);

    const tx = await fakeBundlerWalletClient.writeContract({
      address: chainContracts.entryPoint,
      abi: entryPointAbi,
      functionName: "handleOps",
      args: [[packedUserOp], fakeBundlerAccount.address],
    });

    return tx;
  }

  // TODO: Implement
  async function getEthAaAddress(): Promise<Address> {
    return "0x0";
  }

  useEffect(() => {
    if (tonAddress) {
      initEthAddress();
    } else {
      setEthAddress(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonAddress]);

  return (
    <RBAContext.Provider
      value={{
        tonAddress: tonAddress,
        tonConnect: () => tonConnectUI.openModal(),
        tonDisconnect: () => tonConnectUI.disconnect(),
        ethAddress: ethAddress,
        ethExecute: ethExecute,
        getEthAaAddress: getEthAaAddress,
      }}
    >
      {children}
    </RBAContext.Provider>
  );
}

function RBAProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL}
    >
      <RBAProvider>{children}</RBAProvider>
    </TonConnectUIProvider>
  );
}

function useRBA() {
  return useContext(RBAContext);
}

export { RBAProviderWrapper as RBAProvider, useRBA };
