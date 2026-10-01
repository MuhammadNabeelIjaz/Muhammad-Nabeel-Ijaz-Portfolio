import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';
import { gallerySnapshots } from '../../data/gallery';

gsap.registerPlugin(ScrollTrigger);

const snapshots = gallerySnapshots;

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(snapshots.length / 2));
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const touchStartX = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollTime = useRef(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const revealRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % snapshots.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + snapshots.length) % snapshots.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsHovered(true);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    setIsHovered(false);

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return;

    if (e.deltaY > 0) {
      handleNext();
      lastScrollTime.current = now;
    } else if (e.deltaY < 0) {
      handlePrev();
      lastScrollTime.current = now;
    }
  };

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % snapshots.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isHovered]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Clip-path reveal (replaces the old solid "shutter" cover, which showed as a white
      // block over the watercolor backdrop). Nothing is painted on top; the content itself
      // is uncovered top -> bottom as the section scrolls in.
      if (revealRef.current) {
        gsap.fromTo(revealRef.current,
          { clipPath: 'inset(0px -100vw 100% -100vw)' },
          {
            clipPath: 'inset(0px -100vw -400px -100vw)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 10%',
              scrub: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="gallery-section"
      id="gallery-showcase"
      ref={sectionRef}
    >
      <div className="gallery-container" ref={revealRef}>

        <div className="gallery-header" ref={headerRef} style={{ textAlign: 'center' }}>
          <span className="step-tag">SNAPSHOTS</span>

          <h2>
            A glimpse into my world.
          </h2>

          <p
            className="gallery-lede fade-in"
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              animationDelay: '0.2s',
              lineHeight: '1.4'
            }}
          >
            A visual collection of moments from my creative journey, where ideas evolve into meaningful experiences.
          </p>
        </div>

        <div
          className="gallery-carousel-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onWheel={handleWheel}
        >
          <div
            className="gallery-radial-canvas"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {snapshots.map((organ, index) => {
              const N = snapshots.length;
              let delta = index - activeIndex;
              if (delta > N / 2) {
                delta -= N;
              } else if (delta < -N / 2) {
                delta += N;
              }

              let angleStep = 12;
              let xStep = 270;
              let scaleRatio = 0.04;

              if (windowWidth <= 768) {
                angleStep = 8;
                xStep = 150;
                scaleRatio = 0.1;
              } else if (windowWidth <= 1024) {
                angleStep = 10;
                xStep = 240;
                scaleRatio = 0.06;
              } else if (windowWidth <= 1440) {
                angleStep = 11;
                xStep = 260;
                scaleRatio = 0.05;
              }

              const rotation = delta * angleStep;
              const translateX = delta * xStep;
              const translateY = (1 - Math.cos(delta * (angleStep * Math.PI / 180))) * 650 + Math.abs(delta) * 18;
              const scale = 1 - Math.abs(delta) * scaleRatio;
              const zIndex = 100 - Math.round(Math.abs(delta) * 10);

              let opacity = 1;
              if (windowWidth <= 768) {
                if (Math.abs(delta) === 1) opacity = 0.35;
                else if (Math.abs(delta) >= 2) opacity = 0;
              } else if (windowWidth <= 1024) {
                opacity = Math.max(0, 1 - Math.abs(delta) * 0.45);
              } else {
                opacity = Math.max(0, 1 - Math.abs(delta) * 0.25);
              }

              return (
                <div
                  key={`snapshot-${index}`}
                  className="gallery-radial-card"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    pointerEvents: opacity > 0 ? 'auto' : 'none'
                  }}
                >
                  <img
                    src={organ.image}
                    alt={organ.name}
                    className="gallery-radial-img"
                    style={{ filter: "none" }}
                  />
                  {organ.name && (
                    <div className="gallery-radial-info">
                      <h3>{organ.name}</h3>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="gallery-radial-dock">
            <button className="gallery-radial-btn-prev" onClick={handlePrev} aria-label="Previous">
              {windowWidth <= 768 ? <ArrowLeft size={18} /> : "Previous"}
            </button>
            <button className="gallery-radial-btn-next" onClick={handleNext} aria-label="Next">
              {windowWidth <= 768 ? <ArrowRight size={18} /> : "Next"}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Gallery;
