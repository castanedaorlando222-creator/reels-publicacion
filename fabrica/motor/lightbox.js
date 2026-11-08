// LIGHTBOX — caja de papel recortado retroiluminada (para el estilo «Lightbox»). Se usa desde story.js:
//   import { makeLightbox } from './lightbox.js';   const LB = makeLightbox(L);
// Cada hoja es una silueta plana de un color, con grano de pulpa, borde superior cálido y versión iluminada por detrás.
// Las hojas se dibujan de atrás (cielo, claro y translúcido) a delante (casi negro y opaco): esa escalera de valores ES la profundidad.
export function makeLightbox(L) {
  const { ctx, W, H, hash, seg, ss, glow } = L;
  const LW = 1300, LH = 2300, OX = (LW - W) / 2, OY = (LH - H) / 2;
  const mk = () => { const c = document.createElement('canvas'); c.width = LW; c.height = LH; return [c, c.getContext('2d')]; };
  // pulpa de papel (moteado suave + fibras), una sola vez
  const [pulp, px] = mk(); { const id = px.createImageData(LW, LH), d = id.data; for (let i = 0; i < d.length; i += 4) { const p = i / 4, x = p % LW, y = (p / LW) | 0; const v = 214 + 9 * Math.sin(x / 37 + Math.sin(y / 53)) * Math.cos(y / 41 + Math.sin(x / 61)) + (hash(x, y) - .5) * 16; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } px.putImageData(id, 0, 0);
    px.globalAlpha = .16; px.strokeStyle = '#666'; for (let i = 0; i < 2600; i++) { const x = hash(i, 1) * LW, y = hash(i, 2) * LH, a = hash(i, 3) * 6.28, l = 6 + hash(i, 4) * 20; px.beginPath(); px.moveTo(x, y); px.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); px.stroke(); } px.globalAlpha = 1; }
  /** Una hoja de papel. col = color plano; trans = cuánto pasa la luz (cielo ~.5, fondo ~.6, medio ~.4, cerca ~.15, frente ~.05);
   *  draw(c) dibuja la silueta en negro con coordenadas de pantalla (1080×1920; puede salirse un poco, la hoja es mayor);
   *  holes(c) opcional: agujeros (ventanas, luna, estrellas) que se recortan. light = [x, y] punto de luz detrás de la caja. */
  function sheet(col, trans, draw, holes = null, light = [540, 600]) {
    const [m, mx] = mk(); mx.translate(OX, OY); mx.fillStyle = '#000'; draw(mx); if (holes) { mx.globalCompositeOperation = 'destination-out'; holes(mx); }
    const [a, ax] = mk(); ax.drawImage(m, 0, 0); ax.globalCompositeOperation = 'source-in'; ax.fillStyle = col; ax.fillRect(0, 0, LW, LH);
    ax.globalCompositeOperation = 'multiply'; ax.globalAlpha = .35; ax.drawImage(pulp, 0, 0); ax.globalAlpha = 1; ax.globalCompositeOperation = 'destination-in'; ax.drawImage(m, 0, 0);
    // borde superior iluminado
    const [r, rx] = mk(); rx.drawImage(m, 0, 3); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = '#ffd9a0'; rx.fillRect(0, 0, LW, LH); rx.globalCompositeOperation = 'destination-out'; rx.drawImage(m, 0, 0);
    ax.globalCompositeOperation = 'source-atop'; ax.globalAlpha = .55; ax.drawImage(r, 0, -6); ax.globalAlpha = 1;
    const [lit, lx] = mk(); lx.drawImage(a, 0, 0); lx.globalCompositeOperation = 'lighter';
    const g = lx.createRadialGradient(light[0] + OX, light[1] + OY, 0, light[0] + OX, light[1] + OY, 1100); g.addColorStop(0, `rgba(255,190,110,${trans})`); g.addColorStop(.45, `rgba(255,160,80,${trans * .45})`); g.addColorStop(1, 'rgba(255,140,60,0)');
    lx.fillStyle = g; lx.fillRect(0, 0, LW, LH); lx.globalCompositeOperation = 'multiply'; lx.globalAlpha = .5; lx.drawImage(pulp, 0, 0); lx.globalAlpha = 1; lx.globalCompositeOperation = 'destination-in'; lx.drawImage(m, 0, 0);
    return { a, lit, m };
  }
  // ---- formas de ayuda (dibujan en el contexto c que reciben)
  const ridge = (base, amp, f, seed) => c => { c.beginPath(); c.moveTo(-OX, LH); for (let x = -OX; x <= W + OX; x += 14) c.lineTo(x, base + amp * (Math.sin(x / f + seed) * .6 + Math.sin(x / (f * .37) + seed * 2) * .3 + (hash(x, seed) - .5) * .08)); c.lineTo(W + OX, LH); c.closePath(); c.fill(); };
  const cypress = (c, x, yb, h, w = 42) => { c.beginPath(); c.moveTo(x, yb); for (let k = 0; k <= 20; k++) { const u = k / 20; c.lineTo(x - w * Math.sin(u * Math.PI) * (1 - u * .4) + (k % 2 ? 4 : -4), yb - u * h); } for (let k = 20; k >= 0; k--) { const u = k / 20; c.lineTo(x + w * Math.sin(u * Math.PI) * (1 - u * .4) + (k % 2 ? -4 : 4), yb - u * h); } c.fill(); };
  const temple = (c, x, y, w, h) => { c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x + w / 2, y - h * .38); c.lineTo(x + w + 20, y); c.closePath(); c.fill(); c.fillRect(x, y - 4, w, h); };
  const columnsHoles = (c, x, y, w, h, n = 6) => { const step = w / n; for (let i = 0; i < n; i++) c.fillRect(x + step * (i + .3), y + 30, step * .38, h - 60); };
  const archFrame = (c) => { c.fillRect(-OX, -OY, LW, LH); };
  const archHole = (c, x0 = 150, x1 = 930, top = 520, bottom = 1420) => { const cx = (x0 + x1) / 2, r = (x1 - x0) / 2; c.beginPath(); c.moveTo(x0, bottom); c.lineTo(x0, top); c.arc(cx, top, r, Math.PI, 0); c.lineTo(x1, bottom); c.closePath(); c.fill(); };
  const stars = (c, n = 40, y1 = 900, seed = 1) => { for (let i = 0; i < n; i++) { c.beginPath(); c.arc(hash(i, seed) * W, hash(i, seed + 1) * y1, 2 + hash(i, seed + 2) * 3, 0, 7); c.fill(); } };
  /** Dibuja la pila de hojas. layers = [[hoja, profundidad 1=fondo…0.55=frente, retardo de encendido]];
   *  on = instante en que se enciende la luz; focus = [x, y] hacia donde avanza la cámara; dz = 0..1 avance del dolly;
   *  extra(i) se llama tras dibujar la hoja i (para ventanas que brillan, figuras, la luna). */
  function stack(t, layers, { on = .5, focus = [540, 960], dz = 0, extra = null } = {}) {
    ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H);
    const flick = 1 + .06 * Math.sin(7.3 * t) * Math.sin(3.1 * t); const drift = [Math.sin(t * .7) * 1.2, Math.cos(t * .5) * 1.2];
    layers.forEach(([Ly, depth, delay], i) => {
      const s = 1 + dz * .16 * (1.2 - depth) + dz * .04; const lit = ss(seg(t, on + delay * .5, on + delay * .5 + .6)) * flick;
      ctx.save(); ctx.translate(focus[0] + drift[0] * (1.4 - depth), focus[1] + drift[1] * (1.4 - depth)); ctx.scale(s, s); ctx.translate(-focus[0], -focus[1]);
      if (i > 0) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 18 * (1.1 - depth); ctx.drawImage(Ly.m, -OX, -OY); ctx.restore(); }
      ctx.drawImage(Ly.a, -OX, -OY); if (lit > 0) { ctx.globalAlpha = Math.min(1, lit); ctx.drawImage(Ly.lit, -OX, -OY); ctx.globalAlpha = 1; }
      if (extra) extra(i, lit, flick);
      ctx.restore();
    });
    const v = ctx.createRadialGradient(540, 900, 500, 540, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }
  // luz que arde en un agujero (luna, ventana): llamar dentro de extra()
  const burn = (x, y, r, p, flick = 1, col = '255,200,120') => { if (p <= 0) return; ctx.globalCompositeOperation = 'lighter'; glow(x, y, r * 2.8, `rgba(${col},${.5 * p * flick})`); ctx.globalCompositeOperation = 'source-over'; };
  const windowLight = (x, y, w, h, p, flick = 1) => { if (p <= 0) return; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,184,98,${p * .9 * flick})`; ctx.fillRect(x, y, w, h); glow(x + w / 2, y + h / 2, Math.max(w, h) * .9, `rgba(255,170,80,${.35 * p})`); ctx.globalCompositeOperation = 'source-over'; };
  // cartel rojo de papel (cita, fuente, título breve) arriba
  function seal(text, p, y = 300) { if (p <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(L.eo(p), 1); ctx.font = '700 32px Cormorant'; const w = ctx.measureText(text).width + 60; ctx.fillStyle = '#8f1d1d'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.fillRect(-w / 2, -34, w, 68); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f3dfc0'; ctx.textAlign = 'center'; ctx.fillText(text, 0, 11); ctx.restore(); }
  return { sheet, stack, ridge, cypress, temple, columnsHoles, archFrame, archHole, stars, burn, windowLight, seal, OX, OY };
}
