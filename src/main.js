import { artworks } from './artworks.js';
import './style.css';

const themes = [
  { id: 'salon', name: 'The Salon', note: 'Quiet, spacious, gallery walls' },
  { id: 'wall', name: 'Gallery Wall', note: 'Formal, open, exhibition-like' },
  { id: 'collector', name: 'The Collector', note: 'A refined catalogue' },
  { id: 'soft', name: 'Soft Focus', note: 'Airy, gentle, intimate' },
  { id: 'fold', name: 'The Fold', note: 'An editorial gallery' },
  { id: 'index', name: 'The Index', note: 'An editorial archive' },
  { id: 'nocturne', name: 'Nocturne', note: 'A focused dark room' },
  { id: 'atelier', name: 'The Atelier', note: 'Warm, collected, tactile' },
  { id: 'spectrum', name: 'Spectrum', note: 'Bright, modular, playful' }
];

const app = document.querySelector('#app');
let activeTheme = getTheme();
let activeFilter = 'All';
let activeImage = null;
let menuOpen = false;

function getTheme() {
  const fromUrl = new URLSearchParams(location.search).get('theme');
  return themes.some(theme => theme.id === fromUrl) ? fromUrl : 'salon';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function artCard(art, index) {
  return `<button class="art-card art-card--${index + 1}" type="button" data-art="${art.id}" aria-label="View ${escapeHtml(art.title)}">
    <span class="art-image"><img src="${art.image}" alt="${escapeHtml(art.alt)}" loading="${index < 3 ? 'eager' : 'lazy'}" /></span>
    <span class="art-caption"><span><strong>${escapeHtml(art.title)}</strong><small>${escapeHtml(art.category)}</small></span><span class="art-arrow" aria-hidden="true">↗</span></span>
  </button>`;
}

function filteredArt() {
  return activeFilter === 'All' ? artworks : artworks.filter(art => art.category === activeFilter);
}

function filterBar() {
  return `<div class="filters" role="group" aria-label="Filter artwork">${['All', ...new Set(artworks.map(art => art.category))].map(filter => `<button type="button" class="filter ${activeFilter === filter ? 'is-active' : ''}" data-filter="${escapeHtml(filter)}" aria-pressed="${activeFilter === filter}">${escapeHtml(filter)}</button>`).join('')}</div>`;
}

function gallery() {
  const art = filteredArt();
  return `<section class="gallery-section" id="work" aria-labelledby="work-heading">
    <div class="section-head"><div><span class="eyebrow">Selected work / Meghan Vopni</span><h2 id="work-heading">The collection<span class="section-period">.</span></h2></div><span class="work-count">${String(art.length).padStart(2, '0')} pieces</span></div>
    ${filterBar()}
    <div class="gallery-grid">${art.map(artCard).join('')}</div>
  </section>`;
}

function intro() {
  if (activeTheme === 'wall') return `<section class="hero hero-wall"><div class="wall-title"><span class="eyebrow">Meghan Vopni / selected work</span><h1>The art of<br/><em>looking closer.</em></h1><p>A quiet room for colour, texture, and discovery.</p><a href="#work" class="text-link">Explore the exhibition <span>↗</span></a></div><div class="wall-triptych"><div class="wall-piece wall-piece-one"><img src="${artworks[1].image}" alt="${escapeHtml(artworks[1].alt)}" /></div><div class="wall-piece wall-piece-two"><img src="${artworks[4].image}" alt="${escapeHtml(artworks[4].alt)}" /></div><div class="wall-piece wall-piece-three"><img src="${artworks[3].image}" alt="${escapeHtml(artworks[3].alt)}" /></div></div><span class="wall-footnote">An evolving exhibition of work by Meghan Vopni</span></section>`;
  if (activeTheme === 'collector') return `<section class="hero hero-collector"><div class="collector-side"><span class="eyebrow">An artist’s portfolio</span><span class="collector-number">01 — 07</span></div><div class="collector-main"><h1>Collected<br/><em>moments.</em></h1><p>Paintings to return to, gathered in one place.</p><a href="#work" class="text-link">Browse the collection <span>↗</span></a></div><div class="collector-art"><img src="${artworks[4].image}" alt="${escapeHtml(artworks[4].alt)}" /><span>Meghan Vopni / artwork 05</span></div></section>`;
  if (activeTheme === 'soft') return `<section class="hero hero-soft"><div class="soft-art"><img src="${artworks[0].image}" alt="${escapeHtml(artworks[0].alt)}" /><span>01 / 07 — artwork detail</span></div><div class="soft-copy"><span class="eyebrow">The work of Meghan Vopni</span><h1>Made to<br/><em>linger.</em></h1><p>Soft colour and small gestures, given room to speak for themselves.</p><a href="#work" class="text-link">See the work <span>↗</span></a></div><span class="soft-asterisk" aria-hidden="true">✳</span></section>`;
  if (activeTheme === 'fold') return `<section class="hero hero-fold"><div class="fold-copy"><span class="eyebrow">Meghan Vopni / art portfolio</span><h1>Where<br/>colour <em>rests.</em></h1><div class="fold-intro"><p>An evolving gallery of paintings, marks, and moments.</p><a href="#work" class="text-link">Enter the gallery <span>↗</span></a></div></div><div class="fold-art"><img class="fold-back" src="${artworks[2].image}" alt="${escapeHtml(artworks[2].alt)}" /><img class="fold-front" src="${artworks[1].image}" alt="${escapeHtml(artworks[1].alt)}" /><span>Selected works / 01—07</span></div></section>`;
  if (activeTheme === 'index') return `<section class="hero hero-index"><div class="hero-kicker">Art portfolio / selected work</div><h1>Meghan<br/>Vopni<span class="hero-dot">.</span></h1><div class="hero-bottom"><p>An evolving collection of art, exploration, and the spaces in between.</p><a href="#work" class="text-link">Explore the index <span>↗</span></a></div></section>`;
  if (activeTheme === 'nocturne') return `<section class="hero hero-nocturne"><div class="hero-main"><span class="eyebrow">An artist’s portfolio</span><h1>Art to<br/><em>stay with.</em></h1><p>A collection of moments, colours, and ideas by Meghan Vopni.</p><a href="#work" class="pill-link">Enter the gallery <span>↗</span></a></div><div class="hero-art"><img src="${artworks[2].image}" alt="${escapeHtml(artworks[2].alt)}" /><span>Featured work / 03</span></div></section>`;
  if (activeTheme === 'atelier') return `<section class="hero hero-atelier"><div class="atelier-tag">A little space for looking closer</div><div class="atelier-hero-copy"><span class="eyebrow">The collected work of</span><h1>Meghan<br/><i>Vopni</i><span class="hero-dot">.</span></h1><p>A growing body of art, gathered here to explore at your own pace.</p><a href="#work" class="text-link">Wander through the work <span>↘</span></a></div><div class="atelier-stack"><img class="stack-one" src="${artworks[6].image}" alt="${escapeHtml(artworks[6].alt)}" /><img class="stack-two" src="${artworks[2].image}" alt="${escapeHtml(artworks[2].alt)}" /><span class="stack-note">An open studio<br/>of ideas ↗</span></div></section>`;
  if (activeTheme === 'spectrum') return `<section class="hero hero-spectrum"><div class="spectrum-orbit" aria-hidden="true">✳</div><div class="spectrum-title"><span class="eyebrow">Art portfolio / Meghan Vopni</span><h1>Room to<br/><em>feel</em> things<span class="hero-dot">.</span></h1><p>A place for colour, curiosity, and the art that happens between them.</p><a href="#work" class="pill-link">Explore the work <span>↗</span></a></div><div class="spectrum-feature"><img src="${artworks[4].image}" alt="${escapeHtml(artworks[4].alt)}" /><span>Featured work / 05</span></div></section>`;
  return `<section class="hero hero-salon"><div class="salon-hero-copy"><span class="eyebrow">The art of Meghan Vopni</span><h1>A space<br/>to <em>see.</em></h1><p>An evolving collection of art and ideas.<br/>Take your time looking around.</p><a href="#work" class="text-link">View the collection <span>↗</span></a></div><div class="salon-hero-art"><div class="hero-frame"><img src="${artworks[4].image}" alt="${escapeHtml(artworks[4].alt)}" /></div><div class="hero-art-label"><span>Featured work</span><span>05 / 07</span></div></div><span class="salon-vertical">MEGHAN VOPNI · PORTFOLIO</span></section>`;
}

function about() {
  return `<section class="about-section" id="about"><div class="about-label"><span class="eyebrow">A note from the studio</span><span class="about-flower" aria-hidden="true">✳</span></div><div class="about-content"><h2>Art is an invitation<br/>to <em>look again.</em></h2><p>Soft colour, layered marks, and room for the eye to wander. This portfolio gathers Meghan’s work in one place and lets each piece have space to breathe. An artist statement can be added here in Meghan’s own words.</p><a class="text-link" href="https://www.instagram.com/meghanvopni/" target="_blank" rel="noopener noreferrer">Follow along on Instagram <span>↗</span></a></div></section>`;
}

function contact() {
  return `<section class="contact-section" id="contact"><span class="eyebrow">Keep in touch</span><h2>Let’s connect<span class="section-period">.</span></h2><p>For artwork inquiries or a conversation, find me on Instagram.</p><a class="contact-button" href="https://www.instagram.com/meghanvopni/" target="_blank" rel="noopener noreferrer">Visit @meghanvopni <span>↗</span></a></section>`;
}

function lightbox() {
  const art = artworks.find(item => item.id === activeImage);
  if (!art) return '';
  return `<div class="lightbox" role="dialog" aria-modal="true" aria-label="${escapeHtml(art.title)}"><button type="button" class="lightbox-backdrop" data-close aria-label="Close artwork"></button><div class="lightbox-panel"><button class="lightbox-close" data-close type="button" aria-label="Close artwork">×</button><div class="lightbox-image"><img src="${art.image}" alt="${escapeHtml(art.alt)}" /></div><div class="lightbox-detail"><span class="eyebrow">Meghan Vopni / artwork</span><h2>${escapeHtml(art.title)}</h2><p>${escapeHtml(art.category)} photograph · title pending</p><div class="lightbox-controls"><button type="button" data-step="-1" aria-label="Previous artwork">←</button><span>${String(artworks.indexOf(art) + 1).padStart(2, '0')} / ${String(artworks.length).padStart(2, '0')}</span><button type="button" data-step="1" aria-label="Next artwork">→</button></div></div></div></div>`;
}

function render() {
  const current = themes.find(theme => theme.id === activeTheme);
  document.body.className = `theme-${activeTheme}${activeImage ? ' modal-open' : ''}`;
  document.querySelector('meta[name="theme-color"]').content = ({ salon: '#f3f0e9', wall: '#f4f1eb', collector: '#eeeae2', soft: '#f5eee9', fold: '#eee9df', index: '#f7f7f4', nocturne: '#171916', atelier: '#eee9df', spectrum: '#ebe7f6' })[activeTheme];
  app.innerHTML = `<div class="preview-bar"><div class="preview-label"><span class="preview-spark">✳</span><span>Salon studies <small>Five gallery directions</small></span></div><div class="theme-tabs" role="group" aria-label="Choose a gallery direction">${themes.slice(0, 5).map((theme, index) => `<button type="button" data-theme="${theme.id}" class="theme-tab ${activeTheme === theme.id ? 'is-active' : ''}" aria-pressed="${activeTheme === theme.id}" title="${theme.note}"><span>${String(index + 1).padStart(2, '0')}</span> ${theme.name}</button>`).join('')}</div><details class="earlier-themes"><summary>Earlier studies</summary><div>${themes.slice(5).map(theme => `<button type="button" data-theme="${theme.id}" class="theme-tab ${activeTheme === theme.id ? 'is-active' : ''}" aria-pressed="${activeTheme === theme.id}">${theme.name}</button>`).join('')}</div></details><div class="preview-number">${String(themes.indexOf(current) + 1).padStart(2, '0')} / 09</div></div>
    <div class="site-shell"><header class="site-header"><a class="brand" href="#top" aria-label="Meghan Vopni, back to top">Meghan Vopni<span class="brand-mark">✳</span></a><button class="menu-toggle" type="button" data-menu aria-label="Toggle navigation" aria-expanded="${menuOpen}">Menu <span>${menuOpen ? '×' : '+'}</span></button><nav class="site-nav ${menuOpen ? 'is-open' : ''}" aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a><a class="instagram-link" href="https://www.instagram.com/meghanvopni/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></nav></header><main id="top">${intro()}${gallery()}${about()}${contact()}</main><footer class="site-footer"><span>© ${new Date().getFullYear()} Meghan Vopni</span><span>Made to be looked at slowly.</span><a href="#top">Back to top ↑</a></footer></div><div class="sample-banner"><strong>Preview note</strong><span>Artwork photos are from Meghan’s shared folder. Titles and artist statement are temporary.</span><button type="button" data-dismiss-note aria-label="Dismiss preview note">×</button></div>${lightbox()}`;
  if (sessionStorage.getItem('dismissed-note') === 'yes') app.querySelector('.sample-banner').remove();
  if (activeImage) app.querySelector('.lightbox-close')?.focus();
}

function changeTheme(theme) {
  if (!themes.some(item => item.id === theme)) return;
  activeTheme = theme;
  activeFilter = 'All';
  activeImage = null;
  menuOpen = false;
  const url = new URL(location.href);
  url.searchParams.set('theme', theme);
  url.hash = '';
  history.pushState({ theme }, '', url);
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

app.addEventListener('click', event => {
  const themeButton = event.target.closest('[data-theme]');
  if (themeButton) return changeTheme(themeButton.dataset.theme);
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) { activeFilter = filterButton.dataset.filter; render(); document.querySelector('#work')?.scrollIntoView({ block: 'start' }); return; }
  const artButton = event.target.closest('[data-art]');
  if (artButton) { activeImage = artButton.dataset.art; render(); return; }
  if (event.target.closest('[data-close]')) { activeImage = null; render(); return; }
  const stepButton = event.target.closest('[data-step]');
  if (stepButton) { const index = artworks.findIndex(art => art.id === activeImage); activeImage = artworks[(index + Number(stepButton.dataset.step) + artworks.length) % artworks.length].id; render(); return; }
  if (event.target.closest('[data-menu]')) { menuOpen = !menuOpen; render(); return; }
  if (event.target.closest('.site-nav a')) { menuOpen = false; app.querySelector('.site-nav')?.classList.remove('is-open'); app.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false'); return; }
  if (event.target.closest('[data-dismiss-note]')) { sessionStorage.setItem('dismissed-note', 'yes'); app.querySelector('.sample-banner')?.remove(); }
});

document.addEventListener('keydown', event => {
  if (!activeImage) return;
  if (event.key === 'Escape') { activeImage = null; render(); }
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { const index = artworks.findIndex(art => art.id === activeImage); activeImage = artworks[(index + (event.key === 'ArrowRight' ? 1 : -1) + artworks.length) % artworks.length].id; render(); }
});

window.addEventListener('popstate', () => { activeTheme = getTheme(); activeImage = null; render(); });
render();
