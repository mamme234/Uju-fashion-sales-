// ====================
// API CONFIGURATION
// ====================

const API_BASE_URL = 'https://uju-fashion-sales.onrender.com/api';

// API Endpoints
const API = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
        resetPassword: `${API_BASE_URL}/auth/reset-password`,
        profile: `${API_BASE_URL}/auth/profile`,
        updateProfile: `${API_BASE_URL}/auth/profile`,
        changePassword: `${API_BASE_URL}/auth/change-password`,
    },
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
    orders: {
        create: `${API_BASE_URL}/orders`,
        getAll: `${API_BASE_URL}/orders`,
        getById: (id) => `${API_BASE_URL}/orders/${id}`,
        updateStatus: (id) => `${API_BASE_URL}/orders/${id}/status`,
        getStats: `${API_BASE_URL}/orders/stats`,
    },
    cart: {
        add: `${API_BASE_URL}/cart/add`,
        remove: `${API_BASE_URL}/cart/remove`,
        update: `${API_BASE_URL}/cart/update`,
        get: `${API_BASE_URL}/cart`,
        clear: `${API_BASE_URL}/cart/clear`,
    },
    wishlist: {
        add: `${API_BASE_URL}/wishlist/add`,
        remove: `${API_BASE_URL}/wishlist/remove`,
        get: `${API_BASE_URL}/wishlist`,
        check: (id) => `${API_BASE_URL}/wishlist/check/${id}`,
    },
    reviews: {
        create: `${API_BASE_URL}/reviews`,
        getByProduct: (id) => `${API_BASE_URL}/reviews/product/${id}`,
        getAll: `${API_BASE_URL}/reviews`,
        delete: (id) => `${API_BASE_URL}/reviews/${id}`,
        approve: (id) => `${API_BASE_URL}/reviews/${id}/approve`,
    },
    banners: {
        getAll: `${API_BASE_URL}/banners`,
        create: `${API_BASE_URL}/banners`,
        update: (id) => `${API_BASE_URL}/banners/${id}`,
        delete: (id) => `${API_BASE_URL}/banners/${id}`,
    },
    coupons: {
        getAll: `${API_BASE_URL}/coupons`,
        create: `${API_BASE_URL}/coupons`,
        update: (id) => `${API_BASE_URL}/coupons/${id}`,
        delete: (id) => `${API_BASE_URL}/coupons/${id}`,
        validate: `${API_BASE_URL}/coupons/validate`,
    },
    admin: {
        dashboard: `${API_BASE_URL}/admin/dashboard`,
        customers: `${API_BASE_URL}/admin/customers`,
        blockCustomer: (id) => `${API_BASE_URL}/admin/customers/${id}/block`,
        unblockCustomer: (id) => `${API_BASE_URL}/admin/customers/${id}/unblock`,
        reports: `${API_BASE_URL}/admin/reports`,
        salesReport: `${API_BASE_URL}/admin/reports/sales`,
    },
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
                if (!window.location.pathname.includes('login')) {
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

async function registerUser(userData) {
    return await apiRequest(API.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

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

async function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

async function getProfile() {
    return await apiRequest(API.auth.profile, {
        method: 'GET',
    });
}

async function updateProfile(userData) {
    return await apiRequest(API.auth.updateProfile, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
}

async function changePassword(passwordData) {
    return await apiRequest(API.auth.changePassword, {
        method: 'POST',
        body: JSON.stringify(passwordData),
    });
}

async function forgotPassword(email) {
    return await apiRequest(API.auth.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

async function resetPassword(data) {
    return await apiRequest(API.auth.resetPassword, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ====================
// PRODUCT API CALLS
// ====================

async function getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API.products.getAll}?${queryString}` : API.products.getAll;
    return await apiRequest(url, {
        method: 'GET',
    });
}

async function getProductById(id) {
    return await apiRequest(API.products.getById(id), {
        method: 'GET',
    });
}

async function createProduct(productData) {
    return await apiRequest(API.products.create, {
        method: 'POST',
        body: JSON.stringify(productData),
    });
}

async function updateProduct(id, productData) {
    return await apiRequest(API.products.update(id), {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
}

async function deleteProduct(id) {
    return await apiRequest(API.products.delete(id), {
        method: 'DELETE',
    });
}

async function getFeaturedProducts() {
    return await apiRequest(API.products.getFeatured, {
        method: 'GET',
    });
}

async function getBestSellers() {
    return await apiRequest(API.products.getBestSellers, {
        method: 'GET',
    });
}

async function getNewArrivals() {
    return await apiRequest(API.products.getNewArrivals, {
        method: 'GET',
    });
}

async function searchProducts(query) {
    return await apiRequest(`${API.products.search}?q=${encodeURIComponent(query)}`, {
        method: 'GET',
    });
}

async function filterProducts(filters) {
    const queryString = new URLSearchParams(filters).toString();
    return await apiRequest(`${API.products.filter}?${queryString}`, {
        method: 'GET',
    });
}

async function getCategories() {
    return await apiRequest(API.products.getCategories, {
        method: 'GET',
    });
}

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

async function createOrder(orderData) {
    return await apiRequest(API.orders.create, {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

async function getOrders() {
    return await apiRequest(API.orders.getAll, {
        method: 'GET',
    });
}

async function getOrderById(id) {
    return await apiRequest(API.orders.getById(id), {
        method: 'GET',
    });
}

async function updateOrderStatus(id, status) {
    return await apiRequest(API.orders.updateStatus(id), {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

async function getOrderStats() {
    return await apiRequest(API.orders.getStats, {
        method: 'GET',
    });
}

// ====================
// CART API CALLS
// ====================

async function getCart() {
    return await apiRequest(API.cart.get, {
        method: 'GET',
    });
}

async function addToCart(productId, quantity = 1, size = null, color = null) {
    return await apiRequest(API.cart.add, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, size, color }),
    });
}

async function removeFromCart(productId) {
    return await apiRequest(API.cart.remove, {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
    });
}

async function updateCartItem(productId, quantity) {
    return await apiRequest(API.cart.update, {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
    });
}

async function clearCart() {
    return await apiRequest(API.cart.clear, {
        method: 'DELETE',
    });
}

// ====================
// WISHLIST API CALLS
// ====================

async function getWishlist() {
    return await apiRequest(API.wishlist.get, {
        method: 'GET',
    });
}

async function addToWishlist(productId) {
    return await apiRequest(API.wishlist.add, {
        method: 'POST',
        body: JSON.stringify({ productId }),
    });
}

async function removeFromWishlist(productId) {
    return await apiRequest(API.wishlist.remove, {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
    });
}

async function checkWishlist(productId) {
    return await apiRequest(API.wishlist.check(productId), {
        method: 'GET',
    });
}

// ====================
// REVIEWS API CALLS
// ====================

async function createReview(reviewData) {
    return await apiRequest(API.reviews.create, {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}

async function getProductReviews(productId) {
    return await apiRequest(API.reviews.getByProduct(productId), {
        method: 'GET',
    });
}

async function getAllReviews() {
    return await apiRequest(API.reviews.getAll, {
        method: 'GET',
    });
}

async function deleteReview(id) {
    return await apiRequest(API.reviews.delete(id), {
        method: 'DELETE',
    });
}

async function approveReview(id) {
    return await apiRequest(API.reviews.approve(id), {
        method: 'PUT',
    });
}

// ====================
// BANNERS API CALLS
// ====================

async function getBanners() {
    return await apiRequest(API.banners.getAll, {
        method: 'GET',
    });
}

async function createBanner(bannerData) {
    return await apiRequest(API.banners.create, {
        method: 'POST',
        body: JSON.stringify(bannerData),
    });
}

async function updateBanner(id, bannerData) {
    return await apiRequest(API.banners.update(id), {
        method: 'PUT',
        body: JSON.stringify(bannerData),
    });
}

async function deleteBanner(id) {
    return await apiRequest(API.banners.delete(id), {
        method: 'DELETE',
    });
}

// ====================
// COUPONS API CALLS
// ====================

async function getCoupons() {
    return await apiRequest(API.coupons.getAll, {
        method: 'GET',
    });
}

async function createCoupon(couponData) {
    return await apiRequest(API.coupons.create, {
        method: 'POST',
        body: JSON.stringify(couponData),
    });
}

async function updateCoupon(id, couponData) {
    return await apiRequest(API.coupons.update(id), {
        method: 'PUT',
        body: JSON.stringify(couponData),
    });
}

async function deleteCoupon(id) {
    return await apiRequest(API.coupons.delete(id), {
        method: 'DELETE',
    });
}

async function validateCoupon(code, orderTotal) {
    return await apiRequest(`${API.coupons.validate}?code=${code}&total=${orderTotal}`, {
        method: 'GET',
    });
}

// ====================
// ADMIN API CALLS
// ====================

async function getDashboardStats() {
    return await apiRequest(API.admin.dashboard, {
        method: 'GET',
    });
}

async function getCustomers() {
    return await apiRequest(API.admin.customers, {
        method: 'GET',
    });
}

async function blockCustomer(id) {
    return await apiRequest(API.admin.blockCustomer(id), {
        method: 'PUT',
    });
}

async function unblockCustomer(id) {
    return await apiRequest(API.admin.unblockCustomer(id), {
        method: 'PUT',
    });
}

async function getSalesReport(startDate, endDate) {
    return await apiRequest(`${API.admin.salesReport}?start=${startDate}&end=${endDate}`, {
        method: 'GET',
    });
}

// ====================
// CONTACT API CALLS
// ====================

async function sendContactMessage(messageData) {
    return await apiRequest(API.contact.send, {
        method: 'POST',
        body: JSON.stringify(messageData),
    });
      }
