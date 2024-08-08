"use client";

import { cryptoSpacePrisonAbi } from "@/abi/cryptoSpacePrison";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cryptoSpacePrisonConfig } from "@/config/csp";
import useError from "@/hooks/useError";
import { useRBU } from "@/library/components/rbu-provider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { encodeFunctionData } from "viem";

export default function CryptoSpacePrisonPlayerMintPickpocketButton() {
  const { handleError } = useError();
  const { ethExecute } = useRBU();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function mintPickpocket() {
    try {
      setIsFormSubmitting(true);
      const { txExplorerLink: mintTxExplorerLink } = await ethExecute?.(
        cryptoSpacePrisonConfig.network,
        cryptoSpacePrisonConfig.contracts.cryptoSpacePrison,
        encodeFunctionData({
          abi: cryptoSpacePrisonAbi,
          functionName: "mintPickpocket",
        })
      );
      // TODO: Use explorer link from ethExecute function
      toast({
        title: "Pickpocket minted 🤘",
        description: "Refresh the page to see the updates",
        action: (
          <Link href={mintTxExplorerLink} target="_blank">
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
      variant="default"
      onClick={() => mintPickpocket()}
      disabled={isFormSubmitting}
    >
      {isFormSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      👶️ Mint common pickpocket FOR FREE
    </Button>
  );
}
