import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, wishlist, toggleWishlist }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const qty = cartItem ? (cartItem.quantity || 1) : 0;

  return (
    <div className="product-card">
      {product.discount > 0 && <span className="discount">{product.discount}% OFF</span>}
      <div className={`wishlist-btn${wishlist?.includes(product.id) ? " active" : ""}`} onClick={() => toggleWishlist?.(product.id)}>❤</div>
      
      <div className="img-wrapper" onClick={() => window.location.hash = `#product/${product.id}`}>
        <img src={product.image_url || product.img} alt={product.name} />
      </div>

      <div className="product-card-info">
        <h4>{product.name}</h4>
        <div className="price-box">
          <div className="price-group">
            {product.old_price && <span className="old-price">₹{product.old_price?.toLocaleString()}</span>}
            <span className="price">₹{product.price?.toLocaleString()}</span>
          </div>
          
          {qty === 0 ? (
            <button className="add-cart-btn" style={{marginTop:0, padding:"8px 15px"}} onClick={() => addToCart(product)}>+ Add</button>
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
