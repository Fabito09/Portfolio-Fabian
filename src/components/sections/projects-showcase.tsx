"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";
import { projects, type Project } from "@/content/projects";
import { GithubIcon } from "@/components/ui/brand-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectsCarousel } from "./projects-carousel";

/** Carrusel completo más un panel con el detalle del proyecto al frente. */
export function ProjectsShowcase() {
  const { t } = useLanguage();
  const [activeProject, setActiveProject] = React.useState<
    Project | undefined
  >(projects[0]);

  return (
    <section
      id="proyectos"
      className="relative scroll-mt-28 overflow-hidden px-5 py-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={uiText.projects.eyebrow}
          title={uiText.projects.title}
          subtitle={
            projects.length > 0
              ? uiText.projects.subtitle
              : uiText.projects.emptySubtitle
          }
          centered
        />

        <Reveal delay={0.15} className="mt-14">
          <ProjectsCarousel
            projects={projects}
            onActiveChange={setActiveProject}
          />
        </Reveal>

        {/* Detalle de la tarjeta al frente. La key hace que se re-anime al cambiar.
            Sin proyectos cargados no hay nada que detallar, así que se omite. */}
        {projects.length > 0 ? (
          <div className="mt-12 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject?.id ?? "proximamente"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                // Alto mínimo compartido: al girar entre un proyecto y una
                // tarjeta de "Próximamente" la página no salta.
                className="glass-panel flex min-h-60 w-full max-w-2xl flex-col justify-center p-6 text-center"
              >
                {activeProject ? (
                  <ProjectDetail project={activeProject} />
                ) : (
                  <>
                    <h3 className="font-heading text-2xl font-semibold text-white">
                      {t(uiText.projects.comingSoon)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {t(uiText.projects.emptyHint)}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        <p className="mt-10 text-center text-xs text-white/35">
          {t(projects.length > 0 ? uiText.projects.hint : uiText.projects.emptyHint)}
        </p>
      </div>
    </section>
  );
}

/** Título, descripción, tecnologías y enlaces de un proyecto. */
function ProjectDetail({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <>
      <h3 className="font-heading text-2xl font-semibold text-white">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        {t(project.tagline)}
      </p>

      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/70"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
          >
            <GithubIcon className="h-4 w-4" />
            {t(uiText.projects.repo)}
          </a>
        ) : null}
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-white/90"
          >
            <ExternalLink className="h-4 w-4" />
            {t(uiText.projects.demo)}
          </a>
        ) : null}
      </div>
    </>
  );
}
