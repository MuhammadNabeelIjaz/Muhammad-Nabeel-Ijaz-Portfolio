// Smooth-scroll to a section, aware of the pinned/scrubbed timelines (About/Education live inside the hero pin,
// Achievements live at the end of the Journey pin).
const topOf = (el) => el.getBoundingClientRect().top + window.pageYOffset;

export function scrollToSection(id) {
  let y = null;
  const nav = window.__heroNav;
  if (id === 'about' && nav?.about) y = nav.about();
  else if (id === 'education' && nav?.education) y = nav.education();
  else if (id === 'achievements' || id === 'milestones-section') {
    const j = document.getElementById('journey-section');
    if (j) y = topOf(j) + (j.offsetHeight - window.innerHeight) * 0.995;
  } else {
    const t = document.getElementById(id);
    const s = t?.closest('.pin-spacer') || t;
    if (s) y = topOf(s);
  }
  if (y != null) window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}
