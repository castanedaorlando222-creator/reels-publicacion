// Formato HISTORIA — biblioteca común (Orlando Castañeda Nutrición). Vertical 1080×1920, render(t) determinista.
// Cada reel solo escribe story.js (personaje, escenas, etiquetas, tinte). Este archivo no se toca.
export const W = 1080, H = 1920;
const cv = document.getElementById('c'); export const ctx = cv.getContext('2d');

// ---------- matemáticas ----------
export const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const eo = x => 1 - Math.pow(1 - clamp(x), 3);
export const back = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const hash = (a, b = 0) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
// cámara: empuje lento hacia (cx, cy), z de z0 a z1 a lo largo de la escena (u 0..1). Llamar dentro de save/restore.
export function cam(u, z0, z1, cx = 540, cy = 860) { const z = lerp(z0, z1, ss(u)); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }

// ---------- paleta y fondos ----------
export const C = { night0: '#0d1b3d', night1: '#162a57', wood: '#5a3b2c', wood2: '#3f2a20', skin: '#a8714f', skinD: '#8a5a3e', hair: '#2a1a14' };
export function sky(top = C.night0, bot = C.night1) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
export function glow(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.globalAlpha = 1; }
export function stars(t, n, y1, seed = 1, x0 = 0, w = W) { for (let i = 0; i < n; i++) { const x = x0 + hash(i, seed) * w, y = hash(i, seed + 1) * y1, a = .35 + .65 * (.5 + .5 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,250,230,${a * .8})`; ctx.beginPath(); ctx.arc(x, y, 1.2 + hash(i, 9) * 1.8, 0, 7); ctx.fill(); } }
export function moon(x, y, r) { glow(x, y, r * 3.2, 'rgba(255,230,170,0.35)'); ctx.fillStyle = '#ffe6a6'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(220,190,120,0.35)'; for (const [a, b, c] of [[-.3, -.2, .18], [.25, .1, .12], [-.05, .35, .1]]) { ctx.beginPath(); ctx.arc(x + a * r, y + b * r, c * r, 0, 7); ctx.fill(); } }
export function sun(x, y, r, t) { glow(x, y, r * 4, 'rgba(255,200,120,0.45)'); ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
export function city(t, x0, y0, w, h, seed = 3) {
  let x = x0, i = 0;
  while (x < x0 + w) { const bw = 40 + hash(i, seed) * 60, bh = h * (.3 + hash(i, seed + 2) * .7); ctx.fillStyle = i % 2 ? '#0a1530' : '#0e1b3a'; ctx.fillRect(x, y0 + h - bh, Math.min(bw, x0 + w - x), bh);
    for (let wy = y0 + h - bh + 12; wy < y0 + h - 10; wy += 22) for (let wx = x + 8; wx < Math.min(x + bw, x0 + w) - 10; wx += 16) { const k = hash(wx, wy + seed); if (k > .55) { const on = .6 + .4 * Math.sin(t * .7 + k * 40); ctx.fillStyle = `rgba(255,${200 + k * 40 | 0},120,${.5 * on})`; ctx.fillRect(wx, wy, 7, 10); } }
    x += bw + 4; i++; }
}
// ventana nocturna con ciudad y luna (o día con sol si day=true)
export function windowView(t, x, y, w, h, day = false) {
  ctx.fillStyle = '#0a1228'; rr(x, y, w, h, 10); ctx.fill(); ctx.save(); rr(x + 16, y + 16, w - 32, h - 32, 6); ctx.clip();
  if (day) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#7fb8e8'); g.addColorStop(1, '#f2d3a6'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); sun(x + w * .75, y + h * .25, 34, t); }
  else { sky('#0a1636', '#1a2f63'); stars(t, 30, y + h, 4, x, w); moon(x + w * .78, y + h * .22, 36); city(t, x + 16, y + h * .5, w - 32, h * .5 - 16, 5); }
  ctx.restore(); ctx.fillStyle = '#2a3b6b'; ctx.fillRect(x + w / 2 - 4, y + 16, 8, h - 32); ctx.fillRect(x + 16, y + h / 2 - 4, w - 32, 8);
}
export function lampCone(x, y, len, t, col = 'rgba(255,214,130,') { const f = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.1); const g = ctx.createLinearGradient(x, y, x, y + len); g.addColorStop(0, col + (.35 * f) + ')'); g.addColorStop(1, col + '0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y); ctx.lineTo(x + len * .55, y + len); ctx.lineTo(x - len * .55, y + len); ctx.closePath(); ctx.fill(); }
export function hangingLamp(x, y, t) { ctx.strokeStyle = '#0a1228'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, -50); ctx.lineTo(x, y - 40); ctx.stroke(); ctx.fillStyle = '#e0a83a'; ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x + 50, y); ctx.lineTo(x + 20, y - 40); ctx.lineTo(x - 20, y - 40); ctx.closePath(); ctx.fill(); glow(x, y + 5, 160, 'rgba(255,215,140,0.6)'); lampCone(x, y, 700, t); }
export function steam(x, y, t) { ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { const ph = (t * .6 + k / 3) % 1; ctx.globalAlpha = Math.sin(ph * Math.PI) * .8; ctx.beginPath(); for (let i = 0; i <= 10; i++) { const yy = y - i * 9 - ph * 50, xx = x + (k - 1) * 12 + Math.sin(i * .7 + t * 2 + k) * 6; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.globalAlpha = 1; }
export function mug(x, y, t, col = '#c94c3c') { ctx.fillStyle = col; rr(x - 25, y - 56, 50, 56, 8); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x + 28, y - 30, 12, -1.4, 1.4); ctx.stroke(); steam(x, y - 60, t); }
// cocina: pared, encimera con armarios, ventana, lámpara. Devuelve la altura de la encimera.
export function kitchen(t, { day = false } = {}) {
  sky(day ? '#2c4a7a' : '#0b1734', day ? '#3a5d93' : '#14244c');
  windowView(t, 470, 300, 460, 420, day);
  ctx.fillStyle = day ? '#28426f' : '#122249'; ctx.fillRect(0, 960, W, 960);
  ctx.fillStyle = C.wood; ctx.fillRect(380, 900, 700, 30); ctx.fillStyle = C.wood2; ctx.fillRect(400, 930, 680, 300);
  ctx.fillStyle = '#2e1f18'; for (const xx of [430, 640, 850]) { rr(xx, 960, 190, 240, 8); ctx.fill(); }
  hangingLamp(300, 340, t);
  return 900;
}
export function desk(y = 880) { ctx.fillStyle = C.wood2; ctx.fillRect(-W, y + 20, 3 * W, H); ctx.fillStyle = C.wood; ctx.fillRect(-W, y, 3 * W, 26); }
export function bathroomTiles() { ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
export function spotlightTable(x = 540, y = 860, rx = 430) { glow(x, y - 160, 620, 'rgba(120,170,255,0.18)'); ctx.fillStyle = '#0b1636'; ctx.beginPath(); ctx.ellipse(x, y, rx, 70, 0, 0, 7); ctx.fill(); }

// ---------- personaje ----------
// look: {skin, skinD, hair, top, topD, inner, pants, pantsD, shoes, hairStyle:'long'|'short'|'bald', beard:bool, glasses:bool}
// pose: 'phone' | 'back' | 'sick' | 'stand' | 'happy' | 'think'
export function person(x, y, s, pose, t, look) {
  const L = Object.assign({ skin: C.skin, skinD: C.skinD, hair: C.hair, top: '#e3a92b', topD: '#b9831b', inner: '#f3efe6', pants: '#2b3a5c', pantsD: '#212d48', shoes: '#1b1b22', hairStyle: 'long', beard: false, glasses: false }, look || {});
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const breath = Math.sin(t * 2.2) * 2;
  ctx.fillStyle = L.pants; rr(-46, 250, 40, 260, 16); ctx.fill(); ctx.fillStyle = L.pantsD; rr(6, 250, 40, 260, 16); ctx.fill();
  ctx.fillStyle = L.shoes; rr(-52, 500, 52, 26, 12); ctx.fill(); rr(2, 500, 52, 26, 12); ctx.fill();
  ctx.save(); ctx.translate(0, breath * .5);
  ctx.fillStyle = L.top; rr(-78, 20, 156, 260, 50); ctx.fill();
  if (pose !== 'back') { ctx.fillStyle = L.inner; ctx.beginPath(); ctx.moveTo(-26, 26); ctx.lineTo(26, 26); ctx.lineTo(16, 250); ctx.lineTo(-16, 250); ctx.closePath(); ctx.fill(); ctx.fillStyle = L.topD; for (const yy of [110, 160, 210]) { ctx.beginPath(); ctx.arc(20, yy, 4, 0, 7); ctx.fill(); } }
  else { ctx.fillStyle = L.topD; rr(-4, 30, 8, 240, 4); ctx.fill(); }
  ctx.fillStyle = L.topD;
  if (pose === 'phone') { rr(-92, 40, 38, 200, 19); ctx.fill(); rr(58, 40, 36, 130, 18); ctx.fill();
    ctx.save(); ctx.translate(76, 160); ctx.rotate(2.3); rr(-17, -6, 34, 92, 17); ctx.fill(); ctx.restore();
    const px = 22, py = 108; glow(px, py - 20, 150, 'rgba(140,200,255,0.35)');
    ctx.fillStyle = '#15171f'; rr(px - 24, py - 40, 48, 80, 8); ctx.fill(); ctx.fillStyle = '#9ad1ff'; rr(px - 20, py - 35, 40, 70, 5); ctx.fill();
    ctx.fillStyle = L.skin; ctx.beginPath(); ctx.arc(px + 22, py + 18, 17, 0, 7); ctx.fill(); }
  else if (pose === 'sick') { for (const s2 of [-1, 1]) { ctx.save(); ctx.translate(70 * s2, 50); ctx.rotate(-.5 * s2); rr(-18, 0, 36, 120, 18); ctx.fill(); ctx.restore(); } ctx.fillStyle = L.skin; ctx.beginPath(); ctx.arc(-6, 168, 18, 0, 7); ctx.arc(14, 172, 18, 0, 7); ctx.fill(); }
  else if (pose === 'happy') { for (const s2 of [-1, 1]) { ctx.save(); ctx.translate(70 * s2, 40); ctx.rotate(-2.5 * s2 + Math.sin(t * 3) * .08 * s2); rr(-18, 0, 36, 190, 18); ctx.fill(); ctx.fillStyle = L.skin; ctx.beginPath(); ctx.arc(0, 196, 18, 0, 7); ctx.fill(); ctx.fillStyle = L.topD; ctx.restore(); } }
  else if (pose === 'think') { rr(-96, 40, 38, 210, 19); ctx.fill(); ctx.save(); ctx.translate(70, 50); ctx.rotate(-.3); rr(-18, 0, 36, 110, 18); ctx.fill(); ctx.translate(0, 100); ctx.rotate(-2.4); rr(-16, -8, 32, 110, 16); ctx.fill(); ctx.fillStyle = L.skin; ctx.beginPath(); ctx.arc(0, 104, 17, 0, 7); ctx.fill(); ctx.restore(); }
  else { rr(-96, 40, 38, 210, 19); ctx.fill(); rr(58, 40, 38, 210, 19); ctx.fill(); }
  const hy = -40 + (pose === 'sick' ? 10 : pose === 'phone' ? 6 : 0), tilt = pose === 'phone' ? .1 : pose === 'sick' ? -.15 : pose === 'think' ? .08 : 0;
  ctx.save(); ctx.translate(0, hy); ctx.rotate(tilt);
  ctx.fillStyle = L.skinD; rr(-16, 30, 32, 40, 10); ctx.fill();
  if (L.hairStyle !== 'bald') { ctx.fillStyle = L.hair; ctx.beginPath(); L.hairStyle === 'long' ? ctx.ellipse(0, -6, 68, 76, 0, 0, 7) : ctx.ellipse(0, -14, 58, 62, 0, 0, 7); ctx.fill(); }
  if (pose !== 'back') {
    ctx.fillStyle = L.skin; ctx.beginPath(); ctx.ellipse(0, 4, 52, 60, 0, 0, 7); ctx.fill();
    if (L.hairStyle !== 'bald') { ctx.fillStyle = L.hair; ctx.beginPath(); ctx.moveTo(-58, -10); ctx.quadraticCurveTo(-10, -70, 50, -30); ctx.quadraticCurveTo(10, -40, -20, -10); ctx.closePath(); ctx.fill();
      if (L.hairStyle === 'long') { ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(-78, 40, -54, 80); ctx.lineTo(-44, 20); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(56, -20); ctx.quadraticCurveTo(80, 40, 56, 82); ctx.lineTo(46, 20); ctx.closePath(); ctx.fill(); } }
    if (L.beard) { ctx.fillStyle = L.hair; ctx.beginPath(); ctx.moveTo(-50, 10); ctx.quadraticCurveTo(-46, 70, 0, 68); ctx.quadraticCurveTo(46, 70, 50, 10); ctx.quadraticCurveTo(30, 44, 0, 44); ctx.quadraticCurveTo(-30, 44, -50, 10); ctx.fill(); }
    const blink = (t % 3.7) < .12 ? .15 : 1, ey = pose === 'phone' ? 10 : 6, eh = pose === 'phone' ? 3.5 : 6;
    ctx.fillStyle = '#1a120e'; ctx.beginPath(); ctx.ellipse(-18, ey, 5, eh * blink, 0, 0, 7); ctx.ellipse(18, ey, 5, eh * blink, 0, 0, 7); ctx.fill();
    if (L.glasses) { ctx.strokeStyle = '#1a120e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-18, ey, 14, 0, 7); ctx.moveTo(32, ey); ctx.arc(18, ey, 14, 0, 7); ctx.moveTo(-4, ey); ctx.lineTo(4, ey); ctx.stroke(); }
    ctx.strokeStyle = '#1a120e'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    const worried = pose === 'sick' || pose === 'think';
    ctx.beginPath(); ctx.moveTo(-28, -10); ctx.lineTo(-10, worried ? -16 : -12); ctx.moveTo(28, -10); ctx.lineTo(10, worried ? -16 : -12); ctx.stroke();
    ctx.beginPath(); if (pose === 'sick') { ctx.moveTo(-10, 36); ctx.quadraticCurveTo(0, 28, 10, 36); } else if (pose === 'happy') { ctx.moveTo(-14, 30); ctx.quadraticCurveTo(0, 44, 14, 30); } else { ctx.moveTo(-8, 34); ctx.quadraticCurveTo(0, 38, 8, 34); } ctx.stroke();
    ctx.fillStyle = 'rgba(220,110,90,0.35)'; ctx.beginPath(); ctx.arc(-30, 24, 9, 0, 7); ctx.arc(30, 24, 9, 0, 7); ctx.fill();
    if (pose === 'phone') { ctx.fillStyle = 'rgba(150,210,255,0.18)'; ctx.beginPath(); ctx.ellipse(10, 10, 50, 58, 0, 0, 7); ctx.fill(); }
  }
  ctx.restore(); ctx.restore(); ctx.restore();
}
// globo de pensamiento con un emoji/texto corto
export function thought(x, y, t, txt, p = 1) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p * 2); const s = .7 + .3 * back(p); ctx.translate(x, y + Math.sin(t * 2) * 4); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(245,247,252,0.95)'; ctx.beginPath(); ctx.ellipse(0, 0, 120, 80, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(-70, 95, 18, 0, 7); ctx.arc(-95, 130, 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#1d2333'; ctx.font = '800 52px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); }

// ---------- objetos ----------
export function pen(x, y, s, rot, col = '#1f7fb6', label = '') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; rr(-230, 24, 460, 60, 30); ctx.fill();
  ctx.fillStyle = '#e9edf2'; rr(-240, -30, 330, 60, 28); ctx.fill();
  ctx.fillStyle = col; rr(80, -30, 140, 60, 20); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; rr(200, -24, 40, 48, 12); ctx.fill();
  ctx.fillStyle = '#c8d4de'; rr(-120, -18, 120, 36, 10); ctx.fill(); ctx.fillStyle = '#7fc6ee'; rr(-110, -12, 100, 24, 8); ctx.fill();
  ctx.fillStyle = '#9aa7b4'; rr(-262, -12, 30, 24, 6); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.6)'; rr(-220, -24, 280, 8, 4); ctx.fill();
  if (label) { ctx.fillStyle = '#fff'; ctx.font = '700 20px Inter'; ctx.fillText(label, 110, 8); }
  ctx.restore();
}
export function vial(x, y, s, t, label = '???', liquid = 'rgba(190,140,255,0.55)', cap = '#e85d75') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(210,230,255,0.25)'; rr(-50, -60, 100, 150, 16); ctx.fill(); ctx.strokeStyle = 'rgba(230,240,255,0.8)'; ctx.lineWidth = 2; ctx.stroke();
  const lv = 10 + Math.sin(t * 3) * 3; ctx.save(); rr(-50, -60, 100, 150, 16); ctx.clip(); ctx.fillStyle = liquid; ctx.beginPath(); ctx.moveTo(-60, lv); for (let i = 0; i <= 12; i++) ctx.lineTo(-60 + i * 10, lv + Math.sin(i * .8 + t * 4) * 2); ctx.lineTo(60, 100); ctx.lineTo(-60, 100); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#b8b8c4'; rr(-32, -82, 64, 24, 6); ctx.fill(); ctx.fillStyle = cap; rr(-36, -100, 72, 22, 8); ctx.fill();
  ctx.fillStyle = '#f4f1ea'; rr(-46, -20, 92, 56, 6); ctx.fill();
  ctx.fillStyle = '#20232c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let fs = 18; ctx.font = `800 ${fs}px Inter`; while (ctx.measureText(label).width > 82 && fs > 7) { fs--; ctx.font = `800 ${fs}px Inter`; } ctx.fillText(label, 0, 8); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.restore();
}
// frasco de pastillas/suplemento
export function bottle(x, y, s, t, label = 'Mg', body = '#f2f4f7', cap = '#2e7d4f') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 110, 80, 14, 0, 0, 7); ctx.fill();
  ctx.fillStyle = body; rr(-70, -70, 140, 180, 22); ctx.fill(); ctx.fillStyle = cap; rr(-60, -120, 120, 58, 12); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = -50; i <= 50; i += 14) ctx.fillRect(i, -116, 5, 50);
  ctx.fillStyle = cap; rr(-60, -20, 120, 80, 10); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 22); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; rr(-58, -60, 14, 150, 7); ctx.fill();
  ctx.restore();
}
export function plate(x, y, r, foods = []) { // foods: [{col, r, dx, dy, shape:'round'|'leaf'|'slice'}]
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x + 10, y + 16, r, r * .55, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#f4f2ee'; ctx.beginPath(); ctx.ellipse(x, y, r, r * .55, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e4e1da'; ctx.beginPath(); ctx.ellipse(x, y, r * .78, r * .42, 0, 0, 7); ctx.fill();
  for (const f of foods) { ctx.fillStyle = f.col; ctx.beginPath(); if (f.shape === 'leaf') ctx.ellipse(x + f.dx, y + f.dy, f.r * 1.4, f.r * .6, .4, 0, 7); else ctx.ellipse(x + f.dx, y + f.dy, f.r, f.r * .8, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(x + f.dx - f.r * .3, y + f.dy - f.r * .25, f.r * .25, 0, 7); ctx.fill(); }
}
export function laptop(x, y, t, drawScreen) {
  ctx.fillStyle = '#20232c'; ctx.beginPath(); ctx.moveTo(x - 290, y + 25); ctx.lineTo(x + 290, y + 25); ctx.lineTo(x + 360, y + 80); ctx.lineTo(x - 360, y + 80); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2c2f3a'; rr(x - 270, y - 360, 540, 380, 18); ctx.fill(); ctx.fillStyle = '#e9eef7'; rr(x - 250, y - 340, 500, 340, 8); ctx.fill();
  glow(x, y - 180, 520, 'rgba(160,200,255,0.25)');
  ctx.save(); rr(x - 250, y - 340, 500, 340, 8); ctx.clip(); ctx.translate(x - 250, y - 340); drawScreen && drawScreen(500, 340); ctx.restore();
}
export function cursor(x, y) { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 34); ctx.lineTo(x + 10, y + 25); ctx.lineTo(x + 22, y + 32); ctx.lineTo(x + 13, y + 20); ctx.lineTo(x + 26, y + 18); ctx.closePath(); ctx.fill(); }
export function checkBadge(x, y, p, col = '#28a745') { if (p <= 0) return; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 20 * back(p), 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x - 2, y + 7); ctx.lineTo(x + 10, y - 7); ctx.stroke(); }
export function scale(x, y, t, kg, colNum = '#7dffb0', look) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; rr(x - 240, y - 230, 500, 560, 70); ctx.fill();
  ctx.fillStyle = '#e8edf3'; rr(x - 250, y - 250, 500, 560, 70); ctx.fill(); ctx.fillStyle = '#cfd6df'; rr(x - 230, y - 230, 460, 520, 60); ctx.fill();
  ctx.fillStyle = '#1b2230'; rr(x - 120, y - 200, 240, 100, 14); ctx.fill();
  ctx.fillStyle = colNum; ctx.font = '700 64px Mono'; ctx.textAlign = 'center'; ctx.fillText(kg.toFixed(1), x, y - 128); ctx.font = '600 24px Mono'; ctx.fillText('kg', x + 90, y - 110); ctx.textAlign = 'left';
  const sk = (look && look.skin) || C.skin, skd = (look && look.skinD) || C.skinD;
  for (const s of [-1, 1]) { ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(x + s * 85, y + 120, 58, 130, s * .08, 0, 7); ctx.fill(); ctx.fillStyle = skd; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + s * (60 + k * 13), y - Math.abs(k - 1) * 6, 11 - k * 1.2, 0, 7); ctx.fill(); } }
}
// esquema del cuerpo; organs: {estomago, higado, pancreas, vesicula, intestino, corazon, cerebro, pulmones, rinones, musculo}: intensidad 0..1 (0.25 = visible apagado)
export function bodyDiagram(t, organs = {}, red = {}) {
  ctx.strokeStyle = 'rgba(150,210,255,0.8)'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(120,180,255,0.08)';
  ctx.beginPath(); ctx.ellipse(540, 170, 78, 92, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(300, 470); ctx.quadraticCurveTo(240, 700, 250, 960); ctx.moveTo(780, 470); ctx.quadraticCurveTo(840, 700, 830, 960); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(500, 258); ctx.lineTo(502, 330); ctx.moveTo(580, 258); ctx.lineTo(578, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(502, 330); ctx.quadraticCurveTo(330, 350, 300, 470); ctx.lineTo(320, 760); ctx.quadraticCurveTo(340, 1000, 380, 1120); ctx.lineTo(700, 1120); ctx.quadraticCurveTo(740, 1000, 760, 760); ctx.lineTo(780, 470); ctx.quadraticCurveTo(750, 350, 578, 330); ctx.closePath(); ctx.fill(); ctx.stroke();
  const pulse = .5 + .5 * Math.sin(t * 5);
  const O = {
    cerebro: [() => { ctx.beginPath(); ctx.ellipse(540, 150, 56, 46, 0, 0, 7); }, 'rgba(255,170,200,A)'],
    pulmones: [() => { ctx.beginPath(); ctx.ellipse(470, 470, 55, 95, .1, 0, 7); ctx.ellipse(610, 470, 55, 95, -.1, 0, 7); }, 'rgba(255,160,170,A)'],
    corazon: [() => { ctx.beginPath(); ctx.ellipse(560, 500, 40, 46, .3, 0, 7); }, 'rgba(255,90,110,A)'],
    higado: [() => { ctx.beginPath(); ctx.ellipse(470, 600, 120, 75, .2, 0, 7); }, 'rgba(190,120,90,A)'],
    estomago: [() => { ctx.beginPath(); ctx.ellipse(590, 640, 100, 70, -.4, 0, 7); }, 'rgba(255,200,90,A)'],
    vesicula: [() => { ctx.beginPath(); ctx.ellipse(450, 670, 26, 40, .4, 0, 7); }, 'rgba(120,200,120,A)'],
    pancreas: [() => { ctx.beginPath(); ctx.ellipse(580, 730, 110, 26, -.15, 0, 7); }, 'rgba(255,170,120,A)'],
    rinones: [() => { ctx.beginPath(); ctx.ellipse(430, 760, 30, 50, .2, 0, 7); ctx.ellipse(650, 760, 30, 50, -.2, 0, 7); }, 'rgba(200,110,110,A)'],
    intestino: [() => { ctx.beginPath(); ctx.ellipse(540, 900, 150, 110, 0, 0, 7); }, 'rgba(255,190,150,A)'],
    musculo: [() => { ctx.beginPath(); ctx.ellipse(265, 700, 30, 120, .08, 0, 7); ctx.ellipse(815, 700, 30, 120, -.08, 0, 7); }, 'rgba(255,120,100,A)'],
  };
  for (const [k, v] of Object.entries(organs)) { const o = O[k]; if (!o) continue; let col = o[1]; if (red[k]) col = 'rgba(255,80,80,A)'; const a = clamp(v) * (v > .3 ? .7 + .3 * pulse : 1);
    ctx.fillStyle = col.replace('A', String(.15 + .6 * a)); o[0](); ctx.fill(); ctx.strokeStyle = col.replace('A', '0.9'); ctx.lineWidth = 3; ctx.stroke(); }
  if (organs.intestino != null) { ctx.strokeStyle = 'rgba(150,210,255,0.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(560, 830); ctx.bezierCurveTo(400, 850, 420, 930, 540, 930); ctx.bezierCurveTo(680, 930, 680, 1000, 540, 1010); ctx.stroke(); }
}
export const ORGAN_POS = { cerebro: [540, 150], pulmones: [610, 470], corazon: [560, 500], higado: [470, 600], estomago: [590, 640], vesicula: [450, 670], pancreas: [580, 730], rinones: [650, 760], intestino: [540, 900], musculo: [815, 700] };
export function leader(from, to, p, col = 'rgba(255,90,90,0.9)') { if (p <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(lerp(from[0], to[0], p), lerp(from[1], to[1], p)); ctx.stroke(); }
export function dashedRing(x, y, r, t, col = 'rgba(160,220,255,0.55)') { ctx.strokeStyle = col; ctx.setLineDash([10, 12]); ctx.lineWidth = 3; ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.setLineDash([]); }

// ---------- paneles ----------
// tarjeta de móvil: {user, before:'ANTES', after:'AHORA', big:'−15 KG', small:'en 3 meses'} ; c 0..1
export function phoneCard(x, y, c, o = {}) {
  if (c <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(.6 + .4 * back(c), .6 + .4 * back(c)); ctx.globalAlpha = clamp(c * 2); ctx.rotate(.05);
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fillStyle = '#15171f'; rr(-140, -230, 280, 460, 34); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#f5f2ec'; rr(-126, -214, 252, 428, 24); ctx.fill();
  ctx.fillStyle = '#1b1d24'; ctx.font = '700 20px Inter'; ctx.fillText(o.user || '@cuenta', -104, -176);
  if (o.before) for (const [i, lab] of [[0, o.before], [1, o.after || 'AHORA']]) { const xx = -110 + i * 114; ctx.fillStyle = i ? '#cfe8d6' : '#e9d3cf'; rr(xx, -150, 104, 200, 12); ctx.fill();
    ctx.fillStyle = '#6a4a3a'; ctx.beginPath(); ctx.arc(xx + 52, -100, 22, 0, 7); ctx.fill(); ctx.fillStyle = i ? '#4f8f6a' : '#a0574a'; rr(xx + 52 - (i ? 22 : 36), -76, i ? 44 : 72, 100, 18); ctx.fill();
    ctx.fillStyle = '#333'; ctx.font = '700 16px Mono'; ctx.fillText(lab, xx + 22, 40); }
  else if (o.drawBody) { ctx.save(); ctx.translate(0, -50); o.drawBody(); ctx.restore(); }
  ctx.textAlign = 'center'; let fs = 54; ctx.font = `900 ${fs}px Inter`; while (ctx.measureText(o.big || '').width > 230 && fs > 20) { fs -= 2; ctx.font = `900 ${fs}px Inter`; }
  ctx.fillStyle = o.bigCol || '#e0443e'; ctx.fillText(o.big || '', 0, 120); ctx.fillStyle = '#555'; ctx.font = '600 20px Inter'; ctx.fillText(o.small || '', 0, 160); ctx.textAlign = 'left';
  ctx.restore();
}
// gráfica: f(u) en 0..1 (1 = arriba). split: u donde cambia a color 2 (o null). a = progreso de dibujo
export function chart(x0, y0, w, h, a, f, { title = '', split = null, c1 = '#7dffb0', c2 = '#ff6b6b', mark = '' } = {}) {
  if (a <= 0) return; ctx.save(); ctx.fillStyle = 'rgba(8,14,32,0.85)'; rr(x0 - 30, y0 - 40, w + 60, h + 80, 18); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '600 20px Mono'; ctx.fillText(title, x0, y0 - 12);
  ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); const n = Math.floor(80 * a);
  for (let i = 0; i <= n; i++) { const u = i / 80, x = x0 + u * w, y = y0 + 10 + (1 - f(u)) * h * .85; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  const grd = ctx.createLinearGradient(x0, 0, x0 + w, 0); grd.addColorStop(0, c1); if (split != null) { grd.addColorStop(split, c1); grd.addColorStop(Math.min(1, split + .01), c2); } else grd.addColorStop(1, c1); ctx.strokeStyle = grd; ctx.stroke();
  if (split != null) { ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + split * w, y0); ctx.lineTo(x0 + split * w, y0 + h); ctx.stroke(); ctx.setLineDash([]); if (mark && a > split + .05) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '600 18px Mono'; ctx.fillText(mark, x0 + split * w + 10, y0 + 18); } }
  ctx.restore();
}
// lista tipo terminal: items [[texto, ok(bool|null)]]; null = pendiente parpadeando en rojo desde tBlink
export function checklist(x, y, w, t, t0, title, items, tBlink = 1e9) {
  const a = eo(seg(t, t0, t0 + .4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,12,26,0.92)'; rr(x, y, w, 70 + items.length * 52, 16); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#f2c94c'; ctx.font = '600 22px Mono'; ctx.fillText(title, x + 28, y + 44);
  items.forEach(([s, ok], i) => { const ti = t0 + .5 + i * .5, p = seg(t, ti, ti + .2); if (p <= 0) return; const yy = y + 92 + i * 52;
    ctx.globalAlpha = a * p; const missing = !ok, blink = missing && t > tBlink ? (Math.sin(t * 9) > 0 ? 1 : .35) : 1;
    ctx.strokeStyle = missing ? `rgba(255,80,80,${blink})` : '#5ee08a'; ctx.lineWidth = 3; ctx.strokeRect(x + 30, yy - 20, 26, 26);
    if (ok) { ctx.beginPath(); ctx.moveTo(x + 35, yy - 7); ctx.lineTo(x + 42, yy); ctx.lineTo(x + 52, yy - 15); ctx.stroke(); }
    ctx.fillStyle = missing ? `rgba(255,110,110,${blink})` : '#d8f5e2'; ctx.font = '600 26px Mono'; ctx.fillText(s, x + 74, yy); });
  ctx.restore();
}
// caja de texto que se escribe sola (radio, mensaje, nota)
export function typeBox(x, y, w, t, t0, title, text, col = '#5ee08a') {
  const a = eo(seg(t, t0, t0 + .3)); if (a <= 0) return; const n = Math.floor(text.length * seg(t, t0 + .3, t0 + .3 + text.length * .035));
  ctx.save(); ctx.globalAlpha = a; ctx.font = '600 26px Mono'; const lines = []; let cur = ''; for (const wd of text.slice(0, n).split(' ')) { const tt = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tt).width > w - 60 && cur) { lines.push(cur); cur = wd; } else cur = tt; } lines.push(cur);
  ctx.fillStyle = 'rgba(8,12,26,0.92)'; rr(x, y, w, 80 + lines.length * 38, 14); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = col; ctx.font = '600 20px Mono'; ctx.fillText(title, x + 28, y + 38); ctx.fillStyle = '#e8f6ee'; ctx.font = '600 26px Mono'; lines.forEach((l, i) => ctx.fillText(l, x + 28, y + 82 + i * 38));
  ctx.restore();
}

// ---------- motor ----------
export async function run(story, IMG = {}) {
  await Promise.all([document.fonts.load('800 60px "Inter"'), document.fonts.load('600 30px "Mono"'), document.fonts.load('600 60px "Cormorant"')]);
  const J = async u => { try { const r = await fetch(u); return r.ok ? await r.json() : null; } catch (e) { return null; } };
  const dur = (await J('voices/dur.json')) || {}, LINES = (await J('lines.json')) || [];
  const D = id => dur[id] ?? 4;
  const logo = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  const LOGO = { orlando: await logo('img/logo-orlando.jpg'), nc: await logo('img/logo-nc.jpg'), codigo: await logo('img/logo-codigo.jpg') };
  // tiempos
  const WJ = (await J('voices/words.json')) || {}; const T = {}; let tt = .3;
  for (const L of LINES) { T[L.id] = tt; tt += D(L.id) + (L.gap ?? .4); }
  const END = tt + 0.85;
  const wordsOf = L => { const ws = L.sub.split(/\s+/), n = ws.map(w => w.replace(/[^\p{L}\p{N}]/gu, '').length + 1.5), tot = n.reduce((a, b) => a + b, 0); let acc = 0; const t0 = T[L.id], d = D(L.id);
    return ws.map((w, i) => { let a = t0 + d * acc / tot; acc += n[i]; if (WJ[L.id] && WJ[L.id].length === ws.length) a = t0 + WJ[L.id][i]; return { w, t: a, hl: (L.hl || []).includes(w), red: (L.red || []).includes(w), green: (L.green || []).includes(w), end: /[.,:;?!]$/.test(w) }; }); };
  const wt = (id, word) => { const L = LINES.find(l => l.id === id); if (!L) return 0; const w = wordsOf(L).find(x => x.w.toLowerCase().startsWith(word.toLowerCase())); return w ? w.t : T[id]; };
  const S = { T, D, wt, END, LOGO, IMG };
  const st = story(S);   // {scenes:[{from, draw(t,u), clock?}], tags:[[t,x,y,text,col,size]], red:[[t0,t1]], cierreFrom}
  const scenes = st.scenes.map(s => ({ ...s, t0: s.at != null ? s.at : Math.max(0, T[s.from] - .15) }));
  scenes[0].t0 = 0;
  const cierre = st.cierreFrom ? T[st.cierreFrom] - .15 : END;
  const MARCA = st.marca || 'nutricion';
  scenes.push({ t0: cierre, id: 'cierre', draw: (t, u) => (MARCA === 'codigo' ? closingCodigo : closing)(t, u, LOGO, cierre, st.cierre || {}) });
  scenes.forEach((s, i) => s.t1 = i + 1 < scenes.length ? scenes[i + 1].t0 : END);
  const sceneAt = t => scenes.find(s => t >= s.t0 && t < s.t1) || scenes[scenes.length - 1];
  const CH = []; for (const L of LINES) { if (L.noSubs) continue; const ws = wordsOf(L); let cur = []; ws.forEach((w, i) => { cur.push(w); if (cur.length >= 3 || w.end || i === ws.length - 1) { CH.push(cur); cur = []; } }); }
  CH.forEach((c, i) => { c.t0 = c[0].t; c.t1 = i + 1 < CH.length ? Math.min(CH[i + 1][0].t, c[c.length - 1].t + 1.6) : c[c.length - 1].t + 1.6; });
  const TAGS = (st.tags || []).map(([t, x, y, text, col = 'y', size = 30, t1 = null]) => ({ t, x, y, text, col, size, t1 }));
  const EV = [];
  for (const L of LINES) EV.push({ t: T[L.id], type: 'voice', id: L.id });
  scenes.slice(1).forEach(s => EV.push({ t: s.t0, type: 'cut' })); (st.fx || []).forEach(([t, type]) => EV.push({ t, type }));
  TAGS.forEach(g => EV.push({ t: g.t, type: 'tag', col: g.col }));
  EV.push({ t: cierre, type: 'sting' });
  const redAt = t => Math.max(0, ...(st.red || []).map(([a, b]) => seg(t, a - .2, a + .4) * (1 - seg(t, b - .3, b))));
  const COL = { y: '#f2c94c', w: '#eef2f8', r: '#ff5a5a', g: '#5ee08a', o: '#e2b866', k: '#1d1d1d' };
  function drawTag(g, t, sc) { const p = seg(t, g.t, g.t + .25) * (g.t1 ? 1 - seg(t, g.t1 - .25, g.t1) : 1); if (p <= 0 || sceneAt(g.t) !== sc) return;
    ctx.save(); ctx.font = `600 ${g.size}px Mono`; const n = Math.ceil(g.text.length * seg(t, g.t, g.t + .45)), tw = ctx.measureText(g.text).width, pad = 14, h = g.size + 18;
    const x = Math.min(g.x, W - 40 - tw - 2 * pad); ctx.translate(x, g.y); ctx.scale(.8 + .2 * back(p), .8 + .2 * back(p)); ctx.globalAlpha = p;
    ctx.fillStyle = 'rgba(6,10,24,0.72)'; rr(0, -h / 2, tw + pad * 2, h, 6); ctx.fill(); ctx.strokeStyle = COL[g.col]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = COL[g.col]; ctx.textBaseline = 'middle'; ctx.fillText(g.text.slice(0, n), pad, 2); ctx.restore(); }
  function clock(t, sc) { const lab = sc.clock; if (!lab) return; ctx.save(); ctx.font = '600 34px Mono'; ctx.fillStyle = 'rgba(240,244,255,0.88)'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
    const n = Math.ceil(lab.length * seg(t, sc.t0 + .05, sc.t0 + .4)); ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(6,8,14,0.55)'; rr(52, 128, ctx.measureText(lab).width + 60, 58, 10); ctx.fill(); ctx.fillStyle = 'rgba(240,244,255,0.92)'; ctx.fillText(lab.slice(0, n), 70, 170); if (Math.sin(t * 6) > 0 && n >= lab.length) ctx.fillRect(70 + ctx.measureText(lab).width + 8, 145, 14, 30); ctx.restore(); }
  function captionPapel(c, t) { // subtítulo como tira de papel recortado (estilo Lightbox)
    ctx.save(); let fs = 64; ctx.font = `600 ${fs}px Cormorant`; ctx.textBaseline = 'middle'; const sp = 16;
    let parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1);
    if (tot > 900) { fs = Math.floor(fs * 900 / tot); ctx.font = `600 ${fs}px Cormorant`; parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })); tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1); }
    const y = st.captionY || 1560, w = tot + 70, h = fs * 1.5, x0 = W / 2 - w / 2, k = eo(seg(t, c.t0 - .08, c.t0 + .25));
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10, y - h, w * k + 20, h * 2); ctx.clip();
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8; ctx.fillStyle = '#ecdcb8';
    ctx.beginPath(); const sd = c.t0 * 13; ctx.moveTo(x0, y - h / 2 + 2 * Math.sin(sd)); for (let i = 1; i <= 12; i++) ctx.lineTo(x0 + w * i / 12, y - h / 2 + 1.6 * Math.sin(sd + i * 2.1)); for (let i = 12; i >= 0; i--) ctx.lineTo(x0 + w * i / 12, y + h / 2 + 1.6 * Math.sin(sd + i * 1.7)); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
    const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, 'rgba(255,235,190,.4)'); g.addColorStop(1, 'rgba(90,60,30,.18)'); ctx.fillStyle = g; ctx.fill();
    let x = W / 2 - tot / 2; for (const p of parts) { const a = seg(t, p.t - .05, p.t + .08); ctx.globalAlpha = .35 + .65 * a; ctx.fillStyle = p.red ? '#9b1c1c' : p.green ? '#1e6b3a' : p.hl ? '#8a4b00' : '#2a1d10'; ctx.fillText(p.w, x, y + 2); x += p.wd + sp; }
    ctx.restore(); ctx.restore(); }
  function captionKaraoke(c, t) { // v2: subtítulo grande arriba con panel oscuro; la palabra que suena va en recuadro lleno que «salta»
    ctx.save(); let fs = 78; const F = () => ctx.font = `800 ${fs}px Inter`; F(); ctx.textBaseline = 'middle'; const sp = 20;
    let parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1);
    if (tot > 860) { fs = Math.floor(fs * 860 / tot); F(); parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })); tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1); }
    const y = st.captionY || 400, k = eo(seg(t, c.t0 - .06, c.t0 + .12)); let x = W / 2 - tot / 2; let cur = -1; parts.forEach((p, i) => { if (t >= p.t - .02) cur = i; });
    ctx.globalAlpha = k; ctx.fillStyle = 'rgba(3,8,26,.72)'; rr(x - 34, y - fs * .82, tot + 68, fs * 1.64, 26); ctx.fill(); ctx.strokeStyle = 'rgba(150,200,255,.28)'; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
    parts.forEach((p, i) => { const on = i <= cur, col = p.red ? '#ff6b6b' : p.green ? '#6dffa8' : p.hl ? '#ffd34f' : '#ffffff';
      if (i === cur) { const pop = 1 + .1 * (1 - eo(seg(t, p.t - .02, p.t + .16))); ctx.save(); ctx.translate(x + p.wd / 2, y); ctx.scale(pop, pop); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 22; rr(-p.wd / 2 - 14, -fs * .62, p.wd + 28, fs * 1.24, 14); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#06102c'; ctx.fillText(p.w, -p.wd / 2, 2); ctx.restore(); }
      else { ctx.fillStyle = on ? col : 'rgba(255,255,255,.45)'; ctx.fillText(p.w, x, y + 2); }
      x += p.wd + sp; });
    ctx.restore(); }
  function caption(t) { const c = CH.find(c => t >= c.t0 && t < c.t1); if (!c) return; if (st.captionStyle === 'papel') return captionPapel(c, t); if (st.captionStyle === 'karaoke') return captionKaraoke(c, t); ctx.save(); let fs = 66; ctx.font = `800 ${fs}px Inter`; ctx.textBaseline = 'middle';
    const sp = 18; let parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })), tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1);
    if (tot > 960) { fs = Math.floor(fs * 960 / tot); ctx.font = `800 ${fs}px Inter`; parts = c.map(w => ({ ...w, wd: ctx.measureText(w.w).width })); tot = parts.reduce((a, p) => a + p.wd, 0) + sp * (parts.length - 1); }
    let x = W / 2 - tot / 2; const y = 1380;
    if (st.captionPill) { const a0 = seg(t, c.t0 - .05, c.t0 + .12); ctx.save(); ctx.globalAlpha = a0; ctx.fillStyle = 'rgba(22,22,22,0.88)'; rr(x - 34, y - fs * 0.85, tot + 68, fs * 1.7, 22); ctx.fill(); ctx.restore(); }
    for (const p of parts) { const a = seg(t, p.t - .05, p.t + .08); if (a > 0) { ctx.globalAlpha = a; const yy = y + (1 - eo(a)) * 14; ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineJoin = 'round'; ctx.strokeText(p.w, x, yy); ctx.fillStyle = p.red ? '#ff4d4d' : p.green ? (MARCA === 'codigo' ? '#f3d58f' : '#5ee08a') : p.hl ? (MARCA === 'codigo' ? '#e2b866' : '#ffc93c') : '#ffffff'; ctx.fillText(p.w, x, yy); } x += p.wd + sp; }
    ctx.restore(); }
  function tint(t) { const r = redAt(t); if (r <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(255,${(1 - r * .55) * 255 | 0},${(1 - r * .5) * 255 | 0},1)`; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(120,10,30,${r * .18})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  function vignette() { const g = ctx.createRadialGradient(W / 2, H * .45, H * .25, W / 2, H * .5, H * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const b = ctx.createLinearGradient(0, H * .62, 0, H); b.addColorStop(0, 'rgba(5,8,20,0)'); b.addColorStop(.35, 'rgba(5,8,20,0.55)'); b.addColorStop(1, 'rgba(5,8,20,0.85)'); ctx.fillStyle = b; ctx.fillRect(0, H * .62, W, H * .38); }
  function bottomShade() { const b = ctx.createLinearGradient(0, 1250, 0, 1520); b.addColorStop(0, 'rgba(10,14,24,0)'); b.addColorStop(.5, 'rgba(10,14,24,0.38)'); b.addColorStop(1, 'rgba(10,14,24,0)'); ctx.fillStyle = b; ctx.fillRect(0, 1250, W, 270); }
  function logos(sc) { if (sc.id === 'cierre') return; if (MARCA === 'codigo') { roundLogo(LOGO.codigo, 975, 175, 66); return; } roundLogo(LOGO.orlando, 975, 175, 62); roundLogo(LOGO.nc, 540, 1790, 58); }
  window.render = t => {
    const sc = sceneAt(t), u = seg(t, sc.t0, sc.t1);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.save(); sc.draw(t, u); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    if (sc.id !== 'cierre') { if (st.vignette !== false) vignette(); else if (!st.captionPill) bottomShade(); tint(t); clock(t, sc); for (const g of TAGS) drawTag(g, t, sc); }
    if (!window.NOCAP) logos(sc);
    const k = scenes.indexOf(sc); if (k > 0 && (!st.noFade || sc.id === 'cierre')) { const d = 1 - seg(t, sc.t0, sc.t0 + .12); if (d > 0) { ctx.fillStyle = `rgba(0,0,0,${d * .8})`; ctx.fillRect(0, 0, W, H); } }
    if (!window.NOCAP) caption(t);
  };
  window.DUR = END; window.EV = EV; window.T = T; window.READY = true;
}
export function roundLogo(im, x, y, r) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 14; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); if (im) { const s = Math.max(2 * r / im.width, 2 * r / im.height); ctx.drawImage(im, x - im.width * s / 2, y - im.height * s / 2, im.width * s, im.height * s); } else { ctx.fillStyle = '#1E8449'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  ctx.restore();
}
// cierre de marca: «Guarda este reel» + «Síguenos…» con los dos logos
function closing(t, u, LOGO, t0, o) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1f17'); g.addColorStop(1, '#06120d'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); glow(540, 820, 700, 'rgba(30,132,73,0.45)');
  const a = eo(seg(t, t0 + .1, t0 + .6));
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(232,245,238,0.8)'; ctx.font = '600 32px Mono'; ctx.fillText(o.kicker || 'GUARDA ESTE REEL', 540, 420);
  ctx.fillStyle = '#ffffff'; ctx.font = '900 92px Inter'; ctx.fillText(o.title1 || 'Compártelo', 540, 540); ctx.fillStyle = '#5ee08a'; ctx.fillText(o.title2 || 'con quien lo necesite', 540, 640);
  const b = eo(seg(t, t0 + 1.2, t0 + 1.7)); ctx.globalAlpha = b;
  const rows = [[LOGO.nc, 'Nutrición Consciente', 'Facebook'], [LOGO.orlando, 'Orlando Castañeda Nutrición', 'YouTube']];
  rows.forEach(([im, name, net], i) => { const y = 860 + i * 200, s = .9 + .1 * back(seg(t, t0 + 1.2 + i * .25, t0 + 1.7 + i * .25)); ctx.save(); ctx.translate(540, y); ctx.scale(s, s); ctx.translate(-540, -y);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; rr(110, y - 80, 860, 160, 80); ctx.fill(); roundLogo(im, 200, y, 62); ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '800 44px Inter'; let fs = 44; while (ctx.measureText(name).width > 640 && fs > 28) { fs -= 2; ctx.font = `800 ${fs}px Inter`; } ctx.fillText(name, 290, y - 4); ctx.fillStyle = 'rgba(232,245,238,0.7)'; ctx.font = '600 28px Mono'; ctx.fillText('en ' + net, 290, y + 42); ctx.restore(); });
  ctx.textAlign = 'center'; ctx.globalAlpha = b; ctx.fillStyle = 'rgba(232,245,238,0.85)'; ctx.font = '600 30px Mono'; ctx.fillText('ORLANDO CASTAÑEDA · NUTRICIONISTA ORTOMOLECULAR', 540, 1250);
  ctx.restore(); ctx.textAlign = 'left';
}

