import "../css_files/biotech.css";
import { useEffect, useState } from "react";
import axios from "axios";

function BIO() {
  const [notes, setNotes] = useState([]);

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

    // Fallback for local files in uploads folder
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

  return (
    <div className="biotech-container">
      <header className="biotech-header">
        <h1>Biotechnology Syllabus</h1>
        <p>Your comprehensive learning roadmap from foundation sciences to advanced applied biotechnology.</p>
      </header>

      <div className="biotech-grid">
        <section className="biotech-card">
          <span className="card-icon">🔬</span>
          <h2>Foundation Sciences</h2>
          <ul className="syllabus-list">
            <li className="syllabus-item"><a href={getPdfLink("Cell Biology")} target="_blank">Cell Biology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Genetics")} target="_blank">Genetics</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Molecular Biology")} target="_blank" rel="noreferrer">Molecular Biology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Biochemistry")} target="_blank">Biochemistry</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Microbiology")} target="_blank">Microbiology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Physiology")} target="_blank">Physiology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Developmental Biology")} target="_blank">Developmental Biology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Biomolecules")} target="_blank">Biomolecules</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Biostatistics")} target="_blank">Biostatistics</a></li>
          </ul>
        </section>

        <section className="biotech-card">
          <span className="card-icon">🧬</span>
          <h2>Core Biotechnology</h2>
          <ul className="syllabus-list">
            <li className="syllabus-item"><a href={getPdfLink("Genetic Engineering")} target="_blank">Genetic Engineering</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Recombinant DNA Technology")} target="_blank">Recombinant DNA Technology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Bioprocess Engineering")} target="_blank" rel="noreferrer">Bioprocess Engineering</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Enzyme Technology")} target="_blank">Enzyme Technology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Industrial Biotechnology")} target="_blank">Industrial Biotechnology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Plant Biotechnology")} target="_blank">Plant Biotechnology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Animal Biotechnology")} target="_blank">Animal Biotechnology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Medical Biotechnology")} target="_blank">Medical Biotechnology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Agricultural Biotechnology")} target="_blank">Agricultural Biotechnology</a></li>
          </ul>
        </section>

        <section className="biotech-card">
          <span className="card-icon">🚀</span>
          <h2>Advanced & Applied</h2>
          <ul className="syllabus-list">
            <li className="syllabus-item"><a href={getPdfLink("Environmental Biotechnology")} target="_blank">Environmental Biotechnology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Bioinformatics")} target="_blank">Bioinformatics</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Computational Biology")} target="_blank" rel="noreferrer">Computational Biology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Immunology")} target="_blank">Immunology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Virology")} target="_blank">Virology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Genomics")} target="_blank">Genomics</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Biosafety & Bioethics")} target="_blank">Biosafety & Bioethics</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Research Methodology")} target="_blank">Research Methodology</a></li>
            <li className="syllabus-item"><a href={getPdfLink("Project Work & Internship")} target="_blank">Project Work & Internship</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default BIO;