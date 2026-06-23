import Button from '../Button/Button'

/* Reusable component — repeats for every product, on the Create-list page.
   Two modes:
   - catalog row: shows an "add" button (onAdd)
   - selected row: shows a quantity stepper + remove (onInc / onDec / onRemove) */

export default function ProductCard({
  product,
  quantity = 0,
  mode = 'catalog',
  onAdd,
  onInc,
  onDec,
  onRemove,
}) {
  if (!product) return null

  return (
    <div className="card row row--between">
      <div className="media grow">
        <span className="emoji" aria-hidden="true">{product.emoji}</span>
        <div className="grow">
          <div style={{ fontWeight: 600 }}>{product.name}</div>
          <div className="small muted">{product.category}</div>
        </div>
      </div>

      {mode === 'catalog' ? (
        <Button small variant={quantity > 0 ? 'secondary' : 'primary'} onClick={onAdd}>
          {quantity > 0 ? `בעגלה · ${quantity}` : 'הוסף'}
        </Button>
      ) : (
        <div className="row">
          <div className="stepper">
            <button type="button" aria-label="הפחת" onClick={onDec}>−</button>
            <span>{quantity}</span>
            <button type="button" aria-label="הוסף" onClick={onInc}>+</button>
          </div>
          <button className="iconbtn" type="button" aria-label="מחק" onClick={onRemove}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
