import { NavLink } from 'react-router-dom'

/* Shared component — appears on every page (top of the layout). */

const LINKS = [
  { to: '/', label: 'בית', end: true },
  { to: '/create', label: 'רשימה חדשה' },
  { to: '/compare', label: 'השוואת מחירים' },
  { to: '/saved', label: 'רשימות שמורות' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h2.2l2.3 12.4a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 7H5.2" />
            </svg>
          </span>
          SMARTCART
        </NavLink>

        <nav className="navbar__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' is-active' : '')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
