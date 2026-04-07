$(document).ready(function () {

  /* ── NAVBAR SCROLL ────────────────────────────── */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('#main-nav').addClass('scrolled');
    } else {
      $('#main-nav').removeClass('scrolled');
    }
  });

  /* ── SMOOTH SCROLL ────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600);
      $('#mobile-menu').removeClass('open');
      $('#hamburger').removeClass('open');
    }
  });

  /* ── HAMBURGER ────────────────────────────────── */
  $('#hamburger').on('click', function () {
    $(this).toggleClass('open');
    $('#mobile-menu').toggleClass('open');
  });
  $('.mobile-link').on('click', function () {
    $('#mobile-menu').removeClass('open');
    $('#hamburger').removeClass('open');
  });

  /* ── INTERSECTION OBSERVER (scroll animations) ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── ANIMATED GAUGE STROKE (on scroll into view) ── */
  const $gauge = $('.gauge-ring circle:nth-child(2)');
  if ($gauge.length && 'IntersectionObserver' in window) {
    // Start with no progress
    $gauge.css({
      'stroke-dashoffset': '264.1',
      'transition': 'stroke-dashoffset 1.5s ease-out'
    });

    const gaugeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate to 98.2% (264.1 * (1 - 0.982) = ~4.7)
          $gauge.css('stroke-dashoffset', '4.7');
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    gaugeObserver.observe($gauge.closest('.built-visual')[0]);
  }

});
