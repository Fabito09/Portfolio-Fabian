"use client";

import * as React from "react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { CAROUSEL_CARD_COUNT, type Project } from "@/content/projects";

/** Prefijo de id que marca una tarjeta en blanco de "Próximamente". */
const PLACEHOLDER_ID_PREFIX = "placeholder-";

/** Proporción de las tarjetas (alto ÷ ancho), tomada del diseño original. */
const CARD_ASPECT = 320 / 520;

type CardLayout = {
  cardWidth: number;
  cardHeight: number;
  maxVisible: number;
  overlap: number;
  spreadDeg: number;
};

const DESKTOP_LAYOUT: CardLayout = {
  cardWidth: 520,
  cardHeight: 320,
  maxVisible: 5,
  // El original traía overlap 0.48 y spread 48°: con cinco tarjetas las de los
  // extremos giraban casi medio cuarto de vuelta y se salían de la pantalla.
  overlap: 0.6,
  spreadDeg: 24,
};

/**
 * Ancho que ocupa el abanico entero, en múltiplos del ancho de una tarjeta.
 * Sale de la geometría del CardStack: la tarjeta central más las laterales,
 * que se separan `cardWidth * (1 - overlap)` cada una.
 */
function fanWidthRatio(maxVisible: number, overlap: number) {
  const maxOffset = Math.floor(maxVisible / 2);
  return 1 + 2 * maxOffset * (1 - overlap);
}

/**
 * El CardStack necesita medidas en píxeles, así que las calculamos según el
 * ancho de la ventana. Tres tramos, porque el abanico de cinco tarjetas ocupa
 * 2,6 veces el ancho de una y recién entra cómodo en pantallas grandes:
 * en móvil y tablet se muestran tres y la tarjeta se encoge hasta caber.
 */
function useCardLayout(): CardLayout {
  const [layout, setLayout] = React.useState<CardLayout>(DESKTOP_LAYOUT);

  React.useEffect(() => {
    const update = () => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth >= 1280) {
        setLayout(DESKTOP_LAYOUT);
        return;
      }

      const isPhone = viewportWidth < 768;
      const maxVisible = 3;
      const overlap = isPhone ? 0.72 : 0.6;
      const spreadDeg = isPhone ? 14 : 18;

      // Derivamos el ancho de tarjeta del espacio disponible para que el
      // abanico no se corte contra los bordes de la pantalla.
      const widthThatFits = viewportWidth / fanWidthRatio(maxVisible, overlap);
      const cardWidth = Math.round(
        Math.min(isPhone ? viewportWidth - 72 : 500, widthThatFits, 520),
      );

      setLayout({
        cardWidth: Math.max(250, cardWidth),
        cardHeight: Math.round(Math.max(250, cardWidth) * CARD_ASPECT),
        maxVisible,
        overlap,
        spreadDeg,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

/**
 * Traduce los proyectos al idioma activo y los entrega al CardStack.
 * Se usa tanto en la portada (destacados) como en la página de proyectos.
 */
export function ProjectsCarousel({
  projects,
  autoAdvance = false,
  intervalMs = 3800,
  onActiveChange,
}: {
  projects: Project[];
  autoAdvance?: boolean;
  intervalMs?: number;
  /** Avisa qué proyecto quedó al frente, o undefined si es una de "Próximamente". */
  onActiveChange?: (project: Project | undefined) => void;
}) {
  const { t, language } = useLanguage();
  const layout = useCardLayout();

  const items: CardStackItem[] = React.useMemo(() => {
    const projectCards = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: t(project.tagline),
      tag: t(project.tag),
      imageSrc: project.imageSrc,
      videoSrc: project.videoSrc,
      href: project.demoUrl ?? project.repoUrl,
    }));
    // Tarjetas en blanco hasta completar el carrusel: lo mantienen lleno
    // mientras haya pocos proyectos, sin inventar contenido que no existe.
    const placeholderCount = Math.max(0, CAROUSEL_CARD_COUNT - projects.length);
    const placeholderCards = Array.from({ length: placeholderCount }, (_, index) => ({
      id: `${PLACEHOLDER_ID_PREFIX}${index}`,
      title: "",
    }));
    return [...projectCards, ...placeholderCards];
    // `t` cambia con el idioma, y de eso depende el texto traducido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, language]);

  return (
    <CardStack
      items={items}
      autoAdvance={autoAdvance}
      intervalMs={intervalMs}
      pauseOnHover
      showDots
      showActiveTitle
      loop
      // null deja que el CardStack dibuje la tarjeta del proyecto con su diseño.
      renderCard={(item) =>
        String(item.id).startsWith(PLACEHOLDER_ID_PREFIX) ? (
          <EmptyCard label={t(uiText.projects.comingSoon)} />
        ) : null
      }
      onChangeIndex={
        onActiveChange ? (index) => onActiveChange(projects[index]) : undefined
      }
      {...layout}
    />
  );
}

/** Tarjeta de un solo color, para los espacios todavía sin proyecto. */
function EmptyCard({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/25">
        {label}
      </span>
    </div>
  );
}
