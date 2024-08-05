import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'print-deposit-info'");

  const network = hre.network.name;

  const entryPointContract = await ethers.getContractAt(
    "AAEntryPoint",
    CONTRACTS[network].entryPoint as `0x${string}`
  );
  const paymasterDepositInfo = await entryPointContract.getDepositInfo(
    CONTRACTS[network].paymaster as `0x${string}`
  );
  console.log("paymasterDepositInfo", paymasterDepositInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
