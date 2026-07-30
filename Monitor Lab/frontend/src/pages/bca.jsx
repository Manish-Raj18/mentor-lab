import { useState } from "react";
import axios from "axios";
import "../css_files/study.css";

const subjects = [
  { section: "Programming Languages", icon: "💻", items: ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "HTML & Web Design", "JavaScript", "CSS Styling"] },
  { section: "Logical Subjects", icon: "🧠", items: ["Database Management System", "Data Structures & Algorithms", "Operating Systems", "System Analysis & Design", "Computer Architecture", "Design & Analysis of Algorithms", "Computer Networks"] },
  { section: "Mathematics Subjects", icon: "📊", items: ["Differential Calculus", "Integral Calculus", "Differential Equations", "Abstract Algebra", "Linear Algebra", "Matrix Algebra", "Analytical Geometry (3D)", "Probability Theory", "Probability Distributions", "Statistics & Central Tendency", "Measures of Variation", "Correlation Analysis", "Regression Analysis", "Sampling Distribution"] },
];

function BCA() {
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
        course: "BCA",
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
        <h1>BCA Curriculum</h1>
        <p>Explore the comprehensive guide to subjects and programming languages for Bachelor of Computer Applications.</p>
      </header>

      <div className="study-layout">
        <div className="subjects-grid">
          {subjects.map((section) => (
            <section key={section.section} className="subject-card">
              <span className="card-icon">{section.icon}</span>
              <h2>{section.section}</h2>
              <ul className="subject-list">
                {section.items.map((item) => (
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

export default BCA;
