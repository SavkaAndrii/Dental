/* Lumina Dental Custom Vanilla JS Interactive Logic */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initFAQ();
  initBeforeAfterSlider();
  initAppointmentForm();
});

/* Header Scrolled State */
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
}

/* Mobile Side Menu & Overlay Backdrop */
function initMobileMenu() {
  const trigger = document.getElementById('menu-trigger');
  const navLinks = document.getElementById('nav-links');
  
  if (!trigger || !navLinks) return;

  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    overlay.classList.toggle('show', isOpen);
    
    // Animate hamburger icon (SVG path change or rotate)
    if (isOpen) {
      trigger.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      `;
    } else {
      trigger.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
        </svg>
      `;
    }
  };

  trigger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close menu when clicking individual link items
  const links = navLinks.querySelectorAll('a, button');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* FAQ Accordion Component */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items first
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* Before and After Image Interactive Comparer Component */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.before-after-slider');
  
  sliders.forEach(slider => {
    const overlay = slider.querySelector('.before-after-overlay');
    const handle = slider.querySelector('.slider-handle');
    
    if (!overlay || !handle) return;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let offsetX = x - rect.left;
      
      // Keep inside bounds
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      
      const percent = (offsetX / rect.width) * 100;
      overlay.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    const startDrag = () => {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: true });
    
    // Add simple click movement anywhere in slider
    slider.addEventListener('click', (e) => {
      if (e.target === handle || e.target.closest('.slider-button')) return;
      onMove(e);
    });
  });
}

/* Form Booking Validation & Feedback Modal Alerts */
function initAppointmentForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  // Create feedback modal elements
  const modal = document.createElement('div');
  modal.className = 'feedback-modal';
  modal.innerHTML = `
    <div class="feedback-content">
      <div class="feedback-icon-wrapper feedback-icon-success">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h3 style="margin-bottom: var(--space-xs); font-size: 1.5rem;">Request Received!</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: var(--space-md);">
        Thank you, <strong id="feedback-user-name">Guest</strong>! We will contact you within 2 hours to confirm your visit.
      </p>
      <button class="btn btn-primary" id="feedback-close" style="padding: 10px 24px; font-size: 0.9rem; border-radius: var(--radius-md);">
        Great
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#feedback-close');
  const userNameEl = modal.querySelector('#feedback-user-name');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch values
    const nameInput = form.querySelector('[name="fullName"]') || form.querySelector('input[type="text"]');
    const serviceSelect = form.querySelector('[name="serviceType"]') || form.querySelector('select');
    const dateInput = form.querySelector('[name="preferredDate"]') || form.querySelector('input[type="date"]');

    if (!nameInput || !nameInput.value.trim()) {
      alert('Please enter your full name');
      nameInput?.focus();
      return;
    }

    if (!dateInput || !dateInput.value) {
      alert('Please select your preferred visit date');
      dateInput?.focus();
      return;
    }

    // Populate feedback name
    userNameEl.textContent = nameInput.value.trim();

    // Show modal
    modal.classList.add('show');

    // Reset form fields beautifully
    form.reset();
  });
}
