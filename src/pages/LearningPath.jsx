import { useEffect, useState, useRef } from "react";
import { useSkillContext } from "../context/SkillContext";
import "./LearningPath.css";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("✅ Learning plan copied to clipboard!");
};

const generateStructuredFallback = (selectedRole, matchScore, prioritySkills, userSkills, requiredSkills) => {
  const skills = prioritySkills.length ? prioritySkills : ["Core Skill", "Secondary Skill", "Supporting Skill"];
  const [skill1, skill2, skill3] = skills;

  const prioritySkillsDetails = skills.map((skill) => ({
    name: skill,
    whyMatters: `Mastering ${skill} is key to performing well in ${selectedRole} role.`,
    whatToFocus: "Core concepts, best practices, and hands-on coding.",
    realWorldUsage: `Apply ${skill} in a real project scenario (e.g., build a feature, integrate an API, or optimize a workflow).`,
  }));

  const dailyPlan = [
    { day: 1, topic: skill1, task: `Study ${skill1} fundamentals and build a small feature using it.`, practice: `Solve 3 coding exercises on ${skill1}.` },
    { day: 2, topic: skill2, task: `Study ${skill2} fundamentals and build a small feature using it.`, practice: `Solve 3 coding exercises on ${skill2}.` },
    { day: 3, topic: skill3, task: `Study ${skill3} fundamentals and build a small feature using it.`, practice: `Solve 3 coding exercises on ${skill3}.` },
    { day: 4, topic: skill1, task: `Deepen ${skill1} knowledge – build a reusable component/module.`, practice: `Solve 3 advanced exercises on ${skill1}.` },
    { day: 5, topic: skill2, task: `Integrate ${skill2} with a real API or database.`, practice: `Solve 3 integration exercises on ${skill2}.` },
  ];

  const miniProject = `Build a small application that heavily uses ${skill1} and ${skill2} to solve a problem you care about (e.g., a dashboard, a skill tracker, or a data visualizer).`;
  const realWorldChallenge = `Take an existing project (e.g., your portfolio) and refactor it to use ${skill1} or ${skill2}. For example, convert a static page into a component‑based app with state.`;

  let resources = {
    courses: ["freeCodeCamp – Responsive Web Design", "Udemy – The Complete JavaScript Course", "Frontend Masters – React Deep Dive"],
    docs: ["MDN Web Docs (JavaScript)", "React Official Docs", "Node.js Guides"],
    practice: ["LeetCode (for problem solving)", "Frontend Mentor", "Exercism (language tracks)"],
  };
  if (selectedRole.toLowerCase().includes("data")) {
    resources = {
      courses: ["DataCamp – Data Scientist with Python", "Coursera – Applied Data Science", "Kaggle Learn – Pandas & SQL"],
      docs: ["Pandas Documentation", "Scikit‑learn User Guide", "TensorFlow Official Tutorials"],
      practice: ["Kaggle Competitions", "LeetCode Database", "HackerRank Python"],
    };
  }

  const proTips = [
    "Build, don't just watch – Spend 70% of your time coding.",
    "Explain aloud – Teach what you learn to a rubber duck or a friend.",
    "Use AI assistants wisely – Ask for explanations, not just solutions.",
    "Avoid context switching – Focus on one priority skill for 2-3 days.",
    "Track your progress – Re-visit the dashboard sliders and see your match score increase.",
  ];

  return {
    goal: `Your goal is to close the skill gaps for ${selectedRole}. Currently you match ${matchScore}% of the requirements. By mastering the priority skills below, you can reach 85%+ match and significantly improve your hireability. Focus on hands-on projects rather than passive learning.`,
    prioritySkillsDetails,
    dailyPlan,
    miniProject,
    realWorldChallenge,
    resources,
    proTips,
  };
};

