// IMPORTANT: Use the same Supabase URL and Key as in auth.js
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- AUTH GATEKEEPER ---
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (!session) {
        // If no user is logged in, redirect to the auth page
        window.location.replace('auth.html');
    } else {
        // If user is logged in, show the logout button
        const header = document.querySelector('header');
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutBtn';
        logoutButton.textContent = 'LOGOUT';
        header.appendChild(logoutButton);

        logoutButton.addEventListener('click', async () => {
            await _supabase.auth.signOut();
            window.location.replace('auth.html');
        });
    }
});