//registration.js
document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const recaptchaResponse = grecaptcha.getResponse();

        try {
            if (!fullname || !email || !password) {
                alert("Please fill out all fields.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            if (!passwordRegex.test(password)) {
                alert("Please enter a valid password (at least 8 characters, one uppercase letter, one lowercase letter, and one number).");
                return;
            }

            if (!recaptchaResponse) {
                alert("Please complete the reCAPTCHA verification.");
                return;
            }

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, email, password, 'g-recaptcha-response': recaptchaResponse }),
            });
            const result = await response.json();

            if (result.message) {
                alert(result.message);
                window.location.href = "/login";
            } else if (result.error) {
                alert("Registration failed: " + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred during registration. Please try again.");
        }
    });
});
