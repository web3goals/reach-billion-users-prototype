import { DApp, deleteDApp } from "@/lib/dapp";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export function DAppCard(props: { dApp: DApp; onDelete: () => void }) {
  return (
    <div className="w-full flex flex-row gap-4 border rounded px-6 py-8">
      <div>
        {/* Avatar */}
        <Avatar className="size-16">
          <AvatarImage src="" alt="Icon" />
          <AvatarFallback className="text-2xl bg-secondary">
            {props.dApp.icon}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        {/* Name */}
        <p className="text-xl font-bold">{props.dApp.name}</p>
        {/* Params */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Description:
            </p>
            <p className="text-sm break-all">{props.dApp.description}</p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              Created:
            </p>
            <p className="text-sm break-all">
              {props.dApp.created.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3">
            <p className="min-w-[80px] text-sm text-muted-foreground">
              API Key:
            </p>
            <p className="text-sm break-all">{props.dApp.apiKey}</p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-start gap-3 mt-8">
          <Button
            variant="secondary"
            onClick={() => toast({ title: "Not implemented yet 🥲" })}
          >
            💰 Paymaster Manager
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast({ title: "Not implemented yet 🥲" })}
          >
            👥 Users & Stats
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              deleteDApp(props.dApp.id);
              toast({ title: "Deleted 👌" });
              props.onDelete();
            }}
          >
            ❌ Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
