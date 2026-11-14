"""Épisodes du 15 novembre 2026 (dimanche).

Vidéo A : « Devine qui » à la raclette (format inédit : gag court de 15 s, 4 suspects, réponse à la fin).
Fiction : tranches et montants d'exemple. Contexte de la description seulement : premier week-end froid,
minimales de 0,4 °C prévues dimanche 15 nov. à Strasbourg et Dijon (prévisions Météo-France relevées le 9 nov.,
Selectra, 11 nov. 2026). Mécanisme inspiré des formats « gag sans dialogue avec retournement final » et de la
médiane de 13 s relevées par ppl.studio (tendances TikTok, novembre 2026), sans reprendre de vidéo précise.
Vidéo B : classement « Les 5 phrases qu'on dit juste avant de craquer » (format inédit : top 5 à rebours,
n°1 caché jusqu'à la fin), avec Monsieur Découvert. Humour, aucun chiffre réel.
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
tint, pill, scaled, talk, countdown, p1 = ep.tint, ep.pill, ep.scaled, ep.talk, ep.countdown, ep.p1
GREY = (150, 165, 175)

# ---- A : Raclette, devine qui -------------------------------------------------
POTES = [  # lettre, couleur, cheveux, haut, peau, alibi, tranches
    ("A", CYAN, (60, 40, 30), (60, 120, 220), (243, 197, 156), "« Moi, je mange pas trop. »", 4),
    ("B", MAG, (230, 180, 80), (40, 170, 120), (226, 170, 130), "« Je suis au régime. »", 3),
    ("C", YEL, (30, 24, 40), (230, 120, 40), (170, 112, 80), "« J'ai déjà dîné avant. »", 12),
    ("D", (150, 110, 240), (150, 60, 40), (120, 80, 200), (250, 214, 180), "« Je fais juste les patates. »", 5),
]
XS = [140, 370, 600, 830]


def salon(img, a=0.35):
    img.paste(bg_salon())
    tint(img, NAVY, a)


def lineup(img, t, y, k=0.44, exprs=None, active=None, dim=None, badges=True, bob=True):
    for i, (lab, col, hair, top, skin, _, _) in enumerate(POTES):
        ex = (exprs or {}).get(i, "happy")
        m = talk(t) if active == i else 0
        spr = scaled(coloc_bust(hair, top, ex, m, skin), k)
        yy = y + (math.sin(t * 5 + i) * 4 if bob else 0)
        paste(img, spr, XS[i] - spr.width / 2, yy)
        if dim and i in dim:
            d = ImageDraw.Draw(img, "RGBA")
            d.rectangle((XS[i] - spr.width / 2, yy, XS[i] + spr.width / 2, yy + spr.height), fill=(10, 14, 44, 150))
        if badges:
            guess_badge(img, XS[i], yy - 6, lab, col, 76, not (dim and i in dim))


def ahook(img, t):
    salon(img, 0.45)
    pill(img, "RACLETTE ENTRE POTES · DEVINE QUI", RED, 150, WHITE, 38)
    d = ImageDraw.Draw(img)
    rich(d, 540, 250, "4 potes, 1 raclette.\nUn seul a mangé\n*la moitié du fromage*.", inter(80, "Black"),
         WHITE, YEL, None, 98)
    rich(d, 540, 580, "Devine lequel : *A, B, C ou D* ?", inter(56, "Black"), WHITE, GREEN, None, 70)
    lineup(img, t, 760)
    paste(img, scaled(raclette_perso("happy", talk(t), 1.0), 0.9), 540 - 279, 1050)
    brand_tag(img, 40, 1430)
    punch_in(img, t)


def aalibis(img, t):
    salon(img, 0.55)
    pill(img, "LES ALIBIS", MAG, 150, WHITE, 44)
    n = min(4, int((t - 0.1) / 0.55) + 1) if t >= 0.1 else 0
    d = ImageDraw.Draw(img)
    for i in range(n):
        lab, col, *_ = POTES[i]
        p = back((t - 0.1 - i * 0.55) / 0.3)
        y = 290 + i * 150
        b, g = glow_box(860, 120, 18, NAVY, col, 12)
        paste(img, b, 110 - g + (1 - p) * 80, y - g)
        guess_badge(img, 110 + (1 - p) * 80, y + 60, lab, col, 92)
        d = ImageDraw.Draw(img)
        d.text((185 + (1 - p) * 80, y + 60), POTES[i][5], font=inter(48, "Bold"), fill=WHITE, anchor="lm")
    lineup(img, t, 960, 0.5, active=max(0, n - 1) if n else None)
    paste(img, scaled(raclette_perso("happy", 0, 0.8), 0.6), 540 - 186, 1250)


def awitness(img, t):
    salon(img, 0.55)
    pill(img, "23 H 30 · PLUS DE FROMAGE", RED, 150, WHITE, 42)
    lvl = max(0.0, 1 - t / 1.0)
    paste(img, scaled(raclette_perso("sad" if t > 1.0 else "happy", talk(t) if t > 0.9 else 0, lvl), 1.0),
          540 - 310, 280 + math.sin(t * 9) * 3)
    if t > 0.9:
        speech(img, "L'appareil a *tout vu*.", 700, WHITE, 60)
    d = ImageDraw.Draw(img)
    rich(d, 540, 850, "Dernière chance :\n*A, B, C ou D* ?", inter(70, "Black"), WHITE, YEL, None, 86)
    if t >= 1.3:
        countdown(img, t, 1.3, 2.8, 1110)
    lineup(img, t, 1240, 0.4)


def areveal(img, t):
    salon(img, 0.5)
    pill(img, "RÉPONSE", (30, 150, 100), 150, WHITE, 46)
    ex = {2: "worry"} if t > 1.4 else {}
    lineup(img, t, 520, 0.44, exprs=ex, dim=[0, 1, 3] if t > 0.9 else None, bob=False)
    d = ImageDraw.Draw(img)
    for i, p_ in enumerate(POTES):
        v = round(p_[6] * ease((t - 0.1) / 0.8))
        d.text((XS[i], 420), str(v), font=inter(76, "Black"), fill=YEL if i == 2 else WHITE, anchor="mm")
    d.text((540, 350), "Tranches mangées", font=inter(36, "Bold"), fill=(220, 225, 240), anchor="mm")
    if t > 0.9:
        s = back((t - 0.9) / 0.3)
        st = stamp("C · 12 SUR 24", YEL, 80)
        st = scaled(st, max(0.2, s))
        paste(img, st, 540 - st.width / 2, 840 - st.height / 2)
    if t > 1.4:
        rich(ImageDraw.Draw(img), 540, 1000, "Celui qui avait\n« *déjà dîné* ».", inter(72, "Black"), WHITE, YEL,
             None, 88)
    if t > 2.1:
        speech(img, "« On partage en 4 ? »", 1230, WHITE, 60)
    if t < 0.25:
        tint(img, GREEN, 0.2 * (1 - t / 0.25))


def abrand(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Ta part ? Note-la\n*avant de rentrer*.", inter(66), WHITE, GREEN, None, 84)
    x, y, w, h = phone(img, 400, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Nouvelle dépense", font=inter(42), fill=WHITE)
    rows = [("Date", "Dim. 15 nov."), ("Catégorie", "Sorties"), ("Montant", f"12,00{NB}€")]
    for i, (k_, v) in enumerate(rows):
        p = ease((t - 0.15 - i * 0.2) / 0.3)
        if p <= 0:
            continue
        yy = y + 190 + i * 90
        d.text((x + 50 - (1 - p) * 40, yy), k_, font=inter(38, "Medium"), fill=(170, 182, 190))
        d.text((x + w - 50, yy), v, font=inter(40, "Bold"), fill=GREEN if i == 2 else WHITE, anchor="ra")
    bars(img, t, x + 50, y + 520, w - 100, [("Sorties", 48, 60, YEL)], 0.9)
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + 820), "Montants d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")


def aend(img, t):
    salon(img, 0.5)
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 190, "Parts égales ou\n*au nombre de tranches* ?", inter(68, "Black"), WHITE, YEL, None, 86)
    d.text((540, 430), "Et toi, t'es A, B, C ou D ?", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    s = back(t / 0.35)
    sz = max(20, int(100 * s))
    paste(img, logo(sz), 230 - sz / 2, 560 - sz / 2)
    d.text((300, 560), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    lineup(img, t, 760)
    paste(img, scaled(raclette_perso("happy", talk(t), 0.0), 0.9), 540 - 279, 1050)


A = [(ahook, 2.6), (aalibis, 2.6), (awitness, 2.8), (areveal, 3.0), (abrand, 2.6), (aend, 2.0)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="house_light", key="C", bpm=120, seed=6495, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[4], end_at=cuts[5] + 0.1)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        m.pop(cuts[1] + 0.1 + i * 0.55, 0.16)
    m.pop(cuts[2] + 0.9, 0.16)
    for k in range(3):
        m.tick(cuts[2] + 1.3 + k * 0.5)
    m.reveal(cuts[3] + 0.9, good=True)
    m.pop(cuts[3] + 1.4, 0.16)
    m.pop(cuts[3] + 2.1, 0.18)
    for i in range(3):
        m.pop(cuts[4] + 0.15 + i * 0.2, 0.14)
    m.jingle(cuts[5] + 0.1)
    m.end(path)


# ---- B : Classement des 5 phrases avant de craquer ---------------------------
RANKS = [  # numéro, citation, emoji, verdict, danger
    (5, "« C'est en promo,\ndonc j'économise. »", "🏷️", "Une promo, ça reste\nune *dépense*.", 0.35),
    (4, "« Ça compte pas,\nc'est en liquide. »", "💶", "Le billet aussi\nsort du *budget*.", 0.5),
    (3, "« Je le mérite,\nsemaine horrible. »", "🛍️", "Tu le mérites.\nTon budget *aussi*.", 0.65),
    (2, "« C'est que 3 €. »", "☕", f"3{NB}€ × 20 jours\n= *60{NB}€*.", 0.82),
]
ONE = "« Je regarderai\nmon compte lundi. »"


def dark(img):
    img.paste(bg_tuto())


def slots(img, t, y, shown, start=0.0, size=46):
    """Liste des 5 places du classement ; shown = numéros dévoilés (dict num -> texte court)."""
    d = ImageDraw.Draw(img)
    for k, num in enumerate((5, 4, 3, 2, 1)):
        p = back((t - start - k * 0.08) / 0.3)
        if p <= 0:
            continue
        yy = y + k * 104
        col = RED if num == 1 else YEL
        b = box(820, 88, 20, (24, 28, 58, 255), col + (255,), 4)
        paste(img, b, 110 + (1 - p) * 60, yy)
        d = ImageDraw.Draw(img)
        d.text((150 + (1 - p) * 60, yy + 44), f"N°{num}", font=inter(46, "Black"), fill=col, anchor="lm")
        txt = shown.get(num)
        if txt:
            d.text((300 + (1 - p) * 60, yy + 44), txt, font=inter(size, "Bold"), fill=WHITE, anchor="lm")
        else:
            d.rounded_rectangle((300, yy + 28, 880 - k * 50, yy + 60), 14, fill=(60, 66, 100))


SHORT = {5: "« C'est en promo »", 4: "« C'est en liquide »", 3: "« Je le mérite »", 2: "« C'est que 3 € »",
         1: "« Je regarderai lundi »"}


def bhook(img, t):
    dark(img)
    pill(img, "CLASSEMENT · FIN DE MOIS", MAG, 150, WHITE, 40)
    d = ImageDraw.Draw(img)
    rich(d, 540, 250, "Les 5 phrases qu'on dit\njuste avant de *craquer*.", inter(74, "Black"), WHITE, YEL, None, 92)
    rich(d, 540, 460, "La *n°1* est la pire.", inter(64, "Black"), WHITE, RED, None, 80)
    slots(img, t + 1, 590, {})
    p1(img, t, "worry", 1100, 0.42, 0)
    brand_tag(img, 40, 1430)
    punch_in(img, t)


def rank_scene(i):
    num, quote, em, verdict, lvl = RANKS[i]

    def fn(img, t):
        dark(img)
        s = back(t / 0.3)
        d = ImageDraw.Draw(img)
        d.text((540, 250), f"N°{num}", font=inter(int(150 * max(0.4, s)), "Black"), fill=YEL, anchor="mm")
        speech(img, quote, 360, WHITE, 64)
        e = emoji(em, 190)
        paste(img, e, 540 - 95, 590 + math.sin(t * 6) * 6)
        if t > 1.2:
            rich(ImageDraw.Draw(img), 540, 820, verdict, inter(62, "Black"), WHITE, GREEN, None, 78)
        gauge(img, t, 140, 1010, 800, lvl, 0.4, "NIVEAU DE DANGER")
        p1(img, t, "happy" if lvl < 0.6 else "worry", 1150, 0.42, talk(t) if t < 1.2 else 0)
    return fn


def bone(img, t):
    dark(img)
    if t > 1.4:
        tint(img, RED, 0.18)
    s = back(t / 0.3)
    d = ImageDraw.Draw(img)
    d.text((540, 250), "N°1", font=inter(int(170 * max(0.4, s)), "Black"), fill=RED, anchor="mm")
    speech(img, ONE, 360, WHITE, 64, border=RED)
    paste(img, emoji("🙈", 170), 540 - 85, 600)
    gauge(img, t, 140, 1010, 800, 1.0, 0.3, "NIVEAU DE DANGER", RED)
    if t > 1.4:
        p = back((t - 1.4) / 0.35)
        bd = scaled(blob_decouvert(talk(t)), 0.9)
        paste(img, bd, 540 - bd.width / 2, 1160 + (1 - p) * 300)
        rich(ImageDraw.Draw(img), 540, 820, "Lundi, c'est *moi*\nqui regarde.", inter(66, "Black"), WHITE, RED,
             None, 80)
    else:
        p1(img, t, "worry", 1150, 0.42, talk(t))


def bbrand(img, t):
    dark(img)
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Dimanche soir ?\nRegarde *maintenant*.", inter(70), WHITE, GREEN, None, 88)
    dashboard(img, t, 420, 0.2)
    notif(img, t, 1.5, "Repère Sorties bientôt atteint", 1120)
    d = ImageDraw.Draw(img)
    d.text((540, 1340), "Montants d'exemple", font=inter(30, "Medium"), fill=GREY, anchor="mm")


def bend(img, t):
    dark(img)
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 170, "Laquelle tu dis le plus ?\nRéponds avec son *numéro*.", inter(66, "Black"), WHITE, YEL, None,
         84)
    s = back(t / 0.35)
    sz = max(20, int(100 * s))
    paste(img, logo(sz), 230 - sz / 2, 420 - sz / 2)
    d.text((300, 420), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    slots(img, t + 1, 540, SHORT, size=44)
    p1(img, t, "happy", 1100, 0.42, talk(t))


B = [(bhook, 2.6)] + [(rank_scene(i), 2.6) for i in range(4)] + [(bone, 3.2), (bbrand, 3.0), (bend, 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="lofi", key="A", bpm=86, seed=6370, music=music, cuts=cuts)
    m.compose(layers_at=cuts[3], break_at=cuts[6], end_at=cuts[7] + 0.1)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        m.pop(cuts[1 + i] + 0.05, 0.18)
        m.pop(cuts[1 + i] + 1.2, 0.15)
    m.pop(cuts[5] + 0.05, 0.2)
    m.reveal(cuts[5] + 1.4, good=False)
    m.pop(cuts[6] + 1.5, 0.2)
    m.jingle(cuts[7] + 0.1)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.5, 2: 1.6, 3: 2.9, 4: 2.5, 5: 1.9}
TIMES_B = {0: 0.0, 1: 2.5, 2: 2.5, 3: 2.5, 4: 2.5, 5: 3.0, 6: 2.9, 7: 2.1}

if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_raclette_devine_qui", A, music_a)
        if which in ("b", "all"):
            render("budgetloyer_classement_phrases_craquer", B, music_b)
