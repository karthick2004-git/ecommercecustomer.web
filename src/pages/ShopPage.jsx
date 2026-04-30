import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ui/ProductCard";
import CartBar from "../components/ui/CartBar";
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
  }[category] || "Collection";

  // Fetch products from API
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

  // Extract search from hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]search=([^&]*)/);
    if (match) {
      setSearchQuery(decodeURIComponent(match[1]));
    } else {
      setSearchQuery("");
    }
  }, [category]); // Re-run when category changes (which includes the whole hash)

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Update hash without losing category
    const baseHash = window.location.hash.split('?')[0];
    if (val.trim()) {
      window.location.hash = `${baseHash}?search=${encodeURIComponent(val.trim())}`;
    } else {
      window.location.hash = baseHash;
    }
  };

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWishlist = (id) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <header className="navbar" style={{background:"#111",color:"white"}}>
        <div className="logo" style={{color:"white",cursor:"pointer"}} onClick={() => window.location.hash = "#home"}>COZY HOOD</div>
        <nav className="nav-links" style={{display:"flex",gap:"25px"}}>
          {["Home","New Arrivals","Shirts","T-Shirts"].map((label,i) => {
            const hash = ["#home","#collection/new-arrivals","#collection/shirts","#collection/t-shirts"][i];
            return <a key={i} href={hash} style={{color:"white",textDecoration:"none",fontSize:"14px"}}>{label}</a>;
          })}
          <a href="#orders" style={{color:"white",textDecoration:"none",fontSize:"14px"}}>My Orders</a>
        </nav>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="wishlist-icon">❤️ <span>{wishlist.length}</span></div>
          <div className="cart-icon" onClick={() => window.location.hash = "#cart"} style={{cursor:"pointer"}}>🛒 <span id="cart-count">{cart.length}</span></div>
        </div>
      </header>

      <div className="shop-container">
        <main className="products-area">
          <div className="top-bar">
            <p>Showing 1–{filteredProducts.length} of {filteredProducts.length} results ({categoryLabel})</p>
            <select id="selecte" value={sort} onChange={e => setSort(Number(e.target.value))}>
              <option value={0}>Sort by popularity</option>
              <option value={1}>Price: Low to High</option>
              <option value={2}>Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {loading ? (
              <p>Loading products...</p>
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
              <p>No products found {searchQuery ? `for "${searchQuery}"` : "in this category"}.</p>
            )}
          </div>
        </main>
      </div>

      <Footer />
      <CartBar />
    </>
  );
}
