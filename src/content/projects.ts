import type { Localized } from "@/i18n/language-provider";

export type Project = {
  id: string;
  title: string;
  tagline: Localized;
  /** Etiqueta corta que se muestra sobre el título en la tarjeta. */
  tag: Localized;
  /** Tecnologías principales, para los chips del panel de detalle. */
  tech: string[];
  imageSrc: string;
  repoUrl?: string;
  demoUrl?: string;
};

/**
 * Todavía sin proyectos cargados: mientras esta lista esté vacía, el carrusel
 * muestra tarjetas en blanco con la leyenda "Próximamente".
 *
 * Para sumar uno, copiá este bloque adentro del array y completá los datos:
 *
 * {
 *   id: "mi-proyecto",
 *   title: "Nombre del proyecto",
 *   tag: { es: "Aplicación web", en: "Web app" },
 *   tagline: {
 *     es: "Una línea contando qué hace y para quién.",
 *     en: "One line about what it does and who it is for.",
 *   },
 *   tech: ["Python", "FastAPI", "PostgreSQL"],
 *   imageSrc: "/proyectos/mi-captura.png", // guardá la imagen en /public/proyectos/
 *   repoUrl: "https://github.com/tu-usuario/tu-repo",
 *   demoUrl: "https://tu-demo.vercel.app",
 * },
 */
export const projects: Project[] = [
  {
    id: "la-mochilera",
    title: "La Mochilera",
    tag: { es: "Tienda en línea", en: "Online store" },
    tagline: {
      es: "Tienda en línea para una marca costarricense de botas de cuero: catálogo con filtros, pedidos por WhatsApp y un panel para que la marca administre sus productos.",
      en: "Online store for a Costa Rican leather boot brand: a filterable catalog, orders through WhatsApp and an admin panel so the brand can manage its own products.",
    },
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Payload CMS", "PostgreSQL"],
    imageSrc: "/proyectos/la-mochilera.webp",
    demoUrl: "https://la-mochilera.vercel.app",
  },
];

/** Tarjetas en blanco que se muestran mientras no haya proyectos cargados. */
export const PLACEHOLDER_CARD_COUNT = 5;
