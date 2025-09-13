// GG Motors Frontend JavaScript

const API_BASE = 'http://localhost:5000/api';

// Global variables
let currentUser = null;
let authToken = null;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('GG Motors app loaded');

  // Initialize app
  initializeApp();
  loadVehicles();

  // Event listeners
  setupEventListeners();
});

function initializeApp() {
  // Check for stored authentication
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('currentUser');

  if (storedToken && storedUser) {
    authToken = storedToken;
    currentUser = JSON.parse(storedUser);
    updateUIForAuthenticatedUser();
  } else {
    updateUIForGuest();
  }

  // Load cart from localStorage
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCartCount();
  }
}

function setupEventListeners() {
  // Search and filters
  document.getElementById('search-btn').addEventListener('click', handleSearch);
  document.getElementById('apply-filters').addEventListener('click', handleFilters);

  // Authentication modals
  document.getElementById('login-link').addEventListener('click', () => showModal('login-modal'));
  document.getElementById('login-close').addEventListener('click', () => hideModal('login-modal'));
  document.getElementById('register-close').addEventListener('click', () => hideModal('register-modal'));
  document.getElementById('sell-close').addEventListener('click', () => hideModal('sell-modal'));

  // Modal switching
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    hideModal('login-modal');
    showModal('register-modal');
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    hideModal('register-modal');
    showModal('login-modal');
  });

  // Sell link
  document.getElementById('sell-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
      showModal('sell-modal');
    } else {
      showModal('login-modal');
    }
  });

  // Cart modal
  document.getElementById('cart-link').addEventListener('click', (e) => {
    e.preventDefault();
    showCartModal();
  });
  document.getElementById('cart-close').addEventListener('click', () => hideModal('cart-modal'));

  // Cart actions
  document.getElementById('clear-cart').addEventListener('click', clearCart);
  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Form submissions
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.getElementById('sell-form').addEventListener('submit', handleSellMoto);

  // Image preview
  document.getElementById('moto-images').addEventListener('change', handleImagePreview);

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      hideModal(e.target.id);
    }
  });
}

