import {useRef, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { QRCodeCanvas } from "qrcode.react";
import "../css_files/style.css";
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
 
  <section className="hero">
    <video key="hero-video" autoPlay loop muted playsInline className="hero-video">
      <source src="/frontvideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="hero-left">
      <h1>A complete guide for Students.</h1>
      <p>
     "Empowering learners to turn mirrors into windows."
      </p>
    </div>

    <section className="courses1 hero-courses">
      <h2>Popular Courses</h2>
      <div className="course-container">
        <div className="course-card">
          <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcHV0ZXIlMjBzY2llbmNlfGVufDB8fDB8fHwww=600" alt=""/>
          <h3>Bachelor Of Computer Application</h3>
          <p>Complete preparation course for BCA.</p>
          <Link to="/roadmapbca">
            <button>Explore</button>
          </Link>
        </div>
        <div className="course-card">
          <img src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBzdHVkaWVzfGVufDB8fDB8fHwww=600" alt=""/>
          <h3>Bachelor Of Buisness Administration</h3>
          <p>Complete preparation course for BBA.</p>
          <Link to="/bbaroadmap">
            <button>Explore</button>
          </Link>
        </div>
        <div className="course-card">
          <img src="https://images.unsplash.com/photo-1727091506038-5451111dc2fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=100" alt=""/>
          <h3>Biotechnology</h3>
          <p>Complete preparation course for Biotech.</p>
          <Link to="/biotech">
            <button>Explore</button>
          </Link>
        </div>
      </div>
    </section>

  </section>


  <section className="why-section">
    <div className="why-container">
      <div className="why-head">
        <h2>
          Why Choose <span className="why-gradient">Us?</span>
        </h2>
        <p>Built for serious exam preparation — simple, powerful, and made for you.</p>
      </div>

      <div className="why-grid">

        <Link to="/mock-test" className="why-card" style={{ "--why-accent": "#00f2fe", "--why-soft": "rgba(0,242,254,0.1)", "--why-line": "rgba(0,242,254,0.3)", "--why-glow": "rgba(0,242,254,0.25)" }}>
          <span className="why-card-glow" />
          <span className="why-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </span>
          <h3>Mock Test</h3>
          <p>Practice with our comprehensive mock test engine.</p>
        </Link>

        <Link to="/recorded-lectures" className="why-card" style={{ "--why-accent": "#8a2be2", "--why-soft": "rgba(138,43,226,0.1)", "--why-line": "rgba(138,43,226,0.3)", "--why-glow": "rgba(138,43,226,0.25)" }}>
          <span className="why-card-glow" />
          <span className="why-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/></svg>
          </span>
          <h3>Recorded Lectures</h3>
          <p>Learn from top educators, anytime.</p>
        </Link>

        <Link to="/study-notes" className="why-card" style={{ "--why-accent": "#10b981", "--why-soft": "rgba(16,185,129,0.1)", "--why-line": "rgba(16,185,129,0.3)", "--why-glow": "rgba(16,185,129,0.25)" }}>
          <span className="why-card-glow" />
          <span className="why-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </span>
          <h3>Study Notes</h3>
          <p>Access curated study materials for all courses.</p>
        </Link>

        <Link to="/analytics" className="why-card" style={{ "--why-accent": "#fbbf24", "--why-soft": "rgba(251,191,36,0.1)", "--why-line": "rgba(251,191,36,0.3)", "--why-glow": "rgba(251,191,36,0.25)" }}>
          <span className="why-card-glow" />
          <span className="why-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 13l4-4 3 3 5-6"/></svg>
          </span>
          <h3>Performance Analytics</h3>
          <p>Track your preparation with smart analysis tools.</p>
        </Link>

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
