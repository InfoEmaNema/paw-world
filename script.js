const header = document.querySelector('.topbar');
const menuButton = document.querySelector('.menu-toggle');

function closeMenu() {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  header.classList.toggle('menu-open', !open);
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
});
header.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const revealItems = document.querySelectorAll('.section-label, .discover-heading, .profile, .care-heading, .care-image, .care-topics, .adoption-copy, .adoptables-heading, .adoption-toolbar, .adopt-card, .stories-top, .story-row');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => { item.classList.add('reveal'); observer.observe(item); });
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const heroFrame = document.querySelector('.hero-frame');
const heroPhoto = heroFrame.querySelector('img');
const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)');
const progressBar = document.querySelector('.scroll-progress span');

if (!motionOff.matches && window.matchMedia('(pointer: fine)').matches) {
  heroFrame.addEventListener('pointermove', event => {
    const bounds = heroFrame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroPhoto.style.transform = `translate3d(${-x * 12}px, ${-y * 12}px, 0) scale(1.055)`;
  });
  heroFrame.addEventListener('pointerleave', () => { heroPhoto.style.transform = ''; });
}

let scrollPending = false;
if (!motionOff.matches) {
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY * 0.025, 24);
      const available = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
      if (window.scrollY < window.innerHeight) heroPhoto.style.translate = `0 ${shift}px`;
      scrollPending = false;
    });
  }, { passive: true });
}

if (!motionOff.matches && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.profile-photo, .care-image').forEach(frame => {
    const image = frame.querySelector('img');
    frame.addEventListener('pointermove', event => {
      const bounds = frame.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      frame.style.setProperty('--pointer-x', `${x * 100}%`);
      frame.style.setProperty('--pointer-y', `${y * 100}%`);
      image.style.transform = `translate3d(${(0.5 - x) * 9}px, ${(0.5 - y) * 9}px, 0) scale(1.045)`;
    });
    frame.addEventListener('pointerleave', () => {
      image.style.transform = '';
      frame.style.removeProperty('--pointer-x');
      frame.style.removeProperty('--pointer-y');
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const adoptableCards = document.querySelectorAll('.adopt-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  adoptableCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.species !== filter; });
}));
