import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CryptoSpacePrison", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne] = await ethers.getSigners();
    // Deploy contracts
    const contractFactory = await ethers.getContractFactory(
      "CryptoSpacePrison"
    );
    const contract = await contractFactory.deploy(
      ethers.parseEther("0"),
      ethers.parseEther("5")
    );
    return {
      deployer,
      userOne,
      contract,
    };
  }

  it("Should support the main flow", async function () {
    const { deployer, userOne, contract } = await loadFixture(initFixture);
    // Mint characters
    await expect(
      contract.connect(userOne).mintPickpocket()
    ).to.changeEtherBalances([userOne], [ethers.parseEther("0")]);
    await expect(
      contract.connect(userOne).mintPickpocket()
    ).to.changeEtherBalances([userOne], [ethers.parseEther("0")]);
    await expect(
      contract.connect(userOne).mintConman({ value: ethers.parseEther("5") })
    ).to.changeEtherBalances([userOne], [ethers.parseEther("-5")]);
    // Check cell with minted characters
    const cell = await contract.getCell(userOne);
    expect(cell.pickpocketAmount).to.be.equal(2);
    expect(cell.conmanAmount).to.be.equal(1);
    // Withdraw balance
    await expect(contract.connect(deployer).withdraw()).to.changeEtherBalances(
      [contract, deployer],
      [ethers.parseEther("-5"), ethers.parseEther("5")]
    );
  });
});
