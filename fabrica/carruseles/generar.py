"""Genera un carrusel (1080x1350) a partir de un JSON.

Uso: python3 generar.py spec.json foto_portada.jpg carpeta_salida

spec.json:
{
  "etiqueta": "TU HÍGADO TRABAJA 24/7",            # píldora verde de la portada (MAYÚSCULAS, corta)
  "titulo": "5 alimentos que tu *hígado* te va a agradecer",   # *palabra* = amarillo
  "subtitulo": "Pequeños cambios en tu plato ...",
  "items": [                                          # 3 a 6 slides interiores
    {"nombre": "Alcachofa", "texto": "Su *cinarina* estimula ...", "consejo_titulo": "CÓMO COMERLO", "consejo": "Al vapor ..."}
  ],
  "cierre_titulo": "*GUÁRDALO* PARA TU PRÓXIMA COMPRA",
  "cierre_texto": "Y compártelo con alguien que necesite cuidar su hígado.",
  "marca": "nutricion"                                # o "codigo" (negro y dorado, logo de El Código; items admiten "fuente")
}
Fuentes: Google Sans Bold (títulos), Montserrat Regular/Bold (textos). Logo de Nutrición Consciente, o de El Código con "marca": "codigo".
"""
import sys, os, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")
W, H = 1080, 1350
YEL = (255, 214, 10)
WHITE = (255, 255, 255)
GREEN = (31, 122, 77)
PILL = (46, 160, 90)
INK = (20, 24, 22)
CREAM = (250, 248, 240)
ACC = [(91, 140, 58), (163, 33, 75), (46, 125, 50), (138, 122, 85), (217, 138, 0), (40, 110, 150)]

TITLE = lambda s: ImageFont.truetype(os.path.join(FD, "gsans7.ttf"), int(s * 0.80))
TXT = lambda s: ImageFont.truetype(os.path.join(FD, "mont4.ttf"), int(s * 0.95))
TXTB = lambda s: ImageFont.truetype(os.path.join(FD, "mont7.ttf"), int(s * 0.95))
LOGO = Image.open(os.path.join(FD, "logo.webp")).convert("RGBA").resize((150, 150), Image.LANCZOS)
T = {"marca": "nutricion", "band": None, "tipbg": (232, 242, 234), "tipbar": GREEN, "tiptitle": GREEN,
     "pilltxt": WHITE, "closebg": GREEN, "closehl": YEL, "closesub": (230, 240, 232), "arrow_light": GREEN,
     "counter": (20, 24, 22), "brand": ("Orlando Castañeda", "  ·  Nutricionista Ortomolecular"),
     "follow": ["Orlando Castañeda Nutrición", "Nutrición Consciente"],
     "aviso": "Contenido educativo. No sustituye la consulta con tu profesional de salud."}


def set_theme(marca):
    global YEL, PILL, INK, CREAM, ACC, LOGO
    if marca != "codigo":
        return
    GOLD = (201, 162, 74)
    YEL, PILL, INK, CREAM = (222, 184, 96), GOLD, (238, 230, 212), (14, 12, 9)
    ACC[:] = [GOLD]
    LOGO = Image.open(os.path.join(FD, "logo-codigo.webp")).convert("RGBA").resize((150, 150), Image.LANCZOS)
    T.update({"marca": "codigo", "band": (30, 25, 17), "tipbg": (34, 29, 20), "tipbar": GOLD, "tiptitle": GOLD,
              "pilltxt": (14, 12, 9), "closebg": (10, 9, 7), "closehl": (222, 184, 96), "closesub": (200, 190, 170),
              "arrow_light": GOLD, "counter": (0, 0, 0), "brand": ("El Código de los Mejores", "  ·  Estoicismo"),
              "follow": ["El Código de los Mejores", "YouTube · Facebook"], "aviso": ""})


def wrap(draw, words, font, maxw):
    lines, cur = [], []
    for w in words:
        t = cur + [w]
        if draw.textlength(" ".join(x for x, _ in t), font=font) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = [w]
    if cur: lines.append(cur)
    return lines


