// MOTOR v2 (lo que aprendimos de la prueba con Fable): bloom/viñeta, etiquetas llenas grandes, golpes de texto, sellos,
// ondas, chispas, sacudida, gráficas con panel. Úsalo en TODOS los estilos del motor (explicador, faro, documental):
//   import { makeV2 } from './v2.js';  const V = makeV2(L);  // V.bloom(), V.tag(), V.slam(), V.stamp(), V.ringWave(), V.spark(), V.shake(), V.panel(), V.curve() …
// Ejemplo completo: ejemplos/explicador-fable/story.js
import { makeExplicador } from './explicador.js';
export function makeV2(L) {
  const { ctx, W, H, seg, ss, eo, back, lerp, hash, rr, clamp } = L;
  const C = makeExplicador(L).C;
  const TAU = Math.PI * 2;
  const on = (t, t0, d = .3) => seg(t, t0, t0 + d);
  const hex2 = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/[\d.]+/g).slice(0, 3).map(Number);
  const mixc = (a, b, k, al = 1) => { const A = hex2(a), B = hex2(b); return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(',')},${al})`; };
  const shake = (t, t0, amp = 18, d = .4) => { const k = (1 - seg(t, t0, t0 + d)) * (t >= t0 ? 1 : 0); return [Math.sin(t * 95) * amp * k, Math.cos(t * 83) * amp * k * .7]; };

  // ---------- pos-proceso: bloom + viñeta ----------
  const off = document.createElement('canvas'); off.width = 270; off.height = 480; const oc = off.getContext('2d');
  function bloom(k = .55) {
    oc.globalCompositeOperation = 'copy'; oc.filter = 'blur(6px)'; oc.drawImage(ctx.canvas, 0, 0, 270, 480);
    oc.filter = 'none'; oc.globalCompositeOperation = 'multiply'; oc.drawImage(off, 0, 0);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = k; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(off, 0, 0, W, H); ctx.restore();
  }
  function vign() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(540, 980, 520, 540, 980, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,2,10,.62)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }

  // ---------- primitivas ----------
  function line(p, col, w, a = 1) { ctx.save(); ctx.lineJoin = ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.globalAlpha = a * .25; ctx.lineWidth = w * 3; ctx.stroke(p); ctx.globalAlpha = a; ctx.lineWidth = w; ctx.stroke(p); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = Math.max(1, w * .34); ctx.stroke(p); ctx.restore(); }
  function tag(text, x, y, p, { col = C.gold, size = 54, ink = '#06102c', outline = false } = {}) {
    if (p <= 0) return; p = clamp(p); ctx.save(); const s = .6 + .4 * back(p); ctx.globalAlpha = Math.min(1, p * 3); ctx.translate(x, y); ctx.scale(s, s); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * 1.3, h = size * 1.75;
    ctx.shadowColor = col; ctx.shadowBlur = 34; ctx.fillStyle = outline ? 'rgba(4,10,30,.9)' : col; rr(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.shadowBlur = 0; if (outline) { ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke(); }
    ctx.fillStyle = outline ? col : ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * .05); ctx.restore(); }
  // texto que «cae» con golpe; parts = [[texto, color], …]
  function slam(parts, x, y, size, p, rot = 0) {
    if (p <= 0) return; p = clamp(p); if (typeof parts === 'string') parts = [[parts, '#ffffff']]; const s = 1 + 1.5 * (1 - eo(p)); ctx.save(); ctx.globalAlpha = Math.min(1, p * 2.5); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; const ws = parts.map(q => ctx.measureText(q[0]).width), tot = ws.reduce((a, b) => a + b, 0); let xx = -tot / 2;
    parts.forEach(([s_, col], i) => { ctx.lineWidth = size * .2; ctx.strokeStyle = 'rgba(3,8,26,.92)'; ctx.strokeText(s_, xx, 0); xx += ws[i]; }); xx = -tot / 2;
    parts.forEach(([s_, col], i) => { ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fillStyle = col; ctx.fillText(s_, xx, 0); xx += ws[i]; }); ctx.restore(); }
  function stamp(text, x, y, size, p, col, rot) { if (p <= 0) return; p = clamp(p); const s = 1 + 1.8 * (1 - eo(p)); ctx.save(); ctx.globalAlpha = Math.min(1, p * 2.5); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * .9, h = size * 1.55;
    ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.fillStyle = col; rr(-w / 2, -h / 2, w, h, 22); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 5; rr(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 14); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * .05); ctx.restore(); }
  function hexa(x, y, r, rot, a = 1, col = C.gold, fill = 'rgba(255,215,110,.28)') { const p = new Path2D(); for (let i = 0; i < 6; i++) { const an = rot + i / 6 * TAU; i ? p.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r) : p.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } p.closePath(); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.fill(p); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, r * .16); ctx.lineJoin = 'round'; ctx.stroke(p); ctx.restore(); }
  function ringWave(x, y, t, t0, col, r1 = 420) { const p = seg(t, t0, t0 + .55); if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalAlpha = (1 - p) * .9; ctx.strokeStyle = col; ctx.lineWidth = 14 * (1 - p) + 2; ctx.beginPath(); ctx.arc(x, y, 60 + eo(p) * r1, 0, TAU); ctx.stroke(); ctx.restore(); }
  function spark(x, y, t, t0, col, n = 16, r = 260) { const p = seg(t, t0, t0 + .6); if (p <= 0 || p >= 1) return; ctx.save(); ctx.fillStyle = col; for (let i = 0; i < n; i++) { const an = hash(i, t0) * TAU, d = eo(p) * r * (.4 + hash(i, t0 + 1) * .6); ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(x + Math.cos(an) * d, y + Math.sin(an) * d + p * p * 80, 7 * (1 - p) + 2, 0, TAU); ctx.fill(); } ctx.restore(); }

  // ---------- gráficas ----------
  function panel(x, y, w, h) { ctx.save(); ctx.fillStyle = 'rgba(4,10,32,.6)'; rr(x - 40, y - 40, w + 80, h + 80, 36); ctx.fill(); ctx.strokeStyle = 'rgba(140,190,255,.25)'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = 'rgba(140,190,255,.12)'; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x, y + h * i / 4); ctx.lineTo(x + w, y + h * i / 4); ctx.stroke(); } ctx.restore(); const a = new Path2D(); a.moveTo(x, y); a.lineTo(x, y + h); a.lineTo(x + w, y + h); line(a, '#9fc4ff', 4, .8); }
  function curve(fn, box, p, col, w, fill = null) { const [x0, y0, bw, bh] = box, n = Math.max(2, Math.round(80 * p)), pa = new Path2D(); let lx, ly; for (let i = 0; i <= n; i++) { const u = i / 80; lx = x0 + u * bw; ly = y0 + bh - fn(u) * bh; i ? pa.lineTo(lx, ly) : pa.moveTo(lx, ly); }
    if (fill) { const f = new Path2D(pa); f.lineTo(lx, y0 + bh); f.lineTo(x0, y0 + bh); f.closePath(); const g = ctx.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, fill); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fill(f); }
    line(pa, col, w); return [lx, ly]; }
  const axisText = (s, x, y, size = 40, col = 'rgba(210,228,255,.9)', al = 'center') => { ctx.save(); ctx.font = `800 ${size}px Inter`; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore(); };
  return { TAU, on, hex2, mixc, shake, bloom, vign, line, tag, slam, stamp, hexa, ringWave, spark, panel, curve, axisText, C };
}
