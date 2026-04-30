import { useState, useEffect } from "react";
import ApiPage from "../api/ApiPage";

const STEPS = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const token = localStorage.getItem("customer_token");

  const loadOrders = async () => {
    try {
      const data = await ApiPage.fetchMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.hash = "#login";
      return;
    }
    loadOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await ApiPage.cancelOrder(orderId);
        loadOrders();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStepIndex = (status) => {
    if (status === "Cancelled") return -1;
    const idx = STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-logo" onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
          <nav className="orders-nav">
            <a href="#collection/new-arrivals">Shop</a>
            <a href="#cart">Cart</a>
            <a href="#orders" className="active-link">My Orders</a>
          </nav>
        </div>
      </header>

      <div className="my-orders-page">
        <div className="my-orders-container">
          <div className="my-orders-header">
            <div>
              <h1>My Orders</h1>
              <p>Track and manage your purchases</p>
            </div>
            <button className="orders-shop-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Continue Shopping
            </button>
          </div>

          {loading ? (
            <div className="orders-loading">
              <div className="orders-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">📦</div>
              <h2>No orders yet</h2>
              <p>When you place an order, it will appear here for tracking.</p>
              <button className="cart-shop-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => {
                const stepIdx = getStepIndex(order.status);
                const isCancelled = order.status === "Cancelled";
                const isExpanded = expandedOrder === order.order_id;
                const totalItems = order.items ? order.items.reduce((s, i) => s + i.quantity, 0) : 0;

                return (
                  <div key={order.order_id} className={`order-card-v2 ${isCancelled ? "cancelled" : ""}`}>
                    {/* Order Header */}
                    <div className="order-card-header" onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}>
                      <div className="order-card-id">
                        <span className="order-id-label">Order</span>
                        <span className="order-id-value">{order.order_id}</span>
                      </div>
                      <div className="order-card-meta">
                        <span className="order-date">{formatDate(order.created_at)}</span>
                        <span className={`order-status-chip ${isCancelled ? "cancelled" : order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <svg className={`order-expand-icon ${isExpanded ? "expanded" : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>

                    {/* Order Items Preview */}
                    <div className="order-items-preview">
                      {order.items && order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="order-item-row">
                          <div className="order-item-dot"></div>
                          <span className="order-item-name">{item.product_name}</span>
                          <span className="order-item-qty">×{item.quantity}</span>
                          <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <p className="order-more-items">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    {/* Order Total Bar */}
                    <div className="order-total-bar">
                      <div className="order-total-info">
                        <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                        <span className="order-payment-badge">{(order.payment_method || "").toUpperCase()}</span>
                      </div>
                      <div className="order-total-amount">₹{order.total_amount?.toLocaleString()}</div>
                    </div>

                    {/* Tracking Section */}
                    {!isCancelled && (
                      <div className="order-tracking">
                        <div className="tracking-bar">
                          {STEPS.map((step, i) => (
                            <div key={step} className={`tracking-step ${i < stepIdx ? "done" : ""} ${i === stepIdx ? "current" : ""}`}>
                              <div className="tracking-dot">
                                {i < stepIdx ? (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                                ) : i === stepIdx ? (
                                  <div className="tracking-pulse"></div>
                                ) : null}
                              </div>
                              <span className="tracking-label">{step}</span>
                              {i < STEPS.length - 1 && <div className={`tracking-line ${i < stepIdx ? "filled" : ""}`}></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="order-cancelled-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                        This order has been cancelled
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="order-expanded">
                        <div className="order-detail-grid">
                          <div className="order-detail-card">
                            <span className="order-detail-label">📦 Delivery Address</span>
                            <p className="order-detail-value">
                              {order.customer_name}<br/>
                              {order.address}<br/>
                              {order.district && `${order.district}, `}{order.state}{order.pincode && ` - ${order.pincode}`}<br/>
                              📱 {order.phone}
                            </p>
                          </div>
                          <div className="order-detail-card">
                            <span className="order-detail-label">🧾 Order Info</span>
                            <p className="order-detail-value">
                              Placed: {formatDateTime(order.created_at)}<br/>
                              Payment: {(order.payment_method || "").toUpperCase()}<br/>
                              Email: {order.email}
                            </p>
                          </div>
                        </div>

                        <div className="order-actions-row">
                          {!isCancelled && order.status !== "Delivered" && order.status !== "Shipped" && (
                            <button className="order-cancel-btn" onClick={() => cancelOrder(order.order_id)}>
                              Cancel Order
                            </button>
                          )}
                          <button className="order-help-btn" onClick={() => alert("Contact support at: karthickhari851@gmail.com")}>
                            Need Help?
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
