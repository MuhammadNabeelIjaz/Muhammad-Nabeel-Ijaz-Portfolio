import { scrollToSection } from '../../utils/navigateTo';
import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);
  const [isOverZoomSection, setIsOverZoomSection] = useState(false);
  const [isOverWorkSection, setIsOverWorkSection] = useState(false);
  const [isOverGallerySection, setIsOverGallerySection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Check if we are over the journey section or milestones section
      const journeySection = document.getElementById('journey-section');
      
      let overJourney = false;

      if (journeySection) {
        const rect = journeySection.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          overJourney = true;
        }
      }

      const workSection = document.getElementById('work');
      let overWork = false;
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          overWork = true;
        }
      }
      setIsOverWorkSection(overWork);

      const gallerySection = document.getElementById('gallery-showcase');
      let overGallery = false;
      if (gallerySection) {
        const rect = gallerySection.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          overGallery = true;
        }
      }
      setIsOverGallerySection(overGallery);

      if (overJourney) {
        setIsOverDarkSection(!window.portfolioIsZoomed);
        setIsOverZoomSection(window.portfolioIsZoomed);
      } else {
        setIsOverDarkSection(false);
        setIsOverZoomSection(false);
      }
    };

    const handleZoomTheme = (e) => {
      if (e.detail) {
        window.portfolioIsZoomed = e.detail.isZoomed;
        handleScroll(); // Re-evaluate based on scroll position
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('zoom-theme-update', handleZoomTheme);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('zoom-theme-update', handleZoomTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''} ${isOverDarkSection ? 'topbar-dark-section' : ''} ${isOverZoomSection ? 'topbar-zoom-section' : ''} ${isOverWorkSection ? 'topbar-work-section' : ''} ${isOverGallerySection ? 'topbar-gallery-section' : ''}`}>
      <div className="nav-lead">
        <a href="/" className="brand" aria-label="Portfolio home">
          <strong>
            <span className="brand-first">Muhammad </span>
            <br className="mobile-only" />
            <span className="brand-last">Nabeel Ijaz</span>
          </strong>
        </a>
      </div>

      <nav className="nav-center">
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
        <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>Education</a>
        <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}>Projects</a>
        <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
        <a href="#certificates-gallery" onClick={(e) => { e.preventDefault(); scrollToSection('achievements'); }}>Achievements</a>
        <a href="#journey-section" onClick={(e) => { e.preventDefault(); scrollToSection('journey-section'); }}>Journey</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
      </nav>
      
      <div className="nav-utils">
        <button type="button" className="util-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button type="button" className="nav-drawer-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} strokeWidth={2} />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Navbar;
