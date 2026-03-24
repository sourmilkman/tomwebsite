/* ============================================
   TOM MULLINER — Scroll Animations & Interactions
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ==========================================
  // NAVIGATION
  // ==========================================
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () { nav.classList.add('visible'); }, 300);
    initHeroAnimation();
    initTextSplitting();
    initScrollAnimations();
    initBrushstrokes();
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // CONTACT FORM (mailto)
  // ==========================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var message = document.getElementById('message').value;
      var subject = encodeURIComponent('Website Enquiry from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:hello@tommulliner.com?subject=' + subject + '&body=' + body;
    });
  }

  // ==========================================
  // HERO ENTRANCE ANIMATION (on page load)
  // ==========================================
  function initHeroAnimation() {
    var tl = gsap.timeline({ delay: 0.5 });

    // Monogram scales and fades in
    tl.to('.hero-monogram', {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out'
    });

    // Title characters cascade in
    tl.to('.hero h1 .char', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power3.out'
    }, '-=0.4');

    // Tagline fades up
    tl.to('.hero-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');

    // Divider line draws in
    tl.to('.hero-tagline .divider', {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.5');

    // Scroll indicator appears
    tl.to('.scroll-indicator', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2');

    // Hero brushstrokes draw in
    tl.to('.hero .brush-path', {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power1.inOut'
    }, '-=1');
  }

  // ==========================================
  // TEXT SPLITTING
  // ==========================================
  function initTextSplitting() {
    // Split hero h1 into individual characters
    var heroTitle = document.querySelector('.hero h1.split-text');
    if (heroTitle) {
      var text = heroTitle.textContent;
      heroTitle.innerHTML = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        heroTitle.appendChild(span);
      }
    }

    // Split reveal-text headings into words
    document.querySelectorAll('.reveal-text').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = '';
      words.forEach(function (word, i) {
        var wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        var inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        wordSpan.appendChild(inner);
        el.appendChild(wordSpan);
        // Add space between words
        if (i < words.length - 1) {
          var space = document.createTextNode('\u00A0');
          el.appendChild(space);
        }
      });
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS — per-element, reversible
  // ==========================================
  function initScrollAnimations() {

    // --- Reveal Text (word by word slide up) ---
    document.querySelectorAll('[data-anim="reveal-text"]').forEach(function (el) {
      var words = el.querySelectorAll('.word-inner');
      gsap.fromTo(words,
        { y: '105%' },
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // --- Fade Up (paragraphs, subtitles, etc.) ---
    document.querySelectorAll('[data-anim="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 50%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // --- Fade Up Stagger (cards, features, form fields) ---
    // Group stagger items by parent section
    var staggerGroups = {};
    document.querySelectorAll('[data-anim="fade-up-stagger"]').forEach(function (el) {
      var section = el.closest('section') || el.closest('.contact-form');
      if (!section) return;
      var id = section.id || section.className;
      if (!staggerGroups[id]) staggerGroups[id] = [];
      staggerGroups[id].push(el);
    });

    Object.keys(staggerGroups).forEach(function (key) {
      var items = staggerGroups[key];
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: items[0],
            start: 'top 88%',
            end: 'top 45%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // --- Fade + Scale (about image with parallax zoom) ---
    document.querySelectorAll('[data-anim="fade-scale"]').forEach(function (el) {
      // Fade the container in
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 30%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );

      // Parallax zoom on the inner image
      var img = el.querySelector('img');
      if (img) {
        gsap.to(img, {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    });

    // --- Scroll indicator fades out as you scroll down ---
    gsap.to('.scroll-indicator', {
      opacity: 0,
      y: -10,
      scrollTrigger: {
        trigger: '.hero',
        start: 'bottom 90%',
        end: 'bottom 60%',
        scrub: true
      }
    });
  }

  // ==========================================
  // BRUSHSTROKE ANIMATIONS — draw on scroll
  // ==========================================
  function initBrushstrokes() {
    // Animate all brush-path elements in the page (except hero ones, which animate on load)
    document.querySelectorAll('.brush-divider .brush-path, .section-brush .brush-path, .atelier-brush-left .brush-path, .atelier-brush-right .brush-path').forEach(function (path) {
      // Calculate the actual length for this path
      var length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: path.closest('.brush-divider') || path.closest('section') || path.closest('.container'),
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1
        }
      });
    });

    // Hero brushstrokes — set up their dasharray properly
    document.querySelectorAll('.hero .brush-path').forEach(function (path) {
      var length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });
  }

})();
