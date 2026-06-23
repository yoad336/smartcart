/* SMARTCART · Dummy data (frontend-only, no backend).
   Module 6 requires all data to be placeholder/dummy.
   Supermarkets, products and prices for the demo, plus a few saved lists. */

export const demoSupermarkets = [
  {
    "id": "rami-levy",
    "name": "רמי לוי",
    "color": "#2563EB",
    "city": "תל אביב",
    "distance_km": 4.1,
    "mult": 0.92
  },
  {
    "id": "shufersal",
    "name": "שופרסל",
    "color": "#DC2626",
    "city": "תל אביב",
    "distance_km": 2.4,
    "mult": 1.08
  },
  {
    "id": "victory",
    "name": "ויקטורי",
    "color": "#16A34A",
    "city": "תל אביב",
    "distance_km": 6.8,
    "mult": 1
  },
  {
    "id": "yochananof",
    "name": "יוחננוף",
    "color": "#F59E0B",
    "city": "תל אביב",
    "distance_km": 9.2,
    "mult": 1.05
  },
  {
    "id": "tiv-taam",
    "name": "טיב טעם",
    "color": "#7C3AED",
    "city": "תל אביב",
    "distance_km": 12.5,
    "mult": 1.15
  }
]

export const demoProducts = [
  {
    "id": "milk",
    "name": "חלב 3% 1 ליטר",
    "category": "חלב וביצים",
    "emoji": "🥛",
    "unit": "יחידה",
    "base": 6.9
  },
  {
    "id": "eggs",
    "name": "ביצים L · 12 יחידות",
    "category": "חלב וביצים",
    "emoji": "🥚",
    "unit": "מארז",
    "base": 14.9
  },
  {
    "id": "cottage",
    "name": "קוטג׳ 5% · 250 גרם",
    "category": "חלב וביצים",
    "emoji": "🧀",
    "unit": "יחידה",
    "base": 6.5
  },
  {
    "id": "yellow",
    "name": "גבינה צהובה 200 גרם",
    "category": "חלב וביצים",
    "emoji": "🧀",
    "unit": "יחידה",
    "base": 12.9
  },
  {
    "id": "yogurt",
    "name": "יוגורט טבעי 500 גרם",
    "category": "חלב וביצים",
    "emoji": "🍶",
    "unit": "יחידה",
    "base": 5.9
  },
  {
    "id": "bread",
    "name": "לחם אחיד פרוס",
    "category": "מאפים",
    "emoji": "🍞",
    "unit": "יחידה",
    "base": 7.5
  },
  {
    "id": "challah",
    "name": "חלה",
    "category": "מאפים",
    "emoji": "🥖",
    "unit": "יחידה",
    "base": 12
  },
  {
    "id": "tomato",
    "name": "עגבניות 1 ק״ג",
    "category": "פירות וירקות",
    "emoji": "🍅",
    "unit": "ק״ג",
    "base": 6.9
  },
  {
    "id": "cucumber",
    "name": "מלפפונים 1 ק״ג",
    "category": "פירות וירקות",
    "emoji": "🥒",
    "unit": "ק״ג",
    "base": 5.9
  },
  {
    "id": "banana",
    "name": "בננות 1 ק״ג",
    "category": "פירות וירקות",
    "emoji": "🍌",
    "unit": "ק״ג",
    "base": 7.9
  },
  {
    "id": "apple",
    "name": "תפוחים 1 ק״ג",
    "category": "פירות וירקות",
    "emoji": "🍎",
    "unit": "ק״ג",
    "base": 8.9
  },
  {
    "id": "chicken",
    "name": "חזה עוף טרי 1 ק״ג",
    "category": "בשר ועוף",
    "emoji": "🍗",
    "unit": "ק״ג",
    "base": 32.9
  },
  {
    "id": "rice",
    "name": "אורז לבן 1 ק״ג",
    "category": "מוצרים יבשים",
    "emoji": "🍚",
    "unit": "יחידה",
    "base": 9.9
  },
  {
    "id": "pasta",
    "name": "פסטה 500 גרם",
    "category": "מוצרים יבשים",
    "emoji": "🍝",
    "unit": "יחידה",
    "base": 5.5
  },
  {
    "id": "oil",
    "name": "שמן קנולה 1 ליטר",
    "category": "מוצרים יבשים",
    "emoji": "🛢️",
    "unit": "יחידה",
    "base": 16.9
  },
  {
    "id": "water",
    "name": "מים מינרליים 6×1.5 ל׳",
    "category": "משקאות",
    "emoji": "💧",
    "unit": "מארז",
    "base": 18.9
  },
  {
    "id": "toilet",
    "name": "נייר טואלט 24 גלילים",
    "category": "ניקיון",
    "emoji": "🧻",
    "unit": "מארז",
    "base": 29.9
  }
]

