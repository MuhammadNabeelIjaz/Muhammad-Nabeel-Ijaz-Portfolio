import React from 'react';

// Name typed under the centred portrait (Portrait phase, no other text).
// The scroll timeline in Hero.jsx writes the typed characters into
// `.hero-portrait-typed-text` (see addPortraitName). The invisible "sizer" copy of the
// name reserves the final width so the text stays centred and doesn't shift while typing.
// (No blinking cursor and no underline — only the letters appear.)
export const PORTRAIT_NAME = 'Muhammad Nabeel Ijaz';

const PortraitName = () => (
  <div className="hero-portrait-name" aria-hidden="true">
    <div className="hero-portrait-text">
      <span className="hero-portrait-sizer">{PORTRAIT_NAME}</span>
      <span className="hero-portrait-typed">
        <span className="hero-portrait-typed-text" />
      </span>
    </div>
  </div>
);

export default PortraitName;
