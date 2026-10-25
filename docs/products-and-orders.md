# Products block and orders

A block for selling. Each product either links to another store (Shopee,
TikTok Shop, Lazada, Tiki, Amazon, Etsy, any website) or can be ordered right
on the page. Orders land in the site's Inbox and are sent to the owner by
Telegram (see `telegram-notifications.md`) and email (when Resend is set up).

## Data

`ProductsBlock` in `app/types/bio.ts`:

```ts
{ title?, layout: 'grid' | 'list', items: ProductItem[],
  ordering: boolean,        // products without a link get an Order button
  askAddress: boolean,      // ask for a delivery address
  payment: 'cod' | 'transfer' | 'both' }
ProductItem = { id, name, price?, comparePrice?, imageUrl?, description?, tag?, soldOut?, url? }
```

Prices are whole VND numbers. A `comparePrice` above `price` shows struck
through with a "-N%" badge.

## Ordering

```
BioProductsDisplay.vue  → order sheet (quantity, name, phone, address, note, COD/transfer)
  → POST /api/bio/<name>/order       server/api/bio/[username]/order.post.ts
      checks the block, product, stock, payment method and address
      total = price × quantity (computed on the server)
      code  = "DH" + 6 characters
      saved in form_submissions with data.kind = 'order'
      → background: action count 'order', email, Telegram
  ← { code, total, transfer? }       transfer = VietQR for the site's own bank
                                      account (from its VietQR block) with
                                      amount and the order code as the note
```

- **Bank transfer** needs a VietQR block on the page with a bank and account
  number. Without one, the transfer option is hidden from customers and the
  editor shows a hint. The money goes straight to the shop's bank, so
  Perlink can't confirm payment: the owner checks their bank (the Inbox says so).
- **Limits:** five orders per visitor every ten minutes (hashed IP),
  honeypot field against bots.
- **Store links:** `productStore(url)` in `app/utils/blocks.ts` names the
  store and its icon for "Buy on …" buttons. Store clicks count as the
  analytics action `store`.
- **Add block by pasting** a store link (`BlockSelectionModal.vue`) creates a
  products block with that link; name and photo are filled from the page
  when the store allows it (`/api/crawl-link`, signed-in only, public
  addresses only).

| File | Role |
|---|---|
| `app/components/bio/BioBlockProducts.vue` | Editor |
| `app/components/bio/BioProductsDisplay.vue` | Public cards and order sheet |
| `server/api/bio/[username]/order.post.ts` | Order API |
| `app/pages/dashboard/site/[url]/inbox.vue` | Orders in the Inbox |
| `app/utils/siteI18n.ts` | Shopper texts in 11 languages (`shop*`, `order*`) |
