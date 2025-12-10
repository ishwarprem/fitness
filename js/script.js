// --- Scheduler Logic ---
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// Temporary storage (In a real app, you'd load this from Supabase)
let weeklyRoutine = JSON.parse(localStorage.getItem('fitnotfat_routine')) || {};

let currentDayForModal = '';

function initScheduler() {
    const grid = document.getElementById('weekGrid');
    if (!grid) return; // Guard clause in case we aren't on the main page

    grid.innerHTML = ''; // Clear existing
    /* --- js/script.js --- */

    // ==========================================
    // 1. TAB SWITCHING LOGIC
    // ==========================================

    function switchTab(tabName) {
        // Get the HTML elements
        const schedulerSec = document.getElementById('schedulerSection');
        const exercisesSec = document.getElementById('exercisesSection');

        const schedBtn = document.getElementById('tab-scheduler');
        const exBtn = document.getElementById('tab-exercises');

        // 1. Hide BOTH sections initially
        schedulerSec.classList.add('hidden');
        exercisesSec.classList.add('hidden');

        // 2. Remove 'active' style from BOTH buttons
        if (schedBtn) schedBtn.classList.remove('active');
        if (exBtn) exBtn.classList.remove('active');

        // 3. Show the specific section requested
        if (tabName === 'scheduler') {
            schedulerSec.classList.remove('hidden');
            if (schedBtn) schedBtn.classList.add('active');
            initScheduler(); // Refresh the scheduler grid
        }
        else if (tabName === 'exercises') {
            exercisesSec.classList.remove('hidden');
            if (exBtn) exBtn.classList.add('active');
            showMain(); // Reset to main list so we don't get stuck on a detail page
        }
    }

    // Initialize default view on page load
    document.addEventListener('DOMContentLoaded', () => {
        // Default to Exercises tab
        switchTab('exercises');
        // Initialize scheduler just in case
        initScheduler();
        // Load profile data (including header image) immediately
        loadProfile();

        // Listen for Auth Changes (in case session loads LATER)
        if (typeof _supabase !== 'undefined') {
            _supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    loadProfile(); // Reload if user just signed in or session was restored
                }
            });
        }
    });


    // ==========================================
    // 2. SCHEDULER LOGIC
    // ==========================================

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let weeklyRoutine = JSON.parse(localStorage.getItem('fitnotfat_routine')) || {};
    let currentDayForModal = '';

    function initScheduler() {
        const grid = document.getElementById('weekGrid');
        if (!grid) return;

        grid.innerHTML = ''; // Clear existing content

        daysOfWeek.forEach(day => {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';

            // Get exercises for this day
            const exercises = weeklyRoutine[day] || [];

            // Create list items
            const exerciseListHTML = exercises.map((ex, index) =>
                `<li>
                ${ex} 
                <span onclick="removeExercise('${day}', ${index})">&times;</span>
            </li>`
            ).join('');

            dayCard.innerHTML = `
            <h3>${day.toUpperCase()}</h3>
            <ul class="day-exercises">${exerciseListHTML}</ul>
            <button class="add-ex-btn" onclick="openExerciseModal('${day}')">+ ADD EXERCISE</button>
        `;
            grid.appendChild(dayCard);
        });
    }

    function openExerciseModal(day) {
        currentDayForModal = day;
        const modal = document.getElementById('addExerciseModal');
        document.getElementById('modalDayName').innerText = day;

        // Populate select options
        const select = document.getElementById('exerciseSelect');
        // You can add as many exercises here as you want
        const commonExercises = [
            "Rest Day", "Squats", "Deadlifts", "Bench Press",
            "Pull Ups", "Overhead Press", "Lunges", "Bicep Curls",
            "Tricep Dips", "Running", "HIIT"
        ];

        select.innerHTML = commonExercises.map(ex => `<option value="${ex}">${ex}</option>`).join('');

        modal.showModal();
    }

    function closeModal() {
        document.getElementById('addExerciseModal').close();
    }

    function saveExercise() {
        const select = document.getElementById('exerciseSelect');
        const exercise = select.value;

        if (!weeklyRoutine[currentDayForModal]) {
            weeklyRoutine[currentDayForModal] = [];
        }

        weeklyRoutine[currentDayForModal].push(exercise);

        // Save to browser storage
        localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));

        closeModal();
        initScheduler(); // Refresh UI
    }

    function removeExercise(day, index) {
        weeklyRoutine[day].splice(index, 1);
        localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));
        initScheduler();
    }


    // ==========================================
    // 3. EXERCISE LIBRARY LOGIC (Original Code)
    // ==========================================

    function showDetail(muscle) {
        document.getElementById('mainPage').classList.add('hidden');
        // Remove hidden from the specific detail page
        const detailPage = document.getElementById(muscle + 'Detail');
        if (detailPage) {
            detailPage.classList.remove('hidden'); // Ensure logic matches CSS class
            detailPage.classList.add('active');
            detailPage.style.display = 'block'; // Fallback
        }
        window.scrollTo(0, 0);
    }

    function showMain() {
        // Hide all detail pages
        const detailPages = document.querySelectorAll('.detail-page');
        detailPages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show main grid
        const mainPage = document.getElementById('mainPage');
        mainPage.classList.remove('hidden');

        // Reset videos
        resetVideos();
        window.scrollTo(0, 0);
    }

    function resetVideos() {
        const allVideos = document.querySelectorAll('.exercise-video');
        const allButtons = document.querySelectorAll('.video-btn');

        allVideos.forEach(video => {
            video.style.display = 'none';
            if (video.tagName === 'VIDEO') {
                video.pause();
                video.currentTime = 0;
            }
        });

        allButtons.forEach(button => {
            button.textContent = 'WATCH FORM';
            button.classList.remove('active');
        });
    }

    function toggleVideo(button) {
        const video = button.nextElementSibling;

        if (video.style.display === 'none') {
            video.style.display = 'block';
            button.textContent = 'HIDE FORM';
            button.classList.add('active');
            if (video.tagName === 'VIDEO') video.play();
        } else {
            video.style.display = 'none';
            button.textContent = 'WATCH FORM';
            button.classList.remove('active');
            if (video.tagName === 'VIDEO') video.pause();
        }
    }
    daysOfWeek.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        // Create list of exercises for this day
        const exercises = weeklyRoutine[day] || [];
        const exerciseListHTML = exercises.map((ex, index) =>
            `<li onclick="removeExercise('${day}', ${index})">${ex} <span style="float:right; color:red; cursor:pointer;">&times;</span></li>`
        ).join('');

        dayCard.innerHTML = `
            <h3>${day}</h3>
            <ul class="day-exercises">${exerciseListHTML}</ul>
            <button class="add-ex-btn" onclick="openExerciseModal('${day}')">+ ADD EXERCISE</button>
        `;
        grid.appendChild(dayCard);
    });
}

