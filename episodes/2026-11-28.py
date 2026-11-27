"""Épisodes du 28 novembre 2026 (Remotion, DA « cartoon premium 2.5D » src/bl2/, voix off ElevenLabs par le connecteur).

Scènes : remotion/src/episodes/2026-11-28.tsx. Rendu : outils/rendu_remotion.py (voir remotion/README.md).
Nouveaux éléments : personnages `Tomate` (produits frais) et `Tele` (produits manufacturés) dans src/bl/persos.tsx ;
décors 2.5D `PlateauFond` / `PlateauAvant` (plateau télé, projecteurs, podium) et `AppartFond` / `AppartAvant`
(salon de nuit, canapé) + élément `Podium`, `Horloge2` et `Jauge2` dans src/bl2/decors2.tsx.

Vidéo A (10:00) : « Inflation · Le podium des hausses » (cérémonie de remise des médailles, format inédit : 3e, 2e,
pari et décompte, 1er, puis « le seul qui baisse » ; Monsieur Découvert présente, les objets parlent ; aucun plan d'app).
Faits (Insee, Informations rapides n° 295, « En novembre 2026, les prix à la consommation augmenteraient de 2,9 % sur un
an », estimation provisoire parue le 27/11/2026, lue le 27 nov. 2026 : https://www.insee.fr/fr/statistiques/9161375) :
- ensemble +2,9 % sur un an en novembre 2026 (après +3,4 % en octobre) ;
- évolutions sur un an : énergie +19,2 %, produits frais +9,4 %, tabac +3,2 %, services +2,3 %, autre alimentation
  +0,2 %, produits manufacturés -0,2 %. Podium honnête : 1 énergie, 2 produits frais, 3 tabac (montré sans personnage).
- Écarté : sous-postes (gaz, carburants) non chiffrés dans cette publication ; montants en euros.

Vidéo B (18:00) : « Paie · Les 72 premières heures » (horloge qui avance de vendredi 18 h à lundi 18 h, jauge « par
jour jusqu'à la prochaine paie » qui baisse, chute qui boucle sur la première phrase ; aucun plan d'app).
Aucun fait chiffré : histoire inventée, montants d'exemple (indiqué à l'écran). Lundi 30 novembre = Cyber Monday
(mediaterranee.com, 28 oct. 2026, mis à jour le 7 nov., déjà cité au journal du 24 nov.). Jours comptés au calendrier :
vendredi 27 nov. 18 h → paie suivante lundi 28 déc. = 31 jours ; lundi 30 nov. → 28 déc. = 28 jours.
"""
import datetime as dt
import os
import sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403  (règle du PLAYBOOK : chaque épisode importe bl.py)
from musique import Track  # noqa: E402
from voix import dire  # noqa: E402

# ---- contrôles -------------------------------------------------------------------------------------------------
HAUSSES = {"énergie": 19.2, "produits frais": 9.4, "tabac": 3.2, "services": 2.3, "autre alimentation": 0.2,
           "produits manufacturés": -0.2}
assert sorted(HAUSSES, key=HAUSSES.get, reverse=True)[:3] == ["énergie", "produits frais", "tabac"]
assert min(HAUSSES, key=HAUSSES.get) == "produits manufacturés" and HAUSSES["produits manufacturés"] < 0

RESTE0 = 930
DEPENSES = [("Vendredi 20 h 30", "Resto « pour fêter ça »", 38), ("Samedi 15 h", "« Juste repérer » des cadeaux", 95),
            ("Dimanche 21 h", "Livraison « flemme »", 24), ("Lundi 12 h 30", "Cyber Monday « -40 % »", 59)]
RESTE1 = RESTE0 - sum(v for *_, v in DEPENSES)
J0 = (dt.date(2026, 12, 28) - dt.date(2026, 11, 27)).days
J1 = (dt.date(2026, 12, 28) - dt.date(2026, 11, 30)).days
assert dt.date(2026, 11, 27).weekday() == 4 and dt.date(2026, 11, 30).weekday() == 0
assert (J0, J1) == (31, 28) and RESTE1 == 714
assert round(RESTE0 / J0, 2) == 30.00 and round(RESTE1 / J1, 2) == 25.50


# ---- voix off : (personnage, texte dit, texte affiché si différent) ---------------------------------------------
def build(script, fin_min=4.2):
    PRE, GAP, POST = 0.2, 0.12, 0.3
    scenes, lines, wavs, t = [], [], [], 0.0
    for name, ls in script:
        d = PRE
        for who, say, show in ls:
            wav, ln = dire(who, say)
            lines.append({"t": round(t + d, 3), "d": round(ln, 3), "who": who, "text": show or say})
            wavs.append((wav, t + d))
            d += ln + GAP
        d += POST - GAP
        if name == "fin":
            d = max(d, fin_min)
        scenes.append((name, round(d, 2)))
        t += round(d, 2)
    return scenes, lines, wavs


