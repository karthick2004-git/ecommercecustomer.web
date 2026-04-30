import { useState } from "react";
import ApiPage from "../../api/ApiPage";

export default function AuthModal({ authModal, setAuthModal }) {
  const [view, setView] = useState(authModal || "login"); // login, register, otp
  const [formData, setFormData] = useState({ name: "", email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authModal) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await ApiPage.login({ email: formData.email, password: formData.password });
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_user", JSON.stringify(data.customer));
      setAuthModal(null);
      window.location.reload();
    } catch (err) {
      if (err.message.includes("verify")) {
        setView("otp");
        await ApiPage.sendOtp(formData.email);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await ApiPage.register({ name: formData.name, email: formData.email, password: formData.password });
      await ApiPage.sendOtp(formData.email);
      setView("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await ApiPage.verifyOtp(formData.email, formData.otp);
      setView("login");
      setError("Email verified! Please login.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal" style={{display:"flex"}} onClick={e => e.target === e.currentTarget && setAuthModal(null)}>
      <div className="auth-box">
        <span className="close-modal" onClick={() => setAuthModal(null)}>×</span>
        
        {view === "login" && (
          <form className="auth-form" style={{display:"flex"}} onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error-msg" style={{color:"red", fontSize:"12px"}}>{error}</p>}
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <button type="submit" disabled={loading}>{loading ? "Checking..." : "Login"}</button>
            <p className="forgot" onClick={() => setView("register")}>New user? Create Account</p>
          </form>
        )}

        {view === "register" && (
          <form className="auth-form" style={{display:"flex"}} onSubmit={handleRegister}>
            <h2>Create Account</h2>
            {error && <p className="error-msg" style={{color:"red", fontSize:"12px"}}>{error}</p>}
            <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <button type="submit" disabled={loading}>{loading ? "Registering..." : "Create Account"}</button>
            <p className="forgot" onClick={() => setView("login")}>Already have an account? Login</p>
          </form>
        )}

        {view === "otp" && (
          <form className="auth-form" style={{display:"flex"}} onSubmit={handleVerifyOtp}>
            <h2>Verify OTP</h2>
            <p style={{fontSize:"12px", textAlign:"center", marginBottom:"10px"}}>We sent an OTP to {formData.email}</p>
            {error && <p className="error-msg" style={{color:"red", fontSize:"12px"}}>{error}</p>}
            <input type="text" name="otp" placeholder="Enter 6-digit OTP" required onChange={handleChange} />
            <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
            <p className="forgot" onClick={() => ApiPage.sendOtp(formData.email)}>Resend OTP</p>
          </form>
        )}
      </div>
    </div>
  );
}
