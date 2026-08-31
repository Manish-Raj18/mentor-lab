import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css_files/mock.css";

const API_BASE = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const TestReview = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`${API_BASE}/mocktest/result/${resultId}`, {
          headers: getAuthHeaders(),
        });
        setReviewData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [resultId]);

  if (loading) {
    return (
      <div className="review-container">
        <p style={{ textAlign: "center", color: "var(--text-color)", padding: "3rem" }}>Loading review...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-container">
        <div className="review-card">
          <h2 style={{ color: "#dc3545" }}>Error</h2>
          <p style={{ color: "var(--text-color)" }}>{error}</p>
          <button className="btn-restart" onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!reviewData) return null;

  const { result, questions } = reviewData;

  return (
    <div className="review-container">
      <div className="review-card">
        <button className="review-back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <h2 className="review-title">Answer Review: {result.title}</h2>
        <hr className="review-divider" />

        {/* Summary */}
        <div className="review-summary">
          <div className="review-summary-item">
            <span className="review-summary-label">Score</span>
            <span className="review-summary-value">{result.score} / {result.maxScore}</span>
          </div>
          <div className="review-summary-item">
            <span className="review-summary-label">Attempted</span>
            <span className="review-summary-value" style={{ color: "#17a2b8" }}>{result.attempted}</span>
          </div>
          <div className="review-summary-item">
            <span className="review-summary-label">Correct</span>
            <span className="review-summary-value" style={{ color: "#28a745" }}>{result.correct}</span>
          </div>
          <div className="review-summary-item">
            <span className="review-summary-label">Wrong</span>
            <span className="review-summary-value" style={{ color: "#dc3545" }}>{result.wrong}</span>
          </div>
          <div className="review-summary-item">
            <span className="review-summary-label">Unattempted</span>
            <span className="review-summary-value" style={{ color: "#6c757d" }}>{questions.length - result.attempted}</span>
          </div>
        </div>

        {/* Questions */}
        <div className="review-questions">
          {questions.map((q) => {
            const answer = result.answers.find(a => a.questionIndex === q.questionIndex);
            const selectedIdx = answer?.selectedOption ?? -1;
            const isCorrect = answer?.isCorrect ?? false;
            const attempted = selectedIdx >= 0;

            return (
              <div key={q.questionIndex} className={`review-question-card ${attempted ? (isCorrect ? 'review-correct' : 'review-wrong') : 'review-unattempted'}`}>
                <div className="review-question-header">
                  <span className="review-question-number">Q{q.questionIndex + 1}</span>
                  <span className={`review-badge ${attempted ? (isCorrect ? 'badge-correct' : 'badge-wrong') : 'badge-unattempted'}`}>
                    {attempted ? (isCorrect ? 'Correct' : 'Wrong') : 'Unattempted'}
                  </span>
                </div>
                <p className="review-question-text">{q.question}</p>
                <div className="review-options">
                  {q.options.map((opt, optIdx) => {
                    const isThisCorrect = opt === q.correctAnswer;
                    const isThisSelected = optIdx === selectedIdx;
                    let optClass = 'review-option';
                    if (isThisCorrect) optClass += ' correct-option';
                    if (isThisSelected && !isThisCorrect) optClass += ' wrong-selected';
                    if (isThisSelected && isThisCorrect) optClass += ' correct-selected';

                    return (
                      <div key={optIdx} className={optClass}>
                        <span className="review-option-letter">{String.fromCharCode(65 + optIdx)}</span>
                        <span className="review-option-text">{opt}</span>
                        {isThisCorrect && <span className="review-option-tag correct-tag">&#10003; Correct Answer</span>}
                        {isThisSelected && !isThisCorrect && <span className="review-option-tag wrong-tag">&#10007; Your Answer</span>}
                        {isThisSelected && isThisCorrect && <span className="review-option-tag correct-tag">&#10007; Your Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-restart" onClick={() => navigate('/mock-test')} style={{ marginTop: "1.5rem" }}>
          Back to Mock Tests
        </button>
      </div>
    </div>
  );
};

export default TestReview;
