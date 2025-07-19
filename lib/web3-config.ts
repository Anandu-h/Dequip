import { http, createConfig } from "wagmi"
import { bscTestnet, mainnet } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// BNB Chain Testnet configuration
export const bscTestnetConfig = {
  ...bscTestnet,
  name: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"],
    },
    public: {
      http: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "BscScan Testnet",
      url: "https://testnet.bscscan.com",
    },
  },
  testnet: true,
}

// Wallet configuration
export const config = createConfig({
  chains: [bscTestnetConfig, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
      metadata: {
        name: "ToolChain",
        description: "Decentralized Tool Rental Platform",
        url: "https://toolchain.app",
        icons: ["https://toolchain.app/icon.png"],
      },
    }),
  ],
  transports: {
    [bscTestnetConfig.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
})

// Contract addresses on BSC Testnet
export const CONTRACT_ADDRESSES = {
  TOOL_CHAIN: "0x1234567890123456789012345678901234567890", // Replace with actual deployed address
  TOOL_CHAIN_TOKEN: "0x0987654321098765432109876543210987654321", // Replace with actual deployed address
}

// Supported wallets with download links
export const SUPPORTED_WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    downloadUrl: "https://metamask.io/download/",
    mobileDeepLink: "https://metamask.app.link/",
    description: "Most popular Ethereum wallet",
  },
  {
    id: "binance",
    name: "Binance Wallet",
    icon: "🟡",
    downloadUrl: "https://www.binance.org/en/wallet",
    mobileDeepLink: "bnc://app.binance.com/",
    description: "Official Binance Chain wallet",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    downloadUrl: "https://trustwallet.com/",
    mobileDeepLink: "trust://",
    description: "Multi-chain mobile wallet",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    downloadUrl: "https://wallet.coinbase.com/",
    mobileDeepLink: "cbwallet://",
    description: "Self-custody wallet by Coinbase",
  },
]

// Utility functions
export const isMobile = () => {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

export const detectInstalledWallets = () => {
  if (typeof window === "undefined") return []

  const installed = []

  // Check for MetaMask
  if (window.ethereum?.isMetaMask) {
    installed.push("metamask")
  }

  // Check for Binance Wallet
  if ((window as any).BinanceChain) {
    installed.push("binance")
  }

  // Check for Trust Wallet
  if (window.ethereum?.isTrust) {
    installed.push("trust")
  }

  // Check for Coinbase Wallet
  if (window.ethereum?.isCoinbaseWallet) {
    installed.push("coinbase")
  }

  return installed
}
