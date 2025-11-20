// =======================================================
// IMPORTANT: Replace with your actual Supabase credentials
// =======================================================
const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// --- TOGGLE BETWEEN FORMS ---
showRegister.addEventListener('click', () => {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showLogin.addEventListener('click', () => {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

// --- REGISTER LOGIC ---
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    const successEl = document.getElementById('registerSuccess');

    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    const { data, error } = await _supabase.auth.signUp({ email, password });

    if (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    } else {
        successEl.textContent = 'Success! Please check your email to confirm your account.';
        successEl.style.display = 'block';
        registerForm.reset();
    }
});

// --- LOGIN LOGIC ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.style.display = 'none';

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl.textContent = "Invalid login credentials.";
        errorEl.style.display = 'block';
    } else {
        // On successful login, redirect to the main app page
        window.location.href = 'onboarding.html';
    }
});