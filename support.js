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
import { demoProducts, demoSupermarkets, demoPrices, demoSubstitutions } from './data'



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
  // Persist only the columns that exist in the base schema. The richer
  // optimization preferences (fuel, split threshold, mode profile) live
  // client-side in localStorage, so the app keeps working even if these
  // columns were never added to the user_preferences table.
  const mode = prefs.optimizationMode === 'convenience' || prefs.allowSplit === false ? 'single' : 'split'
  const { error } = await supabase.from('user_preferences').upsert({
    user_id: userId,
    city: prefs.city,
    max_distance_km: prefs.maxDistanceKm,
    mode,
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


/* =============================================================
   SMARTCART · Optimization engine
   Turns the basic price comparison into a real "worthiness" decision:
   it weighs basket price together with distance, travel time, an
   estimated fuel cost, the store rating and convenience, the user's
   optimization profile, and whether splitting the shop between stores
   actually pays off. Pure functions, no React, and safe when fields
   are missing (everything falls back to sensible defaults / demo data).
   ============================================================= */

// Weight of each factor per optimization profile (each row sums to 1.0).
// eff = effective cost (price + fuel), dist = distance, time = travel time,
// fuel = fuel cost, rating = store rating, conv = convenience.
const MODE_WEIGHTS = {
  max_savings: { eff: 0.55, dist: 0.1, time: 0.05, fuel: 0.15, rating: 0.05, conv: 0.1 },
  balanced:    { eff: 0.32, dist: 0.16, time: 0.14, fuel: 0.1, rating: 0.12, conv: 0.16 },
  min_time:    { eff: 0.15, dist: 0.25, time: 0.35, fuel: 0.07, rating: 0.06, conv: 0.12 },
  convenience: { eff: 0.15, dist: 0.12, time: 0.12, fuel: 0.05, rating: 0.21, conv: 0.35 },
}

/** Estimated fuel cost for a round trip to a store. Guards bad input. */
export function estimateFuelCost(distanceKm, prefs = {}) {
  const eff = Number(prefs.fuelEfficiencyKmPerLiter) > 0 ? Number(prefs.fuelEfficiencyKmPerLiter) : 13
  const rawPrice = Number(prefs.fuelPricePerLiter)
  const price = !Number.isNaN(rawPrice) && rawPrice >= 0 ? rawPrice : 7.4
  const km = Number(distanceKm) || 0
  const roundTripKm = km * 2
  return round2((roundTripKm / eff) * price)
}

/** Travel time in minutes: use the store's field, else estimate at ~35 km/h. */
export function estimateTravelMinutes(store) {
  if (store && store.estimated_travel_minutes != null) {
    return Math.round(Number(store.estimated_travel_minutes))
  }
  const km = Number(store && store.distance_km) || 0
  return Math.round((km / 35) * 60)
}

function buildPriceIndex(prices) {
  const idx = new Map()
  for (const p of prices) idx.set(`${p.product_id}:${p.supermarket_id}`, p)
  return idx
}

/** Evaluate a single store for the given shopping list. */
function evalStore(items, store, priceIndex, prefs) {
  let productsTotal = 0
  let foundCount = 0
  const lines = items.map((item) => {
    const row = priceIndex.get(`${item.product_id}:${store.id}`)
    const unitPrice = row ? effectivePrice(row) : null
    const available = unitPrice != null
    if (available) {
      productsTotal += unitPrice * item.quantity
      foundCount += 1
    }
    return {
      ...item,
      available,
      unitPrice,
      onSale: row ? row.on_sale : false,
      lineTotal: available ? round2(unitPrice * item.quantity) : null,
    }
  })

  const distanceKm = store.distance_km != null ? Number(store.distance_km) : null
  const travelMinutes = estimateTravelMinutes(store)
  const fuelCost = estimateFuelCost(distanceKm == null ? 0 : distanceKm, prefs)

  return {
    store,
    lines,
    productsTotal: round2(productsTotal),
    foundCount,
    missingCount: items.length - foundCount,
    coversAll: foundCount === items.length,
    distanceKm,
    travelMinutes,
    fuelCost,
    effectiveTotal: round2(productsTotal + fuelCost),
    rating: store.rating != null ? Number(store.rating) : 4.0,
    convenienceScore: store.convenience_score != null ? Number(store.convenience_score) : 3.5,
    parking: !!store.parking_available,
    openingHours: store.opening_hours || null,
  }
}

/** Normalize a value to 0..1 across the candidate set; invert when lower is better. */
function norm(value, min, max, invert) {
  if (max === min) return 1
  const t = (value - min) / (max - min)
  return invert ? 1 - t : t
}

/** Cheapest price per item anywhere + the logistics a split would add. */
function analyzeSplit(items, supermarkets, priceIndex, single, prefs) {
  const allowSplit = prefs.allowSplit !== false
  const minSplitSavings = Number(prefs.minSplitSavings) || 0
  const mode = prefs.optimizationMode || 'balanced'
  const storeById = new Map(supermarkets.map((s) => [s.id, s]))

  let productsTotal = 0
  const usedStoreIds = new Set()
  const lines = items.map((item) => {
    let best = null
    for (const s of supermarkets) {
      const row = priceIndex.get(`${item.product_id}:${s.id}`)
      if (!row) continue
      const unit = effectivePrice(row)
      if (best == null || unit < best.unitPrice) best = { unitPrice: unit, store: s, onSale: row.on_sale }
    }
    if (best) {
      productsTotal += best.unitPrice * item.quantity
      usedStoreIds.add(best.store.id)
    }
    return {
      ...item,
      available: !!best,
      unitPrice: best ? best.unitPrice : null,
      store: best ? best.store : null,
      onSale: best ? best.onSale : false,
      lineTotal: best ? round2(best.unitPrice * item.quantity) : null,
    }
  })
  productsTotal = round2(productsTotal)

  let splitFuel = 0
  let splitMinutes = 0
  for (const id of usedStoreIds) {
    const s = storeById.get(id)
    splitFuel += estimateFuelCost(s && s.distance_km != null ? s.distance_km : 0, prefs)
    splitMinutes += estimateTravelMinutes(s)
  }
  splitFuel = round2(splitFuel)

  const singleProducts = single ? single.productsTotal : Infinity
  const singleEffective = single ? single.effectiveTotal : Infinity
  const splitEffective = round2(productsTotal + splitFuel)

  const grossSavings = round2(Math.max(0, singleProducts - productsTotal))
  const netSavings = round2(singleEffective - splitEffective)
  const addedFuel = round2(Math.max(0, splitFuel - (single ? single.fuelCost : 0)))
  const addedMinutes = Math.max(0, splitMinutes - (single ? single.travelMinutes : 0))

  const considered = allowSplit && mode !== 'convenience' && mode !== 'min_time' && usedStoreIds.size > 1
  const worthwhile = considered && grossSavings >= minSplitSavings && netSavings > 0

  let message
  if (!allowSplit) {
    message = 'בחרת לקנות בסופר אחד בלבד, לכן לא חישבנו פיצול בין חנויות.'
  } else if (mode === 'convenience') {
    message = 'במצב "נוחות" ההמלצה היא תמיד סופר אחד, ללא פיצול בין חנויות.'
  } else if (mode === 'min_time') {
    message = 'במצב "מינימום זמן" עדיף לרכז את הקנייה בחנות אחת ולא לפצל.'
  } else if (usedStoreIds.size <= 1) {
    message = 'המחירים הזולים ביותר מרוכזים ממילא בחנות אחת, כך שאין צורך בפיצול.'
  } else if (worthwhile) {
    message = `הפיצול חוסך ${formatILS(grossSavings)} ומוסיף רק ${addedMinutes} דקות נסיעה, לכן הפיצול משתלם.`
  } else {
    message = `הפיצול חוסך ${formatILS(grossSavings)} בלבד אך מוסיף ${addedMinutes} דקות נסיעה ועלות דלק של ${formatILS(addedFuel)}, לכן מומלץ לקנות בסופר אחד.`
  }

  return {
    lines,
    productsTotal,
    storesUsedCount: usedStoreIds.size,
    storesUsed: [...usedStoreIds].map((id) => storeById.get(id)),
    fuelCost: splitFuel,
    travelMinutes: splitMinutes,
    effectiveTotal: splitEffective,
    grossSavings,
    netSavings,
    addedFuel,
    addedMinutes,
    considered,
    worthwhile,
    minSplitSavings,
    message,
  }
}

/** Curated, sensible product swaps available at the recommended store. */
function findSubstitutions(items, storeId, priceIndex) {
  const out = []
  const inCart = new Set(items.map((i) => i.product_id))
  for (const sub of demoSubstitutions) {
    if (!inCart.has(sub.fromId)) continue
    const item = items.find((i) => i.product_id === sub.fromId)
    const fromRow = priceIndex.get(`${sub.fromId}:${storeId}`)
    const toRow = priceIndex.get(`${sub.toId}:${storeId}`)
    if (!fromRow || !toRow) continue
    const saving = round2((effectivePrice(fromRow) - effectivePrice(toRow)) * item.quantity)
    if (saving <= 0) continue
    const toProduct = demoProducts.find((p) => p.id === sub.toId)
    out.push({
      fromId: sub.fromId,
      fromName: item.name,
      toId: sub.toId,
      toName: toProduct ? toProduct.name : sub.toId,
      toEmoji: toProduct ? toProduct.emoji : '🛒',
      saving,
      note: sub.note || null,
    })
  }
  return out
}

/** Plain-language reason for the recommendation. */
function buildExplanation(rec, ctx) {
  if (!rec) return null
  const parts = [`בחרנו ב${rec.store.name} כי העלות הכוללת לאחר דלק היא הנמוכה ביותר (${formatILS(rec.effectiveTotal)})`]
  if (ctx.savingsVsAvg > 0) parts.push(`חיסכון של ${formatILS(ctx.savingsVsAvg)} מתחת לממוצע החלופות`)
  if (rec.distanceKm != null) parts.push(`המרחק (${rec.distanceKm} ק״מ, כ-${rec.travelMinutes} דקות נסיעה) עומד בהעדפות שהגדרת`)
  if (ctx.split && ctx.split.worthwhile) parts.push('ואם תבחר/י לפצל את הקנייה אפשר לחסוך מעט יותר')
  else if (ctx.split && ctx.split.considered) parts.push('והפיצול בין חנויות לא משתלם במקרה הזה')
  return parts.join(', ') + '.'
}

/**
 * Main entry point. Returns the full optimization result: per-store
 * evaluations (each with a 0–100 worthiness score), the recommended single
 * store, recommendation tags, a split analysis, alternatives, smart
 * substitutions, and a plain-language explanation.
 */
export function recommendOptimized(items, supermarkets, prices, prefs = {}) {
  const mode = prefs.optimizationMode || 'balanced'
  const maxDistanceKm = prefs.maxDistanceKm
  const itemCount = items.length
  const priceIndex = buildPriceIndex(prices)

  const reachable =
    maxDistanceKm != null
      ? supermarkets.filter((s) => s.distance_km == null || Number(s.distance_km) <= Number(maxDistanceKm))
      : supermarkets.slice()

  if (!itemCount || !reachable.length) {
    return {
      evaluations: [],
      recommended: null,
      tags: {},
      split: null,
      alternatives: [],
      substitutions: [],
      explanation: null,
      savingsVsAvg: 0,
      savingsVsWorst: 0,
      avgEffective: 0,
      mode,
      prefs,
      outOfRange: itemCount > 0 && reachable.length === 0,
    }
  }

  const evals = reachable.map((s) => evalStore(items, s, priceIndex, prefs))

  // Worthiness score, normalized across the candidate set, weighted by profile.
  const w = MODE_WEIGHTS[mode] || MODE_WEIGHTS.balanced
  const effs = evals.map((e) => e.effectiveTotal)
  const dists = evals.map((e) => (e.distanceKm == null ? 0 : e.distanceKm))
  const times = evals.map((e) => e.travelMinutes)
  const fuels = evals.map((e) => e.fuelCost)
  const minEff = Math.min(...effs), maxEff = Math.max(...effs)
  const minD = Math.min(...dists), maxD = Math.max(...dists)
  const minT = Math.min(...times), maxT = Math.max(...times)
  const minF = Math.min(...fuels), maxF = Math.max(...fuels)

  for (const e of evals) {
    const sEff = norm(e.effectiveTotal, minEff, maxEff, true)
    const sDist = norm(e.distanceKm == null ? 0 : e.distanceKm, minD, maxD, true)
    const sTime = norm(e.travelMinutes, minT, maxT, true)
    const sFuel = norm(e.fuelCost, minF, maxF, true)
    const sRating = (e.rating || 0) / 5
    const sConv = (e.convenienceScore || 0) / 5
    const base =
      w.eff * sEff + w.dist * sDist + w.time * sTime + w.fuel * sFuel + w.rating * sRating + w.conv * sConv
    const coverage = itemCount ? e.foundCount / itemCount : 1
    e.worthiness = Math.max(0, Math.min(100, Math.round(base * 100 * coverage)))
    e.subScores = {
      price: Math.round(sEff * 100),
      distance: Math.round(sDist * 100),
      time: Math.round(sTime * 100),
      fuel: Math.round(sFuel * 100),
      rating: Math.round(sRating * 100),
      convenience: Math.round(sConv * 100),
    }
  }

  // Stores that cover the whole list first, then by worthiness, then cheapest.
  const sorted = [...evals].sort((a, b) => {
    if (a.coversAll !== b.coversAll) return a.coversAll ? -1 : 1
    if (b.worthiness !== a.worthiness) return b.worthiness - a.worthiness
    return a.effectiveTotal - b.effectiveTotal
  })
  const recommended = sorted[0]

  const byCheap = [...evals].sort((a, b) => a.productsTotal - b.productsTotal)[0]
  const byNear = [...evals].sort(
    (a, b) => (a.distanceKm == null ? 1e9 : a.distanceKm) - (b.distanceKm == null ? 1e9 : b.distanceKm),
  )[0]
  const byConv = [...evals].sort((a, b) => b.convenienceScore - a.convenienceScore || b.rating - a.rating)[0]
  const tags = {
    cheapestId: byCheap && byCheap.store.id,
    closestId: byNear && byNear.store.id,
    bestValueId: recommended && recommended.store.id,
    mostConvenientId: byConv && byConv.store.id,
  }

  const split = analyzeSplit(items, reachable, priceIndex, recommended, prefs)
  const alternatives = sorted.filter((e) => e.store.id !== recommended.store.id).slice(0, 3)

  const avgEffective = round2(evals.reduce((s, e) => s + e.effectiveTotal, 0) / evals.length)
  const maxEffective = Math.max(...evals.map((e) => e.effectiveTotal))
  const savingsVsAvg = round2(Math.max(0, avgEffective - recommended.effectiveTotal))
  const savingsVsWorst = round2(Math.max(0, maxEffective - recommended.effectiveTotal))

  const substitutions = findSubstitutions(items, recommended.store.id, priceIndex)
  const explanation = buildExplanation(recommended, { savingsVsAvg, split })

  return {
    evaluations: sorted,
    recommended,
    tags,
    split,
    alternatives,
    substitutions,
    explanation,
    savingsVsAvg,
    savingsVsWorst,
    avgEffective,
    mode,
    prefs,
    outOfRange: false,
  }
}
