import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../css_files/certificate.css";

function CertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`/api/certificate/${id}`, { headers })
      .then((res) => setCert(res.data))
      .catch(() => setError(true));

    axios
      .get(`/api/auth/profile`, { headers })
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, [id]);

  if (error) {
    return (
      <div className="cert-container">
        <div className="cert-panel cert-missing">
          <h2>Certificate not found</h2>
          <p>This certificate does not belong to your account or no longer exists.</p>
          <Link to="/profile" className="cert-btn">&larr; Back to Profile</Link>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="cert-container">
        <div className="cert-panel cert-loading">Loading certificate…</div>
      </div>
    );
  }

  const issued = new Date(cert.issuedAt);
  const fullName = cert.studentName || user?.name || "Student";
  const email = cert.email || user?.email || "";
  const phone = cert.phone || user?.phone || "";
  const studentId = cert.studentId || user?.studentId || "";
  const college = cert.college || user?.college || "";
  const displayPhone = phone ? (phone.startsWith("+") ? phone : `+${phone}`) : "";

  return (
    <div className="cert-container">
      <div className="cert-actions">
        <Link to="/profile" className="cert-btn">← My Certificates</Link>
        <button className="cert-btn cert-btn-primary" onClick={() => window.print()}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div className="certificate" id="print-certificate">
        <div className="cert-border">
          <div className="cert-inner">
            <div className="cert-header">
              <div className="cert-brand-block">
                <span className="cert-emblem">📘</span>
                <h1 className="cert-brand-big">MENTOR LAB</h1>
                <p className="cert-tagline">"Empowering learners to turn mirrors into windows."</p>
              </div>
            </div>

            <table className="cert-details">
              <tbody>
                <tr>
                  <td className="cert-detail-label">Student Name</td>
                  <td className="cert-detail-value">{fullName}</td>
                </tr>
                {college && (
                  <tr>
                    <td className="cert-detail-label">College</td>
                    <td className="cert-detail-value">{college}</td>
                  </tr>
                )}
                {studentId && (
                  <tr>
                    <td className="cert-detail-label">Student ID</td>
                    <td className="cert-detail-value">{studentId}</td>
                  </tr>
                )}
                {email && (
                  <tr>
                    <td className="cert-detail-label">Email</td>
                    <td className="cert-detail-value">{email}</td>
                  </tr>
                )}
                {displayPhone && (
                  <tr>
                    <td className="cert-detail-label">Mobile</td>
                    <td className="cert-detail-value">{displayPhone}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="cert-body">
              <h2 className="cert-title">Certificate of Course Completion</h2>
              <p className="cert-subtitle">This is to proudly certify that</p>
              <div className="cert-name">{fullName}</div>
              <p className="cert-desc">has successfully completed the entire course of</p>
              <div className="cert-course">{cert.course}</div>
              <p className="cert-desc cert-check">
                ✅ All study notes read &nbsp;•&nbsp; ✅ All mock tests attempted
              </p>
            </div>

            <div className="cert-footer">
              <div className="cert-sign-block">
                <div className="cert-sign-line"></div>
                <span className="cert-sign-label">Authorized Signatory</span>
              </div>
              <div className="cert-meta">
                <span>Certificate ID</span>
                <strong>{cert.certificateId}</strong>
              </div>
              <div className="cert-meta">
                <span>Date Issued</span>
                <strong>{issued.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;