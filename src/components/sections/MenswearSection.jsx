const menswearImages = [
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=350",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=350",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=350",
];

export default function MenswearSection() {
  return (
    <section className="menswear container">
      <h2 className="section-title">NEW MENSWEAR ARRIVAL</h2>
      <div className="menswear-box">
        {menswearImages.map((src, i) => (
          <div className="menswear-img" key={i}><img src={src} alt="menswear" /></div>
        ))}
        <div className="menswear-content">
          <h3>Urban Street Hoodie</h3>
          <p>Premium menswear hoodie designed for modern street fashion. Soft cotton blend, relaxed fit, and ultra stylish look.</p>
          <h4>$249.00</h4>
          <button className="primary-btn" onClick={() => window.location.hash = "#collection"}>Shop Now →</button>
        </div>
      </div>
    </section>
  );
}
