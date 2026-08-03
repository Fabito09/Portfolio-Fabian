"use client";

import { Download } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/reveal";

export function AboutIntro() {
  const { t } = useLanguage();

  return (
    <section id="sobre-mi" className="relative scroll-mt-28 px-5 py-24 sm:px-8">
      {/* minmax(0,…) evita que una palabra larga (el correo) estire la columna
          y desborde la pantalla en móviles angostos. */}
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <Reveal>
            <p className="section-eyebrow">{t(uiText.about.eyebrow)}</p>
            {/* h2, no h1: en una sola página el único h1 es el del hero. */}
            <h2 className="section-title">{t(uiText.about.title)}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-white/65">
              <p>{t(uiText.about.paragraphOne)}</p>
              <p>{t(uiText.about.paragraphTwo)}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href={t(profile.cvPath)}
              download
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              {t(uiText.about.downloadCv)}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="min-w-0">
          {/* En móvil cada dato se apila (etiqueta arriba, valor abajo) porque
              en una sola línea el correo no entra sin apretujar todo. */}
          <dl className="glass-panel divide-y divide-white/10 p-6">
            <div className="flex flex-col gap-1 pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs uppercase tracking-wider text-white/40">
                {t({ es: "Rol", en: "Role" })}
              </dt>
              <dd className="text-sm font-medium text-white sm:text-right">
                {t(profile.role)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs uppercase tracking-wider text-white/40">
                {t({ es: "Ubicación", en: "Location" })}
              </dt>
              <dd className="text-sm font-medium text-white sm:text-right">
                {t(profile.location)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs uppercase tracking-wider text-white/40">
                {t({ es: "Idiomas", en: "Languages" })}
              </dt>
              <dd className="text-sm font-medium text-white sm:text-right">
                {t(profile.languages)}
              </dd>
            </div>
            <div className="flex flex-col gap-1 pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs uppercase tracking-wider text-white/40">
                {t({ es: "Correo", en: "Email" })}
              </dt>
              <dd className="min-w-0 text-sm font-medium text-white sm:text-right">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                >
                  {profile.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
