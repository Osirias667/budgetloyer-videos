"""Épisodes du 19 novembre 2026 (premiers épisodes publiés avec Remotion, décision du propriétaire du 18 nov.).

Scènes : remotion/src/episodes/2026-11-19.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).

Vidéo A : « Survie · À deux · Épisode 1/2 » (série Survie, 3e saison ; nouveau personnage Sam).
Premier mois à deux : Toi 1 900 €, Sam 1 300 € (exemples). Pot commun : loyer 900 € + courses 290 € +
énergie et box 110 € = 1 300 €. Choix laissé au public : A 50/50 (650 € chacun) ou B au prorata des salaires
(Toi 1 900/3 200 × 1 300 = 771,88 € → 772 € ; Sam 528,13 € → 528 €).
Fait (lu le 18 nov. 2026) : « 50 % partagent leurs dépenses à parts égales », « 30 % les répartissent
proportionnellement au revenu », 41 % au prorata chez les 18-24 ans : enquête Cité de l'Économie et Institut
Bona fidé, communiqué du 6 févr. 2026, citeco.fr/sites/default/files/2026-02/CP-sondage-couple-et-argent.pdf.
Épisode 2/2 promis le 20 nov. : ce qu'il reste à chacun (A : Toi 1 250 €, Sam 650 € ; B : Toi 1 128 €, Sam 772 €),
puis le même imprévu pour les deux fins.

Vidéo B : « Ding dong · Calendrier des pompiers » (format inédit : vue par le judas, silhouette révélée, mécanisme
« soft launch » relevé sur socialpilot.co/blog/tiktok-trends, fenêtre du 17 au 25 nov. 2026), réponse en un montant.
Faits (lus le 18 nov. 2026) :
- don libre, dons courants « le plus souvent entre 5 et 20 € » selon des amicales ; l'argent finance la vie des
  amicales, les jeunes sapeurs-pompiers, l'entraide envers les familles, pas les missions de secours (budget public
  du SDIS) ; vrai pompier : tenue officielle avec écusson, carte professionnelle ou d'amicale sur demande, calendrier
  au nom de la commune ou du centre ; tarif présenté comme obligatoire = signal d'alerte :
  infosyvelines.fr/articles/yvelines-tournee-calendriers-2027-sapeurs-pompiers (2 nov. 2026, mis à jour le 4 nov.) ;
  recoupé par stephanelarue.com/calendriers-des-pompiers-2027-la-tournee-a-commence-comment-reperer-les-faux-vendeurs
  (16 nov. 2026 : reçu sur demande, rester sur le pas de la porte).
- « l'achat d'un calendrier ne donne pas droit à une réduction d'impôt » : moneyvox.fr, article 111251 (16 nov. 2026).
Aucun écusson, logo ni personne réelle : pompier dessiné générique.
"""
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402

# ---- A : Survie · À deux · Épisode 1/2 ----------------------------------------
A = [("hook", 2.8), ("jour1_loyer", 2.6), ("jour6_courses", 2.6), ("jour12_energie", 2.6), ("addition", 2.4),
     ("choix", 3.2), ("france", 2.8), ("fin", 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="pop_piano", key="E", bpm=107, seed=7706, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[2], break_at=cuts[5], end_at=cuts[7] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in (1, 2, 3):  # le pot commun monte
        for k in range(3):
            m.tick(cuts[i] + 0.4 + k * 0.2, 0.1)
        m.pop(cuts[i] + 1.1, 0.14)
    m.reveal(cuts[4] + 0.6, good=False)
    m.pop(cuts[5] + 0.3, 0.15)
    m.pop(cuts[5] + 0.8, 0.15)
    m.fill(cuts[6], 1.0)
    m.reveal(cuts[6] + 0.5, good=True)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


# ---- B : Ding dong · Calendrier des pompiers ----------------------------------
B = [("hook", 2.8), ("fouille", 2.6), ("revelation", 3.0), ("combien", 3.0), ("sert", 3.0), ("vrai", 3.2),
     ("fin", 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="pizzicato", key="G", bpm=106, seed=5006, music=music, cuts=cuts, theme="vive_le_vent",
              sf2=True)
    m.compose(layers_at=cuts[2], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for k in range(4):  # pièces qui tombent
        m.tick(cuts[1] + 0.5 + k * 0.25, 0.1)
    m.reveal(cuts[2] + 0.7, good=True)
    m.pop(cuts[3] + 0.4, 0.15)
    for k in range(3):
        m.pop(cuts[4] + 0.3 + k * 0.35, 0.13)
    for k in range(4):
        m.tick(cuts[5] + 0.3 + k * 0.4, 0.12)
    m.fill(cuts[6], 1.0)
    m.jingle(cuts[6] + 0.15)
    m.end(path)
