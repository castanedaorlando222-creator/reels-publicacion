// PRUEBA «motor v2» · Nutrición · «Por qué te da sueño después de comer» (EXPLICADOR rayos X).
// Mejoras sobre el motor: bloom real (pos-proceso), cortes con zoom, planos de 1.5–3 s, etiquetas grandes llenas, alineación de palabras por DTW.
import { makeExplicador } from './explicador.js';
export default function story(L, S) {
  const { T, wt } = S;
  const { ctx, W, H, seg, ss, eo, back, lerp, hash, rr, clamp } = L;
  const X = makeExplicador(L), C = X.C;
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

  // ---------- OJO (gancho) ----------
  const bz = (a, b, c, d, s) => { const m = 1 - s; return m * m * m * a + 3 * m * m * s * b + 3 * m * s * s * c + s * s * s * d; };
  function eye(cx, cy, w, o, t) {
    const hw = w / 2, mk = k => { const up = w * .44 * k, dn = w * .3 * k, p = new Path2D(); p.moveTo(cx - hw, cy); p.bezierCurveTo(cx - hw * .45, cy - up * 1.33, cx + hw * .45, cy - up * 1.33, cx + hw, cy); p.bezierCurveTo(cx + hw * .45, cy + dn * 1.33, cx - hw * .45, cy + dn * 1.33, cx - hw, cy); return p; };
    line(mk(1), 'rgba(110,160,255,1)', 3, .35);
    const lid = mk(o); ctx.save(); ctx.clip(lid);
    const sc = ctx.createRadialGradient(cx, cy, 40, cx, cy, hw); sc.addColorStop(0, 'rgba(225,240,255,.3)'); sc.addColorStop(1, 'rgba(90,150,255,.08)'); ctx.fillStyle = sc; ctx.fillRect(cx - hw, cy - hw, w, w);
    const iy = cy + (1 - o) * 46, ir = w * .25; const ig = ctx.createRadialGradient(cx, iy, ir * .2, cx, iy, ir); ig.addColorStop(0, '#8ff5ff'); ig.addColorStop(.55, '#2f8cff'); ig.addColorStop(1, '#0b2a8a'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, iy, ir, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(210,245,255,.5)'; ctx.lineWidth = 3; for (let i = 0; i < 44; i++) { const an = i / 44 * TAU + t * .15, r0 = ir * (.46 + hash(i, 4) * .1), r1 = ir * (.8 + hash(i, 5) * .17); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, iy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an) * r1, iy + Math.sin(an) * r1); ctx.stroke(); }
    const pr = ir * (.4 + .06 * Math.sin(t * 2)); ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.arc(cx, iy, pr, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.arc(cx - ir * .3, iy - ir * .34, ir * .13, 0, TAU); ctx.fill();
    const ring = new Path2D(); ring.arc(cx, iy, ir, 0, TAU); line(ring, '#9fe8ff', 5);
    const sh = ctx.createLinearGradient(0, cy - w * .5 * o, 0, cy); sh.addColorStop(0, 'rgba(2,6,24,.75)'); sh.addColorStop(1, 'rgba(2,6,24,0)'); ctx.fillStyle = sh; ctx.fillRect(cx - hw, cy - hw, w, w);
    ctx.restore(); line(lid, C.line, 7);
    const up = w * .44 * o * 1.33; for (let i = 0; i < 11; i++) { const s = .12 + i / 10 * .76, x = bz(cx - hw, cx - hw * .45, cx + hw * .45, cx + hw, s), y = bz(cy, cy - up, cy - up, cy, s), k = (s - .5) * 1.5, len = 46 + 30 * Math.sin(s * Math.PI); const p = new Path2D(); p.moveTo(x, y); p.quadraticCurveTo(x + k * 18, y - len * (.3 + .7 * o), x + k * 52, y - len * (.2 + .8 * o) - 8 * (1 - o)); line(p, C.line, 4, .9); }
  }
  function zzz(t, x, y) { for (let i = 0; i < 3; i++) { const p = ((t * .55 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); ctx.font = `900 ${70 + p * 70}px Inter`; ctx.fillStyle = '#d9e8ff'; ctx.shadowColor = C.violet; ctx.shadowBlur = 24; ctx.fillText('Z', x + p * 150 + Math.sin(p * 6) * 14, y - p * 260); ctx.restore(); } }

  // ---------- CEREBRO ----------
  function brain(cx, cy, R, t) {
    const stem = new Path2D(); stem.moveTo(cx - R * .02, cy + R * .4); stem.bezierCurveTo(cx + R * .02, cy + R * .7, cx + R * .12, cy + R * .9, cx + R * .16, cy + R * 1.12); stem.lineTo(cx + R * .36, cy + R * 1.08); stem.bezierCurveTo(cx + R * .3, cy + R * .85, cx + R * .24, cy + R * .6, cx + R * .24, cy + R * .4); stem.closePath();
    ctx.fillStyle = '#b8559f'; ctx.fill(stem); line(stem, '#ffb7e6', 4, .8);
    const cb = new Path2D(); cb.ellipse(cx + R * .56, cy + R * .52, R * .36, R * .24, -.15, 0, TAU); const g2 = ctx.createRadialGradient(cx + R * .5, cy + R * .45, 10, cx + R * .56, cy + R * .52, R * .4); g2.addColorStop(0, '#f08fd0'); g2.addColorStop(1, '#7a2a8f'); ctx.fillStyle = g2; ctx.fill(cb);
    ctx.save(); ctx.clip(cb); ctx.strokeStyle = 'rgba(255,220,245,.55)'; ctx.lineWidth = 4; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(cx + R * .56, cy + R * .34 + k * R * .075, R * .42, R * .1, -.15, 0, Math.PI); ctx.stroke(); } ctx.restore(); line(cb, '#ffb7e6', 4, .9);
    const p = new Path2D(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, r = R * (1 + .04 * Math.sin(7 * a + .6) + .028 * Math.sin(13 * a + 1)), sy = Math.sin(a) > 0 ? .6 : .8, x = cx + Math.cos(a) * r * 1.02, y = cy + Math.sin(a) * r * sy; i ? p.lineTo(x, y) : p.moveTo(x, y); } p.closePath();
    const g = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .1, cx, cy, R * 1.15); g.addColorStop(0, '#ffb0de'); g.addColorStop(.6, '#d65fb5'); g.addColorStop(1, '#6a2390'); ctx.fillStyle = g; ctx.fill(p);
    ctx.save(); ctx.clip(p); ctx.lineCap = 'round';
    for (let k = 0; k < 9; k++) { const yy = cy - R * .72 + k * R * .16; ctx.strokeStyle = 'rgba(90,20,110,.45)'; ctx.lineWidth = R * .035; ctx.beginPath(); for (let x = -R * 1.1; x <= R * 1.1; x += R * .05) ctx.lineTo(cx + x, yy + Math.sin(x / R * 8 + k * 1.7) * R * .055 + Math.sin(x / R * 19 + k) * R * .02); ctx.stroke(); ctx.strokeStyle = 'rgba(255,225,250,.5)'; ctx.lineWidth = R * .012; ctx.stroke(); }
    ctx.strokeStyle = 'rgba(90,20,110,.6)'; ctx.lineWidth = R * .04; ctx.beginPath(); ctx.moveTo(cx - R * .1, cy - R * .8); ctx.bezierCurveTo(cx + R * .1, cy - R * .4, cx - R * .1, cy - R * .1, cx + R * .15, cy + R * .2); ctx.stroke();
    for (let i = 0; i < 22; i++) { const ph = (t * (1 + hash(i, 3)) + hash(i, 4) * 5) % 1.4, x = cx + (hash(i, 1) - .5) * R * 1.9, y = cy + (hash(i, 2) - .6) * R * 1.2; ctx.globalAlpha = Math.max(0, Math.sin(ph / 1.4 * Math.PI)) ** 3; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); }
    ctx.restore(); line(p, '#ffd3f1', 6);
  }

  // ---------- NEURONA ----------
  const NSEG = []; { let id = 0; const br = (x, y, a, len, w, d) => { const k = ++id, x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len, o = (hash(k, 3) - .5) * len * .55; NSEG.push({ x, y, mx: (x + x1) / 2 - Math.sin(a) * o, my: (y + y1) / 2 + Math.cos(a) * o, x1, y1, w, d, k }); if (d < 2) for (const sg of [-1, 1]) br(x1, y1, a + sg * (.28 + hash(k, sg + 5) * .42), len * (.6 + hash(k, sg + 8) * .14), w * .58, d + 1); };
    [-3.03, -2.5, -1.95, -1.4, -.85, -.3, .42, 2.72].forEach((a, i) => br(Math.cos(a) * 90, Math.sin(a) * 90, a, 190 + hash(i, 12) * 40, 20, 0)); }
  function neuron(cx, cy, s, t, e) {
    const col = mixc('#56689a', '#ffd34f', e), colD = mixc('#1c2748', '#b0661a', e);
    L.glow(cx, cy, 520 * s, `rgba(255,190,70,${.34 * e})`);
    // axón con vainas de mielina
    const A = [[cx, cy + 80 * s], [cx - 70 * s, cy + 260 * s], [cx + 90 * s, cy + 400 * s], [cx + 20 * s, cy + 600 * s]], ap = new Path2D(); ap.moveTo(...A[0]); ap.bezierCurveTo(...A[1], ...A[2], ...A[3]); line(ap, col, 12 * s, .55 + .45 * e);
    const apt = q => [bz(A[0][0], A[1][0], A[2][0], A[3][0], q), bz(A[0][1], A[1][1], A[2][1], A[3][1], q)];
    ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const a = apt(.2 + i * .2), b = apt(.2 + i * .2 + .13); ctx.strokeStyle = mixc('#2b3a66', '#ffe9a8', e, .95); ctx.lineWidth = 40 * s; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.strokeStyle = mixc('#3d4e80', '#fff7dc', e, .9); ctx.lineWidth = 14 * s; ctx.beginPath(); ctx.moveTo(a[0] - 8 * s, a[1]); ctx.lineTo(b[0] - 8 * s, b[1]); ctx.stroke(); } ctx.restore();
    if (e > .15) for (let i = 0; i < 2; i++) { const q = (t * .9 + i * .5) % 1, [x, y] = apt(q); L.glow(x, y, 70 * s, `rgba(255,255,255,${.85 * e})`); }
    for (const g of NSEG) { const p = new Path2D(); p.moveTo(cx + g.x * s, cy + g.y * s); p.quadraticCurveTo(cx + g.mx * s, cy + g.my * s, cx + g.x1 * s, cy + g.y1 * s); line(p, col, Math.max(2.5, g.w * s), .5 + .5 * e);
      if (g.d === 2) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + g.x1 * s, cy + g.y1 * s, 9 * s, 0, TAU); ctx.fill(); } }
    if (e > .15) for (const g of NSEG) { const q = (t * 1.25 + hash(g.k, 9) - g.d * .0) % 1, m = 1 - q, x = cx + (m * m * g.x + 2 * m * q * g.mx + q * q * g.x1) * s, y = cy + (m * m * g.y + 2 * m * q * g.my + q * q * g.y1) * s; ctx.globalAlpha = e * Math.sin(q * Math.PI); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, (5 + g.w * .32) * s, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    const so = new Path2D(); for (let i = 0; i <= 60; i++) { const a = i / 60 * TAU, r = (104 + 9 * Math.sin(a * 8 + 1) + 4 * Math.sin(t * 3 + a * 3) * e) * s; i ? so.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : so.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } so.closePath();
    const sg = ctx.createRadialGradient(cx - 30 * s, cy - 34 * s, 6, cx, cy, 118 * s); sg.addColorStop(0, mixc('#8fa0c8', '#ffffff', e)); sg.addColorStop(.45, col); sg.addColorStop(1, colD); ctx.fillStyle = sg; ctx.fill(so); line(so, col, 5 * s);
    ctx.fillStyle = mixc('#0e1630', '#7a3a08', e, .55); ctx.beginPath(); ctx.arc(cx + 8 * s, cy + 10 * s, 40 * s, 0, TAU); ctx.fill();
  }
  function switchRow(y, p, k) { if (p <= 0) return; p = clamp(p); const col = mixc('#ff4d6a', '#ffd34f', k), s = .7 + .3 * back(p); ctx.save(); ctx.globalAlpha = Math.min(1, p * 3); ctx.translate(540, y); ctx.scale(s, s);
    ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(4,10,30,.93)'; rr(-410, -84, 820, 168, 84); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = col; ctx.font = '900 84px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('OREXINA', -360, 5);
    ctx.fillStyle = mixc('#7a1830', '#1f9a56', k); rr(130, -54, 232, 108, 54); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillText(k > .5 ? 'ON' : 'OFF', k > .5 ? 196 : 300, 3);
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(lerp(186, 306, ss(k)), 0, 44, 0, TAU); ctx.fill(); ctx.restore(); }

  // ---------- PLATO ----------
  const PASTA = Array.from({ length: 95 }, (_, i) => ({ a: hash(i, 21) * TAU, r: Math.sqrt(hash(i, 22)) * .86, rot: hash(i, 23) * TAU, len: .9 + hash(i, 24) * 1.6, rad: .12 + hash(i, 25) * .12, c: i % 3 }));
  function plate(cx, cy, R, t, kp, kv, kdiv) {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20; const g = ctx.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b9c9e6'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#e9eff9'; ctx.beginPath(); ctx.arc(cx, cy, R * .84, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(120,150,200,.5)'; ctx.lineWidth = 3; ctx.stroke();
    const rf = R * .78; ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, rf, 0, TAU); ctx.clip();
    ctx.fillStyle = '#e9c877'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.lineCap = 'round';
    for (const q of PASTA) { const x = cx + Math.cos(q.a) * q.r * rf, y = cy + Math.sin(q.a) * q.r * rf; ctx.strokeStyle = 'rgba(150,100,20,.45)'; ctx.lineWidth = 21; ctx.beginPath(); ctx.arc(x, y, q.rad * rf, q.rot, q.rot + q.len); ctx.stroke(); ctx.strokeStyle = ['#ffe9ac', '#f6d27e', '#fff3c9'][q.c]; ctx.lineWidth = 15; ctx.stroke(); }
    const wedge = (a0, a1, c1, c2, kind) => { if (a1 - a0 < .01) return; ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, rf + 4, a0, a1); ctx.closePath(); ctx.clip(); const wg = ctx.createRadialGradient(cx, cy, 20, cx, cy, rf); wg.addColorStop(0, c1); wg.addColorStop(1, c2); ctx.fillStyle = wg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      for (let j = 0; j < 46; j++) { const an = Math.PI / 2 + hash(j, kind) * Math.PI, r_ = rf * Math.sqrt(hash(j, kind + 3)), x = cx + Math.cos(an) * r_, y = cy + Math.sin(an) * r_; if (kind === 40) { ctx.fillStyle = j % 3 ? '#7be08e' : '#1c7a3c'; ctx.beginPath(); ctx.ellipse(x, y, 30, 15, hash(j, 44) * 3, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(10,70,30,.6)'; ctx.lineWidth = 3; ctx.stroke(); } else { ctx.strokeStyle = 'rgba(255,225,200,.6)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx - rf * .2, cy + rf * 1.2, rf * (.5 + j * .035), -2.2, -1.2); ctx.stroke(); } }
      ctx.restore(); const e = new Path2D(); e.moveTo(cx, cy); e.arc(cx, cy, rf, a0, a1); e.closePath(); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.stroke(e); };
    wedge(Math.PI / 2, Math.PI / 2 + Math.PI / 2 * kp, '#ffab82', '#d9562f', 50);
    wedge(Math.PI, Math.PI + Math.PI / 2 * kv, '#49d27a', '#178a43', 40);
    ctx.restore();
    if (kdiv > 0) { ctx.save(); ctx.globalAlpha = kdiv; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = '#06102c'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(cx, cy - rf * kdiv); ctx.lineTo(cx, cy + rf * kdiv); ctx.stroke(); ctx.restore(); }
    const rim = new Path2D(); rim.arc(cx, cy, R, 0, TAU); line(rim, '#cfe2ff', 5, .9);
  }
  function chip(x, y, r, col, kind, t, label) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.fillStyle = 'rgba(5,10,30,.95)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
    if (kind === 'hex') hexa(x, y - 8, r * .5, t, 1, col, 'rgba(255,211,79,.35)'); else { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 8, r * .48, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y - 8 - r * .32); ctx.moveTo(x, y - 8); ctx.lineTo(x + r * .24, y + r * .06); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = col; ctx.fillText(label, x, y + r * .78); ctx.restore(); }

  // ---------- CAMINANTE (grueso, con estela) ----------
  function walker2(cx, gy, s, tt, a) { const ph = tt * TAU, col = C.green, bob = Math.abs(Math.sin(ph)) * 16 * s, hip = [cx, gy - 470 * s - bob], sh = [cx + 26 * s, gy - 800 * s - bob]; ctx.save(); ctx.globalAlpha = a;
    const leg = (o, c, w) => { const an = Math.sin(ph + o) * .55, knee = [hip[0] + Math.sin(an) * 235 * s, hip[1] + Math.cos(an) * 235 * s], b = an - Math.max(0, Math.sin(ph + o + 1.2)) * .95, foot = [knee[0] + Math.sin(b) * 235 * s, Math.min(gy, knee[1] + Math.cos(b) * 235 * s)], p = new Path2D(); p.moveTo(...hip); p.lineTo(...knee); p.lineTo(...foot); p.lineTo(foot[0] + 70 * s, foot[1]); line(p, c, w * s); };
    const arm = (o, c, w) => { const an = -Math.sin(ph + o) * .6, el = [sh[0] + Math.sin(an) * 175 * s, sh[1] + Math.cos(an) * 175 * s], hd = [el[0] + Math.sin(an + .7) * 165 * s, el[1] + Math.cos(an + .7) * 165 * s], p = new Path2D(); p.moveTo(...sh); p.lineTo(...el); p.lineTo(...hd); line(p, c, w * s); };
    leg(Math.PI, '#2f9a78', 24); arm(Math.PI, '#2f9a78', 20);
    const tr = new Path2D(); tr.moveTo(hip[0] - 62 * s, hip[1]); tr.bezierCurveTo(hip[0] - 70 * s, hip[1] - 150 * s, sh[0] - 100 * s, sh[1] + 120 * s, sh[0] - 78 * s, sh[1] - 10 * s); tr.lineTo(sh[0] + 70 * s, sh[1] - 10 * s); tr.bezierCurveTo(sh[0] + 86 * s, sh[1] + 120 * s, hip[0] + 76 * s, hip[1] - 150 * s, hip[0] + 62 * s, hip[1]); tr.closePath(); ctx.fillStyle = 'rgba(60,220,150,.2)'; ctx.fill(tr); line(tr, col, 9 * s);
    ctx.save(); ctx.clip(tr); for (let i = 0; i < 5; i++) { const r = new Path2D(); r.ellipse(sh[0] - 6 * s, sh[1] + 60 * s + i * 44 * s, 78 * s, 20 * s, 0, 0, TAU); line(r, '#d8fff0', 4 * s, .6); } ctx.restore();
    const hx = sh[0] + 22 * s, hy = sh[1] - 128 * s, hg = ctx.createRadialGradient(hx - 20 * s, hy - 24 * s, 6, hx, hy, 96 * s); hg.addColorStop(0, 'rgba(190,255,225,.75)'); hg.addColorStop(1, 'rgba(40,180,120,.25)'); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, 88 * s, 0, TAU); ctx.fill(); const hp = new Path2D(); hp.arc(hx, hy, 88 * s, 0, TAU); line(hp, col, 10 * s);
    leg(0, col, 26); arm(0, col, 22); ctx.restore(); }
  // ---------- gráficas ----------
  function panel(x, y, w, h) { ctx.save(); ctx.fillStyle = 'rgba(4,10,32,.6)'; rr(x - 40, y - 40, w + 80, h + 80, 36); ctx.fill(); ctx.strokeStyle = 'rgba(140,190,255,.25)'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = 'rgba(140,190,255,.12)'; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x, y + h * i / 4); ctx.lineTo(x + w, y + h * i / 4); ctx.stroke(); } ctx.restore(); const a = new Path2D(); a.moveTo(x, y); a.lineTo(x, y + h); a.lineTo(x + w, y + h); line(a, '#9fc4ff', 4, .8); }
  function curve(fn, box, p, col, w, fill = null) { const [x0, y0, bw, bh] = box, n = Math.max(2, Math.round(80 * p)), pa = new Path2D(); let lx, ly; for (let i = 0; i <= n; i++) { const u = i / 80; lx = x0 + u * bw; ly = y0 + bh - fn(u) * bh; i ? pa.lineTo(lx, ly) : pa.moveTo(lx, ly); }
    if (fill) { const f = new Path2D(pa); f.lineTo(lx, y0 + bh); f.lineTo(x0, y0 + bh); f.closePath(); const g = ctx.createLinearGradient(0, y0, 0, y0 + bh); g.addColorStop(0, fill); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fill(f); }
    line(pa, col, w); return [lx, ly]; }
  const axisText = (s, x, y, size = 40, col = 'rgba(210,228,255,.9)', al = 'center') => { ctx.save(); ctx.font = `800 ${size}px Inter`; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore(); };

  // ================= PLANOS =================
  const shots = [];
  const tNo = wt('l1', 'No'), tFlo = wt('l1', 'flojera.');
  // 1 · GANCHO: ojo enorme al que se le cae el párpado
  shots.push({ at: 0, zin: .07, draw(t) {
    const o = 1 - .68 * ss(seg(t, .5, 1.0)) + .46 * ss(seg(t, 1.05, 1.28)) - .68 * ss(seg(t, 1.4, 2.0)) + .012 * Math.sin(t * 30) * seg(t, 1.3, 1.5);
    X.bg(t); ctx.fillStyle = `rgba(1,3,14,${(1 - o) * .45})`; ctx.fillRect(-200, -200, W + 400, H + 400);
    const [sx, sy] = shake(t, tFlo, 16); ctx.save(); ctx.translate(sx, sy); const z = lerp(1, 1.1, ss(seg(t, 0, 2.6))); ctx.translate(540, 940); ctx.scale(z, z); ctx.translate(-540, -940);
    eye(540, 940, 860, Math.max(.06, o), t); if (t > .9) zzz(t, 700, 720); ctx.restore(); },
    ui(t) { const out = 1 - on(t, tNo - .12, .14);
      if (out > 0) { ctx.save(); ctx.globalAlpha = out; const k = 1 + .05 * Math.sin(seg(t, 0, .5) * Math.PI); ctx.translate(540, 1480); ctx.scale(k, k); ctx.translate(-540, -1480); slam([['¿SUEÑO', C.gold]], 540, 1405, 176, 1); slam('DESPUÉS DE COMER?', 540, 1560, 74, 1); ctx.restore(); }
      stamp('NO ES FLOJERA', 540, 1490, 96, on(t, tFlo - .05, .22), '#e8324f', -.06); } });
  // 2a · CEREBRO → zoom al hipotálamo
  const tBr = T.l2 - .1, tZoom = wt('l2', 'unas') - .05, tNe = wt('l2', 'te') + .05, HP = [520, 1085];
  shots.push({ at: tBr, zin: .25, noOut: true, draw(t) { X.bg(t, { tint: '#2a1a6e' }); const q = Math.pow(seg(t, tZoom, tNe), 3), z = 1 + 11 * q + .06 * seg(t, tBr, tZoom); ctx.save(); ctx.translate(HP[0], HP[1]); ctx.scale(z, z); ctx.translate(-HP[0], -HP[1]);
      brain(540, 980, 350, t); const pu = (t * 1.6) % 1; L.glow(HP[0], HP[1], 120, 'rgba(255,211,79,.9)'); ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(HP[0], HP[1], 20, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.gold; ctx.globalAlpha = 1 - pu; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(HP[0], HP[1], 24 + pu * 90, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; ctx.setLineDash([16, 12]); ctx.lineDashOffset = t * 40; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(HP[0], HP[1], 76, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore(); ctx.fillStyle = `rgba(255,225,140,${Math.pow(seg(t, tZoom, tNe), 5) * .9})`; ctx.fillRect(-200, -200, W + 400, H + 400); },
    ui(t) { const a = 1 - on(t, tZoom, .2); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const p = on(t, tBr + .25, .25); if (p > 0) { const lp = new Path2D(); lp.moveTo(HP[0], HP[1] + 80); lp.lineTo(HP[0], lerp(HP[1] + 80, 1440, eo(p))); line(lp, C.gold, 4); } tag('TU CEREBRO', 540, 1500, on(t, tBr + .3, .3), { size: 70 }); ctx.restore(); } });
  // 2b · NEURONA de orexina encendida
  const tOre = wt('l2', 'orexina.');
  shots.push({ at: tNe, zin: -.55, draw(t) { X.bg(t, { top: '#3a2a12', bot: '#070a1c', cx: 540, cy: 900 }); const z = lerp(1, 1.07, seg(t, tNe, T.l3)); ctx.save(); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980); neuron(540, 985, 1.08, t, 1); ctx.restore(); ctx.fillStyle = `rgba(255,225,140,${(1 - on(t, tNe, .3)) * .8})`; ctx.fillRect(-300, -300, W + 600, H + 600); },
    ui(t) { switchRow(1575, on(t, tOre - .1, .3), 1); } });
  // 3 · La glucosa sube y la neurona se apaga
  const t3 = T.l3 - .1, tGlu = wt('l3', 'glucosa'), tSube = wt('l3', 'sube,'), tOff = wt('l3', 'se') - .05;
  shots.push({ at: t3, zin: .16, draw(t) {
      const dead = seg(t, tOff, tOff + .55), e = dead <= 0 ? 1 : dead < 1 ? (hash(Math.floor(t * 24), 7) > .45 ? .85 * (1 - dead) + .1 : .12) : .05;
      X.bg(t, { top: mixc('#3a2a12', '#3a0f2a', dead), bot: '#06081a', cx: 540, cy: 860 });
      const lvK = eo(seg(t, tGlu - .35, tSube + .45)), lv = lerp(1990, 1215, lvK);
      const [sx, sy] = shake(t, tOff + .25, 14); ctx.save(); ctx.translate(sx, sy);
      neuron(540, 880, .78, t, e);
      for (let i = 0; i < 14; i++) { const p = eo(seg(t, tSube - .25 + i * .05, tSube + .45 + i * .05)); if (p <= 0) continue; const an = i / 14 * TAU, x0 = 80 + hash(i, 31) * 920, tx = 540 + Math.cos(an) * 128, ty = 880 + Math.sin(an) * 128; hexa(lerp(x0, tx, p), lerp(lv, ty, p) - Math.sin(p * Math.PI) * 120, 26, t * 2 + i, 1, C.gold, 'rgba(255,211,79,.55)'); }
      ctx.restore();
      const wv = x => lv + Math.sin(x / 90 + t * 2.2) * 14 + Math.sin(x / 37 - t * 3) * 6; const lq = new Path2D(), top = new Path2D(); lq.moveTo(-200, H + 300); for (let x = -200; x <= W + 200; x += 20) { lq.lineTo(x, wv(x)); x === -200 ? top.moveTo(x, wv(x)) : top.lineTo(x, wv(x)); } lq.lineTo(W + 200, H + 300); lq.closePath();
      const g = ctx.createLinearGradient(0, lv, 0, H); g.addColorStop(0, 'rgba(255,205,70,.5)'); g.addColorStop(1, 'rgba(255,140,30,.72)'); ctx.fillStyle = g; ctx.fill(lq);
      ctx.save(); ctx.clip(lq); for (let i = 0; i < 54; i++) { const sp = H - lv + 100, y = lv + 30 + ((hash(i, 2) * 900 - t * 50 * (.4 + hash(i, 3))) % sp + sp) % sp, x = hash(i, 1) * W + Math.sin(t + i) * 24; hexa(x, y, 16 + hash(i, 4) * 20, t * (.5 + hash(i, 5)) + i, .85, '#fff1b8', 'rgba(255,240,180,.22)'); } ctx.restore(); line(top, '#ffe08a', 6); },
    ui(t) { tag('EN LABORATORIO · NEURON, 2006', 540, 565, on(t, t3 + .15, .3), { size: 34, outline: true, col: '#bcd6ff' });
      tag('GLUCOSA ↑', 540, 1370, on(t, tGlu - .05, .3), { size: 76 }); const k = 1 - ss(seg(t, tOff + .12, tOff + .3)); const [sx, sy] = shake(t, tOff + .25, 12); switchRow(1575 + sy, 1, k); } });
  // 4a · Reloj: de las 12 a las 2 PM
  const t4 = T.l4 - .1, t4b = wt('l4', 'tu') - .12;
  shots.push({ at: t4, zin: .2, draw(t) { X.bg(t, { tint: '#2b1f7a' }); const p = eo(seg(t, t4 + .1, t4b - .15)), cx = 540, cy = 980, R = 380;
      ctx.fillStyle = 'rgba(5,10,36,.92)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      const a0 = -Math.PI / 2 + TAU / 12, a1 = a0 + TAU / 12 * 2 * p; ctx.save(); ctx.fillStyle = 'rgba(155,123,255,.5)'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * .9, a0, a1); ctx.closePath(); ctx.fill(); ctx.restore(); if (p > 0.02) { const ar = new Path2D(); ar.arc(cx, cy, R * .9, a0, a1); line(ar, C.violet, 16); }
      for (let i = 0; i < 60; i++) { const an = i / 60 * TAU, big = i % 5 === 0; ctx.strokeStyle = big ? '#e6f1ff' : 'rgba(200,220,255,.4)'; ctx.lineWidth = big ? 9 : 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + Math.sin(an) * R * .93, cy - Math.cos(an) * R * .93); ctx.lineTo(cx + Math.sin(an) * R * (big ? .82 : .88), cy - Math.cos(an) * R * (big ? .82 : .88)); ctx.stroke(); }
      [[12, 0], [3, 3], [6, 6], [9, 9]].forEach(([n, h]) => { const an = h / 12 * TAU; axisText(String(n), cx + Math.sin(an) * R * .68, cy - Math.cos(an) * R * .68, 70, '#e6f1ff'); });
      const ring = new Path2D(); ring.arc(cx, cy, R, 0, TAU); line(ring, C.line, 9);
      const hand = (an, len, w, col) => { const h = new Path2D(); h.moveTo(cx - Math.sin(an) * 30, cy + Math.cos(an) * 30); h.lineTo(cx + Math.sin(an) * len, cy - Math.cos(an) * len); line(h, col, w); };
      hand(p * 2 / 12 * TAU, R * .5, 18, '#ffffff'); hand(p * 2 * TAU, R * .76, 10, C.cyan); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, TAU); ctx.fill(); },
    ui(t) { const p = eo(seg(t, t4 + .1, t4b - .15)), m = Math.round(120 * p / 5) * 5, h = m < 60 ? 12 : m < 120 ? 1 : 2; slam([[`${h}:${String(m % 60).padStart(2, '0')}`, '#ffffff'], [' PM', C.violet]], 540, 1545, 150, on(t, t4 + .05, .25)); } });
  // 4b · Curva de alerta del día con el bajón de las 2 PM
  const t5 = T.l5 - .1, tBaja = wt('l4', 'baja'), tAle = wt('l4', 'alerta.');
  const alert = u => .74 + .09 * Math.sin(u * 7 + .4) - .5 * Math.exp(-((u - .5) ** 2) / .011) - .22 * seg(u, .82, 1) ** 2;
  shots.push({ at: t4b, zin: .2, draw(t) { X.bg(t, { tint: '#1d2a7a' }); const box = [130, 700, 820, 600]; panel(...box);
      const dz = on(t, tBaja - .1, .4); ctx.save(); ctx.globalAlpha = dz; const g = ctx.createLinearGradient(0, 700, 0, 1300); g.addColorStop(0, 'rgba(155,123,255,.05)'); g.addColorStop(1, 'rgba(155,123,255,.5)'); ctx.fillStyle = g; ctx.fillRect(130 + .37 * 820, 700, .26 * 820, 600); ctx.restore();
      const p = eo(seg(t, t4b + .05, tBaja + .25)) * .62 + .38 * eo(seg(t, tBaja + .25, tAle + .3)); const [x, y] = curve(alert, box, p, C.cyan, 10, 'rgba(79,240,255,.22)'); L.glow(x, y, 90, 'rgba(255,255,255,.9)'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.fill(); },
    ui(t) { axisText('ALERTA', 130, 615, 54, '#ffffff', 'left'); axisText('8 AM', 150, 1385, 40); axisText('2 PM', 540, 1385, 48, C.violet); axisText('8 PM', 930, 1385, 40);
      tag('BAJÓN NATURAL', 540, 1500, on(t, tBaja - .05, .3), { col: C.violet, size: 68, ink: '#fff' }); tag('AUNQUE NO ALMUERCES', 540, 1630, on(t, tAle, .3), { col: '#d9ccff', size: 40, outline: true }); } });
  // 5 + 6 · Plato de harinas: doble golpe → se transforma (mitad por proteína y verduras)
  const t6 = T.l6 - .1, tH1 = wt('l5', 'doble'), tH2 = wt('l5', 'golpe.'), tHar = wt('l5', 'harinas:'), tMit = wt('l6', 'mitad'), tPro = wt('l6', 'proteína'), tVer = wt('l6', 'verduras.'), t7 = T.l7 - .1;
  const plateShot = (t) => { const m = ss(seg(t, t6, t6 + .5)), hit = Math.max(on(t, tH1, .01) * (1 - seg(t, tH1, tH1 + .5)), on(t, tH2, .01) * (1 - seg(t, tH2, tH2 + .5)));
      X.bg(t, { top: mixc(mixc('#2a2f7a', '#5a1030', seg(t, tH1, tH2 + .2)), '#0e4a3a', m), bot: mixc('#070a1c', '#03140f', m), cx: 540, cy: 1000 });
      const [a, b] = shake(t, tH1, 26), [c, d] = shake(t, tH2, 34); ctx.save(); ctx.translate(a + c, b + d); const sp = (1 - eo(seg(t, t6, t6 + .6))) * -TAU * (t >= t6 ? 1 : 0), z = 1 + .05 * Math.sin(seg(t, t6, t6 + .6) * Math.PI) + .08 * hit;
      ctx.translate(540, 1010); ctx.rotate(sp); ctx.scale(z, z); ctx.translate(-540, -1010);
      plate(540, 1010, 385, t, eo(seg(t, tPro - .12, tPro + .4)), eo(seg(t, tVer - .12, tVer + .4)), ss(seg(t, tMit - .1, tMit + .3)) * (1 - seg(t, tVer + .5, tVer + .8)));
      ctx.restore(); ringWave(250, 730, t, tH1, C.gold); ringWave(830, 730, t, tH2, C.violet); spark(250, 730, t, tH1, C.gold); spark(830, 730, t, tH2, C.violet); spark(330, 1230, t, tPro + .1, '#ffd0b0', 14, 220); spark(330, 800, t, tVer + .1, '#b9ffca', 14, 220);
      if (t >= tH1 && t < t6 + .01) { ctx.fillStyle = `rgba(255,40,80,${.1 + .25 * hit})`; ctx.fillRect(-200, -200, W + 400, H + 400); } };
  const chips = t => { const out = 1 - eo(seg(t, t6, t6 + .3)); if (out <= 0) return; ctx.save(); ctx.globalAlpha = out; const k1 = Math.pow(seg(t, tH1 - .22, tH1), 2), k2 = Math.pow(seg(t, tH2 - .22, tH2), 2);
      if (k1 > 0) chip(lerp(-160, 205, k1), lerp(420, 700, k1) - out * 0 + (1 - out) * -200, 112, C.gold, 'hex', t, 'GLUCOSA'); if (k2 > 0) chip(lerp(1240, 875, k2), lerp(420, 700, k2) + (1 - out) * -200, 112, C.violet, 'clock', t, 'RELOJ'); ctx.restore(); };
  shots.push({ at: t5, zin: .2, noOut: true, bloom: .16, draw: plateShot, ui(t) { chips(t); tag('HARINAS', 540, 1480, on(t, tHar - .1, .3) * (1 - on(t, tH1 - .1, .15)), { size: 72 }); slam([['DOBLE ', '#ffffff'], ['GOLPE', '#ff4d6a']], 540, 1560, 132, on(t, tH2 - .02, .22)); } });
  shots.push({ at: t6, zin: 0, bloom: .16, draw: plateShot, ui(t) { chips(t); const o = 1 - on(t, t6, .2); if (o > 0) { ctx.save(); ctx.globalAlpha = o; slam([['DOBLE ', '#ffffff'], ['GOLPE', '#ff4d6a']], 540, 1560, 132, 1); ctx.restore(); }
      tag('½', 540, 1010, on(t, tMit - .05, .25) * (1 - on(t, tPro + .5, .2)), { size: 110, col: '#ffffff' });
      tag('VERDURAS', 300, 600, on(t, tVer - .05, .3), { col: C.green, size: 66 }); tag('PROTEÍNA', 300, 1440, on(t, tPro - .05, .3), { col: '#ff9a5c', size: 66 }); tag('½ HARINAS', 800, 1560, on(t, tVer + .35, .3), { col: '#ffe9ac', size: 44, outline: true }); } });
  // 7a · Caminar unos minutos
  const tCam = wt('l7', 'camina'), tMin = wt('l7', 'minutos'), t7b = wt('l7', 'baja') - .15;
  shots.push({ at: t7, zin: .2, draw(t) { X.bg(t, { top: '#0e3f55', bot: '#03101c' }); const gy = 1540; ctx.save(); ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const x = ((hash(i, 61) * 1400 - t * 520) % 1400 + 1400) % 1400 - 160, y = 640 + hash(i, 62) * 760; ctx.strokeStyle = `rgba(120,230,255,${.18 + hash(i, 63) * .25})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 120 + hash(i, 64) * 160, y); ctx.stroke(); }
      for (let i = 0; i < 10; i++) { const x = ((i * 150 - t * 420) % 1500 + 1500) % 1500 - 200; ctx.strokeStyle = 'rgba(94,240,160,.75)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, gy + 22); ctx.lineTo(x + 70, gy + 22); ctx.stroke(); } ctx.restore();
      walker2(430, gy, .97, t * 1.7, 1); },
    ui(t) { const p = ss(seg(t, tCam, t7b)); X.ring(860, 760, 165, p, '2–5', 'MINUTOS', C.green, on(t, tCam - .1, .2)); tag('DESPUÉS DE COMER', 540, 1665, on(t, tMin, .3), { col: C.green, size: 44, outline: true }); } });
  // 7b · El pico de glucosa baja
  const t8 = T.l8 - .1, tBj = wt('l7', 'baja'), tPi = wt('l7', 'pico');
  shots.push({ at: t7b, zin: .2, draw(t) { X.bg(t, { top: '#0f3b4a', bot: '#03101c' }); const box = [130, 680, 820, 620]; panel(...box);
      const k = ss(seg(t, tBj + .1, tPi + .35)), f = amp => u => .14 + amp * Math.exp(-((u - .42) ** 2) / .02) + .05 * Math.exp(-((u - .8) ** 2) / .03);
      ctx.save(); ctx.globalAlpha = .55; ctx.setLineDash([18, 14]); const [, ] = curve(f(.74), box, eo(seg(t, t7b, t7b + .4)), '#ff5f7a', 6, 'rgba(255,59,85,.18)'); ctx.restore();
      if (t > t7b + .3) { const col = mixc('#ff3b55', '#5ef0a0', k); curve(f(lerp(.74, .4, k)), box, 1, col, 11, mixc('#ff3b55', '#5ef0a0', k, .3)); const px = 130 + .42 * 820, py0 = 680 + 620 * (1 - .88), py1 = 680 + 620 * (1 - (.14 + lerp(.74, .4, k))); if (k > .05) { const ar = new Path2D(); ar.moveTo(px, py0 + 14); ar.lineTo(px, py1 - 40); ar.moveTo(px - 26, py1 - 70); ar.lineTo(px, py1 - 40); ar.lineTo(px + 26, py1 - 70); line(ar, '#ffffff', 7, k); } } },
    ui(t) { axisText('GLUCOSA', 130, 600, 54, '#ffffff', 'left'); axisText('SENTADO', 760, 760, 40, '#ff8fa0'); axisText('después de comer →', 540, 1385, 36);
      tag('PICO MÁS BAJO', 540, 1500, on(t, tPi - .1, .3), { col: C.green, size: 68 }); tag('METAANÁLISIS · 7 ESTUDIOS · 2022', 540, 1630, on(t, t7b + .3, .3), { col: '#bcd6ff', size: 32, outline: true }); } });
  // 8a · «No te falta café»
  const tFal = wt('l8', 'falta'), tCaf = wt('l8', 'café.'), tSob = wt('l8', 'sobra'), t8b = tSob - .22, tPico = wt('l8', 'pico.'), tEnd = T.l9 - .15;
  shots.push({ at: t8, zin: .22, draw(t) { X.bg(t, { top: '#4a2a12', bot: '#0a0608' }); const [sx, sy] = shake(t, tCaf, 20); ctx.save(); ctx.translate(sx, sy);
      const cup = new Path2D(); cup.moveTo(250, 760); cup.lineTo(770, 760); cup.bezierCurveTo(770, 1080, 700, 1290, 600, 1310); cup.lineTo(420, 1310); cup.bezierCurveTo(320, 1290, 250, 1080, 250, 760); cup.closePath();
      const hd = new Path2D(); hd.moveTo(762, 850); hd.bezierCurveTo(940, 820, 950, 1120, 706, 1150); line(hd, '#ffe2bd', 26, .9);
      const cg = ctx.createLinearGradient(250, 0, 770, 0); cg.addColorStop(0, 'rgba(255,190,120,.42)'); cg.addColorStop(.5, 'rgba(255,225,190,.22)'); cg.addColorStop(1, 'rgba(255,170,90,.42)'); ctx.fillStyle = cg; ctx.fill(cup); line(cup, '#ffe2bd', 8);
      ctx.fillStyle = '#5a2c10'; ctx.beginPath(); ctx.ellipse(510, 762, 258, 46, 0, 0, TAU); ctx.fill(); const top = new Path2D(); top.ellipse(510, 762, 258, 46, 0, 0, TAU); line(top, '#ffe2bd', 6);
      const sa = new Path2D(); sa.ellipse(510, 1335, 360, 46, 0, 0, Math.PI); line(sa, '#ffe2bd', 8);
      for (let i = 0; i < 3; i++) { const st = new Path2D(); const x0 = 400 + i * 110; st.moveTo(x0, 700); for (let y = 700; y >= 540; y -= 10) st.lineTo(x0 + Math.sin(y / 34 + t * 4 + i * 2) * 22 * (1 - (y - 540) / 240), y); line(st, '#fff0dc', 7, .55); }
      ctx.restore(); const xp = (a, b, c, d, p) => { if (p <= 0) return; const q = new Path2D(); q.moveTo(a, b); q.lineTo(lerp(a, c, p), lerp(b, d, p)); line(q, '#ff3b55', 30); }; xp(230, 620, 850, 1400, eo(seg(t, tCaf - .12, tCaf + .05))); xp(850, 620, 230, 1400, eo(seg(t, tCaf, tCaf + .15))); },
    ui(t) { slam([['NO ', '#ff4d6a'], ['TE FALTA CAFÉ', '#ffffff']], 540, 1560, 96, on(t, tFal - .1, .22)); } });
  // 8b · «Te sobra pico»: el pico se corta
  shots.push({ at: t8b, zin: .22, draw(t) { X.bg(t, { top: '#4a0f2a', bot: '#0a0612' }); const base = 1340, topY = 620, cutY = 1010, f = x => base - (base - topY) * Math.exp(-((x - 540) ** 2) / 22000) - 60;
      const cut = eo(seg(t, tPico - .05, tPico + .5)); const mk = () => { const p = new Path2D(); p.moveTo(60, base); for (let x = 60; x <= 1020; x += 12) p.lineTo(x, f(x)); p.lineTo(1020, base); p.closePath(); return p; }; const mt = mk();
      ctx.save(); ctx.beginPath(); ctx.rect(-200, cutY, W + 400, H); ctx.clip(); const g = ctx.createLinearGradient(0, cutY, 0, base); g.addColorStop(0, mixc('#ff3b55', '#5ef0a0', cut, .75)); g.addColorStop(1, mixc('#ff3b55', '#5ef0a0', cut, .1)); ctx.fillStyle = g; ctx.fill(mt); line(mt, mixc('#ff6b80', '#5ef0a0', cut), 9); ctx.restore();
      ctx.save(); ctx.translate(cut * 150, -cut * 120 + cut * cut * 40); ctx.translate(540, cutY); ctx.rotate(cut * .32); ctx.translate(-540, -cutY); ctx.globalAlpha = Math.max(0, 1 - cut * 1.15); ctx.beginPath(); ctx.rect(-200, -400, W + 400, cutY + 400); ctx.clip(); const g2 = ctx.createLinearGradient(0, topY, 0, cutY); g2.addColorStop(0, 'rgba(255,59,85,.95)'); g2.addColorStop(1, 'rgba(255,59,85,.6)'); ctx.fillStyle = g2; ctx.fill(mt); line(mt, '#ff8fa0', 9); ctx.restore();
      const lz = eo(seg(t, tSob - .1, tPico)); if (lz > 0) { const l = new Path2D(); l.moveTo(60, cutY); l.lineTo(lerp(60, 1020, lz), cutY); ctx.save(); ctx.setLineDash(cut > 0 ? [] : [26, 18]); line(l, '#ffffff', 7 + 8 * (1 - seg(t, tPico, tPico + .3)) * on(t, tPico - .05, .05)); ctx.restore(); }
      spark(540, cutY, t, tPico, '#ffd0d8', 22, 380); const bl = new Path2D(); bl.moveTo(40, base); bl.lineTo(1040, base); line(bl, '#9fc4ff', 4, .7); },
    ui(t) { slam([['TE SOBRA ', '#ffffff'], ['PICO', '#ff4d6a']], 540, 1545, 124, on(t, tSob - .12, .22)); } });

  // envoltura de cada plano: zoom de entrada, empuje de salida, bloom, viñeta, destello
  shots.forEach((s, i) => s.end = i + 1 < shots.length ? shots[i + 1].at : tEnd);
  const scenes = shots.map(s => ({ at: s.at, draw: t => {
    const k = 1 - eo(seg(t, s.at, s.at + .34)), x = s.noOut ? 0 : Math.pow(seg(t, s.end - .13, s.end), 2), z = 1 + (s.zin ?? .2) * k + .14 * x;
    const tf = () => { ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000); };
    ctx.save(); tf(); s.draw(t); ctx.restore(); bloom(s.bloom ?? .5); vign();
    if (s.ui) { ctx.save(); tf(); ctx.globalAlpha = 1 - x; s.ui(t); ctx.restore(); }
    if (s.at > 0 && k > 0 && s.zin !== 0) { ctx.fillStyle = `rgba(200,225,255,${k * k * .3})`; ctx.fillRect(0, 0, W, H); } } }));
  const fx = [[tFlo, 'thump'], [.55, 'fall'], [tZoom, 'rise'], [tOre - .1, 'pop'], [tGlu - .3, 'rise'], [tOff + .2, 'fall'], [tOff + .28, 'thump'], [t4 + .1, 'rise'], [tBaja, 'fall'], [tHar - .1, 'pop'], [tH1, 'thump'], [tH2, 'thump'], [t6, 'whoosh'], [tPro, 'ding'], [tVer, 'ding'], [tCam, 'pop'], [tPi, 'ding'], [tCaf, 'thump'], [tPico, 'thump'], [tPico + .05, 'fall']];
  return { scenes, tags: [], red: [], fx, cierreFrom: 'l9', vignette: false, captionPill: true, noFade: true, captionStyle: 'karaoke', captionY: 400 };
}
