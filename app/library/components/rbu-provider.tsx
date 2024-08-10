"use client";

import { accountAbi } from "@/library/abi/account";
import { entryPointAbi } from "@/library/abi/entryPoint";
import {
  getFakeBundler,
  getInitParams,
  getSender,
  packUserOperation,
  UserOperation,
} from "@/library/lib/accountAbstraction";
import { getTonEthAccount } from "@/library/lib/localStorage";
import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Address,
  createPublicClient,
  encodeFunctionData,
  Hash,
  Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { contractsConfig } from "../config/contracts";

type RBUContextType = {
  tonAddress: string | undefined;
  tonConnect: () => Promise<void>;
  tonDisconnect: () => Promise<void>;
  getTonBalance: () => Promise<bigint>;
  ethAddress: Address | undefined;
  ethExecute: (
    network: string,
    executeDestination: Address,
    executeFunction: Hex
  ) => Promise<{ txHash: Hash; txExplorerLink: string }>;
  getEthSenderAddress: (network: string) => Promise<Address>;
};

const RBUContext = createContext<RBUContextType | null>(null);

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

  async function ethExecute(
    network: string,
    executeDestination: Address,
    executeFunction: Hex
  ): Promise<{ txHash: Hash; txExplorerLink: string }> {
    if (!ethAddress) {
      throw new Error("Ethereum address is not defined");
    }
    const contracts = contractsConfig[network];
    if (!contracts) {
      throw new Error("Network is not supported");
    }

    const { initAddr, initCallData, initCode } = getInitParams(
      ethAddress,
      contracts
    );
    const sender = await getSender(initCode, contracts);

    const publicClient = createPublicClient({
      chain: contracts.chain,
      transport: http(),
    });

    let initCodeFixed = initCode;
    const code = await publicClient.getBytecode({
      address: sender,
    });
    if (code) {
      initCodeFixed = "0x";
    }
    console.log("code:", code);

    const nonce = await publicClient.readContract({
      address: contracts.entryPoint,
      abi: entryPointAbi,
      functionName: "getNonce",
      args: [sender, BigInt(0)],
    });
    console.log("nonce:", nonce);

    const callData = encodeFunctionData({
      abi: accountAbi,
      functionName: "execute",
      args: [executeDestination, BigInt(0), executeFunction],
    });
    console.log("callData:", callData);

    const initCallGasLimit = await publicClient.estimateGas({
      account: contracts.entryPoint,
      to: sender,
      data: callData,
    });
    console.log("initCallGasLimit:", initCallGasLimit);

    const initVerificationGasLimit = await publicClient.estimateGas({
      account: contracts.entryPoint,
      to: initAddr,
      data: initCallData,
    });
    console.log("initVerificationGasLimit:", initVerificationGasLimit);

    const block = await publicClient.getBlock({ blockTag: "latest" });

    // Prepare user operations
    const userOp: UserOperation = {
      sender: sender,
      nonce: nonce,
      initCode: initCodeFixed,
      callData: callData,
      callGasLimit: initCallGasLimit + BigInt(55_000),
      verificationGasLimit: initVerificationGasLimit + BigInt(150_000),
      preVerificationGas: BigInt(21_000),
      maxFeePerGas: block!.baseFeePerGas! + BigInt(1e9),
      maxPriorityFeePerGas: BigInt(1e9), // 1 gwei
      paymaster: contracts.paymaster,
      paymasterData: "0x",
      paymasterVerificationGasLimit: BigInt(30000),
      paymasterPostOpGasLimit: BigInt(0),
      signature: "0x",
    };
    let packedUserOp: any = packUserOperation(userOp);
    console.log("packedUserOp:", packedUserOp);

    // Define fake bundler
    const { fakeBundlerAccount, fakeBundlerWalletClient } =
      getFakeBundler(contracts);

    // Send user operation
    const txHash = await fakeBundlerWalletClient.writeContract({
      account: fakeBundlerAccount,
      address: contracts.entryPoint,
      abi: entryPointAbi,
      functionName: "handleOps",
      args: [[packedUserOp], fakeBundlerAccount.address],
      chain: contracts.chain,
    });
    console.log("txHash:", txHash);

    return {
      txHash: txHash,
      txExplorerLink: `${contracts.explorer}/tx/${txHash}`,
    };
  }

  async function getEthSenderAddress(network: string): Promise<Address> {
    if (!ethAddress) {
      throw new Error("Ethereum address is not defined");
    }
    const contracts = contractsConfig[network];
    if (!contracts) {
      throw new Error("Network is not supported");
    }
    const { initCode } = getInitParams(ethAddress, contracts);
    const sender = await getSender(initCode, contracts);
    return sender;
  }

  async function getTonBalance(): Promise<bigint> {
    if (!tonAddress) {
      throw new Error("Ton address is not defined");
    }
    const { data } = await axios.get(
      `https://toncenter.com/api/v3/account?address=${tonAddress}`
    );
    return BigInt(data.balance);
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
        getTonBalance: getTonBalance,
        ethAddress: ethAddress,
        ethExecute: ethExecute,
        getEthSenderAddress: getEthSenderAddress,
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
  return useContext(RBUContext) as RBUContextType;
}

export { RBUProviderWrapper as RBUProvider, useRBU };
