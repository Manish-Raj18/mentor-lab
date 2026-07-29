import "../css_files/bba.css";

function BBA() {
  return (
    <div className="bba-container">
      <header className="bba-header">
        <h1>BBA Curriculum</h1>
        <p>Your comprehensive route to business mastery and strategic excellence.</p>
      </header>

      <div className="syllabus-grid">
        <section className="category-card card-mgmt">
          <div className="category-header">
            <span className="category-icon">♟</span>
            <h2 className="category-title">Management & Strategy</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Principles of Management</a></li>
            <li className="subject-item"><a href="#">Organizational Behaviour</a></li>
            <li className="subject-item"><a href="#">Human Resource Management</a></li>
            <li className="subject-item"><a href="#">Strategic Management</a></li>
            <li className="subject-item"><a href="#">Business Ethics & Governance</a></li>
            <li className="subject-item"><a href="#">Entrepreneurship Development</a></li>
          </ul>
        </section>

        <section className="category-card card-fin">
          <div className="category-header">
            <span className="category-icon">📊</span>
            <h2 className="category-title">Finance & Accounts</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Financial Accounting</a></li>
            <li className="subject-item"><a href="#">Cost Accounting</a></li>
            <li className="subject-item"><a href="#">Corporate Accounting</a></li>
            <li className="subject-item"><a href="#">Management Accounting</a></li>
            <li className="subject-item"><a href="#">Financial Management</a></li>
            <li className="subject-item"><a href="#">Income Tax Law & Practice</a></li>
          </ul>
        </section>

        <section className="category-card card-analytics">
          <div className="category-header">
            <span className="category-icon">🔢</span>
            <h2 className="category-title">Analytics & Tech</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Business Mathematics</a></li>
            <li className="subject-item"><a href="#">Business Statistics</a></li>
            <li className="subject-item"><a href="#">Research Methodology</a></li>
            <li className="subject-item"><a href="#">Operations Research</a></li>
            <li className="subject-item"><a href="#">Computer Applications & IT</a></li>
            <li className="subject-item"><a href="#">Management Information Systems</a></li>
          </ul>
        </section>

        <section className="category-card card-mktg">
          <div className="category-header">
            <span className="category-icon">📣</span>
            <h2 className="category-title">Marketing Dynamics</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Principles of Marketing</a></li>
            <li className="subject-item"><a href="#">Marketing Management</a></li>
            <li className="subject-item"><a href="#">Consumer Behavior Analysis</a></li>
            <li className="subject-item"><a href="#">E-Commerce & Digital Business</a></li>
            <li className="subject-item"><a href="#">International Business & EXIM</a></li>
          </ul>
        </section>

        <section className="category-card card-eco">
          <div className="category-header">
            <span className="category-icon">⚖️</span>
            <h2 className="category-title">Environment & Law</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Microeconomics</a></li>
            <li className="subject-item"><a href="#">Macroeconomics</a></li>
            <li className="subject-item"><a href="#">Business Environment</a></li>
            <li className="subject-item"><a href="#">Business Law / Legal Aspects</a></li>
            <li className="subject-item"><a href="#">Environmental Studies & CSR</a></li>
          </ul>
        </section>

        <section className="category-card card-ops">
          <div className="category-header">
            <span className="category-icon">⚙️</span>
            <h2 className="category-title">Operations & Practice</h2>
          </div>
          <ul className="subject-list">
            <li className="subject-item"><a href="#">Production & Operations Mgmt</a></li>
            <li className="subject-item"><a href="#">Logistics & Supply Chain</a></li>
            <li className="subject-item"><a href="#">Business Communication</a></li>
            <li className="subject-item"><a href="#">Corporate Summer Internship</a></li>
            <li className="subject-item"><a href="#">Final Capstone Project & Viva</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default BBA;