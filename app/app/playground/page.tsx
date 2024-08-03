"use client";

import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useEffect } from "react";

export default function PlaygroundPage() {
  return (
    <main className="container flex flex-col gap-10 py-10 lg:px-80">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mt-4">
        PLAYGROUND
      </h1>
      <div className="mt-4">
        <TonConnectUIProvider manifestUrl="https://reach-billion-audience.vercel.app/tonconnect-manifest.json">
          <TonApp />
        </TonConnectUIProvider>
      </div>
    </main>
  );
}

function TonApp() {
  const tonAddress = useTonAddress();
  const [TonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (tonAddress) {
      console.log("Connected:", tonAddress);
    }
  }, [tonAddress]);

  return (
    <div className="flex flex-col items-start gap-4">
      <p>Ton Address: {tonAddress || "None"}</p>
      <button
        className="bg-gray-800 p-4"
        onClick={() => TonConnectUI.openModal()}
      >
        Connect
      </button>
      <button
        className="bg-gray-800 p-4"
        onClick={() => TonConnectUI.disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
