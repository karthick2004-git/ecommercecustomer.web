export default function NewDesignSection() {
  return (
    <section className="new-hoodie-section container">
      <div className="hero-top reveal">
        <h1 className="big-title">NEW SHIRT</h1>
      </div>
      <div className="hero-content">
        <div className="left-images reveal-left">
          <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300&h=800&fit=crop" alt="model" style={{height:"400px",objectFit:"contain"}} />
        </div>
        <div className="right-content reveal-right">
          <h2 className="design-text">DESIGN</h2>
          <p>It looks like you're referring to Hoodie Allen, a rapper and singer songwriter who first gained recognition through his mixtapes and independent releases before moving into the mainstream.</p>
          <button className="explore-btn" onClick={() => window.location.hash = "#collection"}>EXPLORE MORE HOODIE →</button>
        </div>
      </div>
    </section>
  );
}
