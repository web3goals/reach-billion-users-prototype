"use client";

import { cryptoSpacePrisonAbi } from "@/abi/cryptoSpacePrison";
import { cryptoSpacePrisonConfig } from "@/config/csp";
import useError from "@/hooks/useError";
import { cn } from "@/lib/utils";
import { useRBU } from "@/library/components/rbu-provider";
import { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { Address, createPublicClient, http } from "viem";
import { Skeleton } from "./ui/skeleton";

export default function CryptoSpacePrisonPlayerCharacters(props: {
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const { ethAddress, getEthSenderAddress } = useRBU();
  const [characters, setCharacters] = useState<
    { pickpocketAmount: string; conmanAmount: string } | undefined
  >();

  async function loadCharacters() {
    try {
      const ethAaAddress = await getEthSenderAddress(
        cryptoSpacePrisonConfig.network
      );
      const publicClient = createPublicClient({
        chain: cryptoSpacePrisonConfig.chain,
        transport: http(),
      });
      const cell = await publicClient.readContract({
        address: cryptoSpacePrisonConfig.contracts.cryptoSpacePrison,
        abi: cryptoSpacePrisonAbi,
        functionName: "getCell",
        args: [ethAaAddress as Address],
      });
      setCharacters({
        pickpocketAmount: cell.pickpocketAmount.toString(),
        conmanAmount: cell.conmanAmount.toString(),
      });
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadCharacters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress]);

  if (characters) {
    return (
      <div className={cn(props.className)}>
        <p className="text-sm">
          👶 Common pickpocket – {characters.pickpocketAmount}
        </p>
        <p className="text-sm">
          🥸 Legendary conman – {characters.conmanAmount}
        </p>
      </div>
    );
  }

  return <Skeleton className="w-full h-6" />;
}
