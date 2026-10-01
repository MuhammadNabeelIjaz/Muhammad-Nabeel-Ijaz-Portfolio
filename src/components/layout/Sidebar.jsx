import { scrollToSection } from '../../utils/navigateTo';
import React, { useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Sidebar.css';
import { projectLayers } from '../../data/projects';

const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} aria-label="Close menu overlay"></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">Portfolio</span>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); onClose(); }}>About</a>
            <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education'); onClose(); }}>Education</a>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('work'); onClose(); }}>Projects</a>
            <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); onClose(); }}>Skills</a>
            <a href="#certificates-gallery" onClick={(e) => { e.preventDefault(); scrollToSection('achievements'); onClose(); }}>Achievements</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); onClose(); }}>Contact</a>
          </nav>

          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Projects</h4>
            <ul className="sidebar-list">
              {projectLayers.map((project, index) => (
                <li key={index}>
                  <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('work'); onClose(); }}>
                    <span>{project.title}</span>
                    <span className="sidebar-badge">{project.images?.length || 0}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Connect</h4>
            <div className="sidebar-socials">
              <a href="https://linkedin.com/in/muhammadnabeelijaz" target="_blank" rel="noopener noreferrer"><FaLinkedin size={18} /></a>
              <a href="https://github.com/MuhammadNabeelIjaz" target="_blank" rel="noopener noreferrer"><FaGithub size={18} /></a>
              <a href="mailto:nnabeelijaznabinoor@gmail.com"><Mail size={18} /></a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

