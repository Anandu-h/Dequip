export const TOOLCHAIN_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" // Mock address
export const TOOLCHAIN_TOKEN_ADDRESS = "0x0987654321098765432109876543210987654321" // Mock token address

export const TOOLCHAIN_ABI = [
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_description", type: "string" },
      { name: "_pricePerDay", type: "uint256" },
      { name: "_category", type: "string" },
      { name: "_imageUrl", type: "string" },
    ],
    name: "listTool",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_toolId", type: "uint256" },
      { name: "_days", type: "uint256" },
    ],
    name: "rentTool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "_toolId", type: "uint256" }],
    name: "returnTool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_owner", type: "address" }],
    name: "getUserTools",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getUserRentals",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getUserEarnings",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getUserReputation",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export interface Tool {
  id: number
  name: string
  description: string
  pricePerDay: string
  category: string
  imageUrl: string
  owner: string
  isAvailable: boolean
  location: string
  rating: number
}

export interface Rental {
  id: number
  toolId: number
  toolName: string
  renter: string
  owner: string
  startDate: string
  endDate: string
  totalPrice: string
  status: "active" | "completed" | "pending"
}
