export default function ReviewCard({ text, author, stars, highlight }) {
  return (
    <div className={`review-card${highlight ? " highlight" : ""}`}>
      {highlight ? (
        <div className="color"><p>{text}</p></div>
      ) : (
        <p>{text}</p>
      )}
      <h4>– {author}</h4>
      <div className="stars">{stars}</div>
    </div>
  );
}
