import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { journeyGraph } from '../../data/journey';
import Milestones from '../milestones/Milestones';


const JOURNEY_GRAPH = journeyGraph;

export default function Journey() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const nodeRefs = useRef({});
  const [activeNodes, setActiveNodes] = useState(new Set(['root']));
  const [isMounted, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);

  // Trigger initial intro animations via scroll position instead of intersection observer
  // to ensure it only starts typing when the ink drop has fully covered the background.
  useEffect(() => {
    // We'll set isMounted in the updateAnimations loop based on scroll position
  }, []);

  // Register refs for all text nodes
  const setRef = useCallback((id) => (el) => {
    if (el) nodeRefs.current[id] = el;
  }, []);

  const updateAnimations = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scrollDistance = containerRect.height - window.innerHeight;
    const scrolled = -containerRect.top;

    // --- ALBUM FADE ANIMATION ---
    // Hide the album pictures faster so they don't overlap the graph
    const fadeOutDistance = window.innerHeight * 0.45;
    const albumOp = Math.max(0, 1 - (scrolled / fadeOutDistance));
    const albumEl = document.getElementById('intro-album');
    if (albumEl) {
      albumEl.style.opacity = albumOp;
      albumEl.style.pointerEvents = albumOp > 0 ? 'auto' : 'none';
    }

    // --- GRAPH PROGRESS ---
    // Start graph progress only after typing animation is finished (0.45 + 0.5 = 0.95)
    const graphStartOffset = window.innerHeight * 0.95;
    const graphScrollDistance = scrollDistance - graphStartOffset;
    let p = graphScrollDistance > 0 ? (scrolled - graphStartOffset) / graphScrollDistance : 0;
    p = Math.max(0, Math.min(p, 1)); // Clamp 0 to 1


    // --- INK DROP ANIMATION ---
    // Start animating when the new section is 20% visible from the bottom 
    // (i.e. 80% of the upper component is scrolled)
    // The ink should expand slowly so it finishes right when the pictures start arriving
    const bgStartOffset = -window.innerHeight * 0.8;
    const bgExpandDistance = window.innerHeight * 2.5;
    const bgProgress = Math.max(0, Math.min((scrolled - bgStartOffset) / bgExpandDistance, 1));

    const drops = [
      { id: 'ink-drop-1', delay: 0, x: '90vw', y: '10vh' },
      { id: 'ink-drop-2', delay: 0.1, x: '80vw', y: '15vh' },
      { id: 'ink-drop-3', delay: 0.2, x: '70vw', y: '40vh' },
      { id: 'ink-drop-4', delay: 0.15, x: '50vw', y: '50vh' },
      { id: 'ink-drop-5', delay: 0.3, x: '30vw', y: '85vh' },
      { id: 'ink-drop-6', delay: 0.4, x: '10vw', y: '90vh' },
      { id: 'ink-drop-7', delay: 0.25, x: '20vw', y: '30vh' },
      { id: 'ink-drop-8', delay: 0.05, x: '60vw', y: '80vh' },
    ];

    drops.forEach(drop => {
      const dropEl = document.getElementById(drop.id);
      if (dropEl) {
        let pBg = (bgProgress - drop.delay) / (1 - drop.delay);
        pBg = Math.max(0, Math.min(pBg, 1));
        // Exponential expansion to simulate ink spreading rapidly
        const s = pBg > 0 ? Math.pow(pBg, 2) * 20 : 0;
        dropEl.style.transform = `translate(${drop.x}, ${drop.y}) scale(${s})`;
      }
    });

    // Start text animation strictly when the section is fully pinned (scrolled >= 0)
    if (scrolled >= window.innerHeight * 0.45) {
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        setIsMounted(true);
      }
    } else {
      if (isMountedRef.current) {
        isMountedRef.current = false;
        setIsMounted(false);
        setActiveNodes(new Set(['root']));
      }
    }

    // --- SCRUBBED TYPING ANIMATION ---
    const typingProgress = Math.max(0, Math.min((scrolled - window.innerHeight * 0.45) / (window.innerHeight * 0.5), 1));
    const s1 = "Muhammad";
    const s2 = "Nabeel Ijaz";
    const s3 = "Journey: 2004 — 2026";
    
    const el1 = document.getElementById("journey-type-1");
    if (el1) {
      let pt = Math.max(0, Math.min(typingProgress / 0.3, 1));
      el1.textContent = s1.slice(0, Math.round(pt * s1.length));
    }
    const el2 = document.getElementById("journey-type-2");
    if (el2) {
      let pt = Math.max(0, Math.min((typingProgress - 0.3) / 0.4, 1));
      el2.textContent = s2.slice(0, Math.round(pt * s2.length));
    }
    const el3 = document.getElementById("journey-type-3");
    if (el3) {
      let pt = Math.max(0, Math.min((typingProgress - 0.7) / 0.3, 1));
      el3.textContent = s3.slice(0, Math.round(pt * s3.length));
    }

    // Split progress: 0 to 0.75 for horizontal scroll, 0.75 to 1.0 for zoom explosion
    const HORIZ_END = 0.75;
    let horizP = Math.min(p / HORIZ_END, 1);
    let zoomP = Math.max(0, (p - HORIZ_END) / (1 - HORIZ_END));

    // Define getCenter and contentRect early so we can use them for maxTranslate
    const contentRect = contentRef.current.getBoundingClientRect();
    const getCenter = (id) => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const rect = el.getBoundingClientRect();

      return {
        x: rect.left - contentRect.left + rect.width / 2,
        y: rect.top - contentRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        right: rect.right - contentRect.left
      };
    };

    const contentWidth = contentRef.current.clientWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;

    // Calculate max translation using the exact center of the zoom parent
    // We want the zoom parent's center to be at viewportWidth / 2
    let maxTranslate = Math.max(0, contentWidth - viewportWidth);
    const zoomParentPos = getCenter('zoom-parent');
    if (zoomParentPos) {
      maxTranslate = Math.max(0, zoomParentPos.x - (viewportWidth / 2));
    }

    const tx = horizP * maxTranslate;

    contentRef.current.style.transform = `translate3d(-${tx}px, 0, 0)`;

    // --- ANIMATE ZOOM WINDOW ---
    const zoomWindow = document.getElementById('zoom-window');
    const zoomImage = document.getElementById('zoom-image');
    const zoomDot = document.getElementById('zoom-dot');
    const zoomLearningText = document.getElementById('zoom-learning-text');

    if (zoomWindow) {
      const w = 300 + zoomP * (viewportWidth - 300);
      const h = 400 + zoomP * (viewportHeight - 400);
      const r = 200 * (1 - zoomP);
      if (zoomP >= 0.985) {
        // fully open: cover the whole sticky viewport (svh) with a 2px bleed so no dark ink line shows at the edges
        zoomWindow.style.width = `${viewportWidth + 2}px`;
        zoomWindow.style.height = 'calc(100svh + 2px)';
        zoomWindow.style.borderRadius = '0px';
      } else {
        zoomWindow.style.width = `${w}px`;
        zoomWindow.style.height = `${h}px`;
        zoomWindow.style.borderRadius = `${r}px`;
      }
    }

    if (zoomImage) {
      const s = 3.5 - (zoomP * 2.5);
      zoomImage.style.transform = `scale(${s})`;
    }

    // Fade out the center dot and learning text as soon as zoom starts
    const hideOp = Math.max(0, 1 - (zoomP * 4)); // fade out very quickly
    if (zoomDot) zoomDot.style.opacity = hideOp;
    if (zoomLearningText) zoomLearningText.style.opacity = hideOp;

    // Dispatch custom event to Navbar so it switches back to light theme when zoomed in (expanded)
    window.dispatchEvent(new CustomEvent('zoom-theme-update', {
      detail: { isZoomed: zoomP > 0.5 }
    }));

    // Fade the solid background in as the window opens so nothing from the journey shows through
    // The dark ink layer is fully covered once the window is completely open; hide it so it can never peek out
    // as a black line between Achievements and Snapshots (restored when scrolling back up).
    const inkLayer = document.getElementById('journey-ink');
    if (inkLayer) inkLayer.style.opacity = zoomP >= 0.985 ? '0' : '';

    const zoomBg = document.getElementById('zoom-bg');
    if (zoomBg) {
      // Hide zoomBg when fully expanded so the global fixed Backdrop shows through.
      // This prevents a visible line from appearing when scrolling down to the next section.
      zoomBg.style.opacity = zoomP >= 0.985 ? '0' : Math.min(1, zoomP * 6);
    }

    // Fade out every journey layer (lines, name, branch photos/titles) while the window opens,
    // so the journey never shows behind the Achievements section
    const journeyFade = zoomP > 0 ? String(Math.max(0, 1 - zoomP * 4)) : '';
    document.querySelectorAll('.journey-fade').forEach((el) => { el.style.opacity = journeyFade; });

    const zoomMilestones = document.getElementById('zoom-milestones');
    if (zoomMilestones) {
      // Fade in Milestones in the last 20% of the zoom
      let milestonesOp = Math.max(0, (zoomP - 0.8) / 0.2);
      zoomMilestones.style.opacity = milestonesOp;
      zoomMilestones.style.pointerEvents = zoomP > 0.95 ? 'auto' : 'none';
    }

    // --- DRAW LINES ---
    const rootPos = getCenter('root');
    if (!rootPos) return;

    const spineStartX = rootPos.right + 10;
    const spineY = rootPos.y;

    // Find the end dot so the line stops exactly there, or let it go into the zoom window!
    const endDotPos = getCenter('end-dot');
    const zoomPos = getCenter('zoom-parent');
    const maxSpineX = zoomPos ? zoomPos.x : (endDotPos ? endDotPos.x : contentRef.current.clientWidth);

    // Smoothly draw the line based on horizontal scroll progress (horizP) instead of screen trigger
    // This prevents the line from jumping out early and being awkwardly long.
    let currentSpineX = spineStartX + horizP * (maxSpineX - spineStartX);
    currentSpineX = Math.min(Math.max(currentSpineX, spineStartX), maxSpineX);

    // Check which branches the line has reached
    const newActive = new Set(['root']);
    JOURNEY_GRAPH.branches.forEach((branch) => {
      const branchPos = getCenter(branch.id);
      if (branchPos && branchPos.x <= currentSpineX) {
        newActive.add(branch.id);
      }
    });
    if (endDotPos && endDotPos.x <= currentSpineX) {
      newActive.add('ongoing');
    }
    setActiveNodes(prev => prev.size !== newActive.size ? newActive : prev);

    const spineLine = document.getElementById('line-spine');
    const spineStartCircle = document.getElementById('spine-start-circle');

    if (spineLine) {
      spineLine.setAttribute('x1', spineStartX);
      spineLine.setAttribute('y1', spineY);
      spineLine.setAttribute('x2', currentSpineX);
      spineLine.setAttribute('y2', spineY);
      spineLine.style.opacity = p > 0.01 ? 1 : 0;
    }

    if (spineStartCircle) {
      spineStartCircle.setAttribute('cx', spineStartX);
      spineStartCircle.setAttribute('cy', spineY);
      spineStartCircle.style.opacity = p > 0.01 ? 1 : 0;
    }

    JOURNEY_GRAPH.branches.forEach((branch) => {
      const branchPos = getCenter(branch.id);
      if (branchPos) {
        // 1. Connection from Spine to Main Branch Node
        const lineToBranch = document.getElementById(`line-root-${branch.id}`);
        if (lineToBranch) {
          const branchStartX = branchPos.x;

          lineToBranch.setAttribute('x1', branchStartX);
          lineToBranch.setAttribute('y1', spineY);

          const branchEdgeY = branch.direction === 'up' ? branchPos.y + branchPos.height / 2 : branchPos.y - branchPos.height / 2;

          lineToBranch.setAttribute('x2', branchStartX);
          lineToBranch.setAttribute('y2', branchEdgeY);

          const isActive = currentSpineX >= branchStartX;
          lineToBranch.style.opacity = isActive ? 1 : 0;

          lineToBranch.style.strokeDasharray = '500';
          lineToBranch.style.strokeDashoffset = isActive ? '0' : '500';
          lineToBranch.style.transition = 'stroke-dashoffset 0.6s ease-out, opacity 0.3s';
        }

        // 2. Lines from Branch Node to Sub-nodes
        branch.subs.forEach((sub) => {
          const subPos = getCenter(sub.id);
          const lineToSub = document.getElementById(`line-${branch.id}-${sub.id}`);
          if (subPos && lineToSub) {
            const startY = branch.direction === 'up' ? branchPos.y - branchPos.height / 2 : branchPos.y + branchPos.height / 2;

            lineToSub.setAttribute('x1', branchPos.x);
            lineToSub.setAttribute('y1', startY);
            lineToSub.setAttribute('x2', subPos.x);
            lineToSub.setAttribute('y2', subPos.y);

            const isBranchActive = currentSpineX >= branchPos.x;

            lineToSub.style.opacity = isBranchActive ? 1 : 0;
            lineToSub.style.strokeDasharray = '300';
            lineToSub.style.strokeDashoffset = isBranchActive ? '0' : '300';
            lineToSub.style.transition = 'stroke-dashoffset 0.8s ease-out 0.2s, opacity 0.4s 0.2s';
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateAnimations);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(() => handleScroll(), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateAnimations]);

  useLayoutEffect(() => {
    window.addEventListener('resize', updateAnimations);
    setTimeout(updateAnimations, 100);
    return () => window.removeEventListener('resize', updateAnimations);
  }, [updateAnimations]);

  return (
    <div
      id="journey-section"
      className="w-full text-[#fdfdfc] font-sans relative"
      ref={containerRef}
      style={{ height: '400vh', backgroundColor: 'transparent' }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        @keyframes float-rev {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(15px) rotate(-5deg); }
        }
        @keyframes float-alt {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .anim-float-1 { animation: float 6s ease-in-out infinite; }
        .anim-float-2 { animation: float-rev 7s ease-in-out infinite; }
        .anim-float-3 { animation: float-alt 5s ease-in-out infinite; }
      `}</style>

      {/* Sticky viewport with Ink Background Layer (NO OVERFLOW HIDDEN) */}
      {/* clip-path lets the ink bleed up/left/right (entry effect) but stops it at the bottom edge, so it can never
          spill over Gallery / Newsletter / Contact and make them look dark in light mode */}
      <div id="journey-ink" className="sticky top-0 w-full h-[100svh] z-0 pointer-events-none" style={{ clipPath: 'inset(-100vh -100vw 0 -100vw)' }}>

        {/* Visible Ink Drops Layer */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ zIndex: -1 }}>
          <defs>
            <g id="splatter" fill="#1a1a19">
              <circle cx="0" cy="0" r="100" />
              <circle cx="70" cy="30" r="60" />
              <circle cx="-60" cy="50" r="70" />
              <circle cx="-50" cy="-60" r="65" />
              <circle cx="40" cy="-70" r="75" />
              <circle cx="90" cy="-20" r="55" />
              <circle cx="-80" cy="-10" r="50" />
              <circle cx="20" cy="85" r="55" />
              <circle cx="-10" cy="-85" r="60" />
              <circle cx="60" cy="70" r="50" />
              <circle cx="-70" cy="80" r="45" />
            </g>
          </defs>
          <use id="ink-drop-1" href="#splatter" />
          <use id="ink-drop-2" href="#splatter" />
          <use id="ink-drop-3" href="#splatter" />
          <use id="ink-drop-4" href="#splatter" />
          <use id="ink-drop-5" href="#splatter" />
          <use id="ink-drop-6" href="#splatter" />
          <use id="ink-drop-7" href="#splatter" />
          <use id="ink-drop-8" href="#splatter" />
        </svg>
      </div>

      {/* Content Layer (WITH OVERFLOW HIDDEN) */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden z-10 pointer-events-none" style={{ marginTop: '-100svh' }}>
        <div className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>

          {/* --- INTRO PHOTO ALBUM (Right Side) --- */}
          <div
            id="intro-album"
            className={`absolute top-1/2 right-[4vw] xl:right-[10vw] -translate-y-1/2 w-[400px] h-[400px] z-20 hidden lg:block will-change-transform`}
          >
            <div className="relative w-full h-full">
              {/* Photo 1 */}
              <div className={`anim-float-1 absolute top-0 right-0 w-[220px] h-[300px] bg-[#222] p-2 pb-10 rounded-md shadow-2xl origin-bottom-right transition-all duration-700 hover:scale-105 hover:z-50 border border-[#333] ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`} style={{ transitionDelay: '0s' }}>
                <div className="w-full h-full bg-gray-300 overflow-hidden rounded-sm">
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Tech Desk" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                </div>
              </div>

              {/* Photo 2 */}
              <div className={`anim-float-2 absolute top-8 right-24 w-[220px] h-[300px] bg-[#222] p-2 pb-10 rounded-md shadow-2xl origin-bottom-left transition-all duration-700 hover:scale-105 hover:z-50 z-10 border border-[#333] ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`} style={{ transitionDelay: '0.2s' }}>
                <div className="w-full h-full bg-gray-300 overflow-hidden rounded-sm">
                  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Laptop Code" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                </div>
              </div>

              {/* Photo 3 */}
              <div className={`anim-float-3 absolute top-16 right-44 w-[220px] h-[300px] bg-[#222] p-2 pb-10 rounded-md shadow-2xl transition-all duration-700 hover:scale-110 hover:z-50 z-20 border border-[#333] ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="w-full h-full bg-gray-300 overflow-hidden rounded-sm">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Team Work" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal sliding content wrapper */}
          <div
            ref={contentRef}
            className="absolute top-0 left-0 h-full flex items-center will-change-transform"
            style={{ width: 'max-content' }}
          >
            {/* SVG Layer for drawing lines */}
            <div className="journey-fade absolute top-0 left-0 w-full h-full pointer-events-none z-10">
              <svg className="w-full h-full" style={{ stroke: '#3a3a3a', strokeWidth: '1.5' }}>
                <circle id="spine-start-circle" r="6" fill="#388476" stroke="none" style={{ transition: 'opacity 0.3s' }} />
                <line id="line-spine" style={{ transition: 'opacity 0.3s' }} />
                {JOURNEY_GRAPH.branches.map(branch => (
                  <g key={`lines-${branch.id}`}>
                    <line id={`line-root-${branch.id}`} />
                    {branch.subs.map(sub => (
                      <line id={`line-${branch.id}-${sub.id}`} key={`line-${sub.id}`} />
                    ))}
                  </g>
                ))}
              </svg>
            </div>

            {/* Root Node: Muhammad Nabeel Ijaz */}
            <div
              ref={setRef('root')}
              className={`journey-fade flex-shrink-0 ml-[10vw] mr-16 relative z-30 transition-all duration-1000 ${isMounted ? 'opacity-100 blur-none' : 'opacity-0 blur-sm'}`}
              style={{ mixBlendMode: 'difference', color: '#fff' }}
            >
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold font-serif leading-none tracking-tight flex flex-col items-start" style={{ fontFamily: 'var(--font-serif, ui-serif, Georgia, serif)' }}>
                <span className="inline-block relative block text-[#ffffff] mb-2">
                  <span className="invisible">Muhammad</span>
                  <span id="journey-type-1" className="absolute left-0 top-0 text-inherit whitespace-nowrap"></span>
                </span>
                <span className="inline-block relative block text-[var(--color-accent)]">
                  <span className="invisible">Nabeel Ijaz</span>
                  <span id="journey-type-2" className="absolute left-0 top-0 text-inherit whitespace-nowrap"></span>
                </span>
              </h1>
              <p className="text-[#8e8e8e] mt-6 text-lg md:text-xl font-mono tracking-[0.25em] uppercase">
                <span className="inline-block relative">
                  <span className="invisible">Journey: 2004 — 2026</span>
                  <span id="journey-type-3" className="absolute left-0 top-0 text-inherit whitespace-nowrap"></span>
                </span>
              </p>
            </div>

            {/* Branches and Sub-nodes - Reduced gap to prevent excessively long empty line */}
            <div className="flex gap-40 md:gap-64 px-8 md:px-16 ml-12 md:ml-24">
              {JOURNEY_GRAPH.branches.map((branch) => {
                const isNodeActive = activeNodes.has(branch.id);
                const isUp = branch.direction === 'up';

                return (
                  <div key={branch.id} className="journey-fade relative flex-shrink-0 w-32 flex items-center justify-center h-[100vh]">

                    {/* Visual Image representing the era */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-32 h-24 md:w-48 md:h-32 rounded-lg overflow-hidden border border-[#3a3a3a] shadow-2xl transition-all duration-1000 ease-out z-0`}
                      style={{
                        opacity: isNodeActive ? 0.4 : 0,
                        // For UP branch, place image safely below the spine (50vh)
                        // For DOWN branch, place image safely above the spine
                        top: isUp ? '60vh' : 'auto',
                        bottom: !isUp ? '60vh' : 'auto',
                        transform: `translate(-50%, ${isNodeActive ? '0' : (isUp ? '20px' : '-20px')}) scale(${isNodeActive ? 1 : 0.9})`,
                        filter: 'grayscale(80%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-[#388476] mix-blend-overlay opacity-20"></div>
                      <img src={branch.image} alt={branch.label} className="w-full h-full object-cover transition-all duration-500 hover:scale-110" />
                    </div>

                    {/* Main Branch Title */}
                    <div
                      ref={setRef(branch.id)}
                      className={`bg-[#1a1a19] px-4 py-2 z-20 transition-all duration-700 ease-out absolute left-1/2 -translate-x-1/2 rounded-full border border-[#2a2a29] shadow-lg`}
                      style={{
                        opacity: isNodeActive ? 1 : 0,
                        // For UP branch, title is 5vh above the spine line
                        // For DOWN branch, title is 5vh below the spine line
                        bottom: isUp ? '55vh' : 'auto',
                        top: !isUp ? '55vh' : 'auto',
                        transform: isNodeActive ? 'translate(-50%, 0)' : (isUp ? 'translate(-50%, 20px)' : 'translate(-50%, -20px)')
                      }}
                    >
                      <h2 className="text-xl md:text-2xl font-bold font-serif whitespace-nowrap text-[#fdfdfc]" style={{ fontFamily: 'var(--font-serif, ui-serif, Georgia, serif)' }}>
                        {branch.label}
                      </h2>
                    </div>

                    {/* Sub Nodes */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-[260px] md:w-[320px] flex flex-wrap justify-center gap-3 md:gap-4`}
                      style={{
                        // For UP branch, subnodes are higher than title
                        // For DOWN branch, subnodes are lower than title
                        bottom: isUp ? '65vh' : 'auto',
                        top: !isUp ? '65vh' : 'auto',
                      }}
                    >
                      {branch.subs.map((sub, subIdx) => {
                        return (
                          <div
                            key={sub.id}
                            ref={setRef(sub.id)}
                            className="bg-[#1a1a19] px-4 py-2 z-20 transition-all duration-700 ease-out whitespace-nowrap rounded-md border border-[#2a2a29] shadow-md hover:border-[#388476]"
                            style={{
                              opacity: isNodeActive ? 1 : 0,
                              transform: isNodeActive ? 'scale(1)' : 'scale(0.95)',
                              transitionDelay: `${100 + (subIdx * 100)}ms`
                            }}
                          >
                            <span className="text-sm md:text-base text-[#8e8e8e] hover:text-[#388476] transition-colors cursor-default">
                              {sub.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })}

              {/* The Zooming Window (LookCloser) at the end */}
              <div ref={setRef('zoom-parent')} className="flex-shrink-0 w-[400px] h-[100svh] relative z-30">
                {/* The red dot where the line ends (center of the image) */}
                <div
                  id="zoom-dot"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-opacity duration-300 flex h-4 w-4"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#388476] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#388476] shadow-[0_0_15px_rgba(56,132,118,1)]"></span>
                </div>

                <div
                  id="zoom-window"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-auto"
                  style={{
                    width: '300px',
                    height: '400px',
                    borderRadius: '200px',
                    willChange: 'width, height, border-radius',
                    zIndex: 50,
                    backgroundColor: 'transparent'
                  }}
                >
                  {/* Solid page-colored layer: hides the journey graph (lines, "Still Learning…", photos) behind the expanding window */}
                  <div
                    id="zoom-bg"
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundColor: 'var(--color-bg)', opacity: 0 }}
                  >
                    {/* Same paper + colour washes as the Backdrop 'about' scene (Snapshots, Newsletter, Contact),
                        so the Achievements background matches the sections around it exactly. */}
                    <div className="bd bd-inline" data-scene="about" aria-hidden="true">
                      <div className="bd-paper" />
                      <div className="bd-wash bd-w-sand" />
                      <div className="bd-wash bd-w-sage" />
                      <div className="bd-scene bd-about">
                        <div className="bd-wash bd-w-about-a" />
                        <div className="bd-wash bd-w-about-b" />
                      </div>
                    </div>
                  </div>
                  <div 
                    id="zoom-milestones"
                    className="absolute inset-0 w-full h-full"
                    style={{ opacity: 0, transition: 'opacity 0.2s ease-out' }}
                  >
                    <Milestones />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
