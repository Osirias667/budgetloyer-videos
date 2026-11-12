"""Moteur musical BudgetLoyer, version 2 (12 nov. 2026).

But (consigne du propriétaire, 12 nov. 2026) : des musiques qui varient d'une vidéo à l'autre
et qui s'améliorent avec le temps. Chaque vidéo reçoit un style, une tonalité, un tempo et une
graine différents, choisis avec `python3 musique.py next` à partir du registre `musique.md`.

Ce qui change par rapport à `chords_music` (v1, accords plaqués + kick, même son partout) :
- 8 styles complets (grille d'accords, groove, instruments, swing) ;
- vrais instruments synthétisés doux : piano électrique, guitare pincée (Karplus-Strong),
  marimba, nappe, basse ronde, balais, shaker, claps feutrés ;
- mélodie composée par motifs (question, réponse, variation), jamais deux fois la même ;
- arrangement qui suit le montage : entrée immédiate, couche ajoutée au milieu,
  respiration avant la carte de fin, résolution sur la tonique ;
- stéréo, réverbération légère, passe-bas 3,5 kHz, compression douce, -20 LUFS (règle audio) ;
- bruitages accordés à la tonalité (pop, tic, révélation), jingle de marque inchangé
  avec la musique qui s'efface dessous pour ne jamais sonner faux.

Usage dans un épisode :
    from musique import Track
    def music_a(total, path, music=True):
        m = Track(total, style="lofi", key="F", bpm=84, seed=1112, music=music, cuts=cuts)
        m.compose()
        m.pop(0.05); m.whoosh(cut); m.reveal(t); m.tick(t); m.jingle(t_logo)
        m.end(path)

Commandes :
    python3 musique.py styles             liste des styles
    python3 musique.py next [n]           propose n réglages qui évitent les 6 dernières musiques
    python3 musique.py demo [dossier]     rend 12 s de chaque style pour écoute
"""
import math
import os
import random
import re
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import butter, lfilter, sosfilt

ENGINE_VERSION = "2.0"
SR = 44100

NOTES = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7,
         "Ab": 8, "A": 9, "Bb": 10, "B": 11}
SCALES = {"major": [0, 2, 4, 5, 7, 9, 11], "minor": [0, 2, 3, 5, 7, 8, 10],
          "dorian": [0, 2, 3, 5, 7, 9, 10], "mixolydian": [0, 2, 4, 5, 7, 9, 10]}


