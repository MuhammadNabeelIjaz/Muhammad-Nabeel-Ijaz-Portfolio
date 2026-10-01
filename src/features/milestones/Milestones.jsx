import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ListChecks, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import './Milestones.css';

import trophyImg from '../../assets/images/trophy-watercolor.webp';

const Milestones = () => {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTrophyYellow, setIsTrophyYellow] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hasAutoRun = useRef(false);

  const currentSpeed = useRef(1);

  const handleTrophyDoubleClick = useCallback(() => {
    if (isTrophyYellow) return; // Prevent multiple triggers
    
    setIsTrophyYellow(true);
    
    // Fire confetti immediately
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ffcc00', '#ff0000', '#00ff00', '#0000ff', '#ff00ff']
    });

    // Reset everything after 3.5s
    setTimeout(() => {
      setIsTrophyYellow(false);
    }, 3500);
  }, [isTrophyYellow]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Trigger the fast spin EVERY time they scroll to this section!
          currentSpeed.current = 15;
          
          if (!hasAutoRun.current) {
            hasAutoRun.current = true;
            
            // Auto run the trophy animation only the first time
            handleTrophyDoubleClick();
            
            // Show the tooltip for 5 seconds
            setShowTooltip(true);
            setTimeout(() => {
              setShowTooltip(false);
            }, 5000);
          }
        }
      },
      { threshold: 0.5 }
    );

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      observer.observe(sectionEl);
    }

    return () => {
      if (sectionEl) {
        observer.unobserve(sectionEl);
      }
    };
  }, [handleTrophyDoubleClick]);

  useEffect(() => {
    let animationFrameId;
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (!isHovered) {
        // Smoothly decelerate the speed back to 1
        if (currentSpeed.current > 1) {
          currentSpeed.current -= (currentSpeed.current - 1) * 0.008; // Slower decay for a full rotation
          if (currentSpeed.current < 1.05) currentSpeed.current = 1;
        }

        if (container.scrollLeft >= container.scrollWidth / 2) {
          // Keep the fractional offset when looping to prevent stuttering at high speeds
          container.scrollLeft = (container.scrollLeft + currentSpeed.current) % (container.scrollWidth / 2);
        } else {
          container.scrollLeft += currentSpeed.current;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  return (
    <section className="milestones-section" id="milestones-section" ref={sectionRef}>
      

      <div className="milestones-container">
        
        <div className="milestones-header-wrapper">
          <div className="milestones-header">
            <span className="step-tag">ACHIEVEMENTS</span>
            <h2>Some milestones and recognitions I am proud of.</h2>
            <p className="milestones-lede">
              Explore my continuous learning journey through various industry-recognized certifications and licenses.
            </p>
          </div>
          
          <div className="milestones-header-visual desktop-svg" style={{ position: 'relative' }}>
            <img
              src={trophyImg}
              alt="Achievements Trophy"
              className={`achievement-trophy-img ${isTrophyYellow ? 'yellow-trophy' : ''}`}
              onDoubleClick={handleTrophyDoubleClick}
              style={{ cursor: 'pointer' }}
            />
            
            <div className={`interactive-hint ${showTooltip ? 'visible' : ''}`}>
              <span className="hint-text">Double-click for magic!</span>
              <svg className="hand-drawn-arrow" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path className="arrow-line" d="M5,50 C35,50 45,10 30,10 C15,10 15,40 35,45 Q75,55 110,30 L95,18 M110,30 L95,42" />
              </svg>
            </div>
          </div>
        </div>

        <div className="milestones-carousel-wrapper">
          <div 
            className="milestones-marquee-container" 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="milestones-marquee-track">
            
            {/* First set of cards */}
            <div className="milestones-card">
              <div className="milestones-card-icon">
                <ListChecks size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Hackathons</h3>
                <p>Multiple wins and top placements in national and global tech hackathons.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <GraduationCap size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Open Source</h3>
                <p>Consistent contributor to major open source projects and libraries.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <ListChecks size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Volunteer Work</h3>
                <p>Mentoring junior developers and teaching programming at local bootcamps.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <GraduationCap size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Tech Speaker</h3>
                <p>Delivered talks on AI, web development, and agentic architectures at conferences.</p>
              </div>
            </div>

            {/* Duplicated set of cards for seamless infinite scroll */}
            <div className="milestones-card">
              <div className="milestones-card-icon">
                <ListChecks size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Hackathons</h3>
                <p>Multiple wins and top placements in national and global tech hackathons.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <GraduationCap size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Open Source</h3>
                <p>Consistent contributor to major open source projects and libraries.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <ListChecks size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Volunteer Work</h3>
                <p>Mentoring junior developers and teaching programming at local bootcamps.</p>
              </div>
            </div>

            <div className="milestones-card">
              <div className="milestones-card-icon">
                <GraduationCap size={24} />
              </div>
              <div className="milestones-card-content">
                <h3>Tech Speaker</h3>
                <p>Delivered talks on AI, web development, and agentic architectures at conferences.</p>
              </div>
            </div>

          </div>

        </div>
          <div className="milestones-controls">
            <button className="carousel-btn" onClick={scrollPrev}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-btn" onClick={scrollNext}>
              <ChevronRight size={24} />
            </button>
          </div>
      </div>
        
        {/* Mobile Absolute Trophy */}
        <div className="mobile-absolute-svg">
          <img
            src={trophyImg}
            alt="Achievements Trophy"
            className={`achievement-trophy-img ${isTrophyYellow ? 'yellow-trophy' : ''}`}
            onDoubleClick={handleTrophyDoubleClick}
            style={{ cursor: 'pointer' }}
          />
          <div className={`interactive-hint mobile-hint ${showTooltip ? 'visible' : ''}`}>
            <span className="hint-text">Double-click for magic!</span>
            <svg className="hand-drawn-arrow" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path className="arrow-line" d="M5,50 C35,50 45,10 30,10 C15,10 15,40 35,45 Q75,55 110,30 L95,18 M110,30 L95,42" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Milestones;
