import { useEffect, useState } from "react";
import axios from "axios";
import "../css_files/biotech.css";

function BIO() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("/api/notes?course=BIOTECH")
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  const getNoteForSubject = (subjectName) => {
    const normalized = subjectName.toLowerCase();
    return notes.find(n => n.subject && n.subject.toLowerCase() === normalized);
  };

  const getLocalPdf = (subjectName) => {
    const localFiles = {
      "Biochemistry": "Biochemistry.pdf",
      "Developmental Biology": "Developmental_Biology.pdf",
      "Microbiology": "Microbiology.pdf",
      "Molecular Biology": "Molecular_Biology.pdf",
    };
    return localFiles[subjectName] ? `/uploads/${localFiles[subjectName]}` : null;
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
              {section.items.map((item) => {
                const note = getNoteForSubject(item);
                const localPdf = note ? null : getLocalPdf(item);
                return (
                  <li key={item} className="syllabus-item">
                    {note && (note.fileId || note.pdfUrl || note.hasContent) ? (
                      <>
                        <a href={`/notes/${note._id}`}>{item}</a>
                        <a href={`/api/notes/${note._id}/pdf`} className="pdf-link" target="_blank" rel="noreferrer">PDF</a>
                      </>
                    ) : localPdf ? (
                      <a href={localPdf} target="_blank" rel="noreferrer">{item}</a>
                    ) : (
                      <span style={{ color: "var(--text-color)", opacity: 0.6 }}>{item}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default BIO;