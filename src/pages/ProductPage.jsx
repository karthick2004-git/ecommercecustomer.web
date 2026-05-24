import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartBar from "../components/ui/CartBar";
import ProductCard from "../components/ui/ProductCard";
import ApiPage from "../api/ApiPage";

/* ── Static review & Q/A data (until backend review system is built) ── */
const STATIC_REVIEWS = [
  { id: 1, name: "Rahul Sharma", avatar: "RS", rating: 5, date: "2026-05-10", verified: true, title: "Excellent quality fabric!", text: "Really impressed with the material. Fits perfectly and looks premium. Delivery was fast too. Would definitely recommend to anyone looking for quality clothing.", helpful: 24 },
  { id: 2, name: "Priya Menon", avatar: "PM", rating: 4, date: "2026-04-28", verified: true, title: "Great value for money", text: "Good quality product at this price range. The color is exactly as shown in the pictures. Stitching quality is top-notch. Only minus is the packaging could be better.", helpful: 18 },
  { id: 3, name: "Arjun Patel", avatar: "AP", rating: 5, date: "2026-04-15", verified: true, title: "Perfect fit, amazing comfort", text: "Ordered my regular size and it fits like a glove. The fabric is breathable and comfortable for all-day wear. Already ordering another one in a different color!", helpful: 31 },
  { id: 4, name: "Sneha Reddy", avatar: "SR", rating: 4, date: "2026-03-22", verified: false, title: "Loved the design", text: "Stylish and trendy. Got many compliments wearing this. Material feels durable. Wash quality is good — no color fading after multiple washes.", helpful: 12 },
  { id: 5, name: "Karthik N", avatar: "KN", rating: 3, date: "2026-03-10", verified: true, title: "Decent but runs slightly large", text: "Product quality is good but sizing runs a bit large. I'd suggest ordering one size smaller. Other than that, the fabric and finish are nice.", helpful: 8 },
];

const STAR_DISTRIBUTION = { 5: 58, 4: 24, 3: 10, 2: 5, 1: 3 };
const OVERALL_RATING = 4.3;
const TOTAL_RATINGS = 847;
const TOTAL_REVIEWS = 312;

const STATIC_QA = [
  { id: 1, question: "Is this product true to size?", answer: "Yes, this product follows standard Indian sizing. We recommend checking the size chart for the best fit. If you're between sizes, we suggest going one size up for a comfortable fit.", askedBy: "Anil K.", answeredBy: "ATIX OUTFITS", date: "2026-04-20" },
  { id: 2, question: "What is the fabric material used?", answer: "This product is made from premium quality cotton blend fabric that is breathable, comfortable, and durable. It maintains its shape and color even after multiple washes.", askedBy: "Meena S.", answeredBy: "ATIX OUTFITS", date: "2026-04-15" },
  { id: 3, question: "Is cash on delivery available?", answer: "Yes, Cash on Delivery (COD) is available for all orders. You can also pay via UPI, bank transfer, or other online payment methods during checkout.", askedBy: "Ravi M.", answeredBy: "ATIX OUTFITS", date: "2026-03-28" },
  { id: 4, question: "Can I return or exchange if the size doesn't fit?", answer: "Absolutely! We offer easy returns and exchanges within 7 days of delivery. The product should be unused with original tags intact. Please contact our support team to initiate a return.", askedBy: "Deepa J.", answeredBy: "ATIX OUTFITS", date: "2026-03-15" },
];

const HIGHLIGHTS = [
  "Premium quality cotton blend fabric",
  "Comfortable regular fit for everyday wear",
  "Machine washable — gentle cycle recommended",
  "Suitable for casual & semi-formal occasions",
  "Reinforced stitching for long-lasting durability",
  "Available in multiple sizes",
];

const SPECIFICATIONS = [
  { label: "Fabric", value: "Cotton Blend" },
  { label: "Fit", value: "Regular Fit" },
  { label: "Sleeve", value: "Full Sleeve" },
  { label: "Pattern", value: "Solid" },
  { label: "Neck Type", value: "Round Neck" },
  { label: "Occasion", value: "Casual, Semi-Formal" },
  { label: "Wash Care", value: "Machine Wash" },
  { label: "Country of Origin", value: "India" },
];

/* ══════════════════════════════════════════════ */

