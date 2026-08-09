import { useState } from "react";
import { Link } from "react-router-dom";
import "../css_files/bca.css";
import { bbaCategories } from "../data/bbaCategories";

function BBA() {
  const [index, setIndex] = useState(0);
  const n = bbaCategories.length;
  const go = (i) => setIndex(((i % n) + n) % n);

  return (
    <div className="bca-container bba-bg">
      <header className="bca-header">
        <h1>BBA Curriculum</h1>
        <p>Your comprehensive route to business mastery and strategic excellence.</p>
      </header>

      <div className="bca-coverflow">
        {bbaCategories.map((c, i) => {
          const offset = (i - index + n) % n;
          const pos = offset === 0 ? "center" : offset === 1 ? "right" : "left";
          return (
            <Link to={`/bba/${c.slug}`} key={c.slug} className={`bca-card cover-${pos}`}>
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

export default BBA;