def mfreq(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# --- Styles -------------------------------------------------------------------
# prog / prog_b : degrés (0 = tonique) ; une valeur par mesure.
# Grilles 16 pas : kick, snare (balais/clap), hat (shaker), bass (pas, intervalle en degrés),
# comp (pas, durée en pas). lead : instrument de la mélodie ; density : probabilité de note.
STYLES = {
    "lofi": dict(
        label="Lo-fi chill (piano électrique, balais, swing)", bpm=(78, 88), scale="dorian",
        prog=[0, 3, 6, 4], prog_b=[5, 1, 4, 0], sevenths=True, swing=0.6,
        kick=[0, 7, 10], snare=[4, 12], hat=[2, 6, 10, 14], snare_kind="brush",
        bass=[(0, 0), (7, 0), (10, 4)], comp_inst="epiano", comp=[(0, 6), (8, 2), (11, 5)],
        lead="pluck", density=0.32, octave=5, pad=False, arp=None, energy=0.8, mood="cosy"),
    "jeu_tele": dict(
        label="Jeu télé funky (marimba, claps, basse syncopée)", bpm=(108, 118), scale="mixolydian",
        prog=[0, 3, 0, 4], prog_b=[3, 4, 0, 6], sevenths=False, swing=0.54,
        kick=[0, 6, 8], snare=[4, 12], hat=[2, 6, 10, 14], snare_kind="clap",
        bass=[(0, 0), (3, 0), (6, 4), (8, 0), (11, 2), (14, 4)], comp_inst="epiano", comp=[(2, 1), (6, 1), (10, 1), (14, 1)],
        lead="marimba", density=0.5, octave=5, pad=False, arp=None, energy=1.0, mood="quiz"),
    "synthwave": dict(
        label="Synthwave douce (nappe, arpège triangle, kick régulier)", bpm=(96, 106), scale="minor",
        prog=[0, 5, 2, 6], prog_b=[3, 5, 6, 4], sevenths=False, swing=0.5,
        kick=[0, 4, 8, 12], snare=[4, 12], hat=[2, 6, 10, 14], snare_kind="clap",
        bass=[(0, 0), (2, 0), (4, 0), (6, 0), (8, 0), (10, 0), (12, 0), (14, 0)], comp_inst=None, comp=[],
        lead="tri", density=0.28, octave=5, pad=True, arp="up16", energy=0.9, mood="retro"),
    "bossa": dict(
        label="Bossa nova (guitare pincée, basse 1-5, shaker)", bpm=(124, 134), scale="major",
        prog=[1, 4, 0, 0], prog_b=[3, 2, 1, 4], sevenths=True, swing=0.5,
        kick=[0, 6, 8, 14], snare=[], hat=list(range(0, 16, 2)), snare_kind="brush",
        bass=[(0, 0), (6, 4), (8, 4), (14, 0)], comp_inst="pluck", comp=[(0, 2), (3, 2), (6, 2), (10, 2), (13, 2)],
        lead="epiano", density=0.25, octave=5, pad=False, arp=None, energy=0.75, mood="soleil"),
    "swing": dict(
        label="Jazz swing léger (basse marchante, balais, piano)", bpm=(132, 148), scale="major",
        prog=[0, 5, 1, 4], prog_b=[2, 5, 1, 4], sevenths=True, swing=0.66,
        kick=[0, 8], snare=[4, 12], hat=[0, 4, 6, 8, 12, 14], snare_kind="brush",
        bass="walk", comp_inst="epiano", comp=[(6, 2), (14, 2)],
        lead="vibes", density=0.38, octave=5, pad=False, arp=None, energy=0.85, mood="malin"),
    "chiptune_doux": dict(
        label="Chiptune doux (triangles, arpèges rapides, jeu vidéo)", bpm=(116, 126), scale="major",
        prog=[0, 4, 5, 3], prog_b=[3, 4, 5, 4], sevenths=False, swing=0.5,
        kick=[0, 8], snare=[4, 12], hat=[2, 6, 10, 14], snare_kind="clap",
        bass=[(0, 0), (4, 0), (8, 0), (12, 4)], comp_inst=None, comp=[],
        lead="tri", density=0.55, octave=5, pad=False, arp="tri8", energy=0.95, mood="jeu"),
    "house_light": dict(
        label="House légère (kick 4 temps, basse en contretemps, nappe pompée)", bpm=(118, 124), scale="dorian",
        prog=[0, 0, 3, 3], prog_b=[5, 4, 0, 3], sevenths=True, swing=0.5,
        kick=[0, 4, 8, 12], snare=[4, 12], hat=[2, 6, 10, 14], snare_kind="clap",
        bass=[(2, 0), (6, 0), (10, 0), (14, 0)], comp_inst="epiano", comp=[(2, 1), (6, 1), (10, 1), (14, 1)],
        lead="marimba", density=0.22, octave=5, pad=True, arp=None, energy=0.95, mood="énergie", pump=True),
    "suspense": dict(
        label="Suspense doux (pulsation, nappe, cloches)", bpm=(92, 100), scale="minor",
        prog=[0, 0, 5, 4], prog_b=[0, 5, 3, 4], sevenths=False, swing=0.5,
        kick=[0, 8], snare=[], hat=list(range(0, 16, 2)), snare_kind="brush",
        bass=[(0, 0), (3, 0), (6, 0), (8, 0), (11, 0), (14, 0)], comp_inst=None, comp=[],
        lead="vibes", density=0.2, octave=5, pad=True, arp="pulse", energy=0.7, mood="cliffhanger"),
}
KEYS = ["C", "D", "Eb", "E", "F", "G", "A", "Bb"]


# --- Instruments (doux : sinus, triangle, FM léger) ------------------------------
def _x(l):
    return np.arange(int(l * SR)) / SR


def _env(x, a=0.006, d=3.0, rel=0.04, l=None):
    e = np.minimum(1, x / a) * np.exp(-x * d)
    if l is not None:
        n = int(rel * SR)
        if 0 < n < len(e):
            e[-n:] *= np.linspace(1, 0, n)
    return e


def inst_epiano(f, l, v=1.0):
    x = _x(l + 0.25)
    mod = 1.1 * np.exp(-x * 6) * np.sin(2 * np.pi * f * x)
    s = np.sin(2 * np.pi * f * x + mod) + 0.22 * np.sin(4 * np.pi * f * x) * np.exp(-x * 5)
    s *= 1 + 0.08 * np.sin(2 * np.pi * 4.5 * x)  # trémolo
    return s * _env(x, 0.004, 1.6, 0.12, l) * v


def inst_pluck(f, l, v=1.0, seed=0):
    """Guitare pincée Karplus-Strong, calculée par blocs (rapide)."""
    n = int((min(l, 0.9) + 0.3) * SR)
    N = max(2, int(SR / f))
    rng = np.random.default_rng(seed)
    exc = rng.uniform(-1, 1, N)
    exc = np.convolve(exc, np.ones(4) / 4, mode="same")
    y = np.zeros(n + N + 1)
    y[1:N + 1] = exc
    g = 0.996
    for a in range(N + 1, n + N + 1, N):
        b = min(a + N, n + N + 1)
        y[a:b] = 0.5 * g * (y[a - N:b - N] + y[a - N - 1:b - N - 1])
    y = y[1:n + 1]
    y *= _env(np.arange(n) / SR, 0.002, 1.2, 0.05, l)
    return y / (np.max(np.abs(y)) + 1e-9) * 0.9 * v


def inst_marimba(f, l, v=1.0):
    x = _x(min(l, 0.6) + 0.2)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 7) + 0.3 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 22)
    return s * np.minimum(1, x / 0.002) * v


