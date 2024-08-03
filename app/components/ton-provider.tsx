import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { createContext, useContext } from "react";

type TonContextType = {
  tonAddress?: string;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
};

const TonContext = createContext<TonContextType>({});

function TonProvider({ children }: { children: React.ReactNode }) {
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();

  return (
    <TonContext.Provider
      value={{
        tonAddress: tonAddress,
        connect: () => tonConnectUI.openModal(),
        disconnect: () => tonConnectUI.disconnect(),
      }}
    >
      {children}
    </TonContext.Provider>
  );
}

function TonProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL}
    >
      <TonProvider>{children}</TonProvider>
    </TonConnectUIProvider>
  );
}

function useTon() {
  return useContext(TonContext);
}

export { TonProviderWrapper as TonProvider, useTon };
