// exercises-loader.js
// This script loads exercise detail pages from a separate HTML file

async function loadExercises() {
    try {
        const response = await fetch('exercises-details.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        // Insert the loaded HTML into the placeholder
        const container = document.getElementById('exercisesDetailsContainer');
        if (container) {
            container.innerHTML = html;
            console.log('✅ Exercise details loaded successfully');
        } else {
            console.error('❌ Container #exercisesDetailsContainer not found');
        }
    } catch (error) {
        console.error('❌ Failed to load exercises:', error);
        // Fallback: show error message to user
        const container = document.getElementById('exercisesDetailsContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <h3>Unable to load exercises</h3>
                    <p>Please refresh the page or check your connection.</p>
                </div>
            `;
        }
    }
}

// Load exercises when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadExercises);
} else {
    loadExercises();
}