def inst_vibes(f, l, v=1.0):
    x = _x(l + 0.5)
    s = np.sin(2 * np.pi * f * x) + 0.18 * np.sin(2 * np.pi * 3.9 * f * x) * np.exp(-x * 8)
    s *= 1 + 0.18 * np.sin(2 * np.pi * 5.5 * x)
    return s * _env(x, 0.003, 1.4, 0.2, l + 0.5) * v


def inst_tri(f, l, v=1.0):
    x = _x(l)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * x) * np.minimum(1, np.maximum(0, x - 0.15) / 0.2)
    ph = np.cumsum(f * vib) / SR
    s = (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * ph))
    e = np.minimum(1, x / 0.012) * (0.75 + 0.25 * np.exp(-x * 6))
    n = int(0.05 * SR)
    if n < len(e):
        e[-n:] *= np.linspace(1, 0, n)
    return s * e * v


def inst_pad(f, l, v=1.0):
    x = _x(l + 0.4)
    s = sum(np.sin(2 * np.pi * f * k * x + p) for k, p in ((1.0, 0), (1.004, 1.3), (0.996, 2.1)))
    s = s / 3 + 0.2 * np.sin(4 * np.pi * f * x)
    e = np.minimum(1, x / 0.35)
    n = int(0.4 * SR)
    e[-n:] *= np.linspace(1, 0, n)
    return s * e * v


def inst_bass(f, l, v=1.0):
    x = _x(l)
    s = np.sin(2 * np.pi * f * x) + 0.35 * (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f * x)) + 0.12 * np.sin(4 * np.pi * f * x)
    e = np.minimum(1, x / 0.005) * (0.55 + 0.45 * np.exp(-x * 9))
    n = min(len(e), int(0.03 * SR))
    e[-n:] *= np.linspace(1, 0, n)
    return s * e * v


def drum_kick():
    x = _x(0.22)
    return np.sin(2 * np.pi * (48 * x + 38 * (1 - np.exp(-x * 30)) / 30)) * np.exp(-x * 16)


def _noise(l, seed):
    return np.random.default_rng(seed).normal(0, 1, int(l * SR))


def _band(sig, lo, hi):
    return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), sig)


def drum_brush(seed=0):
    x = _x(0.18)
    n = _band(_noise(0.18, seed), 900, 3200)
    return n * np.exp(-x * 18) * np.minimum(1, x / 0.01) * 0.6


