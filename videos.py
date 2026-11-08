"""Vidéo A : sketch jeu vidéo, Black Friday. Vidéo B : tuto, Noël."""
import math
import sys

import numpy as np
from PIL import Image, ImageDraw

from bl import *


# ---- A : Black Friday, DA sketch jeu vidéo ------------------------------
def talking(t, rate=7):
    return int(t * rate) % 2


def a1(img, t):
    img.paste(bg_synth())
    title_neon(img, t, "BLACK FRIDAY", 590)
    paste(img, p1_bust("happy", 0), 160, 1100)
    dialog(img, t, "VOIX OFF", MAG, "Le 27 novembre, ton budget\naffronte son *pire boss*.")


def a2(img, t):
    img.paste(bg_synth())
    paste(img, p1_bust("happy", talking(t) if t < 1.6 else 0), 160, 1100)
    dialog(img, t, "JOUEUR 1", CYAN, "Tranquille, j'achète\n*juste un truc*.")
    panel(img, t, [("🎮", "NOUVELLE PARTIE", YEL), ("❤️", "1 vie", WHITE),
                   ("💰", f"Reste ce mois : 340{NB}€", WHITE)], 560, 0.45)


def a3(img, t):
    img.paste(bg_day())
    s = back(t / 0.4)
    b = boss(talking(t, 6) if t < 3.2 else 0)
    wob = math.sin(t * 7) * 8
    paste(img, b, 160 + wob, 800 + (1 - s) * 950)
    dialog(img, t, "BLACK FRIDAY", RED, "*MOINS 70 %* ! Plus que\n3 articles ! Dépêche-toi !")


TAGS = [(0.5, "89,99 €", 620, 640), (1.5, "34,50 €", 90, 760)]


def a4(img, t):
    img.paste(bg_shop())
    n = 340.0
    for st, _, _, _ in TAGS:
        pass
    if t > 0.5:
        n -= 89.99
    if t > 1.5:
        n -= 34.5
    x = 460 + math.sin(t * 6) * 16
    paste(img, p1_small(), x, 1395)
    for st, txt, tx, ty in TAGS:
        p = back((t - st) / 0.28)
        if t >= st:
            paste(img, price_tag(txt.replace(" ", NB)), tx + (1 - p) * 260, ty)
    dialog(img, t, "JOUEUR 1", CYAN, "J'en avais même\n*pas besoin*…")
    d = ImageDraw.Draw(img)
    val = f"{n:.2f}".replace(".", ",")
    c = (20, 20, 26) if t < 0.5 else (200, 30, 30)
    d.text((540, 520), "RESTE CE MOIS", font=mono(46), fill=(60, 60, 90), anchor="mm")
    d.text((540, 600), f"{val}{NB}€", font=mono(92), fill=c, anchor="mm")


def a5(img, t):
    img.paste(bg_rays())
    s = back(t / 0.35)
    paste(img, card_minion(talking(t) if t < 2.8 else 0), 230, 720 + math.sin(t * 5) * 18 + (1 - s) * 800)
    paste(img, p1_bust("worry", 0), 160, 1180)
    dialog(img, t, "PAIEMENT EN 4X", (88, 66, 230), "Tu paieras plus tard.\n*Janvier, c'est loin !*")


def a6(img, t):
    img.paste(Image.new("RGB", (W, H), (24, 2, 8)))
    d = ImageDraw.Draw(img)
    s = back(t / 0.3)
    size = int(190 * max(0.2, s))
    d.text((540, 730), "GAME", font=mono(size), fill=RED, anchor="mm")
    d.text((540, 930), "OVER", font=mono(size), fill=RED, anchor="mm")
    if t > 0.7:
        d.text((540, 1130), "CONTINUER ? 9", font=mono(62), fill=WHITE, anchor="mm")


def a7(img, t):
    img.paste(bg_tuto())
    dialog(img, t, "JOUEUR 1", CYAN, "Cette fois, je mets\n*mes limites* avant !")
    dashboard(img, t, 660)
    notif(img, t, 3.0, f"Budget Loisirs dépassé de 12{NB}€", 450)


