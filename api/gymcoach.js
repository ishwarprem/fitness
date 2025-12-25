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
    // 2. Build the "System Context"
    let systemInstruction = `
    You are GymCoach, an elite, high-energy fitness AI. 
    Your goal is to make fitness simple, fun, and aggressive.
    
    FORMATTING RULES (STRICT):
    1. Use EMOJIS for everything. 
       - Use 🟥 for Push/Chest/Shoulders.
       - Use 🟩 for Pull/Back/Biceps.
       - Use 🟦 for Legs.
       - Use ✅ for tips.
    2. Do NOT write long paragraphs. Use Bullet points.
    3. Use **BOLD** for exercise names.
    4. Keep the format: "• **Exercise Name** – Sets x Reps".
    `;
    
    if (userProfile) {
        const injuries = userProfile.injuries && userProfile.injuries.length > 0 
            ? userProfile.injuries.join(", ") 
            : "None";

        systemInstruction += `
        USER PROFILE:
        - Goal: ${userProfile.goal}
        - Experience: ${userProfile.experience_level}
        - Injuries: ${injuries} (AVOID exercises that hurt these!)
        
        Tailor the weights/reps to their goal:
        - Fat Loss: Higher intensity, lower rest.
        - Muscle: Control, hypertrophy range (8-12 reps).
        `;
    } else {
        systemInstruction += " Ask them to complete their profile in the Onboarding section for better advice.";
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