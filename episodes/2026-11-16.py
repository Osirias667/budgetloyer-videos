"""Épisodes du 16 novembre 2026.

Vidéo A : « Survie · Premier appart », histoire dont tu es le héros, Épisode 1/2. Reprend la mécanique de
« Survie fin de mois » (13-14 nov.), meilleure durée vue Instagram du compte (10,2 s, 63,6 %) et meilleur
TikTok (817 vues, 15 j'aime) au 15 nov. Fiction : montants d'exemple, aucun chiffre réel.
Vidéo B : « 3 phrases exactes pour refuser une sortie sans passer pour radin », conversation de groupe
(format inédit « script mot pour mot », mécanisme relevé sur tryvolume.app/working le 15 nov. 2026).
Fiction : prénoms et montants d'exemple.
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

_spec = importlib.util.spec_from_file_location("ep1113", os.path.join(ROOT, "episodes", "2026-11-13.py"))
ep1113 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ep1113)
tint, pill, scaled = ep1113.tint, ep1113.pill, ep1113.scaled
choice_buttons, countdown, talk, fit = ep1113.choice_buttons, ep1113.countdown, ep1113.talk, ep1113.fit

GREY = (150, 165, 175)


# ---- A : Survie · Premier appart, Épisode 1/2 -------------------------------
def appart(img, night=False, a=0.38):
    img.paste(bg_appart(night))
    tint(img, NAVY, a)


def p1(img, t, expr, y=1010, k=0.6, mouth=None):
    m = talk(t) if mouth is None else mouth
    paste(img, scaled(p1_bust(expr, m), k), 540 - 760 * k / 2, y + math.sin(t * 4) * 5)


def ahook(img, t):
    appart(img)
    pill(img, "SURVIE · PREMIER APPART · ÉPISODE 1/2", RED, 150, WHITE, 36)
    hud_budget(img, 830, 30, 250)
    d = ImageDraw.Draw(img)
    rich(d, 540, 490, "Premier appart.\nIl te reste *830 €*\naprès le loyer.", inter(96, "Black"), WHITE, YEL, None, 116)
    d.text((540, 880), "Tu tiens le mois ? C'est toi qui choisis.", font=inter(44, "Bold"), fill=WHITE, anchor="mm")
    p1(img, t, "worry", 960, 0.6, 0)
    punch_in(img, t)


def achoice1(img, t):
    appart(img)
    pill(img, "JOUR 1 · CHOIX 1", MAG, 150, WHITE, 40)
    f = ease((t - 2.5) / 0.25) * max(0, 1 - (t - 3.6) / 0.6) if t >= 2.5 else 0
    hud_budget(img, 830 if t < 2.5 else 750, 30, 250, f, -80, 520)
    speech(img, "L'appart est vide.\nIl te faut un *canapé*.", 480, WHITE, 54)
    choice_buttons(img, t, f"Neuf\n-450{NB}€", f"D'occasion\n-80{NB}€", "B", 2.4, 700)
    if 1.2 <= t < 2.4:
        countdown(img, t, 1.2, 2.4, 1000)
    elif t >= 2.4:
        rich(ImageDraw.Draw(img), 540, 935, "Tu prends *l'occasion*.\nMalin.", inter(60, "Bold"), WHITE, YEL, None, 76)
    p1(img, t, "happy" if t >= 2.4 else "worry", 1130, 0.46, talk(t) if t >= 2.4 else 0)


def aevent(img, t):
    appart(img)
    pill(img, "JOUR 3 · IMPRÉVU", RED, 150, WHITE, 40)
    f = ease((t - 0.6) / 0.25) * max(0, 1 - (t - 2.0) / 0.6) if t >= 0.6 else 0
    hud_budget(img, 750 if t < 0.6 else 630, 28, 250, f, -120, 520)
    speech(img, "Premières courses.\nLe frigo et les placards\nsont *totalement vides*.", 480, WHITE, 52)
    if t > 0.9:
        rich(ImageDraw.Draw(img), 540, 790, "Sel, huile, éponge, PQ…\ntout est à *racheter*.", inter(58, "Black"), WHITE,
             YEL, None, 74)
    p1(img, t, "shout" if t > 0.6 else "worry", 1000, 0.56, 0)


def achoice2(img, t):
    appart(img, True, 0.35)
    pill(img, "JOUR 6 · CHOIX 2", MAG, 150, WHITE, 40)
    f = ease((t - 2.5) / 0.25) * max(0, 1 - (t - 3.6) / 0.6) if t >= 2.5 else 0
    hud_budget(img, 630 if t < 2.5 else 540, 25, 250, f, -90, 520)
    speech(img, "Tes potes réclament\nla *crémaillère*.", 480, WHITE, 54)
    choice_buttons(img, t, f"Grosse fête\n-90{NB}€", f"Apéro simple\n-25{NB}€", "A", 2.4, 700)
    if 1.2 <= t < 2.4:
        countdown(img, t, 1.2, 2.4, 1000)
    elif t >= 2.4:
        rich(ImageDraw.Draw(img), 540, 935, "Tu dis *grosse fête*.\nÉvidemment.", inter(60, "Bold"), WHITE, YEL, None, 76)
    p1(img, t, "happy", 1130, 0.46, talk(t) if t >= 2.4 else 0)


def acliff(img, t):
    appart(img)
    pill(img, "JOUR 7 · CHOIX 3 · À TOI", RED, 150, WHITE, 40)
    hud_budget(img, 540, 24, 250)
    speech(img, "Les murs sont *tout blancs*.\nTu décores ?", 480, WHITE, 54)
    choice_buttons(img, t, f"Déco à fond\n-150{NB}€", f"Déco récup\n-15{NB}€", None, None, 690)
    d = ImageDraw.Draw(img)
    if 1.0 <= t < 2.2:
        countdown(img, t, 1.0, 2.2, 1000)
    elif t >= 2.2:
        k = back((t - 2.2) / 0.3)
        sz = int(76 * max(0.3, k))
        d.text((540, 975), "À TOI DE CHOISIR", font=inter(sz, "Black"), fill=YEL, anchor="mm")
        if t > 2.7:
            rich(d, 540, 1050, "*A ou B* en commentaire.\nÉpisode 2 demain : *les deux fins*.", inter(50, "Bold"),
                 WHITE, YEL, None, 64)
    p1(img, t, "worry", 1190, 0.4, 0)
    if t >= 2.2:
        tint(img, (255, 255, 255), 0.35 * max(0, 1 - (t - 2.2) / 0.2))


def aend(img, t):
    img.paste(bg_end())
    d = ImageDraw.Draw(img)
    hud_budget(img, 540, 24, 250)
    rich(d, 540, 520, "Il te reste *540 €*\net *24 jours*.\nTu choisis *A ou B* ?", inter(92, "Black"),
         WHITE, YEL, None, 112)
    s = back(t / 0.35)
    sz = max(20, int(110 * s))
    paste(img, logo(sz), 250 - sz / 2, 1000 - sz / 2)
    d.text((325, 1000), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 1130), "Montants d'exemple · histoire inventée", font=inter(32, "Medium"), fill=GREY, anchor="mm")


A = [(ahook, 2.8), (achoice1, 4.2), (aevent, 2.8), (achoice2, 4.2), (acliff, 4.6), (aend, 2.2)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="swing", key="G", bpm=140, seed=1794, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[4] + 2.2, end_at=cuts[5] + 0.15)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for c0 in (cuts[1], cuts[3]):
        m.pop(c0 + 0.1, 0.16)
        m.pop(c0 + 0.2, 0.15)
        m.pop(c0 + 0.32, 0.15)
        for k in range(3):
            m.tick(c0 + 1.2 + k * 0.4)
    m.reveal(cuts[1] + 2.4, good=True)
    m.reveal(cuts[3] + 2.4, good=False)
    m.pop(cuts[2] + 0.6, 0.2)
    m.pop(cuts[2] + 0.9, 0.16)
    c0 = cuts[4]
    m.pop(c0 + 0.1, 0.16)
    m.pop(c0 + 0.2, 0.15)
    m.pop(c0 + 0.32, 0.15)
    for k in range(3):
        m.tick(c0 + 1.0 + k * 0.4)
    m.pop(c0 + 2.2, 0.22)
    m.pop(c0 + 2.7, 0.16)
    m.jingle(cuts[5] + 0.15)
    m.end(path)


# ---- B : 3 phrases exactes pour refuser une sortie --------------------------
CHAT_BG = (16, 20, 34)


def chat_bg(img, title="Les potes"):
    """Fond de messagerie sombre ; le nom du groupe est posé sous l'étiquette (zone sûre dès y=150)."""
    img.paste(Image.new("RGB", (W, H), CHAT_BG))


