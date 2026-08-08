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

  const langInstr = lang === "hindi" ? "Your response MUST be entirely in Hindi (Devanagari script) only. Never use English." : "Respond in English.";
  const systemPrompt = `You are a friendly, direct college guidance assistant for Mentor Lab. Help students with BCA, BBA, and Biotech courses, exams, and career advice. ${langInstr}

RESPONSE STYLE (strictly follow):
1. Answer the question directly and first. Lead with the main answer, not filler.
2. Be conversational and natural, like a chat message to a friend. Short, punchy sentences.
3. Keep it brief — 2-4 sentences unless the user asks for details. No long paragraphs, no padding.
4. If a one-line answer is enough, give a one-line answer.
5. Do not repeat the question back or add unnecessary introductions, greetings, or closing remarks.`;

  try {
    const userMsg = `${message}\n\nIMPORTANT: ${langInstr}`;
    const reply = await callGroq(systemPrompt, userMsg);
    console.log("RAW GROQ REPLY:", JSON.stringify(reply));
    const formattedReply = reply
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n/)
      .map(para => para.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n')
      .trim();
    console.log("FORMATTED REPLY:", JSON.stringify(formattedReply));
    res.json({ reply: formattedReply });
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    res.status(500).json({ error: "Failed to get AI response", details: error.message });
  }
};

export const explainNote = async (req, res) => {
  const { subject, course, language } = req.body;
  const lang = language || "english";

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

    const langInstr = lang === "hindi" ? "IMPORTANT: Write your entire response in Hindi (Devanagari script) only. Do NOT write in English." : "Write in English.";

    let userMessage;
    if (pdfText) {
      userMessage = `Here is the content of the note on "${subject}" (${course || "N/A"}):\n\n${pdfText}\n\nPlease explain this topic in simple words and at the end list the most important points to remember.\n\n${langInstr}`;
    } else {
      userMessage = `Explain the topic "${subject}" for ${course || "college"} students. Explain it in simple language and at the end list the most important key points to remember.\n\n${langInstr}`;
    }

    const systemPrompt = `You are a helpful academic tutor for Mentor Lab. You explain topics clearly and always end with important key points. Use simple language suitable for students. Always respond in proper paragraphs with complete sentences. Do not put each sentence on a new line. Use blank lines between paragraphs only. Your response MUST be entirely in ${lang === "hindi" ? "Hindi (Devanagari script)" : "English"}. Never use any other language.`;

    const reply = await callGroq(systemPrompt, userMessage);
    const formattedReply = reply
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n/)
      .map(para => para.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n')
      .trim();

    res.json({ reply: formattedReply, hasPdf: !!pdfText });
  } catch (error) {
    console.error("Error explaining note:", error);
    res.status(500).json({ error: "Failed to explain", details: error.message });
  }
};
