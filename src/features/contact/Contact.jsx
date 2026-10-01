import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, MapPin, Clock, User, Tag, MessageSquare, Send } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Contact.css';


gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const formRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form elements animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        }
      });

      tl.fromTo(leftColRef.current.children,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(formRef.current,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! Thank you for reaching out.');
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-container">

        {/* ── Left Column: Intro & Info ── */}
        <div className="contact-col-left" ref={leftColRef}>
          <div className="contact-header">
            <div className="contact-tag-wrapper">
              <span className="contact-tag">CONTACT</span>
              <span className="contact-tag-line"></span>
            </div>
            <h2>
              Let's build <em>something</em><br />great together.
            </h2>
            <p className="contact-lede">
              Have a project in mind, want to collaborate, or just say hello?
              I'd love to hear from you. I'm currently open to freelance opportunities.
            </p>
          </div>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="info-icon-box"><Mail size={18} /></div>
              <div className="info-text-box">
                <h4>EMAIL</h4>
                <a href="mailto:nnabeelijaznabinoor@gmail.com">nnabeelijaznabinoor@gmail.com</a>
              </div>
            </div>

            <div className="contact-info-divider" />

            <div className="contact-info-item">
              <div className="info-icon-box"><MapPin size={18} /></div>
              <div className="info-text-box">
                <h4>LOCATION</h4>
                <p>Pakistan · Remote-first</p>
              </div>
            </div>

            <div className="contact-info-divider" />

            <div className="contact-info-item">
              <div className="info-icon-box"><Clock size={18} /></div>
              <div className="info-text-box">
                <h4>AVAILABILITY</h4>
                <p>Open for freelance & full-time roles.<br />Response within 24 hours.</p>
              </div>
            </div>
          </div>

          <div className="contact-socials-section">
            <h4>FIND ME ON</h4>
            <div className="contact-socials">
              <a href="https://github.com/MuhammadNabeelIjaz" target="_blank" rel="noreferrer" className="social-btn">
                <FaGithub size={15} /> GitHub
              </a>
              <a href="https://linkedin.com/in/muhammadnabeelijaz" target="_blank" rel="noreferrer" className="social-btn">
                <FaLinkedin size={15} color="#0077b5" /> LinkedIn
              </a>
              <a href="https://www.instagram.com/muhammadnabeelijaz" target="_blank" rel="noreferrer" className="social-btn">
                <FaInstagram size={15} /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* ── Middle Column: Form ── */}
        <div className="contact-col-center">
          <div className="contact-form-card" ref={formRef}>
            <div className="form-header">
              <div className="contact-tag-wrapper">
                <span className="contact-tag">GET IN TOUCH</span>
                <span className="contact-tag-line"></span>
              </div>
              <h3>Send me a message</h3>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label>Name <span>*</span></label>
                  <div className="input-wrapper">
                    <User size={14} className="input-icon" />
                    <input type="text" placeholder="Your name" required />
                  </div>
                </div>
                <div className="form-field">
                  <label>Email <span>*</span></label>
                  <div className="input-wrapper">
                    <Mail size={14} className="input-icon" />
                    <input type="email" placeholder="you@email.com" required />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>Subject <span>*</span></label>
                <div className="input-wrapper">
                  <Tag size={14} className="input-icon" />
                  <input type="text" placeholder="Project inquiry / Collaboration / Just saying hi" required />
                </div>
              </div>

              <div className="form-field">
                <label>Message <span>*</span></label>
                <div className="input-wrapper textarea-wrapper">
                  <MessageSquare size={14} className="input-icon" />
                  <textarea
                    rows={2}
                    placeholder="Tell me about your project, idea, or how I can help you..."
                    required
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="char-counter">{message.length}/500</div>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <Send size={14} style={{ marginRight: '6px' }} /> Send Message <ArrowRight size={14} style={{ marginLeft: '6px' }} />
              </button>
            </form>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Contact;
