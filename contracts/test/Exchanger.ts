import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { Exchanger__factory, USDToken__factory } from "../typechain-types";
import { expect } from "chai";

describe("Exchanger", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
    // Deploy contracts
    const usdTokenContract = await new USDToken__factory(deployer).deploy();
    const exchangerContract = await new Exchanger__factory(deployer).deploy(
      await usdTokenContract.getAddress(),
      ethers.ZeroAddress,
      ethers.ZeroHash
    );
    return {
      deployer,
      userOne,
      userTwo,
      userThree,
      usdTokenContract,
      exchangerContract,
    };
  }

  it("Should support the main flow", async function () {
    const { deployer, userOne, usdTokenContract, exchangerContract } =
      await loadFixture(initFixture);

    // Set price
    await expect(
      exchangerContract.connect(deployer).setPrice({
        price: 624477378n,
        conf: 1142569n,
        expo: -8n,
        publishTime: 1723125428n,
      })
    ).to.be.not.reverted;

    // Sell
    await expect(
      exchangerContract.connect(userOne).sell(BigInt(10 * 10 ** 18))
    ).to.changeTokenBalances(
      usdTokenContract,
      [userOne],
      [62447737800000000000n]
    );
  });
});
