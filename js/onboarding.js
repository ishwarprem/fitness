// js/onboarding.js

// 1. Config
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Check if user should skip wizard
async function checkWizardSkip() {
    try {
        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            // User is logged in, check if they completed onboarding
            const { data, error } = await _supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', session.user.id)
                .single();

            if (data && data.onboarding_completed) {
                // Redirect to main app
                window.location.href = 'index.html';
                return true;
            }
        }
    } catch (err) {
        console.log('No existing session or profile');
    }
    return false;
}

// Run check on page load
checkWizardSkip();

// 3. State Management
let currentStep = 1;
const totalSteps = 9;
let formData = {};

// 4. DOM Elements
const steps = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progressBar');
const stepNum = document.getElementById('currentStepNum');
const freqSlider = document.getElementById('frequency');
const freqDisplay = document.getElementById('freqDisplay');
const splitName = document.getElementById('splitName');

// 5. Initialize Date Picker
function initializeDatePicker() {
    const daySelect = document.getElementById('dobDay');
    const monthSelect = document.getElementById('dobMonth');
    const yearSelect = document.getElementById('dobYear');

    // Populate days (1-31)
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Populate months
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Populate years (1940 - current year - 10)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i >= 1940; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Add change listeners to calculate age
    [daySelect, monthSelect, yearSelect].forEach(select => {
        select.addEventListener('change', updateCalculatedAge);
    });
}

function updateCalculatedAge() {
    const day = document.getElementById('dobDay').value;
    const month = document.getElementById('dobMonth').value;
    const year = document.getElementById('dobYear').value;

    if (day && month && year) {
        const dob = new Date(year, month - 1, day);
        const age = calculateAge(dob);
        document.getElementById('calculatedAge').textContent = `Age: ${age} years old`;
    } else {
        document.getElementById('calculatedAge').textContent = '';
    }
}

function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// Initialize on load
initializeDatePicker();

// 6. Slider Logic
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

// 7. Navigation Logic
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            saveStepData(currentStep);

            // If moving to step 8 (preview), generate summary
            if (currentStep === 7) {
                generateSummary();
            }

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

    // Scroll to top
    window.scrollTo(0, 0);
}

function validateStep(step) {
    const currentEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentEl.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value || (input.type === 'radio' && !currentEl.querySelector(`input[name="${input.name}"]:checked`))) {
            isValid = false;
            if (input.tagName === 'SELECT') {
                input.style.borderColor = 'red';
                setTimeout(() => input.style.borderColor = '#333', 2000);
            } else if (input.type !== 'radio') {
                input.style.borderColor = 'red';
                setTimeout(() => input.style.borderColor = '#333', 2000);
            }
        }
    });

    // Special validation for Step 9 (password confirmation)
    if (step === 9) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            isValid = false;
        }
    }

    return isValid;
}

function saveStepData(step) {
    switch (step) {
        case 1: // Goal
            formData.goal = document.querySelector('input[name="goal"]:checked').value;
            break;
        case 2: // Body Metrics
            formData.gender = document.querySelector('input[name="gender"]:checked').value;
            formData.height = parseInt(document.getElementById('height').value);
            formData.weight = parseInt(document.getElementById('weight').value);
            const day = document.getElementById('dobDay').value;
            const month = document.getElementById('dobMonth').value;
            const year = document.getElementById('dobYear').value;
            formData.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            formData.age = calculateAge(new Date(formData.dateOfBirth));
            break;
        case 3: // Fitness Level
            formData.experience = document.querySelector('input[name="experience"]:checked').value;
            break;
        case 4: // Equipment
            formData.equipment = document.querySelector('input[name="equipment"]:checked').value;
            break;
        case 5: // Training Frequency
            formData.frequency = parseInt(document.getElementById('frequency').value);
            break;
        case 6: // Injuries
            const injuries = [];
            document.querySelectorAll('input[name="injury"]:checked').forEach(cb => injuries.push(cb.value));
            formData.injuries = injuries;
            break;
        case 7: // Personal Info
            formData.fullName = document.getElementById('fullName').value;
            formData.username = document.getElementById('username').value;
            break;
    }

    // Save to localStorage as backup
    localStorage.setItem('fitnotfat_onboarding', JSON.stringify(formData));
}

