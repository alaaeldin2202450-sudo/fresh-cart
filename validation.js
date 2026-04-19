// js/validation.js
function validateName(value) {
  if (!value || value.trim() === '') {
    return { valid: false, message: "Name is required" };
  }
  if (value.trim().length < 3) {
    return { valid: false, message: "Name must be at least 3 characters" };
  }
  return { valid: true, message: "" };
}

function validateEmail(value) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!value || value.trim() === '') {
    return { valid: false, message: "Email is required" };
  }
  if (!re.test(String(value).toLowerCase())) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  return { valid: true, message: "" };
}

function validatePhone(value) {
  const re = /^01[0125][0-9]{8}$/;
  if (!value || value.trim() === '') {
    return { valid: false, message: "Phone number is required" };
  }
  if (!re.test(value)) {
    return { valid: false, message: "Invalid Egyptian phone number format (e.g., 010xxxxxxxx)" };
  }
  return { valid: true, message: "" };
}

function validatePassword(value) {
  if (!value || value.trim() === '') {
    return { valid: false, message: "Password is required" };
  }
  if (value.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/\d/.test(value)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  // Check for uppercase for registration but maybe keep simple here
  return { valid: true, message: "" };
}

function validatePasswordComplex(value) {
  let result = validatePassword(value);
  if(!result.valid) return result;
  
  if (!/[A-Z]/.test(value)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  return { valid: true, message: "" };
}

function validateConfirmPassword(pass, confirm) {
  if (!confirm || confirm.trim() === '') {
    return { valid: false, message: "Please confirm your password" };
  }
  if (pass !== confirm) {
    return { valid: false, message: "Passwords do not match" };
  }
  return { valid: true, message: "" };
}

function validateAddress(value) {
  if (!value || value.trim() === '') {
    return { valid: false, message: "Address is required" };
  }
  if (value.trim().length < 10) {
    return { valid: false, message: "Address must be at least 10 characters" };
  }
  return { valid: true, message: "" };
}

function validateMessage(value) {
  if (!value || value.trim() === '') {
    return { valid: false, message: "Message is required" };
  }
  if (value.trim().length < 20) {
    return { valid: false, message: "Message must be at least 20 characters" };
  }
  return { valid: true, message: "" };
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if(!input) return;
  input.classList.remove('success');
  input.classList.add('error');
  
  let errorEl = input.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('error-message')) {
    errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }
  errorEl.textContent = message;
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if(!input) return;
  input.classList.remove('error');
  input.classList.add('success');
  
  const errorEl = input.nextElementSibling;
  if (errorEl && errorEl.classList.contains('error-message')) {
    errorEl.remove();
  }
}

function clearValidationState(inputId) {
    const input = document.getElementById(inputId);
    if(!input) return;
    input.classList.remove('error', 'success');
    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains('error-message')) {
      errorEl.remove();
    }
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

window.validateName = validateName;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validatePassword = validatePassword;
window.validatePasswordComplex = validatePasswordComplex;
window.validateConfirmPassword = validateConfirmPassword;
window.validateAddress = validateAddress;
window.validateMessage = validateMessage;
window.showError = showError;
window.clearError = clearError;
window.clearValidationState = clearValidationState;
window.showToast = showToast;
