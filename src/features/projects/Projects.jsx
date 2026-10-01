import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Projects.css';
import { projectLayers } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

const layers = projectLayers;

const Projects = () => {
  const containerRef = useRef(null);
  const layerRefs = useRef([]);
  const copyRefs = useRef([]);
  const descRefs = useRef([]);
  const trackRef = useRef(null);
  const zoomImageRef = useRef(null);
  const zoomCardRef = useRef(null);
  const arrowsRef = useRef(null);
  const viewportRef = useRef(null);   // ref to the clip viewport div
  const itemHeightRef = useRef(4.5); // measured height of one collapsed item (rem)
  const [visibleCount, setVisibleCount] = useState(4); // how many items fit in viewport
  
  const [activeLayer, setActiveLayer] = useState(0);
  // How many projects have already been "peeled off" the top of the list (they collapse to zero
  // height, so the active project always sits at the top — no fixed pixel offsets involved).
  const [passedCount, setPassedCount] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [imageIndices, setImageIndices] = useState({});
  const stRef = useRef(null);
  const layerTimes = useRef([]);

  const [isMobile, setIsMobile] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Stop autoplay on manual scroll or keyboard interaction
  useEffect(() => {
    const stopAutoplay = () => setAutoplay(false);
    window.addEventListener('wheel', stopAutoplay, { passive: true });
    window.addEventListener('touchmove', stopAutoplay, { passive: true });
    window.addEventListener('keydown', stopAutoplay, { passive: true });
    return () => {
      window.removeEventListener('wheel', stopAutoplay);
      window.removeEventListener('touchmove', stopAutoplay);
      window.removeEventListener('keydown', stopAutoplay);
    };
  }, []);

  // Intersection Observer to only autoplay when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 } // Requires at least 20% visibility to start timer
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToLayer = useCallback((index, isUserAction = true) => {
    if (isUserAction) setAutoplay(false);
    if (!stRef.current || index < 0 || index >= layerTimes.current.length) return;

    const tl = stRef.current.animation;
    const progress = layerTimes.current[index] / tl.duration();
    const { start, end } = stRef.current;
    window.scrollTo({ top: start + (end - start) * progress, behavior: 'smooth' });
  }, []);

  // Autoplay — stops at last project, does NOT loop
  useEffect(() => {
    let timer;
    if (autoplay && isInView && layerTimes.current.length > 0) {
      // Only advance if we haven't reached the last project yet
      if (activeLayer < layers.length - 1) {
        timer = setTimeout(() => {
          scrollToLayer(activeLayer + 1, false);
        }, 5000);
      }
    }
    return () => clearTimeout(timer);
  }, [activeLayer, autoplay, isInView, scrollToLayer]);

  useEffect(() => {
    // Same "stacked layout" rule as Projects.css and the Hero (phones + portrait tablets)
    const mq = window.matchMedia('(max-width: 768px), (max-width: 1024px) and (max-aspect-ratio: 1/1)');
    const handleResize = () => setIsMobile(mq.matches);
    handleResize();
    mq.addEventListener('change', handleResize);
    return () => mq.removeEventListener('change', handleResize);
  }, []);

  // Collapse expanded text when the active project changes, so GSAP's scroll scrub never clips a changed height.
  const [collapsedForLayer, setCollapsedForLayer] = useState(activeLayer);
  if (collapsedForLayer !== activeLayer) {
    setCollapsedForLayer(activeLayer);
    setExpandedItems({});
  }

  // Measure actual item heights and recalculate visible count on resize
  useEffect(() => {
    const measureItems = () => {
      if (!viewportRef.current) return;
      const vpHeight = viewportRef.current.clientHeight;
      if (vpHeight === 0) return;

      // Measure the height of a collapsed (inactive) item header
      const inactiveHeader = copyRefs.current[1]; // index 1 is always inactive at start
      if (!inactiveHeader) return;
      const headerH = inactiveHeader.offsetHeight;
      const itemH = headerH + 12; // header + paddingBottom (0.75rem ≈ 12px)

      itemHeightRef.current = itemH;

      // How many inactive items fit in the viewport?
      // Reserve space for 1 active item (approx 2x height of inactive) + desc
      // For simplicity: count how many item headers fit
      const count = Math.max(2, Math.floor(vpHeight / itemH));
      setVisibleCount(count);
    };

    // Measure after paint
    const raf = requestAnimationFrame(measureItems);
    window.addEventListener('resize', measureItems);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureItems);
    };
  }, []);

  // No windowing needed, we render all 10 items and translate the track

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Single Master Timeline for Pinning & Scrubbing ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 5, // always after the Hero (10), before everything below it — see Hero.jsx
          onUpdate: (self) => {
            if (!tl.duration()) return;

            const time = self.progress * tl.duration();
            let current = 0;
            for(let i = 0; i < layerTimes.current.length; i++) {
               if(time >= layerTimes.current[i] - 0.1) {
                  current = i;
               }
            }
             setActiveLayer(current);

            // A project's title has faded out 0.5 time-units after its peel starts → collapse it then.
            let passed = 0;
            for (let i = 0; i < layers.length - 1; i++) {
              if (layerTimes.current[i] !== undefined && time >= layerTimes.current[i] + 0.5) passed = i + 1;
            }
            setPassedCount(passed);
          }
        }
      });
      stRef.current = tl.scrollTrigger;

      // ── Phase 0: Zoom Image ──
      tl.to(zoomImageRef.current, { scale: 1.05, duration: 1, ease: 'none' }, 0);
      tl.fromTo(zoomCardRef.current, 
        { autoAlpha: 0, y: 60 }, 
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 
        0
      );
      
      // Pause so user can appreciate the zoom before fading
      tl.to({}, { duration: 0.5 });

      const zoomFadeStart = tl.duration();
      // Fade out the interactive zoom card
      tl.to(zoomCardRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, zoomFadeStart);

      // Add a pause on Layer 0 with arrows visible before we start peeling
      tl.to({}, { duration: 0.5 });
      
      // Record time for Layer 0
      layerTimes.current = [tl.duration()];

      // Hide all visual layers except the first one to prevent them showing behind active layers
      layerRefs.current.forEach((ref, index) => {
        if (index !== 0 && ref) {
          gsap.set(ref, { opacity: 0 });
        }
      });

      // ── Phase 1: Layer Peeling ── (stops at last project, no loop)
      const totalLayers = layers.length;

      for (let i = 0; i < totalLayers - 1; i++) {
        // We animate from i to i + 1
        const nextI = i + 1;
        const startTime = tl.duration();
        
        // Fade IN the next visual layer
        if (layerRefs.current[nextI]) {
          tl.to(layerRefs.current[nextI], { opacity: 1, duration: 1, ease: 'none' }, startTime);
        }

        // Fade out current visual layer (images)
        tl.to(layerRefs.current[i], { opacity: 0, scale: 1.08, duration: 1, ease: 'none' }, startTime);
        
        // Deactivate current text
        tl.to(copyRefs.current[i], { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, startTime);
        tl.to(descRefs.current[i], { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' }, startTime);
        
        // Activate next text
        tl.to(copyRefs.current[nextI], { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, startTime + 0.5);
        tl.to(descRefs.current[nextI], { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.inOut' }, startTime + 0.5);
        
        // Small pause between peels
        tl.to({}, { duration: 0.2 });
        
        // Record time for Layer i+1
        layerTimes.current.push(tl.duration());
      }

      // Hold on the last project so the user can read it before the pin releases
      tl.to({}, { duration: 0.8 });

    }, containerRef);

    return () => ctx.revert();
  }, []);


  // Prev: go to previous project, or exit section upward if at project 01
  const handlePrev = () => {
    if (activeLayer === 0) {
      // Exit section upward
      if (stRef.current) window.scrollTo({ top: stRef.current.start - 10, behavior: 'smooth' });
    } else {
      scrollToLayer(activeLayer - 1);
    }
  };

  // Next: go to next project, or exit section downward if at project 05
  const handleNext = () => {
    const lastReal = layers.length - 1;
    if (activeLayer >= lastReal) {
      // Exit section downward
      if (stRef.current) window.scrollTo({ top: stRef.current.end + 10, behavior: 'smooth' });
    } else {
      scrollToLayer(activeLayer + 1);
    }
  };

  const selectImage = (layerIndex, imgIndex, e) => {
    if (e) e.stopPropagation();
    setAutoplay(false);
    setImageIndices(prev => ({
      ...prev,
      [layerIndex]: imgIndex
    }));
  };

  const toggleExpand = (index, e) => {
    e.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="work" ref={containerRef} className="projects-section">

      <div className="projects-header">
        <span className="step-tag">SELECT WORK</span>
        <h2>Projects that<br/>speak for themselves.</h2>
      </div>

      <div className="projects-container">
        
        {/* ── Vertical Highlight List ── */}
        <div className="projects-copy">
          <div 
            className={`projects-list-viewport ${expandedItems[activeLayer] ? 'has-expanded' : ''}`}
            ref={viewportRef}
            style={{ 
              width: '100%', 
              overflow: 'hidden', 
              flex: '1 1 0', 
              minHeight: 0,
              paddingTop: '1.25rem',
              maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)', 
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)'
            }}
          >
            <div className="projects-list-track" ref={trackRef} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {layers.map((layer, i) => {
                const isActive = activeLayer === i;

                // ── Responsive windowing ──
                // Items that were already passed (above) and items beyond the last one that fits on
                // screen (below) collapse to zero height (is-hidden), so the list always starts at
                // the active project and never runs out of the box.
                const isVisible = i >= passedCount && i < activeLayer + visibleCount;
                
                return (
                  <div
                    key={i}
                    className={`projects-item ${isActive ? 'is-active' : ''} ${!isVisible ? 'is-hidden' : ''}`}
                    style={{ margin: 0, paddingBottom: isVisible ? '0.75rem' : 0 }}
                  >
                   <div className="projects-item-inner">
                    <div 
                      className="projects-item-header"
                      ref={el => copyRefs.current[i] = el}
                      style={{ opacity: i === 0 ? 1 : 0.3, cursor: 'pointer' }}
                      onClick={() => scrollToLayer(i)}
                    >
                    <div className="projects-num-wrapper">
                      {isActive && autoplay && (
                        <svg className="autoplay-progress" viewBox="0 0 36 36">
                          <path className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path className="circle-anim"
                            strokeDasharray="100, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      )}
                    <span className="projects-num">0{i + 1}</span>
                    </div>
                    <div className="projects-title-wrapper">
                      <h3>{layer.title}</h3>
                      {layer.timeline && (
                        <div className="project-timeline">{layer.timeline}</div>
                      )}
                    </div>
                  </div>
                  <div 
                    className="projects-item-desc"
                    ref={el => descRefs.current[i] = el}
                    style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0, overflow: 'hidden' }}
                  >
                    {layer.techStack && (
                      <div className="project-tech-stack">
                        {layer.techStack.map((tech, idx) => (
                          <div key={idx} className="tech-badge" title={tech.name}>
                            <tech.icon style={{ color: tech.color }} />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className={`project-desc-full ${expandedItems[i] ? 'expanded' : ''}`}>
                      {expandedItems[i] || layer.desc.length <= 100 
                        ? layer.desc 
                        : `${layer.desc.substring(0, 100)}...`}
                      
                      {layer.desc.length > 100 && (
                        <button 
                          className="project-view-more" 
                          style={{ marginLeft: '0.25rem' }} 
                          onClick={(e) => toggleExpand(i, e)}
                        >
                          {expandedItems[i] ? 'less' : 'more'}
                        </button>
                      )}
                    </p>
                    <a href={layer.link || "#"} className="view-project-btn" target={layer.link !== "#" ? "_blank" : "_self"} rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      View Project <ArrowRight size={14} />
                    </a>
                  </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          <div className="demo-pagination">
            <span className="pagination-current">{((activeLayer % layers.length) + 1).toString().padStart(2, '0')}</span>
            <span className="pagination-separator">/</span>
            <span className="pagination-total">{layers.length.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* ── Visual stack ── */}
        <div className="projects-visual">
          <div className="projects-zoom-card" ref={zoomCardRef}>
            <span className="step-tag">PORTFOLIO</span>
            <h3>Scroll to explore projects</h3>
            <p>Each scroll reveals a new project — from AI platforms to pixel-perfect UI clones.</p>
          </div>

          {[...layers].reverse().map((layer, index) => {
            const originalIndex = layers.length - 1 - index;
            const currentImgIndex = imageIndices[originalIndex] || 0;
            const isMultiImage = layer.images && layer.images.length > 1;
            const activeSrc = isMultiImage ? layer.images[currentImgIndex] : (layer.img || layer.images[0]);
            
            const maxVisibleThumbs = isMobile ? 3 : 5;
            
            // Calculate sliding window thumbnail indices with +X overlay
            let visibleIndices = [];
            if (isMultiImage) {
              const totalImages = layer.images.length;
              if (totalImages <= maxVisibleThumbs) {
                for (let i = 0; i < totalImages; i++) visibleIndices.push(i);
              } else {
                let startIndex = currentImgIndex - Math.floor(maxVisibleThumbs / 2);
                if (startIndex < 0) startIndex = 0;
                if (startIndex + maxVisibleThumbs > totalImages) startIndex = totalImages - maxVisibleThumbs;
                
                for (let i = 0; i < maxVisibleThumbs; i++) {
                  visibleIndices.push(startIndex + i);
                }
              }
            }

            return (
              <div
                key={originalIndex}
                ref={el => { layerRefs.current[originalIndex] = el; }}
                className={`projects-layer ${isMultiImage || layer.isWip ? 'has-gallery' : ''}`}
                style={{ 
                  zIndex: layers.length - originalIndex,
                  pointerEvents: activeLayer === originalIndex ? 'auto' : 'none'
                }}
              >
                <div className="main-image-wrapper">
                  {layer.isWip ? (
                    <div className="wip-card-container">
                      <div className="wip-grid-card">
                         <span>No Images</span>
                         <span style={{ fontSize: '0.8em', opacity: 0.7 }}>Work in Progress</span>
                      </div>
                    </div>
                  ) : (
                    <div className="main-project-img-container">
                      <img
                        ref={originalIndex === 0 ? zoomImageRef : null}
                        src={activeSrc}
                        alt={layer.title}
                        className="main-project-img"
                      />
                      <div className="card-badges-wrapper">
                        {layer.sourceCode && (
                          <a href={layer.sourceCode} className="source-code-badge" target="_blank" rel="noreferrer" title="Source Code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 18l6-6-6-6"></path>
                              <path d="M8 6l-6 6 6 6"></path>
                            </svg>
                            Source Code
                          </a>
                        )}
                        {layer.link && (
                          <a href={layer.link} className="live-demo-badge" target="_blank" rel="noreferrer" title="Live Demo">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                               <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                               <polyline points="15 3 21 3 21 9"></polyline>
                               <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Carousel */}
                <div className="thumbnail-gallery">
                  {layer.isWip ? (
                    // Render empty mock thumbnails to match layout
                    Array.from({ length: maxVisibleThumbs }).map((_, i) => (
                      <div key={`wip-mock-${i}`} className="thumbnail-box empty-mock" style={{ cursor: 'default', opacity: 0.5 }}></div>
                    ))
                  ) : (
                    isMultiImage && visibleIndices.map((actualImgIndex, renderIndex) => {
                      const thumbSrc = layer.images[actualImgIndex];
                      const isActiveThumb = currentImgIndex === actualImgIndex;
                      const isLastVisible = renderIndex === maxVisibleThumbs - 1 && layer.images.length > maxVisibleThumbs && actualImgIndex < layer.images.length - 1;
                      const remainingCount = layer.images.length - actualImgIndex;
                      
                      return (
                        <div 
                          key={`${actualImgIndex}-${renderIndex}`}
                          className={`thumbnail-box ${isActiveThumb ? 'active' : ''}`}
                          onClick={(e) => selectImage(originalIndex, actualImgIndex, e)}
                        >
                          <img src={thumbSrc} alt={`${layer.title} thumbnail ${actualImgIndex + 1}`} />
                          {isLastVisible && (
                            <div className="thumbnail-overlay">
                              +{remainingCount}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          
          {/* ── Navigation Arrows ── */}
          <div className="projects-nav-arrows" ref={arrowsRef}>
            <button 
              className={`nav-arrow left-arrow ${activeLayer === 0 ? 'disabled' : ''}`} 
              onClick={handlePrev} 
              aria-label="Previous layer"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              className={`nav-arrow right-arrow ${activeLayer === layers.length - 1 ? 'disabled' : ''}`} 
              onClick={handleNext} 
              aria-label="Next layer"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
