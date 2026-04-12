import React, { useState, useEffect, useMemo } from 'react';
import './DebuggingMode.css';

const DebuggingMode = ({ level = 'easy', onBack, role = 'developer' }) => {
  // ------------------------------------------------------------
  // Generate 30 bugs per difficulty (easy, medium, hard)
  // ------------------------------------------------------------
  const generateBugs = () => {
    const bugs = [];
    const createBug = (id, difficulty, title, description, buggyCode, correctCode, hints, tests) => ({
      id, difficulty, title, description, buggyCode, correctCode, hints, tests
    });

    // ----- Easy bugs (30) – compact templates cycled -----
    const easyTemplates = [
      { title: 'Missing return', desc: 'Return sum of array.', buggy: `function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) total += arr[i];\n  // missing return\n}`, correct: `function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) total += arr[i];\n  return total;\n}`, hints: ['Add return total;'], tests: [{ input: [[1,2,3]], expected: 6 }] },
      { title: 'Wrong variable name', desc: 'Return doubled value.', buggy: `function double(n) { let d = n*2; return doubl; }`, correct: `function double(n) { let d = n*2; return d; }`, hints: ['Fix variable name'], tests: [{ input: [5], expected: 10 }] },
      { title: 'Incorrect array method', desc: 'Return last element.', buggy: `function last(arr) { return arr[0]; }`, correct: `function last(arr) { return arr[arr.length-1]; }`, hints: ['Use arr.length-1'], tests: [{ input: [[1,2,3]], expected: 3 }] },
      { title: 'Wrong comparison', desc: 'Check if even.', buggy: `function isEven(n) { if (n % 2 = 0) return true; else return false; }`, correct: `function isEven(n) { if (n % 2 === 0) return true; else return false; }`, hints: ['Use ==='], tests: [{ input: [4], expected: true }, { input: [5], expected: false }] },
      { title: 'Missing array length', desc: 'Sum array with dynamic length.', buggy: `function sum(arr) { let s=0; for(let i=0;i<5;i++) s+=arr[i]; return s; }`, correct: `function sum(arr) { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; }`, hints: ['Use arr.length'], tests: [{ input: [[1,2,3]], expected: 6 }] },
      { title: 'Off-by-one loop', desc: 'Sum 1..n', buggy: `function sumToN(n) { let s=0; for(let i=0;i<n;i++) s+=i; return s; }`, correct: `function sumToN(n) { let s=0; for(let i=1;i<=n;i++) s+=i; return s; }`, hints: ['Start i from 1', 'Use i<=n'], tests: [{ input: [5], expected: 15 }] }
    ];
    for (let i = 1; i <= 30; i++) {
      const base = easyTemplates[(i-1) % easyTemplates.length];
      bugs.push(createBug(`easy_${i}`, 'easy', `${base.title} #${i}`, base.desc, base.buggy, base.correct, base.hints, base.tests));
    }

    // ----- Medium bugs (30) -----
    const mediumTemplates = [
      { title: 'React state mutation', desc: 'Fix counter.', buggy: `function Counter() { const [c,setC]=useState(0); const inc=()=>{c=c+1;}; return <button onClick={inc}>{c}</button>; }`, correct: `function Counter() { const [c,setC]=useState(0); const inc=()=>setC(c+1); return <button onClick={inc}>{c}</button>; }`, hints: ['Use setC'], tests: [] },
      { title: 'useEffect missing deps', desc: 'Add dependency array.', buggy: `useEffect(()=>{ console.log(id); });`, correct: `useEffect(()=>{ console.log(id); },[id]);`, hints: ['Add [id]'], tests: [] },
      { title: 'Array push mutation', desc: 'Return new array.', buggy: `function add(arr,val){ arr.push(val); return arr; }`, correct: `function add(arr,val){ return [...arr,val]; }`, hints: ['Use spread'], tests: [{ input: [[1],2], expected: [1,2] }] },
      { title: 'Closure in loop (var)', desc: 'Fix var to let.', buggy: `for(var i=0;i<3;i++){ setTimeout(()=>console.log(i),100); }`, correct: `for(let i=0;i<3;i++){ setTimeout(()=>console.log(i),100); }`, hints: ['Use let'], tests: [] },
      { title: 'Async/await missing await', desc: 'Add await.', buggy: `async function getData(){ const res = fetch('/api'); return res.json(); }`, correct: `async function getData(){ const res = await fetch('/api'); return res.json(); }`, hints: ['await fetch'], tests: [] },
      { title: 'Event listener cleanup', desc: 'Remove listener.', buggy: `useEffect(()=>{ window.addEventListener('resize',fn); },[]);`, correct: `useEffect(()=>{ window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn); },[]);`, hints: ['Return cleanup'], tests: [] }
    ];
    for (let i = 1; i <= 30; i++) {
      const base = mediumTemplates[(i-1) % mediumTemplates.length];
      bugs.push(createBug(`medium_${i}`, 'medium', `${base.title} #${i}`, base.desc, base.buggy, base.correct, base.hints, base.tests));
    }

    // ----- Hard bugs (30) -----
    const hardTemplates = [
      { title: 'Promise chain missing catch', desc: 'Handle rejection.', buggy: `fetch('/data').then(res=>res.json()).then(data=>console.log(data));`, correct: `fetch('/data').then(res=>res.json()).then(data=>console.log(data)).catch(err=>console.error(err));`, hints: ['Add .catch'], tests: [] },
      { title: 'Reduce without initial value', desc: 'Add initial accumulator.', buggy: `const sum = arr.reduce((a,b)=>a+b);`, correct: `const sum = arr.reduce((a,b)=>a+b,0);`, hints: ['Add ,0'], tests: [{ input: [[1,2,3]], expected: 6 }] },
      { title: 'State batching issue', desc: 'Use functional update.', buggy: `for(let i=0;i<5;i++) setCount(count+1);`, correct: `setCount(prev=>prev+5);`, hints: ['Use prev => prev + 5'], tests: [] },
      { title: 'Incorrect this binding', desc: 'Arrow function.', buggy: `class T{ constructor(){this.val=0;} inc(){this.val++;} }`, correct: `class T{ constructor(){this.val=0;} inc=()=>{this.val++;} }`, hints: ['Arrow function'], tests: [] },
      { title: 'Memory leak in setInterval', desc: 'Clear interval.', buggy: `useEffect(()=>{ const id=setInterval(fn,1000); },[]);`, correct: `useEffect(()=>{ const id=setInterval(fn,1000); return ()=>clearInterval(id); },[]);`, hints: ['Return cleanup'], tests: [] },
      { title: 'Deep clone missing', desc: 'Copy nested object.', buggy: `const copy = original;`, correct: `const copy = JSON.parse(JSON.stringify(original));`, hints: ['Use JSON methods'], tests: [] }
    ];
    for (let i = 1; i <= 30; i++) {
      const base = hardTemplates[(i-1) % hardTemplates.length];
      bugs.push(createBug(`hard_${i}`, 'hard', `${base.title} #${i}`, base.desc, base.buggy, base.correct, base.hints, base.tests));
    }

    return bugs;
  };

  const allBugs = useMemo(() => generateBugs(), []);
  const filteredBugs = useMemo(() => allBugs.filter(b => b.difficulty === level), [allBugs, level]);

  // ------------------------------------------------------------------
  // Helper: execute user code and run tests (sandboxed)
  // ------------------------------------------------------------------
  const executeCodeAndTest = (code, tests) => {
    if (!tests || tests.length === 0) {
      return { passed: true, results: [] };
    }
    const results = [];
    let allPassed = true;
    try {
      const funcNameMatch = code.match(/function\s+(\w+)\s*\(/);
      if (!funcNameMatch) throw new Error('No function found in code');
      const funcName = funcNameMatch[1];
      const wrappedCode = `
        "use strict";
        let __result;
        ${code}
        __result = (${funcName});
        __result;
      `;
      const func = new Function(wrappedCode)();
      for (const test of tests) {
        try {
          const output = func(...test.input);
          const passed = JSON.stringify(output) === JSON.stringify(test.expected);
          results.push({ description: test.description, passed, expected: test.expected, got: output });
          if (!passed) allPassed = false;
        } catch (err) {
          results.push({ description: test.description, passed: false, error: err.message });
          allPassed = false;
        }
      }
    } catch (err) {
      return { passed: false, error: err.message, results: [] };
    }
    return { passed: allPassed, results };
  };

  // ------------------------------------------------------------------
  // Component state
  // ------------------------------------------------------------------
  const [currentBug, setCurrentBug] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [bugFixed, setBugFixed] = useState(false);
  const [fixedCount, setFixedCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completedBugs, setCompletedBugs] = useState(new Set());

  // Load a random bug from filtered list
  const loadRandomBug = () => {
    if (filteredBugs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredBugs.length);
    const bug = filteredBugs[randomIndex];
    setCurrentBug(bug);
    setUserCode(bug.buggyCode);
    setTestResults([]);
    setBugFixed(false);
    setHintIndex(0);
    setShowSolution(false);
  };

  useEffect(() => {
    loadRandomBug();
  }, [level, filteredBugs]);

  const runDebug = () => {
    if (!currentBug) return;
    setIsRunning(true);
    setTestResults([]);
    setTimeout(() => {
      const { passed, results, error } = executeCodeAndTest(userCode, currentBug.tests);
      if (error) {
        setTestResults([{ description: 'Execution error', passed: false, error }]);
        setBugFixed(false);
      } else {
        setTestResults(results);
        setBugFixed(passed);
        if (passed && !completedBugs.has(currentBug.id)) {
          setCompletedBugs(prev => new Set(prev).add(currentBug.id));
          setFixedCount(prev => prev + 1);
        }
      }
      setIsRunning(false);
    }, 300);
  };

  const showHint = () => {
    if (currentBug && hintIndex < currentBug.hints.length) {
      setHintIndex(prev => prev + 1);
    }
  };

  const revealSolution = () => {
    if (currentBug) {
      setUserCode(currentBug.correctCode);
      setShowSolution(true);
      setTestResults([]);
      setBugFixed(false);
    }
  };

  const nextBug = () => {
    loadRandomBug(); // load a random new bug (could be same as current, but random)
  };

  if (!currentBug) return <div className="debugging-mode">Loading bugs...</div>;

  const roleDisplay = role ? role.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Developer';
  const remainingHints = currentBug.hints.length - hintIndex;

  return (
    <div className="debugging-mode">
      {/* No back button here – Practice.jsx modal already provides it */}
      <div className="debug-layout">
        {/* Left Panel: Problem + Hints */}
        <div className="debug-left">
          <div className="bug-card">
            <div className="bug-title">
              <h2>{currentBug.title}</h2>
              <span className={`difficulty ${currentBug.difficulty}`}>{currentBug.difficulty}</span>
            </div>
            <p className="bug-description">{currentBug.description}</p>
            <div className="buggy-code-block">
              <div className="code-header">🐞 Buggy Code</div>
              <pre className="code-pre">
                {currentBug.buggyCode.split('\n').map((line, i) => (
                  <div key={i} className="code-line">
                    <span className="line-number">{i+1}</span>
                    <span className="line-code">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
            <div className="hint-section">
              <h4>💡 Hints</h4>
              {hintIndex === 0 && <p className="hint-placeholder">Click "Show Hint" to reveal.</p>}
              <ul className="hint-list">
                {currentBug.hints.slice(0, hintIndex).map((hint, i) => (
                  <li key={i} className="hint-item">{hint}</li>
                ))}
              </ul>
              {remainingHints > 0 && (
                <button className="hint-btn" onClick={showHint}>Show Hint ({remainingHints} left)</button>
              )}
            </div>
            <div className="job-role">👤 Role: {roleDisplay}</div>
          </div>
        </div>

        {/* Right Panel: Editor + Output + Actions */}
        <div className="debug-right">
          <div className="editor-section">
            <div className="editor-header">
              <span>✏️ Fix the code</span>
              <div className="action-buttons">
                <button className="run-btn" onClick={runDebug} disabled={isRunning}>
                  {isRunning ? '⏳ Running...' : '🐞 Run Debug'}
                </button>
                <button className="solution-btn" onClick={revealSolution}>Show Solution</button>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck="false"
              rows={14}
            />
          </div>

          <div className="output-section">
            <div className="output-header">📋 Test Results</div>
            <div className="test-results">
              {testResults.length === 0 && <div className="test-placeholder">// Click "Run Debug" to test your fix</div>}
              {testResults.map((res, idx) => (
                <div key={idx} className={`test-item ${res.passed ? 'passed' : 'failed'}`}>
                  <span className="test-icon">{res.passed ? '✓' : '✗'}</span>
                  <span className="test-desc">{res.description || 'Test case'}</span>
                  {res.error && <span className="test-error">Error: {res.error}</span>}
                  {!res.passed && !res.error && (
                    <span className="test-detail">Expected: {JSON.stringify(res.expected)} | Got: {JSON.stringify(res.got)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {bugFixed && (
            <div className="next-section">
              <button className="next-btn" onClick={nextBug}>➡ Next Bug</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebuggingMode;