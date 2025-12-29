// --- js/script.js ---

// ==========================================
// 1. TAB SWITCHING LOGIC
// ==========================================

function switchTab(tabName) {
    // Hide all main sections
    document.getElementById('schedulerSection').classList.add('hidden');
    document.getElementById('exercisesSection').classList.add('hidden');
    const aiCoachSection = document.getElementById('aiCoachSection');
    if (aiCoachSection) aiCoachSection.classList.add('hidden');
    const profileSec = document.getElementById('profileSection');
    if (profileSec) profileSec.classList.add('hidden');

    // Remove 'active' class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show the selected section and activate button
    if (tabName === 'scheduler') {
        document.getElementById('schedulerSection').classList.remove('hidden');
        document.getElementById('tab-scheduler').classList.add('active');
        initScheduler();
    } else if (tabName === 'exercises') {
        document.getElementById('exercisesSection').classList.remove('hidden');
        document.getElementById('tab-exercises').classList.add('active');
        showMain();
    } else if (tabName === 'ai-coach') {
        if (aiCoachSection) aiCoachSection.classList.remove('hidden');
        document.getElementById('tab-ai-coach').classList.add('active');
    } else if (tabName === 'profile') {
        if (profileSec) profileSec.classList.remove('hidden');
        // We call loadProfile() from index.html, not here
    }
}

// ==========================================
// 2. SCHEDULER LOGIC
// ==========================================

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let weeklyRoutine = JSON.parse(localStorage.getItem('fitnotfat_routine')) || {};
let selectedDate = new Date(); // Default to today
let currentDayForModal = '';
let currentWeekStart = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function initScheduler() {
    renderCalendarStrip();
    renderActiveDay(selectedDate);
}

