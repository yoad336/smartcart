import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { compareStores, formatILS } from '../data/compare'
import Button from '../components/Button/Button'
import StoreCard from '../components/StoreCard/StoreCard'

export default function ComparePage() {
  const navigate = useNavigate()
  const { items, listName } = useCart()

  const ranked = useMemo(() => compareStores(items), [items])

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container empty">
          <div className="empty__emoji">📊</div>
          אין מוצרים להשוואה. חזור ובנה רשימה תחילה.
          <div className="mt-4">
            <Button onClick={() => navigate('/create')}>לבניית רשימה</Button>
          </div>
        </div>
      </div>
    )
  }

  const cheapest = ranked[0]
  const dearest = ranked[ranked.length - 1]
  const maxTotal = Math.max(...ranked.map((r) => r.total)) || 1
  const savings = Math.max(0, dearest.total - cheapest.total)

  return (
    <div className="page">
      <div className="container">
        <div className="page__head">
          <h1 className="page__title">השוואת מחירים</h1>
          <p className="page__subtitle">{listName} · השוואה בין {ranked.length} רשתות</p>
        </div>

        {/* Savings highlight */}
        <div className="card card--best row row--between">
          <div>
            <div className="small muted">החיסכון הגדול ביותר</div>
            <div className="h2" style={{ color: 'var(--color-success)' }}>{formatILS(savings)}</div>
            <div className="small muted">
              {cheapest.store.name} לעומת {dearest.store.name}
            </div>
          </div>
          <span style={{ fontSize: '34px' }}>💰</span>
        </div>

        {/* Store cards */}
        <div className="stack mt-6">
          {ranked.map((result, idx) => (
            <StoreCard
              key={result.store.id}
              result={result}
              best={idx === 0}
              widthPct={Math.round((result.total / maxTotal) * 100)}
            />
          ))}
        </div>

        <Button block className="mt-6" onClick={() => navigate('/result')}>
          הצג את הסל החכם ←
        </Button>
      </div>
    </div>
  )
}
