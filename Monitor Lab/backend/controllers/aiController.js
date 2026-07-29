import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const callGroq = async (systemPrompt, userMessage) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }
  throw new Error("No response from AI");
};

export const chat = async (req, res) => {
  const { message, language } = req.body;
  const lang = language || "english";

  const systemPrompt = `You are a helpful college guidance assistant for Mentor Lab. Help students with BCA, BBA, and Biotech courses, exams, and career advice. Format your response: use short paragraphs separated by blank lines, and bullet points (•) for lists. NEVER write one long paragraph. IMPORTANT: You MUST respond in ${lang} language only. If ${lang} is "hindi", write in Hindi script (Devanagari). If ${lang} is "english", write in English. Never mix languages.`;

  try {
    const reply = await callGroq(systemPrompt, message);
    res.json({ reply });
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    res.status(500).json({ error: "Failed to get AI response", details: error.message });
  }
};

export const explainNote = async (req, res) => {
  const { subject, course } = req.body;

  if (!subject) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  try {
    let pdfText = "";

    const filename = subject.replace(/\s+/g, "_") + ".pdf";
    const filepath = path.join(process.cwd(), "uploads", filename);

    if (fs.existsSync(filepath)) {
      const buffer = fs.readFileSync(filepath);
      const parsed = await PDFParse(buffer);
      pdfText = parsed.text.substring(0, 8000);
    }

    let userMessage;
    if (pdfText) {
      userMessage = `Here is the content of the note on "${subject}" (${course || "N/A"}):\n\n${pdfText}\n\nPlease explain this topic in simple words and at the end list the most important points to remember.`;
    } else {
      userMessage = `Explain the topic "${subject}" for ${course || "college"} students. Explain it in simple language and at the end list the most important key points to remember.`;
    }

    const reply = await callGroq(
      "You are a helpful academic tutor for Mentor Lab. You explain topics clearly and always end with important key points. Use simple language suitable for students. Format: short paragraphs separated by blank lines, bullet points (•) for lists. Never write one long paragraph.",
      userMessage
    );

    res.json({ reply, hasPdf: !!pdfText });
  } catch (error) {
    console.error("Error explaining note:", error);
    res.status(500).json({ error: "Failed to explain", details: error.message });
  }
};
