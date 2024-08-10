# 🦄 Reach Billion Users

A dev kit to integrate Telegram Open Network into your dApp on Ethereum without headaches in a few clicks and reach a billion Telegram users.

## 🛠️ Technologies

- Optimism, Base, Conduit, and Mode networks are used for smart contracts that handle all operations for account abstraction, paymaster, and token exchange.
- Pyth oracle is used to get price feeds for exchanging user toncoins to usdt.
- Blockscout is used as the main block explorer for the links that the library provides to developers and users.

## 🔗 Artifacts

- Application - [reach-billion-users.vercel.app](https://reach-billion-users.vercel.app/)
- Demo - [reach-billion-users.vercel.app/cryptospaceprison](https://reach-billion-users.vercel.app/cryptospaceprison)
- Contracts (Optimism Sepolia):
  - Entry Point - 0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7
  - Account Factory - 0x1e4712A93beEc0aa26151CF44061eE91DD56f921
  - Paymaster - 0x2168609301437822c7AD3f35114B10941866F20a
  - Exchanger (TONUSDT) - 0x9a1C3C845BAd2585210913914Bf88242460062E9
  - USD Token - 0xe05B06f086BE56C22A4cc70708f95d28ca9A8320
  - Crypto Space Prison - 0x63a465e2C7Ca890430f81B7cE8Ad86bc9A4512DD
- Contracts (Base Sepolia):
  - Entry Point - 0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59
  - Account Factory - 0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7
  - Paymaster - 0x1e4712A93beEc0aa26151CF44061eE91DD56f921
- Contracts (Conduit RBU Network):
  - Entry Point - 0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59
  - Account Factory - 0x02008a8DBc938bd7930bf370617065B6B0c1221a
  - Paymaster - 0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7
- Contracts (Mode Sepolia):
  - Entry Point - 0xe05B06f086BE56C22A4cc70708f95d28ca9A8320
  - Account Factory - 0x63a465e2C7Ca890430f81B7cE8Ad86bc9A4512DD
  - Paymaster - 0x9a1C3C845BAd2585210913914Bf88242460062E9

## 📄 Installation

**Step 1.** Install RBU library and its peer dependencies. **Note:** It's a React library.

```bash
npm install rbu viem axios @tonconnect/ui-react
```

**Step 2.** Wrap your application with `RBUProvider`. **Note:** API key can be obtained in the RBU application.

```tsx
import { RBUProvider } from "rbu";

const App = () => {
  return <RBUProvider apiKey="YOUR_API_KEY">{/* Your App */}</RBUProvider>;
};
```

**Step 3.** Use RBU hooks to connect and disconnect Telegram wallet.

```tsx
const { tonConnect, tonDisconnect } = useRBU();

<Button onClick={() => tonConnect()}>Connect Telegram</Button>;
```

**Step 4.** Use RBU hooks to send Ethereum transactions using Telegram wallet. **Note:** RBU library supports only `optimismSepolia`, `baseSepolia`, `conduitRbuNetwork`, `modeSepolia` networks.

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

![Architecture](/architecture.png)
