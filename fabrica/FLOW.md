# Ilustraciones con Google Flow (solo en las tareas de la tarde, en la computadora de Orlando)

Las tareas de la tarde corren en la computadora de Orlando (encendida de 2:00 a 5:30 p. m., hora de Managua) y pueden usar **el navegador integrado de Claude** (herramientas `Claude_Browser`; carga antes la skill `built-in-browser`), donde Orlando dejó la sesión de Google iniciada. **Nunca escribas contraseñas**: si Flow pide iniciar sesión o algo falla, no insistas: usa para la casilla 1 el estilo EXPLICADOR «rayos X» (sin Flow) y dilo en el informe.

## Qué ilustraciones pedir (casilla 1 = ILUSTRADO)
- 6–8 imágenes por reel, verticales **9:16**, una por plano del guion. Un protagonista GRANDE y centrado por imagen (60–70 % del ancho), fondo con profundidad, sin texto dentro de la imagen (los textos los pone el código).
- Mismo estilo en todas (copia este bloque al final de cada indicación):
  - Nutrición: «Ilustración 2D vectorial de alta calidad para vídeo explicativo, degradados suaves, brillo y luz de borde, personajes simpáticos con cara (ojos grandes y expresivos), colores vivos sobre fondo oscuro azul/morado con partículas y desenfoque, estilo de animación educativa moderna, vertical 9:16, sin texto, sin letras, sin marcas de agua.»
  - Estoicismo: «Ilustración 2D cinematográfica para vídeo documental, paleta negro y dorado, luz cálida lateral, grano suave, estatuas y escenas de la antigua Roma o Grecia, figuras con expresión clara, vertical 9:16, sin texto, sin letras, sin marcas de agua.»
- Para un personaje que se repite (p. ej. una pila con cara, un hígado con cara, un filósofo), genera primero la imagen principal y en las siguientes usa esa imagen como referencia (ingrediente / «usar como referencia» en Flow) para que sea el mismo personaje con otra expresión o postura.
- Nada de personas reales reconocibles, ni logotipos o personajes de terceros.

## Cómo generarlas en Flow
1. Abre `https://labs.google/fx/tools/flow` en el navegador integrado. Crea un proyecto nuevo con el nombre `<marca> <fecha>`.
2. Elige generación de **imagen** (no vídeo: el vídeo gasta muchos créditos) y el formato vertical 9:16. Si la interfaz ofrece varios modelos de imagen, usa el de mejor calidad que no gaste créditos o gaste menos; anota en el informe si consumió créditos.
3. Pega la indicación, genera, elige la mejor variante y descárgala. Los archivos quedan en la carpeta de descargas de la computadora.
4. Pásalas al contenedor: localiza las descargas con las herramientas de dispositivo (`device_list_dir` / `device_bash` sobre la carpeta de descargas conectada) y súbelas con `device_stage_files`; cópialas a `~/hoy/01/img/flow/01.jpg … 08.jpg` (convierte a JPG 1080×1920 con ffmpeg si hace falta).
5. Si en 20 minutos no tienes las imágenes de un reel, abandona Flow para ese día y usa EXPLICADOR «rayos X».

## Cómo animarlas (motor)
- `import { makeIlustrado } from './ilustrado.js'` y en `story.assets` la lista de imágenes. Cada escena: `I.shot(IMG['img/flow/NN.jpg'], u, {…})` + `I.dust(t)` + `I.vignette()` + etiquetas/contadores del motor y de `explicador.js` (`X.pill`, `X.ring`, `X.big`, `X.graph`). Cambio de expresión con `I.swap(a, b, p, u)`.
- Plano nuevo cada 3–4 s, `captionStyle: 'karaoke'`, sin música de fondo.
