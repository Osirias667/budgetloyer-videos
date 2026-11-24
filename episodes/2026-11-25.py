"""Épisodes du 25 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-25.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).
Nouveaux éléments : personnage `Sapin` (naturel / plastique), décor `SalonNoelBg`, éléments `Chrono`, `Splits`, `Score`.

Vidéo A : « Sapin de Noël · Le match » (format inédit : match d'objets en 3 rounds avec tableau de score, pari et
décompte avant le round décisif ; aucun plan d'app). Calculs :
- round 1, prix moyen payé en 2024 : naturel 32,70 €, plastique (artificiel) 46,50 € → naturel moins cher la 1re année ;
- round 2, l'odeur : point au naturel (gag, sans chiffre) ;
- round 3, sur 3 Noëls : naturel racheté chaque année 3 × 32,70 = 98,10 € ; plastique acheté une fois 46,50 € ;
  dès le 2e Noël : 2 × 32,70 = 65,40 € > 46,50 € → le plastique passe devant (à condition qu'il tienne 3 ans :
  aucune durée de vie lue dans les sources, d'où « si le plastique tient 3 ans au placard » à l'écran) ;
- score final 2-1, chute : « le seul perdant : celui qui achète les deux ».
Faits : Boursorama (BoursoBank), « Conso : comment les Français choisissent-ils leur beau sapin de Noël ? », publié le
19 nov. 2025, d'après l'étude Kantar pour Valhor et FranceAgriMer (bilan consommateurs publié en avril 2025, données
2024) : sapin naturel ≈ 32,70 € en moyenne en 2024 (31,80 € en 2021), artificiel 46,50 € en 2024 ; 18,5 % des foyers
ont acheté un sapin en 2024 ; Nordmann 78 % des volumes de naturels ; 58 % des achats avant le 10 décembre, près d'un
achat d'artificiel sur 3 dès novembre ; plus de 8 acheteurs sur 10 recyclent leur sapin. Lu le 24 nov. 2026.
https://www.boursorama.com/conso/actualites/conso-comment-les-francais-choisissent-ils-leur-beau-sapin-de-noel-c25e89f39f8bdf58189e969188511100
Chiffres de 2024 (derniers publiés trouvés) : dits « prix moyens payés en 2024 » à l'écran et dans la description.
Écarté : reussir.fr (données 2016).

Vidéo B : « Speedrun · Liste de Noël » (défi de la semaine, format inédit : chrono de speedrun + splits). Noël dans
30 jours (25 déc. - 25 nov. = 30 jours). Montants d'exemple, histoire inventée :
- split 1, la famille : Maman 40 + Papa 35 + Mamie 25 + ta sœur 30 = 130 € (chrono 00:21) ;
- split 2 : Secret Santa 15 + les 3 potes 30 + ta moitié 60 = 105 € → 235 € (chrono 00:44) ;
- oubliés : le cousin 20 + belle-famille 50 = 70 € → 305 € (chrono 00:58) ; « dans ta tête » 200 € → écart +105 € ;
- strat : le total d'abord, les oubliés en premier, puis répartir le reste.
Aucun fait chiffré.

Mécanismes (virlo.ai/trending-on-tiktok-this-week, mis à jour le 24 nov. 2026, lu le 24 nov.) : accroches « POV »
33 %, « comparison » 29,9 %, « controversy » 24,1 % (plus forte hausse) ; « Guessing my exam grade » (deviner un
résultat, seule vraie hausse de la semaine). Sans reprendre de vidéo précise.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

assert abs(3 * 32.70 - 98.10) < 1e-9 and 2 * 32.70 > 46.50
assert 40 + 35 + 25 + 30 == 130 and 130 + 15 + 30 + 60 == 235 and 235 + 20 + 50 == 305 and 305 - 200 == 105

# ---- A : Sapin de Noël, le match ---------------------------------------------
A = [("hook", 3.0), ("round1", 2.8), ("round2", 2.4), ("pari", 2.4), ("round3", 3.2), ("verdict", 2.6), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="lofi", key="D", bpm=85, seed=4962, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[3], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    m.reveal(cuts[1] + 40 / 30, good=True)  # point naturel
    m.reveal(cuts[2] + 26 / 30, good=True)
    for k in range(3):  # décompte du pari
        m.tick(cuts[3] + 0.4 + k * 0.4, 0.1)
    m.pop(cuts[4] + 0.1, 0.12)
    m.pop(cuts[4] + 0.4, 0.12)
    m.reveal(cuts[4] + 50 / 30, good=True)  # le plastique marque
    m.pop(cuts[5] + 0.5, 0.12)
    m.jingle(cuts[6] + 0.15)
    m.end(path)


# ---- B : Speedrun, liste de Noël ---------------------------------------------
B = [("hook", 3.0), ("split1", 3.4), ("split2", 3.0), ("oublis", 2.8), ("fini", 2.4), ("strat", 3.0), ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="swing", key="Bb", bpm=145, seed=7740, music=music, cuts=cuts, theme="vive_le_vent",
              sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[4], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i, ats in ((1, (8, 24, 40, 56)), (2, (6, 26, 46))):  # une ligne de split = un pop
        for a in ats:
            m.pop(cuts[i] + a / 30, 0.12)
    for a in (10, 32):  # les oubliés
        m.reveal(cuts[3] + a / 30, good=False)
    m.fill(cuts[4] - 0.8, 0.8)
    m.reveal(cuts[4] + 0.2, good=False)
    for k in range(3):
        m.pop(cuts[5] + (4 + k * 10) / 30, 0.12)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
