import { formatILS } from '../../data/compare'

/* Reusable component — repeats for every supermarket on the Compare page.
   `widthPct` drives the relative price bar (0–100). */

export default function StoreCard({ result, best = false, widthPct = 100 }) {
  const { store, total, missing, lines } = result
  const salesCount = lines.filter((l) => l.onSale).length

  return (
    <div className={'card' + (best ? ' card--best' : '')}>
      <div className="row row--between">
        <div className="media grow">
          <span className="store__logo" style={{ background: store.color }} aria-hidden="true">
            {store.name.charAt(0)}
          </span>
          <div className="grow">
            <div className="row" style={{ gap: '8px' }}>
              <span style={{ fontWeight: 700 }}>{store.name}</span>
              {best && <span className="badge badge--success">הכי משתלם</span>}
            </div>
            <div className="small muted">{store.distance_km} ק״מ · {store.city}</div>
          </div>
        </div>
        <div className="store__total">{formatILS(total)}</div>
      </div>

      <div className="store__bar">
        <span style={{ width: `${widthPct}%`, background: store.color }} />
      </div>

      <div className="row mt-3" style={{ gap: '8px', flexWrap: 'wrap' }}>
        {salesCount > 0 && <span className="badge badge--accent">{salesCount} מבצעים</span>}
        {missing > 0
          ? <span className="badge badge--muted">חסרים {missing} פריטים</span>
          : <span className="badge badge--secondary">כל הפריטים זמינים</span>}
      </div>
    </div>
  )
}
