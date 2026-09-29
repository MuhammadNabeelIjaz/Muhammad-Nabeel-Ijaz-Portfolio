import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import './Hero.css';
import heroReactImg from '../../assets/images/hero-react.webp';
import About from '../about/About';
import PortraitName, { PORTRAIT_NAME } from '../about/PortraitName';
import Education from '../education/Education';
import { addBackdropMotion } from '../backdrop/backdropMotion';
import portraitBgVideo from '../../assets/videos/about_bg.mp4';
import heroBgVideo from '../../assets/videos/hero-loop.mp4';

gsap.registerPlugin(ScrollTrigger);

// ── ScrollTrigger refresh order ──────────────────────────────────────────
// The Hero pin is re-created every time the layout mode flips (phone/tablet rotation, resizing the
// window across the breakpoints). The NEW trigger is then appended to the END of GSAP's list, i.e.
// after the Projects trigger. GSAP refreshes triggers in list order, so Projects measured its
// start BEFORE the Hero's long pin-spacer existed and pinned itself right after "About", on top of
// the Education cards. A higher refreshPriority makes the Hero always refresh first (Projects: 5,
// see Projects.jsx), whatever the creation order is.
const HERO_REFRESH_PRIORITY = 10;

// ── Layout modes (must match the media query in Hero.css) ────────────────
// Stacked: phones (≤768px) and portrait tablets → About text on top, picture above the cards.
// Side by side: desktop, laptop and landscape tablets → text/cards beside the picture.
const MQ_STACKED = '(max-width: 768px), (max-width: 1024px) and (max-aspect-ratio: 1/1)';
const MQ_SIDE_BY_SIDE = '(min-width: 1025px), (min-width: 769px) and (min-aspect-ratio: 10001/10000)';

// The background behind About → Education is drawn in code (see features/backdrop). The timeline below
// only reports its phase and scrubs the frame / splash drawing; no video is involved.

// Aligns the current portrait's head with where the previous portrait's head was
// (scale ≈1.27, values are % of the image's own box so it holds at every screen size).
// To nudge the picture: change the two translate % values; to resize it: change scale().
const HERO_PORTRAIT_FIT = 'translate(-12.77%, -6.48%) scale(1.27)';

// Size of the picture in the About phase only (1 = old size, 0.85 = 15% smaller). Education/Portrait phases unchanged.
const ABOUT_PICTURE_SCALE = 0.85;

// ── Picture placement helper ──────────────────────────────────────────────
// The portrait PNG has transparent margins; its *visible* part (hair … splash) spans
// these fractions of the PNG height. With HERO_PORTRAIT_FIT applied, the visible part
// sits at these fractions of the picture BOX (the plate).
const PNG_VIS_TOP = 0.137;
const PNG_VIS_BOTTOM = 0.98;
const FIT_SCALE = 1.27;
const FIT_TY = -0.0648;
const BOX_VIS_TOP = FIT_TY + FIT_SCALE * PNG_VIS_TOP;       // ≈ 0.109 of img height
const BOX_VIS_BOTTOM = FIT_TY + FIT_SCALE * PNG_VIS_BOTTOM; // ≈ 1.180 of img height
const NAV_H = 80; // --nav-height

