export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a helpful college guidance assistant for Mentor Lab. Help students with BCA, BBA, and Biotech courses, exams, and career advice." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No response from AI" });
    }
  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    res.status(500).json({ error: "Failed to get AI response", details: error.message });
  }
};
