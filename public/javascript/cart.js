//cart.js
async function addToCart(courseId) {
    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Course added to cart successfully');
        } else {
            alert('Failed to add course to cart');
        }
    } catch (error) {
        console.error('Error adding course to cart:', error);
        alert('An error occurred while adding course to cart');
    }
}
async function removeFromCart(courseId) {
    try {
        const response = await fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Course removed from cart successfully');
            location.reload();
        } else {
            alert('Failed to remove course from cart');
        }
    } catch (error) {
        console.error('Error removing course from cart:', error);
        alert('An error occurred while removing course from cart');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const paymentButton = document.getElementById('pay');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const courseId = button.dataset.courseId;
            addToCart(courseId);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const courseId = button.dataset.courseId;
            removeFromCart(courseId);
        });
    });

    paymentButton.addEventListener('click', function() {
        window.location.href = '/payment-page';
    });
});
