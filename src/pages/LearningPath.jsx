import { useState, useEffect } from "react";
import { useSkillContext } from "../context/SkillContext";
import "./LearningPath.css";

// Resource map (unchanged, each skill has 3-4 resources)
const resourceMap = {
  TypeScript: [
    "📘 TypeScript Handbook (official docs)",
    "🎓 Udemy: 'Understanding TypeScript' by Maximilian",
    "🛠️ Project: Build a type-safe React app with TS",
    "📝 Convert a JavaScript project to TypeScript"
  ],
  Testing: [
    "🧪 Jest + React Testing Library tutorial (TestingJavaScript.com)",
    "🎓 Course: 'Testing React with Jest & RTL' (Udemy)",
    "🛠️ Project: Write unit/integration tests for a to-do app",
    "🔍 End‑to‑end testing with Cypress"
  ],
  Performance: [
    "⚡ Web.dev Learn Performance (free course)",
    "🎓 Coursera: 'Website Performance Optimization'",
    "🛠️ Project: Audit & optimize a live site using Lighthouse",
    "📉 Lazy loading, code splitting, and image optimization"
  ],
  Docker: [
    "🐳 Docker Curriculum (free, interactive)",
    "🎓 Udemy: 'Docker Mastery' by Bret Fisher",
    "🛠️ Project: Containerize a Node.js + MongoDB app",
    "🐙 Multi-container apps with Docker Compose"
  ],
  Kubernetes: [
    "☸️ K8s Official Tutorial (interactive)",
    "🎓 Coursera: 'Introduction to Kubernetes'",
    "🛠️ Project: Deploy a microservices app on minikube",
    "🔧 Helm charts & CI/CD with Kubernetes"
  ],
  AWS: [
    "☁️ AWS Skill Builder (free digital training)",
    "🎓 Udemy: 'Ultimate AWS Certified Solutions Architect'",
    "🛠️ Project: Serverless website (S3 + Lambda + API Gateway)",
    "🏗️ Deploy a VPC with EC2 and RDS"
  ],
  Python: [
    "🐍 Python Crash Course (book / exercises)",
    "🎓 Coursera: 'Python for Everybody'",
    "🛠️ Project: Build a data analysis script with pandas",
    "🤖 Create a simple web scraper or API wrapper"
  ],
  ML: [
    "🤖 Andrew Ng's ML Course (Coursera)",
    "🎓 Fast.ai 'Practical Deep Learning'",
    "🛠️ Kaggle competition: Titanic or House Prices",
    "📊 Build a recommendation system"
  ],
  React: [
    "⚛️ React Official Docs (beta.reactjs.org)",
    "🎓 Scrimba: 'Learn React for Free'",
    "🛠️ Project: E‑commerce frontend with cart & filters",
    "🏗️ Build a dashboard with React Router & Context"
  ],
  "Node.js": [
    "🟢 Node.js Design Patterns (book)",
    "🎓 Udemy: 'Node.js Advanced Concepts'",
    "🛠️ Project: REST API with Express + JWT auth",
    "📡 Real‑time chat app with Socket.io"
  ],
  Security: [
    "🔒 OWASP Top 10 (read & understand each)",
    "🎓 TryHackMe: 'Web Hacking' room",
    "🛠️ Project: Capture The Flag (CTF) challenges",
    "🛡️ Implement auth & input sanitization in a sample app"
  ],
  JavaScript: [
    "📜 'You Don't Know JS' (book series)",
    "🎓 FreeCodeCamp: 'JavaScript Algorithms & Data Structures'",
    "🛠️ Project: Build an interactive quiz app",
    "🧩 Solve 10 LeetCode problems using JS"
  ],
  CSS: [
    "🎨 CSS Tricks (complete guide to Flexbox/Grid)",
    "🎓 Kevin Powell's free CSS course (YouTube)",
    "🛠️ Project: Clone a modern website layout",
    "📱 Build a fully responsive portfolio"
  ],
  HTML: [
    "🌐 MDN Web Docs (HTML elements guide)",
    "🎓 W3Schools HTML tutorial",
    "🛠️ Project: Build a semantic HTML resume",
    "📄 Create a multi‑page static site"
  ],
  SQL: [
    "🗄️ SQLZoo (interactive exercises)",
    "🎓 Mode Analytics SQL Tutorial",
    "🛠️ Project: Design a database for an e‑commerce store",
    "📊 Write complex JOINs & aggregations on a sample DB"
  ],
  Git: [
    "🔀 GitHub Skills (interactive courses)",
    "🎓 Atlassian Git Tutorials",
    "🛠️ Project: Contribute to an open‑source repo",
    "🌿 Practice branching & merging with a team simulation"
  ],
  Agile: [
    "📋 Scrum Guide (official)",
    "🎓 Coursera: 'Agile with Atlassian Jira'",
    "🛠️ Project: Run a mock sprint with a team (or solo)",
    "📈 Create user stories & velocity chart"
  ],
  "Problem Solving": [
    "🧩 LeetCode (Easy/Medium problems)",
    "🎓 HackerRank 'Problem Solving' track",
    "🛠️ Project: Solve 10 algorithm challenges in your language",
    "📘 Read 'Cracking the Coding Interview'"
  ]
};

