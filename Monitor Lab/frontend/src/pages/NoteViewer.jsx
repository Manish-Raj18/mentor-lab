import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/notesviewer.css";
import { renderPlainText, extractHeadings } from "../utils/markdown";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const headingEls = useRef([]);

  const headings = useMemo(
    () => (note ? extractHeadings(note.content || "") : []),
    [note]
  );

  useEffect(() => {
    headingEls.current = headings.map((_, i) => document.getElementById(`nv-sec-${i}`));
  }, [headings]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      let current = -1;
      for (let i = 0; i < headingEls.current.length; i++) {
        const el = headingEls.current[i];
        if (el && el.getBoundingClientRect().top <= 120) current = i;
      }
      setActiveIndex(current);
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

  const jumpTo = (index) => {
    document.getElementById(`nv-sec-${index}`)?.scrollIntoView({ behavior: "smooth" });
  };

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

  const renderToc = () => (
    <nav className="nv-toc">
      <div className="nv-toc-head">
        <span className="nv-toc-title">Units</span>
      </div>
      <ul className="nv-toc-list">
        {headings.map((h, i) => (
          <li key={i} className={`nv-toc-item nv-toc-l${h.level}`}>
            <a
              href={`#nv-sec-${i}`}
              className={activeIndex === i ? "nv-toc-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(i);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="nv-container">
      <div className="nv-progress" style={{ width: `${progress}%` }} />

      <div className="nv-layout">
        <article className="nv-panel">
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
              {headings.length > 0 && (
                <span className="nv-meta-chip">{headings.filter((h) => h.level === 2).length} units</span>
              )}
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
        </article>

        {headings.length > 0 && renderToc()}
      </div>
    </div>
  );
}

export default NoteViewer;
