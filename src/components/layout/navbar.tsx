"use client";

import * as React from "react";
import { FolderCode, House, Languages, Mail, User } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useActiveSection } from "./use-active-section";

const NAV_LINKS = [
  { id: "inicio", label: uiText.nav.home, Icon: House },
  { id: "proyectos", label: uiText.nav.projects, Icon: FolderCode },
  { id: "sobre-mi", label: uiText.nav.about, Icon: User },
  { id: "contacto", label: uiText.nav.contact, Icon: Mail },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

/**
 * El efecto de lupa necesita un mouse. En pantallas táctiles los ítems van a
 * tamaño fijo y algo más chicos, para que los siete entren sin apretujarse
 * en un teléfono angosto.
 */
function useDockSizes() {
  const [sizes, setSizes] = React.useState({
    baseSize: 44,
    magnification: 68,
  });

  React.useEffect(() => {
    const update = () => {
      const hasMouse = window.matchMedia("(pointer: fine)").matches;
      const isNarrow = window.innerWidth < 400;
      const baseSize = isNarrow ? 34 : hasMouse ? 44 : 40;
      setSizes({ baseSize, magnification: hasMouse ? 68 : baseSize });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return sizes;
}

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const activeSection = useActiveSection(SECTION_IDS);
  const { baseSize, magnification } = useDockSizes();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
      <Dock
        baseSize={baseSize}
        magnification={magnification}
        className="pointer-events-auto max-w-full overflow-x-auto"
      >
        {NAV_LINKS.map((link) => (
          <DockItem
            key={link.id}
            href={`#${link.id}`}
            label={t(link.label)}
            active={activeSection === link.id}
          >
            <DockLabel>{t(link.label)}</DockLabel>
            <DockIcon>
              <link.Icon className="h-full w-full" />
            </DockIcon>
          </DockItem>
        ))}

        <span
          aria-hidden="true"
          className="mx-0.5 h-8 w-px shrink-0 self-center bg-white/15"
        />

        <DockItem
          label={t(uiText.nav.switchLanguage)}
          onClick={toggleLanguage}
        >
          <DockLabel>{language === "es" ? "English" : "Español"}</DockLabel>
          <DockIcon>
            <Languages className="h-full w-full" />
          </DockIcon>
        </DockItem>

        <DockItem href={profile.githubUrl} label="GitHub">
          <DockLabel>GitHub</DockLabel>
          <DockIcon>
            <GithubIcon className="h-full w-full" />
          </DockIcon>
        </DockItem>

        <DockItem href={profile.linkedinUrl} label="LinkedIn">
          <DockLabel>LinkedIn</DockLabel>
          <DockIcon>
            <LinkedinIcon className="h-full w-full" />
          </DockIcon>
        </DockItem>
      </Dock>
    </header>
  );
}
