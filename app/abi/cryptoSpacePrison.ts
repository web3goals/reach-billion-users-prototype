export const cryptoSpacePrisonAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pickpocketCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "conmanCost",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "_owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getCell",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pickpocketAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "conmanAmount",
            type: "uint256",
          },
        ],
        internalType: "struct CryptoSpacePrison.Cell",
        name: "cell",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCosts",
    outputs: [
      {
        internalType: "uint256",
        name: "pickpocketCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "conmanCost",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintConman",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPickpocket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
