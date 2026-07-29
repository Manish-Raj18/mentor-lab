import React from 'react';
import { Link } from 'react-router-dom';
import '../css_files/about.css';
import ReviewSection from "../components/ReviewSection";

function AboutUs() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Mentor Lab</h1>
        <p>Empowering students to gain and enhance their knowledge</p>
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

      <section className="about-cta">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of students already learning on Mentor Lab</p>
        <Link to="/" className="cta-button">Get Started</Link>
      </section>
      <ReviewSection targetType="about" />
    </div>
  );
}

export default AboutUs;
