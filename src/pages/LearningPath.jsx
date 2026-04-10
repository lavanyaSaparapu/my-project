// src/components/LearningPath.jsx
import { useState, useEffect } from "react";
import { useSkillContext } from "../context/SkillContext";
import "./LearningPath.css";

// ------------------------------------------------------------------
// Practice tasks for each skill (simple)
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
// Confetti component (for completing all steps)
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
    let isCorrect = false;
    if (task.expectedKeywords.length === 0) {
      isCorrect = userAnswer.trim().length > 10;
    } else {
      isCorrect = task.expectedKeywords.some(keyword =>
        userAnswer.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (isCorrect) {
      const xpGain = Math.floor(Math.random() * 15) + 5;
      const proficiencyGain = Math.floor(Math.random() * 5) + 2;
      const newProficiency = Math.min(100, (userSkills[currentPracticeSkill] || 0) + proficiencyGain);
      
      if (updateSkillProficiency) {
        updateSkillProficiency(currentPracticeSkill, newProficiency);
      }
      
      setPracticeFeedback(`✅ Great work! +${xpGain} XP and +${proficiencyGain}% proficiency in ${currentPracticeSkill}.`);
      setXpPopup({ xp: xpGain, skill: currentPracticeSkill });
      setTimeout(() => setXpPopup(null), 2000);
      
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

              <div className="action-buttons">
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