def group_tag(img, y):
    d = ImageDraw.Draw(img)
    d.ellipse((330, y, 380, y + 50), fill=(200, 70, 160))
    d.text((355, y + 25), "LP", font=inter(22, "Black"), fill=WHITE, anchor="mm")
    d.text((396, y + 25), "Groupe « Les potes »", font=inter(32, "Bold"), fill=GREY, anchor="lm")


def bhook(img, t):
    chat_bg(img)
    pill(img, "À COPIER-COLLER", GREEN, 170, NAVY, 40)
    d = ImageDraw.Draw(img)
    rich(d, 540, 290, "3 phrases exactes\npour *refuser une sortie*\nsans passer pour *radin*.",
         inter(78, "Black"), WHITE, YEL, None, 96)
    group_tag(img, 590)
    chat_bubble(img, 70, 660, "Resto vendredi soir ?\nEnviron 40 € chacun.", False, "Léa")
    chat_bubble(img, 70, 880, "Tout le monde vient ?", False, "Karim")
    d.text((540, 1150), "La n°3, garde-la pour décembre.", font=inter(50, "Black"), fill=YEL, anchor="mm")
    brand_tag(img, 300, 1300)
    punch_in(img, t)


PHRASES = [
    ("PHRASE 1/3 · LE RESTO À 40 €", "Léa", "Resto vendredi soir ?\nEnviron 40 € chacun.",
     "Ce mois-ci je suis\nen mode budget. Je vous\nrejoins pour le dessert !", "Top, on te garde\nune cuillère !",
     "Tu dis non *au prix*,\npas à tes potes."),
    ("PHRASE 2/3 · L'AFTERWORK", "Karim", "Afterwork ce soir ?\nOn y va tous !",
     "Pas ce soir. Mais café\njeudi midi ? C'est moi\nqui l'offre.", "Deal, jeudi !",
     "Un non + *une autre idée*\n= zéro malaise."),
    ("PHRASE 3/3 · LE CADEAU COMMUN", "Inès", "Cadeau commun pour Max :\n40 € chacun ?",
     "Moi je peux mettre 15 €,\nc'est ce que j'ai prévu\npour les cadeaux ce mois-ci.", "Ok, on ajuste !",
     "Un *montant clair*,\npas d'excuse floue."),
]
PT = 4.6


