"""Épisodes du 18 novembre 2026.

Vidéo A : « Le compteur €/heure » (format inédit : compteur qui divise un prix par des heures, échelle qui se
remplit, défi « réponds avec un chiffre »), veille de la sortie de GTA 6 (jeudi 19 nov. 2026).
Faits (lus le 17 nov. 2026) : sortie le 19 nov. 2026 sur PS5 et Xbox Series X|S ; édition standard 79,99 €,
édition Ultimate 99,99 € (PlayStation Store) : spiritgamer.fr/gta-vi-tout-savoir-avant-le-19-novembre/ (mis à
jour le 14 nov. 2026) ; prix standard confirmé par gta-6-france.fr/faq. Heures de jeu : exemples ; €/heure : calcul.
Aucun logo, visuel ou personnage du jeu : seule une manette générique.

Vidéo B : « Salaire loading… » (format inédit : barre de chargement de la paie qui se vide jour après jour,
arrêt sur image « ton pari ? » avant la révélation, réponse en un chiffre). Fiction : montants d'exemple.
"""
import importlib.util
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403
from musique import Track  # noqa: E402


def _load(name, fn):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, "episodes", fn))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


ep13 = _load("ep1113", "2026-11-13.py")
ep16 = _load("ep1116", "2026-11-16.py")
tint, pill, scaled, talk = ep13.tint, ep13.pill, ep13.scaled, ep13.talk
p1 = ep16.p1
GREY = (150, 165, 175)


def eur(v, dec=2):
    s = f"{v:,.{dec}f}".replace(",", " ").replace(".", ",").replace(" ", NB)
    return s + f"{NB}€"


# ---- A : Le compteur €/heure, GTA 6 ----------------------------------------
PRICE = 79.99
ROUNDS = [
    # (étiquette, heures, prix, expression, légende)
    ("UNE SOIRÉE", 4, PRICE, "sad", "*20 € de l'heure*.\nPas vraiment rentabilisé."),
    ("UN WEEK-END", 16, PRICE, "neutral", "*5 € de l'heure*.\nÇa descend…"),
    ("2 H PAR SOIR JUSQU'À NOËL", 72, PRICE, "happy", "*1,11 € de l'heure*.\nLà, ça devient rentable."),
    ("LE POTE QUI Y PASSE 200 H", 200, PRICE, "happy", "*0,40 € de l'heure*.\nImbattable."),
]
RA = 3.0


def neon_bg(img, a=0.25):
    img.paste(bg_grid())
    tint(img, NAVY, a)


def manette(img, t, expr, y, k=0.8, label=""):
    m = scaled(manette_perso(expr, 0, label), k)
    paste(img, m, 540 - m.width / 2, y + math.sin(t * 4) * 6)


def compteur(img, t, hours, price, y, start=0.35):
    """« 79,99 € ÷ 4 h = » puis le prix de l'heure qui descend jusqu'à sa valeur."""
    d = ImageDraw.Draw(img)
    p = ease((t - start) / 0.9)
    h = max(1, round(1 + (hours - 1) * p))
    d.text((540, y), f"{eur(price)}  ÷  {h}{NB}h  =", font=inter(64, "Black"), fill=WHITE, anchor="mm")
    v = price / h
    col = RED if v >= 10 else (YEL if v >= 2 else GREEN)
    d.text((540, y + 130), f"{eur(v)} / h", font=inter(128, "Black"), fill=col, anchor="mm",
           stroke_width=6, stroke_fill=(0, 0, 0))


def ahook(img, t):
    neon_bg(img)
    pill(img, "LE COMPTEUR €/HEURE", MAG, 150, WHITE, 40)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, "*GTA 6* sort jeudi.\n*79,99 €*.", inter(96, "Black"), WHITE, YEL, None, 118)
    rich(d, 540, 560, "Ton pote qui a posé son jeudi :\n« rentabilisé en une soirée ».", inter(52, "Bold"), WHITE,
         YEL, None, 66)
    rich(d, 540, 720, "*Vrai ?*", inter(80, "Black"), WHITE, GREEN, None, 90)
    manette(img, t, "happy", 900, 0.9, eur(PRICE))
    brand_tag(img, 40, 1430)
    punch_in(img, t)


