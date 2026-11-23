# Producción diaria: 4 carruseles de Nutrición + 2 de El Código, hechos y programados en Metricool

Lo ejecuta una tarea programada, sin nadie mirando: no hagas preguntas, decide y sigue. Todo en español.
FECHA = **mañana** en hora de Managua (UTC−6 fijo). Calcúlala SOLO con `python3 -c "from datetime import datetime,timedelta,timezone; print((datetime.now(timezone(timedelta(hours=-6)))+timedelta(days=1)).date())"`. Se producen los 4 carruseles de FECHA y se dejan programados.

## 0. Preparación
1. `git clone https://github.com/castanedaorlando222-creator/reels-publicacion ~/rp` (si falla por permisos: `mcp__claude-code-remote__add_repo` owner `castanedaorlando222-creator`, repo `reels-publicacion`, access `push`, y repite).
   `git config user.name "Fabrica de carruseles"; git config user.email "castanedaorlando222@gmail.com"`. Haz `git pull --rebase` antes de cada push (las tareas de reels escriben en el mismo repo).
2. Si `~/rp/carruseles/FECHA/` ya tiene 6 carpetas con `programado.txt` (4 de nutrición + 2 `codigo-*`), termina sin hacer nada; si hay algunas, haz solo las que falten.
3. Lee `~/rp/carruseles/historial.json` (lista de `{fecha, titulo, tema}`): NUNCA repitas un tema ya publicado (mismo alimento/planta + mismo beneficio = repetido).
4. Fuentes, logo y generador ya están en `~/rp/fabrica/carruseles/` (`generar.py`, `fonts/`). Solo hace falta Pillow.

## 1. Temas virales (vidIQ)
- Una o dos llamadas a `mcp__vidIQ_for_Claude__vidiq_instagram_tiktok_outlier_search` (5 créditos cada una), `descriptionLanguage: ["es"]`,
  `audienceQuery: "Culture/Region: Latinoamérica y España, hispanohablantes; Global: true; Demographics: adultos 30-65 interesados en salud natural, nutrición, plantas medicinales, remedios caseros;"`,
  `query` sobre alimentos/plantas/nutrición (varía la query cada día: p. ej. "alimentos que desinflaman", "plantas medicinales beneficios", "errores al comer", "vitaminas deficiencia señales").
- Con lo que está funcionando, elige 4 temas de carrusel distintos entre sí y del historial. Mezcla formatos: listas de alimentos/plantas («5 alimentos que…»), señales de deficiencia, errores comunes, comparativas, mitos vs realidad.
- **Afirmaciones prudentes y verdaderas**: «ayuda», «apoya», «contiene»; nunca «cura», «elimina el cáncer», porcentajes milagro ni promesas médicas. Datos que sepas con seguridad.

## 2. Producir cada carrusel (NN = 01…04)
1. Escribe `~/rp/carruseles/FECHA/NN-slug/spec.json` (formato en el docstring de `generar.py`): gancho fuerte en `titulo` con 1–2 palabras clave entre `*asteriscos*` (amarillo), `etiqueta` corta en mayúsculas, 4–6 `items` (nombre corto, `texto` de 1–2 frases con una palabra clave entre asteriscos, `consejo_titulo` + `consejo` práctico), `cierre_titulo` y `cierre_texto`.
2. Foto de portada (UNA sola por carrusel): pide las 4 juntas en una sola llamada a `mcp__vidIQ_for_Claude__vidiq_image_generate` (`aspectRatio: "9:16"`, 22 créditos por imagen). Prompt: fotografía profesional de comida/plantas del tema, vertical, colores intensos, gotas de agua, luz lateral dramática, fondo oscuro, espacio oscuro vacío en el tercio inferior, sin texto. Consulta `vidiq_job_poll` hasta `completed`.
3. El servidor de vidIQ está bloqueado desde aquí: pasa cada imagen por ElevenLabs:
   `mcp__ElevenLabs__creative_create_flow` (una vez) → `mcp__ElevenLabs__creative_attach_reference_file` con `url` = imageUrl y ese `flow_id` → `mcp__ElevenLabs__creative_get_available_assets` con los `asset_ids` → descarga cada `preview_url` con curl (es la foto a ~1024 px) → convierte a JPG con Pillow: `foto.jpg` en la carpeta del carrusel.
