const SUPABASE_URL = 'https://jffbruoevfvlbjjvtzsz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZmJydW9ldmZ2bGJqanZ0enN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzIxODcsImV4cCI6MjA3ODcwODE4N30.HeG418JSBmzK2bUjnFIbw99V2G7n284isFbbcjZCeS8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById('loginForm');

// ... (Your Supabase URL and Key at the top) ...

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
        // We start by assuming the user typed an email
        let loginEmail = identifier;

        // --- NEW SECURE LOOKUP CODE STARTS HERE ---
        if (!identifier.includes('@')) {
            console.log('Searching for username securely...');

            // Call the SQL function we created in the Supabase Dashboard
            const { data: foundEmail, error: rpcError } = await _supabase
                .rpc('get_email_from_username', { input_username: identifier });

            if (rpcError || !foundEmail || foundEmail.length === 0) {
                console.error('Username not found:', rpcError);
                throw new Error('Username not found. Please check and try again.');
            }

            // The function returns an array, so we take the first row's email
            loginEmail = foundEmail[0].found_email;
            console.log('Email retrieved securely.');
        }
        // --- NEW SECURE LOOKUP CODE ENDS HERE ---

        // 1. Now we attempt to login with the email (either typed or found)
        const { data: { user }, error: authError } = await _supabase.auth.signInWithPassword({
            email: loginEmail,
            password: password
        });

        if (authError) throw authError;

        // 2. Success! Check if they need to finish onboarding
        const { data: profile } = await _supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

        if (profile && profile.onboarding_completed) {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'onboarding.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
        btn.textContent = "LOGIN";
        btn.disabled = false;
    }
});