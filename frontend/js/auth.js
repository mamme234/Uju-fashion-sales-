// ====================
// AUTHENTICATION
// ====================

// User data (mock)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Register
function registerUser(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]')?.value;
    const email = form.querySelector('input[type="email"]')?.value;
    const password = form.querySelector('input[type="password"]')?.value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1]?.value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        showToast('Email already registered!', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password: btoa(password), // Simple encoding (not secure for production)
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showToast('Registration successful! Please login.');
    setTimeout(() => window.location.href = 'login.html', 1500);
}

// Login
function loginUser(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === btoa(password));

    if (!user) {
        showToast('Invalid email or password!', 'error');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

// Logout
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// Check if user is logged in
function isLoggedIn() {
    return !!currentUser;
}

// Update UI based on auth state
function updateAuthUI() {
    const userIcon = document.querySelector('.nav-icon .fa-user');
    const userBadge = document.querySelector('.nav-icon .badge');

    if (currentUser) {
        if (userIcon) {
            userIcon.parentElement.href = 'profile.html';
            userIcon.parentElement.title = currentUser.name;
        }
        if (userBadge) {
            userBadge.textContent = '👤';
            userBadge.style.fontSize = '14px';
        }
        // Add logout button in profile page
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logoutUser);
        }
    }
}

// Forgot password (mock)
function forgotPassword(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('No account found with this email', 'error');
        return;
    }

    showToast(`Password reset link sent to ${email}`);
    form.reset();
}

// Initialize auth
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    // Handle auth forms
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const forgotForm = document.getElementById('forgotForm');

    if (registerForm) registerForm.addEventListener('submit', registerUser);
    if (loginForm) loginForm.addEventListener('submit', loginUser);
    if (forgotForm) forgotForm.addEventListener('submit', forgotPassword);

    // Show user info on profile page
    if (currentUser && document.getElementById('userName')) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
    }
});
