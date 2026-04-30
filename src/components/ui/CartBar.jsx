import { useCart } from "../../context/CartContext";

export default function CartBar() {
  const { cart, cartCount, cartTotal } = useCart();

  if (cart.length === 0) return null;

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-bar-info">
          <div className="cart-bar-badge">{cartCount}</div>
          <div className="cart-bar-text">
            <span className="cart-bar-items">{cartCount} item{cartCount > 1 ? "s" : ""}</span>
            <span className="cart-bar-total">₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <button className="cart-bar-btn" onClick={() => window.location.hash = "#cart"}>
          View Cart
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
