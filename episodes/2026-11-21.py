"""Épisodes du 21 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-21.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « Marché de Noël · Devine le total » (« on passe juste 5 minutes », à deux, total qui monte, réponse à la fin).
Prix d'exemple, choisis dans les fourchettes de marches-de-noel.fr/guides/budget/ (mis à jour le 6 oct. 2026, indiqué
« à titre indicatif ») : vin chaud au verre 3 à 5 € → 4 € ; consigne du mug 1 à 3 € → 2 € ; cône raclette / tartiflette
7 à 12 € → 9 € ; grande roue 6 à 10 € → 8 € ; pain d'épices artisanal (250 g) 8 à 14 € → 11 €.
Calcul : 2 × 4 + 2 × 2 = 12 ; + 2 × 9 = 30 ; + 2 × 8 = 46 ; + 11 = 57 € ; gobelets rendus : 57 - 4 = 53 €.
Durée de 18:00 à 19:35 : 1 h 35 (histoire inventée).
Description seulement : ouverture du marché de Noël de Strasbourg le vendredi 27 novembre 2026
(actu-alt-plus.com/culture-tendances/marche-de-noel-strasbourg-2026-prix-sur-place/43270/, 18 nov. 2026).
Aucun prix 2026 officiel n'est publié (même source) : aucun prix réel affirmé à l'écran.

Vidéo B : « Samedi soir · Je sors pas » (refus puis capitulation, horloge, total révélé à la fin, dernière phrase =
première phrase le dimanche matin). Montants d'exemple : verre 7 €, tournée 4 × 7 = 28 €, kebab 9 €, taxi 22 € ;
total 7 + 28 + 9 + 22 = 66 €. Aucun fait chiffré.
Mécanismes : « tsundere » (refus puis capitulation) dans socialpilot.co/blog/tiktok-trends (publié le 17 nov. 2026,
fenêtre du 17 au 25 nov.) ; horloge du défi 0 € du 10 nov. (record du compte, 990 vues TikTok). Sans reprendre de
vidéo précise.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# ---- A : Marché de Noël · Devine le total ------------------------------------
A = [("hook", 2.8), ("vin", 2.6), ("raclette", 2.6), ("roue", 2.6), ("pain", 2.4), ("gobelets", 2.8),
     ("reponse", 2.8), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="lofi", key="Eb", bpm=92, seed=6267, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[7] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3, 4):  # article puis total qui monte
        m.pop(cuts[i] + 0.25, 0.14)
        for k in range(4):
            m.tick(cuts[i] + 0.45 + k * 0.17, 0.1)
    m.pop(cuts[5] + 0.3, 0.14)
    m.reveal(cuts[5] + 0.65, good=False)
    m.reveal(cuts[6] + 0.8, good=False)
    m.pop(cuts[6] + 0.9, 0.16)
    m.fill(cuts[6] + 1.7, 1.0)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


# ---- B : Samedi soir · Je sors pas -------------------------------------------
B = [("hook", 2.8), ("non", 2.2), ("craque", 2.6), ("tournee", 2.4), ("kebab", 2.2), ("taxi", 2.4),
     ("reponse", 2.6), ("dimanche", 2.4), ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="house_light", key="Bb", bpm=123, seed=3845, music=music, cuts=cuts,
              theme="marche_turque", sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[7], end_at=cuts[8] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3, 4, 5):  # message puis réponse
        m.pop(cuts[i] + 0.1, 0.12)
        m.pop(cuts[i] + 0.35, 0.14)
    for i in (2, 3, 4, 5):  # total qui monte
        for k in range(3):
            m.tick(cuts[i] + 0.5 + k * 0.18, 0.1)
    m.reveal(cuts[6] + 0.4, good=False)
    m.pop(cuts[6] + 0.9, 0.16)
    m.fill(cuts[7] - 1.0, 1.0)
    m.jingle(cuts[8] + 0.15)
    m.end(path)
