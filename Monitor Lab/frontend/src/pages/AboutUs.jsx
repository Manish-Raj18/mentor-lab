import React from 'react';
import { Link } from 'react-router-dom';
import '../css_files/about.css';

const team = [
  { name: 'Manish Raj', role: 'Founder & Lead Developer', photo: 'team/MANISH PHOTO.jpg' },
  { name: 'Rashmi Rani', role: 'UI/UX Designer', photo: 'team/rashmi1.jpeg' },
  { name: 'Samerjit Kumar Sinha', role: 'Backend Developer', photo: 'team/samerjit.png' },
  { name: 'Abhishek Ranjan', role: 'Content Manager', photo: 'team/abhishek.jpeg' },
  { name: 'Komal Kumari Mahato', role: 'Frontend Developer', photo: 'team/komal.jpeg' },
  { name: 'Babulal Kumar Mahato', role: 'Test Engineer', photo: 'team/gds-photo-30kb.jpg' },
];

const stats = [
  { value: 'BCA, BBA & Biotech', label: 'Programs Covered' },
  { value: '100%', label: 'Free Learning Resources' },
  { value: '24/7', label: 'Learning at Your Pace' },
  { value: '1 Goal', label: 'Every Student Succeeds' },
];

const values = [
  { icon: '🌍', title: 'Accessible Education', text: 'Quality learning should be within reach of every student, regardless of background.' },
  { icon: '🔬', title: 'Expert-Driven Content', text: 'Every note, lecture and roadmap is crafted by experienced educators and reviewers.' },
  { icon: '⚡', title: 'Continuous Innovation', text: 'We constantly refine our platform to make learning smarter, faster and more engaging.' },
];

function AboutUs() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-badge">Mentor Lab</span>
          <h1>
            Empowering Every Student to <span className="gradient-text">Learn, Grow & Succeed</span>
          </h1>
          <p className="about-hero-sub">
            Mentor Lab is an education platform dedicated to helping students gain and enhance their
            knowledge through structured study materials, recorded lectures and personalised roadmaps.
          </p>
          <div className="about-hero-stats">
            {stats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="about-card">
          <div className="about-icon">🎓</div>
          <h3>Our Mission</h3>
          <p>
            Mentor Lab is an education platform dedicated to helping students excel in their
            academic journey. We provide comprehensive study materials, recorded lectures,
            and assessment tools to ensure effective learning.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon">📚</div>
          <h3>What We Offer</h3>
          <ul>
            <li>Structured syllabus for BCA, BBA, and Biotechnology programs</li>
            <li>Study notes curated by experienced educators</li>
            <li>Recorded lectures for flexible learning at your own pace</li>
            <li>Personalized roadmaps to guide your career path</li>
          </ul>
        </div>

        <div className="about-card">
          <div className="about-icon">🤝</div>
          <h3>Why Choose Us</h3>
          <p>
            We believe every student deserves access to quality education. Our platform
            combines technology with expert guidance to create an interactive and
            engaging learning experience that adapts to your needs.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-head">
          <span className="about-section-tag">Our Values</span>
          <h2>What Drives Us Forward</h2>
          <p>The principles that shape everything we build at Mentor Lab.</p>
        </div>
        <div className="values-grid">
          {values.map((value) => (
            <div className="value-card" key={value.title}>
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-team">
        <div className="about-section-head">
          <span className="about-section-tag">Our Team</span>
          <h2>Meet the People Behind Mentor Lab</h2>
          <p>A passionate group of developers, designers and educators building the future of learning.</p>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="team-photo-wrap">
                <img src={member.photo} alt={member.name} className="team-photo" />
                <div className="team-overlay">
                  <span>Member of the Mentor Lab family</span>
                </div>
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div className="cta-inner">
          <h2>Ready to Start Learning?</h2>
          <p>Explore our structured roadmaps, study notes and recorded lectures today.</p>
          <div className="cta-actions">
            <Link to="/" className="cta-btn cta-btn-primary">Get Started</Link>
            <Link to="/study-notes" className="cta-btn cta-btn-secondary">Browse Notes</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
