# Formato HISTORIA — guía para escribir cada reel

Reel vertical 1080×1920 de 30–45 s en formato serie: una persona, una noche, una hora que avanza, etiquetas tipo terminal, tinte rojo en los momentos de riesgo y subtítulos palabra a palabra. Todo dibujado con código. El ejemplo completo y aprobado es «Ozempic y péptidos» (`../ejemplos/faro-ozempic/`). Úsalo como modelo de forma y calidad, no como molde: cada tema necesita sus propias escenas.

## Archivos de cada reel
- `lines.json`: las frases. Campos: `id` (l1, l2…), `text` (lo que se dice, con números en palabras), `sub` (subtítulo, con cifras: «15 kilos», «tipo 2»), `hl` / `red` / `green` (palabras del `sub` EXACTAS, con su puntuación, que se pintan en amarillo / rojo / verde), `gap` (pausa después, 0.3–0.6), `noSubs` (true en la frase final «Síguenos…»).
- `story.js`: personaje, escenas, etiquetas y tramos en rojo (ver abajo).
- `lib.js`, `index.html`, `voz.py`, `render.py`, `mix.py`: NO se tocan.
- `img/logo-orlando.jpg`, `img/logo-nc.jpg` (logos circulares; el motor los pone arriba a la derecha y abajo al centro), `fonts/Inter.ttf`, `fonts/JetBrainsMono.ttf`.

## Guion (7–9 frases + cierre; 30–45 s en total)
1. Gancho con hora y persona: «Once y cuarenta de la noche. Laura…». Personaje con nombre propio, edad y una situación cotidiana real (cocina, baño, oficina, supermercado, cama, farmacia).
2. El deseo o el error (lo que la persona cree o hace).
3–7. Los datos, uno por frase, verificados con WebSearch. Cifras reales y con fuente; si no hay cifra sólida, no la pongas. Nada de promesas de curación ni «en X días».
8. Giro final: lo que olvidó / lo que nadie le dijo (la lista con la casilla en rojo funciona muy bien).
Penúltima: «Guarda este reel y compártelo con alguien que lo necesite.» (hl: Guarda, este, reel)
Última: «Síguenos para más en Nutrición Consciente en Facebook y Orlando Castañeda Nutrición en YouTube.» con `noSubs: true`.
`cierreFrom` = id de la penúltima frase (ahí empieza la tarjeta de marca).
Cambia de persona en cada reel (nombre, edad, sexo, ropa, pelo). Español latinoamericano, tono cercano.

## story.js
```js
export default function story(L, S) {
  const { T, D, wt } = S;          // T.l3 = inicio de l3; D('l3') = duración; wt('l5','páncreas') = instante de esa palabra
  const { ctx, seg, ss, eo, lerp, rr } = L;
  const look = { top: '#2e7d4f', topD: '#1f5c39', hairStyle: 'short', beard: true };
  const scenes = [ { from: 'l1', clock: '11:40 PM', draw(t, u) { ... } }, ... ];   // una escena por 1–2 frases (6–8 escenas)
  const tags = [[wt('l4','magnesio'), 120, 360, 'MAGNESIO', 'y', 34], ...];         // [instante, x, y, texto, color y|w|r|g, tamaño]
  const red = [[T.l3, T.l4 - .1]];                                                    // tramos con tinte rojo
  return { scenes, tags, red, cierreFrom: 'l9' };
}
```
`draw(t, u)`: `t` = segundo del vídeo, `u` = progreso de la escena 0..1. Empieza con un fondo (`L.sky`, `L.kitchen`…), mete lo que se mueve dentro de `ctx.save(); L.cam(u, 1, 1.06, cx, cy); … ctx.restore();` y los paneles (gráfica, lista) fuera de la cámara.

### Biblioteca (L.*)
- Fondos: `sky(top, bot)`, `kitchen(t, {day})`, `windowView(t,x,y,w,h,day)`, `desk(y)`, `bathroomTiles()`, `spotlightTable(x,y,rx)`, `glow(x,y,r,color)`, `stars`, `moon`, `sun`, `city`, `hangingLamp`, `mug(x,y,t)`.
- Persona: `person(x, y, escala, pose, t, look)`; poses `phone` | `stand` | `back` | `sick` | `happy` | `think`. look: skin, skinD, hair, top, topD, inner, pants, pantsD, hairStyle (`long`|`short`|`bald`), beard, glasses. Pie a y+526·escala. `thought(x,y,t,'💤',p)` = globo de pensamiento.
- Objetos: `pen(x,y,s,rot,color,label)`, `vial(x,y,s,t,label)`, `bottle(x,y,s,t,label,body,cap)`, `plate(x,y,r,[{col,r,dx,dy,shape}])`, `laptop(x,y,t,(w,h)=>{pantalla})`, `cursor`, `checkBadge(x,y,p)`, `scale(x,y,t,kg,color,look)`.
- Cuerpo: `bodyDiagram(t, {estomago, higado, pancreas, vesicula, intestino, corazon, cerebro, pulmones, rinones, musculo}, {rojos})` (0.25 = apagado visible, 1 = encendido), `ORGAN_POS`, `leader(desde, hasta, p)`, `dashedRing(x,y,r,t)`.
- Paneles: `phoneCard(x,y,c,{user,before,after,big,small})`, `chart(x,y,w,h,a,f,{title,split,mark})`, `checklist(x,y,w,t,t0,título,[[texto,ok]],tParpadeo)`, `typeBox(x,y,w,t,t0,título,texto)`.
- Si necesitas algo que no está (un alimento, un órgano en grande, una planta), dibújalo en story.js con `ctx` (formas planas, colores sólidos, sombras suaves, mismo estilo nocturno).

### Zonas
- Subtítulos: banda y 1300–1460. Nada importante ahí.
- Logos: arriba a la derecha (975, 175) y abajo al centro (540, 1790). Reloj: arriba a la izquierda.
- Acción principal entre y 250 y 1150. Etiquetas cerca de lo que señalan, sin tapar caras.

## Opciones extra que devuelve story()
- `marca: 'codigo'` → El Código de los Mejores (logo único, cierre negro y dorado, frase final «Síguenos en El Código de los Mejores.» con `noSubs`).
- `captionStyle: 'papel'` → subtítulos en tiras de papel (estilo LIGHTBOX), `captionY` (por defecto 1560).
- `vignette: false`, `captionPill: true` → sin viñeta / subtítulo con píldora oscura.
- LIGHTBOX: `import { makeLightbox } from './lightbox.js'` y mira `ejemplos/lightbox-seneca/story.js` (hojas con `LB.sheet`, pila con `LB.stack`, `LB.windowLight`, `LB.burn`, `LB.seal`).
- Etiquetas: `[instante, x, y, texto, color, tamaño, instanteFin]` (el último es opcional y la hace desaparecer).

## Producción
1. `python3 voz.py texto` → texto para ElevenLabs (una sola toma). Con el MP3: `python3 voz.py partir voz.mp3`. Si ElevenLabs falla o no hay créditos, o `partir` da ERROR: `python3 voz.py kokoro`.
2. `python3 render.py fotos` → mira `fotos/hoja.jpg` (12 fotos). Revisa: nada tapado por subtítulos o logos, etiquetas legibles, cada escena muestra lo que dice la voz, personaje bien dibujado. Corrige y repite.
3. `python3 render.py video` → `salida/reel.mp4`. Mira 3–4 fotogramas del MP4 final con ffmpeg antes de entregarlo.
4. `python3 render.py portada <segundo> "LÍNEA|LÍNEA *CLAVE*|LÍNEA" [codigo]` → `salida/portada.jpg`.
