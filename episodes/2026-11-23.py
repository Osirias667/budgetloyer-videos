"""Épisodes du 23 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-23.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « POV : tu es Monsieur Découvert » (format inédit de la semaine : POV du méchant récurrent, 4 pièges
numérotés, n°4 caché jusqu'à la révélation, retournement « …sauf que tu regardes », dernière réplique « J-8… je reviens
le mois prochain » qui renvoie au « J-8 » de l'image 1). Aucun fait chiffré : montants d'exemple.
Calculs : 214 - 13 = 201 ; 3 € × 8 jours = 24 € → 201 - 24 = 177 ; 177 - 27 = 150 ; 214 € ÷ 8 jours = 26,75 €/jour.
Mécanisme : « POV: you're the villain but… » (+250 %, nouveau, semaine du 16 au 22 nov.) et accroche POV, meilleur taux
de réussite des accroches (32,9 % de 50 416 TikTok), virlo.ai/trending-on-tiktok-this-week (mis à jour le 22 nov. 2026).
Sans reprendre de vidéo précise.

Vidéo B : « Survie · Étudiant · Épisode 1/2 » (4e saison de la mécanique Survie). Décembre, budget étudiant, 320 €
après le loyer, 31 jours. Jours restants = 32 - jour. Montants d'exemple :
J1 320 € / 31 j = 10,32 €/j ; J3 manuel B occasion -15 € → 305 € / 29 j = 10,52 € ; J6 raclette A -8 € → 297 € / 26 j
= 11,42 € ; J9 soirée A -25 € → 272 € / 23 j = 11,83 € ; J12 courses -60 € → 212 € / 20 j = 10,60 € ;
J14 choix laissé au public, 212 € / 18 j = 11,78 € : A train 55 € → 157 € (8,72 €/j) ; B covoiturage 30 € départ 5 h
→ 182 € (10,11 €/j). Épisode 2/2 promis le 24 nov. : les deux fins, puis un même imprévu pour les deux.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# ---- A : POV, tu es Monsieur Découvert ---------------------------------------
A = [("hook", 2.8), ("piege1", 2.6), ("piege2", 2.6), ("piege3", 2.6), ("teaser", 2.2), ("reveal", 2.6),
     ("sauf", 3.0), ("fin", 2.2)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="suspense", key="C", bpm=99, seed=9342, music=music, cuts=cuts,
              theme="roi_montagne", sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[6], end_at=cuts[7] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3):  # carte du piège, bulle, compte qui baisse
        m.pop(cuts[i] + 0.12, 0.14)
        m.pop(cuts[i] + 0.4, 0.12)
        for k in range(3):
            m.tick(cuts[i] + 0.75 + k * 0.2, 0.1)
    m.fill(cuts[5] - 0.8, 1.0)
    m.reveal(cuts[5] + 0.3, good=False)
    m.reveal(cuts[6] + 0.5, good=True)
    m.pop(cuts[6] + 0.7, 0.14)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


# ---- B : Survie · Étudiant · Épisode 1/2 -------------------------------------
B = [("hook", 2.8), ("j3", 2.6), ("j6", 2.4), ("j9", 2.6), ("j12", 2.4), ("choix", 3.4), ("fin", 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="jeu_tele", key="G", bpm=118, seed=6061, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3):  # options A/B, choix qui s'allume, compteur
        m.pop(cuts[i] + 0.1, 0.12)
        m.pop(cuts[i] + 0.25, 0.12)
        m.reveal(cuts[i] + 0.8, good=True)
    m.reveal(cuts[4] + 0.3, good=False)
    m.pop(cuts[5] + 0.2, 0.14)
    m.pop(cuts[5] + 0.4, 0.14)
    m.fill(cuts[5] + 2.2, 1.0)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
