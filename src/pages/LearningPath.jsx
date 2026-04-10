// src/components/LearningPath.jsx
import { useState, useEffect } from "react";
import { useSkillContext } from "../context/SkillContext";
import "./LearningPath.css";

// ------------------------------------------------------------------
// Skill metadata (difficulty, time, job demand, impact, daily task)
// ------------------------------------------------------------------
const skillMetadata = {
  React: {
    difficulty: "Medium",
    timeDays: "2–3 days",
    jobDemand: 85,
    impact: 12,
    dailyTask: "✔ Build a reusable component",
  },
  TypeScript: {
    difficulty: "Medium",
    timeDays: "2–3 days",
    jobDemand: 70,
    impact: 10,
    dailyTask: "✔ Convert a JS component to TypeScript",
  },
  JavaScript: {
    difficulty: "Medium",
    timeDays: "2–3 days",
    jobDemand: 90,
    impact: 15,
    dailyTask: "✔ Solve 3 array/object manipulation challenges",
  },
  "Node.js": {
    difficulty: "Medium",
    timeDays: "3–4 days",
    jobDemand: 75,
    impact: 10,
    dailyTask: "✔ Create a simple REST API endpoint",
  },
  Python: {
    difficulty: "Easy",
    timeDays: "2–3 days",
    jobDemand: 80,
    impact: 8,
    dailyTask: "✔ Write a function that processes a CSV file",
  },
  Docker: {
    difficulty: "Hard",
    timeDays: "3–4 days",
    jobDemand: 60,
    impact: 12,
    dailyTask: "✔ Dockerize a Node.js app",
  },
  Kubernetes: {
    difficulty: "Hard",
    timeDays: "4–5 days",
    jobDemand: 55,
    impact: 15,
    dailyTask: "✔ Deploy a microservice on minikube",
  },
  AWS: {
    difficulty: "Hard",
    timeDays: "4–5 days",
    jobDemand: 70,
    impact: 14,
    dailyTask: "✔ Create an S3 bucket and host a static site",
  },
  SQL: {
    difficulty: "Easy",
    timeDays: "2–3 days",
    jobDemand: 85,
    impact: 10,
    dailyTask: "✔ Write a JOIN query with aggregation",
  },
  Git: {
    difficulty: "Easy",
    timeDays: "1–2 days",
    jobDemand: 95,
    impact: 8,
    dailyTask: "✔ Practice branching & merging",
  },
};

const defaultMeta = {
  difficulty: "Medium",
  timeDays: "2–3 days",
  jobDemand: 65,
  impact: 8,
  dailyTask: "✔ Complete one learning module",
};

function getSkillMeta(skillName) {
  return skillMetadata[skillName] || defaultMeta;
}

// ------------------------------------------------------------------
// Practice tasks (one per skill for demonstration)
// ------------------------------------------------------------------
const practiceTasks = {
  React: {
    title: "Build a Counter Component",
    description:
      "Write a React component that has a button and displays a count. Each click increments the count by 1.",
    hint: "Use useState hook.",
    expectedKeywords: ["useState", "count", "onClick"],
  },
  JavaScript: {
    title: "Array Manipulation",
    description:
      "Write a function that takes an array of numbers and returns a new array with each number doubled.",
    hint: "Use map() method.",
    expectedKeywords: ["map", "return", "function"],
  },
  Python: {
    title: "String Reversal",
    description: "Write a Python function that reverses a given string.",
    hint: "Use slicing or loop.",
    expectedKeywords: ["def", "return", "[::-1]"],
  },
  SQL: {
    title: "Write a JOIN Query",
    description:
      "Given two tables: 'users' (id, name) and 'orders' (id, user_id, amount). Write a query to get each user's total order amount.",
    hint: "Use SUM and GROUP BY.",
    expectedKeywords: ["SUM", "GROUP BY", "JOIN"],
  },
  Git: {
    title: "Git Branching",
    description:
      "Write the Git commands to create a new branch called 'feature-login', switch to it, and then merge it back to main.",
    hint: "Use git branch, git checkout, git merge.",
    expectedKeywords: ["git branch", "git checkout", "git merge"],
  },
};

