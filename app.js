// js/app.js
// Render a single product card
function createProductCard(product) {
  const isShop = window.location.pathname.includes('shop.html');
  const pathPrefix = isShop ? '../' : './';
  const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
  const productUrl = `${isRoot ? 'pages/' : ''}product.html?id=${product.id}`;

  return `
    <div class="product-card">
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
      <a href="${productUrl}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </a>
      <div class="product-category">${product.category}</div>
      <a href="${productUrl}">
        <h3 class="product-title">${product.name}</h3>
      </a>
      <div class="product-footer">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <button class="btn btn-primary" onclick="addToCart(${product.id}); event.stopPropagation();">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  `;
}

// Render products to a container
function renderProducts(productsToRender, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (productsToRender.length === 0) {
    container.innerHTML = '<div class="text-center w-100" style="grid-column: 1 / -1; padding: 40px;"><p>No products found.</p></div>';
    return;
  }
  
  container.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
}

// Page Specific Initializations
document.addEventListener('DOMContentLoaded', () => {
  const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  // Home Page
  if (path === 'index.html') {
    // Featured products (first 8)
    const featured = window.products.slice(0, 8);
    renderProducts(featured, 'featured-products');
  }

  // Shop Page
  if (path === 'shop.html') {
    const shopContainer = 'shop-products';
    if(document.getElementById(shopContainer)) {
        renderProducts(window.products, shopContainer);
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const filterBtns = document.querySelectorAll('.filter-btn');
        let currentCategory = 'All';
        
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = window.products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchTerm);
                const matchesCat = currentCategory === 'All' || p.category === currentCategory;
                return matchesSearch && matchesCat;
            });
            renderProducts(filtered, shopContainer);
        }

        if(searchInput) {
            searchInput.addEventListener('input', filterProducts);
        }

        if(filterBtns) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterBtns.forEach(b => b.classList.remove('btn-primary'));
                    filterBtns.forEach(b => b.classList.add('btn-outline'));
                    e.target.classList.remove('btn-outline');
                    e.target.classList.add('btn-primary');
                    
                    currentCategory = e.target.dataset.category;
                    filterProducts();
                });
            });
        }
    }
  }

  // Product Details Page
  if (path === 'product.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = window.products.find(p => p.id === productId);
    
    if (product) {
      document.title = `${product.name} - Online Grocery`;
      const container = document.getElementById('product-details-container');
      if (container) {
        container.innerHTML = `
          <div class="product-gallery">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            ${product.badge ? `<span class="badge" style="position:static; margin-bottom:16px;">${product.badge}</span>` : ''}
            <div class="product-category">${product.category}</div>
            <h1>${product.name}</h1>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <p>${product.description}</p>
            
            <div class="quantity-selector">
              <button class="quantity-btn" onclick="const qty=document.getElementById('qty'); if(qty.value>1)qty.value--">-</button>
              <input type="number" id="qty" value="1" min="1" class="quantity-input">
              <button class="quantity-btn" onclick="const qty=document.getElementById('qty'); qty.value++">+</button>
            </div>
            
            <button class="btn btn-primary btn-block" style="margin-top: 24px; padding: 16px; font-size: 18px;" onclick="addToCart(${product.id}, parseInt(document.getElementById('qty').value))">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        `;
      }
    } else {
        const container = document.getElementById('product-details-container');
        if(container) {
            container.innerHTML = '<p>Product not found.</p>';
        }
    }
  }

  // Cart Page
  if (path === 'cart.html') {
    function renderCart() {
        const cartItems = window.getCart();
        const container = document.getElementById('cart-items');
        const summaryCont = document.getElementById('cart-summary');
        
        if(!container) return;

        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart text-center">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: var(--gray); margin-bottom: 16px;"></i>
                    <h2>Your cart is empty</h2>
                    <p style="margin-bottom: 24px;">Looks like you haven't added anything to your cart yet.</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            if(summaryCont) summaryCont.style.display = 'none';
            return;
        }

        if(summaryCont) summaryCont.style.display = 'block';

        container.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="window.updateCartItemQty(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" readonly class="quantity-input">
                        <button class="quantity-btn" onclick="window.updateCartItemQty(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm" style="padding: 8px 12px; border-radius: 4px;" onclick="window.removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update totals
        document.getElementById('cart-subtotal').textContent = `$${window.getCartTotal().toFixed(2)}`;
        const shipping = window.getCartTotal() > 50 ? 0 : 5.00; // Free shipping over $50
        document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${(window.getCartTotal() + shipping).toFixed(2)}`;
    }

    window.updateCartItemQty = (id, qty) => {
        if(qty < 1) {
            window.removeCartItem(id);
            return;
        }
        window.updateQuantity(id, qty);
        renderCart();
    };
    window.removeCartItem = (id) => {
        window.removeFromCart(id);
        renderCart();
    };

    renderCart();

    const clearBtn = document.getElementById('clear-cart-btn');
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            window.clearCart();
            renderCart();
        });
    }
  }

  // Registration Validation
  if (path === 'register.html') {
      const form = document.getElementById('register-form');
      if (form) {
          // password strength indicator
          const passInput = document.getElementById('password');
          const strengthInd = document.getElementById('password-strength');
          if(passInput && strengthInd) {
              passInput.addEventListener('input', (e) => {
                  const val = e.target.value;
                  let strength = 0;
                  if(val.length >= 8) strength++;
                  if(/[A-Z]/.test(val)) strength++;
                  if(/[0-9]/.test(val)) strength++;
                  
                  if(strength === 0) strengthInd.innerHTML = '';
                  else if(strength === 1) strengthInd.innerHTML = '<span style="color:#e74c3c; font-size:12px;">Weak</span>';
                  else if(strength === 2) strengthInd.innerHTML = '<span style="color:#f39c12; font-size:12px;">Medium</span>';
                  else if(strength === 3) strengthInd.innerHTML = '<span style="color:var(--primary); font-size:12px;">Strong</span>';
              });
          }

          form.addEventListener('submit', (e) => {
              e.preventDefault();
              let isValid = true;
              
              const nameRes = window.validateName(document.getElementById('name').value);
              if(!nameRes.valid) { window.showError('name', nameRes.message); isValid = false; } else { window.clearError('name'); }

              const emailRes = window.validateEmail(document.getElementById('email').value);
              if(!emailRes.valid) { window.showError('email', emailRes.message); isValid = false; } else { window.clearError('email'); }

              const phoneRes = window.validatePhone(document.getElementById('phone').value);
              if(!phoneRes.valid) { window.showError('phone', phoneRes.message); isValid = false; } else { window.clearError('phone'); }

              const pass = document.getElementById('password').value;
              const passRes = window.validatePasswordComplex(pass);
              if(!passRes.valid) { window.showError('password', passRes.message); isValid = false; } else { window.clearError('password'); }

              const confirm = document.getElementById('confirm-password').value;
              const confirmRes = window.validateConfirmPassword(pass, confirm);
              if(!confirmRes.valid) { window.showError('confirm-password', confirmRes.message); isValid = false; } else { window.clearError('confirm-password'); }

              if (isValid) {
                  window.showToast('Registration successful! Redirecting...', 'success');
                  setTimeout(() => window.location.href = 'login.html', 2000);
              }
          });
          
          const toggle = document.getElementById('toggle-password');
          if(toggle) {
              toggle.addEventListener('click', () => {
                  const input = document.getElementById('password');
                  const isPassword = input.type === 'password';
                  input.type = isPassword ? 'text' : 'password';
                  toggle.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
              });
          }
      }
  }

  // Login Validation
  if (path === 'login.html') {
      const form = document.getElementById('login-form');
      if (form) {
          form.addEventListener('submit', (e) => {
              e.preventDefault();
              let isValid = true;
              
              const emailRes = window.validateEmail(document.getElementById('email').value);
              if(!emailRes.valid) { window.showError('email', emailRes.message); isValid = false; } else { window.clearError('email'); }

              const pass = document.getElementById('password').value;
              const passRes = window.validatePassword(pass);
              if(!passRes.valid) { window.showError('password', passRes.message); isValid = false; } else { window.clearError('password'); }

              if (isValid) {
                  window.showToast('Login successful!', 'success');
                  setTimeout(() => window.location.href = '../index.html', 1000);
              }
          });
          
          const toggle = document.getElementById('toggle-password');
          if(toggle) {
              toggle.addEventListener('click', () => {
                  const input = document.getElementById('password');
                  const isPassword = input.type === 'password';
                  input.type = isPassword ? 'text' : 'password';
                  toggle.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
              });
          }
      }
  }

  // Contact Validation
  if (path === 'contact.html') {
      const form = document.getElementById('contact-form');
      if (form) {
          form.addEventListener('submit', (e) => {
              e.preventDefault();
              let isValid = true;
              
              const nameRes = window.validateName(document.getElementById('name').value);
              if(!nameRes.valid) { window.showError('name', nameRes.message); isValid = false; } else { window.clearError('name'); }

              const emailRes = window.validateEmail(document.getElementById('email').value);
              if(!emailRes.valid) { window.showError('email', emailRes.message); isValid = false; } else { window.clearError('email'); }

              const subjRes = window.validateName(document.getElementById('subject').value);
              if(!subjRes.valid) { window.showError('subject', 'Subject must be at least 3 characters'); isValid = false; } else { window.clearError('subject'); }

              const msgRes = window.validateMessage(document.getElementById('message').value);
              if(!msgRes.valid) { window.showError('message', msgRes.message); isValid = false; } else { window.clearError('message'); }

              if (isValid) {
                  window.showToast('Message sent successfully!', 'success');
                  form.reset();
                  ['name','email','subject','message'].forEach(id => window.clearValidationState(id));
              }
          });
      }
  }

  // Checkout Validation
  if (path === 'checkout.html') {
      if (window.getCartCount() === 0) {
          window.location.href = 'cart.html';
          return;
      }

      const summaryItems = document.getElementById('checkout-items');
      if(summaryItems) {
          const cart = window.getCart();
          summaryItems.innerHTML = cart.map(i => `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                <span>${i.quantity}x ${i.name}</span>
                <span>$${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          `).join('');
          
          document.getElementById('checkout-total').textContent = `$${window.getCartTotal().toFixed(2)}`;
          // Adding fake shipping
          const shipping = window.getCartTotal() > 50 ? 0 : 5.00;
          document.getElementById('checkout-final-total').textContent = `$${(window.getCartTotal() + shipping).toFixed(2)}`;
      }

      const form = document.getElementById('checkout-form');
      if (form) {
          form.addEventListener('submit', (e) => {
              e.preventDefault();
              let isValid = true;
              
              const nameRes = window.validateName(document.getElementById('name').value);
              if(!nameRes.valid) { window.showError('name', nameRes.message); isValid = false; } else { window.clearError('name'); }

              const emailRes = window.validateEmail(document.getElementById('email').value);
              if(!emailRes.valid) { window.showError('email', emailRes.message); isValid = false; } else { window.clearError('email'); }

              const phoneRes = window.validatePhone(document.getElementById('phone').value);
              if(!phoneRes.valid) { window.showError('phone', phoneRes.message); isValid = false; } else { window.clearError('phone'); }

              const addressRes = window.validateAddress(document.getElementById('address').value);
              if(!addressRes.valid) { window.showError('address', addressRes.message); isValid = false; } else { window.clearError('address'); }

              const paymentMethods = document.getElementsByName('payment');
              let paymentSelected = false;
              for(let radio of paymentMethods) {
                  if(radio.checked) {
                      paymentSelected = true; break;
                  }
              }
              if(!paymentSelected) {
                  window.showToast('Please select a payment method', 'error');
                  isValid = false;
              }

              if (isValid) {
                  window.showToast('Order placed successfully!', 'success');
                  window.clearCart();
                  setTimeout(() => window.location.href = '../index.html', 3000);
              }
          });
      }
  }

});
