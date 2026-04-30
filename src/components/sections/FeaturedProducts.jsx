import ProductCard from "../ui/ProductCard";

export default function FeaturedProducts({ products, loading }) {
  return (
    <section className="featured-products container" style={{padding:"80px 0"}}>
      <h2 style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: "36px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "3px",
        marginBottom: "50px",
        fontWeight: "700",
        color: "#111"
      }}>Featured Selection</h2>
      <div className="product-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "30px",
        marginTop: "40px"
      }}>
        {loading ? (
          <p>Loading featured products...</p>
        ) : products.length > 0 ? (
          products.slice(0, 4).map(p => (
            <ProductCard 
              key={p.id} 
              product={{...p, img: p.image_url}} 
              addToCart={() => {
                // This would need a global cart context or similar
                // For now, redirect to shop or just trigger shop logic
                window.location.hash = `#collection`;
              }}
            />
          ))
        ) : (
          <p>No products featured yet.</p>
        )}
      </div>
    </section>
  );
}
