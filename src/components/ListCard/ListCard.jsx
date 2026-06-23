import { getProduct } from '../../data/compare'
import Button from '../Button/Button'

/* Reusable component — repeats for every saved list (Home + Saved Lists). */

export default function ListCard({ list, onOpen }) {
  const count = list.items.reduce((sum, i) => sum + i.quantity, 0)
  const emojis = list.items
    .map((i) => getProduct(i.product_id)?.emoji)
    .filter(Boolean)
    .slice(0, 4)
    .join(' ')

  const date = new Date(list.createdAt).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="card row row--between">
      <div className="grow">
        <div style={{ fontWeight: 700 }}>{list.name}</div>
        <div className="small muted">{count} פריטים · {date}</div>
        <div className="mt-2" style={{ fontSize: '20px' }}>{emojis}</div>
      </div>
      <Button small variant="secondary" onClick={() => onOpen?.(list)}>
        טען והשווה
      </Button>
    </div>
  )
}
