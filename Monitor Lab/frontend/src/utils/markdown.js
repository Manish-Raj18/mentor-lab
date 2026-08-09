function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isHeadingLine(line) {
  const len = line.length;
  if (len < 3 || len > 90) return false;
  if (/page\s+\d+\s*$/i.test(line)) return false;

  if (/^(unit|module|chapter|topic|lesson|part|section)\b.*\d/i.test(line)) {
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
  let headingIndex = 0;

  const flush = () => {
    if (para.length) {
      out.push(`<p style="white-space: pre-wrap;">${escapeHtml(para.join("\n"))}</p>`);
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") {
      flush();
      continue;
    }
    if (isHeadingLine(line)) {
      flush();
      const tag = isMajorHeading(line) ? "h2" : "h3";
      out.push(`<${tag} id="nv-sec-${headingIndex++}">${escapeHtml(line)}</${tag}>`);
      continue;
    }
    para.push(line);
  }
  flush();

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
    if (isHeadingLine(line)) {
      headings.push({ level: isMajorHeading(line) ? 2 : 3, text: line });
    }
  }
  return headings;
}
