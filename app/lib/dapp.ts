const LOCAL_STORAGE_KEY_DAAPS = "rbu-dapps";

export interface DApp {
  icon: string;
  name: string;
  description: string;
  created: Date;
  apiKey?: string;
}

export function getDApps(): DApp[] {
  const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY_DAAPS);
  return localStorageValue ? JSON.parse(localStorageValue) : [];
}

// TODO: Generate random api key
export function saveDApp(dApp: DApp) {
  const dApps = getDApps();
  dApps.push({ ...dApp, apiKey: "xyz" });
  localStorage.setItem(LOCAL_STORAGE_KEY_DAAPS, JSON.stringify(dApps));
}

// TODO: Implement
export function deleteDApp() {}
