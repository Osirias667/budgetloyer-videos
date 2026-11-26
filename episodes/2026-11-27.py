"""Épisodes du 27 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-27.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).
Nouveaux éléments : personnages `Pull` (pull de Noël tricoté) et `Radiateur` (radiateur à ailettes), décor `ReveillonBg`
(salon de Noël + table dressée).

Vidéo A (10:00) : « Chauffage · Le match : Pull contre Radiateur » (match d'objets en 3 rounds avec score, pari à
3 réponses avant le round décisif ; reprise du format « match » qui a fait le record Instagram du compte le 25 nov. :
sapin naturel contre plastique, 1 058 vues, 1 316 comptes atteints, 9,6 s vues ; aucun plan d'app).
Faits :
- Gaz : prix repère +5,8 % au 1er décembre 2026 (194,90 → 206,26 €/MWh TTC) ; la CRE estime environ 16 € TTC de plus
  sur la facture de décembre pour les offres indexées. choisir.com, « Énergie : ce qui change au 1er décembre 2026 »
  (publié et mis à jour le 26 nov. 2026, lu le 26 nov.) :
  https://www.choisir.com/energie/actualites/222638/energie-prix-du-gaz-heures-creuses-aides-ce-qui-change-en-decembre-2026
  recoupé par money.wizbii.com/advices/ce-qui-change-decembre-2026 (publié le 23 nov. 2026) : « environ 16 €
  supplémentaires sur la facture de décembre, en moyenne », environ 6 millions de foyers en offre indexée.
- « Baisser la température de 1 °C, c'est 7 % d'énergie économisée pour le chauffage » : ADEME, guide « Hiver tout
  confort » (librairie.ademe.fr/ged/6568/guide-hiver-tout-confort.pdf, oct. 2020, réimpr. nov. 2023) ; même chiffre
  sur info.gouv.fr/actualite/7-gestes-cles-pour-economiser-lenergie-au-quotidien (28 déc. 2023), qui donne aussi
  « 19°C en hiver pour les pièces occupées ».
- Écarté : tout montant d'économie en euros (dépend du logement), les températures pièce par pièce du guide ADEME
  (infographie mal lisible en texte).

Vidéo B (18:00) : « Réveillon · Cette année, c'est chez toi » (liste vide qui se remplit en direct, personnages de
la famille, total des invités contre total de l'hôte, chute qui boucle sur l'accroche ; aucun plan d'app). Aucun fait
chiffré : histoire inventée, montants d'exemple (indiqué à l'écran).
Mécanisme : « Empty list fills in as you talk » (en tête de la niche argent : 10 comptes, 14x la médiane),
tryvolume.app/working/money (mesuré le 25 nov. 2026) ; « Countdown that saves the best for last » (11 comptes, 10x).
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# Contrôles
assert round((206.26 / 194.90 - 1) * 100, 1) == 5.8
INVITES = [("Tata", "le pain", 4), ("Tonton", "« le vin »", 9), ("Ton cousin", "les glaçons", 2),
           ("Mamie", "sa bonne humeur", 0), ("Ton frère", "la playlist", 0)]
HOTE = [("L'apéro", 25), ("L'entrée", 30), ("Le plat", 60), ("Les fromages", 25), ("La bûche", 20),
        ("La déco de table", 15), ("Le vrai vin", 30)]
T_INV = sum(v for *_, v in INVITES)
T_HOTE = sum(v for _, v in HOTE)
assert T_INV == 15 and T_HOTE == 205
assert round((T_INV + T_HOTE) / 6, 2) == 36.67  # 5 invités + toi

# ---- A : Chauffage, le match Pull contre Radiateur ----------------------------------------------------------
A = [("hook", 3.2), ("actu", 2.8), ("confort", 2.4), ("pari", 2.4), ("round3", 2.8), ("verdict", 2.6), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="chiptune_doux", key="G", bpm=125, seed=3074, music=music, cuts=cuts, theme="marche_turque",
              sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[3], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    m.reveal(cuts[1] + 1.3, good=True)  # point Pull
    m.reveal(cuts[2] + 0.9, good=True)  # point Radiateur
    for k in range(3):  # décompte du pari
        m.tick(cuts[3] + 0.4 + k * 0.4, 0.1)
    m.reveal(cuts[4] + 0.4, good=True)  # 7 %
    m.reveal(cuts[4] + 1.7, good=True)  # point Pull
    m.pop(cuts[5] + 0.5, 0.12)
    m.jingle(cuts[6] + 0.15)
    m.end(path)


# ---- B : Réveillon, cette année c'est chez toi ---------------------------------------------------------------
B = [("hook", 3.0), ("invites", 3.2), ("total_inv", 2.2), ("hote", 3.4), ("compare", 2.6), ("twist", 2.4), ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="suspense", key="A", bpm=100, seed=5211, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for k in range(5):  # lignes des invités
        m.pop(cuts[1] + 0.3 + k * 0.5, 0.1)
    m.reveal(cuts[2] + 0.5, good=True)
    for k in range(7):  # lignes de l'hôte
        m.pop(cuts[3] + 0.2 + k * 0.36, 0.1)
    m.fill(cuts[3] + 2.6, 0.7)
    m.reveal(cuts[4] + 0.6, good=False)
    m.reveal(cuts[5] + 1.0, good=False)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
