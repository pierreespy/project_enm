#!/usr/bin/env python3
"""
Génère assets/ringtone.mp3 — la sonnerie de l'appel entrant (easter egg).

C'est une composition originale : un arpège de marimba dans l'esprit d'une
sonnerie de téléphone, synthétisé ici plutôt que repris d'un fichier système
(les sonneries d'iOS sont protégées et ne peuvent pas être embarquées).

Le morceau produit est court — une salve puis un silence — et l'app le joue en
entier, une seule fois, le temps de l'écran d'appel. Sa durée n'a donc aucune
importance pour le code : les vibrations suivent leur propre cadence
(RING_PULSE_MS, dans components/IncomingCall.tsx).

Ce script n'a d'intérêt que tant qu'aucune vraie sonnerie n'a été fournie : le
jour où assets/ringtone.mp3 est remplacé par un enregistrement, il n'a plus
d'objet et peut disparaître avec lui.

Usage :  python3 tools/make-ringtone.py     (nécessite numpy et ffmpeg)
"""
import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "assets" / "ringtone.mp3"

# Marimba : le son d'une lame est une fondamentale plus deux partiels très
# hauts (la lame est creusée pour accorder le 4e harmonique à deux octaves),
# chacun s'éteignant plus vite que le précédent.
PARTIALS = [(1.0, 1.00, 0.42), (4.0, 0.34, 0.22), (9.8, 0.12, 0.12)]


def midi_hz(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def note(midi: float, dur: float, gain: float = 1.0) -> np.ndarray:
    """Une lame frappée : partiels décroissants + le claquement de la mailloche."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = midi_hz(midi)
    out = np.zeros(n)
    for ratio, amp, decay in PARTIALS:
        out += amp * np.sin(2 * math.pi * f * ratio * t) * np.exp(-t / decay)
    # Attaque : un souffle de 4 ms qui donne le bois, sinon le son est trop pur.
    click = np.random.default_rng(int(midi * 97)).standard_normal(n) * np.exp(-t / 0.004)
    out += 0.05 * click
    # Fondu d'entrée d'une milliseconde : évite le clic numérique.
    out[: SR // 1000] *= np.linspace(0, 1, SR // 1000)
    return out * gain


# Le motif — un arpège de mi mineur qui monte, retombe, et se pose sur la
# tonique. Chaque paire est (note MIDI, force).
STEP = 0.135  # durée d'un pas ; ~110 notes/minute, la vivacité d'une sonnerie
PHRASE = [
    (64, 0.9), (67, 0.7), (71, 0.8), (76, 1.0),
    (71, 0.7), (74, 0.85), (71, 0.6), (67, 0.75),
    (64, 0.9), (71, 0.7), (67, 0.8), (64, 1.0),
]
GAP_LOOP = 0.95     # un peu de silence pour finir, plutôt qu'une coupe nette


def phrase() -> np.ndarray:
    span = STEP * len(PHRASE) + 1.0  # +1 s : les dernières lames résonnent encore
    buf = np.zeros(int(SR * span))
    for i, (m, g) in enumerate(PHRASE):
        s = note(m, 1.0, g)
        start = int(SR * STEP * i)
        buf[start : start + len(s)] += s
    return buf


def build() -> np.ndarray:
    out = np.concatenate([phrase(), np.zeros(int(SR * GAP_LOOP))])
    return out / np.max(np.abs(out)) * 0.85


def main() -> int:
    audio = build()
    pcm = (audio * 32767).astype("<i2")
    tmp = OUT.with_suffix(".wav")
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp),
         "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", "44100", str(OUT)],
        check=True,
    )
    tmp.unlink()
    print(f"{OUT} — {len(audio) / SR:.2f} s, {OUT.stat().st_size // 1024} Ko")
    return 0


if __name__ == "__main__":
    sys.exit(main())
