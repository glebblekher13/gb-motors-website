// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const links = document.getElementById('links');
menuBtn?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
});

// Header gets a solid background once you scroll
const header = document.querySelector('.site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Fade sections in as they scroll into view
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

// Count-up numbers: <b data-count="1500">0</b>
const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const co = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.5 });
  counters.forEach(el => { el.textContent = '0'; co.observe(el); });
}

// Make picker on the quote form: ?make=bmw preselects it
const params = new URLSearchParams(location.search);
['make', 'service'].forEach(k => {
  const v = params.get(k), sel = document.querySelector(`select[name="${k}"]`);
  if (v && sel) [...sel.options].forEach(o => { if (o.value.toLowerCase() === v.toLowerCase()) sel.value = o.value; });
});
