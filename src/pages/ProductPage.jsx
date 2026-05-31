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

function normalizeReviewList(reviews) {
  if (Array.isArray(reviews)) return reviews;
  if (typeof reviews === "string") {
    try {
      const parsed = JSON.parse(reviews);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toInitials(name) {
  if (!name) return "CU";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("");
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
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "", image: "", imageName: "" });
  const [reviewError, setReviewError] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [pinned, setPinned] = useState(false);
  const imgRef = useRef(null);
  const similarRef = useRef(null);
  const reviewImageInputRef = useRef(null);

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

  useEffect(() => {
    const reviewKey = `product_reviews_${productId}`;
    let savedReviews = [];
    try {
      const raw = localStorage.getItem(reviewKey);
      savedReviews = raw ? normalizeReviewList(JSON.parse(raw)) : [];
    } catch {
      savedReviews = [];
    }

    const backendReviews = normalizeReviewList(product?.reviews);
    const merged = [...savedReviews, ...backendReviews].sort((a, b) => {
      const aTime = new Date(a.date || 0).getTime();
      const bTime = new Date(b.date || 0).getTime();
      return bTime - aTime;
    });
    setReviews(merged);
  }, [productId, product?.reviews]);

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

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa-star ${i < count ? "fa-solid" : "fa-regular"}`}></i>
    ));
  };

  const ratingCounts = reviews.reduce((acc, review) => {
    const value = Number(review.rating) || 0;
    if (value >= 1 && value <= 5) acc[value] += 1;
    return acc;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const totalRatings = reviews.length;
  const overallRating = totalRatings
    ? (reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / totalRatings)
    : 0;

  const handleReviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReviewForm(prev => ({ ...prev, image: String(reader.result || ""), imageName: file.name || "review-image.jpg" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const trimmedText = reviewForm.text.trim();
    const trimmedName = reviewForm.name.trim() || "Customer";
    if (!trimmedText) {
      setReviewError("Please enter your review text");
      return;
    }

    const newReview = {
      id: `local-${Date.now()}`,
      name: trimmedName,
      avatar: toInitials(trimmedName),
      rating: Number(reviewForm.rating),
      text: trimmedText,
      title: trimmedText.length > 45 ? `${trimmedText.slice(0, 45)}...` : trimmedText,
      image: reviewForm.image || "",
      date: new Date().toISOString(),
      verified: false,
      helpful: 0,
    };

    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);
    localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(nextReviews));
    setReviewForm({ name: reviewForm.name, rating: 5, text: "", image: "", imageName: "" });
    setReviewError("");
    if (reviewImageInputRef.current) reviewImageInputRef.current.value = "";
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

            {totalRatings > 0 && (
              <div className="pdp-rating-inline">
                <span className="pdp-rating-badge">{overallRating.toFixed(1)} <i className="fa-solid fa-star"></i></span>
                <span className="pdp-rating-count">{totalRatings.toLocaleString()} Review{totalRatings > 1 ? "s" : ""}</span>
              </div>
            )}

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

      <section className="pdp-reviews-section">
        <div className="pdp-tabs">
          <button className="pdp-tab active" type="button">
            <i className="fa-solid fa-star-half-stroke"></i> Ratings & Reviews
          </button>
        </div>

        <div className="pdp-reviews-content animate-fadeIn">
          <div className="pdp-rating-overview">
            <div className="pdp-rating-left">
              <div className="pdp-rating-big">{totalRatings > 0 ? overallRating.toFixed(1) : "0.0"}</div>
              <div className="pdp-rating-stars-big">{renderStars(Math.round(overallRating || 0))}</div>
              <div className="pdp-rating-total">{totalRatings.toLocaleString()} Review{totalRatings > 1 ? "s" : ""}</div>
            </div>
            <div className="pdp-rating-bars">
              {[5, 4, 3, 2, 1].map(star => (
                <div className="pdp-bar-row" key={star}>
                  <span className="pdp-bar-label">{star}<i className="fa-solid fa-star"></i></span>
                  <div className="pdp-bar-track">
                    <div
                      className={`pdp-bar-fill pdp-bar-${star}`}
                      style={{ width: `${totalRatings ? (ratingCounts[star] / totalRatings) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="pdp-bar-count">{ratingCounts[star]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdp-review-card" style={{ marginBottom: 16 }}>
            <h4 className="pdp-review-title" style={{ marginBottom: 12 }}>Write a Review</h4>
            <form onSubmit={handleSubmitReview}>
              <div style={{ display: "grid", gap: 10 }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Your name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#f59e0b", fontSize: 20 }}>
                  {Array.from({ length: 5 }, (_, idx) => {
                    const value = idx + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: value }))}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit" }}
                        aria-label={`Rate ${value} star`}
                      >
                        <i className={`fa-star ${value <= reviewForm.rating ? "fa-solid" : "fa-regular"}`}></i>
                      </button>
                    );
                  })}
                </div>
                <textarea
                  className="input-field"
                  placeholder="Share your experience with this product"
                  rows={4}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                />
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Add Review Photo (optional)</label>
                  <input
                    ref={reviewImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReviewImageChange}
                    style={{ display: "none" }}
                  />
                  <div className="pdp-review-upload-row">
                    <button
                      type="button"
                      className="pdp-review-upload-btn"
                      onClick={() => reviewImageInputRef.current?.click()}
                    >
                      <i className="fa-regular fa-image"></i>
                      {reviewForm.image ? "Change Photo" : "Upload Photo"}
                    </button>
                    <span className="pdp-review-upload-name">{reviewForm.imageName || "No file selected"}</span>
                  </div>
                  {reviewForm.image && (
                    <img
                      src={reviewForm.image}
                      alt="Review preview"
                      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border-light)" }}
                    />
                  )}
                </div>
                {reviewError && (
                  <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{reviewError}</p>
                )}
                <div>
                  <button className="pdp-show-more-btn" type="submit" style={{ margin: 0 }}>
                    Submit Review
                  </button>
                </div>
              </div>
            </form>
          </div>

          {reviews.length > 0 ? (
            <div className="pdp-review-list pdp-review-list-horizontal">
              {reviews.map(review => (
                <div className="pdp-review-card" key={review.id || `${review.name}-${review.date}`}>
                  <div className="pdp-review-header">
                    <div className="pdp-review-avatar">{review.avatar || toInitials(review.name)}</div>
                    <div className="pdp-review-meta">
                      <div className="pdp-review-name">
                        {review.name || "Customer"}
                        {review.verified && <span className="pdp-verified-badge"><i className="fa-solid fa-circle-check"></i> Verified</span>}
                      </div>
                      <div className="pdp-review-date">
                        {review.date ? new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </div>
                    </div>
                    <div className="pdp-review-rating-badge">{Number(review.rating) || 0}<i className="fa-solid fa-star"></i></div>
                  </div>
                  {review.title && <h4 className="pdp-review-title">{review.title}</h4>}
                  <p className="pdp-review-text">{review.text}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Customer review"
                      className="pdp-review-image"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="pdp-review-card">
              <p className="pdp-review-text" style={{ marginBottom: 0 }}>No reviews yet. Be the first to review this product.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartBar />
    </>
  );
}
