# 🦄 Reach Billion Users

A dev kit to integrate Telegram Open Network into your dApp on Ethereum without headaches in a few clicks to support a billion Telegram users.

## 🛠️ Technologies

...

## 🔗 Artifacts

...

## 📄 Installation

Step 1. Install RBU library and its peer dependencies. **Note:** It's a React library.

```bash
npm install rbu viem axios @tonconnect/ui-react
```

Step 2. Wrap your application with `RBUProvider`. **Note:** API key can be obtained in the RBU application.

```tsx
import { RBUProvider } from "rbu";

const App = () => {
  return <RBUProvider apiKey="YOUR_API_KEY">{/* Your App */}</RBUProvider>;
};
```

Step 3. Use RBU hooks to connect and disconnect Telegram wallet.

```tsx
const { tonConnect, tonDisconnect } = useRBU();

<Button onClick={() => tonConnect()}>Connect Telegram</Button>;
```

Step 4. Use RBU hooks to send Ethereum transactions using Telegram wallet. **Note:** RBU library supports only `optimismSepolia`, `baseSepolia`, `conduitRbuNetwork`, `modeSepolia` networks.

```tsx
const { ethExecute } = useRBU();

const { txHash, txExplorerLink } = await ethExecute(
  "optimismSepolia",
  usdTokenAddress,
  encodeFunctionData({
    abi: usdTokenAbi,
    functionName: "approve",
    args: [destinationAddress, maxUint256],
  })
);
```

## 🏗️ Architecture

...
