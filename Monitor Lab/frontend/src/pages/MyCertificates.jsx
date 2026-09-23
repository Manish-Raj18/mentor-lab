import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css_files/certificate.css";

function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/certificate/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCerts(res.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="cert-container">
      <div className="cert-list-head">
        <h1>My Certificates</h1>
        <p>Certificates are awarded when you complete all study material and mock tests of a course.</p>
      </div>

      {loading && <div className="cert-panel cert-loading">Loading certificates…</div>}
      {error && <div className="cert-panel cert-error">Failed to load certificates.</div>}

      {!loading && !error && certs.length === 0 && (
        <div className="cert-panel cert-empty">
          <span className="cert-empty-icon">🎓</span>
          <h3>No certificates yet</h3>
          <p>
            Complete every study note and every mock test of a course (BCA, BBA, or Biotech) to earn
            your certificate.
          </p>
          <Link to="/study-notes" className="cert-btn cert-btn-primary">Start Learning</Link>
        </div>
      )}

      <div className="cert-grid">
        {certs.map((cert) => (
          <div key={cert._id} className="cert-card">
            <div className="cert-card-badge">🎓</div>
            <h3 className="cert-card-course">{cert.course}</h3>
            <p className="cert-card-id">{cert.certificateId}</p>
            <p className="cert-card-date">
              {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            <Link to={`/certificate/${cert._id}`} className="cert-btn cert-btn-primary cert-card-btn">
              View Certificate
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCertificates;