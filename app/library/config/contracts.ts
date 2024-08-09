import { Address, Chain } from "viem";
import { baseSepolia, optimismSepolia } from "viem/chains";

export type Contracts = {
  chain: Chain;
  entryPoint: Address;
  accountFactory: Address;
  paymaster: Address;
  explorer: string;
};

export const contractsConfig: { [key: string]: Contracts } = {
  optimismSepolia: {
    chain: optimismSepolia,
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
    explorer: "https://optimism-sepolia.blockscout.com/",
  },
  baseSepolia: {
    chain: baseSepolia,
    entryPoint: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
    accountFactory: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    paymaster: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    explorer: "https://base-sepolia.blockscout.com/",
  },
};
