"""Épisodes du 20 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-20.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « Survie · À deux · Épisode 2/2 » (suite promise le 19 nov.).
Rappel épisode 1 : Toi 1 900 €, Sam 1 300 € (exemples), pot commun 1 300 € par mois.
- Fin A, 50/50 : 650 € chacun → il reste Toi 1 250 €, Sam 650 €.
- Fin B, selon les salaires : Toi 1 900/3 200 × 1 300 = 771,88 → 772 € ; Sam 528 € → il reste Toi 1 128 €, Sam 772 €.
- Jour 20, même imprévu dans les deux fins : lave-linge 160 € payé par le pot commun avec la règle choisie.
  A : 80 € / 80 € → Toi 1 170 €, Sam 570 € (écart 600 €).
  B : 160 × 1 900/3 200 = 95 € ; 160 × 1 300/3 200 = 65 € → Toi 1 033 €, Sam 707 € (écart 326 €).
- Vraie fin : aucune règle n'est la bonne pour tout le monde ; la bonne est celle dont on parle avant le jour 1.
Aucun fait chiffré à l'écran : histoire inventée, montants d'exemple (indiqué à l'écran).

Vidéo B : « Secret Santa · Le tirage » (format inédit : ouverture de cartes à rareté, commun → légendaire,
la légendaire étant de tirer son propre nom, ce qui relance le tirage et boucle sur la première image).
Aucun fait chiffré à l'écran : budget de 15 € et prix d'exemple (indiqué à l'écran).
Description seulement : budget de Noël moyen 478 €, prix premier critère d'achat (41 %), enquête Ankorstore révélée
par RTL le 10 nov. 2026, lue sur boursorama.com (13 nov. 2026, rubrique Conso,
« noel-le-budget-moyen-des-francais-en-legere-hausse… »).
Mécanisme : montée de rareté et révélation (« soft launch » : indice puis révélation, socialpilot.co/blog/tiktok-trends,
fenêtre du 17 au 25 nov. 2026), adapté en cartes à collectionner, sans reprendre de vidéo précise.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# ---- A : Survie · À deux · Épisode 2/2 ----------------------------------------
A = [("hook", 2.8), ("fin_a", 3.0), ("fin_b", 3.0), ("imprevu", 2.6), ("compare", 3.4), ("vraie_fin", 2.8),
     ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="bossa", key="D", bpm=124, seed=6724, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[3], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2):  # compteurs qui descendent
        for k in range(4):
            m.tick(cuts[i] + 0.3 + k * 0.2, 0.1)
        m.pop(cuts[i] + 1.2, 0.14)
    m.reveal(cuts[3] + 0.3, good=False)
    m.pop(cuts[4] + 0.2, 0.14)
    m.pop(cuts[4] + 0.45, 0.14)
    m.reveal(cuts[4] + 0.8, good=True)
    m.fill(cuts[5], 1.0)
    m.jingle(cuts[6] + 0.15)
    m.end(path)


# ---- B : Secret Santa · Le tirage ---------------------------------------------
B = [("hook", 2.8), ("carte1", 2.8), ("carte2", 2.8), ("carte3", 3.2), ("suspense", 1.6), ("legendaire", 2.8),
     ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="swing", key="A", bpm=139, seed=6204, music=music, cuts=cuts, theme="roi_montagne",
              sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[4], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3):  # retournement de carte puis prix
        m.pop(cuts[i] + 0.25, 0.14)
        m.reveal(cuts[i] + 0.7, good=(i != 3))
    for k in range(6):  # carte qui tremble
        m.tick(cuts[4] + 0.15 + k * 0.22, 0.12)
    m.reveal(cuts[5] + 0.1, good=False)
    m.pop(cuts[5] + 0.5, 0.16)
    m.fill(cuts[5] + 1.6, 1.0)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
