import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const shipping = cartTotal > 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <>
        <header className="checkout-header">
          <div className="checkout-header-inner">
            <div className="checkout-logo" onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
          </div>
        </header>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button className="cart-shop-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-logo" onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
          <div className="checkout-steps">
            <div className="step active">
              <div className="step-num">1</div>
              <span>Cart</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-num">2</div>
              <span>Address</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-num">3</div>
              <span>Payment</span>
            </div>
          </div>
          <div style={{width: 100}}></div>
        </div>
      </header>

      <div className="cart-page">
        <div className="cart-main">
          <div className="cart-items-section">
            <div className="cart-section-header">
              <h2>Shopping Cart</h2>
              <span className="cart-item-count">{cartCount} item{cartCount > 1 ? "s" : ""}</span>
            </div>

            <div className="cart-items-list">
              {cart.map(item => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-img" onClick={() => window.location.hash = `#product/${item.id}`}>
                    <img src={item.image_url || item.img || "https://images.unsplash.com/photo-1556905055-8f358a7a4bc4?w=200"} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-category">{item.category?.replace("-", " ") || "Product"}</p>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₹{item.price?.toLocaleString()}</span>
                      {item.old_price && <span className="cart-item-old-price">₹{item.old_price?.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>−</button>
                      <span className="qty-count">{item.quantity || 1}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">₹{(item.price * (item.quantity || 1)).toLocaleString()}</div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-continue">
              <button className="cart-continue-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "summary-free" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div className="summary-shipping-note">
                  Add ₹{(1000 - cartTotal).toLocaleString()} more for free shipping
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <button className="cart-checkout-btn" onClick={() => window.location.hash = "#address"}>
                Confirm Order
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <div className="cart-secure-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Secure checkout • 100% safe payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