def round_scene(i):
    lab, hours, price, expr, cap = ROUNDS[i]

    def scene(img, t):
        neon_bg(img, 0.35)
        pill(img, f"{i + 1}/4 · {lab}", [RED, YEL, CYAN, GREEN][i], 150, NAVY if i else WHITE, 40)
        compteur(img, t, hours, price, 360)
        if t > 1.4:
            rich(ImageDraw.Draw(img), 540, 640, cap, inter(64, "Black"), WHITE, YEL, None, 80)
        manette(img, t, expr if t > 1.3 else "neutral", 900, 0.75, f"{hours}{NB}h")
        # jauge de rentabilité : se remplit quand le prix de l'heure baisse
        lvl = {0: 0.12, 1: 0.4, 2: 0.78, 3: 0.97}[i]
        gauge(img, t, 140, 1260, 800, lvl, 0.4, "RENTABILITÉ", col=[RED, YEL, GREEN, GREEN][i])
        brand_tag(img, 40, 1430)
    return scene


def atwist(img, t):
    neon_bg(img, 0.2)
    pill(img, "LE PIRE CAS", RED, 150, WHITE, 44)
    d = ImageDraw.Draw(img)
    rich(d, 540, 260, "L'édition *à 99,99 €*…\njouée *3 h*.", inter(80, "Black"), WHITE, YEL, None, 96)
    if t > 0.5:
        compteur(img, t, 3, 99.99, 560, 0.55)
    if t > 1.8:
        paste(img, stamp("AÏE", RED, 110, -8), 330, 820)
    manette(img, t, "angry" if t > 1.6 else "neutral", 1010, 0.7, f"3{NB}h")
    if 1.6 <= t < 2.0:
        tint(img, RED, 0.2 * (1 - (t - 1.6) / 0.4))
    brand_tag(img, 40, 1430)


LADDER = [("Ultimate, 3 h", 33.33, RED), ("Une soirée", 20.0, RED), ("Un week-end", 5.0, YEL),
          ("Jusqu'à Noël", 1.11, GREEN), ("200 h", 0.40, GREEN)]


def aladder(img, t):
    neon_bg(img, 0.4)
    pill(img, "TON POTE, IL EST OÙ ?", MAG, 150, WHITE, 42)
    d = ImageDraw.Draw(img)
    for i, (lab, v, c) in enumerate(LADDER):
        p = back((t - 0.1 - i * 0.18) / 0.3)
        if p <= 0:
            continue
        y = 300 + i * 190 + (1 - p) * 60
        b, g = glow_box(860, 150, 22, NAVY, c, 14)
        paste(img, b, 90 - g, y - g)
        d.text((140, y + 75), lab, font=inter(54, "Black"), fill=WHITE, anchor="lm")
        d.text((900, y + 75), f"{eur(v)}/h", font=inter(60, "Black"), fill=c, anchor="rm")
    if t > 1.3:
        caption(img, "Réponds avec *ton nombre d'heures*.", 1300, 52)
    brand_tag(img, 40, 1430)


def aend(img, t):
    neon_bg(img, 0.3)
    caption(img, "Toi, tu vas y jouer\ncombien d'heures\n*avant Noël* ?", 210, 84)
    caption(img, "Envoie ça au pote\nqui a posé *son jeudi*.", 600, 60, WHITE, GREEN)
    manette(img, t, "happy", 820, 0.6, eur(PRICE))
    s = back(t / 0.35)
    sz = max(20, int(100 * s))
    paste(img, logo(sz), 250 - sz / 2, 1220 - sz / 2)
    ImageDraw.Draw(img).text((320, 1220), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    ImageDraw.Draw(img).text((540, 1330), "Prix éditeur annoncés · heures : exemples", font=inter(32, "Medium"),
                             fill=GREY, anchor="mm")


A = [(ahook, 2.8)] + [(round_scene(i), RA) for i in range(4)] + [(atwist, 3.2), (aladder, 2.8), (aend, 2.2)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="synthwave", key="C", bpm=102, seed=4681, music=music, cuts=cuts, theme="marche_turque")
    m.compose(layers_at=cuts[3], break_at=cuts[5], end_at=cuts[7] + 0.15)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        for k in range(4):
            m.tick(cuts[1 + i] + 0.4 + k * 0.22, 0.1)
        m.reveal(cuts[1 + i] + 1.3, good=i >= 2)
        m.pop(cuts[1 + i] + 1.45, 0.15)
    m.fill(cuts[5], 1.0)
    m.reveal(cuts[5] + 1.6, good=False)
    for k in range(5):
        m.pop(cuts[6] + 0.15 + k * 0.18, 0.13)
    m.pop(cuts[6] + 1.3, 0.16)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


def music_a3(total, path, music=True):
    """Version Remotion (18 nov. 2026, test d'intégration) : même partition, vrais instruments (musique.py v3.0)."""
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="synthwave", key="C", bpm=102, seed=4681, music=music, cuts=cuts, theme="marche_turque",
              sf2=True)
    m.compose(layers_at=cuts[3], break_at=cuts[5], end_at=cuts[7] + 0.15)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        for k in range(4):
            m.tick(cuts[1 + i] + 0.4 + k * 0.22, 0.1)
        m.reveal(cuts[1 + i] + 1.3, good=i >= 2)
    m.fill(cuts[5], 1.0)
    m.reveal(cuts[5] + 1.6, good=False)
    for k in range(5):
        m.pop(cuts[6] + 0.15 + k * 0.18, 0.13)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


