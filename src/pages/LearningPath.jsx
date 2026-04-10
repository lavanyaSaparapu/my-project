// LearningPage.jsx
import { useEffect, useState } from "react";
import { useSkillContext } from "../context/SkillContext";
import ReactMarkdown from "react-markdown";
import "./LearningPage.css";

// Optional: Add a fallback plan for development or when API fails
const FALLBACK_PLAN = `
#### 🎯 Goal
Your goal is to improve your **${selectedRole}** skills from ${matchScore}% to 85%+ by focusing on hands-on projects.

#### 🔥 Priority Skills to Learn
- **${prioritySkills[0]}** – Why it matters: Core requirement for ${selectedRole}.
- **${prioritySkills[1]}** – Why it matters: Frequently used in daily tasks.

#### 📅 Daily Learning Plan
**Day 1:** Study ${prioritySkills[0]} fundamentals → Build a small component.  
**Day 2:** Practice ${prioritySkills[1]} → Solve 3 real-world exercises.  
**Day 3:** Integrate both skills into a mini project.

#### 🛠️ Hands-on Practice
**Mini Project:** Create a dashboard that uses ${prioritySkills[0]} and ${prioritySkills[1]}.  
**Challenge:** Refactor an existing feature to improve performance.

#### 📚 Resources
- [MDN Web Docs](https://developer.mozilla.org)
- [freeCodeCamp](https://freecodecamp.org)

#### 🚀 Pro Tips
- Code for 1 hour daily, not 5 hours on weekends.
- Explain concepts aloud to reinforce learning.
`;

export default function LearningPage() {
  const { selectedRole, rolesWithMetrics, userSkills } = useSkillContext();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const roleData = rolesWithMetrics.find(r => r.name === selectedRole);
  const matchScore = roleData?.matchScore || 0;
  const prioritySkills = roleData?.prioritySkills || [];

  const generatePlan = async () => {
    if (!roleData) return;
    setLoading(true);

    const prompt = `
You are an expert career mentor and software engineering coach.

Based on the user's skill data and target role, generate a personalized learning plan.

### User Data:
- Target Role: ${selectedRole}
- Match Score: ${matchScore}%
- Skills: ${JSON.stringify(userSkills)}
- Required Skills: ${JSON.stringify(roleData.requiredSkills)}
- Priority Skills: ${prioritySkills.join(", ")}

---

Follow this structure exactly:

#### 🎯 Goal
#### 🔥 Priority Skills to Learn
#### 📅 Daily Learning Plan (3-5 days)
#### 🛠️ Hands-on Practice
#### 📚 Resources
#### 🚀 Pro Tips

Keep it concise, practical, and project-based. Use bullet points and clear headings.
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use env variable!
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      setPlan(content || "⚠️ No content received.");
    } catch (err) {
      console.error(err);
      // Fallback plan (replace placeholders)
      let fallback = FALLBACK_PLAN.replace(/\${selectedRole}/g, selectedRole)
        .replace(/\${matchScore}/g, matchScore)
        .replace(/\${prioritySkills\[0\]}/g, prioritySkills[0] || "core skills")
        .replace(/\${prioritySkills\[1\]}/g, prioritySkills[1] || "secondary skills");
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
      {/* Animated blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Header section */}
      <div className="learning-header">
        <div className="title-section">
          <span className="header-icon">🧠</span>
          <h2 className="learning-title">AI Learning Path</h2>
        </div>
        <div className="role-chip">
          🎯 {selectedRole} • <strong>{matchScore}%</strong> match
        </div>
      </div>

      {/* Regenerate button */}
      <button className="generate-btn" onClick={generatePlan} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner"></span> Generating...
          </>
        ) : (
          <>
            🔄 Regenerate Plan
          </>
        )}
      </button>

      {/* Plan output with markdown rendering */}
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
            }}
          >
            {plan}
          </ReactMarkdown>
        )}
      </div>

      {/* Pro tip footer */}
      <div className="learning-footer">
        💡 Tip: Update your skills on the Dashboard and regenerate the plan for new recommendations!
      </div>
    </div>
  );
}