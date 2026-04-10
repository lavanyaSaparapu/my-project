// LearningPath.jsx
import React, { useMemo } from 'react';
import { useSkillContext } from '../context/SkillContext';
import './LearningPath.css';

const LearningPath = () => {
  const { userSkills, selectedRole, getRoleData, bestMatchRole } = useSkillContext();
  const roleData = getRoleData(selectedRole);

  // Build skill gap data from radarData
  const gaps = useMemo(() => {
    if (!roleData?.radarData) return [];
    return roleData.radarData
      .map(item => ({
        name: item.skill,
        current: item.your,
        required: item.required,
        gap: Math.max(0, item.required - item.your)
      }))
      .filter(g => g.gap > 0)
      .sort((a, b) => b.gap - a.gap);
  }, [roleData]);

  const prioritySkills = gaps.slice(0, 3); // top 3 biggest gaps

  // Helper to generate learning content per skill
  const getSkillInsights = (skillName) => {
    const insights = {
      React: {
        why: "React is the industry standard for building interactive UIs. Most frontend jobs require component-based architecture.",
        focus: "Hooks (useState, useEffect), component lifecycle, state management, props drilling vs Context.",
        realWorld: "Building a dashboard, e‑commerce cart, or real‑time chat widget."
      },
      JavaScript: {
        why: "JavaScript is the backbone of web development. Deep understanding is critical for debugging and performance.",
        focus: "ES6+ features (arrow functions, destructuring, modules), async/await, closures, array methods.",
        realWorld: "Fetching data from an API, manipulating DOM, building a todo app."
      },
      Nodejs: {
        why: "Node.js allows you to write backend in JavaScript, enabling full‑stack development with one language.",
        focus: "Express.js, REST API design, middleware, file system, environment variables.",
        realWorld: "Build a simple REST API for a blog or a task manager."
      },
      Python: {
        why: "Python is versatile – used in backend, data science, and automation. Many roles require scripting skills.",
        focus: "Functions, classes, list comprehensions, virtual environments, Flask/Django basics.",
        realWorld: "Write a script to automate CSV processing or a small web scraper."
      },
      "System Design": {
        why: "System design separates junior from senior engineers. It shows you can architect scalable solutions.",
        focus: "Load balancing, caching, database indexing, microservices vs monolith.",
        realWorld: "Design a URL shortener like bit.ly or a chat system."
      },
      Leadership: {
        why: "Leadership is essential for tech leads and managers. It's about communication and driving results.",
        focus: "Agile ceremonies, giving feedback, technical decision making, mentoring.",
        realWorld: "Lead a small team project or a code review session."
      }
    };
    return insights[skillName] || {
      why: `Mastering ${skillName} is key to performing well in ${selectedRole} role.`,
      focus: `Core concepts, best practices, and hands-on coding.`,
      realWorld: `Apply ${skillName} in a real project scenario.`
    };
  };

  // Generate daily plan based on priority skills
  const dailyPlan = useMemo(() => {
    if (prioritySkills.length === 0) return [];
    const plan = [];
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    for (let i = 0; i < Math.min(5, prioritySkills.length + 2); i++) {
      const skill = prioritySkills[i % prioritySkills.length];
      plan.push({
        day: days[i],
        topic: skill.name,
        task: `Study ${skill.name} fundamentals and build a small feature using it.`,
        practice: `Solve 3 coding exercises on ${skill.name}.`
      });
    }
    return plan;
  }, [prioritySkills]);

  // Mini project suggestion based on top priority
  const miniProject = useMemo(() => {
    if (prioritySkills.length === 0) return null;
    const top = prioritySkills[0].name;
    const projects = {
      React: "Build a personal dashboard that fetches data from a public API and displays it with charts.",
      JavaScript: "Create an interactive quiz app with timer and score tracking.",
      Nodejs: "Develop a CLI tool that reads a CSV file and outputs JSON.",
      Python: "Write a script that analyses log files and generates a summary report.",
      "System Design": "Design a simple URL shortener – draw a diagram and implement a prototype.",
      Leadership: "Run a 30‑minute team sync meeting or write a project retrospective."
    };
    return projects[top] || `Build a small application that heavily uses ${top} to solve a problem you care about.`;
  }, [prioritySkills]);

  if (!roleData) {
    return <div className="learning-path-container">Loading your learning path...</div>;
  }

  return (
    <div className="learning-path-container">
      <div className="path-blob path-blob-1"></div>
      <div className="path-blob path-blob-2"></div>

      <div className="path-header">
        <h1 className="path-title">📘 Personalized Learning Plan</h1>
        <div className="role-badge">
          🎯 Target Role: <strong>{selectedRole}</strong> &nbsp;|&nbsp; 
          Match Score: <span className="match-value">{roleData.matchScore}%</span>
        </div>
      </div>

      {/* 🎯 Goal */}
      <section className="plan-section">
        <h2>🎯 Goal</h2>
        <p>
          Your goal is to close the skill gaps for <strong>{selectedRole}</strong>.
          Currently you match <strong>{roleData.matchScore}%</strong> of the requirements.
          By mastering the priority skills below, you can reach <strong>85%+ match</strong> and
          significantly improve your hireability. Focus on <strong>hands‑on projects</strong> 
          rather than passive learning.
        </p>
      </section>

      {/* 🔥 Priority Skills to Learn */}
      <section className="plan-section">
        <h2>🔥 Priority Skills to Learn</h2>
        {prioritySkills.length === 0 ? (
          <p className="success-message">🎉 Amazing! You already meet all requirements for this role. Consider a more challenging role.</p>
        ) : (
          <div className="priority-grid">
            {prioritySkills.map(skill => {
              const insights = getSkillInsights(skill.name);
              return (
                <div key={skill.name} className="priority-card">
                  <h3>{skill.name} <span className="gap-badge">Gap: {skill.gap}%</span></h3>
                  <div className="insight-block">
                    <strong>❓ Why it matters</strong>
                    <p>{insights.why}</p>
                  </div>
                  <div className="insight-block">
                    <strong>🎯 What to focus on</strong>
                    <p>{insights.focus}</p>
                  </div>
                  <div className="insight-block">
                    <strong>🌍 Real‑world usage</strong>
                    <p>{insights.realWorld}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 📅 Daily Learning Plan */}
      <section className="plan-section">
        <h2>📅 Daily Learning Plan (3–5 days)</h2>
        <div className="daily-grid">
          {dailyPlan.map(day => (
            <div key={day.day} className="daily-card">
              <h3>{day.day}</h3>
              <p><strong>Topic:</strong> {day.topic}</p>
              <p><strong>Task:</strong> {day.task}</p>
              <p><strong>Practice:</strong> {day.practice}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛠️ Hands-on Practice */}
      <section className="plan-section">
        <h2>🛠️ Hands-on Practice</h2>
        <div className="practice-card">
          <h3>📌 Mini Project</h3>
          <p>{miniProject || "Build a small full‑stack app that integrates your weakest skill."}</p>
          <h3>⚡ Real‑world Challenge</h3>
          <p>
            Take an existing project (e.g., your portfolio) and refactor it to use the priority skill.
            For example, if React is weak, convert a static page into a component‑based React app with state.
          </p>
        </div>
      </section>

      {/* 📚 Resources */}
      <section className="plan-section">
        <h2>📚 Recommended Resources</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <h4>📖 Courses</h4>
            <ul>
              <li><a href="#">freeCodeCamp – Responsive Web Design</a></li>
              <li><a href="#">Udemy – The Complete JavaScript Course</a></li>
              <li><a href="#">Frontend Masters – React Deep Dive</a></li>
            </ul>
          </div>
          <div className="resource-card">
            <h4>📄 Documentation</h4>
            <ul>
              <li><a href="#">MDN Web Docs (JavaScript)</a></li>
              <li><a href="#">React Official Docs</a></li>
              <li><a href="#">Node.js Guides</a></li>
            </ul>
          </div>
          <div className="resource-card">
            <h4>💻 Practice Platforms</h4>
            <ul>
              <li><a href="#">LeetCode (for problem solving)</a></li>
              <li><a href="#">Frontend Mentor</a></li>
              <li><a href="#">Exercism (language tracks)</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🚀 Pro Tips */}
      <section className="plan-section">
        <h2>🚀 Pro Tips</h2>
        <div className="tips-card">
          <ul>
            <li>✨ <strong>Build, don't just watch</strong> – Spend 70% of your time coding.</li>
            <li>✨ <strong>Explain aloud</strong> – Teach what you learn to a rubber duck or a friend.</li>
            <li>✨ <strong>Use AI assistants wisely</strong> – Ask for explanations, not just solutions.</li>
            <li>✨ <strong>Avoid context switching</strong> – Focus on one priority skill for 2‑3 days.</li>
            <li>✨ <strong>Track your progress</strong> – Re‑visit the dashboard sliders and see your match score increase.</li>
          </ul>
        </div>
      </section>

      <div className="motivation-footer">
        ⚡ Every hour you invest now brings you closer to landing your dream role. Keep going!
      </div>
    </div>
  );
};

export default LearningPath;