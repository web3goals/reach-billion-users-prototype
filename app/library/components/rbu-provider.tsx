"use client";

import { accountAbi } from "@/library/abi/account";
import { accountFactoryAbi } from "@/library/abi/accountFactory";
import { entryPointAbi } from "@/library/abi/entryPoint";
import { getTonEthAccount } from "@/library/lib/localStorage";
import { packUserOperation, UserOperation } from "@/library/lib/userOperations";
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
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimismSepolia } from "viem/chains";

type Contracts = {
  chain: Chain;
  entryPoint: Address;
  accountFactory: Address;
  paymaster: Address;
};

type RBUContextType = {
  tonAddress?: string;
  tonConnect?: () => Promise<void>;
  tonDisconnect?: () => Promise<void>;
  ethAddress?: Address;
  // TODO: Return hash and link to blockscout
  ethExecute?: (
    network: string,
    executeDestination: Address,
    executeFunction: Hex
  ) => Promise<Address>;
  getEthAaAddress?: (network: string) => Promise<Address>;
};

const contracts: { [key: string]: Contracts } = {
  optimismSepolia: {
    chain: optimismSepolia,
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
  },
};

const RBUContext = createContext<RBUContextType>({});

function RBUProvider({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
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

    const initAddr = chainContracts.accountFactory;
    const initCallData = encodeFunctionData({
      abi: accountFactoryAbi,
      functionName: "createAccount",
      args: [ethAddress],
    });
    let initCode = initAddr + initCallData.slice(2);
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
    console.log("tx:", tx);

    return tx;
  }

  async function getEthAaAddress(network: string): Promise<Address> {
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
    return sender as Address;
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
    <RBUContext.Provider
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
    </RBUContext.Provider>
  );
}

function RBUProviderWrapper({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  return (
    <TonConnectUIProvider
      manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL}
    >
      <RBUProvider apiKey={apiKey}>{children}</RBUProvider>
    </TonConnectUIProvider>
  );
}

function useRBU() {
  return useContext(RBUContext);
}

export { RBUProviderWrapper as RBUProvider, useRBU };
