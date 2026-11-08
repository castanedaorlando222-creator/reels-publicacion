// ILUSTRADO — escenas hechas con ilustraciones de Google Flow (img/flow/*.png|jpg) animadas con código.
// Cada plano: una ilustración a pantalla completa (encuadre «cover»), empuje/paneo suave, respiración, partículas de luz,
// y encima lo que la voz dice: etiquetas, contadores, flechas, cambio de expresión (otra imagen del mismo personaje).
//   import { makeIlustrado } from './ilustrado.js';  const I = makeIlustrado(L);
//   story.assets = ['img/flow/01.jpg', …]  (se precargan en IMG)
export function makeIlustrado(L) {
  const { ctx, W, H, seg, ss, lerp, hash, glow } = L;
  // dibuja una imagen cubriendo el lienzo con cámara: z0→z1 (zoom), (x0,y0)→(x1,y1) desplazamiento en px
  function shot(img, u, { z0 = 1.04, z1 = 1.14, x0 = 0, x1 = 0, y0 = 0, y1 = -30, breathe = .006, t = 0 } = {}) {
    if (!img) { ctx.fillStyle = '#0b1530'; ctx.fillRect(0, 0, W, H); return; }
    const k = ss(u), z = lerp(z0, z1, k) * (1 + breathe * Math.sin(t * 1.3));
    const s = Math.max(W / img.width, H / img.height) * z, w = img.width * s, h = img.height * s;
    ctx.drawImage(img, (W - w) / 2 + lerp(x0, x1, k), (H - h) / 2 + lerp(y0, y1, k), w, h);
  }
  // fundido entre dos imágenes del mismo plano (p. ej. cara feliz → cara cansada)
  function swap(a, b, p, u, cam = {}) { shot(a, u, cam); if (p > 0) { ctx.save(); ctx.globalAlpha = ss(p); shot(b, u, cam); ctx.restore(); } }
  // motas de luz flotando (profundidad) y viñeta suave
  function dust(t, n = 30, col = '255,240,200') { for (let i = 0; i < n; i++) { const x = (hash(i, 1) * W + Math.sin(t * .4 + i) * 40), y = ((hash(i, 2) * H - t * (10 + hash(i, 3) * 25)) % H + H) % H, r = 1.5 + hash(i, 4) * 4; ctx.fillStyle = `rgba(${col},${.08 + hash(i, 5) * .25})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } }
  function vignette(a = .45) { const g = ctx.createRadialGradient(W / 2, H * .45, H * .3, W / 2, H * .5, H * .8); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const b = ctx.createLinearGradient(0, 0, 0, 640); b.addColorStop(0, 'rgba(0,0,0,.55)'); b.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = b; ctx.fillRect(0, 0, W, 640); } // oscurece arriba para que se lean los subtítulos
  // destello al cambiar de plano
  function flashIn(t, t0) { const d = 1 - seg(t, t0, t0 + .16); if (d > 0) { ctx.fillStyle = `rgba(255,255,255,${d * .25})`; ctx.fillRect(0, 0, W, H); } }
  return { shot, swap, dust, vignette, flashIn };
}
