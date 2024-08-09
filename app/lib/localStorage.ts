const LOCAL_STORAGE_KEY_DAAPS = "rbu-dapps";

export interface DApp {
  icon: string;
  name: string;
  description: string;
  created: Date;
}

export function getDApps(): DApp[] {
  const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY_DAAPS);
  return localStorageValue ? JSON.parse(localStorageValue) : [];
}

export function saveDApp(dApp: DApp) {
  const dApps = getDApps();
  dApps.push(dApp);
  localStorage.setItem(LOCAL_STORAGE_KEY_DAAPS, JSON.stringify(dApps));
}

// TODO: Implement
export function deleteDApp() {}
