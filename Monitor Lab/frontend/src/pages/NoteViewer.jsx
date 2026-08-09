import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/notesviewer.css";
import { renderPlainText } from "../utils/markdown";

function NoteViewer() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(false);

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
          <Link to="/bca" className="nv-back-btn">&larr; Back to BCA</Link>
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

  return (
    <div className="nv-container">
      <div className="nv-panel">
        <div className="nv-head">
          <Link to="/bca" className="nv-back-btn">&larr; Back</Link>
          {note.course && <span className="nv-course">{note.course}</span>}
        </div>
        <h1 className="nv-title">{note.title}</h1>
        {note.subject && <div className="nv-subject">{note.subject}</div>}
        {note.description && <p className="nv-desc">{note.description}</p>}
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
