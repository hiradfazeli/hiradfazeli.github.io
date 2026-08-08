/**
 * "JS Art" — the vibrancy layer.
 *
 * Three things, all strictly progressive enhancement:
 *   1. a guilloché engine (the engine-turned engraving found on banknotes,
 *      share certificates and watch dials — the literal old-money reference),
 *   2. scroll reveals,
 *   3. the colour-theme toggle.
 *
 * Nothing here is required to read the site. The canvas is aria-hidden, every
 * page renders complete without scripting, and the whole animation layer stands
 * still under `prefers-reduced-motion`.
 *
 * Budget: no libraries, transform/opacity only, and the expensive drawing happens
 * exactly once into an offscreen bitmap rather than every frame.
 */

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Which palette is actually showing, accounting for the manual override. */
const isLight = () => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr) return attr === 'light';
  return window.matchMedia('(prefers-color-scheme: light)').matches;
};

/* ------------------------------------------------------------------ guilloché */

type RosetteSpec = {
  /** Ratio numerator/denominator of fixed:rolling circle. p > q keeps r < R. */
  p: number;
  q: number;
  /** Pen offset as a fraction of the outer radius. */
  d: number;
  /** How many rotated copies form the engraved band. */
  copies: number;
  lineWidth: number;
  alpha: number;
};

/**
 * A hypotrochoid: the curve traced by a pen inside a circle rolling inside a
 * larger one. Repeated at incremented phase, it produces the woven rosette that
 * reads instantly as "engraved security print".
 *
 *   x = (R−r)·cos t + d·cos(((R−r)/r)·t)
 *   y = (R−r)·sin t − d·sin(((R−r)/r)·t)
 */
function traceRosette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outer: number,
  spec: RosetteSpec,
  color: string,
) {
  const { p, q, d: dRatio, copies, lineWidth, alpha } = spec;

  const r = q / p;
  const a = 1 - r;
  // Normalise so the widest excursion lands exactly on `outer`.
  const scale = outer / (a + dRatio);
  const ratio = a / r;
  const steps = 620;
  const turns = q;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';

  for (let c = 0; c < copies; c++) {
    // Each copy is nudged in phase and swelled slightly, which is what creates
    // the dense interference banding rather than a single flat outline.
    const phase = (c / copies) * Math.PI * 2;
    const swell = 1 + Math.sin((c / copies) * Math.PI) * 0.06;
    const dd = dRatio * swell;

    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2 * turns;
      const x = cx + (a * Math.cos(t + phase) + dd * Math.cos(ratio * t + phase)) * scale;
      const y = cy + (a * Math.sin(t + phase) - dd * Math.sin(ratio * t + phase)) * scale;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

function renderLayer(side: number, spec: RosetteSpec, color: string): HTMLCanvasElement {
  const off = document.createElement('canvas');
  off.width = side;
  off.height = side;
  const ctx = off.getContext('2d');
  if (ctx) traceRosette(ctx, side / 2, side / 2, side / 2 - 2, spec, color);
  return off;
}

function initGuilloche() {
  const host = document.querySelector<HTMLCanvasElement>('[data-guilloche]');
  if (!host) return;

  // Bail out entirely on low-core devices rather than gambling with their frame
  // budget — the page is designed to look finished without the canvas.
  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores <= 4) return;

  const ctx = host.getContext('2d', { alpha: true });
  if (!ctx) return;

  const brass = getComputedStyle(document.documentElement)
    .getPropertyValue('--brass')
    .trim() || '#c2a36b';

  let layerA: HTMLCanvasElement;
  let layerB: HTMLCanvasElement;
  let w = 0;
  let h = 0;
  let side = 0;
  let medallion = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  let running = false;
  let pointerX = 0;
  let pointerY = 0;

  // Where the rosette sits, as a fraction of the box. Offsetting it right on wide
  // screens keeps the engraving clear of the headline — it is a watermark behind
  // the type, not a thing the type has to compete with.
  const offsetX = Number(host.dataset.cx ?? '0.5');
  const sizeScale = Number(host.dataset.scale ?? '1');

  const build = () => {
    const rect = host.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;

    const small = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 2);

    w = rect.width;
    h = rect.height;
    host.width = Math.round(w * dpr);
    host.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Sized as a medallion rather than to the full diagonal, so it reads as an
    // engraved seal on the page instead of a full-bleed background.
    medallion =
      (small ? Math.min(w * 1.25, h * 1.1) : Math.min(w * 0.62, h * 1.5)) * sizeScale;
    cx = small ? w / 2 : w * offsetX;
    cy = h / 2;

    // Offscreen resolution is capped so memory stays bounded on large displays.
    side = Math.min(Math.round(medallion * dpr), small ? 700 : 1100);

    layerA = renderLayer(side, { p: 13, q: 5, d: 0.33, copies: 24, lineWidth: 1, alpha: 0.5 }, brass);
    layerB = renderLayer(side, { p: 17, q: 7, d: 0.25, copies: 30, lineWidth: 0.8, alpha: 0.38 }, brass);
    return true;
  };

  const paint = (t: number) => {
    ctx.clearRect(0, 0, w, h);

    // Counter-rotation at unequal speeds: the moiré between the two engravings
    // is what makes it feel alive without ever redrawing a single curve.
    const a1 = t * 0.000035 + pointerX * 0.06;
    const a2 = -t * 0.000052 + pointerY * 0.05;
    const d = medallion;

    ctx.save();
    // Additive blending builds the engraving out of light on ink; on parchment
    // that would bleach it out, so the strokes darken the page instead.
    ctx.globalCompositeOperation = isLight() ? 'multiply' : 'lighter';

    ctx.translate(cx, cy);
    ctx.rotate(a1);
    ctx.drawImage(layerA, -d / 2, -d / 2, d, d);
    ctx.rotate(a2 - a1);
    ctx.drawImage(layerB, -d / 2, -d / 2, d, d);

    ctx.restore();
  };

  const loop = (t: number) => {
    paint(t);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (running || reduceMotion()) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  if (!build()) return;

  if (reduceMotion()) {
    // Still engraved, simply not moving.
    paint(0);
  } else {
    start();
  }

  // Never burn frames on a tab nobody is looking at.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Pointer drift, a few degrees only — and never on touch, where there is no
  // hover state and the listener would just cost battery.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
        pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  let resizeTimer: number;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (build() && reduceMotion()) paint(0);
    }, 200);
  });

  // Re-render the bitmaps in the new accent when the palette flips.
  window.addEventListener('themechange', () => {
    window.setTimeout(() => {
      const next = getComputedStyle(document.documentElement)
        .getPropertyValue('--brass')
        .trim();
      if (next) {
        layerA = renderLayer(side, { p: 13, q: 5, d: 0.33, copies: 24, lineWidth: 1, alpha: 0.5 }, next);
        layerB = renderLayer(side, { p: 17, q: 7, d: 0.25, copies: 30, lineWidth: 0.8, alpha: 0.38 }, next);
        if (reduceMotion()) paint(0);
      }
    }, 30);
  });
}

/* -------------------------------------------------------------- scroll reveals */

function initReveals() {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!targets.length) return;

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target); // fire once; no thrash on scroll-back
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
  );

  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ theme */

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const current =
      root.getAttribute('data-theme') ??
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — the choice simply won't persist */
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });
}

/* ------------------------------------------------------------------- bootstrap */

export function initArt() {
  initTheme();
  initReveals();
  initGuilloche();
}
