import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartBar from "../components/ui/CartBar";
import ApiPage from "../api/ApiPage";

export default function ProductPage({ productId }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(null);
  const [size, setSize] = useState("M");

  const cartItem = cart.find(item => item.id === parseInt(productId));
  const qty = cartItem ? (cartItem.quantity || 1) : 0;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await ApiPage.fetchProductById(productId);
        setProduct(data.product);
        if (data.product.image_url) setMainImg(data.product.image_url);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading) return <div className="product-container" style={{padding: "100px", textAlign: "center"}}>Loading product details...</div>;
  if (!product) return <div className="product-container" style={{padding: "100px", textAlign: "center"}}>Product not found.</div>;

  const imgs = [product.image_url, "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400"].filter(Boolean);
  const currentImg = mainImg || imgs[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      old_price: product.old_price,
      image_url: product.image_url,
      category: product.category,
      discount: product.discount
    });
  };

  return (
    <>
      <header className="navbar" style={{borderBottom:"1px solid #eee",background:"#fff"}}>
        <div className="logo" style={{cursor:"pointer"}} onClick={() => window.location.hash = "#home"}><h2>COZY HOOD</h2></div>
      </header>

      <div className="product-container">
        <div className="gallery">
          <div className="thumbnails">
            {imgs.map((src, i) => (
              <img key={i} src={src} className={`thumb${currentImg === src ? " active" : ""}`} onClick={() => setMainImg(src)} alt="" />
            ))}
          </div>
          <div className="main-image">
            <img id="mainImage" src={currentImg} alt={product.name} />
          </div>
        </div>

        <div className="product-info">
          {product.discount > 0 && <span className="discount">{product.discount}% OFF</span>}
          <h1><b>{product.name}</b></h1>
          <div className="rating">★★★★☆ <span>(3)</span></div>
          <div className="price-box">
            {product.old_price && <span className="old">₹{product.old_price.toLocaleString()}</span>}
            <span className="new">₹{product.price.toLocaleString()}</span>
          </div>

          <div className="size-section">
            <p>Size: <b>{size}</b></p>
            <div className="sizes">
              {["M","L","XL","XXL"].map(s => (
                <button key={s} className={`size${size === s ? " active" : ""}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="cart-row">
            {qty === 0 ? (
              <>
                <button className="cart-wide" onClick={handleAddToCart}>Add to Cart</button>
              </>
            ) : (
              <>
                <div className="quantity">
                  <button onClick={() => updateQuantity(product.id, qty - 1)}>-</button>
                  <span id="count">{qty}</span>
                  <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                </div>
                <button className="cart-wide" onClick={() => window.location.hash = "#cart"}>Go to Cart</button>
              </>
            )}
          </div>

          <div className="delivery">
            <h4>🚚 Free Shipping</h4>
            <p>✔ Delivery : Up to 2-4 business days</p>
            <p>✔ Dispatch : Within 24 hrs</p>
          </div>

          <div className="secure-box">
            <p>Guaranteed Safe And Secure Checkout</p>
            <div className="payments">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Pay_Logo.svg" alt="Google Pay" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png" alt="Paytm" />
            </div>
            <button className="buy-btn" id="payBtn" onClick={() => {
              if (qty === 0) handleAddToCart();
              window.location.hash = "#cart";
            }}>BUY NOW</button>
          </div>
        </div>
      </div>
      <CartBar />
    </>
  );
}
