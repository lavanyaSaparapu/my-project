// LearningPage.jsx
import { useEffect, useState } from "react";
import { useSkillContext } from "../context/SkillContext";
import ReactMarkdown from "react-markdown";
import "./LearningPage.css";

// ========== DYNAMIC FALLBACK PLAN (uses actual user data) ==========
const generateFallbackPlan = (selectedRole, matchScore, prioritySkills, userSkills, requiredSkills) => {
  const topSkill = prioritySkills[0] || "core skill";
  const secondSkill = prioritySkills[1] || "another key skill";
  const thirdSkill = prioritySkills[2] || "supporting skill";

  return `
### 🎯 Goal
Your goal is to raise your **${selectedRole}** match from ${matchScore}% to 85%+ by focusing on **${topSkill}** (currently ${userSkills[topSkill] || 0}% vs ${requiredSkills[topSkill] || 80}% required) and **${secondSkill}** (${userSkills[secondSkill] || 0}% vs ${requiredSkills[secondSkill] || 75}%). Complete the 5‑day project below.

### 🔥 Priority Skills to Learn
**${topSkill}**  
- *Why it matters*: Used in 80% of ${selectedRole} job tasks (e.g., building UI components, state management).  
- *What to focus on*: Core syntax, hooks/patterns, error handling, and debugging.  
- *Real‑world usage*: Create a dynamic dashboard, a form with validation, or a real‑time filter.

**${secondSkill}**  
- *Why it matters*: Essential for data fetching, API integration, or backend logic.  
- *What to focus on*: Async/await, promises, HTTP requests, and error boundaries.  
- *Real‑world usage*: Build a weather app, a search autocomplete, or a comment system.

**${thirdSkill}**  
- *Why it matters*: Improves code maintainability and team collaboration.  
- *What to focus on*: Code organization, testing basics, and version control (Git).  
- *Real‑world usage*: Refactor a messy function, write a unit test, or commit a feature branch.

### 📅 Daily Learning Plan (5 distinct days)
- **Day 1 (Environment & Basics)**: Set up a new project, write 5 small functions using ${topSkill}, and run them locally.  
- **Day 2 (Component / Module)**: Build a reusable ${topSkill} component (e.g., a card, button, or input group) with props.  
- **Day 3 (Data Integration)**: Fetch data from a public API using ${secondSkill} and display it inside your component.  
- **Day 4 (Refactor & Test)**: Add error handling, loading states, and one unit test for your component.  
- **Day 5 (Project Finish)**: Combine everything into a mini‑portfolio piece – deploy it on Vercel/Netlify.

### 🛠️ Hands‑on Practice
**Mini Project**: Create a "Skill Gap Tracker" that lists ${prioritySkills.join(", ")}. Allow users to rate their own levels, compare to required levels, and show a progress bar. Use ${topSkill} for the UI and ${secondSkill} for saving data (localStorage or mock API).  
**Real‑world Challenge**: Find an open issue labeled "good first issue" on a GitHub repo that uses ${topSkill}. Try to reproduce the bug or implement the feature locally.

### 📚 Recommended Resources
- **Course**: "The Complete ${topSkill} Course" on Udemy (or free equivalent on YouTube: "${topSkill} Tutorial for Beginners").  
- **Docs**: Official ${topSkill} documentation – focus on the "Getting Started" and "Advanced Concepts" sections.  
- **Practice**: LeetCode's ${topSkill} track + Frontend Mentor (real‑world design challenges).

### 🚀 Pro Tips
- **Code daily** – Even 30 minutes > 5 hours on weekends. Consistency builds muscle memory.  
- **Explain out loud** – Teach your solution to a rubber duck or record a voice memo.  
- **Limit AI copy‑paste** – Use AI to explain errors, not to write entire functions.  
- **Review before new** – Spend 5 minutes reviewing yesterday's code before starting today's task.
`;
};

