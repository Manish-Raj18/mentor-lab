function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BULLET_RE = /^[\uE000-\uF8FF\u2022\u25CF\u25AA\u25E6\u2043\u00B7\u2023?]\s/;
const BULLET_STRIP_RE = /^[\uE000-\uF8FF\u2022\u25CF\u25AA\u25E6\u2043\u00B7\u2023?]\s*\t?\s*/;

function isBulletLine(line) {
  return BULLET_RE.test(line);
}

function stripBulletMarker(line) {
  return line.replace(BULLET_STRIP_RE, "");
}

function looksLikeNewBlock(line) {
  const t = line.trim();
  if (t.length === 0 || t.length > 60) return false;
  if (!/^[A-Z]/.test(t)) return false;
  if (/[.;,:!?]$/.test(t)) return false;
  if (/\s{3,}/.test(t)) return false;
  return true;
}

function isMetadataLine(line) {
  if (/^lecture\s*notes?$/i.test(line)) return true;
  if (/^programming\s+in\b/i.test(line)) return true;
  if (/^c\+\+\s+(ebook|notes?|book|pdf)\b/i.test(line)) return true;
  if (/^on$/i.test(line) || /^by\b/i.test(line)) return true;
  if (/^(pdf\s*file\s+)?uploaded\s+on\s+telegram/i.test(line)) return true;
  if (/^copyrighted?\s+by/i.test(line)) return true;
  if (/^\s*course\s*code\s*[:#-]/i.test(line)) return true;
  if (/^(asst\.?\s*prof(\.|essor)?|assistant\s+professor|professor|faculty|lecturer|head\s+of\s+(the\s+)?department|hod|prepared\s+by|written\s+by|authored\s+by)\b/i.test(line)) return true;
  if (/^\d+\s*\*?\s*under\s+revision/i.test(line)) return true;
  return false;
}

function isLabelLine(line) {
  return /^[A-Za-z][\w &,()\-/'"+#]{0,60}:\s*$/.test(line) && !/\s{3,}/.test(line);
}

function isHeadingLine(line) {
  const len = line.length;
  if (len < 3 || len > 90) return false;
  if (/page\s+\d+\s*$/i.test(line)) return false;

  if (/^(unit|module|chapter|topic|lesson|lecture|part|section)\b.*\d/i.test(line)) {
    if (/sem\b/i.test(line)) return false;
    return true;
  }

  if (/^\d{1,2}[.)]\s+[A-Z]/.test(line)) {
    const occurrences = (line.match(/\d{1,2}[.)]/g) || []).length;
    if (len <= 60 && occurrences === 1 && !/[,:-]/.test(line) && !/[.)]$/.test(line)) return true;
    return false;
  }

  if (line === line.toUpperCase() && /[A-Z]{4,}/.test(line) && !/\d$/.test(line)) return true;

  return false;
}

function isMajorHeading(line) {
  return /^(unit|module|chapter)\b/i.test(line) || /^\d{1,2}[.)]\s+[A-Z]/.test(line);
}

