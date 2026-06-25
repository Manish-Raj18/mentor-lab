import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css_files/mock.css';

function Test() {
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [isTestSubmitted, setIsTestSubmitted] = useState(false);
    const [candidateName, setCandidateName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    
    const [selectedDept, setSelectedDept] = useState('biotech');
    const [currentDept, setCurrentDept] = useState('biotech');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("http://localhost:5000/api/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCandidateName(response.data.name);
                    setRollNumber(response.data.studentId || "N/A");
                }
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };
        fetchUserProfile();
    }, []);

    const [allTests, setAllTests] = useState({ biotech: {}, bba: {}, bca: {} });
    const [selectedTest, setSelectedTest] = useState(null);
    const [quizData, setQuizData] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [questionStatuses, setQuestionStatuses] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    const timerRef = useRef(null);

    // Fetch Quiz Data from Backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/mocktest");
                const tests = response.data;
                
                const grouped = { biotech: {}, bba: {}, bca: {} };
                
                tests.forEach(test => {
                    const subject = test.subject.toLowerCase();
                    const targetKey = subject.includes('biotech') ? 'biotech' : 
                                     subject.includes('bba') ? 'bba' : 
                                     subject.includes('bca') ? 'bca' : null;
                    
                    if (targetKey) {
                        const topic = test.topic || "General";
                        if (!grouped[targetKey][topic]) {
                            grouped[targetKey][topic] = [];
                        }
                        grouped[targetKey][topic].push(test);
                    }
                });

                setAllTests(grouped);
            } catch (err) {
                console.error("Failed to fetch questions from backend", err);
            }
        };
        fetchQuestions();
    }, []);

    // Timer Effect
    useEffect(() => {
        if (isTestStarted && !isTestSubmitted && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        submitExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isTestStarted, isTestSubmitted, timeLeft]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs < 10 ? "0" + hrs : hrs}:${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
    };

    const startCandidateSession = (test) => {
        if (candidateName.trim() === "") {
            const name = prompt("Please enter your Full Name to begin:");
            if (!name) return;
            setCandidateName(name);
        }
        
        const formattedQuestions = test.questions.map((q, idx) => ({
            id: idx + 1,
            q: q.question,
            o: q.options,
            ans: !isNaN(q.correctAnswer) ? parseInt(q.correctAnswer) : q.options.indexOf(q.correctAnswer)
        }));

        const deptKey = test.subject.toLowerCase();
        setQuizData({ [deptKey]: formattedQuestions });
        setCurrentDept(deptKey);
        setSelectedTest(test);
        setIsTestStarted(true);
        setTimeLeft(test.duration * 60 || 3600);
        setCurrentIndex(0);
        setUserAnswers({});
        setQuestionStatuses({});

        const statusKey = `${deptKey}-0`;
        setQuestionStatuses({ [statusKey]: 'visited' });
    };

    const selectOption = (idx) => {
        const key = `${currentDept}-${currentIndex}`;
        setUserAnswers(prev => ({ ...prev, [key]: idx }));
        setQuestionStatuses(prev => ({ ...prev, [key]: 'answered' }));
    };

    const clearSelection = () => {
        const key = `${currentDept}-${currentIndex}`;
        const newUserAnswers = { ...userAnswers };
        delete newUserAnswers[key];
        setUserAnswers(newUserAnswers);
        setQuestionStatuses(prev => ({ ...prev, [key]: 'not-answered' }));
    };

    const markForReview = () => {
        const key = `${currentDept}-${currentIndex}`;
        setQuestionStatuses(prev => ({ ...prev, [key]: 'review' }));
        moveNextLogic();
    };

    const saveAndNext = () => {
        const key = `${currentDept}-${currentIndex}`;
        if (userAnswers[key] === undefined) {
            setQuestionStatuses(prev => ({ ...prev, [key]: 'not-answered' }));
        } else {
            setQuestionStatuses(prev => ({ ...prev, [key]: 'answered' }));
        }
        moveNextLogic();
    };

    const moveNextLogic = () => {
        const currentQuestions = quizData[currentDept] || [];
        if (currentIndex < currentQuestions.length - 1) {
            const nextIdx = currentIndex + 1;
            const nextKey = `${currentDept}-${nextIdx}`;
            setCurrentIndex(nextIdx);
            if (!questionStatuses[nextKey]) {
                setQuestionStatuses(prev => ({ ...prev, [nextKey]: 'visited' }));
            }
        } else {
            alert("You have reached the end of the test.");
        }
    };

    const submitExam = async () => {
        if (!isTestSubmitted && !confirm("Are you sure you want to submit the test?")) return;
        
        const { score, totalMarks } = getResults();
        
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/auth/add-activity", 
                { title: `Mock Test: ${selectedTest.title}`, score: `${score} / ${totalMarks}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Failed to save activity", err);
        }

        setIsTestSubmitted(true);
        clearInterval(timerRef.current);
    };

    const getResults = () => {
        let attempted = 0, correct = 0, wrong = 0;
        const questions = quizData[currentDept] || [];
        questions.forEach((qObj, idx) => {
            const key = `${currentDept}-${idx}`;
            const userSelection = userAnswers[key];
            if (userSelection !== undefined) {
                attempted++;
                if (userSelection === qObj.ans) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        });
        const score = (correct * 4) - (wrong * 1);
        const totalMarks = questions.length * 4;
        return { attempted, correct, wrong, score, totalMarks, totalQuestions: questions.length };
    };

    if (!isTestStarted) {
        return (
            <div id="login-screen" style={{ overflowY: 'auto', padding: '40px 20px', background: 'var(--bg-color)' }}>
                <div className="selection-container" style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
                    <div className="selection-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h1 style={{ color: 'var(--text-color)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Assessment Center</h1>
                        <p style={{ color: 'var(--text-color)', opacity: '0.6', fontSize: '1.1rem' }}>Select a topic-based mock test to evaluate your knowledge</p>
                    </div>
                    
                    <div className="subject-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {['biotech', 'bba', 'bca'].map(dept => (
                            <div key={dept} className="subject-card" style={{ 
                                background: 'var(--card-bg)', 
                                padding: '25px', 
                                borderRadius: '15px', 
                                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                border: '1px solid var(--border-color)',
                                transition: 'transform 0.3s ease'
                            }}>
                                <div className="dept-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '2px solid var(--accent-color)', paddingBottom: '15px' }}>
                                    <div className="dept-icon" style={{ 
                                        width: '45px', 
                                        height: '45px', 
                                        borderRadius: '10px', 
                                        background: 'var(--accent-color)', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        {dept === 'biotech' ? '🧬' : dept === 'bba' ? '💼' : '💻'}
                                    </div>
                                    <h3 style={{ textTransform: 'uppercase', color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                                        {dept === 'biotech' ? 'Biotechnology' : dept.toUpperCase()}
                                    </h3>
                                </div>

                                {Object.keys(allTests[dept]).length > 0 ? (
                                    Object.entries(allTests[dept]).map(([topic, tests]) => (
                                        <div key={topic} className="topic-group" style={{ marginBottom: '20px' }}>
                                            <h4 style={{ 
                                                fontSize: '0.9rem', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '1px', 
                                                color: 'var(--text-color)', 
                                                opacity: '0.5', 
                                                marginBottom: '12px' 
                                            }}>{topic}</h4>
                                            <div className="test-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {tests.map(test => (
                                                    <button 
                                                        key={test._id}
                                                        onClick={() => startCandidateSession(test)}
                                                        className="test-select-btn"
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px 15px',
                                                            textAlign: 'left',
                                                            background: 'var(--secondary-bg)',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{test.title}</span>
                                                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: 'var(--text-color)', opacity: '0.6' }}>
                                                            <span>⏱ {test.duration} Mins</span>
                                                            <span>📝 {test.questions.length} Qns</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-color)', opacity: '0.4', fontSize: '0.9rem' }}>
                                        No tests available yet
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isTestSubmitted) {
        const { attempted, correct, wrong, score, totalMarks, totalQuestions } = getResults();
        return (
            <div id="result-screen" style={{ display: 'flex' }}>
                <div className="result-card">
                    <h2>📊 Exam Performance Scorecard</h2>
                    <p style={{ color: '#666' }}>{selectedTest.title}</p>
                    <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid #dee2e6' }} />
                    
                    <div className="result-grid">
                        <div className="res-item"><h5>Total Questions</h5><p>{totalQuestions}</p></div>
                        <div className="res-item" style={{ color: '#17a2b8' }}><h5>Attempted</h5><p>{attempted}</p></div>
                        <div className="res-item" style={{ color: '#28a745' }}><h5>Correct Answers</h5><p>{correct}</p></div>
                        <div className="res-item" style={{ color: '#dc3545' }}><h5>Wrong Answers</h5><p>{wrong}</p></div>
                    </div>

                    <div className="score-display">
                        <h3>Final Score Obtained</h3>
                        <h1>{score} / {totalMarks}</h1>
                    </div>
                    <button className="btn-restart" onClick={() => window.location.reload()}>Back to Selection</button>
                </div>
            </div>
        );
    }

    const currentQuestions = quizData[currentDept] || [];
    const activeQuestion = currentQuestions[currentIndex] || { id: '', q: 'Loading...', o: [] };
    const formalTitles = { biotech: "BIOTECHNOLOGY", bba: "BBA (MANAGEMENT)", bca: "BCA (COMPUTER APPLICATIONS)" };

    return (
        <div id="main-test-screen" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <header className="test-header">
                <div className="test-title">{selectedTest.title}</div>
                <div className="header-right">
                    <div>Time Left :- <strong id="countdown-timer">{formatTime(timeLeft)}</strong></div>
                    <div>Candidate: <strong id="nav-candidate-name">{candidateName}</strong></div>
                </div>
            </header>

            <div className="subject-bar">
                <span id="current-subject-title">{formalTitles[currentDept]}</span>
                <span>Paper Pattern: MCQ (+4 / -1)</span>
            </div>

            <div className="meta-strip">
                <span>Qus. No: <strong id="lbl-qus-no">{activeQuestion.id}</strong></span>
                <span>Qus. Type: <strong>MCQ Single Choice</strong></span>
                <span>Marks: <strong style={{ color: '#28a745' }}>(+ve) 4</strong> / <strong style={{ color: '#dc3545' }}>(-ve) 1</strong></span>
            </div>

            <div className="test-window">
                <aside className="subject-sidebar">
                    <div className="sidebar-heading">Test Info</div>
                    <div className="sub-link active-subject">{selectedTest.title}</div>
                    <div style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                        Total Questions: {currentQuestions.length}
                    </div>
                </aside>

                <main className="question-pane">
                    <p className="question-text">{activeQuestion.q}</p>
                    <div className="options-list">
                        {activeQuestion.o.map((optText, idx) => {
                            const key = `${currentDept}-${currentIndex}`;
                            const isChecked = userAnswers[key] === idx;
                            return (
                                <label key={idx} className="option-item">
                                    <input 
                                        type="radio" 
                                        name="cbt-option" 
                                        value={idx} 
                                        checked={isChecked} 
                                        onChange={() => selectOption(idx)} 
                                    /> 
                                    <span>{optText}</span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="pane-actions">
                        <button type="button" className="btn-action btn-review" onClick={markForReview}>Mark for Review</button>
                        <button type="button" className="btn-action btn-clear" onClick={clearSelection}>Clear Response</button>
                        <button type="button" className="btn-action btn-next" onClick={saveAndNext}>Save & Next</button>
                    </div>
                </main>

                <aside className="palette-pane">
                    <div className="palette-header">QUESTIONS PALETTE</div>
                    <div className="numbers-grid">
                        {currentQuestions.map((qObj, idx) => {
                            const statusKey = `${currentDept}-${idx}`;
                            const statusValue = questionStatuses[statusKey];
                            let className = "num-btn";
                            if (idx === currentIndex) className += " active-num";
                            else if (statusValue === 'answered') className += " answered";
                            else if (statusValue === 'review') className += " review-status";
                            else if (statusValue === 'visited' || statusValue === 'not-answered') className += " not-answered";

                            return (
                                <a key={idx} className={className} onClick={() => {
                                    const oldKey = `${currentDept}-${currentIndex}`;
                                    if (userAnswers[oldKey] === undefined && questionStatuses[oldKey] !== 'review') {
                                        setQuestionStatuses(prev => ({ ...prev, [oldKey]: 'not-answered' }));
                                    }
                                    setCurrentIndex(idx);
                                }}>
                                    {qObj.id}
                                </a>
                            );
                        })}
                    </div>
                    <div className="palette-footer">
                        <button className="btn-submit-test" style={{ width: '100%' }} onClick={submitExam}>Submit Full Test</button>
                    </div>
                </aside>
            </div>

            <footer className="test-footer">CBT Examination Module Hub © 2026. All rights reserved.</footer>
        </div>
    );
}

export default Test;
