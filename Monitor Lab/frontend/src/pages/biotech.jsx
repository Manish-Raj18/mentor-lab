import React from 'react';
import "../css_files/bio.css";

// Custom Simple SVG Icons to match the theme without needing external icon libraries
const LaptopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>
);

const BiotechSyllabus = () => {
  const syllabusData = [
    {
      stage: "STAGE 01",
      icon: <LaptopIcon />,
      mainTitle: "Foundations of Life Sciences",
      topics: [
        {
          title: "Cell Biology & Genetics",
          description: "Structure of prokaryotic/eukaryotic cells, cell division (mitosis/meiosis), and Mendelian genetics"
        },
        {
          title: "Biochemistry & Metabolism",
          description: "Structure and functions of biomolecules (proteins, carbohydrates, lipids) and enzyme action"
        }
      ]
    },
    {
      stage: "STAGE 02",
      icon: <UserIcon />,
      mainTitle: "Microbiology & Analytical Techniques",
      topics: [
        {
          title: "General Microbiology",
          description: "Isolation, staining, and culture techniques of bacteria, viruses, and fungi."
        },
        {
          title: "Biophysical Instrumentation",
          description: "Principles of chromatography, electrophoresis, spectroscopy, and microscopy."
        }
      ]
    },
    {
      stage: "STAGE 03",
      icon: <BrainIcon />,
      mainTitle: "Molecular Biology & Immunity",
      topics: [
        {
          title: "Molecular Biology",
          description: "DNA replication, transcription, and translation processes"
        },
        {
          title: "Immunology",
          description: "Immune system, antigen-antibody reactions, and vaccines."
        }
      ]
    }
  ];

  return (
    <div className="syllabus-container">
      {/* Header Section */}
      <header className="syllabus-header">
        <h1>Biotechnology Syllabus</h1>
        <p className="subtitle">Education & Learning</p>
      </header>

      {/* Main Timeline and Cards Grid */}
      <div className="timeline-wrapper">
        {/* The horizontal connecting bar */}
        <div className="timeline-bar"></div>

        <div className="stages-grid">
          {syllabusData.map((stageItem, index) => (
            <div key={index} className="stage-column">
              
              {/* Stage Label */}
              <span className="stage-label">{stageItem.stage}</span>
              
              {/* Timeline Node Icon */}
              <div className="icon-node">
                {stageItem.icon}
              </div>

              {/* Content Card */}
              <div className="syllabus-card">
                <h2 className="card-main-title">{stageItem.mainTitle}</h2>
                
                {stageItem.topics.map((topic, tIndex) => (
                  <div key={tIndex} className="topic-block">
                    <h3 className="topic-title">{topic.title}</h3>
                    <p className="topic-description">{topic.description}</p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiotechSyllabus;