import ReviewCard from "../ui/ReviewCard";

const reviews = [
  { text: '"Amazing quality and super comfortable!"', author: "Emily", stars: "★★★★★", highlight: false },
  { text: '"Perfect hoodie for winter layering."', author: "Daniel", stars: "★★★★★", highlight: true },
  { text: '"Very stylish and worth the price."', author: "Sophia", stars: "★★★★☆", highlight: false },
];

export default function ReviewsSection() {
  return (
    <section className="reviews">
      <div className="container">
        <h2 className="section-title">OUR HAPPY CUSTOMERS</h2>
        <div className="review-grid">
          {reviews.map((r, i) => (
            <ReviewCard key={i} text={r.text} author={r.author} stars={r.stars} highlight={r.highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}