function normalizeForMatch(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fuzzyMatch(a, b) {
  const na = normalizeForMatch(a);
  const nb = normalizeForMatch(b);
  if (na === nb) return true;
  const [short, long] = na.length <= nb.length ? [na, nb] : [nb, na];
  return long.startsWith(short) && long.length - short.length <= 2;
}

function isPdfTocUnitTitle(line) {
  const t = line;
  if (t.length < 3 || t.length > 40) return false;
  if (!/^[A-Z]/.test(t)) return false;
  if (/[:.!,?]$/.test(t)) return false;
  if (/\s{3,}/.test(t)) return false;
  if (/^[A-Z]{4,}\s*$/.test(t)) return false;
  if (/@|ebook|pdf|uploaded|telegram|link|bio|copyright/i.test(t)) return false;
  return true;
}

function parsePdfToc(lines) {
  const limit = Math.min(lines.length, 100);
  let regionEnd = limit;
  for (let i = 0; i < limit; i++) {
    const line = lines[i].trim();
    if (!isBulletLine(line)) continue;
    if (stripBulletMarker(line).length > 90) {
      regionEnd = i;
      break;
    }
    let j = i + 1;
    while (j < limit && (lines[j].trim() === "" || isMetadataLine(lines[j].trim()))) j++;
    if (j < limit && !isBulletLine(lines[j].trim()) && !isPdfTocUnitTitle(lines[j].trim())) {
      regionEnd = i;
      break;
    }
  }

  const units = [];
  let current = null;
  for (let i = 0; i < regionEnd; i++) {
    const line = lines[i].trim();
    if (line === "" || isMetadataLine(line)) continue;
    if (isBulletLine(line)) {
      if (current) current.children.push(stripBulletMarker(line));
      continue;
    }
    if (isPdfTocUnitTitle(line)) {
      if (current && current.children.length >= 2) units.push(current);
      current = { title: line, children: [] };
      continue;
    }
    if (current) {
      if (current.children.length >= 2) units.push(current);
      current = null;
    }
  }
  if (current && current.children.length >= 2) units.push(current);

  return units.length >= 3 ? { units, regionEnd } : null;
}

function buildHeadingEntries(lines, toc) {
  const entries = [];

  if (toc) {
    const unitNormToTitle = new Map();
    const sectionNormToUnit = new Map();
    for (const u of toc.units) {
      unitNormToTitle.set(normalizeForMatch(u.title), u.title);
      for (const c of u.children) sectionNormToUnit.set(normalizeForMatch(c), u.title);
    }

    const emittedUnits = new Set();
    let currentUnitTitle = null;

    for (let i = toc.regionEnd; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "" || !isLabelLine(line)) continue;
      const labelText = line.replace(/:\s*$/, "").trim();
      const norm = normalizeForMatch(labelText);

      let matchedUnitTitle = null;
      for (const [un, title] of unitNormToTitle) {
        if (fuzzyMatch(norm, un)) {
          matchedUnitTitle = title;
          break;
        }
      }
      if (matchedUnitTitle) {
        emittedUnits.add(normalizeForMatch(matchedUnitTitle));
        currentUnitTitle = matchedUnitTitle;
        entries.push({ line: i, level: 2, text: labelText });
        continue;
      }

      let parentUnitTitle = null;
      for (const [sn, title] of sectionNormToUnit) {
        if (fuzzyMatch(norm, sn)) {
          parentUnitTitle = title;
          break;
        }
      }
      if (parentUnitTitle) {
        const pun = normalizeForMatch(parentUnitTitle);
        if (currentUnitTitle !== parentUnitTitle && !emittedUnits.has(pun)) {
          emittedUnits.add(pun);
          currentUnitTitle = parentUnitTitle;
          entries.push({ line: i, level: 2, text: parentUnitTitle });
        }
        entries.push({ line: i, level: 3, text: labelText });
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "" || isMetadataLine(line) || isBulletLine(line)) continue;
    if (isHeadingLine(line)) {
      entries.push({ line: i, level: isMajorHeading(line) ? 2 : 3, text: line });
    }
  }

  entries.sort((a, b) => a.line - b.line);
  return entries;
}

export function renderPlainText(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  const toc = parsePdfToc(lines);
  const headingMap = new Map();
  for (const e of buildHeadingEntries(lines, toc)) {
    if (!headingMap.has(e.line)) headingMap.set(e.line, []);
    headingMap.get(e.line).push(e);
  }

  const out = [];
  let para = [];
  let list = null;
  let headingIndex = 0;

  const flush = () => {
    if (para.length) {
      out.push(`<p style="white-space: pre-wrap;">${escapeHtml(para.join("\n"))}</p>`);
      para = [];
    }
  };

  const flushList = () => {
    if (list && list.length) {
      const items = list
        .map((itemLines) => `<li>${escapeHtml(itemLines.join("\n"))}</li>`)
        .join("");
      out.push(`<ul class="nv-list">${items}</ul>`);
    }
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      flush();
      flushList();
      continue;
    }
    if (isMetadataLine(line)) {
      flushList();
      continue;
    }
    if (isBulletLine(line)) {
      flush();
      if (!list) list = [];
      list.push([stripBulletMarker(line)]);
      continue;
    }
    if (headingMap.has(i)) {
      flush();
      flushList();
      for (const h of headingMap.get(i)) {
        const tag = h.level === 2 ? "h2" : "h3";
        out.push(`<${tag} id="nv-sec-${headingIndex++}">${escapeHtml(h.text)}</${tag}>`);
      }
      continue;
    }
    if (isLabelLine(line)) {
      flush();
      flushList();
      out.push(`<p class="nv-label">${escapeHtml(line)}</p>`);
      continue;
    }
    if (list) {
      if (looksLikeNewBlock(line)) {
        flushList();
        para.push(line);
      } else {
        list[list.length - 1].push(line);
      }
      continue;
    }
    para.push(line);
  }
  flush();
  flushList();

  return out.join("\n");
}

export function extractHeadings(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const toc = parsePdfToc(lines);
  return buildHeadingEntries(lines, toc).map(({ level, text: t }) => ({ level, text: t }));
}
