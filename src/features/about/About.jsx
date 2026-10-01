import React from 'react';

const ABOUT_TEXT = 'I am Muhammad Nabeel Ijaz, a creative developer crafting immersive web experiences and pixel-perfect interactive designs.';

// Letters are animated one by one, but they are grouped per WORD so a line can only
// break between words (never in the middle of a word).
const About = () => {
  return (
    <div className="hero-about-section" aria-hidden="true">
      <h2 className="hero-about-heading">About Me</h2>
      <p className="hero-about-desc">
        {ABOUT_TEXT.split(' ').map((word, w, words) => (
          <React.Fragment key={w}>
            <span className="hero-about-word">
              {word.split('').map((char, i) => (
                <span key={i} className="hero-about-char">{char}</span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default About;
