import { useState } from "react";
import { useCart } from "../context/CartContext";

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

  const shipping = cartTotal > 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

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
            <h2>Shipping Address</h2>
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