const getPracticeTask = (skillName) => {
  return practiceTasks[skillName] || {
    title: `Practice ${skillName}`,
    description: `Write a small code snippet or explanation that demonstrates your understanding of ${skillName}.`,
    hint: "Be specific and show your knowledge.",
    expectedKeywords: [],
  };
};

// ------------------------------------------------------------------
// Resource suggestions
// ------------------------------------------------------------------
const resourceMap = {
  TypeScript: [
    "📘 TypeScript Handbook (official docs)",
    "🎓 Udemy: 'Understanding TypeScript' by Maximilian",
    "🛠️ Project: Build a type-safe React app with TS",
    "📝 Convert a JavaScript project to TypeScript",
  ],
  Testing: [
    "🧪 Jest + React Testing Library tutorial (TestingJavaScript.com)",
    "🎓 Course: 'Testing React with Jest & RTL' (Udemy)",
    "🛠️ Project: Write unit/integration tests for a to-do app",
    "🔍 End‑to‑end testing with Cypress",
  ],
  Performance: [
    "⚡ Web.dev Learn Performance (free course)",
    "🎓 Coursera: 'Website Performance Optimization'",
    "🛠️ Project: Audit & optimize a live site using Lighthouse",
    "📉 Lazy loading, code splitting, and image optimization",
  ],
  Docker: [
    "🐳 Docker Curriculum (free, interactive)",
    "🎓 Udemy: 'Docker Mastery' by Bret Fisher",
    "🛠️ Project: Containerize a Node.js + MongoDB app",
    "🐙 Multi-container apps with Docker Compose",
  ],
  Kubernetes: [
    "☸️ K8s Official Tutorial (interactive)",
    "🎓 Coursera: 'Introduction to Kubernetes'",
    "🛠️ Project: Deploy a microservices app on minikube",
    "🔧 Helm charts & CI/CD with Kubernetes",
  ],
  AWS: [
    "☁️ AWS Skill Builder (free digital training)",
    "🎓 Udemy: 'Ultimate AWS Certified Solutions Architect'",
    "🛠️ Project: Serverless website (S3 + Lambda + API Gateway)",
    "🏗️ Deploy a VPC with EC2 and RDS",
  ],
  Python: [
    "🐍 Python Crash Course (book / exercises)",
    "🎓 Coursera: 'Python for Everybody'",
    "🛠️ Project: Build a data analysis script with pandas",
    "🤖 Create a simple web scraper or API wrapper",
  ],
  ML: [
    "🤖 Andrew Ng's ML Course (Coursera)",
    "🎓 Fast.ai 'Practical Deep Learning'",
    "🛠️ Kaggle competition: Titanic or House Prices",
    "📊 Build a recommendation system",
  ],
  React: [
    "⚛️ React Official Docs (beta.reactjs.org)",
    "🎓 Scrimba: 'Learn React for Free'",
    "🛠️ Project: E‑commerce frontend with cart & filters",
    "🏗️ Build a dashboard with React Router & Context",
  ],
  "Node.js": [
    "🟢 Node.js Design Patterns (book)",
    "🎓 Udemy: 'Node.js Advanced Concepts'",
    "🛠️ Project: REST API with Express + JWT auth",
    "📡 Real‑time chat app with Socket.io",
  ],
  Security: [
    "🔒 OWASP Top 10 (read & understand each)",
    "🎓 TryHackMe: 'Web Hacking' room",
    "🛠️ Project: Capture The Flag (CTF) challenges",
    "🛡️ Implement auth & input sanitization in a sample app",
  ],
  JavaScript: [
    "📜 'You Don't Know JS' (book series)",
    "🎓 FreeCodeCamp: 'JavaScript Algorithms & Data Structures'",
    "🛠️ Project: Build an interactive quiz app",
    "🧩 Solve 10 LeetCode problems using JS",
  ],
  CSS: [
    "🎨 CSS Tricks (complete guide to Flexbox/Grid)",
    "🎓 Kevin Powell's free CSS course (YouTube)",
    "🛠️ Project: Clone a modern website layout",
    "📱 Build a fully responsive portfolio",
  ],
  HTML: [
    "🌐 MDN Web Docs (HTML elements guide)",
    "🎓 W3Schools HTML tutorial",
    "🛠️ Project: Build a semantic HTML resume",
    "📄 Create a multi‑page static site",
  ],
  SQL: [
    "🗄️ SQLZoo (interactive exercises)",
    "🎓 Mode Analytics SQL Tutorial",
    "🛠️ Project: Design a database for an e‑commerce store",
    "📊 Write complex JOINs & aggregations on a sample DB",
  ],
  Git: [
    "🔀 GitHub Skills (interactive courses)",
    "🎓 Atlassian Git Tutorials",
    "🛠️ Project: Contribute to an open‑source repo",
    "🌿 Practice branching & merging with a team simulation",
  ],
  Agile: [
    "📋 Scrum Guide (official)",
    "🎓 Coursera: 'Agile with Atlassian Jira'",
    "🛠️ Project: Run a mock sprint with a team (or solo)",
    "📈 Create user stories & velocity chart",
  ],
  "Problem Solving": [
    "🧩 LeetCode (Easy/Medium problems)",
    "🎓 HackerRank 'Problem Solving' track",
    "🛠️ Project: Solve 10 algorithm challenges in your language",
    "📘 Read 'Cracking the Coding Interview'",
  ],
};

