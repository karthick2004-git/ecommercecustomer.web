import { useState } from "react";
import { useCart } from "../context/CartContext";
import ApiPage from "../api/ApiPage";

export default function PaymentPage() {
  const { cart, cartTotal, cartCount, address, clearCart } = useCart();
  const [payMethod, setPayMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = cartTotal > 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

  if (cart.length === 0) {
    window.location.hash = "#cart";
    return null;
  }

  const token = localStorage.getItem("customer_token");
  const user = JSON.parse(localStorage.getItem("customer_user") || "null");

  if (!address.name || !address.phone) {
    window.location.hash = "#address";
    return null;
  }


  const handlePlaceOrder = async () => {
    if (payMethod === "upi" && !upiId.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.district,
        state: address.state,
        district: address.district,
        pincode: address.pincode,
        paymentMethod: payMethod,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity || 1 })),
      };

      const result = await ApiPage.placeOrder(orderData);
      clearCart();
      window.location.hash = `#order-success/${result.order?.order_id || ""}`;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-logo" onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
          <div className="checkout-steps">
            <div className="step completed" onClick={() => window.location.hash = "#cart"}>
              <div className="step-num">✓</div>
              <span>Cart</span>
            </div>
            <div className="step-line filled"></div>
            <div className="step completed" onClick={() => window.location.hash = "#address"}>
              <div className="step-num">✓</div>
              <span>Address</span>
            </div>
            <div className="step-line filled"></div>
            <div className="step active">
              <div className="step-num">3</div>
              <span>Payment</span>
            </div>
          </div>
          <div style={{width: 100}}></div>
        </div>
      </header>

      <div className="payment-page">
        <div className="payment-main">
          <div className="payment-form-section">
            {/* Delivery address summary */}
            <div className="payment-address-card">
              <div className="payment-address-header">
                <h3>📦 Delivering to</h3>
                <button className="change-link" onClick={() => window.location.hash = "#address"}>Change</button>
              </div>
              <div className="payment-address-body">
                <p className="addr-name">{address.name}</p>
                <p className="addr-detail">{address.address}</p>
                <p className="addr-detail">{address.district}, {address.state} - {address.pincode}</p>
                <p className="addr-phone">📱 +91 {address.phone}</p>
              </div>
            </div>

            {/* Payment methods */}
            <div className="payment-methods-section">
              <h2>Payment Method</h2>
              <p className="payment-subtitle">Choose how you'd like to pay</p>

              <div className="payment-options">
                <label className={`payment-option ${payMethod === "cod" ? "selected" : ""}`}>
                  <input type="radio" name="paymethod" value="cod" checked={payMethod === "cod"} onChange={() => setPayMethod("cod")} />
                  <div className="payment-option-content">
                    <div className="payment-option-icon">📦</div>
                    <div className="payment-option-info">
                      <span className="payment-option-title">Cash on Delivery</span>
                      <span className="payment-option-desc">Pay when you receive your order</span>
                    </div>
                    <div className="payment-radio"></div>
                  </div>
                </label>

                <label className={`payment-option ${payMethod === "upi" ? "selected" : ""}`}>
                  <input type="radio" name="paymethod" value="upi" checked={payMethod === "upi"} onChange={() => setPayMethod("upi")} />
                  <div className="payment-option-content">
                    <div className="payment-option-icon">💳</div>
                    <div className="payment-option-info">
                      <span className="payment-option-title">UPI Payment</span>
                      <span className="payment-option-desc">Google Pay, PhonePe, Paytm, etc.</span>
                    </div>
                    <div className="payment-radio"></div>
                  </div>
                </label>
              </div>

              {payMethod === "upi" && (
                <div className="upi-input-section">
                  <label htmlFor="upi-id">Enter UPI ID</label>
                  <input 
                    id="upi-id" type="text" placeholder="example@upi"
                    value={upiId} onChange={e => { setUpiId(e.target.value); setError(""); }}
                  />
                </div>
              )}

              {error && <div className="payment-error">{error}</div>}

              <button 
                className={`place-order-final-btn ${loading ? "loading" : ""}`}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order • ₹{grandTotal.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="payment-summary-section">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items-list">
                {cart.map(item => (
                  <div className="summary-item" key={item.id}>
                    <img src={item.image_url || item.img || "https://images.unsplash.com/photo-1556905055-8f358a7a4bc4?w=80"} alt={item.name} />
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">Qty: {item.quantity || 1}</span>
                    </div>
                    <span className="summary-item-price">₹{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "summary-free" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
