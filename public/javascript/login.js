//login.js
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const recaptchaResponse = grecaptcha.getResponse();

        try {
            if (!email || !password) {
                alert("Please fill out all fields.");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!recaptchaResponse) {
                alert("Please complete the reCAPTCHA verification.");
                return;
            }

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, 'g-recaptcha-response': recaptchaResponse }),
            });
            const result = await response.json();

            if (result.success) {
                alert("Login successful");
                window.location.href = "/profile";
            } else {    
                alert("Login failed: " + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred during login. Please try again.");
        }
    });
});
