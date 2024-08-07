import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Space Prison",
  description:
    "Crypto Space Prison is a NFT-game created by the Community for Fun",
  icons: {
    icon: "/favicon-cryptospaceprison.ico",
  },
};

export default function CryptoSpacePrisonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
