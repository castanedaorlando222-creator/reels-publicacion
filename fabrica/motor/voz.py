"""Voz del reel → voices/<id>.wav + voices/dur.json

  python3 voz.py kokoro                 # voz gratuita (Kokoro, em_alex), descarga el modelo si falta
  python3 voz.py partir VOZ.mp3         # parte una toma única de ElevenLabs en frases por los silencios
  python3 voz.py texto                  # imprime el texto completo para ElevenLabs (frases separadas por pausas)
Se ejecuta dentro de la carpeta del reel (donde está lines.json).
"""
import os, sys, json, subprocess, re, urllib.request
import numpy as np, soundfile as sf
LINES = json.load(open('lines.json'))
os.makedirs('voices', exist_ok=True)
SR = 24000

def save(id_, a, sr):
    sf.write(f'voices/{id_}.wav', a.astype(np.float32), sr)
    return round(len(a) / sr, 3)

def kokoro():
    cache = os.path.expanduser('~/.cache/kokoro'); os.makedirs(cache, exist_ok=True)
    base = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
    for f in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
        p = os.path.join(cache, f)
        if not os.path.exists(p) or os.path.getsize(p) < 1000:
            subprocess.run(['curl', '-sSfL', '-o', p, base + f], check=True)
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(cache, 'kokoro-v1.0.onnx'), os.path.join(cache, 'voices-v1.0.bin'))
    dur = {}
    for L in LINES:
        a, sr = k.create(L['text'], voice=L.get('voice', 'em_alex'), speed=L.get('speed', 1.0), lang='es')
        dur[L['id']] = save(L['id'], a, sr); print(L['id'], dur[L['id']])
    json.dump(dur, open('voices/dur.json', 'w'), indent=1)

def partir(path):
    """Corta la toma única en tantas frases como lines.json, por los silencios más largos (en orden)."""
    wav = 'voices/_full.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', path, '-ac', '1', '-ar', str(SR), wav], check=True)
    a, sr = sf.read(wav)
    out = subprocess.run(['ffmpeg', '-i', wav, '-af', 'silencedetect=noise=-38dB:d=0.22', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    gaps = [(e - s, s, e) for s, e in zip(st, en) if s > .3 and e < len(a) / sr - .3]
    n = len(LINES)
    if len(gaps) < n - 1: sys.exit(f'ERROR: solo {len(gaps)} pausas para {n} frases; usa kokoro')
    # programación dinámica: elegir n-1 pausas (en orden) que mejor repartan el audio según la longitud del texto,
    # premiando las pausas largas (entre párrafos ElevenLabs deja más silencio que dentro de una frase)
    T = len(a) / sr
    lens = np.array([len(L['text']) for L in LINES], float); share = lens / lens.sum()
    C = sorted(gaps, key=lambda g: g[1]); m = len(C); mids = [(g[1] + g[2]) / 2 for g in C]
    INF = 1e18
    def segcost(t0, t1, i, gl):  # tramo i entre t0 y t1, gl = duración de la pausa que lo cierra
        exp = share[i] * T
        return ((t1 - t0) - exp) ** 2 / max(exp, .5) - 6.0 * gl
    dp = [[INF] * m for _ in range(n - 1)]; bk = [[-1] * m for _ in range(n - 1)]
    for j in range(m): dp[0][j] = segcost(0, mids[j], 0, C[j][0])
    for k in range(1, n - 1):
        for j in range(m):
            best, arg = INF, -1
            for q in range(j):
                if dp[k - 1][q] < INF:
                    v = dp[k - 1][q] + segcost(mids[q], mids[j], k, C[j][0])
                    if v < best: best, arg = v, q
            dp[k][j], bk[k][j] = best, arg
    best, j = INF, -1
    for q in range(m):
        if dp[n - 2][q] < INF:
            v = dp[n - 2][q] + segcost(mids[q], T, n - 1, 0)
            if v < best: best, j = v, q
    if j < 0: sys.exit('ERROR: no se pudo repartir; usa kokoro')
    sel = []
    for k in range(n - 2, -1, -1): sel.append(C[j]); j = bk[k][j]
    cuts = sel[::-1]
    bounds = [0] + [(g[1] + g[2]) / 2 for g in cuts] + [len(a) / sr]
    dur = {}
    for i, L in enumerate(LINES):
        seg = a[int(bounds[i] * sr):int(bounds[i + 1] * sr)]
        nz = np.where(np.abs(seg) > 0.01)[0]
        if len(nz): seg = seg[max(0, nz[0] - int(.04 * sr)):nz[-1] + int(.12 * sr)]
        dur[L['id']] = save(L['id'], seg, sr); print(L['id'], dur[L['id']])
    json.dump(dur, open('voices/dur.json', 'w'), indent=1)
    os.remove(wav)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'kokoro'
    if cmd == 'kokoro': kokoro()
    elif cmd == 'partir': partir(sys.argv[2])
    elif cmd == 'texto': print('\n\n'.join(L['text'] for L in LINES))
