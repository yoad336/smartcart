import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Button from '../components/Button/Button'
import ListCard from '../components/ListCard/ListCard'

export default function HomePage() {
  const navigate = useNavigate()
  const { listName, totalUnits, savedLists, loadList } = useCart()

  function openList(list) {
    loadList(list)
    navigate('/compare')
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__head">
          <h1 className="page__title">שלום 👋</h1>
          <p className="page__subtitle">ברוך הבא ל־SMARTCART — בנה רשימה וחסוך בקנייה.</p>
        </div>

        {/* Hero section */}
        <div className="card card--hero row row--between">
          <div className="grow">
            <div className="small" style={{ opacity: 0.9 }}>הרשימה הנוכחית</div>
            <div className="h2" style={{ color: 'var(--color-on-primary)' }}>{listName}</div>
            <div className="small" style={{ opacity: 0.9 }}>{totalUnits} פריטים</div>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(totalUnits > 0 ? '/compare' : '/create')}
          >
            {totalUnits > 0 ? 'להשוואת מחירים' : 'בנה רשימה'}
          </Button>
        </div>

        {/* Quick actions */}
        <div className="grid grid--3 mt-4">
          <ActionTile emoji="🛒" label="צור סל חדש" onClick={() => navigate('/create')} />
          <ActionTile emoji="📊" label="השוואת מחירים" onClick={() => navigate('/compare')} />
          <ActionTile emoji="🧾" label="הסל החכם" onClick={() => navigate('/result')} />
        </div>

        {/* Previous lists section */}
        <h2 className="section-label">רשימות קודמות</h2>
        <div className="stack">
          {savedLists.map((list) => (
            <ListCard key={list.id} list={list} onOpen={openList} />
          ))}
        </div>

        {/* Deals section */}
        <h2 className="section-label">מבצעים והתראות</h2>
        <div className="card card--accent row row--between">
          <div className="media grow">
            <span className="emoji emoji--accent" aria-hidden="true">🏷️</span>
            <div>
              <div style={{ fontWeight: 600 }}>חלב 3% ירד במחיר ברמי לוי</div>
              <div className="small muted">מבצע לזמן מוגבל</div>
            </div>
          </div>
          <span className="badge badge--accent">−10%</span>
        </div>
      </div>
    </div>
  )
}

function ActionTile({ emoji, label, onClick }) {
  return (
    <button className="card center" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ fontSize: '28px' }}>{emoji}</div>
      <div className="mt-2" style={{ fontWeight: 600 }}>{label}</div>
    </button>
  )
}
