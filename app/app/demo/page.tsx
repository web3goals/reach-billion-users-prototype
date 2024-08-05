"use client";

import { RBAProvider, useRBA } from "@/components/rba-provider";
import { usdTokenAbi } from "@/contracts/abi/usdToken";
import { encodeFunctionData } from "viem";

export default function DemoPage() {
  return (
    <RBAProvider>
      <main className="container py-10 lg:px-64">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter">
          DEMO
        </h1>
        <div className="mt-4">
          <DemoFunctions />
        </div>
      </main>
    </RBAProvider>
  );
}

function DemoFunctions() {
  const { tonAddress, tonConnect, tonDisconnect, ethAddress, ethExecute } =
    useRBA();

  async function mintUsdt() {
    try {
      const network = "optimismSepolia";
      const executeDestination = "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59";
      const executeFunction = encodeFunctionData({
        abi: usdTokenAbi,
        functionName: "mint",
        args: [BigInt(2)],
      });
      const txHash = await ethExecute?.(
        network,
        executeDestination,
        executeFunction
      );
      console.log({ txHash });
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Implement
  async function getUsdtBalance() {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm">Ton Address: {tonAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => tonConnect?.()}>
        Connect Ton
      </button>
      <button className="bg-gray-800 p-4" onClick={() => tonDisconnect?.()}>
        Disconnect Ton
      </button>
      <div className="w-full h-[2px] bg-gray-800" />
      <p className="text-sm">Eth Address: {ethAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => mintUsdt()}>
        Mint USDT
      </button>
      <button className="bg-gray-800 p-4" onClick={() => mintUsdt()}>
        Get USDT Balance
      </button>
    </div>
  );
}
