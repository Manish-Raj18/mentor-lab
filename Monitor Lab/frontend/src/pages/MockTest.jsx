import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "../css_files/mock.css";
import ReviewSection from "../components/ReviewSection";

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const MockTest = () => {
  const [screen, setScreen] = useState('select');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionStatuses, setQuestionStatuses] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const [candidateName, setCandidateName] = useState('');
  const paletteScrollRef = useRef(null);

  useEffect(() => {
    if (paletteScrollRef.current) {
      const btn = paletteScrollRef.current.querySelector(`.num-btn[data-idx="${currentIndex}"]`);
      if (btn) {
        btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get(`${API_BASE}/mocktest`, { headers: getAuthHeaders() });
        setTests(res.data);
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load mock tests');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/profile`, { headers: getAuthHeaders() });
        setCandidateName(res.data.name);
      } catch (err) {
        setCandidateName('Student');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (screen === 'test' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, timeLeft > 0]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const startTest = (test) => {
    setSelectedTest(test);
    setCurrentIndex(0);
    setUserAnswers({});
    setQuestionStatuses({});
    setTimeLeft((test.duration || 60) * 60);
    setScreen('test');
  };

  const questions = selectedTest?.questions || [];
  const activeQuestion = questions[currentIndex];
  const currentKey = `${currentIndex}`;

  const handleSelectOption = (idx) => {
    setUserAnswers(prev => ({ ...prev, [currentKey]: idx }));
    setQuestionStatuses(prev => ({ ...prev, [currentKey]: 'answered' }));
  };

  const handleClearSelection = () => {
    setUserAnswers(prev => { const n = { ...prev }; delete n[currentKey]; return n; });
    setQuestionStatuses(prev => ({ ...prev, [currentKey]: 'not-answered' }));
  };

  const moveNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("You have reached the last question! You can submit the test.");
    }
  };

  const handleMarkReview = () => {
    setQuestionStatuses(prev => ({ ...prev, [currentKey]: 'review' }));
    moveNext();
  };

  const handleSaveNext = () => {
    if (userAnswers[currentKey] === undefined) {
      setQuestionStatuses(prev => ({ ...prev, [currentKey]: 'not-answered' }));
    } else {
      setQuestionStatuses(prev => ({ ...prev, [currentKey]: 'answered' }));
    }
    moveNext();
  };

  const handleSubmit = async (auto = false) => {
    if (!auto && !confirm("Do you really want to submit this test?")) return;
    clearInterval(timerRef.current);

    const answerIndices = {};
    let attempted = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] !== undefined) {
        attempted++;
        answerIndices[idx] = userAnswers[idx];
      }
    });

    try {
      const res = await axios.post(`${API_BASE}/mocktest/${selectedTest._id}/submit`, {
        answers: answerIndices,
      }, { headers: getAuthHeaders() });

      const { correct, wrong, score, totalQuestions, maxScore } = res.data;

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/auth/add-activity`, {
        title: `Mock Test: ${selectedTest.title}`,
        score: `${score} / ${maxScore}`
      }, { headers: { Authorization: `Bearer ${token}` } });

      setResultData({ attempted, correct, wrong, score, total: totalQuestions, maxScore });
    } catch (err) {
      console.error("Failed to save result:", err);
      setResultData({ attempted, correct: 0, wrong: 0, score: 0, total: questions.length, maxScore: questions.length * 4 });
    }
    setShowResult(true);
  };

  const getBtnClass = (idx) => {
    if (idx === currentIndex) return "num-btn active-num";
    if (questionStatuses[idx] === 'answered') return "num-btn answered";
    if (questionStatuses[idx] === 'review') return "num-btn review-status";
    if (questionStatuses[idx] === 'visited' || questionStatuses[idx] === 'not-answered') return "num-btn not-answered";
    return "num-btn";
  };

  const navigateTo = (idx) => {
    const oldKey = `${currentIndex}`;
    if (userAnswers[oldKey] === undefined && questionStatuses[oldKey] !== 'review') {
      setQuestionStatuses(prev => ({ ...prev, [oldKey]: 'not-answered' }));
    }
    setCurrentIndex(idx);
  };

  if (screen === 'select') {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-color)", padding: "2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ textAlign: "center", color: "var(--text-color)", marginBottom: "0.5rem" }}>Mock Test Portal</h1>
          <p style={{ textAlign: "center", color: "var(--text-color)", opacity: 0.7, marginBottom: "2rem" }}>
            Welcome{candidateName ? `, ${candidateName}` : ''}. Select a test below to begin.
          </p>

          {loading && <p style={{ textAlign: "center", color: "var(--text-color)" }}>Loading available tests...</p>}
          {fetchError && <p style={{ textAlign: "center", color: "#dc3545" }}>{fetchError}</p>}

          {!loading && !fetchError && tests.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <h3 style={{ color: "var(--text-color)" }}>No Mock Tests Available</h3>
              <p style={{ color: "var(--text-color)", opacity: 0.6, marginTop: "0.5rem" }}>Please check back later or contact your administrator.</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem" }}>
            {tests.map((test) => (
              <div key={test._id} style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer"
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <h3 style={{ color: "var(--accent-color)", margin: 0, fontSize: "1.1rem" }}>{test.title}</h3>
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                  {test.subject && <span style={{ background: "var(--secondary-bg)", color: "var(--text-color)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>{test.subject}</span>}
                  {test.topic && <span style={{ background: "var(--secondary-bg)", color: "var(--text-color)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem" }}>{test.topic}</span>}
                </div>
                <p style={{ color: "var(--text-color)", opacity: 0.7, fontSize: "0.85rem", margin: 0 }}>
                  {test.questions.length} Questions &middot; {test.duration || 60} min
                </p>
                <button
                  onClick={() => startTest(test)}
                  style={{
                    marginTop: "auto",
                    padding: "0.6rem",
                    background: "var(--accent-color)",
                    color: "var(--hero-text)",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult && resultData) {
    return (
      <div id="result-screen">
        <div className="result-card">
          <h2>Exam Performance Scorecard</h2>
          <hr style={{ margin: "1rem 0", border: 0, borderTop: "1px solid var(--border-color)" }} />
          <div className="result-grid">
            <div className="res-item"><h5>Total Questions</h5><p>{resultData.total}</p></div>
            <div className="res-item" style={{ color: "#17a2b8" }}><h5>Attempted</h5><p>{resultData.attempted}</p></div>
            <div className="res-item" style={{ color: "#28a745" }}><h5>Correct Answers</h5><p>{resultData.correct}</p></div>
            <div className="res-item" style={{ color: "#dc3545" }}><h5>Wrong Answers</h5><p>{resultData.wrong}</p></div>
          </div>
          <div className="score-display">
            <h3>Final Score Obtained</h3>
            <h1>{resultData.score} / {resultData.maxScore}</h1>
          </div>
          <button className="btn-restart" onClick={() => { setScreen('select'); setShowResult(false); setResultData(null); setCurrentIndex(0); setUserAnswers({}); setQuestionStatuses({}); setSelectedTest(null); }}>
            Back to Test Selection
          </button>
        </div>
      </div>
    );
  }

  if (!activeQuestion) return null;

  return (
    <div id="main-test-screen" style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <header className="test-header">
        <div className="test-title">{selectedTest.title}</div>
        <div className="header-right">
          <div>Time Left: <strong>{formatTime(timeLeft)}</strong></div>
          <div>Candidate: <strong>{candidateName}</strong></div>
        </div>
      </header>

      <div className="subject-bar">
        <span>{selectedTest.subject || 'GENERAL'}</span>
        <span>Paper Pattern: MCQ (+4 / -1)</span>
      </div>

      <div className="meta-strip">
        <span>Qus. No: <strong>{currentIndex + 1}</strong> / {questions.length}</span>
        <span>Qus. Type: <strong>MCQ Single Choice</strong></span>
        <span>Marks: <strong style={{ color: "#28a745" }}>(+ve) 4</strong> / <strong style={{ color: "#dc3545" }}>(-ve) 1</strong></span>
      </div>

      <div className="test-window">
        <aside className="subject-sidebar">
          <div className="sidebar-heading">Question Navigator</div>
          <div style={{ padding: "0.8rem", display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ width: "12px", height: "12px", background: "#28a745", borderRadius: "2px", display: "inline-block" }}></span> Answered</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ width: "12px", height: "12px", background: "#dc3545", borderRadius: "2px", display: "inline-block" }}></span> Not Answered</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ width: "12px", height: "12px", background: "#ffc107", borderRadius: "2px", display: "inline-block" }}></span> Marked for Review</div>
          </div>
        </aside>

        <main className="question-pane">
          <p className="question-text">{activeQuestion.question}</p>
          <div className="options-list">
            {activeQuestion.options.map((optText, idx) => (
              <label key={idx} className="option-item">
                <input type="radio" name="cbt-option" value={idx} checked={userAnswers[currentKey] === idx} onChange={() => handleSelectOption(idx)} />
                <span>{optText}</span>
              </label>
            ))}
          </div>
          <div className="pane-actions">
            <button type="button" className="btn-action btn-review" onClick={handleMarkReview}>Mark for Review</button>
            <button type="button" className="btn-action btn-clear" onClick={handleClearSelection}>Clear Response</button>
            <button type="button" className="btn-action btn-next" onClick={handleSaveNext}>Save & Next</button>
          </div>
        </main>

        <aside className="palette-pane">
          <div className="palette-header">QUESTION PALETTE</div>
          <button className="palette-scroll-btn" onClick={() => paletteScrollRef.current?.scrollBy({ top: -120, behavior: 'smooth' })}>&#9650;</button>
          <div className="numbers-grid-wrapper" ref={paletteScrollRef}>
            <div className="numbers-grid">
              {questions.map((q, idx) => (
                <a key={idx} data-idx={idx} className={getBtnClass(idx)} onClick={() => navigateTo(idx)}>{idx + 1}</a>
              ))}
            </div>
          </div>
          <button className="palette-scroll-btn" onClick={() => paletteScrollRef.current?.scrollBy({ top: 120, behavior: 'smooth' })}>&#9660;</button>
          <div className="palette-footer">
            <button className="btn-submit-test" onClick={() => handleSubmit()}>Submit Test</button>
          </div>
        </aside>
      </div>

      <footer className="test-footer">CBT Examination Module Hub &copy; 2026. All rights reserved.</footer>
      <ReviewSection targetType="mock-test" />
    </div>
  );
};

export default MockTest;
