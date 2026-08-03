"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Aparece con un desplazamiento suave la primera vez que entra en pantalla.
 * Respeta "prefers-reduced-motion": si el sistema lo pide, no anima nada.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      // Marca para el CSS de respaldo: si no hay JavaScript, globals.css fuerza
      // que esto se vea en vez de quedar invisible esperando la animación.
      data-reveal=""
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
