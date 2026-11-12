"""Pronunciación para la voz (Kokoro y ElevenLabs). Solo cambia lo que se DICE; los subtítulos siguen con la palabra escrita bien.
Orlando: «reel» se dice «ril», no «re-el». Añade aquí otras palabras si suenan mal."""
import re
REGLAS = [(r'\breels\b', 'rils'), (r'\breel\b', 'ril')]
def pron(t):
    for a, b in REGLAS:
        t = re.sub(a, lambda m: b.upper() if m.group(0).isupper() else (b.capitalize() if m.group(0)[0].isupper() else b), t, flags=re.I)
    return t
