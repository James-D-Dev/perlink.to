import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { emailEnabled, runInBackground } from '../../../utils/email'
import { notifyOwnerOfRequest } from '../../../utils/formNotification'
import { notifyOwnerTelegram } from '../../../utils/telegram'
import { generateVietQR, getBankByBIN } from '../../../utils/vietqr'
import { formatVnd } from '#shared/plans'

// A visitor orders a product from a site's products block. The order lands
// in the site's inbox; paying by transfer gets a VietQR for the site's own
// bank account (from its VietQR block) with the amount and order code.

const bodySchema = z.object({
  blockId: z.string().min(1).max(40),
  productId: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(99),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(40),
  address: z.string().trim().max(500).optional(),
  note: z.string().trim().max(1000).optional(),
  payment: z.enum(['cod', 'transfer']),
  // Honeypot: hidden from people, bots fill it in
  website: z.string().optional(),
})

const MAX_PER_WINDOW = 5
const WINDOW_MINUTES = 10
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!username || !parsed.success) throw createError({ statusCode: 400, statusMessage: 'Please fill in your name and phone number' })
  const body = parsed.data
  if (body.website) return { success: true, code: 'DH000000', total: 0 }

  const bioPage = await new BioRepository(event).findByUsername(username)
  if (!bioPage?.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  const blocks = bioPage.blocks as any[]
  const block = blocks.find(b => b.id === body.blockId && b.name === 'products' && !b.hidden)
  const product = block?.data?.items?.find((item: any) => item.id === body.productId)
  if (!block?.data?.ordering || !product || product.url) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  if (product.soldOut) throw createError({ statusCode: 409, statusMessage: 'Sold out' })

  const payment = block.data.payment ?? 'both'
  if (payment !== 'both' && payment !== body.payment) throw createError({ statusCode: 400, statusMessage: 'Payment method not available' })
  if (block.data.askAddress && !body.address) throw createError({ statusCode: 422, statusMessage: 'Please add a delivery address' })

  // Bank details for a transfer come from the site's VietQR block
  const vietqr = blocks.find(b => b.name === 'vietqr' && !b.hidden)?.data
  const bank = vietqr?.bankId ? getBankByBIN(String(vietqr.bankId)) : undefined
  if (body.payment === 'transfer' && (!bank || !vietqr?.accountNumber)) {
    throw createError({ statusCode: 400, statusMessage: 'This shop does not take bank transfers yet' })
  }

  const db = getDB(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
  const ipHash = await hashIP(ip, bioPage.id)
  const recent = await db
    .prepare(`SELECT COUNT(*) AS n FROM form_submissions WHERE bio_page_id = ? AND ip_hash = ? AND created_at > datetime('now', ?)`)
    .bind(bioPage.id, ipHash, `-${WINDOW_MINUTES} minutes`)
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= MAX_PER_WINDOW) throw createError({ statusCode: 429, statusMessage: 'Too many orders, please try again later' })

  const price = Number(product.price) || 0
  const total = price * body.quantity
  const code = 'DH' + Array.from(crypto.getRandomValues(new Uint8Array(6)), b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')

  // Stored like a form request so the inbox and emails handle it
  const data: Record<string, string> = {
    kind: 'order',
    code,
    product: String(product.name).slice(0, 200),
    quantity: String(body.quantity),
    total: price ? formatVnd(total) : '',
    payment: body.payment,
    name: body.name,
    phone: body.phone,
    ...(body.address ? { address: body.address } : {}),
    ...(body.note ? { message: body.note } : {}),
  }
  await db
    .prepare('INSERT INTO form_submissions (id, bio_page_id, block_id, data, ip_hash) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), bioPage.id, body.blockId, JSON.stringify(data), ipHash)
    .run()

  runInBackground(event, new BioRepository(event).incrementAction(bioPage.id, 'order'))
  if (emailEnabled(event)) runInBackground(event, notifyOwnerOfRequest(event, bioPage, data))
  runInBackground(event, notifyOwnerTelegram(event, bioPage, data))

  const transfer = body.payment === 'transfer' && bank && vietqr
    ? {
        qrString: generateVietQR({ bankBIN: bank.BIN, accountNumber: String(vietqr.accountNumber), amount: total || undefined, note: code }),
        bankName: bank.ShortName,
        accountNumber: String(vietqr.accountNumber),
        accountName: vietqr.accountName ? String(vietqr.accountName) : '',
        amount: total,
        note: code,
      }
    : null
  return { success: true, code, total, transfer }
})