export const demoPrices = [
  {
    "product_id": "milk",
    "supermarket_id": "rami-levy",
    "price": 6.6,
    "on_sale": true,
    "sale_price": 5.94
  },
  {
    "product_id": "eggs",
    "supermarket_id": "rami-levy",
    "price": 13.3,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cottage",
    "supermarket_id": "rami-levy",
    "price": 6.04,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yellow",
    "supermarket_id": "rami-levy",
    "price": 11.75,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yogurt",
    "supermarket_id": "rami-levy",
    "price": 5.32,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "bread",
    "supermarket_id": "rami-levy",
    "price": 6.97,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "tomato",
    "supermarket_id": "rami-levy",
    "price": 6.54,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cucumber",
    "supermarket_id": "rami-levy",
    "price": 5.65,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "banana",
    "supermarket_id": "rami-levy",
    "price": 7.27,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "apple",
    "supermarket_id": "rami-levy",
    "price": 8.19,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "chicken",
    "supermarket_id": "rami-levy",
    "price": 29.66,
    "on_sale": true,
    "sale_price": 25.21
  },
  {
    "product_id": "rice",
    "supermarket_id": "rami-levy",
    "price": 9.38,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "pasta",
    "supermarket_id": "rami-levy",
    "price": 5.26,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "oil",
    "supermarket_id": "rami-levy",
    "price": 15.55,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "water",
    "supermarket_id": "rami-levy",
    "price": 16.69,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "toilet",
    "supermarket_id": "rami-levy",
    "price": 28.33,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "milk",
    "supermarket_id": "shufersal",
    "price": 7.23,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "eggs",
    "supermarket_id": "shufersal",
    "price": 15.93,
    "on_sale": true,
    "sale_price": 12.74
  },
  {
    "product_id": "cottage",
    "supermarket_id": "shufersal",
    "price": 7.16,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yellow",
    "supermarket_id": "shufersal",
    "price": 14.07,
    "on_sale": true,
    "sale_price": 11.96
  },
  {
    "product_id": "yogurt",
    "supermarket_id": "shufersal",
    "price": 6.37,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "bread",
    "supermarket_id": "shufersal",
    "price": 8.02,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "challah",
    "supermarket_id": "shufersal",
    "price": 12.57,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "tomato",
    "supermarket_id": "shufersal",
    "price": 7.15,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cucumber",
    "supermarket_id": "shufersal",
    "price": 6.44,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "banana",
    "supermarket_id": "shufersal",
    "price": 8.7,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "apple",
    "supermarket_id": "shufersal",
    "price": 9.42,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "chicken",
    "supermarket_id": "shufersal",
    "price": 35.18,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "rice",
    "supermarket_id": "shufersal",
    "price": 10.26,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "pasta",
    "supermarket_id": "shufersal",
    "price": 6.06,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "oil",
    "supermarket_id": "shufersal",
    "price": 17.52,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "water",
    "supermarket_id": "shufersal",
    "price": 21.02,
    "on_sale": true,
    "sale_price": 18.5
  },
  {
    "product_id": "toilet",
    "supermarket_id": "shufersal",
    "price": 31,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "milk",
    "supermarket_id": "victory",
    "price": 6.62,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "eggs",
    "supermarket_id": "victory",
    "price": 14.6,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cottage",
    "supermarket_id": "victory",
    "price": 6.57,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yellow",
    "supermarket_id": "victory",
    "price": 12.51,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yogurt",
    "supermarket_id": "victory",
    "price": 5.66,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "bread",
    "supermarket_id": "victory",
    "price": 7.2,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "challah",
    "supermarket_id": "victory",
    "price": 11.52,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "tomato",
    "supermarket_id": "victory",
    "price": 6.97,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cucumber",
    "supermarket_id": "victory",
    "price": 6.14,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "banana",
    "supermarket_id": "victory",
    "price": 7.74,
    "on_sale": true,
    "sale_price": 6.35
  },
  {
    "product_id": "apple",
    "supermarket_id": "victory",
    "price": 9.26,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "chicken",
    "supermarket_id": "victory",
    "price": 32.24,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "rice",
    "supermarket_id": "victory",
    "price": 10.3,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "pasta",
    "supermarket_id": "victory",
    "price": 5.45,
    "on_sale": true,
    "sale_price": 4.91
  },
  {
    "product_id": "oil",
    "supermarket_id": "victory",
    "price": 17.07,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "water",
    "supermarket_id": "victory",
    "price": 18.9,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "toilet",
    "supermarket_id": "victory",
    "price": 30.2,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "milk",
    "supermarket_id": "yochananof",
    "price": 7.32,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "eggs",
    "supermarket_id": "yochananof",
    "price": 16.11,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cottage",
    "supermarket_id": "yochananof",
    "price": 7.1,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yellow",
    "supermarket_id": "yochananof",
    "price": 13.14,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yogurt",
    "supermarket_id": "yochananof",
    "price": 5.95,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "bread",
    "supermarket_id": "yochananof",
    "price": 7.95,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "challah",
    "supermarket_id": "yochananof",
    "price": 12.47,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "tomato",
    "supermarket_id": "yochananof",
    "price": 7.32,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cucumber",
    "supermarket_id": "yochananof",
    "price": 6.32,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "banana",
    "supermarket_id": "yochananof",
    "price": 8.13,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "apple",
    "supermarket_id": "yochananof",
    "price": 9.35,
    "on_sale": true,
    "sale_price": 7.95
  },
  {
    "product_id": "chicken",
    "supermarket_id": "yochananof",
    "price": 34.89,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "rice",
    "supermarket_id": "yochananof",
    "price": 10.4,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "pasta",
    "supermarket_id": "yochananof",
    "price": 6.01,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "oil",
    "supermarket_id": "yochananof",
    "price": 18.28,
    "on_sale": true,
    "sale_price": 16.45
  },
  {
    "product_id": "water",
    "supermarket_id": "yochananof",
    "price": 19.05,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "toilet",
    "supermarket_id": "yochananof",
    "price": 31.71,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "milk",
    "supermarket_id": "tiv-taam",
    "price": 7.7,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "eggs",
    "supermarket_id": "tiv-taam",
    "price": 16.96,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cottage",
    "supermarket_id": "tiv-taam",
    "price": 7.33,
    "on_sale": true,
    "sale_price": 6.45
  },
  {
    "product_id": "yellow",
    "supermarket_id": "tiv-taam",
    "price": 14.39,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "yogurt",
    "supermarket_id": "tiv-taam",
    "price": 6.51,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "bread",
    "supermarket_id": "tiv-taam",
    "price": 8.28,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "challah",
    "supermarket_id": "tiv-taam",
    "price": 14.08,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "tomato",
    "supermarket_id": "tiv-taam",
    "price": 8.01,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "cucumber",
    "supermarket_id": "tiv-taam",
    "price": 6.65,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "banana",
    "supermarket_id": "tiv-taam",
    "price": 8.9,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "apple",
    "supermarket_id": "tiv-taam",
    "price": 10.64,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "chicken",
    "supermarket_id": "tiv-taam",
    "price": 39.35,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "rice",
    "supermarket_id": "tiv-taam",
    "price": 10.93,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "pasta",
    "supermarket_id": "tiv-taam",
    "price": 6.26,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "oil",
    "supermarket_id": "tiv-taam",
    "price": 18.85,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "water",
    "supermarket_id": "tiv-taam",
    "price": 21.73,
    "on_sale": false,
    "sale_price": null
  },
  {
    "product_id": "toilet",
    "supermarket_id": "tiv-taam",
    "price": 34.73,
    "on_sale": false,
    "sale_price": null
  }
]