// Returns { scale, y } (GSAP function values) that put the VISIBLE picture so that its
// bottom edge sits at `bottomFn(H)` px and its top never goes above `topMinFn(H)` px,
// on any screen size. `maxScale` is the scale you would like when there is enough room.
const makePose = (refs, yPercent, maxScale, bottomFn, topMinFn, centerIn = false) => {
  const calc = () => {
    const plate = refs.plate.current;
    const img = refs.img.current;
    const H = refs.box.current.clientHeight;
    const h = img.offsetHeight;   // layout height of the picture (not affected by transforms)
    const p = plate.offsetHeight; // layout height of the plate box
    const center = plate.offsetTop + p / 2 + (yPercent / 100) * p; // where the plate centre sits with y = 0
    let bottom = bottomFn(H);
    const topMin = topMinFn(H);
    const visH = (BOX_VIS_BOTTOM - BOX_VIS_TOP) * h;
    // never wider than the screen (visible picture width ≤ screen width − 16px)
    const visW = (BOX_VIS_RIGHT - BOX_VIS_LEFT) * img.offsetWidth;
    const widthCap = (refs.box.current.clientWidth - 16) / visW;
    const scale = Math.max(0.3, Math.min(maxScale, widthCap, (bottom - topMin) / visH));
    // centerIn: put the picture in the middle of the free band [topMin … bottom]
    if (centerIn) bottom = topMin + ((bottom - topMin) + scale * visH) / 2;
    const y = bottom - center - scale * (BOX_VIS_BOTTOM * h - p / 2);
    return { scale, y, bottom };
  };
  return { scale: () => calc().scale, y: () => calc().y, bottom: () => calc().bottom };
};
// Horizontal helpers (side-by-side layout). They keep the picture on screen and stop the
// picture and the cards from running into each other on narrower screens.
const FIT_TX = -0.1277;
const PNG_VIS_LEFT = 0.1027;
const PNG_VIS_RIGHT = 0.946;
const BOX_VIS_LEFT = FIT_TX + FIT_SCALE * PNG_VIS_LEFT;   // ≈ 0.003 of img width
const BOX_VIS_RIGHT = FIT_TX + FIT_SCALE * PNG_VIS_RIGHT; // ≈ 1.074 of img width
const makeXHelpers = (refs) => {
  const geo = () => ({
    W: refs.box.current.clientWidth,
    w: refs.img.current.offsetWidth,
    pw: refs.plate.current.offsetWidth,
    base: refs.plate.current.offsetLeft, // plate left edge when x = 0 and xPercent = 0
  });
  // visible picture edges, measured from `base + x`, when the plate is scaled by S about its centre
  const rightOff = (g, S) => g.pw / 2 + S * (BOX_VIS_RIGHT * g.w - g.pw / 2);
  const leftOff = (g, S) => g.pw / 2 + S * (BOX_VIS_LEFT * g.w - g.pw / 2);
  return {
    // picture on the RIGHT: wanted x = frac × screen width, but never let the picture leave the screen
    imgRight: (frac, pose) => () => {
      const g = geo();
      return Math.min(g.W * frac, g.W - 24 - g.base - rightOff(g, pose.scale()));
    },
    // card on the LEFT (next to a picture on the right): wanted x = frac × width, but stop before the picture
    cardLeft: (card, imgX, pose, frac) => () => {
      const g = geo();
      const x = Math.min(g.W * frac, g.base + imgX() + leftOff(g, pose.scale()) - 14 - (card.offsetLeft + card.offsetWidth));
      // never let the card (and its text) slide past the left edge of the screen
      return Math.max(x, 16 - card.offsetLeft);
    },
    // picture on the LEFT (next to a card on the right): wanted x = -30% width, but stop before the card
    imgLeft: (card, cardX, pose) => () => {
      const g = geo();
      const S = pose.scale();
      const stopBeforeCard = card.offsetLeft + cardX() - 14 - g.base - rightOff(g, S);
      const keepOnScreen = 8 - g.base - leftOff(g, S);
      return Math.max(keepOnScreen, Math.min(-0.3 * g.W, stopBeforeCard));
    },
  };
};
const bottomMargin = (H) => H - Math.max(14, H * 0.03); // picture's visible bottom, normal phases
const NAME_TOP_FRAC = 0.865;                            // where the typed name starts (of screen height)
const aboveName = (H) => H * NAME_TOP_FRAC - 8;         // picture bottom in Portrait phase
const belowNav = () => NAV_H + 14;

// Typed name under the picture (Portrait phase). `at` = offset (timeline units) from portraitStart.
const addPortraitName = (tl, portraitLabel, endLabel, pose) => {
  // If the picture ends up higher than the default name position (small screens), the name
  // is pulled up so it always sits right under the picture. It is never pushed down.
  const lift = () => {
    const el = document.querySelector('.hero-portrait-name');
    if (!el || !pose) return 0;
    return Math.min(0, pose.bottom() + 6 - el.offsetTop);
  };
  tl.fromTo('.hero-portrait-name', { autoAlpha: 0, y: () => lift() + 12 }, { autoAlpha: 1, y: () => lift(), duration: 0.5, ease: 'power2.out' }, `${portraitLabel}+=1.2`);
  // Typing: scroll progress → number of typed characters.
  const typed = { n: 0 };
  tl.to(typed, {
    n: PORTRAIT_NAME.length,
    duration: 1.7,
    ease: 'none',
    onUpdate: () => {
      const el = document.querySelector('.hero-portrait-typed-text');
      if (el) el.textContent = PORTRAIT_NAME.slice(0, Math.round(typed.n));
    },
  }, `${portraitLabel}+=1.4`);
  // gone again right before the Education phase starts
  tl.to('.hero-portrait-name', { autoAlpha: 0, y: () => lift() - 12, duration: 0.8 }, endLabel);
};

