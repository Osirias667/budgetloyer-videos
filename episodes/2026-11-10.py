"""Épisodes du 10 novembre 2026.

Vidéo A : défi horloge « 0 € dépensé mercredi férié, à quelle heure tu craques ? » (sketch, format inédit).
Vidéo B : jeu télé « Vrai ou Faux » sur les règles du découvert au 20 novembre (format inédit, actu sourcée).
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from bl import *  # noqa: E402,F403


def tint(img, col, a):
    """Voile coloré court au lieu d'un flash blanc plein écran."""
    if a > 0:
        img.paste(Image.blend(img, Image.new("RGB", (W, H), col), min(1, a)))


# ---- A : défi horloge -----------------------------------------------------
def clock(img, t, hhmm, prev, col=WHITE):
    """Horloge géante qui défile de l'heure précédente vers la nouvelle."""
    h0, m0 = prev
    h1, m1 = hhmm
    if h1 < h0:
        h1 += 24
    p = ease(t / 0.5)
    tot = round((h0 * 60 + m0) + ((h1 * 60 + m1) - (h0 * 60 + m0)) * p)
    h, m = (tot // 60) % 24, tot % 60
    b, g = glow_box(620, 180, 26, NAVY, MAG)
    paste(img, b, 230 - g, 160 - g)
    d = ImageDraw.Draw(img)
    d.text((540, 250), f"{h:02d}:{m:02d}", font=mono(150), fill=col, anchor="mm")


def counter(img, val, col=GREEN):
    """Pastille du montant dépensé dans la journée."""
    txt = f"DÉPENSÉ AUJOURD'HUI : {val}"
    f = inter(46, "Black")
    w = int(f.getlength(txt)) + 60
    b, g = glow_box(w, 76, 38, NAVY, col, 16)
    paste(img, b, 540 - w / 2 - g, 362 - g)
    d = ImageDraw.Draw(img)
    d.text((540, 400), txt, font=f, fill=col, anchor="mm")


def tempt_card(img, t, ch, title, line):
    """Carte de la tentation qui tombe au milieu de l'écran."""
    p = back(t / 0.32)
    y = 470 + (1 - p) * -340
    b = box(900, 490, 40, WHITE + (255,))
    paste(img, b, 90, y)
    e = emoji(ch, 190)
    paste(img, e, 445, y + 28)
    d = ImageDraw.Draw(img)
    d.text((540, y + 280), title, font=inter(66, "Black"), fill=(20, 18, 40), anchor="mm")
    d.text((540, y + 372), line, font=inter(50, "Bold"), fill=(150, 40, 90), anchor="mm")


def p1(img, t, expr="happy"):
    bob = math.sin(t * 7) * 6
    paste(img, p1_bust(expr, int(t * 7) % 2 if expr == "happy" else 0), 160, 1090 + bob)


TEMPT = [
    ((8, 12), (7, 0), 8, "🥐", "L'odeur de la boulangerie", "Ça sent le croissant chaud…", "Je passe vite. Très vite."),
    ((10, 47), (8, 12), 11, "📱", "-40 % sur ton panier", "Il reste 2 heures, soi-disant.", "Pas aujourd'hui, l'appli."),
    ((12, 58), (10, 47), 13, "🍔", "Livraison offerte", "Ton plat préféré te regarde.", "Il me reste des pâtes."),
    ((16, 5), (12, 58), 16, "🍻", "« Viens en terrasse ! »", "« Juste un verre, promis. »", "Je bois de l'eau. Dehors."),
    ((22, 41), (16, 5), 22, "🛒", "Ton panier t'attend", "« Plus que 1 article en stock »", "Je regarde… pour le principe."),
]


def make_tempt(i):
    hhmm, prev, hour, ch, title, line, reply = TEMPT[i]

    def scene(img, t):
        img.paste(bg_sky(hour))
        clock(img, t, hhmm, prev)
        counter(img, f"0,00{NB}€")
        tempt_card(img, t, ch, title, line)
        p1(img, t, "worry" if t < 1.2 else "happy")
        if t > 0.9:
            speech(img, reply, 985, WHITE, 50)
        if t >= 1.5:
            s = back((t - 1.5) / 0.22)
            st = stamp("RÉSISTÉ", (30, 170, 110), 84)
            k = 1.5 - 0.5 * s
            sw, sh = int(st.width * k), int(st.height * k)
            paste(img, st.resize((sw, sh), Image.LANCZOS), 790 - sw / 2, 575 - sh / 2)

    return scene


def ahook(img, t):
    img.paste(bg_grid())
    title_neon(img, t, "MERCREDI FÉRIÉ", 260, MAG, 96)
    d = ImageDraw.Draw(img)
    rich(d, 540, 400, f"Défi : *0{NB}€* dépensé\nde toute la journée.", inter(86), WHITE, GREEN, None, 112)
    rich(d, 540, 680, "À quelle heure\ntu craques ?", inter(132), YEL, YEL, None, 162)
    paste(img, p1_bust("happy", 0), 160, 1100 + math.sin(t * 5) * 8)


def aclimax(img, t):
    img.paste(bg_sky(0))
    clock(img, t, (23, 59), (22, 41), GREEN)
    counter(img, f"0,00{NB}€")
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 540, "DÉFI RÉUSSI !", inter(132, "Black"), WHITE, YEL, None, 150)
    d.text((540, 790), f"0{NB}€. Zéro. Rien.", font=inter(72, "Bold"), fill=GREEN, anchor="mm")
    # Message minuscule qui grossit : tient jusqu'au basculement de minuit.
    k = ease(t / 1.9)
    size = int(24 + 44 * k)
    d.text((540, 950), "Attends… une notif arrive.", font=inter(size, "Bold"),
           fill=(235, 235, 245), anchor="mm")
    p1(img, t, "happy")


