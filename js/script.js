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

function renderActiveDay(date) {
    const container = document.getElementById('activeDayView');
    if (!container) return;

    const dayIndex = (date.getDay() + 6) % 7; // 0=Mon, 6=Sun
    const dayName = daysOfWeek[dayIndex];
    const exercises = weeklyRoutine[dayName] || [];

    if (exercises.length > 0) {
        // Calculate Stats
        const exerciseCount = exercises.length;
        const estimatedSets = exerciseCount * 3;
        const estimatedKcal = exerciseCount * 45; // Approx
        const targetMuscles = getMuscleGroups(exercises);

        container.innerHTML = `
            <div class="workout-preview-card">
                <div class="workout-card-header">
                    <div class="workout-target-label">
                        <div class="workout-icon-circle">-</div>
                        Target
                    </div>
                    <div class="workout-target-list">
                        ${targetMuscles}
                    </div>
                </div>

                <div class="workout-stats">
                    <div class="stat-item">
                        <div class="stat-icon">
                            <!-- Dumbbell Icon -->
                            <svg viewBox="0 0 24 24"><path d="M6 5V19H9V5H6M15 5V19H18V5H15M2 8V16H5V8H2M19 8V16H22V8H19M7 19H8C7.5 19.5 7.5 20 7.5 20.5S7.5 21.5 8 22H7C6.5 22 6 21.5 6 21S6.5 20 7 20V19M16 19H17C16.5 19.5 16.5 20 16.5 20.5S16.5 21.5 17 22H16C15.5 22 15 21.5 15 21S15.5 20 16 20V19M7 4H8C7.5 3.5 7.5 3 7.5 2.5S7.5 1.5 8 1H7C6.5 1 6 1.5 6 2S6.5 3 7 3V4M16 4H17C16.5 3.5 16.5 3 16.5 2.5S16.5 1.5 17 1H16C15.5 1 15 1.5 15 2S15.5 3 16 3V4Z"></path></svg>
                        </div>
                        <div class="stat-value">${exerciseCount} exercises</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <!-- Clock Icon -->
                            <svg viewBox="0 0 24 24"><path d="M12 20A8 8 0 0 0 20 12A8 8 0 0 0 12 4A8 8 0 0 0 4 12A8 8 0 0 0 12 20M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"></path></svg>
                        </div>
                        <div class="stat-value">${estimatedSets} sets</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <!-- Fire Icon -->
                            <svg viewBox="0 0 24 24"><path d="M17.55,11.2C17.3,10.9 17,10.6 16.65,10.2C16.65,10.2 16.75,10.05 16.8,10C17.35,9.3 17.5,8.1 16.95,7.15C16.35,6.15 15.35,6.2 15.35,6.2C15.35,6.2 15.35,6.2 15.3,6.25C15.2,6.3 14.85,6.65 14.5,7C14.15,7.35 15,8.8 13.85,10C12.7,11.25 10.95,11.55 11.35,8.8C11.6,7.25 12.3,5.95 13.1,4.75C11.1,4.95 9.15,6.1 8.25,7.9C7.3,9.75 7.8,11.95 7.8,11.95C7.8,11.95 7.15,11.45 6.65,10.7C6.1,9.9 5.95,9.1 5.95,9.1C5.05,10.45 4.85,12.05 5.35,13.6C5.9,15.15 7.25,16.2 8.35,16.55C9.45,16.9 10.15,16.8 11.25,16.4C12.35,16 11.7,15 10.9,14.65C10.1,14.3 9.4,14.5 9.75,13.85C10.1,13.2 11.3,11.5 12.6,12.3C13.9,13.15 13.75,14.7 13.4,15.35C13.05,16.05 12.45,16.35 12.4,16.4C13.75,16.35 15,15.7 15.85,14.75C17.05,13.4 17.55,11.2 17.55,11.2M13,19A6,6 0 0,1 7,13C7,13 7,13 7,12.95C7,12.95 7.05,13 7.05,13C7.05,13 7.85,14.5 9.55,14.9C10.4,15.1 11.4,15 12.05,14.65C12.7,14.3 12.9,14 13,13.9C13,13.9 13,13.95 13,14C13.65,15.15 13.5,16.8 12.5,18.05C12.65,18.05 12.85,18.05 13,18.05V19Z"></path></svg>
                        </div>
                        <div class="stat-value">${estimatedKcal} kcal</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="preview-btn" onclick="openExerciseModal('${dayName}')">Edit Workout</button>
                    <!-- Future: Preview/Start workout button -->
                </div>
            </div>

            <!-- "Start with Empty" placeholder for design fidelity -->
             <button class="btn-empty-workout" onclick="openExerciseModal('${dayName}')">
                <span style="font-size:1.5rem; line-height:0; margin-bottom:4px;">+</span> Start with an empty workout
            </button>
            
            <div style="margin-top:20px; text-align:center; color:#444;">
               <small>Exercises: ${exercises.join(", ")}</small>
            </div>
        `;
    } else {
        // Empty State
        container.innerHTML = `
            <div class="empty-card">
                <h3>Rest Day</h3>
                <p>No workout scheduled for ${dayName}.</p>
                <button class="add-workout-btn" onclick="openExerciseModal('${dayName}')">+ Add Workout</button>
            </div>
        `;
    }
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
    "Back": ["Pull-Ups", "Face Pulls", "Rows", "Deadlifts", "Lat Pulldown"],
    "Biceps": ["Curls", "Hammer Curls", "Preacher Curls"],
    "Triceps": ["Pushdowns", "Skull Crushers", "Dips"],
    "Shoulders": ["Overhead Press", "Lateral Raises", "Front Raises"],
    "Legs": ["Squats", "Leg Press", "Lunges", "Leg Extensions"],
    "Chest": ["Bench Press", "Incline Press", "Flyes", "Push Ups"],
    "Mid Chest": ["Flat Barbell Bench Press", "Flat Dumbbell Bench Press", "Machine Chest Press", "Cable Chest Fly (Mid Height)", "Smith Machine Flat Bench Press", "Dumbbell Squeeze Press (Hex Press)"],
    "Lower Chest": ["Decline Barbell Bench Press", "Decline Dumbbell Press", "Chest Dips (Lean Forward)", "High → Low Cable Fly", "Smith Machine Decline Bench Press", "Decline Machine Chest Press", "Reverse-Grip Bench Press (Slight Decline)"],
    "Cardio": ["Treadmill Running", "Incline Treadmill Running", "Elliptical Machine", "Rowing Machine", "Step Machine", "Step Mill", "Bicycle Recline Walk", "Battle Rope", "Running", "Brisk Walking", "Burpees", "Jumping Jacks", "Jump Rope", "High Knee Skips", "Marching on Spot", "Squat Burpees", "Side Kick Burpee", "Slow Burpee", "Mountain Climbers", "Side Mountain Climber", "Inchworm Mountain Climbers", "Criss Cross Elbow to Knee", "Touchdown", "Jack Step", "Low Lunge Twist", "Lunge with Leg Lift", "Twist Knee Thrust", "Bodyweight Knee Thrust", "Assault Run", "Split Jump to Box", "Alternate Heel Touch Side Kick Squat", "Skater Hop Tap", "Sky Bike", "Devil Press"],
    "Calisthenics": ["Wall Push-Ups", "Incline Push-Ups", "Knee Push-Ups", "Standard Push-Ups", "Bench Dips (Knees Bent)", "Australian Rows (Inverted Rows)", "Ring Rows", "Resistance Band Assisted Pull-Ups", "Dead Hangs", "Scapular Pull-Ups"],
    "Neck": ["Neck Nods", "Side-to-Side Neck Tilts", "Neck Rotations", "Neck Circles", "Chin Tucks", "Lying Neck Flexion", "Prone Neck Extension", "Side-Lying Neck Raises", "Controlled Neck Rotations", "Neck Harness Flexion", "Neck Harness Extension", "Resistance-Band Neck Flexion/Extension", "Cable Neck Flexion/Extension", "Plate-Loaded Neck Flexion", "Wrestler Neck Bridges", "Back Bridges", "Partner-Resisted Neck Training"],
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