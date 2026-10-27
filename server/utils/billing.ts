import type { H3Event } from 'h3'
import { generateVietQR, getBankByBIN } from './vietqr'
import { isEvmAddress } from '#shared/crypto'

// Payment codes go in the transfer note: "PL" and 8 letters/digits that
// can't be misread (no 0/O, 1/I/L)
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const PAYMENT_CODE_RE = /PL[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{8}/g

export function newPaymentCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return 'PL' + Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

/** The account plan payments go to, or null while billing isn't set up */
export function billingAccount(event: H3Event) {
  const { bankBin, accountNumber, accountName } = useRuntimeConfig(event).billing ?? {}
  const bank = bankBin ? getBankByBIN(String(bankBin)) : undefined
  if (!bank || !accountNumber) return null
  return { bank, accountNumber: String(accountNumber), accountName: String(accountName || '') }
}

/** The transfer message: "PERLINK" and the payment code, e.g. "PERLINK PL7K2M9QXA" */
export const transferNote = (code: string) => `PERLINK ${code}`

/** What the checkout shows: QR, bank, account, amount and the note to write */
export function transferDetails(event: H3Event, payment: { amount: number; code: string }) {
  const account = billingAccount(event)
  if (!account) return null
  const note = transferNote(payment.code)
  return {
    qrString: generateVietQR({ bankBIN: account.bank.BIN, accountNumber: account.accountNumber, amount: payment.amount, note }),
    /** The VietQR image to scan (amount and note are in the code) */
    qrImage: `https://vietqr.app/img?${new URLSearchParams({
      bank: account.bank.ShortName,
      acc: account.accountNumber,
      template: 'compact',
      amount: String(payment.amount),
      des: note,
      showinfo: 'false',
      holder: account.accountName,
    })}`,
    bankName: account.bank.ShortName,
    accountNumber: account.accountNumber,
    accountName: account.accountName,
    amount: payment.amount,
    note,
  }
}

/** The EVM wallet that receives USDT / USDC, or null while crypto isn't set up */
export function cryptoWallet(event: H3Event) {
  const address = String(useRuntimeConfig(event).billing?.cryptoAddress || '')
  return isEvmAddress(address) ? address : null
}

/** Ways to pay that are set up */
export function paymentMethods(event: H3Event) {
  return { bank: !!billingAccount(event), crypto: !!cryptoWallet(event) }
}
