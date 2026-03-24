/* ============================================
   TOM MULLINER — Gallery Page JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Navigation (shared behaviour) ---
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () { nav.classList.add('visible'); }, 300);
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
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Stock placeholder images for demo ---
  var stockImages = {
    'still-life': [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=500&h=500&fit=crop'
    ],
    'portraits': [
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&h=500&fit=crop'
    ],
    'miniatures': [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&h=500&fit=crop'
    ]
  };

  // --- All lightbox images stored globally ---
  var lightboxImages = [];
  var lightboxIndex = 0;

  // --- Load CSV and render grid ---
  function loadCategory(csvPath, gridId, categoryKey) {
    var grid = document.getElementById(gridId);

    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        var rows = results.data;
        if (!rows || rows.length === 0) return;

        rows.forEach(function (row, index) {
          // Use stock image as placeholder (cycle through available images)
          var images = stockImages[categoryKey] || stockImages['still-life'];
          var imgSrc = images[index % images.length];
          var title = (row.title || '').trim();
          var medium = (row.medium || '').trim();
          var substrate = (row.substrate || '').trim();
          var price = (row.price || '').trim();
          var sold = (row.sold || 'n').trim().toLowerCase();
          var showPrice = (row.show_price || 'y').trim().toLowerCase();
          var soldStyle = (row.sold_style || 'dot').trim().toLowerCase();

          // Build card
          var card = document.createElement('div');
          card.className = 'artwork-card';

          // Image container
          var imageDiv = document.createElement('div');
          imageDiv.className = 'artwork-card-image';

          var img = document.createElement('img');
          img.src = imgSrc;
          img.alt = title;
          img.loading = 'lazy';
          imageDiv.appendChild(img);

          // Sold banner
          if (sold === 'y' && soldStyle === 'banner') {
            var banner = document.createElement('div');
            banner.className = 'sold-banner';
            banner.textContent = 'Sold';
            imageDiv.appendChild(banner);
          }

          // Click to open lightbox
          var lbIndex = lightboxImages.length;
          lightboxImages.push({ src: imgSrc, title: title });
          imageDiv.addEventListener('click', function () {
            openLightbox(lbIndex);
          });

          card.appendChild(imageDiv);

          // Info
          var info = document.createElement('div');
          info.className = 'artwork-card-info';

          // Title row with optional sold dot
          var titleRow = document.createElement('div');
          titleRow.className = 'artwork-title-row';

          var h4 = document.createElement('h4');
          h4.textContent = title;
          titleRow.appendChild(h4);

          if (sold === 'y' && soldStyle === 'dot') {
            var dot = document.createElement('span');
            dot.className = 'sold-dot';
            dot.title = 'Sold';
            titleRow.appendChild(dot);
          }

          info.appendChild(titleRow);

          // Medium on substrate
          if (medium) {
            var mediumP = document.createElement('p');
            mediumP.className = 'artwork-medium';
            mediumP.textContent = medium + (substrate ? ' on ' + substrate : '');
            info.appendChild(mediumP);
          }

          // Price
          if (showPrice === 'y' && price) {
            var priceP = document.createElement('p');
            priceP.className = 'artwork-price';
            priceP.textContent = price;
            info.appendChild(priceP);
          }

          card.appendChild(info);
          grid.appendChild(card);
        });
      },
      error: function () {
        grid.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Gallery coming soon.</p>';
      }
    });
  }

  // --- Lightbox ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    var item = lightboxImages[lightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

  document.getElementById('lightboxPrev').addEventListener('click', function () {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });

  document.getElementById('lightboxNext').addEventListener('click', function () {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });

  // Close on background click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard nav
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightbox();
    }
  });

  // --- Load all categories ---
  loadCategory('still-life/artworks.csv', 'grid-still-life', 'still-life');
  loadCategory('portraits/artworks.csv', 'grid-portraits', 'portraits');
  loadCategory('miniatures/artworks.csv', 'grid-miniatures', 'miniatures');

  // --- Scroll to hash on load ---
  window.addEventListener('load', function () {
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function () {
          var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 400);
      }
    }
  });

})();
