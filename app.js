// ============================================
// Shopping Application - Main JavaScript File
// ============================================

// ============================================
// 1. LOCAL STORAGE & DATA MANAGEMENT
// ============================================

// Initialize storage
async function initializeStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Always load products from JSON file (or use defaults)
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        // Convert products.json format to app format
        const products = data.products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.details,
            image: p.image,
            category: p.category
        }));
        localStorage.setItem('products', JSON.stringify(products));
        console.log('Products loaded from products.json:', products.length);
    } catch (error) {
        console.log('Could not load products.json, using defaults', error);
        // Fallback to default products if JSON file not found
        localStorage.setItem('products', JSON.stringify([
            {
                id: 1,
                name: 'Wireless Headphones',
                price: 79.99,
                description: 'High-quality wireless headphones with noise cancellation',
                image: 'images/wireless-headphones.jpg'
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 199.99,
                description: 'Feature-rich smartwatch with health tracking',
                image: 'images/smart-watch.jpeg'
            },
            {
                id: 3,
                name: 'USB-C Cable',
                price: 14.99,
                description: 'Durable USB-C charging cable',
                image: 'images/usb-cable.jpeg'
            },
            {
                id: 4,
                name: 'Wireless Mouse',
                price: 29.99,
                description: 'Ergonomic design with precision tracking and 12-month battery',
                image: 'images/wireless-mouse.jpeg'
            },
             {
                id: 5,
                name: 'laptop',
                price: 100.99,
                description: 'user -friendly',
                image: 'images/laptop.jpeg'
            },
        ]));
    }

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}// Get all users
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Get all products
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Get cart items
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Save products
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Save cart
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

// Set current user
function setCurrentUser(user) {
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('currentUser');
    }
}

// ============================================
// 2. SNACKBAR NOTIFICATIONS
// ============================================

function showSnackbar(message, duration = 3000) {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
        snackbar.textContent = message;
        snackbar.classList.add('show');
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, duration);
    }
}

// ============================================
// 3. NAVIGATION & AUTH
// ============================================

function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const currentUser = getCurrentUser();
    navLinks.innerHTML = '';

    const links = [
        { text: 'Home', href: 'index.html' },
        { text: 'Products', href: 'products.html' },
        { text: 'Cart', href: 'cart.html' }
    ];

    links.forEach(link => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link" href="${link.href}">${link.text}</a>`;
        navLinks.appendChild(li);
    });

    // Add user or logout
    const li = document.createElement('li');
    li.className = 'nav-item';
    if (currentUser) {
        li.innerHTML = `
            <a class="nav-link" href="#" onclick="logout(event)">
                Logout (${currentUser.name})
            </a>
        `;
    } else {
        li.innerHTML = `
            <a class="nav-link" href="login.html">Login</a>
        `;
    }
    navLinks.appendChild(li);
}

function logout(event) {
    event.preventDefault();
    setCurrentUser(null);
    showSnackbar('Logged out successfully');
    window.location.href = 'index.html';
}

// ============================================
// 4. AUTHENTICATION FUNCTIONS
// ============================================

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    // Validation
    if (password.length < 6) {
        showSnackbar('Password must be at least 6 characters');
        return;
    }

    if (password !== confirm) {
        showSnackbar('Passwords do not match');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showSnackbar('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    saveUsers(users);
    showSnackbar('Registration successful! Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showSnackbar('Invalid email or password');
        return;
    }

    setCurrentUser(user);
    showSnackbar('Login successful! Redirecting...');
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
}

// ============================================
// 5. PRODUCTS FUNCTIONS
// ============================================

function displayProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    const products = getProducts();
    const currentUser = getCurrentUser();

    if (products.length === 0) {
        productList.innerHTML = '<p class="col-12 text-center">No products available</p>';
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-4">
            <div class="card material-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="fw-bold text-primary mb-3">$${product.price.toFixed(2)}</p>
                    <div class="mt-auto">
                        <button class="btn material-btn w-100 mb-2" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                        ${currentUser ? `
                            <div class="btn-group w-100">
                                <a href="edit-product.html?id=${product.id}" class="btn material-btn flex-grow-1">Edit</a>
                                <button class="btn material-btn" onclick="deleteProduct(${product.id})">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Show/hide add product button
    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) {
        addBtn.style.display = currentUser ? 'block' : 'none';
    }
}

function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        showSnackbar('Product not found');
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showSnackbar(`${product.name} added to cart!`);
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    let products = getProducts();
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    showSnackbar('Product deleted successfully');
    displayProducts();
}

function handleAddProduct(event) {
    event.preventDefault();

    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const description = document.getElementById('prodDesc').value.trim();
    const image = document.getElementById('prodImage').value.trim();

    if (!name || !price || !description) {
        showSnackbar('Please fill in all required fields');
        return;
    }

    const products = getProducts();
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        description: description,
        image: image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(name)
    };

    products.push(newProduct);
    saveProducts(products);
    showSnackbar('Product added successfully!');
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1500);
}

function loadEditProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        showSnackbar('Product not found');
        window.location.href = 'products.html';
        return;
    }

    document.getElementById('editId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editDesc').value = product.description;
    document.getElementById('editImage').value = product.image;
}

function handleEditProduct(event) {
    event.preventDefault();

    const productId = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value.trim();
    const price = parseFloat(document.getElementById('editPrice').value);
    const description = document.getElementById('editDesc').value.trim();
    const image = document.getElementById('editImage').value.trim();

    if (!name || !price || !description) {
        showSnackbar('Please fill in all required fields');
        return;
    }

    let products = getProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        showSnackbar('Product not found');
        return;
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(name);

    saveProducts(products);
    showSnackbar('Product updated successfully!');
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1500);
}

// ============================================
// 6. CART FUNCTIONS
// ============================================

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItems || !cartSummary) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartSummary.innerHTML = '';
        return;
    }

    // Display cart items
    cartItems.innerHTML = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>
                                <input type="number" min="1" value="${item.quantity}" 
                                    onchange="updateCartQuantity(${item.id}, this.value)" class="form-control" style="width: 60px;">
                            </td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Display cart summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    cartSummary.innerHTML = `
        <div class="row justify-content-end">
            <div class="col-md-4">
                <div class="card p-3 material-card">
                    <h5>Order Summary</h5>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tax (10%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold text-primary">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="btn material-btn w-100 mt-3" onclick="checkout()">Checkout</button>
                    <a href="products.html" class="btn btn-outline-primary w-100 mt-2">Continue Shopping</a>
                </div>
            </div>
        </div>
    `;
}

function updateCartQuantity(itemId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);

    if (item) {
        const newQuantity = Math.max(1, parseInt(quantity) || 1);
        item.quantity = newQuantity;
        saveCart(cart);
        displayCart();
    }
}

function removeFromCart(itemId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== itemId);
    saveCart(filteredCart);
    showSnackbar('Item removed from cart');
    displayCart();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showSnackbar('Cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1;
    showSnackbar(`Order placed successfully! Total: $${total.toFixed(2)}`);
    saveCart([]);
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
}

// ============================================
// 7. PAGE INITIALIZATION
// ============================================

async function initPage() {
    await initializeStorage();
    updateNavigation();

    // Register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Products page
    if (document.getElementById('productList')) {
        displayProducts();
    }

    // Add product page
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Edit product page
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        loadEditProduct();
        editProductForm.addEventListener('submit', handleEditProduct);
    }

    // Cart page
    if (document.getElementById('cartItems')) {
        displayCart();
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initPage);

