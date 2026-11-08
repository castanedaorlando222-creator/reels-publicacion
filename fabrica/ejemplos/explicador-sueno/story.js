// EXPLICADOR de ejemplo · Nutrición: «¿Por qué te da sueño después de comer?». Rayos X brillantes, un protagonista grande por plano.
import { makeExplicador } from './explicador.js';
export default function story(L, S) {
  const { T, wt } = S;
  const { ctx, seg, ss, eo, lerp } = L;
  const X = makeExplicador(L); const C = X.C;
  const zz = (t, x, y, k) => { for (let i = 0; i < 3; i++) { const p = ((t * .6 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); ctx.font = `900 ${60 + i * 16}px Inter`; ctx.fillStyle = '#cfe6ff'; ctx.shadowColor = C.violet; ctx.shadowBlur = 20; ctx.fillText('Z', x + p * 120 * k, y - p * 220); ctx.restore(); } };
  const scenes = [
    // 1. Gancho: cuerpo entero en rayos X, el cerebro se apaga y salen las Z
    { from: 'l1', draw: (t, u) => { X.bg(t); X.push(u, 1, 1.06, 540, 900, () => {
      const b = X.bodyFront(540, 470, .82); ctx.fillStyle = 'rgba(70,140,255,.13)'; ctx.fill(b); X.skeletonFront(540, 470, .82, .7); X.neon(b, C.line, 4);
      const dim = ss(seg(t, wt('l1', 'sueño'), wt('l1', 'sueño') + .8)); X.brain(540, 556, 62, t, 1, dim > .5 ? '#a98bd8' : '#ff8fd0', '#4a2a7a', 1 - dim); });
      zz(t, 640, 470, 1); X.pill('NO ES FLOJERA', 540, 1520, seg(t, wt('l1', 'flojera.') - .2, wt('l1', 'flojera.') + .2), { col: C.gold, size: 44 }); } },
    // 2. Estómago grande: la comida cae y se mezcla
    { from: 'l2', draw: (t, u) => { X.bg(t, { tint: '#1a2f6e' }); X.flashIn(t, T.l2); X.push(u, 1.04, 1, 540, 1000, () => {
      const eso = new Path2D(); eso.moveTo(470, 300); eso.bezierCurveTo(470, 520, 470, 640, 500, 760); X.neon(eso, C.line, 10);
      const st = X.stomachPath(560, 1000, 2.2); X.organ(st, '#ffb36b', '#b2421c', 560, 1000, 380, 1, .5 + .5 * Math.sin(t * 3)); X.neon(st, '#ffd9a8', 4);
      ctx.save(); ctx.clip(st); for (let i = 0; i < 40; i++) { const a = t * 1.2 + i, r = 60 + (i * 37) % 220; ctx.fillStyle = ['#ffe08a', '#ffffff', '#9fe870'][i % 3]; ctx.globalAlpha = .75; ctx.beginPath(); ctx.arc(560 + Math.cos(a) * r, 1020 + Math.sin(a * 1.3) * r * .55, 12, 0, 7); ctx.fill(); } ctx.restore();
      for (let i = 0; i < 5; i++) { const p = ((t - T.l2) * .9 + i / 5) % 1; ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); ctx.fillStyle = ['#ffe08a', '#9fe870', '#ffffff'][i % 3]; ctx.shadowColor = '#ffd34f'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(lerp(470, 500, p), lerp(300, 760, p), 16, 0, 7); ctx.fill(); ctx.restore(); } });
      X.pill('DIGESTIÓN', 540, 1560, seg(t, wt('l2', 'digestión.') - .2, wt('l2', 'digestión.') + .2), { col: C.orange }); } },
    // 3. Vaso sanguíneo enorme: la glucosa (puntos dorados) se multiplica; tres alimentos arriba
    { from: 'l3', draw: (t, u) => { X.bg(t, { top: '#3a0f2e', bot: '#0b0614' }); X.flashIn(t, T.l3);
      const g = ss(seg(t, wt('l3', 'glucosa'), wt('l3', 'glucosa') + 1.4)); X.push(u, 1, 1.05, 540, 1050, () => X.vessel(t, 1060, 520, { glucose: .15 + g * .85 }));
      [['PAN', 'pan,'], ['ARROZ BLANCO', 'arroz'], ['AZÚCAR', 'azúcar,']].forEach(([s, w], i) => X.pill(s, [230, 560, 870][i], 690, seg(t, wt('l3', w) - .1, wt('l3', w) + .3), { col: C.gold, size: 34 }));
      X.ring(880, 1430, 130, .2 + g * .75, g > .6 ? '↑↑' : '↑', 'GLUCOSA', C.red); } },
    // 4. Páncreas grande soltando insulina (azul) que barre la glucosa
    { from: 'l4', draw: (t, u) => { X.bg(t, { tint: '#173a6e' }); X.flashIn(t, T.l4);
      const ins = ss(seg(t, wt('l4', 'insulina'), wt('l4', 'insulina') + 1.2));
      X.vessel(t, 1350, 380, { glucose: 1 - ins * .7, insulin: ins });
      X.push(u, 1.05, 1, 540, 800, () => { const pc = X.pancreasPath(540, 820, 1.9); X.organ(pc, '#ffd98a', '#c46a2a', 540, 820, 380, 1, ins); ctx.save(); ctx.clip(pc); for (let i = 0; i < 70; i++) { const x = 100 + (i * 97) % 880, y = 700 + (i * 53) % 240; ctx.fillStyle = 'rgba(255,240,200,.18)'; ctx.beginPath(); ctx.arc(x, y, 18 + (i % 4) * 4, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(120,50,10,.25)'; ctx.lineWidth = 2; ctx.stroke(); } ctx.restore(); X.neon(pc, '#fff0c8', 4);
        for (let i = 0; i < 22; i++) { const p = ((t * .8 + i / 22) % 1) * ins; const x0 = 300 + (i * 53) % 500; ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI) * ins; ctx.fillStyle = C.cyan; ctx.shadowColor = C.cyan; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(x0, lerp(880, 1250, p), 9, 0, 7); ctx.fill(); ctx.restore(); } });
      X.pill('INSULINA', 540, 560, seg(t, wt('l4', 'insulina') - .1, wt('l4', 'insulina') + .3), { col: C.cyan, size: 44 }); } },
    // 5. Gráfica de neón: pico y bajón; la pila de energía se vacía
    { from: 'l5', draw: (t, u) => { X.bg(t); X.flashIn(t, T.l5); const box = [120, 640, 840, 620]; X.axes(box);
      const pts = []; for (let i = 0; i <= 60; i++) { const x = i / 60; pts.push([x, .25 + .65 * Math.exp(-((x - .35) ** 2) / .012) - .18 * Math.exp(-((x - .7) ** 2) / .02)]); }
      X.graph(pts, box, .05 + .95 * ss(seg(t, T.l5, T.l5 + 2.0)), C.gold, 8);
      X.pill('PICO', 120 + .35 * 840, 600, seg(t, wt('l5', 'sube'), wt('l5', 'sube') + .3), { col: C.gold }); X.pill('BAJÓN', 120 + .7 * 840, 1150, seg(t, wt('l5', 'baja'), wt('l5', 'baja') + .3), { col: C.red });
      const e = 1 - ss(seg(t, wt('l5', 'energía.') - .3, wt('l5', 'energía.') + .6)); ctx.save(); ctx.translate(540, 1500); ctx.scale(1.5, 1.5); ctx.fillStyle = 'rgba(8,16,40,.9)'; L.rr(-160, -70, 300, 140, 22); ctx.fill(); X.neon((() => { const p = new Path2D(); p.roundRect(-160, -70, 300, 140, 22); return p; })(), '#cfe6ff', 4); ctx.fillStyle = '#cfe6ff'; ctx.fillRect(140, -28, 22, 56);
      for (let i = 0; i < 5; i++) { const on = i < Math.ceil(e * 5); ctx.fillStyle = on ? (e > .4 ? C.green : C.red) : 'rgba(255,255,255,.08)'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = on ? 14 : 0; ctx.fillRect(-140 + i * 56, -50, 44, 100); } ctx.shadowBlur = 0; ctx.fillStyle = '#0a1430'; const blink = (t % 2.4) < .12 ? .15 : 1; for (const ex of [-50, 30]) { ctx.beginPath(); ctx.ellipse(ex, -12, 16, 18 * blink * (e > .4 ? 1 : .55), 0, 0, 7); ctx.fill(); } ctx.strokeStyle = '#0a1430'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); if (e > .4) ctx.arc(-10, 18, 26, .2, Math.PI - .2); else ctx.arc(-10, 48, 26, Math.PI + .3, -.3); ctx.stroke(); ctx.restore(); } },
    // 6. Reloj enorme: la franja de primera hora de la tarde se enciende
    { from: 'l6', draw: (t, u) => { X.bg(t, { tint: '#22225e' }); X.flashIn(t, T.l6); const p = ss(seg(t, wt('l6', 'tarde.') - .8, wt('l6', 'tarde.') + .2));
      X.push(u, 1, 1.06, 540, 1000, () => X.clockFace(540, 1000, 360, 13, Math.floor(lerp(0, 50, ss(u))), [1, 1 + 2 * p, C.violet]));
      X.pill('BAJADA NATURAL DE ALERTA', 540, 1480, seg(t, wt('l6', 'alerta') - .1, wt('l6', 'alerta') + .3), { col: C.violet, size: 36 }); } },
    // 7. Plato grande visto desde arriba: medio de verduras, un cuarto de proteína, un cuarto de carbohidrato
    { from: 'l7', draw: (t, u) => { X.bg(t, { top: '#0e3b3a', bot: '#03140f' }); X.flashIn(t, T.l7);
      X.push(u, 1.06, 1, 540, 1000, () => X.plate(540, 1000, 380, [{ f: .5, col: '#2fae5b', dot: 'rgba(170,255,170,.5)' }, { f: .25, col: '#c9714a', dot: 'rgba(255,200,170,.4)' }, { f: .25, col: '#e8d7a6', dot: 'rgba(255,255,255,.4)' }], ss(seg(t, T.l7 + .3, T.l7 + 2.4))));
      X.pill('½ VERDURAS', 540, 560, seg(t, wt('l7', 'verduras') - .1, wt('l7', 'verduras') + .3), { col: C.green, size: 40 }); X.pill('PROTEÍNA', 300, 1460, seg(t, wt('l7', 'proteína.') - .1, wt('l7', 'proteína.') + .3), { col: C.orange }); } },
    // 8. Esqueleto caminando + contador
    { from: 'l8', draw: (t, u) => { X.bg(t); X.flashIn(t, T.l8); X.walker(520, 1500, 1.15, t);
      X.ring(860, 640, 120, ss(seg(t, wt('l8', 'cinco') - .5, wt('l8', 'cinco') + .3)), '2–5', 'MINUTOS', C.green); } },
    // 9. Comparación: sentado vs caminando
    { from: 'l9', draw: (t, u) => { X.bg(t, { tint: '#0f3b4a' }); X.flashIn(t, T.l9); const box = [120, 700, 840, 560]; X.axes(box);
      const A = [], B = []; for (let i = 0; i <= 50; i++) { const x = i / 50; A.push([x, .2 + .7 * Math.exp(-((x - .35) ** 2) / .015)]); B.push([x, .2 + .38 * Math.exp(-((x - .38) ** 2) / .02)]); }
      const p = .05 + .95 * ss(seg(t, T.l9 + .2, T.l9 + 2.2)); X.graph(A, box, p, C.red, 6); X.graph(B, box, p, C.green, 8);
      X.pill('SENTADO', 380, 660, seg(t, T.l9 + .6, T.l9 + 1), { col: C.red, size: 32 }); X.pill('CAMINANDO', 760, 1080, seg(t, wt('l9', 'baja') - .2, wt('l9', 'baja') + .2), { col: C.green, size: 32 });
      X.big('7 ESTUDIOS', 540, 1460, 92, '#ffffff', seg(t, wt('l9', 'siete') - .1, wt('l9', 'siete') + .3)); } },
  ];
  return { scenes, tags: [], red: [], cierreFrom: 'l10', vignette: false, captionStyle: 'karaoke', captionY: 420 };
}