export default function LearningPage() {
  const { selectedRole, rolesWithMetrics, userSkills } = useSkillContext();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const roleData = rolesWithMetrics.find(r => r.name === selectedRole);
  const matchScore = roleData?.matchScore || 0;
  const prioritySkills = roleData?.prioritySkills || [];
  const requiredSkills = roleData?.requiredSkills || {};

  const generatePlan = async () => {
    if (!roleData) return;
    setLoading(true);

    // Build a clear prompt that forces unique content per section
    const prompt = `
You are an expert career mentor. Generate a personalized learning plan for:

Target Role: ${selectedRole}
Match Score: ${matchScore}%
Current Skills: ${JSON.stringify(userSkills)}
Required Skills: ${JSON.stringify(requiredSkills)}
Priority Skills: ${prioritySkills.join(", ")}

STRICT RULES:
1. Each section (🎯 Goal, 🔥 Priority Skills, 📅 Daily Plan, 🛠️ Hands-on Practice, 📚 Resources, 🚀 Pro Tips) must contain COMPLETELY DIFFERENT content. No repeating advice, examples, or project ideas across sections.
2. Daily Plan: exactly 5 days, each day a distinct task (no repetition). Use Day 1, Day 2, etc.
3. Priority Skills: For each skill, write "Why it matters", "What to focus on", "Real-world usage" – these must be specific to ${selectedRole}.
4. Hands-on Practice: The mini project must combine at least 2 priority skills. The real-world challenge must be different from the mini project.
5. Resources: Recommend one specific course, one official doc, and one practice platform – all relevant to the priority skills.
6. Pro Tips: 4 actionable tips that are NOT about "coding daily" or "taking breaks" (be creative).

Output format (exact markdown):

#### 🎯 Goal
(one paragraph only)

#### 🔥 Priority Skills to Learn
**Skill Name**  
- Why it matters  
- What to focus on  
- Real-world usage

(Repeat for each priority skill)

#### 📅 Daily Learning Plan (5 days)
**Day 1:** (unique activity)  
**Day 2:** (different activity)  
**Day 3:** (different)  
**Day 4:** (different)  
**Day 5:** (different)

#### 🛠️ Hands-on Practice
**Mini Project:** (description)  
**Real-world Challenge:** (description)

#### 📚 Resources
**Course:** (name and platform)  
**Docs:** (official docs name)  
**Practice:** (platform name)

#### 🚀 Pro Tips
- (tip 1)  
- (tip 2)  
- (tip 3)  
- (tip 4)
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8, // Slightly higher for more variety
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        setPlan(content);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.error(err);
      // Use dynamic fallback with actual data
      const fallback = generateFallbackPlan(selectedRole, matchScore, prioritySkills, userSkills, requiredSkills);
      setPlan(fallback);
    }

    setLoading(false);
  };

  useEffect(() => {
    generatePlan();
  }, [selectedRole]);

  if (!roleData) {
    return (
      <div className="learning-container">
        <div className="loading-state">Loading role data...</div>
      </div>
    );
  }

  return (
    <div className="learning-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="learning-header">
        <div className="title-section">
          <span className="header-icon">🧠</span>
          <h2 className="learning-title">AI Learning Path</h2>
        </div>
        <div className="role-chip">
          🎯 {selectedRole} • <strong>{matchScore}%</strong> match
        </div>
      </div>

      <button className="generate-btn" onClick={generatePlan} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner"></span> Generating...
          </>
        ) : (
          <>🔄 Regenerate Plan</>
        )}
      </button>

      <div className="plan-card">
        {loading ? (
          <div className="skeleton-loader">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              h3: ({ node, ...props }) => <h3 className="plan-h3" {...props} />,
              h4: ({ node, ...props }) => <h4 className="plan-h4" {...props} />,
              p: ({ node, ...props }) => <p className="plan-p" {...props} />,
              ul: ({ node, ...props }) => <ul className="plan-ul" {...props} />,
              li: ({ node, ...props }) => <li className="plan-li" {...props} />,
              a: ({ node, ...props }) => <a className="plan-link" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({ node, ...props }) => <strong className="plan-strong" {...props} />,
            }}
          >
            {plan}
          </ReactMarkdown>
        )}
      </div>

      <div className="learning-footer">
        💡 Tip: Adjust your skill sliders on the Dashboard, then regenerate for updated recommendations.
      </div>
    </div>
  );
}