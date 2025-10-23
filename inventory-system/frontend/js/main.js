const API = 'http://localhost:5000/api/products';
let bsModal;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bootstrap modal
  const modalEl = document.getElementById('productModal');
  bsModal = new bootstrap.Modal(modalEl);

  // Add Product button click
  document.getElementById('addBtn').addEventListener('click', () => {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    bsModal.show(); // SHOW modal
  });

  // Product form submit
  document.getElementById('productForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const payload = {
      name: document.getElementById('name').value,
      sku: document.getElementById('sku').value,
      price: parseFloat(document.getElementById('price').value),
      quantity: parseInt(document.getElementById('quantity').value)
    };
    if (id) {
      await fetch(`${API}/${id}`, { 
        method: 'PUT', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(payload) 
      });
    } else {
      await fetch(API, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(payload) 
      });
    }
    bsModal.hide();
    fetchProducts();
  });

  // Load products initially
  fetchProducts();
});

// Edit product
async function editProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();
  document.getElementById('prodId').value = p.id;
  document.getElementById('name').value = p.name;
  document.getElementById('sku').value = p.sku || '';
  document.getElementById('price').value = p.price;
  document.getElementById('quantity').value = p.quantity;
  bsModal.show();
}

// Fetch products
async function fetchProducts() {
  const res = await fetch(API);
  const data = await res.json();
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  data.forEach((p, idx) => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${idx+1}</td>
        <td>${p.name}</td>
        <td>${p.sku || ''}</td>
        <td>₹${Number(p.price).toFixed(2)}</td>
        <td>${p.quantity}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `);
  });
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Delete product?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  fetchProducts();
}

const signinBtn = document.getElementById('signinBtn');
    const signinModal = new bootstrap.Modal(document.getElementById('signinModal'));
    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
    const openSignup = document.getElementById('openSignup');
    const userDropdown = document.getElementById('userDropdown');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const profileName = document.getElementById('profileName');
    const logoutBtn = document.getElementById('logoutBtn');

    signinBtn.addEventListener('click', () => signinModal.show());
    openSignup.addEventListener('click', (e) => {
      e.preventDefault();
      signinModal.hide();
      setTimeout(() => signupModal.show(), 400);
    });

    document.getElementById('signinForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signinEmail').value;
      const username = email.split('@')[0];
      usernameDisplay.textContent = username;
      profileName.textContent = username;
      signinModal.hide();
      signinBtn.classList.add('d-none');
      userDropdown.classList.remove('d-none');
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Account created successfully! Please sign in.');
      signupModal.hide();
      setTimeout(() => signinModal.show(), 400);
    });

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userDropdown.classList.add('d-none');
      signinBtn.classList.remove('d-none');
    });