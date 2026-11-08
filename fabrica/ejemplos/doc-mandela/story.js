// El Código de los Mejores · historia negro y dorado: «Mandela: 27 años en una celda»
export default function story(L, S) {
  const { T, D, wt } = S;
  const { ctx, seg, ss, eo, lerp, rr, glow, W, H, hash, back } = L;
  const GOLD = '#e2b866', GOLD2 = '#f3d58f', INK = '#0b0906', STONE = '#2b251d';
  const mandela = { skin: '#5a3a28', skinD: '#47291c', hair: '#1c1c1c', top: '#8f8571', topD: '#73694f', inner: '#8f8571', pants: '#6f6650', pantsD: '#5d5541', hairStyle: 'short' };
  const dark = (a = '#0d0a07', b = '#1a140d') => L.sky(a, b);
  const grain = t => { for (let i = 0; i < 160; i++) { const x = hash(i, Math.floor(t * 24)) * W, y = hash(i + 7, Math.floor(t * 24)) * H; ctx.fillStyle = `rgba(255,230,180,${0.03 + 0.05 * hash(i, 3)})`; ctx.fillRect(x, y, 2, 2); } };
  const dust = (t, x0, y0, w, h) => { for (let i = 0; i < 40; i++) { const x = x0 + ((hash(i, 1) * w + t * 12 * (0.3 + hash(i, 2))) % w), y = y0 + ((hash(i, 4) * h + Math.sin(t + i) * 20) % h); ctx.fillStyle = `rgba(243,213,143,${0.15 + 0.35 * hash(i, 6)})`; ctx.beginPath(); ctx.arc(x, y, 1.2 + 2 * hash(i, 8), 0, 7); ctx.fill(); } };
  // ventana con barrotes y haz de luz
  function barredWindow(t, x, y, w, h) {
    ctx.save(); const g = ctx.createLinearGradient(x, y, x + 260, y + 1100); g.addColorStop(0, 'rgba(243,213,143,0.28)'); g.addColorStop(1, 'rgba(243,213,143,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w + 380, y + 1150); ctx.lineTo(x + 160, y + 1150); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f6e2b2'; ctx.fillRect(x, y, w, h); glow(x + w / 2, y + h / 2, 260, 'rgba(243,213,143,0.5)');
    ctx.fillStyle = '#16110b'; for (let i = 1; i < 5; i++) ctx.fillRect(x + i * w / 5 - 7, y, 14, h); ctx.fillRect(x, y + h / 2 - 6, w, 12);
    ctx.strokeStyle = '#16110b'; ctx.lineWidth = 18; ctx.strokeRect(x, y, w, h); ctx.restore();
  }
  function stoneWall() { ctx.fillStyle = STONE; ctx.fillRect(-W, -H, 3 * W, 3 * H); ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3; for (let r = 0; r < 26; r++) { const y = r * 80; ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); for (let c = 0; c < 9; c++) { const x = c * 160 + (r % 2) * 80; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 80); ctx.stroke(); } } }
  function vignetteGold() { const g = ctx.createRadialGradient(540, 820, 300, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }

  const scenes = [
    { from: 'l1', clock: 'PRISIONERO 466/64', draw(t, u) {
      ctx.save(); L.cam(u, 1.08, 1.0, 540, 860); stoneWall(); barredWindow(t, 590, 260, 300, 260); ctx.fillStyle = '#120e09'; ctx.fillRect(-W, 1150, 3 * W, H);
      dust(t, 300, 260, 700, 900); L.person(470, 640, 1.05, 'back', t, mandela); ctx.restore(); vignetteGold(); grain(t);
      const c = eo(seg(t, T.l1 + .4, T.l1 + 1.2)); if (c > 0) { ctx.save(); ctx.globalAlpha = c; ctx.textAlign = 'center'; ctx.fillStyle = GOLD; ctx.font = '900 210px Inter'; ctx.fillText('27', 540, 1130 - 20 * (1 - c)); ctx.font = '600 40px Mono'; ctx.fillStyle = GOLD2; ctx.fillText('AÑOS', 540, 1190); ctx.restore(); ctx.textAlign = 'left'; }
    } },
    { from: 'l2', clock: '1964', draw(t, u) {
      dark('#06080a', '#0d1114'); const a = seg(t, T.l2, T.l2 + 2.6), b = seg(t, wt('l2', 'celda') - .2, wt('l2', 'celda') + .6);
      ctx.save(); L.cam(u, 1, 1.12, 540, 760);
      // mar con líneas y la isla en dorado
      ctx.strokeStyle = 'rgba(226,184,102,0.12)'; ctx.lineWidth = 2; for (let i = 0; i < 26; i++) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 300 + i * 36 + Math.sin(x / 70 + t + i) * 5; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.save(); ctx.globalAlpha = 1 - b; ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.fillStyle = 'rgba(226,184,102,0.12)'; ctx.beginPath();
      const N = 60, pts = []; for (let i = 0; i <= N; i++) { const q = i / N * Math.PI * 2, r = 230 + 40 * Math.sin(q * 3 + 1) + 25 * Math.sin(q * 7); pts.push([540 + Math.cos(q) * r * 0.85, 760 + Math.sin(q) * r * 1.2]); }
      const n = Math.floor(N * a); pts.slice(0, n + 1).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); if (a >= 1) { ctx.closePath(); ctx.fill(); } ctx.stroke();
      ctx.fillStyle = GOLD2; ctx.beginPath(); ctx.arc(600, 700, 12 + 4 * Math.sin(t * 5), 0, 7); ctx.fill(); L.dashedRing(600, 700, 60, t, 'rgba(243,213,143,0.7)'); ctx.restore();
      // la celda vista desde arriba, con su medida
      if (b > 0) { ctx.save(); ctx.globalAlpha = b; const s = 0.7 + 0.3 * eo(b); ctx.translate(540, 760); ctx.scale(s, s); ctx.translate(-540, -760);
        ctx.fillStyle = '#17120c'; ctx.fillRect(330, 520, 420, 480); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.strokeRect(330, 520, 420, 480);
        ctx.fillStyle = '#3a3020'; rr(360, 560, 110, 300, 10); ctx.fill(); ctx.fillStyle = '#4a3d28'; ctx.fillRect(640, 900, 70, 70);
        ctx.strokeStyle = GOLD2; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(330, 1040); ctx.lineTo(750, 1040); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = GOLD2; ctx.font = '600 34px Mono'; ctx.textAlign = 'center'; ctx.fillText('≈ 2 m', 540, 1090); ctx.textAlign = 'left'; ctx.restore(); }
      ctx.restore(); vignetteGold(); grain(t);
    } },
    { from: 'l3', clock: 'CANTERA DE CAL', draw(t, u) {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff6dc'); g.addColorStop(1, '#d9cba8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.save(); L.cam(u, 1, 1.07, 540, 820);
      L.sun(820, 260, 90, t); glow(820, 260, 700, 'rgba(255,255,240,0.6)');
      ctx.fillStyle = '#efe6cf'; ctx.beginPath(); ctx.moveTo(0, 560); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 560 + Math.sin(x / 120) * 40 + hash(x, 2) * 30); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(150,130,90,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(hash(i, 1) * W, 620 + i * 45); ctx.lineTo(hash(i, 2) * W, 640 + i * 45); ctx.stroke(); }
      const sw = Math.sin(t * 3.2), lift = Math.max(0, sw);
      L.person(470, 560, 1.0, 'stand', t, mandela);
      ctx.save(); ctx.translate(540, 640); ctx.rotate(-1.2 + lift * 1.3); ctx.fillStyle = '#5a4630'; ctx.fillRect(-6, -10, 12, 220); ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.moveTo(-60, 200); ctx.quadraticCurveTo(0, 170, 60, 200); ctx.lineTo(0, 215); ctx.closePath(); ctx.fill(); ctx.restore();
      if (sw < -0.9) for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(600 + hash(i, Math.floor(t)) * 120, 1040 - hash(i + 3, Math.floor(t)) * 80, 6, 0, 7); ctx.fill(); }
      ctx.restore(); ctx.fillStyle = `rgba(255,255,245,${0.25 + 0.1 * Math.sin(t * 9)})`; ctx.fillRect(0, 0, W, H); grain(t);
    } },
    { from: 'l4', clock: '1 CARTA / 6 MESES', draw(t, u) {
      dark(); ctx.save(); L.cam(u, 1, 1.05, 540, 760);
      const m = Math.min(6, 1 + Math.floor(seg(t, T.l4 + .3, T.l4 + D('l4')) * 6));
      for (let i = 0; i < 6; i++) { const x = 170 + (i % 3) * 260, y = 380 + Math.floor(i / 3) * 280, on = i < m; ctx.fillStyle = on ? 'rgba(226,184,102,0.16)' : 'rgba(255,255,255,0.04)'; rr(x, y, 220, 230, 16); ctx.fill(); ctx.strokeStyle = on ? GOLD : 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = on ? GOLD2 : 'rgba(255,255,255,0.3)'; ctx.font = '700 30px Mono'; ctx.textAlign = 'center'; ctx.fillText('MES ' + (i + 1), x + 110, y + 130); ctx.textAlign = 'left'; }
      const e = eo(seg(t, T.l4 + D('l4') - .6, T.l4 + D('l4') + .1)); if (e > 0) { ctx.save(); ctx.translate(540, 1000 - 30 * (1 - e)); ctx.globalAlpha = e; ctx.rotate(-0.05); ctx.fillStyle = '#efe3c4'; rr(-180, -110, 360, 220, 10); ctx.fill(); ctx.strokeStyle = '#b89a5c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-180, -110); ctx.lineTo(0, 20); ctx.lineTo(180, -110); ctx.stroke(); ctx.fillStyle = '#8b1e1e'; ctx.beginPath(); ctx.arc(0, 20, 22, 0, 7); ctx.fill(); ctx.restore(); }
      ctx.restore(); vignetteGold(); grain(t);
    } },
    { from: 'l5', clock: 'LA ÚLTIMA LIBERTAD', draw(t, u) {
      ctx.save(); L.cam(u, 1.0, 1.1, 540, 700); stoneWall(); barredWindow(t, 590, 260, 300, 260); ctx.fillStyle = '#120e09'; ctx.fillRect(-W, 1150, 3 * W, H);
      const k = seg(t, wt('l5', 'elige') - .3, wt('l5', 'elige') + .8);
      L.person(470, 640, 1.05, 'think', t, mandela);
      glow(470, 600, 220 + 160 * k, `rgba(243,213,143,${0.25 + 0.45 * k})`); if (k > 0) L.dashedRing(470, 600, 150 + 60 * k, t, `rgba(243,213,143,${0.8 * k})`);
      ctx.restore(); vignetteGold(); grain(t);
    } },
    { from: 'l6', clock: 'LA DICOTOMÍA DEL CONTROL', draw(t, u) {
      dark('#0a0806', '#120e09'); ctx.save(); L.cam(u, 1.04, 1, 540, 760);
      const a = eo(seg(t, wt('l6', 'No'), wt('l6', 'No') + .6)), b = eo(seg(t, wt('l6', 'Controlas') - .1, wt('l6', 'Controlas') + .6));
      ctx.globalAlpha = Math.max(.15, a); ctx.strokeStyle = 'rgba(200,200,200,0.5)'; ctx.setLineDash([10, 12]); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(540, 760, 400, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(220,220,220,0.75)'; ctx.font = '700 32px Mono'; ctx.textAlign = 'center'; ctx.fillText('LO QUE TE PASA', 540, 420);
      ['la cárcel', 'los guardias', 'los años'].forEach((w, i) => { ctx.fillStyle = 'rgba(200,200,200,0.55)'; ctx.font = '600 28px Mono'; ctx.fillText(w, [300, 780, 540][i], [560, 560, 1110][i]); });
      ctx.globalAlpha = b; ctx.fillStyle = 'rgba(226,184,102,0.2)'; ctx.beginPath(); ctx.arc(540, 790, 190 * (0.6 + 0.4 * back(b)), 0, 7); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = GOLD2; ctx.font = '800 38px Inter'; ctx.fillText('LO QUE', 540, 780); ctx.fillText('HACES', 540, 830); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
      ctx.restore(); vignetteGold(); grain(t);
    } },
    { from: 'l7', clock: '11 · 02 · 1990', draw(t, u) {
      dark(); const o = ss(seg(t, T.l7 + .2, T.l7 + 2.2));
      ctx.save(); L.cam(u, 1.0, 1.08, 540, 760);
      glow(540, 760, 900 * (0.3 + o), 'rgba(255,230,170,0.9)'); ctx.fillStyle = `rgba(255,240,200,${0.9 * o})`; ctx.fillRect(540 - 330 * o, 260, 660 * o, 900);
      ctx.fillStyle = '#1d1810'; ctx.fillRect(210 - 330 * o, 260, 330, 900); ctx.fillRect(540 + 330 * o, 260, 330, 900);
      ctx.strokeStyle = '#2d251a'; ctx.lineWidth = 10; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(250 - 330 * o + i * 80, 260); ctx.lineTo(250 - 330 * o + i * 80, 1160); ctx.stroke(); ctx.beginPath(); ctx.moveTo(580 + 330 * o + i * 80, 260); ctx.lineTo(580 + 330 * o + i * 80, 1160); ctx.stroke(); }
      const w = seg(t, T.l7 + 1.2, T.l7 + D('l7')); ctx.save(); ctx.globalAlpha = 0.95; L.person(540, 640 + 40 * w, 0.9 - 0.25 * w, 'happy', t, { ...mandela, top: '#1a1a1a', topD: '#111', inner: '#1a1a1a', pants: '#121212', pantsD: '#0c0c0c', skin: '#1a1410', skinD: '#120e0a', hair: '#0d0d0d' }); ctx.restore();
      ctx.restore(); vignetteGold(); grain(t);
      const p = eo(seg(t, wt('l7', 'presidente') - .2, wt('l7', 'presidente') + .4)); if (p > 0) { ctx.save(); ctx.globalAlpha = p; ctx.textAlign = 'center'; ctx.fillStyle = GOLD; ctx.font = '900 120px Inter'; ctx.fillText('1994', 540, 1210); ctx.font = '600 34px Mono'; ctx.fillStyle = GOLD2; ctx.fillText('PRESIDENTE DE SUDÁFRICA', 540, 1260); ctx.restore(); ctx.textAlign = 'left'; }
    } },
  ];
  const tags = [
    [T.l1 + 1.4, 120, 330, 'NELSON MANDELA', 'o', 30],
    [wt('l3', 'daña'), 120, 330, 'DAÑO EN LOS OJOS', 'r', 28],
    [wt('l5', 'nadie'), 120, 330, 'NADIE PUEDE ENCERRAR ESTO', 'o', 28],
    [wt('l7', 'odio'), 120, 330, 'SIN ODIO', 'o', 32],
  ];
  const red = [];
  return { scenes, tags, red, cierreFrom: 'l8', marca: 'codigo', vignette: false };
}
