/**
 * AI-Powered Personalized Workout Generator
 * Uses GymCoach AI (Gemini) to create personalized workout plans
 */

// ==========================================
// AI WORKOUT GENERATION
// ==========================================

/**
 * Generate a personalized workout plan using GymCoach AI
 * @param {Object} userProfile - User's profile data from Supabase
 * @returns {Object} - Structured workout plan
 */
async function generateAIWorkoutPlan(userProfile) {
    console.log("🤖 AI Workout Generator: Delegating to Rule Engine...");

    try {
        // Use the Rule Engine pipeline (deterministic, no AI)
        if (typeof generateRuleEnginePlan === 'function') {
            const plan = generateRuleEnginePlan(userProfile);

            if (plan.error) {
                console.error("❌ Rule Engine returned error:", plan.error);
                return generateFallbackPlan(userProfile);
            }

            console.log("✅ Rule Engine plan generated successfully!");
            return plan;
        }

        // Fallback if rule-engine.js not loaded
        console.warn("⚠️ Rule Engine not available, using fallback");
        return generateFallbackPlan(userProfile);

    } catch (error) {
        console.error("❌ Error in AI workout generator:", error);
        return generateFallbackPlan(userProfile);
    }
}

/**
 * Build the prompt for requesting a workout plan
 */
function buildWorkoutPlanPrompt(userProfile) {
    const goalDescriptions = {
        'lose_fat': 'lose fat and get lean (caloric deficit, high cardiovascular intensity)',
        'build_muscle': 'build muscle and gain size (caloric surplus, heavy weights, controlled tempo)',
        'recomp': 'body recomposition (build muscle while losing fat)',
        'general_fitness': 'general fitness and health'
    };

    const equipmentDescriptions = {
        'full_gym': 'full gym with barbells, dumbbells, machines, and cables',
        'basic_equipment': 'basic equipment (dumbbells, bench, resistance bands)',
        'dumbbells_only': 'only dumbbells',
        'cables_only': 'only cable machines',
        'bodyweight_only': 'no equipment (bodyweight only)'
    };

    const goal = goalDescriptions[userProfile.goal] || goalDescriptions['general_fitness'];
    const equipment = equipmentDescriptions[userProfile.equipment] || equipmentDescriptions['full_gym'];
    const frequency = userProfile.frequency || userProfile.training_frequency || 4;
    const experience = userProfile.experience || userProfile.experience_level || 'intermediate';
    const injuries = userProfile.injuries && userProfile.injuries.length > 0
        ? userProfile.injuries.join(', ')
        : 'none';

    return `
Generate a personalized ${frequency}-day weekly workout plan for me.

MY GOAL: ${goal}
MY EQUIPMENT: ${equipment}
MY EXPERIENCE: ${experience}
MY INJURIES/LIMITATIONS: ${injuries}

IMPORTANT FORMATTING RULES:
1. Structure the plan day by day (Monday through Sunday)
2. For each training day, list 4-6 exercises with sets and reps
3. Mark rest days clearly
4. Use this EXACT format for each day:

**MONDAY - [Workout Name]**
• **Exercise Name** – 3x10
• **Exercise Name** – 4x8
[etc.]

**TUESDAY - REST**
No training scheduled.

5. For my goal of ${userProfile.goal === 'lose_fat' ? 'fat loss, include more cardiovascular and explosive exercises like Push-Ups, Burpees, Jump Squats, Mountain Climbers' : userProfile.goal === 'build_muscle' ? 'muscle building, include heavier compound movements and machine exercises like Bench Press, Squats, Leg Press, Smith Machine exercises' : 'balanced fitness, include a mix of strength and conditioning'}.

6. Make sure to AVOID exercises that stress my injured areas: ${injuries}

7. Only recommend exercises I can do with: ${equipment}

Generate the complete 7-day plan now:
`;
}

/**
 * Parse AI response into structured workout format
 */
