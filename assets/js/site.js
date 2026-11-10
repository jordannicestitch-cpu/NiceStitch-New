document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.site-header__menu-toggle');
  var mobileNav = document.getElementById('MobileNav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
  });
});