def a8(img, t):
    img.paste(bg_end())
    confetti(img, t)
    d = ImageDraw.Draw(img)
    p = back(t / 0.4)
    paste(img, logo(180), 450, 340 + (1 - p) * -200)
    rich(d, 540, 620, "Ne laisse pas\nle Black Friday\njouer contre toi.", mono(70), WHITE, YEL, typing(t, 0.1, 60), 92)
    if t > 1.1:
        rich(d, 540, 1000, "Anticipe tes\ndépenses sur\n*BudgetLoyer.com*", mono(70), WHITE, YEL, None, 92)
    if t > 2.0:
        d.text((540, 1320), "Lien en bio", font=inter(58), fill=GREEN, anchor="mm")


A = [(a1, 3.6), (a2, 3.4), (a3, 4.6), (a4, 4.6), (a5, 4.4), (a6, 2.4), (a7, 6.2), (a8, 4.6)]


def chip_music(total, path, sr=44100):
    out = np.zeros(int(total * sr) + sr)

    def add(sig, at, g):
        s = int(at * sr)
        e = min(len(out), s + len(sig))
        out[s:e] += sig[: e - s] * g

    def sq(f, l, dec=6):
        n = int(l * sr)
        x = np.arange(n) / sr
        return np.sign(np.sin(2 * np.pi * f * x)) * np.exp(-x * dec)

    step = 60 / 150 / 2
    prog = [(220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7), (164.8, 207.7, 246.9)]
    n = int(total / step)
    kick_x = np.arange(int(0.16 * sr)) / sr
    kick = np.sin(2 * np.pi * (50 * kick_x + 40 * (1 - np.exp(-kick_x * 34)) / 34)) * np.exp(-kick_x * 22)
    cuts = np.cumsum([d for _, d in A])
    go0, go1 = cuts[4], cuts[5]
    for i in range(n):
        at = i * step
        if go0 <= at < go1:
            continue
        ch = prog[(i // 16) % 4]
        add(sq(ch[i % 3] * 2, step * 0.9), at, 0.11)
        if i % 4 == 0:
            add(sq(ch[0] / 2, step * 2, 3), at, 0.17)
            add(kick, at, 0.55)
    for f, l, at in ((392, 0.1, go0), (330, 0.14, go0 + 0.12), (262, 0.18, go0 + 0.28), (196, 0.5, go0 + 0.48)):
        add(sq(f, l + 0.1, 2), at, 0.34)
    a3_at = cuts[1]
    add(sq(80, 0.6, 3), a3_at, 0.4)
    at4 = cuts[2]
    for tt in (0.5, 1.5):
        add(sq(620, 0.09, 12), at4 + tt, 0.3)
    add(sq(988, 0.09, 10), cuts[5] + 3.0, 0.3)
    add(sq(1318, 0.14, 10), cuts[5] + 3.1, 0.3)
    for k, f in enumerate((523, 659, 784, 1047)):
        add(sq(f, 0.15, 7), cuts[6] + k * 0.1, 0.25)
    write_wav(out[: int(total * sr)], path)


# ---- B : Noël, DA tuto sombre -------------------------------------------
BIG = inter(98)
HEAD = inter(72)


def b1(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 520, f"Les Français\nprévoient *581{NB}€*\npour Noël.",
         BIG, WHITE, GREEN, None, 124)
    if t > 1.2:
        rich(d, 540, 960, "Ton compte\nest prêt ?", inter(120), WHITE, GREEN, None, 146)
    d.text((540, 1350), "Prévisions 2026, baromètre Cofidis / CSA Research", font=inter(34, "Medium"),
           fill=(145, 158, 168), anchor="mm")


def wallet(img, t):
    p = P(620, 480)
    D = (10, 40, 32)
    p.r(40, 110, 470, 300, 44, (8, 50, 40))
    p.r(20, 170, 600, 460, 54, D)
    p.r(420, 275, 600, 355, 40, (8, 50, 40), WHITE, 7)
    p.e(475, 315, 18, 18, WHITE)
    return p.out()


W_SPR = wallet(None, 0)


def coin(img, x, y, sz):
    p = P(sz, sz)
    p.e(sz / 2, sz / 2, sz / 2, sz / 2, YEL)
    p.t((sz / 2, sz / 2), "€", lambda k: inter(int(sz * 0.55) * k), (190, 120, 20))
    s = p.out()
    paste(img, s, x, y)


def b2(img, t):
    img.paste(Image.new("RGB", (W, H), GREEN))
    d = ImageDraw.Draw(img)
    rich(d, 540, 240, "Spoiler : tu as\n*encore le temps*", inter(100), WHITE, (9, 40, 32), None, 128)
    paste(img, W_SPR, 230, 780 + math.sin(t * 3) * 10)
    coin(img, 410, 660 + math.sin(t * 4) * 24, 92)
    coin(img, 590, 590 + math.cos(t * 4) * 24, 72)


def head(img, t, txt):
    d = ImageDraw.Draw(img)
    rich(d, 540, 200, txt, HEAD, WHITE, GREEN, typing(t, 0, 60), 90)


def b3(img, t):
    img.paste(bg_tuto())
    head(img, t, "Étape *1* : un objectif\n*pour Noël*")
    x, y, w, h = phone(img, 520, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 110), "Objectif d'épargne", font=inter(44), fill=WHITE)
    c = box(w - 80, 280, 26, (22, 30, 42, 255))
    paste(img, c, x + 40, y + 200)
    p = ease((t - 0.8) / 1.8)
    d.text((x + 80, y + 236), "Objectif Noël", font=inter(34, "Medium"), fill=(165, 178, 188))
    d.text((x + 80, y + 300), f"{round(194 * p)}{NB}€", font=inter(100), fill=GREEN)
    bw = w - 100
    d.rounded_rectangle((x + 50, y + 530, x + 50 + bw, y + 570), 20, fill=(36, 46, 58))
    d.rounded_rectangle((x + 50, y + 530, x + 50 + max(40, bw * 194 / 581 * p), y + 570), 20, fill=GREEN)
    d.text((x + 50, y + 590), f"0{NB}€", font=inter(32, "Medium"), fill=(165, 178, 188))
    d.text((x + w - 50, y + 590), f"Objectif 581{NB}€", font=inter(32, "Medium"), fill=(165, 178, 188), anchor="ra")
    if t > 2.6:
        c2 = box(w - 80, 150, 26, (22, 30, 42, 255))
        paste(img, c2, x + 40, y + 680)
        d = ImageDraw.Draw(img)
        d.text((x + 80, y + 706), "Reste à mettre de côté", font=inter(32, "Medium"), fill=(165, 178, 188))
        d.text((x + 80, y + 756), f"387{NB}€", font=inter(46), fill=WHITE)


def b4(img, t):
    img.paste(bg_tuto())
    head(img, t, "Étape *2* : un repère\npour *chaque dépense*")
    x, y, w, h = phone(img, 520, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 110), "Budgets · Novembre", font=inter(44), fill=WHITE)
    bars(img, t, x + 50, y + 220, w - 100,
         [("Loyer", 650, 650, GREEN), ("Courses", 276, 300, YEL), ("Cadeaux", 96, 150, GREEN), ("Loisirs", 88, 120, GREEN)], 0.7)


