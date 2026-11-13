"""Épisodes du 14 novembre 2026.

Vidéo A : « Attente vs Réalité » (format inédit, split attente/réalité + jeu plus ou moins) sur les courses
en petits passages. Source lue le 13 nov. 2026 : supermarche.tv (François Tindillère, 10 nov. 2026), d'après
le dernier relevé Worldpanel by Numerator (panel de 20 000 foyers, 4 semaines du 7 sept. au 4 oct. 2026) :
passages en magasin +4,9 %, panier moyen par passage -1,40 €, dépenses en produits de grande consommation et
frais libre-service +0,4 % sur les quatre semaines. Ticket de P1 : montants d'exemple (indiqué à l'écran).
Vidéo B : « Survie fin de mois », Partie 2/2 (suite promise le 13 nov.) : les deux fins du choix 3, puis
« la vraie fin ». Fiction : montants d'exemple, aucun chiffre réel.
"""
import importlib.util
import math
import os
import sys

import numpy as np
from PIL import ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, ROOT)
from bl import *  # noqa: E402,F403
from musique import Track  # noqa: E402

_spec = importlib.util.spec_from_file_location("ep1113", os.path.join(ROOT, "episodes", "2026-11-13.py"))
ep = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ep)
tint, pill, scaled, talk, countdown, sky, p1 = ep.tint, ep.pill, ep.scaled, ep.talk, ep.countdown, ep.sky, ep.p1
GREY = (150, 165, 175)


def market(img, a=0.55):
    img.paste(bg_supermarche())
    tint(img, NAVY, a)


# ---- A : Courses, attente vs réalité -----------------------------------------
SRC_A = "Worldpanel by Numerator · 4 semaines, sept.-oct. 2026"
ITEMS = [("Pain", 1.30), ("Fromage promo", 3.90), ("Chips", 2.10), ("Pain", 1.30),
         ("Yaourts", 2.60), ("Chocolat", 2.40), ("Pain", 1.30), ("Pizza", 4.50)]
DAYS = ["LUNDI", "MARDI", "JEUDI", "SAMEDI"]
STEP = 0.95


def ahook(img, t):
    market(img, 0.72)
    pill(img, "ATTENTE vs RÉALITÉ · COURSES", RED, 150, WHITE, 40)
    d = ImageDraw.Draw(img)
    rich(d, 540, 260, "Petits paniers,\n*vraies économies* ?", inter(90, "Black"), WHITE, YEL, None, 110)
    rich(d, 540, 520, "En France : *+4,9 %* de passages\nen magasin, à *-1,40 €* chacun.", inter(54, "Bold"),
         WHITE, YEL, None, 70)
    rich(d, 540, 690, "Au total : *plus ou moins* ?", inter(68, "Black"), WHITE, GREEN, None, 80)
    d.text((540, 830), SRC_A, font=inter(32, "Medium"), fill=(205, 212, 235), anchor="mm")
    paste(img, panier_perso("panic", talk(t), 1), 330, 940 + math.sin(t * 10) * 5)
    paste(img, scaled(p1_small(), 1.3), 120, 1000)
    brand_tag(img, 40, 1450)
    punch_in(img, t)


def aattente(img, t):
    market(img, 0.4)
    pill(img, "ATTENTE", (30, 150, 100), 150, WHITE, 46)
    speech(img, "« Je passe juste\nprendre du *pain*. »", 260, WHITE, 66)
    s = back((t - 0.4) / 0.35)
    if t > 0.4:
        ticket(img, 270, 520 + (1 - s) * 80, 540, ITEMS[:1], 1.30, title="PLAN")
    if t > 1.2:
        speech(img, "*1 article.* Facile.", 880, WHITE, 66)
    paste(img, scaled(p1_small(), 1.2), 170, 1060)
    paste(img, scaled(panier_perso("happy", talk(t) if t < 1.2 else 0, 0), 0.9), 560, 1110)
    brand_tag(img, 40, 1450)


