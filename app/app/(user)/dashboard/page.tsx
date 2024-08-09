import { DAppList } from "@/components/dapp-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          dApps where you want to reach a billion Telegram users
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col items-start gap-6">
        <div className="flex flex-row gap-2">
          <Link href="/dapps/new">
            <Button variant="default">➕ Create dApp</Button>
          </Link>
          <Link href={siteConfig.links.docs} target="_blank">
            <Button variant="secondary">📄 Open Docs</Button>
          </Link>
        </div>
        <DAppList />
      </div>
    </main>
  );
}
