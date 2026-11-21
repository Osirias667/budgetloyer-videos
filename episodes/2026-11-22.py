"""Épisodes du 22 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-22.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « Le défi des 5 dimanches » (défi à refaire chez soi, résultat d'abord : le bocal plein à 150 € dès l'image 1,
puis retour au jour 1 et bocal qui se remplit dimanche après dimanche ; 3 niveaux ; dernière image = « Jour 1 :
aujourd'hui »). Dimanches vérifiés au calendrier (python datetime) : 22 et 29 nov., 6, 13 et 20 déc. 2026.
Calculs : normal 10 + 20 + 30 + 40 + 50 = 150 € ; facile 5 + 10 + 15 + 20 + 25 = 75 € ; boss 20 + 40 + 60 + 80 + 100 = 300 €.
Mention « le Black Friday est passé » au dimanche 29 nov. : Black Friday le vendredi 27 nov. 2026 (connexionfrance.com,
calendrier de apprentissage.md). Aucun autre fait chiffré : défi d'exemple, montants à adapter (indiqué à l'écran).
Mécanismes : « Empty list fills in as you talk » (format en tête de la niche argent) et « finished result flashed before
the process starts » (résultat d'abord), tryvolume.app/working (mesuré le 21 nov. 2026). Sans reprendre de vidéo précise.

Vidéo B : « L'addition arrive » (« tous les groupes de potes quand… », 5 profils numérotés, le n°6 c'est toi).
Montants d'exemple : addition 186 € pour 6, part égale 31 € ; remboursé 31 + 14,50 = 45,50 € ; il manque
186 - 45,50 = 140,50 €. Aucun fait chiffré : histoire inventée (indiqué à l'écran).
Mécanisme : « 'Every [role] when…' niche in-joke text » (8 comptes, 11,6x la médiane), tryvolume.app/trends/2026-11
(mis à jour le 20 nov. 2026). Sans reprendre de vidéo précise.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

assert 10 + 20 + 30 + 40 + 50 == 150 and 5 + 10 + 15 + 20 + 25 == 75 and 20 + 40 + 60 + 80 + 100 == 300
assert abs(186 / 6 - 31) < 1e-9 and abs(186 - (31 + 14.50) - 140.50) < 1e-9

# ---- A : Le défi des 5 dimanches ---------------------------------------------
A = [("hook", 2.8), ("rewind", 2.2), ("dim1", 2.2), ("dim2", 2.2), ("dim3", 2.2), ("dim4", 2.2), ("dim5", 2.2),
     ("resultat", 2.6), ("niveaux", 2.8), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="chiptune_doux", key="E", bpm=122, seed=3837, music=music, cuts=cuts,
              theme="ode_joie", sf2=True)
    m.compose(layers_at=cuts[2], break_at=cuts[8], end_at=cuts[9] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(2, 7):  # pièces qui tombent puis case qui s'allume
        for k in range(3):
            m.tick(cuts[i] + 0.25 + k * 0.13, 0.1)
        m.pop(cuts[i] + 0.5, 0.14)
    m.reveal(cuts[7] + 0.2, good=True)
    m.pop(cuts[7] + 0.5, 0.16)
    for k in range(3):
        m.pop(cuts[8] + 0.15 + k * 0.2, 0.12)
    m.fill(cuts[8] - 0.9, 1.0)
    m.jingle(cuts[9] + 0.15)
    m.end(path)


# ---- B : L'addition arrive ---------------------------------------------------
B = [("hook", 2.8), ("n1", 2.4), ("n2", 2.4), ("n3", 2.4), ("n4", 2.4), ("n5", 2.4), ("n6", 2.8), ("fin", 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="synthwave", key="F", bpm=105, seed=8952, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[6], end_at=cuts[7] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(1, 6):  # bulle puis verdict
        m.pop(cuts[i] + 0.1, 0.12)
        m.pop(cuts[i] + 0.45, 0.14)
    m.reveal(cuts[1] + 0.5, good=True)
    m.reveal(cuts[2] + 0.5, good=True)
    for i in (3, 4, 5):
        m.reveal(cuts[i] + 0.5, good=False)
    for k in range(5):
        m.tick(cuts[6] + 0.3 + k * 0.1, 0.1)
    m.reveal(cuts[6] + 0.9, good=False)
    m.fill(cuts[7] - 1.0, 1.0)
    m.jingle(cuts[7] + 0.15)
    m.end(path)
