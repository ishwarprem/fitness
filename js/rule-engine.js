/**
 * FitNotFat Rule Engine
 * Hard-coded, deterministic workout system.
 * 
 * Architecture:
 *   1. Exercise Filtering Engine  (deterministic)
 *   2. Prescription Engine        (deterministic, hardcoded)
 *   3. Scheduling Layer           (deterministic)
 *
 * NO AI is allowed to override exercise eligibility or prescription values.
 */

// ==========================================
// EXPERIENCE LEVEL RANKING (for comparisons)
// ==========================================
const EXPERIENCE_RANK = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };

// ==========================================
// MASTER EXERCISE DATABASE (Flat Array)
// Each exercise has full metadata for filtering.
// ==========================================
const MASTER_EXERCISE_DB = [

    // ── BACK (21 exercises) ────────────────
    // Source: fitnotfat_back_exercises_complete.json (user-provided)
    // Equipment mapping: bodyweight→bodyweight_only/basic_equipment/full_gym, cable→cables_only/full_gym,
    //   machine→full_gym, barbell→dumbbells_only/basic_equipment/full_gym,
    //   resistance_band→basic_equipment/full_gym, weight_plate+bodyweight→basic_equipment/full_gym
    {
        exercise_id: "back_001", name: "Pull-Ups (Wide Grip)", muscle: "Back",
        movement_pattern: "vertical_pull", muscle_groups: ["lats", "upper_back"],
        equipment: ["bodyweight_only", "basic_equipment", "full_gym"],
        min_experience: "intermediate", intensity_level: "high", bodyweight_load_factor: 1.0,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "high", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: ["shoulder"]
    },
    {
        exercise_id: "back_002", name: "Face Pulls", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["rear_delts", "upper_back"],
        equipment: ["cables_only", "full_gym"],
        min_experience: "beginner", intensity_level: "low", bodyweight_load_factor: 0.0,
        joint_load: { wrist: "low", elbow: "low", shoulder: "low", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_003", name: "Lat Pulldown", muscle: "Back",
        movement_pattern: "vertical_pull", muscle_groups: ["lats"],
        equipment: ["full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.4,
        joint_load: { wrist: "low", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_004", name: "Seated Cable Rows", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["mid_back"],
        equipment: ["cables_only", "full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.35,
        joint_load: { wrist: "low", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_005", name: "Deadlifts", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["lower_back", "glutes", "hamstrings"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "intermediate", intensity_level: "high", bodyweight_load_factor: 1.2,
        joint_load: { wrist: "medium", elbow: "low", shoulder: "low", lower_back: "high", knee: "medium", ankle: "low" },
        contraindications: ["lower_back"]
    },
    {
        exercise_id: "back_006", name: "Romanian Deadlifts", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["hamstrings", "glutes"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "intermediate", intensity_level: "high", bodyweight_load_factor: 1.1,
        joint_load: { wrist: "medium", elbow: "low", shoulder: "low", lower_back: "high", knee: "low", ankle: "low" },
        contraindications: ["lower_back"]
    },
    {
        exercise_id: "back_007", name: "High Cable Rows", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["upper_back"],
        equipment: ["cables_only", "full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.35,
        joint_load: { wrist: "low", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_008", name: "Resistance Band Pull-Aparts", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["upper_back", "rear_delts"],
        equipment: ["basic_equipment", "full_gym"],
        min_experience: "beginner", intensity_level: "low", bodyweight_load_factor: 0.0,
        joint_load: { wrist: "low", elbow: "low", shoulder: "low", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_009", name: "Assisted Pull-Ups", muscle: "Back",
        movement_pattern: "vertical_pull", muscle_groups: ["lats", "upper_back"],
        equipment: ["full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.6,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_010", name: "T-Bar Row (Chest Supported)", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["mid_back"],
        equipment: ["full_gym"],
        min_experience: "intermediate", intensity_level: "moderate", bodyweight_load_factor: 0.6,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_011", name: "Meadows Row", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["lats", "mid_back"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "high", bodyweight_load_factor: 0.7,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "medium", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_012", name: "Inverted Row", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["upper_back", "lats"],
        equipment: ["bodyweight_only", "basic_equipment", "full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.7,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_013", name: "Weighted Pull-Ups", muscle: "Back",
        movement_pattern: "vertical_pull", muscle_groups: ["lats", "upper_back"],
        equipment: ["basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "high", bodyweight_load_factor: 1.2,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "high", lower_back: "low", knee: "low", ankle: "low" },
        contraindications: ["shoulder"]
    },
    {
        exercise_id: "back_014", name: "Pendlay Rows", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["mid_back"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "high", bodyweight_load_factor: 0.9,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "high", knee: "low", ankle: "low" },
        contraindications: ["lower_back"]
    },
    {
        exercise_id: "back_015", name: "Snatch-Grip Deadlift", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["lower_back", "upper_back", "glutes"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "high", bodyweight_load_factor: 1.3,
        joint_load: { wrist: "medium", elbow: "low", shoulder: "high", lower_back: "high", knee: "medium", ankle: "low" },
        contraindications: ["lower_back", "shoulder"]
    },
    {
        exercise_id: "back_016", name: "Wide-Grip Muscle-Ups", muscle: "Back",
        movement_pattern: "explosive_pull", muscle_groups: ["lats", "upper_back"],
        equipment: ["bodyweight_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "very_high", bodyweight_load_factor: 1.1,
        joint_load: { wrist: "medium", elbow: "high", shoulder: "high", lower_back: "medium", knee: "low", ankle: "low" },
        contraindications: ["shoulder", "elbow"]
    },
    {
        exercise_id: "back_017", name: "Explosive High Pulls", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["upper_back", "traps"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "very_high", bodyweight_load_factor: 1.1,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "high", lower_back: "high", knee: "medium", ankle: "low" },
        contraindications: ["lower_back", "shoulder"]
    },
    {
        exercise_id: "back_018", name: "Barbell Rows", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["mid_back"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "intermediate", intensity_level: "high", bodyweight_load_factor: 0.8,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "high", knee: "low", ankle: "low" },
        contraindications: ["lower_back"]
    },
    {
        exercise_id: "back_019", name: "T-Bar Rows", muscle: "Back",
        movement_pattern: "horizontal_pull", muscle_groups: ["mid_back"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "intermediate", intensity_level: "high", bodyweight_load_factor: 0.85,
        joint_load: { wrist: "medium", elbow: "medium", shoulder: "medium", lower_back: "medium", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_020", name: "Hyperextensions", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["lower_back", "glutes"],
        equipment: ["bodyweight_only", "basic_equipment", "full_gym"],
        min_experience: "beginner", intensity_level: "moderate", bodyweight_load_factor: 0.4,
        joint_load: { wrist: "low", elbow: "low", shoulder: "low", lower_back: "medium", knee: "low", ankle: "low" },
        contraindications: []
    },
    {
        exercise_id: "back_021", name: "Good Mornings", muscle: "Back",
        movement_pattern: "hinge", muscle_groups: ["lower_back", "hamstrings"],
        equipment: ["dumbbells_only", "basic_equipment", "full_gym"],
        min_experience: "advanced", intensity_level: "high", bodyweight_load_factor: 0.9,
        joint_load: { wrist: "medium", elbow: "low", shoulder: "medium", lower_back: "high", knee: "low", ankle: "low" },
        contraindications: ["lower_back"]
    },

    // ── REMAINING MUSCLE GROUPS ────────────
    // Waiting for user-provided JSON files:
    // - Chest exercises
    // - Shoulders exercises
    // - Triceps exercises
    // - Biceps exercises
    // - Legs exercises
    // - Core exercises
    // - Cardio exercises
];


// ==========================================
// COMPONENT 1: EXERCISE FILTERING ENGINE
// Deterministic. No AI. Final.
// ==========================================

/**
 * Filter exercises based on user profile.
 * Returns safe_exercises[] sorted by intensity suitability.
 *
 * @param {string} muscle - Target muscle group
 * @param {Object} userProfile - { equipment, injuries[], experience, goal }
 * @returns {Array} - Filtered + sorted exercises
 */
function filterExercisesForMuscle(muscle, userProfile) {
    const equipment = userProfile.equipment || userProfile.equipment_access || 'full_gym';
    const injuries = userProfile.injuries || [];
    const experience = userProfile.experience || userProfile.experience_level || 'intermediate';
    const expRank = EXPERIENCE_RANK[experience] || 0;

    // Step 1: Get all exercises for this muscle
    let pool = MASTER_EXERCISE_DB.filter(ex => ex.muscle === muscle);

    // Step 2: Filter by equipment
    pool = pool.filter(ex => ex.equipment.includes(equipment));

    // Step 3: Filter by contraindications (injuries)
    pool = pool.filter(ex => !injuries.some(inj => ex.contraindications.includes(inj)));

    // Step 4: Filter by experience level
    pool = pool.filter(ex => expRank >= (EXPERIENCE_RANK[ex.min_experience] || 0));

    // Step 5: For beginners, exclude exercises with any "high" joint_load
    if (experience === 'beginner') {
        pool = pool.filter(ex => {
            if (!ex.joint_load) return true;
            return !Object.values(ex.joint_load).some(v => v === 'high');
        });
    }

    // Step 6: Sort — low intensity first for beginners, high intensity first for advanced
    const intensityOrder = { 'low': 0, 'moderate': 1, 'high': 2, 'very_high': 3 };
    pool.sort((a, b) => {
        const aInt = intensityOrder[a.intensity_level] || 1;
        const bInt = intensityOrder[b.intensity_level] || 1;
        if (experience === 'beginner') return aInt - bInt;       // low → high
        if (experience === 'advanced') return bInt - aInt;        // high → low
        return 0; // intermediate: keep original order
    });

    return pool;
}


// ==========================================
// COMPONENT 2: PRESCRIPTION ENGINE
// Hardcoded. Deterministic. No AI override.
// ==========================================

/**
 * Prescription lookup table
 * Key: goal_experience_type → { sets, reps_min, reps_max, rest_seconds, rir }
 */
const PRESCRIPTION_TABLE = {
    // ── LOSE FAT ──
    'lose_fat_beginner_compound':     { sets: 3, reps_min: 12, reps_max: 15, rest: 45,  rir: 3 },
    'lose_fat_beginner_isolation':    { sets: 2, reps_min: 14, reps_max: 18, rest: 30,  rir: 3 },
    'lose_fat_intermediate_compound': { sets: 3, reps_min: 12, reps_max: 15, rest: 45,  rir: 2 },
    'lose_fat_intermediate_isolation':{ sets: 3, reps_min: 14, reps_max: 18, rest: 30,  rir: 2 },
    'lose_fat_advanced_compound':     { sets: 4, reps_min: 12, reps_max: 15, rest: 45,  rir: 1 },
    'lose_fat_advanced_isolation':    { sets: 3, reps_min: 14, reps_max: 18, rest: 30,  rir: 1 },

    // ── BUILD MUSCLE ──
    'build_muscle_beginner_compound':     { sets: 3, reps_min: 8,  reps_max: 12, rest: 90,  rir: 3 },
    'build_muscle_beginner_isolation':    { sets: 2, reps_min: 10, reps_max: 14, rest: 60,  rir: 3 },
    'build_muscle_intermediate_compound': { sets: 4, reps_min: 8,  reps_max: 12, rest: 90,  rir: 2 },
    'build_muscle_intermediate_isolation':{ sets: 3, reps_min: 10, reps_max: 14, rest: 60,  rir: 2 },
    'build_muscle_advanced_compound':     { sets: 4, reps_min: 6,  reps_max: 10, rest: 120, rir: 1 },
    'build_muscle_advanced_isolation':    { sets: 3, reps_min: 8,  reps_max: 12, rest: 75,  rir: 1 },

    // ── STRENGTH TRAINING (recomp) ──
    'recomp_beginner_compound':     { sets: 3, reps_min: 4,  reps_max: 6,  rest: 120, rir: 3 },
    'recomp_beginner_isolation':    { sets: 2, reps_min: 6,  reps_max: 10, rest: 90,  rir: 3 },
    'recomp_intermediate_compound': { sets: 4, reps_min: 3,  reps_max: 5,  rest: 150, rir: 2 },
    'recomp_intermediate_isolation':{ sets: 3, reps_min: 6,  reps_max: 8,  rest: 90,  rir: 2 },
    'recomp_advanced_compound':     { sets: 5, reps_min: 1,  reps_max: 5,  rest: 180, rir: 1 },
    'recomp_advanced_isolation':    { sets: 3, reps_min: 5,  reps_max: 8,  rest: 105, rir: 1 },

    // ── GENERAL FITNESS ──
    'general_fitness_beginner_compound':     { sets: 3, reps_min: 10, reps_max: 12, rest: 60, rir: 3 },
    'general_fitness_beginner_isolation':    { sets: 2, reps_min: 12, reps_max: 15, rest: 45, rir: 3 },
    'general_fitness_intermediate_compound': { sets: 3, reps_min: 10, reps_max: 12, rest: 60, rir: 2 },
    'general_fitness_intermediate_isolation':{ sets: 3, reps_min: 12, reps_max: 15, rest: 45, rir: 2 },
    'general_fitness_advanced_compound':     { sets: 4, reps_min: 8,  reps_max: 12, rest: 75, rir: 2 },
    'general_fitness_advanced_isolation':    { sets: 3, reps_min: 10, reps_max: 14, rest: 45, rir: 2 },
};

/**
 * Attach prescription to an exercise.
 * Returns a new object with sets/reps/rest/rir attached.
 *
 * @param {Object} exercise - Exercise from MASTER_EXERCISE_DB
 * @param {Object} userProfile - { goal, experience }
 * @returns {Object} - Exercise with prescription attached
 */
function prescribeExercise(exercise, userProfile) {
    const goal = userProfile.goal || 'general_fitness';
    const experience = userProfile.experience || userProfile.experience_level || 'intermediate';

    // Derive exercise type from movement_pattern if 'type' field not present
    let exType = exercise.type;
    if (!exType && exercise.movement_pattern) {
        const compoundPatterns = ['hinge', 'vertical_pull', 'horizontal_pull', 'vertical_push', 'horizontal_push', 'squat', 'lunge', 'explosive_pull'];
        exType = compoundPatterns.includes(exercise.movement_pattern) ? 'compound' : 'isolation';
    }
    exType = exType || 'compound';

    const key = `${goal}_${experience}_${exType}`;
    const prescription = PRESCRIPTION_TABLE[key];

    if (!prescription) {
        console.error(`PRESCRIPTION_ENGINE_ERROR: No prescription found for key "${key}"`);
        // Fallback to general fitness intermediate compound
        const fallback = PRESCRIPTION_TABLE['general_fitness_intermediate_compound'];
        return {
            ...exercise,
            sets: fallback.sets,
            reps: `${fallback.reps_min}-${fallback.reps_max}`,
            rest: fallback.rest,
            rir: fallback.rir,
            prescription_source: 'fallback'
        };
    }

    return {
        ...exercise,
        sets: prescription.sets,
        reps: `${prescription.reps_min}-${prescription.reps_max}`,
        rest: prescription.rest,
        rir: prescription.rir,
        prescription_source: 'rule_engine'
    };
}


// ==========================================
// COMPONENT 3: SCHEDULING LAYER
// Deterministic. Uses existing SPLIT_TEMPLATES.
// ==========================================

/**
 * Split templates (carried over from workout-generator.js)
 */
const RULE_ENGINE_SPLITS = {
    2: { name: "Full Body", schedule: {
        "Monday": { type: "Full Body A", muscles: ["Chest","Back","Shoulders","Legs","Core"] },
        "Tuesday": { type: "Rest", muscles: [] },
        "Wednesday": { type: "Rest", muscles: [] },
        "Thursday": { type: "Full Body B", muscles: ["Chest","Back","Legs","Biceps","Triceps","Core"] },
        "Friday": { type: "Rest", muscles: [] },
        "Saturday": { type: "Rest", muscles: [] },
        "Sunday": { type: "Rest", muscles: [] }
    }},
    3: { name: "Full Body", schedule: {
        "Monday": { type: "Full Body A", muscles: ["Chest","Back","Legs","Shoulders","Core"] },
        "Tuesday": { type: "Rest", muscles: [] },
        "Wednesday": { type: "Full Body B", muscles: ["Chest","Back","Legs","Biceps","Triceps"] },
        "Thursday": { type: "Rest", muscles: [] },
        "Friday": { type: "Full Body C", muscles: ["Shoulders","Back","Legs","Core","Cardio"] },
        "Saturday": { type: "Rest", muscles: [] },
        "Sunday": { type: "Rest", muscles: [] }
    }},
    4: { name: "Upper/Lower", schedule: {
        "Monday": { type: "Upper A", muscles: ["Chest","Back","Shoulders","Biceps","Triceps"] },
        "Tuesday": { type: "Lower A", muscles: ["Legs","Core"] },
        "Wednesday": { type: "Rest", muscles: [] },
        "Thursday": { type: "Upper B", muscles: ["Chest","Back","Shoulders","Biceps","Triceps"] },
        "Friday": { type: "Lower B", muscles: ["Legs","Core","Cardio"] },
        "Saturday": { type: "Rest", muscles: [] },
        "Sunday": { type: "Rest", muscles: [] }
    }},
    5: { name: "PPL + Upper/Lower", schedule: {
        "Monday": { type: "Push", muscles: ["Chest","Shoulders","Triceps"] },
        "Tuesday": { type: "Pull", muscles: ["Back","Biceps"] },
        "Wednesday": { type: "Legs", muscles: ["Legs","Core"] },
        "Thursday": { type: "Upper", muscles: ["Chest","Back","Shoulders","Biceps","Triceps"] },
        "Friday": { type: "Lower", muscles: ["Legs","Core","Cardio"] },
        "Saturday": { type: "Rest", muscles: [] },
        "Sunday": { type: "Rest", muscles: [] }
    }},
    6: { name: "Push/Pull/Legs x2", schedule: {
        "Monday": { type: "Push", muscles: ["Chest","Shoulders","Triceps"] },
        "Tuesday": { type: "Pull", muscles: ["Back","Biceps"] },
        "Wednesday": { type: "Legs", muscles: ["Legs","Core"] },
        "Thursday": { type: "Push", muscles: ["Chest","Shoulders","Triceps"] },
        "Friday": { type: "Pull", muscles: ["Back","Biceps"] },
        "Saturday": { type: "Legs", muscles: ["Legs","Core","Cardio"] },
        "Sunday": { type: "Rest", muscles: [] }
    }},
    7: { name: "PPL + Specialization", schedule: {
        "Monday": { type: "Push", muscles: ["Chest","Shoulders","Triceps"] },
        "Tuesday": { type: "Pull", muscles: ["Back","Biceps"] },
        "Wednesday": { type: "Legs", muscles: ["Legs","Core"] },
        "Thursday": { type: "Push", muscles: ["Chest","Shoulders","Triceps"] },
        "Friday": { type: "Pull", muscles: ["Back","Biceps"] },
        "Saturday": { type: "Legs", muscles: ["Legs","Core"] },
        "Sunday": { type: "Active Recovery", muscles: ["Cardio","Core"] }
    }}
};

/**
 * Determine how many exercises per muscle group based on goal + experience.
 */
function getExerciseCount(muscle, userProfile) {
    const goal = userProfile.goal || 'general_fitness';
    const experience = userProfile.experience || userProfile.experience_level || 'intermediate';

    if (muscle === 'Cardio') {
        return goal === 'lose_fat' ? 3 : 1;
    }

    // Base count
    let count = 2;
    if (goal === 'lose_fat') count = 1;
    if (goal === 'build_muscle') count = 2;
    if (goal === 'recomp') count = 2;

    // Adjust by experience
    if (experience === 'beginner') count = Math.max(1, count - 1);
    if (experience === 'advanced') count = count + 1;

    return count;
}


// ==========================================
// MAIN PIPELINE: Filter → Prescribe → Schedule
// ==========================================

/**
 * Generate a complete workout plan using the rule engine pipeline.
 *
 * @param {Object} userProfile - Full user profile
 * @returns {Object} - Complete workout plan, or error string
 */
function generateRuleEnginePlan(userProfile) {
    console.log("⚙️ Rule Engine: Starting pipeline...");

    const frequency = userProfile.frequency || userProfile.training_frequency || 4;
    const template = RULE_ENGINE_SPLITS[Math.min(Math.max(frequency, 2), 7)];

    const weeklyPlan = {};
    const routineExercises = {};
    let totalSafeExercises = 0;

    for (const [day, dayConfig] of Object.entries(template.schedule)) {
        if (dayConfig.type === "Rest") {
            weeklyPlan[day] = "Rest";
            continue;
        }

        weeklyPlan[day] = dayConfig.type;

        if (!routineExercises[dayConfig.type]) {
            const dayExercises = [];

            for (const muscle of dayConfig.muscles) {
                // Step 1: FILTER
                const safePool = filterExercisesForMuscle(muscle, userProfile);

                if (safePool.length === 0) {
                    console.warn(`⚠️ Rule Engine: No safe exercises for ${muscle}`);
                    continue;
                }

                // Step 2: SELECT (top N by affinity sort)
                const count = getExerciseCount(muscle, userProfile);
                const selected = safePool.slice(0, count);

                // Step 3: PRESCRIBE
                const prescribed = selected.map(ex => prescribeExercise(ex, userProfile));

                dayExercises.push(...prescribed);
                totalSafeExercises += prescribed.length;
            }

            // Step 4: ORDER — compounds first, isolations second
            dayExercises.sort((a, b) => {
                const order = { 'compound': 0, 'isolation': 1 };
                return (order[a.type] || 0) - (order[b.type] || 0);
            });

            routineExercises[dayConfig.type] = dayExercises;
        }
    }

    // FAIL-SAFE: If no exercises survived filtering at all
    if (totalSafeExercises === 0) {
        console.error("❌ NO_SAFE_WORKOUT_AVAILABLE_FOR_PROFILE");
        return { error: "NO_SAFE_WORKOUT_AVAILABLE_FOR_PROFILE" };
    }

    console.log(`✅ Rule Engine: Plan generated — ${template.name}, ${totalSafeExercises} total exercises`);

    return {
        splitName: template.name,
        weeklyPlan: weeklyPlan,
        routineExercises: routineExercises,
        userProfile: {
            goal: userProfile.goal,
            equipment: userProfile.equipment || userProfile.equipment_access,
            experience: userProfile.experience || userProfile.experience_level,
            frequency: frequency,
            injuries: userProfile.injuries || [],
            age: userProfile.age
        },
        generatedByRuleEngine: true,
        generatedAt: new Date().toISOString()
    };
}
