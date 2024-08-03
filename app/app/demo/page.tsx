"use client";

import { TonProvider, useTon } from "@/components/ton-provider";

export default function DemoPage() {
  return (
    <TonProvider>
      <main className="container flex flex-col gap-10 py-10 lg:px-80">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mt-4">
          DEMO
        </h1>
        <div className="mt-4">
          <DemoFunctions />
        </div>
      </main>
    </TonProvider>
  );
}

function DemoFunctions() {
  const { tonAddress, connect, disconnect } = useTon();

  return (
    <div className="flex flex-col items-start gap-4">
      <p>Ton Address: {tonAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => connect?.()}>
        Connect
      </button>
      <button className="bg-gray-800 p-4" onClick={() => disconnect?.()}>
        Disconnect
      </button>
    </div>
  );
}
