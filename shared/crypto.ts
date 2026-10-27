// Stablecoins Perlink accepts for plans, by EVM chain. Shared by the checkout
// (what to send, where) and the server (reading the transaction back).

export type CryptoToken = 'USDT' | 'USDC'

export interface CryptoNetwork {
  id: string
  name: string
  /** Chain logo (Iconify) */
  icon: string
  /** Public JSON-RPC endpoint, used to read transactions back */
  rpc: string
  /** Block explorer link for a transaction */
  explorer: string
  tokens: Partial<Record<CryptoToken, { address: string; decimals: number }>>
}

export const CRYPTO_NETWORKS: CryptoNetwork[] = [
  {
    id: 'base',
    name: 'Base',
    icon: 'token-branded:base',
    rpc: 'https://base-rpc.publicnode.com',
    explorer: 'https://basescan.org/tx/',
    tokens: {
      USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
    },
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain (BEP-20)',
    icon: 'token-branded:binance-smart-chain',
    rpc: 'https://bsc-rpc.publicnode.com',
    explorer: 'https://bscscan.com/tx/',
    tokens: {
      USDT: { address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
      USDC: { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
    },
  },
]

/** Token logos (Iconify) */
export const CRYPTO_TOKEN_ICONS: Record<CryptoToken, string> = {
  USDT: 'cryptocurrency-color:usdt',
  USDC: 'cryptocurrency-color:usdc',
}

export const CRYPTO_NETWORK_BY_ID = Object.fromEntries(CRYPTO_NETWORKS.map(n => [n.id, n])) as Record<string, CryptoNetwork>

export const isEvmAddress = (value: string) => /^0x[0-9a-fA-F]{40}$/.test(value)
export const isTxHash = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value)