function parseAIResponse(aiResponse, userProfile) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyPlan = {};
    const routineExercises = {};

    // Clean up the response
    const cleanResponse = aiResponse.replace(/\*\*/g, '').replace(/•/g, '-');

    // Parse each day from the response
    days.forEach(day => {
        const dayUpper = day.toUpperCase();

        // Find the section for this day
        const dayPattern = new RegExp(`${dayUpper}[\\s\\-–:]+([^\\n]+)`, 'i');
        const dayMatch = cleanResponse.match(dayPattern);

        if (dayMatch) {
            const workoutName = dayMatch[1].trim();

            // Check if it's a rest day
            if (workoutName.toLowerCase().includes('rest') ||
                workoutName.toLowerCase().includes('off') ||
                workoutName.toLowerCase().includes('recovery')) {
                weeklyPlan[day] = 'Rest';
                return;
            }

            weeklyPlan[day] = workoutName;

            // Find exercises for this day
            const exercises = extractExercisesForDay(cleanResponse, day, days);

            if (!routineExercises[workoutName]) {
                routineExercises[workoutName] = exercises;
            }
        } else {
            weeklyPlan[day] = 'Rest';
        }
    });

    // Determine split name based on workout types
    const splitName = determineSplitName(weeklyPlan, userProfile);

    return {
        splitName: splitName,
        weeklyPlan: weeklyPlan,
        routineExercises: routineExercises,
        userProfile: {
            goal: userProfile.goal,
            equipment: userProfile.equipment || userProfile.equipment_access,
            experience: userProfile.experience || userProfile.experience_level,
            frequency: userProfile.frequency || userProfile.training_frequency,
            injuries: userProfile.injuries || []
        },
        generatedByAI: true,
        generatedAt: new Date().toISOString()
    };
}

/**
 * Extract exercises for a specific day from the AI response
 */
function extractExercisesForDay(response, targetDay, allDays) {
    const exercises = [];
    const lines = response.split('\n');

    let inTargetDay = false;
    const targetDayUpper = targetDay.toUpperCase();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if we've reached the target day
        if (line.toUpperCase().includes(targetDayUpper)) {
            inTargetDay = true;
            continue;
        }

        // Check if we've moved past the target day to another day
        if (inTargetDay) {
            const isNewDay = allDays.some(day =>
                day !== targetDay && line.toUpperCase().includes(day.toUpperCase())
            );
            if (isNewDay) {
                break;
            }
        }

        // Extract exercise from line (looking for bullet points or dashes)
        if (inTargetDay && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))) {
            const exercise = parseExerciseLine(line);
            if (exercise) {
                exercises.push(exercise);
            }
        }
    }

    return exercises;
}

/**
 * Parse a single exercise line
 */
function parseExerciseLine(line) {
    // Remove bullet points, numbers, and asterisks
    let cleanLine = line.replace(/^[-•*\d.)\s]+/, '').trim();

    // Try to extract exercise name and sets/reps
    // Common patterns: "Exercise Name – 3x10" or "Exercise Name - 3 sets x 10 reps"
    const patterns = [
        /^(.+?)[\s–\-—]+(\d+)\s*[xX×]\s*(\d+)/,  // "Exercise – 3x10"
        /^(.+?)[\s–\-—]+(\d+)\s*sets?\s*[xX×]?\s*(\d+)/i,  // "Exercise – 3 sets x 10"
        /^(.+?)$/  // Just the exercise name
    ];

    for (const pattern of patterns) {
        const match = cleanLine.match(pattern);
        if (match) {
            const name = match[1].replace(/\*+/g, '').trim();

            // Skip if it's just a note or description
            if (name.length < 3 || name.toLowerCase().includes('rest') ||
                name.toLowerCase().includes('note')) {
                return null;
            }

            return {
                name: name,
                sets: match[2] ? parseInt(match[2]) : 3,
                reps: match[3] ? parseInt(match[3]) : 10,
                videoUrl: getExerciseVideoUrl(name),
                type: 'image'
            };
        }
    }

    return null;
}

/**
 * Get video URL for an exercise (lookup from our exercise database)
 */
