export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3 className="footer-logo">COZY HOOD</h3>
          <p className="footer-desc">Premium fashion brand delivering comfort & style. Every piece is crafted with care for the modern individual.</p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="social-link" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="#" className="social-link" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            <li><a href="#collection/new-arrivals">New Arrivals</a></li>
            <li><a href="#collection/shirts">Shirts</a></li>
            <li><a href="#collection/t-shirts">T-Shirts</a></li>
            <li><a href="#collection">All Products</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#orders">Track Order</a></li>
            <li><a href="#contact">Return Policy</a></li>
            <li><a href="#contact">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="newsletter-desc">Subscribe for exclusive deals & new drops.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button><i className="fa-solid fa-arrow-right"></i></button>
          </div>
          <div className="payment-methods">
            <span className="payment-label">We Accept</span>
            <div className="payment-icons">
              <span>💳</span>
              <span>📱</span>
              <span>🏦</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2025 Cozy Hood. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
