import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartBar from "../components/ui/CartBar";
import ProductCard from "../components/ui/ProductCard";
import ApiPage from "../api/ApiPage";

/* ── No static review data — reviews from backend (future) ── */

function normalizeImageList(images) {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/* ══════════════════════════════════════════════ */

export default function ProductPage({ productId }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(null);
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [pinned, setPinned] = useState(false);
  const imgRef = useRef(null);
  const similarRef = useRef(null);

  const cartItem = cart.find(item => item.id === parseInt(productId));
  const qty = cartItem ? (cartItem.quantity || 1) : 0;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await ApiPage.fetchProductById(productId);
        setProduct(data.product);
        if (data.product.image_url) setMainImg(data.product.image_url);
        // Set default size
        const sizes = data.product.sizes || [];
        if (sizes.length > 0) {
          const firstSize = typeof sizes[0] === 'object' ? sizes[0].size : sizes[0];
          setSize(firstSize);
        }
        // Set default color
        const colors = data.product.colors || [];
        if (colors.length > 0) setSelectedColor(colors[0]);

        // Fetch similar products
        let similarData = [];
        if (data.product.category) {
          const similar = await ApiPage.fetchSimilarProducts(data.product.category, productId);
          similarData = similar.products || [];
        }
        
        // Robust fallback: if no similar products found, fetch new-arrivals
        if (similarData.length === 0) {
          const fallback = await ApiPage.fetchSimilarProducts("collection", productId);
          similarData = fallback.products || [];
        }
        if (similarData.length === 0) {
          const fallback2 = await ApiPage.fetchSimilarProducts("new-arrivals", productId);
          similarData = fallback2.products || [];
        }
        
        setSimilarProducts(similarData);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <>
      <Navbar />
      <div className="pdp-skeleton-wrap">
        <div className="container">
          <div className="pdp-skeleton">
            <div className="pdp-skel-gallery">
              <div className="skeleton" style={{width: '100%', height: 500, borderRadius: 16}}></div>
            </div>
            <div className="pdp-skel-info">
              <div className="skeleton" style={{width: '40%', height: 14, marginBottom: 12}}></div>
              <div className="skeleton" style={{width: '80%', height: 28, marginBottom: 16}}></div>
              <div className="skeleton" style={{width: '50%', height: 20, marginBottom: 20}}></div>
              <div className="skeleton" style={{width: '30%', height: 34, marginBottom: 28}}></div>
              <div className="skeleton" style={{width: '100%', height: 16, marginBottom: 8}}></div>
              <div className="skeleton" style={{width: '90%', height: 16, marginBottom: 8}}></div>
              <div className="skeleton" style={{width: '70%', height: 16, marginBottom: 28}}></div>
              <div className="skeleton" style={{width: '100%', height: 52, borderRadius: 12}}></div>
            </div>
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

  const allImages = [product.image_url, ...normalizeImageList(product.images)].filter(Boolean);
  const currentImg = mainImg || allImages[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      old_price: product.old_price,
      image_url: product.image_url,
      category: product.category,
      discount: product.discount,
      gst_percent: product.gst_percent || 0,
      size: size || null,
      color: selectedColor || null,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const categoryLabel = {
    "new-arrivals": "New Arrivals",
    "shirts": "Shirts",
    "t-shirts": "T-Shirts",
  }[product.category] || "Collection";

  /* ── Image zoom ── */
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${currentImg})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    if (!pinned) setZoomStyle({ display: "none" });
  };

  /* ── Similar products scroll ── */
  const scrollSimilar = (dir) => {
    if (similarRef.current) {
      similarRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <div className="container">
          <a href="#home">Home</a>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <a href={`#collection/${product.category}`}>{categoryLabel}</a>
          <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* ══════════ MAIN PRODUCT SECTION ══════════ */}
      <section className="pdp-section">
        <div className="pdp-container">

          {/* ── LEFT: Gallery ── */}
          <div className="pdp-gallery">
            <div className="pdp-thumbs">
              {allImages.map((src, i) => (
                <img key={i} src={src} className={`pdp-thumb${currentImg === src ? " active" : ""}`} onClick={() => setMainImg(src)} alt="" />
              ))}
            </div>
            <div className="pdp-main-image-wrap">
              <div
                className="pdp-main-image"
                ref={imgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img src={currentImg} alt={product.name} />
                {product.discount > 0 && <span className="pdp-badge-discount">{product.discount}% OFF</span>}
              </div>
              {/* Zoom lens */}
              <div className="pdp-zoom-lens" style={zoomStyle}></div>
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="pdp-info">
            <span className="pdp-category-label">{categoryLabel}</span>
            <h1 className="pdp-title">{product.name}</h1>

            {/* Offer label */}
            <div className="pdp-special-price-label">Special Price</div>

            {/* Price */}
            <div className="pdp-price-section">
              <span className="pdp-new-price">₹{product.price.toLocaleString()}</span>
              {product.old_price && <span className="pdp-old-price">₹{product.old_price.toLocaleString()}</span>}
              {product.discount > 0 && <span className="pdp-discount-badge">{product.discount}% off</span>}
            </div>
            {product.gst_percent > 0 && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '8px' }}>
                + ₹{Math.round(product.price * product.gst_percent / 100).toLocaleString()} GST ({product.gst_percent}%) • Total: <strong>₹{(product.price + Math.round(product.price * product.gst_percent / 100)).toLocaleString()}</strong>
              </p>
            )}

            {product.description && (
              <p className="pdp-description">{product.description}</p>
            )}


            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="pdp-size-section">
                <p className="pdp-section-label">Color: <strong>{selectedColor}</strong></p>
                <div className="pdp-colors">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setSelectedColor(c)}
                      className={`pdp-color-swatch${selectedColor === c ? ' active' : ''}`}
                      style={{ background: c.startsWith('#') ? c : c.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="pdp-size-section">
              <p className="pdp-section-label">Size: <strong>{size || 'Select'}</strong></p>
              <div className="pdp-sizes">
                {(() => {
                  const rawSizes = product.sizes || [];
                  if (rawSizes.length === 0) return null;
                  const isObj = typeof rawSizes[0] === 'object';
                  return rawSizes.map(s => {
                    const sizeLabel = isObj ? s.size : s;
                    const sizeStock = isObj ? s.stock : null;
                    const outOfStock = sizeStock !== null && sizeStock <= 0;
                    return (
                      <button
                        key={sizeLabel}
                        className={`pdp-size-btn${size === sizeLabel ? ' active' : ''}${outOfStock ? ' disabled' : ''}`}
                        onClick={() => !outOfStock && setSize(sizeLabel)}
                        disabled={outOfStock}
                        title={outOfStock ? 'Out of stock' : sizeLabel}
                      >
                        {sizeLabel}
                        {outOfStock && <span style={{fontSize:'8px',display:'block',lineHeight:'1'}}>OOS</span>}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="pdp-cart-actions">
              {qty === 0 ? (
                <button className={`pdp-add-cart-btn ${addedToCart ? 'added' : ''}`} onClick={handleAddToCart}>
                  {addedToCart ? (
                    <><i className="fa-solid fa-check"></i> Added to Cart</>
                  ) : (
                    <><i className="fa-solid fa-bag-shopping"></i> GO TO CART</>
                  )}
                </button>
              ) : (
                <>
                  <div className="pdp-qty-selector">
                    <button onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
                  </div>
                  <button className="pdp-goto-cart-btn" onClick={() => window.location.hash = "#cart"}>
                    <i className="fa-solid fa-bag-shopping"></i> GO TO CART
                  </button>
                </>
              )}
              <button className="pdp-buy-now-btn" onClick={() => {
                if (qty === 0) handleAddToCart();
                window.location.hash = "#cart";
              }}>
                <i className="fa-solid fa-bolt"></i> BUY NOW
              </button>
            </div>

            {/* Delivery Info */}
            <div className="pdp-delivery-info">
              <div className="pdp-delivery-item">
                <i className="fa-solid fa-truck-fast"></i>
                <div>
                  <strong>Free Shipping</strong>
                  <span>On orders above ₹999</span>
                </div>
              </div>
              <div className="pdp-delivery-item">
                <i className="fa-solid fa-box-open"></i>
                <div>
                  <strong>Delivery in 2-4 days</strong>
                  <span>Dispatched within 24 hrs</span>
                </div>
              </div>
              <div className="pdp-delivery-item">
                <i className="fa-solid fa-rotate-left"></i>
                <div>
                  <strong>7 Day Easy Returns</strong>
                  <span>Hassle-free return policy</span>
                </div>
              </div>
              <div className="pdp-delivery-item">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>Secure Checkout</strong>
                  <span>100% safe payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SIMILAR PRODUCTS ══════════ */}
      {similarProducts.length > 0 && (
        <section className="pdp-similar-section">
          <div className="pdp-similar-header">
            <h2><i className="fa-solid fa-layer-group"></i> Similar Products</h2>
            <div className="pdp-similar-nav">
              <button className="pdp-scroll-btn" onClick={() => scrollSimilar(-1)}><i className="fa-solid fa-chevron-left"></i></button>
              <button className="pdp-scroll-btn" onClick={() => scrollSimilar(1)}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="pdp-similar-track" ref={similarRef}>
            {similarProducts.map(p => (
              <div className="pdp-similar-card" key={p.id}>
                <ProductCard product={p} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
      <CartBar />
    </>
  );
}
