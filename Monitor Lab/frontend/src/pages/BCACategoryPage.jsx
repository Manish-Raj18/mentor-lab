import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/bca.css";
import { getCategoryBySlug } from "../data/bcaSubjects";

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

function BCACategoryPage() {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("/api/notes?course=BCA")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getPdfLink = (subjectName) => {
    const normalized = subjectName.toLowerCase();
    const note = notes.find((n) => n.subject && n.subject.toLowerCase() === normalized);
    return note ? `/api/notes/${note._id}/pdf` : null;
  };

  if (!category) {
    return (
      <div className="bca-container">
        <header className="bca-header">
          <h1>Category not found</h1>
          <p>The category you are looking for does not exist.</p>
        </header>
        <div className="bca-cards">
          <Link to="/bca" className="bca-card-link">← Back to BCA Curriculum</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bca-container">
      <header className="bca-cat-header">
        <div className="bca-cat-header-top">
          <Link to="/bca" className="back-btn">&larr; Back</Link>
          <h1>{category.name}</h1>
        </div>
        <p>{category.desc}</p>
      </header>

      <main className="detail-panel">
        <div className="detail-head">
            <span className="detail-icon">{category.icon}</span>
            <div>
              <h2>{category.name}</h2>
              <p>{category.desc}</p>
            </div>
          </div>

          <div className="detail-toolbar">
            <span className="subject-count">{category.items.length} subjects</span>
            <span className="subject-hint">Download study notes as PDF</span>
          </div>

          <ul className="detail-list">
            {category.items.map((item) => {
              const pdfLink = getPdfLink(item);
              return (
                <li key={item}>
                  <span className="subject-dot" />
                  <span className="subject-name">{item}</span>
                  {pdfLink ? (
                    <a href={pdfLink} target="_blank" rel="noreferrer" className="download-link">
                      Download <DownloadIcon />
                    </a>
                  ) : (
                    <span className="soon-badge">Coming Soon</span>
                  )}
                </li>
              );
            })}
          </ul>
        </main>
    </div>
  );
}

export default BCACategoryPage;
