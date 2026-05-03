import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ApiPage from "../api/ApiPage";

const STEPS = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

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

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filter);

  const orderCounts = {
    all: orders.length,
    placed: orders.filter(o => o.status === "Placed").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  return (
    <>
      <Navbar />

      <div className="my-orders-page">
        <div className="my-orders-container">

          {/* Page Header */}
          <div className="orders-page-header">
            <div className="orders-header-left">
              <h1><i className="fa-solid fa-box"></i> My Orders</h1>
              <p className="orders-subtitle">Track and manage all your purchases</p>
            </div>
            <button className="orders-shop-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="orders-filter-tabs">
            {[
              { key: "all", label: "All Orders", icon: "fa-layer-group" },
              { key: "placed", label: "Placed", icon: "fa-clock" },
              { key: "shipped", label: "Shipped", icon: "fa-truck" },
              { key: "delivered", label: "Delivered", icon: "fa-circle-check" },
              { key: "cancelled", label: "Cancelled", icon: "fa-circle-xmark" },
            ].map(tab => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? "active" : ""}`}
                onClick={() => setFilter(tab.key)}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.label}</span>
                {orderCounts[tab.key] > 0 && (
                  <span className="filter-count">{orderCounts[tab.key]}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="orders-loading">
              <div className="orders-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h2>{filter === "all" ? "No orders yet" : `No ${filter} orders`}</h2>
              <p>{filter === "all" ? "When you place an order, it will appear here for tracking." : "You don't have any orders with this status."}</p>
              <button className="orders-empty-btn" onClick={() => filter === "all" ? (window.location.hash = "#collection/new-arrivals") : setFilter("all")}>
                {filter === "all" ? "Start Shopping" : "View All Orders"}
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => {
                const stepIdx = getStepIndex(order.status);
                const isCancelled = order.status === "Cancelled";
                const isExpanded = expandedOrder === order.order_id;
                const totalItems = order.items ? order.items.reduce((s, i) => s + i.quantity, 0) : 0;

                return (
                  <div key={order.order_id} className={`order-card-v2 ${isCancelled ? "cancelled" : ""} ${isExpanded ? "expanded" : ""}`}>
                    {/* Order Header */}
                    <div className="order-card-header" onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}>
                      <div className="order-card-icon">
                        <i className={`fa-solid ${isCancelled ? 'fa-circle-xmark' : order.status === 'Delivered' ? 'fa-circle-check' : 'fa-box'}`}></i>
                      </div>
                      <div className="order-card-id">
                        <span className="order-id-value">{order.order_id}</span>
                        <span className="order-date">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="order-card-meta">
                        <span className={`order-status-chip ${isCancelled ? "cancelled" : order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <span className="order-total-quick">₹{order.total_amount?.toLocaleString()}</span>
                      </div>
                      <div className={`order-expand-arrow ${isExpanded ? "rotated" : ""}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="order-items-preview">
                      {order.items && order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="order-item-row">
                          <div className="order-item-thumb">
                            <i className="fa-solid fa-shirt"></i>
                          </div>
                          <div className="order-item-details">
                            <span className="order-item-name">{item.product_name}</span>
                            <span className="order-item-meta">Qty: {item.quantity}</span>
                          </div>
                          <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <p className="order-more-items">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    {/* Order Summary Bar */}
                    <div className="order-summary-bar">
                      <div className="order-summary-left">
                        <span className="summary-items">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                        <span className="order-payment-badge">
                          <i className={`fa-solid ${order.payment_method === 'cod' ? 'fa-money-bill' : 'fa-qrcode'}`}></i>
                          {(order.payment_method || "").toUpperCase()}
                        </span>
                      </div>
                      <div className="order-summary-total">
                        <span className="total-label">Total</span>
                        <span className="total-amount">₹{order.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Tracking Section */}
                    {!isCancelled && (
                      <div className="order-tracking">
                        <div className="tracking-bar">
                          {STEPS.map((step, i) => (
                            <div key={step} className={`tracking-step ${i < stepIdx ? "done" : ""} ${i === stepIdx ? "current" : ""}`}>
                              <div className="tracking-dot">
                                {i < stepIdx ? (
                                  <i className="fa-solid fa-check"></i>
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
                        <i className="fa-solid fa-ban"></i>
                        This order has been cancelled
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="order-expanded">
                        <div className="order-detail-grid">
                          <div className="order-detail-card">
                            <div className="detail-card-header">
                              <i className="fa-solid fa-location-dot"></i>
                              <span>Delivery Address</span>
                            </div>
                            <div className="detail-card-body">
                              <strong>{order.customer_name}</strong><br/>
                              {order.address}<br/>
                              {order.district && `${order.district}, `}{order.state}{order.pincode && ` - ${order.pincode}`}<br/>
                              <span className="detail-phone"><i className="fa-solid fa-phone"></i> {order.phone}</span>
                            </div>
                          </div>
                          <div className="order-detail-card">
                            <div className="detail-card-header">
                              <i className="fa-solid fa-receipt"></i>
                              <span>Order Info</span>
                            </div>
                            <div className="detail-card-body">
                              <div className="detail-info-row"><span>Placed</span><strong>{formatDateTime(order.created_at)}</strong></div>
                              <div className="detail-info-row"><span>Payment</span><strong>{(order.payment_method || "").toUpperCase()}</strong></div>
                              <div className="detail-info-row"><span>Email</span><strong>{order.email}</strong></div>
                              {order.transaction_id && <div className="detail-info-row"><span>TXN ID</span><strong>{order.transaction_id}</strong></div>}
                            </div>
                          </div>
                        </div>

                        <div className="order-actions-row">
                          {!isCancelled && order.status !== "Delivered" && order.status !== "Shipped" && (
                            <button className="order-cancel-btn" onClick={() => cancelOrder(order.order_id)}>
                              <i className="fa-solid fa-ban"></i> Cancel Order
                            </button>
                          )}
                          <button className="order-help-btn" onClick={() => window.location.hash = "#contact"}>
                            <i className="fa-solid fa-headset"></i> Need Help?
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

      <Footer />
    </>
  );
}