function renderCalendarStrip() {
    const strip = document.getElementById('calendarStrip');
    if (!strip) return;

    strip.innerHTML = '';
    const today = new Date();

    // Update Month/Year Header
    const monthYear = document.getElementById('currentMonthYear');
    if (monthYear) {
        monthYear.innerText = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);

        const dayNameFull = daysOfWeek[i]; // Monday, Tuesday...
        const dayNameShort = dayNameFull.substring(0, 3); // Mon, Tue...
        const dayNumber = date.getDate();

        const isSelected = isSameDate(date, selectedDate);
        const isToday = isSameDate(date, today);
        const hasWorkout = weeklyRoutine[dayNameFull] && weeklyRoutine[dayNameFull].length > 0;

        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''} ${hasWorkout ? 'has-workout' : ''}`;
        dayEl.onclick = () => {
            selectedDate = date;
            initScheduler(); // Re-render
        };

        dayEl.innerHTML = `
            <div class="day-name">${dayNameShort}</div>
            <div class="day-number">${dayNumber}</div>
            <div class="workout-dot"></div>
        `;

        strip.appendChild(dayEl);
    }
}

const WEEKLY_PLAN = {
    "Monday": "Push",
    "Tuesday": "Pull",
    "Wednesday": "Legs",
    "Thursday": "Push",
    "Friday": "Pull",
    "Saturday": "Legs",
    "Sunday": "Rest"
};

// Exercise database with video/gif URLs for each routine
const ROUTINE_EXERCISES = {
    "Push": [
        { name: "Flat Barbell Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4", type: "video" },
        { name: "Incline Dumbbell Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4", type: "video" },
        { name: "Cable Chest Fly", videoUrl: "https://i.makeagif.com/media/9-28-2015/-z-AFG.gif", type: "image" },
        { name: "Overhead Tricep Extensions", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6032.mp4", type: "video" },
        { name: "Cable Pushdowns", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", type: "video" },
        { name: "Lateral Raises", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif", type: "image" }
    ],
    "Pull": [
        { name: "Pull-Ups (Wide Grip)", videoUrl: "https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif", type: "image" },
        { name: "Barbell Rows", videoUrl: "https://downloads.ctfassets.net/6ilvqec50fal/26TEIC8oITW2g58iY4lx9i/bc3ddf88afd1fa401738c39e64a17dfa/Reverse_Grip_-_Underhand_-_Barbell_Bent-Over_Row.gif", type: "image" },
        { name: "Seated Cable Rows", videoUrl: "https://gymvisual.com/img/p/1/5/2/4/1/15241.gif", type: "image" },
        { name: "Face Pulls", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif", type: "image" },
        { name: "Hammer Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4", type: "video" },
        { name: "Incline Dumbbell Curls", videoUrl: "https://www.strengthlog.com/wp-content/uploads/2020/10/Incline-Dumbbell-Curl.gif", type: "image" }
    ],
    "Legs": [
        { name: "Barbell Squats", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4001.mp4", type: "video" },
        { name: "Leg Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4067.mp4", type: "video" },
        { name: "Romanian Deadlifts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1004.mp4", type: "video" },
        { name: "Leg Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4004.mp4", type: "video" },
        { name: "Leg Extensions", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4007.mp4", type: "video" },
        { name: "Standing Calf Raises", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4053.mp4", type: "video" }
    ]
};

function renderActiveDay(date) {
    const container = document.getElementById('activeDayView');
    if (!container) return;

    const dayIndex = (date.getDay() + 6) % 7; // 0=Mon, 6=Sun
    const dayName = daysOfWeek[dayIndex];
    const routineName = WEEKLY_PLAN[dayName] || "Rest";

    // Check if it's a rest day
    if (routineName === "Rest") {
        container.innerHTML = `
            <div class="empty-card">
                <h3>Rest Day</h3>
                <p>No workout scheduled for ${dayName}.</p>
            </div>
        `;
        return;
    }

    const exercises = ROUTINE_EXERCISES[routineName] || [];
    const exerciseCount = exercises.length;

    // It is a workout day
    container.innerHTML = `
        <div class="workout-preview-card">
            <div class="workout-card-header">
                <div class="workout-target-label">
                    <div class="workout-icon-circle">💪</div>
                    ${routineName} Day
                </div>
            </div>

            <div class="workout-info-body" style="padding: 20px; text-align: center;">
                <h2 style="margin: 10px 0; font-size: 2rem;">${routineName}</h2>
                <p style="color: #888;">${exerciseCount} exercises • ~60 mins</p>
            </div>

            <div class="action-buttons">
                 <button class="preview-btn" onclick="openWorkoutPreview('${routineName}')">PREVIEW WORKOUT</button>
            </div>
        </div>
    `;
}

// Open workout preview modal
function openWorkoutPreview(routineName) {
    const exercises = ROUTINE_EXERCISES[routineName] || [];

    // Check if modal already exists, if not create it
    let modal = document.getElementById('workoutPreviewModal');
    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'workoutPreviewModal';
        modal.className = 'workout-preview-modal';
        document.body.appendChild(modal);
    }

    // Build exercise list HTML
    const exerciseListHTML = exercises.map((ex, index) => `
        <div class="preview-exercise-item" id="preview-ex-${index}">
            <div class="exercise-info">
                <span class="exercise-number">${index + 1}</span>
                <span class="exercise-name">${ex.name}</span>
            </div>
            <button class="video-btn" onclick="togglePreviewVideo(${index}, '${ex.videoUrl}', '${ex.type}')">WATCH FORM</button>
            <div class="preview-media-container" id="preview-media-${index}" style="display: none;"></div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="modal-header">
            <h3>${routineName} Workout</h3>
            <button class="modal-close-btn" onclick="closeWorkoutPreview()">✕</button>
        </div>
        <div class="modal-body">
            <p class="modal-subtitle">${exercises.length} exercises</p>
            <div class="exercise-list">
                ${exerciseListHTML}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-modal btn-cancel" onclick="closeWorkoutPreview()">Close</button>
        </div>
    `;

    // Add styles if not already added
    if (!document.getElementById('workoutPreviewStyles')) {
        const style = document.createElement('style');
        style.id = 'workoutPreviewStyles';
        style.textContent = `
            .workout-preview-modal {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 16px;
                padding: 0;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                color: #fff;
            }
            .workout-preview-modal::backdrop {
                background: rgba(0,0,0,0.8);
            }
            .workout-preview-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #333;
                background: linear-gradient(135deg, #FF5200, #FF8C00);
            }
            .workout-preview-modal .modal-header h3 {
                margin: 0;
                font-size: 1.4rem;
                font-weight: 700;
            }
            .workout-preview-modal .modal-close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                font-size: 1.2rem;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: background 0.2s;
            }
            .workout-preview-modal .modal-close-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            .workout-preview-modal .modal-body {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(80vh - 140px);
            }
            .workout-preview-modal .modal-subtitle {
                color: #888;
                margin: 0 0 16px 0;
                font-size: 0.9rem;
            }
            .workout-preview-modal .exercise-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .workout-preview-modal .preview-exercise-item {
                background: #252525;
                border-radius: 12px;
                padding: 16px;
            }
            .workout-preview-modal .exercise-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
            }
            .workout-preview-modal .exercise-number {
                background: #FF5200;
                color: #fff;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.85rem;
            }
            .workout-preview-modal .exercise-name {
                font-weight: 600;
                font-size: 1rem;
            }
            .workout-preview-modal .video-btn {
                background: transparent;
                border: 2px solid #FF5200;
                color: #FF5200;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            .workout-preview-modal .video-btn:hover,
            .workout-preview-modal .video-btn.active {
                background: #FF5200;
                color: #fff;
            }
            .workout-preview-modal .preview-media-container {
                margin-top: 12px;
                border-radius: 8px;
                overflow: hidden;
            }
            .workout-preview-modal .preview-media-container img,
            .workout-preview-modal .preview-media-container video {
                width: 100%;
                max-height: 250px;
                object-fit: contain;
                background: #000;
                border-radius: 8px;
            }
            .workout-preview-modal .modal-footer {
                padding: 16px 20px;
                border-top: 1px solid #333;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    modal.showModal();
}

// Toggle video/gif in preview modal
function togglePreviewVideo(index, url, type) {
    const container = document.getElementById(`preview-media-${index}`);
    const button = container.previousElementSibling;

    if (container.style.display === 'none') {
        // Show media
        if (type === 'video') {
            container.innerHTML = `<video src="${url}" loop muted playsinline autoplay></video>`;
        } else {
            container.innerHTML = `<img src="${url}" alt="Exercise form">`;
        }
        container.style.display = 'block';
        button.textContent = 'HIDE FORM';
        button.classList.add('active');
    } else {
        // Hide media
        container.innerHTML = '';
        container.style.display = 'none';
        button.textContent = 'WATCH FORM';
        button.classList.remove('active');
    }
}

// Close workout preview modal
function closeWorkoutPreview() {
    const modal = document.getElementById('workoutPreviewModal');
    if (modal) modal.close();
}


function isSameDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function getMuscleGroups(exerciseList) {
    // Reverse lookup from EXERCISE_LIBRARY
    const groups = new Set();
    exerciseList.forEach(exName => {
        for (const [group, exercises] of Object.entries(EXERCISE_LIBRARY)) {
            if (exercises.includes(exName)) {
                groups.add(group);
                break;
            }
        }
    });
    return groups.size > 0 ? Array.from(groups).join(", ") : "Full Body";
}

function openExerciseModal(day) {
    currentDayForModal = day;
    const modal = document.getElementById('addExerciseModal');
    document.getElementById('modalDayName').innerText = day;

    // Reset Selects
    const muscleSelect = document.getElementById('muscleGroupSelect');
    const exerciseSelect = document.getElementById('exerciseSelect');
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

    // Handle Muscle Selection (Clone to remove old listeners)
    const newMuscleSelect = muscleSelect.cloneNode(true);
    muscleSelect.parentNode.replaceChild(newMuscleSelect, muscleSelect);

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
    const select = document.getElementById('exerciseSelect');
    const exercise = select.value;

    if (!exercise) {
        alert("Please select an exercise.");
        return;
    }

    if (!weeklyRoutine[currentDayForModal]) {
        weeklyRoutine[currentDayForModal] = [];
    }

    weeklyRoutine[currentDayForModal].push(exercise);
    localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));
    closeModal();
    initScheduler();
}