// ==========================================
// 3. EXERCISE LIBRARY DATA
// ==========================================
const EXERCISE_LIBRARY = {
    "Back": [
        "Pull-Ups (Wide Grip)",
        "Face Pulls",
        "High Cable Rows",
        "Barbell Rows",
        "T-Bar Rows",
        "Seated Cable Rows",
        "Deadlifts",
        "Hyperextensions",
        "Good Mornings"
    ],
    "Biceps": [
        "Incline Dumbbell Curls",
        "Wide Grip Barbell Curls",
        "Close Grip EZ Bar Curls",
        "Concentration Curls",
        "Hammer Curls",
        "Reverse Curls"
    ],
    "Triceps": [
        "Overhead Tricep Extensions",
        "Skull Crushers",
        "Cable Pushdowns (Rope)",
        "Dips",
        "Close-Grip Bench Press",
        "Reverse Grip Pushdowns"
    ],
    "Shoulders": [
        "Front Raises",
        "Military Press",
        "Lateral Raises",
        "Upright Rows",
        "Rear Delt Flyes",
        "Face Pulls"
    ],
    "Forearms": [
        "Wrist Curls",
        "Grip Crushers",
        "Reverse Wrist Curls",
        "Wrist Rollers",
        "Farmer's Walks",
        "Dead Hangs"
    ],
    "Legs": [
        "Barbell Squats",
        "Leg Press",
        "Leg Extensions",
        "Romanian Deadlifts",
        "Leg Curls",
        "Stiff-Leg Deadlifts",
        "Hip Thrusts",
        "Bulgarian Split Squats",
        "Standing Calf Raises",
        "Seated Calf Raises"
    ],
    "Chest": [
        "Bench Press",
        "Incline Bench Press",
        "Dumbbell Flyes",
        "Push Ups",
        "Cable Crossovers",
        "Dips"
    ],
    "Cardio": [
        "Running",
        "Cycling",
        "Jump Rope",
        "HIIT",
        "Rowing",
        "Stair Climber"
    ],
    "Calisthenics": [
        "Muscle Ups",
        "Planque",
        "Front Lever",
        "Pistol Squats",
        "Handstand Pushups",
        "L-Sit"
    ],
    "Neck": [
        "Neck Curls",
        "Neck Extensions",
        "Neck Bridges"
    ],
    "Core": [
        "Plank",
        "Crunches",
        "Leg Raises",
        "Russian Twists",
        "Ab Wheel Rollouts",
        "Hanging Leg Raises"
    ],
    "Rest Day": [
        "Rest",
        "Active Recovery",
        "Stretching",
        "Foam Rolling"
    ]
};

