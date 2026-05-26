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
      </div>
    </section>
  );
}