def amidnight(img, t):
    img.paste(bg_sky(0))
    dx = int(math.sin(t * 60) * 14 * max(0, 1 - t / 0.45))
    clock(img, 1.0, (0, 0), (0, 0), RED)
    counter(img, f"13,49{NB}€", RED)
    p = back(t / 0.35)
    if t > 0.02:
        n = box(880, 190, 30, WHITE + (255,))
        x, y = 100 + dx, 470 - (1 - p) * 300
        paste(img, n, x, y)
        d = ImageDraw.Draw(img)
        d.ellipse((x + 30, y + 50, x + 116, y + 136), fill=(235, 60, 60))
        d.text((x + 73, y + 92), "!", font=inter(64, "Black"), fill=WHITE, anchor="mm")
        d.text((x + 142, y + 32), "Prélèvement · 00:00", font=inter(32, "Medium"), fill=(110, 110, 120))
        d.text((x + 142, y + 88), f"Abonnement : -13,49{NB}€", font=inter(48, "Black"), fill=(20, 20, 26))
    if t > 0.7:
        d = ImageDraw.Draw(img)
        rich(d, 540, 760, "Ton abonnement\nn'a pas fait le défi.", inter(84), WHITE, YEL, None, 106)
    p1(img, t, "shout" if t < 2.2 else "worry")
    tint(img, RED, 0.28 * max(0, 1 - t / 0.25))


def abl(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 180, "Tes dépenses du mois,\n*d'un coup d'œil*.", inter(78), WHITE, GREEN, None, 96)
    dashboard(img, t, 450, 0.2)
    rich(d, 540, 1160, "Repères, alertes,\n« Il te reste ce mois ».", inter(62, "Bold"), WHITE, GREEN, None, 80)
    paste(img, logo(90), 340, 1350)
    d.text((445, 1395), "BudgetLoyer.com", font=inter(58), fill=YEL, anchor="lm")


def aend(img, t):
    img.paste(bg_grid())
    title_neon(img, t, "MERCREDI FÉRIÉ", 260, MAG, 96)
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 420, f"Alors, défi *0{NB}€*\nmercredi ?", inter(92), WHITE, GREEN, None, 118)
    rich(d, 540, 700, "Toi, tu craques\nà quelle heure ?", inter(118), YEL, YEL, None, 148)
    paste(img, logo(150), 200, 1120)
    d.text((370, 1195), "BudgetLoyer.com", font=inter(66), fill=YEL, anchor="lm")
    d.text((540, 1370), "Dis-le en commentaire", font=inter(52, "Bold"), fill=WHITE, anchor="mm")


A = [(ahook, 2.8)] + [(make_tempt(i), 2.4) for i in range(len(TEMPT))] + [
    (aclimax, 2.0), (amidnight, 3.4), (abl, 3.6), (aend, 2.0)]


class Mix:
    def __init__(s, total, sr=44100):
        s.sr = sr
        s.out = np.zeros(int(total * sr) + sr)
        s.total = total

    def add(s, sig, at, g):
        a = int(at * s.sr)
        e = min(len(s.out), a + len(sig))
        if a < e:
            s.out[a:e] += sig[: e - a] * g

    def x(s, l):
        return np.arange(int(l * s.sr)) / s.sr

    def sq(s, f, l, dec=6):
        x = s.x(l)
        return np.sign(np.sin(2 * np.pi * f * x)) * np.exp(-x * dec)

    def sn(s, f, l, dec=4):
        x = s.x(l)
        return np.sin(2 * np.pi * f * x) * np.exp(-x * dec)

    def kick(s):
        x = s.x(0.17)
        return np.sin(2 * np.pi * (52 * x + 42 * (1 - np.exp(-x * 34)) / 34)) * np.exp(-x * 20)

    def noise(s, l, dec=20):
        x = s.x(l)
        return np.random.default_rng(3).normal(0, 1, len(x)) * np.exp(-x * dec)

    def end(s, path):
        write_wav(s.out[: int(s.total * s.sr)], path)