def b5(img, t):
    img.paste(bg_tuto())
    head(img, t, "Étape *3* : une *alerte*\nsi tu dépasses")
    x, y, w, h = phone(img, 520, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 110), "Budgets · Novembre", font=inter(44), fill=WHITE)
    bars(img, t, x + 50, y + 300, w - 100,
         [("Loyer", 650, 650, GREEN), ("Courses", 276, 300, YEL), ("Cadeaux", 162, 150, RED)], 0.5)
    if t >= 1.7:
        p = back((t - 1.7) / 0.35)
        n = box(w - 40, 170, 26, WHITE + (255,))
        ny = y + 90 - (1 - p) * 200
        paste(img, n, x + 20, ny)
        d = ImageDraw.Draw(img)
        d.ellipse((x + 40, ny + 52, x + 100, ny + 112), fill=(235, 60, 60))
        d.text((x + 70, ny + 82), "!", font=inter(46, "Black"), fill=WHITE, anchor="mm")
        d.text((x + 116, ny + 30), "BudgetLoyer · maintenant", font=inter(26, "Medium"), fill=(110, 110, 120))
        d.text((x + 116, ny + 66), "Alerte : budget Cadeaux", font=inter(32), fill=(20, 20, 26))
        d.text((x + 116, ny + 106), f"dépassé de 12{NB}€", font=inter(32), fill=(20, 20, 26))


