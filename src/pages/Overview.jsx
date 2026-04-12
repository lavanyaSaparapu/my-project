import React, { useEffect, useRef, useState } from 'react';
import './Overview.css';

const Overview = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepsRef.current.indexOf(entry.target);
            if (index !== -1) setActiveStep(index);
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.5, rootMargin: '-50px 0px -50px 0px' }
    );

    stepsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: "📊",
      title: "1. Assess Your Skills",
      description: "Take a quick skill assessment or import your existing skills. The system analyzes your proficiency in 40+ technical areas, from frontend frameworks to cloud and security.",
      color: "#818cf8"
    },
    {
      icon: "🎯",
      title: "2. Get Matched with Roles",
      description: "Based on your skills, we calculate match scores for 10+ job roles (Frontend, Backend, DevOps, Data Scientist, etc.). You'll see exactly which skills to improve.",
      color: "#c084fc"
    },
    {
      icon: "💻",
      title: "3. Practice with Real Challenges",
      description: "Dive into five practice modes: Coding Practice (algorithms), Build Feature (real components), Debugging, Quick Quiz, and Timed Challenges. Each adapts to your chosen skill and difficulty.",
      color: "#f59e0b"
    },
    {
      icon: "📈",
      title: "4. Track Your Progress",
      description: "Watch your match score grow as you complete challenges. Our radar chart shows your skill gaps, and priority skills guide you to the most impactful improvements.",
      color: "#10b981"
    }
  ];

  const features = [
    { emoji: "🚀", title: "30+ Skills", text: "From React and TypeScript to Kubernetes and MLOps – cover the entire tech landscape.", color: "#818cf8" },
    { emoji: "🎮", title: "5 Practice Modes", text: "Coding, building, debugging, quizzing, and timed challenges keep learning engaging.", color: "#c084fc" },
    { emoji: "🎯", title: "Role‑Based Learning", text: "Focus on skills that matter for your dream job (Frontend, Backend, DevOps, etc.).", color: "#f59e0b" },
    { emoji: "⚡", title: "Adaptive Difficulty", text: "Easy, Medium, Hard – challenges match your current level and push you further.", color: "#10b981" },
    { emoji: "📊", title: "Live Radar", text: "Visual skill gap analysis shows where you shine and where to improve.", color: "#ef4444" },
    { emoji: "🏆", title: "Progress Tracking", text: "Earn scores, track completion, and see your match score rise over time.", color: "#8b5cf6" }
  ];

  return (
    <div className="how-it-works" ref={containerRef}>
      {/* Animated background particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="hiw-header">
        <h1>How Skill  Radar Works</h1>
        <p>Close your skill gaps, land your dream role – in four simple steps.</p>
        {onBack && <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>}
      </div>

      {/* Interactive progress indicator */}
      <div className="step-progress">
        {steps.map((_, idx) => (
          <div key={idx} className={`progress-dot ${activeStep >= idx ? 'active' : ''}`}>
            <span>{idx + 1}</span>
          </div>
        ))}
      </div>

      {/* Timeline steps */}
      <div className="timeline">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="timeline-step"
            ref={(el) => (stepsRef.current[idx] = el)}
            style={{ '--step-color': step.color }}
          >
            <div className="timeline-marker">
              <div className="marker-icon">{step.icon}</div>
              <div className="marker-line"></div>
            </div>
            <div className="timeline-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="step-number">{idx + 1}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="features-section">
        <h2>Everything you need to grow</h2>
        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card" style={{ '--feature-color': f.color }}>
              <div className="feature-emoji">{f.emoji}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to close your skill gaps?</h2>
        <p>Start practicing now and see your match score improve.</p>
        <button className="cta-btn" onClick={() => window.location.href = '/practice'}>
          Go to Practice Hub →
        </button>
      </div>
    </div>
  );
};

export default Overview;