import type { Localized } from "@/i18n/language-provider";

/** Datos personales, stack y trayectoria. Tomados del CV de Fabián. */
export const profile = {
  name: "Fabián Villalta Arburola",
  role: {
    es: "Desarrollador Full Stack",
    en: "Full Stack Developer",
  },
  email: "fabianvillalta09@gmail.com",
  githubUrl: "https://github.com/Fabito09",
  linkedinUrl: "https://www.linkedin.com/in/fabian-villalta-arburola",
  /** Cada idioma descarga su propia versión del CV. Los PDF viven en /public. */
  cvPath: {
    es: "/cv-fabian-villalta-es.pdf",
    en: "/cv-fabian-villalta-en.pdf",
  },
  location: {
    es: "San José, Costa Rica · Disponible para remoto",
    en: "San José, Costa Rica · Open to remote work",
  },
  languages: {
    es: "Español (nativo) · Inglés (B1, en progreso)",
    en: "Spanish (native) · English (B1, in progress)",
  },
} as const;

export type StackGroup = {
  label: Localized;
  /** Texto plano si se escribe igual en ambos idiomas; bilingüe si no. */
  items: Array<string | Localized>;
};

/**
 * Todo sale del CV, salvo React, Next.js y Tailwind CSS: esos los sumás con
 * este portafolio, que está construido con los tres.
 */
export const stackGroups: StackGroup[] = [
  {
    label: { es: "Frontend", en: "Frontend" },
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    label: { es: "Backend", en: "Backend" },
    items: ["Python", "FastAPI", "Flask", "Node.js", "APIs REST"],
  },
  {
    label: { es: "Bases de datos", en: "Databases" },
    items: ["PostgreSQL", "Supabase", "SQL"],
  },
  {
    label: { es: "Herramientas", en: "Tools" },
    items: ["Git", "Vercel", "Render", "Claude Code"],
  },
  {
    label: { es: "Idiomas", en: "Languages" },
    items: [
      { es: "Español (nativo)", en: "Spanish (native)" },
      { es: "Inglés (B1)", en: "English (B1)" },
    ],
  },
  {
    label: { es: "Habilidades blandas", en: "Soft skills" },
    items: [
      { es: "Liderazgo de equipos", en: "Team leadership" },
      { es: "Comunicación efectiva", en: "Effective communication" },
      { es: "Resolución de problemas", en: "Problem solving" },
      { es: "Proactividad", en: "Proactivity" },
    ],
  },
];

export type TimelineEntry = {
  id: string;
  period: Localized;
  title: Localized;
  organization: Localized;
  description: Localized;
};

export const timeline: TimelineEntry[] = [
  {
    id: "freelance",
    period: { es: "Actualidad", en: "Currently" },
    title: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    organization: { es: "Freelance · Costa Rica", en: "Freelance · Costa Rica" },
    description: {
      es: "Diseño y desarrollo de páginas web para clientes particulares. Frontend con JavaScript y TypeScript, APIs REST con Python (FastAPI y Flask), bases de datos PostgreSQL y Supabase, y despliegue en Vercel y Render.",
      en: "I design and build websites for private clients. Frontend with JavaScript and TypeScript, REST APIs with Python (FastAPI and Flask), PostgreSQL and Supabase databases, and deployment on Vercel and Render.",
    },
  },
  {
    id: "cenfotec",
    period: { es: "Febrero 2025 — Presente", en: "February 2025 — Present" },
    title: {
      es: "Programación Asistida por Inteligencia Artificial",
      en: "AI-Assisted Programming",
    },
    organization: { es: "Cenfotec · San José", en: "Cenfotec · San José" },
    description: {
      es: "Formación técnica en curso, enfocada en desarrollo de software apoyado en herramientas de inteligencia artificial.",
      en: "Ongoing technical training focused on software development supported by artificial intelligence tools.",
    },
  },
  {
    id: "kracovia",
    period: { es: "Marzo 2025 — Presente", en: "March 2025 — Present" },
    title: {
      es: "Jefe de Piso / Administrador de Turno",
      en: "Floor Manager / Shift Supervisor",
    },
    organization: {
      es: "Cafetería Kracovia · San José",
      en: "Kracovia Coffee Shop · San José",
    },
    description: {
      es: "Supervisión y coordinación del personal durante el turno, control de inventario para reducir pérdidas y desabastecimiento, y organización de los turnos del equipo.",
      en: "Supervising and coordinating staff during the shift, managing inventory to reduce waste and stockouts, and organizing the team's schedule.",
    },
  },
  {
    id: "certificaciones",
    period: { es: "Certificaciones", en: "Certifications" },
    title: {
      es: "Python Avanzado · Programación con Inteligencia Artificial",
      en: "Advanced Python · Programming with Artificial Intelligence",
    },
    organization: { es: "Cenfotec", en: "Cenfotec" },
    description: {
      es: "Dos certificaciones completadas que respaldan mi nivel en Python y en el uso de inteligencia artificial aplicada al desarrollo.",
      en: "Two completed certifications backing my level in Python and in applying artificial intelligence to development.",
    },
  },
  {
    id: "bachillerato",
    period: { es: "Educación media", en: "Secondary education" },
    title: {
      es: "Bachillerato en Educación Media",
      en: "High School Diploma",
    },
    organization: { es: "Costa Rica", en: "Costa Rica" },
    description: {
      es: "Base académica sobre la que arranqué mi formación técnica en programación.",
      en: "The academic foundation I built my technical training in programming on.",
    },
  },
];
