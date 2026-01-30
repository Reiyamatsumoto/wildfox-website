// WILD FOX - Single Page Application JavaScript
// Hero Slider, Language Switching, SPA Navigation, Smooth Scroll

document.addEventListener('DOMContentLoaded', function() {
  initHeroSlider();
  initNavigation();
  initLanguageSwitcher();
  initSPANavigation();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
});

// ========================================
// HERO SLIDER - Auto-scrolling wildlife photos
// ========================================
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.slider-nav');
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  if (dotsContainer && slides.length > 1) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    const dots = dotsContainer?.querySelectorAll('.slider-dot');
    if (dots && dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    if (dots && dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlideshow() {
    if (slides.length > 1) {
      slideInterval = setInterval(nextSlide, 4000); // 4 seconds per slide
    }
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  startSlideshow();

  // Pause on hover
  slider.addEventListener('mouseenter', stopSlideshow);
  slider.addEventListener('mouseleave', startSlideshow);
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
function initNavigation() {
  const header = document.querySelector('.header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

// ========================================
// SPA NAVIGATION
// ========================================
function initSPANavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.page-section');

  // Handle nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.dataset.section;
      scrollToSection(sectionId);
      updateActiveNav(this);

      // Close mobile menu if open
      const navMenu = document.querySelector('.nav-menu');
      const mobileToggle = document.querySelector('.mobile-toggle');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle?.classList.remove('active');
      }
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', debounce(function() {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }, 100));

  // Handle hash on load
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    setTimeout(() => scrollToSection(sectionId), 100);
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
    const targetPosition = section.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update URL hash without triggering scroll
    history.pushState(null, null, `#${sectionId}`);
  }
}

function updateActiveNav(activeLink) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

// ========================================
// LANGUAGE SWITCHER
// ========================================
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  if (!langBtns.length) return;

  let currentLang = localStorage.getItem('wildfox-lang') || 'en';

  applyLanguage(currentLang);
  updateLangButtons(currentLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.dataset.lang;
      if (lang !== currentLang) {
        currentLang = lang;
        localStorage.setItem('wildfox-lang', lang);
        applyLanguage(lang);
        updateLangButtons(lang);
      }
    });
  });

  function updateLangButtons(lang) {
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }
}

function applyLanguage(lang) {
  if (typeof translations === 'undefined') return;

  const t = translations[lang];
  if (!t) return;

  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : 'en';

  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(t, key);
    if (value) el.textContent = value;
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const value = getNestedValue(t, key);
    if (value) el.placeholder = value;
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', function() {
    menu.classList.toggle('active');
    this.classList.toggle('active');
    this.setAttribute('aria-expanded', menu.classList.contains('active'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
}

// ========================================
// SCROLL ANIMATIONS - Optimized
// ========================================
function initScrollAnimations() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('animate-in');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '50px 0px 0px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.classList.add('animate-in');
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    const email = form.querySelector('input[type="email"]');
    if (email && !isValidEmail(email.value)) {
      isValid = false;
      email.classList.add('error');
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        const currentLang = localStorage.getItem('wildfox-lang') || 'en';
        let message;
        if (currentLang === 'zh-TW') {
          message = '感謝您的詢問！我們將在24-48小時內回覆您。';
        } else if (currentLang === 'ja') {
          message = 'お問い合わせありがとうございます！24〜48時間以内にご連絡いたします。';
        } else {
          message = 'Thank you for your inquiry! We will contact you within 24-48 hours.';
        }

        alert(message);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    }
  });

  // Remove error on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || this.dataset.section) return;

    e.preventDefault();
    const sectionId = href.substring(1);
    scrollToSection(sectionId);
  });
});
