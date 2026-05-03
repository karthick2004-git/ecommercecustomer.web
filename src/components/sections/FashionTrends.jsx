export default function FashionTrends() {
  return (
    <section className="fashion-trends container">
      <div className="bg-text reveal">
        <span className="solid">THE</span>
        <span className="outline">LATEST</span><br />
        <span className="outline big">FASHION TRENDS</span>
      </div>
      <div className="layered-wrapper reveal-scale">
        <div className="card back-card"></div>
        <div className="card mid-card"></div>
        <div className="card main-card">
          <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=360&h=500&fit=crop" alt="fashion" />
        </div>
      </div>
    </section>
  );
}
