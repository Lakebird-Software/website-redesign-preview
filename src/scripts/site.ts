import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type * as THREE_TYPES from 'three';

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

/* --------------------------------------------------------------------------
   Lakebird ocean terrain — dense full-bleed particle surface.
   Pointer + ripple positions use canvas-normalized device coordinates (NDC),
   so the interaction is locked to the visible cursor/tap on every aspect ratio.
---------------------------------------------------------------------------- */
async function initParticleTerrain() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particle-field]');
  const stage = canvas?.closest<HTMLElement>('[data-particle-stage]');
  if (!canvas || !stage) return;

  try {
    const THREE = await import('three');
    const smallScreen = window.matchMedia('(max-width: 700px)').matches;
    const reducedPower = (navigator.hardwareConcurrency || 4) <= 4;
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      smallScreen ? (reducedPower ? 0.85 : 1) : (reducedPower ? 1.15 : 1.45),
    );
    const viewHalfHeight = 7.15;
    const planeDepth = 20.2;
    const rippleCount = 4;

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointerNdc: { value: new THREE.Vector2(10, 10) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uRipples: {
        value: Array.from({ length: rippleCount }, () => new THREE.Vector4(10, 10, -100, 0)),
      },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointerNdc;
        uniform float uPointerStrength;
        uniform float uPixelRatio;
        uniform vec4 uRipples[4];
        attribute float aSeed;
        varying float vElevation;
        varying float vAlpha;
        varying float vSeed;

        void main() {
          vec3 p = position;
          float drift = uTime * 0.115 + uScroll * 2.15;

          // Broad, low-frequency ocean movement with only a little fine detail.
          float longWave = sin(p.x * 0.255 + p.z * 0.225 + drift) * 0.34;
          float crossWave = cos(p.z * 0.245 - p.x * 0.135 - drift * 0.72) * 0.19;
          float fineWave = sin(p.x * 0.49 + p.z * 0.40 + drift * 0.4) * 0.022;

          // Screen-space location is used for pointer/ripple mapping. This avoids
          // the camera-plane offset that caused the old effect to appear at an edge.
          vec4 baseView = modelViewMatrix * vec4(p, 1.0);
          vec4 baseClip = projectionMatrix * baseView;
          vec2 vertexNdc = baseClip.xy / max(baseClip.w, 0.0001);

          float rippleDisplacement = 0.0;
          for (int i = 0; i < 4; i++) {
            float age = uTime - uRipples[i].z;
            if (age > 0.0 && age < 3.15) {
              float d = distance(vertexNdc, uRipples[i].xy);
              float radius = age * 0.215;
              // One broad crest with a very soft trailing trough — no rapid ring train.
              float crest = exp(-pow((d - radius) * 15.0, 2.0));
              float trough = exp(-pow((d - radius - 0.105) * 10.0, 2.0));
              float wave = crest - trough * 0.24;
              rippleDisplacement += wave * uRipples[i].w * exp(-age * 0.82) * 0.205;
            }
          }

          float pointerDistance = distance(vertexNdc, uPointerNdc);
          float pointerInfluence = exp(-pow(pointerDistance * 4.1, 2.0)) * uPointerStrength;
          float pointerLift = pointerInfluence * 0.16;
          float pointerFlow = sin(pointerDistance * 15.0 - uTime * 0.55)
                            * exp(-pointerDistance * 5.0) * pointerInfluence * 0.012;

          float scrollFlow = sin(p.x * 0.19 - p.z * 0.17 + drift * 1.35) * uScroll * 0.10;
          float edgeFade = 0.70 + 0.30 * smoothstep(-10.0, 8.0, p.z);
          float elevation = (longWave + crossWave + fineWave + rippleDisplacement + pointerLift + pointerFlow + scrollFlow) * edgeFade;
          p.y += elevation;

          vElevation = elevation;
          vSeed = aSeed;
          vAlpha = clamp(0.43 + edgeFade * 0.42 + abs(elevation) * 0.12, 0.0, 0.86);

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = clamp((1.35 + aSeed * 0.32 + abs(elevation) * 0.38) * uPixelRatio, 1.1, 2.55);
        }
      `,
      fragmentShader: `
        varying float vElevation;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          vec2 point = gl_PointCoord - vec2(0.5);
          float radius = length(point);
          float core = 1.0 - smoothstep(0.12, 0.42, radius);
          float halo = 1.0 - smoothstep(0.16, 0.50, radius);
          float alpha = core * 0.72 + halo * 0.28;
          if (alpha < 0.012) discard;

          vec3 deepSpace = vec3(0.008, 0.188, 0.278);
          vec3 blueGreen = vec3(0.129, 0.620, 0.737);
          vec3 skyBlue = vec3(0.557, 0.792, 0.902);
          vec3 amber = vec3(1.0, 0.718, 0.012);
          vec3 orange = vec3(0.984, 0.522, 0.0);
          float crest = smoothstep(-0.06, 0.34, vElevation);
          float colourDrift = clamp(0.34 + vElevation * 0.40 + vSeed * 0.12, 0.0, 0.78);
          vec3 colour = mix(deepSpace, blueGreen, 0.56 + colourDrift * 0.30);
          colour = mix(colour, skyBlue, crest * 0.38);
          colour = mix(colour, amber, smoothstep(0.38, 0.76, vElevation) * 0.055);
          colour = mix(colour, orange, smoothstep(0.68, 0.96, vElevation) * 0.018);
          gl_FragColor = vec4(colour, alpha * vAlpha);
        }
      `,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(0, 17.5, 17.5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const targetPointer = new THREE.Vector2(10, 10);
    const smoothPointer = new THREE.Vector2(10, 10);
    let geometry: THREE_TYPES.BufferGeometry | null = null;
    let points: THREE_TYPES.Points | null = null;
    let elapsed = 0;
    let lastTime = 0;
    let raf = 0;
    let inView = false;
    let disposed = false;
    let scrollProgress = 0;
    let rippleIndex = 0;
    let touchStart: { x: number; y: number } | null = null;

    const rebuildTerrain = (width: number, height: number) => {
      const mobile = width <= 700;
      // Closely packed, even rows create a continuous surface rather than sparse dots.
      const columnSpacing = mobile ? 4.8 : 4.65;
      const rowSpacing = mobile ? 5.5 : 5.25;
      const columns = Math.max(mobile ? 68 : 120, Math.min(420, Math.ceil(width / columnSpacing)));
      const rows = Math.max(120, Math.min(390, Math.ceil(height / rowSpacing)));
      const halfWidth = viewHalfHeight * (width / Math.max(1, height));
      const halfDepth = planeDepth / 2;
      const positions = new Float32Array(columns * rows * 3);
      const seeds = new Float32Array(columns * rows);
      let cursor = 0;

      for (let row = 0; row < rows; row += 1) {
        const z = -halfDepth + (row / (rows - 1)) * planeDepth;
        for (let column = 0; column < columns; column += 1) {
          const x = -halfWidth + (column / (columns - 1)) * halfWidth * 2;
          positions[cursor * 3] = x;
          positions[cursor * 3 + 1] = 0;
          positions[cursor * 3 + 2] = z;
          const hash = Math.sin((column + 1) * 12.9898 + (row + 1) * 78.233) * 43758.5453;
          seeds[cursor] = hash - Math.floor(hash);
          cursor += 1;
        }
      }

      const nextGeometry = new THREE.BufferGeometry();
      nextGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      nextGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      nextGeometry.computeBoundingSphere();
      if (points) {
        scene.remove(points);
        points.geometry.dispose();
      }
      geometry = nextGeometry;
      points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const aspect = width / Math.max(1, height);
      camera.left = -viewHalfHeight * aspect;
      camera.right = viewHalfHeight * aspect;
      camera.top = viewHalfHeight;
      camera.bottom = -viewHalfHeight;
      camera.updateProjectionMatrix();
    };

    const renderOnce = () => {
      if (!disposed) renderer.render(scene, camera);
    };

    const render = (timestamp: number) => {
      raf = 0;
      if (disposed || reducedMotion || !inView || document.hidden) return;
      const delta = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.035);
      lastTime = timestamp;
      elapsed += delta;
      smoothPointer.lerp(targetPointer, 0.085);
      uniforms.uTime.value = elapsed;
      uniforms.uScroll.value = scrollProgress;
      uniforms.uPointerNdc.value.copy(smoothPointer);
      const pointerVisible = targetPointer.x >= -1 && targetPointer.x <= 1 && targetPointer.y >= -1 && targetPointer.y <= 1;
      const targetStrength = pointerVisible && !reducedMotion ? 1 : 0;
      uniforms.uPointerStrength.value += (targetStrength - uniforms.uPointerStrength.value) * 0.075;
      renderer.render(scene, camera);
      // Keep a subtle ambient drift running while the terrain is in view.
      raf = requestAnimationFrame(render);
    };

    const scheduleFrame = () => {
      if (!disposed && !reducedMotion && inView && !document.hidden && !raf) raf = requestAnimationFrame(render);
    };

    const toCanvasNdc = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = 1 - ((clientY - rect.top) / rect.height) * 2;
      if (x < -1 || x > 1 || y < -1 || y > 1) return null;
      return new THREE.Vector2(x, y);
    };

    const addRipple = (clientX: number, clientY: number) => {
      if (reducedMotion) return;
      const point = toCanvasNdc(clientX, clientY);
      if (!point) return;
      uniforms.uRipples.value[rippleIndex].set(point.x, point.y, elapsed, 0.82);
      rippleIndex = (rippleIndex + 1) % rippleCount;
      scheduleFrame();
    };

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('a, button, input, textarea, select, summary, [role="button"]'));

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const point = toCanvasNdc(event.clientX, event.clientY);
      if (!point) {
        targetPointer.set(10, 10);
        return;
      }
      targetPointer.copy(point);
      scheduleFrame();
    };

    const onPointerLeave = () => {
      targetPointer.set(10, 10);
      scheduleFrame();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) return;
      if (event.pointerType === 'touch') {
        touchStart = { x: event.clientX, y: event.clientY };
        return;
      }
      if (event.button === 0) addRipple(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !touchStart) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      const isTap = Math.hypot(dx, dy) < 10 && !isInteractiveTarget(event.target);
      if (isTap) addRipple(event.clientX, event.clientY);
      touchStart = null;
    };

    const onPointerCancel = () => { touchStart = null; };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      rebuildTerrain(width, height);
      renderOnce();
    };

    const updateScroll = () => {
      const rect = stage.getBoundingClientRect();
      const travelled = window.innerHeight - rect.top;
      scrollProgress = Math.min(1, Math.max(0, travelled / (rect.height + window.innerHeight)));
      uniforms.uScroll.value = scrollProgress;
      scheduleFrame();
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      inView = Boolean(entries[0]?.isIntersecting);
      if (inView) {
        lastTime = 0;
        scheduleFrame();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }, { threshold: 0.01 });
    intersectionObserver.observe(stage);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    stage.addEventListener('pointerdown', onPointerDown, { passive: true });
    stage.addEventListener('pointerup', onPointerUp, { passive: true });
    stage.addEventListener('pointercancel', onPointerCancel, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', scheduleFrame);

    updateScroll();
    resize();

    window.addEventListener('pagehide', () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      document.removeEventListener('visibilitychange', scheduleFrame);
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    canvas.hidden = true;
    console.warn('Lakebird ocean terrain is unavailable; the CSS atmosphere remains visible.', error);
  }
}

void initParticleTerrain();
