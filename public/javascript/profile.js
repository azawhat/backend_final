// profile.js
function updatePassword() {
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');

    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    const newPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!oldPassword || !newPassword) {
        alert('Please enter your old password and new password.');
        return;
    }

    if (!newPasswordRegex.test(newPassword)) {
        alert('Please enter a valid new password (at least 8 characters, one uppercase letter, one lowercase letter, and one number).');
        return;
    }

    fetch('/profile/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
        } else {
            alert('Failed to update password');
        }
    })
    .catch(error => {
        console.error('Error updating password:', error);
        alert('An error occurred. Please try again.');
    });
}


function logout() {
    fetch('/profile/logout', {
        method: 'POST',
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
        alert('An error occurred while logging out. Please try again.');
    });
}

document.getElementById('updatePasswordBtn').addEventListener('click', updatePassword);
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('updateFullnameBtn').addEventListener('click', updateFullname);

function updateFullname() {
    const newFullname = prompt("Enter your new fullname:");
    if (!newFullname) return;

    fetch('/profile/update-fullname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: newFullname }),
    })
    .then(response => {
        console.log('Response Status:', response.status);
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            window.location.reload();
        } else {
            alert('Failed to update fullname');
        }
    })
    .catch(error => {
        console.error('Error updating fullname:', error);
        alert('An error occurred. Please try again.');
    });
}
