import {
  Account,
  Address,
  concat,
  createWalletClient,
  decodeErrorResult,
  encodeFunctionData,
  Hex,
  http,
  pad,
  toHex,
  WalletClient,
  zeroAddress,
} from "viem";
import { accountFactoryAbi } from "../abi/accountFactory";
import { Contracts } from "../config/contracts";
import { entryPointAbi } from "../abi/entryPoint";
import { privateKeyToAccount } from "viem/accounts";

export interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymaster: Address;
  paymasterVerificationGasLimit: bigint;
  paymasterPostOpGasLimit: bigint;
  paymasterData: Hex;
  signature: Hex;
}

export interface PackedUserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  accountGasLimits: Hex;
  preVerificationGas: bigint;
  gasFees: Hex;
  paymasterAndData: Hex;
  signature: Hex;
}

// TODO: Move fake bundler to server side
export function getFakeBundler(contracts: Contracts): {
  fakeBundlerAccount: Account;
  fakeBundlerWalletClient: WalletClient;
} {
  const fakeBundlerAccount = privateKeyToAccount(
    process.env.NEXT_PUBLIC_FAKE_BUNDLER_ACCOUNT_PRIVATE_KEY as `0x${string}`
  );
  const fakeBundlerWalletClient = createWalletClient({
    account: fakeBundlerAccount,
    chain: contracts.chain,
    transport: http(),
  });
  return { fakeBundlerAccount, fakeBundlerWalletClient };
}

export function getInitParams(
  ethAddress: Address,
  contracts: Contracts
): {
  initAddr: Address;
  initCallData: Hex;
  initCode: Hex;
} {
  const initAddr = contracts.accountFactory;
  const initCallData = encodeFunctionData({
    abi: accountFactoryAbi,
    functionName: "createAccount",
    args: [ethAddress],
  });
  const initCode = initAddr + initCallData.slice(2);
  console.log("initCode:", initCode);
  return {
    initAddr,
    initCallData,
    initCode: initCode as Hex,
  };
}

export async function getSender(
  initCode: Hex,
  contracts: Contracts
): Promise<Address> {
  let sender: Address = zeroAddress;
  try {
    const { fakeBundlerAccount, fakeBundlerWalletClient } =
      getFakeBundler(contracts);
    await fakeBundlerWalletClient.writeContract({
      account: fakeBundlerAccount,
      address: contracts.entryPoint,
      abi: entryPointAbi,
      functionName: "getSenderAddress",
      args: [initCode as `0x${string}`],
      chain: contracts.chain,
    });
  } catch (error: any) {
    const value = decodeErrorResult({
      abi: entryPointAbi,
      data: error?.cause?.cause?.cause?.cause?.cause?.data as `0x${string}`,
    });
    sender = value.args[0] as Address;
  }
  console.log("sender:", sender);
  return sender;
}

export function packUserOperation(userOp: UserOperation): PackedUserOperation {
  const accountGasLimits = packAccountGasLimits(
    userOp.verificationGasLimit,
    userOp.callGasLimit
  );
  const gasFees = packAccountGasLimits(
    userOp.maxPriorityFeePerGas,
    userOp.maxFeePerGas
  );
  let paymasterAndData: Hex = "0x";
  if (userOp.paymaster?.length >= 20 && userOp.paymaster !== zeroAddress) {
    paymasterAndData = packPaymasterData(
      userOp.paymaster,
      userOp.paymasterVerificationGasLimit,
      userOp.paymasterPostOpGasLimit,
      userOp.paymasterData
    );
  }
  return {
    sender: userOp.sender,
    nonce: userOp.nonce,
    callData: userOp.callData,
    accountGasLimits: accountGasLimits,
    initCode: userOp.initCode,
    preVerificationGas: userOp.preVerificationGas,
    gasFees: gasFees,
    paymasterAndData: paymasterAndData,
    signature: userOp.signature,
  };
}

function packAccountGasLimits(
  verificationGasLimit: bigint,
  callGasLimit: bigint
): Hex {
  return concat([
    pad(toHex(verificationGasLimit), { size: 16 }),
    pad(toHex(callGasLimit), { size: 16 }),
  ]);
}

function packPaymasterData(
  paymaster: Address,
  paymasterVerificationGasLimit: bigint,
  postOpGasLimit: bigint,
  paymasterData: Hex
): Hex {
  return concat([
    paymaster,
    pad(toHex(paymasterVerificationGasLimit), { size: 16 }),
    pad(toHex(postOpGasLimit), { size: 16 }),
    paymasterData,
  ]);
}
