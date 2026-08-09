import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/bca.css";
import { getBiotechCategoryBySlug } from "../data/biotechCategories";

function BiotechCategoryPage() {
  const { categorySlug } = useParams();
  const category = getBiotechCategoryBySlug(categorySlug);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("/api/notes?course=BIOTECH")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getNoteForSubject = (subjectName) => {
    const normalized = subjectName.toLowerCase();
    return notes.find((n) => n.subject && n.subject.toLowerCase() === normalized);
  };

  if (!category) {
    return (
      <div className="bca-container biotech-bg">
        <header className="bca-header">
          <h1>Category not found</h1>
          <p>The category you are looking for does not exist.</p>
        </header>
        <div className="bca-cards">
          <Link to="/biotechsylla" className="bca-card-link">← Back to Biotechnology Syllabus</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bca-container biotech-bg">
      <header className="bca-cat-header">
        <div className="bca-cat-header-top">
          <Link to="/biotechsylla" className="back-btn">&larr; Back</Link>
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
          <span className="subject-hint">Read study notes online or download as PDF</span>
        </div>

        <ul className="detail-list">
          {category.items.map((item) => {
            const note = getNoteForSubject(item);
            return (
              <li key={item}>
                <span className="subject-dot" />
                <span className="subject-name">{item}</span>
                {note ? (
                  <span className="note-actions">
                    {(note.fileId || note.pdfUrl || note.hasContent) && (
                      <Link to={`/notes/${note._id}`} className="download-link">
                        Read Online
                      </Link>
                    )}
                    {(note.fileId || note.pdfUrl) && (
                      <a href={`/api/notes/${note._id}/pdf`} target="_blank" rel="noreferrer" className="download-link pdf-only">
                        PDF
                      </a>
                    )}
                  </span>
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

export default BiotechCategoryPage;
