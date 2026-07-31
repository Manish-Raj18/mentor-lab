import { useEffect, useState } from "react";
import axios from "axios";
import "../css_files/bba.css";

const categories = [
  { title: "Management & Strategy", icon: "♟", cssClass: "card-mgmt", items: ["Principles of Management", "Organizational Behaviour", "Human Resource Management", "Strategic Management", "Business Ethics & Governance", "Entrepreneurship Development"] },
  { title: "Finance & Accounts", icon: "📊", cssClass: "card-fin", items: ["Financial Accounting", "Cost Accounting", "Corporate Accounting", "Management Accounting", "Financial Management", "Income Tax Law & Practice"] },
  { title: "Analytics & Tech", icon: "🔢", cssClass: "card-analytics", items: ["Business Mathematics", "Business Statistics", "Research Methodology", "Operations Research", "Computer Applications & IT", "Management Information Systems"] },
  { title: "Marketing Dynamics", icon: "📣", cssClass: "card-mktg", items: ["Principles of Marketing", "Marketing Management", "Consumer Behavior Analysis", "E-Commerce & Digital Business", "International Business & EXIM"] },
  { title: "Environment & Law", icon: "⚖️", cssClass: "card-eco", items: ["Microeconomics", "Macroeconomics", "Business Environment", "Business Law / Legal Aspects", "Environmental Studies & CSR"] },
  { title: "Operations & Practice", icon: "⚙️", cssClass: "card-ops", items: ["Production & Operations Mgmt", "Logistics & Supply Chain", "Business Communication", "Corporate Summer Internship", "Final Capstone Project & Viva"] },
];

function BBA() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/notes?course=BBA")
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  const getPdfLink = (subjectName) => {
    const note = notes.find(n => n.subject === subjectName);
    return note ? `http://localhost:5000/uploads/${note.pdfUrl}` : null;
  };

  return (
    <div className="bba-container">
      <header className="bba-header">
        <h1>BBA Curriculum</h1>
        <p>Your comprehensive route to business mastery and strategic excellence.</p>
      </header>

      <div className="syllabus-grid">
        {categories.map((cat) => (
          <section key={cat.title} className={`category-card ${cat.cssClass}`}>
            <div className="category-header">
              <span className="category-icon">{cat.icon}</span>
              <h2 className="category-title">{cat.title}</h2>
            </div>
            <ul className="subject-list">
              {cat.items.map((item) => {
                const pdfLink = getPdfLink(item);
                return (
                  <li key={item} className="subject-item">
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

export default BBA;