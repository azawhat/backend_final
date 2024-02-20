// contact-form-validation.js

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        try {
            const response = await fetch('/feedback/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            const result = await response.json();

            if (result.success) {
                alert("Feedback submitted successfully");
                window.location.href = "/";
            } else {
                alert("Failed to submit feedback: " + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while submitting feedback. Please try again.");
        }
    });
});
