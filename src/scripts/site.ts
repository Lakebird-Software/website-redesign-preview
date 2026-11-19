import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const sectionNavigator = document.querySelector<HTMLElement>('[data-section-navigator]');
if (sectionNavigator) {
  const links = Array.from(sectionNavigator.querySelectorAll<HTMLAnchorElement>('[data-section-link]'));
  const sections = links.map((link) => document.getElementById(new URL(link.href, window.location.href).hash.slice(1))).filter((section): section is HTMLElement => Boolean(section));
  const count = sectionNavigator.querySelector<HTMLElement>('[data-section-count]');
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
    if (count) count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(links.length).padStart(2, '0')}`;
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

/* --------------------------------------------------------------------------
   Three.js ocean-like particle terrain.
   - pointer movement bends the surface
   - pointer/touch presses create expanding circular ripples
   - scroll progress changes wave phase and terrain flow
   - adaptive density and DPR protect mobile performance
---------------------------------------------------------------------------- */
async function initParticleTerrain() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particle-field]');
  const hero = canvas?.closest<HTMLElement>('.hero');
  if (!canvas || !hero) return;

  try {
    const THREE = await import('three');
    const smallScreen = window.matchMedia('(max-width: 700px)').matches;
    const lowPower = window.matchMedia('(max-width: 420px)').matches || (navigator.hardwareConcurrency || 4) <= 4;
    const columns = smallScreen ? (lowPower ? 52 : 68) : 126;
    const rows = smallScreen ? (lowPower ? 30 : 40) : 72;
    const count = columns * rows;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
      const depth = row / (rows - 1);
      for (let column = 0; column < columns; column += 1) {
        const across = column / (columns - 1);
        positions[index * 3] = (across - 0.5) * 16.5;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = (depth - 0.5) * 12.5;
        seeds[index] = Math.random();
        index += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const rippleCount = 5;
    const rippleUniforms = Array.from({ length: rippleCount }, () => new THREE.Vector4(0, 0, -100, 0));
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uRipples: { value: rippleUniforms },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform vec4 uRipples[5];
        attribute float aSeed;
        varying float vElevation;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          vec3 p = position;
          float t = uTime * (0.72 + uScroll * 0.34);
          float broad = sin(p.x * 0.58 + p.z * 0.38 + t * 0.75) * 0.34;
          float crossWave = cos(p.z * 0.92 - p.x * 0.22 - t * 0.58) * 0.20;
          float fineWave = sin(p.x * 1.15 + p.z * 0.72 + t * 0.42) * 0.075;
          float rippleWave = 0.0;
          for (int i = 0; i < 5; i++) {
            float age = uTime - uRipples[i].z;
            if (age > 0.0 && age < 3.6) {
              float radius = age * 2.75;
              float distanceToRipple = distance(p.xz, uRipples[i].xy);
              float ring = sin((distanceToRipple - radius) * 5.4);
              float envelope = exp(-pow((distanceToRipple - radius) * 0.82, 2.0));
              rippleWave += ring * envelope * uRipples[i].w * exp(-age * 0.48) * 0.62;
            }
          }
          float pointerDistance = distance(p.xz, uPointer * vec2(7.0, 5.1));
          float pointerEnvelope = exp(-pointerDistance * 0.66);
          float pointerWave = sin(pointerDistance * 3.0 - uTime * 2.3) * pointerEnvelope * 0.24;
          float scrollWave = sin(p.x * 0.72 + p.z * 0.42 + uScroll * 5.2) * uScroll * 0.22;
          float depthFade = 0.55 + 0.45 * smoothstep(-6.0, 5.5, p.z);
          float elevation = (broad + crossWave + fineWave + rippleWave + pointerWave + scrollWave) * depthFade;
          p.y += elevation;
          p.x += sin(p.z * 0.38 + t * 0.2) * uScroll * 0.12;
          vElevation = elevation;
          vSeed = aSeed;
          vAlpha = clamp(0.32 + depthFade * 0.58 + abs(elevation) * 0.12, 0.0, 0.92);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = clamp((1.45 + abs(elevation) * 1.25) * (250.0 / -mvPosition.z), 1.0, 4.2);
        }
      `,
      fragmentShader: `
        varying float vElevation;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          vec2 point = gl_PointCoord - vec2(0.5);
          float radius = length(point);
          float glow = 1.0 - smoothstep(0.08, 0.5, radius);
          if (glow <= 0.01) discard;
          vec3 deepBlue = vec3(0.008, 0.188, 0.278);
          vec3 blueGreen = vec3(0.129, 0.620, 0.737);
          vec3 skyBlue = vec3(0.557, 0.792, 0.902);
          vec3 amber = vec3(1.0, 0.718, 0.012);
          float heightMix = clamp(0.35 + vElevation * 0.95 + vSeed * 0.18, 0.0, 1.0);
          vec3 colour = mix(deepBlue, blueGreen, 0.55 + heightMix * 0.28);
          colour = mix(colour, skyBlue, smoothstep(0.12, 0.55, vElevation) * 0.72);
          colour = mix(colour, amber, smoothstep(0.42, 0.72, vElevation) * 0.10);
          gl_FragColor = vec4(colour, glow * vAlpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    const scene = new THREE.Scene();
    scene.add(points);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 4.25, 10.8);
    camera.lookAt(0, 0, -1.5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallScreen ? 1 : 1.35));
    renderer.setClearColor(0x000000, 0);

    let elapsed = 0;
    let lastTime = 0;
    let frame = 0;
    let inView = false;
    let disposed = false;
    let rippleIndex = 0;
    const targetPointer = new THREE.Vector2(99, 99);
    const smoothPointer = new THREE.Vector2(99, 99);
    let scrollProgress = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderOnce();
    };
    const renderOnce = () => {
      if (disposed) return;
      renderer.render(scene, camera);
    };
    const scheduleFrame = () => {
      if (!disposed && !reducedMotion && inView && !document.hidden && !frame) frame = requestAnimationFrame(render);
    };
    const render = (timestamp: number) => {
      frame = 0;
      if (disposed || reducedMotion || !inView || document.hidden) return;
      const delta = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.04);
      lastTime = timestamp;
      elapsed += delta;
      smoothPointer.lerp(targetPointer, 0.075);
      uniforms.uTime.value = elapsed;
      uniforms.uScroll.value = scrollProgress;
      uniforms.uPointer.value.copy(smoothPointer);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const worldPoint = (clientX: number, clientY: number) => {
      const rect = hero.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = (0.5 - (clientY - rect.top) / rect.height) * 2;
      return { x: nx * 7.0, z: ny * 5.1 };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const p = worldPoint(event.clientX, event.clientY);
      targetPointer.set(p.x / 7.0, p.z / 5.1);
    };
    const onPointerLeave = () => targetPointer.set(99, 99);
    const addRipple = (clientX: number, clientY: number) => {
      const p = worldPoint(clientX, clientY);
      rippleUniforms[rippleIndex].set(p.x, p.z, elapsed, 1.0);
      rippleIndex = (rippleIndex + 1) % rippleCount;
      if (reducedMotion) renderOnce();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || (event.target instanceof Element && event.target.closest('a, button, input, textarea, select'))) return;
      addRipple(event.clientX, event.clientY);
    };
    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      uniforms.uScroll.value = scrollProgress;
    };

    const observer = new IntersectionObserver((entries) => {
      inView = Boolean(entries[0]?.isIntersecting);
      if (inView) { lastTime = 0; scheduleFrame(); }
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.01 });
    observer.observe(hero);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true });
    hero.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', scheduleFrame);
    updateScroll();
    resize();
    if (reducedMotion) renderOnce();

    window.addEventListener('pagehide', () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      hero.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', scheduleFrame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    canvas.hidden = true;
    console.warn('Lakebird particle terrain is unavailable; using the CSS ocean fallback.', error);
  }
}

void initParticleTerrain();
