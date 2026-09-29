import React, { useEffect, useRef } from 'react';
import './Backdrop.css';
import { blobPath, rng, splat, specks, sprig, LEAF, cube, tetra, octa } from './art';
import { getHeroPhase, onHeroPhase } from './backdropState';

// ─────────────────────────────────────────────────────────────────────────────
// Code-drawn watercolor background (replaces the old background videos).
//
//   hero      quiet paper with a few sand blots
//   about     ink brackets that hug the screen corners, drawn by scroll
//   portrait  square frames drawn around the picture + green splash blooming behind it
//   edu       sketched wireframe solids in two corners, everything else stays clear for the cards
//   projects  calm paper mount: hairline frame + soft arcs
//   botanical leaf sprigs + gold wave (Skills, Certificates)
//   floral    blue / peach flowers, gold frame (Contact)
//   quiet     paper only (Gallery, Milestones bring their own backgrounds)
//
// Every drawing uses a 0-100 box scaled by `vmin`, so the same code fits phones, tablets and
// desktops. Only the frame / splash / solids are animated by scroll (see backdropMotion.js);
// scene changes are simple opacity cross-fades.
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_SCENES = [
  ['#work', 'projects'],
  ['#skills', 'botanical'],
  ['#certificates-gallery', 'botanical'],
  ['#gallery-showcase', 'about'],
  ['#journey-section', 'about'],
  ['#milestones-section', 'about'],
  ['#newsletter-cta', 'about'],
  ['#contact', 'about'],
];

// which scene is showing right now?
function pickScene() {
  const line = window.innerHeight * 0.5;
  let scene = getHeroPhase();
  for (const [selector, name] of SECTION_SCENES) {
    const el = document.querySelector(selector);
    if (el && el.getBoundingClientRect().top <= line) scene = name;
  }
  return scene;
}

// ── Static art (computed once) ───────────────────────────────────────────────
const HERO_BLOB_A = blobPath(70, 30, 26, 0.3, 11, rng(3));
const HERO_BLOB_B = blobPath(44, 12, 13, 0.35, 9, rng(5));
const HERO_BLOB_C = blobPath(28, 76, 24, 0.3, 11, rng(9));
const HERO_SPECKS = specks(11, 26);

const EDU_SPLAT_A = splat({ cx: 26, cy: 72, r: 11, seed: 21, rays: 16, dots: 22 });
const EDU_SPLAT_B = splat({ cx: 74, cy: 30, r: 10, seed: 33, rays: 14, dots: 20 });

const CUBE_A = cube(34, 54, 24);
const TETRA_A = tetra(70, 66, 22);
const OCTA_A = octa(62, 34, 22);
const CUBE_B = cube(30, 68, 20);

const SPRIG_A = sprig({ seed: 4, leaves: 10, len: 74, bend: 0.32 });
const SPRIG_B = sprig({ seed: 8, leaves: 8, len: 60, bend: 0.28 });
const SPRIG_C = sprig({ seed: 13, leaves: 9, len: 66, bend: 0.3 });

const PETALS = 6;

// ── Reusable drawing pieces ──────────────────────────────────────────────────
const Splat = ({ data, tone = 'green', className }) => (
  <g className={className} filter="url(#bd-rough)">
    {data.blobs.map((b, i) => (
      <path key={i} d={b.d} className={`f-${tone} s-${tone}`} fillOpacity={b.o} strokeOpacity=".4" strokeWidth=".3" />
    ))}
    {data.rays.map((r, i) => (
      <g key={i}>
        <line x1={r.x0} y1={r.y0} x2={r.x1} y2={r.y1} className={`s-${tone}`} strokeOpacity=".6" strokeWidth={r.w} strokeLinecap="round" />
        {r.drop > 0 && <circle cx={r.x1} cy={r.y1} r={r.drop} className={`f-${tone}`} fillOpacity=".65" />}
      </g>
    ))}
    {data.dots.map((d, i) => (
      <circle key={i} cx={d.x} cy={d.y} r={d.r} className={`f-${tone}`} fillOpacity={d.o} />
    ))}
  </g>
);

const Specks = ({ data }) => (
  <g>
    {data.map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} className="f-line" fillOpacity={s.o} />
    ))}
  </g>
);