export default function ProductPage({ productId }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(null);
  const [size, setSize] = useState("M");
  const [addedToCart, setAddedToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [expandedQA, setExpandedQA] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
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

  /* ── Review helpers ── */
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa-star ${i < count ? 'fa-solid' : 'fa-regular'}`}></i>
    ));
  };

  const visibleReviews = showAllReviews ? STATIC_REVIEWS : STATIC_REVIEWS.slice(0, 3);

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
              {imgs.map((src, i) => (
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

            {/* Rating summary inline */}
            <div className="pdp-rating-inline">
              <span className="pdp-rating-badge">{OVERALL_RATING} <i className="fa-solid fa-star"></i></span>
              <span className="pdp-rating-count">{TOTAL_RATINGS.toLocaleString()} Ratings & {TOTAL_REVIEWS} Reviews</span>
            </div>

            {/* Offer label */}
            <div className="pdp-special-price-label">Special Price</div>

            {/* Price */}
            <div className="pdp-price-section">
              <span className="pdp-new-price">₹{product.price.toLocaleString()}</span>
              {product.old_price && <span className="pdp-old-price">₹{product.old_price.toLocaleString()}</span>}
              {product.discount > 0 && <span className="pdp-discount-badge">{product.discount}% off</span>}
            </div>

            {product.description && (
              <p className="pdp-description">{product.description}</p>
            )}

            {/* Sizes */}
            <div className="pdp-size-section">
              <p className="pdp-section-label">Size: <strong>{size}</strong></p>
              <div className="pdp-sizes">
                {(product.sizes || ["M","L","XL","XXL"]).map(s => (
                  <button key={s} className={`pdp-size-btn${size === s ? " active" : ""}`} onClick={() => setSize(s)}>{s}</button>
                ))}
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

      {/* ══════════ HIGHLIGHTS & SPECS ══════════ */}
      <section className="pdp-details-section">
        <div className="pdp-details-grid">
          {/* Highlights */}
          <div className="pdp-highlights-card">
            <h3><i className="fa-solid fa-list-check"></i> Product Highlights</h3>
            <ul className="pdp-highlights-list">
              {HIGHLIGHTS.map((item, i) => (
                <li key={i}>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="pdp-specs-card">
            <h3><i className="fa-solid fa-table-list"></i> Specifications</h3>
            <table className="pdp-specs-table">
              <tbody>
                {SPECIFICATIONS.map((spec, i) => (
                  <tr key={i}>
                    <td className="pdp-spec-label">{spec.label}</td>
                    <td className="pdp-spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* ══════════ REVIEWS & Q&A TABS ══════════ */}
      <section className="pdp-reviews-section">
        <div className="pdp-tabs">
          <button className={`pdp-tab${activeTab === "reviews" ? " active" : ""}`} onClick={() => setActiveTab("reviews")}>
            <i className="fa-solid fa-star-half-stroke"></i> Ratings & Reviews
          </button>
          <button className={`pdp-tab${activeTab === "qa" ? " active" : ""}`} onClick={() => setActiveTab("qa")}>
            <i className="fa-solid fa-circle-question"></i> Questions & Answers
          </button>
        </div>

        {/* ── Reviews Tab ── */}
        {activeTab === "reviews" && (
          <div className="pdp-reviews-content animate-fadeIn">
            {/* Rating Overview */}
            <div className="pdp-rating-overview">
              <div className="pdp-rating-left">
                <div className="pdp-rating-big">{OVERALL_RATING}</div>
                <div className="pdp-rating-stars-big">{renderStars(Math.round(OVERALL_RATING))}</div>
                <div className="pdp-rating-total">{TOTAL_RATINGS.toLocaleString()} Ratings &<br />{TOTAL_REVIEWS} Reviews</div>
              </div>
              <div className="pdp-rating-bars">
                {[5,4,3,2,1].map(star => (
                  <div className="pdp-bar-row" key={star}>
                    <span className="pdp-bar-label">{star}<i className="fa-solid fa-star"></i></span>
                    <div className="pdp-bar-track">
                      <div
                        className={`pdp-bar-fill pdp-bar-${star}`}
                        style={{ width: `${STAR_DISTRIBUTION[star]}%` }}
                      ></div>
                    </div>
                    <span className="pdp-bar-count">{Math.round(TOTAL_RATINGS * STAR_DISTRIBUTION[star] / 100)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="pdp-review-list">
              {visibleReviews.map(review => (
                <div className="pdp-review-card" key={review.id}>
                  <div className="pdp-review-header">
                    <div className="pdp-review-avatar">{review.avatar}</div>
                    <div className="pdp-review-meta">
                      <div className="pdp-review-name">
                        {review.name}
                        {review.verified && <span className="pdp-verified-badge"><i className="fa-solid fa-circle-check"></i> Verified</span>}
                      </div>
                      <div className="pdp-review-date">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="pdp-review-rating-badge">{review.rating}<i className="fa-solid fa-star"></i></div>
                  </div>
                  <h4 className="pdp-review-title">{review.title}</h4>
                  <p className="pdp-review-text">{review.text}</p>
                  <div className="pdp-review-footer">
                    <button className="pdp-helpful-btn">
                      <i className="fa-regular fa-thumbs-up"></i> Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {STATIC_REVIEWS.length > 3 && (
              <button className="pdp-show-more-btn" onClick={() => setShowAllReviews(!showAllReviews)}>
                {showAllReviews ? "Show Less Reviews" : `View All ${STATIC_REVIEWS.length} Reviews`}
                <i className={`fa-solid fa-chevron-${showAllReviews ? "up" : "down"}`}></i>
              </button>
            )}
          </div>
        )}

        {/* ── Q&A Tab ── */}
        {activeTab === "qa" && (
          <div className="pdp-qa-content animate-fadeIn">
            <div className="pdp-qa-list">
              {STATIC_QA.map(qa => (
                <div className={`pdp-qa-item${expandedQA === qa.id ? " expanded" : ""}`} key={qa.id}>
                  <button className="pdp-qa-question" onClick={() => setExpandedQA(expandedQA === qa.id ? null : qa.id)}>
                    <div className="pdp-qa-q-icon">Q</div>
                    <span>{qa.question}</span>
                    <i className={`fa-solid fa-chevron-${expandedQA === qa.id ? "up" : "down"} pdp-qa-arrow`}></i>
                  </button>
                  <div className="pdp-qa-answer-wrap">
                    <div className="pdp-qa-answer">
                      <div className="pdp-qa-a-icon">A</div>
                      <div>
                        <p>{qa.answer}</p>
                        <div className="pdp-qa-meta">
                          <span>Answered by <strong>{qa.answeredBy}</strong></span>
                          <span>{new Date(qa.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
      <CartBar />
    </>
  );
}
