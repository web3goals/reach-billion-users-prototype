import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  AAEntryPoint__factory,
  Account__factory,
  AccountFactory,
  AccountFactory__factory,
  CryptoSpacePrison__factory,
  EntryPoint,
  Paymaster,
  Paymaster__factory,
  USDToken__factory,
} from "../typechain-types";
import { UserOperation } from "./utils/solidityInterfaces";
import { packUserOp } from "./utils/userOperations";

describe("AccountAbstraction", function () {
  async function initFixture() {
    // Get signers
    const [deployer, fakeBundler, userOne, userTwo, userThree] =
      await ethers.getSigners();
    // Deploy contracts
    const accountFactoryContract = await new AccountFactory__factory(
      deployer
    ).deploy();
    const entryPointContract = await new AAEntryPoint__factory(
      deployer
    ).deploy();
    const paymasterContract = await new Paymaster__factory(deployer).deploy(
      entryPointContract
    );
    const usdTokenContract = await new USDToken__factory(deployer).deploy();
    const cspContract = await new CryptoSpacePrison__factory(deployer).deploy(
      await usdTokenContract.getAddress(),
      ethers.parseEther("0"),
      ethers.parseEther("5")
    );
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
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      usdTokenContract,
      cspContract,
    };
  }

  async function getInitCode(args: {
    user: any;
    accountFactoryContract: AccountFactory;
  }) {
    const initAddr = await args.accountFactoryContract.getAddress();
    const initCallData =
      new AccountFactory__factory().interface.encodeFunctionData(
        "createAccount",
        [args.user.address]
      );
    let initCode = initAddr + initCallData.slice(2);
    // console.log("initCode:", initCode);

    return { initAddr, initCallData, initCode };
  }

  async function getSender(args: {
    initCode: string;
    entryPointContract: EntryPoint;
  }) {
    let sender = "0x";
    try {
      await args.entryPointContract.getSenderAddress(args.initCode);
    } catch (error: any) {
      sender = "0x" + error.data.slice(-40);
    }
    // console.log("sender:", sender);

    return { sender };
  }

  async function sendUserOperation(args: {
    user: any;
    fakeBundler: any;
    executeDestination: string;
    executeFunction: string;
    accountFactoryContract: AccountFactory;
    entryPointContract: EntryPoint;
    paymasterContract: Paymaster;
  }) {
    const { initAddr, initCallData, initCode } = await getInitCode({
      user: args.user,
      accountFactoryContract: args.accountFactoryContract,
    });
    const { sender } = await getSender({
      initCode: initCode,
      entryPointContract: args.entryPointContract,
    });

    let initCodeFixed = initCode;
    const code = await ethers.provider.getCode(sender as string);
    if (code !== "0x") {
      initCodeFixed = "0x";
    }
    // console.log("code:", code);

    const nonce = Number(
      await args.entryPointContract.getNonce(sender as string, 0)
    );
    // console.log("nonce:", nonce);

    const callData = new Account__factory().interface.encodeFunctionData(
      "execute",
      [args.executeDestination, ethers.ZeroHash, args.executeFunction]
    );
    // console.log("callData:", callData);

    const initCallGasLimit = await ethers.provider.estimateGas({
      from: args.entryPointContract,
      to: sender,
      data: callData,
    });
    // console.log("initCallGasLimit:", initCallGasLimit);

    const initVerificationGasLimit = await ethers.provider.estimateGas({
      from: args.entryPointContract,
      to: initAddr,
      data: initCallData,
    });

    const block = await ethers.provider.getBlock("latest");
    const maxFeePerGas = block!.baseFeePerGas!;

    const userOp: UserOperation = {
      sender: sender,
      nonce: nonce,
      initCode: initCodeFixed,
      callData: callData,
      callGasLimit: initCallGasLimit + BigInt(55_000),
      verificationGasLimit: initVerificationGasLimit + BigInt(150_000),
      preVerificationGas: 21_000,
      maxFeePerGas: maxFeePerGas + BigInt(1e9),
      maxPriorityFeePerGas: BigInt(1e9), // 1 gwei
      paymaster: await args.paymasterContract.getAddress(),
      paymasterData: "0x",
      paymasterVerificationGasLimit: 3e5,
      paymasterPostOpGasLimit: 0,
      signature: "0x",
    };
    const packedUserOp = packUserOp(userOp);

    // Handle user operation using fake bundler
    const tx = await args.entryPointContract
      .connect(args.fakeBundler)
      .handleOps([packedUserOp], await args.fakeBundler.getAddress());
    // console.log("tx.hash:", tx.hash);

    return { sender: sender, tx: tx.hash };
  }

  it("Should use paymaster to mint free character", async function () {
    const {
      fakeBundler,
      userOne,
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      cspContract,
    } = await loadFixture(initFixture);

    // Check paymaster balance
    expect(
      (await entryPointContract.getDepositInfo(paymasterContract))[0]
    ).to.be.equal(ethers.parseEther("1"));

    const { tx, sender } = await sendUserOperation({
      user: userOne,
      fakeBundler: fakeBundler,
      executeDestination: await cspContract.getAddress(),
      executeFunction:
        new CryptoSpacePrison__factory().interface.encodeFunctionData(
          "mintPickpocket"
        ),
      accountFactoryContract: accountFactoryContract,
      entryPointContract: entryPointContract,
      paymasterContract: paymasterContract,
    });
    // console.log("tx:", tx);
    // console.log("sender", sender);

    // Check characters
    const cell = await cspContract.getCell(sender);
    expect(cell.pickpocketAmount).to.be.equal(1);
    expect(cell.conmanAmount).to.be.equal(0);

    // Check paymaster balance
    expect(
      (await entryPointContract.getDepositInfo(paymasterContract))[0]
    ).to.be.not.equal(ethers.parseEther("1"));
  });

  it("Should allow token transfers", async function () {
    const {
      fakeBundler,
      userOne,
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      usdTokenContract,
      cspContract,
    } = await loadFixture(initFixture);

    const { tx, sender } = await sendUserOperation({
      user: userOne,
      fakeBundler: fakeBundler,
      executeDestination: await usdTokenContract.getAddress(),
      executeFunction: new USDToken__factory().interface.encodeFunctionData(
        "approve",
        [await cspContract.getAddress(), 42]
      ),
      accountFactoryContract: accountFactoryContract,
      entryPointContract: entryPointContract,
      paymasterContract: paymasterContract,
    });
    // console.log("tx:", tx);
    // console.log("sender", sender);

    // Check allowance
    expect(await usdTokenContract.allowance(sender, cspContract)).to.be.equal(
      42
    );
  });

  it("Should mint paid character", async function () {
    const {
      fakeBundler,
      userOne,
      accountFactoryContract,
      entryPointContract,
      paymasterContract,
      usdTokenContract,
      cspContract,
    } = await loadFixture(initFixture);

    // Allow token transfers
    const { sender } = await sendUserOperation({
      user: userOne,
      fakeBundler: fakeBundler,
      executeDestination: await usdTokenContract.getAddress(),
      executeFunction: new USDToken__factory().interface.encodeFunctionData(
        "approve",
        [await cspContract.getAddress(), ethers.parseEther("100")]
      ),
      accountFactoryContract: accountFactoryContract,
      entryPointContract: entryPointContract,
      paymasterContract: paymasterContract,
    });

    // Mint usd tokens for sender
    await usdTokenContract.mint(ethers.parseEther("10"), sender);

    // Mint paid character
    await sendUserOperation({
      user: userOne,
      fakeBundler: fakeBundler,
      executeDestination: await cspContract.getAddress(),
      executeFunction:
        new CryptoSpacePrison__factory().interface.encodeFunctionData(
          "mintConman"
        ),
      accountFactoryContract: accountFactoryContract,
      entryPointContract: entryPointContract,
      paymasterContract: paymasterContract,
    });

    // Check balance and characters
    expect(await usdTokenContract.balanceOf(sender)).to.be.equal(
      ethers.parseEther("5")
    );
    const cell = await cspContract.getCell(sender);
    expect(cell.pickpocketAmount).to.be.equal(0);
    expect(cell.conmanAmount).to.be.equal(1);
  });
});
