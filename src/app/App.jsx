import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar';
import Backdrop from '../features/backdrop/Backdrop';
import Hero from '../features/hero/Hero';
import Projects from '../features/projects/Projects';
import Gallery from '../features/gallery/Gallery';
import Skills from '../features/skills/Skills';
import CertificatesCarousel from '../features/certificates/CertificatesCarousel';
import Journey from '../features/journey/Journey';
import NewsletterCTA from '../features/cta/NewsletterCTA';
import Contact from '../features/contact/Contact';
import Footer from '../components/layout/Footer';
import WelcomePopup from '../features/popup/WelcomePopup';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const overlayRef = useRef(null);

  // ── Layout guard ──────────────────────────────────────────────────────
  // Every pinned section measures its start/end from the sections above it. When the window is
  // resized (or a phone is rotated) the Hero rebuilds its animation for the new layout, so ALL
  // triggers must be put back in the right order and measured again from scratch, top to bottom.
  // This runs once the resizing has settled, on breakpoint flips, rotation, and when fonts/images
  // finish loading, so nothing keeps stale numbers from the old screen size.
  useEffect(() => {
    let timer;
    const remeasure = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.sort();     // Hero → Projects → rest, by refreshPriority
        ScrollTrigger.refresh();  // re-measure everything for the current width × height
      }, 250);
    };
    const queries = [
      '(max-width: 768px)',
      '(max-width: 1024px)',
      '(max-aspect-ratio: 1/1)',
      '(min-width: 1025px)',
    ].map((q) => window.matchMedia(q));
    queries.forEach((mq) => mq.addEventListener('change', remeasure));
    window.addEventListener('resize', remeasure);
    window.addEventListener('orientationchange', remeasure);
    window.addEventListener('load', remeasure);
    window.visualViewport?.addEventListener('resize', remeasure);
    document.fonts?.ready?.then(remeasure);
    return () => {
      clearTimeout(timer);
      queries.forEach((mq) => mq.removeEventListener('change', remeasure));
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
      window.removeEventListener('load', remeasure);
      window.visualViewport?.removeEventListener('resize', remeasure);
    };
  }, []);

  return (
    <div className="landing" data-nav="floating">
      <div className="global-bg-container" aria-hidden="true">
        <div ref={overlayRef} className="global-bg-overlay" style={{ opacity: 1 }} />
      </div>

      <Backdrop />

      <WelcomePopup />
      <Navbar />
      <main className="landing-main">
        <Hero />
        <Projects />
        <Skills />
        <CertificatesCarousel />
        <Journey />
        <Gallery />
        <NewsletterCTA />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

export default App;