// Scroll-scrub a <video> between two timestamps while the timeline plays `duration` units.
// toSec === null  →  scrub all the way to the last frame.
const scrubVideo = (tl, video, fromSec, toSec, position, duration) => {
  if (!video) return;
  const proxy = { p: 0 };
  tl.to(proxy, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      if (video.readyState < 1) return;
      const d = video.duration;
      if (!d || isNaN(d)) return;
      const last = Math.max(0, d - 0.1);
      const end = toSec === null ? last : Math.min(toSec, last);
      video.currentTime = Math.max(0, fromSec + proxy.p * (end - fromSec));
    },
  }, position);
};

// The looping hero video belongs to the FIRST screen only. It lives inside the pinned container
// (which also holds About / Portrait / Education), so it is faded out together with the hero text
// and paused once invisible. Scrolling back up brings it back and plays it again.
const HERO_VIDEO_FADE = 1; // timeline units, same as the hero text fade
const fadeOutHeroVideo = (tl, video) => {
  if (!video) return;
  tl.to(video, { opacity: 0, duration: HERO_VIDEO_FADE, ease: 'none' }, 0);
};
// Call AFTER addBackdropMotion(): it chains onto the timeline's existing onUpdate instead of replacing it.
const pauseHeroVideoWhenHidden = (tl, video) => {
  if (!video) return;
  const prev = tl.eventCallback('onUpdate');
  tl.eventCallback('onUpdate', function () {
    if (prev) prev.apply(this, arguments);
    const hidden = tl.time() >= HERO_VIDEO_FADE;
    if (hidden && !video.paused) video.pause();
    else if (!hidden && video.paused) video.play().catch(() => { });
  });
};


// Lets the navbar / sidebar / footer jump to a phase of the pinned hero timeline (About, Education).
function registerHeroNav(st, tl, aboutLabel, eduLabel) {
  const at = (expr) => {
    const m = /^(\w+)(?:\+=([\d.]+))?$/.exec(expr);
    const t = (tl.labels[m[1]] ?? 0) + (m[2] ? parseFloat(m[2]) : 0);
    return st.start + (st.end - st.start) * Math.min(1, t / tl.duration());
  };
  window.__heroNav = { about: () => at(aboutLabel), education: () => at(eduLabel) };
}