def b6(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    s = back(t / 0.4)
    sz = max(40, int(300 * s))
    paste(img, logo(sz), 540 - sz / 2, 520 + 150 - sz / 2)
    d.text((540, 930), "BudgetLoyer.com", font=inter(84), fill=WHITE, anchor="mm")
    if t > 0.7:
        rich(d, 540, 1040, "Ton Noël,\n*sans le flou*", inter(100), WHITE, GREEN, None, 122)


def b7(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 420, "Lien en *bio*\npour essayer\n*BudgetLoyer.com*", inter(92), WHITE, GREEN, None, 118)
    d.text((540, 850), "7 jours d'essai gratuit", font=inter(58, "Bold"), fill=WHITE, anchor="mm")
    y = 1090 + math.sin(t * 5) * 18
    d.polygon([(540, y), (680, y + 140), (600, y + 140), (600, y + 300), (480, y + 300), (480, y + 140),
               (400, y + 140)], fill=GREEN)


B = [(b1, 3.8), (b2, 2.4), (b3, 4.6), (b4, 4.6), (b5, 4.8), (b6, 2.8), (b7, 3.0)]


def soft_music(total, path, sr=44100):
    out = np.zeros(int(total * sr) + sr)

    def add(sig, at, g):
        s = int(at * sr)
        e = min(len(out), s + len(sig))
        out[s:e] += sig[: e - s] * g

    def sn(f, l, dec=3):
        x = np.arange(int(l * sr)) / sr
        return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(4 * np.pi * f * x)) * np.exp(-x * dec)

    beat = 60 / 112
    chords = [(261.6, 329.6, 392), (220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)]
    kick_x = np.arange(int(0.2 * sr)) / sr
    kick = np.sin(2 * np.pi * (46 * kick_x + 34 * (1 - np.exp(-kick_x * 26)) / 26)) * np.exp(-kick_x * 15)
    for i in range(int(total / beat)):
        at = i * beat
        ch = chords[(i // 4) % 4]
        if i % 4 == 0:
            for f in ch:
                add(sn(f, beat * 4, 0.7), at, 0.1)
            add(sn(ch[0] / 2, beat * 2, 1.2), at, 0.26)
        add(kick, at, 0.42 if i % 2 == 0 else 0.25)
        add(sn(ch[i % 3] * 2, 0.26, 12), at + beat / 2, 0.11)
    cuts = np.cumsum([d for _, d in B])
    for c in cuts[:-1]:
        add(sn(1320, 0.08, 40), c, 0.25)
    add(sn(988, 0.1, 14), cuts[3] + 1.7, 0.4)
    add(sn(784, 0.14, 12), cuts[3] + 1.8, 0.4)
    write_wav(out[: int(total * sr)], path)


TIMES_A = {0: 3.4, 1: 3.3, 2: 3.5, 3: 4.5, 4: 3.0, 5: 2.0, 6: 4.2, 7: 4.4}
TIMES_B = {2: 4.4, 3: 4.4, 4: 4.6}

if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        render("budgetloyer_blackfriday_sketch", A, chip_music)
        render("budgetloyer_noel_tuto", B, soft_music)
