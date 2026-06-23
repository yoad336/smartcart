import { createContext, useContext, useMemo, useState } from 'react'
import { defaultListItems, dummySavedLists } from '../data/dummyData'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [listName, setListName] = useState('הרשימה שלי')
  const [items, setItems] = useState(defaultListItems)

  function addItem(productId) {
    setItems((prev) => {
      const found = prev.find((i) => i.product_id === productId)
      if (found) {
        return prev.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product_id: productId, quantity: 1 }]
    })
  }

  function setQuantity(productId, quantity) {
    if (quantity <= 0) return removeItem(productId)
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    )
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product_id !== productId))
  }

  function clearList() {
    setItems([])
  }

  function loadList(saved) {
    setListName(saved.name)
    setItems(saved.items.map((i) => ({ ...i })))
  }

  const totalUnits = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const value = {
    listName,
    setListName,
    items,
    addItem,
    setQuantity,
    removeItem,
    clearList,
    loadList,
    totalUnits,
    savedLists: dummySavedLists,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
