import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import IPythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";
import hre, { ethers } from "hardhat";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'set-exchanger-price'");

  const network = hre.network.name;

  // Define contracts
  const pythContract = await ethers.getContractAt(
    IPythAbi,
    CONTRACTS[network].pyth as `0x${string}`
  );
  const exchangerContract = await ethers.getContractAt(
    "Exchanger",
    CONTRACTS[network].exchanger as `0x${string}`
  );

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

  // Print price
  const price = await exchangerContract.price();
  console.log("price:", price);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
