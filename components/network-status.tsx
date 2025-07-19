"use client"

import { useAccount, useChainId } from "wagmi"
import { useState, useEffect } from "react"
import { bsc, bscTestnet } from "wagmi/chains"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Wifi } from "lucide-react"

function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function NetworkStatus() {
  const hasMounted = useHasMounted()
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!hasMounted) return null

  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-gray-600 text-gray-400">
        <Wifi className="w-3 h-3 mr-1" />
        Not Connected
      </Badge>
    )
  }

  const isCorrectNetwork = chainId === bsc.id || chainId === bscTestnet.id
  const networkName = chainId === bsc.id ? "BSC Mainnet" : chainId === bscTestnet.id ? "BSC Testnet" : "Unknown Network"

  return (
    <Badge
      className={`${
        isCorrectNetwork
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      {isCorrectNetwork ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
      {networkName}
    </Badge>
  )
}
