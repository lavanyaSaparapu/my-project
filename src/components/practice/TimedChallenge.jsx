import React, { useState, useEffect, useCallback } from 'react';
import './TimedChallenge.css';

const TimedChallenge = ({ initialSkill = '', initialLevel = '', onBack }) => {
  // --------------------------------------------------------------
  // Helper: Shuffle array (for options order)
  // --------------------------------------------------------------
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // --------------------------------------------------------------
  // Generate 30 unique scenario‑based questions for (skill, level)
  // --------------------------------------------------------------
  const generateQuestionSet = (skill, level) => {
    // ----- 30 different topics per skill (to ensure variety) -----
    const topics = {
      React: [
        "component re-renders", "state management", "props drilling", "useEffect dependencies",
        "event handlers", "forms and inputs", "list keys", "context API", "memoization",
        "conditional rendering", "lazy loading", "error boundaries", "portals", "refs",
        "custom hooks", "controlled vs uncontrolled", "higher‑order components", "render props",
        "code splitting", "server components", "concurrent rendering", "Suspense",
        "useTransition", "useDeferredValue", "strict mode", "React Router navigation",
        "global state with Redux", "React Query caching", "SSR with Next.js", "performance profiling"
      ],
      JavaScript: [
        "closures", "event loop", "promises", "async/await", "hoisting", "prototypal inheritance",
        "this binding", "array methods (map/reduce/filter)", "destructuring", "spread/rest operators",
        "generators", "iterators", "symbols", "weakmaps/weakmaps", "proxy/reflect", "class fields",
        "private methods", "dynamic imports", "top‑level await", "error handling", "debouncing",
        "throttling", "currying", "memoization", "event delegation", "Web Workers", "service workers",
        "localStorage/sessionStorage", "fetch API", "WebSockets"
      ],
      TypeScript: [
        "interfaces vs types", "generics constraints", "union/intersection types", "type guards",
        "utility types (Partial, Pick, Omit)", "mapped types", "conditional types", "infer keyword",
        "decorators", "declaration merging", "ambient modules", "type assertions", "non‑null assertion",
        "optional chaining", "nullish coalescing", "readonly properties", "tuple types", "enum vs union",
        "namespace vs modules", "abstract classes", "access modifiers", "type inference", "typeof/instanceof",
        "keyof operator", "index signatures", "mapped type modifiers", "template literal types",
        "recursive types", "branded types", "type predicates"
      ],
      "Node.js": [
        "event loop phases", "streams (readable/writable)", "buffers", "child processes", "cluster module",
        "file system operations", "path module", "os module", "HTTP server", "Express middleware",
        "error handling in async code", "debugging with inspector", "performance monitoring (clinic)",
        "npm scripts", "package.json configuration", "ES modules vs CommonJS", "worker threads",
        "process object", "environment variables", "crypto module (hashing)", "zlib compression",
        "readline interface", "event emitters", "domain module (deprecated)", "memory leaks detection",
        "security best practices (helmet)", "logging with winston/pino", "testing with jest/mocha",
        "REST API design", "GraphQL with Apollo"
      ],
      API: [
        "RESTful design", "HTTP methods (GET/POST/PUT/DELETE)", "status codes", "headers (auth, content-type)",
        "query parameters vs body", "pagination (offset, cursor)", "filtering/sorting", "versioning strategies",
        "OpenAPI/Swagger", "GraphQL queries/mutations", "WebSockets", "gRPC", "API gateways", "idempotency",
        "rate limiting algorithms", "caching (ETag, Cache-Control)", "error response format", "HATEOAS",
        "CORS configuration", "CSRF protection", "JWT authentication", "OAuth2 flow", "API key management",
        "webhooks vs polling", "API documentation tools", "mock servers", "contract testing", "deprecation",
        "API security (OWASP)", "event‑driven APIs (Kafka)"
      ],
      DB: [
        "SQL queries (SELECT/INSERT/UPDATE/DELETE)", "indexes (B-tree, hash)", "transactions (ACID)",
        "normalization (1NF,2NF,3NF)", "denormalization trade‑offs", "JOIN types (INNER/LEFT/RIGHT)",
        "subqueries vs CTEs", "stored procedures", "triggers", "views", "isolation levels", "deadlocks",
        "connection pooling", "sharding strategies", "replication (master‑slave)", "backup/restore",
        "migrations (Flyway, Liquibase)", "NoSQL (MongoDB document model)", "key‑value stores (Redis)",
        "graph databases (Neo4j)", "time‑series (InfluxDB)", "CAP theorem", "eventual consistency",
        "query optimization (EXPLAIN)", "database monitoring (Prometheus)", "data warehousing (OLAP)",
        "OLTP vs OLAP", "ACID vs BASE", "caching (Redis, Memcached)", "database security (encryption)"
      ],
      Testing: [
        "unit tests", "integration tests", "end‑to‑end tests", "snapshot testing", "test‑driven development (TDD)",
        "behavior‑driven development (BDD)", "mocking (jest.mock)", "stubs vs spies", "fixtures",
        "test runners (Jest, Mocha)", "assertion libraries (Chai)", "code coverage (Istanbul)",
        "test pyramid", "property‑based testing (fast-check)", "contract testing (Pact)",
        "visual regression (Percy)", "load testing (k6)", "performance testing (Artillery)",
        "security testing (ZAP)", "test doubles (dummy, fake)", "test isolation", "test parallelization",
        "continuous testing (CI/CD)", "test fixtures (factory bot)", "parameterized tests",
        "test hooks (beforeEach)", "test suites", "test reporting (Allure)", "flaky tests management",
        "mutation testing (Stryker)"
      ],
      Performance: [
        "lazy loading (React.lazy)", "code splitting (webpack)", "tree shaking", "bundle analysis (webpack‑bundle‑analyzer)",
        "critical rendering path", "image optimization (WebP, lazy loading)", "font loading (font‑display)",
        "caching headers (Cache‑Control)", "CDN (CloudFront, Cloudflare)", "preconnect", "prefetch", "preload",
        "resource hints", "minification (Terser)", "compression (gzip, Brotli)", "HTTP/2 multiplexing",
        "server push", "service workers (offline)", "web vitals (LCP, FID, CLS)", "TTI (Time to Interactive)",
        "first paint (FP)", "first contentful paint (FCP)", "long tasks", "memory leaks (Chrome DevTools)",
        "DOM size", "reflow/repaint", "debouncing input", "throttling scroll", "virtual scrolling (react‑window)",
        "requestIdleCallback", "web workers (offload heavy tasks)"
      ],
      Git: [
        "commit (atomic commits)", "branch (feature branches)", "merge (fast‑forward vs 3‑way)", "rebase (interactive)",
        "cherry‑pick", "stash (pop/apply)", "reset (soft/mixed/hard)", "revert", "fetch vs pull", "push (force‑with‑lease)",
        "remote management", "clone", "init", "status", "log (pretty format)", "diff (cached)", "blame", "bisect (binary search)",
        "reflog (recover lost commits)", "submodules", "tag (lightweight vs annotated)", "worktree", "hooks (pre‑commit)",
        "gitignore", "git config (local/global)", "git flow (branching model)", "pull requests (code review)",
        "merge conflicts (resolve)", "fast‑forward only", "squash merging"
      ],
      Security: [
        "XSS (reflected, stored, DOM‑based)", "CSRF (cross‑site request forgery)", "SQL injection (parameterized queries)",
        "command injection", "path traversal", "XXE (XML external entity)", "SSRF (server‑side request forgery)",
        "IDOR (insecure direct object references)", "security misconfiguration", "sensitive data exposure",
        "broken authentication", "session fixation", "CORS misconfiguration", "CSP (content security policy)",
        "HSTS (HTTP Strict Transport Security)", "HTTPS/TLS (certificates)", "JWT security (signing, expiration)",
        "OAuth 2.0 (authorization code flow)", "OpenID Connect", "password hashing (bcrypt, scrypt)",
        "salting", "rate limiting (prevent brute force)", "input validation (allowlist)", "output encoding",
        "dependency scanning (npm audit)", "SAST/DAST tools", "security headers (X‑Frame‑Options)",
        "audit logs", "incident response plan", "zero‑trust architecture"
      ],
      Python: [
        "list comprehensions", "generators (yield)", "decorators (functools.wraps)", "context managers (with statement)",
        "lambda functions", "map/filter/reduce", "functools (partial, lru_cache)", "itertools (cycle, permutations)",
        "dunder methods (__init__, __call__)", "class inheritance (MRO)", "metaclasses (type)", "descriptors (property)",
        "@property decorator", "@staticmethod vs @classmethod", "abstract base classes (abc)", "exception handling (try/except/finally)",
        "asyncio (event loop)", "threading vs multiprocessing", "GIL (Global Interpreter Lock)", "type hints (mypy)",
        "dataclasses", "enums (Enum)", "collections (defaultdict, Counter)", "pickle serialization", "logging (logger hierarchy)",
        "virtual environments (venv, poetry)", "pip packaging (setup.py)", "unit tests (pytest fixtures)", "type checking (pydantic)",
        "profiling (cProfile)"
      ]
    };

    // Fallback topics for skills not listed
    const fallbackTopics = [
      "best practices", "common pitfalls", "performance optimization", "security hardening",
      "debugging techniques", "testing strategies", "deployment automation", "monitoring",
      "code organization", "error handling", "logging", "configuration management",
      "dependency management", "documentation", "refactoring", "design patterns",
      "architecture decision", "scalability", "maintainability", "CI/CD integration",
      "version control workflow", "code review", "technical debt", "agile methodology",
      "team collaboration", "user feedback", "analytics", "A/B testing", "internationalization",
      "accessibility"
    ];
    const skillTopics = topics[skill] || fallbackTopics;
    // Ensure we have at least 30 topics (repeat if necessary)
    const fullTopics = skillTopics.length >= 30 ? skillTopics : [...skillTopics, ...fallbackTopics].slice(0, 30);

    // ----- Scenario templates (different for each level) -----
    const scenarios = {
      easy: [
        "You are a junior developer working on {topic}. Your senior asks you to implement a solution that is {difficulty_prefix} and maintainable.",
        "During a code review, you notice that {topic} is being handled incorrectly. What is the simplest correct approach?",
        "A bug report comes in: the {topic} logic fails in edge cases. Choose the most reliable fix.",
        "You are building a prototype and need to add {topic} support. Which method is the safest and easiest to understand?",
        "Your team lead wants to improve {topic} in the codebase. What is the first step you would recommend?"
      ],
      medium: [
        "Your application has a performance issue caused by inefficient {topic}. The team has agreed to refactor. What is the best strategy?",
        "You are debugging a subtle bug related to {topic}. After hours of investigation, you find two possible fixes. Which one is more robust?",
        "A new requirement demands that {topic} works across multiple browsers/environments. What approach would you take to ensure compatibility?",
        "You are mentoring a colleague who struggles with {topic}. Which explanation or solution would you give them to avoid future mistakes?",
        "The team is deciding between two libraries for handling {topic}. What key factor should drive the decision?"
      ],
      hard: [
        "Your system experiences intermittent failures under high load due to {topic}. You need a production‑ready solution that scales. What do you implement?",
        "You inherit a legacy codebase with many antipatterns around {topic}. The business cannot afford a full rewrite. What is your incremental improvement plan?",
        "A security audit reveals a vulnerability related to {topic}. You must fix it without breaking existing functionality. What is the safest fix?",
        "You are designing a new microservice that will handle {topic} for millions of users. What architectural decision do you make upfront?",
        "Your team is debating two conflicting best practices for {topic}. As the tech lead, how do you resolve the trade‑off and why?"
      ]
    };
    const levelScenarios = scenarios[level] || scenarios.medium;
    const difficultyPrefix = level === "easy" ? "simple" : (level === "medium" ? "efficient" : "scalable");

    // Generate 30 questions
    const questions = [];
    for (let i = 0; i < 30; i++) {
      const topic = fullTopics[i % fullTopics.length];
      const scenarioTemplate = levelScenarios[i % levelScenarios.length];
      const question = scenarioTemplate
        .replace("{topic}", topic)
        .replace("{difficulty_prefix}", difficultyPrefix);

      // Build options based on level
      let correct, optionsList;
      if (level === "easy") {
        correct = `Use the standard, well‑documented ${topic} approach that the framework provides.`;
        optionsList = [
          correct,
          `Write a custom, complex solution from scratch.`,
          `Ignore ${topic} and hope it works in production.`,
          `Copy a random Stack Overflow snippet without understanding.`
        ];
      } else if (level === "medium") {
        correct = `Implement ${topic} using a proven design pattern and add comprehensive tests.`;
        optionsList = [
          correct,
          `Quickly hack a solution that works for the happy path only.`,
          `Use a deprecated library just because it's familiar.`,
          `Over‑engineer ${topic} with unnecessary abstractions.`
        ];
      } else {
        correct = `Design a fault‑tolerant, observable, and auto‑scalable ${topic} solution with proper monitoring.`;
        optionsList = [
          correct,
          `Hardcode the logic and manually restart services on failure.`,
          `Ignore ${topic} constraints until the system crashes.`,
          `Use a brittle solution that passed code review but is not production‑ready.`
        ];
      }

      // Shuffle options
      const shuffledOptions = shuffleArray([...optionsList]);
      const correctIndex = shuffledOptions.indexOf(correct);
      const explanation = `The correct answer focuses on reliability, maintainability, and industry best practices. ${topic} requires careful handling; the other options introduce technical debt or risk.`;

      questions.push({
        question,
        options: shuffledOptions,
        correctIndex,
        explanation
      });
    }
    return questions;
  };

  // --------------------------------------------------------------
  // Component state
  // --------------------------------------------------------------
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [showPicker, setShowPicker] = useState(!initialSkill || !initialLevel);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [nextTimeout, setNextTimeout] = useState(null);

  const startQuiz = () => {
    if (!selectedSkill || !selectedLevel) return;
    const questionSet = generateQuestionSet(selectedSkill, selectedLevel);
    setQuestions(questionSet);
    setShowPicker(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
    setTimerActive(true);
    setTimeLeft(selectedLevel === 'hard' ? 30 : (selectedLevel === 'medium' ? 45 : 60));
    if (nextTimeout) clearTimeout(nextTimeout);
  };

  const handleAnswer = (idx) => {
    if (showFeedback || !timerActive || !questions.length) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setTimerActive(false);
    if (idx === questions[currentIndex].correctIndex) setScore(prev => prev + 1);
    const timeout = setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimerActive(true);
        setTimeLeft(selectedLevel === 'hard' ? 30 : (selectedLevel === 'medium' ? 45 : 60));
      } else {
        setQuizFinished(true);
        setTimerActive(false);
      }
    }, 1500);
    setNextTimeout(timeout);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0 && !showFeedback) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive && !showFeedback && questions.length) {
      // Time's up – auto fail
      setShowFeedback(true);
      setTimerActive(false);
      setSelectedAnswer(null);
      const timeout = setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setTimerActive(true);
          setTimeLeft(selectedLevel === 'hard' ? 30 : (selectedLevel === 'medium' ? 45 : 60));
        } else {
          setQuizFinished(true);
          setTimerActive(false);
        }
      }, 1500);
      setNextTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showFeedback, currentIndex, questions.length, selectedLevel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (nextTimeout) clearTimeout(nextTimeout);
    };
  }, [nextTimeout]);

  const restartQuiz = () => {
    if (nextTimeout) clearTimeout(nextTimeout);
    setShowPicker(true);
    setSelectedSkill('');
    setSelectedLevel('');
    setQuestions([]);
    setQuizFinished(false);
    setScore(0);
    setCurrentIndex(0);
  };

  // --------------------------------------------------------------
  // Render: Skill & level picker
  // --------------------------------------------------------------
  if (showPicker) {
    const skills = [
      "React", "JavaScript", "TypeScript", "Node.js", "API",
      "DB", "Testing", "Performance", "Git", "Security", "Python"
    ];
    const levels = [
      { id: 'easy', name: 'Easy', icon: '🌱', time: '60s' },
      { id: 'medium', name: 'Medium', icon: '⚡', time: '45s' },
      { id: 'hard', name: 'Hard', icon: '🔥', time: '30s' }
    ];
    return (
      <div className="timed-challenge">
        <div className="timed-card picker-card">
          <h2>⏱️ Timed Challenge</h2>
          <p>Select a skill and difficulty – you have limited time per question!</p>
          <div className="skill-selector">
            <label>Skill:</label>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">-- Select --</option>
              {skills.map(s => <option key={s} value={s}>{s}</option>)}
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
                  {l.icon} {l.name} ({l.time})
                </button>
              ))}
            </div>
          </div>
          <button className="start-btn" onClick={startQuiz} disabled={!selectedSkill || !selectedLevel}>Start Challenge</button>
          {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // Render: Result screen
  // --------------------------------------------------------------
  if (quizFinished) {
    const percent = Math.round((score / questions.length) * 100);
    const message = percent >= 80 ? 'Excellent! 🏆' : (percent >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪');
    return (
      <div className="timed-challenge">
        <div className="timed-card result-card">
          <h2>Challenge Completed</h2>
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{questions.length}</span>
          </div>
          <p className="percentage">{percent}%</p>
          <p className="result-message">{message}</p>
          <div className="result-buttons">
            <button className="restart-btn" onClick={restartQuiz}>🔄 Try Again</button>
            <button className="back-btn" onClick={() => { restartQuiz(); onBack && onBack(); }}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // Render: Active question
  // --------------------------------------------------------------
  if (!questions.length) return <div className="timed-challenge">Loading...</div>;
  const currentQ = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="timed-challenge">
      <div className="timed-card">
        <div className="quiz-header">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="stats">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span>Score: {score}</span>
            <div className={`timer ${timeLeft < 10 ? 'urgent' : ''}`}>⏱️ {timeLeft}s</div>
          </div>
        </div>

        <div className="question-text">{currentQ.question}</div>

        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let className = 'option-btn';
            if (showFeedback) {
              if (idx === currentQ.correctIndex) className += ' correct';
              if (selectedAnswer === idx && idx !== currentQ.correctIndex) className += ' wrong';
            } else if (selectedAnswer === idx) {
              className += ' selected';
            }
            return (
              <button key={idx} className={className} onClick={() => handleAnswer(idx)} disabled={showFeedback || !timerActive}>
                {String.fromCharCode(65+idx)}. {opt}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="feedback">
            <div className="explanation">
              {selectedAnswer === currentQ.correctIndex ? '✅ Correct! ' : '❌ Wrong! '}
              {currentQ.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimedChallenge;