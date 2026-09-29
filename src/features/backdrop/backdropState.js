// The pinned Hero timeline (About -> Portrait -> Education) owns the scroll for a long stretch, so
// the page position alone cannot tell the background which scene to show. The Hero reports its
// current phase here; the Backdrop reads it.
let heroPhase = 'hero';
const listeners = new Set();

export const getHeroPhase = () => heroPhase;

export const setHeroPhase = (phase) => {
  if (phase === heroPhase) return;
  heroPhase = phase;
  listeners.forEach((fn) => fn());
};

export const onHeroPhase = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
