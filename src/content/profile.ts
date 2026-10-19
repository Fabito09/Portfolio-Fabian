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
  // La tilde de "fabián" va codificada (%C3%A1) para que el enlace funcione
  // igual en cualquier navegador y al copiarlo o pegarlo en otro lado.
  linkedinUrl:
    "https://www.linkedin.com/in/fabi%C3%A1n-villalta-arburola-343a45338/",
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

/** Todo sale de la sección de habilidades del CV. */
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
    label: { es: "Inteligencia artificial", en: "Artificial intelligence" },
    items: [
      "Claude Code",
      "Codex",
      "Gemini",
      { es: "Ingeniería de prompts", en: "Prompt engineering" },
      { es: "Debugging asistido con IA", en: "AI-assisted debugging" },
    ],
  },
  {
    label: { es: "Herramientas", en: "Tools" },
    items: ["Git", "Vercel", "Render", "Excel"],
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
    period: { es: "Febrero 2026 — Presente", en: "February 2026 — Present" },
    title: {
      es: "Desarrollador Full Stack",
      en: "Full Stack Developer",
    },
    organization: { es: "Freelance · Costa Rica", en: "Freelance · Costa Rica" },
    description: {
      es: "Aplicaciones web de punta a punta, del requerimiento al despliegue: APIs REST con Python (FastAPI y Flask) sobre PostgreSQL y Supabase, e interfaces con React y Next.js. Además automatizo tareas repetitivas de los clientes.",
      en: "End-to-end web applications, from requirements to deployment: REST APIs with Python (FastAPI and Flask) on PostgreSQL and Supabase, and interfaces with React and Next.js. I also automate my clients' repetitive tasks.",
    },
  },
  {
    id: "cenfotec",
    period: { es: "Febrero 2026 — Octubre 2026", en: "February 2026 — October 2026" },
    title: {
      es: "Técnico en Programación Asistida con IA",
      en: "Technical Diploma in AI-Assisted Programming",
    },
    organization: {
      es: "Universidad CENFOTEC · San José",
      en: "Universidad CENFOTEC · San José",
    },
    description: {
      es: "Plan de estudios completado: 10 cursos y 176 horas, de Python avanzado a automatización de procesos, verificación de código y debugging asistido con IA generativa.",
      en: "Completed program: 10 courses and 176 hours, from advanced Python to process automation, code verification and debugging assisted by generative AI.",
    },
  },
  {
    id: "kracovia",
    period: { es: "Marzo 2025 — Presente", en: "March 2025 — Present" },
    title: {
      es: "Jefe de Piso / Administrador de Turno",
      en: "Floor Supervisor / Shift Manager",
    },
    organization: {
      es: "Cafetería Kracovia · San José",
      en: "Kracovia Coffee Shop · San José",
    },
    description: {
      es: "Coordinación del personal en turno y estandarización del servicio para sostener los tiempos de atención en horas pico, control de inventario para reducir pérdidas y quiebres de stock, y organización de turnos según la demanda.",
      en: "Coordinating staff on shift and standardizing service to keep wait times steady at peak hours, managing inventory to cut waste and stockouts, and scheduling shifts around demand.",
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
