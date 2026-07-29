import { useState, useEffect } from "react";
import axios from "axios";
import "../css_files/pyq.css";

const API_BASE = "http://localhost:5000/api";

const universities = [
  { id: "ranchi", name: "Ranchi University (Ranchi)" },
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
  const [uploading, setUploading] = useState({});

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (selectedUni) {
      fetchPYQs(selectedUni);
    }
  }, [selectedUni]);

  const fetchPYQs = async (universityId) => {
    try {
      const res = await axios.get(`${API_BASE}/pyq?universityId=${universityId}`);
      const map = {};
      res.data.forEach((pyq) => {
        const key = `${pyq.course}:${pyq.subject}`;
        map[key] = pyq;
      });
      setPyqData(map);
    } catch {
      setPyqData({});
    }
  };

  const handleDownload = (course, subject) => {
    const key = `${course}:${subject}`;
    const pyq = pyqData[key];
    if (pyq) {
      window.open(`${API_BASE.replace("/api", "")}/uploads/${pyq.pdfUrl}`, "_blank");
    } else {
      alert(`PDF for "${subject}" not uploaded yet.`);
    }
  };

  const handleUpload = async (course, subject, file) => {
    const uni = universities.find((u) => u.id === selectedUni);
    const key = `${course}:${subject}`;
    setUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("universityId", selectedUni);
      formData.append("universityName", uni.name);
      formData.append("course", course);
      formData.append("subject", subject);

      const res = await axios.post(`${API_BASE}/pyq/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setPyqData((prev) => ({ ...prev, [key]: res.data }));
      alert(`PDF uploaded for "${subject}"`);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
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
                  const key = `${course}:${subject}`;
                  const hasPdf = !!pyqData[key];
                  return (
                    <li key={subject}>
                      <span className="subject-name">{subject}</span>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(course, subject)}
                      >
                        {hasPdf ? "Download PYQ" : "Not Available"}
                      </button>
                      {isAdmin && (
                        <label className="upload-label">
                          {uploading[key] ? "..." : "Upload"}
                          <input
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={(e) => {
                              if (e.target.files[0]) handleUpload(course, subject, e.target.files[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
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
