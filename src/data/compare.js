/* SMARTCART · pure helpers to turn a shopping list + dummy prices into a
   price comparison. No backend — everything runs in the browser. */

import { demoSupermarkets, demoProducts, demoPrices } from './dummyData'

export const stores = demoSupermarkets
export const products = demoProducts
export const prices = demoPrices

const productById = new Map(products.map((p) => [p.id, p]))
const priceIndex = new Map(prices.map((p) => [`${p.product_id}:${p.supermarket_id}`, p]))

export function getProduct(id) {
  return productById.get(id) || null
}

export function formatILS(n) {
  return `₪${Number(n || 0).toFixed(2)}`
}

function unitPrice(row) {
  if (!row) return null
  if (row.on_sale && row.sale_price != null) return Number(row.sale_price)
  return Number(row.price)
}

/* Per-store total for a list of { product_id, quantity }. */
export function compareStores(items) {
  const result = stores.map((store) => {
    let total = 0
    let found = 0
    const lines = items.map((item) => {
      const row = priceIndex.get(`${item.product_id}:${store.id}`)
      const up = unitPrice(row)
      const available = up != null
      if (available) {
        total += up * item.quantity
        found += 1
      }
      return {
        ...item,
        product: productById.get(item.product_id),
        unitPrice: up,
        onSale: row ? row.on_sale : false,
        lineTotal: available ? up * item.quantity : null,
        available,
      }
    })
    return {
      store,
      lines,
      total: Math.round(total * 100) / 100,
      found,
      missing: items.length - found,
      coversAll: found === items.length,
    }
  })

  result.sort((a, b) => {
    if (a.coversAll !== b.coversAll) return a.coversAll ? -1 : 1
    return a.total - b.total
  })
  return result
}

/* Cheapest single store that covers everything (or the cheapest overall). */
export function bestSingleStore(items) {
  const ranked = compareStores(items)
  return ranked.find((r) => r.coversAll) || ranked[0] || null
}

/* Cheapest split: pick the cheapest store per item. */
export function bestSplitCart(items) {
  const storeById = new Map(stores.map((s) => [s.id, s]))
  let total = 0
  const lines = items.map((item) => {
    let best = null
    for (const p of prices) {
      if (p.product_id !== item.product_id) continue
      const up = unitPrice(p)
      if (best == null || up < best.unitPrice) {
        best = { unitPrice: up, store: storeById.get(p.supermarket_id), onSale: p.on_sale }
      }
    }
    if (best) total += best.unitPrice * item.quantity
    return {
      ...item,
      product: productById.get(item.product_id),
      unitPrice: best ? best.unitPrice : null,
      store: best ? best.store : null,
      lineTotal: best ? Math.round(best.unitPrice * item.quantity * 100) / 100 : null,
      available: Boolean(best),
    }
  })
  const used = new Set(lines.filter((l) => l.store).map((l) => l.store.id))
  return { lines, total: Math.round(total * 100) / 100, storesUsed: used.size }
}
