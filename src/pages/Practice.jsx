// Practice.jsx – updated to handle TimedChallenge back button correctly
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useSkillContext } from "../context/SkillContext";

import CodingPractice from "../components/practice/CodingPractice";
import BuildFeatureTask from "../components/practice/BuildFeatureTask";
import DebuggingMode from "../components/practice/DebuggingMode";
import QuickPractice from "../components/practice/QuickPractice";
import TimedChallenge from "../components/practice/TimedChallenge";

import "./Practice.css";

// ===================== Sub-components =====================
const Badge = ({ children, variant = "default" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

const ProgressDonut = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="donut-wrapper">
      <svg width="90" height="90" viewBox="0 0 100 100" aria-label={`Score: ${score}%`}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
      <span className="donut-score">{score}%</span>
    </div>
  );
};

// Accessible Modal with focus trap
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    modalRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

// Throttled tilt effect
const TiltCard = ({ children, onClick }) => {
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (timeoutRef.current) return;
    timeoutRef.current = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 20;
      const rotateY = (rect.width / 2 - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      timeoutRef.current = null;
    }, 16);
  }, []);

  const reset = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = "";
  }, []);

  return (
    <div
      ref={cardRef}
      className="challenge-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(e)}
    >
      {children}
    </div>
  );
};

// Challenge definitions
const challengeTypes = [
  { id: "coding", title: "💻 Coding Practice", icon: "💻", desc: "Write functions and solve algorithms.", component: CodingPractice, requiresLevel: true },
  { id: "build", title: "🏗️ Build Feature", icon: "🏗️", desc: "Create a small working component.", component: BuildFeatureTask, requiresLevel: true },
  { id: "debug", title: "🐞 Debugging", icon: "🐞", desc: "Find and fix the bug.", component: DebuggingMode, requiresLevel: true },
  { id: "quiz", title: "⚡ Quick Quiz", icon: "⚡", desc: "Test your knowledge.", component: QuickPractice, requiresLevel: false },
  { id: "timed", title: "⏱️ Timed Challenge", icon: "⏱️", desc: "Solve under pressure.", component: TimedChallenge, requiresLevel: false },
];

const getSkillLevel = (skillName, userSkills) => {
  const value = userSkills[skillName];
  if (value === undefined) return "Medium";
  if (value < 40) return "High";
  if (value <= 70) return "Medium";
  return "Low";
};

const getSkillForChallenge = (index, prioritySkills) => {
  if (!prioritySkills.length) return "General Skill";
  return prioritySkills[index % prioritySkills.length];
};

// ===================== Main Component =====================
const Practice = () => {
  const { selectedRole, matchScore, prioritySkills = [], userSkills = {} } = useSkillContext();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(true);

  const openChallenge = useCallback((challenge, skill) => {
    setSelectedChallenge(challenge);
    setSelectedSkill(skill);
    setSelectedLevel(null);
    setShowLevelSelector(challenge.requiresLevel);
    setModalOpen(true);
  }, []);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setShowLevelSelector(false);
  };

  const goBackToLevels = () => {
    setSelectedLevel(null);
    setShowLevelSelector(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedChallenge(null);
    setSelectedSkill("");
    setSelectedLevel(null);
    setShowLevelSelector(true);
  }, []);

  const renderChallengeComponent = () => {
    if (!selectedChallenge) return null;
    const Component = selectedChallenge.component;

    // Challenges that require a selected level (coding, build, debug)
    if (selectedChallenge.id === "coding" || selectedChallenge.id === "build" || selectedChallenge.id === "debug") {
      return (
        <Component
          focusSkill={selectedSkill}
          role={selectedRole}
          level={selectedLevel}
          onBack={goBackToLevels}
        />
      );
    }

    // Quick Quiz – onBack closes modal
    if (selectedChallenge.id === "quiz") {
      return (
        <Component
          role={selectedRole}
          onBack={closeModal}
          availableSkills={prioritySkills}
        />
      );
    }

    // Timed Challenge – also closes modal on back
    if (selectedChallenge.id === "timed") {
      return (
        <Component
          onBack={closeModal}
        />
      );
    }

    // Other challenges (if any) – fallback
    return <Component focusSkill={selectedSkill} role={selectedRole} />;
  };

  // Advanced Level Selector UI
  const LevelSelector = () => {
    const [hoveredLevel, setHoveredLevel] = useState(null);
    const levels = [
      { id: "easy", name: "Easy", icon: "🌱", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)", desc: "30 beginner-friendly problems" },
      { id: "medium", name: "Medium", icon: "⚡", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", desc: "30 intermediate challenges" },
      { id: "hard", name: "Hard", icon: "🔥", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #dc2626)", desc: "30 expert-level tasks" }
    ];

    return (
      <div className="level-selector-advanced">
        <h3 className="level-selector-title">Choose Your Challenge Difficulty</h3>
        <div className="level-cards">
          {levels.map(level => (
            <button
              key={level.id}
              className={`level-card ${hoveredLevel === level.id ? 'hovered' : ''}`}
              onClick={() => handleLevelSelect(level.id)}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              style={{ '--level-color': level.color, '--level-gradient': level.gradient }}
            >
              <div className="level-icon">{level.icon}</div>
              <div className="level-name">{level.name}</div>
              <div className="level-desc">{level.desc}</div>
              <div className="level-glow"></div>
              <div className="level-ripple"></div>
            </button>
          ))}
        </div>
        <p className="level-selector-footer">Questions adapt to your skill level • Randomly selected each time</p>
      </div>
    );
  };

  return (
    <div className="practice-page">
      <div className="practice-header">
        <div className="header-left">
          <h1>Practice Hub</h1>
          <p>
            Improve your skills for <strong>{selectedRole || "any role"}</strong>
          </p>
          <div className="priority-chips">
            {prioritySkills.map((skill, idx) => (
              <Badge key={idx} variant="skill">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="header-right">
          <ProgressDonut score={matchScore} />
          <span className="match-label">Match Score</span>
        </div>
      </div>

      <div className="challenge-grid">
        {challengeTypes.map((ch, idx) => {
          const cardSkill = getSkillForChallenge(idx, prioritySkills);
          const level = getSkillLevel(cardSkill, userSkills);

          return (
            <TiltCard key={ch.id} onClick={() => openChallenge(ch, cardSkill)}>
              <div className="card-icon">{ch.icon}</div>
              <h3>{ch.title}</h3>
              <p>{ch.desc}</p>
              <div className="card-footer">
                <Badge variant={level.toLowerCase()}>{level} difficulty</Badge>
                <span className="focus-skill">{cardSkill}</span>
              </div>
            </TiltCard>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        {selectedChallenge?.requiresLevel && showLevelSelector ? (
          <LevelSelector />
        ) : selectedChallenge?.requiresLevel && !showLevelSelector && selectedLevel ? (
          <>
            <div className="modal-header">
              <button className="back-button" onClick={goBackToLevels}>
                ← Back to Levels
              </button>
              <h2>{selectedChallenge.title}</h2>
              <div className="selected-level-badge">
                Level: <span className={`level-${selectedLevel}`}>{selectedLevel.toUpperCase()}</span>
              </div>
            </div>
            <div className="modal-body">{renderChallengeComponent()}</div>
          </>
        ) : (
          // Challenges that don't require level selector (quiz, timed)
          <>
            <div className="modal-header">
              <h2>{selectedChallenge?.title}</h2>
            </div>
            <div className="modal-body">{renderChallengeComponent()}</div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Practice;