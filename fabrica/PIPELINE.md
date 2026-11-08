# Producción diaria: 5 reels por marca, hechos, con portada y programados en Metricool

Lo ejecuta una tarea programada, sin nadie mirando: no hagas preguntas, decide y sigue. Todo en español. `MARCA` = `nutricion` o `codigo` y `MODO` = `tarde` o `respaldo` (lo dice la tarea).

- **MODO tarde** (tarea de la tarde, en la computadora de Orlando): produce los reels de **MAÑANA**. FECHA = mañana (hora de Managua). Casilla 1 = **ILUSTRADO** con imágenes de Google Flow (sigue `FLOW.md`); si Flow no está disponible, casilla 1 = EXPLICADOR «rayos X».
- **MODO respaldo** (tarea de madrugada, en la nube): FECHA = hoy. Primero mira la colección `historial`: si ya hay 5 o más reels de MARCA con `fecha` = hoy (los hizo la tarea de la tarde), **termina sin hacer nada más** (sin mensaje). Si no, produce los de hoy con casilla 1 = EXPLICADOR «rayos X».

## 0. Preparación
1. Repositorio: `git clone https://github.com/castanedaorlando222-creator/reels-publicacion ~/rp` (si el clon o el `git push` fallan por permisos, llama a `mcp__claude-code-remote__add_repo` con owner `castanedaorlando222-creator`, repo `reels-publicacion`, access `push`, y repite). `git config user.name "Fabrica de reels"; git config user.email "castanedaorlando222@gmail.com"`. Trabaja siempre con `git pull --rebase` antes de cada push (la otra marca puede estar escribiendo a la vez).
2. Lee `~/rp/fabrica/ESTILOS.md` (casillas, voces, marcas, reglas), `~/rp/fabrica/GANCHOS.md` y `~/rp/fabrica/motor/GUIA.md`. Mira los ejemplos de `~/rp/fabrica/ejemplos/`.
3. Comprueba herramientas: `python3 -c "import kokoro_onnx, soundfile, playwright"` (si falta algo: `pip install --break-system-packages kokoro-onnx soundfile`), `ffmpeg -version`. El navegador Chromium de Playwright ya está instalado: no lo reinstales.
4. Datos en el artefacto `https://claude.ai/artifact/AkEEDUZ77KjmwT12EdfzRr` con la herramienta `ArtifactData` (cárgala con ToolSearch): acción `list`, `query.limit` 1000.
   - Nutrición: `temas` (tema, gancho, categoria, base, estado, orden), `temasLibro` (tema, gancho, libro, estado, orden), `libros` (titulo, subtitulo, resumen, portada "/_blob/<id>", enlace), doc `config/estado` (cicloEstilos, proximoEstilo, logoOrlandoId, logoNCId, vozElevenLabs).
   - Estoicismo: `temasEstoicismo` (tema, gancho, categoria, formato, base, estado, orden) y también `config/estado` (para la rotación de pizarra).
   - `historial` (colección): un doc por reel publicado de cualquier marca (marca, fecha, tema, titulo). Léela entera.

## 1. Elegir los 5 temas SIN REPETIR
- Solo temas con `estado: "pendiente"`, por `orden`. Además compáralos con TODOS los títulos de `historial` de la misma marca y con los temas `usado`: si un tema pendiente trata en esencia lo mismo que uno ya publicado (mismo alimento + mismo efecto, misma cita o misma anécdota), márcalo `descartado` con `motivo: "duplicado de <id>"` y toma el siguiente.
- Reparte según ESTILOS.md (qué tema va a cada casilla).
- **Reserva antes de producir**: en cuanto elijas, marca cada tema con `ArtifactData update` (con `if_version`) `{"estado": "usado", "fecha": "<FECHA>", "casilla": N}`. Así una segunda ejecución nunca repite. Si al final un reel no se pudo hacer, devuelve su tema a `pendiente`.
- **Reponer temario**: si quedan menos de 15 pendientes en la colección de la marca (o menos de 6 en `temasLibro`), al terminar las publicaciones investiga con vidIQ (herramientas `vidiq_outliers`, `vidiq_instagram_tiktok_outlier_search`, `vidiq_youtube_search`; pocas llamadas) qué temas y ganchos funcionan ahora en el nicho en español, y añade 25 temas nuevos con la misma forma de documento (ids siguientes: `t71…` / `e099…` / `tl58…`; `orden` a continuación del máximo; `estado: "pendiente"`; `base` = de dónde sale), sin duplicar nada existente (ni pendientes ni usados ni historial).

