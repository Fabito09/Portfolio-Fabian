"use client";

import * as React from "react";

/**
 * Devuelve el id de la sección que está en el centro de la pantalla, para que
 * el menú marque sola la sección que se está mirando.
 *
 * El rootMargin recorta el área de observación a una franja delgada en el
 * medio del viewport: así la sección "activa" es la que el ojo tiene enfrente,
 * y no la primera que asoma por abajo.
 */
export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = React.useState(sectionIds[0]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
