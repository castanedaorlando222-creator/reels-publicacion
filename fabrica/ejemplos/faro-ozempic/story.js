// HISTORIA de ejemplo: «Ozempic y péptidos: ¿beneficio o peligro?» — modelo para cada reel nuevo.
// story(L, S) recibe la biblioteca L (lib.js) y S = {T, D, wt, END}: T[id] = inicio de la frase, D(id) = duración, wt(id, palabra) = momento de esa palabra.
// Devuelve: personaje, escenas (cada una empieza en la frase `from`), etiquetas, tramos en rojo y la frase donde empieza el cierre de marca.
export default function story(L, S) {
  const { T, D, wt } = S;
  const { ctx, seg, ss, eo, lerp, rr } = L;
  const laura = { skin: '#a8714f', skinD: '#8a5a3e', hair: '#2a1a14', top: '#e3a92b', topD: '#b9831b', hairStyle: 'long' };

  const scenes = [
    { from: 'l1', clock: '11:40 PM', draw(t, u) {
      ctx.save(); L.cam(u, 1, 1.06, 540, 900); L.kitchen(t); L.mug(885, 900, t); L.person(330, 700, 1, 'phone', t, laura); ctx.restore();
      L.phoneCard(800, 760, eo(seg(t, T.l1 + 1.8, T.l1 + 2.4)), { user: '@vecina_fit', before: 'ANTES', after: 'AHORA', big: '−15 KG', small: 'en 3 meses ✨ #secreto' });
    } },
    { from: 'l3', clock: '11:52 PM', draw(t, u) {
      L.sky('#0b1430', '#121f44'); ctx.save(); L.cam(u, 1.04, 1, 540, 800);
      L.person(540, 470, .9, 'stand', t, laura); L.desk(880);
      L.laptop(540, 880, t, (w, h) => {
        ctx.fillStyle = '#d9534f'; ctx.fillRect(0, 0, w, 44); ctx.fillStyle = '#fff'; ctx.font = '700 22px Inter'; ctx.fillText('MEGAFARMA ONLINE · ENVÍO 24 H', 20, 30);
        for (let i = 0; i < 2; i++) { const x = 20 + i * 245, y = 60; ctx.fillStyle = '#fff'; rr(x, y, 225, 260, 10); ctx.fill(); ctx.strokeStyle = '#d6dbe6'; ctx.lineWidth = 2; ctx.stroke();
          if (i === 0) L.pen(x + 112, y + 95, .42, -.5, '#1f7fb6'); else L.vial(x + 112, y + 100, .5, t);
          ctx.fillStyle = '#20232c'; ctx.font = '700 20px Inter'; ctx.fillText(i ? 'Péptido "research"' : 'Pluma 1 mg', x + 14, y + 200);
          ctx.fillStyle = '#d9534f'; ctx.font = '800 24px Inter'; ctx.fillText(i ? '$49' : '$189', x + 14, y + 236);
          L.checkBadge(x + 190, y + 225, seg(t, T.l3 + (i ? 4.4 : 3.0), T.l3 + (i ? 4.7 : 3.3))); }
        L.cursor(lerp(410, 400, ss(seg(t, T.l3 + 2.2, T.l3 + 4.2))), lerp(240, 290, ss(seg(t, T.l3 + 2.2, T.l3 + 4.2))));
      });
      ctx.restore();
    } },
    { from: 'l4', clock: '11:58 PM', draw(t, u) {
      L.sky('#0a1430', '#0f1d40'); ctx.save(); L.cam(u, 1, 1.08, 540, 700); L.spotlightTable(540, 860); L.pen(540, 690, 1.25, -.42, '#1f7fb6', '1 mg'); L.dashedRing(540, 690, 330, t); ctx.restore();
    } },
    { from: 'l5', clock: '12:05 AM', draw(t, u) {
      L.sky('#0b1430', '#132147'); L.glow(540, 720, 600, 'rgba(90,160,255,0.16)'); ctx.save(); L.cam(u, 1, 1.05, 540, 760);
      const n = seg(t, wt('l5', 'náuseas') - .2, wt('l5', 'náuseas') + .3), p = seg(t, wt('l5', 'páncreas') - .1, wt('l5', 'páncreas') + .3), v = seg(t, wt('l5', 'vesícula') - .1, wt('l5', 'vesícula') + .3);
      L.bodyDiagram(t, { higado: .25, estomago: Math.max(.25, n), pancreas: Math.max(.2, p), vesicula: Math.max(.2, v), intestino: .25 }, { pancreas: p > 0, vesicula: v > 0 });
      L.leader([680, 725], [715, 712], p); L.leader([470, 690], [715, 912], v);
      ctx.restore();
    } },
    { from: 'l6', clock: '12:12 AM', draw(t, u) {
      L.sky('#0c1532', '#152450'); L.bathroomTiles(); ctx.save(); L.cam(u, 1.06, 1, 540, 700);
      const a = seg(t, T.l6 + .2, wt('l6', 'músculo')), b = seg(t, wt('l6', 'dejarlo'), T.l6 + D('l6'));
      L.scale(540, 700, t, 84 - 15 * ss(a) + 10 * ss(b), b > 0 ? '#ff6b6b' : '#7dffb0', laura); ctx.restore();
      L.chart(140, 1060, 800, 150, seg(t, T.l6 + .3, T.l6 + D('l6') + .2), u2 => u2 < .55 ? 1 - ss(u2 / .55) : ss((u2 - .55) / .45) * .67, { title: 'PESO', split: .55, mark: 'LO DEJA' });
    } },
    { from: 'l7', clock: '12:20 AM', draw(t, u) {
      L.sky('#0b1229', '#140f2e'); L.glow(540, 680, 560, 'rgba(200,120,255,0.16)'); ctx.save(); L.cam(u, 1, 1.1, 540, 680);
      ctx.fillStyle = '#0a0f24'; ctx.beginPath(); ctx.ellipse(540, 960, 300, 50, 0, 0, 7); ctx.fill(); L.vial(540, 700, 2.2, t, 'RESEARCH ONLY'); ctx.restore();
    } },
    { from: 'l8', clock: '12:31 AM', draw(t, u) {
      L.sky('#070f24', '#0f1d40'); ctx.save(); L.cam(u, 1.08, 1, 540, 800);
      L.windowView(t, 160, 240, 760, 820); ctx.fillStyle = '#0e1a3a'; ctx.fillRect(0, 1060, 1080, 860); L.person(540, 760, 1.15, 'back', t, laura); ctx.restore();
      L.checklist(150, 1030, 780, t, T.l8 + .2, 'PLAN DE LAURA', [['Pluma comprada', 1], ['Péptidos en camino', 1], ['Dieta "rápida"', 1], ['¿Preguntar a un médico?', 0]], wt('l8', 'olvidó'));
    } },
  ];
  const tags = [
    [T.l1 + .5, 330, 470, 'LAURA · 38', 'y'], [T.l1 + 1.0, 330, 520, 'SIN DIABETES', 'w', 22], [wt('l2', 'Ozempic'), 720, 430, 'OZEMPIC', 'y', 34],
    [T.l3 + .3, 140, 300, 'COMPRA ONLINE', 'r', 26],
    [wt('l4', 'semaglutida'), 120, 360, 'SEMAGLUTIDA', 'y', 34], [wt('l4', 'diabetes'), 120, 1000, 'DIABETES TIPO 2', 'w', 26], [wt('l4', 'obesidad'), 560, 1000, 'OBESIDAD', 'w', 26], [wt('l4', 'receta'), 230, 1070, '✓ CON RECETA Y CONTROL MÉDICO', 'g', 26],
    [wt('l5', 'náuseas'), 90, 420, 'NÁUSEAS', 'y', 28], [wt('l5', 'vómitos'), 90, 480, 'VÓMITOS', 'y', 28], [wt('l5', 'diarrea'), 90, 540, 'DIARREA', 'y', 28], [wt('l5', 'páncreas'), 720, 700, 'PÁNCREAS', 'r', 28], [wt('l5', 'vesícula'), 720, 900, 'VESÍCULA', 'r', 28],
    [wt('l6', 'músculo'), 120, 330, '− MÚSCULO', 'r', 30], [wt('l6', '2/3') - .1, 620, 330, '2/3 DE VUELTA', 'r', 30],
    [T.l7 + .2, 300, 330, 'SIN APROBAR', 'r', 32], [wt('l7', 'garantiza'), 600, 1040, 'CONTENIDO: ???', 'w', 28],
  ];
  const red = [[T.l3, T.l4 - .1], [wt('l5', 'casos'), T.l6 - .1], [wt('l7', 'Muchos'), T.l8 - .1], [wt('l8', 'olvidó'), T.l9 - .1]];
  return { scenes, tags, red, cierreFrom: 'l9' };
}
