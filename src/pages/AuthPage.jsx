import { useState, useEffect } from "react";
import ApiPage from "../api/ApiPage";
import authBg from "../assets/auth-bg.png";

export default function AuthPage({ initialView = "login" }) {
  const [view, setView] = useState(initialView); // login, register, otp
  const [formData, setFormData] = useState({ name: "", email: "", password: "", otp: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setView(initialView);
    setShowPassword(false);
    setError("");
  }, [initialView]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await ApiPage.login({ email: formData.email, password: formData.password });
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_user", JSON.stringify(data.customer));
      window.location.hash = "#home";
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

  const renderForm = () => {
    switch (view) {
      case "login":
        return (
          <div className="auth-container">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Please enter your details to sign in.</p>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <form className="auth-main-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="example@gmail.com" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" required onChange={handleChange} />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                  </span>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>
            <div className="auth-footer">
              Don't have an account? <span onClick={() => window.location.hash = "#signup"}>Create Account</span>
            </div>
          </div>
        );
      case "register":
      case "signup":
        return (
          <div className="auth-container">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join us today! It only takes a minute.</p>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <form className="auth-main-form" onSubmit={handleRegister}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="John Doe" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="example@gmail.com" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" required onChange={handleChange} />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                  </span>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            <div className="auth-footer">
              Already have an account? <span onClick={() => window.location.hash = "#login"}>Login</span>
            </div>
          </div>
        );
      case "otp":
        return (
          <div className="auth-container">
            <div className="auth-header">
              <h2>Verify Identity</h2>
              <p>We've sent a 6-digit code to your email.</p>
            </div>
            <div className="otp-info">Check: {formData.email}</div>
            {error && <div className="error-banner">{error}</div>}
            <form className="auth-main-form" onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <label>Verification Code</label>
                <input type="text" name="otp" placeholder="123456" required onChange={handleChange} maxLength="6" />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
            <div className="auth-footer">
              Didn't receive code? <span onClick={() => ApiPage.sendOtp(formData.email)}>Resend OTP</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <img src={authBg} alt="Fashion Auth" />
        <div className="auth-image-overlay">
          <h1>Experience<br />Luxury.</h1>
          <p>Join the COZY HOOD community and get access to exclusive drops and premium quality essentials.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div style={{ position: "absolute", top: "40px", left: "40px", cursor: "pointer", fontWeight: "700" }} onClick={() => window.location.hash = "#home"}>← BACK TO SHOP</div>
        {renderForm()}
      </div>
    </div>
  );
}