function openExerciseModal(day) {
    currentDayForModal = day;
    const modal = document.getElementById('addExerciseModal');
    document.getElementById('modalDayName').innerText = day;

    const muscleSelect = document.getElementById('muscleGroupSelect');
    const exerciseSelect = document.getElementById('exerciseSelect');

    // Reset Selects
    muscleSelect.innerHTML = '<option value="">Select Muscle Group</option>';
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';
    exerciseSelect.disabled = true;

    // Populate Muscle Groups
    Object.keys(EXERCISE_LIBRARY).forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        muscleSelect.appendChild(option);
    });

    // Remove old listeners to prevent duplicates (simple way: clone and replace)
    const newMuscleSelect = muscleSelect.cloneNode(true);
    muscleSelect.parentNode.replaceChild(newMuscleSelect, muscleSelect);

    // Add Event Listener for Muscle Group Change
    newMuscleSelect.addEventListener('change', (e) => {
        const selectedGroup = e.target.value;
        exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';

        if (selectedGroup && EXERCISE_LIBRARY[selectedGroup]) {
            exerciseSelect.disabled = false;
            EXERCISE_LIBRARY[selectedGroup].forEach(ex => {
                const option = document.createElement('option');
                option.value = ex;
                option.textContent = ex;
                exerciseSelect.appendChild(option);
            });
        } else {
            exerciseSelect.disabled = true;
        }
    });

    modal.showModal();
}

function closeModal() {
    document.getElementById('addExerciseModal').close();
}

function saveExercise() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const exercise = exerciseSelect.value;

    if (!exercise) {
        alert("Please select an exercise.");
        return;
    }

    if (!weeklyRoutine[currentDayForModal]) {
        weeklyRoutine[currentDayForModal] = [];
    }

    weeklyRoutine[currentDayForModal].push(exercise);

    // Save to local storage
    localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));

    closeModal();
    initScheduler(); // Refresh UI
}

function removeExercise(day, index) {
    weeklyRoutine[day].splice(index, 1);
    localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));
    initScheduler();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initScheduler();
});




// --- Original Website Script ---
function showDetail(muscle) {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById(muscle + 'Detail').classList.add('active');
    window.scrollTo(0, 0);
}

function showMain() {
    const detailPages = document.querySelectorAll('.detail-page');
    detailPages.forEach(page => page.classList.remove('active'));
    document.getElementById('mainPage').classList.remove('hidden');

    // Reset all video buttons and hide all videos
    const allVideos = document.querySelectorAll('.exercise-video');
    const allButtons = document.querySelectorAll('.video-btn');

    allVideos.forEach(video => {
        video.style.display = 'none';
        if (video.tagName === 'VIDEO') {
            video.pause();
            video.currentTime = 0;
        }
    });

    allButtons.forEach(button => {
        button.textContent = 'WATCH FORM';
        button.classList.remove('active');
    });

    window.scrollTo(0, 0);
}