export default function LearningPage() {
  const { selectedRole, rolesWithMetrics, userSkills } = useSkillContext();
  const [planData, setPlanData] = useState(null);
  const planRef = useRef(null);

  const roleData = rolesWithMetrics.find(r => r.name === selectedRole);
  const matchScore = roleData?.matchScore || 0;
  const prioritySkills = roleData?.prioritySkills || [];
  const requiredSkills = roleData?.requiredSkills || {};

  // Generate plan immediately from fallback (no API call)
  useEffect(() => {
  if (roleData && !planData) {
    const fallbackPlan = generateStructuredFallback(
      selectedRole,
      matchScore,
      prioritySkills,
      userSkills,
      requiredSkills
    );
    setPlanData(fallbackPlan);
  }
}, [roleData, planData, selectedRole, matchScore, prioritySkills, userSkills, requiredSkills]);
    if(!planData){
      return(
    
      <div className="learning-container">
        <div className="loading-state">Loading role data...</div>
      </div>
    );
  }

  const DonutChart = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return (
      <div className="donut-wrapper">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
        <span className="donut-score">{score}%</span>
      </div>
    );
  };

  const copyPlanText = () => {
    let text = `🎯 Goal\n${planData.goal}\n\n🔥 Priority Skills to Learn\n`;
    planData.prioritySkillsDetails.forEach(s => {
      text += `\n**${s.name}**\n- Why it matters: ${s.whyMatters}\n- What to focus on: ${s.whatToFocus}\n- Real-world usage: ${s.realWorldUsage}\n`;
    });
    text += `\n📅 Daily Learning Plan\n`;
    planData.dailyPlan.forEach(d => {
      text += `Day ${d.day}: ${d.topic}\n   Task: ${d.task}\n   Practice: ${d.practice}\n`;
    });
    text += `\n🛠️ Hands-on Practice\nMini Project: ${planData.miniProject}\nReal-world Challenge: ${planData.realWorldChallenge}\n`;
    text += `\n📚 Recommended Resources\nCourses: ${planData.resources.courses.join(", ")}\nDocs: ${planData.resources.docs.join(", ")}\nPractice: ${planData.resources.practice.join(", ")}\n`;
    text += `\n🚀 Pro Tips\n${planData.proTips.map(t => `- ${t}`).join("\n")}`;
    copyToClipboard(text);
  };

  return (
    <div className="learning-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="learning-tabs">
        <span className="tab">Dashboard</span>
        <span className="tab active">Learning Path</span>
        <span className="tab">Progress</span>
      </div>

      <div className="learning-header">
        <div className="title-section">
          <span className="header-icon">🧠</span>
          <h2 className="learning-title">Personalized Learning Plan</h2>
        </div>
        <div className="header-stats">
          <div className="role-chip">🎯 {selectedRole}</div>
          <DonutChart score={matchScore} />
        </div>
      </div>

      <div className="action-bar">
        <button className="copy-btn-enhanced" onClick={copyPlanText}>
          📋 Copy Full Plan
        </button>
      </div>

      <div className="plan-content" ref={planRef}>
        <div className="card-section goal-card">
          <h3 className="section-title">🎯 Goal</h3>
          <p className="goal-text">{planData.goal}</p>
        </div>

        <div className="card-section skills-section">
          <h3 className="section-title">🔥 Priority Skills to Learn</h3>
          <div className="skills-grid">
            {planData.prioritySkillsDetails.map((skill, idx) => (
              <div className="skill-card" key={idx}>
                <h4 className="skill-name">{skill.name}</h4>
                <div className="skill-detail">
                  <span className="detail-label">Why it matters</span>
                  <p>{skill.whyMatters}</p>
                </div>
                <div className="skill-detail">
                  <span className="detail-label">What to focus on</span>
                  <p>{skill.whatToFocus}</p>
                </div>
                <div className="skill-detail">
                  <span className="detail-label">Real-world usage</span>
                  <p>{skill.realWorldUsage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-section daily-section">
          <h3 className="section-title">📅 Daily Learning Plan (5 days)</h3>
          <div className="daily-grid">
            {planData.dailyPlan.map((day) => (
              <div className="daily-card" key={day.day}>
                <div className="day-number">Day {day.day}</div>
                <div className="day-topic">📌 {day.topic}</div>
                <div className="day-task">✅ Task: {day.task}</div>
                <div className="day-practice">✍️ Practice: {day.practice}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-section hands-on-section">
          <h3 className="section-title">🛠️ Hands-on Practice</h3>
          <div className="practice-grid">
            <div className="practice-card">
              <h4>📁 Mini Project</h4>
              <p>{planData.miniProject}</p>
            </div>
            <div className="practice-card">
              <h4>🌍 Real-world Challenge</h4>
              <p>{planData.realWorldChallenge}</p>
            </div>
          </div>
        </div>

        <div className="card-section resources-section">
          <h3 className="section-title">📚 Recommended Resources</h3>
          <div className="resources-grid">
            <div className="resource-card">
              <h4>📘 Courses</h4>
              <ul>
                {planData.resources.courses.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div className="resource-card">
              <h4>📖 Documentation</h4>
              <ul>
                {planData.resources.docs.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div className="resource-card">
              <h4>💻 Practice Platforms</h4>
              <ul>
                {planData.resources.practice.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="card-section protips-section">
          <h3 className="section-title">🚀 Pro Tips</h3>
          <ul className="protips-list">
            {planData.proTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      </div>

      <div className="learning-footer">
        💡 Tip: Adjust your skill sliders on the Dashboard to see updated recommendations.
      </div>
    </div>
  )};
