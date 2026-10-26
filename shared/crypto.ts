// Stablecoins Perlink accepts for plans, by EVM chain. Shared by the checkout
// (what to send, where) and the server (reading the transaction back).

export type CryptoToken = 'USDT' | 'USDC'

export interface CryptoNetwork {
  id: string
  name: string
  /** Public JSON-RPC endpoint, used to read transactions back */
  rpc: string
  /** Block explorer link for a transaction */
  explorer: string
  tokens: Partial<Record<CryptoToken, { address: string; decimals: number }>>
}

export const CRYPTO_NETWORKS: CryptoNetwork[] = [
  {
    id: 'bsc',
    name: 'BNB Smart Chain (BEP-20)',
    rpc: 'https://bsc-rpc.publicnode.com',
    explorer: 'https://bscscan.com/tx/',
    tokens: {
      USDT: { address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
      USDC: { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
    },
  },
  {
    id: 'polygon',
    name: 'Polygon',
    rpc: 'https://polygon-bor-rpc.publicnode.com',
    explorer: 'https://polygonscan.com/tx/',
    tokens: {
      USDT: { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
      USDC: { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
    },
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    rpc: 'https://arbitrum-one-rpc.publicnode.com',
    explorer: 'https://arbiscan.io/tx/',
    tokens: {
      USDT: { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
      USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    },
  },
  {
    id: 'base',
    name: 'Base',
    rpc: 'https://base-rpc.publicnode.com',
    explorer: 'https://basescan.org/tx/',
    tokens: {
      USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
    },
  },
  {
    id: 'ethereum',
    name: 'Ethereum (ERC-20)',
    rpc: 'https://ethereum-rpc.publicnode.com',
    explorer: 'https://etherscan.io/tx/',
    tokens: {
      USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
      USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    },
  },
]

export const CRYPTO_NETWORK_BY_ID = Object.fromEntries(CRYPTO_NETWORKS.map(n => [n.id, n])) as Record<string, CryptoNetwork>

export const isEvmAddress = (value: string) => /^0x[0-9a-fA-F]{40}$/.test(value)
export const isTxHash = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value)
