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
    }
}


