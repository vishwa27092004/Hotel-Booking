document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.visibility = 'visible';
    }

    // Function to clear error message
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.visibility = 'hidden';
    }

    // Basic email validation function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    form.addEventListener('submit', function(event) {
        // Prevent the default form submission (which reloads the page)
        event.preventDefault();
        clearError(); // Clear previous errors

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // --- Client-Side Validation ---

        if (email === '' & password === '') {
            showError('Please enter both email and password.');
            return;
        }
        if (email === '') {
            showError('Please enter email.');
            return;
        }
        if (password === '') {
            showError('Please enter password.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // In a real application, you would send the credentials to a backend server here.
        // E.g., using 'fetch()' or 'XMLHttpRequest'
        
        console.log('Attempting login with:', { email, password });

        // --- SIMULATED LOGIN PROCESS ---
        
        // This is a placeholder for server-side authentication
        if (email === 'vbsarawa@gitam.in' && password === '1234') {
            alert('Login successful! Redirecting...');
            window.location.href = 'home.html';
            // In a real app: window.location.href = '/dashboard';
        } else {
            // In a real app: This error would come from the server
            alert('Invalid e-mail or Password. ');
            showError('Please try again.')
        }
    });
});