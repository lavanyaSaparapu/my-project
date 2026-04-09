import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useSkillContext } from "../context/SkillContext";
import "./ProgressTracking.css";

// Simple Confetti component (keep yours or this one)
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
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 2,
        speedY: Math.random() * 5 + 3,
        speedX: (Math.random() - 0.5) * 3,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      });
    }
    let animId;
    const animate = () => {
      if (!canvas.parentNode) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < canvas.height) active = true;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      if (active) {
        animId = requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      if (canvas.parentNode) canvas.remove();
    };
  }, []);
  return null;
};

// Custom Tooltip for charts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip-custom">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">Activity: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function ProgressTracking() {
  const { selectedRole, userSkills, getRoleData, skillHistory } = useSkillContext();
  const [view, setView] = useState("weekly");
  const [chartType, setChartType] = useState("bar");
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpGain, setXpGain] = useState(null);

  const roleData = getRoleData(selectedRole);
  const relevantSkills = roleData?.radarData.map(item => ({
    name: item.skill,
    progress: item.your,
    xp: Math.floor(item.your * 3),
    icon: "📌",
  })) || [];

  const overallProgress = relevantSkills.length
    ? Math.round(relevantSkills.reduce((sum, s) => sum + s.progress, 0) / relevantSkills.length)
    : 0;

  const generateActivityData = () => {
    const base = overallProgress;
    if (view === "daily") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
        name: day,
        activity: Math.min(100, Math.max(20, base + (Math.random() - 0.5) * 20)),
      }));
    } else if (view === "weekly") {
      return ["Week 1", "Week 2", "Week 3", "Week 4"].map((week, i) => ({
        name: week,
        activity: Math.min(100, Math.max(20, base + (i - 1.5) * 8 + (Math.random() - 0.5) * 10)),
      }));
    } else {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
        name: month,
        activity: Math.min(100, Math.max(20, base + i * 5 + (Math.random() - 0.5) * 12)),
      }));
    }
  };

  const [activityData, setActivityData] = useState(generateActivityData());

  useEffect(() => {
    setActivityData(generateActivityData());
  }, [selectedRole, view, overallProgress]);

  const updateSkillProgress = (index, increment) => {
    const skill = relevantSkills[index];
    if (skill.progress >= 100) return;
    const gainedXP = increment * 3;
    setXpGain({ skill: skill.name, xp: gainedXP });
    setTimeout(() => setXpGain(null), 2000);
    if (skill.progress + increment >= 100) setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const renderChart = () => {
    const commonProps = { data: activityData, margin: { top: 20, right: 30, left: 20, bottom: 5 } };
    if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" domain={[0, 100]} />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend />
          <Bar dataKey="activity" fill="url(#barGrad)" radius={[8,8,0,0]} />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </BarChart>
      );
    } else if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" domain={[0, 100]} />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="activity" stroke="#a855f7" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} />
        </LineChart>
      );
    } else {
      const pieData = activityData.map(item => ({ name: item.name, value: item.activity }));
      const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];
      return (
        <PieChart width={400} height={300}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
            {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomChartTooltip />} />
        </PieChart>
      );
    }
  };

  if (!roleData) return <div className="pt-container">Loading...</div>;

  return (
    <div className="pt-container">
      {showConfetti && <Confetti />}
      {xpGain && <div className="xp-popup">+{xpGain.xp} XP from {xpGain.skill}!</div>}

      <div className="pt-header">
        <h2 className="pt-title"><span className="title-icon">📊</span> Progress Tracking</h2>
        <div className="role-badge">🎯 Role: {selectedRole}</div>
      </div>

      <div className="overall-card">
        <svg className="circular-chart" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#grad)" strokeWidth="12"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - overallProgress / 100)}
            strokeLinecap="round" transform="rotate(-90 100 100)" />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">{overallProgress}%</text>
          <text x="100" y="130" textAnchor="middle" fill="#9ca3af" fontSize="12">Overall</text>
        </svg>
      </div>

      <div className="controls-bar">
        <div className="view-buttons">
          <button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Daily</button>
          <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>Weekly</button>
          <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>Monthly</button>
        </div>
        <div className="chart-type-buttons">
          <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>📊 Bar</button>
          <button className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>📈 Line</button>
          <button className={chartType === "pie" ? "active" : ""} onClick={() => setChartType("pie")}>🥧 Pie</button>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="section-title">📈 Learning Activity ({view})</h3>
        <ResponsiveContainer width="100%" height={350}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="skills-section">
        <h3 className="section-title">🧠 Skill Mastery</h3>
        <div className="skills-list">
          {relevantSkills.map((skill, idx) => (
            <div key={idx} className="skill-card">
              <div className="skill-header">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-name">{skill.name}</span>
                <span className="skill-xp">{skill.xp} XP</span>
              </div>
              <div className="skill-bar-container">
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" style={{ width: `${skill.progress}%` }} />
                </div>
                <span className="skill-percent">{skill.progress}%</span>
              </div>
              <div className="skill-actions">
                <button className="learn-btn" onClick={() => updateSkillProgress(idx, 5)} disabled={skill.progress >= 100}>+5 XP</button>
                <button className="learn-btn" onClick={() => updateSkillProgress(idx, 10)} disabled={skill.progress >= 100}>+10 XP</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="streak-card">
        <div className="streak-flame">🔥🔥🔥</div>
        <div className="streak-text"><span className="streak-count">12</span> Day Learning Streak</div>
      </div>
    </div>
  );
}