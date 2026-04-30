export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-text">
          <h1>FROST <br /> FLAME <span>HOODIE</span></h1>
          <p>A hoodie is the perfect mix of comfort and style.</p>
          <button className="primary-btn" onClick={() => window.location.hash = "#collection"}>Start Shopping →</button>
        </div>
        <div className="hero-card">
          <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300" alt="hoodie" />
          <div className="card-info">
            <h3>Escondida Hoodie</h3>
            <span>$199</span>
          </div>
        </div>
      </div>
    </section>
  );
}
