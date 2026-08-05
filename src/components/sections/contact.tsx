"use client";

import * as React from "react";
import { Check, Copy, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";

const COPIED_FEEDBACK_MS = 2000;

export function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  // El aviso de "copiado" se apaga solo; el timeout se limpia al desmontar.
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      // Si el navegador bloquea el portapapeles, el enlace mailto sigue estando.
    }
  };

  return (
    <section id="contacto" className="relative scroll-mt-28 px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="glass-panel overflow-hidden p-8 sm:p-12">
          <SectionHeading
            eyebrow={uiText.contact.eyebrow}
            title={uiText.contact.title}
            subtitle={uiText.contact.subtitle}
            centered
          />

          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                {t(uiText.contact.emailCta)}
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:w-auto"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {t(copied ? uiText.contact.copied : uiText.contact.copyEmail)}
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <SocialLinks />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
