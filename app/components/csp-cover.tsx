"use client";

import Image from "next/image";

export default function CryptoSpacePrisonCover() {
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
