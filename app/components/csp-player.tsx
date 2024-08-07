"use client";

import { useRBU } from "@/library/components/rbu-provider";
import CryptoSpacePrisonPlayerConnected from "./csp-player-connected";
import CryptoSpacePrisonPlayerNotConnected from "./csp-player-not-connected";

export default function CryptoSpacePrisonPlayer() {
  const { tonAddress, ethAddress } = useRBU();

  if (tonAddress && ethAddress) {
    return <CryptoSpacePrisonPlayerConnected className="mt-10" />;
  }

  return <CryptoSpacePrisonPlayerNotConnected className="mt-6" />;
}
