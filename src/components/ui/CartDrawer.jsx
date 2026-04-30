export default function CartDrawer({ cart, cartOpen, setCartOpen, removeItem, cartTotal, payMethod, setPayMethod, upiId, setUpiId, placeOrder, paymentMsg }) {
  return (
    <>
      <div className={`cart-overlay${cartOpen ? " active" : ""}`} onClick={() => setCartOpen(false)}></div>

      <div className={`cart-drawer${cartOpen ? " active" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <span onClick={() => setCartOpen(false)} style={{cursor:"pointer"}}>✖</span>
        </div>
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px"}}>
              <div style={{display:"flex", flexDirection:"column"}}>
                <span style={{fontWeight:"bold"}}>{item.name}</span>
                <span style={{fontSize:"12px", color:"#666"}}>₹{item.price} x {item.quantity || 1}</span>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                <span style={{fontWeight:"600"}}>₹{item.price * (item.quantity || 1)}</span>
                <span onClick={() => removeItem(item.id)} style={{cursor:"pointer", color:"#ff4d4d", fontSize:"18px"}}>×</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <h4>Total: ₹<span>{cartTotal}</span></h4>
          <div className="payment-section">
            <h4>Select Payment</h4>
            <label><input type="radio" name="payment" value="upi" checked={payMethod === "upi"} onChange={() => setPayMethod("upi")} /> UPI Payment</label>
            <label><input type="radio" name="payment" value="cod" checked={payMethod === "cod"} onChange={() => setPayMethod("cod")} /> Cash on Delivery</label>
            {payMethod === "upi" && <input type="text" id="upiId" placeholder="Enter UPI ID (example@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} />}
            <button className="place-order-btn" onClick={placeOrder}>Pay Now</button>
            {paymentMsg && <div className="payment-message" style={{color: paymentMsg.includes("✅") || paymentMsg.includes("Success") || paymentMsg.includes("placed") ? "green" : "red"}}>{paymentMsg}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
