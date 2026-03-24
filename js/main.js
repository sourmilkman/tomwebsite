/* ============================================
   TOM MULLINER — Scroll Animations & Interactions
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /*
   * SCROLL ANIMATION LOGIC:
   *
   * There is an imaginary trigger line at 80% down the viewport.
   * - When an element's top crosses ABOVE that line (scrolling down), it animates IN.
   * - Once above the line, it stays visible — even if you keep scrolling down.
   * - If you scroll back UP and the element's top drops BELOW that line, it animates OUT.
   *
   * This is achieved with:
   *   toggleActions: 'play none none reverse'
   *   start: 'top 80%'
   *   (no end — the trigger is a single threshold)
   *
   * 'play none none reverse' means:
   *   onEnter: play | onLeave: none | onEnterBack: none | onLeaveBack: reverse
   */

  var TRIGGER_POINT = 'top 80%';

  // ==========================================
  // NAVIGATION
  // ==========================================
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () { nav.classList.add('visible'); }, 300);
    initTextSplitting();
    initHeroAnimation();
    initScrollAnimations();
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
  // TEXT SPLITTING (must run before animations)
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
        if (i < words.length - 1) {
          el.appendChild(document.createTextNode('\u00A0'));
        }
      });
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
  }

  // ==========================================
  // SCROLL ANIMATIONS
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
            start: TRIGGER_POINT,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // --- Fade Up (paragraphs, subtitles, notes, etc.) ---
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
            start: TRIGGER_POINT,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // --- Fade Up Stagger (cards, features, form fields) ---
    // Group by parent section so they stagger together
    var staggerGroups = {};
    document.querySelectorAll('[data-anim="fade-up-stagger"]').forEach(function (el) {
      var parent = el.closest('section') || el.closest('.contact-form');
      if (!parent) return;
      var key = parent.id || parent.className;
      if (!staggerGroups[key]) staggerGroups[key] = [];
      staggerGroups[key].push(el);
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
            start: TRIGGER_POINT,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // --- Fade + Scale (about image) ---
    document.querySelectorAll('[data-anim="fade-scale"]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: TRIGGER_POINT,
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Parallax zoom on the inner image (scrub-based, independent)
      var img = el.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
      }
    });

    // --- Scroll indicator fades out as you scroll past hero ---
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

})();
