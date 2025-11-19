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
    if(schedBtn) schedBtn.classList.remove('active');
    if(exBtn) exBtn.classList.remove('active');

    // 3. Show the specific section requested
    if (tabName === 'scheduler') {
        schedulerSec.classList.remove('hidden');
        if(schedBtn) schedBtn.classList.add('active');
        initScheduler(); // Refresh the scheduler grid
    } 
    else if (tabName === 'exercises') {
        exercisesSec.classList.remove('hidden');
        if(exBtn) exBtn.classList.add('active');
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
        
        // Style the card via JS or ensure .day-card is in CSS
        dayCard.style.background = '#121212';
        dayCard.style.border = '1px solid #2A2A2A';
        dayCard.style.padding = '1rem';
        dayCard.style.borderRadius = '8px';
        dayCard.style.minHeight = '200px';
        dayCard.style.display = 'flex';
        dayCard.style.flexDirection = 'column';

        // Get exercises for this day
        const exercises = weeklyRoutine[day] || [];
        
        // Create list items
        const exerciseListHTML = exercises.map((ex, index) => 
            `<li style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333; color: #A1A1A1; list-style:none;">
                ${ex} 
                <span onclick="removeExercise('${day}', ${index})" style="float:right; color:#FF5200; cursor:pointer; font-weight:bold;">&times;</span>
            </li>`
        ).join('');

        dayCard.innerHTML = `
            <h3 style="color:#FF5200; margin-bottom:1rem; font-family:'Oswald', sans-serif;">${day.toUpperCase()}</h3>
            <ul style="padding:0; flex-grow:1;">${exerciseListHTML}</ul>
            <button onclick="openExerciseModal('${day}')" style="width:100%; padding:10px; background:#222; color:white; border:none; cursor:pointer; margin-top:10px;">+ ADD EXERCISE</button>
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
    if(detailPage) {
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

function openExerciseModal(day) {
    currentDayForModal = day;
    const modal = document.getElementById('addExerciseModal');
    document.getElementById('modalDayName').innerText = day;
    
    // Populate select with basic options (You can expand this list)
    const select = document.getElementById('exerciseSelect');
    const commonExercises = ["Squats", "Deadlifts", "Bench Press", "Pull Ups", "Overhead Press", "Lunges", "Curls", "Tricep Dips", "Rest Day"];
    
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
    // 1. Hide both main sections
    document.getElementById('schedulerSection').classList.add('hidden');
    document.getElementById('exercisesSection').classList.add('hidden');

    // 2. Remove 'active' class from all tabs
    document.getElementById('tab-scheduler').classList.remove('active');
    document.getElementById('tab-exercises').classList.remove('active');

    // 3. Show the selected section and activate button
    if (tabName === 'scheduler') {
        document.getElementById('schedulerSection').classList.remove('hidden');
        document.getElementById('tab-scheduler').classList.add('active');
        initScheduler(); // Refresh grid in case of updates
    } else if (tabName === 'exercises') {
        document.getElementById('exercisesSection').classList.remove('hidden');
        document.getElementById('tab-exercises').classList.add('active');
        showMain(); // Ensure we are on the main grid, not a detail page
    }
}
  
    
    