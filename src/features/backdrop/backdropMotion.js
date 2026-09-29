// Hooks the background drawing into the Hero's scroll timeline.
//  - scenes fade by CSS (see Backdrop.css) whenever the phase changes
//  - strokes are DRAWN and the splash POPS by the scroll itself (scrubbed, reversible)
import { setHeroPhase } from './backdropState';

const all = (sel) => Array.from(document.querySelectorAll(sel));

// labels = { about, portrait, edu } -> names of labels that already exist on `tl`
export function addBackdropMotion(tl, labels) {
  const { about, portrait, edu } = labels;

  // Education: the wireframe solids sketch themselves in
  tl.fromTo(all('.bd-edu .bd-draw'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'none', stagger: 0.12 }, `${edu}+=0.1`);

  // Tell the Backdrop which scene belongs to the current playhead (works forwards and backwards)
  tl.eventCallback('onUpdate', () => {
    const t = tl.time();
    const L = tl.labels;
    setHeroPhase(t >= L[edu] ? 'edu' : t >= L[portrait] ? 'portrait' : t >= L[about] ? 'about' : 'hero');
  });
}
