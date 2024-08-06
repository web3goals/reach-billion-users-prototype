import { Address, concat, Hex, pad, toHex, zeroAddress } from "viem";

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