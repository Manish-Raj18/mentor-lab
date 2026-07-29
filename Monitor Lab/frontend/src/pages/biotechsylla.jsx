import { useEffect, useState } from "react";
import axios from "axios";
import "../css_files/biotech.css";
import AIExplainModal from "../components/AIExplainModal";

function BIO() {
  const [notes, setNotes] = useState([]);
  const [explainSubject, setExplainSubject] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getPdfLink = (title) => {
    const note = notes.find(
      (n) => n.title.toLowerCase() === title.toLowerCase()
    );

    if (note) {
      return `http://localhost:5000/uploads/${note.pdfUrl}`;
    }

    const localFiles = {
      "Biochemistry": "Biochemistry.pdf",
      "Developmental Biology": "Developmental_Biology.pdf",
      "Microbiology": "Microbiology.pdf",
      "Molecular Biology": "Molecular_Biology.pdf",
    };

    if (localFiles[title]) {
      return `http://localhost:5000/uploads/${localFiles[title]}`;
    }

    return "#";
  };

  const sections = [
    {
      icon: "🔬", title: "Foundation Sciences",
      items: ["Cell Biology", "Genetics", "Molecular Biology", "Biochemistry", "Microbiology", "Physiology", "Developmental Biology", "Biomolecules", "Biostatistics"]
    },
    {
      icon: "🧬", title: "Core Biotechnology",
      items: ["Genetic Engineering", "Recombinant DNA Technology", "Bioprocess Engineering", "Enzyme Technology", "Industrial Biotechnology", "Plant Biotechnology", "Animal Biotechnology", "Medical Biotechnology", "Agricultural Biotechnology"]
    },
    {
      icon: "🚀", title: "Advanced & Applied",
      items: ["Environmental Biotechnology", "Bioinformatics", "Computational Biology", "Immunology", "Virology", "Genomics", "Biosafety & Bioethics", "Research Methodology", "Project Work & Internship"]
    },
  ];

  return (
    <div className="biotech-container">
      <header className="biotech-header">
        <h1>Biotechnology Syllabus</h1>
        <p>Your comprehensive learning roadmap from foundation sciences to advanced applied biotechnology.</p>
      </header>

      <div className="biotech-grid">
        {sections.map((section) => (
          <section key={section.title} className="biotech-card">
            <span className="card-icon">{section.icon}</span>
            <h2>{section.title}</h2>
            <ul className="syllabus-list">
              {section.items.map((item) => (
                <li key={item} className="syllabus-item">
                  <a href={getPdfLink(item)} target="_blank" rel="noreferrer">{item}</a>
                  <button className="ai-explain-btn-sm" onClick={() => setExplainSubject(item)}>AI Explain</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {explainSubject && (
        <AIExplainModal subject={explainSubject} course="Biotechnology" onClose={() => setExplainSubject(null)} />
      )}
    </div>
  );
}

export default BIO;
