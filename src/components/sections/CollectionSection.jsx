import CollectionCard from "../ui/CollectionCard";

const collections = [
  { label: "Shirts", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300" },
  { label: "Formal Shirts", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300" },
  { label: "T-Shirts", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300" },
  { label: "PANTS", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300" },
];

export default function CollectionSection() {
  return (
    <section className="collection container">
      <h2 className="section-title reveal">OUR COLLECTION</h2>
      <div className="collection-grid">
        {collections.map((c, i) => (
          <div key={i} className={`reveal stagger-${i + 1}`}>
            <CollectionCard
              label={c.label}
              img={c.img}
              onClick={() => window.location.hash = "#collection"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
