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

## 3D shop: product stands in the room

The room editor has a **Shop** tab with a **Product stand** (`product-stand`
in `app/utils/room/catalog.ts`). Each stand shows one product of the site's
products blocks as a card (photo, name, price, discount or label, "sold out")
drawn on a canvas (`app/utils/room/productCard.ts`). A new stand takes the
next product not on display; the stand's details panel lets the owner pick
another.

In the public room, hovering a stand shows the name and price; clicking it
opens the product (photo, description, price) with **Order** (the same
`BioOrderSheet` as the page, so orders, VietQR and Inbox work the same) or
**Buy on Shopee / TikTok Shop…** for products with a store link.

- `RoomObject.productId` links a stand to a product; `pageProducts(blocks)`
  (`app/utils/blocks.ts`) lists a page's products with their block.
- `RoomScene.setProducts()` redraws stands when products change. Uploaded
  photos are read through `/api/media/*` because the media domain has no CORS.
- Card colours use the site's accent colour (`themeConfig.colors.primary`).
