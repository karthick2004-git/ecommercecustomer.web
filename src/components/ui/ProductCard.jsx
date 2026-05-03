import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, wishlist, toggleWishlist }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const qty = cartItem ? (cartItem.quantity || 1) : 0;

  const categoryLabel = {
    "new-arrivals": "New Arrival",
    "shirts": "Shirt",
    "t-shirts": "T-Shirt",
  }[product.category] || product.category;

  return (
    <div className="product-card animate-fadeInUp">
      {product.discount > 0 && <span className="discount">{product.discount}% OFF</span>}
      <div 
        className={`wishlist-btn${wishlist?.includes(product.id) ? " active" : ""}`} 
        onClick={() => toggleWishlist?.(product.id)}
      >
        <i className={`fa-${wishlist?.includes(product.id) ? 'solid' : 'regular'} fa-heart`}></i>
      </div>
      
      <div className="img-wrapper" onClick={() => window.location.hash = `#product/${product.id}`}>
        <img 
          src={product.image_url || product.img} 
          alt={product.name} 
          loading="lazy"
        />
      </div>

      <div className="product-card-info">
        <span className="product-category-tag">{categoryLabel}</span>
        <h4>{product.name}</h4>
        
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <span className="stock-badge">Only {product.stock} left!</span>
        )}
        
        <div className="price-box">
          <div className="price-group">
            {product.old_price && <span className="old-price">₹{product.old_price?.toLocaleString()}</span>}
            <span className="price">₹{product.price?.toLocaleString()}</span>
          </div>
          
          {qty === 0 ? (
            <button className="add-cart-btn" onClick={() => addToCart(product)}>
              <i className="fa-solid fa-bag-shopping" style={{fontSize: '11px'}}></i>
              Add
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={() => updateQuantity(product.id, qty + 1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
