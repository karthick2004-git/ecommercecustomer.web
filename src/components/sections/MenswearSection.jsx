const menswearImages = [
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
  "https://images.unsplash.com/photo-1516257984877-a03aae3acbc8?w=500",
];

export default function MenswearSection() {
  return (
    <section className="menswear container">
      <h2 className="section-title reveal">NEW MENSWEAR ARRIVAL</h2>
      <div className="menswear-box">
        <div className="menswear-images-grid">
          {menswearImages.map((src, i) => (
            <div className={`menswear-img reveal-scale stagger-${i + 1}`} key={i}>
              <img src={src} alt="menswear" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
