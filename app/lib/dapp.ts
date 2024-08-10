import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY_DAAPS = "rbu-dapps";

export interface DApp {
  id: string;
  icon: string;
  name: string;
  description: string;
  created: Date;
  apiKey: string;
}

export function getDApps(): DApp[] {
  const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY_DAAPS);
  return localStorageValue ? JSON.parse(localStorageValue) : [];
}

export function saveDApp(icon: string, name: string, description: string) {
  const dApps = getDApps();
  dApps.push({
    id: uuidv4(),
    icon: icon,
    name: name,
    description: description,
    created: new Date(),
    apiKey: uuidv4(),
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_DAAPS, JSON.stringify(dApps));
}

export function deleteDApp(id: string) {
  let dApps = getDApps();
  dApps = dApps.filter((dApp) => dApp.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY_DAAPS, JSON.stringify(dApps));
}
