"""Épisodes du 11 novembre 2026.

Vidéo A : quiz « Devine le prix » des calendriers de l'Avent, 4 niveaux à 3 choix (format inédit).
Sources : enquête touteslesbox.fr sur 129 calendriers de l'Avent 2026 (relevé du 6 au 27 oct. 2026).
Vidéo B : « La guerre du thermostat », POV d'un objet, série Partie 1/2 (format inédit).
Source : CreditNews, 1er nov. 2026 (prix repère du gaz +6,6 %, environ +12 € par mois selon la CRE).
"""
import math
import os
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from bl import *  # noqa: E402,F403


def tint(img, col, a):
    if a > 0:
        img.paste(Image.blend(img, Image.new("RGB", (W, H), col), min(1, a)))


def pill(img, txt, col, y=150, fg=WHITE, size=38):
    f = inter(size, "Black")
    w = int(f.getlength(txt)) + 50
    paste(img, box(w, int(size * 1.6), 14, col + (255,)), 540 - w / 2, y)
    ImageDraw.Draw(img).text((540, y + size * 0.8), txt, font=f, fill=fg, anchor="mm")


def scaled(spr, k):
    return spr.resize((int(spr.width * k), int(spr.height * k)), Image.LANCZOS)


# ---- A : Devine le prix, calendriers de l'Avent ----------------------------
SNOW = [(random.Random(i).randint(0, W), random.Random(i * 5).random(), random.Random(i * 9).randint(3, 6))
        for i in range(60)]


