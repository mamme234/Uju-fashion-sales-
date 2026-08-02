// ====================
// API CONFIGURATION
// ====================

const API_BASE_URL = 'https://uju-fashion-sales.onrender.com/api';

// API Endpoints
const API = {
    // ====================
    // AUTH ENDPOINTS
    // ====================
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
        resetPassword: `${API_BASE_URL}/auth/reset-password`,
        profile: `${API_BASE_URL}/auth/profile`,
        updateProfile: `${API_BASE_URL}/auth/profile`,
        changePassword: `${API_BASE_URL}/auth/change-password`,
    },
    
    // ====================
    // PRODUCT ENDPOINTS
    // ====================
    products: {
        getAll: `${API_BASE_URL}/products`,
        getById: (id) => `${API_BASE_URL}/products/${id}`,
        create: `${API_BASE_URL}/products`,
        update: (id) => `${API_BASE_URL}/products/${id}`,
        delete: (id) => `${API_BASE_URL}/products/${id}`,
        getFeatured: `${API_BASE_URL}/products/featured`,
        getBestSellers: `${API_BASE_URL}/products/best-sellers`,
        getNewArrivals: `${API_BASE_URL}/products/new-arrivals`,
        search: `${API_BASE_URL}/products/search`,
        filter: `${API_BASE_URL}/products/filter`,
        getCategories: `${API_BASE_URL}/products/categories`,
        uploadImage: `${API_BASE_URL}/products/upload`,
    },
    
    // ====================
    // ORDER ENDPOINTS
    // ====================
    orders: {
        create: `${API_BASE_URL}/orders`,
        getAll: `${API_BASE_URL}/orders`,
        getById: (id) => `${API_BASE_URL}/orders/${id}`,
        updateStatus: (id) => `${API_BASE_URL}/orders/${id}/status`,
        getStats: `${API_BASE_URL}/orders/stats`,
    },
    
    // ====================
    // CART ENDPOINTS
    // ====================
    cart: {
        add: `${API_BASE_URL}/cart/add`,
        remove: `${API_BASE_URL}/cart/remove`,
        update: `${API_BASE_URL}/cart/update`,
        get: `${API_BASE_URL}/cart`,
        clear: `${API_BASE_URL}/cart/clear`,
    },
    
    // ====================
    // WISHLIST ENDPOINTS
    // ====================
    wishlist: {
        add: `${API_BASE_URL}/wishlist/add`,
        remove: `${API_BASE_URL}/wishlist/remove`,
        get: `${API_BASE_URL}/wishlist`,
        check: (id) => `${API_BASE_URL}/wishlist/check/${id}`,
    },
    
    // ====================
    // REVIEW ENDPOINTS
    // ====================
    reviews: {
        create: `${API_BASE_URL}/reviews`,
        getByProduct: (id) => `${API_BASE_URL}/reviews/product/${id}`,
        getAll: `${API_BASE_URL}/reviews`,
        delete: (id) => `${API_BASE_URL}/reviews/${id}`,
        approve: (id) => `${API_BASE_URL}/reviews/${id}/approve`,
    },
    
    // ====================
    // BANNER ENDPOINTS
    // ====================
    banners: {
        getAll: `${API_BASE_URL}/banners`,
        create: `${API_BASE_URL}/banners`,
        update: (id) => `${API_BASE_URL}/banners/${id}`,
        delete: (id) => `${API_BASE_URL}/banners/${id}`,
    },
    
    // ====================
    // COUPON ENDPOINTS
    // ====================
    coupons: {
        getAll: `${API_BASE_URL}/coupons`,
        create: `${API_BASE_URL}/coupons`,
        update: (id) => `${API_BASE_URL}/coupons/${id}`,
        delete: (id) => `${API_BASE_URL}/coupons/${id}`,
        validate: `${API_BASE_URL}/coupons/validate`,
    },
    
    // ====================
    // ADMIN ENDPOINTS
    // ====================
    admin: {
        dashboard: `${API_BASE_URL}/admin/dashboard`,
        customers: `${API_BASE_URL}/admin/customers`,
        blockCustomer: (id) => `${API_BASE_URL}/admin/customers/${id}/block`,
        unblockCustomer: (id) => `${API_BASE_URL}/admin/customers/${id}/unblock`,
        reports: `${API_BASE_URL}/admin/reports`,
        salesReport: `${API_BASE_URL}/admin/reports/sales`,
    },
    
    // ====================
    // CONTACT ENDPOINTS
    // ====================
    contact: {
        send: `${API_BASE_URL}/contact/send`,
    }
};

