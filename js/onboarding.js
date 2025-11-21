// js/onboarding.js

// 1. Config (Using your keys)
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. State Management
let currentStep = 1;
const totalSteps = 5;

// 3. DOM Elements
const steps = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progressBar');
const stepNum = document.getElementById('currentStepNum');
const freqSlider = document.getElementById('frequency');
const freqDisplay = document.getElementById('freqDisplay');
const splitName = document.getElementById('splitName');

// 4. Slider Logic
freqSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    freqDisplay.innerText = val;

    // Dynamic Split logic
    let splitText = "Full Body";
    if (val === 3) splitText = "Full Body / PPL";
    if (val === 4) splitText = "Upper / Lower";
    if (val === 5) splitText = "PPL / Upper / Lower";
    if (val >= 6) splitText = "Push / Pull / Legs";

    splitName.innerText = splitText;
});

// 5. Navigation Logic
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            changeStep(currentStep + 1);
        }
    });
});

document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
        changeStep(currentStep - 1);
    });
});

function changeStep(newStep) {
    // Hide current
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show new
    document.querySelector(`.form-step[data-step="${newStep}"]`).classList.add('active');

    // Update State
    currentStep = newStep;

    // Update UI
    stepNum.innerText = currentStep;
    const percentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${percentage}%`;
}

function validateStep(step) {
    const currentEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentEl.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = 'red';
            setTimeout(() => input.style.borderColor = '#333', 2000);
        }
    });
    return isValid;
}

// 6. Final Logic: Calculate & Save
document.getElementById('finishBtn').addEventListener('click', async () => {
    const btn = document.getElementById('finishBtn');
    btn.innerText = "CALCULATING...";

    // A. Gather Data
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const goal = document.querySelector('input[name="goal"]:checked').value;
    const frequency = parseInt(document.getElementById('frequency').value);

    const injuries = [];
    document.querySelectorAll('input[name="injury"]:checked').forEach(cb => injuries.push(cb.value));

    // B. Math (Mifflin-St Jeor Equation)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;

    // Activity Multiplier (Estimate based on frequency)
    let activityMult = 1.2;
    if (frequency >= 3) activityMult = 1.375;
    if (frequency >= 5) activityMult = 1.55;
    if (frequency >= 6) activityMult = 1.725;

    let tdee = Math.round(bmr * activityMult);

    // Goal Adjustment
    let targetCalories = tdee;
    if (goal === 'lose_fat') targetCalories -= 500;
    if (goal === 'build_muscle') targetCalories += 300;

    // Macros (Rough Estimate: 30% P, 35% C, 35% F)
    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.35) / 4);
    const fats = Math.round((targetCalories * 0.35) / 9);

    // C. Create Profile Object
    const profileData = {
        gender, age, height, weight, experience, goal, frequency, injuries,
        stats: {
            bmr: Math.round(bmr),
            tdee: tdee,
            target_calories: targetCalories,
            macros: { protein, carbs, fats }
        }
    };

    console.log("Generated Profile:", profileData);

    // D. Save Data (Supabase + LocalStorage Fallback)
    // D. Save Data
    try {
        // 1. Get Current User
        const { data: { session } } = await _supabase.auth.getSession();

        if (!session) {
            console.error("No session found.");
            alert("You need to be logged in to save.");
            return;
        }

        // 2. Upsert into Supabase
        // FIX: Explicitly map JS variables to DB Column Names
        const { error } = await _supabase
            .from('profiles')
            .upsert({
                id: session.user.id,

                // DB Column Name : JS Variable Name
                gender: gender,
                age: age,
                height: height,
                weight: weight,

                // FIXED: Mapped 'experience' -> 'experience_level'
                experience_level: experience,

                goal: goal,

                // FIXED: Mapped 'frequency' -> 'training_frequency'
                training_frequency: frequency,

                injuries: injuries,
                stats: { // We save the calculated math in the JSON column
                    bmr: Math.round(bmr),
                    tdee: tdee,
                    target_calories: targetCalories,
                    macros: {
                        protein: Math.round((targetCalories * 0.3) / 4),
                        carbs: Math.round((targetCalories * 0.35) / 4),
                        fats: Math.round((targetCalories * 0.35) / 9)
                    }
                },
                updated_at: new Date()
            });

        if (error) {
            console.error("Supabase Error:", error);
            throw error;
        }

        // 3. Success UI
        btn.innerText = "PROFILE COMPLETE";
        btn.style.backgroundColor = "#00C851"; // Green

        // Save local backup just in case
        localStorage.setItem('fitnotfat_profile', JSON.stringify(profileData));

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error("Saving error:", error);
        alert("Error saving profile: " + error.message);
        btn.innerText = "TRY AGAIN";
        btn.disabled = false;
    }
});