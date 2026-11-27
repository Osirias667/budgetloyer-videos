"""Rendu d'un épisode avec Remotion (moteur vidéo principal depuis le 18 nov. 2026, décision du propriétaire).

Le fichier Python de l'épisode garde le découpage (liste de scènes `(fonction ou nom, durée en s)`) et la musique
(`musique.py`) ; la composition Remotion (remotion/src/episodes/…) reçoit ces durées et la piste audio en props.

    python3 outils/rendu_remotion.py render episodes/2026-11-18.py A music_a3 gta6-compteur-heure \
        budgetloyer_gta6_compteur_heure [dossier_sortie]
    python3 outils/rendu_remotion.py stills episodes/2026-11-18.py A gta6-compteur-heure 0,90,300 [dossier]

Si l'épisode définit `<VAR>_PROPS` (dict), ses clés sont ajoutées aux props (ex. répliques de la voix off).
`stills` rend des images à pleine taille (l'image 0 doit montrer l'accroche complète) sans musique.
Installation (une fois par session) : voir remotion/README.md.
"""
import glob
import importlib.util
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RM = os.path.join(ROOT, "remotion")
sys.path.insert(0, ROOT)


def browser():
    """Chromium déjà présent dans l'environnement (évite le téléchargement par Remotion)."""
    for pat in ("/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell",
                os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/"
                                   "chrome-headless-shell")):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def load(ep):
    spec = importlib.util.spec_from_file_location("episode", os.path.abspath(ep))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def durations(mod, var):
    return [float(d) for _, d in getattr(mod, var)]


def npx(args):
    b = browser()
    cmd = ["npx", "remotion"] + args + (["--browser-executable", b] if b else []) + ["--log", "error"]
    subprocess.check_call(cmd, cwd=RM)


def render(ep, var, music_fn, comp, name, out_dir="."):
    mod = load(ep)
    durs = durations(mod, var)
    total = sum(durs)
    os.makedirs(os.path.join(RM, "public", "audio"), exist_ok=True)
    wav = os.path.join(RM, "public", "audio", name + ".wav")
    getattr(mod, music_fn)(total, wav)
    props = json.dumps({"durations": durs, "audio": f"audio/{name}.wav", **getattr(mod, var + "_PROPS", {})})
    tmp = os.path.join(RM, "out", name + ".mp4")
    os.makedirs(os.path.dirname(tmp), exist_ok=True)
    npx(["render", "src/index.ts", comp, tmp, "--props", props, "--codec", "h264", "--crf", "20",
         "--audio-codec", "aac"])
    dst = os.path.join(os.path.abspath(out_dir), name + ".mp4")
    shutil.move(tmp, dst)
    print(dst)
    return dst


def stills(ep, var, comp, frames, out_dir="stills"):
    mod = load(ep)
    props = json.dumps({"durations": durations(mod, var), **getattr(mod, var + "_PROPS", {})})
    os.makedirs(out_dir, exist_ok=True)
    for fr in frames:
        dst = os.path.join(os.path.abspath(out_dir), f"{comp}_{fr}.png")
        npx(["still", "src/index.ts", comp, dst, "--frame", str(fr), "--props", props])
        print(dst)


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[0] == "render":
        render(*a[1:])
    elif a[0] == "stills":
        stills(a[1], a[2], a[3], [int(x) for x in a[4].split(",")], *(a[5:6] or []))
    else:
        sys.exit(__doc__)
