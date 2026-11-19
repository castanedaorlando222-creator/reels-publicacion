// FARO por datos: una persona ficticia, de noche, reloj arriba a la izquierda, etiquetas tipo terminal, tinte rojo en el riesgo.
// Uso en story.js:  import { faro } from './faroGen.js';  export default (L,S) => faro(L,S,{ look:{...}, scenes:[{from:'l1',clock:'11:40 PM',kind:'phone',...}], tags:[...], red:[...], hook:{parts:[['TEXTO','#fff']], word:['l1','x']} });
// kinds: phone{text,title,user} · laptop{head,body} · think{emoji} · window · quote{title,text} · list{title,items} · happy · chart{title,mark}
import { makeV2 } from './v2.js';
export function faro(L, S, spec) {
  const { T, D, wt } = S; const { ctx, seg, ss, eo, lerp, W, H } = L; const V = makeV2(L);
  const look = spec.look; const pal = spec.palette || ['#0b1430', '#162a57'];
  const when = a => Array.isArray(a) ? (typeof a[1] === 'string' ? wt(a[0], a[1]) : T[a[0]] + (a[1] || 0)) : a;
  const scenes = spec.scenes.map(sc => ({ from: sc.from, clock: sc.clock, draw(t, u) {
    const pl = sc.pal || pal; L.sky(pl[0], pl[1]); if (sc.glow !== false) L.glow(540, 760, 620, sc.glow || 'rgba(90,160,255,0.16)');
    if (sc.stars) L.stars(t, 40, 700, 3);
    const t0 = T[sc.from]; const px = sc.px ?? 540, py = sc.py ?? 520, ps = sc.ps ?? 1;
    ctx.save(); L.cam(u, sc.z0 ?? 1, sc.z1 ?? 1.07, 540, 800);
    if (sc.kind === 'phone') { L.person(330, 330, 1.5 * ps, 'phone', t, look); }
    else if (sc.kind === 'laptop') { L.person(540, 330, 1.35, 'stand', t, look); L.desk(1000); L.laptop(540, 1000, t, (w, h) => { ctx.fillStyle = sc.screen?.[0] || '#d9534f'; ctx.fillRect(0, 0, w, 44); ctx.fillStyle = '#fff'; ctx.font = '700 22px Inter'; ctx.fillText(sc.head || '', 20, 30); ctx.fillStyle = '#20232c'; ctx.font = '700 30px Inter'; (sc.body || []).forEach((l, i) => ctx.fillText(l, 24, 110 + i * 56)); }); }
    else if (sc.kind === 'think') { L.person(460, 300, 1.6 * ps, 'think', t, look); L.thought(830, 360, t, sc.emoji || '…', eo(seg(t, t0 + .3, t0 + .8))); }
    else if (sc.kind === 'window') { L.windowView(t, 160, 240, 760, 820); ctx.fillStyle = '#0e1a3a'; ctx.fillRect(0, 1060, 1080, 860); L.person(540, 760, 1.1, 'back', t, look); }
    else if (sc.kind === 'quote') { L.spotlightTable(540, 1250, 330); L.person(540, 640, 1.0, 'think', t, look); }
    else if (sc.kind === 'list') { L.person(540, 250, 1.25, 'stand', t, look); }
    else if (sc.kind === 'happy') { L.glow(540, 800, 520, 'rgba(120,255,180,0.18)'); L.person(540, 330, 1.7, 'happy', t, look); }
    else if (sc.kind === 'chart') { L.person(540, 300, 1.2, 'think', t, look); }
    else L.person(px, py, ps, sc.pose || 'stand', t, look);
    ctx.restore();
    if (sc.kind === 'phone') L.typeBox(580, 430, 450, t, t0 + .4, sc.title || 'MENSAJE', sc.text || '', sc.col || '#5ee08a');
    if (sc.kind === 'quote') L.typeBox(90, 330, 900, t, t0 + .3, sc.title, sc.text, sc.col || '#f2c94c');
    if (sc.kind === 'list') L.checklist(110, 1000, 860, t, t0 + .2, sc.title, sc.items, sc.blink ? when(sc.blink) : 1e9);
    if (sc.kind === 'chart') L.chart(140, 1020, 800, 200, seg(t, t0 + .3, t0 + D(sc.from) + .2), sc.f || (u2 => u2 < .5 ? .2 + .8 * u2 * 1.6 : 1 - (u2 - .5) * 1.3), { title: sc.title || '', split: sc.split ?? null, mark: sc.mark || '' });
    if (sc.slam) V.slam(sc.slam, 540, sc.slamY ?? 1120, sc.size ?? 84, V.on(t, when(sc.slamAt ?? [sc.from, 0.2]), .22));
    if (sc.stamp) V.stamp(sc.stamp[0], 540, sc.stampY ?? 1000, 90, V.on(t, when(sc.stamp[1]), .25), sc.stamp[2] || '#ff3b55', -.1);
    V.bloom(.35);
  } }));
  if (spec.hook) { const s0 = scenes[0], d0 = s0.draw; s0.draw = (t, u) => { d0(t, u); V.slam(spec.hook.parts, 540, spec.hook.y ?? 1160, spec.hook.size ?? 96, V.on(t, 0.15, .3)); }; }
  return { scenes, tags: spec.tags || [], red: spec.red || [], cierreFrom: spec.cierreFrom, marca: 'codigo', noFade: true, vignette: spec.vignette ?? true, fx: spec.fx || [] };
}
