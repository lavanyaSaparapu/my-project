import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FireBaseConfig";
import "./SignIn.css";

export default function Signin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEmail = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setUser({ email });
    setStep(2);
  };

  const handleLogin = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await userCredential.user.getIdToken();

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify({
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        lastLogin: new Date().toISOString()
      }));

      // ✅ CHANGED ONLY THIS LINE
      navigate("/home");

    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found. Please sign up first.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleKeyPress = (e, stepNum) => {
    if (e.key === "Enter") {
      if (stepNum === 1) handleEmail();
      if (stepNum === 2) handleLogin();
    }
  };

  return (
    <div className="signin-container">

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

      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>

      <div className="glow-line line-1"></div>
      <div className="glow-line line-2"></div>

      {step === 1 && (
        <div className="card slide-in">
          <div className="card-glow"></div>
          <div className="card-icon">🔐</div>
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Enter your email to continue</p>
          
          <div className="input-group">
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => handleKeyPress(e, 1)} 
              autoFocus 
            />
            <span className="input-focus-glow"></span>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button className="btn-primary" onClick={handleEmail} disabled={!email || loading}>
            <span>Continue</span>
          </button>
          
          <div className="signup-link">
            Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card fade-in">
          <div className="card-glow"></div>
          <div className="avatar">
            <span>{email.charAt(0).toUpperCase()}</span>
          </div>
          <h2>Welcome back!</h2>
          <p className="subtitle">{email.split("@")[0]}</p>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => handleKeyPress(e, 2)} 
              autoFocus 
            />
            <span className="input-focus-glow"></span>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button className="btn-primary" onClick={handleLogin} disabled={!password || loading}>
            {loading ? <span className="spinner"></span> : <span>Resume Journey</span>}
          </button>
          
          <button className="btn-secondary" onClick={() => { 
            setStep(1); 
            setEmail(""); 
            setPassword(""); 
            setUser(null); 
            setError(""); 
          }}>
            ← Change Account
          </button>
        </div>
      )}
    </div>
  );
}