def music_a(total, path):
    m = Mix(total)
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    step = 60 / 132 / 2
    prog = [(261.6, 329.6, 392), (293.7, 349.2, 440), (220, 277.2, 329.6), (246.9, 311.1, 370)]
    midnight, stop = cuts[7], cuts[8]
    for i in range(int(total / step)):
        at = i * step
        if midnight - 0.05 <= at < stop:
            continue
        ch = prog[(i // 8) % 4]
        m.add(m.sq(ch[i % 3] * 2, step * 0.9), at, 0.1)
        if i % 4 == 0:
            m.add(m.sq(ch[0] / 2, step * 2, 3), at, 0.17)
            m.add(m.kick(), at, 0.55)
        if i % 4 == 2:
            m.add(m.noise(0.08, 40), at, 0.12)
    for c in cuts[1:6]:
        m.add(m.sq(1046, 0.05, 30), c, 0.3)
        m.add(m.sq(1568, 0.05, 30), c + 0.06, 0.3)
        m.add(m.sn(660, 0.16, 9), c + 1.5, 0.45)
    for k, f in enumerate((523, 659, 784, 1047)):
        m.add(m.sq(f, 0.14, 7), cuts[6] + k * 0.1, 0.28)
    m.add(m.sn(70, 1.0, 2.2), midnight, 0.85)
    m.add(m.sq(220, 0.45, 2), midnight, 0.3)
    m.add(m.sq(164, 0.6, 2), midnight + 0.3, 0.3)
    m.end(path)


# ---- B : Vrai ou Faux découvert --------------------------------------------
QUESTIONS = [
    (f"Le *20 novembre*,\nle découvert sera\n*interdit* en France.", False,
     "Le découvert reste\npossible, mais plus *encadré*."),
    ("Ton découvert\ndéjà *accordé* sera\n*annulé* ce jour-là.", False,
     "Une autorisation déjà accordée\n*n'est pas annulée* à cette date."),
    ("Même pour un\n*petit* découvert,\nla banque vérifiera.", True,
     f"Sur les nouveaux découverts,\nanalyse même *sous 200{NB}€*."),
    ("Le paiement\nen *3 fois sans frais*\nest concerné.", True,
     "Financé par un tiers,\nil devient un *crédit conso*."),
]
QUIZ_T = 3.4


def stage(img, t):
    img.paste(Image.new("RGB", (W, H), (14, 10, 56)))
    d = ImageDraw.Draw(img, "RGBA")
    for i, (cx, col) in enumerate(((150, MAG), (540, CYAN), (930, YEL))):
        a = math.sin(t * 1.3 + i * 2) * 240
        x = cx + a
        d.polygon([(cx, -40), (x - 240, 1920), (x + 240, 1920)], fill=col + (34,))
    for y in range(1460, 1920, 36):
        d.line((0, y, W, y), fill=(232, 40, 190, 70), width=3)


def quiz_head(img, n):
    tag = f"QUESTION {n}/4"
    f = inter(36, "Bold")
    w = int(f.getlength(tag)) + 44
    paste(img, box(w, 54, 12, MAG + (255,)), 540 - w / 2, 150)
    d = ImageDraw.Draw(img)
    d.text((540, 177), tag, font=f, fill=WHITE, anchor="mm")


def make_q(i):
    stmt, ans, expl = QUESTIONS[i]

    def scene(img, t):
        stage(img, t)
        revealed = t >= QUIZ_T
        if not revealed:
            title_neon(img, t, "VRAI OU FAUX", 270, YEL, 104)
        if not revealed:
            quiz_head(img, i + 1)
        b, g = glow_box(940, 380, 30, NAVY, CYAN)
        paste(img, b, 70 - g, 350 - g)
        d = ImageDraw.Draw(img)
        lh = 106
        rich(d, 540, 350 + (380 - 3 * lh) / 2 + 6, stmt, inter(82), WHITE, YEL, None, lh)
        if not revealed:
            if t >= 2.2:
                n = 3 - int((t - 2.2) / ((QUIZ_T - 2.2) / 3))
                n = max(1, min(3, n))
                k = back(((t - 2.2) * 3 / (QUIZ_T - 2.2)) % 1)
                sz = int(200 * (0.7 + 0.3 * k))
                d.text((540, 870), str(n), font=inter(sz, "Black"), fill=YEL, anchor="mm")
            else:
                d.text((540, 870), "À toi de buzzer !", font=inter(72, "Black"), fill=WHITE, anchor="mm")
        else:
            box2, g2 = glow_box(860, 250, 26, NAVY, GREEN if ans else RED, 18)
            paste(img, box2, 70 - g2, 760 - g2)
            d = ImageDraw.Draw(img)
            rich(d, 500, 790, expl, inter(52, "Bold"), WHITE, YEL, None, 78)
            s = back((t - QUIZ_T) / 0.22)
            st = stamp("VRAI" if ans else "FAUX", (30, 170, 110) if ans else (210, 44, 44), 130)
            kk = 1.5 - 0.5 * s
            sw, sh = int(st.width * kk), int(st.height * kk)
            paste(img, st.resize((sw, sh), Image.LANCZOS), 540 - sw / 2, 262 - sh / 2)
        pulse = int(math.sin(t * 8) * 6) if not revealed else 0
        buzzer(img, 60, 1050, 410, 170, "VRAI", GREEN, revealed and ans, revealed and not ans, pulse)
        buzzer(img, 500, 1050, 410, 170, "FAUX", RED, revealed and not ans, revealed and ans, -pulse)
        bob = math.sin(t * 6) * 8
        paste(img, blob_decouvert(int(t * 8) % 2 if revealed else 0), 325, 1222 + bob)
        if revealed:
            tint(img, GREEN if ans else RED, 0.3 * max(0, 1 - (t - QUIZ_T) / 0.25))

    return scene


def bpay(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 170, "Le découvert, c'est\n*mieux quand tu le vois venir*.", inter(64), WHITE, GREEN, None, 88)
    notif(img, t, 0.7, "Attention, découvert en vue", 400)
    dashboard(img, t, 600, 0.2)
    if t > 1.2:
        d = ImageDraw.Draw(img)
        d.text((540, 1340), "BudgetLoyer t'alerte avant.", font=inter(62, "Bold"), fill=WHITE, anchor="mm")


def bend(img, t):
    stage(img, t)
    title_neon(img, t, "VRAI OU FAUX", 270, YEL, 104)
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 400, "Tu as eu combien\nsur *4* ?", inter(112), WHITE, YEL, None, 138)
    rich(d, 540, 740, "Envoie ça à ton pote\nqui vit à *-50*" + NB + "*€*", inter(76, "Bold"), WHITE, YEL, None, 100)
    paste(img, logo(140), 215, 1000)
    d.text((375, 1070), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 1220), "Sources : ordonnance n° 2025-880, Service-Public,", font=inter(30, "Medium"),
           fill=(200, 200, 215), anchor="mm")
    d.text((540, 1262), "Selectra (règles au 20 novembre 2026)", font=inter(30, "Medium"),
           fill=(200, 200, 215), anchor="mm")
    paste(img, blob_decouvert(int(t * 6) % 2), 380, 1290 + math.sin(t * 6) * 6)


