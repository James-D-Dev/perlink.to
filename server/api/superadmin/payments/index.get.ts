import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { PAYMENT_SELECT, parseCheck, type PaymentRow } from '../../../utils/paymentReview'
import { describeCheck } from '../../../utils/cryptoPayments'
import { CRYPTO_NETWORK_BY_ID } from '#shared/crypto'
import { paymentProducts } from '../../../utils/weddingPass'

const FILTERS = ['submitted', 'paid', 'refunded', 'all'] as const
type Filter = typeof FILTERS[number]

// Superadmin → Payments: waiting for review, paid, refunded or everything,
// with the count of each tab and the money taken
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const asked = String(getQuery(event).status || 'submitted')
  const filter: Filter = (FILTERS as readonly string[]).includes(asked) ? asked as Filter : 'submitted'
  const where = filter === 'all' ? '' : `WHERE p.status = '${filter}'`
  const db = getDB(event)
  const [list, summary, packs] = await db.batch([
    db.prepare(`${PAYMENT_SELECT} ${where} ORDER BY COALESCE(p.submitted_at, p.paid_at, p.created_at) DESC LIMIT 200`),
    db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS submitted,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid,
        SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunded,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_usd END), 0) AS paidUsd,
        COALESCE(SUM(CASE WHEN status = 'paid' AND amount_usd IS NULL THEN amount END), 0) AS paidVnd,
        COALESCE(SUM(CASE WHEN status = 'paid' AND date(paid_at) >= date('now', '-29 days') THEN amount_usd END), 0) AS paidUsd30,
        COALESCE(SUM(CASE WHEN status = 'refunded' THEN amount_usd END), 0) AS refundedUsd
      FROM payments
    `),
    // Room packs bought by card: their own table, shown here as paid sales
    db.prepare(`
      SELECT r.user_id, r.pack_id, r.source, r.order_ref, r.amount_usd, r.created_at, pr.email, pr.name, pr.avatar
      FROM room_packs r LEFT JOIN profiles pr ON pr.id = r.user_id
      WHERE r.amount_usd > 0
      ORDER BY r.created_at DESC
    `),
  ])
  const packRows = (packs?.results ?? []) as {
    user_id: string; pack_id: string; source: string; order_ref: string | null; amount_usd: number
    created_at: string; email: string | null; name: string | null; avatar: string | null
  }[]
  const days30 = Date.now() - 30 * 86400_000
  const packUsd = packRows.reduce((sum, r) => sum + r.amount_usd, 0)
  const packUsd30 = packRows.filter(r => new Date(`${r.created_at.replace(' ', 'T')}Z`).getTime() >= days30).reduce((sum, r) => sum + r.amount_usd, 0)
  const packPayments = packRows.map(r => ({
    id: `pack:${r.user_id}:${r.pack_id}`,
    userId: r.user_id,
    email: r.email,
    name: r.name,
    avatar: r.avatar,
    plan: null,
    period: null,
    product: `pack:${r.pack_id}`,
    method: r.source,
    amount: 0,
    amountUsd: r.amount_usd,
    code: (r.order_ref ?? '').replace(/^(creem|lemon):order:/, ''),
    status: 'paid',
    network: null,
    token: null,
    txHash: null,
    check: null,
    checkText: null,
    createdAt: r.created_at,
    submittedAt: null,
    reviewedAt: null,
    paidAt: r.created_at,
  }))
  const results = (list?.results ?? []) as PaymentRow[]
  const s = (summary?.results?.[0] ?? {}) as Record<string, number>
  const products = await paymentProducts(event, results.map(p => p.id))
  const withPacks = filter === 'all' || filter === 'paid'
  const rows = results.map((p) => {
      const check = parseCheck(p)
      return {
        id: p.id,
        userId: p.user_id,
        email: p.email,
        name: p.user_name ?? null,
        avatar: p.user_avatar ?? null,
        plan: p.plan,
        period: p.period,
        /** 'wedding': the Wedding pass */
        product: products.get(p.id) ?? null,
        method: p.method,
        amount: p.amount,
        amountUsd: p.amount_usd,
        code: p.code,
        status: p.status,
        network: p.network ? CRYPTO_NETWORK_BY_ID[p.network]?.name ?? p.network : null,
        token: p.token,
        txHash: p.tx_hash,
        check,
        checkText: p.method === 'crypto' ? describeCheck(check, p.amount_usd ?? 0) : null,
        createdAt: p.created_at,
        submittedAt: p.submitted_at,
        reviewedAt: p.reviewed_at,
        paidAt: p.paid_at,
      }
    })
  const sortKey = (p: { paidAt: string | null; submittedAt: string | null; createdAt: string }) => p.submittedAt || p.paidAt || p.createdAt
  return {
    counts: {
      submitted: s.submitted || 0,
      paid: (s.paid || 0) + packRows.length,
      refunded: s.refunded || 0,
      all: (s.total || 0) + packRows.length,
    },
    totals: {
      paidUsd: (s.paidUsd || 0) + packUsd,
      paidVnd: s.paidVnd || 0,
      paidUsd30: (s.paidUsd30 || 0) + packUsd30,
      refundedUsd: s.refundedUsd || 0,
    },
    payments: [...rows, ...(withPacks ? packPayments : [])].sort((a, b) => sortKey(b).localeCompare(sortKey(a))),
  }
})
