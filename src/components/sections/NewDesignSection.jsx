export default function NewDesignSection() {
  return (
    <section className="new-hoodie-section container">
      <div className="unique-layered-container reveal">
        <div className="text-backdrop">
          <h1 className="bg-text-top">NEW SHIRT</h1>
          <h2 className="bg-text-bottom">DESIGN</h2>
        </div>
        <div className="floating-img-wrapper reveal-scale">
          <img 
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&h=1200&fit=crop" 
            alt="model" 
            className="large-shirt-img" 
          />
        </div>
        <div className="side-content reveal-right">
          <div className="content-box">
            <p className="description">Explore our latest craftsmanship in fabric and design. This unique piece blends urban streetwear aesthetics with premium comfort, creating a silhouette that stands out.</p>
            <button className="explore-btn" onClick={() => window.location.hash = "#collection"}>
              EXPLORE MORE HOODIE 
              <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
