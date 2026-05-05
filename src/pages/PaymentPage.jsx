import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import ApiPage from "../api/ApiPage";

export default function PaymentPage() {
  const { cart, cartTotal, cartCount, address, clearCart } = useCart();
  const [payMethod, setPayMethod] = useState("cod");
  const [proofImage, setProofImage] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await ApiPage.fetchPaymentSettings();
        console.log("=== PAYMENT SETTINGS DEBUG ===");
        console.log("Full Response:", data);
        console.log("Payment Settings Object:", data.paymentSettings);
        console.log("UPI Object:", data.paymentSettings?.upi);
        console.log("QR Object:", data.paymentSettings?.qr);
        console.log("UPI upiId field:", data.paymentSettings?.upi?.upiId);
        console.log("UPI id field:", data.paymentSettings?.upi?.id);
        console.log("UPI name field:", data.paymentSettings?.upi?.name);
        console.log("UPI all keys:", data.paymentSettings?.upi ? Object.keys(data.paymentSettings.upi) : 'N/A');
        console.log("================================");
        
        let paymentSettingsData = data.paymentSettings || {};
        
        // Ensure UPI and QR have all required fields
        if (paymentSettingsData.upi) {
          // Fill in missing fields from alternatives
          if (!paymentSettingsData.upi.upiId && !paymentSettingsData.upi.id) {
            // Try to get from QR if available
            if (paymentSettingsData.qr?.upiId) {
              paymentSettingsData.upi.upiId = paymentSettingsData.qr.upiId;
              console.log("Using UPI ID from QR:", paymentSettingsData.upi.upiId);
            } else if (paymentSettingsData.qr?.id) {
              paymentSettingsData.upi.id = paymentSettingsData.qr.id;
              console.log("Using ID from QR:", paymentSettingsData.upi.id);
            }
          }
        }
        
        setPaymentSettings(paymentSettingsData);
      } catch (err) {
        console.error("Failed to load payment settings:", err);
        setError("Failed to load payment settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

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
    // QR payment validation
    if (payMethod === "qr" && !proofImage) {
      setError("Please upload the payment screenshot as proof");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;
      if (payMethod === "qr") {
        const formData = new FormData();
        formData.append("name", address.name);
        formData.append("phone", address.phone);
        formData.append("address", address.address);
        formData.append("city", address.district);
        formData.append("state", address.state);
        formData.append("district", address.district);
        formData.append("pincode", address.pincode);
        formData.append("paymentMethod", payMethod);
        
        // Convert image to base64 if it's a file
        if (proofImage instanceof File) {
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(proofImage);
          });
          const base64String = await base64Promise;
          formData.append("paymentProof", base64String);
        }

        formData.append("items", JSON.stringify(cart.map(item => ({ id: item.id, quantity: item.quantity || 1 }))));
        if (user?.email) formData.append("email", user.email);

        result = await ApiPage.placeOrderFormData(formData);
      } else {
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
        result = await ApiPage.placeOrder(orderData);
      }

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

                <label className={`payment-option ${payMethod === "qr" ? "selected" : ""}`}>
                  <input type="radio" name="paymethod" value="qr" checked={payMethod === "qr"} onChange={() => setPayMethod("qr")} />
                  <div className="payment-option-content">
                    <div className="payment-option-icon">📷</div>
                    <div className="payment-option-info">
                      <span className="payment-option-title">QR Code Payment</span>
                      <span className="payment-option-desc">Scan QR and pay with any UPI app</span>
                    </div>
                    <div className="payment-radio"></div>
                  </div>
                </label>
              </div>

              {payMethod === "qr" && (
                !paymentSettings ? (
                  <div className="payment-loading">
                    <span className="spinner"></span>
                    <p>Loading QR payment details...</p>
                  </div>
                ) : (!paymentSettings.upi && !paymentSettings.qr) ? (
                  <div className="payment-error-box">
                    <p>QR payment is currently unavailable. Please use another method.</p>
                  </div>
                ) : (
                  <div className="payment-bottom-qr-section">
                    <div className="qr-container">
                      <p className="qr-instruction">Scan to Pay or Click Button Below</p>
                      {paymentSettings.qr?.image ? (
                        <img 
                          src={paymentSettings.qr.image} 
                          alt="UPI QR Code" 
                          className="upi-qr-img"
                        />
                      ) : (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${paymentSettings.upi?.upiId || paymentSettings.upi?.id || paymentSettings.qr?.upiId || ''}&pn=${encodeURIComponent(paymentSettings.upi?.name || paymentSettings.qr?.name || '')}&am=${grandTotal}&cu=INR`)}`} 
                          alt="UPI QR Code" 
                          className="upi-qr-img"
                        />
                      )}
                      
                      <button 
                        onClick={() => {
                          const upiId = paymentSettings.upi?.upiId || paymentSettings.upi?.id || paymentSettings.qr?.upiId || paymentSettings.qr?.id;
                          const payeeName = paymentSettings.upi?.name || paymentSettings.qr?.name || 'Cozy Hood Store';
                          
                          if (!upiId) {
                            alert('UPI ID not configured. Please contact support.');
                            return;
                          }
                          
                          // Proper UPI deep link format
                          const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal}&tn=${encodeURIComponent('Payment for Order')}&tr=${Date.now()}&cu=INR`;
                          
                          console.log('Opening UPI Deep Link:', upiDeepLink);
                          window.location.href = upiDeepLink;
                          
                          // Fallback: if app doesn't open in 2 seconds, show message
                          setTimeout(() => {
                            alert(`If no UPI app opened, please use manual payment method.\n\nUPI ID: ${upiId}\nAmount: ₹${grandTotal}`);
                          }, 2000);
                        }}
                        className="upi-deeplink-btn"
                      >
                        <i className="fa-solid fa-mobile-screen-button"></i> Pay via UPI App
                      </button>

                      <div className="upi-details">
                        <p style={{ marginBottom: '12px' }}><strong>Payee:</strong> {paymentSettings.upi?.name || paymentSettings.qr?.name || 'Merchant'}</p>
                        <p style={{ marginBottom: '12px', textAlign: 'center' }}>
                          <strong style={{ display: 'block', marginBottom: '6px' }}>UPI ID:</strong>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#003366', letterSpacing: '0.5px' }}>
                            {paymentSettings.upi?.upiId || paymentSettings.upi?.id || paymentSettings.qr?.upiId || paymentSettings.qr?.id || (
                              <span style={{ color: '#ff6b6b', fontWeight: '500' }}>Contact admin</span>
                            )}
                          </span>
                        </p>
                        <p className="qr-total" style={{ marginBottom: '0' }}>Amount: ₹{grandTotal.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="verification-section">
                      <div className="form-group full-width">
                        <label htmlFor="proof-upload">Upload Payment Screenshot <span className="required">*</span></label>
                        <div className="file-upload-wrapper">
                          <input 
                            id="proof-upload" type="file" accept="image/*"
                            onChange={e => { setProofImage(e.target.files[0]); setError(""); }}
                            className="file-input-hidden"
                          />
                          <label htmlFor="proof-upload" className="file-upload-label">
                            {proofImage ? (
                              <span className="file-name">✅ {proofImage.name}</span>
                            ) : (
                              <>
                                <i className="fa-solid fa-camera"></i>
                                <span>Choose Screenshot</span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
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
