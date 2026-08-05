"use client";

import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { SocialLinks } from "@/components/ui/social-links";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-neutral-950/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-10 sm:px-8 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-white">{profile.name}</p>
          <p className="mt-1 text-xs text-white/50">
            © {new Date().getFullYear()} · {t(uiText.footer.rights)}
          </p>
        </div>

        <SocialLinks />

        <p className="text-xs text-white/40">{t(uiText.footer.builtWith)}</p>
      </div>
    </footer>
  );
}
