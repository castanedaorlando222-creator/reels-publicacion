# Los 5 reels de cada marca (estilos aprobados por Orlando)

**Audio: SIN música de fondo** (Orlando no la quiere). Solo voz + efectos de sonido. El motor ya viene así (`mix.py`); no añadas pistas de música en ningún estilo.

El estilo LIGHTBOX (`ejemplos/lightbox-seneca`) queda en reserva: no se usa salvo que Orlando lo pida.

Cada día, cada marca publica 5 reels de 30–45 s, uno por casilla, en este orden (Orlando): rayos X → Mandela → faro → faro → pizarra. Google Flow está en pausa (FLOW.md queda para más adelante).

| Casilla | Estilo | Motor | Voz | Ejemplo aprobado |
|---|---|---|---|---|
| 1 | **EXPLICADOR «rayos X»**: UN protagonista enorme por plano (cuerpo, órgano, vaso sanguíneo, gráfica, reloj, plato…) en línea de neón sobre azul profundo con partículas; un plano nuevo cada 3–4 s con una sola idea animada; etiquetas en píldora; subtítulos ARRIBA con recuadro en la palabra que suena (`captionStyle: 'karaoke'`). Estoicismo: misma receta en negro y dorado (mente/cerebro, círculos de control, relojes, gráficas, siluetas de neón) | `motor/` + `explicador.js` | Kokoro | `ejemplos/explicador-sueno` |
| 2 | **HISTORIA DOCUMENTAL** (estilo «Mandela»): un caso o personaje REAL, fechas y lugares en etiquetas tipo archivo, tono de documental, paleta oscura y dorada, grano | `motor/` | Iván (ElevenLabs) | `ejemplos/doc-mandela` |
| 3 | **FARO**: una persona ficticia con nombre y edad, de noche (azul profundo), reloj arriba a la izquierda, etiquetas tipo terminal, tinte rojo en el riesgo y verde en la solución | `motor/` | Iván (ElevenLabs) | `ejemplos/faro-ozempic` |
| 4 | **FARO** (otra vez, con otra persona, otro escenario y otra paleta nocturna que la casilla 3) | `motor/` | Kokoro | `ejemplos/faro-ozempic` |
| 5 | **PIZARRA**: skill becario-reels, estilo de la rotación | becario-reels | Kokoro | `becario/<marca>/plan-ejemplo.json` (nutrición) |

Rotación de estilos de pizarra (doc `config/estado` del artefacto, campo `proximoEstilo`, índice en `cicloEstilos` = nube, pizarra, noche, menta, limón). Cada reel de pizarra usa el estilo de `proximoEstilo` y lo avanza en 1 (vuelve a 0 tras 4). Nutrición: en «menta» y «nube» acento verde de marca `{"base": "<estilo>", "colores": {"acento": "#1E8449", "acentoTexto": "#FFFFFF"}}`. Estoicismo: en todos `{"base": "<estilo>", "colores": {"acento": "#C9A24A", "acentoTexto": "#0B0906"}}` (dorado).

## Qué tema va a cada casilla
- **Nutrición**: casillas 1–4 = temas de salud (colección `temas`); casilla 5 (pizarra) = tema de libro (colección `temasLibro`, con la escena final «Libro»). La casilla 2 (documental) necesita una historia real de la ciencia de la nutrición o de un caso documentado relacionado con el tema (p. ej. James Lind y el escorbuto para la vitamina C; Eijkman y el beriberi para la tiamina; Goldberger y la pelagra para la niacina); elige para ella el tema pendiente que mejor se preste.
- **Estoicismo**: las 5 casillas de `temasEstoicismo`. Temas con `formato: "historia"` → casilla 2 (personaje histórico real) o 3–4 (persona actual ficticia que aplica la idea); temas `"pintura"` → casillas 1 y 5 (o 3–4).
- El protagonista de cada plano ocupa al menos el 60 % del ancho. Nada de figuras pequeñas en medio de fondo vacío: si un plano se ve vacío en la hoja de fotos, agranda o cambia la idea.

## Marca en cada estilo
- Nutrición (motor): por defecto (logos Orlando arriba-derecha y NC abajo-centro, cierre verde «Guarda este reel / Síguenos…»). Frases finales: «Guarda este reel y compártelo con alguien que lo necesite.» y «Síguenos para más en Nutrición Consciente en Facebook y Orlando Castañeda Nutrición en YouTube.» (`noSubs: true`, `cierreFrom` = la de «Guarda»).
- Estoicismo (motor): `marca: 'codigo'` (un solo logo, cierre negro y dorado). Frase final única: «Síguenos en El Código de los Mejores.» (`noSubs: true`, `cierreFrom` = esa frase).
- becario-reels: nutrición con `becario/nutricion/src/*` (logos y escena «Siguenos» de las dos marcas, «Libro» para los de libro, portada con `"marca": true`); estoicismo con `becario/codigo/src/*` encima de esos (logo único `imagenes/logo-codigo.jpg`, cierre «Síguenos · El Código de los Mejores · YouTube · Facebook») y portada `"marca": false`.

## Reglas de contenido (siempre)
- Ganchos: lee `GANCHOS.md` (fórmulas de los primeros 3 segundos sacadas de vidIQ). Usa el campo `gancho` del tema como punto de partida.
- Honestidad: cifras, fechas, citas y referencias REALES y verificadas con WebSearch antes de usarlas (cita con libro y capítulo cuando sea un estoico). Nada de promesas de curación ni «en X días». Si un tema no se puede tratar con honestidad, márcalo `descartado` con motivo y usa el siguiente.
- Español latinoamericano, cercano. 30–45 s: 8–11 frases cortas en el motor; 9–14 en becario-reels.
- Varía personajes (nombre, edad, sexo, ropa, pelo), escenarios y paletas entre días. Nunca copies las escenas del ejemplo: es modelo de forma y calidad.
