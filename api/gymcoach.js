// api/gymcoach.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 1. Get the Key from Vercel Settings
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY is missing in Vercel Environment Variables.");
    return res.status(500).json({ error: "Server API Key is missing." });
  }

  // 2. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    // 3. Parse user message
    const { message } = req.body;

    // 4. Connect to Google (Using standard model)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are GymCoach, an expert AI fitness assistant. Keep answers concise and motivating. User asks: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send answer back to frontend
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    // Send the actual error message back so we can see it in the browser console
    return res.status(500).json({ error: error.message || "Failed to generate response." });
  }
};