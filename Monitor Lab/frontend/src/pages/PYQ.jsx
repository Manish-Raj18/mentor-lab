import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css_files/pyq.css";

const API_BASE = "/api";

const universities = [
  {
    id: "ranchi",
    name: "Ranchi University",
    city: "Ranchi",
    image: "ranchi-university.jpg",
    category: "State University",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
    description:
      "One of the oldest universities in Jharkhand, offering PYQs across BCA, BBA and Biotechnology programs.",
  },
  {
    id: "vbu",
    name: "Vinoba Bhave University",
    city: "Hazaribagh",
    category: "State University",
    gradient: "linear-gradient(135deg, #0d47a1, #1976d2)",
    description:
      "Renowned for its strong undergraduate programs in science, commerce and humanities with a vast PYQ archive.",
  },
  {
    id: "dspmu",
    name: "Dr. Shyama Prasad Mukherjee University",
    city: "Ranchi",
    category: "State University",
    gradient: "linear-gradient(135deg, #1b5e20, #2e7d32)",
    description:
      "A leading university in Ranchi providing previous year papers to help you prepare for competitive exams.",
  },
  {
    id: "bbmku",
    name: "Binod Bihari Mahto Koyalanchal University",
    city: "Dhanbad",
    image: "bbmkuuniversity.jpg",
    category: "State University",
    gradient: "linear-gradient(135deg, #bf360c, #e65100)",
    description:
      "Empowering students in the coal belt with comprehensive question papers for every semester examination.",
  },
  {
    id: "bit",
    name: "BIT Mesra",
    city: "Ranchi",
    category: "Institute",
    gradient: "linear-gradient(135deg, #4a148c, #6a1b9a)",
    description:
      "A premier institute of technology with rigorous academic standards and well-structured past papers.",
  },
  {
    id: "skmu",
    name: "Sidhu Kanhu Murmu University",
    city: "Dumka",
    category: "State University",
    gradient: "linear-gradient(135deg, #00695c, #00897b)",
    description:
      "A rising university in the Santhal region offering previous year question papers for all major courses.",
  },
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

const getVisibleCount = () => {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w < 768) return 1;
  return 3;
};

const initials = (name) =>
  name
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const PYQ = () => {
  const [selectedUni, setSelectedUni] = useState(null);
  const [pyqData, setPyqData] = useState({});
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, dx: 0 });
  const total = universities.length;

  useEffect(() => {
    if (selectedUni) {
      fetchPYQs(selectedUni);
    }
  }, [selectedUni]);

  useEffect(() => {
    const handleResize = () => {
      setVisible(getVisibleCount());
      setIndex((prev) => Math.max(0, Math.min(prev, total - 1)));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [total]);

  useEffect(() => {
    if (isHovering || isAnimating) return;
    const start = () => {
      timerRef.current = setTimeout(() => {
        goTo((index + 1) % total);
      }, 3500);
    };
    start();
    return () => clearTimeout(timerRef.current);
  }, [index, isHovering, isAnimating, total]);

  const goTo = (target) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(target);
    setTimeout(() => setIsAnimating(false), 450);
  };

  const prev = () => goTo((index - 1 + total) % total);
  const next = () => goTo((index + 1) % total);

  const onTouchStart = (e) => {
    touchRef.current.x = e.touches[0].clientX;
    touchRef.current.y = e.touches[0].clientY;
    touchRef.current.dx = 0;
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = e.touches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      touchRef.current.dx = dx;
      const el = trackRef.current;
      if (el) el.style.transform = `translateX(calc(${(100 - 100 / visible) / 2}% - ${index * (100 / visible)}% + ${dx}px))`;
    }
  };

  const onTouchEnd = () => {
    const el = trackRef.current;
    if (el) el.style.transform = "";
    const threshold = 60;
    if (touchRef.current.dx > threshold) prev();
    else if (touchRef.current.dx < -threshold) next();
    touchRef.current.dx = 0;
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
        className="pyq-slider"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="pyq-slider-viewport">
          <div
            ref={trackRef}
            className="pyq-track"
            style={{
              transform: `translateX(calc(${(100 - 100 / visible) / 2}% - ${index * (100 / visible)}%))`,
            }}
          >
            {universities.map((uni, i) => {
              const rel = i - index;
              const sideClass = rel < 0 ? "pyq-card-prev" : rel > 0 ? "pyq-card-next" : "pyq-card-active";
              return (
                <div className={`pyq-card-wrap ${sideClass}`} key={uni.id} style={{ flexBasis: `${100 / visible}%` }}>
                  <article className="pyq-card">
                    <div className="pyq-card-media" style={{ background: uni.gradient }}>
                      {uni.image ? (
                        <img src={uni.image} alt={uni.name} className="pyq-card-img" />
                      ) : (
                        <span className="pyq-card-placeholder">{initials(uni.name)}</span>
                      )}
                      <span className="pyq-card-badge">{uni.category}</span>
                    </div>
                    <div className="pyq-card-body">
                      <h3 className="pyq-card-title">{uni.name}</h3>
                      <p className="pyq-card-city">{uni.city}</p>
                      <p className="pyq-card-desc">{uni.description}</p>
                      <button className="pyq-card-btn" onClick={() => setSelectedUni(uni.id)}>
                        Read More
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <button className="pyq-arrow left" onClick={prev} aria-label="Previous" disabled={isAnimating}>&#8249;</button>
        <button className="pyq-arrow right" onClick={next} aria-label="Next" disabled={isAnimating}>&#8250;</button>

        <div className="pyq-dots">
          {universities.map((u, i) => (
            <button
              key={u.id}
              className={`pyq-dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
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
