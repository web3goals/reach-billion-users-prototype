"use client";

import { cryptoSpacePrisonAbi } from "@/abi/cryptoSpacePrison";
import { usdTokenAbi } from "@/abi/usdToken";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import useError from "@/hooks/useError";
import { RBUProvider, useRBU } from "@/library/components/rbu-provider";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Address, createPublicClient, encodeFunctionData, http } from "viem";
import { optimismSepolia } from "viem/chains";

export default function CryptoSpacePrisonPage() {
  return (
    <RBUProvider apiKey="xyz">
      <main className="container flex flex-col items-center py-10">
        <Cover />
        <Player />
      </main>
    </RBUProvider>
  );
}

function Cover() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center max-w-[360px] mt-8">
        <Image
          src="/images/cryptospaceprison.gif"
          alt="Crypto Space Prison"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full"
        />
      </div>
      <p className="text-sm text-center text-muted-foreground mt-4">
        NFT-game created by the Community for Fun
      </p>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-center max-w-[820px] mt-2 md:mt-0">
        Crypto Space Prison
      </h1>
      <p className="text-center text-muted-foreground mt-4">
        ⚡ Collect prisoners, own prison cells, earn respect tokens
      </p>
      <p className="text-center text-muted-foreground mt-2">
        🤝 Influence the game with the community
      </p>
      <p className="text-center  text-muted-foreground mt-2">
        🎲 Play mini-games and participate in seasons
      </p>
    </div>
  );
}

function Player() {
  const { tonAddress, ethAddress } = useRBU();

  if (tonAddress && ethAddress) {
    return <PlayerConnected />;
  }

  return <PlayerConnect />;
}

function PlayerConnect() {
  const { tonConnect } = useRBU();

  return (
    <div className="flex flex-row gap-4 mt-6">
      <Button onClick={() => tonConnect?.()}>Connect Telegram</Button>
      <Button variant="secondary" disabled>
        Connect Ethererum Wallet
      </Button>
    </div>
  );
}

function PlayerConnected() {
  const { handleError } = useError();
  const { tonAddress, ethAddress, tonDisconnect, ethExecute } = useRBU();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function mintPickpocket() {
    try {
      setIsFormSubmitting(true);
      const network = "optimismSepolia";
      const executeDestination = "0xdfE15Cc65697c04C083982B8a053E2FE4cf54669";
      const executeFunction = encodeFunctionData({
        abi: cryptoSpacePrisonAbi,
        functionName: "mintPickpocket",
      });
      const txHash = await ethExecute?.(
        network,
        executeDestination,
        executeFunction
      );
      toast({
        title: "Pickpocket minted 🤘",
        description: "Refresh the page to see the updates",
        action: (
          <Link
            href={`https://optimism-sepolia.blockscout.com/tx/${txHash}`}
            target="_blank"
          >
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
    <div className="w-full flex flex-row gap-4 border rounded max-w-[480px] px-6 py-8 mt-10">
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
            {/* TODO: Implement */}
            <p className="text-sm break-all">❓</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            {/* TODO: Use blockscout link */}
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Eth Address:
            </p>
            <p className="text-sm break-all">{ethAddress}</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Eth Balance:
            </p>
            {/* TODO: Implement */}
            <p className="text-sm break-all">❓</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Characters:
            </p>
            {/* TODO: Implement */}
            <p className="text-sm break-all">❓</p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4">
          {/* TODO: Implement */}
          <Button
            variant="default"
            onClick={() => mintPickpocket()}
            disabled={isFormSubmitting}
          >
            {isFormSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            👶️ Mint common pickpocket FOR FREE
          </Button>
          {/* TODO: Implement */}
          <Button variant="secondary" onClick={() => {}}>
            🥸 Mint legendary conman FOR 0.01 ETH
          </Button>
          {/* TODO: Implement */}
          <Button variant="outline" onClick={() => {}}>
            🏦 Buy ETH for Toncoin
          </Button>
          <Button variant="outline" onClick={() => tonDisconnect?.()}>
            👋 Disconnect Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}

// TODO: Delete
function DemoFunctions() {
  const {
    tonAddress,
    tonConnect,
    tonDisconnect,
    ethAddress,
    ethExecute,
    getEthAaAddress,
  } = useRBU();

  async function mintUsdt() {
    try {
      const network = "optimismSepolia";
      const executeDestination = "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59";
      const executeFunction = encodeFunctionData({
        abi: usdTokenAbi,
        functionName: "mint",
        args: [BigInt(2)],
      });
      const txHash = await ethExecute?.(
        network,
        executeDestination,
        executeFunction
      );
      console.log({ txHash });
    } catch (error) {
      console.error(error);
    }
  }

  async function getUsdtBalance() {
    try {
      const network = "optimismSepolia";
      const ethAaAddress = await getEthAaAddress?.(network);
      const publicClient = createPublicClient({
        chain: optimismSepolia,
        transport: http(),
      });
      console.log({ ethAaAddress });
      const balance = await publicClient.readContract({
        address: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
        abi: usdTokenAbi,
        functionName: "balanceOf",
        args: [ethAaAddress as Address],
      });
      console.log({ balance });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm">Ton Address: {tonAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => tonConnect?.()}>
        Connect Ton
      </button>
      <button className="bg-gray-800 p-4" onClick={() => tonDisconnect?.()}>
        Disconnect Ton
      </button>
      <div className="w-full h-[2px] bg-gray-800" />
      <p className="text-sm">Eth Address: {ethAddress || "None"}</p>
      <button className="bg-gray-800 p-4" onClick={() => mintUsdt()}>
        Mint USDT
      </button>
      <button className="bg-gray-800 p-4" onClick={() => getUsdtBalance()}>
        Get USDT Balance
      </button>
    </div>
  );
}
