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

export function renderPlainText(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

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

  for (const raw of lines) {
    const line = raw.trim();
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
    if (isHeadingLine(line)) {
      flush();
      flushList();
      const tag = isMajorHeading(line) ? "h2" : "h3";
      out.push(`<${tag} id="nv-sec-${headingIndex++}">${escapeHtml(line)}</${tag}>`);
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
  const headings = [];
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") continue;
    if (isMetadataLine(line)) continue;
    if (isBulletLine(line)) continue;
    if (isHeadingLine(line)) {
      headings.push({ level: isMajorHeading(line) ? 2 : 3, text: line });
    }
  }
  return headings;
}
