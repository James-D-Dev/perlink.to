import type { H3Event } from 'h3'
import { generateVietQR, getBankByBIN } from './vietqr'

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

/** What the checkout shows: QR, bank, account, amount and the note to write */
export function transferDetails(event: H3Event, payment: { amount: number; code: string }) {
  const account = billingAccount(event)
  if (!account) return null
  return {
    qrString: generateVietQR({ bankBIN: account.bank.BIN, accountNumber: account.accountNumber, amount: payment.amount, note: payment.code }),
    bankName: account.bank.ShortName,
    accountNumber: account.accountNumber,
    accountName: account.accountName,
    amount: payment.amount,
    note: payment.code,
  }
}
