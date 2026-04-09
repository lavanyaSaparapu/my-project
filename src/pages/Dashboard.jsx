import { useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSkillContext } from "../context/SkillContext";
import { ALL_SKILLS } from "../data/SkillData";
import "./Dashboard.css";

// ========== SUB-COMPONENTS ==========
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderColor: color }}>
      <div className="stat-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

// ✅ Enhanced tooltip with gap progress bar
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const yourLevel = payload[0]?.value;
    const requiredLevel = payload[1]?.value;
    const gap = requiredLevel - yourLevel;
    const gapPercent = Math.min(100, Math.max(0, (yourLevel / requiredLevel) * 100));
    const isGapHigh = gap > 30;
    const isGapMedium = gap > 15 && gap <= 30;

    return (
      <div className="radar-tooltip-enhanced">
        <div className="tooltip-header">
          <span className="tooltip-skill-icon">📊</span>
          <strong>{label}</strong>
        </div>
        <div className="tooltip-body">
          <div className="tooltip-row">
            <span>Your Level</span>
            <span className="your-value">{yourLevel}%</span>
          </div>
          <div className="tooltip-row">
            <span>Required</span>
            <span className="required-value">{requiredLevel}%</span>
          </div>
          <div className="gap-progress-container">
            <div className="gap-progress-label">
              <span>Gap</span>
              <span className={`gap-value ${isGapHigh ? 'high' : isGapMedium ? 'medium' : 'low'}`}>
                {gap > 0 ? `−${gap}%` : '+0%'}
              </span>
            </div>
            <div className="gap-progress-bg">
              <div 
                className="gap-progress-fill" 
                style={{ 
                  width: `${gapPercent}%`, 
                  background: isGapHigh ? '#ef4444' : isGapMedium ? '#f59e0b' : '#10b981' 
                }}
              />
            </div>
          </div>
          <div className="tooltip-footer">
            {gap > 0 ? (
              <span>⚠️ Need <strong>{gap}%</strong> more</span>
            ) : (
              <span>✅ Exceeds by <strong>{Math.abs(gap)}%</strong></span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ✅ Progress bar with percentage inside
const ProgressItem = ({ skill, percent }) => {
  return (
    <div className="progress-item">
      <span>{skill}</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
};

const PriorityBadge = ({ skill }) => {
  return (
    <span className="priority-badge">
      🔥 {skill}
    </span>
  );
};

// ========== MAIN COMPONENT ==========
export default function Dashboard() {
  const { userSkills, updateSkill, selectedRole, setSelectedRole, rolesWithMetrics, bestMatchRole, getRoleData } = useSkillContext();
  const currentRoleData = getRoleData(selectedRole);

  if (!currentRoleData) return <div className="dashboard-error">Loading roles...</div>;

  const stats = [
    { title: "Match Score", value: `${currentRoleData.matchScore}%`, icon: "🎯", color: "#6366f1" },
    { title: "Skills Matched", value: currentRoleData.skillsMatched, icon: "✅", color: "#10b981" },
    { title: "Skills To Learn", value: currentRoleData.skillsToLearn, icon: "📚", color: "#f59e0b" },
    { title: "Hire Chance", value: currentRoleData.hireProbability, icon: "⚡", color: "#ec4899" },
  ];

  // FIXED: ensure the slider value is a number and update works
  const handleSkillChange = (skill, value) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
      updateSkill(skill, numericValue);
    }
  };

  return (
    <div className="dashboard">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="title-icon">🎯</span> Role Match Dashboard
        </h2>
        <div className="role-selector">
          <label>Compare with:</label>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="role-select">
            {rolesWithMetrics.map(role => (
              <option key={role.name} value={role.name}>
                {role.name} – {role.matchScore}% match
              </option>
            ))}
          </select>
        </div>
      </div>

      {bestMatchRole && (
        <div className="best-match-card">
          <div className="best-match-icon">🔥</div>
          <div className="best-match-content">
            <h3>Your Best Match</h3>
            <p className="best-match-role">{bestMatchRole.name}</p>
            <div className="best-match-score">
              <span className="score-label">Match Score</span>
              <span className="score-value">{bestMatchRole.matchScore}%</span>
            </div>
          </div>
          <div className="best-match-badge">Recommended</div>
        </div>
      )}

      <div className="stats-grid">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="skills-editor">
        <h3 className="section-title"><span>✏️</span> My Skills (drag sliders)</h3>
        <div className="skills-grid">
          {ALL_SKILLS.map(skill => (
            <div key={skill} className="skill-slider-item">
              <label>{skill}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={userSkills[skill] || 0}
                onChange={(e) => handleSkillChange(skill, e.target.value)}
              />
              <span className="skill-value">{userSkills[skill] || 0}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="radar-section">
        <h3 className="section-title"><span>📡</span> Skill Gap Analysis for {selectedRole}</h3>
        <div className="radar-container">
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={currentRoleData.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: '#9ca3af' }} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} />
              <Radar dataKey="your" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} strokeWidth={2} />
              <Radar dataKey="required" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="radar-legend">
          <span><span className="legend-dot you"></span> Your Level</span>
          <span><span className="legend-dot required"></span> Required</span>
        </div>
      </div>

      <div className="bottom-section">
        <div className="progress-section">
          <h3 className="section-title"><span>📈</span> Skill Progress (current levels)</h3>
          <div className="progress-list">
            {currentRoleData.progress.map(p => <ProgressItem key={p.skill} skill={p.skill} percent={p.value} />)}
          </div>
        </div>
        <div className="priority-section">
          <h3 className="section-title"><span>🔥</span> Priority Skills to Improve</h3>
          <div className="priority-list">
            {currentRoleData.prioritySkills.map(skill => <PriorityBadge key={skill} skill={skill} />)}
          </div>
          <div className="learning-suggestion">
            <h4>💡 Recommended Next Step</h4>
            <p>Focus on <strong>{currentRoleData.prioritySkills[0] || "core fundamentals"}</strong> to close your biggest gap.</p>
          </div>
        </div>
      </div>
    </div>
  );
}