// ====================
// CART FUNCTIONS
// ====================

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Render cart page
function renderCartPage() {
    const cartContainer = document.getElementById('cartItems');
    const cart = getCart();

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag" style="font-size:64px;color:#ddd;"></i>
                <h3>Your cart is empty</h3>
                <p>Browse our collection and add items you love</p>
                <a href="shop.html" class="btn-primary">Start Shopping</a>
            </div>
        `;
        updateCartSummary(0);
        return;
    }

    let html = `
        <div class="cart-table">
            <div class="cart-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Action</span>
            </div>
    `;

    let subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}" />
                    <div>
                        <h4>${item.name}</h4>
                        <p>Size: M | Color: Black</p>
                    </div>
                </div>
                <div class="cart-price">$${item.price.toFixed(2)}</div>
                <div class="cart-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-total">$${total.toFixed(2)}</div>
                <div class="cart-action">
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    cartContainer.innerHTML = html;
    updateCartSummary(subtotal);
}

// Update quantity
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    saveCart(cart);
    renderCartPage();
}

// Remove from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    renderCartPage();
    showToast('Item removed from cart');
}

// Update cart summary
function updateCartSummary(subtotal) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        saveCart([]);
        renderCartPage();
        showToast('Cart cleared');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    window.location.href = 'checkout.html';
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartItems')) {
        renderCartPage();
    }
});
