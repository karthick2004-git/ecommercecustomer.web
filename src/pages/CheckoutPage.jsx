import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import ApiPage from "../api/ApiPage";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, address, setAddress } = useCart();
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  const shipping = cartTotal > 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

  const hasSavedAddress = !!(address.name && address.phone && address.address && address.pincode);

  useEffect(() => {
    // If we have a saved address in localStorage, default to showing the saved card
    if (hasSavedAddress) {
      setShowForm(false);
    }
  }, []);

  useEffect(() => {
    const fetchLastAddress = async () => {
      const token = localStorage.getItem("customer_token");
      if (!token) return;

      try {
        const data = await ApiPage.fetchMyOrders();
        if (data && data.orders && data.orders.length > 0) {
          const lastOrder = data.orders[0];
          const fetchedAddr = {
            name: lastOrder.customer_name || "",
            phone: lastOrder.phone || "",
            address: lastOrder.address || "",
            state: lastOrder.state || "",
            district: lastOrder.district || "",
            pincode: lastOrder.pincode || ""
          };
          setAddress(fetchedAddr);
          setShowForm(false);
        } else {
          // If no orders, try to at least fill the name from user profile
          const userStored = localStorage.getItem("customer_user");
          if (userStored) {
            const user = JSON.parse(userStored);
            if (user && !address.name) {
              setAddress(prev => ({ ...prev, name: user.name }));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch previous address:", error);
      }
    };

    if (!address.name) {
      fetchLastAddress();
    }
  }, [address.name, setAddress]);

  const handleChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!address.name?.trim()) e.name = "Full name is required";
    if (!address.phone?.trim()) e.phone = "Mobile number is required";
    else if (!/^\d{10}$/.test(address.phone.trim())) e.phone = "Enter valid 10-digit mobile number";
    if (!address.address?.trim()) e.address = "Address is required";
    if (!address.state) e.state = "Select your state";
    if (!address.district?.trim()) e.district = "District is required";
    if (!address.pincode?.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      window.location.hash = "#payment";
    }
  };

  const handleDeliverToSaved = () => {
    if (validate()) {
      window.location.hash = "#payment";
    } else {
      setShowForm(true);
    }
  };

  if (cart.length === 0) {
    window.location.hash = "#cart";
    return null;
  }

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
            <div className="step active">
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

      <div className="address-page">
        <div className="address-main">
          <div className="address-form-section">
            
            {!showForm && hasSavedAddress ? (
              <div className="saved-address-container" style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "30px",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.3s ease",
                marginBottom: "30px",
                position: "relative"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px"
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <i className="fa-solid fa-house-chimney-user" style={{ color: "var(--accent)", fontSize: "20px" }}></i>
                    Deliver to Saved Address
                  </h3>
                  <span style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Default</span>
                </div>

                <div className="saved-address-body" style={{
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  marginBottom: "24px",
                  border: "1px dashed var(--border)"
                }}>
                  <p style={{ margin: "0 0 10px", fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
                    {address.name}
                  </p>
                  <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
                    {address.address}<br />
                    {address.district}, {address.state} - <strong style={{ color: "var(--text-primary)" }}>{address.pincode}</strong>
                  </p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-phone" style={{ color: "var(--accent)", fontSize: "12px" }}></i>
                    <span>+91 <strong>{address.phone}</strong></span>
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button 
                    onClick={handleDeliverToSaved}
                    className="address-continue-btn"
                    style={{ width: "100%", margin: 0 }}
                  >
                    Deliver to this Address
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <button 
                    onClick={() => setShowForm(true)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid var(--border)",
                      color: "var(--text-secondary)",
                      padding: "14px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Deliver to a Different Address
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
                  <h2 style={{ margin: 0 }}>Shipping Address</h2>
                  {hasSavedAddress && (
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <i className="fa-solid fa-arrow-left"></i> Back to Saved Address
                    </button>
                  )}
                </div>
                <p className="address-subtitle">Where should we deliver your order?</p>

                <form onSubmit={handleSubmit} className="address-form">
                  <div className="form-group">
                    <label htmlFor="addr-name">Full Name <span className="required">*</span></label>
                    <input 
                      id="addr-name" type="text" placeholder="Enter your full name"
                      value={address.name} onChange={e => handleChange("name", e.target.value)}
                      className={errors.name ? "input-error" : ""}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="addr-phone">Mobile Number <span className="required">*</span></label>
                    <div className="phone-input">
                      <span className="phone-prefix">+91</span>
                      <input 
                        id="addr-phone" type="tel" placeholder="10-digit mobile number" maxLength="10"
                        value={address.phone} onChange={e => handleChange("phone", e.target.value.replace(/\D/g, ""))}
                        className={errors.phone ? "input-error" : ""}
                      />
                    </div>
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="addr-address">Address <span className="required">*</span></label>
                    <textarea 
                      id="addr-address" placeholder="House No, Street, Landmark"
                      value={address.address} onChange={e => handleChange("address", e.target.value)}
                      className={errors.address ? "input-error" : ""} rows="3"
                    ></textarea>
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="addr-state">State <span className="required">*</span></label>
                      <select 
                        id="addr-state" value={address.state}
                        onChange={e => handleChange("state", e.target.value)}
                        className={errors.state ? "input-error" : ""}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <span className="field-error">{errors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-district">District <span className="required">*</span></label>
                      <input 
                        id="addr-district" type="text" placeholder="Enter district"
                        value={address.district} onChange={e => handleChange("district", e.target.value)}
                        className={errors.district ? "input-error" : ""}
                      />
                      {errors.district && <span className="field-error">{errors.district}</span>}
                    </div>
                  </div>

                  <div className="form-group form-group-small">
                    <label htmlFor="addr-pincode">Pincode <span className="required">*</span></label>
                    <input 
                      id="addr-pincode" type="text" placeholder="6-digit pincode" maxLength="6"
                      value={address.pincode} onChange={e => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
                      className={errors.pincode ? "input-error" : ""}
                    />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>

                  <button type="submit" className="address-continue-btn">
                    Continue to Payment
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="address-summary-section">
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
