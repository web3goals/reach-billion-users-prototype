"use client";

import { getDApps } from "@/lib/dapp";
import { DAppCard } from "./dapp-card";
import EntityList from "./entity-list";

export function DAppList() {
  return (
    <EntityList
      entities={getDApps()}
      renderEntityCard={(dApp, index) => <DAppCard key={index} dApp={dApp} />}
      noEntitiesText={`No dApps 😐`}
    />
  );
}
