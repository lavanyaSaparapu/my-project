import React, { useState } from 'react';
import './QuickPractice.css';

const QuickPractice = ({ onBack }) => {
  const ALL_SKILLS = [
    "React", "TypeScript", "JavaScript", "Node.js", "API",
    "DB", "Testing", "Performance", "Git", "Security", "Python"
  ];

  // --------------------------------------------------------------
  // 30 UNIQUE QUESTION TEMPLATES per level (no repeats)
  // --------------------------------------------------------------
  const templates = {
    easy: [
      { verb: "What is", suffix: "used for?" },
      { verb: "Define", suffix: "in your own words." },
      { verb: "Which tool is best for", suffix: "?" },
      { verb: "Explain the purpose of", suffix: "." },
      { verb: "What does", suffix: "help you achieve?" },
      { verb: "Describe a basic use case of", suffix: "." },
      { verb: "Why is", suffix: "important?" },
      { verb: "What is the first step in", suffix: "?" },
      { verb: "Identify a key feature of", suffix: "." },
      { verb: "How does", suffix: "improve development?" },
      { verb: "What problem does", suffix: "solve?" },
      { verb: "Give an example of", suffix: "." },
      { verb: "What is a common benefit of", suffix: "?" },
      { verb: "When would you use", suffix: "?" },
      { verb: "What is a simple way to start with", suffix: "?" },
      { verb: "Which statement best describes", suffix: "?" },
      { verb: "What is the main goal of", suffix: "?" },
      { verb: "How can", suffix: "save time?" },
      { verb: "What is a beginner mistake in", suffix: "?" },
      { verb: "What is a core concept of", suffix: "?" },
      { verb: "What does a good", suffix: "look like?" },
      { verb: "Why do developers use", suffix: "?" },
      { verb: "What is the output of a typical", suffix: "?" },
      { verb: "What is the first thing to learn in", suffix: "?" },
      { verb: "What is a best practice for", suffix: "?" },
      { verb: "What is a key advantage of", suffix: "?" },
      { verb: "What is a common use case for", suffix: "?" },
      { verb: "What is the simplest form of", suffix: "?" },
      { verb: "What does a beginner need to know about", suffix: "?" },
      { verb: "Why is", suffix: "valuable in projects?" }
    ],
    medium: [
      { verb: "Compare", suffix: "with an alternative." },
      { verb: "Explain a common pitfall in", suffix: "." },
      { verb: "How would you optimize", suffix: "for performance?" },
      { verb: "Describe a scenario where", suffix: "fails and how to fix it." },
      { verb: "What is a design pattern used in", suffix: "?" },
      { verb: "How does", suffix: "handle errors?" },
      { verb: "What is a trade‑off when using", suffix: "?" },
      { verb: "How do you debug issues in", suffix: "?" },
      { verb: "What is a less known feature of", suffix: "?" },
      { verb: "How can you integrate", suffix: "with other tools?" },
      { verb: "What is a typical workflow for", suffix: "?" },
      { verb: "How would you refactor a messy", suffix: "?" },
      { verb: "What is a common misconception about", suffix: "?" },
      { verb: "How do you test", suffix: "effectively?" },
      { verb: "What is a scalability concern in", suffix: "?" },
      { verb: "How does", suffix: "affect team collaboration?" },
      { verb: "What is a security risk when using", suffix: "?" },
      { verb: "How would you document", suffix: "for a team?" },
      { verb: "What is a performance bottleneck in", suffix: "?" },
      { verb: "How do you keep", suffix: "up to date?" },
      { verb: "What is a common anti‑pattern in", suffix: "?" },
      { verb: "How does", suffix: "handle concurrency?" },
      { verb: "What is a configuration challenge in", suffix: "?" },
      { verb: "How would you migrate from an older", suffix: "?" },
      { verb: "What is a best practice for logging in", suffix: "?" },
      { verb: "How does", suffix: "impact code maintainability?" },
      { verb: "What is a common integration point for", suffix: "?" },
      { verb: "How would you profile", suffix: "for memory leaks?" },
      { verb: "What is a typical team workflow for", suffix: "?" },
      { verb: "How would you teach", suffix: "to a junior?" }
    ],
    hard: [
      { verb: "Analyze a real‑world failure caused by", suffix: "and propose a fix." },
      { verb: "How would you extend", suffix: "to support a new requirement?" },
      { verb: "Discuss the architectural trade‑offs of", suffix: "." },
      { verb: "How does", suffix: "behave under extreme load?" },
      { verb: "What is a rarely used but powerful feature of", suffix: "?" },
      { verb: "How would you implement a custom", suffix: "from scratch?" },
      { verb: "What are the internals of", suffix: "?" },
      { verb: "How would you contribute a major feature to", suffix: "?" },
      { verb: "What is a non‑obvious way to misuse", suffix: "?" },
      { verb: "How does", suffix: "compare to a newer alternative in depth?" },
      { verb: "What is a long‑term maintenance challenge in", suffix: "?" },
      { verb: "How would you deprecate a part of", suffix: "safely?" },
      { verb: "What is a theoretical limit of", suffix: "?" },
      { verb: "How would you rewrite", suffix: "to be more efficient?" },
      { verb: "What is a hidden dependency in", suffix: "?" },
      { verb: "How does", suffix: "handle backwards compatibility?" },
      { verb: "What is a common mistake when scaling", suffix: "?" },
      { verb: "How would you automate testing for", suffix: "at enterprise level?" },
      { verb: "What is a security vulnerability specific to", suffix: "?" },
      { verb: "How would you implement a plugin system for", suffix: "?" },
      { verb: "What is a performance anti‑pattern in", suffix: "?" },
      { verb: "How does", suffix: "manage state across distributed systems?" },
      { verb: "What is a deadlock scenario in", suffix: "?" },
      { verb: "How would you conduct a post‑mortem for", suffix: "failure?" },
      { verb: "What is a cross‑cutting concern when using", suffix: "?" },
      { verb: "How would you refactor a legacy", suffix: "codebase?" },
      { verb: "What is a non‑functional requirement for", suffix: "?" },
      { verb: "How would you measure the success of", suffix: "in a large org?" },
      { verb: "What is a cutting‑edge advancement in", suffix: "?" },
      { verb: "How would you design a certification for", suffix: "?" }
    ]
  };

  // 30 different topics per skill (ensures variety)
  const topics = {
    React: [
      "components", "state management", "props", "hooks", "lifecycle methods",
      "JSX", "virtual DOM", "keys", "context API", "refs", "fragments", "portals",
      "error boundaries", "higher‑order components", "render props", "controlled components",
      "uncontrolled components", "lifting state up", "composition vs inheritance",
      "React.memo", "useCallback", "useMemo", "useReducer", "useRef", "useImperativeHandle",
      "useLayoutEffect", "custom hooks", "React Router", "Redux integration", "SSR with Next.js"
    ],
    TypeScript: [
      "interfaces", "type aliases", "generics", "union types", "intersection types",
      "type guards", "utility types", "decorators", "modules", "namespaces",
      "declaration merging", "ambient declarations", "type inference", "type assertions",
      "literal types", "mapped types", "conditional types", "infer keyword", "never type",
      "unknown type", "tuple types", "enum", "class types", "abstract classes",
      "access modifiers", "readonly properties", "optional chaining", "nullish coalescing",
      "type predicates", "module augmentation"
    ],
    JavaScript: [
      "closures", "prototypal inheritance", "event loop", "hoisting", "this binding",
      "promises", "async/await", "callbacks", "array methods", "object destructuring",
      "spread operator", "rest parameters", "generators", "iterators", "symbols",
      "map and set", "weakmap and weakset", "proxy", "reflect", "class fields",
      "private fields", "decorators (stage 3)", "dynamic imports", "top‑level await",
      "error handling", "event delegation", "debouncing", "throttling", "currying", "memoization"
    ],
    "Node.js": [
      "event loop", "streams", "buffers", "child processes", "cluster module",
      "file system (fs)", "path module", "os module", "http/https", "express framework",
      "middleware", "error handling", "debugging", "performance monitoring", "npm scripts",
      "package.json", "commonJS vs ES modules", "worker threads", "process object",
      "environment variables", "crypto module", "zlib compression", "readline",
      "event emitters", "domain module", "cluster vs worker", "memory leaks",
      "security best practices", "logging strategies", "testing with jest/mocha"
    ],
    API: [
      "REST principles", "HTTP methods", "status codes", "headers", "query parameters",
      "request/response body", "authentication (JWT, OAuth)", "rate limiting", "pagination",
      "filtering", "versioning", "OpenAPI / Swagger", "GraphQL", "WebSockets",
      "gRPC", "API gateways", "idempotency", "caching strategies", "error response formats",
      "HATEOAS", "CORS", "CSRF protection", "API security", "API documentation",
      "mock servers", "API testing", "performance monitoring", "deprecation strategies",
      "webhooks", "event‑driven APIs"
    ],
    DB: [
      "SQL queries", "indexes", "transactions", "normalization", "denormalization",
      "joins (INNER, LEFT, etc.)", "subqueries", "stored procedures", "triggers",
      "views", "ACID properties", "isolation levels", "deadlocks", "connection pooling",
      "sharding", "replication", "backup and restore", "migrations", "NoSQL (MongoDB)",
      "document stores", "key‑value stores", "graph databases", "time‑series databases",
      "CAP theorem", "eventual consistency", "database monitoring", "query optimization",
      "explain plans", "data warehousing", "OLAP vs OLTP"
    ],
    Testing: [
      "unit tests", "integration tests", "end‑to‑end tests", "snapshot testing",
      "test‑driven development (TDD)", "behavior‑driven development (BDD)",
      "mocking", "stubs", "spies", "fixtures", "test runners (Jest, Mocha)",
      "assertion libraries", "code coverage", "test pyramid", "property‑based testing",
      "contract testing", "visual regression testing", "load testing", "performance testing",
      "security testing", "test doubles", "test isolation", "test parallelization",
      "continuous testing", "test fixtures", "parameterized tests", "test hooks (beforeEach)",
      "test suites", "test reporting", "flaky tests"
    ],
    Performance: [
      "lazy loading", "code splitting", "tree shaking", "bundle analysis",
      "critical rendering path", "image optimization", "font loading", "caching headers",
      "CDN", "preconnect", "prefetch", "preload", "resource hints", "minification",
      "compression (gzip, Brotli)", "HTTP/2", "server push", "service workers",
      "web vitals (LCP, FID, CLS)", "time to interactive (TTI)", "first paint",
      "first contentful paint", "long tasks", "memory leaks", "DOM size",
      "reflow and repaint", "debounce/throttle", "virtual scrolling", "requestIdleCallback",
      "web workers"
    ],
    Git: [
      "commit", "branch", "merge", "rebase", "cherry‑pick", "stash", "reset",
      "revert", "fetch", "pull", "push", "remote", "clone", "init", "status",
      "log", "diff", "blame", "bisect", "reflog", "submodules", "tag",
      "worktree", "hooks", "gitignore", "git config", "git flow", "pull requests",
      "merge conflicts", "fast‑forward vs 3‑way merge"
    ],
    Security: [
      "XSS (cross‑site scripting)", "CSRF (cross‑site request forgery)",
      "SQL injection", "command injection", "path traversal", "XXE (XML external entity)",
      "SSRF (server‑side request forgery)", "IDOR (insecure direct object references)",
      "security misconfiguration", "sensitive data exposure", "broken authentication",
      "session management", "CORS misconfiguration", "CSP (content security policy)",
      "HSTS", "HTTPS/TLS", "JWT security", "OAuth 2.0", "OpenID Connect",
      "password hashing (bcrypt, scrypt)", "salting", "rate limiting", "input validation",
      "output encoding", "dependency scanning", "SAST/DAST", "security headers",
      "audit logs", "incident response", "zero‑trust architecture"
    ],
    Python: [
      "list comprehensions", "generators", "decorators", "context managers",
      "lambda functions", "map/filter/reduce", "functools", "itertools",
      "dunder methods", "class inheritance", "metaclasses", "descriptors",
      "property decorator", "static methods", "class methods", "abstract base classes",
      "exception handling", "with statement", "asyncio", "threading vs multiprocessing",
      "global interpreter lock (GIL)", "type hints", "dataclasses", "enums",
      "collections module (defaultdict, Counter)", "pickle serialization",
      "logging module", "virtual environments", "pip packaging", "unit tests with pytest"
    ]
  };

  // Helper to shuffle array (for options order)
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate 30 unique questions for given skill & level
  const generateQuestions = (skill, level) => {
    const skillTopics = topics[skill] || topics.JavaScript;
    const levelTemplates = templates[level];
    const questions = [];

    for (let i = 0; i < 30; i++) {
      const topic = skillTopics[i % skillTopics.length];
      const template = levelTemplates[i];
      let correctAnswer, wrongAnswers, explanation;

      if (level === "easy") {
        correctAnswer = `Mastering ${topic} in ${skill}`;
        wrongAnswers = [
          `Ignoring ${topic} completely`,
          `Using ${topic} without understanding`,
          `Only memorizing ${topic} without practice`
        ];
        explanation = `Understanding ${topic} is a fundamental part of ${skill} and helps build a solid foundation.`;
      } else if (level === "medium") {
        correctAnswer = `Applying ${topic} patterns effectively in ${skill} projects`;
        wrongAnswers = [
          `Overusing ${topic} everywhere without need`,
          `Avoiding ${topic} to keep code simple`,
          `Copying ${topic} solutions without adapting them`
        ];
        explanation = `Proper application of ${topic} improves code quality, maintainability, and team productivity.`;
      } else {
        correctAnswer = `Optimizing and scaling ${topic} solutions in complex ${skill} systems`;
        wrongAnswers = [
          `Ignoring ${topic} optimizations until failure`,
          `Overengineering ${topic} beyond actual requirements`,
          `Using deprecated or insecure ${topic} practices`
        ];
        explanation = `Advanced ${topic} skills lead to robust, high‑performance, and secure ${skill} implementations.`;
      }

      const options = shuffleArray([correctAnswer, ...wrongAnswers]);
      const correctIndex = options.indexOf(correctAnswer);
      const questionText = `${template.verb} ${topic} ${template.suffix}`;

      questions.push({
        id: i + 1,
        text: `${questionText} (Q${i+1})`,
        options: options,
        correct: correctIndex,
        explanation: explanation
      });
    }
    return questions;
  };

  // --------------------------------------------------------------
  // Component state
  // --------------------------------------------------------------
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = () => {
    if (!selectedSkill || !selectedLevel) return;
    const newQuestions = generateQuestions(selectedSkill, selectedLevel);
    setQuestions(newQuestions);
    setQuizStarted(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === questions[currentIndex].correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setSelectedSkill('');
    setSelectedLevel('');
    setQuestions([]);
    setQuizFinished(false);
    setScore(0);
  };

  const handleBackToLevels = () => {
    setQuizStarted(false);
    setSelectedSkill('');
    setSelectedLevel('');
    setQuestions([]);
    setQuizFinished(false);
    setScore(0);
    if (onBack) onBack();
  };

  // --------------------------------------------------------------
  // RENDER: Skill & level picker
  // --------------------------------------------------------------
  if (!quizStarted) {
    const levels = [
      { id: 'easy', name: 'Easy', icon: '🌱' },
      { id: 'medium', name: 'Medium', icon: '⚡' },
      { id: 'hard', name: 'Hard', icon: '🔥' }
    ];
    return (
      <div className="quick-practice">
        <div className="quiz-card picker-card">
          <h2>📚 Quick Knowledge Check</h2>
          <p>Select a skill and difficulty</p>
          <div className="skill-selector">
            <label>Skill:</label>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">-- Select --</option>
              {ALL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="level-selector">
            <label>Difficulty:</label>
            <div className="level-buttons">
              {levels.map(l => (
                <button
                  key={l.id}
                  className={`level-btn ${selectedLevel === l.id ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(l.id)}
                >
                  {l.icon} {l.name}
                </button>
              ))}
            </div>
          </div>
          <button className="start-btn" onClick={startQuiz} disabled={!selectedSkill || !selectedLevel}>Start Quiz</button>
          {onBack && <button className="back-btn" onClick={handleBackToLevels}>← Back to Levels</button>}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // RENDER: Result screen
  // --------------------------------------------------------------
  if (quizFinished) {
    const percent = Math.round((score / questions.length) * 100);
    const msg = percent >= 80 ? 'Excellent! 🌟' : (percent >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪');
    return (
      <div className="quick-practice">
        <div className="quiz-card result-card">
          <h2>Quiz Completed</h2>
          <div className="score-circle"><span className="score-number">{score}</span><span className="score-total">/{questions.length}</span></div>
          <p className="percentage">{percent}%</p>
          <p className="result-message">{msg}</p>
          <div className="result-buttons">
            <button className="restart-btn" onClick={restartQuiz}>🔄 Restart Quiz</button>
            <button className="back-btn" onClick={handleBackToLevels}>← Back to Levels</button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // RENDER: Main quiz
  // --------------------------------------------------------------
  // ✅ FIXED TYPO: questions.length (was lenngth)
  if (questions.length === 0) return <div className="quick-practice">Generating questions...</div>;
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quick-practice">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${progress}%` }}></div></div>
          <div className="stats">
            <span>Q{currentIndex+1}/{questions.length}</span>
            <span>Score: {score}</span>
            <button className="back-btn-small" onClick={handleBackToLevels}>← Back to Levels</button>
          </div>
        </div>
        <div className="question-text">{currentQ.text}</div>
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let cls = 'option-btn';
            if (showFeedback) {
              if (idx === currentQ.correct) cls += ' correct';
              if (selectedAnswer === idx && idx !== currentQ.correct) cls += ' wrong';
            } else if (selectedAnswer === idx) cls += ' selected';
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={showFeedback}>
                {String.fromCharCode(65+idx)}. {opt}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div className="feedback">
            <div className="explanation">{selectedAnswer === currentQ.correct ? '✅ Correct! ' : '❌ Wrong! '}{currentQ.explanation}</div>
            <button className="next-btn" onClick={nextQuestion}>{currentIndex+1 === questions.length ? 'Finish' : 'Next →'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPractice;