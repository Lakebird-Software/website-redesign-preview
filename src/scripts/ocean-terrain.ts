/**
 * Lakebird hero ocean terrain.
 *
 * A perspective-projected horizontal XZ particle surface inspired by the
 * reference HTML supplied for this project. The grid is drawn into the Hero
 * canvas only; the React Bits ambient system is independent and never runs
 * over the Hero or footer.
 */

type Point3 = { x: number; z: number };
type Ripple = Point3 & { startedAt: number; amplitude: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

const PALETTE = {
  deepSpace: [2, 48, 71] as const,      // #023047
  blueGreen: [33, 158, 188] as const,  // #219EBC
  skyBlue: [142, 202, 230] as const,   // #8ECAE6
  amber: [255, 183, 3] as const,       // #FFB703
  orange: [251, 133, 0] as const,      // #FB8500
};

function makeColourTable() {
  const table: string[][] = [];
  for (let crestIndex = 0; crestIndex <= 64; crestIndex += 1) {
    const crest = crestIndex / 64;
    const glow = Math.pow(crest, 1.25);
    const colourRow: string[] = [];
    for (let fadeIndex = 0; fadeIndex <= 32; fadeIndex += 1) {
      const fade = fadeIndex / 32;
      const alpha = clamp(fade * (0.32 + glow * 0.65) * 0.9, 0, 0.92);
      const drift = clamp(0.34 + crest * 0.4, 0, 0.78);
      let r = mix(PALETTE.deepSpace[0], PALETTE.blueGreen[0], 0.56 + drift * 0.3);
      let g = mix(PALETTE.deepSpace[1], PALETTE.blueGreen[1], 0.56 + drift * 0.3);
      let b = mix(PALETTE.deepSpace[2], PALETTE.blueGreen[2], 0.56 + drift * 0.3);
      r = mix(r, PALETTE.skyBlue[0], crest * 0.38);
      g = mix(g, PALETTE.skyBlue[1], crest * 0.38);
      b = mix(b, PALETTE.skyBlue[2], crest * 0.38);
      const amberAmount = Math.max(0, (crest - 0.38) / (0.76 - 0.38)) * 0.055;
      r = mix(r, PALETTE.amber[0], amberAmount);
      g = mix(g, PALETTE.amber[1], amberAmount);
      b = mix(b, PALETTE.amber[2], amberAmount);
      const orangeAmount = Math.max(0, (crest - 0.68) / (0.96 - 0.68)) * 0.018;
      r = mix(r, PALETTE.orange[0], orangeAmount);
      g = mix(g, PALETTE.orange[1], orangeAmount);
      b = mix(b, PALETTE.orange[2], orangeAmount);
      colourRow.push(`rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha.toFixed(3)})`);
    }
    table.push(colourRow);
  }
  return table;
}

const COLOUR_TABLE = makeColourTable();

export function initOceanTerrain() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particle-field]');
  const stage = canvas?.closest<HTMLElement>('[data-particle-stage]');
  const context = canvas?.getContext('2d', { alpha: true, desynchronized: true });
  if (!canvas || !stage || !context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.matchMedia('(max-width: 700px)').matches;
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, smallScreen ? (lowPower ? 1 : 1.25) : (lowPower ? 1.2 : 1.55));

  // Retain the current fine particle character while using the reference's
  // perspective grid and 20-degree pitch. Mobile uses fewer columns only.
  const columns = smallScreen ? 240 : 320;
  const startRow = -62;
  const endRow = 195;
  const spacing = 9.5;
  const focalLength = 520;
  const cameraHeight = 145;
  const cameraZOffset = 340;
  const pitchAngle = 20 * (Math.PI / 180);
  const cosPitch = Math.cos(pitchAngle);
  const sinPitch = Math.sin(pitchAngle);
  const maxRipples = 6;

  let width = 1;
  let height = 1;
  let time = 0;
  let lastFrame = 0;
  let frameHandle = 0;
  let isInView = false;
  let isDisposed = false;
  let scrollProgress = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let pointerInsideTerrain = false;
  let pointerWorld: Point3 | null = null;
  let touchStart: { x: number; y: number } | null = null;
  let ripples: Ripple[] = [];
  let renderStaticPending = false;

  const pointerToLocal = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const screenToWorld = (screenX: number, screenY: number): Point3 | null => {
    const centerX = width / 2;
    const horizonY = height * 0.4 + mouseY * 0.3;
    const screenSlope = (screenY - horizonY) / focalLength;
    const denominator = screenSlope * cosPitch + sinPitch;
    if (denominator <= 0.05) return null;

    const cameraDepth = (cameraHeight * cosPitch) / denominator;
    const cameraY = screenSlope * cameraDepth;
    const worldZ = cameraDepth * cosPitch - (cameraY - cameraHeight) * sinPitch - cameraZOffset;
    const worldX = ((screenX - centerX) * cameraDepth) / focalLength + mouseX;
    return { x: worldX, z: worldZ };
  };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawFrame();
    scheduleFrame();
  };

  const drawFrame = () => {
    if (isDisposed) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';

    const centerX = width / 2;
    const horizonY = height * 0.4 + mouseY * 0.3;
    const pointerActive = pointerInsideTerrain && pointerWorld !== null && !reducedMotion;

    // Keep only the recent ripples. One click produces one broad, low-frequency
    // crest with a soft trailing trough, rather than a stack of fast rings.
    ripples = ripples.filter((ripple) => time - ripple.startedAt < 4.4);

    for (let row = startRow; row < endRow; row += 1) {
      const worldZ = row * spacing;
      const zRelative = worldZ + cameraZOffset;
      if (zRelative <= 20) continue;

      const normalizedDepth = Math.max(0, row / endRow);
      const horizonFade = Math.pow(Math.max(0, 1 - normalizedDepth), 1.15);
      if (horizonFade <= 0.01) continue;

      for (let column = 0; column < columns; column += 1) {
        const worldX = (column - columns / 2) * spacing;

        // Broad ocean movement based on the supplied reference formula.
        const wave1 = Math.sin(worldX * 0.011 + time * 0.85) * Math.cos(worldZ * 0.009 + time * 0.65) * 32;
        const wave2 = Math.sin(worldX * 0.022 - time * 1.1 + worldZ * 0.015) * 13;
        const ridge = Math.sin(worldX * 0.014 + worldZ * 0.011 + time * 0.7) * 11;

        let rippleOffset = 0;
        for (let index = 0; index < ripples.length; index += 1) {
          const ripple = ripples[index];
          const age = time - ripple.startedAt;
          const dx = worldX - ripple.x;
          const dz = worldZ - ripple.z;
          const distance = Math.hypot(dx, dz);
          const radius = age * 210;
          const delta = distance - radius;
          const crest = Math.exp(-Math.pow(delta / 88, 2));
          const trailingTrough = Math.exp(-Math.pow((delta - 112) / 122, 2));
          const decay = Math.exp(-age * 0.44);
          rippleOffset += (crest - trailingTrough * 0.26) * ripple.amplitude * decay;
        }

        let pointerOffset = 0;
        if (pointerActive && pointerWorld) {
          const pointerDistance = Math.hypot(worldX - pointerWorld.x, worldZ - pointerWorld.z);
          const influence = Math.exp(-Math.pow(pointerDistance / 165, 2));
          pointerOffset = Math.sin(pointerDistance * 0.024 - time * 1.45) * influence * 7.5;
        }

        const scrollFlow = Math.sin(worldX * 0.014 - worldZ * 0.011 + time * 0.7 + scrollProgress * 1.6) * scrollProgress * 5.5;
        const totalWave = wave1 + wave2 + ridge + rippleOffset + pointerOffset + scrollFlow;
        const yRelative = totalWave + cameraHeight;

        // Rotate the horizontal XZ surface around its X axis: its far edge
        // recedes toward the hero's centre, matching the supplied 20° reference.
        const yCamera = yRelative * cosPitch - zRelative * sinPitch;
        const zCamera = yRelative * sinPitch + zRelative * cosPitch;
        if (zCamera <= 15) continue;

        const scale = focalLength / zCamera;
        const screenX = centerX + (worldX - mouseX) * scale;
        const screenY = horizonY + yCamera * scale;
        if (screenX < -4 || screenX > width + 4 || screenY < -4 || screenY > height + 4) continue;

        const elevation = totalWave / 60;
        const crest = smoothstep(-0.06, 0.34, elevation);
        const crestIndex = Math.round(crest * 64);
        const fadeIndex = Math.round(horizonFade * 32);
        context.fillStyle = COLOUR_TABLE[crestIndex][fadeIndex];

        // Preserve the existing fine dot scale and use smooth circular points.
        const dotSize = clamp(1.45 * scale, 0.7, 2.0);
        context.beginPath();
        context.arc(screenX, screenY, dotSize * 0.5, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalCompositeOperation = 'source-over';
  };

  const animate = (timestamp: number) => {
    frameHandle = 0;
    if (isDisposed || !isInView || document.hidden) return;
    const delta = lastFrame ? clamp((timestamp - lastFrame) / 1000, 0.0005, 0.035) : 1 / 60;
    lastFrame = timestamp;
    if (!reducedMotion) time += delta * 1.15;
    mouseX += (targetMouseX - mouseX) * 0.055;
    mouseY += (targetMouseY - mouseY) * 0.055;
    if (pointerInsideTerrain) {
      const local = latestPointerLocal;
      pointerWorld = local ? screenToWorld(local.x, local.y) : null;
    } else {
      pointerWorld = null;
    }
    drawFrame();
    if (!reducedMotion || ripples.length > 0 || pointerInsideTerrain) {
      frameHandle = requestAnimationFrame(animate);
    }
  };

  const scheduleFrame = () => {
    if (isDisposed || !isInView || document.hidden || frameHandle) return;
    if (reducedMotion && ripples.length === 0) {
      if (!renderStaticPending) {
        renderStaticPending = true;
        requestAnimationFrame(() => {
          renderStaticPending = false;
          drawFrame();
        });
      }
      return;
    }
    frameHandle = requestAnimationFrame(animate);
  };

  let latestPointerLocal: { x: number; y: number } | null = null;
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const local = pointerToLocal(event.clientX, event.clientY);
    latestPointerLocal = local;
    targetMouseX = (local.x / Math.max(1, width) - 0.5) * 110;
    targetMouseY = (local.y / Math.max(1, height) - 0.5) * 35;
    pointerInsideTerrain = local.y >= height * 0.36 && local.y <= height;
    if (!pointerInsideTerrain) pointerWorld = null;
    scheduleFrame();
  };

  const onPointerLeave = () => {
    pointerInsideTerrain = false;
    pointerWorld = null;
    latestPointerLocal = null;
    targetMouseX = 0;
    targetMouseY = 0;
    scheduleFrame();
  };

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('a, button, input, textarea, select, summary, [role="button"]'));

  const addRipple = (clientX: number, clientY: number) => {
    if (reducedMotion) return;
    const local = pointerToLocal(clientX, clientY);
    const horizonY = height * 0.4 + mouseY * 0.3;
    if (local.y < horizonY - 12 || local.y > height) return;
    const world = screenToWorld(local.x, local.y);
    if (!world) return;
    ripples.push({ ...world, startedAt: time, amplitude: 34 });
    if (ripples.length > maxRipples) ripples.shift();
    scheduleFrame();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (isInteractiveTarget(event.target)) return;
    const local = pointerToLocal(event.clientX, event.clientY);
    if (local.y < height * 0.36 || local.y > height) return;
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
    if (Math.hypot(dx, dy) < 10 && !isInteractiveTarget(event.target)) {
      addRipple(event.clientX, event.clientY);
    }
    touchStart = null;
  };

  const onPointerCancel = () => { touchStart = null; };

  const updateScroll = () => {
    const rect = stage.getBoundingClientRect();
    const travelled = window.innerHeight - rect.top;
    scrollProgress = clamp(travelled / (rect.height + window.innerHeight), 0, 1);
    scheduleFrame();
  };

  const intersection = new IntersectionObserver((entries) => {
    isInView = entries.some((entry) => entry.isIntersecting);
    if (isInView) {
      lastFrame = 0;
      scheduleFrame();
    } else if (frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }, { threshold: 0.01 });
  intersection.observe(stage);

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

  resize();
  updateScroll();

  window.addEventListener('pagehide', () => {
    isDisposed = true;
    if (frameHandle) cancelAnimationFrame(frameHandle);
    intersection.disconnect();
    resizeObserver.disconnect();
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerleave', onPointerLeave);
    stage.removeEventListener('pointerdown', onPointerDown);
    stage.removeEventListener('pointerup', onPointerUp);
    stage.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('scroll', updateScroll);
    window.removeEventListener('resize', updateScroll);
    document.removeEventListener('visibilitychange', scheduleFrame);
  }, { once: true });
}
