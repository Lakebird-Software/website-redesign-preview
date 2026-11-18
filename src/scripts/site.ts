import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Theme switcher
   Dark is the default. A visitor's explicit choice is saved locally.
---------------------------------------------------------------------------- */
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
  if (themeColor) themeColor.content = theme === 'light' ? '#f4f7fa' : '#070a12';
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('lakebird-theme', nextTheme);
    } catch {
      // Theme switching still works if storage is unavailable.
    }
  });
});
applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

/* --------------------------------------------------------------------------
   Responsive mobile navigation
---------------------------------------------------------------------------- */
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
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
      return;
    }
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation menu');
    mobileNav.inert = false;
    mobileNav.classList.add('is-open');
  });

  mobileNav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

/* --------------------------------------------------------------------------
   Header state + active section
---------------------------------------------------------------------------- */
const header = document.querySelector<HTMLElement>('[data-site-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const sectionLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.desktop-nav .nav-link'));
const observedSections = ['applications', 'studio', 'contact']
  .map((id) => document.getElementById(id))
  .filter((element): element is HTMLElement => Boolean(element));

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const activeId = visible.target.id;
    sectionLinks.forEach((link) => {
      const targetId = new URL(link.href, window.location.href).hash.slice(1);
      link.classList.toggle('is-current', targetId === activeId);
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.35, 0.6] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

/* --------------------------------------------------------------------------
   GSAP motion. Content remains visible when JS is unavailable or motion is
   reduced. The CSS reveal state is only enabled after this script is ready.
---------------------------------------------------------------------------- */
if (!reducedMotion) {
  root.classList.add('motion-ready');

  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('[data-hero-title]', { opacity: 0, y: 34, duration: 1.05 })
    .from('[data-hero-reveal]', { opacity: 0, y: 22, duration: 0.75, stagger: 0.12 }, '-=0.55')
    .from('.hero__device', { opacity: 0, y: 38, scale: 0.92, duration: 1.05, stagger: 0.16 }, '-=0.9');

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.fromTo(element,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 86%', once: true },
      },
    );
  });

  const hero = document.querySelector<HTMLElement>('.hero');
  const floatingDevices = gsap.utils.toArray<HTMLElement>('[data-float]');
  if (hero && floatingDevices.length) {
    const moveDevice = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      floatingDevices.forEach((device, index) => {
        const strength = (index + 1) * 7;
        gsap.to(device, { x: x * strength, y: y * strength, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
      });
    };
    const resetDevices = () => floatingDevices.forEach((device) => {
      gsap.to(device, { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' });
    });
    hero.addEventListener('pointermove', moveDevice, { passive: true });
    hero.addEventListener('pointerleave', resetDevices, { passive: true });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
} else {
  root.classList.remove('motion-ready');
}

/* --------------------------------------------------------------------------
   Three.js hero particles. Loaded only on pages that contain the canvas.
---------------------------------------------------------------------------- */
async function initParticles() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particle-field]');
  const interactionArea = canvas?.closest<HTMLElement>('.hero');
  if (!canvas || !interactionArea) return;

  try {
    const THREE = await import('three');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
    camera.position.z = 10;

    const isSmallScreen = window.matchMedia('(max-width: 700px)').matches;
    const count = isSmallScreen ? 95 : 190;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const normalized = new Float32Array(count * 2);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const aqua = new THREE.Color('#75e6d2');
    const indigo = new THREE.Color('#8190ff');
    const white = new THREE.Color('#dce8f5');

    for (let i = 0; i < count; i += 1) {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      normalized[i * 2] = x;
      normalized[i * 2 + 1] = y;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.25 + Math.random() * 0.75;
      const colour = Math.random() > 0.68 ? indigo : (Math.random() > 0.5 ? aqua : white);
      colors[i * 3] = colour.r;
      colors[i * 3 + 1] = colour.g;
      colors[i * 3 + 2] = colour.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: isSmallScreen ? 1.35 : 1.65,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let width = 1;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let disposed = false;

    const resize = () => {
      const bounds = interactionArea.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      updatePositions(0);
      renderer.render(scene, camera);
    };

    const updatePositions = (time: number) => {
      const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = positionAttribute.array as Float32Array;
      for (let i = 0; i < count; i += 1) {
        const baseX = normalized[i * 2] * width;
        const baseY = normalized[i * 2 + 1] * height;
        const phase = phases[i] + time * speeds[i];
        let x = baseX + Math.sin(phase * 0.42) * 13 + pointerX * 13;
        let y = baseY + Math.cos(phase * 0.34) * 11 + pointerY * 10;

        // Gentle cursor/touch repulsion gives the particles a tactile response.
        const dx = x - pointerX * width * 0.38;
        const dy = y - pointerY * height * 0.38;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 115 && distance > 0.01) {
          const force = (1 - distance / 115) * 19;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
        array[i * 3] = x;
        array[i * 3 + 1] = y;
        array[i * 3 + 2] = 0;
      }
      positionAttribute.needsUpdate = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = interactionArea.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = -(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; };

    interactionArea.addEventListener('pointermove', onPointerMove, { passive: true });
    interactionArea.addEventListener('pointerleave', onPointerLeave, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(interactionArea);
    resize();

    const render = (timestamp: number) => {
      if (disposed) return;
      if (document.hidden) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      const delta = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.05);
      lastTime = timestamp;
      elapsed += delta;
      pointerX += (targetX - pointerX) * 0.055;
      pointerY += (targetY - pointerY) * 0.055;
      updatePositions(elapsed);
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      updatePositions(0);
      renderer.render(scene, camera);
    } else {
      animationFrame = requestAnimationFrame(render);
    }

    window.addEventListener('beforeunload', () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      interactionArea.removeEventListener('pointermove', onPointerMove);
      interactionArea.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    // CSS aurora gradients remain as the no-WebGL fallback.
    canvas.hidden = true;
    console.warn('Lakebird particle effect unavailable; using CSS fallback.', error);
  }
}

void initParticles();
