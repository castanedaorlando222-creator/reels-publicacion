"""Alineación forzada sin modelos externos: cada palabra se sintetiza suelta con la misma voz Kokoro,
se concatena y se alinea por DTW (log-mel) con la frase real → voices/words.json (inicio de cada palabra del subtítulo)."""
import os, json, re, sys, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from pron import pron, decir
SR = 24000; HOP = 240; WIN = 600
def mel_fb(n=40, nfft=1024):
    f = np.fft.rfftfreq(nfft, 1 / SR); m = lambda x: 2595 * np.log10(1 + x / 700); pts = np.linspace(m(80), m(7600), n + 2); hz = 700 * (10 ** (pts / 2595) - 1)
    fb = np.zeros((n, len(f)))
    for i in range(n): l, c_, r = hz[i], hz[i + 1], hz[i + 2]; fb[i] = np.clip(np.minimum((f - l) / (c_ - l), (r - f) / (r - c_)), 0, None)
    return fb
FB = mel_fb()
def feats(a):
    a = np.concatenate([np.zeros(WIN // 2), a, np.zeros(WIN)]); n = (len(a) - WIN) // HOP
    fr = np.stack([a[i * HOP:i * HOP + WIN] for i in range(n)]) * np.hanning(WIN)
    S = np.abs(np.fft.rfft(fr, 1024)) ** 2; M = np.log(S @ FB.T + 1e-6); M -= M.mean(0)
    d = np.vstack([np.zeros((1, M.shape[1])), np.diff(M, axis=0)]); F = np.hstack([M, 2 * d])
    return F / (np.linalg.norm(F, axis=1, keepdims=True) + 1e-9)
def trim(a):
    nz = np.where(np.abs(a) > .02 * np.abs(a).max())[0]; return a[max(0, nz[0] - 120):nz[-1] + 240]
def alinear(K=None):
    if K is None:
        from kokoro_onnx import Kokoro
        c = os.path.expanduser('~/.cache/kokoro'); K = Kokoro(c + '/kokoro-v1.0.onnx', c + '/voices-v1.0.bin')
    out = {}
    for L in json.load(open('lines.json')):
      try:
          if not L.get('sub') or L.get('noSubs'): continue
          full, sr = sf.read(f"voices/{L['id']}.wav"); ws = L['text'].split(); assert len(ws) == len(L['sub'].split())
          segs = []; b = [0]
          for w in ws:
              a, _ = decir(K, re.sub(r'[¿?¡!.,:;]', '', w), voice=L.get('voice', 'em_alex'), speed=L.get('speed', 1.0)); a = trim(a); segs.append(a); b.append(b[-1] + len(a))
          A, B = feats(np.concatenate(segs)), feats(full); C = 1 - A @ B.T; n, m = C.shape
          D = np.full((n + 1, m + 1), 1e9); D[0, 0] = 0
          for i in range(1, n + 1): D[i, 1:] = C[i - 1]  # relleno; se acumula abajo
          for i in range(1, n + 1):
              row = D[i - 1]; cur = D[i]; prev = 1e9
              for j in range(1, m + 1):
                  v = C[i - 1, j - 1] + min(row[j - 1], row[j], prev); cur[j] = v; prev = v
          i, j = n, m; path = {}
          while i > 0 and j > 0:
              path[i - 1] = j - 1; k = np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]])
              if k == 0: i, j = i - 1, j - 1
              elif k == 1: i -= 1
              else: j -= 1
          t = [round(path.get(min(n - 1, x // HOP), 0) * HOP / SR, 3) for x in b[:-1]]
          out[L['id']] = t; print(L['id'], ' '.join(f"{w}@{x}" for w, x in zip(L['sub'].split(), t)))
      except Exception as e: print('alinear: sin tiempos para', L.get('id'), e)
    json.dump(out, open('voices/words.json', 'w'))


if __name__ == '__main__': alinear()