# ---- B : Salaire loading… ---------------------------------------------------
PAIE = 1600
DAYS = [
    # (jour, dépense, montant)
    (1, "Loyer", 650),
    (4, "Courses + abonnements", 220),
    (8, "Week-end « tranquille »", 140),
    (12, "Énergie + box", 110),
    (17, "Courses + 2 livraisons", 230),
    (21, "Anniv + resto", 150),
]
LAST = (24, "Petits achats « c'est rien »", 100)
BD = 2.0


def reste_avant(i):
    return PAIE - sum(v for _, _, v in DAYS[:i])


def dark(img, a=0.0):
    img.paste(bg_tuto())
    if a:
        tint(img, NAVY, a)


def day_big(img, day, y=330, col=WHITE):
    d = ImageDraw.Draw(img)
    d.text((540, y), f"JOUR {day}", font=inter(128, "Black"), fill=col, anchor="mm", stroke_width=6,
           stroke_fill=(0, 0, 0))


def expense(img, lab, val, y):
    """Carte de dépense sur deux lignes : libellé puis montant."""
    b, g = glow_box(900, 220, 24, NAVY, RED, 16)
    paste(img, b, 90 - g, y - g)
    d = ImageDraw.Draw(img)
    d.text((540, y + 62), lab, font=inter(52, "Black"), fill=WHITE, anchor="mm")
    d.text((540, y + 154), f"-{eur(val, 0)}", font=inter(80, "Black"), fill=RED, anchor="mm")


def bhook(img, t):
    dark(img)
    pill(img, "SALAIRE LOADING…", GREEN, 150, NAVY, 44)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, "Ta paie disparaît\navant la fin du mois.", inter(84, "Black"), WHITE, YEL, None, 100)
    rich(d, 540, 490, "Devine le *jour exact*.", inter(84, "Black"), WHITE, GREEN, None, 100)
    barre_chargement(img, 90, 720, 900, 1.0, f"Paie du 1er : {eur(PAIE, 0)}")
    caption(img, "Réponds avec *un nombre*.", 920, 60)
    caption(img, "À envoyer au pote qui « dépense rien ».", 1030, 42, YEL)
    p1(img, t, "happy", 1120, 0.4, 0)
    punch_in(img, t)


def day_scene(i):
    day, lab, val = DAYS[i]
    r0 = reste_avant(i)
    r1 = r0 - val

    def scene(img, t):
        dark(img, 0.1)
        pill(img, "SALAIRE LOADING…", GREEN, 150, NAVY, 40)
        day_big(img, day)
        p = ease((t - 0.45) / 0.5)
        cur = r0 - val * p
        if t > 0.25:
            s = back((t - 0.25) / 0.3)
            expense(img, lab, val, 450 + (1 - s) * 50)
        barre_chargement(img, 90, 790, 900, cur / PAIE, f"Il reste {eur(round(cur), 0)}")
        expr = "happy" if r1 > 700 else ("worry" if r1 > 200 else "shout")
        p1(img, t, expr, 1050, 0.48, talk(t) if t < 0.8 else 0)
        brand_tag(img, 40, 1430)
    return scene