function removeExercise(day, index) {
    weeklyRoutine[day].splice(index, 1);
    localStorage.setItem('fitnotfat_routine', JSON.stringify(weeklyRoutine));
    initScheduler();
}

// ==========================================
// 3. EXERCISE LIBRARY DATA & LOGIC
// ==========================================
const EXERCISE_LIBRARY = {
    "Back": [
        "Pull-Ups (Wide Grip)", "Face Pulls", "High Cable Rows",
        "Barbell Rows", "T-Bar Rows", "Seated Cable Rows",
        "Deadlifts", "Hyperextensions", "Good Mornings", "Lat Pulldown"
    ],
    "Biceps": [
        "Incline Dumbbell Curls", "Wide Grip Barbell Curls",
        "Close Grip EZ Bar Curls", "Concentration Curls",
        "Hammer Curls", "Reverse Curls", "Preacher Curls"
    ],
    "Triceps": [
        "Overhead Tricep Extensions", "Skull Crushers",
        "Cable Pushdowns (Rope)", "Dips",
        "Close-Grip Bench Press", "Reverse Grip Pushdowns"
    ],
    "Shoulders": [
        "Front Raises", "Military Press",
        "Lateral Raises", "Upright Rows",
        "Rear Delt Flyes", "Face Pulls", "Overhead Press"
    ],
    "Forearms": [
        "Wrist Curls", "Grip Crushers",
        "Reverse Wrist Curls", "Wrist Rollers",
        "Farmer's Walks", "Dead Hangs"
    ],
    "Legs": [
        "Barbell Squats", "Leg Press", "Leg Extensions",
        "Romanian Deadlifts", "Leg Curls", "Stiff-Leg Deadlifts",
        "Hip Thrusts", "Bulgarian Split Squats",
        "Standing Calf Raises", "Seated Calf Raises",
        "Bodyweight Squats", "Box Squats", "Reverse Lunges",
        "Step-Ups", "Glute Bridges", "Calf Raises", "Lunges"
    ],
    "Chest": [
        "Incline Barbell Bench Press", "Incline Dumbbell Press", "Incline Dumbbell Fly",
        "Low-to-High Cable Fly", "Reverse Grip Bench Press",
        "Flat Barbell Bench Press", "Flat Dumbbell Bench Press", "Machine Chest Press",
        "Cable Chest Fly", "Smith Machine Flat Bench Press", "Dumbbell Squeeze Press",
        "Decline Barbell Bench Press", "Decline Dumbbell Press", "Chest Dips",
        "High-to-Low Cable Fly", "Smith Machine Decline Bench Press",
        "Decline Machine Chest Press", "Push Ups"
    ],
    "Core": [
        "Plank", "Knee Plank", "Dead Bug", "Lying Leg Raises",
        "Standing Knee Raises", "Seated Knee Tucks", "Crunches",
        "Russian Twists", "Bicycle Crunches", "Mountain Climbers"
    ],
    "Cardio": [
        "Treadmill Running", "Incline Treadmill Running", "Elliptical Machine",
        "Rowing Machine", "Step Machine", "Step Mill", "Bicycle Recline Walk",
        "Battle Rope", "Running", "Brisk Walking", "Burpees", "Jumping Jacks",
        "Jump Rope", "High Knee Skips", "Marching on Spot", "Squat Burpees",
        "Side Kick Burpee", "Slow Burpee", "Mountain Climbers", "Side Mountain Climber",
        "Inchworm Mountain Climbers", "Criss Cross Elbow to Knee", "Touchdown",
        "Jack Step", "Low Lunge Twist", "Lunge with Leg Lift", "Twist Knee Thrust",
        "Bodyweight Knee Thrust", "Assault Run", "Split Jump to Box",
        "Alternate Heel Touch Side Kick Squat", "Skater Hop Tap", "Sky Bike", "Devil Press"
    ],
    "Calisthenics": [
        "Wall Push-Ups", "Incline Push-Ups", "Knee Push-Ups", "Standard Push-Ups",
        "Bench Dips (Knees Bent)", "Australian Rows (Inverted Rows)", "Ring Rows",
        "Resistance Band Assisted Pull-Ups", "Dead Hangs", "Scapular Pull-Ups"
    ],
    "Neck": [
        "Neck Nods", "Side-to-Side Neck Tilts", "Neck Rotations", "Neck Circles",
        "Chin Tucks", "Lying Neck Flexion", "Prone Neck Extension", "Side-Lying Neck Raises",
        "Controlled Neck Rotations", "Neck Harness Flexion", "Neck Harness Extension",
        "Resistance-Band Neck Flexion/Extension", "Wrestler Neck Bridges"
    ]
};


