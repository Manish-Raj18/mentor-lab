import "../css_files/bca.css";
function BCA() {
  return (
    <div className="bca-container">
      <header className="bca-header">
        <h1>BCA Curriculum</h1>
        <p>Explore the comprehensive guide to subjects and programming languages for Bachelor of Computer Applications.</p>
      </header>

      <div className="subjects-grid">
        <section className="subject-card programming-card">
          <span className="card-icon">💻</span>
          <h2>Programming Languages</h2>
          <ul className="subject-list">
            <li><a href="#">C Programming</a></li>
            <li><a href="#">C++ Programming</a></li>
            <li><a href="#">Java Programming</a></li>
            <li><a href="#">Python Programming</a></li>
            <li><a href="#">HTML & Web Design</a></li>
            <li><a href="#">JavaScript</a></li>
            <li><a href="#">CSS Styling</a></li>
          </ul>
        </section>

        <section className="subject-card logical-card">
          <span className="card-icon">🧠</span>
          <h2>Logical Subjects</h2>
          <ul className="subject-list">
            <li><a href="#">Database Management System</a></li>
            <li><a href="#">Data Structures & Algorithms</a></li>
            <li><a href="#">Operating Systems</a></li>
            <li><a href="#">System Analysis & Design</a></li>
            <li><a href="#">Computer Architecture</a></li>
            <li><a href="#">Design & Analysis of Algorithms</a></li>
            <li><a href="#">Computer Networks</a></li>
          </ul>
        </section>

        <section className="subject-card math-card">
          <span className="card-icon">📊</span>
          <h2>Mathematics Subjects</h2>
          <ul className="subject-list">
            <li><a href="#">Differential Calculus</a></li>
            <li><a href="#">Integral Calculus</a></li>
            <li><a href="#">Differential Equations</a></li>
            <li><a href="#">Abstract Algebra</a></li>
            <li><a href="#">Linear Algebra</a></li>
            <li><a href="#">Matrix Algebra</a></li>
            <li><a href="#">Analytical Geometry (3D)</a></li>
            <li><a href="#">Probability Theory</a></li>
            <li><a href="#">Probability Distributions</a></li>
            <li><a href="#">Statistics & Central Tendency</a></li>
            <li><a href="#">Measures of Variation</a></li>
            <li><a href="#">Correlation Analysis</a></li>
            <li><a href="#">Regression Analysis</a></li>
            <li><a href="#">Sampling Distribution</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default BCA;