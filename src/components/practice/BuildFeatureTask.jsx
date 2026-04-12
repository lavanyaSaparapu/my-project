import React, { useState, useEffect, useCallback } from 'react';
import './BuildFeatureTask.css';

const BuildFeatureTask = ({ initialSkill = '', initialLevel = '', onBack }) => {
  // --------------------------------------------------------------
  // Helper: Shuffle array
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
  // Generate 30 unique tasks for (skill, level)
  // --------------------------------------------------------------
  const generateTasks = (skill, level) => {
    // ----- Topics per skill (30 topics each) -----
    const topics = {
      React: [
        "data fetching with useEffect", "form validation", "search filter with debounce",
        "pagination component", "modal dialog", "drag and drop list", "infinite scroll",
        "theme switcher (dark/light)", "tab component", "accordion menu",
        "star rating", "progress bar", "tooltip", "toast notifications",
        "autocomplete input", "image carousel", "countdown timer", "stopwatch",
        "calculator", "todo list with localStorage", "expense tracker",
        "weather widget (mock API)", "user profile card", "comment section",
        "like button with animation", "stepper component", "tree view (nested list)",
        "sortable table", "filterable product grid", "shopping cart"
      ],
      JavaScript: [
        "debounced search input", "throttled scroll handler", "deep clone function",
        "memoization (cache results)", "event emitter (pub/sub)", "promise queue (rate limiting)",
        "array flatten (deep)", "unique array by property", "group by function",
        "chunk array", "shuffle array", "object pick/omit", "string truncate",
        "slugify", "capitalize words", "phone number formatter", "date range picker (vanilla)",
        "countdown timer (setInterval)", "stopwatch", "simple calculator (eval safe)",
        "todo list (localStorage)", "note taking app", "pagination helper",
        "filter function (where clause)", "sort by key", "find by path (lodash get)",
        "deep equality check", "camelCase to snake_case", "pluralize", "random color generator"
      ],
      TypeScript: [
        "typed form validator", "generic API client", "type‑safe event bus",
        "utility type: DeepReadonly", "mapped type: StringifyProps",
        "conditional type: ExtractArrayType", "type guard for user roles",
        "decorator: measure performance", "abstract class: Shape",
        "interface vs type exercise", "tuple validation", "enum for status codes",
        "generic repository pattern", "partial + required utility", "Pick and Omit composition",
        "readonly tuple", "branded type for UserId", "template literal type: CSS unit",
        "recursive type: NestedObject", "keyof + typeof", "type predicate: isFish",
        "module augmentation (extend Window)", "declare module for library",
        "generic factory function", "const assertion", "satisfies operator",
        "class with access modifiers", "abstract factory pattern", "mapped type modifiers",
        "infer keyword exercise"
      ],
      "Node.js": [
        "file system: read/write JSON", "HTTP server with routes", "middleware logger",
        "environment config loader", "CLI tool with commander", "send email (nodemailer mock)",
        "rate limiter (token bucket)", "simple cache (LRU)", "JWT generator/verifier",
        "bcrypt password hashing", "stream: copy file", "child process: exec",
        "cluster: fork workers", "Express error handler", "static file server",
        "REST API for todos", "WebSocket chat (ws)", "multer file upload",
        "cron job (node‑schedule)", "process manager (fork)", "cluster with sticky sessions",
        "debugging with inspector", "performance monitoring (clinic)", "npm package creator",
        "config validation with Joi", "logging with winston", "graceful shutdown",
        "database connection pool", "migration runner", "seeder script"
      ],
      API: [
        "REST endpoint: GET /users", "POST /login with validation", "pagination middleware",
        "rate limiting middleware", "JWT auth middleware", "cors configuration",
        "request logger", "error handler (custom)", "API versioning header",
        "query parameter filter", "sorting middleware", "field selector",
        "etag cache", "compression middleware", "timeout middleware",
        "circuit breaker", "retry with backoff", "idempotent POST key",
        "webhook receiver", "GraphQL resolver for user", "GraphQL error formatting",
        "OpenAPI spec generator", "mock server with faker", "API client (axios wrapper)",
        "request retry with exponential backoff", "concurrent request limiter",
        "response caching (Redis mock)", "API health check endpoint", "prometheus metrics",
        "S3 signed URL generator"
      ],
      DB: [
        "SQL query builder", "transaction example", "connection pool",
        "migration up/down", "seeder for users", "index creation",
        "stored procedure call", "trigger (audit log)", "view creation",
        "join (INNER/LEFT) query", "subquery vs CTE", "group by with having",
        "window function (row_number)", "upsert (merge)", "full‑text search",
        "JSON field query (PostgreSQL)", "geospatial query", "backup script",
        "restore from dump", "query logger", "slow query monitor",
        "connection retry logic", "read replica routing", "shard key selection",
        "normalize schema (3NF)", "denormalize for performance", "index optimization",
        "explain plan analyzer", "connection string parser", "database URL generator"
      ],
      Testing: [
        "unit test for sum function", "mock axios request", "snapshot test for component",
        "test React hook with renderHook", "test async function (promise)",
        "test error handling", "test with beforeEach/afterEach", "parameterized test",
        "test coverage threshold", "test file watcher", "test CI pipeline (GitHub Actions)",
        "test performance (benchmark)", "test race condition (Promise.race)",
        "test infinite loop (timeout)", "test localStorage mock", "test event listener",
        "test debounced function (fake timers)", "test throttled function",
        "test custom hook with act", "test context provider", "test router navigation",
        "test API client with interceptors", "test component with userEvent",
        "test accessibility (axe)", "test visual regression (pixelmatch)",
        "test WebSocket (mock)", "test service worker", "test error boundary",
        "test suspense fallback", "test concurrent mode"
      ],
      Performance: [
        "lazy load images (IntersectionObserver)", "virtual scroll list (10k items)",
        "debounced search (300ms)", "throttled scroll handler", "memoized selector (Reselect)",
        "code splitting (React.lazy)", "prefetch on hover", "preload critical CSS",
        "bundle analyzer configuration", "image optimization (WebP fallback)",
        "font loading (font‑display swap)", "cache API responses (SWR)",
        "service worker for offline", "web worker for heavy computation",
        "long task splitting (requestIdleCallback)", "reflow/repaint avoidance",
        "DOM recycling (pool)", "CSS containment (contain)", "resource hints (preconnect)",
        "priority hints (fetchpriority)", "time to interactive (TTI) optimization",
        "first paint improvement (critical CSS)", "CLS fix (image dimensions)",
        "LCP optimization (preload hero)", "FID improvement (event listeners)",
        "bundle size budget", "tree shaking verification", "duplicate dependency detection",
        "performance budget (Lighthouse)", "real user monitoring (RUM) mock"
      ],
      Git: [
        "fix merge conflict (simulated)", "interactive rebase to squash commits",
        "cherry‑pick a commit from another branch", "recover lost commit with reflog",
        "bisect to find buggy commit", "stash untracked files", "reset mixed vs hard",
        "revert a merge commit", "submodule update", "git hooks (pre‑commit lint)",
        "gitignore generator", "git alias for custom command", "git log pretty format",
        "git diff caching", "git blame for annotation", "git worktree add",
        "git archive for release", "git notes for metadata", "git sparse checkout",
        "git filter‑branch (rewrite history)", "git bundle for offline transfer",
        "git rerere (reuse recorded resolution)", "git rerere (enable)", "git fsck for corruption",
        "git gc optimization", "git maintenance", "git lfs for large files",
        "git submodule update –remote", "git subtree split", "git worktree prune"
      ],
      Security: [
        "sanitize user input (XSS prevention)", "parameterized query (SQL injection)",
        "CSRF token implementation", "JWT with refresh token", "bcrypt password hashing",
        "rate limiter (express‑rate‑limit)", "helmet.js configuration", "CORS allowlist",
        "content security policy (CSP) header", "HSTS header", "cookie flags (HttpOnly, Secure)",
        "input validation (allowlist)", "output encoding (escape HTML)", "secure file upload (mime type)",
        "environment variable validation", "dependency audit (npm audit)", "SAST scanner integration",
        "security headers (X‑Frame‑Options)", "SQLAlchemy parameterized", "MongoDB injection prevention",
        "GraphQL depth limiter", "GraphQL cost analysis", "SSRF protection (axios validateURL)",
        "path traversal prevention (path.resolve)", "command injection prevention (child_process spawn)",
        "XXE prevention (XML parser)", "open redirect validation", "subresource integrity (SRI)",
        "security.txt generator", "vulnerability disclosure template"
      ],
      Python: [
        "list comprehension with condition", "generator for infinite sequence", "decorator for timing",
        "context manager for file open", "lambda with map/filter", "functools.lru_cache memoization",
        "itertools.cycle for carousel", "dunder method: __str__", "class inheritance (animal)",
        "metaclass singleton", "property decorator validation", "staticmethod vs classmethod",
        "abstract base class (ABC)", "exception hierarchy", "asyncio gather", "thread pool executor",
        "multiprocessing pool", "GIL demonstration", "type hints with mypy", "dataclass for DTO",
        "Enum for constants", "defaultdict counter", "pickle serialization", "logging configuration",
        "venv setup", "pip freeze requirements", "pytest fixture", "pytest parameterize",
        "profiling with cProfile", "fastapi endpoint"
      ]
    };

    // Fallback topics for any skill not in the list
    const fallbackTopics = [
      "data validation", "error handling", "user authentication", "file upload",
      "search functionality", "sorting algorithm", "pagination", "caching strategy",
      "logging system", "configuration management", "dependency injection",
      "state management", "event handling", "API integration", "form submission",
      "real‑time updates", "background jobs", "scheduled tasks", "notification system",
      "export to CSV/JSON", "import from file", "dark mode toggle", "responsive layout",
      "accessibility (a11y)", "performance optimization", "security hardening",
      "testing strategy", "documentation generator", "CLI interface", "analytics tracker"
    ];

    const skillTopics = topics[skill] || fallbackTopics;
    const fullTopics = skillTopics.length >= 30 ? skillTopics : [...skillTopics, ...fallbackTopics].slice(0, 30);

    // ----- Scenario templates for task descriptions (different per level) -----
    const scenarioTemplates = {
      easy: [
        "You are building a small {topic} feature for a portfolio project. The stakeholder wants a clean, working demo.",
        "As part of a frontend challenge, you need to implement {topic}. The design is simple but functional.",
        "Your team needs a {topic} component for a new app. Write the code with basic error handling.",
        "A junior developer asks for a reference implementation of {topic}. Provide a straightforward solution.",
        "The product manager requested a {topic} feature for the MVP. Focus on core functionality only."
      ],
      medium: [
        "You are working on a production app that requires a robust {topic} implementation. It must handle edge cases and be maintainable.",
        "The team lead assigned you to refactor the {topic} module. Improve performance and readability while keeping the API compatible.",
        "A bug report indicates that {topic} fails under certain conditions. Write a reliable fix and add tests.",
        "You need to integrate {topic} into an existing codebase. Ensure it follows the project’s coding standards and patterns.",
        "The client wants a {topic} feature that is configurable and reusable across multiple pages. Design it with reusability in mind."
      ],
      hard: [
        "You are responsible for designing a scalable {topic} solution that will be used by millions of users. Consider performance, concurrency, and observability.",
        "The legacy {topic} module is causing production incidents. Rewrite it to be fault‑tolerant, self‑healing, and well‑tested.",
        "Your team is adopting a microservices architecture. Implement {topic} as a service with clear contracts and monitoring.",
        "The company needs a {topic} feature that complies with strict security and compliance requirements. Build it with security in mind.",
        "You are the tech lead for a critical {topic} system. The current implementation has technical debt. Propose and implement a modern, robust solution."
      ]
    };

    const levelScenarios = scenarioTemplates[level] || scenarioTemplates.medium;
    const difficultyHint = level === "easy" ? "basic" : (level === "medium" ? "intermediate" : "advanced");

    // Generate 30 tasks
    const tasks = [];
    for (let i = 0; i < 30; i++) {
      const topic = fullTopics[i % fullTopics.length];
      const scenarioTemplate = levelScenarios[i % levelScenarios.length];
      const description = scenarioTemplate.replace("{topic}", topic);

      // Build title
      const title = `Build a ${topic} feature (${difficultyHint})`;

      // Requirements (3–5 points, vary based on level and topic)
      let requirements;
      if (level === "easy") {
        requirements = [
          `Implement a function/component that handles ${topic} with clear inputs/outputs.`,
          `Include basic error handling (e.g., try/catch or validation).`,
          `Write clean, readable code with comments explaining key steps.`,
          `Add a simple demo/usage example in the code comments.`
        ];
      } else if (level === "medium") {
        requirements = [
          `Implement ${topic} with edge case handling (empty input, null, large data).`,
          `Write at least one unit test for the main functionality (mock if needed).`,
          `Ensure the code is reusable and follows the DRY principle.`,
          `Add JSDoc/TSDoc comments for the public API.`,
          `Handle async operations correctly (if applicable).`
        ];
      } else {
        requirements = [
          `Implement ${topic} with a focus on performance and scalability.`,
          `Include comprehensive error handling and logging.`,
          `Write a small set of unit/integration tests covering edge cases.`,
          `Provide a configuration object to customize behavior.`,
          `Document the API and include a usage example.`,
          `Ensure thread‑safety / concurrency handling (if applicable).`
        ];
      }
      // Trim to 3–5 requirements
      requirements = requirements.slice(0, 3 + (i % 3));

      // Edge cases (2–3 points)
      const edgeCases = [
        `What happens when the input is null/undefined?`,
        `How does it behave with empty arrays/strings?`,
        `Large data sets (performance degradation)?`,
        `Concurrent requests (race conditions)?`,
        `Invalid user input (malformed data)?`,
        `Network failures (if async)?`,
        `Timeouts (if applicable)?`
      ];
      const selectedEdges = edgeCases.slice(0, 2 + (i % 2));

      // Bonus improvements (2 points)
      const bonus = [
        `Add debouncing/throttling (if relevant).`,
        `Implement a caching mechanism.`,
        `Add keyboard accessibility.`,
        `Support custom themes / dark mode.`,
        `Add animations/transitions.`,
        `Provide a CLI interface (if backend).`,
        `Write a small README.`,
        `Add performance benchmarks.`
      ];
      const selectedBonus = bonus.slice(0, 2);

      // Starter code (function/component skeleton)
      let starterCode;
      if (skill === "React") {
        starterCode = `import React, { useState } from 'react';\n\nfunction ${topic.replace(/\s/g, '')}Feature() {\n  // TODO: implement ${topic}\n  \n  return (\n    <div>\n      <h3>${topic}</h3>\n      {/* your UI here */}\n    </div>\n  );\n}\n\nexport default ${topic.replace(/\s/g, '')}Feature;`;
      } else if (skill === "JavaScript" || skill === "TypeScript") {
        starterCode = `// TODO: implement ${topic}\nfunction ${topic.replace(/\s/g, '')}(input) {\n  // your code here\n  \n}\n\nmodule.exports = ${topic.replace(/\s/g, '')};`;
      } else {
        starterCode = `// TODO: implement ${topic}\n// Write your code below\n\n`;
      }

      tasks.push({
        title,
        description,
        requirements,
        edgeCases: selectedEdges,
        bonus: selectedBonus,
        starterCode,
        // For validation we can check for keywords (simplified)
        checks: ["function", "return", "if"] // generic; in a real system you'd customize
      });
    }
    return tasks;
  };

  // --------------------------------------------------------------
  // Component state
  // --------------------------------------------------------------
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [showPicker, setShowPicker] = useState(!initialSkill || !initialLevel);
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [previewMessage, setPreviewMessage] = useState('');

  const currentTask = tasks[currentIndex];

  const startBuild = () => {
    if (!selectedSkill || !selectedLevel) return;
    const taskSet = generateTasks(selectedSkill, selectedLevel);
    setTasks(taskSet);
    setShowPicker(false);
    setCurrentIndex(0);
    setCode(taskSet[0].starterCode);
    setValidationResults([]);
    setShowNext(false);
    setPreviewMessage('');
  };

  const validateImplementation = () => {
    const checks = currentTask.checks || ['function', 'return'];
    const results = checks.map(check => ({
      check,
      passed: code.includes(check)
    }));
    setValidationResults(results);
    const allPassed = results.every(r => r.passed);
    setShowNext(allPassed);
    setPreviewMessage(allPassed ? '✅ All requirements met! Ready for next task.' : '❌ Missing some features. Check the requirements.');
  };

  const nextTask = () => {
    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex(prev => prev + 1);
      setCode(tasks[currentIndex + 1].starterCode);
      setValidationResults([]);
      setShowNext(false);
      setPreviewMessage('');
      setCompletedCount(prev => prev + 1);
    } else {
      alert(`🎉 Congratulations! You completed ${completedCount + 1} tasks for ${selectedSkill} (${selectedLevel})!`);
      // Optionally restart or go back
    }
  };

  const restart = () => {
    setShowPicker(true);
    setSelectedSkill('');
    setSelectedLevel('');
    setTasks([]);
    setCurrentIndex(0);
    setCompletedCount(0);
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
      { id: 'easy', name: 'Easy', icon: '🌱' },
      { id: 'medium', name: 'Medium', icon: '⚡' },
      { id: 'hard', name: 'Hard', icon: '🔥' }
    ];
    return (
      <div className="build-feature">
        <div className="build-card picker-card">
          <h2>🏗️ Build a Feature</h2>
          <p>Select a skill and difficulty – you'll implement a real‑world feature.</p>
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
                  {l.icon} {l.name}
                </button>
              ))}
            </div>
          </div>
          <button className="start-btn" onClick={startBuild} disabled={!selectedSkill || !selectedLevel}>Start Building</button>
          {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // Render: Result (if all tasks completed)
  // --------------------------------------------------------------
  if (currentIndex >= tasks.length && tasks.length > 0) {
    const percent = Math.round((completedCount / tasks.length) * 100);
    return (
      <div className="build-feature">
        <div className="build-card result-card">
          <h2>🎉 All Tasks Completed!</h2>
          <p>You finished {completedCount} tasks for {selectedSkill} ({selectedLevel}).</p>
          <div className="score-circle">{percent}%</div>
          <button className="restart-btn" onClick={restart}>🔄 Start Over</button>
          <button className="back-btn" onClick={() => { restart(); onBack && onBack(); }}>← Back</button>
        </div>
      </div>
    );
  }

  if (!currentTask) return <div className="build-feature">Loading tasks...</div>;

  // --------------------------------------------------------------
  // Render: Main task interface
  // --------------------------------------------------------------
  return (
    <div className="build-feature">
      <div className="build-layout">
        {/* Left: Task description */}
        <div className="task-card">
          <div className="task-header">
            <h2>{currentTask.title}</h2>
            <span className="difficulty-badge">{selectedLevel}</span>
          </div>
          <p className="task-description">{currentTask.description}</p>
          <div className="requirements">
            <h4>📋 Requirements</h4>
            <ul>
              {currentTask.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
            </ul>
          </div>
          <div className="edge-cases">
            <h4>⚠️ Edge Cases</h4>
            <ul>
              {currentTask.edgeCases.map((ec, idx) => <li key={idx}>{ec}</li>)}
            </ul>
          </div>
          <div className="bonus">
            <h4>🌟 Bonus (optional)</h4>
            <ul>
              {currentTask.bonus.map((b, idx) => <li key={idx}>{b}</li>)}
            </ul>
          </div>
        </div>

        {/* Right: Editor + Validation */}
        <div className="right-panel">
          <div className="editor-section">
            <div className="editor-header">
              <span>✏️ Code Editor</span>
              <button className="check-btn" onClick={validateImplementation}>🔍 Check Implementation</button>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              rows={16}
            />
          </div>

          <div className="validation-section">
            <h4>✅ Validation Checks</h4>
            {validationResults.length === 0 && <p className="placeholder">Click "Check Implementation" to validate</p>}
            {validationResults.map((res, idx) => (
              <div key={idx} className={`check-item ${res.passed ? 'passed' : 'failed'}`}>
                <span className="check-icon">{res.passed ? '✓' : '✗'}</span>
                <span>Contains "{res.check}"</span>
              </div>
            ))}
            {previewMessage && (
              <div className={`preview-message ${previewMessage.includes('✅') ? 'success' : 'error'}`}>
                {previewMessage}
              </div>
            )}
            {showNext && (
              <button className="next-btn" onClick={nextTask}>⏩ Next Task</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildFeatureTask;