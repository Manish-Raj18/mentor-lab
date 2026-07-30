export const tts = async (req, res) => {
  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const langCode = lang === "hindi" ? "hi" : "en";
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langCode}&client=tw-ob`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/",
      },
    });
    if (!response.ok) throw new Error(`Google TTS returned ${response.status}`);
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("TTS error:", error.message);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
};
