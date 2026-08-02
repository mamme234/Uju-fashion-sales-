// ====================
// ADMIN DASHBOARD
// ====================

// Check if user is admin
async function checkAdminAccess() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/pages/login.html';
        return false;
    }
    if (user.role !== 'admin') {
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

// Load Dashboard
async function loadDashboard() {
    try {
        const stats = await getDashboardStats();
        renderStats(stats);
        renderRecentOrders(stats.recentOrders);
        renderLowStock(stats.lowStock);
        
        // Update admin name
        const user = getCurrentUser();
        if (user) {
            document.getElementById('adminName').textContent = user.name || 'Admin';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

// Render Stats
function renderStats(stats) {
    const container = document.getElementById('statsGrid');
    if (!container) return;
    
    const statCards = [
        { icon: 'fa-money-bill-wave', number: `₦${formatNumber(stats.totalRevenue || 0)}`, label: 'Total Revenue', color: 'purple', change: '+12%' },
        { icon: 'fa-shopping-bag', number: stats.totalOrders || 0, label: 'Total Orders', color: 'blue', change: '+8%' },
        { icon: 'fa-users', number: stats.totalCustomers || 0, label: 'Total Customers', color: 'green', change: '+15%' },
        { icon: 'fa-box', number: stats.totalProducts || 0, label: 'Total Products', color: 'orange', change: '+5%' },
        { icon: 'fa-exclamation-triangle', number: stats.lowStockCount || 0, label: 'Low Stock Items', color: 'red', change: stats.lowStockCount > 0 ? '⚠️ Needs attention' : '✅ All good' },
        { icon: 'fa-star', number: stats.averageRating || '4.8', label: 'Average Rating', color: 'pink', change: '★ ★ ★ ★ ★' },
    ];
    
    container.innerHTML = statCards.map(card => `
        <div class="stat-card ${card.color}">
            <div class="stat-icon"><i class="fas ${card.icon}"></i></div>
            <div class="stat-number">${card.number}</div>
            <div class="stat-label">${card.label}</div>
            <div class="stat-change ${card.change.includes('+') ? 'positive' : card.change.includes('⚠️') ? 'negative' : ''}">
                ${card.change}
            </div>
        </div>
    `).join('');
}

// Render Recent Orders
function renderRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    if (!container) return;
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p style="color:#888;">No recent orders</p>';
        return;
    }
    
    container.innerHTML = orders.slice(0, 5).map(order => `
        <div class="recent-order-item">
            <div class="order-info">
                <span class="order-id">#${order._id?.slice(-6) || 'N/A'}</span>
                <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
                <span class="order-status ${order.orderStatus || 'pending'}">${order.orderStatus || 'Pending'}</span>
            </div>
            <span style="font-weight:600;">₦${formatNumber(order.total || 0)}</span>
        </div>
    `).join('');
}

// Render Low Stock
function renderLowStock(products) {
    const container = document.getElementById('lowStock');
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="color:#888;">✅ All products are well stocked</p>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const stockPercent = (product.stock / 20) * 100;
        const status = stockPercent <= 25 ? 'critical' : stockPercent <= 50 ? 'low' : 'medium';
        const statusLabel = stockPercent <= 25 ? 'Critical' : stockPercent <= 50 ? 'Low' : 'Medium';
        
        return `
            <div class="low-stock-item">
                <span>${product.name}</span>
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-weight:600;color:${status === 'critical' ? '#ef4444' : status === 'low' ? '#f59e0b' : '#3b82f6'};">
                        ${product.stock} left
                    </span>
                    <div class="stock-bar">
                        <div class="fill ${status}" style="width:${Math.min(stockPercent, 100)}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Format number with commas
function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString();
}

// Product Management Functions
async function loadProducts() {
    try {
        const data = await getProducts();
        const products = data.products || data || [];
        renderProductTable(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

function renderProductTable(products) {
    const container = document.getElementById('productTable');
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#888;">No products found</td></tr>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.images?.[0] || 'https://via.placeholder.com/50'}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" />
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category || 'Uncategorized'}</td>
            <td>₦${formatNumber(product.price)}</td>
            <td>
                <span style="color:${product.stock <= 5 ? '#ef4444' : product.stock <= 20 ? '#f59e0b' : '#10b981'};font-weight:600;">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="order-status ${product.isFeatured ? 'delivered' : 'pending'}">
                    ${product.isFeatured ? 'Featured' : 'Standard'}
                </span>
            </td>
            <td>
                <button onclick="editProduct('${product._id}')" class="btn-secondary" style="padding:6px 12px;font-size:12px;margin-right:6px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct('${product._id}')" class="btn-primary" style="padding:6px 12px;font-size:12px;background:#ef4444;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Create/Edit Product Modal
function showProductModal(product = null) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const isEdit = !!product;
    document.getElementById('modalTitle').textContent = isEdit ? 'Edit Product' : 'Add Product';
    
    if (isEdit) {
        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice || '';
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productSizes').value = product.sizes?.join(', ') || '';
        document.getElementById('productColors').value = product.colors?.join(', ') || '';
        document.getElementById('productFeatured').checked = product.isFeatured || false;
        document.getElementById('productBestSeller').checked = product.isBestSeller || false;
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    }
    
    modal.style.display = 'flex';
}

// Save Product
async function saveProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: document.getElementById('productOriginalPrice').value ? parseFloat(document.getElementById('productOriginalPrice').value) : null,
        stock: parseInt(document.getElementById('productStock').value),
        sizes: document.getElementById('productSizes').value.split(',').map(s => s.trim()).filter(Boolean),
        colors: document.getElementById('productColors').value.split(',').map(c => c.trim()).filter(Boolean),
        isFeatured: document.getElementById('productFeatured').checked,
        isBestSeller: document.getElementById('productBestSeller').checked,
        images: ['https://via.placeholder.com/300x300/2d1b69/ffffff?text=Product'],
    };
    
    try {
        if (id) {
            await updateProduct(id, productData);
            showToast('Product updated successfully!');
        } else {
            await createProduct(productData);
            showToast('Product created successfully!');
        }
        closeModal('productModal');
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showToast(error.message || 'Error saving product', 'error');
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await deleteProduct(id);
        showToast('Product deleted successfully!');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product', 'error');
    }
}

// Load Orders for Admin
async function loadAdminOrders() {
    try {
        const orders = await getOrders();
        renderAdminOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }
}

function renderAdminOrders(orders) {
    const container = document.getElementById('ordersTable');
    if (!container) return;
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#888;">No orders found</td></tr>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <tr>
            <td>#${order._id?.slice(-6) || 'N/A'}</td>
            <td>${order.user?.name || 'Guest'}</td>
            <td>₦${formatNumber(order.total)}</td>
            <td>${order.items?.length || 0} items</td>
            <td>
                <select onchange="updateOrderStatus('${order._id}', this.value)" class="order-status ${order.orderStatus || 'pending'}">
                    <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="accepted" ${order.orderStatus === 'accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="packed" ${order.orderStatus === 'packed' ? 'selected' : ''}>Packed</option>
                    <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button onclick="viewOrder('${order._id}')" class="btn-secondary" style="padding:6px 12px;font-size:12px;">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Order Status
async function updateOrderStatus(orderId, status) {
    try {
        await updateOrderStatus(orderId, status);
        showToast(`Order status updated to ${status}`);
    } catch (error) {
        console.error('Error updating order:', error);
        showToast('Error updating order status', 'error');
    }
}

// Load Customers
async function loadCustomers() {
    try {
        const customers = await getCustomers();
        renderCustomers(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
        showToast('Error loading customers', 'error');
    }
}

function renderCustomers(customers) {
    const container = document.getElementById('customersTable');
    if (!container) return;
    
    if (!customers || customers.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#888;">No customers found</td></tr>';
        return;
    }
    
    container.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name || 'N/A'}</td>
            <td>${customer.email}</td>
            <td>${customer.ordersCount || 0} orders</td>
            <td>₦${formatNumber(customer.totalSpent || 0)}</td>
            <td>
                <span class="order-status ${customer.isBlocked ? 'cancelled' : 'delivered'}">
                    ${customer.isBlocked ? 'Blocked' : 'Active'}
                </span>
            </td>
            <td>
                ${customer.isBlocked ? 
                    `<button onclick="unblockCustomer('${customer._id}')" class="btn-secondary" style="padding:6px 12px;font-size:12px;background:#10b981;">Unblock</button>` :
                    `<button onclick="blockCustomer('${customer._id}')" class="btn-primary" style="padding:6px 12px;font-size:12px;background:#ef4444;">Block</button>`
                }
            </td>
        </tr>
    `).join('');
}

// Block/Unblock Customer
async function blockCustomer(id) {
    if (!confirm('Are you sure you want to block this customer?')) return;
    try {
        await blockCustomer(id);
        showToast('Customer blocked successfully');
        loadCustomers();
    } catch (error) {
        console.error('Error blocking customer:', error);
        showToast('Error blocking customer', 'error');
    }
}

async function unblockCustomer(id) {
    if (!confirm('Are you sure you want to unblock this customer?')) return;
    try {
        await unblockCustomer(id);
        showToast('Customer unblocked successfully');
        loadCustomers();
    } catch (error) {
        console.error('Error unblocking customer:', error);
        showToast('Error unblocking customer', 'error');
    }
}

// Modal Helpers
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Click outside modal to close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initialize based on page
document.addEventListener('DOMContentLoaded', async () => {
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    if (isAdminPage) {
        const hasAccess = await checkAdminAccess();
        if (!hasAccess) return;
        
        const page = window.location.pathname.split('/').pop();
        
        switch(page) {
            case 'index.html':
                loadDashboard();
                break;
            case 'products.html':
                loadProducts();
                break;
            case 'orders.html':
                loadAdminOrders();
                break;
            case 'customers.html':
                loadCustomers();
                break;
            case 'reviews.html':
                loadReviews();
                break;
            case 'coupons.html':
                loadCoupons();
                break;
            case 'banners.html':
                loadBanners();
                break;
            case 'reports.html':
                loadReports();
                break;
        }
    }
});