const Hero = () => {
  const containerRef = useRef(null);
  const heroCopyRef = useRef(null);
  const portraitVideoRef = useRef(null);
  const heroVideoRef = useRef(null);
  const imageRef = useRef(null);
  const imgInnerRef = useRef(null);
  const projectsRef = useRef(null);
  const expRef = useRef(null);
  const awardsRef = useRef(null);
  const stepsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Text entrance (all screens) ───────────────────────────────────────
      gsap.fromTo(
        ['.hero-lede', '.hero-stats', '.hero-scroll-cue'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      );

      // ── Number counters ─────────────────────────────────────────────────
      const counters = { projects: 0, experience: 0, awards: 0 };
      gsap.to(counters, {
        projects: 40, experience: 1, awards: 8,
        duration: 2.5, ease: 'power3.out', delay: 1,
        onUpdate: () => {
          if (projectsRef.current) projectsRef.current.textContent = Math.round(counters.projects) + '+';
          if (expRef.current) expRef.current.textContent = Math.round(counters.experience);
          if (awardsRef.current) awardsRef.current.textContent = Math.round(counters.awards) + '+';
        },
      });

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════
      // ═══════════════════════════════════════════════════════════════════
      //  DESKTOP + LANDSCAPE TABLET  (picture beside the cards)
      // ═══════════════════════════════════════════════════════════════════
      mm.add(MQ_SIDE_BY_SIDE, () => {

        // Explicitly set BOTH yPercent and xPercent to prevent
        // properties bleeding when switching between mobile/desktop breakpoints.
        gsap.set(imageRef.current, { yPercent: -50, xPercent: 0 });
        gsap.set('.hero-about-section', { yPercent: -50 });
        gsap.set('.hero-portrait-name', { xPercent: -50 });

        // Image entrance — desktop only.
        // It now fades in exactly at the starting position of the scroll timeline
        const xStart = () => {
          const g = { W: containerRef.current.clientWidth, w: imgInnerRef.current.offsetWidth, pw: imageRef.current.offsetWidth, base: imageRef.current.offsetLeft };
          return Math.min(g.W * 0.08, g.W - 24 - g.base - (g.pw / 2 + (BOX_VIS_RIGHT * g.w - g.pw / 2))); // stays on screen
        };
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: xStart, y: '-2vh', rotationY: 0, scale: 1 },
          { opacity: 0.8, x: xStart, y: '-2vh', rotationY: 0, scale: 1, duration: 1.8, ease: 'power3.out', delay: 0.3 }
        );

        // Scroll timeline (ScrollTrigger is attached at the end, once the total
        // length is known, so the scroll speed stays the same as before).
        const tl = gsap.timeline();

        // Picture poses: y / scale are computed from the real screen size so the whole
        // visible picture (hair → splash) always stays on screen, on every laptop / desktop.
        const refs = { plate: imageRef, img: imgInnerRef, box: containerRef };
        const poseAbout = makePose(refs, -50, ABOUT_PICTURE_SCALE, (H) => bottomMargin(H) - (H * 0.15), belowNav);
        const posePortrait = makePose(refs, -50, 0.92, (H) => H * 0.78, (H) => Math.max(NAV_H + 10, H * 0.14), true);
        const poseEdu = makePose(refs, -50, 1, bottomMargin, belowNav);
        const poseEduLeft = makePose(refs, -50, 0.92, bottomMargin, () => NAV_H + 90);
        const X = makeXHelpers(refs);
        const xAbout = X.imgRight(0.02, poseAbout);
        const xEdu = X.imgRight(0.075, poseEdu);
        const card1X = X.cardLeft(stepsRef.current[0], xEdu, poseEdu, -0.02);
        const card2X = () => -0.04 * containerRef.current.clientWidth;
        const xEduLeft = X.imgLeft(stepsRef.current[1], card2X, poseEduLeft);
        const card3X = X.cardLeft(stepsRef.current[2], xEdu, poseEdu, -0.02);

        // Phase 1 — hero text fades up; image rotates and shifts right-ward slightly.
        // yPercent: -50 is kept constant so vertical centering is never lost.
        // immediateRender: false prevents snapping to from-state at timeline creation.
        tl.to(heroCopyRef.current, { opacity: 0, y: -80, duration: 1 }, 0);
        fadeOutHeroVideo(tl, heroVideoRef.current);
        tl.fromTo(
          imageRef.current,
          {
            yPercent: -50, xPercent: 0, x: xStart, y: '-2vh', opacity: 0.8,
            rotationY: 0, rotationX: 0, scale: 1,
            immediateRender: false,
          },
          {
            yPercent: -50, xPercent: 0, x: xAbout, y: poseAbout.y,
            opacity: 0.95, rotationY: -18, rotationX: 6, scale: poseAbout.scale,
            duration: 3.2, ease: 'none',
          },
          0
        );

        // Phase 1.5 — About Me (text on the LEFT, picture on the right)
        // The text is fully typed, read, and completely GONE before the picture starts to move.
        tl.add('aboutStart', 1.2);


        tl.fromTo('.hero-about-section', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 'aboutStart');
        tl.to('.hero-about-char', { opacity: 1, duration: 0.1, stagger: 0.012, ease: 'none' }, 'aboutStart+=0.2'); // typed by +1.8

        tl.add('aboutEnd', 'aboutStart+=2.4'); // text fully read → now it fades out
        tl.to('.hero-about-section', { autoAlpha: 0, y: -30, duration: 0.6, ease: 'none' }, 'aboutEnd'); // gone at +3.0

        // Phase 1.75 — Portrait (NO text). The square frame is drawn while the picture glides to the centre.
        // The glide starts only AFTER the About text is completely gone (+3.0 < +3.3).
        tl.add('portraitStart', 'aboutStart+=3.3');
        tl.to(imageRef.current, {
          xPercent: -50, x: 0,      // horizontally centred (left:50% anchor)
          yPercent: -50, y: posePortrait.y, // whole picture visible, room left below for the name
          rotationY: 0, rotationX: 0, scale: posePortrait.scale, opacity: 1,
          duration: 3, ease: 'power2.inOut',
        }, 'portraitStart');
        tl.add('portraitEnd', 'portraitStart+=4'); // portrait phase finished
        scrubVideo(tl, portraitVideoRef.current, 4.15, 10, 'portraitStart', 4);
        tl.to('.hero-portrait-video', { autoAlpha: 1, duration: 1 }, 'portraitStart');
        addPortraitName(tl, 'portraitStart', 'portraitEnd', posePortrait);

        // Phase 2 — "My Education" heading (starts only after the portrait phase ended)
        tl.add('eduStart', 'portraitEnd');
        tl.to('.hero-portrait-video', { autoAlpha: 0, duration: 1 }, 'eduStart');

        tl.to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }, 'eduStart');
        // centre → education position (whole picture on screen, splash not cut)
        tl.to(imageRef.current, { xPercent: 0, x: '-2vw', y: poseEdu.y, scale: poseEdu.scale, duration: 1, ease: 'none' }, 'eduStart');

        // Return the image angle smoothly over a longer duration so it matches the slow entrance speed
        tl.to(imageRef.current, { rotationY: 0, rotationX: 0, duration: 2.5, ease: 'none' }, 'eduStart');

        // In every step below the PICTURE moves first and the card fades in a little later,
        // so a card never appears on top of the picture.

        // ── Education 01: picture settles on the right, card on the left ──
        tl.add('edu01Start', 'eduStart+=1.2');
        tl.to(imageRef.current,
          { x: xEdu, y: poseEdu.y, scale: poseEdu.scale, opacity: 0.9, duration: 0.9, ease: 'none' },
          'edu01Start'
        );
        tl.fromTo(stepsRef.current[0],
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: card1X, duration: 0.9 },
          'edu01Start+=0.25'
        );

        // ── Transition 01 → 02 ──
        if (stepsRef.current.length > 1) {
          tl.add('edu02Start', 'edu01Start+=2.2');
          tl.to(stepsRef.current[0], { autoAlpha: 0, y: -28, duration: 0.8 }, 'edu02Start');

          // Education 02: picture slides LEFT first, then the (right-side) card appears
          tl.to(imageRef.current,
            { x: xEduLeft, y: poseEduLeft.y, scale: poseEduLeft.scale, rotationY: 14, opacity: 0.9, duration: 1.3, ease: 'power2.inOut' },
            'edu02Start'
          );
          tl.fromTo(stepsRef.current[1],
            { autoAlpha: 0, x: -40 },
            { autoAlpha: 1, x: card2X, duration: 1.0 },
            'edu02Start+=0.6'
          );
        }

        // ── Transition 02 → 03 ──
        if (stepsRef.current.length > 2) {
          tl.add('edu03Start', 'edu02Start+=2.2');
          tl.to(stepsRef.current[1], { autoAlpha: 0, y: -28, duration: 0.8 }, 'edu03Start');

          // Education 03: picture moves back right first, then the (left-side) card appears
          tl.to(imageRef.current,
            { x: xEdu, y: poseEdu.y, scale: poseEdu.scale, rotationY: 0, opacity: 1, duration: 1.3, ease: 'power2.inOut' },
            'edu03Start'
          );
          tl.fromTo(stepsRef.current[2],
            { autoAlpha: 0, x: -40 },
            { autoAlpha: 1, x: card3X, duration: 1.0 },
            'edu03Start+=0.6'
          );
        }

        // Background: brackets / square frame / splash are drawn by this same scroll timeline
        addBackdropMotion(tl, { about: 'aboutStart', portrait: 'portraitStart', edu: 'eduStart' });
        pauseHeroVideoWhenHidden(tl, heroVideoRef.current);

        // Pin + scrub. Scroll length = timeline length × 63.06% (was 700% for 11.1 units)
        const heroST = ScrollTrigger.create({
          animation: tl,
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + Math.round(tl.duration() * (700 / 11.1)) + '%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          refreshPriority: HERO_REFRESH_PRIORITY,
        });
        registerHeroNav(heroST, tl, 'aboutStart+=2', 'edu01Start+=1.2');
      });

      // ═══════════════════════════════════════════════════════════════════
      //  PHONES + PORTRAIT TABLETS  (picture above the cards)
      // ═══════════════════════════════════════════════════════════════════
      mm.add(MQ_STACKED, () => {

        // Clear the yPercent:-50 from desktop, and set xPercent:-50 for mobile centering.
        // Opacity is set here because CSS hides it initially to prevent loading flash
        // x/y reset explicitly so the CSS translate(-50%) is never counted twice (tablet fix).
        gsap.set(imageRef.current, { x: 0, y: 0, xPercent: -50, yPercent: 0, opacity: 0.85 });
        gsap.set('.hero-about-section', { yPercent: -50 });
        gsap.set('.hero-portrait-name', { xPercent: -50 });

        const tl = gsap.timeline();

        // Picture poses (y / scale computed from the real screen, so the whole visible picture
        // always fits and never runs under text or cards).
        const refs = { plate: imageRef, img: imgInnerRef, box: containerRef };
        const q = (sel) => containerRef.current.querySelector(sel);
        // bottom edge of the About text block (layout, not transformed)
        // top edge of the highest Education card, bottom edge of the "My Education" title
        const cardsTop = () => Math.min(...stepsRef.current.map((c) => c.offsetTop)) - 12;
        const titleBottom = () => { const el = q('.hero-section-title'); return el.offsetTop + el.offsetHeight + 16; };
        const MOB_MAX = 1.6; // largest scale we allow on small screens
        // Hero (first screen): text starts right under the navbar; the picture takes ALL the free
        // room below the text (bottom of the screen) and is bigger than before.
        const heroTextBottom = () => { const el = q('.hero-hero-left'); return el.offsetTop + el.offsetHeight + 4; };
        const poseHero = makePose(refs, 0, MOB_MAX, bottomMargin, heroTextBottom);
        // About Me: text sits at the BOTTOM of the screen, the picture floats above it.
        const ABOUT_TEXT_BOTTOM_GAP = (H) => Math.max(28, H * 0.09);
        const aboutTextY = () => { // extra y (px) that moves the text block (centred at 50%) to the bottom
          const el = q('.hero-about-section'); const H = containerRef.current.clientHeight;
          return (H - ABOUT_TEXT_BOTTOM_GAP(H) - el.offsetHeight / 2) - el.offsetTop;
        };
        const aboutTextTop = () => { const el = q('.hero-about-section'); const H = containerRef.current.clientHeight; return H - ABOUT_TEXT_BOTTOM_GAP(H) - el.offsetHeight - 10; };
        const poseAbout = makePose(refs, 0, 1.15 * ABOUT_PICTURE_SCALE, aboutTextTop, belowNav, true);
        const posePortrait = makePose(refs, 0, MOB_MAX, aboveName, belowNav, true);
        const poseEdu = makePose(refs, 0, MOB_MAX, cardsTop, titleBottom, true);

        // Phase 1 — text fades up; image rises from bottom to center.
        // xPercent: -50 held constant so horizontal centering never breaks.
        tl.to(heroCopyRef.current, { opacity: 0, y: -50, duration: 1 }, 0);
        fadeOutHeroVideo(tl, heroVideoRef.current);
        tl.fromTo(
          imageRef.current,
          {
            xPercent: -50, yPercent: 0, y: poseHero.y, opacity: 0.85,
            rotationY: 0, scale: poseHero.scale
          },
          {
            xPercent: -50, yPercent: 0, y: poseAbout.y, opacity: 1,
            rotationY: -8, scale: poseAbout.scale,
            duration: 1, ease: 'none',
          },
          0
        );

        // Phase 1.5 — About Me (text at the TOP, picture big below it)
        tl.add('mobAboutStart', '+=0.2');


        tl.fromTo('.hero-about-section', { autoAlpha: 0, y: () => aboutTextY() + 30 }, { autoAlpha: 1, y: aboutTextY, duration: 0.5 }, 'mobAboutStart');
        tl.to('.hero-about-char', { opacity: 1, duration: 0.1, stagger: 0.012, ease: 'none' }, 'mobAboutStart+=0.2'); // typed by +1.8

        // (as before) text centred over the picture; it fades away completely before the picture moves
        tl.to(imageRef.current, { rotationY: -4, duration: 2 }, 'mobAboutStart'); // gentle turn; picture stays above the text

        tl.add('mobAboutEnd', 'mobAboutStart+=2.6'); // text fully read → now it fades out
        tl.to('.hero-about-section', { autoAlpha: 0, y: () => aboutTextY() - 30, duration: 0.6, ease: 'none' }, 'mobAboutEnd'); // gone at +3.2

        // Phase 1.75 — Portrait (NO text). The square frame is drawn while the picture glides to the centre.
        // Starts only after the About text is completely gone (+3.2 < +4).
        tl.add('mobPortraitStart', 'mobAboutStart+=4');
        tl.to(imageRef.current, {
          y: posePortrait.y, scale: posePortrait.scale,
          rotationY: 0, opacity: 1,
          duration: 3, ease: 'power2.inOut',
        }, 'mobPortraitStart');
        tl.add('mobPortraitEnd', 'mobPortraitStart+=4'); // portrait phase finished
        scrubVideo(tl, portraitVideoRef.current, 4.15, 10, 'mobPortraitStart', 4);
        tl.to('.hero-portrait-video', { autoAlpha: 1, duration: 1 }, 'mobPortraitStart');
        addPortraitName(tl, 'mobPortraitStart', 'mobPortraitEnd', posePortrait);

        // Phase 2 — cards & My Education title (starts only after the portrait phase ended).
        tl.add('mobEduStart', 'mobPortraitEnd+=0.2');
        tl.to('.hero-portrait-video', { autoAlpha: 0, duration: 1 }, 'mobEduStart');

        tl.to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }, 'mobEduStart');
        // Picture moves ABOVE the cards (between the title and the card), fully visible.
        tl.to(imageRef.current, {
          xPercent: -50, yPercent: 0, x: 0,
          y: poseEdu.y, scale: poseEdu.scale,
          opacity: 1, rotationY: 0,
          duration: 1, ease: 'power2.inOut',
        }, 'mobEduStart');

        stepsRef.current.forEach((step, i) => {
          tl.fromTo(step, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.9 }, '+=0.25');
          if (i !== stepsRef.current.length - 1) {
            tl.to(step, { autoAlpha: 0, y: -28, duration: 0.8 }, '+=0.9');
          }
        });

        // Background: brackets / square frame / splash are drawn by this same scroll timeline
        addBackdropMotion(tl, { about: 'mobAboutStart', portrait: 'mobPortraitStart', edu: 'mobEduStart' });
        pauseHeroVideoWhenHidden(tl, heroVideoRef.current);

        // Pin + scrub. Scroll length = timeline length × 33.18% (was 700% for 21.1 units)
        const heroSTm = ScrollTrigger.create({
          animation: tl,
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + Math.round(tl.duration() * (700 / 21.1)) + '%',
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          refreshPriority: HERO_REFRESH_PRIORITY,
        });
        registerHeroNav(heroSTm, tl, 'mobAboutStart+=2', 'mobEduStart+=2');
      });
    }, containerRef);

    // The picture's size drives the placement maths → re-measure once it has loaded.
    const picture = imgInnerRef.current;
    const onPictureLoad = () => ScrollTrigger.refresh();
    if (picture && !picture.complete) picture.addEventListener('load', onPictureLoad);

    // Refresh ScrollTrigger on resize to fix overlap issues when resizing window
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
      if (picture) picture.removeEventListener('load', onPictureLoad);
    };
  }, []);

  return (
    <section id="about" ref={containerRef} className="hero-container">



      {/* ── Animated gradient orbs & Video ──────────────────────────────── */}
      <div className="hero-backdrop" aria-hidden="true">
        <video
          ref={heroVideoRef}
          className="hero-bg-video"
          src={heroBgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      {/* ── Hero image container ──────────────────────────────────────────────
           CSS sets top/right layout only.
           ALL transforms (translate, rotate, scale) are GSAP-owned on the wrapper. */}
      <div
        ref={imageRef}
        className="hero-plate"
        aria-hidden="true"
      >
        {/* The portrait asset is 896×1114 (2× of the original 448×557 box). `srcSet` with a
            single "2x" candidate makes the browser treat its natural size as 448×557, so the
            plate keeps exactly the same box (and every GSAP position) as before.
            The new picture has more empty space around the subject, so the subject is
            scaled/shifted inside that box (HERO_PORTRAIT_FIT) to sit exactly where the
            previous portrait was; only transparent splash edges overflow the box. */}
        <img
          ref={imgInnerRef}
          srcSet={`${heroReactImg} 2x`}
          alt="Creative Developer"
          style={{
            width: '100%', height: 'auto', display: 'block',
            willChange: 'opacity', mixBlendMode: 'multiply',
            transformOrigin: '0 0', transform: HERO_PORTRAIT_FIT,
          }}
        />
      </div>

      {/* ── Hero copy ───────────────────────────────────────────────
           Fades out during scroll sequence.
           Scroll cue lives inside here so it exits with the copy. */}
      <div ref={heroCopyRef} className="hero-hero-content">
        <div className="hero-hero-left">

          <div className="hero-lede">
            <span className="hero-tag">Portfolio</span>
            <h1>Hi, I'm Muhammad<br />Nabeel Ijaz.</h1>
            <p>
              AI Engineer, Full-Stack Developer (MERN & Laravel), Generative AI & Agentic Systems — LangChain, LangGraph, RAG (IBM Certified), Cloud & DevOps (AWS, Docker).
            </p>
            <div className="hero-cta-group" style={{ position: 'relative', zIndex: 9999, pointerEvents: 'auto' }}>
              <button onClick={(e) => { e.preventDefault(); const t = document.getElementById('work'); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset, behavior: 'smooth' }); }} className="btn-primary" style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                View Projects <ArrowRight size={17} />
              </button>
              <button onClick={(e) => { e.preventDefault(); const t = document.getElementById('contact'); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset, behavior: 'smooth' }); }} className="btn-secondary" style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                Get in touch
              </button>
            </div>
            <p className="hero-note">Available for freelance opportunities.</p>
            <div className="hero-social-links">
              <a href="https://github.com/MuhammadNabeelIjaz" aria-label="GitHub" target="_blank" rel="noreferrer">
                <FaGithub size={22} />
              </a>
              <a href="https://linkedin.com/in/muhammadnabeelijaz" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <FaLinkedin size={22} />
              </a>
              <a href="https://www.instagram.com/muhammadnabeelijaz" aria-label="Instagram" target="_blank" rel="noreferrer">
                <FaInstagram size={22} />
              </a>
              <a href="https://www.facebook.com/muhammadnabeelijaz1" aria-label="Facebook" target="_blank" rel="noreferrer">
                <FaFacebook size={22} />
              </a>
              <a href="https://wa.me/+923047662828" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                <FaWhatsapp size={22} />
              </a>
            </div>
          </div>

          <div className="hero-stats hero-lede">
            <div className="stat-item">
              <h2 ref={projectsRef}>0+</h2>
              <span>projects shipped</span>
            </div>
            <div className="stat-item">
              <h2 ref={expRef}>0</h2>
              <span>years experience</span>
            </div>
            <div className="stat-item">
              <h2 ref={awardsRef}>0+</h2>
              <span>certificates</span>
            </div>
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="hero-scroll-line" />
            <span>Scroll</span>
          </div>

        </div>
      </div>

      <About />
      <PortraitName />
      <Education stepsRef={stepsRef} />

      {/* ── Background Video for Portrait ── */}
      <video
        ref={portraitVideoRef}
        className="hero-portrait-video"
        src={portraitBgVideo}
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      />
    </section>
  );
};

export default Hero;
