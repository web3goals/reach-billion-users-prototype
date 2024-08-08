"use client";

import { exchangerAbi } from "@/abi/exchanger";
import { cryptoSpacePrisonConfig } from "@/config/csp";
import useError from "@/hooks/useError";
import { useRBU } from "@/library/components/rbu-provider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { encodeFunctionData } from "viem";
import { Button } from "./ui/button";
import { ToastAction } from "./ui/toast";
import { toast } from "./ui/use-toast";

export default function CryptoSpacePrisonPlayerSellTonButton() {
  const { handleError } = useError();
  const { ethExecute } = useRBU();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const tonForSaleAmount = 3;

  async function sellTon() {
    try {
      setIsFormSubmitting(true);
      const { txExplorerLink: sellTxExplorerLink } = await ethExecute(
        cryptoSpacePrisonConfig.network,
        cryptoSpacePrisonConfig.contracts.exchanger,
        encodeFunctionData({
          abi: exchangerAbi,
          functionName: "sell",
          args: [BigInt(tonForSaleAmount * 10 ** 18)],
        })
      );
      toast({
        title: "USDT bought 🤘",
        description: "Refresh the page to see the updates",
        action: (
          <Link href={sellTxExplorerLink} target="_blank">
            <ToastAction altText="Open Blockscout">Blockscout</ToastAction>
          </Link>
        ),
      });
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={() => sellTon()}
      disabled={isFormSubmitting}
    >
      {isFormSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      🏦 Sell {tonForSaleAmount} TON for USDT
    </Button>
  );
}
