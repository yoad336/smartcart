/* =============================================================
   SMARTCART · App (consolidated)
   This single file holds the whole React layer of the app:
     • Inline SVG icons
     • Auth & Cart contexts (with their providers + hooks)
     • Shared UI components (Header, BottomNav, PrivateRoute)
     • All screens (Login, Dashboard, CreateList, AreaPreferences,
       PriceComparison, SmartCartResult, SavedLists, Profile, Premium)
     • The App router
   Pure logic (price engine + data service) lives in support.js, the
   Supabase client in supabaseClient.js, and the demo catalog in data.js.
   ============================================================= */
import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import {
  fetchCatalog,
  fetchSavedLists,
  saveList,
  deleteList,
  fetchPreferences,
  savePreferences,
  fetchProfile,
  recommendCart,
  formatILS,
} from './support'



/* ===================== Icons ===================== */

/* Minimal inline SVG icons (stroke style, inherit currentColor).
   Keeps the bundle small and avoids pulling in an icon library
   for a student MVP. Each icon accepts size + any svg props. */

function base(size, props) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props,
  }
}

export const HomeIcon = ({ size = 22, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 9.5 12 3l9 6.5" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
)

export const ListIcon = ({ size = 22, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1" />
    <circle cx="3.5" cy="12" r="1" />
    <circle cx="3.5" cy="18" r="1" />
  </svg>
)

export const CompareIcon = ({ size = 22, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 6h7M3 18h7" />
    <path d="M14 6h7M14 18h7" />
    <path d="M6.5 3v6M17.5 15v6" />
  </svg>
)

export const CartIcon = ({ size = 22, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.2l2.3 12.4a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 7H5.2" />
  </svg>
)

export const UserIcon = ({ size = 22, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

export const PlusIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MinusIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14" />
  </svg>
)

/* In RTL "back" visually points to the right */
export const BackIcon = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const SearchIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

export const TrashIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
)

export const StarIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3z" />
  </svg>
)

export const PinIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const SettingsIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
)

export const LogoutIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
    <path d="M9 12h11M16 8l4 4-4 4" />
  </svg>
)

export const CheckIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M4 12.5 9 17l11-11" />
  </svg>
)

export const TagIcon = ({ size = 16, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 11.5 11.5 3H20a1 1 0 0 1 1 1v8.5L12.5 21 3 11.5z" />
    <circle cx="16" cy="8" r="1.3" />
  </svg>
)

export const SaveIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M5 3h11l3 3v15H5z" />
    <path d="M8 3v5h7M8 14h8v7H8z" />
  </svg>
)

export const SparkIcon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
)


/* ===================== Auth context ===================== */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Load any existing session on first render
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // 2. Keep state in sync with login / logout / token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { data, error }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value = { session, user, loading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}


/* ===================== Cart context ===================== */

const CartContext = createContext(null)

const LIST_KEY = 'smartcart.currentList'
const PREFS_KEY = 'smartcart.preferences'

const DEFAULT_PREFS = {
  city: 'תל אביב',
  maxDistanceKm: 10,
  mode: 'single', // 'single' = קנייה בחנות אחת | 'split' = פיצול לחיסכון מרבי
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * Holds the list the user is currently building/comparing, plus their
 * area & shopping preferences. Persisted to localStorage so a refresh
 * mid-flow does not lose progress. Saved lists still live in Supabase.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load(LIST_KEY, []))
  const [listName, setListName] = useState(() => load(LIST_KEY + '.name', 'הקנייה השבועית'))
  const [preferences, setPreferences] = useState(() => load(PREFS_KEY, DEFAULT_PREFS))

  useEffect(() => {
    localStorage.setItem(LIST_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem(LIST_KEY + '.name', JSON.stringify(listName))
  }, [listName])

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences))
  }, [preferences])

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          emoji: product.emoji,
          category: product.category,
          quantity: 1,
        },
      ]
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
    setListName('הקנייה השבועית')
  }

  function loadList(name, loadedItems) {
    setListName(name)
    setItems(loadedItems)
  }

  function updatePreferences(patch) {
    setPreferences((prev) => ({ ...prev, ...patch }))
  }

  const value = {
    items,
    listName,
    setListName,
    preferences,
    addItem,
    setQuantity,
    removeItem,
    clearList,
    loadList,
    updatePreferences,
    totalUnits: items.reduce((sum, i) => sum + i.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}


/* ===================== Header ===================== */

/**
 * Page header. Shows a title (+ optional subtitle) and an optional
 * back button. In RTL the back chevron points right, as expected.
 */
function Header({ title, subtitle, showBack = false, onBack, action }) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBack) return onBack()
    navigate(-1)
  }

  return (
    <header className="header">
      {showBack && (
        <button className="header__back" onClick={handleBack} aria-label="חזרה">
          <BackIcon />
        </button>
      )}
      <div className="grow">
        <div className="header__title">{title}</div>
        {subtitle && <div className="header__subtitle">{subtitle}</div>}
      </div>
      {action}
    </header>
  )
}


