"""Épisodes du 12 novembre 2026.

Vidéo A : « Carte contre Billet », jeu « Plus ou moins ? » en 4 rounds sur un ring (format inédit).
Source : sondage Ifop pour la Monnaie de Paris (2 000 personnes), publié le 9 nov. 2026
(boursorama.com, fr.qz.com).
Vidéo B : « La guerre du thermostat », Partie 2/2 (suite de la vidéo du 11 nov.).
Source : Selectra, « Chauffage : les chiffres clés » (mis à jour le 18 mai 2026), d'après l'ADEME :
19 °C conseillés dans le salon, environ 7 % d'économie par degré en moins.
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

# Réutilise le décor et les colocs de la Partie 1/2 pour garder la série cohérente.
_spec = importlib.util.spec_from_file_location("ep1111", os.path.join(ROOT, "episodes", "2026-11-11.py"))
ep1111 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ep1111)
tint, pill, scaled = ep1111.tint, ep1111.pill, ep1111.scaled
bg_room, heat, wind, thought, bill = ep1111.bg_room, ep1111.heat, ep1111.wind, ep1111.thought, ep1111.bill
LEA, HUGO, INES, chords_music, ig_version = ep1111.LEA, ep1111.HUGO, ep1111.INES, ep1111.chords_music, ep1111.ig_version

GREY = (150, 165, 175)


def talk(t, rate=7):
    return int(t * rate) % 2


# ---- A : Carte contre Billet, plus ou moins ? ------------------------------
SRC_A = "Sondage Ifop pour la Monnaie de Paris, 2 000 personnes, publié le 9 nov. 2026"

# (question, seuil, bonne réponse "PLUS"/"MOINS", explication, humeur carte, humeur billet)
ROUNDS = [
    ("Paient par *carte bancaire* :\nplus ou moins de…", "90 %", "PLUS",
     "*94 %* des Français\n(92 % en 2025).", "happy", "sad"),
    ("Utilisent encore *des espèces* :\nplus ou moins de…", "70 %", "MOINS",
     "*66 %*, en baisse sur un an.\nMais toujours 2e !", "happy", "worry"),
    ("Inquiets de voir *disparaître*\nles espèces : plus ou moins de…", "50 %", "PLUS",
     "*85 %* ! Le billet\na encore des fans.", "worry", "happy"),
    ("Liquide gardé *à la maison*\n(en moyenne) : plus ou moins de…", f"200{NB}€", "MOINS",
     f"*168{NB}€* en moyenne, chez\nprès d'1 Français sur 2.", "worry", "happy"),
]
RT = 4.3
CD0, REV = 1.3, 2.7


def fighters(img, t, ec="angry", eb="angry", mc=0, mb=0, y=1080, k=0.62):
    """Les deux persos de part et d'autre du ring, qui sautillent."""
    c = scaled(carte_perso(ec, mc), k)
    b = scaled(billet_perso(eb, mb), k)
    paste(img, c, 60, y + math.sin(t * 7) * 10)
    paste(img, b, 930 - b.width, y + math.cos(t * 7) * 10)


def vs_header(img, y=150):
    d = ImageDraw.Draw(img)
    f = inter(58, "Black")
    d.text((300, y + 40), "CARTE", font=f, fill=(140, 170, 255), anchor="mm")
    d.text((540, y + 40), "VS", font=inter(48, "Black"), fill=YEL, anchor="mm")
    d.text((760, y + 40), "BILLET", font=f, fill=(150, 214, 160), anchor="mm")


