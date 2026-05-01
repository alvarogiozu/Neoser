/* ============================================
   NeoSer - Main JavaScript
   GSAP, AOS, Swiper, Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- AOS Init ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // ---- Navbar Scroll ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const toggleMobile = () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobile);
  mobileOverlay.addEventListener('click', toggleMobile);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) toggleMobile();
  }));

  // ---- GSAP Animations ----
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero Swiper ----
  const heroSwiper = new Swiper('.hero-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.hero-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.hero-next',
      prevEl: '.hero-prev',
    },
    on: {
      slideChangeTransitionStart: function () {
        const activeSlide = this.slides[this.activeIndex];
        const elements = activeSlide.querySelectorAll('.hero-script, .hero-title, .hero-subtitle, .hero-ctas');
        elements.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
        });
      },
      slideChangeTransitionEnd: function () {
        const activeSlide = this.slides[this.activeIndex];
        const elements = activeSlide.querySelectorAll('.hero-script, .hero-title, .hero-subtitle, .hero-ctas');
        elements.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 150);
        });
      },
      init: function () {
        const activeSlide = this.slides[this.activeIndex];
        const elements = activeSlide.querySelectorAll('.hero-script, .hero-title, .hero-subtitle, .hero-ctas');
        elements.forEach((el, i) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 300 + i * 200);
        });
      },
    },
  });

  // Stats bar animation
  gsap.from('.hero-stats-bar .stat-item', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 1.2,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.counter);
    const prefix = counter.dataset.prefix || '';
    const suffix = counter.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            counter.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString() + suffix;
          }
        });
      }
    });
  });

  // ---- Swiper: Courses ----
  new Swiper('.courses-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: '.courses-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.courses-next',
      prevEl: '.courses-prev',
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // ---- Swiper: Testimonials ----
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // ---- Smooth scroll for nav links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
            link.style.color = '';
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});
