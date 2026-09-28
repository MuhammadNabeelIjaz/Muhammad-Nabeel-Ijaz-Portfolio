import { scrollToSection } from '../../utils/navigateTo';
import React from 'react';
import { ArrowRight, ArrowUp, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Socials */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">N</div>
              <div className="footer-logo-text">
                <span className="brand-name">Nabeel Ijaz</span>
                <span className="brand-urdu">نبیل اعجاز</span>
              </div>
            </div>
            <p className="brand-desc">
              Creative Frontend Developer & UI/UX Engineer.
            </p>
            <p className="brand-slogan-urdu" style={{fontFamily: 'var(--font-arabic)', fontSize: '1rem', color: 'var(--color-accent)', fontWeight: 500}}>
              تخلیقی سوچ اور جدید ٹیکنالوجی کا حسین سنگم۔
            </p>
            <div className="social-icons">
              <a href="https://github.com/MuhammadNabeelIjaz" aria-label="GitHub" target="_blank" rel="noreferrer"><FaGithub size={18} /></a>
              <a href="https://linkedin.com/in/muhammadnabeelijaz" aria-label="LinkedIn" target="_blank" rel="noreferrer"><FaLinkedin size={18} /></a>
              <a href="https://x.com/muhammadnabeelx" aria-label="X (Twitter)" target="_blank" rel="noreferrer"><FaXTwitter size={18} /></a>
              <a href="mailto:nnabeelijaznabinoor@gmail.com" aria-label="Email"><Mail size={18} /></a>
              <a href="https://www.instagram.com/muhammadnabeelijaz" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram size={18} /></a>
              <a href="https://www.facebook.com/muhammadnabeelijaz1" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebook size={18} /></a>
              <a href="https://wa.me/+923047662828" aria-label="WhatsApp" target="_blank" rel="noreferrer"><FaWhatsapp size={18} /></a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="footer-col links-col">
            <h4>EXPERTISE</h4>
            <ul>
              <li><a href="#skills">Frontend Development</a></li>
              <li><a href="#skills">React & Redux</a></li>
              <li><a href="#skills">UI/UX Design</a></li>
              <li><a href="#skills">MERN Stack</a></li>
              <li><a href="#skills">Frontend Architecture</a></li>
              <li><a href="#skills">Responsive Design</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col links-col">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
              <li><a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}>Education</a></li>
              <li><a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}>Projects</a></li>
              <li><a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a></li>
              <li><a href="#certificates-gallery" onClick={(e) => { e.preventDefault(); scrollToSection('achievements'); }}>Achievements</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="footer-col contact-col">
            <h4>GET IN TOUCH</h4>
            <div className="contact-info">
              <a href="mailto:nnabeelijaznabinoor@gmail.com" className="contact-email">nnabeelijaznabinoor@gmail.com</a>
              <a href="tel:+923047662828" className="contact-phone">+92 304 766 2828</a>
            </div>
            <button className="start-project-btn" onClick={() => scrollToSection('work')}>
              Start your project <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="product-text">Developed by <strong style={{color: '#fff', fontWeight: 600}}>Muhammad Nabeel Ijaz</strong> · Lahore, Pakistan</span>
          </div>
          
          <div className="footer-bottom-center">
            <span>&copy; 2026 Nabeel Ijaz. All rights reserved.</span>
          </div>
          
          <div className="footer-bottom-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
      
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <ArrowUp size={20} color="#0b120f" strokeWidth={2.5} />
      </button>
    </footer>
  );
};

export default Footer;
