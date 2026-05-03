import { useState, useEffect } from "react";
import { navLinks } from "../../constants/navLinks";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem("customer_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    localStorage.removeItem("checkout_address");
    setUser(null);
    window.location.hash = "#home";
    window.location.reload();
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.hash = `#collection/all?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container nav-container">
          <div className="nav-left">
            <div className="logo" onClick={() => window.location.hash = "#home"} style={{ cursor: "pointer" }}>
              COZY HOOD
            </div>
          </div>

          <nav className="nav-center">
            {navLinks.map(l => (
              <a key={l.hash} href={l.hash} className={window.location.hash === l.hash ? "active-link" : ""}>{l.label}</a>
            ))}
            {user && <a href="#orders">My Orders</a>}
          </nav>

          <div className="nav-right">
            {/* Cart Icon */}
            <div className="nav-cart-icon" onClick={() => window.location.hash = "#cart"}>
              <i className="fa-solid fa-bag-shopping"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            {user ? (
              <div className="nav-user-section">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="auth-btn logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <button className="auth-btn auth-btn-outline" onClick={() => window.location.hash = "#login"}>Login</button>
                <button className="auth-btn auth-btn-filled" onClick={() => window.location.hash = "#signup"}>Sign Up</button>
              </div>
            )}
            <div className="hamburger" onClick={() => setMobileOpen(o => !o)}>
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="mobile-menu show">
            {navLinks.map(l => <a key={l.hash} href={l.hash} onClick={() => setMobileOpen(false)}>{l.label}</a>)}
            {user && <a href="#orders" onClick={() => setMobileOpen(false)}>My Orders</a>}
            <a href="#cart" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-bag-shopping"></i> Cart {cartCount > 0 && `(${cartCount})`}
            </a>
            {user ? (
              <button className="mobile-auth-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="mobile-auth-btn" onClick={() => { window.location.hash = "#login"; setMobileOpen(false); }}>Login</button>
                <button className="mobile-auth-btn mobile-auth-btn-accent" onClick={() => { window.location.hash = "#signup"; setMobileOpen(false); }}>Sign Up</button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