// Load vehicles from API with optional filters
async function loadVehicles(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE}/vehicles?${query}`);
    if (response.ok) {
      const vehicles = await response.json();
      displayVehicles(vehicles);
    } else {
      console.error('Failed to load vehicles');
    }
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
}

// Display vehicles in the list
function displayVehicles(vehicles) {
  const container = document.getElementById('vehicle-list');
  if (!container) return;

  container.innerHTML = vehicles.map(vehicle => `
    <div class="vehicle-card">
      ${vehicle.images && vehicle.images.length > 0 ? `<img src="${vehicle.images[0]}" alt="${vehicle.title}" class="vehicle-image">` : ''}
      <h3>${vehicle.title}</h3>
      <p>Precio: $${vehicle.price.toLocaleString()}</p>
      <p>${vehicle.description || 'Sin descripción'}</p>
      <div class="vehicle-actions">
        <button onclick="viewVehicleDetails('${vehicle._id}')">Ver Detalles</button>
        <button onclick="addToCart('${vehicle._id}', '${vehicle.title}', ${vehicle.price})" class="btn-cart">Agregar al Carrito</button>
      </div>
    </div>
  `).join('');
}

// View vehicle details (placeholder)
function viewVehicleDetails(vehicleId) {
  alert(`Ver detalles del vehículo ${vehicleId}`);
}

// Modal functions
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Authentication functions
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      updateUIForAuthenticatedUser();
      hideModal('login-modal');
      showMessage('¡Bienvenido!', 'success');
    } else {
      showMessage(data.message || 'Error al iniciar sesión', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Error de conexión', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const phone = document.getElementById('register-phone').value;

  try {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await response.json();

    if (response.ok) {
      hideModal('register-modal');
      showModal('login-modal');
      showMessage('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
    } else {
      showMessage(data.message || 'Error en el registro', 'error');
    }
  } catch (error) {
    console.error('Register error:', error);
    showMessage('Error de conexión', 'error');
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  updateUIForGuest();
  showMessage('Sesión cerrada', 'success');
}

function updateUIForAuthenticatedUser() {
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('guest-info').style.display = 'none';
  document.getElementById('user-name').textContent = `Hola, ${currentUser.name}`;
}

function updateUIForGuest() {
  document.getElementById('user-info').style.display = 'none';
  document.getElementById('guest-info').style.display = 'block';
}

// Sell moto functions
async function handleSellMoto(e) {
  e.preventDefault();

  if (!currentUser) {
    showMessage('Debes iniciar sesión para vender', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('title', `${document.getElementById('moto-brand').value} ${document.getElementById('moto-model').value}`);
  formData.append('brand', document.getElementById('moto-brand').value);
  formData.append('model', document.getElementById('moto-model').value);
  formData.append('year', document.getElementById('moto-year').value);
  formData.append('mileage', document.getElementById('moto-mileage').value);
  formData.append('price', document.getElementById('moto-price').value);
  formData.append('location', document.getElementById('moto-location').value);
  formData.append('description', document.getElementById('moto-description').value);
  formData.append('category', 'motorcycles');
  formData.append('sellerId', currentUser.id);

  // Handle images
  const imageFiles = document.getElementById('moto-images').files;
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('images', imageFiles[i]);
  }

  try {
    const response = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      hideModal('sell-modal');
      document.getElementById('sell-form').reset();
      document.getElementById('image-preview').innerHTML = '';
      showMessage('Moto publicada exitosamente', 'success');
      loadVehicles(); // Refresh vehicle list
    } else {
      showMessage(data.message || 'Error al publicar la moto', 'error');
    }
  } catch (error) {
    console.error('Sell moto error:', error);
    showMessage('Error de conexión', 'error');
  }
}

function handleImagePreview(e) {
  const preview = document.getElementById('image-preview');
  preview.innerHTML = '';

  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
}

// Utility functions
function showMessage(message, type) {
  // Simple alert for now - could be enhanced with toast notifications
  alert(message);
}

// Handle search
function handleSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    loadVehicles({ brand: query });
  } else {
    loadVehicles();
  }
}

// Handle filters
function handleFilters() {
  const category = document.getElementById('category-filter').value;
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const location = document.getElementById('location-filter').value.trim();

  const filters = {};
  if (category) filters.category = category;
  if (minPrice) filters.minPrice = minPrice;
  if (maxPrice) filters.maxPrice = maxPrice;
  if (location) filters.location = location;

  loadVehicles(filters);
}

// Cart functions
function addToCart(vehicleId, title, price) {
  if (!currentUser) {
    showMessage('Debes iniciar sesión para agregar al carrito', 'error');
    showModal('login-modal');
    return;
  }

  const existingItem = cart.find(item => item.id === vehicleId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: vehicleId,
      title: title,
      price: price,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  showMessage('Vehículo agregado al carrito', 'success');
}

function removeFromCart(vehicleId) {
  cart = cart.filter(item => item.id !== vehicleId);
  saveCart();
  updateCartCount();
  showCartModal();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartModal() {
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
    totalAmount.textContent = '0';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <p>Precio: $${item.price.toLocaleString()}</p>
          <p>Cantidad: ${item.quantity}</p>
          <p>Subtotal: $${(item.price * item.quantity).toLocaleString()}</p>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="btn-remove">Eliminar</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toLocaleString();
  }

  showModal('cart-modal');
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  showCartModal();
  showMessage('Carrito vaciado', 'success');
}

function handleCheckout() {
  if (cart.length === 0) {
    showMessage('Tu carrito está vacío', 'error');
    return;
  }

  if (!currentUser) {
    showMessage('Debes iniciar sesión para proceder al pago', 'error');
    showModal('login-modal');
    return;
  }

  // Here you would typically integrate with a payment processor
  // For now, we'll simulate a successful transaction
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Create transaction record
  createTransaction(total);

  showMessage('Compra realizada exitosamente', 'success');
  clearCart();
  hideModal('cart-modal');
}

async function createTransaction(amount) {
  try {
    const transactionData = {
      buyerId: currentUser.id,
      sellerId: cart[0].sellerId || currentUser.id, // This should be the actual seller
      vehicleId: cart[0].id,
      amount: amount,
      status: 'completed',
      paymentMethod: 'credit_card'
    };

    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      console.error('Error creating transaction');
    }
  } catch (error) {
    console.error('Transaction error:', error);
  }
}