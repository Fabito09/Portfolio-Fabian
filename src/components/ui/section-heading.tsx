"use client";

import { useLanguage, type Localized } from "@/i18n/language-provider";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

/** Encabezado común a todas las secciones: etiqueta, título y bajada. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
}: {
  eyebrow: Localized;
  title: Localized;
  subtitle?: Localized;
  centered?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <Reveal className={cn(centered && "flex flex-col items-center text-center")}>
      <p className="section-eyebrow">{t(eyebrow)}</p>
      <h2 className="section-title">{t(title)}</h2>
      {subtitle ? (
        <p className={cn("section-subtitle", centered && "mx-auto text-center")}>
          {t(subtitle)}
        </p>
      ) : null}
    </Reveal>
  );
}
