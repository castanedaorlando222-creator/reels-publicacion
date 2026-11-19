// KIT de rayos X (motor v2): envoltura de planos + iconos grandes reutilizables.
//   import { makeKit } from './kit.js';  const K = makeKit(L, S);  const { X, V, C, ctx, on, shake } = K;
//   K.finish(shots, tEnd, fx, extra)  → objeto para devolver desde story()
import { makeExplicador } from './explicador.js';
import { makeV2 } from './v2.js';
export function makeKit(L, S) {
  const { ctx, W, H, seg, ss, eo, back, lerp, hash, rr, clamp } = L;
  const X = makeExplicador(L), V = makeV2(L), C = X.C, TAU = Math.PI * 2, on = V.on, shake = V.shake, mixc = V.mixc;
  const P = (fn) => { const p = new Path2D(); fn(p); return p; };
  function glass(cx, cy, w, h, lv, t, col = '#4fb8ff', edge = '#d6efff') {
    const tw = w, bw = w * .72, x0 = cx - tw / 2, x1 = cx + tw / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    const out = P(p => { p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(cx + bw / 2, y1); p.lineTo(cx - bw / 2, y1); p.closePath(); });
    ctx.save(); ctx.fillStyle = 'rgba(120,180,255,.10)'; ctx.fill(out); ctx.clip(out);
    const ly = y1 - h * lv; const wv = x => ly + Math.sin(x / 40 + t * 3) * 8;
    const wp = new Path2D(); wp.moveTo(x0 - 20, y1 + 20); for (let x = x0 - 20; x <= x1 + 20; x += 12) wp.lineTo(x, wv(x)); wp.lineTo(x1 + 20, y1 + 20); wp.closePath();
    const g = ctx.createLinearGradient(0, ly, 0, y1); g.addColorStop(0, mixc(col, '#ffffff', .25, .85)); g.addColorStop(1, mixc(col, '#0a2a6a', .4, .9)); ctx.fillStyle = g; ctx.fill(wp);
    for (let i = 0; i < 14; i++) { const bx = x0 + hash(i, 1) * tw, by = y1 - ((hash(i, 2) * h + t * 90 * (.4 + hash(i, 3))) % Math.max(10, h * lv)); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(bx, by, 4 + hash(i, 4) * 7, 0, TAU); ctx.fill(); }
    ctx.restore(); V.line(out, edge, 9);
  }
  function drop(x, y, s, col = '#4fb8ff', a = 1) { const p = P(q => { q.moveTo(x, y - s); q.bezierCurveTo(x + s * .15, y - s * .5, x + s * .8, y - s * .1, x + s * .8, y + s * .35); q.bezierCurveTo(x + s * .8, y + s * .85, x - s * .8, y + s * .85, x - s * .8, y + s * .35); q.bezierCurveTo(x - s * .8, y - s * .1, x - s * .15, y - s * .5, x, y - s); });
    ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(x - s * .3, y, s * .1, x, y + s * .2, s); g.addColorStop(0, '#d9f4ff'); g.addColorStop(1, col); ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fill(p); ctx.restore(); V.line(p, '#e8f8ff', Math.max(3, s * .06), a); }
  function bell(cx, cy, s, t, ring = 0, col = C.gold) { const sw = Math.sin(t * 24) * .22 * ring; ctx.save(); ctx.translate(cx, cy - s); ctx.rotate(sw); ctx.translate(-cx, -(cy - s));
    const b = P(p => { p.moveTo(cx - s * .95, cy + s * .55); p.bezierCurveTo(cx - s * .8, cy + s * .2, cx - s * .75, cy - s * .2, cx - s * .5, cy - s * .55); p.bezierCurveTo(cx - s * .3, cy - s * .95, cx + s * .3, cy - s * .95, cx + s * .5, cy - s * .55); p.bezierCurveTo(cx + s * .75, cy - s * .2, cx + s * .8, cy + s * .2, cx + s * .95, cy + s * .55); p.closePath(); });
    const g = ctx.createLinearGradient(cx - s, 0, cx + s, 0); g.addColorStop(0, mixc(col, '#7a4a00', .5)); g.addColorStop(.4, mixc(col, '#ffffff', .3)); g.addColorStop(1, mixc(col, '#7a4a00', .6)); ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fill(b); ctx.shadowBlur = 0; V.line(b, '#fff3c4', 7);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy + s * .75, s * .18, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(cx, cy - s * 1.0, s * .13, 0, TAU); ctx.fill(); ctx.restore(); }
  function sun(cx, cy, r, t, col = '#ffb43c') { for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .4, q = new Path2D(); q.moveTo(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r * 1.25); q.lineTo(cx + Math.cos(a) * r * (1.6 + .15 * Math.sin(t * 4 + i)), cy + Math.sin(a) * r * (1.6 + .15 * Math.sin(t * 4 + i))); V.line(q, col, 12); }
    const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); g.addColorStop(0, '#fff4c2'); g.addColorStop(1, col); ctx.fillStyle = g; ctx.shadowColor = col; ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
  function donut(cx, cy, R, parts, p, w = .26) { let a0 = -Math.PI / 2; parts.forEach((q, i) => { const k = ss(seg(p, i / parts.length, (i + 1) / parts.length)), a1 = a0 + q.f * TAU * k; if (k > 0) { const pa = new Path2D(); pa.arc(cx, cy, R * (1 - w / 2), a0, a1); ctx.save(); ctx.lineCap = 'butt'; ctx.strokeStyle = q.col; ctx.shadowColor = q.col; ctx.shadowBlur = 30; ctx.lineWidth = R * w; ctx.stroke(pa); ctx.restore(); } a0 += q.f * TAU; }); }
  function check(x, y, s, p, col = C.green) { if (p <= 0) return; const q = new Path2D(); q.moveTo(x - s * .6, y); q.lineTo(lerp(x - s * .6, x - s * .15, clamp(p * 2)), lerp(y, y + s * .5, clamp(p * 2))); if (p > .5) q.lineTo(lerp(x - s * .15, x + s * .7, (p - .5) * 2), lerp(y + s * .5, y - s * .55, (p - .5) * 2)); V.line(q, col, s * .22); }
  function cross(x, y, s, p, col = C.red) { if (p <= 0) return; const a = new Path2D(); a.moveTo(x - s, y - s); a.lineTo(lerp(x - s, x + s, clamp(p * 2)), lerp(y - s, y + s, clamp(p * 2))); V.line(a, col, s * .26); if (p > .5) { const b = new Path2D(); b.moveTo(x + s, y - s); b.lineTo(lerp(x + s, x - s, (p - .5) * 2), lerp(y - s, y + s, (p - .5) * 2)); V.line(b, col, s * .26); } }
  function bottle(cx, cy, w, h, lv, t, col = '#4fb8ff') { const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, nk = w * .22;
    const o = P(p => { p.moveTo(cx - nk, y0); p.lineTo(cx + nk, y0); p.lineTo(cx + nk, y0 + h * .1); p.bezierCurveTo(cx + nk, y0 + h * .2, x1, y0 + h * .2, x1, y0 + h * .32); p.lineTo(x1, y1 - 40); p.quadraticCurveTo(x1, y1, x1 - 40, y1); p.lineTo(x0 + 40, y1); p.quadraticCurveTo(x0, y1, x0, y1 - 40); p.lineTo(x0, y0 + h * .32); p.bezierCurveTo(x0, y0 + h * .2, cx - nk, y0 + h * .2, cx - nk, y0 + h * .1); p.closePath(); });
    ctx.save(); ctx.fillStyle = 'rgba(120,180,255,.10)'; ctx.fill(o); ctx.clip(o); const ly = y1 - (h * .72) * lv; const wp = new Path2D(); wp.moveTo(x0, y1 + 10); for (let x = x0; x <= x1; x += 10) wp.lineTo(x, ly + Math.sin(x / 34 + t * 3) * 7); wp.lineTo(x1, y1 + 10); wp.closePath(); const g = ctx.createLinearGradient(0, ly, 0, y1); g.addColorStop(0, mixc(col, '#ffffff', .25, .9)); g.addColorStop(1, mixc(col, '#0a2a6a', .4, .95)); ctx.fillStyle = g; ctx.fill(wp); ctx.restore(); V.line(o, '#d6efff', 8);
    ctx.fillStyle = '#2a6fe0'; rr(cx - nk - 8, y0 - 38, nk * 2 + 16, 44, 10); ctx.fill(); }
  // Envoltura de cada plano (zoom de entrada, empuje de salida, bloom, viñeta, destello)
  function finish(shots, tEnd, fx, extra = {}) {
    shots.forEach((s, i) => s.end = i + 1 < shots.length ? shots[i + 1].at : tEnd);
    const scenes = shots.map(s => ({ at: s.at, draw: t => {
      const k = 1 - eo(seg(t, s.at, s.at + .34)), x = s.noOut ? 0 : Math.pow(seg(t, s.end - .13, s.end), 2), z = 1 + (s.zin ?? .2) * k + .14 * x;
      const tf = () => { ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000); };
      ctx.save(); tf(); s.draw(t); ctx.restore(); V.bloom(s.bloom ?? .5); V.vign();
      if (s.ui) { ctx.save(); tf(); ctx.globalAlpha = 1 - x; s.ui(t); ctx.restore(); }
      if (s.at > 0 && k > 0 && s.zin !== 0) { ctx.fillStyle = `rgba(200,225,255,${k * k * .3})`; ctx.fillRect(0, 0, W, H); } } }));
    return { scenes, tags: [], red: [], fx, cierreFrom: extra.cierreFrom || 'l9', vignette: false, captionPill: true, noFade: true, captionStyle: 'karaoke', captionY: 400, ...extra };
  }
  return { X, V, C, TAU, ctx, W, H, on, shake, mixc, P, glass, drop, bell, sun, donut, check, cross, bottle, finish };
}
