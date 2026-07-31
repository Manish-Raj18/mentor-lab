import React from 'react';
import '../css_files/about.css';

const team = [
  { name: 'Manish Raj', role: 'Founder & Lead Developer', photo: 'team/MANISH PHOTO.jpg' },
  { name: 'Rashmi Rani', role: 'UI/UX Designer', photo: 'team/rashmi.jpeg' },
  { name: 'Samerjit Kumar Sinha', role: 'Backend Developer', photo: 'team/samerjit.jpeg' },
  { name: 'Abhishek Ranjan', role: 'Content Manager', photo: 'team/abhishek.jpeg' },
  { name: 'Komal Kumari Mahato', role: 'Frontend Developer', photo: 'team/arjun-mehta.svg' },
  { name: 'Babulal Kumar Mahato', role: 'Test Engineer', photo: 'team/sneha-gupta.svg' },
];

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

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <p>The people behind Mentor Lab</p>
        <div className="team-grid">
          {team.map((member) => (
            <div className="team-card" key={member.name}>
              <img src={member.photo} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
