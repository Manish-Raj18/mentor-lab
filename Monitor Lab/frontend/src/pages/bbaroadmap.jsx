import "../css_files/roadmapbb.css";

const BBARoadmap = () => {
  return (
    <div className="bba-roadmap">
      <header className="header">
        <h1>Your step-by-step guide to Bachelor of Business Administration</h1>
      </header>

      <div className="middle-section">
        <div className="bba-grid">
          <div className="bba-card card-blue">
            <span className="phase-tag"><span className="card-icon">📊</span> Phase 1: Foundation</span>
            <p className="focus"><strong>Focus:</strong> Building core business and analytical foundations.</p>
            <ul className="subjects">
              <li>Principles of Management</li>
              <li>Financial Accounting</li>
              <li>Business Communication</li>
              <li>Microeconomics</li>
              <li>Quantitative Methods</li>
            </ul>
          </div>

          <div className="bba-card card-green">
            <span className="phase-tag"><span className="card-icon">📈</span> Phase 2: Core Subjects</span>
            <p className="focus"><strong>Focus:</strong> Exploring key functional areas and dynamics of business management.</p>
            <ul className="subjects">
              <li>Marketing Management</li>
              <li>Human Resource Management (HRM)</li>
              <li>Production & Operations</li>
              <li>Macroeconomics</li>
              <li>Organizational Behaviour</li>
            </ul>
          </div>

          <div className="bba-card card-purple">
            <span className="phase-tag"><span className="card-icon">⚖️</span> Phase 3: Intermediate</span>
            <p className="focus"><strong>Focus:</strong> Developing advanced core business and analytical skills.</p>
            <ul className="subjects">
              <li>Financial Management</li>
              <li>Business Law & Ethics</li>
              <li>Management Information Systems (MIS)</li>
              <li>Marketing Research</li>
              <li>Cost Accounting</li>
            </ul>
          </div>
        </div>

        <div className="row-divider"></div>

        <div className="bba-grid">
          <div className="bba-card card-orange">
            <span className="phase-tag"><span className="card-icon">🎯</span> Phase 4: Specialization</span>
            <p className="focus"><strong>Focus:</strong> Acquiring domain expertise through chosen electives.</p>
            <p className="elective-title">Electives:</p>
            <ul className="subjects">
              <li>Finance</li>
              <li>Marketing</li>
              <li>HR</li>
              <li>Entrepreneurship</li>
              <li>Data Analytics</li>
              <li>Supply Chain</li>
            </ul>
          </div>

          <div className="bba-card card-red">
            <span className="phase-tag"><span className="card-icon">💼</span> Phase 5: Practical</span>
            <p className="focus"><strong>Focus:</strong> Gaining real-world industry exposure and practical experience.</p>
            <ul className="subjects">
              <li>Internship & Projects</li>
              <li>Final Capstone Project</li>
              <li>Industry Training</li>
              <li>Case Studies</li>
              <li>Corporate Social Responsibility</li>
            </ul>
          </div>

          <div className="bba-card card-teal">
            <span className="phase-tag"><span className="card-icon">🏆</span> Phase 6: Graduation & Success</span>
            <p className="focus"><strong>Focus:</strong> Accelerating corporate readiness and career placement.</p>
            <ul className="subjects">
              <li>Strategic Management</li>
              <li>Leadership Skills</li>
              <li>Networking</li>
              <li>Career Placement</li>
              <li>Alumni Network</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="note-container">
        <p>Note: If you want to learn more about BBA, feel free to visit our study notes for detailed and easy-to-understand content.</p>
      </div>
    </div>
  );
};

export default BBARoadmap;
