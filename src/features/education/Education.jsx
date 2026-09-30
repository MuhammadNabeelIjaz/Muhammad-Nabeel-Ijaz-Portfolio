import React from 'react';
import { ArrowRight } from 'lucide-react';
import { educationSteps } from '../../data/education';

const Education = ({ stepsRef }) => {
  const steps = educationSteps;

  return (
    <>
      {/* 🔹 Section Title (Animated on scroll) 🔹 */}
      <div className="hero-section-title" id="education" aria-hidden="true">
        <div className="hero-st-heading">
          {"My Education".split('').map((char, i) => (
            <span key={i} className="hero-char">{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>
      </div>

      {/* 🔹 Project cards 🔹 */}
      <div className="hero-projects-content">
        {steps.map((step, index) => {
          return (
          <article
            key={index}
            ref={el => { stepsRef.current[index] = el; }}
            className="hero-card"
            style={{ visibility: 'hidden', opacity: 0 }}
          >
            <div className="hero-card-header">
              <span className="hero-num">{step.num}</span>
              <span className="hero-tag">Education</span>
            </div>
            <h3 className="edu-card-title">
              {step.logo && (
                <img
                  className="edu-card-logo"
                  src={step.logo}
                  alt={`${step.title} logo`}
                />
              )}
              <span className="edu-card-title-text">{step.title}</span>
            </h3>
            <p className="edu-card-desc">{step.desc}</p>
            {step.dateRange && <p className="edu-card-meta">{step.dateRange}</p>}
            {step.skillsText && <p className="edu-card-meta">{step.skillsText}</p>}
            {step.details && <p className="edu-card-meta edu-card-details">{step.details}</p>}
            <a className="edu-card-link" href={step.link} target="_blank" rel="noreferrer">
              View Details <ArrowRight size={14} />
            </a>
          </article>
          );
        })}
      </div>
    </>
  );
};

export default Education;
