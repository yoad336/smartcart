/* =============================================================
   SMARTCART · Support (pure logic + data service)
   Merges the price/cart engine with the Supabase data layer.
     • Cart engine: pure functions that turn a list + price table into
       a store-by-store comparison and a recommended cart.
     • Data service: the single place that talks to Supabase for the
       catalog, saved lists, preferences and profile — with an automatic
       fall-back to the bundled demo catalog (data.js) so the app is
       always demoable.
   ============================================================= */
import { supabase, isSupabaseConfigured } from './supabaseClient'
import { demoProducts, demoSupermarkets, demoPrices } from './data'



/* ===================== Cart engine ===================== */

/* =============================================================
   SMARTCART · Cart Engine
   Pure functions (no React, no network) that turn a shopping list
   + a price table into a price comparison and a recommended cart.
   Kept separate so it is easy to read, test, and later move into
   a Supabase Edge Function.
   ============================================================= */

/**
 * Build a comparison of every supermarket for the given list.
 *
 * @param {Array} items          [{ product_id, name, emoji, quantity }]
 * @param {Array} supermarkets   [{ id, name, color, city, distance_km }]
 * @param {Array} prices         [{ product_id, supermarket_id, price, on_sale, sale_price }]
 * @returns {Array} per-store breakdown, sorted from cheapest to most expensive
 */
export function compareStores(items, supermarkets, prices) {
  // index prices by "productId:storeId" for O(1) lookups
  const priceIndex = new Map()
  for (const p of prices) {
    priceIndex.set(`${p.product_id}:${p.supermarket_id}`, p)
  }

  const stores = supermarkets.map((store) => {
    let total = 0
    let foundCount = 0
    const lines = items.map((item) => {
      const priceRow = priceIndex.get(`${item.product_id}:${store.id}`)
      const unitPrice = priceRow ? effectivePrice(priceRow) : null
      const available = unitPrice != null
      if (available) {
        total += unitPrice * item.quantity
        foundCount += 1
      }
      return {
        ...item,
        available,
        unitPrice,
        onSale: priceRow ? priceRow.on_sale : false,
        lineTotal: available ? unitPrice * item.quantity : null,
      }
    })

    return {
      store,
      lines,
      total: round2(total),
      foundCount,
      missingCount: items.length - foundCount,
      coversAll: foundCount === items.length,
    }
  })

  // Sort: stores that have everything first, then by total price.
  stores.sort((a, b) => {
    if (a.coversAll !== b.coversAll) return a.coversAll ? -1 : 1
    return a.total - b.total
  })

  return stores
}

/**
 * Theoretical cheapest basket if the user is willing to split the
 * shopping across stores (best price per item, anywhere).
 */
export function bestSplitCart(items, supermarkets, prices) {
  const storeById = new Map(supermarkets.map((s) => [s.id, s]))
  let total = 0

  const lines = items.map((item) => {
    let best = null
    for (const p of prices) {
      if (p.product_id !== item.product_id) continue
      const unitPrice = effectivePrice(p)
      if (best == null || unitPrice < best.unitPrice) {
        best = { unitPrice, store: storeById.get(p.supermarket_id), onSale: p.on_sale }
      }
    }
    if (best) total += best.unitPrice * item.quantity
    return {
      ...item,
      unitPrice: best ? best.unitPrice : null,
      store: best ? best.store : null,
      onSale: best ? best.onSale : false,
      lineTotal: best ? round2(best.unitPrice * item.quantity) : null,
      available: Boolean(best),
    }
  })

  const storesUsed = new Set(lines.filter((l) => l.store).map((l) => l.store.id))

  return {
    lines,
    total: round2(total),
    storesUsedCount: storesUsed.size,
  }
}

/**
 * Decide the recommended cart given user preferences.
 *
 * @param {Object} prefs { mode: 'single' | 'split', maxDistanceKm }
 */
