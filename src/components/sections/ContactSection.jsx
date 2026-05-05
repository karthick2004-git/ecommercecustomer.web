import { useState, useEffect } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", city: "", pincode: "", type: "Support", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/customer/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setSuccess(true);
      setForm({ name: "", phone: "", city: "", pincode: "", type: "Support", message: "" });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-location container">
      <div className="contact-grid">
        <div className="contact-form reveal-left">
          <h2>Customer Support</h2>
          <p>Contact us anytime for orders or support.</p>
          <form onSubmit={handleSubmit}>
            <div style={{display:"flex", gap:"10px", marginBottom:"15px"}}>
              <label style={{display:"flex", alignItems:"center", gap:"5px", cursor:"pointer", fontSize:"14px"}}>
                <input type="radio" name="type" value="Support" checked={form.type === "Support"} onChange={e => setForm({...form, type: e.target.value})} /> Support
              </label>
              <label style={{display:"flex", alignItems:"center", gap:"5px", cursor:"pointer", fontSize:"14px"}}>
                <input type="radio" name="type" value="Complaint" checked={form.type === "Complaint"} onChange={e => setForm({...form, type: e.target.value})} /> Complaint
              </label>
            </div>
            <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            <input type="text" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
            <input type="text" placeholder="Pincode" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} required />
            <textarea placeholder="Your Message (Optional)" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows="4"></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="contact-map reveal-right">
          <h2>Our Location</h2>
          <iframe src="https://www.google.com/maps?q=84/c+muniyandi+kovil+street,bethaniyapuram,madurai+625016&output=embed" loading="lazy" title="location"></iframe>
        </div>
      </div>
      {loading && <LoadingSpinner />}
      
      {/* Toast Notification */}
      <div className={`toast-message ${success ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">✅</span>
          <div className="toast-text">
            <h3>Message Sent!</h3>
            <p>We will contact you shortly.</p>
          </div>
          <button className="toast-close" onClick={() => setSuccess(false)}>×</button>
        </div>
      </div>
    </section>
  );
  
}
