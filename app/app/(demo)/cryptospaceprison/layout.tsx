import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { RBUProvider } from "@/library/components/rbu-provider";
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
  const rbaApiKey = "e93be60b-7a8d-445f-b8e9-860567c43ad6";

  return (
    <RBUProvider apiKey={rbaApiKey}>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          {children}
          <SiteFooter />
          <Toaster />
        </div>
      </div>
    </RBUProvider>
  );
}
