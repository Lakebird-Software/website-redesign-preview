import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initOceanTerrain } from './ocean-terrain';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Theme preference */
function applyTheme(theme: 'dark' | 'light') {
  root.dataset.theme = theme;
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = `Switch to ${nextTheme} theme`;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(theme === 'light'));
    const hiddenLabel = button.querySelector<HTMLElement>('[data-theme-label]');
    if (hiddenLabel) hiddenLabel.textContent = label;
  });
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === 'light' ? '#F4F6FB' : '#023047';
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('lakebird-theme', nextTheme); } catch { /* Storage is optional. */ }
  });
});
applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

/* Mobile navigation */
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]');
function closeMenu() {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  mobileNav.classList.remove('is-open');
  mobileNav.inert = true;
}
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Close navigation menu');
      mobileNav.inert = false;
      mobileNav.classList.add('is-open');
    }
  });
  mobileNav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
}

/* Header and section-aware navigation */
const header = document.querySelector<HTMLElement>('[data-site-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
updateHeader();

window.addEventListener('scroll', updateHeader, { passive: true });

/* Uniformly scale the CSS-built phone-screen placeholders to their actual
   frame width. This preserves their proportions on phones and tablets. */
const appScreens = Array.from(document.querySelectorAll<HTMLElement>('.app-screen'));
const updateAppScreenScale = (screen: HTMLElement) => {
  const width = screen.getBoundingClientRect().width;
  if (!width) return;
  const scale = Math.max(0.5, Math.min(1.6, width / 210));
  screen.style.setProperty('--app-screen-scale', scale.toFixed(4));
};
if (appScreens.length && 'ResizeObserver' in window) {
  const appScreenObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => updateAppScreenScale(entry.target as HTMLElement));
  });
  appScreens.forEach((screen) => {
    updateAppScreenScale(screen);
    appScreenObserver.observe(screen);
  });
  window.addEventListener('pagehide', () => appScreenObserver.disconnect(), { once: true });
} else {
  appScreens.forEach(updateAppScreenScale);
}

/* Shared React Bits Classic particles begin precisely at the top edge of
   THE STUDIO, then remain clipped to the visible page area before the Footer.
   The overlay is positioned from Studio's current viewport edge, so its
   canvas can never paint over the Hero—even during the boundary transition. */
const studioForAmbient = document.querySelector<HTMLElement>('#studio');
const footerForAmbient = document.querySelector<HTMLElement>('#footer');
const ambientOverlay = document.querySelector<HTMLElement>('[data-ambient-overlay]');
let ambientTick = 0;
const updateAmbientVisibility = () => {
  ambientTick = 0;
  const viewportHeight = window.innerHeight;
  const studioTop = studioForAmbient?.getBoundingClientRect().top ?? viewportHeight;
  const footerTop = footerForAmbient?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
  const overlayTop = Math.max(0, Math.min(viewportHeight, studioTop));
  const overlayBottom = Math.max(0, Math.min(viewportHeight, footerTop));
  const visibleParticleHeight = Math.max(0, overlayBottom - overlayTop);
  const shouldShowAmbient = !reducedMotion && studioTop < viewportHeight && footerTop > overlayTop && visibleParticleHeight > 0;

  if (ambientOverlay) {
    ambientOverlay.style.top = `${overlayTop}px`;
    ambientOverlay.style.height = shouldShowAmbient ? `${visibleParticleHeight}px` : '0px';
  }
  root.classList.toggle('ambient-particles-active', shouldShowAmbient);
};
const requestAmbientUpdate = () => {
  if (!ambientTick) ambientTick = requestAnimationFrame(updateAmbientVisibility);
};
window.addEventListener('scroll', requestAmbientUpdate, { passive: true });
window.addEventListener('resize', requestAmbientUpdate, { passive: true });
updateAmbientVisibility();

const sectionNavigator = document.querySelector<HTMLElement>('[data-section-navigator]');
if (sectionNavigator) {
  const links = Array.from(sectionNavigator.querySelectorAll<HTMLAnchorElement>('[data-section-link]'));
  const sections = links.map((link) => document.getElementById(new URL(link.href, window.location.href).hash.slice(1))).filter((section): section is HTMLElement => Boolean(section));
  let activeIndex = -1;
  let scrollTick = 0;

  const updateActiveSection = () => {
    scrollTick = 0;
    const marker = window.scrollY + window.innerHeight * 0.42;
    let nextIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top + window.scrollY <= marker) nextIndex = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) nextIndex = sections.length - 1;
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    sectionNavigator.style.setProperty('--active-index', String(activeIndex));
    links.forEach((link, index) => {
      const active = index === activeIndex;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const requestUpdate = () => { if (!scrollTick) scrollTick = requestAnimationFrame(updateActiveSection); };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  links.forEach((link) => link.addEventListener('click', () => {
    const target = document.querySelector<HTMLElement>(link.getAttribute('href') || '');
    target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  updateActiveSection();
}

/* Reveal motion and scroll-driven hero perspective */
if (!reducedMotion) {
  root.classList.add('motion-ready');
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('[data-hero-title]', { opacity: 0, y: 34, duration: 1.05 })
    .from('[data-hero-reveal]', { opacity: 0, y: 22, duration: 0.75, stagger: 0.12 }, '-=0.55')
    .from('.hero__device', { opacity: 0, y: 38, scale: 0.92, duration: 1.05, stagger: 0.16 }, '-=0.9');

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 86%', once: true },
    });
  });

  const hero = document.querySelector<HTMLElement>('.hero');
  if (hero) {
    gsap.to('.hero__ambient--aqua', { yPercent: 18, xPercent: -8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero__ambient--indigo', { yPercent: -12, xPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
    const floatingDevices = gsap.utils.toArray<HTMLElement>('[data-float]');
    if (isFinePointer && floatingDevices.length) {
      const moveDevice = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        floatingDevices.forEach((device, index) => {
          const strength = (index + 1) * 6;
          gsap.to(device, { x: x * strength, y: y * strength, duration: 0.75, ease: 'power2.out', overwrite: 'auto' });
        });
      };
      const resetDevices = () => floatingDevices.forEach((device) => gsap.to(device, { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' }));
      hero.addEventListener('pointermove', moveDevice, { passive: true });
      hero.addEventListener('pointerleave', resetDevices, { passive: true });
    }
  }
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
} else {
  root.classList.remove('motion-ready');
}

/* App card spotlight + restrained 3D tilt (fine pointers only). */
if (isFinePointer && !reducedMotion) {
  document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((card) => {
    const onMove = (event: PointerEvent) => {
      const bounds = card.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 3.4;
      const rotateX = (0.5 - py) * 3.2;
      card.style.setProperty('--spotlight-x', `${px * 100}%`);
      card.style.setProperty('--spotlight-y', `${py * 100}%`);
      gsap.to(card, { rotationX: rotateX, rotationY: rotateY, y: -4, duration: 0.32, ease: 'power2.out', transformPerspective: 1200, transformOrigin: 'center center', overwrite: 'auto' });
    };
    const onLeave = () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
      card.style.setProperty('--spotlight-x', '50%');
      card.style.setProperty('--spotlight-y', '50%');
    };
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave, { passive: true });
  });
}


/* Independent Hero-only horizontal perspective ocean terrain. */
initOceanTerrain();