const getResourceSuggestions = (skillName) => [
  `💡 Build a project using ${skillName} (search YouTube for tutorials)`,
  `📚 Take a course on ${skillName} (Coursera/Udemy)`,
  `📖 Read the official documentation for ${skillName}`,
  `🛠️ Practice ${skillName} on a coding platform (Codecademy/FreeCodeCamp)`,
];

// ------------------------------------------------------------------
// Confetti component
// ------------------------------------------------------------------
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
      particles.forEach((p) => {
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

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function LearningPath() {
  const { bestMatchRole, userSkills, rolesWithMetrics, updateSkillProficiency } = useSkillContext();
  const [completed, setCompleted] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Practice modal state
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [currentPracticeSkill, setCurrentPracticeSkill] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState("");

  const role = bestMatchRole || rolesWithMetrics?.[0];
  const prioritySkills = role?.prioritySkills || [];

  const TARGET_PERCENT = 80;

  const steps = prioritySkills.slice(0, 5).map((skill, idx) => {
    const current = Math.min(100, userSkills[skill] || 0);
    const gap = Math.max(0, TARGET_PERCENT - current);
    const xp = gap > 0 ? Math.floor(gap / 2) + 20 : 10;
    return {
      id: idx,
      skillName: skill,
      currentProficiency: current,
      target: TARGET_PERCENT,
      gap: current - TARGET_PERCENT,
      xp,
      meta: getSkillMeta(skill),
    };
  });

  // Load progress from localStorage
  useEffect(() => {
    if (!role) return;
    const saved = localStorage.getItem(`learning_${role.name}`);
    if (saved) setCompleted(JSON.parse(saved));
    else setCompleted([]);
  }, [role]);

  // Save progress
  useEffect(() => {
    if (role)
      localStorage.setItem(`learning_${role.name}`, JSON.stringify(completed));
  }, [completed, role]);

  // Re-check completion when userSkills change (real-time)
  useEffect(() => {
    if (!role) return;
    const stillValid = completed.filter((idx) => {
      const step = steps[idx];
      return step && step.currentProficiency >= step.target;
    });
    if (stillValid.length !== completed.length) {
      setCompleted(stillValid);
    }
  }, [userSkills, role, steps, completed]);

  const canCompleteStep = (step) => step.currentProficiency >= step.target;

  const toggleComplete = (index) => {
    const step = steps[index];
    const isCompleted = completed.includes(index);

    if (isCompleted) {
      const newCompleted = completed.filter((i) => i < index);
      setCompleted(newCompleted);
    } else {
      if (index !== completed.length) return;
      if (!canCompleteStep(step)) return;

      const newCompleted = [...completed, index];
      setCompleted(newCompleted);
      const gainedXP = step.xp;
      setXpPopup({ xp: gainedXP, skill: step.skillName });
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

  // Practice modal handlers
  const openPracticeModal = (skillName) => {
    setCurrentPracticeSkill(skillName);
    setUserAnswer("");
    setPracticeFeedback("");
    setPracticeModalOpen(true);
  };

  const closePracticeModal = () => {
    setPracticeModalOpen(false);
    setCurrentPracticeSkill(null);
    setUserAnswer("");
    setPracticeFeedback("");
  };

  const submitPractice = () => {
    if (!currentPracticeSkill) return;
    const task = getPracticeTask(currentPracticeSkill);
    // Simple evaluation: if expectedKeywords exist, check if at least one is present
    let isCorrect = false;
    if (task.expectedKeywords.length === 0) {
      // No keywords defined: accept any answer with length > 10
      isCorrect = userAnswer.trim().length > 10;
    } else {
      isCorrect = task.expectedKeywords.some(keyword =>
        userAnswer.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (isCorrect) {
      // Award 5-15 XP and increase proficiency by 2-5%
      const xpGain = Math.floor(Math.random() * 15) + 5;
      const proficiencyGain = Math.floor(Math.random() * 5) + 2;
      const newProficiency = Math.min(100, (userSkills[currentPracticeSkill] || 0) + proficiencyGain);
      
      // Update context (if updateSkillProficiency exists)
      if (updateSkillProficiency) {
        updateSkillProficiency(currentPracticeSkill, newProficiency);
      }
      
      setPracticeFeedback(`✅ Great work! +${xpGain} XP and +${proficiencyGain}% proficiency in ${currentPracticeSkill}.`);
      setXpPopup({ xp: xpGain, skill: currentPracticeSkill });
      setTimeout(() => setXpPopup(null), 2000);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        closePracticeModal();
      }, 2000);
    } else {
      setPracticeFeedback(`❌ Not quite. ${task.hint} Try again!`);
    }
  };

  if (!role) return <div className="lp-container">Loading...</div>;

  const totalXP = completed.reduce((sum, idx) => sum + steps[idx].xp, 0);
  const maxXP = steps.reduce((sum, s) => sum + s.xp, 0);
  const progressPercent = maxXP === 0 ? 0 : (totalXP / maxXP) * 100;
  const allCompleted = completed.length === steps.length;

  return (
    <div className="lp-container">
      {showConfetti && <Confetti />}
      {xpPopup && <div className="xp-popup">+{xpPopup.xp} XP! 🎉</div>}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="reset-modal-overlay">
          <div className="reset-modal">
            <h3>Reset Progress?</h3>
            <p>
              Are you sure you want to reset all completed steps for{" "}
              <strong>{role.name}</strong>? This cannot be undone.
            </p>
            <div className="reset-modal-actions">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button onClick={resetProgress} className="reset-confirm">
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Modal */}
      {practiceModalOpen && currentPracticeSkill && (
        <div className="practice-modal-overlay">
          <div className="practice-modal">
            <div className="practice-modal-header">
              <h3>✍️ Practice: {currentPracticeSkill}</h3>
              <button className="close-modal-btn" onClick={closePracticeModal}>×</button>
            </div>
            <div className="practice-task">
              <h4>{getPracticeTask(currentPracticeSkill).title}</h4>
              <p>{getPracticeTask(currentPracticeSkill).description}</p>
              <div className="practice-hint">
                💡 Hint: {getPracticeTask(currentPracticeSkill).hint}
              </div>
            </div>
            <div className="practice-input-area">
              <label>Your answer / code:</label>
              <textarea
                rows="8"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Write your solution here..."
                className="code-textarea"
              />
            </div>
            {practiceFeedback && (
              <div className={`practice-feedback ${practiceFeedback.startsWith("✅") ? "success" : "error"}`}>
                {practiceFeedback}
              </div>
            )}
            <div className="practice-modal-actions">
              <button onClick={closePracticeModal} className="cancel-practice">Cancel</button>
              <button onClick={submitPractice} className="submit-practice">Submit</button>
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
          <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        {allCompleted && <div className="mastery-badge">🏅 All skills completed!</div>}
      </div>

      <div className="lp-steps">
        {steps.map((step, idx) => {
          const isDone = completed.includes(idx);
          const isNext = idx === completed.length;
          const isLocked = !isDone && !isNext;
          const canComplete = canCompleteStep(step);
          const completeEnabled = isNext && canComplete && !isDone;

          const skillProgressPercent = Math.min(
            100,
            (step.currentProficiency / step.target) * 100
          );
          const gapDisplay = step.gap < 0 ? `${step.gap}%` : `+${step.gap}%`;

          const resources =
            resourceMap[step.skillName] || getResourceSuggestions(step.skillName);

          return (
            <div
              key={idx}
              className={`lp-card ${isDone ? "done" : ""} ${isLocked ? "locked" : ""}`}
            >
              <div className="card-header">
                <h3>
                  Master {step.skillName}
                  {isLocked && <span className="lock-icon"> 🔒</span>}
                </h3>
                <div className="difficulty-time">
                  <span className={`difficulty ${step.meta.difficulty.toLowerCase()}`}>
                    {step.meta.difficulty}
                  </span>
                  <span className="time-estimate">⏱️ {step.meta.timeDays}</span>
                </div>
              </div>

              <div className="xp-badge-large">XP: {step.xp}</div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span>Progress:</span>
                  <span>
                    {Math.floor(skillProgressPercent)}% / {step.target}%
                  </span>
                </div>
                <div className="skill-progress-bar">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skillProgressPercent}%` }}
                  />
                </div>
                <div className="gap-info">Gap: {gapDisplay}</div>
              </div>

              <div className="market-stats">
                <div className="job-demand">
                  💼 Used in {step.meta.jobDemand}% of {role.name?.toLowerCase() || "tech"} jobs
                </div>
                <div className="job-impact">
                  📊 Impact: +{step.meta.impact}% job match
                </div>
              </div>

              <div className="daily-task">
                <strong>📅 Today:</strong> {step.meta.dailyTask}
              </div>

              {!canComplete && step.currentProficiency < step.target && (
                <div className="motivation-message">
                  🔥 You’re close! Just {step.target - step.currentProficiency}% more
                </div>
              )}

              <div className="resource-suggestion">
                <strong>📚 Resources:</strong>
                <ul>
                  {resources.slice(0, 3).map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>

              <div className="action-buttons">
                <button
                  className="start-btn"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/search?q=learn+${encodeURIComponent(
                        step.skillName
                      )}`,
                      "_blank"
                    )
                  }
                >
                  ▶ Start Learning
                </button>
                <button
                  className="practice-btn"
                  onClick={() => openPracticeModal(step.skillName)}
                >
                  🧪 Practice
                </button>
                <button
                  className={`complete-btn ${isDone ? "done" : ""} ${
                    !completeEnabled ? "disabled" : ""
                  }`}
                  onClick={() => toggleComplete(idx)}
                  disabled={!completeEnabled}
                >
                  {isDone
                    ? "Completed ✓"
                    : !canComplete
                    ? `🔒 Mark Complete (needs ${step.target}%)`
                    : !isNext
                    ? "🔒 Locked"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}