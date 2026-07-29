import { useState } from "react";
import "../css_files/bca.css";
import AIExplainModal from "../components/AIExplainModal";

const subjects = [
  { section: "Programming Languages", icon: "💻", items: ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "HTML & Web Design", "JavaScript", "CSS Styling"] },
  { section: "Logical Subjects", icon: "🧠", items: ["Database Management System", "Data Structures & Algorithms", "Operating Systems", "System Analysis & Design", "Computer Architecture", "Design & Analysis of Algorithms", "Computer Networks"] },
  { section: "Mathematics Subjects", icon: "📊", items: ["Differential Calculus", "Integral Calculus", "Differential Equations", "Abstract Algebra", "Linear Algebra", "Matrix Algebra", "Analytical Geometry (3D)", "Probability Theory", "Probability Distributions", "Statistics & Central Tendency", "Measures of Variation", "Correlation Analysis", "Regression Analysis", "Sampling Distribution"], mathCard: true },
];

function BCA() {
  const [explainSubject, setExplainSubject] = useState(null);

  return (
    <div className="bca-container">
      <header className="bca-header">
        <h1>BCA Curriculum</h1>
        <p>Explore the comprehensive guide to subjects and programming languages for Bachelor of Computer Applications.</p>
      </header>

      <div className="subjects-grid">
        {subjects.map((section) => (
          <section key={section.section} className={`subject-card ${section.mathCard ? "math-card" : ""}`}>
            <span className="card-icon">{section.icon}</span>
            <h2>{section.section}</h2>
            <ul className="subject-list">
              {section.items.map((item) => (
                <li key={item} className="syllabus-item">
                  <a href="#">{item}</a>
                  <button className="ai-explain-btn-sm" onClick={() => setExplainSubject(item)}>AI Explain</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {explainSubject && (
        <AIExplainModal subject={explainSubject} course="BCA" onClose={() => setExplainSubject(null)} />
      )}
    </div>
  );
}

export default BCA;
