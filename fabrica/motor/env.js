// Envoltura MOTOR v2 de cada plano (zoom de entrada, empuje de salida, bloom, viñeta, destello). Uso: scenes = envelope(L, V, shots, S.END)
export function envelope(L, V, shots, END) {
  const { ctx, W, H, seg, eo } = L;
  shots.forEach((s, i) => s.end = i + 1 < shots.length ? shots[i + 1].at : END);
  return shots.map(s => ({ at: s.at, draw: t => {
    const k = 1 - eo(seg(t, s.at, s.at + .34)), x = s.noOut ? 0 : Math.pow(seg(t, s.end - .13, s.end), 2), z = 1 + (s.zin ?? .2) * k + .14 * x;
    const tf = () => { ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000); };
    ctx.save(); tf(); s.draw(t); ctx.restore(); V.bloom(s.bloom ?? .5); V.vign();
    if (s.ui) { ctx.save(); tf(); ctx.globalAlpha = 1 - x; s.ui(t); ctx.restore(); }
    if (s.at > 0 && k > 0 && s.zin !== 0) { ctx.fillStyle = `rgba(200,225,255,${k * k * .3})`; ctx.fillRect(0, 0, W, H); } } }));
}
