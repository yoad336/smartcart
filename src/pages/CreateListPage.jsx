import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { products } from '../data/compare'
import Button from '../components/Button/Button'
import ProductCard from '../components/ProductCard/ProductCard'

const CATEGORIES = ['הכל', ...Array.from(new Set(products.map((p) => p.category)))]

export default function CreateListPage() {
  const navigate = useNavigate()
  const { listName, setListName, items, addItem, setQuantity, removeItem } = useCart()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('הכל')

  const qtyById = useMemo(() => {
    const map = {}
    items.forEach((i) => (map[i.product_id] = i.quantity))
    return map
  }, [items])

  const filtered = products.filter((p) => {
    const okCat = category === 'הכל' || p.category === category
    const okText = p.name.includes(query.trim())
    return okCat && okText
  })

  return (
    <div className="page">
      <div className="container">
        <div className="page__head">
          <h1 className="page__title">יצירת רשימת קניות</h1>
          <p className="page__subtitle">חפש מוצרים, הוסף לרשימה ועדכן כמויות.</p>
        </div>

        {/* List name */}
        <label className="small muted" htmlFor="listname">שם הרשימה</label>
        <input
          id="listname"
          className="input mt-2"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="לדוגמה: קנייה שבועית"
        />

        {/* Selected items */}
        <h2 className="section-label">המוצרים שלי ({items.length})</h2>
        {items.length === 0 ? (
          <div className="empty">
            <div className="empty__emoji">🛒</div>
            הרשימה ריקה — הוסף מוצרים מהקטלוג למטה.
          </div>
        ) : (
          <div className="stack">
            {items.map((item) => (
              <ProductCard
                key={item.product_id}
                product={products.find((p) => p.id === item.product_id)}
                quantity={item.quantity}
                mode="selected"
                onInc={() => setQuantity(item.product_id, item.quantity + 1)}
                onDec={() => setQuantity(item.product_id, item.quantity - 1)}
                onRemove={() => removeItem(item.product_id)}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <Button block className="mt-4" onClick={() => navigate('/compare')}>
            המשך להשוואת מחירים ←
          </Button>
        )}

        {/* Catalog */}
        <h2 className="section-label">קטלוג מוצרים</h2>
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש מוצר…"
          />
        </div>

        <div className="row mt-3" style={{ flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={'badge ' + (category === c ? 'badge--secondary' : 'badge--muted')}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="stack mt-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={qtyById[p.id] || 0}
              mode="catalog"
              onAdd={() => addItem(p.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty">לא נמצאו מוצרים לחיפוש זה.</div>
          )}
        </div>
      </div>
    </div>
  )
}
