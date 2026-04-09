import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/FireBaseConfig";
import "./SignUp.css";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Parallax effect on orbs (same as SignIn)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password strength calculator
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.match(/[A-Z]/)) score++;
    if (pwd.match(/[0-9]/)) score++;
    if (pwd.match(/[^A-Za-z0-9]/)) score++;
    return Math.min(score, 4);
  };
  const passwordStrength = calculateStrength(password);
  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ff4d4d", "#ff9f4d", "#ffd966", "#6bc46d", "#2ecc71"];

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const doPasswordsMatch = () => password === confirmPassword;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSignup = async () => {
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    if (!fullName || !email || !password || !confirmPassword) return;
    if (!isEmailValid()) return;
    if (!doPasswordsMatch()) return;
    if (passwordStrength < 2) return;

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      alert("Account created! Please log in.");
      navigate("/signin");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect");
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="signup-container">
      {/* Animated gradient orbs with parallax */}
      <div 
        className="orb orb-1"
        style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 15}px)` }}
      ></div>
      <div 
        className="orb orb-2"
        style={{ transform: `translate(${-mousePosition.x * 25}px, ${-mousePosition.y * 20}px)` }}
      ></div>
      <div 
        className="orb orb-3"
        style={{ transform: `translate(${mousePosition.x * 15}px, ${-mousePosition.y * 10}px)` }}
      ></div>

      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>

      {/* Glow lines */}
      <div className="glow-line line-1"></div>
      <div className="glow-line line-2"></div>

      {/* Glassmorphic Card */}
      <div className="signup-card">
        <div className="card-glow"></div>
        <div className="card-content">
          <div className="header">
            <h1>Create account</h1>
            <p>Join the future of digital experience</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div className="input-group floating-label-group">
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={touched.fullName && !fullName ? "error" : ""}
              />
              <label htmlFor="fullName" className={fullName ? "filled" : ""}>
                <i className="field-icon">👤</i> Full name
              </label>
              {touched.fullName && !fullName && (
                <span className="error-msg">Name is required</span>
              )}
            </div>

            {/* Email */}
            <div className="input-group floating-label-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={touched.email && (!email || !isEmailValid()) ? "error" : ""}
              />
              <label htmlFor="email" className={email ? "filled" : ""}>
                <i className="field-icon">✉️</i> Email address
              </label>
              {touched.email && !email && (
                <span className="error-msg">Email is required</span>
              )}
              {touched.email && email && !isEmailValid() && (
                <span className="error-msg">Enter a valid email</span>
              )}
            </div>

            {/* Password */}
            <div className="input-group floating-label-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={touched.password && password && passwordStrength < 2 ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <label htmlFor="password" className={password ? "filled" : ""}>
                <i className="field-icon">🔒</i> Password
              </label>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="strength-meter">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength + 1) * 20}%`,
                      backgroundColor: strengthColors[passwordStrength],
                    }}
                  ></div>
                </div>
                <div className="strength-text" style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]}
                  {passwordStrength < 2 && (
                    <span className="strength-tip">
                      Use 6+ chars, uppercase, number & symbol
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="input-group floating-label-group">
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={touched.confirmPassword && (!doPasswordsMatch() || !confirmPassword) ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <label htmlFor="confirmPassword" className={confirmPassword ? "filled" : ""}>
                <i className="field-icon">🔐</i> Confirm password
              </label>
              {touched.confirmPassword && confirmPassword && !doPasswordsMatch() && (
                <span className="error-msg">Passwords do not match</span>
              )}
            </div>

            <button
              type="button"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              onClick={(e) => {
                createRipple(e);
                handleSignup();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <span>Sign up</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>
            <div className="social-buttons">
              <button type="button" className="social-btn" onClick={createRipple}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button type="button" className="social-btn" onClick={createRipple}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.48 0-.24-.01-.88-.01-1.72-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="login-redirect">
              Already have an account? <a href="/signin">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;