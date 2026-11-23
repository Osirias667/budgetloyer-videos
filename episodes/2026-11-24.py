"""Épisodes du 24 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-24.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « Survie · Étudiant · Épisode 2/2 » (suite promise le 23 nov.). Repart du jour 14 : 212 €, 18 jours
(jours restants = 32 - jour). Montants d'exemple, histoire inventée :
- fin A train 55 € → 157 € ; 157 / 18 = 8,72 €/jour ;
- fin B covoiturage 30 €, départ 5 h → 182 € ; 182 / 18 = 10,11 €/jour ;
- même imprévu pour les deux, jour 20 (12 jours restants) : chargeur d'ordi qui lâche avant le dernier rendu, -45 € :
  A 157 - 45 = 112 € → 112 / 12 = 9,33 €/jour ; B 182 - 45 = 137 € → 137 / 12 = 11,42 €/jour ; écart 25 € ;
- vraie fin : ce qui sauve les deux, c'est de savoir dès le jour 1 combien il reste par jour (320 / 31 = 10,32 €).

Vidéo B : « Black Friday · Vraie ou fausse promo ? » (jeu à 3 étiquettes, nouveaux éléments `Etiquette`, `CourbePrix`,
décor `VitrineBg` ; courbe du prix sur 30 jours révélée après chaque pari). Produits et prix d'exemple :
1. Casque, 120 € barré → 60 € (-50 %). Prix à 65 € les 10 derniers jours → prix de référence 65 € : réduction réelle
   5 € soit -7,7 % (affiché « -8 % ») → FAUSSE (le prix barré n'est pas le plus bas des 30 jours).
2. Baskets, 90 € barré → 63 € (-30 % : 63 / 90 = 0,70). Prix stable à 90 € sur 30 jours → VRAIE.
3. Aspirateur, 199 € barré → 149 € (-25 % : 149 / 199 = 0,749). 149 € pendant 25 jours, monté à 199 € les 5 derniers
   jours → prix de référence 149 € : réduction réelle 0 € → FAUSSE (prix gonflé juste avant).
Faits :
- Règle du prix de référence : « le prix le plus bas affiché à l'égard de tous les consommateurs durant les 30 jours
  précédant la promotion » ; gonfler un prix juste avant une promo = pratique commerciale trompeuse ; Black Friday le
  vendredi 27 nov. 2026, Cyber Monday le 30 : mediaterranee.com/2832026-black-friday-2026-dates-budget-des-francais-et-
  regle-du-prix.html (28 oct. 2026, mis à jour le 7 nov. ; d'après Que Choisir et Service-public Entreprendre), lu le
  23 nov. 2026.
- 46 % des Français font confiance aux remises affichées (54 % à l'international) ; enquête de septembre 2026,
  1 006 Français : BCG, bcg.com/press/11november2026-black-friday-2026-moins-dun-francais-sur-deux-fait-confiance-aux-
  remises-affichees (communiqué daté du 4 nov., page du 11 nov. 2026), lu le 23 nov. 2026.
Mécanisme : « curiosity/mystery » et « POV » restent les accroches au meilleur taux de réussite (31,8 % et 32,9 %),
virlo.ai/trending-on-tiktok-this-week (mis à jour le 23 nov. 2026) ; pari puis révélation (« soft launch »),
socialpilot.co/blog/tiktok-trends (17 nov. 2026). Sans reprendre de vidéo précise.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# ---- A : Survie · Étudiant · Épisode 2/2 -------------------------------------
A = [("hook", 2.8), ("finA", 2.8), ("finB", 2.8), ("imprevu", 2.8), ("compare", 3.0), ("vraie", 2.6), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="pop_piano", key="A", bpm=96, seed=4094, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2):  # option qui s'allume, compteur qui descend
        m.pop(cuts[i] + 0.15, 0.12)
        m.reveal(cuts[i] + 0.9, good=(i == 2))
    m.reveal(cuts[3] + 0.3, good=False)
    m.pop(cuts[4] + 0.2, 0.12)
    m.pop(cuts[4] + 0.5, 0.12)
    m.reveal(cuts[5] + 0.5, good=True)
    m.jingle(cuts[6] + 0.15)
    m.end(path)


# ---- B : Black Friday, vraie ou fausse promo ? --------------------------------
B = [("hook", 3.0), ("regle", 2.6), ("q1", 2.0), ("r1", 2.8), ("q2", 1.8), ("r2", 2.4), ("q3", 2.2), ("r3", 3.0),
     ("fin", 2.2)]

CASQUE = [120] * 20 + [65] * 10 + [60]
BASKETS = [90] * 30 + [63]
ASPI = [149] * 25 + [199] * 5 + [149]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="bossa", key="Eb", bpm=132, seed=9368, music=music, cuts=cuts, theme="marche_turque",
              sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[7], end_at=cuts[8] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (2, 4, 6):  # pari : 3, 2, 1
        for k in range(3):
            m.tick(cuts[i] + 0.4 + k * 0.4, 0.1)
    for i, good in ((3, False), (5, True), (7, False)):  # courbe, puis tampon
        m.pop(cuts[i] + 0.2, 0.12)
        m.reveal(cuts[i] + 1.4, good=good)
    m.fill(cuts[7] - 0.8, 0.8)
    m.pop(cuts[8] + 0.2, 0.14)
    m.jingle(cuts[8] + 0.6)
    m.end(path)
