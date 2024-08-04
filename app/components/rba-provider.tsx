import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { createContext, useContext } from "react";

type RBAContextType = {
  tonAddress?: string;
  connectTon?: () => Promise<void>;
  disconnectTon?: () => Promise<void>;
};

const RBAContext = createContext<RBAContextType>({});

function RBAProvider({ children }: { children: React.ReactNode }) {
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();

  return (
    <RBAContext.Provider
      value={{
        tonAddress: tonAddress,
        connectTon: () => tonConnectUI.openModal(),
        disconnectTon: () => tonConnectUI.disconnect(),
      }}
    >
      {children}
    </RBAContext.Provider>
  );
}

function RBAProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL}
    >
      <RBAProvider>{children}</RBAProvider>
    </TonConnectUIProvider>
  );
}

function useRBA() {
  return useContext(RBAContext);
}

export { RBAProviderWrapper as RBAProvider, useRBA };