function showDetail(muscle) {
    document.getElementById('mainPage').classList.add('hidden');
    const detailPage = document.getElementById(muscle + 'Detail');
    if (detailPage) {
        detailPage.classList.remove('hidden');
        detailPage.classList.add('active');
        detailPage.style.display = 'block';
    }
    window.scrollTo(0, 0);
}

function showMain() {
    document.querySelectorAll('.detail-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    document.getElementById('mainPage').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function toggleVideo(button) {
    const media = button.nextElementSibling;
    if (media.style.display === 'none') {
        media.style.display = 'block';
        button.textContent = 'HIDE FORM';
        button.classList.add('active');
        if (media.tagName === 'VIDEO') media.play();
    } else {
        media.style.display = 'none';
        button.textContent = 'WATCH FORM';
        button.classList.remove('active');
        if (media.tagName === 'VIDEO') media.pause();
    }
}

// ==========================================
// 4. CUSTOM PLAN BUILDER
// ==========================================
let customPlanExercises = [];

function openCustomPlanBuilder() {
    const modal = document.getElementById('customPlanModal');
    if (!modal) return;

    // Reset state
    customPlanExercises = [];
    document.getElementById('customPlanName').value = '';
    updateSelectedExercisesList();

    // Populate muscle groups dropdown
    const muscleSelect = document.getElementById('customMuscleSelect');
    const exerciseSelect = document.getElementById('customExerciseSelect');

    muscleSelect.innerHTML = '<option value="">Select Muscle Group</option>';
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';
    exerciseSelect.disabled = true;

    Object.keys(EXERCISE_LIBRARY).forEach(group => {
        if (group !== 'Rest Day') { // Exclude Rest Day
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            muscleSelect.appendChild(option);
        }
    });

    // Handle muscle selection (clone to remove old listeners)
    const newMuscleSelect = muscleSelect.cloneNode(true);
    muscleSelect.parentNode.replaceChild(newMuscleSelect, muscleSelect);

    newMuscleSelect.addEventListener('change', (e) => {
        const selectedGroup = e.target.value;
        const exSelect = document.getElementById('customExerciseSelect');
        exSelect.innerHTML = '<option value="">Select Exercise</option>';

        if (selectedGroup && EXERCISE_LIBRARY[selectedGroup]) {
            exSelect.disabled = false;
            EXERCISE_LIBRARY[selectedGroup].forEach(ex => {
                const option = document.createElement('option');
                option.value = ex;
                option.textContent = ex;
                exSelect.appendChild(option);
            });
        } else {
            exSelect.disabled = true;
        }
    });

    modal.showModal();
}

function closeCustomPlanModal() {
    const modal = document.getElementById('customPlanModal');
    if (modal) modal.close();
}

function addExerciseToCustomPlan() {
    const exerciseSelect = document.getElementById('customExerciseSelect');
    const exercise = exerciseSelect.value;

    if (!exercise) {
        alert('Please select an exercise first.');
        return;
    }

    // Check if already added
    if (customPlanExercises.includes(exercise)) {
        alert('This exercise is already in your plan.');
        return;
    }

    customPlanExercises.push(exercise);
    updateSelectedExercisesList();

    // Reset dropdowns
    document.getElementById('customMuscleSelect').value = '';
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';
    exerciseSelect.disabled = true;
}

function removeFromCustomPlan(index) {
    customPlanExercises.splice(index, 1);
    updateSelectedExercisesList();
}

function updateSelectedExercisesList() {
    const list = document.getElementById('selectedExercisesList');
    const count = document.getElementById('selectedExerciseCount');

    count.textContent = customPlanExercises.length;

    if (customPlanExercises.length === 0) {
        list.innerHTML = '<p class="empty-state">No exercises selected yet</p>';
        return;
    }

    list.innerHTML = customPlanExercises.map((ex, index) => `
        <div class="selected-exercise-item">
            <span class="exercise-name">${ex}</span>
            <button class="remove-btn" onclick="removeFromCustomPlan(${index})">✕</button>
        </div>
    `).join('');
}

function saveCustomPlan() {
    const planName = document.getElementById('customPlanName').value.trim();

    if (!planName) {
        alert('Please enter a workout name.');
        return;
    }

    if (customPlanExercises.length === 0) {
        alert('Please add at least one exercise.');
        return;
    }

    // Save to localStorage
    let savedPlans = JSON.parse(localStorage.getItem('fitnotfat_custom_plans') || '[]');

    const newPlan = {
        id: Date.now(),
        name: planName,
        exercises: customPlanExercises,
        createdAt: new Date().toISOString()
    };

    savedPlans.push(newPlan);
    localStorage.setItem('fitnotfat_custom_plans', JSON.stringify(savedPlans));

    alert(`Custom plan "${planName}" saved with ${customPlanExercises.length} exercises!`);
    closeCustomPlanModal();
}