## 2. Producir cada reel
Carpeta por reel: `~/hoy/NN` (NN = 01…05). Estilos y voces según ESTILOS.md (casillas 2 y 3 con la voz de Iván; 1, 4 y 5 con Kokoro). En modo tarde, genera primero las ilustraciones de Flow de la casilla 1 (FLOW.md) y luego produce todo.

### Casillas 1–3 (motor propio)
1. `mkdir -p ~/hoy/NN && cp -r ~/rp/fabrica/motor/* ~/hoy/NN/` y escribe `lines.json` + `story.js` (sigue `GUIA.md` y el ejemplo de su estilo; para EXPLICADOR importa `./explicador.js` y usa `captionStyle: 'karaoke'`).
2. Voz:
   - Kokoro: `python3 voz.py kokoro`.
   - Iván: `python3 voz.py texto` → genera con `mcp__ElevenLabs__creative_generate_speech`: `voice_id` = config/estado.vozElevenLabs (`oqO5cdAzjE5Ik5xWIZRL`), `model_id` "eleven_v4", **`generations_count` 1** (una sola toma; NUNCA repitas la llamada para reintentar, cobra otra vez). Consulta `mcp__ElevenLabs__creative_get_flow_run_status` hasta `all_completed`, descarga el MP3 de `content_url` con curl a `voz.mp3` y `python3 voz.py partir voz.mp3`. Si ElevenLabs falla, no tiene créditos o `partir` da ERROR → `python3 voz.py kokoro` (y dilo en el informe).
3. `python3 render.py fotos` → mira `fotos/hoja.jpg` con Read. Corrige lo que se vea mal (textos tapados, figuras rotas, escenas vacías) y repite. Luego `python3 render.py video` → `salida/reel.mp4`; mira 3 fotogramas del MP4 con ffmpeg.
4. Portada: `python3 render.py portada <segundo con buena imagen> "LÍNEA 1|LÍNEA *CLAVE*|LÍNEA 3" [codigo]` → `salida/portada.jpg` (2–3 líneas cortas en MAYÚSCULAS con el gancho; revísala con Read).

### Casillas 4–5 (becario-reels, pizarra)
1. Carga la skill `becario-reels` con la herramienta Skill y sigue su SKILL.md y referencias. `python3 /mnt/skills/plugins/becario-reels/scripts/preparar.py ~/hoy/NN`.
2. Copia encima `~/rp/fabrica/becario/nutricion/src/` → `~/hoy/NN/src/`; si MARCA = codigo, copia además `~/rp/fabrica/becario/codigo/src/` encima. Logos a `public/imagenes/`: `~/rp/fabrica/motor/img/logo-orlando.jpg`, `logo-nc.jpg`, `logo-codigo.jpg`. Para un tema de libro, descarga la portada del libro con la herramienta Artifact (action "read", url del artefacto, path = id tras "/_blob/") a `public/imagenes/libro-<id>.png`.
3. Plan (`src/datos/plan.json`): modelo de forma `~/rp/fabrica/becario/nutricion/plan-ejemplo.json`. `"personaje": false`, `"subtitulos": "linea"`, estilo de la rotación (ESTILOS.md) y luego avanza `proximoEstilo` en config/estado. Cierres:
   - Nutrición salud: penúltima CTA «*Guarda este reel* y …» (escena cta), última «Síguenos para más en *Nutrición Consciente* en Facebook y *Orlando Castañeda Nutrición* en YouTube.» con `{"tipo":"propia","nombre":"Siguenos","en":["Siguenos","Nutricion","Orlando"]}` y `"sinSubtitulos": true`.
   - Nutrición libro: penúltima = la frase «Síguenos…» con su escena; última «Si quieres saber más, todo esto lo explico en mi libro *<título corto>*. Te dejo el enlace en los comentarios.» con `{"tipo":"propia","nombre":"Libro","titulo":"<título corto>","portada":"imagenes/libro-<id>.png","pildora":"Enlace en los comentarios","en":[<palabra temprana>,"enlace","comentarios"]}` y `"sinSubtitulos": true`. Contenido basado en el `resumen` del libro, sin inventar.
   - Estoicismo: última «Síguenos en *El Código de los Mejores*, en YouTube y Facebook.» con `{"tipo":"propia","nombre":"Siguenos","en":["Siguenos","Codigo","YouTube"]}` y `"sinSubtitulos": true`. Portada `"marca": false`.
