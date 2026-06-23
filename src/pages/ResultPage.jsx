import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { bestSingleStore, bestSplitCart, formatILS } from '../data/compare'
import Button from '../components/Button/Button'

export default function ResultPage() {
  const navigate = useNavigate()
  const { items, listName } = useCart()

  const single = useMemo(() => bestSingleStore(items), [items])
  const split = useMemo(() => bestSplitCart(items), [items])

  if (items.length === 0 || !single) {
    return (
      <div className="page">
        <div className="container empty">
          <div className="empty__emoji">🧾</div>
          אין סל להצגה. בנה רשימה כדי לקבל המלצה.
          <div className="mt-4">
            <Button onClick={() => navigate('/create')}>לבניית רשימה</Button>
          </div>
        </div>
      </div>
    )
  }

  const savings = Math.max(0, single.total - split.total)

  return (
    <div className="page">
      <div className="container">
        <div className="page__head">
          <h1 className="page__title">הסל החכם</h1>
          <p className="page__subtitle">{listName} · ההמלצה הזולה ביותר עבורך</p>
        </div>

        {/* Recommendation hero */}
        <div className="card card--hero">
          <div className="small" style={{ opacity: 0.9 }}>ההמלצה: קנייה בחנות אחת</div>
          <div className="h2" style={{ color: 'var(--color-on-primary)' }}>{single.store.name}</div>
          <div style={{ fontSize: '34px', fontWeight: 700 }}>{formatILS(single.total)}</div>
          <div className="small" style={{ opacity: 0.9 }}>{single.store.distance_km} ק״מ ממך</div>
        </div>

        {/* Stats */}
        <div className="grid grid--2 mt-4">
          <div className="stat">
            <div className="stat__value">{formatILS(split.total)}</div>
            <div className="stat__label">אם מפצלים בין {split.storesUsed} חנויות</div>
          </div>
          <div className="stat">
            <div className="stat__value" style={{ color: 'var(--color-success)' }}>{formatILS(savings)}</div>
            <div className="stat__label">חיסכון אפשרי בפיצול</div>
          </div>
        </div>

        {/* Itemized list */}
        <h2 className="section-label">פירוט הסל</h2>
        <div className="stack">
          {single.lines.map((line) => (
            <div key={line.product_id} className="card row row--between">
              <div className="media grow">
                <span className="emoji" aria-hidden="true">{line.product?.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{line.product?.name}</div>
                  <div className="small muted">
                    {line.quantity} × {line.available ? formatILS(line.unitPrice) : '—'}
                    {line.onSale && <span className="badge badge--accent mt-2" style={{ marginRight: 8 }}>מבצע</span>}
                  </div>
                </div>
              </div>
              <div className="price">
                {line.available ? formatILS(line.lineTotal) : 'לא זמין'}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="card row row--between mt-4">
          <span className="h3">סה״כ לתשלום</span>
          <span className="h2" style={{ color: 'var(--color-primary)' }}>{formatILS(single.total)}</span>
        </div>

        {savings > 0 && (
          <div className="alert alert--success mt-4">
            אפשר לחסוך עוד {formatILS(savings)} בפיצול הקנייה בין {split.storesUsed} חנויות.
          </div>
        )}

        <div className="row mt-6" style={{ gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate('/compare')}>חזרה להשוואה</Button>
          <Button onClick={() => navigate('/create')}>ערוך רשימה</Button>
        </div>
      </div>
    </div>
  )
}
