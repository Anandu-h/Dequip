"use client"

import { useGreenfield } from "@/hooks/use-greenfield"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Database, Wallet } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function GreenfieldStatus() {
  const {
    isInitialized,
    isLoading,
    error,
    balance,
    address,
    isConnected,
    listObjects,
    getAccountInfo,
    refreshBalance,
  } = useGreenfield()

  const handleTestConnection = async () => {
    if (!isInitialized) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      const accountInfo = await getAccountInfo()
      const objects = await listObjects()
      
      toast({
        title: "Connection Test Successful",
        description: `Account: ${address}\nObjects in bucket: ${objects.length}`,
      })
    } catch (err) {
      toast({
        title: "Connection Test Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  const handleRefreshBalance = async () => {
    await refreshBalance()
    toast({
      title: "Balance Refreshed",
      description: `Current balance: ${balance} tBNB`,
    })
  }

  if (!isConnected) {
    return (
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Greenfield Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400">Wallet not connected</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#181A20] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Greenfield Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Connection Status:</span>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Initializing...
                </Badge>
              </>
            ) : isInitialized ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-400" />
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                  Failed
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Wallet Address:</span>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-white font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Balance:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#F0B90B] font-medium">
              {parseFloat(balance || "0").toFixed(4)} tBNB
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefreshBalance}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Test Connection Button */}
        <Button
          onClick={handleTestConnection}
          disabled={!isInitialized || isLoading}
          className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017] disabled:opacity-50"
        >
          Test Greenfield Connection
        </Button>
      </CardContent>
    </Card>
  )
} 