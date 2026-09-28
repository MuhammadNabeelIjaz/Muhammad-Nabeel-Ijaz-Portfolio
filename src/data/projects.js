// Project showcase data used by the Projects feature (scroll-peel layers).
import {
  SiReact,
  SiTypescript,
  SiRedux,
  SiTailwindcss,
  SiVite,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiNodedotjs,
  SiPython,
  SiRedis
} from "react-icons/si";

import img2 from '../assets/images/projects/3d/main.jpg';
import img3 from '../assets/images/projects/cosmo/main.jpg';
import img4 from '../assets/images/projects/whatsapp/main.jpg';
import mainResumeImg from '../assets/images/projects/resume/main.jpg';

import resImg2 from '../assets/images/projects/resume/img2.jpg';
import resImg3 from '../assets/images/projects/resume/img3.jpg';
import resImg4 from '../assets/images/projects/resume/img4.jpg';
import resImg5 from '../assets/images/projects/resume/img5.jpg';
import resImg6 from '../assets/images/projects/resume/img6.jpg';
import resImg7 from '../assets/images/projects/resume/img7.jpg';
import resImg8 from '../assets/images/projects/resume/img8.jpg';

import img3d1 from '../assets/images/projects/3d/img1.jpg';
import img3d2 from '../assets/images/projects/3d/img2.jpg';
import img3d3 from '../assets/images/projects/3d/img3.jpg';
import img3d4 from '../assets/images/projects/3d/img4.jpg';
import img3d5 from '../assets/images/projects/3d/img5.jpg';
import img3d6 from '../assets/images/projects/3d/img6.jpg';

import cosmo1 from '../assets/images/projects/cosmo/img1.jpg';
import cosmo2 from '../assets/images/projects/cosmo/img2.jpg';
import cosmo3 from '../assets/images/projects/cosmo/img3.jpg';
import cosmo4 from '../assets/images/projects/cosmo/img4.jpg';
import cosmo5 from '../assets/images/projects/cosmo/img5.jpg';
import cosmo6 from '../assets/images/projects/cosmo/img6.jpg';
import cosmo7 from '../assets/images/projects/cosmo/img7.jpg';
import cosmo8 from '../assets/images/projects/cosmo/img8.jpg';

import wa1 from '../assets/images/projects/whatsapp/img1.jpg';
import wa2 from '../assets/images/projects/whatsapp/img2.jpg';
import wa3 from '../assets/images/projects/whatsapp/img3.jpg';
import wa4 from '../assets/images/projects/whatsapp/img4.jpg';
import wa5 from '../assets/images/projects/whatsapp/img5.jpg';
import wa6 from '../assets/images/projects/whatsapp/img6.jpg';
import wa7 from '../assets/images/projects/whatsapp/img7.jpg';
import wa8 from '../assets/images/projects/whatsapp/img8.jpg';
import wa9 from '../assets/images/projects/whatsapp/img9.jpg';
import wa10 from '../assets/images/projects/whatsapp/img10.jpg';
import wa11 from '../assets/images/projects/whatsapp/img11.jpg';
import wa12 from '../assets/images/projects/whatsapp/img12.jpg';

export const projectLayers = [
  {
    title: "Resume.io UI Clone",
    timeline: "Sep 2026 – Sep 2026",
    link: "https://resumeio-ui-clone-v1.netlify.app/",
    sourceCode: "https://github.com/MuhammadNabeelIjaz/Resume.io-UI-Clone",
    techStack: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Redux Toolkit", icon: SiRedux, color: "#764ABC" }
    ],
    images: [mainResumeImg, resImg2, resImg3, resImg4, resImg5, resImg6, resImg7, resImg8],
    desc: "A comprehensive, full-stack UI clone of the popular resume builder, Resume.io. Built using React, TypeScript, and Redux Toolkit, this project showcases pixel-perfect design, responsive architecture, and a modern tech stack."
  },
  {
    title: "3D Learnify",
    timeline: "Jan 2026 – Jul 2026",
    link: "#",
    techStack: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Express", icon: SiExpress, color: "var(--color-text)" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" }
    ],
    images: [img2, img3d1, img3d2, img3d3, img3d4, img3d5, img3d6],
    desc: "An AI-powered 3D anatomy learning web platform built with a full-stack MERN stack (MongoDB, Express, React, Node.js, Python, Redis, LangChain, LangGraph) designed for smarter medical and educational training."
  },
  {
    title: "CosmoSalon UI Clone",
    timeline: "Jun 2025 – Aug 2025",
    link: "#",
    sourceCode: "https://github.com/MuhammadNabeelIjaz/CosmoSalon-UI-Clone",
    techStack: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" }
    ],
    images: [img3, cosmo1, cosmo2, cosmo3, cosmo4, cosmo5, cosmo6, cosmo7, cosmo8],
    desc: "A modern beauty and salon web application experience optimized across all devices, built using HTML5, JavaScript, and CSS3."
  },
  {
    title: "WhatsApp Web Clone",
    timeline: "Mar 2026 – Jun 2026",
    link: "https://wa-ui-clone-v1.netlify.app/",
    sourceCode: "https://github.com/MuhammadNabeelIjaz/WhatsApp-UI-Clone",
    techStack: [
      { name: "React 19", icon: SiReact, color: "#61DAFB" },
      { name: "Redux", icon: SiRedux, color: "#764ABC" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vite", icon: SiVite, color: "#646CFF" }
    ],
    images: [img4, wa1, wa2, wa3, wa4, wa5, wa6, wa7, wa8, wa9, wa10, wa11, wa12],
    desc: "A deep, pixel-perfect WhatsApp Web clone built with React 19, Redux Toolkit, Tailwind CSS 4, and Vite. This fully responsive Progressive Web App (PWA) delivers a seamless messaging experience across desktop, tablet, and mobile devices."
  },
  {
    title: "AI Automation Platform",
    timeline: "In Development",
    techStack: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "React", icon: SiReact, color: "#61DAFB" }
    ],
    images: [],
    desc: "A futuristic AI-driven automation platform currently under development. Exploring next-generation neural networks and intelligent agents to streamline enterprise workflows.",
    isWip: true
  },
];
