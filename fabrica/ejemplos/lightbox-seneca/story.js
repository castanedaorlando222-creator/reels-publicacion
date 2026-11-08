// LIGHTBOX de ejemplo · El Código de los Mejores: «Las tres preguntas de Séneca» (De Ira III, 36).
// Una caja de papel recortado iluminada por detrás; la cámara avanza hacia la ventana donde Séneca escribe.
import { makeLightbox } from './lightbox.js';
export default function story(L, S) {
  const { T, wt } = S;
  const { ctx, seg, ss, lerp, glow } = L;
  const LB = makeLightbox(L);
  const LIGHT = [600, 640];
  // hojas de atrás hacia delante (cielo → montañas → villa → cipreses → casa del estudio → marco del arco)
  const sky = LB.sheet('#24346b', .5, c => LB.archFrame(c), c => { c.beginPath(); c.arc(600, 470, 92, 0, 7); c.fill(); LB.stars(c, 40, 900, 1); }, LIGHT);
  const far = LB.sheet('#6a86c2', .6, LB.ridge(980, 120, 190, 1), null, LIGHT);
  const villa = LB.sheet('#3f5a92', .45, c => { LB.ridge(1150, 70, 260, 3)(c); LB.temple(c, 160, 1055, 440, 260); }, c => { LB.columnsHoles(c, 160, 1060, 440, 220, 6); c.beginPath(); c.arc(380, 1025, 20, 0, 7); c.fill(); }, LIGHT);
  const WIN = []; for (let i = 0; i < 6; i++) WIN.push([160 + (440 / 6) * (i + .3), 1090, (440 / 6) * .38, 160]);
  const trees = LB.sheet('#1d2b5c', .18, c => { LB.ridge(1330, 50, 220, 5)(c); for (const [x, h] of [[120, 520], [210, 380], [985, 400]]) LB.cypress(c, x, 1360, h); }, null, LIGHT);
  const ST = [760, 1270];
  const study = LB.sheet('#14204a', .12, c => { c.fillRect(610, 1190, 320, 420); c.beginPath(); c.moveTo(590, 1195); c.lineTo(770, 1100); c.lineTo(950, 1195); c.closePath(); c.fill(); },
    c => { c.beginPath(); c.moveTo(ST[0] - 85, ST[1] + 110); c.lineTo(ST[0] - 85, ST[1] - 40); c.arc(ST[0], ST[1] - 40, 85, Math.PI, 0); c.lineTo(ST[0] + 85, ST[1] + 110); c.closePath(); c.fill(); }, LIGHT);
  const front = LB.sheet('#0b1030', .05, c => LB.archFrame(c), c => LB.archHole(c), LIGHT);
  const LAY = [[sky, 1, 0], [far, .92, .4], [villa, .84, .8], [trees, .74, 1.2], [study, .7, 1.4], [front, .55, 1.6]];
  // silueta articulada de Séneca (solo rota el brazo que escribe)
  function seneca(x, y, t) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#070a1c'; ctx.beginPath(); ctx.arc(-6, -118, 22, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(10, -122); ctx.lineTo(24, -110); ctx.lineTo(12, -104); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-30, -96); ctx.quadraticCurveTo(-40, -30, -50, 40); ctx.lineTo(40, 40); ctx.quadraticCurveTo(30, -40, 14, -96); ctx.closePath(); ctx.fill(); ctx.fillRect(30, 0, 90, 10); ctx.fillRect(100, 10, 8, 32);
    const a = -.35 + .12 * Math.sin(t * 5.5) * Math.sin(t * 2.1); ctx.save(); ctx.translate(6, -80); ctx.rotate(a); ctx.fillRect(0, -8, 62, 15); ctx.translate(60, 0); ctx.rotate(.9 + .1 * Math.sin(t * 9)); ctx.fillRect(0, -6, 44, 12); ctx.fillRect(40, -1, 22, 3); ctx.restore();
    ctx.beginPath(); ctx.ellipse(110, -6, 16, 6, 0, 0, 7); ctx.fill(); ctx.fillRect(122, -10, 8, 5); ctx.restore(); }
  const tLamp = wt('l1', 'lámpara');
  // qué ventanas de la villa arden: dos por cada pregunta
  const qT = [wt('l5', 'defecto'), wt('l6', 'vicio'), wt('l7', 'mejor')];
  function box(t, dz, focus, opts = {}) {
    LB.stack(t, LAY, { on: tLamp, dz, focus, extra: (i, lit, fl) => {
      if (i === 0) { const lm = ss(seg(t, .2, tLamp + .3)); LB.burn(600, 470, 92, lm, fl); ctx.fillStyle = `rgba(255,236,190,${.25 + .75 * lm})`; ctx.beginPath(); ctx.arc(600, 470, 92, 0, 7); ctx.fill(); }
      if (i === 2) WIN.forEach(([x, y, w, h], k) => { const p = opts.q ? ss(seg(t, qT[Math.floor(k / 2)], qT[Math.floor(k / 2)] + .4)) : ss(seg(t, tLamp + 1 + k * .17, tLamp + 1.3 + k * .17)) * (opts.dimWin ?? 1); LB.windowLight(x, y, w, h, p, fl); });
      if (i === 4) { const p = ss(seg(t, tLamp + .3, tLamp + .8)); ctx.save(); ctx.beginPath(); ctx.moveTo(ST[0] - 85, ST[1] + 110); ctx.lineTo(ST[0] - 85, ST[1] - 40); ctx.arc(ST[0], ST[1] - 40, 85, Math.PI, 0); ctx.lineTo(ST[0] + 85, ST[1] + 110); ctx.closePath(); ctx.clip();
        const g = ctx.createRadialGradient(ST[0] + 40, ST[1] + 40, 10, ST[0], ST[1], 200); g.addColorStop(0, `rgba(255,214,140,${p})`); g.addColorStop(1, `rgba(220,120,50,${p * .8})`); ctx.fillStyle = g; ctx.fillRect(ST[0] - 100, ST[1] - 140, 200, 260); if (p > 0) seneca(ST[0] - 45, ST[1] + 100, t); ctx.restore();
        LB.burn(ST[0], ST[1], 90, p, fl); }
    } });
  }
  const scenes = [
    { from: 'l1', draw: (t, u) => box(t, ss(u) * .3, [700, 1150]) },
    { from: 'l3', draw: (t, u) => box(t, .3 + ss(u) * .7, [760, 1250]) },
    { from: 'l5', draw: (t, u) => { box(t, .15, [400, 1100], { q: true }); const k = t < qT[1] ? 'I' : t < qT[2] ? 'II' : 'III'; LB.seal('PREGUNTA ' + k, seg(t, qT[0] - .2, qT[0] + .3), 300); } },
    { from: 'l8', draw: (t, u) => { box(t, ss(u) * .2, [540, 960]); LB.seal('SÉNECA · DE IRA, III 36', seg(t, T.l8 + .2, T.l8 + .7), 300); } },
    { from: 'l9', draw: (t, u) => box(t, .2 + ss(u) * .5, [760, 1250]) },
  ];
  return { scenes, tags: [], red: [], cierreFrom: 'l10', marca: 'codigo', vignette: false, captionStyle: 'papel' };
}
