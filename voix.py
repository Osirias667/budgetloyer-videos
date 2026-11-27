"""Voix off de personnages BudgetLoyer (demande du propriétaire, 27 nov. 2026 : « voix de personnage »).

Moteurs : 1) ElevenLabs (voix premium, très humaines) si la variable ELEVENLABS_API_KEY est définie et que la session
autorise api.elevenlabs.io ; 2) sinon Kokoro v1.0 (ONNX, licence Apache 2.0), voix française `ff_siwis` (SIWIS,
CC BY 4.0) mélangée à d'autres styles Kokoro pour donner à chaque personnage son timbre (sans transposition).
Voix génériques, aucun clone d'une personne réelle.

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

# Personnage -> réglages (v2, 27 nov. 2026, retour du propriétaire : « pas réalistes », Mamie muette).
# Plus de transposition (effet robot) : chaque voix est un mélange de styles Kokoro autour de la voix française
# `ff_siwis` (phonétique toujours française ; les styles étrangers donnent un timbre et un léger accent propres au
# personnage, ce que le propriétaire accepte : « tu peux être original même sur les accents »).
# `eleven` : identifiant de voix ElevenLabs utilisé à la place si ELEVENLABS_API_KEY est défini (voix premium).
PERSOS = {
    "narrateur": dict(mix=[("ff_siwis", 1.0)], speed=1.05, eleven="XB0fDUnXU5powFXDhCwa"),
    "decouvert": dict(mix=[("ff_siwis", 0.4), ("am_onyx", 0.6)], speed=1.0, eleven="JBFqnCBsd6RMkjVDRZzb"),
    "p1": dict(mix=[("ff_siwis", 0.5), ("bm_lewis", 0.5)], speed=1.1, eleven="N2lVS1w4EtoT3dr4eOWO"),
    "tata": dict(mix=[("ff_siwis", 0.6), ("pf_dora", 0.4)], speed=1.1, eleven="XrExE9yKIg1WjnnlVkGX"),
    "mamie": dict(mix=[("ff_siwis", 0.6), ("if_sara", 0.4)], speed=0.9, eleven="pFZP5JQG7iQjIQuC4Bf"),
    "tonton": dict(mix=[("ff_siwis", 0.4), ("em_santa", 0.6)], speed=1.0, eleven="pqHfZKP75CvOlQylNhV4"),
    "cousin": dict(mix=[("ff_siwis", 0.5), ("em_alex", 0.5)], speed=1.12, eleven="nPczCjzI2devNBz1zQrb"),
    "frere": dict(mix=[("ff_siwis", 0.4), ("pm_alex", 0.6)], speed=1.08, eleven="onwK4e9ZLuTAKqWW03F9"),
    "sam": dict(mix=[("ff_siwis", 0.7), ("af_heart", 0.3)], speed=1.08, eleven="XrExE9yKIg1WjnnlVkGX"),
    "objet": dict(mix=[("ff_siwis", 0.6), ("af_sky", 0.4)], speed=1.12, eleven="XB0fDUnXU5powFXDhCwa"),
    "objet_grave": dict(mix=[("ff_siwis", 0.5), ("im_nicola", 0.5)], speed=1.02, eleven="onwK4e9ZLuTAKqWW03F9"),
}

_K = None
ECHECS = []  # répliques où ElevenLabs a échoué (repli Kokoro) : à noter dans le journal


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


def _eleven(voice_id, texte, out):
    """Voix premium ElevenLabs (modèle multilingue). Clé : secret réseau de l'environnement (en-tête xi-api-key sur
    api.elevenlabs.io, recommandé) ou variable ELEVENLABS_API_KEY."""
    import json
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128",
        data=json.dumps({"text": texte, "model_id": "eleven_multilingual_v2", "language_code": "fr",
                         "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35}}).encode(),
        headers={"Content-Type": "application/json",
                 **({"xi-api-key": os.environ["ELEVENLABS_API_KEY"]} if os.environ.get("ELEVENLABS_API_KEY") else {})})
    mp3 = out + ".mp3"
    with urllib.request.urlopen(req, timeout=120) as r, open(mp3, "wb") as fh:
        fh.write(r.read())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, out], check=True)
    os.remove(mp3)


def _silencieux(path):
    out = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True,
                         text=True).stderr
    for ln in out.splitlines():
        if "mean_volume" in ln:
            return float(ln.split(":")[1].split()[0]) < -45
    return True


def duree(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def dire(perso, texte, out_dir=CACHE):
    """Génère (ou reprend du cache) la réplique `texte` dite par `perso`. Renvoie (chemin_wav, durée_s).
    Lève une erreur si la voix sort vide (contrôle ajouté après la voix muette de Mamie, 27 nov. 2026)."""
    import soundfile as sf
    p = PERSOS[perso]
    # ElevenLabs si la clé est en variable, ou (recommandé) si elle est en « secret réseau » de l'environnement
    # (en-tête xi-api-key ajouté par le proxy, la clé ne touche pas la machine) et que VOIX_MOTEUR=eleven.
    moteur = "eleven" if os.environ.get("ELEVENLABS_API_KEY") or os.environ.get("VOIX_MOTEUR") == "eleven" else "kokoro"
    key = hashlib.sha1(f"{moteur}|{perso}|{texte}|{sorted(p.items())}".encode()).hexdigest()[:14]
    os.makedirs(out_dir, exist_ok=True)
    dst = os.path.join(out_dir, f"{perso}_{key}.wav")
    if not os.path.exists(dst):
        raw = dst + ".raw.wav"
        ok = False
        if moteur == "eleven" and p.get("eleven"):
            try:
                _eleven(p["eleven"], texte, raw)
                ok = True
            except Exception as e:  # réseau bloqué, clé absente ou voix inconnue : repli Kokoro, à signaler au journal
                print(f"[voix] ElevenLabs indisponible ({e}) : repli sur Kokoro pour {perso}", file=sys.stderr)
                ECHECS.append(f"{perso}: {e}")
        if not ok:
            import numpy as np
            k = _kokoro()
            style = sum(w * k.get_voice_style(v) for v, w in p["mix"])
            samples, sr = k.create(texte, voice=style, speed=p["speed"], lang="fr-fr")
            sf.write(raw, np.asarray(samples, dtype=np.float32), sr)
        # nettoyage : silences de bord coupés, présence douce, niveau homogène entre personnages (aucune transposition)
        af = ["silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03",
              "areverse", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06", "areverse",
              "highpass=f=80", "equalizer=f=3000:t=q:w=1.2:g=2",
              "acompressor=threshold=-22dB:ratio=2.5:attack=5:release=120", "loudnorm=I=-18:TP=-3"]
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", ",".join(af), "-ar", "44100", "-ac", "1",
                        dst], check=True)
        os.remove(raw)
        if duree(dst) < 0.2 or _silencieux(dst):
            os.remove(dst)
            raise RuntimeError(f"voix vide pour {perso} : {texte!r}")
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