export function recommendCart(items, supermarkets, prices, prefs = {}) {
  const { mode = 'single', maxDistanceKm } = prefs

  // optionally filter by distance
  const reachable =
    maxDistanceKm != null
      ? supermarkets.filter(
          (s) => s.distance_km == null || s.distance_km <= maxDistanceKm
        )
      : supermarkets

  const comparison = compareStores(items, reachable, prices)
  const single = comparison.find((c) => c.coversAll) || comparison[0] || null
  const split = bestSplitCart(items, reachable, prices)

  const chosenSingleTotal = single ? single.total : Infinity
  const savingsVsSingle = round2(Math.max(0, chosenSingleTotal - split.total))

  return {
    comparison,
    single,
    split,
    mode,
    recommended: mode === 'split' ? split : single,
    savingsVsSingle,
  }
}

/* ---------------- helpers ---------------- */

function effectivePrice(priceRow) {
  if (priceRow.on_sale && priceRow.sale_price != null) return Number(priceRow.sale_price)
  return Number(priceRow.price)
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function formatILS(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return '₪' + Number(n).toFixed(2)
}


/* ===================== Data service ===================== */

/* =============================================================
   SMARTCART · Data service
   One place that talks to Supabase for the catalog + saved lists.
   If Supabase is not configured, or the catalog tables are empty,
   it transparently falls back to the bundled demo dataset so the
   app is always demoable.
   ============================================================= */

/** Returns { products, supermarkets, prices, source } */
export async function fetchCatalog() {
  if (!isSupabaseConfigured) {
    return demoCatalog('Supabase לא מוגדר – מוצגים נתוני דמו')
  }

  try {
    const [{ data: products, error: e1 }, { data: supermarkets, error: e2 }, { data: prices, error: e3 }] =
      await Promise.all([
        supabase.from('products').select('*').order('category'),
        supabase.from('supermarkets').select('*').order('distance_km'),
        supabase.from('prices').select('*'),
      ])

    if (e1 || e2 || e3) throw e1 || e2 || e3

    // If the DB has no catalog yet (seed not run), use demo data.
    if (!products?.length || !supermarkets?.length || !prices?.length) {
      return demoCatalog('הטבלאות ריקות – הריצו את seed.sql. בינתיים מוצגים נתוני דמו')
    }

    return { products, supermarkets, prices, source: 'supabase', notice: null }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[SMARTCART] catalog fetch failed, using demo data:', err.message)
    return demoCatalog('שגיאת חיבור – מוצגים נתוני דמו')
  }
}

function demoCatalog(notice) {
  return {
    products: demoProducts,
    supermarkets: demoSupermarkets,
    prices: demoPrices,
    source: 'demo',
    notice,
  }
}

/* ---------------- saved lists (require Supabase) ---------------- */

export async function fetchSavedLists(userId) {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('id, name, created_at, shopping_list_items ( id, product_id, name, emoji, quantity )')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function saveList(userId, name, items) {
  if (!isSupabaseConfigured) {
    throw new Error('שמירה דורשת חיבור ל-Supabase. הגדירו קובץ .env תחילה.')
  }
  // 1) create the list
  const { data: list, error: listErr } = await supabase
    .from('shopping_lists')
    .insert({ user_id: userId, name })
    .select()
    .single()
  if (listErr) throw listErr

  // 2) insert its items
  if (items.length) {
    const rows = items.map((i) => ({
      list_id: list.id,
      product_id: isUuid(i.product_id) ? i.product_id : null,
      name: i.name,
      emoji: i.emoji,
      quantity: i.quantity,
    }))
    const { error: itemsErr } = await supabase.from('shopping_list_items').insert(rows)
    if (itemsErr) throw itemsErr
  }
  return list
}

export async function deleteList(listId) {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.from('shopping_lists').delete().eq('id', listId)
  if (error) throw error
}

/* ---------------- preferences ---------------- */

export async function fetchPreferences(userId) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function savePreferences(userId, prefs) {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.from('user_preferences').upsert({
    user_id: userId,
    city: prefs.city,
    max_distance_km: prefs.maxDistanceKm,
    mode: prefs.mode,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

/* ---------------- profile ---------------- */

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

function isUuid(v) {
  return (
    typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
  )
}
