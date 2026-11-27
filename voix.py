"""Voix off de personnages BudgetLoyer (demande du propriétaire, 27 nov. 2026 : « voix de personnage »).

Moteur : Kokoro v1.0 (ONNX, licence Apache 2.0) avec la voix française `ff_siwis` (jeu de données SIWIS, CC BY 4.0),
phonétisation française espeak. Chaque personnage a sa propre couleur de voix, obtenue par transposition
(filtre `rubberband` de ffmpeg : hauteur, formants, débit) et de petits effets. Voix générique, aucun clone
d'une personne réelle.

Installation (une fois par session, ~330 Mo, hors dépôt git) :
    pip install --break-system-packages -q kokoro-onnx soundfile
    python3 voix.py install

Utilisation :
    from voix import dire
    wav, duree = dire("decouvert", "Cette année, le réveillon, c'est chez toi.")   # fichier mis en cache
    python3 voix.py demo        # une phrase par personnage dans voix/demo/
"""
import hashlib
import os
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
MOD = os.path.join(ROOT, "voix", "modeles")
CACHE = os.path.join(ROOT, "voix", "cache")
URLS = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}

# Personnage -> réglages. pitch : rapport de hauteur ; formant : 'shifted' (voix cartoon, le timbre suit la hauteur)
# ou 'preserved' ; speed : débit Kokoro ; fx : filtres ffmpeg en plus.
PERSOS = {
    "narrateur": dict(speed=1.08, pitch=1.0, formant="preserved", fx=""),
    "p1": dict(speed=1.12, pitch=1.12, formant="shifted", fx=""),
    "decouvert": dict(speed=1.02, pitch=0.78, formant="shifted", fx="aecho=0.8:0.5:40:0.12"),
    "tata": dict(speed=1.14, pitch=1.07, formant="shifted", fx=""),
    "tonton": dict(speed=1.0, pitch=0.8, formant="shifted", fx=""),
    "cousin": dict(speed=1.15, pitch=0.9, formant="shifted", fx=""),
    "mamie": dict(speed=0.96, pitch=1.09, formant="shifted", fx="vibrato=f=5.5:d=0.12"),
    "frere": dict(speed=1.1, pitch=0.86, formant="shifted", fx=""),
    "sam": dict(speed=1.1, pitch=1.04, formant="preserved", fx=""),
    "objet": dict(speed=1.12, pitch=1.22, formant="shifted", fx=""),
    "objet_grave": dict(speed=1.05, pitch=0.84, formant="shifted", fx=""),
}

_K = None


def install():
    os.makedirs(MOD, exist_ok=True)
    for name, url in URLS.items():
        dst = os.path.join(MOD, name)
        if not os.path.exists(dst):
            print("téléchargement", name)
            urllib.request.urlretrieve(url, dst)


def _kokoro():
    global _K
    if _K is None:
        from kokoro_onnx import Kokoro
        install()
        _K = Kokoro(os.path.join(MOD, "kokoro-v1.0.onnx"), os.path.join(MOD, "voices-v1.0.bin"))
    return _K


def duree(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def dire(perso, texte, out_dir=CACHE):
    """Génère (ou reprend du cache) la réplique `texte` dite par `perso`. Renvoie (chemin_wav, durée_s)."""
    import soundfile as sf
    p = PERSOS[perso]
    key = hashlib.sha1(f"{perso}|{texte}|{sorted(p.items())}".encode()).hexdigest()[:14]
    os.makedirs(out_dir, exist_ok=True)
    dst = os.path.join(out_dir, f"{perso}_{key}.wav")
    if not os.path.exists(dst):
        samples, sr = _kokoro().create(texte, voice="ff_siwis", speed=p["speed"], lang="fr-fr")
        raw = dst + ".raw.wav"
        sf.write(raw, samples, sr)
        af = [f"rubberband=pitch={p['pitch']}:formant={p['formant']}"] if p["pitch"] != 1.0 else []
        if p["fx"]:
            af.append(p["fx"])
        # nettoyage : coupe des silences de bord, présence douce, niveau homogène entre personnages
        af += ["silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03",
               "areverse", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06", "areverse",
               "highpass=f=90", "equalizer=f=3200:t=q:w=1.2:g=2.5",
               "acompressor=threshold=-22dB:ratio=3:attack=5:release=120", "loudnorm=I=-18:TP=-3"]
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", ",".join(af), "-ar", "44100", "-ac", "1",
                        dst], check=True)
        os.remove(raw)
    return dst, duree(dst)


if __name__ == "__main__":
    if sys.argv[1:] == ["install"]:
        install()
    elif sys.argv[1:] == ["demo"]:
        d = os.path.join(ROOT, "voix", "demo")
        for k in PERSOS:
            print(k, dire(k, "Salut, moi c'est ton budget. Cette année, le réveillon, c'est chez toi !", d))
    else:
        sys.exit(__doc__)