4. Voz Kokoro: `python3 ~/rp/fabrica/motor/kokoro_full.py ~/hoy/NN/src/datos/plan.json ~/hoy/NN/voz.wav` y `python3 /mnt/skills/plugins/becario-reels/scripts/alinear.py ~/hoy/NN/voz.wav --proyecto ~/hoy/NN --tempo 1.05`.
5. `node render.mjs resumen` → `node render.mjs fotos` (mira salida/hoja.png) → `node render.mjs video` → `node render.mjs portada` (revisa). Si un archivo .tsx copiado da error de compilación, corrígelo tú. Convierte la portada a JPG: `ffmpeg -i salida/portada.png -q:v 3 salida/portada.jpg`.

## 3. Subir y programar
1. Copia cada reel a `~/rp/videos/<FECHA>/<marca>-NN-<slug>.mp4` y su portada a `…/<marca>-NN-<slug>.jpg`. `git add`, `git commit -m "Reels <marca> <fecha>"`, `git pull --rebase`, `git push`. URL pública: `https://raw.githubusercontent.com/castanedaorlando222-creator/reels-publicacion/main/videos/<FECHA>/<archivo>`. Comprueba con `curl -sI` que da 200 antes de programar.
2. Limpieza: borra del repo las carpetas de `videos/` de hace más de 7 días (Metricool ya copió los vídeos a su almacenamiento) y haz push.
3. Programa cada reel con `mcp__Metricool_Social_Media_Management__createScheduledPost` (`autoPublish: true`, `draft: false`), `publicationDate.timezone` = "America/Managua", día = FECHA. Horas (en modo respaldo: si alguna ya pasó o faltan menos de 40 min, usa la siguiente hora libre de hoy; nunca dos reels de la misma marca a menos de 2 h):
   - Nutrición (blogId `7908754`): 08:30, 11:30, 14:30, 17:30, 20:30. `providers`: facebook, instagram, threads, tiktok, youtube. `facebookData: {"type":"REEL","title":"<título>"}`, `instagramData: {"type":"REEL","showReelOnFeed":true,"isAiGenerated":true}`, `threadsData: {}`, `tiktokData: {"title":"<título ≤ 90>","privacyOption":"PUBLIC_TO_EVERYONE","isAigc":true}`, `youtubeData: {"title":"<título ≤ 95> #shorts","type":"short","privacy":"public","madeForKids":false,"category":"HOWTO_STYLE","tags":[…]}`.
   - Estoicismo (blogId `7949546`): 07:00, 10:00, 13:00, 16:00, 19:00. `providers`: youtube, facebook. `youtubeData: {"title":"<título> #shorts","type":"short","privacy":"public","madeForKids":false,"category":"EDUCATION","tags":[…]}`, `facebookData: {"type":"REEL","title":"<título>"}`.
   - `media`: [URL del MP4]; `videoThumbnailUrl`: URL del JPG. Si la respuesta da `VIDEO_THUMBNAIL_NOT_APPLICABLE`, repite sin `videoThumbnailUrl` (ni `videoCoverMilliseconds`).
   - `text`: 2–3 frases que enganchan + llamada a guardar/seguir + 4–6 hashtags del tema (nutrición: #nutricion #salud #nutricionconsciente …; estoicismo: #estoicismo #marcoaurelio #sabiduria #disciplina …). Libro: añade el enlace de Amazon si `libros.<id>.enlace` existe, si no «📖 Enlace al libro en los comentarios» y pon el enlace o esa frase en `firstCommentText`.
4. Registra cada reel publicado en la colección `historial` (doc id `<marca>-<FECHA>-NN`): `{marca, fecha: FECHA, hora, tema, temaId, titulo, estilo, voz, video, plannerUrl}`.

## 4. Informe final
Envía con `SendUserMessage` un resumen corto: los 5 reels (tema, estilo, voz, hora programada), lo que falló y qué hiciste, temas pendientes que quedan y si se repuso el temario. Si algo falla en un reel, sigue con los demás. No envíes los archivos de vídeo (ya están en Metricool).
