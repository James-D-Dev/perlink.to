// What a product costs once the buyer has made their choices. A choice can
// carry its own price ("20 cm: 390.000đ") that replaces the product's price;
// when choices in several groups have prices, the last group (in the
// product's order) with a priced choice wins. Shared by the page (cards and
// the order sheet) and the order endpoint, which never trusts the browser.

interface PricedValue {
  id: string
  price?: number
}
interface PricedOption {
  id: string
  values?: PricedValue[]
}
export interface PricedProduct {
  price?: number
  options?: PricedOption[]
}

const priceOf = (value: PricedValue | undefined) => {
  const price = Number(value?.price)
  return Number.isFinite(price) && price > 0 ? Math.round(price) : undefined
}

/** Does any choice change the price? */
export function hasOptionPrices(product: PricedProduct) {
  return (product.options ?? []).some(option => option.values?.some(value => priceOf(value) !== undefined))
}

/** Unit price for the chosen values (option id → value id) */
export function unitPrice(product: PricedProduct, chosen: Record<string, string | undefined> = {}) {
  let price = Number(product.price) || 0
  for (const option of product.options ?? []) {
    const value = option.values?.find(v => v.id === chosen[option.id])
    const own = priceOf(value)
    if (own !== undefined) price = own
  }
  return price
}

/** Lowest and highest unit price over every combination of choices */
export function priceRange(product: PricedProduct): { min: number; max: number } {
  const groups = (product.options ?? []).filter(option => option.values?.length)
  // Only groups with a priced choice matter; few products have more than two
  const priced = groups.filter(option => option.values!.some(value => priceOf(value) !== undefined))
  let combos: Record<string, string>[] = [{}]
  for (const option of priced) {
    combos = combos.flatMap(combo => option.values!.map(value => ({ ...combo, [option.id]: value.id })))
    if (combos.length > 500) break
  }
  const prices = combos.map(combo => unitPrice(product, combo)).filter(price => price > 0)
  if (!prices.length) return { min: 0, max: 0 }
  return { min: Math.min(...prices), max: Math.max(...prices) }
}