// ====================
// API HELPER FUNCTIONS
// ====================

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// API request with auth
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
                    window.location.href = '/pages/login.html';
                }
            }
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ====================
// AUTH API CALLS
// ====================

// Register new user
async function registerUser(userData) {
    return await apiRequest(API.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

// Login user
async function loginUser(credentials) {
    const data = await apiRequest(API.auth.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Get user profile
async function getProfile() {
    return await apiRequest(API.auth.profile, {
        method: 'GET',
    });
}

// Update user profile
async function updateProfile(userData) {
    return await apiRequest(API.auth.updateProfile, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
}

// Change password
async function changePassword(passwordData) {
    return await apiRequest(API.auth.changePassword, {
        method: 'POST',
        body: JSON.stringify(passwordData),
    });
}

// Forgot password
async function forgotPassword(email) {
    return await apiRequest(API.auth.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

// Reset password
async function resetPassword(data) {
    return await apiRequest(API.auth.resetPassword, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ====================
// PRODUCT API CALLS
// ====================

// Get all products with filters
async function getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API.products.getAll}?${queryString}` : API.products.getAll;
    return await apiRequest(url, {
        method: 'GET',
    });
}

// Get single product by ID
async function getProductById(id) {
    return await apiRequest(API.products.getById(id), {
        method: 'GET',
    });
}

// Create product (Admin only)
async function createProduct(productData) {
    return await apiRequest(API.products.create, {
        method: 'POST',
        body: JSON.stringify(productData),
    });
}

// Update product (Admin only)
async function updateProduct(id, productData) {
    return await apiRequest(API.products.update(id), {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
}

// Delete product (Admin only)
async function deleteProduct(id) {
    return await apiRequest(API.products.delete(id), {
        method: 'DELETE',
    });
}

// Get featured products
async function getFeaturedProducts() {
    return await apiRequest(API.products.getFeatured, {
        method: 'GET',
    });
}

// Get best sellers
async function getBestSellers() {
    return await apiRequest(API.products.getBestSellers, {
        method: 'GET',
    });
}

// Get new arrivals
async function getNewArrivals() {
    return await apiRequest(API.products.getNewArrivals, {
        method: 'GET',
    });
}

// Search products
async function searchProducts(query) {
    return await apiRequest(`${API.products.search}?q=${encodeURIComponent(query)}`, {
        method: 'GET',
    });
}

// Filter products
async function filterProducts(filters) {
    const queryString = new URLSearchParams(filters).toString();
    return await apiRequest(`${API.products.filter}?${queryString}`, {
        method: 'GET',
    });
}

// Get all categories
async function getCategories() {
    return await apiRequest(API.products.getCategories, {
        method: 'GET',
    });
}

// Upload product image
async function uploadProductImage(formData) {
    return await apiRequest(API.products.uploadImage, {
        method: 'POST',
        body: formData,
        headers: {
            // Don't set Content-Type for FormData
        },
    });
}

// ====================
// ORDER API CALLS
// ====================

// Create order
async function createOrder(orderData) {
    return await apiRequest(API.orders.create, {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

// Get all orders (Admin: all, User: own)
async function getOrders() {
    return await apiRequest(API.orders.getAll, {
        method: 'GET',
    });
}

// Get order by ID
async function getOrderById(id) {
    return await apiRequest(API.orders.getById(id), {
        method: 'GET',
    });
}

// Update order status (Admin only)
async function updateOrderStatus(id, status) {
    return await apiRequest(API.orders.updateStatus(id), {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// Get order stats (Admin only)
async function getOrderStats() {
    return await apiRequest(API.orders.getStats, {
        method: 'GET',
    });
}

// ====================
// CART API CALLS
// ====================

// Get cart
async function getCart() {
    return await apiRequest(API.cart.get, {
        method: 'GET',
    });
}

// Add to cart
async function addToCart(productId, quantity = 1, size = null, color = null) {
    return await apiRequest(API.cart.add, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, size, color }),
    });
}

// Remove from cart
async function removeFromCart(productId) {
    return await apiRequest(API.cart.remove, {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
    });
}

// Update cart item quantity
async function updateCartItem(productId, quantity) {
    return await apiRequest(API.cart.update, {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
    });
}

// Clear cart
async function clearCart() {
    return await apiRequest(API.cart.clear, {
        method: 'DELETE',
    });
}

// ====================
// WISHLIST API CALLS
// ====================

// Get wishlist
async function getWishlist() {
    return await apiRequest(API.wishlist.get, {
        method: 'GET',
    });
}

// Add to wishlist
async function addToWishlist(productId) {
    return await apiRequest(API.wishlist.add, {
        method: 'POST',
        body: JSON.stringify({ productId }),
    });
}

// Remove from wishlist
async function removeFromWishlist(productId) {
    return await apiRequest(API.wishlist.remove, {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
    });
}

// Check if product is in wishlist
async function checkWishlist(productId) {
    return await apiRequest(API.wishlist.check(productId), {
        method: 'GET',
    });
}

// ====================
// REVIEW API CALLS
// ====================

// Create review
async function createReview(reviewData) {
    return await apiRequest(API.reviews.create, {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}

// Get product reviews
async function getProductReviews(productId) {
    return await apiRequest(API.reviews.getByProduct(productId), {
        method: 'GET',
    });
}

// Get all reviews (Admin only)
async function getAllReviews() {
    return await apiRequest(API.reviews.getAll, {
        method: 'GET',
    });
}

// Delete review (Admin only)
async function deleteReview(id) {
    return await apiRequest(API.reviews.delete(id), {
        method: 'DELETE',
    });
}

// Approve review (Admin only)
async function approveReview(id) {
    return await apiRequest(API.reviews.approve(id), {
        method: 'PUT',
    });
}

// ====================
// BANNER API CALLS
// ====================

// Get all banners
async function getBanners() {
    return await apiRequest(API.banners.getAll, {
        method: 'GET',
    });
}

// Create banner (Admin only)
async function createBanner(bannerData) {
    return await apiRequest(API.banners.create, {
        method: 'POST',
        body: JSON.stringify(bannerData),
    });
}

// Update banner (Admin only)
async function updateBanner(id, bannerData) {
    return await apiRequest(API.banners.update(id), {
        method: 'PUT',
        body: JSON.stringify(bannerData),
    });
}

// Delete banner (Admin only)
async function deleteBanner(id) {
    return await apiRequest(API.banners.delete(id), {
        method: 'DELETE',
    });
}

// ====================
// COUPON API CALLS
// ====================

// Get all coupons (Admin only)
async function getCoupons() {
    return await apiRequest(API.coupons.getAll, {
        method: 'GET',
    });
}

// Create coupon (Admin only)
async function createCoupon(couponData) {
    return await apiRequest(API.coupons.create, {
        method: 'POST',
        body: JSON.stringify(couponData),
    });
}

// Update coupon (Admin only)
async function updateCoupon(id, couponData) {
    return await apiRequest(API.coupons.update(id), {
        method: 'PUT',
        body: JSON.stringify(couponData),
    });
}

// Delete coupon (Admin only)
async function deleteCoupon(id) {
    return await apiRequest(API.coupons.delete(id), {
        method: 'DELETE',
    });
}

// Validate coupon
async function validateCoupon(code, orderTotal) {
    return await apiRequest(`${API.coupons.validate}?code=${code}&total=${orderTotal}`, {
        method: 'GET',
    });
}

// ====================
// ADMIN API CALLS
// ====================

// Get dashboard stats (Admin only)
async function getDashboardStats() {
    return await apiRequest(API.admin.dashboard, {
        method: 'GET',
    });
}

// Get all customers (Admin only)
async function getCustomers() {
    return await apiRequest(API.admin.customers, {
        method: 'GET',
    });
}

// Block customer (Admin only)
async function blockCustomer(id) {
    return await apiRequest(API.admin.blockCustomer(id), {
        method: 'PUT',
    });
}

// Unblock customer (Admin only)
async function unblockCustomer(id) {
    return await apiRequest(API.admin.unblockCustomer(id), {
        method: 'PUT',
    });
}

// Get sales report (Admin only)
async function getSalesReport(startDate, endDate) {
    return await apiRequest(`${API.admin.salesReport}?start=${startDate}&end=${endDate}`, {
        method: 'GET',
    });
}

// ====================
// CONTACT API CALLS
// ====================

// Send contact message
async function sendContactMessage(messageData) {
    return await apiRequest(API.contact.send, {
        method: 'POST',
        body: JSON.stringify(messageData),
    });
}

// ====================
// UTILITY FUNCTIONS
// ====================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format number with commas
function formatNumber(num) {
    if (!num) return '0';
    return Number(num).toLocaleString();
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existing = document.querySelectorAll('.toast-notification');
    existing.forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#8B1A4A' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white;
        border-radius: 12px;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.4s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 280px;
        max-width: 500px;
        font-family: 'Inter', sans-serif;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ====================
// EXPORT FUNCTIONS
// ====================

// Make functions available globally
window.getToken = getToken;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
window.apiRequest = apiRequest;

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getProfile = getProfile;
window.updateProfile = updateProfile;
window.changePassword = changePassword;
window.forgotPassword = forgotPassword;
window.resetPassword = resetPassword;

window.getProducts = getProducts;
window.getProductById = getProductById;
window.createProduct = createProduct;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.getFeaturedProducts = getFeaturedProducts;
window.getBestSellers = getBestSellers;
window.getNewArrivals = getNewArrivals;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.getCategories = getCategories;
window.uploadProductImage = uploadProductImage;

window.createOrder = createOrder;
window.getOrders = getOrders;
window.getOrderById = getOrderById;
window.updateOrderStatus = updateOrderStatus;
window.getOrderStats = getOrderStats;

window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItem = updateCartItem;
window.clearCart = clearCart;

window.getWishlist = getWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.checkWishlist = checkWishlist;

window.createReview = createReview;
window.getProductReviews = getProductReviews;
window.getAllReviews = getAllReviews;
window.deleteReview = deleteReview;
window.approveReview = approveReview;

window.getBanners = getBanners;
window.createBanner = createBanner;
window.updateBanner = updateBanner;
window.deleteBanner = deleteBanner;

window.getCoupons = getCoupons;
window.createCoupon = createCoupon;
window.updateCoupon = updateCoupon;
window.deleteCoupon = deleteCoupon;
window.validateCoupon = validateCoupon;

window.getDashboardStats = getDashboardStats;
window.getCustomers = getCustomers;
window.blockCustomer = blockCustomer;
window.unblockCustomer = unblockCustomer;
window.getSalesReport = getSalesReport;

window.sendContactMessage = sendContactMessage;

window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.showToast = showToast;

console.log('✅ API Loaded - Uju Fashion Sales');
console.log('📡 API Base URL:', API_BASE_URL);
