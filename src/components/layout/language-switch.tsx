"use client";

import { motion } from "framer-motion";
import { LANGUAGES, useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { cn } from "@/lib/utils";

/** Par de botones ES/EN con una píldora que se desliza al idioma activo. */
export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  return (
    // Sin borde propio: ya vive dentro de la píldora del navbar.
    <div
      className="relative flex items-center rounded-full bg-white/10 p-0.5"
      role="group"
      aria-label={t(uiText.nav.switchLanguage)}
    >
      {LANGUAGES.map((option) => {
        const isActive = option === language;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={isActive}
            className={cn(
              "relative rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
              isActive ? "text-neutral-950" : "text-white/60 hover:text-white",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="language-switch-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
