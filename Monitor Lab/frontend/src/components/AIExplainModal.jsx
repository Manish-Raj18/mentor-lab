import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../css_files/ai_explain.css";

function AIExplainModal({ subject, course, onClose }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("english");
  const utteranceRef = useRef(null);

  const handleExplain = async () => {
    setLoading(true);
    setExplanation("");
    try {
      const res = await axios.post("http://localhost:5000/api/ai/explain", {
        subject,
        course,
        language,
      });
      setExplanation(res.data.reply);
    } catch (err) {
      setExplanation("Failed to get explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleExplain();
  }, [language]);

  const toggleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const cleanText = explanation.replace(/\*\*(.*?)\*\*/g, "$1").replace(/<[^>]*>/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hindi" ? "hi-IN" : "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
          <div className="ai-modal-header-right">
            <select className="ai-lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="english">English</option>
              <option value="hindi">हिन्दी</option>
            </select>
            <button className="ai-modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="ai-modal-body">
          {loading && (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p>AI is explaining {subject}...</p>
            </div>
          )}
          {explanation && (
            <>
              <div
                className="ai-explanation"
                dangerouslySetInnerHTML={{ __html: formatText(explanation) }}
              />
              <button className="ai-speak-btn" onClick={toggleSpeak}>
                {speaking ? "⏹ Stop" : "🔊 Listen"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIExplainModal;
