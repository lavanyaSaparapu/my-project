// ========== MASTER SKILLS LIST ==========
export const ALL_SKILLS = [
  "React", "TypeScript", "Testing", "Performance", "Git",
  "Node.js", "DB", "API", "Security", "Docker",
  "Frontend", "Backend", "DevOps", "Cloud Basics", "CI/CD",
  "Figma", "UX", "Research", "Prototyping", "Accessibility",
  "Python", "ML", "Stats", "SQL", "Visualization",
  "Deep Learning", "Math", "Deployment", "MLOps",
  "Kubernetes", "Cloud", "Monitoring", "Terraform",
  "Flutter", "UI", "API Integration", "Performance Tuning",
  "Network", "Ethical Hacking", "Tools", "Compliance",
  "AWS", "Azure", "Networking", "Infrastructure as Code"
];

// ========== ROLE DEFINITIONS (required skills) ==========
export const rolesDataRaw = {
  "Frontend Engineer": {
    requiredSkills: {
      React: 95, TypeScript: 90, Testing: 75,
      Performance: 80, Git: 85, Accessibility: 70,
      "State Management": 80, "Web Vitals": 75
    },
    prioritySkillsOrder: ["TypeScript", "Testing", "Performance", "Accessibility", "State Management", "Web Vitals"]
  },
  "Backend Developer": {
    requiredSkills: {
      "Node.js": 90, DB: 85, API: 80, Security: 75, Docker: 70,
      "API Design": 80, "Database Optimization": 75, "Microservices": 70, Caching: 65
    },
    prioritySkillsOrder: ["Docker", "Security", "API Design", "Database Optimization", "Microservices", "Caching"]
  },
  "Full Stack Developer": {
    requiredSkills: {
      Frontend: 90, Backend: 85, DB: 80, DevOps: 75, Testing: 80,
      "System Design": 70, "Cloud Basics": 70, "CI/CD": 75
    },
    prioritySkillsOrder: ["DevOps", "Testing", "Cloud Basics", "CI/CD", "System Design"]
  },
  "UI/UX Designer": {
    requiredSkills: {
      Figma: 95, UX: 90, Research: 80, Prototyping: 85, Accessibility: 75,
      "Design Systems": 80, "Usability Testing": 75, "Interaction Design": 80
    },
    prioritySkillsOrder: ["User Research", "Accessibility (WCAG)", "Design Systems", "Usability Testing", "Interaction Design"]
  },
  "Data Scientist": {
    requiredSkills: {
      Python: 90, ML: 85, Stats: 80, SQL: 85, Visualization: 80,
      "Data Wrangling": 80, "Big Data Tools": 70, "Deep Learning": 75
    },
    prioritySkillsOrder: ["Machine Learning", "Statistics", "Data Wrangling", "Big Data Tools", "Deep Learning"]
  },
  "Machine Learning Engineer": {
    requiredSkills: {
      ML: 90, "Deep Learning": 85, Python: 90, Math: 80, Deployment: 75,
      "MLOps": 80, "TensorFlow/PyTorch": 85, "Feature Engineering": 80
    },
    prioritySkillsOrder: ["Deep Learning", "MLOps", "TensorFlow/PyTorch", "Model Deployment", "Feature Engineering"]
  },
  "DevOps Engineer": {
    requiredSkills: {
      "CI/CD": 85, Docker: 90, Kubernetes: 85, Cloud: 90, Monitoring: 80,
      Terraform: 85, "GitOps": 80, Security: 80, Observability: 75
    },
    prioritySkillsOrder: ["Kubernetes", "Terraform", "Cloud (AWS/Azure)", "GitOps", "Security", "Observability"]
  },
  "Mobile Developer": {
    requiredSkills: {
      Flutter: 90, UI: 85, API: 80, Performance: 75, Testing: 70,
      "State Management": 80, "App Store Deployment": 70
    },
    prioritySkillsOrder: ["Performance Optimization", "Testing (Unit/Widget)", "Platform Channels", "State Management", "App Store Deployment"]
  },
  "Cybersecurity Analyst": {
    requiredSkills: {
      Network: 90, Security: 85, "Ethical Hacking": 80, Tools: 75, Compliance: 70,
      "SIEM Tools": 80, "Risk Assessment": 75, "Incident Response": 75
    },
    prioritySkillsOrder: ["Ethical Hacking", "SIEM Tools", "Risk Assessment", "Incident Response", "Security Frameworks"]
  },
  "Cloud Engineer": {
    requiredSkills: {
      AWS: 90, Azure: 85, DevOps: 80, Security: 75, Networking: 80,
      "Infrastructure as Code": 85, Serverless: 80, "Cost Optimization": 75
    },
    prioritySkillsOrder: ["AWS Solutions Architect", "Infrastructure as Code", "Serverless", "Cloud Networking", "Cost Optimization"]
  }
};

// ========== HELPER: COMPUTE ROLE METRICS ==========
export const computeRoleMetrics = (roleName, userSkills) => {
  const role = rolesDataRaw[roleName];
  if (!role) return null;
  const required = role.requiredSkills;

  const relevantSkills = Object.keys(required).map(skill => ({
    skill,
    your: userSkills[skill] || 0,
    required: required[skill]
  }));

  if (relevantSkills.length === 0) return null;

  let totalRatio = 0;
  let skillsMatched = 0;
  let skillsToLearn = 0;
  relevantSkills.forEach(({ your, required: req }) => {
    const ratio = Math.min(your, req) / req;
    totalRatio += ratio;
    if (your >= req * 0.8) skillsMatched++;
    else skillsToLearn++;
  });
  const matchScore = Math.round((totalRatio / relevantSkills.length) * 100);

  const radarData = relevantSkills.map(({ skill, your, required: req }) => ({
    skill: skill.length > 12 ? skill.slice(0,10)+"…" : skill,
    your,
    required: req
  }));

  const prioritySkills = [...relevantSkills]
    .filter(({ your, required }) => required - your > 0)
    .sort((a,b) => (b.required - b.your) - (a.required - a.your))
    .map(({ skill }) => skill);

  const progress = relevantSkills.map(({ skill, your }) => ({ skill, value: your }));

  let hireProbability = "Low";
  if (matchScore >= 70) hireProbability = "High";
  else if (matchScore >= 50) hireProbability = "Medium";

  return {
    matchScore,
    skillsMatched,
    skillsToLearn,
    hireProbability,
    radarData,
    prioritySkills: prioritySkills.length ? prioritySkills : role.prioritySkillsOrder.slice(0,5),
    progress
  };
};