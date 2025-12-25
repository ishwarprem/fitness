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
let currentDayForModal = '';

function initScheduler() {
    const grid = document.getElementById('weekGrid');
    if (!grid) return;

    grid.innerHTML = '';

    daysOfWeek.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        const exercises = weeklyRoutine[day] || [];
        const exerciseListHTML = exercises.map((ex, index) =>
            `<li>
            ${ex} 
            <span onclick="removeExercise('${day}', ${index})" style="cursor:pointer; color:#ff4444; margin-left:10px;">&times;</span>
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
    "Back": ["Pull-Ups", "Face Pulls", "Rows", "Deadlifts", "Lat Pulldown"],
    "Biceps": ["Curls", "Hammer Curls", "Preacher Curls"],
    "Triceps": ["Pushdowns", "Skull Crushers", "Dips"],
    "Shoulders": ["Overhead Press", "Lateral Raises", "Front Raises"],
    "Legs": ["Squats", "Leg Press", "Lunges", "Leg Extensions"],
    "Chest": ["Bench Press", "Incline Press", "Flyes", "Push Ups"],
    "Mid Chest": ["Flat Barbell Bench Press", "Flat Dumbbell Bench Press", "Machine Chest Press", "Cable Chest Fly (Mid Height)", "Smith Machine Flat Bench Press", "Dumbbell Squeeze Press (Hex Press)"],
    "Lower Chest": ["Decline Barbell Bench Press", "Decline Dumbbell Press", "Chest Dips (Lean Forward)", "High → Low Cable Fly", "Smith Machine Decline Bench Press", "Decline Machine Chest Press", "Reverse-Grip Bench Press (Slight Decline)"],
    "Cardio": ["Treadmill Running", "Incline Treadmill Running", "Elliptical Machine", "Rowing Machine", "Step Machine", "Step Mill", "Bicycle Recline Walk", "Battle Rope", "Running", "Brisk Walking", "Burpees", "Jumping Jacks", "Jump Rope", "High Knee Skips", "Marching on Spot", "Squat Burpees", "Side Kick Burpee", "Slow Burpee", "Mountain Climbers", "Side Mountain Climber", "Inchworm Mountain Climbers", "Criss Cross Elbow to Knee", "Touchdown", "Jack Step", "Low Lunge Twist", "Lunge with Leg Lift", "Twist Knee Thrust", "Bodyweight Knee Thrust", "Assault Run", "Split Jump to Box", "Alternate Heel Touch Side Kick Squat", "Skater Hop Tap", "Sky Bike", "Devil Press"],
    "Rest Day": ["Rest", "Stretching"]
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