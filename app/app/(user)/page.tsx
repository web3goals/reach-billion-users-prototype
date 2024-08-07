import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="container flex flex-col items-center py-10 xl:px-80">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-center max-w-[820px]">
        Attract a billion Telegram users to your dApp on Ethereum
      </h1>
      <h2 className="text-2xl font-normal tracking-tight text-center text-muted-foreground max-w-[820px] mt-4">
        A dev kit to integrate Telegram Open Network into your dApp without
        headaches in a few clicks
      </h2>
      <Link href="/dashboard">
        <Button className="mt-6">🪄 Open Dashboard</Button>
      </Link>
      <div className="flex flex-col items-center max-w-[640px] mt-8">
        <Image
          src="/images/integration.png"
          alt="Integration"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full"
        />
      </div>
    </main>
  );
}