def arealite(img, t):
    market(img, 0.45)
    k = min(3, int(t / STEP))
    pill(img, f"RÉALITÉ · {DAYS[k]} · PASSAGE {k + 1}/4", RED, 150, WHITE, 42)
    n = 0
    for i in range(len(ITEMS)):
        if t >= 0.1 + (i // 2) * STEP + (i % 2) * 0.4:
            n = i + 1
    tot = sum(v for _, v in ITEMS[:n])
    ticket(img, 220, 260, 640, ITEMS, round(tot, 2), n, "TICKETS DE LA SEMAINE", hi=n - 1 if n else None)
    d = ImageDraw.Draw(img)
    d.text((540, 1050), "Montants d'exemple", font=inter(30, "Medium"), fill=(205, 212, 235), anchor="mm")
    if t > 3.7:
        speech(img, "*3 pains* et 5 « petits trucs ».", 1090, WHITE, 54)
    full = min(3, n // 2)
    paste(img, scaled(panier_perso("panic", talk(t), full), 0.75), 560, 1230 + math.sin(t * 12) * 4)
    paste(img, scaled(p1_small(), 0.85), 300, 1230)


QZ = 1.0
CD0, CD1 = 1.5, 3.0


def stat_cards(img, t, start=0.0, y=400):
    for k, (big, small, col) in enumerate((("+4,9 %", "de passages\nen magasin", CYAN),
                                           ("-1,40 €", "par passage\n(panier moyen)", YEL))):
        p = back((t - start - k * 0.35) / 0.3)
        if p <= 0:
            continue
        x = 80 + k * 470
        b, g = glow_box(450, 300, 30, (16, 22, 40), col, 18)
        paste(img, b, x - g, y + (1 - p) * 120 - g)
        d = ImageDraw.Draw(img)
        d.text((x + 225, y + 95 + (1 - p) * 120), big, font=inter(96, "Black"), fill=col, anchor="mm")
        rich(d, x + 225, y + 170 + (1 - p) * 120, small, inter(40, "Bold"), WHITE, YEL, None, 50)


def pm_buttons(img, t, rev, start=1.1, y=900):
    for k, lab in enumerate(("PLUS", "MOINS")):
        p = back((t - start - k * 0.12) / 0.3)
        if p <= 0:
            continue
        good = rev and lab == "PLUS"
        col = (GREEN if good else (70, 72, 92)) if rev else ((220, 80, 90) if k == 0 else (60, 120, 230))
        x = 90 + k * 460
        bb, gg = glow_box(420, 150, 30, col, WHITE if good else col, 24 if good else 10)
        paste(img, bb, x - gg, y + (1 - p) * 300 - gg)
        sym = "▲" if k == 0 else "▼"
        ImageDraw.Draw(img).text((x + 210, y + 75 + (1 - p) * 300), f"{sym} {lab}", font=inter(66, "Black"),
                                 fill=NAVY if good else (WHITE if not rev else (150, 150, 170)), anchor="mm")


def aquiz(img, t):
    img.paste(bg_tuto())
    pill(img, "LE VRAI CHIFFRE · FRANCE", MAG, 150, WHITE, 42)
    d = ImageDraw.Draw(img)
    d.text((540, 300), "Sur 4 semaines :", font=inter(66, "Black"), fill=WHITE, anchor="mm")
    stat_cards(img, t, 0.1)
    if t > QZ:
        rich(ImageDraw.Draw(img), 540, 760, "Et la dépense *totale* ?", inter(74, "Black"), WHITE, YEL, None, 86)
    pm_buttons(img, t, False)
    if t >= CD0:
        countdown(img, t, CD0, CD1, 1160)
    ImageDraw.Draw(img).text((540, 1300), SRC_A, font=inter(30, "Medium"), fill=GREY, anchor="mm")
    brand_tag(img, 40, 1450)


def areveal(img, t):
    img.paste(bg_tuto())
    pill(img, "RÉPONSE", (30, 150, 100), 150, WHITE, 44)
    pm_buttons(img, t, True, -1, 300)
    s = back(t / 0.35)
    d = ImageDraw.Draw(img)
    d.text((540, 620), "+0,4 %", font=inter(int(190 * max(0.3, s)), "Black"), fill=GREEN, anchor="mm")
    rich(d, 540, 760, "de dépenses au total\n(produits de grande conso et frais)", inter(46, "Bold"), WHITE, YEL,
         None, 60)
    if t > 1.0:
        rich(d, 540, 940, "Panier plus petit\n≠ *budget plus petit*.", inter(80, "Black"), WHITE, YEL, None, 98)
    d.text((540, 1180), "Worldpanel by Numerator, via supermarche.tv (10 nov. 2026)", font=inter(30, "Medium"),
           fill=GREY, anchor="mm")
    paste(img, scaled(panier_perso("sad" if t > 1.0 else "panic", 0, 3), 0.6), 414, 1230)
    tint(img, GREEN, 0.2 * max(0, 1 - t / 0.25))


def abrand(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Note chaque *petit passage*,\nvois ton *repère Courses*.", inter(62), WHITE, GREEN, None, 80)
    x, y, w, h = phone(img, 380, 860)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Courses · Novembre", font=inter(42), fill=WHITE)
    for i, (day, v) in enumerate((("Lun.", 5.20), ("Mar.", 3.40), ("Jeu.", 5.00), ("Sam.", 5.80))):
        p = ease((t - 0.2 - i * 0.18) / 0.3)
        if p <= 0:
            continue
        yy = y + 190 + i * 76
        d.text((x + 50 - (1 - p) * 40, yy), f"{day} · Courses", font=inter(38, "Bold"), fill=WHITE)
        d.text((x + w - 50, yy), f"{v:.2f}".replace(".", ",") + f"{NB}€", font=inter(38, "Bold"), fill=WHITE,
               anchor="ra")
    bars(img, t, x + 50, y + 520, w - 100, [("Courses", 228, 250, YEL)], 0.9)
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + 780), "Montants d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")
    notif(img, t, 1.7, "Repère Courses bientôt atteint", 1290)


def aend(img, t):
    market(img, 0.6)
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 190, "Et toi, tu passes\n*combien de fois*\npar semaine au magasin ?", inter(74, "Black"),
         WHITE, YEL, None, 96)
    d.text((540, 560), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, logo(100), 210, 630)
    d.text((330, 680), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    speech(img, "« Je passe juste prendre du pain… »", 850, WHITE, 52)
    paste(img, panier_perso("happy", talk(t), 1), 330, 1060)


A = [(ahook, 2.8), (aattente, 2.6), (arealite, 4.4), (aquiz, 3.6), (areveal, 3.0), (abrand, 3.2), (aend, 2.2)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="chiptune_doux", key="D", bpm=122, seed=9485, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[5], end_at=cuts[6] + 0.1)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    m.pop(cuts[1] + 0.4, 0.18)
    m.pop(cuts[1] + 1.2, 0.16)
    for i in range(len(ITEMS)):
        m.tick(cuts[2] + 0.1 + (i // 2) * STEP + (i % 2) * 0.4, 0.13)
    m.pop(cuts[2] + 3.7, 0.16)
    m.pop(cuts[3] + 0.1, 0.16)
    m.pop(cuts[3] + 0.45, 0.16)
    m.pop(cuts[3] + QZ, 0.16)
    for k in range(3):
        m.tick(cuts[3] + CD0 + k * (CD1 - CD0) / 3)
    m.reveal(cuts[4], good=True)
    m.pop(cuts[4] + 1.0, 0.16)
    m.pop(cuts[5] + 1.7, 0.2)
    m.jingle(cuts[6] + 0.1)
    m.end(path)


# ---- B : Survie fin de mois, Partie 2/2 --------------------------------------
def bhook(img, t):
    sky(img, 11)
    pill(img, "SURVIE · FIN DE MOIS · PARTIE 2/2", RED, 150, WHITE, 38)
    hud_budget(img, 49.01, 16, 250)
    d = ImageDraw.Draw(img)
    rich(d, 540, 490, "Cadeau à *30 €*\nou fait main à *5 €* ?", inter(92, "Black"), WHITE, YEL, None, 112)
    rich(d, 540, 750, "Voici *les deux fins*.\nUne seule tient jusqu'à la paie.", inter(54, "Bold"), WHITE, YEL,
         None, 70)
    p1(img, t, "worry", 960, 0.6, 0)
    punch_in(img, t)


def brecap(img, t):
    sky(img, 22)
    pill(img, "ÉPISODE 1 EN 2 SECONDES", MAG, 150, WHITE, 40)
    hud_budget(img, 49.01, 16, 250)
    panel(img, t, [("🍱", f"Gamelle : 0{NB}€", GREEN), ("📺", f"Abonnement : -9,99{NB}€", (255, 120, 120)),
                   ("🍻", f"Bar : -25{NB}€", (255, 120, 120))], 500, 0.1)
    if t > 1.0:
        rich(ImageDraw.Draw(img), 540, 860, "Et samedi : *l'anniversaire*\nde ta meilleure amie.", inter(56, "Bold"),
             WHITE, YEL, None, 72)
    p1(img, t, "worry", 1080, 0.5, 0)


def bfin_a(img, t):
    sky(img, 16)
    pill(img, "FIN A · CADEAU ACHETÉ", (60, 90, 230), 150, WHITE, 42)
    f = ease((t - 0.5) / 0.25) * max(0, 1 - (t - 1.8) / 0.6) if t >= 0.5 else 0
    hud_budget(img, 49.01 if t < 0.5 else 19.01, 16, 250, f, -30)
    speech(img, "Ta meilleure amie\n*adore* son cadeau.", 480, WHITE, 58)
    if t > 1.5:
        rich(ImageDraw.Draw(img), 540, 720, "Mais ton repère tombe à\n*1,19 € par jour*.", inter(64, "Black"),
             WHITE, YEL, None, 80)
    p1(img, t, "happy" if t < 1.5 else "worry", 960, 0.6, talk(t) if t < 1.5 else 0)


def bfin_a2(img, t):
    sky(img, 19)
    pill(img, "FIN A · 6 JOURS SANS DÉPENSE", (60, 90, 230), 150, WHITE, 42)
    hud_budget(img, 19.01, 10, 250)
    speech(img, "Les courses de la semaine :\n*22 €*.", 480, WHITE, 58)
    notif(img, t, 0.8, "Découvert possible avant ta paie", 690)
    if t > 1.6:
        rich(ImageDraw.Draw(img), 540, 920, "Fin A : *découvert*\nà 10 jours de la paie.", inter(66, "Black"),
             WHITE, YEL, None, 82)
    p1(img, t, "shout" if t > 0.8 else "worry", 1100, 0.5, 0)
    if t >= 0.8:
        tint(img, RED, 0.18 * max(0, 1 - (t - 0.8) / 0.3))


def bfin_b(img, t):
    sky(img, 13)
    pill(img, "FIN B · FAIT MAIN", (200, 70, 160), 150, WHITE, 42)
    f = ease((t - 0.5) / 0.25) * max(0, 1 - (t - 1.8) / 0.6) if t >= 0.5 else 0
    hud_budget(img, 49.01 if t < 0.5 else 44.01, 16, 250, f, -5)
    speech(img, "Un album photo *fait main*.\nElle a *pleuré*.", 480, WHITE, 58)
    if t > 1.6:
        rich(ImageDraw.Draw(img), 540, 720, "Repère : *2,75 € par jour*.\nÇa passe, de justesse.", inter(62, "Black"),
             WHITE, GREEN, None, 78)
    p1(img, t, "happy", 960, 0.6, talk(t) if t < 1.6 else 0)


def bvraie(img, t):
    img.paste(bg_tuto())
    pill(img, "LA VRAIE FIN", GREEN, 150, NAVY, 46)
    d = ImageDraw.Draw(img)
    rich(d, 540, 250, "Le vrai héros, c'est celui\nqui *savait* combien\nil lui restait.", inter(68, "Black"),
         WHITE, GREEN, None, 84)
    if t > 0.8:
        hud_budget(img, 44.01, 16, 560)
    if t > 1.4:
        rich(ImageDraw.Draw(img), 540, 810, "Repère par jour jusqu'à la paie.\nAlerte *avant* un découvert.",
             inter(50, "Bold"), WHITE, GREEN, None, 66)
    brand_tag(img, 40, 1450)
    p1(img, t, "happy", 1010, 0.5, 0)


def bend(img, t):
    img.paste(bg_end())
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 220, "Et toi, sois honnête :\ntu aurais pris\n*A ou B* ?", inter(86, "Black"), WHITE, YEL, None, 108)
    d.text((540, 640), "Réponds en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    s = back(t / 0.35)
    sz = max(20, int(110 * s))
    paste(img, logo(sz), 250 - sz / 2, 790 - sz / 2)
    d.text((325, 790), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 920), "Montants d'exemple · histoire inventée", font=inter(32, "Medium"), fill=GREY, anchor="mm")
    p1(img, t, "happy", 1000, 0.5, talk(t))


B = [(bhook, 2.8), (brecap, 2.4), (bfin_a, 3.6), (bfin_a2, 3.4), (bfin_b, 3.8), (bvraie, 3.4), (bend, 2.4)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="synthwave", key="F", bpm=100, seed=2206, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[5], end_at=cuts[6] + 0.15)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for k in range(3):
        m.pop(cuts[1] + 0.15 + k * 0.12, 0.15)
    m.pop(cuts[1] + 1.0, 0.16)
    m.reveal(cuts[2] + 0.5, good=False)
    m.pop(cuts[2] + 1.5, 0.16)
    m.pop(cuts[3] + 0.8, 0.2)
    m.reveal(cuts[3] + 1.6, good=False)
    m.reveal(cuts[4] + 0.5, good=True)
    m.pop(cuts[4] + 1.6, 0.16)
    m.pop(cuts[5] + 0.8, 0.16)
    m.pop(cuts[5] + 1.4, 0.16)
    m.jingle(cuts[6] + 0.15)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.0, 2: 4.2, 3: 3.4, 4: 2.0, 5: 2.6, 6: 1.5}
TIMES_B = {0: 0.0, 1: 2.0, 2: 3.0, 3: 2.8, 4: 3.2, 5: 3.0, 6: 1.8}

if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_courses_attente_realite", A, music_a)
        if which in ("b", "all"):
            render("budgetloyer_survie_fin_de_mois_p2", B, music_b)
