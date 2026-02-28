import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useApp } from "../AppContext";

const NAV_LINKS = [
  { to: "/", label: "Catalog" },
  { to: "/account", label: "Account" },
  { to: "/review", label: "Write a review" },
];

export default function Header() {
  const { darkMode, toggleDarkMode, user, cart, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e) => {
      if (!e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="PrintMart home">
          <span className="brand-mark" aria-hidden="true" />
          <span>
            PrintMart
            <small>3D print shop</small>
          </span>
        </Link>

        <nav
          id="primary-nav"
          className={`nav ${menuOpen ? "open" : "closed"}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions" aria-label="Quick actions">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            Dark mode
          </label>

          <button
            className="menu-btn"
            type="button"
            aria-controls="primary-nav"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <Link className="pill" to="/cart" aria-label="Go to cart">
            Cart{" "}
            <span className="badge" aria-label={`${cartCount} items in cart`}>
              {cartCount}
            </span>
          </Link>

          {user ? (
            <span className="pill" aria-label="Logged in user">
              <strong>{user.name}</strong>
              <button
                className="btn ghost"
                style={{ padding: "0.3rem 0.6rem", fontSize: "0.85rem" }}
                onClick={logout}
              >
                Sign out
              </button>
            </span>
          ) : (
            <Link className="pill" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