def rich(d, x, y, text, font, maxw, color=WHITE, hl=YEL, lh=1.0, shadow=True):
    words, on = [], False
    for w in text.split(" "):
        st = w.lstrip("«\"(¿¡").startswith("*"); en = w.rstrip("».,:;!?\")").endswith("*")
        words.append((w.replace("*", ""), hl if (on or st) else color))
        if st and not en: on = True
        if en: on = False
    a, b = font.getmetrics(); step = int((a + b) * lh); sp = d.textlength(" ", font=font)
    for line in wrap(d, words, font, maxw):
        cx = x
        for t, c in line:
            if shadow: d.text((cx + 3, y + 4), t, font=font, fill=(0, 0, 0))
            d.text((cx, y), t, font=font, fill=c)
            cx += d.textlength(t, font=font) + sp
        y += step
    return y


def counter(d, n, total):
    f = TXTB(26); lab = f"{n}/{total}"; tw = d.textlength(lab, font=f)
    d.rounded_rectangle((W - 60 - tw - 44, 30, W - 60, 82), radius=26, fill=T["counter"])
    d.text((W - 60 - tw - 22, 40), lab, font=f, fill=WHITE)


def footer(d, dark, arrow):
    col = WHITE if dark else INK
    sub = (220, 220, 220) if dark else (90, 90, 90)
    d.line((70, H - 120, W - 70, H - 120), fill=col, width=2)
    b1, b2 = T["brand"]
    d.text((70, H - 95), b1, font=TXTB(28), fill=col)
    x = 70 + d.textlength(b1, font=TXTB(28))
    d.text((x, H - 95), b2, font=TXT(28), fill=sub)
    if arrow:
        ac = YEL if dark else T["arrow_light"]
        tw = d.textlength("Desliza", font=TXTB(28)); x0 = W - 70 - tw - 50
        d.text((x0, H - 95), "Desliza", font=TXTB(28), fill=ac)
        ay, ax = H - 76, W - 70
        d.line((ax - 36, ay, ax, ay), fill=ac, width=4)
        d.polygon([(ax + 2, ay), (ax - 12, ay - 10), (ax - 12, ay + 10)], fill=ac)


def photo_bg(path, blur=0):
    im = Image.open(path).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = (im.width - W) // 2; y = int((im.height - H) * 0.35)
    im = im.crop((x, y, x + W, y + H))
    if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
    g = Image.new("L", (1, H))
    for yy in range(H):
        t = yy / H; a = 0
        if t > 0.38: a = min(235, int(((t - 0.38) / 0.40) ** 1.3 * 235))
        if t < 0.18: a = max(a, int((0.18 - t) / 0.18 * 120))
        g.putpixel((0, yy), a)
    return Image.composite(Image.new("RGB", (W, H)), im, g.resize((W, H)))


def cover(spec, foto, total):
    img = photo_bg(foto); img.paste(LOGO, (60, 75), LOGO)
    d = ImageDraw.Draw(img); counter(d, 1, total)
    title_f, sub_f = TITLE(122), TXT(38)
    # medir para anclar el bloque encima del pie
    tmp = ImageDraw.Draw(Image.new("RGB", (W, H)))
    hgt = 90 + rich(tmp, 70, 0, spec["titulo"], title_f, W - 140, lh=1.0, shadow=False) + 15 + \
        rich(tmp, 70, 0, spec["subtitulo"], sub_f, W - 160, lh=1.3, shadow=False)
    y = max(560, H - 150 - hgt)
    lab = spec.get("etiqueta", "").upper()
    if lab:
        d.rounded_rectangle((70, y, 70 + d.textlength(lab, font=TXTB(30)) + 44, y + 58), radius=29, fill=PILL)
        d.text((92, y + 12), lab, font=TXTB(30), fill=T["pilltxt"])
    y = rich(d, 70, y + 90, spec["titulo"], title_f, W - 140, lh=1.0)
    rich(d, 70, y + 15, spec["subtitulo"], sub_f, W - 160, lh=1.3)
    footer(d, True, True)
    return img


