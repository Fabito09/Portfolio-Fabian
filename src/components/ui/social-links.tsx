"use client";

import { Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { cn } from "@/lib/utils";

/** Se usa en el footer y en la sección de contacto, así vive en un solo lugar. */
const SOCIAL_LINKS = [
  { label: "GitHub", href: profile.githubUrl, Icon: GithubIcon },
  { label: "LinkedIn", href: profile.linkedinUrl, Icon: LinkedinIcon },
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            title={label}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:text-white"
          >
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
