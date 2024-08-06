export const CONTRACTS: {
  [key: string]: {
    usdToken: `0x${string}` | undefined;
    entryPoint: `0x${string}` | undefined;
    accountFactory: `0x${string}` | undefined;
    paymaster: `0x${string}` | undefined;
    cryptoSpacePrison: `0x${string}` | undefined;
  };
} = {
  optimismSepolia: {
    usdToken: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
    cryptoSpacePrison: "0xdfE15Cc65697c04C083982B8a053E2FE4cf54669",
  },
};