def item_slide(it, idx, n, total, y0=None):
    acc = ACC[idx % len(ACC)]
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 300), fill=T["band"] or acc)
    if T["band"]: d.rectangle((0, 296, W, 300), fill=acc)
    img.paste(LOGO, (60, 75), LOGO); counter(d, n, total)
    if y0 is None:
        end = item_slide(it, idx, n, total, y0=0)._end
        y0 = 300 + max(40, ((H - 130 - 300) - end) // 2)
    y = y0
    d.text((70, y), f"{idx + 1:02d}", font=TITLE(190), fill=acc); y += 195
    nm = it["nombre"]
    y = rich(d, 70, y, nm, TITLE(140 if len(nm) < 11 else 112), W - 140, color=INK, lh=0.95, shadow=False)
    d.rounded_rectangle((70, y + 10, 210, y + 22), radius=6, fill=acc)
    y = rich(d, 70, y + 55, it["texto"], TXT(46), W - 150, color=INK, hl=acc, lh=1.32, shadow=False)
    if it.get("fuente"):
        y = rich(d, 70, y + 8, "— " + it["fuente"], TXTB(30), W - 150, color=acc, lh=1.25, shadow=False)
    if it.get("consejo"):
        y += 35
        tf = TXT(36); lines = wrap(d, [(w, INK) for w in it["consejo"].split()], tf, W - 230)
        bh = 82 + len(lines) * 50
        d.rounded_rectangle((70, y, W - 70, y + bh), radius=24, fill=T["tipbg"])
        d.rectangle((70, y, 82, y + bh), fill=T["tipbar"])
        d.text((110, y + 20), it.get("consejo_titulo", "CÓMO HACERLO").upper(), font=TXTB(24), fill=T["tiptitle"])
        yy = y + 58
        for ln in lines:
            d.text((110, yy), " ".join(t for t, _ in ln), font=tf, fill=INK); yy += 50
        y += bh
    footer(d, T["marca"] == "codigo", True)
    img._end = y - y0
    return img


def closing(spec, total):
    img = Image.new("RGB", (W, H), T["closebg"]); d = ImageDraw.Draw(img)
    img.paste(LOGO, (60, 75), LOGO); counter(d, total, total)
    y = rich(d, 70, 400, spec.get("cierre_titulo", "*GUÁRDALO* PARA DESPUÉS"), TITLE(118), W - 140, hl=T["closehl"], lh=0.98, shadow=False)
    y = rich(d, 70, y + 20, spec.get("cierre_texto", "Y compártelo con alguien que lo necesite."), TXT(40), W - 150, lh=1.3, shadow=False)
    y += 40
    d.text((70, y), "Síguenos en", font=TXT(34), fill=T["closesub"]); y += 52
    d.text((70, y), T["follow"][0], font=TXTB(40), fill=T["closehl"]); y += 58
    d.text((70, y), T["follow"][1], font=TXTB(40), fill=T["closehl"]); y += 75
    if T["aviso"]:
        rich(d, 70, y, T["aviso"], TXT(24), W - 140, color=T["closesub"], lh=1.3, shadow=False)
    footer(d, True, False)
    return img


def main(spec_path, foto, out):
    spec = json.load(open(spec_path, encoding="utf-8"))
    set_theme(spec.get("marca", "nutricion"))
    items = spec["items"]; total = len(items) + 2
    os.makedirs(out, exist_ok=True)
    slides = [cover(spec, foto, total)] + [item_slide(it, i, i + 2, total) for i, it in enumerate(items)] + [closing(spec, total)]
    paths = []
    for i, s in enumerate(slides, 1):
        p = os.path.join(out, f"{i:02d}.jpg"); s.save(p, quality=92); paths.append(p)
    print("\n".join(paths))


if __name__ == "__main__":
    main(*sys.argv[1:4])
