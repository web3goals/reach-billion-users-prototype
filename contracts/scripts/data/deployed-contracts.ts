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
    usdToken: "0x1b21550F42E993d1b692d18D79bCd783638633F2",
    cryptoSpacePrison: "0x4F316c6536Ce3ee94De802a9EfDb20484Ec4BDF9",
    pyth: "0x0708325268dF9F66270F1401206434524814508b",
    pythPriceFeedId:
      "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026",
    exchanger: "0x418d621b98Cc75a09327725620F9ec949615396E",
  },
};
