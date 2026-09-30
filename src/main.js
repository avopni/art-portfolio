import { artworks } from './artworks.js';
import './style.css';

const app = document.querySelector('#app');
const isCollection = location.pathname.endsWith('/collection.html');
const instagram = 'https://www.instagram.com/meghanvopni/';
let activeFilter = 'All';
let activeImage = null;
let menuOpen = false;
let returnFocus = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function artDetails(art) {
  return [art.title, art.dimensions, art.medium || art.category, art.availability].filter(Boolean).map(escapeHtml).join(', ');
}

function artCard(art, index) {
  return `<figure class="art-card"><button class="art-image" type="button" data-art="${art.id}" aria-label="View ${escapeHtml(art.title)}"><img src="${art.image}" alt="${escapeHtml(art.alt)}" loading="${index < 3 ? 'eager' : 'lazy'}" /></button><figcaption class="art-caption">${artDetails(art)}</figcaption></figure>`;
}

function gallery() {
  const art = isCollection ? artworks.filter(art => activeFilter === 'All' || art.category === activeFilter) : [artworks[1], artworks[4]];
  const heading = isCollection ? 'h1' : 'h2';
  return `<section class="gallery-section ${isCollection ? 'collection-gallery' : 'selected-gallery'}" id="work" aria-labelledby="work-heading">
    <div class="section-head"><div><span class="eyebrow">Selected work of Meghan Vopni</span><${heading} id="work-heading">The Collection</${heading}></div>${isCollection ? `<span class="work-count" aria-live="polite">${art.length} ${art.length === 1 ? 'piece' : 'pieces'}</span>` : ''}</div>
    ${isCollection ? `<div class="filters" role="group" aria-label="Filter artwork">${['All', 'Detail', 'Canvas', 'Framed'].map(filter => `<button type="button" class="filter ${activeFilter === filter ? 'is-active' : ''}" data-filter="${filter}" aria-pressed="${activeFilter === filter}">${filter}</button>`).join('')}</div>` : ''}
    <div class="gallery-grid">${art.map(artCard).join('')}</div>
    ${isCollection ? '' : '<div class="view-all"><a class="text-link" href="./collection.html">View All <span aria-hidden="true">↗</span></a></div>'}
  </section>`;
}

function intro() {
  return `<section class="hero hero-salon"><div class="salon-hero-copy"><span class="eyebrow">The art of Meghan Vopni</span><h1>A space<br/>to <em>see.</em></h1><p>An evolving collection of art and ideas.<br/>Take your time looking around.</p></div><div class="salon-hero-art"><div class="hero-frame"><img src="${artworks[4].image}" alt="${escapeHtml(artworks[4].alt)}" /></div></div></section>`;
}

function about() {
  return `<section class="about-section" id="about"><div class="about-label"><span class="eyebrow">A note from the studio</span></div><div class="about-content"><h2>Art is an invitation<br/>to <em>look again.</em></h2><p>Soft colour, layered marks, and room for the eye to wander. This portfolio gathers Meghan’s work in one place and lets each piece have space to breathe. An artist statement can be added here in Meghan’s own words.</p></div></section>`;
}

function contact() {
  return `<section class="contact-section" id="contact"><span class="eyebrow">Keep in touch</span><h2>Let’s connect<span class="section-period">.</span></h2><p>For artwork inquiries or a conversation, find me on Instagram.</p><a class="contact-button" href="${instagram}" target="_blank" rel="noopener noreferrer">Visit @meghanvopni <span>↗</span></a></section>`;
}

function lightbox() {
  const art = artworks.find(item => item.id === activeImage);
  if (!art) return '';
  return `<div class="lightbox" role="dialog" aria-modal="true" aria-label="${escapeHtml(art.title)}"><button type="button" class="lightbox-backdrop" data-close aria-label="Close artwork" tabindex="-1"></button><div class="lightbox-panel"><button class="lightbox-close" data-close type="button" aria-label="Close artwork">×</button><div class="lightbox-image"><img src="${art.image}" alt="${escapeHtml(art.alt)}" /></div><div class="lightbox-detail"><span class="eyebrow">Meghan Vopni / artwork</span><h2>${escapeHtml(art.title)}</h2><p>${artDetails(art)}</p><div class="lightbox-controls"><button type="button" data-step="-1" aria-label="Previous artwork">←</button><span>${String(artworks.indexOf(art) + 1).padStart(2, '0')} / ${artworks.length}</span><button type="button" data-step="1" aria-label="Next artwork">→</button></div></div></div></div>`;
}

function render() {
  document.body.className = `theme-salon${activeImage ? ' modal-open' : ''}`;
  document.title = isCollection ? 'The Collection — Meghan Vopni' : 'Meghan Vopni — Art Portfolio';
  app.innerHTML = `<div class="site-shell"><header class="site-header"><a class="brand" href="./" aria-label="Meghan Vopni, home">Meghan Vopni</a><button class="menu-toggle" type="button" data-menu aria-label="Toggle navigation" aria-expanded="${menuOpen}">Menu <span>${menuOpen ? '×' : '+'}</span></button><nav class="site-nav ${menuOpen ? 'is-open' : ''}" aria-label="Main navigation"><a href="./collection.html" ${isCollection ? 'aria-current="page"' : ''}>The Collection</a><a href="${isCollection ? './' : ''}#about">About</a><a href="${isCollection ? './' : ''}#contact">Contact</a><a class="instagram-link" href="${instagram}" target="_blank" rel="noopener noreferrer" aria-label="Meghan Vopni on Instagram"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a></nav></header><main id="top">${isCollection ? gallery() : intro() + gallery() + about() + contact()}</main><footer class="site-footer"><span>© ${new Date().getFullYear()} Meghan Vopni</span><span>Made to be looked at slowly.</span><a href="#top">Back to top ↑</a></footer></div>${lightbox()}`;
  if (activeImage) app.querySelector('.lightbox-close')?.focus();
}

function closeImage() {
  activeImage = null;
  render();
  app.querySelector(`[data-art="${returnFocus}"]`)?.focus({ preventScroll: true });
}

function stepImage(step) {
  const index = artworks.findIndex(art => art.id === activeImage);
  activeImage = artworks[(index + step + artworks.length) % artworks.length].id;
  render();
}

app.addEventListener('click', event => {
  const filter = event.target.closest('[data-filter]');
  if (filter) { activeFilter = filter.dataset.filter; render(); app.querySelector(`[data-filter="${activeFilter}"]`)?.focus({ preventScroll: true }); return; }
  const art = event.target.closest('[data-art]');
  if (art) { activeImage = art.dataset.art; returnFocus = activeImage; render(); return; }
  if (event.target.closest('[data-close]')) return closeImage();
  const step = event.target.closest('[data-step]');
  if (step) return stepImage(Number(step.dataset.step));
  if (event.target.closest('[data-menu]')) { menuOpen = !menuOpen; render(); app.querySelector('[data-menu]')?.focus(); return; }
  if (event.target.closest('.site-nav a')) { menuOpen = false; app.querySelector('.site-nav')?.classList.remove('is-open'); app.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false'); }
});

document.addEventListener('keydown', event => {
  if (!activeImage) return;
  if (event.key === 'Escape') closeImage();
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') stepImage(event.key === 'ArrowRight' ? 1 : -1);
  if (event.key === 'Tab') {
    const controls = [...app.querySelectorAll('.lightbox-panel button')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

render();
