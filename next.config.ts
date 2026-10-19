import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad que se mandan con todas las respuestas.
 *
 * HTTPS y Strict-Transport-Security no están acá a propósito: los pone Vercel
 * por su cuenta en cada deploy.
 */
const securityHeaders = [
  // Que el navegador respete el tipo de archivo declarado y no lo adivine.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Que ningún otro sitio pueda mostrar el portafolio dentro de un iframe.
  // Van las dos porque dicen lo mismo a navegadores de distinta época:
  // frame-ancestors es la forma actual y X-Frame-Options la que entienden los viejos.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Al salir hacia otro sitio, avisar solo el dominio de origen, no la URL entera.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El sitio no usa cámara, micrófono ni ubicación: se bloquean de entrada.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