/* A few saved shopping lists (dummy) for the Home & Saved Lists pages. */
export const dummySavedLists = [
  {
    id: 'list-1',
    name: 'קנייה שבועית',
    createdAt: '2026-06-18',
    items: [
      { product_id: 'milk', quantity: 2 },
      { product_id: 'bread', quantity: 1 },
      { product_id: 'eggs', quantity: 1 },
      { product_id: 'yellow', quantity: 1 },
      { product_id: 'tomato', quantity: 1 },
    ],
  },
  {
    id: 'list-2',
    name: 'מוצרים קבועים',
    createdAt: '2026-06-12',
    items: [
      { product_id: 'milk', quantity: 3 },
      { product_id: 'eggs', quantity: 2 },
      { product_id: 'cottage', quantity: 1 },
    ],
  },
  {
    id: 'list-3',
    name: 'ארוחת שבת',
    createdAt: '2026-06-05',
    items: [
      { product_id: 'chicken', quantity: 1 },
      { product_id: 'challah', quantity: 2 },
      { product_id: 'tomato', quantity: 2 },
      { product_id: 'cucumber', quantity: 2 },
    ],
  },
]

/* Default working list used on Create / Compare / Result so there is
   always something to show. */
export const defaultListItems = [
  { product_id: 'milk', quantity: 2 },
  { product_id: 'bread', quantity: 1 },
  { product_id: 'eggs', quantity: 1 },
]