def drum_clap(seed=0):
    x = _x(0.2)
    n = _band(_noise(0.2, seed), 900, 2600)
    e = np.zeros_like(x)
    for k in (0, 0.012, 0.024):
        e += (x >= k) * np.exp(-np.maximum(0, x - k) * 45)
    body = np.sin(2 * np.pi * 190 * x) * np.exp(-x * 30) * 0.4
    return (n * e * 0.5 + body) * 0.8


def drum_shaker(seed=0):
    x = _x(0.07)
    n = _band(_noise(0.07, seed), 2200, 3400)
    return n * np.sin(np.pi * x / 0.07) ** 2 * 0.5


INSTS = {"epiano": inst_epiano, "pluck": inst_pluck, "marimba": inst_marimba, "vibes": inst_vibes,
         "tri": inst_tri, "pad": inst_pad, "bass": inst_bass}


# --- Piste ----------------------------------------------------------------------
class Track:
    """Musique + bruitages en stéréo, même interface que SoftMix (pop, whoosh, jingle, add, end)."""

    def __init__(s, total, style="lofi", key="C", bpm=None, seed=0, music=True, cuts=None):
        s.total, s.music, s.seed = total, music, seed
        s.st = STYLES[style]
        s.style, s.key = style, key
        lo, hi = s.st["bpm"]
        s.bpm = bpm or random.Random(seed).randint(lo, hi)
        s.beat = 60 / s.bpm
        s.step = s.beat / 4
        s.bar = s.beat * 4
        s.cuts = cuts or []
        s.root = 48 + NOTES[key]  # tonique à l'octave 3
        s.scale = SCALES[s.st["scale"]]
        n = int((total + 2) * SR)
        s.mus = np.zeros((2, n))
        s.rev = np.zeros((2, n))
        s.sfx = np.zeros((2, n))
        s.duck = np.ones(n)
        s.pump = np.ones(n)
        s.rng = random.Random(seed)

    # -- théorie
    def deg(s, d, octave=0):
        """Degré de gamme (peut dépasser 7) vers note MIDI."""
        o, i = divmod(d, 7)
        return s.root + 12 * (o + octave) + s.scale[i]

    def chord(s, d, sev=None):
        sev = s.st["sevenths"] if sev is None else sev
        ds = [d, d + 2, d + 4] + ([d + 6] if sev else [])
        return [s.deg(k, 1) for k in ds]

    # -- placement
    def t_of(s, bar, step):
        """Temps d'un pas de double croche, avec swing sur les contretemps."""
        t = bar * s.bar + step * s.step
        if step % 2 == 1:
            t += (s.st["swing"] - 0.5) * 2 * s.step
        return t

    def _put(s, buf, sig, at, g, pan=0.0, send=0.0):
        a = int(at * SR)
        if a < 0:
            sig, a = sig[-a:], 0
        e = min(buf.shape[1], a + len(sig))
        if a >= e:
            return
        L, R = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
        buf[0, a:e] += sig[: e - a] * g * L * 1.414
        buf[1, a:e] += sig[: e - a] * g * R * 1.414
        if send and buf is s.mus:
            s.rev[0, a:e] += sig[: e - a] * g * send
            s.rev[1, a:e] += sig[: e - a] * g * send

    def note(s, inst, m, at, l, g, pan=0.0, send=0.15):
        if not s.music:
            return
        v = 0.85 + 0.3 * s.rng.random()  # humanisation
        at += s.rng.uniform(-0.006, 0.006)
        f = mfreq(m)
        sig = inst_pluck(f, l, v, s.rng.randint(0, 9999)) if inst == "pluck" else INSTS[inst](f, l, v)
        s._put(s.mus, sig, at, g, pan, send)

    # -- composition
    def melody_phrase(s, chords_deg, n_bars):
        """Phrase de n mesures : notes de l'accord sur les temps forts, mouvement conjoint ailleurs."""
        dens = s.st["density"]
        out, cur = [], s.rng.choice([2, 4, 7])
        for b in range(n_bars):
            cd = chords_deg[b % len(chords_deg)]
            tones = [cd % 7, (cd + 2) % 7, (cd + 4) % 7]
            st = 0
            while st < 16:
                strong = st % 4 == 0
                p = dens * (1.6 if strong else (0.9 if st % 2 == 0 else 0.45))
                if s.rng.random() < p:
                    if strong:
                        cands = [c + 7 * k for c in tones for k in (0, 1) if abs(c + 7 * k - cur) <= 4]
                        cur = s.rng.choice(cands) if cands else cur
                    else:
                        cur += s.rng.choice([-2, -1, -1, 1, 1, 2])
                    cur = max(0, min(11, cur))
                    ln = s.rng.choice([2, 2, 3, 4]) if strong else s.rng.choice([1, 2, 2])
                    out.append((b, st, cur, ln))
                    st += ln
                else:
                    st += 1
        return out

    def compose(s, layers_at=None, break_at=None, end_at=None):
        """Compose et place la musique.

        layers_at : temps où la 2e couche entre (par défaut au milieu) ;
        break_at  : respiration (batterie coupée) jusqu'à end_at ;
        end_at    : fin de la musique (ex. moment du jingle) : résolution sur la tonique.
        """
        if not s.music:
            return
        st = s.st
        end_at = end_at or s.total
        layers_at = layers_at if layers_at is not None else s.total * 0.45
        nbars = int(math.ceil(end_at / s.bar)) + 1
        prog_a, prog_b = st["prog"], st["prog_b"]
        motif = s.melody_phrase(prog_a, 2)
        answer = s.melody_phrase(prog_a[2:] + prog_a[:2], 2)
        variant = motif[: len(motif) // 2] + s.melody_phrase(prog_b, 2)[len(motif) // 2:]
        phrases = [motif, answer, motif, variant]
        kick = drum_kick()
        for bar in range(nbars):
            t0 = bar * s.bar
            if t0 >= end_at:
                break
            section_b = (bar // 4) % 2 == 1 and t0 >= layers_at
            prog = prog_b if section_b else prog_a
            cd = prog[bar % 4]
            chord = s.chord(cd)
            layer2 = t0 >= layers_at
            brk = break_at is not None and t0 >= break_at
            last = t0 + s.bar >= end_at
            if last:
                chord, cd = s.chord(0), 0
            # accompagnement
            if st["comp_inst"] and not last:
                for stp, ln in st["comp"]:
                    for k, m in enumerate(chord):
                        s.note(st["comp_inst"], m, s.t_of(bar, stp) + k * 0.004, ln * s.step, 0.08,
                               pan=-0.25 + 0.15 * k, send=0.22)
            if st["pad"]:
                for k, m in enumerate(chord[:3]):
                    s.note("pad", m, t0, s.bar * (2 if last else 1), 0.05, pan=(-0.5, 0.5, 0)[k], send=0.3)
            if st["arp"] and not brk and not last:
                if st["arp"] == "up16":
                    for i in range(16):
                        s.note("tri", chord[i % 3] + 12 * ((i // 3) % 2), s.t_of(bar, i), s.step * 0.9, 0.035,
                               pan=0.35, send=0.2)
                elif st["arp"] == "tri8":
                    for i in range(0, 16, 2):
                        s.note("tri", chord[(i // 2) % 3] + 12, s.t_of(bar, i), s.step * 1.6, 0.04, pan=-0.3)
                elif st["arp"] == "pulse":
                    for i in range(0, 16, 2):
                        s.note("marimba", chord[0] + 12, s.t_of(bar, i), s.step, 0.05, pan=0.2)
            # basse
            if last:
                s.note("bass", s.deg(0, -1), t0, s.bar, 0.22)
            elif st["bass"] == "walk":
                nxt = prog[(bar + 1) % 4]
                walk = [s.deg(cd, -1), s.deg(cd + 2, -1), s.deg(cd + 4, -1), s.deg(nxt, -1) + s.rng.choice([-1, 1])]
                for i, m in enumerate(walk):
                    s.note("bass", m, s.t_of(bar, i * 4), s.beat * 0.9, 0.22, send=0.05)
            else:
                bg = 0.22 * min(1.0, (4 / len(st["bass"])) ** 0.5)
                for stp, iv in st["bass"]:
                    s.note("bass", s.deg(cd + iv, -1), s.t_of(bar, stp), s.step * 1.8, bg, send=0.05)
            # batterie
            if not brk and not last:
                for stp in st["kick"]:
                    at = s.t_of(bar, stp)
                    s._put(s.mus, kick, at, 0.34)
                    if st.get("pump"):
                        a = int(at * SR)
                        n = int(s.beat * 0.6 * SR)
                        if a + n < len(s.pump):
                            s.pump[a:a + n] = np.minimum(s.pump[a:a + n], 0.55 + 0.45 * np.linspace(0, 1, n))
                for stp in st["snare"]:
                    sn = drum_clap(bar * 16 + stp) if st["snare_kind"] == "clap" else drum_brush(bar * 16 + stp)
                    s._put(s.mus, sn, s.t_of(bar, stp), 0.22, pan=0.1, send=0.25)
                if layer2 or st["energy"] >= 0.9:
                    for stp in st["hat"]:
                        s._put(s.mus, drum_shaker(bar * 31 + stp), s.t_of(bar, stp), 0.12 + 0.04 * (stp % 4 == 2),
                               pan=0.4)
            # mélodie : phrases en AABA', plus discrète pendant la respiration
            if not last:
                ph = phrases[(bar // 2) % 4]
                for (b, stp, d, ln) in ph:
                    if b != bar % 2:
                        continue
                    m = s.deg(d, 1 + (st["octave"] - 5))
                    s.note(st["lead"], m, s.t_of(bar, stp), ln * s.step, 0.15 * (0.6 if brk else 1), pan=0.15, send=0.3)
                # contre-chant en 2e couche : tierce au-dessus, une note sur deux
                if layer2 and not brk:
                    for k, (b, stp, d, ln) in enumerate(ph):
                        if b == bar % 2 and k % 2 == 0:
                            s.note("vibes" if st["lead"] != "vibes" else "epiano", s.deg(d + 2, 1), s.t_of(bar, stp),
                                   ln * s.step, 0.045, pan=-0.4, send=0.35)
            else:
                s.note(st["lead"], s.deg(7, 0), t0, s.bar, 0.1, send=0.4)

    # -- bruitages (accordés à la tonalité)
    def add(s, sig, at, g):
        s._put(s.sfx, sig, at, g)

    def pop(s, at, g=0.22):
        x = _x(0.09)
        f = 520 + 380 * np.exp(-x * 40)
        s.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 35), at, g)

    def whoosh(s, at, g=0.12, l=0.35):
        x = _x(l)
        n = np.convolve(np.random.default_rng(int(at * 100)).normal(0, 1, len(x)), np.ones(24) / 24, mode="same")
        s.add(n * np.sin(np.pi * x / l) ** 2, at - l / 2, g)

    def tick(s, at, g=0.16):
        """Tic de compte à rebours sur la quinte de la tonalité."""
        x = _x(0.08)
        s.add(np.sin(2 * np.pi * mfreq(s.deg(4, 2)) * x) * np.exp(-x * 20), at, g)

    def reveal(s, at, g=0.28, good=True):
        """Arpège de révélation sur l'accord de tonique (ou sous-dominante si `good` est faux)."""
        d0 = 0 if good else 3
        for j, k in enumerate((0, 2, 4)):
            x = _x(0.3)
            f = mfreq(s.deg(d0 + k, 2))
            s.add(np.sin(2 * np.pi * f * x) * np.exp(-x * 8) * np.minimum(1, x / 0.003), at + j * 0.08, g)

    def jingle(s, at, g=0.3):
        """Signature BudgetLoyer inchangée (do, mi, sol, do aigu) ; la musique s'efface dessous."""
        for k, f in enumerate((523.3, 659.3, 784.0)):
            x = _x(0.5)
            sig = (np.sin(2 * np.pi * f * x) * np.exp(-x * 5) + 0.3 * np.sin(4 * np.pi * f * x) * np.exp(-x * 8))
            s.add(sig * np.minimum(1, x / 0.004), at + k * 0.11, g)
        x = _x(0.7)
        f = 1046.5
        s.add((np.sin(2 * np.pi * f * x) * np.exp(-x * 4) + 0.2 * np.sin(3 * np.pi * f * x) * np.exp(-x * 7)) *
              np.minimum(1, x / 0.004), at + 0.33, g * 0.9)
        a, b = int((at - 0.2) * SR), int((at + 1.2) * SR)
        a = max(0, a)
        n = int(0.2 * SR)
        s.duck[a:a + n] = np.minimum(s.duck[a:a + n], np.linspace(1, 0.12, n))
        s.duck[a + n:b] = np.minimum(s.duck[a + n:b], 0.12)

    # -- mixage
    def _reverb(s, x):
        out = np.zeros_like(x)
        for ch in range(2):
            src = sosfilt(butter(2, 2500, fs=SR, output="sos"), x[ch])
            acc = np.zeros_like(src)
            for ms, fb in ((29.7, 0.78), (37.1, 0.77), (41.1, 0.76), (43.7, 0.75)):
                dl = int(ms * SR / 1000) + ch * 23
                den = np.zeros(dl + 1)
                den[0], den[dl] = 1, -fb
                acc += lfilter([1], den, src)
            for ms, g in ((5.0, 0.7), (1.7, 0.7)):
                dl = int(ms * SR / 1000)
                num = np.zeros(dl + 1)
                den = np.zeros(dl + 1)
                num[0], num[dl] = -g, 1
                den[0], den[dl] = 1, -g
                acc = lfilter(num, den, acc)
            out[ch] = acc * 0.12
        return out

    def end(s, path):
        n = int(s.total * SR)
        mus = (s.mus + s._reverb(s.rev)) * s.pump
        k = np.convolve(s.duck, np.ones(2000) / 2000, mode="same")
        mix = (mus * k + s.sfx)[:, :n]
        sos = butter(2, 3500, fs=SR, output="sos")
        mix = sosfilt(sos, mix, axis=1)
        mix = sosfilt(butter(1, 35, btype="high", fs=SR, output="sos"), mix, axis=1)
        mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.4) / np.tanh(1.4) * 0.7
        fade = int(0.35 * SR)
        mix[:, -fade:] *= np.linspace(1, 0, fade)
        tmp = path + ".raw.wav"
        with wave.open(tmp, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
        subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af",
                               "acompressor=threshold=-24dB:ratio=2.5:attack=8:release=180,"
                               "loudnorm=I=-20:TP=-3:LRA=5", "-ar", "44100", path])
        os.remove(tmp)


# --- Registre et choix du réglage suivant --------------------------------------
def journal_musique(path=None):
    """Lit le tableau de musique.md : [(date, vidéo, style, tonalité, bpm, graine, version)]."""
    path = path or os.path.join(os.path.dirname(os.path.abspath(__file__)), "musique.md")
    rows = []
    if not os.path.exists(path):
        return rows
    for line in open(path, encoding="utf-8"):
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) >= 7 and re.match(r"\d{4}-\d{2}-\d{2}", c[0]):
            rows.append(c)
    return rows


def suggest(n=2, recent=6):
    rows = journal_musique()
    last = rows[-recent:]
    used_styles = [r[2] for r in last]
    used_keys = [r[3] for r in rows[-4:]]
    rng = random.Random(len(rows) * 7 + 3)
    styles = [k for k in STYLES if k not in used_styles] or list(STYLES)
    rng.shuffle(styles)
    out = []
    for st in styles[:n]:
        keys = [k for k in KEYS if k not in used_keys] or KEYS
        key = rng.choice(keys)
        used_keys.append(key)
        lo, hi = STYLES[st]["bpm"]
        out.append((st, key, rng.randint(lo, hi), rng.randint(1000, 9999)))
    return out


def demo(folder="demo_musique"):
    os.makedirs(folder, exist_ok=True)
    for i, st in enumerate(STYLES):
        t = Track(12.0, style=st, key=KEYS[i % len(KEYS)], seed=100 + i)
        t.compose(end_at=10.6)
        t.pop(0.05)
        t.reveal(5.0)
        t.jingle(10.6)
        t.end(f"{folder}/{i + 1:02d}_{st}.wav")
        print(f"{folder}/{i + 1:02d}_{st}.wav  {t.key} {t.bpm} bpm")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "styles"
    if cmd == "styles":
        for k, v in STYLES.items():
            print(f"{k:15s} {v['bpm'][0]}-{v['bpm'][1]} bpm  {v['label']}  [{v['mood']}]")
    elif cmd == "next":
        for st, key, bpm, seed in suggest(int(sys.argv[2]) if len(sys.argv) > 2 else 2):
            print(f"style={st} key={key} bpm={bpm} seed={seed}")
    elif cmd == "demo":
        demo(sys.argv[2] if len(sys.argv) > 2 else "demo_musique")
