"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimatedStackItem = {
  id: string;
  content: React.ReactNode;
};

/**
 * Posición de cada tarjeta según su profundidad en la pila. Las de atrás se
 * oscurecen con brillo y no con opacidad: una tarjeta semitransparente deja
 * ver el texto de la que tiene detrás y los dos textos se superponen.
 */
const DEPTH_STYLES = [
  { scale: 1, y: 0, brightness: 1 },
  { scale: 0.95, y: -20, brightness: 0.6 },
  { scale: 0.9, y: -40, brightness: 0.35 },
];

/** El brillo va con una transición propia: el resorte es para mover, no para colores. */
const BRIGHTNESS_TRANSITION = { duration: 0.4, ease: "easeOut" } as const;

const VISIBLE_CARDS = DEPTH_STYLES.length;

/**
 * Pila de tarjetas que se turnan: la de adelante se va hacia abajo y las de
 * atrás suben un lugar.
 *
 * Respecto al componente original: avanza sola en vez de con un botón, navega
 * por puntos, y no arrastra el bug de encender y apagar el estado de animación
 * en la misma función (React agrupaba ambas y nunca llegaba a activarse).
 */
export function AnimatedCardStack({
  items,
  autoAdvanceMs = 5000,
  className,
}: {
  items: AnimatedStackItem[];
  autoAdvanceMs?: number;
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const count = items.length;

  const goTo = React.useCallback(
    (index: number) => setActive(((index % count) + count) % count),
    [count],
  );

  const goToNext = React.useCallback(
    () => setActive((current) => (current + 1) % count),
    [count],
  );

  // `active` entra en las dependencias a propósito: así el temporizador se
  // reinicia cada vez que se avanza a mano, y la tarjeta recién traída al
  // frente dura los segundos completos en vez de saltar enseguida.
  React.useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % count),
      Math.max(2500, autoAdvanceMs),
    );
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, count, autoAdvanceMs, active]);

  if (count === 0) return null;

  // Las tres tarjetas visibles, de adelante hacia atrás.
  const visible = Array.from(
    { length: Math.min(VISIBLE_CARDS, count) },
    (_, depth) => ({ item: items[(active + depth) % count]!, depth }),
  );

  return (
    <div
      className={cn("flex w-full flex-col items-center", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[340px] w-full sm:h-[300px]">
        <AnimatePresence initial={false}>
          {visible.map(({ item, depth }) => {
            const { scale, y, brightness } = DEPTH_STYLES[depth]!;
            return (
              <motion.div
                key={item.id}
                initial={
                  reduceMotion
                    ? false
                    : { y: -40, scale: 0.9, opacity: 0, filter: "brightness(0.35)" }
                }
                animate={{ y, scale, opacity: 1, filter: `brightness(${brightness})` }}
                // La que se va cae por detrás de la nueva tarjeta del frente, que
                // es opaca: así nunca se cruzan dos textos a la vista.
                exit={
                  reduceMotion
                    ? undefined
                    : { y: 260, opacity: 0, scale: 1, zIndex: 0 }
                }
                transition={{
                  type: "spring",
                  duration: 0.9,
                  bounce: 0,
                  filter: BRIGHTNESS_TRANSITION,
                }}
                style={{
                  zIndex: VISIBLE_CARDS - depth,
                  left: "50%",
                  x: "-50%",
                  bottom: 0,
                }}
                // Un clic en la tarjeta de adelante pasa a la siguiente. Es un
                // atajo para mouse y dedo; quien navegue con teclado tiene los
                // puntos de abajo, que sí son botones.
                onClick={depth === 0 ? goToNext : undefined}
                className={cn(
                  // select-none: con los clics para avanzar se pintaba texto seleccionado.
                  "absolute w-full max-w-[560px] select-none will-change-transform",
                  depth === 0 && "cursor-pointer",
                )}
              >
                {item.content}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            // El punto se ve chico pero el botón mide 32px, para el dedo.
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              aria-current={isActive}
              aria-label={`Ir a ${index + 1}`}
              className="group grid h-8 w-8 place-items-center"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  isActive
                    ? "w-6 bg-white"
                    : "w-2 bg-white/30 group-hover:bg-white/60",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
