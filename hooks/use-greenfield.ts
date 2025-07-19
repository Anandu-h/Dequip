import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { greenfieldClient } from "@/lib/greenfield-storage"

export function useGreenfield() {
  const { address, isConnected } = useAccount()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")

  // Initialize Greenfield client when wallet connects
  useEffect(() => {
    const initializeGreenfield = async () => {
      if (!isConnected || !address) {
        setIsInitialized(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Initialize Greenfield client with connected wallet
        const success = await greenfieldClient.initialize(address)
        
        if (success) {
          setIsInitialized(true)
          
          // Get account balance
          const accountBalance = await greenfieldClient.getBalance()
          setBalance(accountBalance)
        } else {
          setError("Failed to initialize Greenfield client")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Initialization failed")
      } finally {
        setIsLoading(false)
      }
    }

    initializeGreenfield()
  }, [isConnected, address])

  // Upload file to Greenfield
  const uploadFile = async (file: File, objectName?: string) => {
    if (!isInitialized) {
      throw new Error("Greenfield client not initialized. Please connect your wallet first.")
    }

    return await greenfieldClient.uploadFile(file, objectName)
  }

  // Download file from Greenfield
  const downloadFile = async (hash: string) => {
    if (!isInitialized) {
      throw new Error("Greenfield client not initialized. Please connect your wallet first.")
    }

    return await greenfieldClient.downloadFile(hash)
  }

  // List objects in bucket
  const listObjects = async (bucketName?: string) => {
    if (!isInitialized) {
      throw new Error("Greenfield client not initialized. Please connect your wallet first.")
    }

    return await greenfieldClient.listObjects(bucketName)
  }

  // Create bucket
  const createBucket = async (bucketName: string) => {
    if (!isInitialized) {
      throw new Error("Greenfield client not initialized. Please connect your wallet first.")
    }

    return await greenfieldClient.createBucket(bucketName)
  }

  // Get account info
  const getAccountInfo = async () => {
    if (!isInitialized) {
      throw new Error("Greenfield client not initialized. Please connect your wallet first.")
    }

    return await greenfieldClient.getAccountInfo()
  }

  // Refresh balance
  const refreshBalance = async () => {
    if (!isInitialized) {
      return
    }

    try {
      const accountBalance = await greenfieldClient.getBalance()
      setBalance(accountBalance)
    } catch (err) {
      console.error("Failed to refresh balance:", err)
    }
  }

  return {
    // State
    isInitialized,
    isLoading,
    error,
    balance,
    
    // Actions
    uploadFile,
    downloadFile,
    listObjects,
    createBucket,
    getAccountInfo,
    refreshBalance,
    
    // Wallet info
    address,
    isConnected,
  }
} 