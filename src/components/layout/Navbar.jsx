import { useState, useEffect } from "react";
import { navLinks } from "../../constants/navLinks";
import AuthModal from "../ui/AuthModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("customer_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
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
      <header className="navbar">
        <div className="container nav-container">
          <div className="nav-left">
            <div className="logo" onClick={() => window.location.hash = "#home"} style={{ cursor: "pointer" }}>COZY HOOD</div>
          </div>

          <nav className="nav-center">
            {navLinks.map(l => (
              <a key={l.hash} href={l.hash} className={window.location.hash === l.hash ? "active-link" : ""}>{l.label}</a>
            ))}
            {user && <a href="#orders">My Orders</a>}
          </nav>

          <div className="nav-right">
            <div className="search-box">
              <span style={{ fontSize: "14px", marginRight: "8px" }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {user ? (
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#444", fontWeight: "500" }}>Hi, {user.name.split(' ')[0]}</span>
                <button className="auth-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="auth-btn" style={{ background: "transparent", color: "#111", border: "1px solid #111" }} onClick={() => window.location.hash = "#login"}>Login</button>
                <button className="auth-btn" onClick={() => window.location.hash = "#signup"}>Sign In</button>
              </div>
            )}
            <div className="hamburger" onClick={() => setMobileOpen(o => !o)}>☰</div>
          </div>
        </div>
        {mobileOpen && (
          <div className="mobile-menu show">
            {navLinks.map(l => <a key={l.hash} href={l.hash} onClick={() => setMobileOpen(false)}>{l.label}</a>)}
            {user && <a href="#orders" onClick={() => setMobileOpen(false)}>My Orders</a>}
            {user ? (
              <button className="mobile-auth-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="mobile-auth-btn" onClick={() => { window.location.hash = "#login"; setMobileOpen(false); }}>Login</button>
                <button className="mobile-auth-btn" onClick={() => { window.location.hash = "#signup"; setMobileOpen(false); }}>Sign In</button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
