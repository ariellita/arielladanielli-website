/* ========================================
   DDIT Innovationista — Main JavaScript
   Haus of Bold inspired: scroll-driven FX
   ======================================== */

// ---- DOM references ----
const header      = document.getElementById('header');
const menuToggle  = document.getElementById('menuToggle');
const nav         = document.getElementById('nav');
const modal       = document.getElementById('formModal');
const closeModal  = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');
const formTitle   = document.getElementById('formTitle');
const ctaButtons  = document.querySelectorAll('.cta-button');

// ---- Init ----
document.addEventListener('DOMContentLoaded', function () {
  setupMenuToggle();
  setupCtaButtons();
  setupFormModal();
  setupNavigation();
  setupScrollBehavior();
  setupScrollAnimations();
  setupParallax();
  setupScrollRotate();
});

/* ========================================
   Menu Toggle
   ======================================== */
function setupMenuToggle() {
  if (!menuToggle) return;

  menuToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ========================================
   Navigation — mark active link
   ======================================== */
function setupNavigation() {
  const navLinks   = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ========================================
   CTA Buttons — open modal
   ======================================== */
function setupCtaButtons() {
  ctaButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const action = this.getAttribute('data-action');
      openFormModal(action);
    });
  });
}

/* ========================================
   Form Modal
   ======================================== */
function setupFormModal() {
  if (!closeModal) return;

  closeModal.addEventListener('click', closeFormModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeFormModal();
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm();
    });
  }
}

function openFormModal(action) {
  const titles = {
    'book-lecture':  'הזמנת הרצאה',
    'book-workshop': 'הזמנת סדנה',
    'get-quote':     'בקשה להצעת מחיר',
  };
  if (formTitle) formTitle.textContent = titles[action] || 'יצירת קשר';

  const subjectMap = {
    'book-lecture':  'lecture',
    'book-workshop': 'workshop',
    'get-quote':     'experience',
  };
  const subjectField = document.getElementById('subject');
  if (subjectField && subjectMap[action]) {
    subjectField.value = subjectMap[action];
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 80);
}

function closeFormModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (contactForm) contactForm.reset();
}

/* ========================================
   Form Submission
   ======================================== */
function submitForm() {
  const formData = new FormData(contactForm);
  const data     = Object.fromEntries(formData);

  if (!data.fullName || !data.organization || !data.phone || !data.email || !data.subject) {
    showFormMessage('אנא מלא את כל השדות הנדרשים', 'error');
    return;
  }

  if (!isValidEmail(data.email)) {
    showFormMessage('אנא הזן כתובת אימייל חוקית', 'error');
    return;
  }

  console.log('Form submitted:', data);
  showFormMessage('תודה על הפנייה! נחזור אליך בקרוב.', 'success');
  setTimeout(closeFormModal, 2200);
}

function showFormMessage(message, type) {
  const existing = contactForm.querySelector('.form-message');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `form-message ${type}`;
  el.textContent = message;
  contactForm.insertBefore(el, contactForm.firstChild);

  if (type === 'error') {
    setTimeout(() => el.remove(), 5000);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================
   Keyboard Accessibility
   ======================================== */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeFormModal();
  }
});

/* ========================================
   Scroll — header shadow
   ======================================== */
function setupScrollBehavior() {
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ========================================
   Scroll Animations (IntersectionObserver)
   ======================================== */
function setupScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  // Immediately show above-fold elements
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

/* ========================================
   Parallax — scroll-driven translate
   Haus of Bold style: subtle depth layers
   ======================================== */
function setupParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (elCenter - viewCenter) * speed;

      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateParallax();
}

/* ========================================
   Scroll-driven rotation
   Haus of Bold style: cards tilt on scroll
   ======================================== */
function setupScrollRotate() {
  const rotateEls = document.querySelectorAll('[data-scroll-rotate]');
  if (!rotateEls.length) return;

  let ticking = false;

  function updateRotation() {
    const scrollY = window.scrollY;

    rotateEls.forEach(el => {
      const maxDeg = parseFloat(el.dataset.scrollRotate) || 1;
      const rect = el.getBoundingClientRect();
      const progress = (rect.top / window.innerHeight);
      // Map 0-1 to rotation range
      const rotation = (progress - 0.5) * maxDeg * 2;

      el.style.transform = `rotate(${rotation}deg)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateRotation);
      ticking = true;
    }
  }, { passive: true });

  updateRotation();
}

/* ========================================
   Smooth Scroll for anchor links
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
