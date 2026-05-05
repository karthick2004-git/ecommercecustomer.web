export default function ContactPage() {
  return (
    <section className="contact-page active">
      <div className="contact-container">
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <p className="sub-text">We'd love to hear from you. Here is how you can reach us.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="icon"><i className="fa-solid fa-location-dot"></i></div>
              <div className="text">
                <h3>Our Address</h3>
                <p>84/c muniyandi kovil street, bethaniyapuram, madurai 625016</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon"><i className="fa-solid fa-phone"></i></div>
              <div className="text">
                <h3>Phone Number</h3>
                <p>+91 8807756108</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon"><i className="fa-solid fa-envelope"></i></div>
              <div className="text">
                <h3>Email Address</h3>
                <p>atixoutfits@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="map-card">
          <h2>Our Location</h2>
          <iframe 
            src="https://www.google.com/maps?q=84/c+muniyandi+kovil+street,bethaniyapuram,madurai+625016&output=embed" 
            title="map"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
