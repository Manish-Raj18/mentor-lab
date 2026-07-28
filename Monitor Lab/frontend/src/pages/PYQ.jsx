import { useState } from "react";
import "../css_files/pyq.css";

const universities = [
  { id: "ranchi", name: "Ranchi University (Ranchi)" },
  { id: "vbu", name: "Vinoba Bhave University (VBU, Hazaribagh)" },
  { id: "dspmu", name: "Dr. Shyama Prasad Mukherjee University (DSPMU, Ranchi)" },
  { id: "bbmku", name: "Binod Bihari Mahto Koyalanchal University (BBMKU, Dhanbad)" },
  { id: "bit", name: "BIT Mesra (Ranchi)" },
  { id: "skmu", name: "Sido Kanhu Murmu University (Dumka)" },
];

const subjectsData = {
  biotech: [
    "Foundation Sciences",
    "Cell Biology",
    "Genetics",
    "Molecular Biology",
    "Biochemistry",
    "Microbiology",
    "Physiology",
    "Developmental Biology",
    "Biomolecules",
    "Biostatistics",
    "Core Biotechnology",
    "Genetic Engineering",
    "Recombinant DNA Technology",
    "Bioprocess Engineering",
    "Enzyme Technology",
    "Industrial Biotechnology",
    "Plant Biotechnology",
    "Animal Biotechnology",
    "Medical Biotechnology",
    "Agricultural Biotechnology",
    "Advanced & Applied",
    "Environmental Biotechnology",
    "Bioinformatics",
    "Computational Biology",
    "Immunology",
    "Virology",
    "Genomics",
    "Biosafety & Bioethics",
    "Research Methodology",
    "Project Work & Internship",
  ],
  bca: [
    "C Programming",
    "C++ Programming",
    "Java Programming",
    "Python Programming",
    "HTML & Web Design",
    "JavaScript",
    "CSS Styling",
    "Database Management System",
    "Data Structures & Algorithms",
    "Operating Systems",
    "System Analysis & Design",
    "Computer Architecture",
    "Design & Analysis of Algorithms",
    "Computer Networks",
    "Differential Calculus",
    "Differential Equations",
    "Linear Algebra",
    "Analytical Geometry (3D)",
    "Probability Distributions",
    "Measures of Variation",
    "Regression Analysis",
    "Integral Calculus",
    "Abstract Algebra",
    "Matrix Algebra",
    "Probability Theory",
    "Statistics & Central Tendency",
    "Correlation Analysis",
    "Sampling Distribution",
  ],
  bba: [
    "Principles of Management",
    "Organizational Behaviour",
    "Human Resource Management",
    "Strategic Management",
    "Business Ethics & Governance",
    "Entrepreneurship Development",
    "Financial Accounting",
    "Cost Accounting",
    "Corporate Accounting",
    "Management Accounting",
    "Financial Management",
    "Income Tax Law & Practice",
    "Business Mathematics",
    "Business Statistics",
    "Research Methodology",
    "Operations Research",
    "Computer Applications & IT",
    "Management Information Systems",
    "Principles of Marketing",
    "Marketing Management",
    "Consumer Behavior Analysis",
    "E-Commerce & Digital Business",
    "International Business & EXIM",
    "Microeconomics",
    "Macroeconomics",
    "Business Environment",
    "Business Law / Legal Aspects",
    "Environmental Studies & CSR",
    "Production & Operations Mgmt",
    "Logistics & Supply Chain",
    "Business Communication",
    "Corporate Summer Internship",
    "Final Capstone Project & Viva",
  ],
};

const PYQ = () => {
  const [selectedUni, setSelectedUni] = useState(null);

  const handleDownload = (subject) => {
    alert(`PDF for "${subject}" not uploaded yet.`);
  };

  if (selectedUni) {
    const uni = universities.find((u) => u.id === selectedUni);
    return (
      <div className="pyq-page">
        <header className="pyq-header">
          <button className="back-btn" onClick={() => setSelectedUni(null)}>
            &larr; Back to Universities
          </button>
          <h1>{uni.name}</h1>
          <p>Select a course and download PYQ papers</p>
        </header>

        <main className="courses-container">
          {Object.entries(subjectsData).map(([course, subjects]) => (
            <section className="course-column" key={course}>
              <div className={`course-header ${course}`}>
                {course.toUpperCase()}
              </div>
              <ul className="subject-list">
                {subjects.map((subject) => (
                  <li key={subject}>
                    <span className="subject-name">{subject}</span>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(subject)}
                    >
                      Download PYQ
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>

        <footer className="pyq-footer">
          <p>&copy; 2026 PYQ Portal</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="pyq-page">
      <header className="pyq-header">
        <h1>Previous Year Questions (PYQ) Portal</h1>
        <p>Select your university to browse question papers</p>
      </header>

      <main className="university-grid">
        {universities.map((uni) => (
          <button
            key={uni.id}
            className="uni-card"
            onClick={() => setSelectedUni(uni.id)}
          >
            <h2>{uni.name}</h2>
            <p>View PYQ &rarr;</p>
          </button>
        ))}
      </main>

      <footer className="pyq-footer">
        <p>&copy; 2026 PYQ Portal</p>
      </footer>
    </div>
  );
};

export default PYQ;
