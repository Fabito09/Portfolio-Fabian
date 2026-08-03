"use client";

import * as React from "react";

export const LANGUAGES = ["es", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Un texto del sitio en los dos idiomas. TypeScript exige ambos. */
export type Localized = Record<Language, string>;

const STORAGE_KEY = "portfolio-language";
const DEFAULT_LANGUAGE: Language = "es";

function isLanguage(value: string | null): value is Language {
  return value === "es" || value === "en";
}

/**
 * El idioma vive en localStorage, o sea fuera de React. En vez de copiarlo al
 * estado con un efecto (que provoca un render extra y arriesga desajustes de
 * hidratación), lo leemos con useSyncExternalStore: el servidor renderiza
 * siempre el idioma por defecto y el navegador entrega el guardado.
 */
const listeners = new Set<() => void>();

/**
 * Copia en memoria del idioma activo. Es la fuente de verdad una vez que el
 * usuario elige: así el switch funciona aunque no se pueda guardar en disco,
 * y garantiza que la lectura devuelva siempre el mismo valor (lo que
 * useSyncExternalStore exige para no re-renderizar en bucle).
 */
let currentLanguage: Language | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // El evento "storage" mantiene sincronizadas las pestañas abiertas.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/**
 * Los navegadores en modo privado, o con el almacenamiento bloqueado, lanzan
 * una excepción con solo tocar localStorage. Como esto se llama durante el
 * render, esa excepción tumbaría toda la aplicación: de ahí los try/catch.
 */
function readLanguage(): Language {
  if (currentLanguage) return currentLanguage;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) {
      currentLanguage = saved;
      return saved;
    }
  } catch {
    // Sin acceso al almacenamiento: seguimos con el idioma del navegador.
  }
  currentLanguage = navigator.language?.toLowerCase().startsWith("en")
    ? "en"
    : DEFAULT_LANGUAGE;
  return currentLanguage;
}

function writeLanguage(language: Language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // No se pudo guardar la preferencia; igual cambiamos el idioma en pantalla.
  }
  currentLanguage = language;
  listeners.forEach((notify) => notify());
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /**
   * Devuelve la variante del idioma activo. Acepta también texto plano, para
   * lo que se escribe igual en los dos idiomas (nombres de tecnologías).
   */
  t: (text: Localized | string) => string;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = React.useSyncExternalStore(
    subscribe,
    readLanguage,
    () => DEFAULT_LANGUAGE,
  );

  // Mantiene el atributo lang del documento al día, que es lo que usan los
  // lectores de pantalla y los buscadores.
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: writeLanguage,
      toggleLanguage: () => writeLanguage(language === "es" ? "en" : "es"),
      t: (text) => (typeof text === "string" ? text : text[language]),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  }
  return context;
}
