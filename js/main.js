/* ============================================
   TOM MULLINER — Scroll Animations & Interactions
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /*
   * ANIMATION LOGIC:
   *
   * Trigger line = 80% down the viewport.
   *
   * - Scrolling DOWN: element's top crosses above the 80% line → animate IN
   * - Continue scrolling DOWN: element stays visible (nothing happens)
   * - Scrolling UP: element's top drops back below the 80% line → animate OUT (reverse)
   *
   * Implementation: we create a GSAP timeline for each animated element,
   * initially paused. ScrollTrigger's onEnter plays it, onLeaveBack reverses it.
   * onLeave and onEnterBack do nothing — so elements are stable once above the line.
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

    // PRMS credential
    tl.to('.hero-credential', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

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
  // HELPER: create a scroll-triggered animation
  // ==========================================
  function createScrollAnim(trigger, tween) {
    // tween is a paused GSAP timeline/tween
    ScrollTrigger.create({
      trigger: trigger,
      start: TRIGGER_POINT,
      onEnter: function () { tween.play(); },
      onLeaveBack: function () { tween.reverse(); }
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  function initScrollAnimations() {

    // --- Reveal Text (word by word slide up) ---
    document.querySelectorAll('[data-anim="reveal-text"]').forEach(function (el) {
      var words = el.querySelectorAll('.word-inner');
      var tween = gsap.fromTo(words,
        { y: '105%' },
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          paused: true
        }
      );
      createScrollAnim(el, tween);
    });

    // --- Fade Up (paragraphs, subtitles, notes) ---
    document.querySelectorAll('[data-anim="fade-up"]').forEach(function (el) {
      var tween = gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          paused: true
        }
      );
      createScrollAnim(el, tween);
    });

    // --- Fade Up Stagger (cards, features, form fields) ---
    var staggerGroups = {};
    document.querySelectorAll('[data-anim="fade-up-stagger"]').forEach(function (el) {
      // Group by the nearest parent section
      var section = el.closest('section') || el.closest('.highlights-section') || el.closest('.contact-form');
      if (!section) return;
      var key = section.id || section.className || Math.random();
      if (!staggerGroups[key]) staggerGroups[key] = [];
      staggerGroups[key].push(el);
    });

    Object.keys(staggerGroups).forEach(function (key) {
      var items = staggerGroups[key];
      var tween = gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          paused: true
        }
      );
      createScrollAnim(items[0], tween);
    });

    // --- Fade + Scale (about image) ---
    document.querySelectorAll('[data-anim="fade-scale"]').forEach(function (el) {
      var tween = gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          paused: true
        }
      );
      createScrollAnim(el, tween);

      // Parallax zoom on inner image (independent scrub)
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

    // --- Scroll indicator fades out as you leave hero ---
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
