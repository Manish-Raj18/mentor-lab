import { Link } from "react-router-dom";
import "../css_files/bio.css";

function BiotechSyllabus() {
  return (
    <div className="bio-roadmap">
      <header className="header">
        <h1>Your step-by-step guide from foundation sciences to advanced biopharmaceutical development</h1>
      </header>

      <div className="middle-section">
        <div className="bio-grid">
          <div className="bio-card card-teal">
            <span className="phase-tag"><span className="card-icon">🔬</span> Phase 1: Foundational Sciences</span>
            <p className="focus"><strong>Focus:</strong> Building core scientific and analytical foundations.</p>
            <ul className="subjects">
              <li>Cell Biology & Genetics</li>
              <li>General Chemistry</li>
              <li>Biostatistics</li>
              <li>Biomolecules</li>
              <li>Lab Techniques</li>
            </ul>
          </div>

          <div className="bio-card card-purple">
            <span className="phase-tag"><span className="card-icon">🧬</span> Phase 2: Core Biotechnology</span>
            <p className="focus"><strong>Focus:</strong> Exploring key biochemical and molecular concepts.</p>
            <ul className="subjects">
              <li>Biochemistry</li>
              <li>Microbiology</li>
              <li>Molecular Biology</li>
              <li>Enzyme Technology</li>
              <li>rDNA Technology</li>
            </ul>
          </div>

          <div className="bio-card card-blue">
            <span className="phase-tag"><span className="card-icon">⚙️</span> Phase 3: Advanced Technical Skills</span>
            <p className="focus"><strong>Focus:</strong> Developing advanced genetic and bioprocess engineering skills.</p>
            <ul className="subjects">
              <li>Genetic Engineering</li>
              <li>Immunology</li>
              <li>Bioprocess Engineering</li>
              <li>Genomics & Proteomics</li>
              <li>Fermentation Tech</li>
            </ul>
          </div>
        </div>

        <div className="row-divider"></div>

        <div className="bio-grid">
          <div className="bio-card card-green">
            <span className="phase-tag"><span className="card-icon">💻</span> Phase 4: Bioinformatics & Data</span>
            <p className="focus"><strong>Focus:</strong> Acquiring computational and systems biology expertise.</p>
            <ul className="subjects">
              <li>Computational Biology</li>
              <li>Structural Biology</li>
              <li>Systems Biology</li>
              <li>Bioinformatics Tools</li>
              <li>Data Visualization</li>
            </ul>
          </div>

          <div className="bio-card card-orange">
            <span className="phase-tag"><span className="card-icon">🧫</span> Phase 5: Stem Cell Technology</span>
            <p className="focus"><strong>Focus:</strong> Gaining expertise in cellular reprogramming and regenerative medicine.</p>
            <ul className="subjects">
              <li>Cellular Reprogramming</li>
              <li>Tissue Engineering</li>
              <li>Regenerative Medicine</li>
              <li>Stem Cell Ethics</li>
              <li>Clinical Trials</li>
            </ul>
          </div>

          <div className="bio-card card-red">
            <span className="phase-tag"><span className="card-icon">💊</span> Phase 6: Biopharmaceutical Dev</span>
            <p className="focus"><strong>Focus:</strong> Accelerating drug discovery and biomanufacturing readiness.</p>
            <ul className="subjects">
              <li>Drug Discovery</li>
              <li>Regulatory Affairs</li>
              <li>Biomanufacturing</li>
              <li>Pharma Marketing</li>
              <li>Quality Assurance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="note-container">
        <div className="roadmap-cta">
          <p>Note: If you want to learn more about Biotechnology, feel free to visit our study notes for detailed and easy-to-understand content.</p>
          <Link to="/biotechsylla" className="roadmap-note-btn">
            Explore Biotechnology Study Notes
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BiotechSyllabus;
