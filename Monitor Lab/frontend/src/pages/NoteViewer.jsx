import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/notesviewer.css";
import { renderPlainText } from "../utils/markdown";

const COURSE_ROUTES = {
  BCA: "/bca",
  BBA: "/bba",
  BIOTECH: "/biotechsylla",
};

function NoteViewer() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    axios
      .get(`/api/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="nv-container">
        <div className="nv-panel nv-missing">
          <h1>Note not found</h1>
          <p>The note you are looking for does not exist or was removed.</p>
          <Link to="/study-notes" className="nv-back-btn">&larr; Back to notes</Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="nv-container">
        <div className="nv-panel nv-loading">Loading note…</div>
      </div>
    );
  }

  const wordCount = (note.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const backRoute = COURSE_ROUTES[(note.course || "").toUpperCase()] || "/study-notes";

  return (
    <div className="nv-container">
      <div className="nv-progress" style={{ width: `${progress}%` }} />
      <div className="nv-panel">
        <div className="nv-head">
          <Link to={backRoute} className="nv-back-btn">&larr; Back</Link>
          {note.course && <span className="nv-course">{note.course}</span>}
        </div>

        <header className="nv-hero">
          <h1 className="nv-title">{note.title}</h1>
          {note.subject && <div className="nv-subject">{note.subject}</div>}
          {note.description && <p className="nv-desc">{note.description}</p>}
          <div className="nv-meta">
            <span className="nv-meta-chip">{wordCount.toLocaleString()} words</span>
            <span className="nv-meta-chip">~{readingTime} min read</span>
          </div>
        </header>

        <hr className="nv-rule" />

        {note.content ? (
          <div
            className="nv-content"
            dangerouslySetInnerHTML={{ __html: renderPlainText(note.content) }}
          />
        ) : (
          <p className="nv-desc">This note has no online content yet.</p>
        )}

        {(note.fileId || note.pdfUrl) && (
          <div className="nv-foot">
            <span className="nv-foot-note">Converted from PDF to a readable web page.</span>
            <a href={`/api/notes/${note._id}/pdf`} target="_blank" rel="noreferrer" className="nv-pdf-btn">
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteViewer;
