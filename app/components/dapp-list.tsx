"use client";

import { getDApps } from "@/lib/dapp";
import { useState } from "react";
import { DAppCard } from "./dapp-card";
import EntityList from "./entity-list";

export function DAppList() {
  const [dApps, setDApps] = useState(getDApps());

  return (
    <EntityList
      entities={dApps}
      renderEntityCard={(dApp, index) => (
        <DAppCard key={index} dApp={dApp} onDelete={() => setDApps(getDApps)} />
      )}
      noEntitiesText={`No dApps 😐`}
    />
  );
}
