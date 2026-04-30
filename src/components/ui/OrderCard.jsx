export default function OrderCard({ order, steps, cancelOrder }) {
  const currentIndex = steps.indexOf(order.status);
  const idx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="order-card">
      <div className="order-top">
        <div className="order-product">
          <img src={order.image || "https://picsum.photos/70"} alt="product" />
          <div>
            <h3>Premium Product</h3>
            <small>Order ID: {order.orderId}</small>
          </div>
        </div>
        <div className={`status-badge status-${order.status}`}>{order.status}</div>
      </div>

      <div className="order-info">
        <div><span>ORDER DATE</span>{order.date}</div>
        <div><span>AMOUNT</span>₹{order.amount}</div>
        <div><span>PAYMENT</span>{(order.paymentMethod || "").toUpperCase()}</div>
        <div><span>ITEMS</span>1 Item</div>
      </div>

      <div className="tracking-wrapper">
        {steps.map((step, i) => (
          <div key={step} className={`track-step${i < idx ? " completed" : ""}${i === idx ? " active" : ""}`}>
            <div className="circle">{i < idx ? "✓" : ""}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <div className="order-buttons" style={{marginTop:"25px",display:"flex",gap:"10px"}}>
        <button className="btn btn-primary" onClick={() => alert("Order details for: " + order.orderId)}>View Details</button>
        <button className="btn btn-secondary" onClick={() => alert("Invoice for: " + order.orderId)}>Invoice</button>
        {order.status !== "Delivered" && (
          <button className="btn btn-danger" onClick={() => cancelOrder(order.orderId)}>Cancel</button>
        )}
      </div>
    </div>
  );
}
