// Procedural art for the code-drawn background.
// Everything here is a pure function of a seed, so the drawing is identical on every load and
// weighs a few KB instead of megabytes of video. All coordinates live in a 0-100 box; the
// components scale that box with `vmin`, so the art fits every phone, tablet and monitor.

// Small seeded random generator (mulberry32)
export const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const f = (n) => n.toFixed(2);

// Smooth, slightly irregular closed blob (Catmull-Rom converted to cubic beziers)
export function blobPath(cx, cy, r, jitter, n, rand) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 - jitter + rand() * jitter * 2);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// Ink / watercolor splash: layered blobs, thin rays with a drop at the tip, flying droplets
export function splat({ cx = 50, cy = 50, r = 14, seed = 1, rays = 22, dots = 34 }) {
  const rand = rng(seed);
  const blobs = [
    { d: blobPath(cx, cy, r, 0.28, 11, rand), o: 0.5 },
    { d: blobPath(cx + r * 0.1, cy - r * 0.05, r * 0.72, 0.3, 9, rand), o: 0.5 },
    { d: blobPath(cx - r * 0.15, cy + r * 0.1, r * 0.4, 0.35, 8, rand), o: 0.6 },
  ];
  const rayList = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2 + rand() * 0.25;
    const len = r * (1.1 + rand() * 0.85);
    return {
      x0: cx + Math.cos(a) * r * 0.7,
      y0: cy + Math.sin(a) * r * 0.7,
      x1: cx + Math.cos(a) * len,
      y1: cy + Math.sin(a) * len,
      w: 0.3 + rand() * 0.55,
      drop: rand() > 0.4 ? 0.3 + rand() * 0.8 : 0,
    };
  });
  const dotList = Array.from({ length: dots }, () => {
    const a = rand() * Math.PI * 2;
    const dist = r * (1.1 + rand() * 1.9);
    return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, r: 0.2 + rand() * rand() * 1.3, o: 0.3 + rand() * 0.5 };
  });
  return { blobs, rays: rayList, dots: dotList };
}

// Loose scatter of tiny paper specks
export function specks(seed, count, box = [0, 0, 100, 100]) {
  const rand = rng(seed);
  return Array.from({ length: count }, () => ({
    x: box[0] + rand() * box[2],
    y: box[1] + rand() * box[3],
    r: 0.15 + rand() * rand() * 0.7,
    o: 0.25 + rand() * 0.45,
  }));
}

// Leafy sprig along a curved stem. Returns the stem path and the leaves to draw.
export function sprig({ seed = 1, leaves = 9, len = 60, bend = 0.3 }) {
  const rand = rng(seed);
  const p0 = [0, 0];
  const p1 = [len * 0.45, -len * bend];
  const p2 = [len, -len * bend * 0.35];
  const at = (t) => {
    const u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    return { x, y, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
  };
  const list = [];
  for (let i = 0; i < leaves; i++) {
    const t = 0.12 + (i / leaves) * 0.8;
    const p = at(t);
    const side = i % 2 ? 1 : -1;
    list.push({
      x: p.x,
      y: p.y,
      a: p.ang + side * (32 + rand() * 26),
      s: (1.25 - t * 0.55) * (0.85 + rand() * 0.3),
    });
  }
  const tip = at(1);
  list.push({ x: tip.x, y: tip.y, a: tip.ang, s: 0.65 });
  return { stem: `M0,0 Q${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}`, leaves: list };
}

// Leaf outline (pointing along +x, ~12 units long at scale 1)
export const LEAF = 'M0,0 C3,-3.4 9,-3.8 12.5,0 C9,3.8 3,3.4 0,0Z';

// Wireframe solids (isometric-style) for the education scene
export const cube = (cx, cy, s) => {
  const v = [-90, -30, 30, 90, 150, 210].map((d) => [cx + Math.cos((d * Math.PI) / 180) * s, cy + Math.sin((d * Math.PI) / 180) * s]);
  const hex = `M${v.map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z`;
  const inner = `M${f(cx)},${f(cy)}L${f(v[1][0])},${f(v[1][1])}M${f(cx)},${f(cy)}L${f(v[3][0])},${f(v[3][1])}M${f(cx)},${f(cy)}L${f(v[5][0])},${f(v[5][1])}`;
  return { outline: hex + inner, facet: `M${f(cx)},${f(cy)}L${f(v[1][0])},${f(v[1][1])}L${f(v[0][0])},${f(v[0][1])}L${f(v[5][0])},${f(v[5][1])}Z` };
};
export const tetra = (cx, cy, s) => {
  const a = [cx, cy - s];
  const b = [cx + s * 0.87, cy + s * 0.5];
  const c = [cx - s * 0.87, cy + s * 0.5];
  const m = [cx + s * 0.12, cy + s * 0.12];
  const P = (p) => `${f(p[0])},${f(p[1])}`;
  return { outline: `M${P(a)}L${P(b)}L${P(c)}Z M${P(a)}L${P(m)}M${P(b)}L${P(m)}M${P(c)}L${P(m)}`, facet: `M${P(a)}L${P(m)}L${P(c)}Z` };
};
export const octa = (cx, cy, s) => {
  const t = [cx, cy - s];
  const r = [cx + s * 0.8, cy];
  const b = [cx, cy + s];
  const l = [cx - s * 0.8, cy];
  const m = [cx + s * 0.2, cy + s * 0.12];
  const P = (p) => `${f(p[0])},${f(p[1])}`;
  return { outline: `M${P(t)}L${P(r)}L${P(b)}L${P(l)}Z M${P(l)}L${P(m)}L${P(r)}M${P(t)}L${P(m)}L${P(b)}`, facet: `M${P(t)}L${P(r)}L${P(m)}Z` };
};