4. `python3 ~/rp/fabrica/carruseles/generar.py spec.json foto.jpg .` → crea `01.jpg … NN.jpg`.
5. Revisa con Read al menos la portada y una slide interior de cada carrusel (que el texto no se salga ni se encime). Corrige el spec y regenera si hace falta.
6. Commit y push de las 4 carpetas (con `git pull --rebase` antes). Comprueba que `https://raw.githubusercontent.com/castanedaorlando222-creator/reels-publicacion/main/carruseles/FECHA/NN-slug/01.jpg` da 200.

## 3. Programar en Metricool
- Marca `Nutricion conciente`, blogId `7908754`, zona `America/New_York`.
- Horarios de FECHA (hora de Nueva York): 01 → 11:00, 02 → 14:00, 03 → 16:00, 04 → 19:00 (no coinciden con los reels, que salen a las 08:00, 10:00, 12:30, 15:00, 17:30 y 20:00).
- Redes: `facebook` (facebookData `{"type":"POST"}`), `instagram` (instagramData `{"type":"POST","isAiGenerated":true}` — la portada es de IA) y `tiktok` (tiktokData con `title` = gancho sin asteriscos, máx. 90 caracteres, `photoCoverIndex` 0, `autoAddMusic` false, `privacyOption` "PUBLIC_TO_EVERYONE"). Si una red da error, programa con las demás y dilo en el informe.
- `media` = las URLs raw de GitHub de las slides, en orden. `text` = 2–4 frases con emoji moderado + llamada a guardar/compartir + 4–6 hashtags (#nutricionconsciente siempre).
- Guarda el `plannerUrl` en `programado.txt` dentro de la carpeta. Añade cada carrusel a `carruseles/historial.json` y haz commit + push.

## 4. Informe
Envía un mensaje corto con `SendUserMessage`: los 6 títulos (4 de Nutrición y 2 de El Código) con su hora, y cualquier problema (p. ej. créditos de vidIQ bajos: consulta `vidiq_balance` al final y avisa si quedan menos de 300).

## 5. El Código de los Mejores (2 carruseles diarios, estoicismo)
- Mismo proceso, en carpetas `~/rp/carruseles/FECHA/codigo-NN-slug/`, con `"marca": "codigo"` en el spec (negro y dorado, logo de El Código). Cada item lleva `"fuente"` (obra y capítulo/carta/libro) y `consejo_titulo: "APLÍCALO HOY"`.
- Público: 80 % hombres de 25 a 54 años de México, Argentina y España. Frases directas. Formato que más se viraliza: «N reglas de <filósofo> para…» (Séneca, Marco Aurelio, Epicteto, Musonio Rufo, Catón, Zenón…), también «errores que te roban la paz», «hábitos de los estoicos». No repitas filósofo + enfoque del historial (`marca: "codigo"`); alterna filósofos.
- Temas virales: una llamada a `vidiq_instagram_tiktok_outlier_search` con query sobre estoicismo/disciplina/mentalidad y `audienceQuery: "Culture/Region: México, Argentina, España; Global: false; Demographics: hombres 25-54 interesados en estoicismo, disciplina, autosuperación;"`.
- **Citas REALES y verificadas con WebSearch** antes de usarlas, con obra y capítulo correctos. Si no puedes confirmar la referencia exacta de una cita, cámbiala por otra que sí puedas confirmar. Nada de frases apócrifas (p. ej. «tienes poder sobre tu mente, no sobre los acontecimientos» NO es una cita literal).
- Portada: busto o estatua clásica del filósofo, luz dorada lateral, fondo negro, polvo dorado, mitad superior, tercio inferior oscuro vacío, sin texto (va en la misma llamada de `vidiq_image_generate` que las de nutrición: 6 imágenes en total).
- Metricool: marca `El Codigo de los Mejores`, blogId `7949546`, zona `America/New_York`, SOLO `facebook` (facebookData `{"type":"POST"}`; YouTube no admite carruseles). Horas de FECHA: codigo-01 → 11:15, codigo-02 → 18:45. Texto sin emojis, 2–3 frases con tono directo + 4–5 hashtags (#estoicismo #elcodigodelosmejores siempre).
- Añádelos al historial con `"marca": "codigo"`.
