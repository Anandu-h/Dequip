# BNB Greenfield Integration

This project integrates BNB Greenfield decentralized storage with wallet authentication for secure, decentralized file storage.

## Overview

The integration allows users to:
- Connect their Web3 wallet (MetaMask, Binance Wallet, etc.)
- Automatically initialize Greenfield client with their wallet address
- Upload files to Greenfield storage
- Download files from Greenfield storage
- View account balance and storage information
- Test Greenfield connection status

## Architecture

### Components

1. **GreenfieldClient** (`lib/greenfield-storage.ts`)
   - Handles all Greenfield SDK interactions
   - Manages client initialization with wallet authentication
   - Provides upload, download, and bucket management functions

2. **useGreenfield Hook** (`hooks/use-greenfield.ts`)
   - React hook that integrates wallet connection with Greenfield
   - Automatically initializes Greenfield client when wallet connects
   - Provides state management for connection status, balance, and errors

3. **WalletConnectButton** (`components/wallet-connect-button.tsx`)
   - Enhanced to show Greenfield connection status
   - Displays wallet balance and connection indicators

4. **GreenfieldStatus** (`components/greenfield-status.tsx`)
   - Dedicated component to display Greenfield connection status
   - Provides test connection functionality
   - Shows account information and balance

5. **GreenfieldUpload** (`components/greenfield-upload.tsx`)
   - File upload component that uses Greenfield storage
   - Requires wallet connection before allowing uploads
   - Shows upload progress and results

## Setup

### Prerequisites

1. **BNB Greenfield SDK**: Already installed via `@bnb-chain/greenfield-js-sdk`
2. **Wallet Connection**: Uses Wagmi for wallet management
3. **Environment**: Configured for Greenfield Testnet (Chain ID: 5600)

### Configuration

The Greenfield configuration is set in `lib/greenfield-storage.ts`:

```typescript
export const GREENFIELD_CONFIG: GreenfieldConfig = {
  chainId: 5600, // Greenfield Testnet
  rpcUrl: "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  endpoint: "https://gnfd-testnet-sp1.bnbchain.org",
  bucketName: "toolchain-assets",
}
```

## Usage

### 1. Connect Wallet

Users must first connect their Web3 wallet:

```typescript
import { WalletConnectButton } from "@/components/wallet-connect-button"

<WalletConnectButton />
```

### 2. Greenfield Initialization

The Greenfield client automatically initializes when a wallet connects:

```typescript
import { useGreenfield } from "@/hooks/use-greenfield"

const { isInitialized, isLoading, error, balance } = useGreenfield()
```

### 3. Upload Files

Upload files to Greenfield storage:

```typescript
import { GreenfieldUpload } from "@/components/greenfield-upload"

<GreenfieldUpload 
  onUploadComplete={(result) => console.log(result)}
  acceptedTypes={["image/*"]}
  maxSize={10}
/>
```

### 4. Check Status

Monitor Greenfield connection status:

```typescript
import { GreenfieldStatus } from "@/components/greenfield-status"

<GreenfieldStatus />
```

## Features

### Automatic Initialization
- Greenfield client initializes automatically when wallet connects
- Uses wallet address for authentication
- Handles connection errors gracefully

### File Management
- Upload files to Greenfield storage
- Download files using object hashes
- List objects in buckets
- Create new buckets

### Account Management
- View account balance
- Get account information
- Refresh balance data

### Error Handling
- Comprehensive error handling for all operations
- User-friendly error messages
- Graceful fallbacks for failed operations

## Security Considerations

### Private Key Management
- Currently uses empty private key (for demo purposes)
- In production, implement secure private key retrieval from wallet
- Consider using wallet signing for transactions

### Access Control
- Files are stored with wallet-based authentication
- Only the wallet owner can access their files
- Consider implementing additional access controls as needed

## Testing

### Connection Test
Use the "Test Greenfield Connection" button in the GreenfieldStatus component to verify:
- Account information retrieval
- Bucket access
- Object listing

### File Upload Test
1. Connect wallet
2. Wait for Greenfield initialization
3. Use GreenfieldUpload component to upload a file
4. Verify upload success and hash generation

## Troubleshooting

### Common Issues

1. **Wallet Not Connected**
   - Ensure wallet is connected before using Greenfield features
   - Check wallet network (should be BSC Testnet)

2. **Initialization Failed**
   - Verify wallet address is valid
   - Check network connectivity
   - Ensure Greenfield testnet is accessible

3. **Upload Failed**
   - Check account balance (needs tBNB for gas fees)
   - Verify file size and type restrictions
   - Ensure bucket exists or can be created

### Debug Information

Enable debug logging by checking browser console for:
- Greenfield client initialization messages
- Upload/download operation details
- Error messages and stack traces

## Future Enhancements

1. **Multi-chain Support**: Extend to support other chains
2. **Advanced Access Control**: Implement file sharing and permissions
3. **Batch Operations**: Support for multiple file uploads
4. **Progress Tracking**: Real-time upload/download progress
5. **File Versioning**: Support for file version management
6. **Metadata Storage**: Store additional file metadata on-chain

## Dependencies

- `@bnb-chain/greenfield-js-sdk`: BNB Greenfield JavaScript SDK
- `wagmi`: Web3 wallet management
- `viem`: Ethereum library for wallet interactions
- `react`: React framework
- `typescript`: Type safety

## Network Information

- **Testnet**: Greenfield Testnet (Chain ID: 5600)
- **RPC URL**: https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
- **Storage Provider**: https://gnfd-testnet-sp1.bnbchain.org
- **Explorer**: https://greenfieldscan.com/ 