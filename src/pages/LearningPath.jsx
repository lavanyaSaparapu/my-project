```jsx
import { useEffect, useState } from "react";
import { useSkillContext } from "../context/SkillContext";
import "./LearningPage.css";

export default function LearningPage() {
  const { selectedRole, rolesWithMetrics, userSkills } = useSkillContext();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const roleData = rolesWithMetrics.find(r => r.name === selectedRole);

  const generatePlan = async () => {
    if (!roleData) return;

    setLoading(true);

    const prompt = `
You are an expert career mentor and software engineering coach.

Based on the user's skill data and target role, generate a personalized learning plan.

### User Data:
- Target Role: ${selectedRole}
- Match Score: ${roleData.matchScore}%
- Skills: ${JSON.stringify(userSkills)}
- Required Skills: ${JSON.stringify(roleData.requiredSkills)}
- Priority Skills: ${roleData.prioritySkills.join(", ")}

---

Follow this structure:

#### 🎯 Goal
#### 🔥 Priority Skills to Learn
#### 📅 Daily Learning Plan
#### 🛠️ Hands-on Practice
#### 📚 Resources
#### 🚀 Pro Tips

Keep it concise, practical, and project-based.
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      setPlan(content || "No response");
    } catch (err) {
      console.error(err);
      setPlan("❌ Failed to generate plan");
    }

    setLoading(false);
  };

  useEffect(() => {
    generatePlan();
  }, [selectedRole]);

  if (!roleData) return <div className="learning-container">Loading...</div>;

  return (
    <div className="learning-container">
      {/* HEADER */}
      <div className="learning-header">
        <h2 className="learning-title">🧠 AI Learning Path</h2>
        <div className="role-info">
          {selectedRole} • {roleData.matchScore}%
        </div>
      </div>

      {/* BUTTON */}
      <button
        className="generate-btn"
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? "Generating..." : "🔄 Regenerate Plan"}
      </button>

      {/* PLAN OUTPUT */}
      <div className="plan-card">
        {loading ? (
          <div className="loading-text">
            ⚡ Generating your personalized learning path...
          </div>
        ) : (
          plan
        )}
      </div>
    </div>
  );
}
```
