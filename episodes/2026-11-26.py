"""Épisodes du 26 novembre 2026 (Remotion).

Scènes : remotion/src/episodes/2026-11-26.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).
Nouveaux éléments : personnages `Calendrier` (calendrier de l'Avent à 24 portes) et `Gonflable` (Père Noël gonflable
générique), décor `FacadeBg` (maison la nuit, modes off / led / ampoules / jardin).

Vidéo A (10:00) : « Les guirlandes de ton père · Devine la facture » (jeu à 3 réponses avec pari et décompte, puis
twist « les 3 réponses sont bonnes » et boss final ; personnages : ton père, le Père Noël gonflable ; aucun plan d'app).
Faits (Selectra, « coût réel guirlandes illuminations balcon Noël électricité », Matias Perea, publié le 23 déc. 2025,
mis à jour le 14 janv. 2026, lu le 25 nov. 2026 ; scénario présenté comme un exemple par la source) :
https://selectra.info/energie/actualites/marche/cout-reel-guirlandes-illuminations-balcon-noel-electricite
- scénario : un sapin intérieur + deux guirlandes au balcon ou à la fenêtre, allumés 8 h par jour (17 h - 1 h),
  31 jours, kWh à 0,1952 € ;
- tout en LED : 15 à 20 W → 0,96 € ; à l'ancienne (ampoules) : jusqu'à 250 W → 12,10 € (rapport de 1 à 12) ;
- jardin avec projecteurs halogènes et multiples guirlandes : « peut facilement grimper à 30 € ou 40 € pour le mois » ;
- Père Noël gonflable (moteur 50 à 100 W) : 3 à 5 € par mois à 8 h par jour, « 15 € » s'il reste allumé 24 h/24
  (notre calcul à 100 W : 14,52 €, d'où « près de 15 € » à l'écran).
Contrôle croisé : hellowatt.fr/blog/illuminations-noel (modifié le 11 juil. 2022, hypothèses différentes : 5 h par jour,
20 jours) donne aussi « quelques euros » pour des guirlandes LED. Non cité à l'écran (ancien).

Vidéo B (18:00) : « Calendrier de l'Avent · Ton coloc a tout ouvert » (histoire courte avec retour en arrière, porte à
porte, compteur d'euros ; dernière image = première image ; aucun plan d'app). Calendrier au prix médian 2026 :
touteslesbox.fr/enquete-prix-calendriers-avent-2026 (mis à jour le 27 oct. 2026, 129 calendriers de 90 marques, prix
relevés du 6 au 27 oct. 2026, lu le 25 nov. 2026) : « Prix médian 2026 : 59 € », « Une case coûte en médiane 2,46 € :
1,25 € en jouets, 1,62 € en chocolat, 3,94 € en beauté ». Dates : mardi 1er déc. 2026, jeudi 26 nov. = 5 jours avant
(vérifié au calendrier). Histoire, horaires (7 h 08 → 7 h 12) et coloc : fiction.
Mécanisme (virlo.ai/trending-on-tiktok-this-week, mis à jour le 25 nov. 2026, semaine du 23 nov.) : accroches
« POV » 33 %, « curiosité » 32,1 %, « phrase choc » 31,8 %, « situation à laquelle on s'identifie » 31,1 % ;
« controverse » 24,6 % (en hausse). Sans reprendre de vidéo précise.
"""
import datetime as dt
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# Contrôles des calculs et des dates
assert round(20 * 8 * 31 / 1000 * 0.1952, 2) == 0.97 and round(250 * 8 * 31 / 1000 * 0.1952, 2) == 12.10
assert round(100 * 24 * 31 / 1000 * 0.1952, 2) == 14.52
assert round(59 / 24, 2) == 2.46
assert dt.date(2026, 12, 1).weekday() == 1 and dt.date(2026, 11, 26).weekday() == 3  # mardi, jeudi
assert (dt.date(2026, 12, 1) - dt.date(2026, 11, 26)).days == 5

# ---- A : Les guirlandes de ton père, devine la facture -------------------------------------------------------
A = [("hook", 3.2), ("pari", 2.4), ("led", 2.6), ("ampoules", 2.6), ("jardin", 2.6), ("gonflable", 2.8), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="house_light", key="E", bpm=122, seed=9936, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for k in range(3):  # décompte du pari
        m.tick(cuts[1] + 0.4 + k * 0.4, 0.1)
    m.reveal(cuts[2] + 0.5, good=True)  # A : LED
    m.reveal(cuts[3] + 0.5, good=False)  # B : ampoules
    m.reveal(cuts[4] + 0.5, good=False)  # C : jardin
    m.fill(cuts[5] - 0.8, 0.8)
    m.reveal(cuts[5] + 0.6, good=False)  # le gonflable
    m.jingle(cuts[6] + 0.15)
    m.end(path)


# ---- B : Calendrier de l'Avent, le coloc a tout ouvert -------------------------------------------------------
B = [("hook", 3.0), ("rewind", 2.6), ("calcul", 2.6), ("case1", 2.6), ("frenzy", 2.8), ("lendemain", 2.8), ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="pizzicato", key="C", bpm=114, seed=5255, music=music, cuts=cuts, theme="frere_jacques",
              sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    m.pop(cuts[1] + 0.4, 0.12)
    m.reveal(cuts[2] + 0.6, good=True)
    m.pop(cuts[3] + 0.5, 0.12)
    for k in range(8):  # les portes qui s'ouvrent à la chaîne
        m.pop(cuts[4] + 0.2 + k * 0.22, 0.1)
    m.reveal(cuts[4] + 2.1, good=False)
    m.reveal(cuts[5] + 0.5, good=False)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
