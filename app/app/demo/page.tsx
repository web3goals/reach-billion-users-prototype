"use client";

import { RBAProvider, useRBA } from "@/components/rba-provider";

export default function DemoPage() {
  return (
    <RBAProvider>
      <main className="container py-10 lg:px-80">
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
  const { tonAddress, connectTon, disconnectTon } = useRBA();

  return (
    <div className="flex flex-col items-start gap-4">
      <p>Ton Address: {tonAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => connectTon?.()}>
        Connect Ton
      </button>
      <button className="bg-gray-800 p-4" onClick={() => disconnectTon?.()}>
        Disconnect Ton
      </button>
    </div>
  );
}
