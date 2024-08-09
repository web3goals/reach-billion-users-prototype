import { DAppCreateForm } from "@/components/dapp-create-form";
import { Separator } from "@/components/ui/separator";

export default function NewDAppPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">New dApp</h2>
        <p className="text-muted-foreground">
          Where you want to reach a billion Telegram users
        </p>
      </div>
      <Separator className="my-6" />
      <DAppCreateForm />
    </main>
  );
}
