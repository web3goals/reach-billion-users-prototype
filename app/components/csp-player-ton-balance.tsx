import useError from "@/hooks/useError";
import { cn } from "@/lib/utils";
import { useRBU } from "@/library/components/rbu-provider";
import { ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { Skeleton } from "./ui/skeleton";

export default function CryptoSpacePrisonPlayerTonBalance(props: {
  className?: ClassValue;
}) {
  const { handleError } = useError();
  const { tonAddress, getTonBalance } = useRBU();
  const [tonBalance, setTonBalance] = useState<bigint | undefined>();

  async function loadBalance() {
    try {
      const tonBalance = await getTonBalance();
      setTonBalance(tonBalance);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonAddress]);

  if (tonBalance) {
    return (
      <div className={cn(props.className)}>
        <p className="text-sm">{formatEther(tonBalance, "gwei")} TON</p>
      </div>
    );
  }

  return <Skeleton className="w-full h-6" />;
}