def round_scene(i):
    q, seuil, ans, expl, ec, eb = ROUNDS[i]

    def scene(img, t):
        img.paste(bg_ring())
        pill(img, f"ROUND {i + 1}/4", RED if i == 3 else MAG, 150, WHITE, 40)
        b, g = glow_box(940, 330, 28, NAVY, YEL)
        paste(img, b, 70 - g, 250 - g)
        d = ImageDraw.Draw(img)
        fs = next(k for k in range(54, 30, -2)
                  if max(inter(k, "Bold").getlength(l.replace("*", "")) for l in q.split("\n")) <= 850)
        rich(d, 540, 284 + (54 - fs), q, inter(fs, "Bold"), WHITE, YEL, None, int(fs * 1.33))
        d.text((540, 480), seuil, font=inter(110, "Black"), fill=YEL, anchor="mm")
        rev = t >= REV
        for k, lab in enumerate(("PLUS", "MOINS")):
            p = back((t - 0.15 - k * 0.12) / 0.3)
            if p <= 0:
                continue
            good = rev and lab == ans
            x = 110 + k * 450
            col = (GREEN if good else (70, 72, 92)) if rev else ((40, 110, 220) if k == 0 else (200, 60, 90))
            bb, gg = glow_box(410, 150, 30, col, WHITE if good else col, 24 if good else 10)
            paste(img, bb, x - gg, 640 + (1 - p) * 300 - gg)
            d = ImageDraw.Draw(img)
            arrow = "▲" if k == 0 else "▼"
            d.text((x + 205, 715 + (1 - p) * 300), f"{arrow} {lab}", font=inter(70, "Black"),
                   fill=NAVY if good else (WHITE if not rev else (150, 150, 170)), anchor="mm")
        d = ImageDraw.Draw(img)
        if not rev and t >= CD0:
            n = max(1, min(3, 3 - int((t - CD0) / ((REV - CD0) / 3))))
            k = back(((t - CD0) * 3 / (REV - CD0)) % 1)
            d.text((540, 920), str(n), font=inter(int(140 * (0.7 + 0.3 * k)), "Black"), fill=YEL, anchor="mm")
        elif not rev:
            d.text((540, 920), "Plus ou moins ?", font=inter(64, "Black"), fill=WHITE, anchor="mm")
        else:
            rich(d, 540, 855, expl, inter(56, "Bold"), WHITE, YEL, None, 72)
        if rev:
            fighters(img, t, ec, eb, talk(t) if ec == "happy" else 0, talk(t) if eb == "happy" else 0)
        else:
            fighters(img, t)
        brand_tag(img, 40, 1440)
        if rev:
            tint(img, GREEN, 0.22 * max(0, 1 - (t - REV) / 0.25))

    return scene


def ahook(img, t):
    img.paste(bg_ring())
    vs_header(img, 140)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, "Team *carte*\nou team *billet* ?", inter(108, "Black"), WHITE, YEL, None, 138)
    rich(d, 540, 590, "4 chiffres d'un sondage.\nDevine : *plus ou moins* ?", inter(68, "Bold"), WHITE, YEL, None, 86)
    d.text((540, 800), "Ifop / Monnaie de Paris, publié le 9 nov. 2026", font=inter(34, "Medium"),
           fill=(220, 210, 240), anchor="mm")
    fighters(img, t, "angry", "angry", talk(t), talk(t + 0.1), 960, 0.8)
    punch_in(img, t)