def bfreeze(img, t):
    dark(img, 0.1)
    pill(img, "SALAIRE LOADING…", GREEN, 150, NAVY, 40)
    day_big(img, "??", 330, YEL)
    left = PAIE - sum(v for _, _, v in DAYS)
    barre_chargement(img, 90, 760, 900, left / PAIE, f"Il reste {eur(left, 0)}")
    d = ImageDraw.Draw(img)
    rich(d, 540, 480, "Arrêt sur image.\n*Ton pari ?*", inter(80, "Black"), WHITE, YEL, None, 96)
    n = 3 - int(t / (1.8 / 3))
    if n > 0:
        d.text((540, 1000), str(n), font=inter(220, "Black"), fill=WHITE, anchor="mm", stroke_width=8,
               stroke_fill=(0, 0, 0))
    p1(img, 0, "worry", 1220, 0.4, 0)
    tint(img, (255, 255, 255), 0.25 * max(0, 1 - t / 0.15))


def breveal(img, t):
    day, lab, val = LAST
    dark(img, 0.1)
    pill(img, "SALAIRE LOADING…", RED, 150, WHITE, 40)
    day_big(img, day, 330, RED)
    expense(img, lab, val, 450)
    p = ease((t - 0.2) / 0.5)
    barre_chargement(img, 90, 790, 900, (val * (1 - p)) / PAIE, f"Il reste {eur(round(val * (1 - p)), 0)}")
    if t > 0.9:
        rich(ImageDraw.Draw(img), 540, 960, "Paie suivante :\n*dans 7 jours*.", inter(70, "Black"), WHITE, YEL, None,
             86)
    p1(img, t, "shout", 1200, 0.4, 1 if 0.9 < t < 1.8 and talk(t) else 0)
    if 0.7 <= t < 1.0:
        tint(img, RED, 0.22 * (1 - (t - 0.7) / 0.3))


def bniveau(img, t):
    dark(img)
    pill(img, "LE JOUR 1, IL SUFFISAIT DE…", GREEN, 150, NAVY, 38)
    rich(ImageDraw.Draw(img), 540, 270, "…savoir combien\nil te restait *par jour*.", inter(78, "Black"), WHITE, GREEN,
         None, 94)
    hud_budget(img, 950, 30, 520)
    if t > 0.8:
        rich(ImageDraw.Draw(img), 540, 790, "*31,67 €* par jour.\nPas 1 600 €.", inter(66, "Black"), WHITE, YEL, None,
             82)
    p1(img, t, "happy", 1080, 0.42, 0)
    brand_tag(img, 40, 1430)


def bend(img, t):
    dark(img)
    caption(img, "Et toi, ta barre\ntombe à 0 *quel jour* ?", 200, 84)
    caption(img, "Réponds avec *un nombre*.", 440, 60, WHITE, GREEN)
    barre_chargement(img, 90, 640, 900, min(1.0, ease(t / 1.2)), "Paie suivante : loading…")
    caption(img, "Envoie ça au pote\nqui « *dépense rien* ».", 840, 60)
    s = back(t / 0.35)
    sz = max(20, int(100 * s))
    paste(img, logo(sz), 250 - sz / 2, 1180 - sz / 2)
    ImageDraw.Draw(img).text((320, 1180), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    ImageDraw.Draw(img).text((540, 1290), "Montants d'exemple · histoire inventée", font=inter(32, "Medium"),
                             fill=GREY, anchor="mm")


B = [(bhook, 2.8)] + [(day_scene(i), BD) for i in range(len(DAYS))] + [(bfreeze, 1.8), (breveal, 2.4),
                                                                        (bniveau, 2.4), (bend, 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="chiptune_doux", key="F", bpm=119, seed=2832, music=music, cuts=cuts,
              theme="frere_jacques")
    m.compose(layers_at=cuts[3], break_at=cuts[7], end_at=cuts[10] + 0.15)
    m.pop(0.05)
    m.pop(0.3, 0.16)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(len(DAYS)):
        m.pop(cuts[1 + i] + 0.25, 0.17)
        m.tick(cuts[1 + i] + 0.6, 0.12)
    for k in range(3):
        m.tick(cuts[7] + k * 0.6, 0.18)
    m.fill(cuts[8], 1.0)
    m.reveal(cuts[8] + 0.7, good=False)
    m.reveal(cuts[9] + 0.8, good=True)
    m.pop(cuts[9] + 0.85, 0.16)
    m.jingle(cuts[10] + 0.15)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.0, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.4, 6: 2.0, 7: 1.8}
TIMES_B = {0: 0.0, 1: 1.2, 2: 1.2, 3: 1.2, 4: 1.2, 5: 1.2, 6: 1.2, 7: 0.3, 8: 1.4, 9: 1.6, 10: 1.8}


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_gta6_compteur_heure", A, music_a)
        if which in ("b", "all"):
            render("budgetloyer_salaire_loading", B, music_b)
