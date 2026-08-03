"use client";

import * as React from "react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { timeline, type TimelineEntry } from "@/content/profile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import {
  AnimatedCardStack,
  type AnimatedStackItem,
} from "@/components/ui/animated-card-stack";

export function ExperienceTimeline() {
  const { t, language } = useLanguage();

  const items: AnimatedStackItem[] = React.useMemo(
    () =>
      timeline.map((entry) => ({
        id: entry.id,
        content: <TimelineCard entry={entry} />,
      })),
    // Las tarjetas muestran texto traducido, así que dependen del idioma.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  return (
    <section className="relative px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={uiText.timeline.eyebrow}
          title={uiText.timeline.title}
          centered
        />

        <Reveal delay={0.12} className="mt-12">
          <AnimatedCardStack items={items} />
        </Reveal>

        <p className="mt-2 text-center text-xs text-white/35">
          {t(uiText.timeline.hint)}
        </p>
      </div>
    </section>
  );
}

/** Cara visible de la pila: una etapa de la trayectoria. */
function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const { t } = useLanguage();

  return (
    <article className="flex h-[280px] flex-col rounded-2xl border border-white/12 bg-neutral-900/92 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:h-[250px] sm:p-7">
      <p className="font-mono text-xs tracking-wider text-white/45">
        {t(entry.period)}
      </p>
      <h3 className="mt-2 font-heading text-xl font-semibold leading-snug text-white">
        {t(entry.title)}
      </h3>
      <p className="mt-1 text-sm font-medium text-white/55">
        {t(entry.organization)}
      </p>
      <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-white/60">
        {t(entry.description)}
      </p>
    </article>
  );
}
