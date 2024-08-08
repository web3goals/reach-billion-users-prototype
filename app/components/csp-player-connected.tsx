"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRBU } from "@/library/components/rbu-provider";
import { ClassValue } from "clsx";
import CryptoSpacePrisonPlayerCharacters from "./csp-player-characters";
import CryptoSpacePrisonPlayerEthBalance from "./csp-player-eth-balance";
import CryptoSpacePrisonPlayerMintConmanButton from "./csp-player-mint-conman-button";
import CryptoSpacePrisonPlayerMintPickpocketButton from "./csp-player-mint-pickpocket-button";
import CryptoSpacePrisonPlayerTonBalance from "./csp-player-ton-balance";

export default function CryptoSpacePrisonPlayerConnected(props: {
  className?: ClassValue;
}) {
  const { tonAddress, ethAddress, tonDisconnect } = useRBU();

  return (
    <div
      className={cn(
        "w-full flex flex-row gap-4 border rounded max-w-[480px] px-6 py-8",
        props.className
      )}
    >
      <div>
        {/* Avatar */}
        <Avatar className="size-16">
          <AvatarImage src="" alt="Icon" />
          <AvatarFallback className="text-2xl bg-primary">👤</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        {/* Label */}
        <p className="text-xl font-bold">Player</p>
        {/* Params */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Ton Address:
            </p>
            <p className="text-sm break-all">{tonAddress}</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Ton Balance:
            </p>
            <CryptoSpacePrisonPlayerTonBalance />
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Eth Address:
            </p>
            <p className="text-sm break-all">{ethAddress}</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Eth Balance:
            </p>
            <CryptoSpacePrisonPlayerEthBalance />
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Characters:
            </p>
            <CryptoSpacePrisonPlayerCharacters />
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 mt-8">
          <CryptoSpacePrisonPlayerMintPickpocketButton />
          <CryptoSpacePrisonPlayerMintConmanButton />
          {/* TODO: Implement */}
          <Button variant="outline" onClick={() => {}}>
            🏦 Buy ETH for Toncoin
          </Button>
          <Button variant="outline" onClick={() => tonDisconnect()}>
            👋 Disconnect Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}
