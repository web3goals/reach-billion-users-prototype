import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { createContext, useContext, useEffect, useState } from "react";

type RBAContextType = {
  tonAddress?: string;
  tonConnect?: () => Promise<void>;
  tonDisconnect?: () => Promise<void>;
  ethAddress?: `0x${string}`;
  ethExecute?: (
    executeDestination: `0x${string}`,
    executeFunction: `0x${string}`
  ) => Promise<string>;
};

const RBAContext = createContext<RBAContextType>({});

function RBAProvider({ children }: { children: React.ReactNode }) {
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();
  const [ethAddress, setEthAddress] = useState<`0x${string}` | undefined>();

  // TODO: Implement
  // TODO: Use API?
  async function ethExecute(
    executeDestination: `0x${string}`,
    executeFunction: `0x${string}`
  ): Promise<string> {
    if (!ethAddress) {
      throw new Error("Ethereum address is not defined");
    }
    // Use state eth address
    // Create fake bundler account
    // Create init code
    // Send user operation using fake bunder account
    return "xyz";
  }

  // TODO: Create eth wallet and store it in browser local storage
  useEffect(() => {
    if (tonAddress) {
      setEthAddress("0x0000000000000000000000000000000000000000");
    } else {
      setEthAddress(undefined);
    }
  }, [tonAddress]);

  return (
    <RBAContext.Provider
      value={{
        tonAddress: tonAddress,
        tonConnect: () => tonConnectUI.openModal(),
        tonDisconnect: () => tonConnectUI.disconnect(),
        ethAddress: ethAddress,
        ethExecute: ethExecute,
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
