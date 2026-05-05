import { useEffect, useState } from "react";

export default function OrderSuccessPage({ orderId }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-logo" onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
        </div>
      </header>

      <div className="success-page">
        <div className={`success-card ${showContent ? "show" : ""}`}>
          <div className="success-checkmark">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle className="success-circle" cx="40" cy="40" r="36" fill="none" stroke="#22c55e" strokeWidth="3"/>
              <path className="success-check" d="M24 42l10 10 22-24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-subtitle">Thank you for shopping with Atix Outfits</p>

          {orderId && (
            <div className="success-order-id">
              <span>Order ID</span>
              <strong>{orderId}</strong>
            </div>
          )}

          <div className="success-info">
            <div className="success-info-item">
              <span className="success-info-icon">📦</span>
              <div>
                <strong>Order Confirmed</strong>
                <p>Your order has been received and is being processed</p>
              </div>
            </div>
            <div className="success-info-item">
              <span className="success-info-icon">🚚</span>
              <div>
                <strong>Delivery in 2-4 Days</strong>
                <p>You'll receive tracking updates via email</p>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button className="success-btn-primary" onClick={() => window.location.hash = "#orders"}>
              View My Orders
            </button>
            <button className="success-btn-secondary" onClick={() => window.location.hash = "#collection/new-arrivals"}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
