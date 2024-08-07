export const CONTRACTS: {
  [key: string]: {
    entryPoint: `0x${string}` | undefined;
    accountFactory: `0x${string}` | undefined;
    paymaster: `0x${string}` | undefined;
    usdToken: `0x${string}` | undefined;
    cryptoSpacePrison: `0x${string}` | undefined;
  };
} = {
  optimismSepolia: {
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
    usdToken: "0x17DC361D05E1A608194F508fFC4102717666779f",
    cryptoSpacePrison: "0x9cAAb0Bf70BD0e71307BfaBeb1E8eC092c81e493",
  },
};
