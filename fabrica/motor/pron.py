"""Pronunciación de la voz (Kokoro y texto para ElevenLabs). Solo cambia lo que se DICE: los subtítulos siguen bien escritos.
Orlando: «reel» = «ril» (r suave, no «re-el» ni «rr»), «YouTube» = «Yútub». Añade aquí palabras que suenen mal."""
import re
# 1) cambios de texto (también sirven para el texto que se manda a ElevenLabs)
REGLAS = [(r'\breels\b', 'rils'), (r'\breel\b', 'ril'), (r'\byoutube\b', 'Yutub'), (r'\bfacebook\b', 'Feisbuk')]
# 2) retoques de fonemas para Kokoro (después de fonetizar): r inicial suave y acento en la primera sílaba de Yútub
FONEMAS = [('rˈils', 'ɾˈils'), ('rˈil', 'ɾˈil'), ('ʝutˈub', 'ʝˈutub')]
def pron(t):
    for a, b in REGLAS:
        t = re.sub(a, lambda m: b.upper() if m.group(0).isupper() and len(m.group(0)) > 1 else (b[0].upper() + b[1:] if m.group(0)[0].isupper() else b.lower()), t, flags=re.I)
    return t
def fonemas(k, text, lang='es'):
    ph = k.tokenizer.phonemize(pron(text), lang)
    for a, b in FONEMAS: ph = ph.replace(a, b)
    return ph
def decir(k, text, voice='em_alex', speed=1.0, lang='es'):
    """Igual que k.create(text, …) pero con la pronunciación corregida."""
    return k.create(fonemas(k, text, lang), voice=voice, speed=speed, lang=lang, is_phonemes=True)
