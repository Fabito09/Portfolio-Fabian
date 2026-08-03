"use client";

import * as React from "react";
import {
  Code2,
  Database,
  Handshake,
  Languages,
  Server,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { stackGroups, type StackGroup } from "@/content/profile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import {
  CircularGallery,
  type CircularGalleryItem,
} from "@/components/ui/circular-gallery";

/** Un icono por grupo, en el mismo orden que stackGroups. */
const GROUP_ICONS = [Code2, Server, Database, Wrench, Languages, Handshake];

/** El carrusel necesita medidas en píxeles: más chicas en celular. */
function useCardSize() {
  const [size, setSize] = React.useState({ width: 260, height: 300 });

  React.useEffect(() => {
    const update = () => {
      const isPhone = window.innerWidth < 640;
      setSize(
        isPhone
          ? { width: 210, height: 260 }
          : { width: 260, height: 300 },
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export function TechStack() {
  const { t, language } = useLanguage();
  const cardSize = useCardSize();

  const items: CircularGalleryItem[] = React.useMemo(
    () =>
      stackGroups.map((group, index) => ({
        id: group.label.en,
        content: (
          <StackCard group={group} Icon={GROUP_ICONS[index % GROUP_ICONS.length]} />
        ),
      })),
    // Los textos de las tarjetas dependen del idioma activo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  return (
    // overflow-hidden: al girar, las tarjetas laterales del carrusel se
    // proyectan más allá del ancho de la pantalla en móviles angostos. Sin
    // esto aparece scroll horizontal de forma intermitente.
    <section className="relative overflow-hidden px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={uiText.stack.eyebrow}
          title={uiText.stack.title}
          subtitle={uiText.stack.subtitle}
          centered
        />

        <Reveal delay={0.12} className="mt-12">
          <CircularGallery
            items={items}
            cardWidth={cardSize.width}
            cardHeight={cardSize.height}
          />
        </Reveal>

        <p className="mt-6 text-center text-xs text-white/35">
          {t(uiText.stack.hint)}
        </p>
      </div>
    </section>
  );
}

/** Cara del carrusel: un grupo del stack con su icono y sus etiquetas. */
function StackCard({
  group,
  Icon,
}: {
  group: StackGroup;
  Icon: (typeof GROUP_ICONS)[number];
}) {
  const { t } = useLanguage();

  return (
    // Fondo casi opaco a propósito: si fuera translúcido como el resto de los
    // paneles, se verían unas tarjetas a través de otras al girar.
    <article className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/12 bg-neutral-900/92 p-5 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-heading text-lg font-semibold text-white">
        {t(group.label)}
      </h3>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {group.items.map((item) => {
          const label = t(item);
          return (
            <li
              key={label}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
            >
              {label}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