function getExerciseVideoUrl(exerciseName) {
    // Video/GIF database for common exercises
    const videoDatabase = {
        // Chest
        'push ups': 'https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif',
        'push-ups': 'https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif',
        'bench press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4',
        'flat barbell bench press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4',
        'incline dumbbell press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4',
        'incline bench press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4',
        'cable fly': 'https://i.makeagif.com/media/9-28-2015/-z-AFG.gif',
        'cable chest fly': 'https://i.makeagif.com/media/9-28-2015/-z-AFG.gif',
        'chest dips': 'https://media.giphy.com/media/l0ErMq4SxbNJLtjfq/giphy.gif',
        'dips': 'https://media.giphy.com/media/l0ErMq4SxbNJLtjfq/giphy.gif',

        // Back
        'pull-ups': 'https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif',
        'pull ups': 'https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif',
        'lat pulldown': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1011.mp4',
        'barbell rows': 'https://downloads.ctfassets.net/6ilvqec50fal/26TEIC8oITW2g58iY4lx9i/bc3ddf88afd1fa401738c39e64a17dfa/Reverse_Grip_-_Underhand_-_Barbell_Bent-Over_Row.gif',
        'seated cable rows': 'https://gymvisual.com/img/p/1/5/2/4/1/15241.gif',
        'face pulls': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
        'deadlifts': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1001.mp4',

        // Shoulders
        'lateral raises': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif',
        'overhead press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3002.mp4',
        'shoulder press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3001.mp4',
        'military press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3002.mp4',

        // Arms
        'bicep curls': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7001.mp4',
        'hammer curls': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4',
        'incline dumbbell curls': 'https://www.strengthlog.com/wp-content/uploads/2020/10/Incline-Dumbbell-Curl.gif',
        'tricep pushdowns': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4',
        'cable pushdowns': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4',
        'overhead tricep extensions': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6032.mp4',
        'skull crushers': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6003.mp4',

        // Legs
        'squats': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4001.mp4',
        'barbell squats': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4001.mp4',
        'leg press': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4067.mp4',
        'romanian deadlifts': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1004.mp4',
        'leg curls': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4004.mp4',
        'leg extensions': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4007.mp4',
        'calf raises': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4053.mp4',
        'lunges': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4021.mp4',
        'hip thrusts': 'https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4031.mp4',
        'glute bridges': 'https://gymvisual.com/img/p/2/5/4/7/3/25473.gif',

        // Core
        'plank': 'https://gymvisual.com/img/p/2/5/4/8/0/25480.gif',
        'crunches': 'https://gymvisual.com/img/p/2/5/4/8/2/25482.gif',
        'mountain climbers': 'https://media.giphy.com/media/l0MYN7wNwqAhzAatW/giphy.gif',
        'bicycle crunches': 'https://gymvisual.com/img/p/2/5/4/7/4/25474.gif',
        'russian twists': 'https://gymvisual.com/img/p/2/5/4/7/5/25475.gif',
        'leg raises': 'https://gymvisual.com/img/p/2/5/4/8/3/25483.gif',

        // Cardio
        'burpees': 'https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif',
        'jump rope': 'https://media.giphy.com/media/3o7TKGYknBNsadHzSU/giphy.gif',
        'jumping jacks': 'https://media.giphy.com/media/l0MYB6DnI0kHpA3te/giphy.gif',
        'high knees': 'https://media.giphy.com/media/l0MYB6DnI0kHpA3te/giphy.gif',
        'jump squats': 'https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif'
    };

    // Try to find a matching video
    const lowerName = exerciseName.toLowerCase();

    for (const [key, url] of Object.entries(videoDatabase)) {
        if (lowerName.includes(key) || key.includes(lowerName)) {
            return url;
        }
    }

    // Default placeholder
    return 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(exerciseName);
}

/**
 * Determine the split name based on workout types
 */
function determineSplitName(weeklyPlan, userProfile) {
    const workoutDays = Object.values(weeklyPlan).filter(w => w !== 'Rest');
    const frequency = workoutDays.length;

    // Check for common patterns
    const hasUpperLower = workoutDays.some(w => w.toLowerCase().includes('upper')) &&
        workoutDays.some(w => w.toLowerCase().includes('lower'));
    const hasPPL = workoutDays.some(w => w.toLowerCase().includes('push')) &&
        workoutDays.some(w => w.toLowerCase().includes('pull')) &&
        workoutDays.some(w => w.toLowerCase().includes('leg'));
    const hasFullBody = workoutDays.some(w => w.toLowerCase().includes('full body'));

    if (hasPPL) return 'Push/Pull/Legs';
    if (hasUpperLower) return 'Upper/Lower Split';
    if (hasFullBody) return 'Full Body';

    // Default based on frequency
    if (frequency <= 3) return 'Full Body';
    if (frequency === 4) return 'Upper/Lower';
    return 'Push/Pull/Legs';
}

/**
 * Fallback plan generator (uses static logic if AI fails)
 */
