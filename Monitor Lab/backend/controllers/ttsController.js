export const tts = async (req, res) => {
  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const langCode = lang === "hindi" ? "hi" : "en";
  const encoded = encodeURIComponent(text);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${langCode}&client=tw-ob`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google TTS returned ${response.status}`);
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Length", buffer.byteLength.toString());
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("TTS error:", error.message);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
};
