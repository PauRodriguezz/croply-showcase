# Croply Showcase — contexto del proyecto

Página estática de presentación del proyecto final **Croply** (sistema de gestión agrícola inteligente para pequeños y medianos productores de Mendoza). Proyecto Final, Ingeniería en Sistemas de Información, UTN FRM. Autores: Rodrigo Sanz, Diego Páez, Paula Rodríguez. Se publica en GitHub Pages o Vercel; el código QR del póster apunta a ella.

## Formato
- HTML, CSS y JS puros. Sin frameworks ni build. Mantenerlo así.
- Pensada para verse bien en celular (el QR se escanea con el teléfono) y en desktop.
- Animaciones sutiles, respetando `prefers-reduced-motion`.

## Tono de los textos
- Formal pero claro, con un toque de marketing sin exagerar.
- Impersonal: **sin tuteo ni voseo** ("Registra...", "Permite...", nunca "registrá" ni "registras").
- Frases cortas y fluidas. Evitar listas con muchos puntos y párrafos densos.
- No afirmar "tiempo real" (el pronóstico se actualiza, no es tiempo real estricto).
- Los sensores IoT del prototipo son simulados (el informe lo indica); no presentarlos como instalados en una finca.
- No inventar cifras, pruebas con usuarios ni resultados. Las citas de entrevistas son textuales del Anexo 3 del informe.

## Identidad visual
Fondo crema #F5F2EC, verde #076B45, verde oscuro #12382A, acento #E8F5EF, borde #EDE4D3, Montserrat. Tarjetas redondeadas con sombra suave. Círculos de puntos (`assets/img/puntitos.svg`) como textura. Personaje del logo como guía visual.

## Estructura de la página
1. Hero en dos columnas: texto y botón a la izquierda, imagen de la pantalla "Mi finca" (assets/img/mi-finca-admin.png) en marco de navegador a la derecha. No lleva video.
2. El punto de partida: citas de las entrevistas, contadores y descripción del problema.
3. Lo que construimos: solución, diagrama de arquitectura y tecnologías.
4. El sistema en acción: carrusel de 7 pantallas: 3 videos cortos (biblioteca, notas, costos) y 4 capturas con animación de scroll/zoom (clase `browser__screen--pan`, variables `--x1/--y1/--z1/--dur`) de escritorio (no se llama "demo" porque no muestra todo el sistema).
5. Línea de tiempo del proyecto (hitos del informe, sección 1.1.2), con línea oscura y burbujas.
6. ODS 2 y 12.
7. Cierre: ilustración de la cordillera, personaje, equipo y enlaces al informe y al manual.
Un rastro de huellas de zapato, fijo al costado, se revela con el scroll (solo pantallas anchas).

## Assets
- Los personajes (`personaje-1/2/3.png`) son provisorios y deben reemplazarse por SVG con fondo transparente.
- Los videos van en `assets/video/` con los nombres indicados en el README; si falta uno, se muestra un aviso en su lugar.
- Fuente de verdad del contenido: Informe de Proyecto Final (PDF) y Manual de Usuario (PDF) del proyecto.
