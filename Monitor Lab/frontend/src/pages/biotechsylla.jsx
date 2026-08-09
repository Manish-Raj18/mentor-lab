import { useState } from "react";
import { Link } from "react-router-dom";
import "../css_files/bca.css";
import { biotechCategories } from "../data/biotechCategories";

function BIO() {
  const [index, setIndex] = useState(0);
  const n = biotechCategories.length;
  const go = (i) => setIndex(((i % n) + n) % n);

  return (
    <div className="bca-container biotech-bg">
      <header className="bca-header">
        <h1>Biotechnology Syllabus</h1>
        <p>Your comprehensive learning roadmap from foundation sciences to advanced applied biotechnology.</p>
      </header>

      <div className="bca-coverflow">
        {biotechCategories.map((c, i) => {
          const offset = (i - index + n) % n;
          const pos = offset === 0 ? "center" : offset === 1 ? "right" : "left";
          return (
            <Link to={`/biotechsylla/${c.slug}`} key={c.slug} className={`bca-card cover-${pos}`}>
              <img src={c.image} alt={c.name} className="bca-card-image" loading="lazy" />
              <div className="bca-card-body">
                <span className="bca-card-icon">{c.icon}</span>
                <h2>{c.name}</h2>
                <span className="bca-card-count">{c.items.length} Subjects</span>
                <p className="bca-card-desc">{c.desc}</p>
                <span className="bca-card-link">View Subjects →</span>
              </div>
            </Link>
          );
        })}

        <button className="cover-arrow left" onClick={() => go(index - 1)} aria-label="Previous category">&#8249;</button>
        <button className="cover-arrow right" onClick={() => go(index + 1)} aria-label="Next category">&#8250;</button>
      </div>
    </div>
  );
}

export default BIO;
