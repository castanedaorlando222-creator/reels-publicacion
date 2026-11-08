// EXPLICADOR — estilo «rayos X brillantes» (anatomía y objetos en línea de neón sobre azul profundo).
// Reglas: UN protagonista grande por plano (60–70 % del ancho), centrado en y≈1000; fondo con profundidad (degradado + bokeh + rejilla);
// cada plano dura 2–4 s y tiene una sola idea animada; subtítulos arriba (captionStyle: 'karaoke').
//   import { makeExplicador } from './explicador.js';  const X = makeExplicador(L);
export function makeExplicador(L) {
  const { ctx, W, H, seg, ss, eo, lerp, hash, glow, rr } = L;
  const C = { line: '#9fd4ff', glow: '#3aa0ff', bone: '#e8f4ff', pink: '#ff5fb1', red: '#ff3b55', gold: '#ffd34f', green: '#5ef0a0', orange: '#ff9a3c', cyan: '#4ff0ff', violet: '#9b7bff' };
  // ---- fondo: degradado radial azul, rejilla tenue, bokeh que flota
  function bg(t, { top = '#0d2a66', bot = '#040b1f', cx = 540, cy = 900, tint = null } = {}) {
    const g = ctx.createRadialGradient(cx, cy, 80, cx, cy, 1300); g.addColorStop(0, tint || top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,170,255,.06)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let i = 0; i < 36; i++) { const x = (hash(i, 1) * W + Math.sin(t * .3 + i) * 30), y = (hash(i, 2) * H - t * (8 + hash(i, 3) * 20)) % H, r = 2 + hash(i, 4) * 7; ctx.fillStyle = `rgba(150,200,255,${.06 + hash(i, 5) * .12})`; ctx.beginPath(); ctx.arc(x, (y + H) % H, r, 0, 7); ctx.fill(); }
  }
  // ---- trazo de neón: halo ancho de color + núcleo claro
  function neon(path, col = C.glow, w = 4, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 28; ctx.strokeStyle = col; ctx.lineWidth = w * 2.2; ctx.globalAlpha = a * .45; ctx.stroke(path); ctx.globalAlpha = a; ctx.shadowBlur = 14; ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke(path); ctx.shadowBlur = 0; ctx.lineWidth = Math.max(1, w * .4); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke(path); ctx.restore(); }
  // relleno translúcido tipo cristal (vidrio azul) con brillo interior
  function glass(path, col = 'rgba(60,140,255,.18)', edge = C.line, w = 3, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fill(path); ctx.clip(path); const b = path; ctx.restore(); neon(path, edge, w, a); }
  // órgano relleno con degradado y brillo (estómago, cerebro, páncreas…)
  function organ(path, c1, c2, cx, cy, r, a = 1, pulse = 0) { ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r * 1.2); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.shadowColor = c1; ctx.shadowBlur = 40 + 30 * pulse; ctx.fillStyle = g; ctx.fill(path); ctx.shadowBlur = 0;
    ctx.clip(path); ctx.globalAlpha = a * .35; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx - r * .3, cy - r * .35, r * .45, r * .2, -.5, Math.PI * 1.1, Math.PI * 1.8); ctx.stroke(); ctx.restore(); }
  // ---- silueta de cuerpo de frente (cabeza, cuello, hombros, brazos, torso, piernas) — Path2D en coordenadas locales (alto ≈ 1700·s)
  function bodyFront(cx, top, s = 1) { const p = new Path2D(); const X = x => cx + x * s, Y = y => top + y * s;
    p.ellipse(X(0), Y(105), 78 * s, 98 * s, 0, 0, Math.PI * 2);
    p.moveTo(X(-34), Y(195)); p.lineTo(X(-36), Y(240)); p.bezierCurveTo(X(-120), Y(250), X(-205), Y(265), X(-225), Y(330));
    p.bezierCurveTo(X(-250), Y(470), X(-255), Y(640), X(-280), Y(860)); p.lineTo(X(-232), Y(870)); p.bezierCurveTo(X(-205), Y(700), X(-195), Y(560), X(-180), Y(440));
    p.bezierCurveTo(X(-175), Y(560), X(-165), Y(700), X(-160), Y(820)); p.bezierCurveTo(X(-175), Y(900), X(-180), Y(1000), X(-160), Y(1200)); p.bezierCurveTo(X(-150), Y(1350), X(-140), Y(1500), X(-130), Y(1690)); p.lineTo(X(-40), Y(1690));
    p.bezierCurveTo(X(-40), Y(1450), X(-30), Y(1200), X(0), Y(1000));
    p.bezierCurveTo(X(30), Y(1200), X(40), Y(1450), X(40), Y(1690)); p.lineTo(X(130), Y(1690)); p.bezierCurveTo(X(140), Y(1500), X(150), Y(1350), X(160), Y(1200)); p.bezierCurveTo(X(180), Y(1000), X(175), Y(900), X(160), Y(820));
    p.bezierCurveTo(X(165), Y(700), X(175), Y(560), X(180), Y(440)); p.bezierCurveTo(X(195), Y(560), X(205), Y(700), X(232), Y(870)); p.lineTo(X(280), Y(860)); p.bezierCurveTo(X(255), Y(640), X(250), Y(470), X(225), Y(330));
    p.bezierCurveTo(X(205), Y(265), X(120), Y(250), X(36), Y(240)); p.lineTo(X(34), Y(195)); return p; }
  // costillas, columna y pelvis dentro de la silueta (huesos claros)
  function skeletonFront(cx, top, s = 1, a = .8) { ctx.save(); ctx.globalAlpha = a; const X = x => cx + x * s, Y = y => top + y * s;
    for (let i = 0; i < 18; i++) { const y = 250 + i * 40; ctx.fillStyle = 'rgba(230,244,255,.55)'; rr(X(-14), Y(y), 28 * s, 28 * s, 6 * s); ctx.fill(); }
    for (let i = 0; i < 7; i++) { const y = 330 + i * 46; for (const sg of [-1, 1]) { const p = new Path2D(); p.moveTo(X(sg * 16), Y(y)); p.bezierCurveTo(X(sg * 120), Y(y - 20), X(sg * 165), Y(y + 30), X(sg * 130 - sg * i * 6), Y(y + 70)); neon(p, C.bone, 5 * s, .55); } }
    const pel = new Path2D(); pel.moveTo(X(-150), Y(900)); pel.bezierCurveTo(X(-150), Y(1010), X(-40), Y(1020), X(0), Y(1000)); pel.bezierCurveTo(X(40), Y(1020), X(150), Y(1010), X(150), Y(900)); neon(pel, C.bone, 6 * s, .55); ctx.restore(); }
  // cerebro (perfil de nuez con circunvoluciones)
  function brain(cx, cy, r, t, a = 1, col1 = '#ff8fd0', col2 = '#8a2a8a', pulse = 0) { const p = new Path2D(); p.ellipse(cx, cy, r, r * .78, 0, 0, Math.PI * 2); organ(p, col1, col2, cx, cy, r, a, pulse);
    ctx.save(); ctx.globalAlpha = a * .6; ctx.strokeStyle = 'rgba(255,230,250,.7)'; ctx.lineWidth = r * .045; ctx.clip(p); for (let k = 0; k < 7; k++) { ctx.beginPath(); const yy = cy - r * .6 + k * r * .2; for (let x = -r; x <= r; x += r * .1) ctx.lineTo(cx + x, yy + Math.sin(x / r * 9 + k) * r * .05); ctx.stroke(); } ctx.restore(); }
  // estómago (forma de J), páncreas (lágrima alargada)
  function stomachPath(cx, cy, s) { const p = new Path2D(); const X = x => cx + x * s, Y = y => cy + y * s; p.moveTo(X(-40), Y(-170)); p.bezierCurveTo(X(10), Y(-170), X(30), Y(-120), X(60), Y(-110)); p.bezierCurveTo(X(190), Y(-90), X(200), Y(90), X(80), Y(150)); p.bezierCurveTo(X(-40), Y(200), X(-170), Y(150), X(-180), Y(90)); p.bezierCurveTo(X(-150), Y(80), X(-80), Y(100), X(-30), Y(60)); p.bezierCurveTo(X(10), Y(20), X(-10), Y(-60), X(-60), Y(-120)); p.closePath(); return p; }
  function pancreasPath(cx, cy, s) { const p = new Path2D(); const X = x => cx + x * s, Y = y => cy + y * s; p.moveTo(X(-230), Y(20)); p.bezierCurveTo(X(-240), Y(-60), X(-150), Y(-70), X(-90), Y(-40)); p.bezierCurveTo(X(0), Y(-10), X(120), Y(-60), X(220), Y(-40)); p.bezierCurveTo(X(250), Y(-30), X(250), Y(10), X(220), Y(15)); p.bezierCurveTo(X(120), Y(30), X(0), Y(60), X(-100), Y(70)); p.bezierCurveTo(X(-170), Y(80), X(-225), Y(70), X(-230), Y(20)); return p; }
  // vaso sanguíneo horizontal con glóbulos rojos y partículas (glucosa, insulina)
  function vessel(t, y, h, { flow = 260, glucose = 0, insulin = 0, gcol = C.gold, icol = C.cyan } = {}) {
    const top = new Path2D(); top.moveTo(-20, y - h / 2); for (let x = -20; x <= W + 20; x += 20) top.lineTo(x, y - h / 2 + Math.sin(x / 140 + t) * 8);
    const bot = new Path2D(); bot.moveTo(-20, y + h / 2); for (let x = -20; x <= W + 20; x += 20) bot.lineTo(x, y + h / 2 + Math.sin(x / 140 + t + 1) * 8);
    const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, 'rgba(160,20,50,.35)'); g.addColorStop(.5, 'rgba(255,60,90,.18)'); g.addColorStop(1, 'rgba(160,20,50,.35)'); ctx.fillStyle = g; ctx.fillRect(0, y - h / 2, W, h);
    for (let i = 0; i < 16; i++) { const x = ((hash(i, 7) * W + t * flow * (.8 + hash(i, 8) * .4)) % (W + 160)) - 80, yy = y + (hash(i, 9) - .5) * h * .7; ctx.save(); ctx.translate(x, yy); ctx.rotate(t + i); const rg = ctx.createRadialGradient(-8, -8, 4, 0, 0, 34); rg.addColorStop(0, '#ff8a9a'); rg.addColorStop(.7, '#d81f45'); rg.addColorStop(1, '#8a0f2a'); ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(0, 0, 34, 24, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(120,10,30,.5)'; ctx.beginPath(); ctx.ellipse(0, 0, 14, 9, 0, 0, 7); ctx.fill(); ctx.restore(); }
    const dots = (n, col, seed, r) => { for (let i = 0; i < n; i++) { const x = ((hash(i, seed) * W + t * flow * 1.1) % (W + 60)) - 30, yy = y + (hash(i, seed + 1) - .5) * h * .8; ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill(); ctx.restore(); } };
    dots(Math.round(glucose * 70), gcol, 21, 9); dots(Math.round(insulin * 40), icol, 31, 7);
    neon(top, '#ff5577', 4); neon(bot, '#ff5577', 4);
  }
  // número grande con brillo
  function big(text, x, y, size, col = '#ffffff', a = 1, glowCol = C.glow) { ctx.save(); ctx.globalAlpha = a; ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = glowCol; ctx.shadowBlur = 30; ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore(); }
  // etiqueta tipo píldora (texto en mayúsculas)
  function pill(text, x, y, p, { col = C.gold, size = 36, dark = '#08142e' } = {}) { if (p <= 0) return; ctx.save(); const s = .7 + .3 * L.back(Math.min(1, p * 1.4)); ctx.globalAlpha = Math.min(1, p * 3); ctx.translate(x, y); ctx.scale(s, s); ctx.font = `800 ${size}px Inter`; const w = ctx.measureText(text).width + size * 1.1, h = size * 1.6;
    ctx.fillStyle = dark; rr(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2); ctx.restore(); }
  // anillo contador (como «14 min»)
  function ring(x, y, r, frac, label, sub, col = C.gold, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,16,40,.85)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.lineWidth = r * .12; ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(x, y, r * .86, 0, 7); ctx.stroke();
    ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r * .86, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${r * .62}px Inter`; ctx.fillText(label, x, y - r * .08); if (sub) { ctx.font = `700 ${r * .2}px Inter`; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(sub, x, y + r * .42); } ctx.restore(); }
  // gráfica de neón: pts en [0..1]×[0..1] dentro de la caja; p = cuánto se ha dibujado
  function graph(pts, box, p, col = C.gold, w = 7) { const [x0, y0, bw, bh] = box; const path = new Path2D(); const n = Math.max(2, Math.floor(pts.length * p)); pts.slice(0, n).forEach(([u, v], i) => { const x = x0 + u * bw, y = y0 + bh - v * bh; i ? path.lineTo(x, y) : path.moveTo(x, y); }); neon(path, col, w);
    const [u, v] = pts[n - 1]; ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x0 + u * bw, y0 + bh - v * bh, w * 1.6, 0, 7); ctx.fill(); ctx.restore(); }
  function axes(box) { const [x0, y0, bw, bh] = box; const p = new Path2D(); p.moveTo(x0, y0); p.lineTo(x0, y0 + bh); p.lineTo(x0 + bw, y0 + bh); neon(p, 'rgba(160,200,255,.7)', 3); }
  // esqueleto que camina (perfil, línea de neón) — ciclo de 1 s
  function walker(cx, groundY, s, t, col = C.line) { const ph = t * Math.PI * 2; const hip = [cx, groundY - 470 * s]; const sh = [cx + 10 * s, groundY - 800 * s];
    const leg = (o, c) => { const a = Math.sin(ph + o) * .5; const knee = [hip[0] + Math.sin(a) * 230 * s, hip[1] + Math.cos(a) * 230 * s]; const b = a - Math.max(0, Math.sin(ph + o + 1.2)) * .9; const foot = [knee[0] + Math.sin(b) * 230 * s, knee[1] + Math.cos(b) * 230 * s]; const p = new Path2D(); p.moveTo(...hip); p.lineTo(...knee); p.lineTo(...foot); p.lineTo(foot[0] + 50 * s, foot[1]); neon(p, c, 9 * s); for (const j of [knee, foot]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(j[0], j[1], 9 * s, 0, 7); ctx.fill(); } };
    const arm = (o, c) => { const a = -Math.sin(ph + o) * .45; const el = [sh[0] + Math.sin(a) * 170 * s, sh[1] + Math.cos(a) * 170 * s]; const hd = [el[0] + Math.sin(a + .5) * 160 * s, el[1] + Math.cos(a + .5) * 160 * s]; const p = new Path2D(); p.moveTo(...sh); p.lineTo(...el); p.lineTo(...hd); neon(p, c, 8 * s); };
    leg(Math.PI, 'rgba(120,170,255,.6)'); arm(Math.PI, 'rgba(120,170,255,.6)');
    const sp = new Path2D(); sp.moveTo(...hip); sp.bezierCurveTo(hip[0] + 20 * s, hip[1] - 120 * s, sh[0] - 25 * s, sh[1] + 140 * s, sh[0], sh[1]); neon(sp, col, 11 * s);
    for (let i = 0; i < 4; i++) { const p = new Path2D(); const y = sh[1] + 50 * s + i * 45 * s; p.ellipse(sh[0] - 5 * s, y, 70 * s, 22 * s, 0, 0, Math.PI * 2); neon(p, 'rgba(200,230,255,.55)', 3 * s); }
    const hp = new Path2D(); hp.ellipse(sh[0] + 20 * s, sh[1] - 120 * s, 75 * s, 90 * s, 0, 0, Math.PI * 2); neon(hp, col, 7 * s);
    const pv = new Path2D(); pv.ellipse(hip[0], hip[1], 70 * s, 40 * s, 0, 0, Math.PI * 2); neon(pv, col, 5 * s);
    leg(0, col); arm(0, col);
    const gr = new Path2D(); gr.moveTo(cx - 420, groundY + 6); gr.lineTo(cx + 420, groundY + 6); neon(gr, 'rgba(120,170,255,.5)', 2); }
  // reloj de pared grande
  function clockFace(x, y, r, h, m, arc = null, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,18,46,.9)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); const c = new Path2D(); c.arc(x, y, r, 0, 7); neon(c, C.line, 6);
    if (arc) { ctx.save(); ctx.strokeStyle = arc[2]; ctx.globalAlpha = a * .9; ctx.lineWidth = r * .16; ctx.shadowColor = arc[2]; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(x, y, r * .82, -Math.PI / 2 + arc[0] / 12 * Math.PI * 2, -Math.PI / 2 + arc[1] / 12 * Math.PI * 2); ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; ctx.strokeStyle = '#cfe6ff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + Math.sin(an) * r * .9, y - Math.cos(an) * r * .9); ctx.lineTo(x + Math.sin(an) * r * .78, y - Math.cos(an) * r * .78); ctx.stroke(); }
    const hand = (an, len, w, col) => { const p = new Path2D(); p.moveTo(x, y); p.lineTo(x + Math.sin(an) * len, y - Math.cos(an) * len); neon(p, col, w); };
    hand((h % 12 + m / 60) / 12 * Math.PI * 2, r * .5, 12, '#ffffff'); hand(m / 60 * Math.PI * 2, r * .72, 8, C.cyan); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill(); ctx.restore(); }
  // plato visto desde arriba con secciones (fracciones: [{f, col, label}])
  function plate(x, y, r, parts, p = 1, a = 1) { ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c9d6ea'); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    let a0 = -Math.PI / 2; parts.forEach((q, i) => { const k = ss(seg(p, i / parts.length, (i + 1) / parts.length)); if (k <= 0) { a0 += q.f * Math.PI * 2; return; } const a1 = a0 + q.f * Math.PI * 2 * k; ctx.fillStyle = q.col; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * .8, a0, a1); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip(); for (let j = 0; j < 40; j++) { const an = a0 + hash(j, i) * (a1 - a0), rr_ = r * .8 * Math.sqrt(hash(j, i + 9)); ctx.fillStyle = q.dot || 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr_, y + Math.sin(an) * rr_, r * .04, 0, 7); ctx.fill(); } ctx.restore();
      a0 += q.f * Math.PI * 2; }); ctx.restore(); }
  // corte con destello (transición entre planos): llamar al inicio de cada escena
  function flashIn(t, t0) { const d = 1 - seg(t, t0, t0 + .18); if (d > 0) { ctx.fillStyle = `rgba(180,220,255,${d * .35})`; ctx.fillRect(0, 0, W, H); } }
  // zoom suave del plano (empuje de cámara): envuelve el dibujo
  function push(u, z0 = 1, z1 = 1.08, cx = 540, cy = 1000, fn) { const z = lerp(z0, z1, ss(u)); ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
  return { C, bg, neon, glass, organ, bodyFront, skeletonFront, brain, stomachPath, pancreasPath, vessel, big, pill, ring, graph, axes, walker, clockFace, plate, flashIn, push };
}
