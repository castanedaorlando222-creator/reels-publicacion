"""Música, efectos y voz del reel de historia → salida/mix.wav (sin dependencias externas: numpy + soundfile)."""
import os, json
import numpy as np, soundfile as sf
SR = 48000
E = json.load(open('events.json')); DUR, EV = E['dur'], E['ev']
N = int((DUR + .5) * SR)
music, fx, voice = (np.zeros((N, 2)) for _ in range(3))
rng = np.random.default_rng(3)
t_ = lambda d: np.arange(int(d * SR)) / SR
def add(buf, x, t, g=1., pan=0.):
    i = int(t * SR); x = x[:max(0, N - i)]
    if i < 0 or len(x) == 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * l * 1.414; buf[i:i + len(x), 1] += x * g * r * 1.414
def lp(x, fc):  # paso bajo de un polo
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lpf(x, fc):  # paso bajo rápido por FFT
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def bpf(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= ((f > lo) & (f < hi)); return np.fft.irfft(X, len(x))
noise = lambda d: rng.standard_normal(int(d * SR))
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
def pad(m, d, v=.1):
    t = t_(d); x = sum(np.sin(2 * np.pi * mtof(m) * k * t * (1 + .0015 * np.sin(2 * np.pi * .3 * t))) / k ** 1.7 for k in range(1, 6))
    return lpf(x * np.minimum(1, t / .6) * np.minimum(1, (d - t) / .9), 1600) * v
def pluck(m, d=1.6, v=.35):  # caja de música: Karplus-Strong corto
    f = mtof(m); n = int(SR / f); buf = rng.uniform(-1, 1, n); out = np.zeros(int(d * SR))
    for i in range(len(out)): out[i] = buf[i % n]; buf[i % n] = .996 * .5 * (buf[i % n] + buf[(i + 1) % n])
    t = t_(d); return (out * .5 + .5 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .35)) * np.exp(-t / .9) * v
def thump(d=.5, f0=60):
    t = t_(d); f = f0 * (1 + 1.5 * np.exp(-t / .03)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d * .3))
def whoosh(d=.4):
    t = t_(d); return bpf(noise(d), 400, 4000) * np.sin(np.pi * t / d) ** 2 * .5
def pop():
    d = .12; t = t_(d); return np.sin(2 * np.pi * (900 + 1600 * np.exp(-t / .01)) * t) * np.exp(-t / .03) * .6
def limit(x, c=.95): return np.tanh(x / c) * c

cuts = [e['t'] for e in EV if e['type'] == 'cut']; sting = [e['t'] for e in EV if e['type'] == 'sting']
sting = sting[0] if sting else DUR
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 63], [45, 52, 57, 60], [46, 53, 58, 62], [43, 50, 55, 58], [50, 57, 62, 65]]
bounds = [0] + cuts + [DUR]
for i in range(len(bounds) - 1):
    a, b = bounds[i], bounds[i + 1]; ch = chords[i % len(chords)] if a < sting - .1 else [55, 59, 62, 67]
    for m in ch: add(music, pad(m, b - a + 1.2), a, 1., pan=(m % 3 - 1) * .3)
    t, k = a + .2, 0
    while t < b - .3: add(music, pluck(ch[[0, 2, 3, 2][k % 4]] + 24), t, .35, pan=.2 * ((k % 2) * 2 - 1)); t += .75; k += 1
for k in range(int(sting / .75)):  # reloj de la noche
    tk = bpf(noise(.02), 2500, 6000) * np.exp(-t_(.02) / .004) * (.25 if k % 2 else .18); add(fx, tk, k * .75, .5, .4)
for e in EV:
    if e['type'] == 'tag':
        add(fx, pop(), e['t'], .25, -.2)
        if e.get('col') == 'r': add(fx, thump(.6, 55), e['t'], .5); add(fx, thump(.4, 50), e['t'] + .28, .35)
    elif e['type'] == 'cut': add(fx, whoosh(), e['t'] - .15, .35)
add(fx, thump(1., 45), sting, .7)
for e in EV:
    if e['type'] != 'voice': continue
    p = f"voices/{e['id']}.wav"
    if not os.path.exists(p): continue
    a, sr = sf.read(p)
    if a.ndim > 1: a = a.mean(1)
    if sr != SR: a = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a)
    add(voice, a / (np.abs(a).max() + 1e-9) * .9, e['t'])
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
v_on = np.abs(voice).sum(1) > 1e-4
k = int(.3 * SR); duck = np.convolve(v_on.astype(float), np.ones(k) / k, 'same')
music *= (1 - .4 * np.clip(duck, 0, 1))[:, None]
if v_on.any(): voice *= .25 / rms(voice[v_on])
music *= (.25 / 3.2) / rms(music); fx *= (.25 / 4.0) / rms(fx)
out = voice + music + fx
os.makedirs('salida', exist_ok=True)
sf.write('salida/mix.wav', np.stack([limit(out[:, 0]), limit(out[:, 1])], 1).astype(np.float32), SR)
print('mix', round(N / SR, 2))
