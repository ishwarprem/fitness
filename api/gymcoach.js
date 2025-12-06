// api/gymcoach.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Server API Key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    // 1. Extract Message AND User Profile
    const { message, userProfile } = req.body;

    // 2. Build the "System Context" (Who the user is)
    let systemInstruction = "You are GymCoach, an expert elite fitness assistant.";

    if (userProfile) {
      // Create a readable string of their stats
      const injuries = userProfile.injuries && userProfile.injuries.length > 0
        ? userProfile.injuries.join(", ")
        : "None";

      systemInstruction += `
        YOU ARE COACHING THIS SPECIFIC USER:
        - Goal: ${userProfile.goal.toUpperCase().replace('_', ' ')}
        - Experience: ${userProfile.experience_level || userProfile.experience}
        - Gender: ${userProfile.gender}
        - Height/Weight: ${userProfile.height}cm / ${userProfile.weight}kg
        - Injuries/Limitations: ${injuries}
        - Training Frequency: ${userProfile.frequency || userProfile.training_frequency} days/week.
        
        RULES:
        1. Tailor EVERY answer to their specific goal (${userProfile.goal}).
        2. If they have injuries (${injuries}), warn them if an exercise is dangerous for them.
        3. If they are a Beginner, explain things simply. If Advanced, be technical.
        4. Keep answers concise, motivating, and "Bro-science" free. Scientific but aggressive tone.
        `;
    } else {
      systemInstruction += " You do not have the user's stats yet. Ask them to complete their profile if they ask for specific advice.";
    }

    // 3. Connect to Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Combine System Instruction + User Question
    const finalPrompt = `${systemInstruction}\n\nUSER QUESTION: "${message}"`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate response." });
  }
};