// 8. Generate Summary (Step 8)
function generateSummary() {
    const container = document.getElementById('summaryContainer');

    const goalLabels = {
        'lose_fat': '🔥 Lose Fat',
        'build_muscle': '💪 Build Muscle',
        'recomp': '⚡ Recomposition',
        'general_fitness': '🎯 General Fitness'
    };

    const equipmentLabels = {
        'full_gym': '🏋️ Full Gym Access',
        'basic_equipment': '🔧 Basic Equipment',
        'dumbbells_only': '🏋️‍♂️ Dumbbells Only',
        'cables_only': '🔗 Cables Only',
        'bodyweight_only': '🤸 Bodyweight Only'
    };

    const experienceLabels = {
        'beginner': 'Beginner (0-1 years)',
        'intermediate': 'Intermediate (1-3 years)',
        'advanced': 'Advanced (3+ years)'
    };

    container.innerHTML = `
        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Health Goal</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(1)">Edit</button>
            </div>
            <div class="summary-value">${goalLabels[formData.goal]}</div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Body Metrics</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(2)">Edit</button>
            </div>
            <div class="summary-value">
                ${formData.gender === 'male' ? 'Male' : 'Female'} • 
                ${formData.height} cm • 
                ${formData.weight} kg • 
                ${formData.age} years old
            </div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Fitness Level</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(3)">Edit</button>
            </div>
            <div class="summary-value">${experienceLabels[formData.experience]}</div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Equipment Access</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(4)">Edit</button>
            </div>
            <div class="summary-value">${equipmentLabels[formData.equipment]}</div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Training Frequency</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(5)">Edit</button>
            </div>
            <div class="summary-value">${formData.frequency} days per week</div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Injuries & Limitations</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(6)">Edit</button>
            </div>
            <div class="summary-value">${formData.injuries.length > 0 ? formData.injuries.join(', ') : 'None'}</div>
        </div>

        <div class="summary-section">
            <div class="summary-section-header">
                <h3>Personal Information</h3>
                <button type="button" class="summary-edit-btn" onclick="changeStep(7)">Edit</button>
            </div>
            <div class="summary-value">${formData.fullName} (@${formData.username})</div>
        </div>
    `;
}

// 9. Final Logic: Create Account & Save
document.getElementById('finishBtn').addEventListener('click', async () => {
    const btn = document.getElementById('finishBtn');

    if (!validateStep(9)) return;

    btn.innerText = "CREATING ACCOUNT...";
    btn.disabled = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // 1. Create Auth Account (matching auth.html behavior)
        const { data, error } = await _supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            throw error;
        }

        // Check if user was created
        if (!data.user) {
            throw new Error('Account creation failed. Please try again.');
        }

        // 2. Calculate BMR/TDEE
        let bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age);
        bmr += (formData.gender === 'male') ? 5 : -161;

        let activityMult = 1.2;
        if (formData.frequency >= 3) activityMult = 1.375;
        if (formData.frequency >= 5) activityMult = 1.55;
        if (formData.frequency >= 6) activityMult = 1.725;

        let tdee = Math.round(bmr * activityMult);
        let targetCalories = tdee;
        if (formData.goal === 'lose_fat') targetCalories -= 500;
        if (formData.goal === 'build_muscle') targetCalories += 300;

        // 3. Save Profile Data (using insert with onConflict to handle RLS properly)
        const profileData = {
            id: data.user.id,
            username: formData.username,
            email: email, // Save email for username login
            'Full Name': formData.fullName,
            gender: formData.gender,
            age: formData.age,
            height: formData.height,
            weight: formData.weight,
            date_of_birth: formData.dateOfBirth,
            experience_level: formData.experience,
            goal: formData.goal,
            training_frequency: formData.frequency,
            equipment_access: formData.equipment,
            injuries: formData.injuries,
            onboarding_completed: true,
            stats: {
                bmr: Math.round(bmr),
                tdee: tdee,
                target_calories: targetCalories
            },
            updated_at: new Date().toISOString()
        };

        const { error: profileError } = await _supabase
            .from('profiles')
            .insert(profileData);

        if (profileError) {
            console.error("Profile Error:", profileError);
            throw new Error("Failed to save profile data: " + profileError.message);
        }

        // 4. Success! (matching auth.html success flow)
        btn.innerText = "✓ ACCOUNT CREATED!";
        btn.style.backgroundColor = "#00C851";

        // Clear localStorage
        localStorage.removeItem('fitnotfat_onboarding');

        // Save profile to localStorage for immediate use
        localStorage.setItem('fitnotfat_profile', JSON.stringify({
            username: formData.username,
            name: formData.fullName,
            age: formData.age,
            height: formData.height,
            weight: formData.weight,
            gender: formData.gender,
            experience: formData.experience,
            frequency: formData.frequency,
            goal: formData.goal
        }));

        // Redirect to main app (matching auth.html behavior)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.error("Error:", error);

        // Better error messages (matching auth.html style)
        let errorMessage = error.message;

        if (error.message.includes('already registered')) {
            errorMessage = 'This email is already registered. Please login instead.';
        } else if (error.message.includes('Invalid email')) {
            errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Password')) {
            errorMessage = 'Password must be at least 6 characters.';
        }

        alert("Error: " + errorMessage);
        btn.innerText = "TRY AGAIN";
        btn.style.backgroundColor = "#FF5200";
        btn.disabled = false;
    }
});

// 10. Password Visibility Toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('.eye-icon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈'; // Closed eye
    } else {
        input.type = 'password';
        icon.textContent = '👁️'; // Open eye
    }
}