import { Hero } from "@/components/sections/hero";
import { TechStack } from "@/components/sections/tech-stack";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { AboutIntro } from "@/components/sections/about-intro";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Contact } from "@/components/sections/contact";

/**
 * Todo el portafolio vive en esta única página; el menú navega por anclas.
 * El orden es el recorrido que queremos que haga quien entra: quién soy,
 * con qué trabajo, qué construí, mi historia y cómo contactarme.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <ProjectsShowcase />
      <AboutIntro />
      <ExperienceTimeline />
      <Contact />
    </>
  );
}
