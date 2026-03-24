/* ============================================
   TOM MULLINER — Scroll Animations & Interactions
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /*
   * ANIMATION LOGIC:
   *
   * Each element's animation is SCRUBBED to scroll position between
   * two points: start (top 80%) and end (top 50%).
   *
   * - Below start: element is fully hidden (progress 0)
   * - Between start and end: animation is tied 1:1 to scroll
   * - Above end: element is fully visible (progress 1), stays put
   * - Scroll back up through end → start: animation reverses at
   *   EXACTLY the same rate it played forward
   *
   * scrub: 0.6 adds a tiny bit of smoothing so it feels elegant
   * rather than jerky, but it tracks scroll position faithfully.
   */

  var ANIM_START = 'top 80%';
  var ANIM_END = 'top 50%';
  var SCRUB_SMOOTHING = 0.6;

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
      window.location.href = 'mailto:info@tommulliner.com?subject=' + subject + '&body=' + body;
    });
  }

  // ==========================================
  // TEXT SPLITTING (must run before animations)
  // ==========================================
  function initTextSplitting() {
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
  // HERO ENTRANCE ANIMATION (on page load, not scroll-based)
  // ==========================================
  function initHeroAnimation() {
    var tl = gsap.timeline({ delay: 0.5 });

    tl.to('.hero-monogram', {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out'
    });

    tl.to('.hero h1 .char', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power3.out'
    }, '-=0.4');

    tl.to('.hero-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');

    tl.to('.hero-tagline .divider', {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.5');

    tl.to('.scroll-indicator', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2');
  }

  // ==========================================
  // SCROLL ANIMATIONS — all scrub-based
  // ==========================================
  function initScrollAnimations() {

    // --- Reveal Text (word by word slide up) ---
    document.querySelectorAll('[data-anim="reveal-text"]').forEach(function (el) {
      var words = el.querySelectorAll('.word-inner');
      gsap.fromTo(words,
        { y: '105%' },
        {
          y: '0%',
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: ANIM_START,
            end: ANIM_END,
            scrub: SCRUB_SMOOTHING
          }
        }
      );
    });

    // --- Fade Up (paragraphs, subtitles, notes) ---
    document.querySelectorAll('[data-anim="fade-up"]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: ANIM_START,
            end: ANIM_END,
            scrub: SCRUB_SMOOTHING
          }
        }
      );
    });

    // --- Fade Up Stagger (cards, features, form fields) ---
    var staggerGroups = {};
    document.querySelectorAll('[data-anim="fade-up-stagger"]').forEach(function (el) {
      var section = el.closest('section') || el.closest('.highlights-section') || el.closest('.contact-form');
      if (!section) return;
      var key = section.id || section.className || Math.random();
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
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: items[0],
            start: ANIM_START,
            end: ANIM_END,
            scrub: SCRUB_SMOOTHING
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
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: ANIM_START,
            end: ANIM_END,
            scrub: SCRUB_SMOOTHING
          }
        }
      );

      // Parallax zoom on inner image (longer scrub range)
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

    // --- Scroll indicator fades out ---
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
