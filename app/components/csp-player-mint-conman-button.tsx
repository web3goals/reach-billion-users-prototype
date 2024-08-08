"use client";

import { cryptoSpacePrisonAbi } from "@/abi/cryptoSpacePrison";
import { usdTokenAbi } from "@/abi/usdToken";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cryptoSpacePrisonConfig } from "@/config/csp";
import useError from "@/hooks/useError";
import { useRBU } from "@/library/components/rbu-provider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  Hash,
  http,
  maxUint256,
} from "viem";
import { Skeleton } from "./ui/skeleton";

export default function CryptoSpacePrisonPlayerMintConmanButton() {
  const { handleError } = useError();
  const { ethExecute } = useRBU();
  const [cost, setCost] = useState<bigint | undefined>();
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function loadCost() {
    try {
      const publicClient = createPublicClient({
        chain: cryptoSpacePrisonConfig.chain,
        transport: http(),
      });
      const costs = await publicClient.readContract({
        address: cryptoSpacePrisonConfig.contracts.cryptoSpacePrison,
        abi: cryptoSpacePrisonAbi,
        functionName: "getCosts",
      });
      const tokenSymbol = await publicClient.readContract({
        address: cryptoSpacePrisonConfig.contracts.usdToken,
        abi: usdTokenAbi,
        functionName: "symbol",
      });
      setCost(costs[1]);
      setTokenSymbol(tokenSymbol);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function mintConman() {
    try {
      setIsFormSubmitting(true);

      // Init public client
      const publicClient = createPublicClient({
        chain: cryptoSpacePrisonConfig.chain,
        transport: http(),
      });

      // Allow tokens transfer
      const { txHash: approveTxHash } = await ethExecute(
        cryptoSpacePrisonConfig.network,
        cryptoSpacePrisonConfig.contracts.usdToken,
        encodeFunctionData({
          abi: usdTokenAbi,
          functionName: "approve",
          args: [
            cryptoSpacePrisonConfig.contracts.cryptoSpacePrison,
            maxUint256,
          ],
        })
      );

      // Wait fot transaction completion
      await publicClient.waitForTransactionReceipt({
        hash: approveTxHash as Hash,
      });

      // Mint
      const { txExplorerLink: mintTxExplorerLink } = await ethExecute(
        cryptoSpacePrisonConfig.network,
        cryptoSpacePrisonConfig.contracts.cryptoSpacePrison,
        encodeFunctionData({
          abi: cryptoSpacePrisonAbi,
          functionName: "mintConman",
        })
      );

      toast({
        title: "Conman minted 🤘",
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

  if (cost && tokenSymbol) {
    return (
      <Button
        variant="secondary"
        onClick={() => mintConman()}
        disabled={isFormSubmitting}
      >
        {isFormSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        🥸 Mint legendary conman FOR {formatEther(cost)} {tokenSymbol}
      </Button>
    );
  }

  return <Skeleton className="h-10" />;
}
