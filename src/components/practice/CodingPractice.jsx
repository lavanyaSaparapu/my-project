// CodingPractice.jsx – Final version with matched examples & job role display
import React, { useState, useEffect, useMemo } from 'react';
import './CodingPractice.css';

const CodingPractice = ({ focusSkill = 'General', role = 'developer', level = 'easy' }) => {
  // ---------- Generate 30 easy, 30 medium, 30 hard questions ----------
  const generateQuestions = () => {
    const questions = [];
    const createQuestion = (id, difficulty, skill, title, description, examples, testCases, starterCode, roles) => ({
      id, type: 'coding', roles: roles || ['frontend', 'backend', 'fullstack', 'developer'], skills: [skill],
      title, description, difficulty, examples, testCases, starterCode
    });

    const stringify = (val) => JSON.stringify(val);

    // ----- EASY (30) – each with a consistent example -----
    const easyProblems = [
      { skill: 'Arrays', title: 'Sum of Array', desc: 'Return the sum of all numbers in the given array.', exampleInput: [1,2,3,4], exampleOutput: 10, starter: 'function sumArray(arr) {\n  // Write your code here\n  \n}' },
      { skill: 'Arrays', title: 'Find Maximum', desc: 'Return the largest number in the array.', exampleInput: [5,2,9,1], exampleOutput: 9, starter: 'function findMax(arr) {\n  // Write your code here\n  \n}' },
      { skill: 'Strings', title: 'Reverse String', desc: 'Return the reversed string.', exampleInput: 'hello', exampleOutput: 'olleh', starter: 'function reverseString(str) {\n  // Write your code here\n  \n}' },
      { skill: 'Strings', title: 'Count Vowels', desc: 'Return the number of vowels (a,e,i,o,u) in the string.', exampleInput: 'hello world', exampleOutput: 3, starter: 'function countVowels(str) {\n  // Write your code here\n  \n}' },
      { skill: 'Math', title: 'Even or Odd', desc: 'Return "Even" if the number is even, "Odd" if odd.', exampleInput: 7, exampleOutput: 'Odd', starter: 'function evenOrOdd(n) {\n  // Write your code here\n  \n}' },
      { skill: 'Math', title: 'Factorial', desc: 'Return n! (factorial of n).', exampleInput: 5, exampleOutput: 120, starter: 'function factorial(n) {\n  // Write your code here\n  \n}' },
      { skill: 'Loops', title: 'Sum 1 to N', desc: 'Return the sum of all integers from 1 to n.', exampleInput: 10, exampleOutput: 55, starter: 'function sumToN(n) {\n  // Write your code here\n  \n}' },
      { skill: 'Conditionals', title: 'Max of Three', desc: 'Return the maximum of three numbers.', exampleInput: [3,7,5], exampleOutput: 7, starter: 'function maxOfThree(a,b,c) {\n  // Write your code here\n  \n}' }
    ];

    // Generate 30 easy by cycling and varying numbers slightly (but example stays consistent)
    for (let i = 1; i <= 30; i++) {
      const base = easyProblems[(i-1) % easyProblems.length];
      let input = base.exampleInput;
      let output = base.exampleOutput;
      // For variation, change numbers but keep logic same
      if (base.title === 'Sum of Array') {
        const arr = [i, i+1, i+2];
        input = arr;
        output = arr.reduce((a,b)=>a+b,0);
      } else if (base.title === 'Find Maximum') {
        const arr = [i, i*2, i+5, i-1];
        input = arr;
        output = Math.max(...arr);
      } else if (base.title === 'Reverse String') {
        const str = `sample${i}`;
        input = str;
        output = str.split('').reverse().join('');
      } else if (base.title === 'Count Vowels') {
        const str = `hello world ${i}`;
        input = str;
        output = (str.match(/[aeiou]/gi) || []).length;
      } else if (base.title === 'Even or Odd') {
        input = i;
        output = i % 2 === 0 ? 'Even' : 'Odd';
      } else if (base.title === 'Factorial') {
        const n = (i % 8) + 1;
        let fact = 1;
        for (let j=2; j<=n; j++) fact *= j;
        input = n;
        output = fact;
      } else if (base.title === 'Sum 1 to N') {
        const n = (i % 20) + 1;
        input = n;
        output = n * (n+1) / 2;
      } else if (base.title === 'Max of Three') {
        const a = i, b = i+3, c = i+1;
        input = [a,b,c];
        output = Math.max(a,b,c);
      }
      const examples = [`Input: ${stringify(input)} → Output: ${stringify(output)}`];
      const testCases = [{ input: stringify(input), expected: stringify(output) }];
      questions.push(createQuestion(`easy_${i}`, 'easy', base.skill, `${base.title} #${i}`, base.desc, examples, testCases, base.starter, ['frontend', 'backend', 'fullstack']));
    }

    // ----- MEDIUM (30) -----
    const mediumProblems = [
      { skill: 'Recursion', title: 'Fibonacci', desc: 'Return the nth Fibonacci number (0-indexed).', exampleInput: 6, exampleOutput: 8, starter: 'function fib(n) {\n  // Write your code here\n  \n}' },
      { skill: 'Sorting', title: 'Bubble Sort', desc: 'Sort the array in ascending order.', exampleInput: [5,2,8,1], exampleOutput: [1,2,5,8], starter: 'function bubbleSort(arr) {\n  // Write your code here\n  \n}' },
      { skill: 'Searching', title: 'Binary Search', desc: 'Return the index of target in sorted array, or -1.', exampleInput: {arr:[1,3,5,7,9], target:5}, exampleOutput: 2, starter: 'function binarySearch(arr, target) {\n  // Write your code here\n  \n}' },
      { skill: 'Hash Maps', title: 'Two Sum', desc: 'Return indices of two numbers that add up to target.', exampleInput: {nums:[2,7,11,15], target:9}, exampleOutput: [0,1], starter: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}' }
    ];
    for (let i = 1; i <= 30; i++) {
      const base = mediumProblems[(i-1) % mediumProblems.length];
      let input = base.exampleInput, output = base.exampleOutput;
      if (base.title === 'Fibonacci') {
        const n = (i % 15) + 1;
        let a=0,b=1,c;
        for (let j=2;j<=n;j++) { c=a+b; a=b; b=c; }
        input = n;
        output = n===0 ? 0 : n===1 ? 1 : b;
      } else if (base.title === 'Bubble Sort') {
        const arr = [i*3, i*2, i, i+5];
        input = arr;
        output = [...arr].sort((a,b)=>a-b);
      } else if (base.title === 'Binary Search') {
        const arr = [i, i+2, i+4, i+6, i+8];
        const target = i+4;
        input = {arr, target};
        output = arr.indexOf(target);
      } else if (base.title === 'Two Sum') {
        const nums = [i, i+1, i+2, i+3];
        const target = nums[0] + nums[2];
        input = {nums, target};
        output = [0,2];
      }
      const examples = [`Input: ${stringify(input)} → Output: ${stringify(output)}`];
      const testCases = [{ input: stringify(input), expected: stringify(output) }];
      questions.push(createQuestion(`medium_${i}`, 'medium', base.skill, `${base.title} #${i}`, base.desc, examples, testCases, base.starter, ['backend', 'fullstack', 'algorithms']));
    }

    // ----- HARD (30) -----
    const hardProblems = [
      { skill: 'Dynamic Programming', title: 'LIS Length', desc: 'Length of Longest Increasing Subsequence.', exampleInput: [10,9,2,5,3,7,101,18], exampleOutput: 4, starter: 'function lengthOfLIS(nums) {\n  // Write your code here\n  \n}' },
      { skill: 'Graphs', title: 'Number of Islands', desc: 'Count islands (1=land).', exampleInput: [[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]], exampleOutput: 3, starter: 'function numIslands(grid) {\n  // Write your code here\n  \n}' },
      { skill: 'Trees', title: 'Max Depth', desc: 'Maximum depth of binary tree (array representation).', exampleInput: [3,9,20,null,null,15,7], exampleOutput: 3, starter: 'function maxDepth(root) {\n  // Write your code here\n  \n}' },
      { skill: 'Backtracking', title: 'N-Queens Count', desc: 'Number of distinct solutions for N-Queens.', exampleInput: 4, exampleOutput: 2, starter: 'function totalNQueens(n) {\n  // Write your code here\n  \n}' }
    ];
    for (let i = 1; i <= 30; i++) {
      const base = hardProblems[(i-1) % hardProblems.length];
      let input = base.exampleInput, output = base.exampleOutput;
      if (base.title === 'LIS Length') {
        const arr = [i, i+1, i-1, i+2];
        input = arr;
        output = 3;
      } else if (base.title === 'Number of Islands') {
        const grid = [[1,1,0],[1,0,0],[0,0,1]];
        input = grid;
        output = 2;
      } else if (base.title === 'Max Depth') {
        const treeArr = [i, i+1, null, i+2];
        input = treeArr;
        output = 3;
      } else if (base.title === 'N-Queens Count') {
        const n = (i % 4) + 1;
        const counts = {1:1,2:0,3:0,4:2};
        input = n;
        output = counts[n];
      }
      const examples = [`Input: ${stringify(input)} → Output: ${stringify(output)}`];
      const testCases = [{ input: stringify(input), expected: stringify(output) }];
      questions.push(createQuestion(`hard_${i}`, 'hard', base.skill, `${base.title} #${i}`, base.desc, examples, testCases, base.starter, ['senior backend', 'systems engineer', 'algorithms engineer']));
    }
    return questions;
  };

  const allQuestions = useMemo(() => generateQuestions(), []);

  // Filter by level and skill (if specific)
  const filteredQuestions = useMemo(() => {
    let levelQuestions = allQuestions.filter(q => q.difficulty === level);
    if (focusSkill && focusSkill !== 'General Skill') {
      const filtered = levelQuestions.filter(q =>
        q.skills.some(s => s.toLowerCase().includes(focusSkill.toLowerCase()))
      );
      return filtered.length ? filtered : levelQuestions;
    }
    return levelQuestions;
  }, [allQuestions, level, focusSkill]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPassed, setSubmissionPassed] = useState(false);

  const loadRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const q = filteredQuestions[randomIndex];
    setCurrentQuestion(q);
    setCode(q.starterCode);
    setOutput([]);
    setTestResults([]);
    setSubmissionPassed(false);
  };

  useEffect(() => {
    if (filteredQuestions.length > 0) loadRandomQuestion();
  }, [filteredQuestions, level, focusSkill]);

  // Safe execution of user code
  const executeUserCode = (funcBody, input) => {
    try {
      const funcNameMatch = code.match(/function\s+(\w+)\s*\(/);
      if (!funcNameMatch) throw new Error('No function found. Define a function with the correct name.');
      const funcName = funcNameMatch[1];
      const fullCode = `
        "use strict";
        ${code}
        return ${funcName}(${JSON.stringify(input)});
      `;
      const result = new Function(fullCode)();
      return { success: true, result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput([]);
    setTimeout(() => {
      try {
        new Function(code);
        setOutput(['✓ Syntax check passed. You can now submit.']);
      } catch (err) {
        setOutput([`✗ Syntax error: ${err.message}`]);
      }
      setIsRunning(false);
    }, 300);
  };

  const submitSolution = async () => {
    setIsSubmitting(true);
    setTestResults([]);
    const results = [];
    let allPassed = true;

    for (const testCase of currentQuestion.testCases) {
      const input = JSON.parse(testCase.input);
      const expected = JSON.parse(testCase.expected);
      const execResult = executeUserCode(code, input);
      let passed = false;
      let actual = null;
      let error = null;
      if (execResult.success) {
        actual = execResult.result;
        passed = JSON.stringify(actual) === JSON.stringify(expected);
        if (!passed) error = `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
      } else {
        error = execResult.error;
      }
      results.push({
        id: results.length,
        input: testCase.input,
        expected: testCase.expected,
        actual: actual !== null ? JSON.stringify(actual) : 'Error',
        passed,
        error
      });
      if (!passed) allPassed = false;
    }

    setTestResults(results);
    setOutput(allPassed ? ['✅ All tests passed!'] : ['❌ Some tests failed. Keep trying!']);
    setSubmissionPassed(allPassed);
    setIsSubmitting(false);
  };

  if (!currentQuestion) return <div className="coding-practice">Loading questions...</div>;

  // Format job role for display (capitalize, replace hyphen)
  const displayRole = role ? role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Developer';

  return (
    <div className="coding-practice">
      <div className="practice-layout">
        {/* Question Card */}
        <div className="question-card">
          <h2 className="question-title">{currentQuestion.title}</h2>
          <span className={`question-difficulty difficulty-${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty.toUpperCase()}
          </span>
          <div className="question-description">
            <p>{currentQuestion.description}</p>
          </div>
          {currentQuestion.examples && (
            <div className="question-example">
              <strong>Example:</strong>
              {currentQuestion.examples.map((ex, i) => <div key={i}>{ex}</div>)}
            </div>
          )}
          <div className="question-example">
            <strong>Matched Job Role:</strong> {displayRole}<br />
            <strong>Level:</strong> <span className={`level-${level}`}>{level.toUpperCase()}</span>
          </div>
        </div>

        {/* Code Editor */}
        <div className="code-editor-section">
          <div className="editor-header">
            <span className="editor-language"></span>
            <span>✏️ Write your solution (no pre-filled answers)</span>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            placeholder="Write your function here..."
          />
          <div className="button-group">
            <button className="btn-run" onClick={runCode} disabled={isRunning || isSubmitting}>
              {isRunning ? <span className="loading-spinner" /> : '▶ Run (Syntax Check)'}
            </button>
            <button className="btn-submit" onClick={submitSolution} disabled={isRunning || isSubmitting}>
              {isSubmitting ? <span className="loading-spinner" /> : '✅ Submit'}
            </button>
            {submissionPassed && (
              <button className="btn-next" onClick={loadRandomQuestion}>⏩ Next Challenge</button>
            )}
          </div>
          {submissionPassed && <div className="success-message">🎉 All tests passed! Click Next Challenge.</div>}
        </div>
      </div>

      {/* Output Panel */}
      <div className="output-panel">
        <div className="output-header">
          <span>📤 Output / Test Results</span>
          {isSubmitting && <span>Running your code...</span>}
        </div>
        {output.length > 0 && (
          <div className="output-console">
            {output.map((line, idx) => <div key={idx}>{line}</div>)}
          </div>
        )}
        {testResults.length > 0 && (
          <div className="test-results">
            {testResults.map(test => (
              <div key={test.id} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                <div className="test-case-header">
                  <span>Test {test.id + 1}</span>
                  <span className="test-status">{test.passed ? '✓ Passed' : '✗ Failed'}</span>
                </div>
                <div className="test-details">
                  <div>Input: {test.input}</div>
                  <div>Expected: {test.expected}</div>
                  <div>Got: {test.actual}</div>
                  {test.error && <div style={{ color: '#ef4444' }}>Error: {test.error}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPractice;