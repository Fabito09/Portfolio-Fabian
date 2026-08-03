"use client";

import { ShaderBackground } from "@/components/ui/shader-background";

/**
 * Ajustes sobre el preset original del Shader Builder.
 *
 * El preset venía con brightness 0.5 y saturation 0, lo que daba un fondo casi
 * blanco y en escala de grises: precioso, pero imposible de combinar con texto
 * blanco encima. En vez de taparlo con una capa opaca (que lo haría invisible),
 * comprimimos su rango de luminancia y recuperamos el color de la paleta.
 */
const BACKGROUND_UNIFORMS = {
  // Acerca claros y oscuros al medio para que ninguna zona quede tan brillante
  // como para comerse el texto.
  contrast: 0.55,
  brightness: -0.1,
  // El preset lo tenía en 0 (gris). Lo subimos para ver el azul y el violeta.
  saturation: 0.45,
  vignette: 0.9,
};

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Respaldo: si el dispositivo no soporta WebGL o los scripts no corren,
          el canvas queda vacío. Este degradado evita que el fondo sea negro
          plano y mantiene el sitio presentable igual. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,theme(colors.indigo.900/45),transparent_60%),radial-gradient(ellipse_at_80%_80%,theme(colors.violet.900/35),transparent_55%)]" />
      <ShaderBackground className="relative h-full w-full" uniforms={BACKGROUND_UNIFORMS} />
      {/* Velo suave: asegura contraste sin esconder el movimiento del shader. */}
      <div className="absolute inset-0 bg-neutral-950/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/70" />
    </div>
  );
}