function generateFallbackPlan(userProfile) {
    console.log("⚠️ Using fallback plan generator");

    // Use the existing workout-generator.js logic
    if (typeof generatePersonalizedWorkoutPlan === 'function') {
        return generatePersonalizedWorkoutPlan(userProfile);
    }

    // Ultimate fallback - basic PPL
    return {
        splitName: "Push/Pull/Legs",
        weeklyPlan: {
            "Monday": "Push",
            "Tuesday": "Pull",
            "Wednesday": "Legs",
            "Thursday": "Push",
            "Friday": "Pull",
            "Saturday": "Legs",
            "Sunday": "Rest"
        },
        routineExercises: {
            "Push": [
                { name: "Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4", type: "video" },
                { name: "Incline Dumbbell Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4", type: "video" },
                { name: "Lateral Raises", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif", type: "image" },
                { name: "Tricep Pushdowns", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", type: "video" }
            ],
            "Pull": [
                { name: "Pull-Ups", videoUrl: "https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif", type: "image" },
                { name: "Barbell Rows", videoUrl: "https://downloads.ctfassets.net/6ilvqec50fal/26TEIC8oITW2g58iY4lx9i/bc3ddf88afd1fa401738c39e64a17dfa/Reverse_Grip_-_Underhand_-_Barbell_Bent-Over_Row.gif", type: "image" },
                { name: "Face Pulls", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif", type: "image" },
                { name: "Hammer Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4", type: "video" }
            ],
            "Legs": [
                { name: "Squats", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4001.mp4", type: "video" },
                { name: "Romanian Deadlifts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1004.mp4", type: "video" },
                { name: "Leg Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4067.mp4", type: "video" },
                { name: "Calf Raises", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4053.mp4", type: "video" }
            ]
        },
        userProfile: userProfile,
        generatedByAI: false
    };
}

// ==========================================
// MAIN INITIALIZATION FUNCTION
// ==========================================

/**
 * Initialize personalized workout plan using AI
 */
async function initializePersonalizedPlan() {
    try {
        // Check for cached AI plan first
        const cachedPlan = localStorage.getItem('fitnotfat_ai_workout_plan');
        if (cachedPlan) {
            const plan = JSON.parse(cachedPlan);
            // Check if plan is less than 7 days old
            const planAge = new Date() - new Date(plan.generatedAt);
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            if (planAge < sevenDays) {
                console.log("📦 Using cached AI workout plan");
                ACTIVE_PERSONALIZED_PLAN = plan;
                return plan;
            }
        }

        // Get user profile from Supabase
        const { data: { session } } = await _supabase.auth.getSession();

        if (session) {
            const { data: profile, error } = await _supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile && !error) {
                const userProfile = {
                    name: profile['Full Name'] || profile.username,
                    goal: profile.goal || 'general_fitness',
                    equipment: profile.equipment_access || 'full_gym',
                    experience: profile.experience_level || 'intermediate',
                    frequency: profile.training_frequency || 4,
                    injuries: profile.injuries || [],
                    gender: profile.gender,
                    age: profile.age,
                    weight: profile.weight,
                    height: profile.height,
                    stats: profile.stats
                };

                // Generate AI workout plan
                const plan = await generateAIWorkoutPlan(userProfile);

                // Cache the plan
                localStorage.setItem('fitnotfat_ai_workout_plan', JSON.stringify(plan));
                ACTIVE_PERSONALIZED_PLAN = plan;

                return plan;
            }
        }

        // Fallback to cached or default
        if (cachedPlan) {
            ACTIVE_PERSONALIZED_PLAN = JSON.parse(cachedPlan);
            return ACTIVE_PERSONALIZED_PLAN;
        }

        // Ultimate fallback
        console.log("⚠️ No profile found, using default plan");
        ACTIVE_PERSONALIZED_PLAN = generateFallbackPlan({
            goal: 'general_fitness',
            equipment: 'full_gym',
            experience: 'intermediate',
            frequency: 4,
            injuries: []
        });

        return ACTIVE_PERSONALIZED_PLAN;

    } catch (error) {
        console.error("Error initializing AI workout plan:", error);

        // Fallback
        const cachedPlan = localStorage.getItem('fitnotfat_ai_workout_plan');
        if (cachedPlan) {
            ACTIVE_PERSONALIZED_PLAN = JSON.parse(cachedPlan);
            return ACTIVE_PERSONALIZED_PLAN;
        }

        return generateFallbackPlan({
            goal: 'general_fitness',
            equipment: 'full_gym',
            experience: 'intermediate',
            frequency: 4,
            injuries: []
        });
    }
}

/**
 * Force regenerate the AI workout plan
 */
async function regeneratePersonalizedPlan() {
    console.log("🔄 Regenerating AI workout plan...");
    localStorage.removeItem('fitnotfat_ai_workout_plan');
    localStorage.removeItem('fitnotfat_personalized_plan');
    return await initializePersonalizedPlan();
}

// Global variable for active plan
let ACTIVE_PERSONALIZED_PLAN = null;
