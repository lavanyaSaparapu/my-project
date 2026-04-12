const fs = require('fs');

// All 44 skills (your master list)
const ALL_SKILLS = [
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

const LEVELS = ['easy', 'medium', 'hard'];

// Shuffle options so the correct answer isn't always first
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 30 unique questions for a (skill, level)
function generateQuestionsForSkill(skill, level) {
  const topics = [
    "best practices", "common pitfalls", "performance optimization", "security", "tooling",
    "debugging techniques", "testing strategies", "deployment", "monitoring", "code organization",
    "error handling", "logging", "configuration", "dependency management", "documentation",
    "refactoring", "design patterns", "architecture", "scalability", "maintainability",
    "CI/CD integration", "version control", "code review", "technical debt", "agile methodology",
    "team collaboration", "user feedback", "analytics", "A/B testing", "internationalization"
  ];

  const questions = [];
  for (let i = 1; i <= 30; i++) {
    const topic = topics[(i - 1) % topics.length];
    const difficultyPrefix = level === "easy" ? "basic" : (level === "medium" ? "intermediate" : "advanced");

    let correctOption = "";
    let wrongOptions = [];
    if (level === "easy") {
      correctOption = `Follow established ${skill} conventions and standards`;
      wrongOptions = [
        `Ignore ${skill} best practices entirely`,
        `Use ${skill} without any testing`,
        `Overcomplicate ${skill} solutions with unnecessary code`
      ];
    } else if (level === "medium") {
      correctOption = `Implement proper ${skill} patterns and review regularly`;
      wrongOptions = [
        `Skip ${skill} documentation to save time`,
        `Use ${skill} in isolation without team input`,
        `Apply ${skill} only when forced by management`
      ];
    } else {
      correctOption = `Design scalable ${skill} solutions with continuous improvement`;
      wrongOptions = [
        `Hardcode all ${skill} logic without abstraction`,
        `Avoid ${skill} optimizations until production fails`,
        `Rely on outdated ${skill} practices without research`
      ];
    }

    const options = [correctOption, ...wrongOptions];
    const shuffled = shuffleArray([...options]);
    const correctIndex = shuffled.indexOf(correctOption);
    const explanation = `In ${skill}, ${correctOption.toLowerCase()} is crucial for ${topic}. The other options lead to poor quality, technical debt, or increased risk.`;

    questions.push({
      id: i,
      text: `What is a ${difficultyPrefix} approach to ${topic} in ${skill}? (Q${i})`,
      options: shuffled,
      correctIndex,
      explanation
    });
  }
  return questions;
}

// Build the full static database
const questionsDB = {};
ALL_SKILLS.forEach(skill => {
  questionsDB[skill] = {};
  LEVELS.forEach(level => {
    questionsDB[skill][level] = generateQuestionsForSkill(skill, level);
  });
});

// Write to questions.json
fs.writeFileSync('questions.json', JSON.stringify(questionsDB, null, 2));
console.log('✅ questions.json generated with 44 skills × 3 levels × 30 questions = 3,960 total questions.');