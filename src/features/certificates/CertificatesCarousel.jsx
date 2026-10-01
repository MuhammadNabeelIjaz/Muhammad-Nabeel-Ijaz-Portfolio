import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CertificatesCarousel.css';
import { certificateCards } from '../../data/certificates';


gsap.registerPlugin(ScrollTrigger);

const CERTIFICATE_CARDS = certificateCards;

const CertificatesCarousel = () => {
  const [phi, setPhi] = useState(0); 
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  const targetPhi = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const requestRef = useRef();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => { setWindowWidth(window.innerWidth); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!isDragging.current) {
        targetPhi.current -= 0.0015; // Slow smooth scroll
      }
      setPhi((prevPhi) => {
        const diff = targetPhi.current - prevPhi;
        if (Math.abs(diff) < 0.0001) return targetPhi.current;
        return prevPhi + diff * 0.08;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    let ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              once: true
            }
          }
        );
      }

    }, sectionRef);

    return () => {
      cancelAnimationFrame(requestRef.current);
      ctx.revert();
    };
  }, []);

  const handleWheel = (e) => {
    targetPhi.current -= e.deltaY * 0.002;
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX || (e.touches && e.touches[0].clientX);
    lastY.current = e.clientY || (e.touches && e.touches[0].clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - lastX.current;
    targetPhi.current += deltaX * 0.005;

    lastX.current = clientX;
    lastY.current = clientY;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const extendedCards = [...CERTIFICATE_CARDS, ...CERTIFICATE_CARDS].map((c, i) => ({ ...c, uniqueId: `${c.id}-${i}` }));
  const N = extendedCards.length; 
  const dTheta = (2 * Math.PI) / N;
  const totalAngle = 2 * Math.PI; 
  const halfAngle = Math.PI; 

  return (
    <section
      className="certificates-section"
      id="certificates-gallery"
      ref={sectionRef}
      onWheel={handleWheel}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >

      <div className="certificates-layout">
        
        {/* Left Column: Header */}
        <div className="certificates-header-col" ref={headerRef}>
          <div className="cert-tag-wrapper">
            <span className="step-tag">CERTIFICATES & LICENSES</span>
            <span className="cert-tag-line"></span>
          </div>
          <h2>
            Portfolio certificates<br/>
            that validate <em>my skills</em><br/>
            and knowledge.
          </h2>
          <p className="certificates-lede">
            Explore my continuous learning journey through various industry-recognized certifications and licenses.
          </p>
        </div>

        {/* Right Column: Carousel */}
        <div className="certificates-canvas-col">
          
          <div className="cert-handdrawn-decor">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="cert-arrow">
              <path d="M5 35 Q 15 15, 35 5 M 25 5 L 35 5 L 32 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="cert-handwritten-text">My Certificates</span>
          </div>

          <div className="certificates-canvas">
            {extendedCards.map((card, index) => {
              const theta_i = index * dTheta + phi;
              let wrappedTheta = ((theta_i + halfAngle) % totalAngle + totalAngle) % totalAngle - halfAngle;

              const offset = wrappedTheta / dTheta;
              const dist = Math.abs(offset);
              const sign = Math.sign(offset) || 0;

              let opacity = 0;
              if (dist <= 2.2) {
                opacity = 1;
              } else if (dist <= 2.8) {
                opacity = 1 - (dist - 2.2) / 0.6;
              } else {
                opacity = 0;
              }

              let xStep = 190;
              let zStep = 100;
              if (windowWidth <= 1440) { xStep = 160; zStep = 80; }
              if (windowWidth <= 1024) { xStep = 130; zStep = 70; }
              if (windowWidth <= 768)  { xStep = 100; zStep = 60; }

              // Card size: narrower than before, and TALL. The centre card is the tallest, its
              // neighbours are shorter, and the ones behind them shorter again (all share one centre line).
              let cardW = 260;
              if (windowWidth <= 1440) cardW = 230;
              if (windowWidth <= 768)  cardW = 220;
              if (windowWidth <= 480)  cardW = 200;
              const heightFactor = Math.max(0.58, 1 - dist * 0.18);
              // Phones/tablets: Use a proportional height to prevent cards from overflowing the screen
              const baseH = windowWidth <= 1024
                ? cardW * 1.4
                : cardW * 1.3;
              const cardH = Math.round(baseH * heightFactor);

              const X_i = offset * xStep;
              const Z_i = -dist * zStep;

              const rotY = sign * Math.min(dist * 25, 45);
              const scale = Math.max(0.85, 1 - dist * 0.05);
              // Cards are layered by z-index only (no 3D depth sorting), so a card coming forward is
              // drawn cleanly IN FRONT of the one it passes - it never cuts through it.
              const zIndex = 1000 - Math.round(dist * 100);

              const isFront = dist < 0.5;
              const shadowOpacity = isFront ? 0.3 : 0.1;

              return (
                <div
                  key={card.uniqueId}
                  className={`certificates-card-wrapper ${isFront ? 'is-front' : ''}`}
                  style={{
                    width: cardW,
                    height: cardH,
                    transform: `translate3d(-50%, -50%, ${Z_i}px) translate3d(${X_i}px, 0, 0) rotateY(${rotY}deg) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity
                  }}
                >
                  <div className="certificates-card" style={{ boxShadow: `0 20px 40px rgba(0,0,0,${shadowOpacity})` }}>
                    <img src={card.image} alt={card.platform} className="certificates-card-img" draggable="false" />
                  </div>
                  
                  <div className="certificates-card-text">
                    <h3>{card.platform}</h3>
                    <p>{card.name}</p>
                    {card.credentialId && (
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
                        ID: {card.credentialId}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatesCarousel;
