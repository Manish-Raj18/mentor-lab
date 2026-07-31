import { useEffect, useState } from "react";
import axios from "axios";
import "../css_files/bca.css";

const subjects = [
  { section: "Programming Languages", icon: "💻", items: ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "HTML & Web Design", "JavaScript", "CSS Styling"] },
  { section: "Logical Subjects", icon: "🧠", items: ["Database Management System", "Data Structures & Algorithms", "Operating Systems", "System Analysis & Design", "Computer Architecture", "Design & Analysis of Algorithms", "Computer Networks"] },
  { section: "Mathematics Subjects", icon: "📊", items: ["Differential Calculus", "Integral Calculus", "Differential Equations", "Abstract Algebra", "Linear Algebra", "Matrix Algebra", "Analytical Geometry (3D)", "Probability Theory", "Probability Distributions", "Statistics & Central Tendency", "Measures of Variation", "Correlation Analysis", "Regression Analysis", "Sampling Distribution"], mathCard: true },
];

function BCA() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("/api/notes?course=BCA")
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  const getPdfLink = (subjectName) => {
    const normalized = subjectName.toLowerCase();
    const note = notes.find(n => n.subject && n.subject.toLowerCase() === normalized);
    return note ? `/api/notes/${note._id}/pdf` : null;
  };

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
              {section.items.map((item) => {
                const pdfLink = getPdfLink(item);
                return (
                  <li key={item} className="syllabus-item">
                    {pdfLink ? (
                      <a href={pdfLink} target="_blank" rel="noreferrer">{item}</a>
                    ) : (
                      <span style={{ color: "var(--text-color)", opacity: 0.6 }}>{item}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default BCA;