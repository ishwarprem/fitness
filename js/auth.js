// =======================================================
// IMPORTANT: Replace with your actual Supabase credentials
// =======================================================
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('loginForm');

// --- LOGIN LOGIC (with Username or Email support) ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    const btn = e.target.querySelector('button');

    errorEl.style.display = 'none';
    btn.textContent = "CHECKING...";
    btn.disabled = true;

    try {
        let loginEmail = identifier;

        // Check if identifier is a username (doesn't contain @)
        if (!identifier.includes('@')) {
            console.log('Looking up username:', identifier);

            // Look up email from username in profiles table
            const { data: profileData, error: profileError } = await _supabase
                .from('profiles')
                .select('id, email')
                .eq('username', identifier)
                .single();

            console.log('Profile lookup result:', { profileData, profileError });

            if (profileError || !profileData || !profileData.email) {
                console.error('Username lookup failed:', profileError);
                throw new Error('Username not found. Please check and try again.');
            }

            loginEmail = profileData.email;
            console.log('Found email for username:', loginEmail);
        }

        // 1. Attempt Login with email
        const { data: { user }, error } = await _supabase.auth.signInWithPassword({
            email: loginEmail,
            password
        });

        if (error) {
            throw error;
        }

        // 2. Login Success! Now Check for Profile
        const { data: profile, error: profileError } = await _supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

        // 3. Route Logic
        if (profile && profile.onboarding_completed) {
            // Profile exists and onboarding completed -> Go to Dashboard
            window.location.href = 'index.html';
        } else {
            // No profile or onboarding not completed -> Go to Onboarding
            window.location.href = 'onboarding.html';
        }

    } catch (error) {
        console.error('Login error:', error);

        let errorMessage = 'Invalid credentials. Please try again.';

        if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid username/email or password.';
        } else if (error.message.includes('Username not found')) {
            errorMessage = error.message;
        } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please confirm your email before logging in.';
        }

        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
        btn.textContent = "LOGIN";
        btn.disabled = false;
    }
});