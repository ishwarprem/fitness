// --- Scheduler Logic ---
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// Temporary storage (In a real app, you'd load this from Supabase)
let weeklyRoutine = JSON.parse(localStorage.getItem('fitnotfat_routine')) || {};

let currentDayForModal = '';

function initScheduler() {
    const grid = document.getElementById('weekGrid');
    if (!grid) return; // Guard clause in case we aren't on the main page
    
    grid.innerHTML = ''; // Clear existing

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
  
    
    