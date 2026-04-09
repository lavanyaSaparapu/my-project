import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../App.css";

function Welcome() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const cardRef = useRef(null);
  const leftPanelRef = useRef(null);

  // Parallax effect on floating shapes and orbs
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
      
      // Update CSS variables for parallax
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll effect (if page becomes scrollable)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card 3D tilt (separate from global mouse)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleCardMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
      card.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / rect.width * 100}%`);
      card.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / rect.height * 100}%`);
    };
    card.addEventListener('mousemove', handleCardMove);
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    });
    return () => card.removeEventListener('mousemove', handleCardMove);
  }, []);

  return (
    <div className="welcome-container-enhanced">
      {/* Animated gradient orbs with parallax */}
      <div 
        className="gradient-orb orb-1" 
        style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 20}px)` }}
      ></div>
      <div 
        className="gradient-orb orb-2"
        style={{ transform: `translate(${-mousePosition.x * 40}px, ${-mousePosition.y * 30}px)` }}
      ></div>
      <div 
        className="gradient-orb orb-3"
        style={{ transform: `translate(${mousePosition.x * 20}px, ${-mousePosition.y * 15}px)` }}
      ></div>
      <div 
        className="gradient-orb orb-4"
        style={{ transform: `translate(${-mousePosition.x * 25}px, ${mousePosition.y * 25}px)` }}
      ></div>

      {/* LEFT PANEL */}
      <div className="left-panel-enhanced" ref={leftPanelRef}>
        <div className="grid-overlay"></div>
        
        {/* Floating Shapes with parallax */}
        <div 
          className="floating-shape shape-triangle"
          style={{ transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 10}px)` }}
        ></div>
        <div 
          className="floating-shape shape-circle"
          style={{ transform: `translate(${-mousePosition.x * 20}px, ${mousePosition.y * 15}px)` }}
        ></div>
        <div 
          className="floating-shape shape-square"
          style={{ transform: `translate(${mousePosition.x * 10}px, ${-mousePosition.y * 12}px)` }}
        ></div>

        {/* Brand Section with fade-in */}
        <div className="brand-enhanced animate-fade-in-up">
          <div className="logo-enhanced">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 7H9L12 2Z" fill="currentColor"/>
              <path d="M12 7V22" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 22H19" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="18" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h2 className="brand-name animate-gradient">SkillRadar</h2>
            <p className="brand-tagline">Your Personal Skill Compass</p>
          </div>
        </div>

        {/* Hero Text with staggered animations */}
        <div className="hero-text-enhanced">
          <div className="hero-badge animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="badge-dot animate-blink"></span>
            <span>Next-Gen Learning Platform</span>
          </div>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover 
            <span className="gradient-text"> your potential</span>
          </h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Build skills, track progress, and unlock your future with a smarter platform
          </p>
          
          {/* Stats with counters */}
          <div className="hero-stats">
            <div className="stat animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <span className="stat-number" data-target="10000">10K+</span>
              <span className="stat-label">Active Learners</span>
            </div>
            <div className="stat animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <span className="stat-number" data-target="500">500+</span>
              <span className="stat-label">Expert Courses</span>
            </div>
            <div className="stat animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <span className="stat-number" data-target="98">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator with bounce */}
        
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel-enhanced">
        <div 
          ref={cardRef}
          className="welcome-card-enhanced"
        >
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>

          <div className="card-glow-enhanced"></div>
          
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 7H9L12 2Z" fill="url(#grad)" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7V22" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="18" r="3" fill="url(#grad)" stroke="currentColor" strokeWidth="1.5"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#a855f7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h2>Welcome Back</h2>
          <p className="subtitle-enhanced">Start your journey with us</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Personalized Learning Paths</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Interactive Projects</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>AI-Powered Insights</span>
            </div>
          </div>
          
          <button 
            className="btn-enhanced primary-enhanced" 
            onClick={() => navigate("/signup")}
          >
            <span>Get Started</span>
            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <p className="login-link">
            Already have an account? 
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/signin"); }}>
              Sign In →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;