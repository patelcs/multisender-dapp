/**
 * SandWitch contract ABI — derived from the Solidity ISandWitch interface.
 */
export const MULTISENDER_ABI = [
  {
    name: "sendNativeTokens",
    type: "function",
    stateMutability: "payable",
    inputs: [
      {
        name: "receivers",
        type: "tuple[]",
        components: [
          { name: "receiver", type: "address" },
          { name: "amount", type: "uint256" },
        ],
      },
    ],
    outputs: [],
  },
  {
    name: "sendERC20Tokens",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      {
        name: "receivers",
        type: "tuple[]",
        components: [
          { name: "receiver", type: "address" },
          { name: "amount", type: "uint256" },
        ],
      },
    ],
    outputs: [],
  },
  {
    name: "send",
    type: "function",
    stateMutability: "payable",
    inputs: [
      {
        name: "multiSends",
        type: "tuple[]",
        components: [
          { name: "tokenType", type: "uint8" },
          { name: "token", type: "address" },
          {
            name: "receivers",
            type: "tuple[]",
            components: [
              { name: "receiver", type: "address" },
              { name: "amount", type: "uint256" },
            ],
          },
        ],
      },
    ],
    outputs: [],
  },
] as const;

/**
 * Minimal ERC20 ABI — only the functions we need for approval & info.
 */
export const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;
