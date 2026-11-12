"""Voz gratuita Kokoro para un reel de becario-reels (pizarra): una frase por línea → un solo WAV.
  python3 kokoro_full.py ~/reelN/src/datos/plan.json voz.wav     (lee frases[].voz o frases[].texto)
Después: python3 /mnt/skills/plugins/becario-reels/scripts/alinear.py voz.wav --proyecto ~/reelN
"""
import os, sys, subprocess, re, numpy as np, soundfile as sf
cache = os.path.expanduser('~/.cache/kokoro'); os.makedirs(cache, exist_ok=True)
base = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
for f in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
    p = os.path.join(cache, f)
    if not os.path.exists(p) or os.path.getsize(p) < 1000: subprocess.run(['curl', '-sSfL', '-o', p, base + f], check=True)
from kokoro_onnx import Kokoro
k = Kokoro(os.path.join(cache, 'kokoro-v1.0.onnx'), os.path.join(cache, 'voices-v1.0.bin'))
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from pron import pron
plan = json.load(open(sys.argv[1], encoding='utf-8'))
lines = [re.sub(r'\s+', ' ', (f.get('voz') or f['texto']).replace('*', '')).strip() for f in plan['frases']]
out, sr = [], 24000
for l in lines:
    a, sr = k.create(pron(l), voice='em_alex', speed=1.0, lang='es'); out += [a, np.zeros(int(.3 * sr), np.float32)]
sf.write(sys.argv[2], np.concatenate(out), sr); print(sys.argv[2], len(lines), 'frases')
