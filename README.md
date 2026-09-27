<p align="center">
  <img src="docs/banner.svg" alt="Muhammad Nabeel Ijaz Portfolio banner" width="100%" />
</p>

<h1 align="center">Muhammad Nabeel Ijaz — Portfolio</h1>

<p align="center">
  A scroll-driven personal portfolio built with React 19, GSAP ScrollTrigger and
  Tailwind CSS. Pinned hero timeline, project showcase, animated skills, a 3D
  certificates carousel, an interactive journey graph, milestones and a contact
  section, with a code-drawn watercolor background and light/dark themes.
</p>

<p align="center">
  <strong>🌍 Live Demo:</strong> <a href="https://muhammadnabeelijaz.netlify.app/">muhammadnabeelijaz.netlify.app</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3.4" />
  <img src="https://img.shields.io/badge/Responsive-desktop_%7C_tablet_%7C_mobile-orange" alt="Responsive" />
</p>

### <u>Table of Contents</u>

- [About](#about)
- [Sections](#sections)
- [Tech Stack](#tech-stack)
- [UI Showcase](#ui-showcase)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running locally](#running-locally)
  - [Building for production](#building-for-production)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Customizing Content](#customizing-content)
- [Known Notes](#known-notes)
- [Contributing](#contributing)
- [Author](#author)

---

### <u>About</u>

This is the personal portfolio of **Muhammad Nabeel Ijaz**, a full-stack and AI developer.
The page is one continuous scroll experience: the hero, education and project sections are
driven by pinned, scrubbed GSAP timelines, while the background is drawn in code (SVG
watercolor washes) and reacts to the scroll phase. All content lives in plain data files, so
updating projects, skills or certificates never touches the layout code.

### <u>Sections</u>

| Section | What's inside | Source |
|---|---|---|
| **Hero / About / Education** | Pinned scroll timeline with portrait, About and Education cards | `src/features/hero`, `src/features/about`, `src/features/education` |
| **Projects** | Pinned stack of project layers with galleries, tech icons, live and source links | `src/features/projects` |
| **Skills** | Three auto-scrolling skill columns | `src/features/skills` |
| **Certificates** | Draggable 3D carousel of IBM certificates | `src/features/certificates` |
| **Journey** | Horizontal graph with zoom window, followed by the Milestones trophy | `src/features/journey`, `src/features/milestones` |
| **Gallery** | Auto-playing photo showcase | `src/features/gallery` |
| **Newsletter / Contact / Footer** | Contact form, social links, newsletter call to action | `src/features/cta`, `src/features/contact`, `src/components/layout` |
| **Navigation** | Floating navbar with theme toggle and a slide-in sidebar | `src/components/layout` |

### <u>Tech Stack</u>

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 8 |
| Animation | GSAP + ScrollTrigger, `canvas-confetti` |
| Styling | Component CSS files, global design tokens, Tailwind CSS 3.4 (compiled at build time) |
| Icons | Lucide React, React Icons |
| Typography | Geist Sans (`@fontsource`), EB Garamond and IBM Plex Sans Arabic (Google Fonts) |
| Tooling | Oxlint, PostCSS, Autoprefixer |

### <u>UI Showcase</u>

<details open>
<summary><strong>☀️ Light Mode</strong></summary>

<p align="center">
  <img src="docs/screenshots/light/hero-light.png" alt="Hero" width="32%" />&nbsp;
  <img src="docs/screenshots/light/about-light.png" alt="About" width="32%" />&nbsp;
  <img src="docs/screenshots/light/education-light.png" alt="Education" width="32%" />
</p>
<p align="center">
  <img src="docs/screenshots/light/skills-light.png" alt="Skills" width="32%" />&nbsp;
  <img src="docs/screenshots/light/certificates-light.png" alt="Certificates" width="32%" />&nbsp;
  <img src="docs/screenshots/light/gallery-light.png" alt="Gallery" width="32%" />
</p>

<details>
<summary><strong>➕ Show more (3 more screenshots)</strong></summary>

<p align="center">
  <img src="docs/screenshots/light/achievements-light.png" alt="Achievements" width="32%" />&nbsp;
  <img src="docs/screenshots/light/newsletter-light.png" alt="Newsletter" width="32%" />&nbsp;
  <img src="docs/screenshots/light/contact-light.png" alt="Contact" width="32%" />
</p>
</details>

</details>

<details open>
<summary><strong>🌙 Dark Mode</strong></summary>

<p align="center">
  <img src="docs/screenshots/dark/hero-dark.png" alt="Hero" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/skills-dark.png" alt="Skills" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/certificates-dark.png" alt="Certificates" width="32%" />
</p>
<p align="center">
  <img src="docs/screenshots/dark/projects-dark.png" alt="Projects" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/achievements-dark.png" alt="Achievements" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/gallery-dark.png" alt="Gallery" width="32%" />
</p>

<details>
<summary><strong>➕ Show more (3 more screenshots)</strong></summary>

<p align="center">
  <img src="docs/screenshots/dark/journey-dark.png" alt="Journey" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/newsletter-dark.png" alt="Newsletter" width="32%" />&nbsp;
  <img src="docs/screenshots/dark/contact-dark.png" alt="Contact" width="32%" />
</p>
</details>

</details>

### <u>Getting Started</u>

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
git clone https://github.com/MuhammadNabeelIjaz/Muhammad-Nabeel-Ijaz-Portfolio.git
cd Muhammad-Nabeel-Ijaz-Portfolio
npm install
```

No environment variables are required.

### Running locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Building for production

```bash
npm run build
npm run preview   # preview the production build locally
npm run lint      # static analysis
```

### <u>Project Structure</u>

```
src/
├── app/            # App shell: section order, global scroll-trigger refresh
├── components/     # Layout: Navbar, Sidebar, Footer
├── features/       # One folder per section, each with its own JSX and CSS
├── data/           # Content: projects, skills, certificates, education, gallery, journey
├── utils/          # Section navigation helper
└── assets/         # Images, videos, global styles

docs/               # README banner and light/dark screenshots
```

<details>
<summary><strong>📁 Full file tree (assets collapsed)</strong></summary>

```
Muhammad-Nabeel-Ijaz-Portfolio
|-- docs
|   |-- banner.svg
|   `-- screenshots
|       |-- dark
|       |   |-- achievements-dark.png
|       |   |-- certificates-dark.png
|       |   |-- contact-dark.png
|       |   |-- gallery-dark.png
|       |   |-- hero-dark.png
|       |   |-- journey-dark.png
|       |   |-- newsletter-dark.png
|       |   |-- projects-dark.png
|       |   `-- skills-dark.png
|       `-- light
|           |-- about-light.png
|           |-- achievements-light.png
|           |-- certificates-light.png
|           |-- contact-light.png
|           |-- education-light.png
|           |-- gallery-light.png
|           |-- hero-light.png
|           |-- newsletter-light.png
|           `-- skills-light.png
|-- public
|   `-- favicon.svg
|-- src
|   |-- app
|   |   |-- App.css
|   |   `-- App.jsx
|   |-- assets
|   |   |-- images
|   |   |   |-- certificates
|   |   |   |-- gallery
|   |   |   |-- logos
|   |   |   |-- projects
|   |   |   |   |-- 3d
|   |   |   |   |-- cosmo
|   |   |   |   |-- resume
|   |   |   |   `-- whatsapp
|   |   |-- styles
|   |   |   |-- globals.css
|   |   |   `-- tailwind.css
|   |   `-- videos
|   |-- components
|   |   `-- layout
|   |       |-- Footer.css
|   |       |-- Footer.jsx
|   |       |-- Navbar.css
|   |       |-- Navbar.jsx
|   |       |-- Sidebar.css
|   |       `-- Sidebar.jsx
|   |-- data
|   |   |-- certificates.js
|   |   |-- education.js
|   |   |-- gallery.js
|   |   |-- journey.js
|   |   |-- projects.js
|   |   `-- skills.js
|   |-- features
|   |   |-- about
|   |   |   |-- About.jsx
|   |   |   `-- PortraitName.jsx
|   |   |-- backdrop
|   |   |   |-- Backdrop.css
|   |   |   |-- Backdrop.jsx
|   |   |   |-- art.js
|   |   |   |-- backdropMotion.js
|   |   |   `-- backdropState.js
|   |   |-- certificates
|   |   |   |-- CertificatesCarousel.css
|   |   |   `-- CertificatesCarousel.jsx
|   |   |-- contact
|   |   |   |-- Contact.css
|   |   |   `-- Contact.jsx
|   |   |-- cta
|   |   |   |-- NewsletterCTA.css
|   |   |   `-- NewsletterCTA.jsx
|   |   |-- education
|   |   |   `-- Education.jsx
|   |   |-- gallery
|   |   |   |-- Gallery.css
|   |   |   `-- Gallery.jsx
|   |   |-- hero
|   |   |   |-- Hero.css
|   |   |   `-- Hero.jsx
|   |   |-- journey
|   |   |   `-- Journey.jsx
|   |   |-- milestones
|   |   |   |-- Milestones.css
|   |   |   `-- Milestones.jsx
|   |   |-- popup
|   |   |   `-- WelcomePopup.jsx
|   |   |-- projects
|   |   |   |-- Projects.css
|   |   |   `-- Projects.jsx
|   |   `-- skills
|   |       |-- Skills.css
|   |       `-- Skills.jsx
|   |-- utils
|   |   `-- navigateTo.js
|   `-- main.jsx
|-- .gitignore
|-- .oxlintrc.json
|-- README.md
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
`-- package-lock.json
```

</details>

### <u>Architecture Notes</u>

- **Scroll choreography**: the Hero builds one pinned timeline per layout (desktop vs. stacked
  mobile/portrait). `App.jsx` re-sorts and refreshes every ScrollTrigger after resize,
  rotation, breakpoint changes and font loading so pinned sections never keep stale
  measurements.
- **Navigation**: About and Education live inside the hero pin, and Achievements at the end of
  the Journey pin, so `utils/navigateTo.js` computes scroll offsets instead of using plain
  anchors. The Hero registers its jump targets on `window.__heroNav`.
- **Backdrop**: `features/backdrop` draws the watercolor background as SVG and exposes the
  current hero phase through a tiny store (`backdropState.js`), keeping it decoupled from the
  Hero timeline.
- **Tailwind**: compiled at build time (`tailwind.config.js`, `postcss.config.js`). The
  stylesheet is imported last in `src/main.jsx` to keep the same cascade order as the
  previous CDN setup. Dark mode follows `prefers-color-scheme`.
- **Bundling**: React and GSAP are split into vendor chunks (`vite.config.js`).
- **Content is data-driven**: sections read from `src/data/*`, so text and links change
  without touching components.

### <u>Customizing Content</u>

| To change | Edit |
|---|---|
| Projects, links, tech icons | `src/data/projects.js` |
| Skills | `src/data/skills.js` |
| Certificates | `src/data/certificates.js` |
| Education | `src/data/education.js` |
| Gallery photos | `src/data/gallery.js` |
| Journey graph | `src/data/journey.js` |
| Social links and email | `src/components/layout/Footer.jsx`, `Sidebar.jsx`, `src/features/contact/Contact.jsx` |

### <u>Known Notes</u>

> These are content or backend items, not code defects.

- The contact form shows a confirmation alert only and the newsletter form does nothing, as
  neither has a backend yet.
- Education cards link to LinkedIn `/edit/forms/` URLs, which only the profile owner can open.
  Replace them with public links in `src/data/education.js`.
- Footer Privacy, Terms, Cookie and Sitemap links are `#` placeholders.
- The Live Demo link is a dummy placeholder until you add the real deployment URL.
- Ten images are hotlinked from Unsplash and fonts load from Google Fonts, so those need an
  internet connection.

### <u>Contributing</u>

This is a personal portfolio, but suggestions are welcome. Open an issue or a pull request describing what changed and why.

### <u>Author</u>

**Muhammad Nabeel Ijaz**

[LinkedIn](https://linkedin.com/in/muhammadnabeelijaz) ·
[GitHub](https://github.com/MuhammadNabeelIjaz) ·
[X](https://x.com/muhammadnabeelx) ·
[Instagram](https://www.instagram.com/muhammadnabeelijaz) ·
nnabeelijaznabinoor@gmail.com
