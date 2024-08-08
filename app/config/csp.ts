import { optimismSepolia } from "viem/chains";

export const cryptoSpacePrisonConfig = {
  network: "optimismSepolia",
  chain: optimismSepolia,
  contracts: {
    usdToken: "0x1b21550F42E993d1b692d18D79bCd783638633F2" as `0x${string}`,
    exchanger: "0x418d621b98Cc75a09327725620F9ec949615396E" as `0x${string}`,
    cryptoSpacePrison:
      "0x4F316c6536Ce3ee94De802a9EfDb20484Ec4BDF9" as `0x${string}`,
  },
};
