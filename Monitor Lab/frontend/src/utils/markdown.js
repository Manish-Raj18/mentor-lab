function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPlainText(text) {
  const blocks = String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/);

  return blocks
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p style="white-space: pre-wrap;">${escapeHtml(block)}</p>`)
    .join("\n");
}