@lru_cache(maxsize=None)
def bg_xmas_base():
    im = Image.fromarray(grad((40, 8, 30), (110, 20, 52), 0, 1700))
    d = ImageDraw.Draw(im, "RGBA")
    for i in range(0, W, 90):
        d.ellipse((i + 20, 70, i + 44, 94), fill=(YEL if (i // 90) % 2 else GREEN) + (200,))
    d.line((0, 60, W, 60), fill=(20, 60, 40, 255), width=6)
    for y in range(1560, H, 40):
        d.line((0, y, W, y), fill=(232, 40, 120, 70), width=3)
    return im


def bg_xmas(img, t):
    img.paste(bg_xmas_base())
    d = ImageDraw.Draw(img)
    for x, ph, r in SNOW:
        y = ((ph + t * 0.06) % 1.0) * H
        xx = x + math.sin(t * 1.5 + ph * 7) * 20
        d.ellipse((xx, y, xx + r, y + r), fill=(170, 120, 160))


QUIZ = [
    ("Le calendrier\nle *moins cher* du relevé ?", ["0,99 €", "4,99 €", "9,99 €"], 0,
     "Oui : *0,99 €*\npour 50 g de chocolat."),
    ("Le prix *médian*\ndes 129 calendriers ?", ["19 €", "59 €", "99 €"], 1,
     "*59 €* :\nla moitié coûte plus."),
    ("Beauté : le prix médian\nd'*une seule case* ?", ["0,99 €", "1,99 €", "3,94 €"], 2,
     "*3,94 € la case.*\nEn chocolat : 1,62 €."),
    ("Chocolat : le plus cher\n*au kilo* ?", ["125 €/kg", "412 €/kg", "925 €/kg"], 2,
     "*925 €/kg*, le record.\nGrande conso : 30 à 82 €/kg."),
]
QT = 4.3
REVEAL = 2.8
CD0 = 1.4


def quiz_scene(i):
    q, opts, ans, expl = QUIZ[i]

    def scene(img, t):
        bg_xmas(img, t)
        pill(img, f"QUESTION {i + 1}/4", MAG if i < 3 else RED)
        b, g = glow_box(940, 250, 28, NAVY, YEL)
        paste(img, b, 70 - g, 250 - g)
        d = ImageDraw.Draw(img)
        rich(d, 540, 250 + (250 - 2 * 96) / 2, q, inter(74), WHITE, YEL, None, 96)
        rev = t >= REVEAL
        for k, o in enumerate(opts):
            p = back((t - 0.15 - k * 0.12) / 0.3)
            if p <= 0:
                continue
            y = 560 + k * 140
            x = 110 - (1 - p) * 700
            good = rev and k == ans
            col = GREEN if good else ((70, 64, 96) if rev else (40, 30, 90))
            border = WHITE if good else (CYAN if not rev else (90, 84, 110))
            bb, gg = glow_box(780, 112, 24, col, border, 22 if good else 10)
            paste(img, bb, x - gg, y - gg)
            d = ImageDraw.Draw(img)
            d.text((x + 60, y + 56), "ABC"[k], font=inter(64, "Black"), fill=YEL if not good else NAVY, anchor="mm")
            d.text((x + 300, y + 56), o.replace(" ", NB), font=inter(70, "Black"),
                   fill=NAVY if good else (WHITE if not rev else (150, 146, 170)), anchor="mm")
        d = ImageDraw.Draw(img)
        if not rev and t >= CD0:
            n = 3 - int((t - CD0) / ((REVEAL - CD0) / 3))
            n = max(1, min(3, n))
            k = back(((t - CD0) * 3 / (REVEAL - CD0)) % 1)
            d.text((540, 1050), str(n), font=inter(int(150 * (0.7 + 0.3 * k)), "Black"), fill=YEL, anchor="mm")
        elif not rev:
            d.text((540, 1050), "A, B ou C ?", font=inter(66, "Black"), fill=WHITE, anchor="mm")
        else:
            rich(d, 540, 985, expl, inter(54, "Bold"), WHITE, YEL, None, 70)
            s = back((t - REVEAL) / 0.22)
            st = stamp("BINGO" if i < 3 else "RECORD", NAVY if i < 3 else (210, 44, 44), 46)
            kk = 1.4 - 0.4 * s
            sw, sh = int(st.width * kk), int(st.height * kk)
            paste(img, st.resize((sw, sh), Image.LANCZOS), 735 - sw / 2, 560 + ans * 140 + 56 - sh / 2)
        bob = math.sin(t * 6) * 8
        paste(img, scaled(advent_cal(int(t * 8) % 2 if rev else 0, i + 1), 0.52), 410, 1170 + bob)
        if rev:
            tint(img, GREEN if i < 3 else RED, 0.25 * max(0, 1 - (t - REVEAL) / 0.25))

    return scene


def ahook(img, t):
    bg_xmas(img, t)
    title_neon(img, t, "DEVINE LE PRIX", 250, YEL, 100)
    d = ImageDraw.Draw(img)
    rich(d, 540, 390, "Calendriers de l'Avent :\n4 questions,", inter(80), WHITE, YEL, None, 100)
    rich(d, 540, 600, "*la dernière\nest folle.*", inter(124, "Black"), WHITE, YEL, None, 146)
    d.text((540, 940), "Relevé de 129 calendriers (touteslesbox.fr, oct. 2026)",
           font=inter(32, "Medium"), fill=(235, 210, 225), anchor="mm")
    paste(img, scaled(advent_cal(int(t * 6) % 2, 0), 0.82), 352, 1010 + math.sin(t * 5) * 8)
    punch_in(img, t)


def abrand(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 170, "Calendrier ou pas,\n*décembre se prépare*\nmaintenant.", inter(72), WHITE, GREEN, None, 90)
    x, y, w, h = phone(img, 480, 880)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Budgets · Décembre", font=inter(42), fill=WHITE)
    bars(img, t, x + 50, y + 200, w - 100,
         [("Cadeaux", 180, 250, GREEN), ("Calendrier", 25, 30, YEL), ("Sorties", 60, 100, GREEN)], 0.3)
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + 690), "Montants d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")
    if t > 1.4:
        s = back((t - 1.4) / 0.35)
        sz = max(20, int(110 * s))
        paste(img, logo(sz), 250 - sz / 2, 1410 - sz / 2)
        d.text((330, 1410), "BudgetLoyer.com", font=inter(64), fill=YEL, anchor="lm")


def aend(img, t):
    bg_xmas(img, t)
    confetti(img, t)
    title_neon(img, t, "DEVINE LE PRIX", 250, YEL, 100)
    d = ImageDraw.Draw(img)
    rich(d, 540, 390, f"Tu avais deviné\n*925{NB}€ le kilo* ?", inter(96), WHITE, YEL, None, 120)
    rich(d, 540, 680, "Ton score\nsur 4 ?", inter(130, "Black"), YEL, YEL, None, 150)
    d.text((540, 1020), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, logo(110), 200, 1130)
    d.text((330, 1185), "BudgetLoyer.com", font=inter(64), fill=YEL, anchor="lm")
    d.text((540, 1330), "Source : touteslesbox.fr, 129 calendriers 2026", font=inter(32, "Medium"),
           fill=(235, 210, 225), anchor="mm")


A = [(ahook, 2.8)] + [(quiz_scene(i), QT) for i in range(4)] + [(abrand, 3.0), (aend, 2.2)]


def chords_music(m, total, bpm, prog, g=1.0):
    beat = 60 / bpm
    for i in range(int(total / beat) + 1):
        at = i * beat
        ch = prog[(i // 4) % len(prog)]
        if i % 4 == 0:
            for f in ch:
                m.add_music(m.sn(f, beat * 4, 0.8), at, 0.07 * g)
            m.add_music(m.tri(ch[0] / 2, beat * 2, 1.5), at, 0.2 * g)
        m.add_music(m.kick(), at, (0.32 if i % 2 == 0 else 0.18) * g)
        m.add_music(m.tri(ch[i % 3] * 2, 0.22, 12), at + beat / 2, 0.08 * g)


def music_a(total, path, music=True):
    m = SoftMix(total, music=music)
    chords_music(m, total, 116, [(261.6, 329.6, 392), (220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)])
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        q0 = cuts[1 + i]
        for k in range(3):
            m.pop(q0 + 0.15 + k * 0.12, 0.16)
        for k in range(3):
            m.add(m.sn(880, 0.08, 20), q0 + CD0 + k * (REVEAL - CD0) / 3, 0.16)
        for j, f in enumerate((523.3, 659.3, 784.0)):
            m.add(m.sn(f, 0.25, 8), q0 + REVEAL + j * 0.08, 0.3)
    m.jingle(cuts[5] + 1.4)
    m.pop(cuts[6] + 0.05)
    m.end(path)


# ---- B : La guerre du thermostat, Partie 1/2 --------------------------------
@lru_cache(maxsize=None)
def bg_room(night=False, window_open=False):
    top, bot = ((40, 30, 80), (70, 50, 110)) if night else ((120, 90, 190), (190, 140, 210))
    im = Image.fromarray(grad(top, bot, 0, 1560))
    d = ImageDraw.Draw(im, "RGBA")
    for x in range(0, W, 120):
        d.line((x, 0, x, 1560), fill=(255, 255, 255, 18), width=40)
    d.rectangle((0, 1560, W, H), fill=(120, 80, 60, 255))
    for y in range(1580, H, 50):
        d.line((0, y, W, y), fill=(90, 60, 44, 255), width=4)
    # fenêtre
    x0, y0, x1, y1 = 80, 1110, 420, 1400
    sky = (20, 24, 70) if night else (150, 200, 245)
    d.rectangle((x0, y0, x1, y1), fill=(250, 250, 255, 255))
    d.rectangle((x0 + 14, y0 + 14, x1 - 14, y1 - 14), fill=sky + (255,))
    if window_open:
        d.polygon([(x0 + 14, y0 + 14), (x0 - 60, y0 - 20), (x0 - 60, y1 + 20), (x0 + 14, y1 - 14)],
                  fill=(230, 236, 250, 255))
        d.polygon([(x1 - 14, y0 + 14), (x1 + 60, y0 - 20), (x1 + 60, y1 + 20), (x1 - 14, y1 - 14)],
                  fill=(230, 236, 250, 255))
    else:
        d.line(((x0 + x1) / 2, y0, (x0 + x1) / 2, y1), fill=(250, 250, 255, 255), width=12)
    # radiateur
    d.rounded_rectangle((560, 1400, 900, 1550), 12, fill=(235, 235, 240, 255))
    for x in range(580, 900, 40):
        d.line((x, 1410, x, 1540), fill=(200, 200, 210, 255), width=8)
    return im


def wind(img, t):
    d = ImageDraw.Draw(img)
    for k in range(6):
        y = 1150 + k * 45
        x = 430 + ((t * 600 + k * 130) % 500)
        d.line((x, y, x + 90, y - 10), fill=(235, 245, 255), width=6)
    for k in range(10):
        x = 100 + ((k * 97 + t * 160) % 320)
        y = 1130 + ((k * 53 + t * 220) % 260)
        d.ellipse((x, y, x + 9, y + 9), fill=WHITE)


def heat(img, t, n=3):
    d = ImageDraw.Draw(img)
    for k in range(n):
        x = 620 + k * 110
        pts = [(x + math.sin((t * 3 + j * 0.5)) * 12, 1380 - j * 18) for j in range(10)]
        d.line(pts, fill=(255, 140, 90), width=7)


LEA = dict(hair=(90, 50, 30), top=(240, 120, 60), acc="bonnet")
HUGO = dict(hair=(25, 22, 30), top=(40, 160, 110), skin=(200, 150, 110))
INES = dict(hair=(230, 120, 40), top=(54, 160, 220))

BEATS = [
    ("07:30", LEA, "J'ai froid. Je mets *22°*.", "Bon. Raisonnable.", 19, 22, "happy", False, False),
    ("08:15", HUGO, "22° ?! On n'est pas riches.\nRetour à *19°*.", "Déjà 2 doigts sur moi.", 22, 19, "angry", False, False),
    ("13:00", INES, "J'aère *fenêtre ouverte*…\net chauffage à *25°*.", "Je chauffe… la rue.", 19, 25, "happy", True, False),
    ("18:00", dict(LEA, acc="plaid"), "*25°*. Et je garde le plaid.", "Alors pourquoi 25° ?", 25, 25, "happy", False, False),
    ("23:30", None, "Tout le monde dort.\nChambre vide : *24°*.", "Je suis le seul à bosser.", 25, 24, None, False, True),
]
BT = 2.3


def thought(img, txt, y=450):
    f = inter(58, "Black")
    w = max(520, int(f.getlength(txt)) + 80)
    b, g = glow_box(w, 140, 22, (40, 10, 50), MAG, 14)
    paste(img, b, 540 - w / 2 - g, y - g)
    d = ImageDraw.Draw(img)
    d.text((540, y + 36), "MOI, LE THERMOSTAT :", font=inter(30, "Black"), fill=(255, 150, 220), anchor="mm")
    d.text((540, y + 92), txt, font=f, fill=YEL, anchor="mm")


def beat_scene(i):
    hhmm, who, line, th, t0, t1, expr, wopen, night = BEATS[i]

    def scene(img, t):
        img.paste(bg_room(night, wopen))
        if wopen:
            wind(img, t)
        if t1 >= 24:
            heat(img, t)
        pill(img, hhmm, NAVY if not night else MAG, 150, YEL, 46)
        speech(img, line, 262, WHITE, 50)
        if t > 0.75:
            thought(img, th, 480 if "\n" in line else 440)
        p = ease((t - 0.35) / 0.5)
        temp = round(t0 + (t1 - t0) * p)
        tex = "sleep" if night and t > 1.2 else ("panic" if temp >= 24 and not night else "calm")
        wob = math.sin(t * 40) * 6 if tex == "panic" else 0
        paste(img, scaled(thermostat(temp, tex, int(t * 7) % 2 if t > 0.75 else 0), 0.95), 80 + wob, 640)
        if who:
            s = back(t / 0.3)
            paste(img, coloc_bust(**dict(who, expr=expr if t > 0.3 else "happy",
                                         mouth=int(t * 7) % 2 if t < 0.9 else 0)),
                  520, 680 + (1 - s) * 500)
        else:
            d = ImageDraw.Draw(img)
            for k in range(3):
                d.text((640 + k * 70, 900 - k * 60 - (t * 20) % 30), "z", font=inter(70 + k * 14, "Black"),
                       fill=(200, 200, 240))
        brand_tag(img)
        if i == 2:
            tint(img, (200, 230, 255), 0.25 * max(0, 1 - t / 0.25))

    return scene


def bhook(img, t):
    img.paste(bg_room(False, True))
    wind(img, t)
    heat(img, t)
    pill(img, "LA GUERRE DU THERMOSTAT · PARTIE 1/2", RED, 150, WHITE, 36)
    d = ImageDraw.Draw(img)
    rich(d, 540, 270, f"Ton coloc met *25°*\nfenêtre ouverte.", inter(92), WHITE, YEL, None, 112)
    rich(d, 540, 520, "Qui paie\nla *facture* ?", inter(124, "Black"), WHITE, YEL, None, 140)
    d.text((540, 840), "POV : t'es le thermostat de la coloc", font=inter(44, "Bold"), fill=(255, 235, 250), anchor="mm")
    wob = math.sin(t * 40) * 6
    paste(img, scaled(thermostat(25, "panic", int(t * 7) % 2), 0.72), 380 + wob, 900)
    punch_in(img, t)


def bfact(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    pill(img, "PENDANT CE TEMPS", MAG, 150)
    rich(d, 540, 290, "Au 1er novembre,\nle prix repère du gaz\na pris *+6,6 %*.", inter(84), WHITE, GREEN, None, 104)
    if t > 0.9:
        rich(d, 540, 680, f"Environ *+12{NB}€ par mois*\nsur les contrats\nindexés sur ce prix.", inter(64, "Bold"),
             WHITE, YEL, None, 82)
    paste(img, scaled(thermostat(24, "panic", 0), 0.7), 393 + math.sin(t * 30) * 4, 990)
    d.text((540, 1380), "Sources : CreditNews (1er nov.), 24matins (22 oct. 2026)", font=inter(32, "Medium"),
           fill=(150, 165, 175), anchor="mm")
    brand_tag(img)


def bill(img, t, y):
    b, g = glow_box(620, 300, 24, WHITE, RED, 20)
    p = back(t / 0.35)
    yy = y - (1 - p) * 700
    paste(img, b, 230 - g, yy - g)
    d = ImageDraw.Draw(img)
    d.polygon([(230, yy), (850, yy), (540, yy + 150)], fill=(230, 230, 236))
    d.line([(230, yy), (540, yy + 150), (850, yy)], fill=(200, 200, 210), width=5)
    d.text((540, yy + 220), "FACTURE CHAUFFAGE", font=inter(54, "Black"), fill=RED, anchor="mm")


def bcliff(img, t):
    img.paste(bg_room(True, False))
    pill(img, "FIN DU MOIS", RED, 150, WHITE, 46)
    bill(img, t, 260)
    for k, (who, x) in enumerate(((LEA, 40), (HUGO, 330), (INES, 620))):
        s = back((t - 0.5 - k * 0.15) / 0.3)
        if s <= 0:
            continue
        paste(img, scaled(coloc_bust(**dict(who, expr="angry", mouth=int(t * 8 + k) % 2)), 0.88),
              x, 900 + (1 - s) * 500)
        if t > 0.9 + k * 0.25:
            d = ImageDraw.Draw(img)
            d.text((x + 185, 860 - k * 40), "Pas moi !", font=inter(46, "Black"), fill=YEL, anchor="mm")
    if t > 2.0:
        thought(img, "Alors… qui paie ?", 610)
    tint(img, RED, 0.22 * max(0, 1 - t / 0.25))


def bend(img, t):
    img.paste(bg_end())
    d = ImageDraw.Draw(img)
    title_neon(img, t, "SUITE DEMAIN", 230, YEL, 110)
    rich(d, 540, 360, "Qui doit payer ?\nEt toi : *19°* ou *25°* ?", inter(84), WHITE, YEL, None, 106)
    d.text((540, 610), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, scaled(thermostat(25, "panic", int(t * 7) % 2), 0.72), 380, 700)
    paste(img, logo(110), 200, 1130)
    d.text((330, 1185), "BudgetLoyer.com", font=inter(64), fill=YEL, anchor="lm")


B = [(bhook, 2.8)] + [(beat_scene(i), BT) for i in range(len(BEATS))] + [(bfact, 3.0), (bcliff, 3.2), (bend, 2.2)]


def music_b(total, path, music=True):
    m = SoftMix(total, music=music)
    chords_music(m, total, 104, [(196, 246.9, 293.7), (220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)])
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(len(BEATS)):
        c = cuts[1 + i]
        m.pop(c + 0.05, 0.16)
        m.pop(c + 0.75, 0.14)
        m.add(m.sn(1046.5, 0.06, 30), c + 0.4, 0.08)
    m.pop(cuts[6] + 0.9, 0.16)
    cl = cuts[7]
    m.add(m.sn(110, 0.6, 3), cl, 0.3)
    for k in range(3):
        m.pop(cl + 0.9 + k * 0.25, 0.16)
    m.jingle(cuts[8] + 0.2)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.0, 2: 3.6, 3: 3.6, 4: 3.8, 5: 2.8, 6: 2.0}
TIMES_B = {0: 0.0, 1: 2.0, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.0, 6: 2.8, 7: 3.0, 8: 2.0}


def ig_version(name, scenes, music_fn):
    """Export _ig : même image, audio sans notre musique (son du catalogue Instagram)."""
    total = sum(d for _, d in scenes)
    music_fn(total, f"parts_{name}/m_ig.wav", music=False)
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{name}.mp4", "-i", f"parts_{name}/m_ig.wav",
                           "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest",
                           "-movflags", "+faststart", f"{name}_ig.mp4"])


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        render("budgetloyer_calendrier_avent_prix", A, music_a)
        ig_version("budgetloyer_calendrier_avent_prix", A, music_a)
        render("budgetloyer_thermostat_coloc_p1", B, music_b)
