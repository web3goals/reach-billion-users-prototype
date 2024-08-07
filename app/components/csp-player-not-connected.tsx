"use client";

import { useRBU } from "@/library/components/rbu-provider";
import { Button } from "./ui/button";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export default function CryptoSpacePrisonPlayerNotConnected(props: {
  className?: ClassValue;
}) {
  const { tonConnect } = useRBU();

  return (
    <div className={cn("flex flex-row gap-4", props.className)}>
      <Button onClick={() => tonConnect?.()}>Connect Telegram</Button>
      <Button variant="secondary" disabled>
        Connect Ethererum Wallet
      </Button>
    </div>
  );
}
