import { useState } from "react";
import axios from "axios";
import "../css_files/ai_explain.css";

function AIExplainModal({ subject, course, onClose }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    setExplanation("");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/explain", {
        subject,
        course,
      });
      setExplanation(res.data.reply);
    } catch (err) {
      setExplanation("Failed to get explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h2>AI Explain: {subject}</h2>
          <button className="ai-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="ai-modal-body">
          {!explanation && !loading && (
            <div className="ai-modal-start">
              <p>Click below to get AI explanation with important points.</p>
              <button className="ai-explain-btn" onClick={handleExplain}>
                Explain Now
              </button>
            </div>
          )}
          {loading && (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p>AI is explaining {subject}...</p>
            </div>
          )}
          {explanation && (
            <div
              className="ai-explanation"
              dangerouslySetInnerHTML={{ __html: formatText(explanation) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AIExplainModal;
