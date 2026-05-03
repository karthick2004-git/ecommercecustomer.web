import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ui/ProductCard";
import CartBar from "../components/ui/CartBar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ApiPage from "../api/ApiPage";

export default function ShopPage({ category }) {
  const { cart } = useCart();
  const [productList, setProductList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState(0);
  const [loading, setLoading] = useState(true);

  const categoryLabel = {
    "new-arrivals": "New Arrivals",
    "shirts": "Shirts",
    "t-shirts": "T-Shirts",
    "all": "All Products",
  }[category] || "Collection";

  const categoryDesc = {
    "new-arrivals": "Discover the latest styles fresh off the runway",
    "shirts": "Classic & modern shirts for every occasion",
    "t-shirts": "Comfortable everyday essentials",
    "all": "Browse our complete collection",
  }[category] || "Explore our curated selection";

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await ApiPage.fetchProducts(category, sort);
        setProductList(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, sort]);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]search=([^&]*)/);
    if (match) {
      setSearchQuery(decodeURIComponent(match[1]));
    } else {
      setSearchQuery("");
    }
  }, [category]);

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWishlist = (id) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const categories = [
    { label: "New Arrivals", slug: "new-arrivals" },
    { label: "Shirts", slug: "shirts" },
    { label: "T-Shirts", slug: "t-shirts" },
  ];

  return (
    <>
      <Navbar />

      <div className="shop-container">
        {/* Collection Header */}
        <div className="collection-header">
          <h1>{categoryLabel}</h1>
          <p>{searchQuery ? `Search results for "${searchQuery}"` : categoryDesc}</p>
          <div className="category-chips">
            {categories.map(cat => (
              <a 
                key={cat.slug}
                href={`#collection/${cat.slug}`}
                className={`category-chip ${category === cat.slug ? "active" : ""}`}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        <main className="products-area">
          <div className="top-bar">
            <div className="top-bar-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery("")}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            <div className="top-bar-right">
              <p className="result-count">
                <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              <select id="selecte" value={sort} onChange={e => setSort(Number(e.target.value))}>
                <option value={0}>Sort by popularity</option>
                <option value={1}>Price: Low to High</option>
                <option value={2}>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="product-grid stagger-children">
            {loading ? (
              // Skeleton loading cards
              Array.from({ length: 4 }).map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton-info">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-price"></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={{ ...p, img: p.image_url }}
                  wishlist={wishlist}
                  toggleWishlist={() => toggleWishlist(p.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>{searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "This category is empty for now"}</p>
                <button className="browse-btn" onClick={() => window.location.hash = "#collection/new-arrivals"}>
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
      <CartBar />
    </>
  );
}
