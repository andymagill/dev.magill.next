

# dev.magill.next

# Introducción

Este proyecto es una aplicación de portafolio y blog generado estáticamente basada en TypeScript/React/Next.js para mi sitio web profesional en https://magill.dev. Construido siguiendo el enfoque arquitectónico JAMstack, incluye analítica, pruebas unitarias, generación de sitios estáticos, enrutamiento dinámico, compartición en redes sociales, sitemaps automatizados, datos estructurados JSON-LD, feed RSS, análisis de contenido en Markdown y más.

## Instalación

Para instalarlo, sigue estos pasos:

1. Asegúrate de tener Node.js versión 14 o superior instalado en tu máquina.
2. Instala pnpm si aún no lo has hecho: `npm install -g pnpm` (o consulta la [guía de instalación de pnpm](https://pnpm.io/installation))
3. Clona el repositorio: `git clone https://github.com/andymagill/dev.magill.next.git`
4. Instala las dependencias del proyecto: `pnpm install`

## Desarrollo

`pnpm run dev`: Inicia el servidor de desarrollo.

## Compilación

`pnpm run build`: Crea una compilación de producción de la aplicación

`pnpm run start`: Inicia la aplicación utilizando SSR en modo de producción

`pnpm run serve`: Sirve la versión estática utilizando SSG en modo de producción

## Pruebas

`pnpm run test`: Ejecuta las pruebas utilizando Vitest.

`pnpm run analyze`: Ejecuta el Analizador de Compilación de Next.js.

## Formato de Código y Linting

`pnpm run format`: Verifica el código en busca de errores de formato y linting.

`pnpm run fix`: Corrige el código según la configuración del proyecto.

## Estructura del Proyecto

- `app`: Contiene la aplicación React.
- `app/components`: Contiene todos los componentes de React.
- `app/pages`: Contiene todas las páginas de Next.js.
- `utils`: Contiene funciones utilitarias.
- `public`: Contiene activos de archivos estáticos.
- `content`: Contiene el contenido del sitio.

## Tecnologías Utilizadas

- **JAMstack:** El proyecto sigue los principios de JAMstack, entregando sitios rápidos, seguros y escalables mediante JavaScript, APIs y marcado prerenderizado.
- **Next.js:** Un framework popular basado en React para crear sitios web y aplicaciones renderizados del lado del servidor (SSR) y generados estáticamente.
- **TypeScript:** Un superconjunto de JavaScript que añade tipado estático opcional y otras características para mejorar la experiencia de desarrollo.
- **ESLint:** Una herramienta de análisis estático de código utilizada para marcar código sospechoso y hacer cumplir estándares de codificación.
- **Prettier:** Un formateador de código que automáticamente formatea el código con un estilo consistente.
- **Vitest:** Un framework de pruebas unitarias rápido para aplicaciones JavaScript.
- **CSS Modules:** Un archivo CSS en el que todos los nombres de clases y animaciones tienen ámbito local de forma predeterminada.
- **SASS:** Un preprocesador CSS que añade potencia y elegancia al lenguaje base, utilizado para hojas de estilo más mantenibles.
- **Markdown:** Utilizado para el contenido del blog y la documentación, con [gray-matter](https://www.npmjs.com/package/gray-matter) para el análisis de frontmatter y [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx) para renderizar Markdown como componentes de React.
- **Feed RSS:** La biblioteca [`rss`](https://www.npmjs.com/package/rss) se utiliza para generar un feed RSS para las publicaciones del blog, mejorando la descubribilidad y la sindicación.
- **next-sitemap:** Genera automáticamente un sitemap para optimizar el SEO.
- **@fortawesome/react-fontawesome:** Proporciona iconos vectoriales escalables para la interfaz de usuario.
- **@next/bundle-analyzer:** Una herramienta para visualizar el tamaño de los archivos de salida con un mapatree interactivo y ampliable.  
  _Ejecuta `pnpm run analyze` para generar un informe del paquete después de la compilación._
- **Jest DOM & Testing Library:** Para afirmaciones mejoradas y pruebas de componentes de React.
- **Serve:** Utilizado para servir localmente la salida de compilación estática.
- **Wrangler:** Para administrar Cloudflare Workers (si se utilizan para despliegue o funciones en el borde).

## Documentación y Recursos Externos

- [Sitio web oficial de JAMstack](https://jamstack.org/) — Aprende más sobre la arquitectura JAMstack, mejores prácticas y recursos de la comunidad.
- [Documentación de Next.js](https://nextjs.org/docs) — Documentación oficial del framework Next.js.
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/) — Documentación y guías exhaustivas de TypeScript.
- [Documentación de React](https://react.dev/) — Documentación oficial de React, incluyendo tutoriales y referencia de API.
- [Documentación de Vitest](https://vitest.dev/) — Documentación del framework de pruebas Vitest.
- [gray-matter](https://www.npmjs.com/package/gray-matter) — Biblioteca para analizar frontmatter desde archivos Markdown.
- [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx) — Renderiza Markdown directamente en componentes JSX.
- [Paquete npm de RSS](https://www.npmjs.com/package/rss) — Biblioteca para generar feeds RSS.
- [next-sitemap](https://www.npmjs.com/package/next-sitemap) — Herramienta para generar sitemaps con Next.js.
- [Font Awesome React](https://fontawesome.com/v5/docs/web/use-with/react/) — Documentación para utilizar iconos de Font Awesome con React.
- [Serve](https://www.npmjs.com/package/serve) — Servidor de archivos estáticos y listado de directorios.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — CLI para Cloudflare Workers.

## Lineamientos de Contribución

1. Haz un fork del repositorio.
2. Crea una nueva rama: `git checkout -b feature-branch`
3. Realiza tus cambios y haz commit: `git commit -m 'Añadir nueva característica'`
4. Haz push a la rama: `git push origin feature-branch`
5. Crea un [pull request en GitHub](https://github.com/andymagill/dev.magill.next/pulls).

## Mantenimiento de Dependencias

Las verificaciones de Dependabot se ejecutan semanalmente los lunes por la mañana, y la configuración en [.github/dependabot.yml](.github/dependabot.yml#L1-L57) mantiene las actualizaciones predecibles al agrupar paquetes de Next.js/tiempo de ejecución, herramientas de Markdown/contenido, utilidades de desarrollo generales y flujos de trabajo de GitHub Actions en un máximo de tres PR de pnpm y dos PR de flujos de trabajo por ciclo. Trata cada PR entrante como parte de su grupo nombrado para que podamos fusionar un paquete completo de cambios relacionados en lugar de reaccionar a actualizaciones dispersas.

### Creación de Issues

Si encuentras un error, tienes una solicitud de característica o quieres hacer una sugerencia, abre un issue utilizando la página de [GitHub Issues](https://github.com/andymagill/dev.magill.next/issues).

**Al crear un issue:**

- Proporciona un título claro y descriptivo.
- Incluye los pasos para reproducir el problema si reportas un error.
- Adjunta capturas de pantalla o registros de error si es útil.
- Sugiere posibles soluciones o describe el resultado esperado si corresponde.
- Para solicitudes de características, explica el caso de uso y los beneficios.

¡Tus comentarios ayudan a mejorar el proyecto!
