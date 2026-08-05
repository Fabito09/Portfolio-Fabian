"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_SPRING: SpringOptions = { mass: 0.1, stiffness: 150, damping: 12 };

type DockContextValue = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  /** Tamaño en reposo de cada ítem, en píxeles. */
  baseSize: number;
  /** Tamaño al que llega el ítem que está justo bajo el cursor. */
  magnification: number;
  /** Radio de influencia del cursor. */
  distance: number;
};

const DockContext = React.createContext<DockContextValue | null>(null);

function useDock() {
  const context = React.useContext(DockContext);
  if (!context) throw new Error("Los ítems del dock van dentro de <Dock>");
  return context;
}

/** Cada ítem publica acá su tamaño actual, para que el icono acompañe. */
const DockItemContext = React.createContext<{
  size: MotionValue<number>;
  hovered: MotionValue<number>;
} | null>(null);

function useDockItem() {
  const context = React.useContext(DockItemContext);
  if (!context) throw new Error("Usar dentro de <DockItem>");
  return context;
}

export function Dock({
  children,
  className,
  baseSize = 44,
  magnification = 68,
  distance = 130,
  spring = DEFAULT_SPRING,
}: {
  children: React.ReactNode;
  className?: string;
  baseSize?: number;
  magnification?: number;
  distance?: number;
  spring?: SpringOptions;
}) {
  // Infinity = el cursor está lejos, así que ningún ítem se agranda.
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      role="toolbar"
      className={cn(
        "flex items-end gap-1.5 rounded-full border border-white/12 bg-neutral-950/70 px-2.5 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl sm:gap-2 sm:px-3",
        className,
      )}
    >
      <DockContext.Provider
        value={{ mouseX, spring, baseSize, magnification, distance }}
      >
        {children}
      </DockContext.Provider>
    </motion.div>
  );
}

/**
 * Un ítem del dock. Si recibe `href` se comporta como enlace de verdad, para
 * que se pueda navegar con el teclado y el navegador lo entienda como tal
 * (el componente original usaba divs con role="button", que no navegan).
 */
export function DockItem({
  children,
  className,
  href,
  label,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { mouseX, spring, baseSize, magnification, distance } = useDock();
  const hovered = useMotionValue(0);

  // Distancia horizontal entre el cursor y el centro de este ítem.
  const fromCursor = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return Number.POSITIVE_INFINITY;
    return x - box.x - box.width / 2;
  });

  const targetSize = useTransform(
    fromCursor,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const size = useSpring(targetSize, spring);

  const content = (
    <DockItemContext.Provider value={{ size, hovered }}>
      {children}
    </DockItemContext.Provider>
  );

  const shared = {
    "aria-label": label,
    "aria-current": active ? ("true" as const) : undefined,
    onFocus: () => hovered.set(1),
    onBlur: () => hovered.set(0),
    onMouseEnter: () => hovered.set(1),
    onMouseLeave: () => hovered.set(0),
    className: cn(
      "grid h-full w-full place-items-center rounded-full border transition-colors",
      active
        ? "border-white/25 bg-white/20 text-white"
        : "border-white/10 bg-white/[0.07] text-white/65 hover:text-white",
      className,
    ),
  };

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="relative shrink-0"
    >
      {href ? (
        <a href={href} {...shared}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={onClick} {...shared}>
          {content}
        </button>
      )}
    </motion.div>
  );
}

/** Globito con el nombre, visible al apuntar con el mouse o al tabular. */
export function DockLabel({ children }: { children: React.ReactNode }) {
  const { hovered } = useDockItem();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = hovered.on("change", (value) => setVisible(value === 1));
    return () => unsubscribe();
  }, [hovered]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: -6 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          role="tooltip"
          style={{ x: "-50%" }}
          className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-full border border-white/15 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg"
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

/** El icono, que crece junto con su ítem. */
export function DockIcon({ children }: { children: React.ReactNode }) {
  const { size } = useDockItem();
  const iconSize = useTransform(size, (value) => value * 0.42);

  return (
    <motion.span
      style={{ width: iconSize, height: iconSize }}
      className="grid place-items-center"
    >
      {children}
    </motion.span>
  );
}
