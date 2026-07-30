import { useState } from "react";
import axios from "axios";
import "../css_files/study.css";

const categories = [
  { section: "Management & Strategy", icon: "♟", items: ["Principles of Management", "Organizational Behaviour", "Human Resource Management", "Strategic Management", "Business Ethics & Governance", "Entrepreneurship Development"] },
  { section: "Finance & Accounts", icon: "📊", items: ["Financial Accounting", "Cost Accounting", "Corporate Accounting", "Management Accounting", "Financial Management", "Income Tax Law & Practice"] },
  { section: "Analytics & Tech", icon: "🔢", items: ["Business Mathematics", "Business Statistics", "Research Methodology", "Operations Research", "Computer Applications & IT", "Management Information Systems"] },
  { section: "Marketing Dynamics", icon: "📣", items: ["Principles of Marketing", "Marketing Management", "Consumer Behavior Analysis", "E-Commerce & Digital Business", "International Business & EXIM"] },
  { section: "Environment & Law", icon: "⚖️", items: ["Microeconomics", "Macroeconomics", "Business Environment", "Business Law / Legal Aspects", "Environmental Studies & CSR"] },
  { section: "Operations & Practice", icon: "⚙️", items: ["Production & Operations Mgmt", "Logistics & Supply Chain", "Business Communication", "Corporate Summer Internship", "Final Capstone Project & Viva"] },
];

function BBA() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("english");
  const [uploading, setUploading] = useState(false);

  const handleExplain = async (subject, lang) => {
    const useLang = lang || language;
    setSelectedSubject(subject);
    setExplanation("");
    setLoading(true);
    window.speechSynthesis.cancel();
    setSpeaking(false);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/explain", {
        subject,
        course: "BBA",
        language: useLang,
      });
      setExplanation(res.data.reply);
    } catch {
      setExplanation("Failed to get explanation.");
    } finally {
      setLoading(false);
    }
  };

  const speakBrowser = (text, lang, done) => {
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.9;
      const v = voices.find(x => x.lang.startsWith(lang.split('-')[0]));
      if (v) u.voice = v;
      u.onend = done; u.onerror = done;
      setTimeout(() => window.speechSynthesis.speak(u), 100);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; setTimeout(trySpeak, 200); };
    } else {
      trySpeak();
    }
  };

  const playTtsChunks = async (text, done) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += 180) {
      let end = Math.min(i + 180, text.length);
      if (end < text.length) { const b = text.lastIndexOf(" ", end); if (b > i) end = b; }
      chunks.push(text.substring(i, end).trim());
    }
    const play = async (idx) => {
      if (idx >= chunks.length) { done(); return; }
      try {
        const r = await axios.post("http://localhost:5000/api/ai/tts", { text: chunks[idx], lang: "hindi" }, { responseType: "blob" });
        const a = new Audio(URL.createObjectURL(r.data));
        a.onended = () => { URL.revokeObjectURL(a.src); play(idx + 1); };
        a.onerror = () => { URL.revokeObjectURL(a.src); play(idx + 1); };
        a.play().catch(done);
      } catch { done(); }
    };
    play(0);
  };

  const toggleSpeak = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const cleanText = explanation.replace(/\*\*(.*?)\*\*/g, "$1").replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, "").trim();
    if (!cleanText) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    if (language === "english") {
      speakBrowser(cleanText, "en-US", () => setSpeaking(false));
    } else {
      playTtsChunks(cleanText, () => speakBrowser(cleanText, "hi-IN", () => setSpeaking(false)));
    }
  };

  const handlePdfUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/explain-pdf", formData);
      handleExplain(res.data.subject || file.name);
    } catch {
      alert("Failed to process PDF.");
    } finally {
      setUploading(false);
    }
  };

  const [compactInput, setCompactInput] = useState("");

  const handleCompactAsk = () => {
    if (compactInput.trim()) {
      handleExplain(compactInput.trim());
      setCompactInput("");
    }
  };

  const closeSidebar = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSelectedSubject(null);
    setExplanation("");
  };

  return (
    <div className="study-container">
      <header className="study-header">
        <h1>BBA Curriculum</h1>
        <p>Your comprehensive route to business mastery and strategic excellence.</p>
      </header>

      <div className="study-layout">
        <div className="subjects-grid bba-grid">
          {categories.map((cat) => (
            <section key={cat.section} className="subject-card">
              <span className="card-icon">{cat.icon}</span>
              <h2>{cat.section}</h2>
              <ul className="subject-list">
                {cat.items.map((item) => (
                  <li key={item} className="syllabus-item">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {selectedSubject ? (
          <div className="ai-sidebar">
            <div className="ai-sidebar-header">
              <span>{selectedSubject}</span>
              <button className="ai-sidebar-close" onClick={closeSidebar}>&times;</button>
            </div>
            <div className="ai-sidebar-lang">
              <select value={language} onChange={(e) => { const l = e.target.value; setLanguage(l); if (selectedSubject) handleExplain(selectedSubject, l); }}>
                <option value="english">English</option>
                <option value="hindi">हिन्दी</option>
              </select>
            </div>
            <div className="ai-sidebar-body">
              {loading && <div className="ai-loading"><div className="ai-spinner"></div><p>Explaining...</p></div>}
              {!loading && explanation && (
                <div className="ai-sidebar-text" dangerouslySetInnerHTML={{ __html: explanation.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
              )}
            </div>
            {!loading && explanation && (
              <button className="ai-speak-btn" onClick={toggleSpeak}>
                {speaking ? "⏹ Stop" : "🔊 Listen"}
              </button>
            )}
          </div>
        ) : (
          <div className="ai-compact">
            <div className="ai-compact-header">
              <span>🤖</span>
              <span>Ask AI</span>
            </div>
            <input
              className="ai-compact-input"
              placeholder="Type a topic..."
              value={compactInput}
              onChange={(e) => setCompactInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCompactAsk(); }}
            />
            <div className="ai-compact-actions">
              <button className="ai-compact-ask" onClick={handleCompactAsk}>Ask</button>
              <label className="ai-compact-upload">
                📄
                <input
                  type="file"
                  accept=".pdf"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePdfUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BBA;
