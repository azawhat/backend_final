document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.querySelectorAll('#cartItems li');
    let totalPrice = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.card-text').textContent.replace('Price: $', ''));
        totalPrice += price;
    });

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

    const paymentButton = document.querySelector('.payment-methods .payment-method button');
    if (paymentButton) {
        paymentButton.addEventListener('click', function() {
            window.location.href = '/payment-page/paypal'; 
        });
    }
});
