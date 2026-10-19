import type { Localized } from "@/i18n/language-provider";

/**
 * Todos los textos de interfaz del sitio, agrupados por sección.
 * Cada texto lleva sus dos idiomas juntos para que no se desincronicen.
 */
export const uiText = {
  nav: {
    home: { es: "Inicio", en: "Home" },
    projects: { es: "Proyectos", en: "Projects" },
    about: { es: "Sobre mí", en: "About" },
    contact: { es: "Contacto", en: "Contact" },
    openMenu: { es: "Abrir menú", en: "Open menu" },
    closeMenu: { es: "Cerrar menú", en: "Close menu" },
    switchLanguage: { es: "Cambiar idioma", en: "Switch language" },
  },

  hero: {
    headline: {
      es: "Construyo páginas web que se sienten bien de usar",
      en: "I build websites that feel good to use",
    },
    subline: {
      es: "Desarrollador freelance y técnico en Programación Asistida con IA por CENFOTEC. Trabajo el frontend con React y TypeScript, y el backend con Python, FastAPI y PostgreSQL.",
      en: "Freelance developer with a Technical Diploma in AI-Assisted Programming from CENFOTEC. I work the frontend with React and TypeScript, and the backend with Python, FastAPI and PostgreSQL.",
    },
    primaryCta: { es: "Ver proyectos", en: "View projects" },
    secondaryCta: { es: "Contactame", en: "Get in touch" },
    scrollHint: { es: "Desplazate", en: "Scroll" },
  },

  stack: {
    eyebrow: { es: "Stack", en: "Stack" },
    title: { es: "Con qué trabajo", en: "What I work with" },
    subtitle: {
      es: "Las herramientas que uso a diario para llevar una idea de la pizarra a producción.",
      en: "The tools I use daily to take an idea from the whiteboard to production.",
    },
    hint: {
      es: "Arrastrá para girar el carrusel.",
      en: "Drag to spin the carousel.",
    },
  },

  projects: {
    eyebrow: { es: "Portafolio", en: "Portfolio" },
    title: { es: "Proyectos", en: "Projects" },
    subtitle: {
      es: "Aplicaciones web, APIs y experimentos. Cada tarjeta enlaza al repositorio o a la demo.",
      en: "Web apps, APIs and experiments. Each card links to the repository or the live demo.",
    },
    repo: { es: "Código", en: "Code" },
    demo: { es: "Demo", en: "Live demo" },
    hint: {
      es: "Arrastrá, hacé clic en una tarjeta o usá ← → para navegar.",
      en: "Drag, click a card, or use ← → to navigate.",
    },
    /** Para las tarjetas en blanco del carrusel y, con la lista vacía, para toda la sección. */
    comingSoon: { es: "Próximamente", en: "Coming soon" },
    emptySubtitle: {
      es: "Estoy preparando esta sección. Muy pronto voy a subir acá los proyectos en los que estoy trabajando.",
      en: "I am putting this section together. The projects I am working on will be up here very soon.",
    },
    emptyHint: {
      es: "Mientras tanto, podés escribirme si querés ver algo de lo que hago.",
      en: "In the meantime, feel free to reach out if you want to see some of my work.",
    },
  },

  about: {
    eyebrow: { es: "Sobre mí", en: "About me" },
    title: { es: "Hola, soy Fabián", en: "Hi, I am Fabián" },
    paragraphOne: {
      es: "Soy desarrollador full stack freelance y técnico en Programación Asistida con IA por la Universidad CENFOTEC. Construyo aplicaciones web de punta a punta: armo la interfaz con React, Next.js y TypeScript, levanto las APIs con Python usando FastAPI o Flask, guardo los datos en PostgreSQL o Supabase, y automatizo los procesos repetitivos.",
      en: "I am a freelance full stack developer with a Technical Diploma in AI-Assisted Programming from Universidad CENFOTEC. I build web applications end to end: I put together the interface with React, Next.js and TypeScript, set up the APIs with Python using FastAPI or Flask, store the data in PostgreSQL or Supabase, and automate repetitive processes.",
    },
    paragraphTwo: {
      es: "Estoy arrancando en esto y lo tomo en serio: trabajo a diario con agentes de programación como Claude Code y Codex, y reviso y depuro cada cambio antes de que llegue a producción. En paralelo trabajo como jefe de piso coordinando un equipo, algo que me enseñó a organizarme, resolver bajo presión y hacerme cargo de lo que prometo.",
      en: "I am starting out in this and I take it seriously: I work daily with coding agents like Claude Code and Codex, and I review and debug every change before it reaches production. Alongside that I work as a floor supervisor coordinating a team, which taught me to stay organized, solve problems under pressure and own what I promise.",
    },
    downloadCv: { es: "Descargar CV", en: "Download CV" },
  },

  timeline: {
    eyebrow: { es: "Trayectoria", en: "Journey" },
    title: { es: "Experiencia y formación", en: "Experience and education" },
    hint: {
      es: "Las tarjetas avanzan solas. Pasá el mouse para pausar o tocá los puntos.",
      en: "The cards advance on their own. Hover to pause, or tap the dots.",
    },
  },

  contact: {
    eyebrow: { es: "Contacto", en: "Contact" },
    title: { es: "¿Trabajamos juntos?", en: "Let us work together" },
    subtitle: {
      es: "Estoy abierto a propuestas de trabajo, colaboraciones y proyectos freelance. Escribime y te respondo.",
      en: "I am open to job offers, collaborations and freelance projects. Drop me a line and I will get back to you.",
    },
    emailCta: { es: "Escribime un correo", en: "Send me an email" },
    copyEmail: { es: "Copiar correo", en: "Copy email" },
    copied: { es: "¡Copiado!", en: "Copied!" },
  },

  footer: {
    builtWith: {
      es: "Hecho con Next.js, Tailwind CSS y WebGL",
      en: "Built with Next.js, Tailwind CSS and WebGL",
    },
    rights: {
      es: "Todos los derechos reservados",
      en: "All rights reserved",
    },
  },

  notFound: {
    title: { es: "Página no encontrada", en: "Page not found" },
    subtitle: {
      es: "El enlace que seguiste no existe o cambió de dirección.",
      en: "The link you followed does not exist or has moved.",
    },
    backHome: { es: "Volver al inicio", en: "Back home" },
  },
} satisfies Record<string, Record<string, Localized>>;
