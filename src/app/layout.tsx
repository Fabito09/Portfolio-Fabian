import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/language-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteBackground } from "@/components/layout/site-background";
import { profile } from "@/content/profile";

// Los nombres de variable coinciden con los que espera globals.css.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

/**
 * Tipografía de titulares: serif de alto contraste, en la línea de Magtis
 * Display pero con licencia libre (SIL OFL), o sea sin problemas para un sitio
 * público. Es variable, así que un solo archivo cubre todos los grosores.
 */
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Portafolio de Fabián Villalta Arburola, desarrollador fullstack. Aplicaciones web completas, de la base de datos a la interfaz.";

export const metadata: Metadata = {
  // Necesaria para que las redes sociales armen la URL absoluta de la imagen
  // de vista previa. Sin esto, Next avisa y usa localhost.
  metadataBase: new URL("https://fabian-villalta.vercel.app"),
  title: {
    default: `${profile.name} — ${profile.role.es}`,
    template: `%s — ${profile.name}`,
  },
  description,
  openGraph: {
    title: `${profile.name} — ${profile.role.es}`,
    description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // Next lo necesita para no romper el scroll al cambiar de página,
      // ya que globals.css declara scroll-behavior: smooth.
      data-scroll-behavior="smooth"
      // Arranca marcado como "sin JS". El script de abajo quita la clase apenas
      // corre, así que si nunca corre, el CSS de respaldo deja todo visible.
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} dark no-js h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body className="relative flex min-h-full flex-col bg-neutral-950 text-white">
        <LanguageProvider>
          <SiteBackground />
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