function toggleVideo(button) {
    const video = button.nextElementSibling;

    if (video.style.display === 'none') {
        video.style.display = 'block';
        button.textContent = 'HIDE FORM';
        button.classList.add('active');

        // Play video if it's a video element
        if (video.tagName === 'VIDEO') {
            video.play();
        }
    } else {
        video.style.display = 'none';
        button.textContent = 'WATCH FORM';
        button.classList.remove('active');

        // Pause video if it's a video element
        if (video.tagName === 'VIDEO') {
            video.pause();
        }
    }
}

function switchTab(tabName) {
    // 1. Hide all main sections
    document.getElementById('schedulerSection').classList.add('hidden');
    document.getElementById('exercisesSection').classList.add('hidden');
    const aiCoachSection = document.getElementById('aiCoachSection');
    if (aiCoachSection) aiCoachSection.classList.add('hidden');

    // 2. Remove 'active' class from all tabs
    document.getElementById('tab-scheduler').classList.remove('active');
    document.getElementById('tab-exercises').classList.remove('active');
    const tabAiCoach = document.getElementById('tab-ai-coach');
    if (tabAiCoach) tabAiCoach.classList.remove('active');
    const tabProfile = document.getElementById('tab-profile');
    if (tabProfile) tabProfile.classList.remove('active');

    // Hide Profile Section
    const profileSec = document.getElementById('profileSection');
    if (profileSec) profileSec.classList.add('hidden');

    // 3. Show the selected section and activate button
    if (tabName === 'scheduler') {
        document.getElementById('schedulerSection').classList.remove('hidden');
        document.getElementById('tab-scheduler').classList.add('active');
        initScheduler(); // Refresh grid in case of updates
    } else if (tabName === 'exercises') {
        document.getElementById('exercisesSection').classList.remove('hidden');
        document.getElementById('tab-exercises').classList.add('active');
        showMain(); // Ensure we are on the main grid, not a detail page
    } else if (tabName === 'ai-coach') {
        if (aiCoachSection) aiCoachSection.classList.remove('hidden');
        if (tabAiCoach) tabAiCoach.classList.add('active');
    } else if (tabName === 'profile') {
        if (profileSec) profileSec.classList.remove('hidden');
        if (tabProfile) tabProfile.classList.add('active');
        loadProfile(); // Load data when tab is opened
    }
}

// ==========================================
// 4. PROFILE LOGIC
// ==========================================

async function loadProfile() {
    // 1. Try Fetching from Supabase
    try {
        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            const { data, error } = await _supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data && !error) {
                // Determine source mapping (DB to JS)
                const profile = {
                    username: data.username,
                    name: data['Full Name'] || data.full_name || '', // DB might not have full_name yet, using generic
                    age: data.age,
                    height: data.height,
                    weight: data.weight,
                    gender: data.gender,
                    experience: data.experience_level,
                    frequency: data.training_frequency,
                    goal: data.goal,
                    stats: data.stats,
                    avatar_url: data.avatar_url
                };

                // Update Local Storage to match Cloud (Best Practice)
                localStorage.setItem('fitnotfat_profile', JSON.stringify(profile));

                renderProfileUI(profile);
                return; // Exit if successful
            }
        }
    } catch (err) {
        console.warn("Could not fetch from Supabase, failing over to local.", err);
    }

    // 2. Fallback to Local Storage
    const rawData = localStorage.getItem('fitnotfat_profile');
    if (rawData) {
        try {
            const profile = JSON.parse(rawData);
            renderProfileUI(profile);
        } catch (e) {
            console.error("Error loading local profile", e);
        }
    }
}

