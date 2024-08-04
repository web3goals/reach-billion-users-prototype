import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { UserOperation } from "./utils/solidityInterfaces";
import { packUserOp } from "./utils/userOperations";

describe("Paymaster", function () {
  async function initFixture() {
    // Get signers
    const [deployer, fakeBundler, userOne, userTwo, userThree] =
      await ethers.getSigners();
    // Deploy contracts
    const accountContractFactory = await ethers.getContractFactory("Account");
    const accountFactoryContractFactory = await ethers.getContractFactory(
      "AccountFactory"
    );
    const accountFactoryContract = await accountFactoryContractFactory.deploy();
    const entryPointContractFactory = await ethers.getContractFactory(
      "CustomEntryPoint"
    );
    const entryPointContract = await entryPointContractFactory.deploy();
    const paymasterContractFactory = await ethers.getContractFactory(
      "Paymaster"
    );
    const paymasterContract = await paymasterContractFactory.deploy(
      entryPointContract
    );
    const usdTokenContractFactory = await ethers.getContractFactory("USDToken");
    const usdTokenContract = await usdTokenContractFactory.deploy();
    // Deposit paymaster
    await entryPointContract.depositTo(paymasterContract, {
      value: ethers.parseEther("1"),
    });
    return {
      deployer,
      fakeBundler,
      userOne,
      userTwo,
      userThree,
      accountContractFactory,
      accountFactoryContractFactory,
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      usdTokenContractFactory,
      usdTokenContract,
    };
  }

  it("Should support the main flow", async function () {
    const {
      fakeBundler,
      userOne,
      accountContractFactory,
      accountFactoryContractFactory,
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      usdTokenContractFactory,
      usdTokenContract,
    } = await loadFixture(initFixture);

    expect(
      (await entryPointContract.getDepositInfo(paymasterContract))[0]
    ).to.be.equal(ethers.parseEther("1"));

    let initCode =
      (await accountFactoryContract.getAddress()) +
      accountFactoryContractFactory.interface
        .encodeFunctionData("createAccount", [userOne.address])
        .slice(2);
    // console.log("initCode:", initCode);

    let sender = "0x";
    try {
      await entryPointContract.getSenderAddress(initCode);
    } catch (error: any) {
      sender = "0x" + error.data.slice(-40);
    }
    // console.log("sender:", sender);

    const code = await ethers.provider.getCode(sender as string);
    if (code !== "0x") {
      initCode = "0x";
    }
    // console.log("code:", code);

    const nonce = Number(
      await entryPointContract.getNonce(sender as string, 0)
    );
    // console.log("nonce:", nonce);

    const callData = accountContractFactory.interface.encodeFunctionData(
      "execute",
      [
        await usdTokenContract.getAddress(),
        ethers.ZeroHash,
        usdTokenContractFactory.interface.encodeFunctionData("mint", [2]),
      ]
    );
    // console.log("callData:", callData);

    const userOp: UserOperation = {
      sender: sender as `0x${string}`,
      nonce: nonce,
      initCode: initCode,
      callData: callData,
      callGasLimit: 10_000_000,
      verificationGasLimit: 500_000,
      preVerificationGas: 100_000,
      maxFeePerGas: ethers.parseUnits("2", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
      paymaster: await paymasterContract.getAddress(),
      paymasterData: "0x",
      paymasterVerificationGasLimit: 30000,
      paymasterPostOpGasLimit: 0,
      signature: "0x",
    };
    const packedUserOp = packUserOp(userOp);

    // Handle user operation using fake bundler
    const tx = await entryPointContract
      .connect(fakeBundler)
      .handleOps([packedUserOp], await fakeBundler.getAddress());
    // console.log("tx.hash:", tx.hash);

    expect(
      await usdTokenContract.balanceOf(sender as `0x${string}`)
    ).to.be.equal(ethers.parseEther("2"));
    expect(
      (await entryPointContract.getDepositInfo(paymasterContract))[0]
    ).to.be.not.equal(ethers.parseEther("1"));
  });
});
