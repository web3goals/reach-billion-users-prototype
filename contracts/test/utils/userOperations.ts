import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { PackedUserOperation, UserOperation } from "./solidityInterfaces";

export function packUserOp(userOp: UserOperation): PackedUserOperation {
  const accountGasLimits = packAccountGasLimits(
    userOp.verificationGasLimit,
    userOp.callGasLimit
  );
  const gasFees = packAccountGasLimits(
    userOp.maxPriorityFeePerGas,
    userOp.maxFeePerGas
  );
  let paymasterAndData = "0x";
  if (
    userOp.paymaster?.length >= 20 &&
    userOp.paymaster !== ethers.ZeroAddress
  ) {
    paymasterAndData = packPaymasterData(
      userOp.paymaster as string,
      userOp.paymasterVerificationGasLimit,
      userOp.paymasterPostOpGasLimit,
      userOp.paymasterData as string
    );
  }
  return {
    sender: userOp.sender,
    nonce: userOp.nonce,
    callData: userOp.callData,
    accountGasLimits,
    initCode: userOp.initCode,
    preVerificationGas: userOp.preVerificationGas,
    gasFees,
    paymasterAndData,
    signature: userOp.signature,
  };
}

export function packAccountGasLimits(
  verificationGasLimit: BigNumberish,
  callGasLimit: BigNumberish
): string {
  return ethers.concat([
    ethers.zeroPadValue(ethers.toBeHex(verificationGasLimit), 16),
    ethers.zeroPadValue(ethers.toBeHex(callGasLimit), 16),
  ]);
}

export function packPaymasterData(
  paymaster: string,
  paymasterVerificationGasLimit: BigNumberish,
  postOpGasLimit: BigNumberish,
  paymasterData: string
): string {
  return ethers.concat([
    paymaster,
    ethers.zeroPadValue(ethers.toBeHex(paymasterVerificationGasLimit), 16),
    ethers.zeroPadValue(ethers.toBeHex(postOpGasLimit), 16),
    paymasterData,
  ]);
}