A_SCRIPT = [
    ("hook", [("decouvert", "Inflation de novembre : deux virgule neuf pour cent sur un an.",
               "Inflation de novembre : 2,9 % sur un an."),
              ("decouvert", "Mais qui monte sur le podium des hausses ? Devine le numéro un !", None)]),
    ("n3", [("decouvert", "Troisième : le tabac, plus trois virgule deux pour cent. Pas de personnage : on ne lui fait pas de pub.",
             "Troisième : le tabac, +3,2 %. Pas de personnage : on ne lui fait pas de pub.")]),
    ("n2", [("decouvert", "Deuxième : les produits frais, plus neuf virgule quatre !", "Deuxième : les produits frais, +9,4 % !"),
            ("tata", "Té ! Fruits, légumes, poisson frais… on vaut de l'or !", None)]),
    ("pari", [("decouvert", "Et la médaille d'or… trois, deux, un…", None)]),
    ("n1", [("decouvert", "L'énergie ! Plus dix-neuf virgule deux pour cent !", "L'énergie ! +19,2 % !"),
            ("tonton", "C'est correct, je prends l'or !", None)]),
    ("twist", [("decouvert", "Attends… il y en a un qui baisse.", None),
               ("frere", "Produits manufacturés : moins zéro virgule deux. Moi, je baisse !",
                "Produits manufacturés : -0,2 %. Moi, je baisse !")]),
    ("fin", [("decouvert", "Tu avais deviné le numéro un ? Réponds oui ou non !", None)]),
]

B_SCRIPT = [
    ("hook", [("decouvert", "Vendredi, dix-huit heures. Ta paie tombe. Après le loyer, il te reste neuf cent trente euros.",
               "Vendredi, 18 h. Ta paie tombe. Après le loyer, il te reste 930 €."),
              ("p1", "Ce mois-ci, je fais attention.", None),
              ("decouvert", "Elle tient combien d'heures ?", None)]),
    ("resto", [("cousin", "On dit quoi ? On fête ta paie au resto !", None),
               ("decouvert", "Trente-huit euros.", "-38 €.")]),
    ("cadeaux", [("p1", "Je vais juste repérer des cadeaux.", None),
                 ("decouvert", "Quatre-vingt-quinze euros.", "-95 €.")]),
    ("livraison", [("p1", "Flemme de cuisiner… je commande.", None),
                   ("decouvert", "Vingt-quatre euros.", "-24 €.")]),
    ("cyber", [("p1", "Moins quarante pour cent ? Ce serait bête de rater ça !", "-40 % ? Ce serait bête de rater ça !"),
               ("decouvert", "Cinquante-neuf euros.", "-59 €.")]),
    ("bilan", [("decouvert", "Soixante-douze heures. Rien de fou… et il te reste sept cent quatorze euros.",
                "72 heures. Rien de fou… et il te reste 714 €."),
               ("decouvert", "Vendredi, tu avais trente euros par jour jusqu'à la prochaine paie. Lundi : vingt-cinq euros cinquante.",
                "Vendredi : 30 €/jour jusqu'à la paie. Lundi : 25,50 €.")]),
    ("fin", [("p1", "Bon. Le mois prochain, je fais attention.", None),
             ("decouvert", "Et toi, ta paie tient combien d'heures ?", None)]),
]

A, A_LINES, A_WAVS = build(A_SCRIPT)
A_PROPS = {"lines": A_LINES}
B, B_LINES, B_WAVS = build(B_SCRIPT, fin_min=5.4)
B_PROPS = {"lines": B_LINES}


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="jeu_tele", key="E", bpm=110, seed=8960, music=music, cuts=cuts, theme="ode_joie", sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[3], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c, g=0.09)
    for wav, at in A_WAVS:
        m.voice(wav, at)
    m.reveal(cuts[1] + 0.6, good=False)  # 3e place
    m.reveal(cuts[2] + 0.6, good=False)  # 2e place
    for k in range(3):  # décompte
        m.tick(A_LINES[5]["t"] + A_LINES[5]["d"] * (0.45 + k * 0.18), 0.1)
    m.reveal(cuts[4] + 0.3, good=True)  # médaille d'or
    m.reveal(cuts[5] + A[5][1] * 0.55, good=True)  # celui qui baisse
    m.jingle(cuts[6] + max(0.15, A[6][1] - 2.0))
    m.end(path)


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="pop_piano", key="F", bpm=100, seed=1064, music=music, cuts=cuts, sf2=True)
    m.compose(layers_at=cuts[1], break_at=cuts[5], end_at=cuts[6] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c, g=0.09)
    for wav, at in B_WAVS:
        m.voice(wav, at)
    for i in (1, 2, 3, 4):  # chaque montant qui tombe
        ln = B_LINES[2 + 2 * i]
        m.pop(ln["t"] + 0.05, 0.12)
    m.reveal(cuts[5] + 0.5, good=False)
    m.fill(cuts[5] + B[5][1] - 0.8, 0.6)
    m.jingle(cuts[6] + max(0.15, B[6][1] - 2.0))
    m.end(path)


if __name__ == "__main__":
    for nm, sc in (("A", A_SCRIPT), ("B", B_SCRIPT)):
        n = sum(len(say) for _, ls in sc for _, say, _ in ls)
        print(nm, n, "caractères")