def atwist(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Le hic du billet :\nta banque ne sait pas\n*où il est passé*.", inter(72), WHITE, GREEN, None, 90)
    x, y, w, h = phone(img, 480, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Nouvelle dépense", font=inter(42), fill=WHITE)
    rows = [("Date", "12 nov."), ("Catégorie", "Courses"), ("Montant", f"4,20{NB}€")]
    for k, (a, b) in enumerate(rows):
        p = ease((t - 0.3 - k * 0.3) / 0.3)
        if p <= 0:
            continue
        yy = y + 190 + k * 130
        paste(img, box(w - 80, 110, 22, (24, 32, 44, 255)), x + 40 + (1 - p) * 200, yy)
        d = ImageDraw.Draw(img)
        d.text((x + 70 + (1 - p) * 200, yy + 55), a, font=inter(34, "Medium"), fill=GREY, anchor="lm")
        d.text((x + w - 70 + (1 - p) * 200, yy + 55), b, font=inter(40, "Bold"), fill=WHITE, anchor="rm")
    if t > 1.3:
        s = back((t - 1.3) / 0.3)
        paste(img, box(int((w - 80) * max(0.1, s)), 100, 50, GREEN + (255,)), x + 40, y + 600)
        d = ImageDraw.Draw(img)
        if s > 0.8:
            d.text((x + w / 2, y + 650), "Ajouter", font=inter(44, "Black"), fill=NAVY, anchor="mm")
    d.text((x + w / 2, y + 790), "Montant d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")
    if t > 1.7:
        rich(d, 540, 1410, "Sur *BudgetLoyer*, le liquide\nse note comme le reste.", inter(52, "Bold"),
             WHITE, GREEN, None, 66)


def aend(img, t):
    img.paste(bg_ring())
    confetti(img, t)
    vs_header(img, 140)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, "Alors :\nteam *carte*\nou team *billet* ?", inter(104, "Black"), WHITE, YEL, None, 128)
    d.text((540, 720), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, logo(100), 210, 790)
    d.text((330, 840), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    fighters(img, t, "happy", "happy", talk(t), talk(t + 0.1), 960, 0.8)


A = [(ahook, 2.8)] + [(round_scene(i), RT) for i in range(4)] + [(atwist, 3.2), (aend, 2.2)]


def music_a(total, path, music=True):
    m = SoftMix(total, music=music)
    chords_music(m, total, 120, [(220, 261.6, 329.6), (174.6, 220, 261.6), (261.6, 329.6, 392), (196, 246.9, 293.7)])
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        q0 = cuts[1 + i]
        m.add(m.sn(392, 0.3, 6) + 0.3 * m.sn(784, 0.3, 9), q0 + 0.02, 0.18)  # cloche de round, douce
        for k in range(2):
            m.pop(q0 + 0.15 + k * 0.12, 0.16)
        for k in range(3):
            m.add(m.sn(880, 0.08, 20), q0 + CD0 + k * (REV - CD0) / 3, 0.16)
        for j, f in enumerate((523.3, 659.3, 784.0)):
            m.add(m.sn(f, 0.25, 8), q0 + REV + j * 0.08, 0.3)
    for k in range(3):
        m.pop(cuts[5] + 0.3 + k * 0.3, 0.15)
    m.pop(cuts[5] + 1.3, 0.2)
    m.jingle(cuts[6] + 0.1)
    m.end(path)


# ---- B : La guerre du thermostat, Partie 2/2 --------------------------------
DEF = [
    (LEA, "Moi, j'avais *le plaid*.\nJe ne compte pas !", "25° pour un plaid ?", 25),
    (HUGO, "Moi, je mettais *19°*.\nJe paie 19°, point.", "Lui, je le valide.", 19),
    (INES, "J'*aérais* ! C'est sain,\nl'aération.", "À 25°. Fenêtre ouverte.", 25),
]
DT = 2.6


def def_scene(i):
    who, line, th, temp = DEF[i]

    def scene(img, t):
        img.paste(bg_room(False, i == 2))
        if i == 2:
            wind(img, t)
        pill(img, f"LA DÉFENSE · {i + 1}/3", NAVY, 150, YEL, 42)
        speech(img, line, 262, WHITE, 52)
        if t > 0.8:
            thought(img, th, 470)
        ex = "panic" if temp >= 24 else "calm"
        wob = math.sin(t * 40) * 6 if ex == "panic" else 0
        paste(img, scaled(thermostat(temp, ex, talk(t) if t > 0.8 else 0), 0.9), 80 + wob, 660)
        s = back(t / 0.3)
        paste(img, coloc_bust(**dict(who, expr="angry" if t < 0.8 else "worry", mouth=talk(t) if t < 0.8 else 0)),
              540, 700 + (1 - s) * 500)
        brand_tag(img)

    return scene


def bhook(img, t):
    img.paste(bg_room(True, False))
    pill(img, "LA GUERRE DU THERMOSTAT · PARTIE 2/2", RED, 150, WHITE, 36)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, "La facture de chauffage\nest *arrivée*.", inter(76), WHITE, YEL, None, 104)
    rich(d, 540, 500, "Qui paie\ndans la *coloc* ?", inter(112, "Black"), WHITE, YEL, None, 132)
    d.text((540, 820), "POV : t'es le thermostat, et tu as tout vu", font=inter(42, "Bold"),
           fill=(255, 235, 250), anchor="mm")
    for k, (who, x) in enumerate(((LEA, 30), (HUGO, 310), (INES, 590))):
        paste(img, scaled(coloc_bust(**dict(who, expr="worry", mouth=talk(t + k * 0.2))), 0.8), x,
              960 + math.sin(t * 6 + k) * 6)
    punch_in(img, t)


def brecap(img, t):
    img.paste(bg_room(False, False))
    pill(img, "HIER", MAG, 150, WHITE, 44)
    d = ImageDraw.Draw(img)
    seq = [(0.0, 22, "07:30"), (0.5, 19, "08:15"), (1.0, 25, "13:00"), (1.5, 24, "23:30")]
    cur = [s for s in seq if t >= s[0]][-1]
    rich(d, 540, 270, "22°, puis 19°, puis *25°\nfenêtre ouverte*… et 24° la nuit.", inter(60, "Bold"),
         WHITE, YEL, None, 84)
    d.text((540, 520), cur[2], font=inter(90, "Black"), fill=YEL, anchor="mm")
    ex = "panic" if cur[1] >= 24 else "calm"
    paste(img, scaled(thermostat(cur[1], ex, 0), 1.1), 309 + (math.sin(t * 40) * 6 if ex == "panic" else 0), 640)
    if cur[1] >= 24:
        heat(img, t)
    brand_tag(img)


def bfact(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    pill(img, "LE THERMOSTAT A TOUT NOTÉ", MAG, 150, WHITE, 38)
    rich(d, 540, 290, "L'ADEME conseille\n*19°* dans le salon.", inter(86), WHITE, GREEN, None, 106)
    if t > 0.9:
        rich(d, 540, 560, "Et environ *7 % d'économie*\npar degré en moins\nsur le chauffage.", inter(62, "Bold"),
             WHITE, YEL, None, 80)
    paste(img, scaled(thermostat(19, "calm", talk(t) if t < 0.9 else 0), 0.7), 393, 860)
    d.text((540, 1250), "Source : Selectra, d'après l'ADEME (mis à jour en mai 2026)", font=inter(32, "Medium"),
           fill=GREY, anchor="mm")
    brand_tag(img)


def bfoyer(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Le verdict : *une facture*,\nun partage clair dans\nle *mode Foyer*.", inter(66), WHITE, GREEN, None, 84)
    x, y, w, h = phone(img, 480, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Foyer · Frais communs", font=inter(40), fill=WHITE)
    paste(img, box(w - 80, 150, 22, (24, 32, 44, 255)), x + 40, y + 180)
    d = ImageDraw.Draw(img)
    d.text((x + 70, y + 210), "Chauffage · novembre", font=inter(32, "Medium"), fill=GREY)
    p = ease((t - 0.3) / 0.8)
    d.text((x + 70, y + 252), f"{round(96 * p)}{NB}€", font=inter(64, "Black"), fill=WHITE)
    for k, (name, col) in enumerate((("Léa", (240, 120, 60)), ("Hugo", (40, 160, 110)), ("Inès", (54, 160, 220)))):
        q = back((t - 1.0 - k * 0.25) / 0.3)
        if q <= 0:
            continue
        yy = y + 370 + k * 110
        d = ImageDraw.Draw(img)
        d.ellipse((x + 60, yy + 10, x + 120, yy + 70), fill=col)
        d.text((x + 90, yy + 40), name[0], font=inter(34, "Black"), fill=WHITE, anchor="mm")
        d.text((x + 145, yy + 40), name, font=inter(40, "Bold"), fill=WHITE, anchor="lm")
        d.text((x + w - 60 + (1 - q) * 100, yy + 40), f"32{NB}€", font=inter(44, "Black"), fill=GREEN, anchor="rm")
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + 790), "Montants d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")
    if t > 2.0:
        s = back((t - 2.0) / 0.35)
        sz = max(20, int(100 * s))
        paste(img, logo(sz), 250 - sz / 2, 1440 - sz / 2)
        d.text((320, 1440), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")


def bend(img, t):
    img.paste(bg_room(True, False))
    d = ImageDraw.Draw(img)
    title_neon(img, t, "ET CHEZ TOI ?", 230, YEL, 110)
    rich(d, 540, 360, "*Parts égales*\nou celui qui chauffe\n*paie plus* ?", inter(90, "Black"), WHITE, YEL, None, 110)
    d.text((540, 730), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, logo(100), 210, 820)
    d.text((330, 870), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    paste(img, scaled(thermostat(19, "calm", talk(t)), 0.5), 735, 1100 + math.sin(t * 5) * 6)


B = [(bhook, 2.8), (brecap, 2.2)] + [(def_scene(i), DT) for i in range(3)] + [(bfact, 3.0), (bfoyer, 3.4), (bend, 2.2)]


def music_b(total, path, music=True):
    m = SoftMix(total, music=music)
    chords_music(m, total, 104, [(196, 246.9, 293.7), (220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)])
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for k in range(4):
        m.pop(cuts[1] + k * 0.5, 0.14)
    for i in range(3):
        c = cuts[2 + i]
        m.pop(c + 0.05, 0.16)
        m.pop(c + 0.8, 0.14)
    m.pop(cuts[5] + 0.9, 0.16)
    for k in range(3):
        m.pop(cuts[6] + 1.0 + k * 0.25, 0.15)
    m.jingle(cuts[6] + 2.0)
    m.pop(cuts[7] + 0.05)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.0, 2: 3.8, 3: 3.8, 4: 3.8, 5: 3.0, 6: 2.0}
TIMES_B = {0: 0.0, 1: 1.8, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.8, 6: 3.2, 7: 2.0}

if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        render("budgetloyer_carte_ou_billet", A, music_a)
        ig_version("budgetloyer_carte_ou_billet", A, music_a)
        render("budgetloyer_thermostat_coloc_p2", B, music_b)
