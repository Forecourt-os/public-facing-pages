/* ═══════════════════════════════════════════════════════
   THEME TOGGLE — ForecourtOS
   Loaded synchronously in <head> to prevent FOUC
═══════════════════════════════════════════════════════ */

// Immediate: apply saved theme before paint (light is default)
(function () {
  var saved = localStorage.getItem('fos-theme');
  if (saved !== 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

// Toggle handler — runs after DOM ready
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var next = isLight ? 'dark' : 'light';

    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('fos-theme', next);
  });
});