B = [(make_q(i), 5.6) for i in range(4)] + [(bpay, 3.4), (bend, 2.0)]


def music_b(total, path):
    m = Mix(total)
    step = 60 / 120 / 2
    prog = [(196, 246.9, 293.7), (220, 277.2, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)]
    for i in range(int(total / step)):
        at = i * step
        ch = prog[(i // 8) % 4]
        m.add(m.sq(ch[i % 3] * 2, step * 0.85), at, 0.08)
        if i % 4 == 0:
            m.add(m.sq(ch[0] / 2, step * 2, 3), at, 0.14)
            m.add(m.kick(), at, 0.5)
        if i % 4 == 2:
            m.add(m.noise(0.06, 50), at, 0.1)
    for i, (_, ans, _e) in enumerate(QUESTIONS):
        q0 = i * 5.6
        for k in range(3):
            m.add(m.sq(880, 0.08, 12), q0 + 2.2 + k * (QUIZ_T - 2.2) / 3, 0.35)
        if ans:
            for j, f in enumerate((523, 784, 1047)):
                m.add(m.sq(f, 0.16, 7), q0 + QUIZ_T + j * 0.09, 0.4)
        else:
            m.add(m.sq(120, 0.55, 2.5), q0 + QUIZ_T, 0.55)
            m.add(m.sq(90, 0.55, 2.5), q0 + QUIZ_T + 0.1, 0.45)
    pay = 4 * 5.6
    for k, f in enumerate((659, 784, 1047)):
        m.add(m.sn(f, 0.25, 6), pay + 0.7 + k * 0.1, 0.5)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.2, 2: 2.2, 3: 2.2, 4: 2.2, 5: 2.2, 6: 1.9, 7: 2.0, 8: 2.0, 9: 1.8}
TIMES_B = {0: 0.0, 1: 4.5, 2: 3.0, 3: 5.0, 4: 2.5, 5: 1.5}

if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        render("budgetloyer_defi_zero_euro", A, music_a)
        render("budgetloyer_vrai_faux_decouvert", B, music_b)
