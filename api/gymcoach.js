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
    const EXERCISE_LIBRARY = {
      "Back": ["Pull-Ups", "Face Pulls", "Rows", "Deadlifts", "Lat Pulldown"],
      "Biceps": ["Curls", "Hammer Curls", "Preacher Curls"],
      "Triceps": ["Pushdowns", "Skull Crushers", "Dips"],
      "Shoulders": ["Overhead Press", "Lateral Raises", "Front Raises"],
      "Legs": ["Squats", "Leg Press", "Lunges", "Leg Extensions"],
      "Chest": ["Bench Press", "Incline Press", "Flyes", "Push Ups"],
      "Mid Chest": ["Flat Barbell Bench Press", "Flat Dumbbell Bench Press", "Machine Chest Press", "Cable Chest Fly (Mid Height)", "Smith Machine Flat Bench Press", "Dumbbell Squeeze Press (Hex Press)"],
      "Lower Chest": ["Decline Barbell Bench Press", "Decline Dumbbell Press", "Chest Dips", "High to Low Cable Fly", "Smith Machine Decline Bench Press", "Decline Machine Chest Press", "Reverse-Grip Bench Press"],
      "Cardio": ["Treadmill Running", "Incline Treadmill Running", "Elliptical Machine", "Rowing Machine", "Step Machine", "Step Mill", "Bicycle Recline Walk", "Battle Rope", "Running", "Brisk Walking", "Burpees", "Jumping Jacks", "Jump Rope", "High Knee Skips", "Marching on Spot", "Squat Burpees", "Side Kick Burpee", "Slow Burpee", "Mountain Climbers", "Side Mountain Climber", "Inchworm Mountain Climbers", "Criss Cross Elbow to Knee", "Touchdown", "Jack Step", "Low Lunge Twist", "Lunge with Leg Lift", "Twist Knee Thrust", "Bodyweight Knee Thrust", "Assault Run", "Split Jump to Box", "Alternate Heel Touch Side Kick Squat", "Skater Hop Tap", "Sky Bike", "Devil Press"],
      "Calisthenics": ["Wall Push-Ups", "Incline Push-Ups", "Knee Push-Ups", "Standard Push-Ups", "Bench Dips (Knees Bent)", "Australian Rows (Inverted Rows)", "Ring Rows", "Resistance Band Assisted Pull-Ups", "Dead Hangs", "Scapular Pull-Ups"],
      "Neck": ["Neck Nods", "Side-to-Side Neck Tilts", "Neck Rotations", "Neck Circles", "Chin Tucks", "Lying Neck Flexion", "Prone Neck Extension", "Side-Lying Neck Raises", "Controlled Neck Rotations", "Neck Harness Flexion", "Neck Harness Extension", "Resistance-Band Neck Flexion/Extension", "Cable Neck Flexion/Extension", "Plate-Loaded Neck Flexion", "Wrestler Neck Bridges", "Back Bridges", "Partner-Resisted Neck Training"],
      "Rest Day": ["Rest", "Stretching"]
    };


    let systemInstruction = `
    You are GymCoach, an elite, high-energy fitness AI. 
    Your goal is to make fitness simple, fun, and aggressive.
    
    CRITICAL RULE:
    You must ONLY recommend exercises from the following allowed list. Do NOT suggest any exercise that is not in this list.
    
    ALLOWED EXERCISES:
    ${JSON.stringify(EXERCISE_LIBRARY, null, 2)}

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
      // Handle undefined injuries safely
      const injuries = userProfile.injuries && userProfile.injuries.length > 0
        ? userProfile.injuries.join(", ")
        : "None";

      systemInstruction += `
        USER PROFILE:
        - Goal: ${userProfile.goal}
        - Experience: ${userProfile.experience_level || 'Beginner'}
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