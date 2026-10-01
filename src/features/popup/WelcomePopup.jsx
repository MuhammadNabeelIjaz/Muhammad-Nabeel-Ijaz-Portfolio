import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Show popup shortly after initial load
    const timer = setTimeout(() => {
      setIsRendered(true);
      // Small delay to allow CSS transition to work
      setTimeout(() => setIsVisible(true), 50);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 500); // Wait for fade out animation
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 p-4 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div 
        className={`relative backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-2xl text-center shadow-2xl transition-all duration-500 transform ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
          borderColor: 'color-mix(in srgb, var(--color-text) 15%, transparent)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          style={{ color: 'var(--color-text)' }}
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <span className="font-mono text-sm tracking-[0.25em] uppercase mb-4 font-bold block" style={{ color: 'var(--color-accent, #388476)' }}>
          WELCOME TO MY PORTFOLIO
        </span>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-[1.1]" style={{ color: 'var(--color-text)' }}>
          Hi, I'm Nabeel —<br />
          I design &amp; build<br />
          for the web.
        </h2>
        
        <p className="text-lg md:text-xl max-w-lg mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          Frontend, UI/UX and AI-powered products, crafted with care.<br className="hidden md:block" />
          Scroll down to explore my work, skills and journey.
        </p>
      </div>
    </div>
  );
};

export default WelcomePopup;
