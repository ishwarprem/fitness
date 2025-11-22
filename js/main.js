// IMPORTANT: Use the same Supabase URL and Key as in auth.js
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- AUTH GATEKEEPER ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth Session
    const { data: { session } } = await _supabase.auth.getSession();

    if (!session) {
        // Not logged in? Go to Auth
        window.location.replace('auth.html');
        return; // Stop execution
    }

    // 2. Check if Profile Exists
    const { data: profile, error } = await _supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

    if (!profile) {
        // Logged in, but no profile? Force Onboarding
        window.location.replace('onboarding.html');
        return;
    }

    // 3. All Good? Reveal the Page
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';

    // Initialize your app logic here...
    // (Rest of your existing code follows...)
});

// --- LOGOUT FUNCTION ---
async function logout() {
    const { error } = await _supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. See console for details.');
    } else {
        window.location.href = 'auth.html';
    }
}