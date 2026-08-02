// ====================
// PRODUCT DATA (Mock)
// ====================
const products = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        category: "Men",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.8,
        reviews: 234,
        image: "images/products/jacket.jpg",
        badge: "New",
        inStock: true
    },
    {
        id: 2,
        name: "Floral Maxi Dress",
        category: "Women",
        price: 74.99,
        originalPrice: null,
        rating: 4.7,
        reviews: 189,
        image: "images/products/dress.jpg",
        badge: "Sale",
        inStock: true
    },
    {
        id: 3,
        name: "Slim Fit Jeans",
        category: "Men",
        price: 59.99,
        originalPrice: 79.99,
        rating: 4.6,
        reviews: 312,
        image: "images/products/jeans.jpg",
        badge: "Best Seller",
        inStock: true
    },
    {
        id: 4,
        name: "Silk Blouse",
        category: "Women",
        price: 49.99,
        originalPrice: null,
        rating: 4.5,
        reviews: 156,
        image: "images/products/blouse.jpg",
        badge: null,
        inStock: true
    },
    {
        id: 5,
        name: "Leather Boots",
        category: "Men",
        price: 119.99,
        originalPrice: 159.99,
        rating: 4.9,
        reviews: 278,
        image: "images/products/boots.jpg",
        badge: "New",
        inStock: true
    },
    {
        id: 6,
        name: "Pleated Skirt",
        category: "Women",
        price: 39.99,
        originalPrice: 54.99,
        rating: 4.3,
        reviews: 98,
        image: "images/products/skirt.jpg",
        badge: "Sale",
        inStock: false
    },
    {
        id: 7,
        name: "Polo T-Shirt",
        category: "Men",
        price: 34.99,
        originalPrice: null,
        rating: 4.4,
        reviews: 203,
        image: "images/products/polo.jpg",
        badge: null,
        inStock: true
    },
    {
        id: 8,
        name: "Baggy Jeans",
        category: "Men",
        price: 69.99,
        originalPrice: 89.99,
        rating: 4.7,
        reviews: 167,
        image: "images/products/baggy.jpg",
        badge: "Trending",
        inStock: true
    }
];

// ====================
// RENDER PRODUCTS
// ====================
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = productList.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="product-wishlist" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <div class="product-rating">
                    ★ ${product.rating} (${product.reviews})
                </div>
                <div class="product-price">
                    <span class="current">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" 
                    ${!product.inStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `).join('');
}

// ====================
// WISHLIST
// ====================
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    // Toast notification
    showToast(index > -1 ? 'Removed from wishlist' : 'Added to wishlist');
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('.nav-icon .badge');
    if (badges.length > 0) {
        badges[0].textContent = wishlist.length;
    }
}

// ====================
// CART (Using cart.js)
// ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} added to cart!`);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = total;
}

// ====================
// TOAST NOTIFICATIONS
// ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#2d1b69' : '#ff6b6b'};
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
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ====================
// COUNTDOWN TIMER
// ====================
function startCountdown() {
    let hours = 12, minutes = 30, seconds = 45;

    setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        if (hours < 0) {
            hours = 12;
            minutes = 30;
            seconds = 45;
        }

        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ====================
// NEWSLETTER
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            showToast(`Subscribed with ${email}! Welcome to FashionStore.`);
            newsletterForm.reset();
        });
    }
});

// ====================
// INITIALIZE
// ====================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('newArrivals', products.slice(0, 4));
    renderProducts('bestSellers', products.slice(4, 8));
    updateCartBadge();
    updateWishlistBadge();
    startCountdown();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// ====================
// NAVBAR ACTIVE LINK
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ====================
// SCROLL ANIMATIONS
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .category-card, .feature-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