const Flower = ({ x, y, r, tone, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {Array.from({ length: PETALS }).map((_, i) => (
      <ellipse key={`o${i}`} cx="0" cy={-r * 0.55} rx={r * 0.44} ry={r * 0.64} transform={`rotate(${(i * 360) / PETALS})`} className={`f-${tone} s-${tone}`} fillOpacity=".5" strokeOpacity=".55" strokeWidth=".2" />
    ))}
    {Array.from({ length: PETALS }).map((_, i) => (
      <ellipse key={`i${i}`} cx="0" cy={-r * 0.32} rx={r * 0.26} ry={r * 0.38} transform={`rotate(${(i * 360) / PETALS + 30})`} className={`f-${tone}`} fillOpacity=".35" />
    ))}
    <circle r={r * 0.14} className="f-gold" fillOpacity=".85" />
  </g>
);

const Sprig = ({ data, x, y, rot = 0, tone = 'sage' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={data.stem} fill="none" className="s-sage" strokeOpacity=".7" strokeWidth=".45" />
    {data.leaves.map((l, i) => (
      <path key={i} d={LEAF} transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.a.toFixed(1)}) scale(${l.s.toFixed(2)})`} className={`f-${tone} s-${tone}`} fillOpacity=".5" strokeOpacity=".7" strokeWidth=".22" />
    ))}
  </g>
);

const Solid = ({ shape, facet }) => (
  <>
    {facet && <path d={shape.facet} className="f-green" fillOpacity=".3" stroke="none" filter="url(#bd-rough)" />}
    <path className="bd-draw s-line" pathLength="1" d={shape.outline} strokeWidth=".32" />
  </>
);

const Backdrop = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const scene = pickScene();
      if (root.dataset.scene !== scene) root.dataset.scene = scene;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    const off = onHeroPhase(schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      off();
    };
  }, []);

  return (
    <div className="bd" ref={rootRef} data-scene="hero" aria-hidden="true">
      {/* shared filters: rough watercolor edge */}
      <svg width="0" height="0" style={{ position: 'absolute' }} focusable="false">
        <defs>
          <filter id="bd-rough" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="0.22" />
          </filter>
          <filter id="bd-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="1.6" />
          </filter>
        </defs>
      </svg>

      <div className="bd-paper" />
      <div className="bd-wash bd-w-sand" />
      <div className="bd-wash bd-w-sage" />

      {/* ── hero ─────────────────────────────────────────────── */}
      <div className="bd-scene bd-hero">
        <svg className="bd-corner bd-corner--tr" viewBox="0 0 100 100">
          <path d={HERO_BLOB_A} className="f-sand" fillOpacity=".3" filter="url(#bd-soft)" />
          <path d={HERO_BLOB_B} className="f-sand" fillOpacity=".25" filter="url(#bd-soft)" />
          <Specks data={HERO_SPECKS} />
        </svg>
        <svg className="bd-corner bd-corner--bl" viewBox="0 0 100 100">
          <path d={HERO_BLOB_C} className="f-sand" fillOpacity=".26" filter="url(#bd-soft)" />
        </svg>
      </div>

      {/* ── about: ink brackets ──────────────────────────────── */}
      <div className="bd-scene bd-about">
        <div className="bd-wash bd-w-about-a" />
        <div className="bd-wash bd-w-about-b" />
      </div>

      {/* ── portrait: square frames + splash ─────────────────── */}
      <div className="bd-scene bd-portrait">
        <div className="bd-wash bd-w-portrait" />
      </div>

      {/* ── education: two quiet corners ─────────────────────── */}
      <div className="bd-scene bd-edu">
        <div className="bd-wash bd-w-edu" />
        <svg className="bd-corner bd-corner--bl bd-corner--wide" viewBox="0 0 100 100">
          <Splat data={EDU_SPLAT_A} className="bd-static" />
          <Solid shape={CUBE_B} facet />
          <Solid shape={TETRA_A} />
        </svg>
        <svg className="bd-corner bd-corner--tr bd-corner--wide" viewBox="0 0 100 100">
          <Splat data={EDU_SPLAT_B} className="bd-static" />
          <Solid shape={OCTA_A} facet />
          <Solid shape={CUBE_A} />
        </svg>
      </div>

      {/* ── projects: calm paper mount ───────────────────────── */}
      <div className="bd-scene bd-projects">
        <div className="bd-wash bd-w-projects-a" />
        <div className="bd-wash bd-w-projects-b" />
      </div>

      {/* ── botanical: skills + certificates ─────────────────── */}
      <div className="bd-scene bd-botanical">
        <div className="bd-wash bd-w-bot-a" />
        <div className="bd-wash bd-w-bot-b" />
        <svg className="bd-corner bd-corner--bl bd-rise" viewBox="0 0 100 100">
          <Sprig data={SPRIG_A} x={4} y={98} rot={-20} />
          <Sprig data={SPRIG_B} x={-2} y={84} rot={-52} tone="green" />
        </svg>
        <svg className="bd-corner bd-corner--tr bd-rise" viewBox="0 0 100 100">
          <Sprig data={SPRIG_C} x={96} y={2} rot={160} />
          <Sprig data={SPRIG_B} x={104} y={20} rot={128} tone="green" />
        </svg>
        <svg className="bd-wave" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M0,12 C30,2 50,18 80,10 S130,2 160,11 S190,14 200,8" className="s-gold" strokeWidth=".7" vectorEffect="non-scaling-stroke" strokeOpacity=".75" />
          <path d="M0,15 C34,7 56,19 88,13 S136,6 166,14 S192,16 200,12" className="s-line" strokeWidth=".6" vectorEffect="non-scaling-stroke" strokeOpacity=".5" />
        </svg>
      </div>

      {/* ── floral: contact ──────────────────────────────────── */}
      <div className="bd-scene bd-floral">
        <div className="bd-wash bd-w-fl-blue" />
        <div className="bd-wash bd-w-fl-sage" />
        <div className="bd-wash bd-w-fl-peach" />
        <div className="bd-inset bd-inset--gold-a" />
        <div className="bd-inset bd-inset--gold-b" />
        <svg className="bd-corner bd-corner--bl bd-corner--flower bd-rise" viewBox="0 0 100 100">
          <Sprig data={SPRIG_A} x={2} y={92} rot={-26} />
          <Sprig data={SPRIG_B} x={6} y={100} rot={-62} tone="green" />
          <Flower x={26} y={78} r={12} tone="blue" rot={10} />
          <Flower x={50} y={88} r={10.5} tone="peach" rot={40} />
          <Flower x={10} y={92} r={8} tone="blue" rot={-20} />
        </svg>
        <svg className="bd-corner bd-corner--br bd-corner--flower bd-rise" viewBox="0 0 100 100">
          <Sprig data={SPRIG_C} x={98} y={94} rot={-152} />
          <Flower x={76} y={82} r={12} tone="peach" rot={-14} />
          <Flower x={92} y={90} r={9} tone="blue" rot={22} />
        </svg>
      </div>
    </div>
  );
};

export default Backdrop;
