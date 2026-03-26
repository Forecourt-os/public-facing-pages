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
      scrollToTarget(target);
      $('#mobile-menu').removeClass('open');
      $('#hamburger').removeClass('open');
    }
  });

  function scrollToTarget(target) {
    $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600);
  }

  // Handle CTA buttons that scroll to waitlist
  $('.nav-cta, .btn-primary, .pricing-cta').on('click', function() {
    scrollToTarget($('#waitlist'));
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

  /* ── DASHBOARD BARS ───────────────────────────── */
  const barHeights = [38, 52, 44, 60, 48, 56, 70];
  const $barsContainer = $('#db-bars');
  if ($barsContainer.length) {
    barHeights.forEach(function (h, i) {
      const isActive = i === barHeights.length - 1;
      $barsContainer.append(
        $('<div>')
          .addClass('db-bar' + (isActive ? ' active' : ''))
          .css({ height: h + 'px', animationDelay: (i * 0.07) + 's' })
      );
    });
  }

  /* ── TICKER ───────────────────────────────────── */
  const tickerItems = [
    { label: 'STATION A · PMS', val: '18,450 L', change: '↑ 6.2%', up: true },
    { label: 'STATION B · AGO', val: '9,200 L', change: '↑ 2.1%', up: true },
    { label: 'STATION C · PMS', val: '11,800 L', change: '↓ 3.4%', up: false },
    { label: 'NETWORK · Cash O/S', val: '₦2.4M', change: '2 stations', up: false },
    { label: 'STATION A · Variance', val: '0.18L/20L', change: 'Within tolerance', up: true },
    { label: 'STATION B · Retainer', val: '₦840,000', change: 'Low balance', up: false },
    { label: 'STATION C · Report', val: 'Submitted', change: '08:42 AM', up: true },
    { label: 'DELIVERY · Shortage', val: '340 L', change: 'Flagged', up: false },
  ];

  function buildTicker(items) {
    return items.map(function (item) {
      return '<span class="ticker-item">' +
        '<span style="color:var(--muted-2)">' + item.label + '</span>' +
        '<span class="ticker-sep">·</span>' +
        '<span class="val">' + item.val + '</span>' +
        '<span class="ticker-sep">·</span>' +
        '<span class="' + (item.up ? 'up' : 'dn') + '">' + item.change + '</span>' +
        '</span>';
    }).join('<span class="ticker-item"><span class="ticker-sep">——</span></span>');
  }

  const $ticker = $('#ticker');
  if ($ticker.length) {
    const tickerHTML = buildTicker(tickerItems);
    $ticker.html(tickerHTML + tickerHTML); // Duplicate for seamless loop
  }

  /* ── PROFIT CALCULATOR ────────────────────────── */
  const BASE_NGN    = 1250000;
  const LEAKAGE_NGN = 850000;
  const ROI_BASE    = 32;
  const USD_RATE    = 1600;

  let currency   = 'NGN';
  let counters   = {};
  let initialized = false;

  function calcValues(stations) {
    const mult = currency === 'NGN' ? 1 : (1 / USD_RATE);
    return {
      savings: Math.round(stations * BASE_NGN * mult),
      leakage: Math.round(stations * LEAKAGE_NGN * mult),
      roi:     Math.round(stations * ROI_BASE)
    };
  }

  function formatNum(n) {
    return n.toLocaleString('en-NG');
  }

  function initCounters(stations) {
    const v = calcValues(stations);
    if (!initialized) {
      if (document.getElementById('metric-savings')) {
        counters.savings = new countUp.CountUp('metric-savings', v.savings, {
          duration: 1.2, separator: ',', useGrouping: true,
          formattingFn: formatNum
        });
        counters.leakage = new countUp.CountUp('metric-leakage', v.leakage, {
          duration: 1.2, separator: ',', useGrouping: true,
          formattingFn: formatNum
        });
        counters.roi = new countUp.CountUp('metric-roi', v.roi, { duration: 1.0 });
        counters.savings.start();
        counters.leakage.start();
        counters.roi.start();
        initialized = true;
      }
    } else {
      if (counters.savings) counters.savings.update(v.savings);
      if (counters.leakage) counters.leakage.update(v.leakage);
      if (counters.roi) counters.roi.update(v.roi);
    }
  }

  function setCurrency(cur) {
    currency = cur;
    $('#ngn-btn').toggleClass('active', cur === 'NGN');
    $('#usd-btn').toggleClass('active', cur === 'USD');
    const sym = cur === 'NGN' ? '₦' : '$';
    $('#sym').text(sym);
    $('.sym2').text(sym);
    const stations = parseInt($('#station-slider').val());
    initCounters(stations);
  }

  $('#ngn-btn').on('click', function() { setCurrency('NGN'); });
  $('#usd-btn').on('click', function() { setCurrency('USD'); });

  $('#station-slider').on('input', function () {
    const n = parseInt($(this).val());
    $('#station-display').text(n);
    $(this).css('background',
      'linear-gradient(to right, var(--neon) 0%, var(--neon) ' + ((n-1)/9*100) + '%, var(--border-m) ' + ((n-1)/9*100) + '%, var(--border-m) 100%)'
    );
    initCounters(n);
  });

  // Init on load
  if ($('#station-slider').length) {
    initCounters(1);
    // Init slider background
    $('#station-slider').css('background',
      'linear-gradient(to right, var(--neon) 0%, var(--neon) 0%, var(--border-m) 0%, var(--border-m) 100%)'
    );
  }

  /* ── WAITLIST FORM ────────────────────────────── */
  $('#waitlist-form').on('submit', function (e) {
    e.preventDefault();
    // TODO: replace with actual API POST endpoint
    $(this).fadeOut(300, function () {
      $('#form-success').fadeIn(400);
    });
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

});
