"""Render del reel de historia (se ejecuta dentro de la carpeta del reel).
  python3 render.py fotos 3 10 20 …   → fotos/t_<s>.jpg + fotos/hoja.jpg (hoja de contactos)
  python3 render.py video             → salida/reel.mp4 (vídeo + mezcla + volumen normalizado)
  python3 render.py portada T "LÍNEA 1|LÍNEA *CLAVE*|LÍNEA 3" [codigo]  → salida/portada.jpg (fotograma T + título; *palabra* resaltada)
Necesita: playwright (chromium), ffmpeg, numpy, soundfile.
"""
import sys, os, json, base64, subprocess, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
FPS = 30
HERE = os.getcwd()

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=HERE)
    h.log_message = lambda *a, **k: None
    s = socketserver.TCPServer(('127.0.0.1', 0), h); threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, s.server_address[1]

def page(p, port):
    b = p.chromium.launch(args=['--disable-web-security'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/index.html')
    try: pg.wait_for_function('window.READY === true', timeout=30000)
    except Exception: sys.exit('ERROR: la página no cargó: ' + '; '.join(errs))
    if errs: print('AVISO errores JS:', errs)
    return b, pg

GRAB = "(t)=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',0.92)}"

def fotos(ts):
    os.makedirs('fotos', exist_ok=True); srv, port = serve()
    with sync_playwright() as p:
        b, pg = page(p, port); names = []
        dur = pg.evaluate('window.DUR')
        if not ts: ts = [round(dur * k / 11, 2) for k in range(12)]
        for t in ts:
            n = f'fotos/t_{t}.jpg'; open(n, 'wb').write(base64.b64decode(pg.evaluate(GRAB, float(t)).split(',')[1])); names.append(n)
        b.close()
    from PIL import Image
    ims = [Image.open(n).resize((270, 480)) for n in names]; cols = 6; rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 270, rows * 480), 'black')
    for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
    sheet.save('fotos/hoja.jpg', quality=85); print('fotos/hoja.jpg', len(ims), 'fotos; duración', round(dur, 2))

def video():
    os.makedirs('salida', exist_ok=True); srv, port = serve()
    with sync_playwright() as p:
        b, pg = page(p, port)
        dur = pg.evaluate('window.DUR'); ev = pg.evaluate('window.EV')
        json.dump({'dur': dur, 'ev': ev}, open('events.json', 'w'))
        tmp = 'salida/_video.tmp.mp4'
        ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for i in range(int(dur * FPS)):
            ff.stdin.write(base64.b64decode(pg.evaluate(GRAB, i / FPS).split(',')[1]))
        ff.stdin.close(); assert ff.wait() == 0, 'ffmpeg falló'
        b.close()
    os.replace(tmp, 'salida/_video.mp4')
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mix.py')], check=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'salida/_video.mp4', '-i', 'salida/mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', 'salida/_reel.tmp.mp4'], check=True)
    os.replace('salida/_reel.tmp.mp4', 'salida/reel.mp4')
    for f in ['salida/_video.mp4']: os.remove(f)
    print('salida/reel.mp4', round(dur, 2), 's')

def portada(t, texto, marca='nutricion'):
    os.makedirs('salida', exist_ok=True); srv, port = serve()
    with sync_playwright() as p:
        b, pg = page(p, port); pg.evaluate('window.NOCAP = true'); open('salida/_frame.jpg', 'wb').write(base64.b64decode(pg.evaluate(GRAB, float(t)).split(',')[1])); b.close()
    from PIL import Image, ImageDraw, ImageFont
    im = Image.open('salida/_frame.jpg').convert('RGB'); W, H = im.size
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    for y in range(0, 900): d.line([(0, y), (W, y)], fill=(4, 6, 14, int(215 * (1 - y / 900) ** 1.2)))
    im = Image.alpha_composite(im.convert('RGBA'), ov); d = ImageDraw.Draw(im)
    acc = (226, 184, 102) if marca == 'codigo' else (255, 201, 60)
    lines = [l.strip() for l in texto.split('|') if l.strip()]; y = 330
    for ln in lines:
        size = 118
        while True:
            f = ImageFont.truetype('fonts/Inter.ttf', size)
            try: f.set_variation_by_axes([900 if 'eight' in str(a.get('name', '')) else a['maximum'] for a in f.get_variation_axes()])
            except Exception: pass
            if d.textlength(ln.replace('*', ''), font=f) < W - 120 or size < 60: break
            size -= 4
        x = (W - d.textlength(ln.replace('*', ''), font=f)) / 2
        for k, part in enumerate(ln.split('*')):
            if not part: continue
            col = acc if k % 2 else (255, 255, 255)
            d.text((x, y), part, font=f, fill=col, stroke_width=6, stroke_fill=(0, 0, 0)); x += d.textlength(part, font=f)
        y += int(size * 1.12)
    logo = 'img/logo-codigo.jpg' if marca == 'codigo' else 'img/logo-orlando.jpg'
    if os.path.exists(logo):
        lg = Image.open(logo).convert('RGB').resize((170, 170)); m = Image.new('L', (170, 170), 0); ImageDraw.Draw(m).ellipse((0, 0, 169, 169), fill=255)
        im.paste(lg, (W // 2 - 85, 110), m)
    im.convert('RGB').save('salida/portada.jpg', quality=90); os.remove('salida/_frame.jpg'); print('salida/portada.jpg')

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'fotos': fotos([float(x) for x in sys.argv[2:]])
    elif cmd == 'video': video()
    elif cmd == 'portada': portada(sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else 'nutricion')
