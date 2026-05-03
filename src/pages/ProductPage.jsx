import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartBar from "../components/ui/CartBar";
import ApiPage from "../api/ApiPage";

export default function ProductPage({ productId }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(null);
  const [size, setSize] = useState("M");
  const [addedToCart, setAddedToCart] = useState(false);

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

  if (loading) return (
    <>
      <Navbar />
      <div className="product-container" style={{padding: "100px 5%", textAlign: "center"}}>
        <div className="skeleton" style={{width: 200, height: 24, margin: '0 auto 40px'}}></div>
        <div style={{display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap'}}>
          <div className="skeleton" style={{width: 400, height: 450, borderRadius: 16}}></div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <div className="skeleton" style={{width: 300, height: 28}}></div>
            <div className="skeleton" style={{width: 200, height: 20}}></div>
            <div className="skeleton" style={{width: 150, height: 32}}></div>
          </div>
        </div>
      </div>
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <div className="empty-state" style={{padding: "100px 20px"}}>
        <div className="empty-icon">😔</div>
        <h3>Product not found</h3>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="browse-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>Browse Products</button>
      </div>
    </>
  );

  const imgs = [product.image_url].filter(Boolean);
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const categoryLabel = {
    "new-arrivals": "New Arrivals",
    "shirts": "Shirts",
    "t-shirts": "T-Shirts",
  }[product.category] || "Collection";

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <a href="#home">Home</a>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <a href={`#collection/${product.category}`}>{categoryLabel}</a>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="product-container">
        <div className="gallery">
          <div className="thumbnails">
            {imgs.map((src, i) => (
              <img key={i} src={src} className={`thumb${currentImg === src ? " active" : ""}`} onClick={() => setMainImg(src)} alt="" />
            ))}
          </div>
          <div className="main-image">
            <img id="mainImage" src={currentImg} alt={product.name} />
            {product.discount > 0 && <span className="product-badge-discount">{product.discount}% OFF</span>}
          </div>
        </div>

        <div className="product-info">
          <span className="product-category-label">{categoryLabel}</span>
          <h1>{product.name}</h1>
          <div className="rating">
            <span className="stars">★★★★☆</span>
            <span className="rating-count">(3 reviews)</span>
          </div>
          
          <div className="price-section">
            {product.old_price && <span className="old-price-detail">₹{product.old_price.toLocaleString()}</span>}
            <span className="new-price-detail">₹{product.price.toLocaleString()}</span>
            {product.discount > 0 && <span className="save-badge">Save {product.discount}%</span>}
          </div>

          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          <div className="size-section">
            <p className="section-label">Size: <strong>{size}</strong></p>
            <div className="sizes">
              {(product.sizes || ["M","L","XL","XXL"]).map(s => (
                <button key={s} className={`size-btn${size === s ? " active" : ""}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="cart-actions">
            {qty === 0 ? (
              <button className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`} onClick={handleAddToCart}>
                {addedToCart ? (
                  <><i className="fa-solid fa-check"></i> Added to Cart</>
                ) : (
                  <><i className="fa-solid fa-bag-shopping"></i> Add to Cart</>
                )}
              </button>
            ) : (
              <>
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                </div>
                <button className="go-to-cart-btn" onClick={() => window.location.hash = "#cart"}>
                  <i className="fa-solid fa-bag-shopping"></i> Go to Cart
                </button>
              </>
            )}
            <button className="buy-now-btn" onClick={() => {
              if (qty === 0) handleAddToCart();
              window.location.hash = "#cart";
            }}>
              Buy Now
            </button>
          </div>

          <div className="delivery-info">
            <div className="delivery-item">
              <i className="fa-solid fa-truck-fast"></i>
              <div>
                <strong>Free Shipping</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
            <div className="delivery-item">
              <i className="fa-solid fa-box-open"></i>
              <div>
                <strong>Delivery in 2-4 days</strong>
                <span>Dispatched within 24 hrs</span>
              </div>
            </div>
            <div className="delivery-item">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Secure Checkout</strong>
                <span>100% safe payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CartBar />
    </>
  );
}
