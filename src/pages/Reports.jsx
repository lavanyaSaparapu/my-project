import { useState, useRef, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSkillContext } from "../context/SkillContext";
import "./Reports.css";

// ========== CONFETTI (same as other pages) ==========
const Confetti = () => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "10000";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 7 + 3,
        speedY: Math.random() * 6 + 3,
        speedX: (Math.random() - 0.5) * 3.5,
        color: `hsl(${Math.random() * 360}, 85%, 65%)`,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let animationId;
    const animate = () => {
      if (!canvas.parentNode) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y < canvas.height) active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (active) {
        animationId = requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      if (canvas.parentNode) canvas.remove();
    };
  }, []);
  return null;
};

// ========== TYPING HOOK ==========
const useTyping = (text, speed = 30) => {
  const [output, setOutput] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setOutput("");
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setOutput(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { typedText: output, isDone };
};

// ========== NEW STYLISH CIRCULAR GAUGE ==========
const CircularGauge = ({ value, size = 220 }) => {
  const radius = size * 0.36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          {/* Gradient Stroke */}
          <linearGradient id="superGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Glow */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          fill="none"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#superGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#neonGlow)"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Inner Glass Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 18}
          fill="rgba(255,255,255,0.03)"
          backdropFilter="blur(10px)"
        />
      </svg>

      {/* Pulse Waves */}
      <div className="pulse-ring pulse-1"></div>
      <div className="pulse-ring pulse-2"></div>

      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            background: "linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}%
        </div>
        <div style={{ fontSize: "0.8rem", color: "#a78bfa" }}>
          Performance
        </div>
      </div>
    </div>
  );
};

// ========== MAIN REPORTS COMPONENT ==========
export default function Reports() {
  const { selectedRole, getRoleData } = useSkillContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [insightRefreshKey, setInsightRefreshKey] = useState(0);
  const reportRef = useRef();

  const roleData = getRoleData(selectedRole);
  if (!roleData || !roleData.radarData) {
    return <div className="reports-container">Loading...</div>;
  }

  // Build skills list from radar data
  const skills = roleData.radarData.map((item) => ({
    name: item.skill,
    score: item.your,
  }));

  const avgScore = skills.length
    ? Math.round(skills.reduce((s, c) => s + c.score, 0) / skills.length)
    : 0;

  const strengths = skills.filter((s) => s.score >= 75);
  const weaknesses = skills.filter((s) => s.score < 65);
  const lowestSkill = weaknesses.length
    ? weaknesses.reduce((a, b) => (a.score < b.score ? a : b))
    : strengths[0] || { name: "N/A", score: 0 };

  const improvementPotential = skills.length
    ? Math.min(25, Math.round(((100 - lowestSkill.score) / skills.length) * 1.5))
    : 0;

  const insightText = `🎯 Focus on "${lowestSkill.name}" (${lowestSkill.score}%). Improving this to 80% could raise your overall score by ~${improvementPotential} points. ${
    strengths.length
      ? `Your strongest area is ${strengths[0].name} at ${strengths[0].score}% – great job!`
      : ""
  }`;

  const { typedText: typedInsight, isDone: insightDone } = useTyping(insightText, 28);
  const radarData = skills.map((s) => ({ subject: s.name, score: s.score }));

  // Confetti on high score
  useEffect(() => {
    if (avgScore >= 90 && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2800);
    }
  }, [avgScore]);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selectedRole]);

  // PDF download
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = reportRef.current;
      if (!element) throw new Error("Element not found");
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0f0f1a",
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${selectedRole.replace(/\s/g, "_")}_Performance_Report.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="reports-container">
      {showConfetti && <Confetti />}
      <div className="animated-border" />
      <div className="particles-bg" />

      <div className="reports-header">
        <h2 className="reports-title">
          <span className="title-icon">📊</span> Performance Reports
        </h2>
        <div className="role-selector">
          <label>🎯 Role:</label>
          <span className="role-badge">{selectedRole}</span>
        </div>
      </div>

      <div ref={reportRef} className="report-content">
        {/* Overall Score Card */}
        <div className="overall-card-3d reveal-on-scroll">
          <div className="score-ring">
            <CircularGauge value={avgScore} size={220} />
            <div className="score-glow" />
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="chart-section reveal-on-scroll">
          <div className="section-title">
            <span>📡</span> Skill Radar
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="rgba(99,102,241,0.3)" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "rgba(99,102,241,0.3)" }} />
              <Radar
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#radarGradient)"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{ background: "#1e1e2f", border: "1px solid #a855f7", borderRadius: "12px" }}
                labelStyle={{ color: "#a78bfa" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Breakdown with Neon Bars */}
        <div className="skills-breakdown reveal-on-scroll">
          <div className="section-title">
            <span>⚡</span> Skill Mastery
          </div>
          {skills.map((skill, idx) => (
            <div key={idx} className="skill-row">
              <div className="skill-name">{skill.name}</div>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: `${skill.score}%` }}>
                  <div className="skill-shimmer" />
                </div>
              </div>
              <div className="skill-score">{skill.score}%</div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses Tags */}
        <div className="tags-row reveal-on-scroll">
          <div className="tags-section">
            <h4>💪 Strengths (≥75%)</h4>
            <div className="tag-list">
              {strengths.length ? (
                strengths.map((s) => (
                  <div key={s.name} className="tag good">
                    <span className="tag-icon">✨</span> {s.name} ({s.score}%)
                  </div>
                ))
              ) : (
                <div className="tag neutral">No strengths yet</div>
              )}
            </div>
          </div>
          <div className="tags-section">
            <h4>⚠️ Areas to Improve (&lt;65%)</h4>
            <div className="tag-list">
              {weaknesses.length ? (
                weaknesses.map((s) => (
                  <div key={s.name} className="tag bad">
                    <span className="tag-icon">📉</span> {s.name} ({s.score}%)
                  </div>
                ))
              ) : (
                <div className="tag neutral">All skills above 65% 🎉</div>
              )}
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="insight-card reveal-on-scroll" key={insightRefreshKey}>
          <div className="insight-header">
            <h4>🧠 AI Insight</h4>
            <button
              className="insight-refresh"
              onClick={() => setInsightRefreshKey((prev) => prev + 1)}
              title="Generate new insight"
            >
              ⟳
            </button>
          </div>
          <div className="insight-text">
            {typedInsight}
            {!insightDone && <span className="cursor">|</span>}
          </div>
        </div>
      </div>

      {/* Download Button with Ripple */}
      <button
        className={`download-btn ${isDownloading ? "loading" : ""}`}
        onClick={downloadPDF}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <span className="spinner"></span> Generating PDF...
          </>
        ) : (
          "📥 Download Full Report (PDF)"
        )}
      </button>
    </div>
  );
}