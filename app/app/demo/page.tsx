"use client";

import { RBAProvider, useRBA } from "@/components/rba-provider";

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
    const executeDestination = "0x0"; // USDT contract
    const executeFunction = "0x0"; // Encoded function data
    const txHash = await ethExecute?.(executeDestination, executeFunction);
    console.log({ txHash });
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
      <div className="w-full h-[2px] bg-gray-800 my-4" />
      <p className="text-sm">Eth Address: {ethAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => mintUsdt()}>
        Mint USDT
      </button>
    </div>
  );
}
