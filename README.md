# Portafolio — Fabián Villalta Arburola

Portafolio personal de una sola página, bilingüe (español / inglés), con fondo
animado en WebGL y carruseles interactivos.

## Arrancar el proyecto

```bash
npm install
npm run dev      # desarrollo, en http://localhost:3000
```

Para probarlo tal como se verá publicado:

```bash
npm run build
npm run start
```

La consola muestra una línea `Network:` con una dirección tipo
`http://192.168.0.x:3000`, que sirve para abrirlo desde el celular estando en
la misma red WiFi.

## Dónde editar el contenido

Todo el texto y los datos viven en `src/content/`, separados del diseño. No
hace falta tocar componentes para actualizar el portafolio:

| Archivo | Qué contiene |
| --- | --- |
| `src/content/profile.ts` | Nombre, contacto, enlaces, stack y trayectoria |
| `src/content/projects.ts` | Los proyectos del carrusel |
| `src/content/ui-text.ts` | Todos los textos de la interfaz |

Cada texto se escribe en los dos idiomas a la vez:

```ts
title: { es: "Proyectos", en: "Projects" }
```

TypeScript avisa si falta uno de los dos, así que las traducciones no se
desincronizan. Lo que se escribe igual en ambos idiomas (nombres de
tecnologías) puede ir como texto simple.

### Agregar un proyecto

`src/content/projects.ts` arranca con la lista vacía y el carrusel muestra
tarjetas en blanco con "Próximamente". Dentro del archivo hay una plantilla
comentada para copiar. Al agregar el primer proyecto, el panel de detalle y
los textos normales vuelven solos.

Las capturas van en `public/proyectos/` y se referencian como
`/proyectos/mi-captura.png`.

## Estructura

```
src/
  app/            Página, layout y estilos globales
  components/
    layout/       Navbar, footer y fondo del sitio
    sections/     Cada bloque de la página
    ui/           Piezas reutilizables (carruseles, shader, iconos)
  content/        Textos y datos editables
  i18n/           Sistema de idiomas
```

## Stack

- **Next.js 16** (App Router) y **React 19**
- **TypeScript**
- **Tailwind CSS v4** con **shadcn/ui**
- **Framer Motion** para las animaciones
- **WebGL** para el fondo animado

## Notas

- El fondo es un único canvas WebGL compartido por toda la página. Se detiene
  cuando la pestaña no está visible para no gastar batería.
- El contenido principal no depende de JavaScript: si los scripts no cargan,
  el texto se ve igual.
- Los CV en PDF están en `public/`, uno por idioma.

## Verificar antes de publicar

```bash
npx tsc --noEmit   # tipos
npm run lint       # estilo y errores
npm run build      # compilación de producción
```
