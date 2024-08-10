export const CONTRACTS: {
  [key: string]: {
    entryPoint: `0x${string}` | undefined;
    accountFactory: `0x${string}` | undefined;
    paymaster: `0x${string}` | undefined;
    usdToken: `0x${string}` | undefined;
    cryptoSpacePrison: `0x${string}` | undefined;
    pyth: `0x${string}` | undefined;
    pythPriceFeedId: `0x${string}` | undefined;
    exchanger: `0x${string}` | undefined;
  };
} = {
  optimismSepolia: {
    entryPoint: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    accountFactory: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    paymaster: "0x2168609301437822c7AD3f35114B10941866F20a",
    usdToken: "0xe05B06f086BE56C22A4cc70708f95d28ca9A8320",
    cryptoSpacePrison: "0x63a465e2C7Ca890430f81B7cE8Ad86bc9A4512DD",
    pyth: "0x0708325268dF9F66270F1401206434524814508b",
    pythPriceFeedId:
      "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026",
    exchanger: "0x9a1C3C845BAd2585210913914Bf88242460062E9",
  },
  baseSepolia: {
    entryPoint: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
    accountFactory: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    paymaster: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    usdToken: "0x0000000000000000000000000000000000000000",
    cryptoSpacePrison: "0x0000000000000000000000000000000000000000",
    pyth: "0x0000000000000000000000000000000000000000",
    pythPriceFeedId: "0x0000000000000000000000000000000000000000",
    exchanger: "0x0000000000000000000000000000000000000000",
  },
  conduitRbuNetwork: {
    entryPoint: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
    accountFactory: "0x02008a8DBc938bd7930bf370617065B6B0c1221a",
    paymaster: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    usdToken: "0x0000000000000000000000000000000000000000",
    cryptoSpacePrison: "0x0000000000000000000000000000000000000000",
    pyth: "0x0000000000000000000000000000000000000000",
    pythPriceFeedId: "0x0000000000000000000000000000000000000000",
    exchanger: "0x0000000000000000000000000000000000000000",
  },
  modeSepolia: {
    entryPoint: "0xe05B06f086BE56C22A4cc70708f95d28ca9A8320",
    accountFactory: "0x63a465e2C7Ca890430f81B7cE8Ad86bc9A4512DD",
    paymaster: "0x9a1C3C845BAd2585210913914Bf88242460062E9",
    usdToken: "0x0000000000000000000000000000000000000000",
    cryptoSpacePrison: "0x0000000000000000000000000000000000000000",
    pyth: "0x0000000000000000000000000000000000000000",
    pythPriceFeedId: "0x0000000000000000000000000000000000000000",
    exchanger: "0x0000000000000000000000000000000000000000",
  },
};
