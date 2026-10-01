import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './NewsletterCTA.css';

gsap.registerPlugin(ScrollTrigger);

const NewsletterCTA = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    const getScrollTrigger = () => ({
      trigger: wrapperRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    });

    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(sectionRef.current,
        { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
        { clipPath: 'inset(12% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: getScrollTrigger() }
      );
    });

    mm.add("(min-width: 768px) and (max-width: 1099px)", () => {
      gsap.fromTo(sectionRef.current,
        { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
        { clipPath: 'inset(0% 5% 0% 5% round 32px)', ease: 'none', scrollTrigger: getScrollTrigger() }
      );
    });

    mm.add("(min-width: 1100px)", () => {
      gsap.fromTo(sectionRef.current,
        { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
        { clipPath: 'inset(0% 12% 0% 12% round 32px)', ease: 'none', scrollTrigger: getScrollTrigger() }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="newsletter-cta-wrapper" id="newsletter-cta" ref={wrapperRef}>
      <div className="newsletter-cta-section" ref={sectionRef}>
        <div className="newsletter-cta-backdrop">
        </div>

        <div className="newsletter-cta-container">
          <h2>Stay Ahead of the Curve.</h2>
          <p className="newsletter-cta-lede">
            Join my newsletter to receive the latest insights on AI, agentic systems, and upcoming projects.
          </p>

          <div className="newsletter-cta-actions">
            <form className="newsletter-cta-form" onSubmit={(e) => e.preventDefault()}>
              <div className="newsletter-cta-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="newsletter-cta-input"
                />
                <button type="submit" className="btn btn--lg newsletter-cta-btn">
                  Subscribe
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="newsletter-cta-subtext">
                Subscribe to get notified about future updates and new releases.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
