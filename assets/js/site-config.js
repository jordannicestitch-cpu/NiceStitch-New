// Single place to edit shop info shown across the site (top bar, header, footer, contact page).
// Change values here — every page picks them up automatically via data-site="..." hooks.
window.SITE_CONFIG = {
  name: 'Nice Stitch',
  phone: '(951) 775-6492',
  email: '', // public contact email shown to visitors (separate from the quote-notification inbox)
  addressLines: ['1301 S Main St, Unit 103', 'Los Angeles, CA 90015'],
  hours: ['Mon–Fri: 9am–6pm'],
  // Short selling points shown in the top bar. Keep these to things that are actually true.
  trustPoints: ['Fast Turnaround', 'No Minimums on DTG & DTF', 'Wholesale & Retail'],
  instagram: '',
  facebook: ''
};

document.addEventListener('DOMContentLoaded', function () {
  var cfg = window.SITE_CONFIG;

  // Hides the labelled wrapper (icon + text) when present, otherwise just the element.
  function hide(el) {
    var wrap = el.closest('[data-site-wrap]');
    (wrap || el).hidden = true;
  }

  function each(key, fn) {
    document.querySelectorAll('[data-site="' + key + '"]').forEach(fn);
  }

  each('name', function (el) {
    el.textContent = cfg.name;
  });

  each('phone', function (el) {
    if (!cfg.phone) { hide(el); return; }
    el.textContent = cfg.phone;
    if (el.tagName === 'A') el.href = 'tel:' + cfg.phone.replace(/[^\d+]/g, '');
  });

  each('email', function (el) {
    if (!cfg.email) { hide(el); return; }
    el.textContent = cfg.email;
    if (el.tagName === 'A') el.href = 'mailto:' + cfg.email;
  });

  each('address', function (el) {
    el.innerHTML = cfg.addressLines.map(function (line) { return '<p>' + line + '</p>'; }).join('');
  });

  each('hours', function (el) {
    el.innerHTML = cfg.hours.map(function (line) { return '<p>' + line + '</p>'; }).join('');
  });

  // Single-line variants for the top utility bar.
  each('address-inline', function (el) {
    if (!cfg.addressLines.length) { hide(el); return; }
    el.textContent = cfg.addressLines.join(', ');
  });

  each('hours-inline', function (el) {
    if (!cfg.hours.length) { hide(el); return; }
    el.textContent = cfg.hours.join(' · ');
  });

  each('trust', function (el) {
    if (!cfg.trustPoints || !cfg.trustPoints.length) { hide(el); return; }
    el.textContent = cfg.trustPoints.join('  ·  ');
  });

  each('instagram', function (el) {
    if (!cfg.instagram) return;
    el.href = cfg.instagram;
    el.hidden = false;
  });

  each('facebook', function (el) {
    if (!cfg.facebook) return;
    el.href = cfg.facebook;
    el.hidden = false;
  });

  each('year', function (el) {
    el.textContent = new Date().getFullYear();
  });
});
