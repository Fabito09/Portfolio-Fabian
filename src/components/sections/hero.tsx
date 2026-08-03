"use client";

import { ArrowRight, MapPin, MousePointer2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { SocialLinks } from "@/components/ui/social-links";

/**
 * La entrada escalonada se hace con CSS (clase `hero-stagger` en globals.css),
 * no con Framer Motion: así el texto se ve aunque el navegador no ejecute
 * JavaScript. Ver el comentario de la animación en globals.css.
 */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col items-center justify-center px-5 py-28 sm:px-8"
    >
      <div className="hero-stagger mx-auto w-full max-w-3xl text-center">
        <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {t(uiText.hero.kicker)}
        </p>

        <h1 className="mt-7 font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
          {profile.name}
        </h1>

        <p className="mt-5 bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text font-heading text-2xl font-medium italic text-transparent sm:text-3xl">
          {t(uiText.hero.headline)}
        </p>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
          {t(uiText.hero.subline)}
        </p>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/45">
          <MapPin className="h-3.5 w-3.5" />
          {t(profile.location)}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#proyectos"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 sm:w-auto"
          >
            {t(uiText.hero.primaryCta)}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contacto"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:w-auto"
          >
            {t(uiText.hero.secondaryCta)}
          </a>
        </div>

        <div className="mt-10 flex justify-center">
          <SocialLinks />
        </div>
      </div>

      {/* Pista de que el fondo reacciona al cursor. */}
      <p className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
        <MousePointer2 className="h-3.5 w-3.5" />
        {t(uiText.hero.scrollHint)}
      </p>
    </section>
  );
}
