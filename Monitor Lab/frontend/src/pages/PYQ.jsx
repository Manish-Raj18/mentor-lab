import { useState } from "react";
import "../css_files/pyq.css";

const universities = [
  { id: "university1", name: "University 1" },
  { id: "university2", name: "University 2" },
  { id: "university3", name: "University 3" },
  { id: "university4", name: "University 4" },
  { id: "university5", name: "University 5" },
  { id: "university6", name: "University 6" },
];

const subjectsData = {
  bba: [
    "Principles of Management",
    "Business Economics",
    "Financial Accounting",
    "Business Mathematics",
    "Marketing Management",
    "Human Resource Management",
    "Business Law",
    "Organizational Behaviour",
  ],
  bca: [
    "Introduction to Programming (C)",
    "Data Structures",
    "Database Management Systems",
    "Computer Networks",
    "Operating Systems",
    "Web Technologies",
    "Software Engineering",
    "Java Programming",
  ],
  biotech: [
    "Cell Biology",
    "Molecular Biology",
    "Genetics",
    "Biochemistry",
    "Microbiology",
    "Immunology",
    "Bioprocess Engineering",
    "Bioinformatics",
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