function renderProfileUI(profile) {
    // Populate fields
    if (document.getElementById('p_username')) document.getElementById('p_username').value = profile.username || '';
    if (document.getElementById('p_name')) document.getElementById('p_name').value = profile.name || '';
    if (document.getElementById('p_age')) document.getElementById('p_age').value = profile.age || '';
    if (document.getElementById('p_height')) document.getElementById('p_height').value = profile.height || '';
    if (document.getElementById('p_weight')) document.getElementById('p_weight').value = profile.weight || '';
    if (document.getElementById('p_gender')) document.getElementById('p_gender').value = profile.gender || 'male';
    if (document.getElementById('p_experience')) document.getElementById('p_experience').value = profile.experience || 'beginner';
    if (document.getElementById('p_frequency')) document.getElementById('p_frequency').value = profile.frequency || 3;
    if (document.getElementById('p_goal')) document.getElementById('p_goal').value = profile.goal || 'lose_fat';

    // Update Images
    if (profile.avatar_url) {
        const timestamp = new Date().getTime(); // Bust cache
        const fullUrl = `${profile.avatar_url}?t=${timestamp}`;

        const headerImg = document.getElementById('headerProfileImg');
        if (headerImg) headerImg.src = fullUrl;

        const pageImg = document.getElementById('profilePageImg');
        if (pageImg) pageImg.src = fullUrl;
    }
}

function saveProfile() {
    const btn = document.querySelector('.btn-save');
    const originalText = btn.innerText;
    btn.innerText = "SAVING...";

    // 1. Gather Data
    const username = document.getElementById('p_username').value;
    const name = document.getElementById('p_name').value;
    const gender = document.getElementById('p_gender').value;
    const age = parseInt(document.getElementById('p_age').value);
    const height = parseInt(document.getElementById('p_height').value);
    const weight = parseInt(document.getElementById('p_weight').value);
    const experience = document.getElementById('p_experience').value;
    const frequency = parseInt(document.getElementById('p_frequency').value);
    const goal = document.getElementById('p_goal').value;

    if (!age || !height || !weight) {
        alert("Please fill in all numerical fields to calculate stats.");
        btn.innerText = originalText;
        return;
    }

    // 2. Calculate Stats (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;

    let activityMult = 1.2;
    if (frequency >= 3) activityMult = 1.375;
    if (frequency >= 5) activityMult = 1.55;
    if (frequency >= 6) activityMult = 1.725;

    let tdee = Math.round(bmr * activityMult);

    let targetCalories = tdee;
    if (goal === 'lose_fat') targetCalories -= 500;
    if (goal === 'build_muscle') targetCalories += 300;

    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.35) / 4);
    const fats = Math.round((targetCalories * 0.35) / 9);

    // 3. Create Object
    const profileData = {
        username, name, gender, age, height, weight, experience, frequency, goal,
        stats: {
            bmr: Math.round(bmr),
            tdee: tdee,
            target_calories: targetCalories,
            macros: { protein, carbs, fats }
        },
        avatar_url: JSON.parse(localStorage.getItem('fitnotfat_profile') || '{}').avatar_url, // Preserve existing avatar
        updated_at: new Date().toISOString()
    };

    // 4. Save to Local Storage
    localStorage.setItem('fitnotfat_profile', JSON.stringify(profileData));

    // 5. Update UI
    renderProfileUI(profileData); // Refresh calculated numbers using current data

    // 6. Sync to Supabase & Show Feedback first
    saveProfileToSupabase(profileData, btn, originalText);
}

async function saveProfileToSupabase(profileData, btn, originalText) {
    try {
        const { data: { session } } = await _supabase.auth.getSession();

        // Handle Offline / No Session
        if (!session) {
            console.warn("User not logged in, saved locally only.");
            finishSaveUI(btn, originalText, "SAVED LOCALLY!");
            return;
        }

        // Handle Online Sync
        const { error } = await _supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                username: profileData.username,
                "Full Name": profileData.name,
                gender: profileData.gender,
                age: profileData.age,
                height: profileData.height,
                weight: profileData.weight,
                experience_level: profileData.experience,
                goal: profileData.goal,
                training_frequency: profileData.frequency,
                stats: profileData.stats,
                updated_at: new Date()
            });

        if (error) throw error;

        finishSaveUI(btn, originalText, "SAVED TO CLOUD!");

    } catch (err) {
        console.error("Supabase Sync Error:", err);
        finishSaveUI(btn, originalText, "SAVED LOCALLY (SYNC ERROR)");
    }
}

