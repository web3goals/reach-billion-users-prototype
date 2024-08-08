import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import IPythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";

async function main() {
  console.log("👟 Start script 'use-exchanger'");

  const network = hre.network.name;

  const [deployer] = await ethers.getSigners();

  // Define contracts
  const pythContract = await ethers.getContractAt(
    IPythAbi,
    CONTRACTS[network].pyth as `0x${string}`
  );
  const usdTokenContract = await ethers.getContractAt(
    "USDToken",
    CONTRACTS[network].usdToken as `0x${string}`
  );
  const exchangerContract = await ethers.getContractAt(
    "Exchanger",
    CONTRACTS[network].exchanger as `0x${string}`
  );

  // Print USD token balance before
  const balanceBefore = await usdTokenContract.balanceOf(deployer);
  console.log("balanceBefore:", balanceBefore);

  // Update price using Pyth
  const hermesUrl = "https://hermes.pyth.network";
  const pythPriceService = new EvmPriceServiceConnection(hermesUrl);
  const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
    CONTRACTS[network].pythPriceFeedId as `0x${string}`,
  ]);
  const updateFee = await pythContract.getUpdateFee(priceFeedUpdateData);
  await exchangerContract.updatePrice(priceFeedUpdateData, {
    value: updateFee,
  });
  const price = await exchangerContract.price();
  console.log("price:", price);

  // Sell Toncoin
  await exchangerContract.sell(BigInt(5 * 10 ** 18));

  // Print USD token balance before
  const balanceAfter = await usdTokenContract.balanceOf(deployer);
  console.log("balanceAfter:", balanceAfter);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
