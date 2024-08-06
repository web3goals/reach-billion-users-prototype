"use client";

import { RBUProvider, useRBU } from "@/library/components/rbu-provider";
import { usdTokenAbi } from "@/abi/usdToken";
import { Address, createPublicClient, encodeFunctionData, http } from "viem";
import { optimismSepolia } from "viem/chains";

export default function DemoPage() {
  return (
    <RBUProvider apiKey="xyz">
      <main className="container py-10 lg:px-64">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter">
          DEMO
        </h1>
        <div className="mt-4">
          <DemoFunctions />
        </div>
      </main>
    </RBUProvider>
  );
}

function DemoFunctions() {
  const {
    tonAddress,
    tonConnect,
    tonDisconnect,
    ethAddress,
    ethExecute,
    getEthAaAddress,
  } = useRBU();

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

  async function getUsdtBalance() {
    try {
      const network = "optimismSepolia";
      const ethAaAddress = await getEthAaAddress?.(network);
      const publicClient = createPublicClient({
        chain: optimismSepolia,
        transport: http(),
      });
      console.log({ ethAaAddress });
      const balance = await publicClient.readContract({
        address: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
        abi: usdTokenAbi,
        functionName: "balanceOf",
        args: [ethAaAddress as Address],
      });
      console.log({ balance });
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
      <button className="bg-gray-800 p-4" onClick={() => getUsdtBalance()}>
        Get USDT Balance
      </button>
    </div>
  );
}
