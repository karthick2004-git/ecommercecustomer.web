export default function CollectionCard({ label, img, onClick }) {
  return (
    <div className="collection-card" onClick={onClick} style={{cursor:"pointer"}}>
      <img src={img} alt={label} />
      <h4>{label}</h4>
    </div>
  );
}
