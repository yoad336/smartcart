import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ListCard from '../components/ListCard/ListCard'

export default function SavedListsPage() {
  const navigate = useNavigate()
  const { savedLists, loadList } = useCart()

  function openList(list) {
    loadList(list)
    navigate('/compare')
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__head">
          <h1 className="page__title">רשימות שמורות</h1>
          <p className="page__subtitle">טען רשימה קודמת והשווה מחירים מחדש.</p>
        </div>

        {savedLists.length === 0 ? (
          <div className="empty">
            <div className="empty__emoji">📁</div>
            אין עדיין רשימות שמורות.
          </div>
        ) : (
          <div className="stack">
            {savedLists.map((list) => (
              <ListCard key={list.id} list={list} onOpen={openList} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
