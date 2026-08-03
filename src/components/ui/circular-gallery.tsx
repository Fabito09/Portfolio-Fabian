"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CircularGalleryItem = {
  id: string;
  content: React.ReactNode;
};

type CircularGalleryProps = {
  items: CircularGalleryItem[];
  /** Ancho y alto de cada tarjeta, en píxeles. */
  cardWidth?: number;
  cardHeight?: number;
  /** Vueltas por minuto de la rotación automática. */
  rotationsPerMinute?: number;
  /** Profundidad de la perspectiva: más alto = efecto 3D más suave. */
  perspectivePx?: number;
  className?: string;
};

/** Camino más corto entre dos ángulos, en grados (entre -180 y 180). */
function shortestAngleDelta(from: number, to: number) {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

/**
 * Separación entre el centro y las tarjetas. Se calcula en vez de fijarse a
 * ojo: con N tarjetas repartidas en la circunferencia, este es el radio
 * mínimo para que no se solapen, más un margen de respiro.
 */
function radiusFor(itemCount: number, cardWidth: number) {
  if (itemCount < 2) return 0;
  const minimum = cardWidth / 2 / Math.tan(Math.PI / itemCount);
  // Un poco por debajo del mínimo: las tarjetas se solapan apenas, lo que en
  // 3D se lee como profundidad y evita que el centro quede hueco cuando el
  // giro cae justo entre dos.
  return Math.round(minimum * 0.95);
}

/**
 * Carrusel circular en 3D. Las tarjetas se reparten sobre un cilindro que gira
 * solo, y se puede arrastrar para moverlo a mano.
 *
 * A diferencia del original, la rotación no depende del scroll de la página
 * (que obligaba a reservar cinco pantallas de alto) y se anima escribiendo el
 * transform directamente en el DOM, sin re-renderizar React en cada cuadro.
 */
export function CircularGallery({
  items,
  cardWidth = 260,
  cardHeight = 300,
  rotationsPerMinute = 2,
  perspectivePx = 1600,
  className,
}: CircularGalleryProps) {
  const ringRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  /** Ángulo al que viajar tras un clic; null = giro libre. */
  const targetRotationRef = React.useRef<number | null>(null);

  const count = items.length;
  const anglePerItem = count > 0 ? 360 / count : 0;
  const radius = radiusFor(count, cardWidth);

  React.useEffect(() => {
    const ring = ringRef.current;
    if (!ring || count === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const degreesPerSecond = prefersReducedMotion
      ? 0
      : (rotationsPerMinute * 360) / 60;

    let raf = 0;
    let lastNow: number | null = null;
    let inView = true;

    /** Atenúa las tarjetas según se alejan del frente, para dar profundidad. */
    const paint = () => {
      ring.style.transform = `rotateY(${rotationRef.current}deg)`;
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const angle = (index * anglePerItem + rotationRef.current) % 360;
        const fromFront = Math.abs(angle > 180 ? 360 - angle : angle);
        card.style.opacity = String(Math.max(0.25, 1 - fromFront / 165));
      });
    };

    const tick = (now: number) => {
      const elapsed = lastNow === null ? 0 : (now - lastNow) / 1000;
      lastNow = now;

      if (draggingRef.current) {
        // Mientras se arrastra manda la mano.
      } else if (targetRotationRef.current !== null) {
        // Viaje suave hacia la tarjeta que se tocó: se acerca un porcentaje
        // de lo que falta en cada cuadro, así frena al llegar.
        const delta = shortestAngleDelta(
          rotationRef.current,
          targetRotationRef.current,
        );
        if (Math.abs(delta) < 0.4) {
          rotationRef.current = targetRotationRef.current;
          targetRotationRef.current = null;
        } else {
          rotationRef.current += delta * (1 - Math.exp(-7 * elapsed));
        }
      } else {
        rotationRef.current =
          (rotationRef.current + degreesPerSecond * elapsed) % 360;
      }

      paint();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf === 0) {
        lastNow = null;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Solo animamos mientras se ve en pantalla: ahorra batería en el celular.
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) start();
      else stop();
    });
    observer.observe(ring);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && inView) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    paint();
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [count, anglePerItem, rotationsPerMinute]);

  // Arrastre: mover el dedo o el mouse a lo ancho gira el carrusel.
  const dragStartX = React.useRef(0);
  const dragStartRotation = React.useRef(0);
  /** Distancia recorrida en el gesto actual, para separar clic de arrastre. */
  const dragDistanceRef = React.useRef(0);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartX.current = event.clientX;
    dragStartRotation.current = rotationRef.current;
    dragDistanceRef.current = 0;
    targetRotationRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const travelled = event.clientX - dragStartX.current;
    dragDistanceRef.current = Math.abs(travelled);
    // 3 píxeles de arrastre equivalen a un grado de giro.
    rotationRef.current = dragStartRotation.current + travelled / 3;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  /** Trae al frente la tarjeta tocada, salvo que el gesto haya sido arrastre. */
  const bringToFront = (index: number) => {
    if (dragDistanceRef.current > 6) return;
    targetRotationRef.current = -index * anglePerItem;
  };

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-label="Carrusel circular"
      className={cn(
        "relative w-full cursor-grab touch-pan-y select-none active:cursor-grabbing",
        className,
      )}
      style={{ height: cardHeight + 80, perspective: `${perspectivePx}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              cardsRef.current[index] = node;
            }}
            onClick={() => bringToFront(index)}
            className="absolute cursor-pointer"
            style={{
              width: cardWidth,
              height: cardHeight,
              marginLeft: -cardWidth / 2,
              marginTop: -cardHeight / 2,
              transform: `rotateY(${index * anglePerItem}deg) translateZ(${radius}px)`,
              // Las tarjetas del fondo del cilindro nos muestran su reverso:
              // sin esto, su texto se lee espejado a través de las de adelante.
              backfaceVisibility: "hidden",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
