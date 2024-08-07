import CryptoSpacePrisonCover from "@/components/csp-cover";
import CryptoSpacePrisonPlayer from "@/components/csp-player";

export default function CryptoSpacePrisonPage() {
  return (
    <main className="container flex flex-col items-center py-10">
      <CryptoSpacePrisonCover />
      <CryptoSpacePrisonPlayer />
    </main>
  );
}