function finishSaveUI(btn, originalText, message) {
    // Show success message
    btn.innerText = message;
    btn.style.backgroundColor = "#00C851";

    // Wait 2 seconds, then reset UI and hide button
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = ""; // Reset color
        toggleEditMode(false); // Hide button and disable inputs AFTER message
    }, 2000);
}

function toggleEditMode(forceState = null) {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input, select');
    const editBtn = document.querySelector('.btn-edit');

    // NEW: Use the specific ID we just added
    const saveBtn = document.getElementById('profileSaveBtn');

    // Safety Check: If button is missing, stop script to prevent crash
    if (!saveBtn) {
        console.error("CRITICAL ERROR: Save button not found. Check HTML.");
        return;
    }

    // Determine Logic (Are we locked or unlocked?) 
    const isCurrentlyDisabled = inputs[0].disabled;
    const shouldEnable = forceState !== null ? forceState : isCurrentlyDisabled;

    // 1. Loop through inputs
    inputs.forEach(input => {
        // Keep username locked (read-only)
        if (input.id !== 'p_username') {
            input.disabled = !shouldEnable;
        }
    });

    // 2. Visual Updates
    if (shouldEnable) {
        // EDIT MODE: ON
        if (editBtn) editBtn.classList.add('active'); // Glow effect
        saveBtn.style.display = 'block'; // SHOW BUTTON
    } else {
        // READ MODE: ON
        if (editBtn) editBtn.classList.remove('active');
        saveBtn.style.display = 'none'; // HIDE BUTTON
    }
}

// ==========================================
// 5. CROPPER & IMAGE UPLOAD LOGIC
// ==========================================
let cropper = null;

function uploadAvatar(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const image = document.getElementById('cropImage');
        image.src = e.target.result;

        const modal = document.getElementById('cropModal');
        modal.showModal();

        // Initialize Cropper
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(image, {
            aspectRatio: 1, // Square crop for avatars
            viewMode: 1,
            autoCropArea: 1,
        });
    };
    reader.readAsDataURL(file);
    input.value = ''; // Reset input so same file can be selected again
}

function closeCropModal() {
    const modal = document.getElementById('cropModal');
    modal.close();
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

async function confirmCrop() {
    if (!cropper) return;

    // Get cropped canvas
    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
    });

    // Convert to blob
    canvas.toBlob(async (blob) => {
        closeCropModal(); // Close immediately for better UX

        const statusTxt = document.getElementById('uploadStatus');
        if (statusTxt) {
            statusTxt.innerText = "Uploading...";
            statusTxt.style.color = "#FF5200";
        }

        try {
            const { data: { session } } = await _supabase.auth.getSession();
            if (!session) throw new Error("Please login first.");

            const fileExt = "png"; // Canvas exports as png by default
            const filePath = `users/${session.user.id}/avatar.${fileExt}`;

            // Upload
            const { error: uploadError } = await _supabase.storage
                .from('avatars')
                .upload(filePath, blob, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = _supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update Profile DB
            const { error: dbError } = await _supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', session.user.id);

            if (dbError) throw dbError;

            // Success UI
            if (statusTxt) {
                statusTxt.innerText = "Done!";
                statusTxt.style.color = "#00C851";
            }

            // Update Local State & UI
            const currentProfile = JSON.parse(localStorage.getItem('fitnotfat_profile') || '{}');
            currentProfile.avatar_url = publicUrl;
            localStorage.setItem('fitnotfat_profile', JSON.stringify(currentProfile));
            renderProfileUI(currentProfile);

        } catch (error) {
            console.error("Upload failed", error);
            if (statusTxt) {
                statusTxt.innerText = "Failed.";
                statusTxt.style.color = "red";
            }
        }
    });
}
