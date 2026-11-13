// Utilidades «rayos X negro y dorado» para el Código de los Mejores (sobre explicador.js + v2.js)
import { makeExplicador } from './explicador.js';
import { makeV2 } from './v2.js';
export function makeOro(L) {
  const { ctx, W, H, seg, eo, lerp, hash, clamp, ss } = L;
  const X = makeExplicador(L), V = makeV2(L);
  const G = { gold: '#ffd34f', gold2: '#ffe9a8', amber: '#ff9a3c', red: '#ff3b55', green: '#5ef0a0', white: '#fff6dc', dim: '#8a6a22' };
  const TAU = Math.PI * 2;
  function bg(t, { tint = '#3a2806', cx = 540, cy = 980 } = {}) {
    const g = ctx.createRadialGradient(cx, cy, 80, cx, cy, 1300); g.addColorStop(0, tint); g.addColorStop(1, '#040301'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,200,90,.05)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let i = 0; i < 40; i++) { const x = hash(i, 1) * W + Math.sin(t * .3 + i) * 30, y = (hash(i, 2) * H - t * (8 + hash(i, 3) * 22) + H * 3) % H, r = 2 + hash(i, 4) * 6; ctx.fillStyle = `rgba(255,205,100,${.05 + hash(i, 5) * .13})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  }
  const P = (f) => { const p = new Path2D(); f(p); return p; };
  const circ = (x, y, r) => P(p => p.arc(x, y, r, 0, TAU));
  const ln = (a, b, c, d) => P(p => { p.moveTo(a, b); p.lineTo(c, d); });
  // cabeza de perfil (mira a la derecha), escala s, centro cx,cy
  function head(cx, cy, s, col = G.gold, a = 1) {
    const X_ = x => cx + x * s, Y_ = y => cy + y * s; const p = new Path2D();
    p.moveTo(X_(-190), Y_(480)); p.bezierCurveTo(X_(-270), Y_(200), X_(-260), Y_(-200), X_(-120), Y_(-330)); p.bezierCurveTo(X_(0), Y_(-440), X_(200), Y_(-420), X_(270), Y_(-250)); p.bezierCurveTo(X_(300), Y_(-170), X_(290), Y_(-100), X_(335), Y_(-10)); p.lineTo(X_(300), Y_(15)); p.bezierCurveTo(X_(312), Y_(45), X_(290), Y_(65), X_(280), Y_(75)); p.bezierCurveTo(X_(300), Y_(105), X_(270), Y_(150), X_(235), Y_(160)); p.bezierCurveTo(X_(245), Y_(205), X_(205), Y_(265), X_(125), Y_(275)); p.bezierCurveTo(X_(105), Y_(330), X_(125), Y_(400), X_(135), Y_(480));
    ctx.save(); ctx.globalAlpha = a * .5; ctx.fillStyle = 'rgba(255,200,80,.07)'; ctx.fill(p); ctx.restore(); V.line(p, col, 8, a); return p;
  }
  function toggle(x, y, on, s = 1, labelOn = 'SUELTA', labelOff = 'ACTÚA') {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const w = 520, h = 250; const col = on > .5 ? G.green : G.red;
    ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.fillStyle = on > .5 ? 'rgba(94,240,160,.28)' : 'rgba(255,59,85,.25)'; L.rr(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(lerp(-w / 2 + h / 2, w / 2 - h / 2, on), 0, h / 2 - 20, 0, TAU); ctx.fill(); ctx.restore();
  }
  function phone(x, y, s, t, scroll = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const p = new Path2D(); L.rr(-230, -420, 460, 840, 60); p.addPath(new Path2D()); ctx.beginPath(); L.rr(-230, -420, 460, 840, 60); ctx.fillStyle = 'rgba(255,200,80,.07)'; ctx.fill(); ctx.strokeStyle = G.gold; ctx.shadowColor = G.gold; ctx.shadowBlur = 30; ctx.lineWidth = 9; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.save(); ctx.beginPath(); L.rr(-200, -380, 400, 760, 38); ctx.clip();
    for (let i = 0; i < 6; i++) { const yy = -360 + ((i * 220 + t * 260 * scroll) % 1320) - 0; const y2 = ((yy + 400) % 1320) - 400 + 0; ctx.fillStyle = `rgba(255,211,79,${.1 + .1 * (i % 2)})`; L.rr(-180, y2, 360, 180, 24); ctx.fill(); ctx.strokeStyle = 'rgba(255,233,168,.6)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = G.gold2; ctx.beginPath(); ctx.arc(-130, y2 + 90, 36, 0, TAU); ctx.fill(); }
    ctx.restore(); ctx.restore();
  }
  function neuron(cx, cy, r, t, glowK = 1) {
    for (let i = 0; i < 9; i++) { const an = i / 9 * TAU + .3, l = r * (.9 + hash(i, 3) * .6); const p = new Path2D(); p.moveTo(cx, cy); p.quadraticCurveTo(cx + Math.cos(an + .3) * l * .5, cy + Math.sin(an + .3) * l * .5, cx + Math.cos(an) * l, cy + Math.sin(an) * l); V.line(p, G.gold, 6, .85);
      const k = ((t * .9 + i * .37) % 1) * glowK; const px = cx + Math.cos(an) * l * k, py = cy + Math.sin(an) * l * k; ctx.fillStyle = '#fff'; ctx.shadowColor = G.gold; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(px, py, 11, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
    ctx.save(); ctx.shadowColor = G.gold; ctx.shadowBlur = 50; ctx.fillStyle = 'rgba(255,211,79,.35)'; ctx.beginPath(); ctx.arc(cx, cy, r * .42, 0, TAU); ctx.fill(); ctx.restore(); V.line(circ(cx, cy, r * .42), G.gold2, 8);
  }
  function loopArrow(cx, cy, r, t, col = G.red) { const a0 = t * 1.6, p = new Path2D(); p.arc(cx, cy, r, a0, a0 + TAU * .78); V.line(p, col, 18); const ae = a0 + TAU * .78, ex = cx + Math.cos(ae) * r, ey = cy + Math.sin(ae) * r; const h = new Path2D(); h.moveTo(ex + Math.cos(ae + 1.9) * 70, ey + Math.sin(ae + 1.9) * 70); h.lineTo(ex, ey); h.lineTo(ex + Math.cos(ae - 1.0 + 1.57) * 70, ey + Math.sin(ae - 1.0 + 1.57) * 70); V.line(h, col, 18); }
  const curve = (pts, box, p, col, w = 10) => X.graph(pts, box, p, col, w);
  // envoltura de planos: zoom de entrada, empuje de salida, bloom, viñeta y destello
  function build(shots, tEnd) {
    shots.forEach((s, i) => s.end = i + 1 < shots.length ? shots[i + 1].at : tEnd);
    return shots.map(s => ({ at: s.at, draw: t => {
      const k = 1 - eo(seg(t, s.at, s.at + .34)), x = Math.pow(seg(t, s.end - .13, s.end), 2), z = 1 + (s.zin ?? .2) * k + .14 * x;
      const tf = () => { ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000); };
      ctx.save(); tf(); s.draw(t); ctx.restore(); V.bloom(s.bloom ?? .5); V.vign();
      if (s.ui) { ctx.save(); tf(); ctx.globalAlpha = 1 - x; s.ui(t); ctx.restore(); }
      if (s.at > 0 && k > 0) { ctx.fillStyle = `rgba(255,225,160,${k * k * .28})`; ctx.fillRect(0, 0, W, H); } } }));
  }
  return { X, V, G, bg, P, circ, ln, head, toggle, phone, neuron, loopArrow, curve, build, TAU };
}
