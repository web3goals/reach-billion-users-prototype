import { usdTokenAbi } from "@/abi/usdToken";
import { cryptoSpacePrisonConfig } from "@/config/csp";
import useError from "@/hooks/useError";
import { cn } from "@/lib/utils";
import { useRBU } from "@/library/components/rbu-provider";
import { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { Skeleton } from "./ui/skeleton";

export default function CryptoSpacePrisonPlayerEthBalance(props: {
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const { ethAddress, getEthSenderAddress } = useRBU();
  const [usdtBalance, setUsdtBalance] = useState<bigint | undefined>();

  async function loadBalance() {
    try {
      const ethAaAddress = await getEthSenderAddress(
        cryptoSpacePrisonConfig.network
      );
      const publicClient = createPublicClient({
        chain: cryptoSpacePrisonConfig.chain,
        transport: http(),
      });
      const usdtBalance = await publicClient.readContract({
        address: cryptoSpacePrisonConfig.contracts.usdToken,
        abi: usdTokenAbi,
        functionName: "balanceOf",
        args: [ethAaAddress],
      });
      setUsdtBalance(usdtBalance);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress]);

  if (usdtBalance) {
    return (
      <div className={cn(props.className)}>
        <p className="text-sm">{formatEther(usdtBalance)} USDT</p>
      </div>
    );
  }

  return <Skeleton className="w-full h-6" />;
}
