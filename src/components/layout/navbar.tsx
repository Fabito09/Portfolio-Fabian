"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { LanguageSwitch } from "./language-switch";
import { useActiveSection } from "./use-active-section";
import { cn } from "@/lib/utils";

/** El sitio es una sola página: cada enlace lleva a una sección, no a una ruta. */
const NAV_LINKS = [
  { id: "inicio", label: uiText.nav.home },
  { id: "proyectos", label: uiText.nav.projects },
  { id: "sobre-mi", label: uiText.nav.about },
  { id: "contacto", label: uiText.nav.contact },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

/** Iniciales para el logo, derivadas del nombre para no repetirlas a mano. */
const initials = profile.name
  .split(" ")
  .slice(0, 2)
  .map((word) => word[0])
  .join("");

export function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menú a pantalla completa abierto, el fondo no debe poder scrollear
  // por detrás; y la tecla Escape lo cierra, como cualquier ventana modal.
  React.useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-5">
      {/* Barra flotante en forma de píldora, centrada y despegada del borde. */}
      <nav
        className={cn(
          "mx-auto flex w-full max-w-4xl items-center gap-2 rounded-full border p-1.5 transition-all duration-500",
          scrolled
            ? "border-white/15 bg-neutral-950/85 shadow-2xl shadow-black/50 backdrop-blur-xl"
            : "border-white/10 bg-neutral-950/60 shadow-xl shadow-black/30 backdrop-blur-lg",
        )}
      >
        {/* Logo circular */}
        <a
          href="#inicio"
          aria-label={profile.name}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-bold tracking-tight text-neutral-950 transition-transform hover:scale-105"
        >
          {initials}
        </a>

        {/* Enlaces a las secciones */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-white" : "text-white/55 hover:text-white",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="navbar-active-link"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{t(link.label)}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <LanguageSwitch />

          {/* Botón de contacto en color invertido, como remate de la píldora. */}
          <a
            href={`mailto:${profile.email}`}
            className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-white/90 sm:flex"
          >
            <Mail className="h-4 w-4 shrink-0 lg:hidden" />
            {/* El correo entero solo cuando hay lugar; si no, solo el icono. */}
            <span className="hidden lg:inline">{profile.email}</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? uiText.nav.closeMenu : uiText.nav.openMenu)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil a pantalla completa. Va en z-40, debajo de la píldora
          (z-50), para que el botón de cerrar siga visible arriba. */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(uiText.nav.openMenu)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 -z-10 flex flex-col justify-center bg-neutral-950/95 px-8 backdrop-blur-2xl md:hidden"
          >
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
              }}
            >
              {NAV_LINKS.map((link, index) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.li key={link.id} variants={MENU_ITEM_VARIANTS}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-baseline gap-4 py-2 text-4xl font-bold tracking-tight transition-colors",
                        isActive ? "text-white" : "text-white/40",
                      )}
                    >
                      <span className="font-mono text-xs text-white/25">
                        0{index + 1}
                      </span>
                      {t(link.label)}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.a
              variants={MENU_ITEM_VARIANTS}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              href={`mailto:${profile.email}`}
              onClick={() => setMenuOpen(false)}
              className="mt-12 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-neutral-950"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

const MENU_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