// cierre de El Código de los Mejores: negro, dorado, logo grande
function closingCodigo(t, u, LOGO, t0, o) {
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H); glow(540, 760, 760, 'rgba(190,140,60,0.30)');
  for (let i = 0; i < 70; i++) { const x = hash(i, 3) * W, y = (hash(i, 5) * H - t * 30 * (0.4 + hash(i, 7))) % H, a = 0.25 + 0.5 * hash(i, 9); ctx.fillStyle = `rgba(226,184,102,${a * 0.5})`; ctx.beginPath(); ctx.arc(x, (y + H) % H, 1.5 + hash(i, 11) * 2.5, 0, 7); ctx.fill(); }
  const a = eo(seg(t, t0 + .1, t0 + .7)), s = .85 + .15 * back(seg(t, t0 + .1, t0 + .8));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 740); ctx.scale(s, s); ctx.translate(-540, -740); roundLogo(LOGO.codigo, 540, 740, 300); ctx.restore();
  const b = eo(seg(t, t0 + .9, t0 + 1.4)); ctx.save(); ctx.globalAlpha = b; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(243,213,143,0.85)'; ctx.font = '600 34px Mono'; ctx.fillText(o.kicker || 'SÍGUENOS EN', 540, 1170);
  ctx.fillStyle = '#f3e3bf'; ctx.font = '900 76px Inter'; ctx.fillText(o.title1 || 'El Código', 540, 1270); ctx.fillStyle = '#e2b866'; ctx.fillText(o.title2 || 'de los Mejores', 540, 1360);
  ctx.fillStyle = 'rgba(243,227,191,0.7)'; ctx.font = '600 30px Mono'; ctx.fillText('YOUTUBE · FACEBOOK', 540, 1450);
  ctx.restore(); ctx.textAlign = 'left';
}
