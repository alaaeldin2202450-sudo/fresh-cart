// js/cart.js
const CART_KEY = "grocery_cart";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  if (window.updateCartBadge) {
    window.updateCartBadge();
  }
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = window.products.find(p => p.id === parseInt(productId));
  
  if (!product) return false;

  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
  if(window.showToast) {
    window.showToast('Added to cart successfully!', 'success');
  }
  return true;
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== parseInt(productId));
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  if (quantity < 1) return;
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === parseInt(productId));
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity = parseInt(quantity);
    saveCart(cart);
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  saveCart([]);
}

window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.clearCart = clearCart;