/* ===================== BottomNav ===================== */

const TABS = [
  { to: '/', label: 'בית', Icon: HomeIcon },
  { to: '/saved', label: 'רשימות', Icon: ListIcon },
  { to: '/compare', label: 'השוואה', Icon: CompareIcon },
  { to: '/result', label: 'עגלה', Icon: CartIcon },
  { to: '/profile', label: 'פרופיל', Icon: UserIcon },
]

/** Fixed bottom navigation. Hidden on the auth screen (see App routing). */
function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav" aria-label="ניווט ראשי">
      {TABS.map(({ to, label, Icon }) => {
        const active = pathname === to
        return (
          <button
            key={to}
            className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate(to)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} className="bottom-nav__icon" />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}


/* ===================== PrivateRoute ===================== */

/** Wraps protected pages. Sends signed-out users to /login. */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="center-screen">
        <div>
          <div className="spinner" />
          <p className="muted mt-3">טוען…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}


/* ===================== Page · Login ===================== */

function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const isRegister = mode === 'register'

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!form.email || !form.password) {
      setError('יש למלא אימייל וסיסמה')
      return
    }
    if (isRegister && form.password.length < 6) {
      setError('הסיסמה צריכה להכיל לפחות 6 תווים')
      return
    }

    setBusy(true)
    try {
      if (isRegister) {
        const { error } = await signUp(form)
        if (error) throw error
        setInfo('נרשמת בהצלחה! אם נדרש אימות אימייל, בדקו את תיבת הדואר. אפשר להתחבר עכשיו.')
        setMode('login')
      } else {
        const { error } = await signIn(form)
        if (error) throw error
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(translateAuthError(err.message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page page--centered">
      <div className="brand">
        <div className="brand__mark">
          <CartIcon size={28} />
        </div>
      </div>
      <div className="brand__name text-center">SMART<span>CART</span></div>
      <p className="muted text-center mb-4">בונים עגלת קניות חכמה וחוסכים בכל קנייה</p>

      <div className="card">
        <div className="tabs">
          <button
            className={`tabs__btn ${!isRegister ? 'tabs__btn--active' : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            כניסה
          </button>
          <button
            className={`tabs__btn ${isRegister ? 'tabs__btn--active' : ''}`}
            onClick={() => setMode('register')}
            type="button"
          >
            הרשמה
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="alert alert--info">
            כדי שהכניסה תעבוד, הגדירו קובץ <b>.env</b> עם פרטי Supabase (ראו README).
          </div>
        )}
        {error && <div className="alert alert--error">{error}</div>}
        {info && <div className="alert alert--success">{info}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="field">
              <label className="field__label" htmlFor="fullName">שם מלא</label>
              <input
                id="fullName"
                className="input"
                placeholder="ישראל ישראלי"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="email"
              dir="ltr"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="לפחות 6 תווים"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              dir="ltr"
            />
          </div>

          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? 'רגע…' : isRegister ? 'יצירת חשבון' : 'כניסה'}
          </button>
        </form>
      </div>

      <p className="small muted text-center mt-4">
        פרויקט סטודנטים · גרסת MVP · React + Supabase
      </p>
    </div>
  )
}

function translateAuthError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('invalid login')) return 'אימייל או סיסמה שגויים'
  if (m.includes('already registered') || m.includes('already exists'))
    return 'כתובת האימייל כבר רשומה'
  if (m.includes('email not confirmed')) return 'יש לאמת את האימייל לפני הכניסה'
  if (m.includes('password')) return 'בעיה בסיסמה – נסו סיסמה ארוכה יותר'
  return message || 'אירעה שגיאה, נסו שוב'
}


/* ===================== Page · Dashboard ===================== */

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalUnits, listName, preferences } = useCart()

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'אורח'

  const actions = [
    {
      to: '/create',
      title: 'יצירת רשימת קניות',
      desc: 'הוסיפו מוצרים וכמויות',
      color: 'var(--color-primary)',
      Icon: PlusIcon,
    },
    {
      to: '/preferences',
      title: 'אזור והעדפות',
      desc: `${preferences.city} · עד ${preferences.maxDistanceKm} ק״מ`,
      color: 'var(--color-accent)',
      Icon: PinIcon,
    },
    {
      to: '/compare',
      title: 'השוואת מחירים',
      desc: 'מצאו את הסופר המשתלם',
      color: 'var(--color-secondary)',
      Icon: CompareIcon,
    },
    {
      to: '/result',
      title: 'העגלה החכמה',
      desc: 'התוצאה המומלצת עבורכם',
      color: '#7C3AED',
      Icon: CartIcon,
    },
  ]

  return (
    <div className="page">
      <header className="header">
        <div className="grow">
          <div className="header__subtitle">שלום 👋</div>
          <div className="header__title">{firstName}</div>
        </div>
        <button
          className="header__back"
          onClick={() => navigate('/premium')}
          aria-label="פרימיום"
          style={{ color: 'var(--color-accent)' }}
        >
          <StarIcon />
        </button>
      </header>

      {/* current list snapshot */}
      <div className="card" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
        <div className="row row--between">
          <div>
            <div className="small" style={{ opacity: 0.85 }}>הרשימה הנוכחית</div>
            <div className="h3" style={{ color: '#fff' }}>{listName}</div>
          </div>
          <div className="text-center">
            <div className="h1" style={{ color: '#fff' }}>{totalUnits}</div>
            <div className="small" style={{ opacity: 0.85 }}>פריטים</div>
          </div>
        </div>
        <button
          className="btn btn--ghost mt-4"
          style={{ background: '#fff' }}
          onClick={() => navigate(items.length ? '/compare' : '/create')}
        >
          {items.length ? 'להשוואת מחירים' : 'בואו נתחיל רשימה'}
        </button>
      </div>

      <h2 className="h3 mt-6 mb-3">מה עושים?</h2>
      <div className="col gap-3">
        {actions.map((a) => (
          <button key={a.to} className="action-tile" onClick={() => navigate(a.to)}>
            <span className="action-tile__icon" style={{ background: a.color }}>
              <a.Icon size={22} />
            </span>
            <span className="grow">
              <span className="label" style={{ display: 'block', fontWeight: 700 }}>
                {a.title}
              </span>
              <span className="small muted">{a.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <button className="btn btn--ghost mt-4" onClick={() => navigate('/saved')}>
        <ListIcon size={18} /> הרשימות השמורות שלי
      </button>
    </div>
  )
}


/* ===================== Page · CreateList ===================== */

function CreateList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    items,
    listName,
    setListName,
    addItem,
    setQuantity,
    removeItem,
    totalUnits,
  } = useCart()

  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('הכל')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCatalog().then(({ products }) => {
      setCatalog(products)
      setLoading(false)
    })
  }, [])

  const categories = useMemo(() => {
    const set = new Set(catalog.map((p) => p.category).filter(Boolean))
    return ['הכל', ...set]
  }, [catalog])

  const filtered = useMemo(() => {
    return catalog.filter((p) => {
      const matchCat = category === 'הכל' || p.category === category
      const matchQuery = !query || p.name.includes(query)
      return matchCat && matchQuery
    })
  }, [catalog, query, category])

  const inListIds = useMemo(
    () => new Set(items.map((i) => i.product_id)),
    [items]
  )

  function quantityOf(productId) {
    return items.find((i) => i.product_id === productId)?.quantity ?? 0
  }

  async function handleSave() {
    if (!items.length) return
    setSaving(true)
    setToast(null)
    try {
      await saveList(user.id, listName || 'רשימת קניות', items)
      setToast({ type: 'success', text: 'הרשימה נשמרה בהצלחה' })
    } catch (err) {
      setToast({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <Header title="רשימת קניות" subtitle="הוסיפו מוצרים וכמויות" showBack />

      <div className="field">
        <label className="field__label" htmlFor="listName">שם הרשימה</label>
        <input
          id="listName"
          className="input"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="לדוגמה: הקנייה השבועית"
        />
      </div>

      {/* selected items */}
      {items.length > 0 && (
        <>
          <div className="row row--between mb-3">
            <h2 className="h3">המוצרים שלי</h2>
            <span className="badge badge--primary">{totalUnits} פריטים</span>
          </div>
          <ul>
            {items.map((it) => (
              <li className="list-item" key={it.product_id}>
                <span className="product-emoji">{it.emoji || '🛒'}</span>
                <span className="grow">
                  <span className="label" style={{ display: 'block', fontWeight: 700 }}>
                    {it.name}
                  </span>
                  <span className="small muted">{it.category}</span>
                </span>
                <span className="qty">
                  <button
                    className="qty__btn"
                    onClick={() => setQuantity(it.product_id, it.quantity - 1)}
                    aria-label="הפחתת כמות"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="qty__value">{it.quantity}</span>
                  <button
                    className="qty__btn"
                    onClick={() => setQuantity(it.product_id, it.quantity + 1)}
                    aria-label="הוספת כמות"
                  >
                    <PlusIcon size={16} />
                  </button>
                </span>
                <button
                  className="qty__btn"
                  style={{ color: 'var(--color-error)' }}
                  onClick={() => removeItem(it.product_id)}
                  aria-label="הסרה"
                >
                  <TrashIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="divider" />
        </>
      )}

      {/* catalog */}
      <h2 className="h3 mb-3">הוספת מוצרים</h2>

      <div className="search field">
        <span className="search__icon"><SearchIcon /></span>
        <input
          className="input"
          placeholder="חיפוש מוצר…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="chip-row mb-4">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'chip--active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="center-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty__emoji">🔍</div>
          לא נמצאו מוצרים בשם הזה
        </div>
      ) : (
        <ul>
          {filtered.map((p) => {
            const qty = quantityOf(p.id)
            const inList = inListIds.has(p.id)
            return (
              <li className="list-item" key={p.id}>
                <span className="product-emoji">{p.emoji || '🛒'}</span>
                <span className="grow">
                  <span className="label" style={{ display: 'block', fontWeight: 700 }}>
                    {p.name}
                  </span>
                  <span className="small muted">{p.category} · {p.unit}</span>
                </span>
                {inList ? (
                  <span className="badge badge--best">בעגלה · {qty}</span>
                ) : (
                  <button className="btn btn--ghost btn--sm" onClick={() => addItem(p)}>
                    <PlusIcon size={16} /> הוספה
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {toast && (
        <div className={`alert alert--${toast.type} mt-4`}>{toast.text}</div>
      )}

      {/* sticky-ish actions */}
      <div className="col gap-3 mt-6">
        <button
          className="btn btn--primary"
          disabled={!items.length}
          onClick={() => navigate('/compare')}
        >
          <CompareIcon size={18} /> המשך להשוואת מחירים
        </button>
        <button
          className="btn btn--ghost"
          disabled={!items.length || saving}
          onClick={handleSave}
        >
          <SaveIcon size={18} /> {saving ? 'שומר…' : 'שמירת הרשימה'}
        </button>
      </div>
    </div>
  )
}


/* ===================== Page · AreaPreferences ===================== */

const CITIES = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון', 'נתניה', 'פתח תקווה', 'אשדוד']

function AreaPreferences() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { preferences, updatePreferences } = useCart()

  const [draft, setDraft] = useState(preferences)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Load saved prefs from the DB (if any) and merge them in.
  useEffect(() => {
    if (!user) return
    fetchPreferences(user.id)
      .then((p) => {
        if (p) {
          const merged = {
            city: p.city ?? preferences.city,
            maxDistanceKm: Number(p.max_distance_km ?? preferences.maxDistanceKm),
            mode: p.mode ?? preferences.mode,
          }
          setDraft(merged)
          updatePreferences(merged)
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function set(key, value) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setToast(null)
    updatePreferences(draft)
    try {
      await savePreferences(user.id, draft)
      setToast({ type: 'success', text: 'ההעדפות נשמרו' })
    } catch (err) {
      setToast({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <Header title="אזור והעדפות" subtitle="כדי שנמצא עבורכם את הסופר הנכון" showBack />

      <div className="card">
        <div className="row gap-2 mb-3">
          <PinIcon size={18} className="text-primary" />
          <span className="label" style={{ fontWeight: 700 }}>מיקום</span>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="city">עיר</label>
          <select
            id="city"
            className="select"
            value={draft.city}
            onChange={(e) => set('city', e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <div className="row row--between">
            <label className="field__label" htmlFor="distance" style={{ marginBottom: 0 }}>
              מרחק מרבי
            </label>
            <span className="badge badge--primary">{draft.maxDistanceKm} ק״מ</span>
          </div>
          <input
            id="distance"
            type="range"
            min="1"
            max="30"
            step="1"
            value={draft.maxDistanceKm}
            onChange={(e) => set('maxDistanceKm', Number(e.target.value))}
            style={{ width: '100%', marginTop: 12, accentColor: 'var(--color-primary)' }}
          />
          <div className="row row--between small muted">
            <span>1 ק״מ</span>
            <span>30 ק״מ</span>
          </div>
        </div>
      </div>

      <h2 className="h3 mt-6 mb-3">שיטת קנייה</h2>
      <div className="col gap-3">
        <ModeCard
          active={draft.mode === 'single'}
          onClick={() => set('mode', 'single')}
          Icon={CartIcon}
          title="קנייה בחנות אחת"
          desc="הכול מסופר אחד – הכי נוח, חוסכים נסיעות"
        />
        <ModeCard
          active={draft.mode === 'split'}
          onClick={() => set('mode', 'split')}
          Icon={SparkIcon}
          title="חיסכון מרבי"
          desc="כל מוצר במחיר הזול ביותר – ייתכן פיצול בין חנויות"
        />
      </div>

      {toast && <div className={`alert alert--${toast.type} mt-4`}>{toast.text}</div>}

      <div className="col gap-3 mt-6">
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'שומר…' : 'שמירה והמשך'}
        </button>
        <button className="btn btn--ghost" onClick={() => navigate('/compare')}>
          להשוואת מחירים
        </button>
      </div>
    </div>
  )
}

function ModeCard({ active, onClick, Icon, title, desc }) {
  return (
    <button
      type="button"
      className="action-tile"
      onClick={onClick}
      style={active ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 2px var(--color-primary-soft)' } : undefined}
    >
      <span
        className="action-tile__icon"
        style={{ background: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
      >
        <Icon size={22} />
      </span>
      <span className="grow">
        <span className="label" style={{ display: 'block', fontWeight: 700 }}>{title}</span>
        <span className="small muted">{desc}</span>
      </span>
      {active && <CheckIcon size={20} className="text-primary" />}
    </button>
  )
}


/* ===================== Page · PriceComparison ===================== */

function PriceComparison() {
  const navigate = useNavigate()
  const { items, preferences } = useCart()

  const [catalog, setCatalog] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCatalog().then((c) => {
      setCatalog(c)
      setNotice(c.notice)
      setLoading(false)
    })
  }, [])

  const result = useMemo(() => {
    if (!catalog || !items.length) return null
    return recommendCart(items, catalog.supermarkets, catalog.prices, {
      mode: preferences.mode,
      maxDistanceKm: preferences.maxDistanceKm,
    })
  }, [catalog, items, preferences])

  if (!items.length) {
    return (
      <div className="page">
        <Header title="השוואת מחירים" showBack />
        <div className="empty">
          <div className="empty__emoji">🛒</div>
          <p>הרשימה ריקה. הוסיפו מוצרים כדי להשוות מחירים.</p>
          <button className="btn btn--primary mt-4" onClick={() => navigate('/create')}>
            יצירת רשימה
          </button>
        </div>
      </div>
    )
  }

  if (loading || !result) {
    return (
      <div className="page">
        <Header title="השוואת מחירים" showBack />
        <div className="center-screen">
          <div>
            <div className="spinner" />
            <p className="muted mt-3">משווים מחירים…</p>
          </div>
        </div>
      </div>
    )
  }

  const stores = result.comparison
  const maxTotal = Math.max(...stores.map((s) => s.total)) || 1
  const cheapest = stores[0]
  const dearest = stores[stores.length - 1]
  const maxSaving = dearest && cheapest ? dearest.total - cheapest.total : 0

  return (
    <div className="page">
      <Header
        title="השוואת מחירים"
        subtitle={`${preferences.city} · עד ${preferences.maxDistanceKm} ק״מ`}
        showBack
      />

      {notice && <div className="alert alert--info">{notice}</div>}

      {/* savings highlight */}
      <div
        className="card"
        style={{ background: 'var(--color-secondary)', color: '#fff', border: 'none' }}
      >
        <div className="small" style={{ opacity: 0.9 }}>חיסכון פוטנציאלי בין הזול ליקר</div>
        <div className="row row--between mt-2">
          <div className="h1" style={{ color: '#fff' }}>{formatILS(maxSaving)}</div>
          <CartIcon size={34} />
        </div>
        <div className="small mt-2" style={{ opacity: 0.9 }}>
          הסל הזול ביותר: {cheapest.store.name} · {formatILS(cheapest.total)}
        </div>
      </div>

      <h2 className="h3 mt-6 mb-3">לפי סופרמרקט</h2>

      <div className="col gap-3">
        {stores.map((s, idx) => {
          const best = idx === 0
          const salesCount = s.lines.filter((l) => l.onSale).length
          return (
            <div key={s.store.id} className={`store-card ${best ? 'store-card--best' : ''}`}>
              <div className="row row--between">
                <div className="row gap-3">
                  <span className="store-logo" style={{ background: s.store.color }}>
                    {s.store.name.charAt(0)}
                  </span>
                  <div>
                    <div className="label" style={{ fontWeight: 700 }}>{s.store.name}</div>
                    <div className="small muted row gap-2">
                      <PinIcon size={13} /> {s.store.distance_km} ק״מ
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="price-big">{formatILS(s.total)}</div>
                  {best && <span className="badge badge--best"><CheckIcon size={13} /> הכי משתלם</span>}
                </div>
              </div>

              {/* comparison bar */}
              <div className="bar mt-3">
                <div
                  className="bar__fill"
                  style={{
                    width: `${Math.max(8, (s.total / maxTotal) * 100)}%`,
                    background: best ? 'var(--color-secondary)' : 'var(--color-primary)',
                  }}
                />
              </div>

              <div className="row gap-2 mt-3">
                {salesCount > 0 && (
                  <span className="badge badge--sale"><TagIcon size={13} /> {salesCount} מבצעים</span>
                )}
                {s.missingCount > 0 ? (
                  <span className="badge badge--muted">חסרים {s.missingCount} מוצרים</span>
                ) : (
                  <span className="badge badge--primary">כל המוצרים זמינים</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button className="btn btn--primary mt-6" onClick={() => navigate('/result')}>
        <CartIcon size={18} /> לעגלה החכמה המומלצת
      </button>
    </div>
  )
}


/* ===================== Page · SmartCartResult ===================== */

function SmartCartResult() {
  const navigate = useNavigate()
  const { items, listName, preferences } = useCart()

  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCatalog().then((c) => {
      setCatalog(c)
      setLoading(false)
    })
  }, [])

  const result = useMemo(() => {
    if (!catalog || !items.length) return null
    return recommendCart(items, catalog.supermarkets, catalog.prices, {
      mode: preferences.mode,
      maxDistanceKm: preferences.maxDistanceKm,
    })
  }, [catalog, items, preferences])

  if (!items.length) {
    return (
      <div className="page">
        <Header title="העגלה החכמה" showBack />
        <div className="empty">
          <div className="empty__emoji">✨</div>
          <p>אין עדיין עגלה. צרו רשימה ונבנה לכם עגלה חכמה.</p>
          <button className="btn btn--primary mt-4" onClick={() => navigate('/create')}>
            יצירת רשימה
          </button>
        </div>
      </div>
    )
  }

  if (loading || !result) {
    return (
      <div className="page">
        <Header title="העגלה החכמה" showBack />
        <div className="center-screen">
          <div>
            <div className="spinner" />
            <p className="muted mt-3">בונים עגלה…</p>
          </div>
        </div>
      </div>
    )
  }

  const isSplit = result.mode === 'split'
  const rec = result.recommended // single: {store, lines, total} | split: {lines, total, storesUsedCount}
  const lines = rec?.lines ?? []
  const total = rec?.total ?? 0
  const store = result.single?.store

  return (
    <div className="page">
      <Header title="העגלה החכמה" subtitle={listName} showBack />

      {/* hero recommendation */}
      <div
        className="card"
        style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}
      >
        <div className="row gap-2">
          <SparkIcon size={18} />
          <span className="small" style={{ opacity: 0.9 }}>
            {isSplit ? 'חיסכון מרבי' : 'קנייה בחנות אחת'}
          </span>
        </div>

        <div className="h1 mt-2" style={{ color: '#fff' }}>{formatILS(total)}</div>

        {isSplit ? (
          <div className="small" style={{ opacity: 0.95 }}>
            פיצול חכם בין {rec.storesUsedCount} חנויות · חיסכון של {formatILS(result.savingsVsSingle)} לעומת חנות אחת
          </div>
        ) : (
          <div className="row gap-2 small" style={{ opacity: 0.95 }}>
            <CartIcon size={15} /> מומלץ לקנות הכול ב{store ? store.name : '—'}
            {store && <span className="row gap-1"><PinIcon size={13} /> {store.distance_km} ק״מ</span>}
          </div>
        )}
      </div>

      {/* itemized cart */}
      <h2 className="h3 mt-6 mb-3">פירוט העגלה</h2>
      <ul>
        {lines.map((l) => (
          <li className="list-item" key={l.product_id}>
            <span className="product-emoji">{l.emoji || '🛒'}</span>
            <span className="grow">
              <span className="label" style={{ display: 'block', fontWeight: 700 }}>
                {l.name}
              </span>
              <span className="small muted">
                {l.quantity} × {l.available ? formatILS(l.unitPrice) : '—'}
                {l.onSale && <span className="text-primary"> · מבצע</span>}
                {isSplit && l.store && <span> · {l.store.name}</span>}
              </span>
            </span>
            <span className="label" style={{ fontWeight: 700 }}>
              {l.available ? (
                formatILS(l.lineTotal)
              ) : (
                <span className="small text-error">לא זמין</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* total row */}
      <div className="card mt-4">
        <div className="row row--between">
          <span className="label" style={{ fontWeight: 700 }}>סך הכול לתשלום</span>
          <span className="price-big text-primary">{formatILS(total)}</span>
        </div>
        {!isSplit && result.single?.missingCount > 0 && (
          <div className="alert alert--info mt-3" style={{ marginBottom: 0 }}>
            שימו לב: {result.single.missingCount} מוצרים לא נמצאו ב{store?.name}.
            נסו את שיטת "חיסכון מרבי" בהעדפות.
          </div>
        )}
        {result.savingsVsSingle > 0 && !isSplit && (
          <div className="row gap-2 mt-3 text-success small">
            <TagIcon size={14} /> אפשר לחסוך עוד {formatILS(result.savingsVsSingle)} בפיצול בין חנויות
          </div>
        )}
      </div>

      <div className="col gap-3 mt-6">
        <button className="btn btn--ghost" onClick={() => navigate('/compare')}>
          חזרה להשוואה
        </button>
        <button className="btn btn--ghost" onClick={() => navigate('/preferences')}>
          שינוי שיטת קנייה
        </button>
        <button className="btn btn--ghost" onClick={() => navigate('/create')}>
          עריכת הרשימה
        </button>
      </div>
    </div>
  )
}


/* ===================== Page · SavedLists ===================== */

function SavedLists() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loadList } = useCart()

  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSavedLists(user.id)
      setLists(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleOpen(list) {
    const items = (list.shopping_list_items ?? []).map((i) => ({
      product_id: i.product_id,
      name: i.name,
      emoji: i.emoji,
      quantity: i.quantity,
    }))
    loadList(list.name, items)
    navigate('/compare')
  }

  async function handleDelete(listId) {
    if (!confirm('למחוק את הרשימה?')) return
    try {
      await deleteList(listId)
      setLists((prev) => prev.filter((l) => l.id !== listId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <Header
        title="הרשימות שלי"
        subtitle="רשימות שמורות"
        action={
          <button className="header__back" onClick={() => navigate('/create')} aria-label="רשימה חדשה" style={{ color: 'var(--color-primary)' }}>
            <PlusIcon />
          </button>
        }
      />

      {!isSupabaseConfigured && (
        <div className="alert alert--info">
          שמירה וטעינה של רשימות דורשות חיבור ל-Supabase. הגדירו קובץ <b>.env</b> (ראו README).
        </div>
      )}

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="center-screen"><div className="spinner" /></div>
      ) : lists.length === 0 ? (
        <div className="empty">
          <div className="empty__emoji">📝</div>
          <p>אין עדיין רשימות שמורות.</p>
          <button className="btn btn--primary mt-4" onClick={() => navigate('/create')}>
            יצירת רשימה ראשונה
          </button>
        </div>
      ) : (
        <ul>
          {lists.map((list) => {
            const count = (list.shopping_list_items ?? []).reduce(
              (sum, i) => sum + (i.quantity || 1),
              0
            )
            const preview = (list.shopping_list_items ?? [])
              .slice(0, 5)
              .map((i) => i.emoji || '🛒')
              .join(' ')
            return (
              <li className="card" key={list.id}>
                <div className="row row--between">
                  <div className="row gap-3">
                    <span className="action-tile__icon" style={{ background: 'var(--color-primary)' }}>
                      <ListIcon size={20} />
                    </span>
                    <div>
                      <div className="label" style={{ fontWeight: 700 }}>{list.name}</div>
                      <div className="small muted">
                        {count} פריטים · {formatDate(list.created_at)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="qty__btn"
                    style={{ color: 'var(--color-error)' }}
                    onClick={() => handleDelete(list.id)}
                    aria-label="מחיקה"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>

                {preview && <div className="mt-3" style={{ fontSize: 20 }}>{preview}</div>}

                <button className="btn btn--ghost btn--sm mt-3" onClick={() => handleOpen(list)}>
                  <CompareIcon size={16} /> טעינה והשוואה
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}


/* ===================== Page · Profile ===================== */

function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { preferences } = useCart()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'משתמש'
  const email = user?.email || ''
  const isPremium = !!profile?.is_premium

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      try {
        const data = await fetchProfile(user.id)
        if (active) setProfile(data)
      } catch {
        /* ignore – falls back to auth metadata */
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [user])

  async function handleSignOut() {
    if (!confirm('להתנתק מהחשבון?')) return
    await signOut()
    navigate('/login')
  }

  const initials = fullName.trim().charAt(0).toUpperCase() || '🙂'

  return (
    <div className="page">
      <Header title="פרופיל" subtitle="החשבון וההגדרות שלי" />

      {/* identity card */}
      <div className="card row gap-3">
        <span
          className="action-tile__icon"
          style={{ background: 'var(--color-primary)', width: 52, height: 52, fontSize: 22, fontWeight: 700 }}
        >
          {initials}
        </span>
        <div className="grow">
          <div className="h3" style={{ marginBottom: 2 }}>{fullName}</div>
          <div className="small muted">{email || 'לא מחובר'}</div>
        </div>
        {isPremium ? (
          <span className="badge badge--best">פרימיום</span>
        ) : (
          <span className="badge badge--muted">חינמי</span>
        )}
      </div>

      {/* premium banner */}
      {!isPremium && (
        <button
          className="card row row--between"
          onClick={() => navigate('/premium')}
          style={{ width: '100%', textAlign: 'inherit', cursor: 'pointer', borderColor: 'var(--color-accent)' }}
        >
          <div className="row gap-3">
            <span className="action-tile__icon" style={{ background: 'var(--color-accent)' }}>
              <StarIcon size={20} />
            </span>
            <div>
              <div className="label" style={{ fontWeight: 700 }}>שדרוג ל-SMARTCART Premium</div>
              <div className="small muted">חיסכון חכם, התראות מבצעים ועוד</div>
            </div>
          </div>
        </button>
      )}

      {/* settings list */}
      <h2 className="h3 mt-6 mb-3">הגדרות</h2>
      <div className="col gap-3">
        <button className="action-tile" onClick={() => navigate('/preferences')}>
          <span className="action-tile__icon" style={{ background: 'var(--color-secondary)' }}>
            <PinIcon size={20} />
          </span>
          <span className="grow">
            <span className="label" style={{ display: 'block', fontWeight: 700 }}>אזור והעדפות</span>
            <span className="small muted">
              {preferences.city} · עד {preferences.maxDistanceKm} ק״מ ·{' '}
              {preferences.mode === 'split' ? 'חיסכון מרבי' : 'חנות אחת'}
            </span>
          </span>
        </button>

        <button className="action-tile" onClick={() => navigate('/premium')}>
          <span className="action-tile__icon" style={{ background: 'var(--color-accent)' }}>
            <SettingsIcon size={20} />
          </span>
          <span className="grow">
            <span className="label" style={{ display: 'block', fontWeight: 700 }}>תוכנית ומנוי</span>
            <span className="small muted">{isPremium ? 'מנוי פרימיום פעיל' : 'התוכנית החינמית'}</span>
          </span>
        </button>
      </div>

      {/* account state notice */}
      {!isSupabaseConfigured && (
        <div className="alert alert--info mt-4">
          האפליקציה פועלת במצב דמו. לחיבור חשבון אמיתי הגדירו <b>.env</b> (ראו README).
        </div>
      )}

      {loading && isSupabaseConfigured && (
        <div className="small muted text-center mt-4">טוען פרטי חשבון…</div>
      )}

      <button className="btn btn--danger mt-6" onClick={handleSignOut}>
        <LogoutIcon size={18} /> התנתקות
      </button>

      <div className="row gap-2 mt-4" style={{ justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        <CheckIcon size={14} /> <span className="small">SMARTCART · גרסת MVP 1.0</span>
      </div>
    </div>
  )
}


/* ===================== Page · Premium ===================== */

/* Screen 9 – Premium plan. This is a FUTURE feature for the MVP, so the
   screen is presented as a preview: it shows the planned benefits and a
   disabled "coming soon" call to action rather than a real checkout. */

const BENEFITS = [
  { Icon: SparkIcon, title: 'אופטימיזציה מתקדמת', desc: 'פיצול עגלה חכם בין כמה חנויות לחיסכון מרבי' },
  { Icon: TagIcon, title: 'התראות מבצעים', desc: 'עדכון אישי כשמוצרים מהרשימה שלכם יורדים במחיר' },
  { Icon: PinIcon, title: 'ללא הגבלת מרחק', desc: 'השוואה לכל החנויות באזור, גם הרחוקות יותר' },
  { Icon: StarIcon, title: 'רשימות ללא הגבלה', desc: 'שמירת היסטוריית קניות מלאה ורשימות מועדפות' },
]

function Premium() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <Header title="SMARTCART Premium" subtitle="תכונה עתידית" showBack />

      {/* hero */}
      <div
        className="card text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), #7C3AED)',
          color: '#fff',
          border: 'none',
        }}
      >
        <div style={{ fontSize: 40, lineHeight: 1 }}>⭐</div>
        <div className="h2" style={{ color: '#fff', marginTop: 8 }}>שדרגו את הקנייה שלכם</div>
        <p className="small" style={{ opacity: 0.9, marginTop: 4 }}>
          חיסכון חכם יותר, התראות בזמן אמת וניהול רשימות ללא הגבלה.
        </p>
        <span className="badge badge--best" style={{ marginTop: 12, display: 'inline-block' }}>
          בקרוב
        </span>
      </div>

      {/* benefits */}
      <h2 className="h3 mt-6 mb-3">מה כולל המנוי?</h2>
      <div className="col gap-3">
        {BENEFITS.map(({ Icon, title, desc }) => (
          <div className="card row gap-3" key={title}>
            <span className="action-tile__icon" style={{ background: 'var(--color-accent)' }}>
              <Icon size={20} />
            </span>
            <div className="grow">
              <div className="label" style={{ fontWeight: 700 }}>{title}</div>
              <div className="small muted">{desc}</div>
            </div>
            <CheckIcon size={18} style={{ color: 'var(--color-success)' }} />
          </div>
        ))}
      </div>

      {/* price preview */}
      <div className="card text-center mt-6">
        <div className="small muted">מחיר משוער</div>
        <div className="h1" style={{ color: 'var(--color-primary)' }}>
          ₪19.90<span className="small muted"> / חודש</span>
        </div>
        <div className="small muted">ניתן לביטול בכל עת</div>
      </div>

      {/* disabled CTA – feature not live yet */}
      <button className="btn btn--primary mt-4" disabled aria-disabled="true">
        <StarIcon size={18} /> התכונה תהיה זמינה בקרוב
      </button>

      <button className="btn btn--ghost mt-3" onClick={() => navigate('/')}>
        חזרה לדף הבית
      </button>

      <p className="small muted text-center mt-4">
        זוהי תצוגה מקדימה של תכונה עתידית ואינה כוללת חיוב אמיתי.
      </p>
    </div>
  )
}


/* ===================== App router ===================== */

// Routes that should NOT show the bottom navigation bar.
const NO_NAV = ['/login']

function App() {
  const { pathname } = useLocation()
  const showNav = !NO_NAV.includes(pathname)

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateList />
            </PrivateRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <PrivateRoute>
              <AreaPreferences />
            </PrivateRoute>
          }
        />
        <Route
          path="/compare"
          element={
            <PrivateRoute>
              <PriceComparison />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <SmartCartResult />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <SavedLists />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <PrivateRoute>
              <Premium />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showNav && <BottomNav />}
    </div>
  )
}


export default App
