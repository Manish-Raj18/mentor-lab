import {useRef, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react";
import "../css_files/style.css";
import "../css_files/home.css";

function Home() {
  const qrRef = useRef(null);

  const registerUrl = `${window.location.origin}/signup?ref=qr`;

  useEffect(() => {
    if (window.location.hash === "#qr-register") {
      document.getElementById("qr-register")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const downloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "mentor-lab-register-qr.png";
    link.click();
  };

  return (
    <div className="home">

      <section className="lp-hero">

        <video autoPlay loop muted playsInline className="lp-hero-video">
          <source src="/frontvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <span className="lp-orb lp-orb-a" />
        <span className="lp-orb lp-orb-b" />
        <span className="lp-orb lp-orb-c" />

        <div className="lp-brand">
          <h1 className="lp-hero-title">
            A complete guide <span className="lp-gradient">for Students.</span>
          </h1>
          <p className="lp-hero-sub">
            "Empowering learners to turn mirrors into windows."
          </p>
          <div className="lp-ctas">
            <Link to="/mock-test" className="lp-cta lp-cta-primary">
              Start Practicing
            </Link>
            <a href="#courses" className="lp-cta lp-cta-ghost">
              Browse Courses
            </a>
          </div>
        </div>

        <div className="why-section">
          <div className="why-container">
            <div className="why-head">
              <h2 className="why-big-title">
                Why Choose <span className="why-gradient">Us?</span>
              </h2>
              <p className="why-sub">Built for serious exam preparation — simple, powerful, and made for you.</p>
            </div>

            <div className="why-grid">

              <Link to="/mock-test" className="why-card" style={{ "--why-accent": "#00f2fe", "--why-soft": "rgba(0,242,254,0.1)", "--why-line": "rgba(0,242,254,0.3)", "--why-glow": "rgba(0,242,254,0.25)" }}>
                <span className="why-card-glow" />
                <span className="why-icon why-icon-img">
                  <img src="/icons/icon-mocktest.png" alt="Mock Test" />
                </span>
              </Link>

              <Link to="/recorded-lectures" className="why-card" style={{ "--why-accent": "#8a2be2", "--why-soft": "rgba(138,43,226,0.1)", "--why-line": "rgba(138,43,226,0.3)", "--why-glow": "rgba(138,43,226,0.25)" }}>
                <span className="why-card-glow" />
                <span className="why-icon why-icon-img">
                  <img src="/icons/icon-recorded.png" alt="Recorded Lectures" />
                </span>
              </Link>

              <Link to="/study-notes" className="why-card" style={{ "--why-accent": "#10b981", "--why-soft": "rgba(16,185,129,0.1)", "--why-line": "rgba(16,185,129,0.3)", "--why-glow": "rgba(16,185,129,0.25)" }}>
                <span className="why-card-glow" />
                <span className="why-icon why-icon-img">
                  <img src="/icons/icon-notes.png" alt="Study Notes" />
                </span>
              </Link>

              <Link to="/analytics" className="why-card" style={{ "--why-accent": "#fbbf24", "--why-soft": "rgba(251,191,36,0.1)", "--why-line": "rgba(251,191,36,0.3)", "--why-glow": "rgba(251,191,36,0.25)" }}>
                <span className="why-card-glow" />
                <span className="why-icon why-icon-img">
                  <img src="/icons/icon-analytics.png" alt="Performance Analytics" />
                </span>
              </Link>

            </div>
          </div>
        </div>

      </section>

      <section id="courses" className="lp-courses">
        <div className="lp-course-head">
          <h2>Popular Courses</h2>
          <p>Hand-picked programs to take you from confusion to confidence.</p>
        </div>

        <div className="lp-course-grid">

          <div className="lp-course-card">
            <div className="lp-course-media">
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcHV0ZXIlMjBzY2llbmNlfGVufDB8fDB8fHwww=600" alt=""/>
              <span className="lp-course-badge">Computer Science</span>
            </div>
            <div className="lp-course-body">
              <h3 className="lp-course-title">Bachelor of Computer Applications (BCA)</h3>
              <p className="lp-course-desc">Complete preparation course covering programming, databases, and core CS fundamentals.</p>
              <div className="lp-course-meta">
                <span><i className="lp-course-dot" />42 Mock Tests</span>
                <span><i className="lp-course-dot" />6 Months Access</span>
              </div>
              <Link to="/roadmapbca" className="lp-course-btn">Explore — BCA Roadmap</Link>
            </div>
          </div>

          <div className="lp-course-card">
            <div className="lp-course-media">
              <img src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBzdHVkaWVzfGVufDB8fDB8fHwww=600" alt=""/>
              <span className="lp-course-badge">Business Studies</span>
            </div>
            <div className="lp-course-body">
              <h3 className="lp-course-title">Bachelor of Business Administration (BBA)</h3>
              <p className="lp-course-desc">Master management, marketing, and leadership with a structured learning roadmap.</p>
              <div className="lp-course-meta">
                <span><i className="lp-course-dot" />34 Mock Tests</span>
                <span><i className="lp-course-dot" />6 Months Access</span>
              </div>
              <Link to="/bbaroadmap" className="lp-course-btn">Explore — BBA Roadmap</Link>
            </div>
          </div>

          <div className="lp-course-card">
            <div className="lp-course-media">
              <img src="https://images.unsplash.com/photo-1727091506038-5451111dc2fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=100" alt=""/>
              <span className="lp-course-badge">Life Sciences</span>
            </div>
            <div className="lp-course-body">
              <h3 className="lp-course-title">Biotechnology</h3>
              <p className="lp-course-desc">From molecular biology to practical lab concepts — a complete Biotech prep program.</p>
              <div className="lp-course-meta">
                <span><i className="lp-course-dot" />28 Mock Tests</span>
                <span><i className="lp-course-dot" />6 Months Access</span>
              </div>
              <Link to="/biotech" className="lp-course-btn">Explore — Biotech</Link>
            </div>
          </div>

        </div>
      </section>

      <section id="qr-register" className="qr-section" style={{
        padding: "3.5rem 1.2rem",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "14px",
          padding: "2.2rem 2.4rem",
          textAlign: "center",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{ margin: 0, color: "var(--accent-color)", fontSize: "1.6rem" }}>Scan to Register</h2>
          <p style={{ color: "var(--text-color, #555)", opacity: 0.75, margin: "0.5rem 0 1.2rem", fontSize: "0.9rem" }}>
            QR scan karein aur seedha register ho jayein.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
            <div style={{
              background: "#fff",
              padding: "0.8rem",
              borderRadius: "10px",
              border: "1px solid #ddd",
              display: "inline-block",
            }}>
              <QRCodeCanvas
                ref={qrRef}
                value={registerUrl}
                size={200}
                level="M"
                marginSize={0}
              />
            </div>
            <p style={{ margin: 0, color: "var(--text-color, #555)", fontWeight: 600, fontSize: "0.9rem" }}>
              Scan this to Register
            </p>
            <button
              onClick={downloadQR}
              style={{
                background: "none",
                border: "1px solid var(--accent-color)",
                color: "var(--accent-color)",
                borderRadius: "8px",
                padding: "0.5rem 1.2rem",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ⬇ Download QR (PNG)
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 MENTOR LAB. All Rights Reserved.</p>
      </footer>

    </div>
  )
}

export default Home