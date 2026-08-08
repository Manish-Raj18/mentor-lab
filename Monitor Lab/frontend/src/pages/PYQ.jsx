import { useState, useEffect } from "react";
import axios from "axios";
import "../css_files/pyq.css";

const API_BASE = "/api";

const universities = [
  { id: "ranchi", name: "Ranchi University (Ranchi)", image: "ranchi-university.jpg" },
  { id: "vbu", name: "Vinoba Bhave University (VBU, Hazaribagh)" },
  { id: "dspmu", name: "Dr. Shyama Prasad Mukherjee University (DSPMU, Ranchi)" },
  { id: "bbmku", name: "Binod Bihari Mahto Koyalanchal University (BBMKU, Dhanbad)" },
  { id: "bit", name: "BIT Mesra (Ranchi)" },
  { id: "skmu", name: "Sidhu Kanhu Murmu University (Dumka)" },
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
  const [pyqData, setPyqData] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [navCount, setNavCount] = useState(0);

  const totalSlides = universities.length;

  useEffect(() => {
    if (selectedUni) {
      fetchPYQs(selectedUni);
    }
  }, [selectedUni]);

  useEffect(() => {
    if (paused || selectedUni) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, selectedUni, totalSlides, navCount]);

  const goToSlide = (index) => {
    setCurrentSlide(((index % totalSlides) + totalSlides) % totalSlides);
    setNavCount((c) => c + 1);
  };

  const normalizeKey = (str) => str.toLowerCase().replace(/\s+/g, " ").trim();

  const fetchPYQs = async (universityId) => {
    try {
      const res = await axios.get(`${API_BASE}/pyq?universityId=${universityId}`);
      const map = {};
      res.data.forEach((pyq) => {
        const key = `${normalizeKey(pyq.course)}:${normalizeKey(pyq.subject)}`;
        map[key] = pyq;
      });
      setPyqData(map);
    } catch (error) {
      console.error("Failed to load PYQ papers:", error);
      setPyqData({});
    }
  };

  const getPdfLink = (course, subject) => {
    const key = `${normalizeKey(course)}:${normalizeKey(subject)}`;
    const pyq = pyqData[key];
    return pyq ? `${API_BASE}/pyq/${pyq._id}/pdf` : null;
  };

  if (selectedUni) {
    const uni = universities.find((u) => u.id === selectedUni);
    return (
      <div className="pyq-page">
        <header className="pyq-header">
          <div className="pyq-header-top">
            <button className="back-btn" onClick={() => setSelectedUni(null)}>
              &larr; Back
            </button>
            <h1>{uni.name}</h1>
          </div>
          <p>Select a course and download PYQ papers</p>
        </header>

        <main className="courses-container">
          {Object.entries(subjectsData).map(([course, subjects]) => (
            <section className="course-column" key={course}>
              <div className={`course-header ${course}`}>
                {course.toUpperCase()}
              </div>
              <ul className="subject-list">
                {subjects.map((subject) => {
                  const pdfLink = getPdfLink(course, subject);
                  return (
                    <li key={subject}>
                      <span className="subject-name">{subject}</span>
                      {pdfLink ? (
                        <a href={pdfLink} target="_blank" rel="noreferrer" className="download-btn">Download PYQ</a>
                      ) : (
                        <span className="download-btn" style={{ opacity: 0.5, cursor: "default" }}>Not Available</span>
                      )}
                    </li>
                  );
                })}
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

      <div
        className="slider-wrapper"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="slider-viewport">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {universities.map((uni) => (
              <button
                key={uni.id}
                className="uni-card"
                onClick={() => setSelectedUni(uni.id)}
              >
                {uni.image && <img src={uni.image} alt={uni.name} className="uni-card-img" />}
                <div className="uni-card-content">
                  <h2>{uni.name}</h2>
                  <p>View PYQ &rarr;</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button className="slider-arrow left" onClick={() => goToSlide(currentSlide - 1)} aria-label="Previous">&#8249;</button>
        <button className="slider-arrow right" onClick={() => goToSlide(currentSlide + 1)} aria-label="Next">&#8250;</button>

        <div className="slider-dots">
          {universities.map((uni, i) => (
            <button
              key={uni.id}
              className={`dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <footer className="pyq-footer">
        <p>&copy; 2026 PYQ Portal</p>
      </footer>
    </div>
  );
};

export default PYQ;
