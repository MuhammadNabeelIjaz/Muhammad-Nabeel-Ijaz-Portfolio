import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';
import { skillsColumn1, skillsColumn2, skillsColumn3 } from '../../data/skills';
import aiBrainImg from '../../assets/images/ai-brain-watercolor.webp';


gsap.registerPlugin(ScrollTrigger);

const col1Skills = skillsColumn1;
const col2Skills = skillsColumn2;
const col3Skills = skillsColumn3;
const track1 = [...col1Skills, ...col1Skills];
const track2 = [...col2Skills, ...col2Skills];
const track3 = [...col3Skills, ...col3Skills];

const Skills = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );
  const sectionRef = useRef(null);
  const shuttersRef = useRef([]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Shutters close over the section to transition to the next
      gsap.fromTo(shuttersRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'bottom center',
          ease: 'none',
          stagger: {
            amount: 0.5,
            from: 'end' // start cutting from bottom
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '50% 50%', // start when half scrolled
            end: 'bottom top',
            scrub: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>

      {/* ── Shutter Transition Overlay ── */}
      <div className="skills-shutter-overlay">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="skills-shutter-row"
            ref={el => shuttersRef.current[i] = el}
          />
        ))}
      </div>

      <div className="skills-container">

        {/* ── Left: header + brain (desktop only) ── */}
        <div className="skills-left">
          <div className="skills-header">
            <span className="step-tag">MY SKILLS</span>
            <h2>my core<br />skills &amp; tools.</h2>
            <p className="skills-lede">
              Technologies and tools I work with daily to build intelligent, scalable products.
            </p>
          </div>

          {/* ── Brain Illustration (Under text on Desktop, Absolute on Mobile) ── */}
          <div className="skills-img-wrapper mobile-absolute-brain">
            <img src={aiBrainImg} alt="AI illustration" className="skills-blob-bg" aria-hidden="true" />
            <svg className="skills-mind-arrow" viewBox="0 0 200 80" fill="none">
              <path d="M10,60 C40,60 60,20 100,15 S160,10 190,20"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M178,10 L192,20 L178,30"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>


        {/* ── Infinite scroll columns (Desktop & Mobile) ── */}
        <div className="skills-right">
          <div className="skills-track-col">
            <div className="skills-track-inner inner-up">
              {(isMobile ? [...col1Skills.slice(0, 4), ...col1Skills.slice(0, 4)] : track1).map((b, i) => (
                <div key={`t1-${i}`} className="brand-card" style={{ backgroundColor: b.color }}>
                  <span className="brand-logo-text">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-track-col">
            <div className="skills-track-inner inner-down">
              {(isMobile ? [...col2Skills.slice(0, 4), ...col2Skills.slice(0, 4)] : track2).map((b, i) => (
                <div key={`t2-${i}`} className="brand-card" style={{ backgroundColor: b.color }}>
                  <span className="brand-logo-text">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="skills-track-col">
            <div className="skills-track-inner inner-up">
              {(isMobile ? [...col3Skills.slice(0, 4), ...col3Skills.slice(0, 4)] : track3).map((b, i) => (
                <div key={`t3-${i}`} className="brand-card" style={{ backgroundColor: b.color }}>
                  <span className="brand-logo-text">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
