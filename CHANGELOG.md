# Changelog

## [1.0.0] — 2026-10-01

### ✨ Added
- **Hero Section** — GSAP ScrollTrigger pin, animated typewriter headline, dual CTA buttons,
  looping background video with gradient overlay
- **Generative Backdrop** — Procedural canvas art engine (seeded RNG, 0–100 coordinate box)
  with GSAP animation loop and theme-aware color palette
- **About Section** — GSAP-driven reveal animation, video portrait background, bio copy,
  and PortraitName floating name-tag subcomponent
- **Skills Section** — Infinite horizontal scroll columns (desktop) + category tab grid (mobile),
  staggered card entrance animation
- **Education Section** — Institution card layout with logos (UMT, Punjab College, Muslim Model School)
  and degree achievement timeline
- **Journey Section** — GSAP horizontal scroll milestone timeline with career events
- **Projects Section** — Filterable project grid, tech badge chips, lightbox modal viewer,
  coverage: WhatsApp Clone, Cosmo, Resume Builder, 3D Viewer
- **Certificates Section** — Touch-swipe carousel with auto-play timer, CSS slide transitions,
  dot indicators, and certificate lightbox
- **Milestones Section** — IntersectionObserver count-up animation, achievement stat cards,
  trophy watercolor illustration
- **Gallery Section** — CSS masonry grid, category filter, lightbox with zoom transition,
  10-image personal photo collection
- **Contact Section** — EmailJS integration, field validation, floating label inputs,
  status feedback toast
- **Newsletter CTA** — Email capture form with canvas-confetti celebration on submission
- **Welcome Popup** — GSAP slide-in entrance, sessionStorage visibility gate

### 🎨 Design
- Light/dark mode toggle (persisted across sessions)
- Responsive design: mobile, tablet, desktop breakpoints
- Geist Sans typeface via @fontsource/geist-sans
- Custom CSS properties for consistent theme tokens
- Scroll-snap full-page section layout

### 🛠️ Tech Stack
- **React 19.2** · **Vite 8.3** · **Tailwind CSS 3.4**
- **GSAP 3.15** (ScrollTrigger, custom easing)
- **Lucide React 1.47** · **React Icons 5.7**
- **canvas-confetti 1.9** · **OXLint 1.81**
- **PostCSS** with Autoprefixer

### 📁 Architecture
- Feature-Sliced Design (`src/features/` per section)
- Shared layout components (`src/components/layout/`)
- Centralized data layer (`src/data/` JS modules)
- Asset-organized by type (`src/assets/images/`, `src/assets/videos/`)
