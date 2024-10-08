import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  if (!CONTRACTS[network].entryPoint) {
    const contractFactory = await ethers.getContractFactory("AAEntryPoint");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'AAEntryPoint' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].accountFactory) {
    const contractFactory = await ethers.getContractFactory("AccountFactory");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'AccountFactory' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].paymaster && CONTRACTS[network].entryPoint) {
    const contractFactory = await ethers.getContractFactory("Paymaster");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].entryPoint
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Paymaster' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].usdToken) {
    const contractFactory = await ethers.getContractFactory("USDToken");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log(
      `Contract 'USDToken' deployed to: ${await contract.getAddress()}`
    );
  }

  if (!CONTRACTS[network].cryptoSpacePrison && CONTRACTS[network].usdToken) {
    const contractFactory = await ethers.getContractFactory(
      "CryptoSpacePrison"
    );
    const contract = await contractFactory.deploy(
      CONTRACTS[network].usdToken,
      ethers.parseEther("0"),
      ethers.parseEther("5")
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'CryptoSpacePrison' deployed to: ${await contract.getAddress()}`
    );
  }

  if (
    !CONTRACTS[network].exchanger &&
    CONTRACTS[network].usdToken &&
    CONTRACTS[network].pyth &&
    CONTRACTS[network].pythPriceFeedId
  ) {
    const contractFactory = await ethers.getContractFactory("Exchanger");
    const contract = await contractFactory.deploy(
      CONTRACTS[network].usdToken,
      CONTRACTS[network].pyth,
      CONTRACTS[network].pythPriceFeedId
    );
    await contract.waitForDeployment();
    console.log(
      `Contract 'Exchanger' deployed to: ${await contract.getAddress()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
