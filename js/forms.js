/* ========================================
   Form Utilities and Enhancements
   ======================================== */

// Form Input Helpers
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.setupInputValidation();
        }
    }

    setupInputValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            isValid = false;
            errorMessage = 'שדה זה הוא חובה';
        } else if (field.type === 'email') {
            isValid = this.isValidEmail(value);
            if (!isValid) errorMessage = 'כתובת אימייל לא חוקית';
        } else if (field.type === 'tel') {
            isValid = this.isValidPhone(value);
            if (!isValid) errorMessage = 'מספר טלפון לא חוקי';
        }

        this.setFieldValidationState(field, isValid, errorMessage);
    }

    setFieldValidationState(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        
        if (!isValid) {
            formGroup.classList.add('has-error');
            // Remove existing error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Add error message
            if (errorMessage) {
                const errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                errorEl.textContent = errorMessage;
                formGroup.appendChild(errorEl);
            }
        } else {
            formGroup.classList.remove('has-error');
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation for Israeli numbers
        const phoneRegex = /^[\d\(\)\-\+\s]{9,}$/;
        return phoneRegex.test(phone);
    }
}

// Initialize Form Handler
document.addEventListener('DOMContentLoaded', function() {
    new FormHandler();
});

// Auto-format Phone Number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `${value}`;
        } else if (value.length <= 6) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
        }
    }
    
    input.value = value;
}

// Add formatting to phone input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
    phoneInput.placeholder = '050-123-4567';
}

// Inline home form
(function() {
  var homeForm = document.getElementById('homeForm');
  if (!homeForm) return;
  homeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    homeForm.innerHTML = '<p style="color:#fff;font-size:1.2rem;font-weight:700;text-align:center;padding:32px 0;">תודה! אחזור אליכם בהקדם 🙏</p>';
  });
})();