def phrase_scene(i):
    tag, who, msg, reply, back_msg, tip = PHRASES[i]

    def scene(img, t):
        chat_bg(img)
        pill(img, tag, MAG if i < 2 else RED, 170, WHITE, 36)
        group_tag(img, 255)
        chat_bubble(img, 70, 320, msg, False, who, ease(t / 0.25))
        d = ImageDraw.Draw(img)
        if t > 0.45:
            d.text((930, 560), "Tu réponds :", font=inter(34, "Bold"), fill=GREY, anchor="ra")
        n = typing(t, 0.6, 36)
        if t > 0.6:
            bh = chat_bubble(img, 930, 610, reply, True, None, 1.0, n)
            if n >= len(reply.replace("*", "").replace("\n", "")):
                s = back((t - (0.6 + len(reply) / 36)) / 0.3)
                st = stamp("À COPIER", YEL, 52, -8)
                k = max(0.3, s)
                st = scaled(st, k)
                paste(img, st, 700 - st.width / 2, 610 + bh + 80 - st.height / 2)
        if t > 3.1:
            chat_bubble(img, 70, 1000, back_msg, False, who, ease((t - 3.1) / 0.25))
        if t > 3.4:
            rich(d, 540, 1250, tip, inter(54, "Black"), WHITE, GREEN, None, 68)
    return scene


def bapp(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 190, "Et pour savoir\n*à quoi* tu peux dire oui :", inter(70, "Black"), WHITE, GREEN, None, 88)
    x, y, w, h = phone(img, 480, 900)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 110), "Repères · Novembre", font=inter(42), fill=WHITE)
    bars(img, t, x + 50, y + 230, w - 100,
         [("Sorties", 45, 60, GREEN), ("Cadeaux", 15, 50, GREEN), ("Courses", 180, 220, YEL)], 0.4)
    if t > 1.6:
        rich(d, 540, 1420, "Pose un repère *Sorties*\ndans BudgetLoyer.", inter(56, "Black"), WHITE, GREEN, None, 70)


def bend(img, t):
    img.paste(bg_end())
    d = ImageDraw.Draw(img)
    rich(d, 540, 330, "Envoie ça au pote\nqui dit *oui à tout*.", inter(88, "Black"), WHITE, YEL, None, 108)
    rich(d, 540, 620, "Et toi, tu refuses\n*comment* ?", inter(76, "Black"), WHITE, GREEN, None,
         94)
    s = back(t / 0.35)
    sz = max(20, int(110 * s))
    paste(img, logo(sz), 250 - sz / 2, 1000 - sz / 2)
    d.text((325, 1000), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 1130), "Prénoms et montants d'exemple", font=inter(32, "Medium"), fill=GREY, anchor="mm")


B = [(bhook, 2.8)] + [(phrase_scene(i), PT) for i in range(3)] + [(bapp, 3.0), (bend, 2.0)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="bossa", key="Bb", bpm=128, seed=4514, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[4] + 1.6, end_at=cuts[5] + 0.15)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(3):
        c0 = cuts[1 + i]
        m.pop(c0 + 0.1, 0.18)
        m.tick(c0 + 0.6)
        reply = PHRASES[i][3]
        m.reveal(c0 + 0.6 + len(reply) / 36 + 0.05, good=True)
        m.pop(c0 + 3.1, 0.16)
        m.pop(c0 + 3.4, 0.16)
    m.pop(cuts[4] + 0.4, 0.16)
    m.pop(cuts[4] + 1.6, 0.18)
    m.jingle(cuts[5] + 0.15)
    m.end(path)


TIMES_A = {0: 0.0, 1: 3.6, 2: 1.4, 3: 2.8, 4: 3.6, 5: 1.8}
TIMES_B = {0: 0.0, 1: 4.4, 2: 4.4, 3: 4.4, 4: 2.8, 5: 1.8}


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_survie_premier_appart_e1", A, music_a)
        if which in ("b", "all"):
            render("budgetloyer_phrases_refuser_sortie", B, music_b)
