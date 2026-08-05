import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile, stackGroups } from "@/content/profile";

/**
 * Imagen de vista previa que se ve al compartir el link en LinkedIn,
 * WhatsApp, Twitter o cualquier chat. Se genera al compilar, no en cada
 * visita.
 *
 * Todo va en tamaños grandes a propósito: en el feed se muestra a menos de
 * un tercio de este tamaño, y ahí el texto chico no se lee.
 */
export const alt = `${profile.name} — ${profile.role.es}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Devuelve la foto en base64, o null si todavía no está puesta en /public. */
async function loadPhoto() {
  for (const filename of ["foto.jpg", "foto.jpeg", "foto.png"]) {
    try {
      const file = await readFile(join(process.cwd(), "public", filename));
      const mime = filename.endsWith(".png") ? "image/png" : "image/jpeg";
      return `data:${mime};base64,${file.toString("base64")}`;
    } catch {
      // Probamos con la siguiente extensión.
    }
  }
  return null;
}

export default async function OpenGraphImage() {
  // Peso fijo en .woff, del paquete @fontsource. El generador de imágenes no
  // admite fuentes variables (las que llevan el peso como parámetro), que es
  // el formato en el que Google Fonts publica Playfair por defecto.
  const playfair = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff",
    ),
  );
  const photo = await loadPhoto();

  // Las tecnologías de frontend y backend, que es lo que más dice de un perfil.
  const highlights = [
    ...stackGroups[0]!.items.slice(3, 6),
    ...stackGroups[1]!.items.slice(0, 2),
  ]
    .map((item) => (typeof item === "string" ? item : item.es))
    .join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 84px",
          // Evoca el fondo del sitio: violeta y azul profundos sobre negro.
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 25% 40%, #3b2f6b 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 85% 80%, #2a2f6b 0%, transparent 55%)",
        }}
      >
        {photo ? (
          // Acá no corre HTML sino el generador de imágenes: no existe
          // next/image, y el alt no tiene sentido porque el resultado es un
          // PNG plano, cuyo texto alternativo se define arriba en `alt`.
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={photo}
            width={300}
            height={300}
            style={{
              width: 300,
              height: 300,
              borderRadius: 150,
              objectFit: "cover",
              border: "6px solid rgba(255,255,255,0.9)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              color: "#0a0a0c",
              fontSize: 120,
              fontFamily: "Playfair",
              flexShrink: 0,
            }}
          >
            FV
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: "#ffffff",
              fontFamily: "Playfair",
              letterSpacing: "-0.02em",
            }}
          >
            Fabián Villalta
          </div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: "#ffffff",
              fontFamily: "Playfair",
              letterSpacing: "-0.02em",
            }}
          >
            Arburola
          </div>

          <div
            style={{
              marginTop: 28,
              width: 90,
              height: 5,
              backgroundColor: "rgba(255,255,255,0.55)",
            }}
          />

          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {profile.role.es}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 25,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {highlights}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfair, style: "normal", weight: 700 },
      ],
    },
  );
}
