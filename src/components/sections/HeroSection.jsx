import { useState } from "react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
      window.location.hash = `#collection/all?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-text animate-fadeInUp">
          <h1>Elevate Your <br /> Everyday <span>Style</span></h1>
          <p>Fresh fits. Bold vibes. Everyday flex.</p>
          
          <div className="hero-search-container stagger-1 animate-fadeInUp">
            <div className="hero-search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                placeholder="Search for hoodies, shirts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>

          <button className="primary-btn stagger-2 animate-fadeInUp" onClick={() => window.location.hash = "#collection"}>Start Shopping →</button>
        </div>
        <div className="hero-cards-container animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <div className="thread"></div>
          
          <div className="hero-card side-card left">
            <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300" alt="shirt" />
            <div className="card-info">
              <h3>Classic Shirt</h3>
              <span>$129</span>
            </div>
          </div>

          <div className="hero-card main-card">
            <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300" alt="hoodie" />
            <div className="card-info">
              <h3>Escondida Hoodie</h3>
              <span>$199</span>
            </div>
          </div>

          <div className="hero-card side-card right">
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300" alt="pants" />
            <div className="card-info">
              <h3>Slim Fit Pants</h3>
              <span>$149</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
