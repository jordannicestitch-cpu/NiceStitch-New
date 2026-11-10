// ---------------------------------------------------------------------------
// OUR WORK — add a job by dropping a photo into assets/img/work/ and adding an
// entry below. Newest first. Only put real Nice Stitch jobs here.
//
//   { file: 'bakery-hoodies.jpg',      // file inside assets/img/work/
//     title: 'Glendura Bakery hoodies', // what it is
//     service: 'Embroidery',            // Embroidery | DTF | UV DTF | DTG |
//                                       // Screen Printing | Banners
//     detail: '24 pieces, left chest' } // optional extra line
// ---------------------------------------------------------------------------
window.WORK = [
  // Example of the shape — delete this line and add real jobs:
  // { file: 'bakery-hoodies.jpg', title: 'Glendura Bakery hoodies', service: 'Embroidery', detail: '24 pieces, left chest' },
];

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('WorkGrid');
  var empty = document.getElementById('WorkEmpty');
  var filters = document.getElementById('WorkFilters');
  if (!grid) return;

  var items = window.WORK || [];

  if (!items.length) {
    if (empty) empty.hidden = false;
    if (filters) filters.hidden = true;
    return;
  }

  var services = [];
  items.forEach(function (it) {
    if (it.service && services.indexOf(it.service) === -1) services.push(it.service);
  });

  function render(filter) {
    grid.innerHTML = '';
    items
      .filter(function (it) { return !filter || it.service === filter; })
      .forEach(function (it, i) {
        var fig = document.createElement('figure');
        fig.className = 'work-card';
        fig.innerHTML =
          '<img src="/assets/img/work/' + it.file + '" alt="' + (it.title || 'Work sample') + '" loading="lazy">' +
          '<figcaption>' +
            (it.service ? '<span class="work-card__tag">' + it.service + '</span>' : '') +
            '<span class="work-card__title">' + (it.title || '') + '</span>' +
            (it.detail ? '<span class="work-card__detail">' + it.detail + '</span>' : '') +
          '</figcaption>';
        fig.addEventListener('click', function () { openLightbox(it); });
        grid.appendChild(fig);
      });
  }

  if (filters && services.length > 1) {
    var all = document.createElement('button');
    all.className = 'work-filter is-active';
    all.textContent = 'All';
    all.addEventListener('click', function () { setFilter(all, null); });
    filters.appendChild(all);

    services.forEach(function (s) {
      var b = document.createElement('button');
      b.className = 'work-filter';
      b.textContent = s;
      b.addEventListener('click', function () { setFilter(b, s); });
      filters.appendChild(b);
    });
  } else if (filters) {
    filters.hidden = true;
  }

  function setFilter(btn, service) {
    [].forEach.call(filters.children, function (c) { c.classList.remove('is-active'); });
    btn.classList.add('is-active');
    render(service);
  }

  // Lightbox
  var box = document.getElementById('WorkLightbox');
  var boxImg = box && box.querySelector('img');
  var boxCap = box && box.querySelector('.work-lightbox__caption');

  function openLightbox(it) {
    if (!box) return;
    boxImg.src = '/assets/img/work/' + it.file;
    boxImg.alt = it.title || 'Work sample';
    boxCap.textContent = [it.title, it.service, it.detail].filter(Boolean).join(' · ');
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!box) return;
    box.hidden = true;
    boxImg.src = '';
    document.body.style.overflow = '';
  }

  if (box) {
    box.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  render(null);
});
