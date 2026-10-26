import { CRYPTO_NETWORK_BY_ID, type CryptoToken } from '#shared/crypto'
import type { AppLanguage } from '#shared/language'

// Reads a stablecoin payment back from the chain, so the reviewer sees at a
// glance whether it's real: the transaction succeeded, moved USDT/USDC on
// that network to our wallet, and how much.

/** keccak256("Transfer(address,address,uint256)") */
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

export interface CryptoCheck {
  /** found: confirmed and paid enough; short: paid less; none: nothing to our wallet;
   * failed: the transaction reverted; pending: not mined yet / unknown; error: couldn't ask */
  verdict: 'ok' | 'short' | 'none' | 'failed' | 'pending' | 'error'
  /** Stablecoin received by our wallet in this transaction (USD) */
  received?: number
  token?: CryptoToken
  from?: string
  confirmations?: number
  checkedAt: string
  explorer?: string
}

async function rpc<T>(url: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(10000),
  })
  const data = await response.json() as { result?: T; error?: { message: string } }
  if (data.error) throw new Error(data.error.message)
  return data.result as T
}

interface Receipt {
  status: string
  blockNumber: string
  from: string
  logs: { address: string; topics: string[]; data: string }[]
}

export async function checkCryptoPayment(networkId: string, txHash: string, wallet: string, expectedUsd: number): Promise<CryptoCheck> {
  const network = CRYPTO_NETWORK_BY_ID[networkId]
  const checkedAt = new Date().toISOString()
  if (!network) return { verdict: 'error', checkedAt }
  const explorer = network.explorer + txHash
  try {
    const receipt = await rpc<Receipt | null>(network.rpc, 'eth_getTransactionReceipt', [txHash])
    if (!receipt) return { verdict: 'pending', checkedAt, explorer }
    if (receipt.status !== '0x1') return { verdict: 'failed', checkedAt, explorer, from: receipt.from }

    const to = '0x' + wallet.toLowerCase().replace(/^0x/, '').padStart(64, '0')
    let received = 0
    let token: CryptoToken | undefined
    for (const [symbol, info] of Object.entries(network.tokens) as [CryptoToken, { address: string; decimals: number }][]) {
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== info.address.toLowerCase()) continue
        if (log.topics[0] !== TRANSFER_TOPIC || log.topics[2]?.toLowerCase() !== to) continue
        received += Number(BigInt(log.data) * 1000000n / 10n ** BigInt(info.decimals)) / 1000000
        token = symbol
      }
    }
    const latest = Number(BigInt(await rpc<string>(network.rpc, 'eth_blockNumber', [])))
    const confirmations = Math.max(0, latest - Number(BigInt(receipt.blockNumber)) + 1)
    const base = { checkedAt, explorer, from: receipt.from, confirmations }
    if (!token) return { verdict: 'none', ...base }
    // A cent of leeway for rounding in wallets
    return { verdict: received + 0.01 >= expectedUsd ? 'ok' : 'short', received, token, ...base }
  } catch (error) {
    console.warn('[billing] crypto check failed:', error instanceof Error ? error.message : error)
    return { verdict: 'error', checkedAt, explorer }
  }
}

const CHECK_COPY = {
  en: {
    ok: (amount: string, confirmations: number) => `✅ Valid: received ${amount}, ${confirmations} confirmations`,
    short: (amount: string, expected: string) => `⚠️ Too little: received ${amount}, needs ${expected}`,
    none: '❌ The transaction sent no USDT/USDC to our wallet',
    failed: '❌ The transaction failed on chain',
    pending: '⏳ Not on chain yet (still confirming, or another network)',
    error: '❓ Couldn’t check it; look on the explorer',
  },
  vi: {
    ok: (amount: string, confirmations: number) => `✅ Hợp lệ: nhận ${amount}, ${confirmations} xác nhận`,
    short: (amount: string, expected: string) => `⚠️ Thiếu tiền: nhận ${amount}, cần ${expected}`,
    none: '❌ Giao dịch không chuyển USDT/USDC vào ví nhận',
    failed: '❌ Giao dịch thất bại trên chain',
    pending: '⏳ Chưa thấy giao dịch trên chain (đang chờ hoặc sai mạng)',
    error: '❓ Không kiểm tra được, hãy xem trên explorer',
  },
}

/** One line for the reviewer, in their language */
export function describeCheck(check: CryptoCheck | null, expectedUsd: number, lang: AppLanguage = 'en') {
  if (!check) return '—'
  const copy = CHECK_COPY[lang]
  const amount = check.received !== undefined ? `$${check.received.toFixed(2)} ${check.token ?? ''}`.trim() : ''
  switch (check.verdict) {
    case 'ok': return copy.ok(amount, check.confirmations ?? 0)
    case 'short': return copy.short(amount, `$${expectedUsd.toFixed(2)}`)
    case 'none': return copy.none
    case 'failed': return copy.failed
    case 'pending': return copy.pending
    default: return copy.error
  }
}
