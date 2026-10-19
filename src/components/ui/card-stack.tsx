"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  /** Video sin sonido en bucle; imageSrc se usa de portada mientras carga. */
  videoSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  /** Muestra la etiqueta y el título de la tarjeta activa encima de ella, en vez de sobre la imagen. */
  showActiveTitle?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional). Si devuelve null, esa tarjeta usa el diseño por defecto. */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 48,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  showActiveTitle = false,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [storedActive, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // Si la lista cambia de tamaño, el índice se normaliza acá mismo durante el
  // render, en vez de corregirlo con un efecto que forzaría un render extra.
  const active = wrapIndex(storedActive, len);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  // La tarjeta activa está apoyada abajo, subida `activeLiftPx` y agrandada
  // desde el centro; el título se apoya 12px por encima de su borde superior.
  const activeTitleBottom = Math.round(
    cardHeight * (1 + (activeScale - 1) / 2) + activeLiftPx + 12,
  );

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full outline-none"
        // El alto sigue a la tarjeta (más holgura para el arco y el realce del
        // activo). El original fijaba un mínimo de 380px que en móvil dejaba
        // un hueco vacío enorme encima del abanico.
        style={{ height: cardHeight + 96 }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="carousel"
        aria-label={activeItem.title}
      >
        {/* background wash / spotlight (unique feel) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/40 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10; // subtle arc-down feel
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _event: PointerEvent | MouseEvent | TouchEvent,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 overflow-hidden rounded-2xl border shadow-2xl",
                    "will-change-transform select-none",
                    isActive
                      ? "cursor-grab border-white/25 shadow-black/50 active:cursor-grabbing"
                      : "cursor-pointer border-white/10 shadow-black/30",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    // framer doesn't support translateZ directly in animate on all setups,
                    // so we use a custom transform via style below.
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  // translateZ via style transform (kept stable w/ motion values above)
                  // We apply translateZ by using a CSS transform in a child wrapper.
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard?.(item, { active: isActive }) ?? (
                      <DefaultFanCard
                        item={item}
                        active={isActive}
                        showText={!showActiveTitle}
                        reduceMotion={reduceMotion ?? false}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {showActiveTitle && activeItem.title ? (
          <div
            className="pointer-events-none absolute inset-x-0 z-[200] flex justify-center px-4"
            style={{ bottom: activeTitleBottom }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeItem.id}
                className="text-center"
                style={{ maxWidth: cardWidth }}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeItem.tag ? (
                  <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                    {activeItem.tag}
                  </div>
                ) : null}
                <div className="mt-1 truncate font-heading text-xl font-semibold text-white sm:text-2xl">
                  {activeItem.title}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Dots navigation centered at bottom */}
      {showDots ? (
        <div className="mt-6 flex items-center justify-center gap-1">
          <div className="flex items-center">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                // El punto se ve chico, pero el botón mide 32px para que se
                // pueda tocar con el dedo sin errarle.
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className="group grid h-8 w-8 place-items-center"
                  aria-label={`Go to ${it.title}`}
                  aria-current={on}
                >
                  <span
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      on
                        ? "w-6 bg-white"
                        : "w-2 bg-white/30 group-hover:bg-white/60",
                    )}
                  />
                </button>
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="grid h-8 w-8 place-items-center text-white/60 transition hover:text-white"
              aria-label={`Abrir ${activeItem.title}`}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({
  item,
  active,
  showText,
  reduceMotion,
}: {
  item: CardStackItem;
  active: boolean;
  /** Sin texto, la tarjeta muestra solo la imagen. */
  showText: boolean;
  /** Con movimiento reducido el video no arranca solo y queda la portada. */
  reduceMotion: boolean;
}) {
  const mediaClassName = cn(
    "h-full w-full object-cover transition-all duration-500",
    active ? "scale-100 brightness-100" : "scale-105 brightness-75",
  );

  return (
    <div className="relative h-full w-full bg-neutral-900">
      {/* image */}
      <div className="absolute inset-0">
        {item.videoSrc ? (
          <video
            src={item.videoSrc}
            poster={item.imageSrc}
            aria-label={item.title}
            className={mediaClassName}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
            draggable={false}
          />
        ) : item.imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.imageSrc}
            alt={item.title}
            className={mediaClassName}
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-sm text-white/50">
            No image
          </div>
        )}
      </div>

      {showText ? (
        <>
          {/* subtle gradient overlay at bottom for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-5">
            {item.tag ? (
              <span className="mb-2 w-fit rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-sm">
                {item.tag}
              </span>
            ) : null}
            <div className="truncate font-heading text-xl font-semibold text-white">
              {item.title}
            </div>
            {item.description ? (
              <div className="mt-1 line-clamp-2 text-sm text-white/80">
                {item.description}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