const getResourceSuggestions = (skillName) => [
  `💡 Build a project using ${skillName} (search YouTube for tutorials)`,
  `📚 Take a course on ${skillName} (Coursera/Udemy)`,
  `📖 Read the official documentation for ${skillName}`,
  `🛠️ Practice ${skillName} on a coding platform (Codecademy/FreeCodeCamp)`
];

// Confetti component (unchanged)
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
        y: Math.random() * -canvas.height,
        size: Math.random() * 6 + 3,
        speedY: Math.random() * 5 + 3,
        speedX: (Math.random() - 0.5) * 3,
        color: `hsl(${Math.random() * 360}, 80%, 65%)`,
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
        if (p.y < canvas.height) active = true;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
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

export default function LearningPath() {
  const { bestMatchRole, userSkills, rolesWithMetrics } = useSkillContext();
  const [completed, setCompleted] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const role = bestMatchRole || rolesWithMetrics[0];
  const prioritySkills = role?.prioritySkills || [];

  const steps = prioritySkills.slice(0, 5).map((skill, idx) => ({
    id: idx,
    title: `Master ${skill}`,
    xp: Math.floor((100 - (userSkills[skill] || 0)) / 2) + 20,
    skillName: skill,
  }));

  // Load progress from localStorage
  useEffect(() => {
    if (!role) return;
    const saved = localStorage.getItem(`learning_${role.name}`);
    if (saved) setCompleted(JSON.parse(saved));
    else setCompleted([]);
  }, [role]);

  // Save progress to localStorage
  useEffect(() => {
    if (role)
      localStorage.setItem(`learning_${role.name}`, JSON.stringify(completed));
  }, [completed, role]);

  // Toggle complete with linear unlock logic
  const toggleComplete = (index) => {
    const isCompleted = completed.includes(index);

    if (isCompleted) {
      // Uncompleting: remove this step AND all later steps (index >= current)
      const newCompleted = completed.filter(i => i < index);
      setCompleted(newCompleted);
      // No XP penalty or popup for uncompleting
    } else {
      // Completing: only allowed if this is the next unlocked step
      // Next unlocked step index = completed.length
      if (index !== completed.length) return; // locked or out of order

      const newCompleted = [...completed, index];
      setCompleted(newCompleted);
      const gainedXP = steps[index].xp;
      setXpPopup({ xp: gainedXP, skill: steps[index].title });
      setTimeout(() => setXpPopup(null), 2000);
      if (newCompleted.length === steps.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const resetProgress = () => {
    setCompleted([]);
    setShowResetConfirm(false);
  };

  if (!role) return <div className="lp-container">Loading...</div>;

  const totalXP = completed.reduce((sum, idx) => sum + steps[idx].xp, 0);
  const maxXP = steps.reduce((sum, s) => sum + s.xp, 0);
  const progress = maxXP === 0 ? 0 : (totalXP / maxXP) * 100;
  const allCompleted = completed.length === steps.length;

  return (
    <div className="lp-container">
      {showConfetti && <Confetti />}
      {xpPopup && (
        <div className="xp-popup">
          +{xpPopup.xp} XP! 🎉
        </div>
      )}

      {showResetConfirm && (
        <div className="reset-modal-overlay">
          <div className="reset-modal">
            <h3>Reset Progress?</h3>
            <p>Are you sure you want to reset all completed steps for <strong>{role.name}</strong>? This cannot be undone.</p>
            <div className="reset-modal-actions">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button onClick={resetProgress} className="reset-confirm">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="lp-header-section">
        <h2 className="lp-title">🧠 Your Learning Path</h2>
        <div className="header-actions">
          <div className="role-badge">
            🎯 {role.name} ({role.matchScore}%)
          </div>
          <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>
            🔄 Reset Progress
          </button>
        </div>
      </div>

      <div className="xp-card">
        <div className="xp-header">
          <span>🏆 Total XP</span>
          <span className="xp-value">
            {totalXP} / {maxXP}
          </span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        {allCompleted && (
          <div className="mastery-badge">🏅 All skills completed!</div>
        )}
      </div>

      <div className="lp-steps">
        {steps.map((step, idx) => {
          const isDone = completed.includes(idx);
          // Determine if this step is locked (not yet reachable)
          const isLocked = !isDone && idx > completed.length;
          const resources = resourceMap[step.skillName] || getResourceSuggestions(step.skillName);

          return (
            <div key={idx} className={`lp-card ${isDone ? "done" : ""} ${isLocked ? "locked" : ""}`}>
              <h3>
                {step.title}
                {isLocked && <span className="lock-icon"> 🔒</span>}
              </h3>
              <div className="lp-meta">
                <span className="xp-badge">⚡ {step.xp} XP</span>
              </div>
              <div className="resource-suggestion">
                <strong>📌 Recommended projects & courses:</strong>
                <ul>
                  {resources.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>
              <button
                className={`complete-btn ${isDone ? "done" : ""} ${isLocked ? "locked" : ""}`}
                onClick={() => toggleComplete(idx)}
                disabled={isLocked}
              >
                {isDone ? "Completed ✓" : (isLocked ? "🔒 Locked" : "Mark Complete")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}