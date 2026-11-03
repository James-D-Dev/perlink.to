import type { H3Event } from 'h3'
import { getDB } from './db'

// Orders from a site's products block: where each one is, and the stock it
// takes. Stock lives on the product in the site's blocks (live and draft).

export const ORDER_STATUSES = ['new', 'confirmed', 'shipped', 'done', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderMeta {
  productId: string
  quantity: number
  /** How many came off the product's stock (0 when stock isn't counted) */
  took: number
}

type Product = { id?: string; stock?: unknown }
type Block = { id?: string; name?: string; data?: { items?: Product[] } }

/** Change one product's stock by `delta` in a block list; how much it really changed */
function changeStock(blocks: Block[], blockId: string, productId: string, delta: number) {
  const product = blocks.find(b => b.id === blockId && b.name === 'products')?.data?.items?.find(p => p.id === productId)
  if (!product || typeof product.stock !== 'number') return 0
  const next = Math.max(0, product.stock + delta)
  const changed = next - product.stock
  product.stock = next
  return changed
}

/**
 * Take (negative) or put back (positive) stock for an order, on the live site
 * and on its draft, so publishing the draft doesn't undo it. Returns how much
 * the live stock changed.
 */
export async function adjustStock(event: H3Event, siteId: string, blockId: string, productId: string, delta: number) {
  const db = getDB(event)
  const row = await db.prepare('SELECT blocks, draft FROM bio_pages WHERE id = ?').bind(siteId).first<{ blocks: string | null; draft: string | null }>()
  if (!row?.blocks) return 0
  const blocks = JSON.parse(row.blocks) as Block[]
  const changed = changeStock(blocks, blockId, productId, delta)
  if (!changed) return 0

  let draft: { blocks?: Block[] } | null = null
  try {
    draft = row.draft ? JSON.parse(row.draft) : null
  } catch {}
  if (draft?.blocks) changeStock(draft.blocks, blockId, productId, changed)

  await db.prepare('UPDATE bio_pages SET blocks = ?, draft = COALESCE(?, draft) WHERE id = ?')
    .bind(JSON.stringify(blocks), draft ? JSON.stringify(draft) : null, siteId)
    .run()
  return changed
}

export function parseOrderMeta(value: string | null | undefined): OrderMeta | null {
  if (!value) return null
  try {
    const meta = JSON.parse(value)
    return typeof meta?.productId === 'string' ? meta : null
  } catch {
    return null
  }
}
