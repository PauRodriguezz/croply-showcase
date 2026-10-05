# Croply · Página del proyecto

Página de presentación (estilo *case study*) del proyecto final **Croply**, a la que lleva el código QR del póster. Es un sitio estático: HTML, CSS y JavaScript, sin dependencias ni paso de compilación.

## Ver la página en tu computadora

Abrí `index.html` con el navegador (doble clic). También funciona con un servidor local:

```bash
python -m http.server 8000   # y abrir http://localhost:8000
```

## Estructura

```
index.html            contenido y secciones
css/styles.css        estilos, paleta y animaciones
js/main.js            carrusel, videos, línea de tiempo, huellas al scrollear
assets/img/           logos, ilustraciones, diagrama de arquitectura
assets/video/         videos cortos del sistema (ver abajo)
assets/docs/          PDF del informe y del manual (ver abajo)
```

## Pendientes antes de publicar

### 1. Reemplazar los personajes por SVG

Hoy son PNG provisorios con fondo transparente. Cuando tengas los SVG:

1. Copiá los archivos a `assets/img/` (por ejemplo `personaje-1.svg`).
2. En `index.html`, cambiá la extensión `.png` por `.svg` en las tres imágenes (`personaje-1`, `personaje-2`, `personaje-3`).

| Archivo | Dónde aparece | Variante |
|---|---|---|
| `personaje-1` | Sección "Lo que construimos" | señala la planta, con banco y rastrillo |
| `personaje-2` | Al costado del carrusel (solo pantallas anchas) | señala hacia un costado |
| `personaje-3` | Cierre de la página | pulgar arriba |

### 2. Agregar los videos

El hero ya no usa video: muestra la imagen `assets/img/mi-finca-admin.png` dentro del marco de navegador.

El carrusel combina 3 videos y 4 capturas con animación (scroll o zoom, solo CSS). Videos actuales en `assets/video/`: `02-biblioteca-cultivos.mp4`, `03-notas-tareas.mp4`, `07-costos.mp4`. Capturas animadas: Mi finca (detalle de parcela, scroll), Pronóstico (zoom a la tarjeta del clima), Recomendaciones con IA (zoom a la tarjeta de IA, sobre `mi-finca-admin.png`) y Agroquímicos (`Agroquimicos.png`, scroll). Para reemplazar una captura por un video, cambiar en `index.html` el `<div class="browser__screen browser__screen--pan">` por `<div class="browser__screen" data-video="assets/video/NN-nombre.mp4" data-label="NN-nombre.mp4">`. Nombres previstos para videos nuevos:

`01-mi-finca.mp4`, `02-biblioteca-cultivos.mp4`, `03-notas-tareas.mp4`, `04-pronostico.mp4`, `05-recomendaciones-ia.mp4`, `06-agroquimicos.mp4`, `07-costos.mp4`

Para que pesen poco y carguen rápido con datos móviles (idealmente 1 a 3 MB cada uno, 5 a 12 segundos, sin audio):

```bash
ffmpeg -i grabacion.mp4 -vf "scale=1280:-2,fps=30" -an -c:v libx264 -crf 28 -preset slow -movflags +faststart 01-mi-finca.mp4
```

Para cambiar títulos, textos o el orden del carrusel, editá las `<li class="slide">` de `index.html`.

### 3. PDF del informe y del manual

Los botones del cierre apuntan a `assets/docs/informe-proyecto-final.pdf` y `assets/docs/manual-de-usuario.pdf`. Copiá los PDF con esos nombres (el informe pesa unos 25 MB; conviene comprimirlo) o quitá los botones.

### 4. Revisar el contenido

- Los textos de la línea de tiempo salen del plan de hitos del informe (sección 1.1.2). Verificá que las fechas y los nombres de las etapas coincidan con lo que quieren mostrar.
- Las citas de la sección "Lo que encontramos en el campo" son textuales del Anexo 3 del informe.
- Los sensores IoT del prototipo son simulados (así consta en el informe). La página lo aclara; mantengan esa aclaración si lo siguen siendo.

## Publicar

**GitHub Pages**

1. Subí el contenido de esta carpeta a un repositorio (por ejemplo `croply-showcase`).
2. En el repositorio: *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.
3. La página queda en `https://TU-USUARIO.github.io/croply-showcase/`.

**Vercel**

1. *Add New → Project* y elegí el repositorio.
2. Framework Preset: *Other*. Sin comando de build y con el directorio de salida en la raíz.
3. Se puede elegir un nombre corto de proyecto (por ejemplo `croply`) para que la dirección del QR sea breve.

La dirección del QR no debería cambiar una vez impreso el póster.

## Paleta y tipografía

Crema `#F5F2EC` · Verde `#076B45` · Verde oscuro `#12382A` · Acento `#E8F5EF` · Borde `#EDE4D3` · Tipografía Montserrat.
