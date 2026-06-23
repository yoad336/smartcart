/* Shared component — appears on every page (bottom of the layout). */

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">SMARTCART</span>
        <nav className="footer__links">
          <a href="#about">אודות</a>
          <a href="#help">עזרה</a>
          <a href="#privacy">פרטיות</a>
          <a href="#contact">צור קשר</a>
        </nav>
        <span className="footer__copy">© {year} · כל הזכויות שמורות · גרסת MVP</span>
      </div>
    </footer>
  )
}
