export default function ContactPage() {
  return (
    <section className="contact-page active">
      <div className="contact-container">
        <div className="form-card">
          <h2>Delivery Details</h2>
          <p className="sub-text">Enter your shipping information below.</p>
          <form onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Full Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <textarea rows="3" placeholder="Address" required></textarea>
            <input type="text" placeholder="Pincode" required />
            <input type="text" defaultValue="Madurai" required />
            <input type="text" defaultValue="Tamil Nadu" required />
            <button type="submit">Contact more Details</button>
          </form>
        </div>
        <div className="map-card">
          <h2>Our Location</h2>
          <iframe src="https://www.google.com/maps?q=Madurai&output=embed" title="map"></iframe>
        </div>
      </div>
    </section>
  );
}
