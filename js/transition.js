/* ============================================
   PAGE TRANSITIONS

   Entry: page loads with a black overlay that fades out,
   revealing the content beneath.

   Exit: all visible content elements animate downward off
   screen, leaving the page black, then navigates.
   ============================================ */

(function () {
  'use strict';

  var overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  // ==========================================
  // ENTRANCE — fade in from black on page load
  // ==========================================
  window.addEventListener('DOMContentLoaded', function () {
    // Small delay so the page has time to render behind the overlay
    setTimeout(function () {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: function () {
          overlay.style.display = 'none';
        }
      });
    }, 100);
  });

  // ==========================================
  // EXIT — elements drop off, then navigate
  // ==========================================
  function isExternalOrAnchor(href) {
    if (!href) return true;
    if (href.startsWith('#')) return true;
    if (href.startsWith('mailto:')) return true;
    if (href.startsWith('http') && !href.includes(window.location.hostname)) return true;
    return false;
  }

  function isSamePage(href) {
    // Links like #about, #gallery etc.
    if (href.startsWith('#')) return true;
    return false;
  }

  // Intercept all internal navigation links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;
    if (isExternalOrAnchor(href)) return;
    if (link.target === '_blank') return;

    // This is an internal page navigation — animate out
    e.preventDefault();
    exitToPage(href);
  });

  function exitToPage(href) {
    document.body.classList.add('is-exiting');

    // Collect all visible content elements to animate out
    var elements = [];

    // Nav
    var nav = document.querySelector('.nav');
    if (nav) elements.push(nav);

    // All sections and their direct children that are visible
    document.querySelectorAll('section, footer').forEach(function (section) {
      var rect = section.getBoundingClientRect();
      // Only animate elements that are currently in or near the viewport
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        elements.push(section);
      }
    });

    if (elements.length === 0) {
      // Nothing to animate, just fade and go
      overlay.style.display = '';
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: function () { window.location.href = href; }
      });
      return;
    }

    // Animate all visible elements downward and fade out
    var tl = gsap.timeline({
      onComplete: function () {
        window.location.href = href;
      }
    });

    // First, quickly show the overlay fading in behind the content
    overlay.style.display = '';
    overlay.style.opacity = '0';

    tl.to(overlay, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.in'
    }, 0);

    // Simultaneously, elements drop downward and fade
    tl.to(elements, {
      y: 80,
      opacity: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power2.in'
    }, 0);
  }

})();
