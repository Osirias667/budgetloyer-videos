"""Épisodes du 13 novembre 2026.

Vidéo A : quiz « Heures creuses : possible ou interdit ? », 4 horaires, avec une machine à laver qui parle.
Sources (lues le 12 nov. 2026) : socialmag.news (10 nov. 2026), d'après Enedis (communiqué et guide du
10 nov. 2026) ; europe-business-news.com (10 nov. 2026), calendrier confirmé par Enedis le 9 nov. 2026.
Faits : à partir du 1er déc. 2026, Enedis change les heures creuses de 9,3 millions de clients, petit à petit
jusqu'à fin oct. 2027 ; 8 h creuses par jour dont au moins 5 d'affilée la nuit ; en hiver, jamais d'heure
creuse de 7 h à 11 h ni de 17 h à 21 h (créneaux possibles 11 h-17 h et 21 h-7 h) ; c'est le fournisseur qui
fixe les plages et prévient environ un mois avant ; Linky suit à distance, mais une machine réglée sur sa
propre horloge doit être reprogrammée.
Vidéo B : « Survie fin de mois », histoire dont tu es le héros, Partie 1/2 (format inédit). Fiction :
montants d'exemple, aucun chiffre réel.
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

_spec = importlib.util.spec_from_file_location("ep1111", os.path.join(ROOT, "episodes", "2026-11-11.py"))
ep1111 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ep1111)
tint, pill, scaled = ep1111.tint, ep1111.pill, ep1111.scaled

GREY = (150, 165, 175)


def talk(t, rate=7):
    return int(t * rate) % 2


def fit(txt, w, start, weight="Bold", lo=30):
    """Plus grande taille (pas de 2) pour que chaque ligne tienne dans w pixels."""
    for k in range(start, lo, -2):
        f = inter(k, weight)
        if max(f.getlength(l.replace("*", "")) for l in txt.split("\n")) <= w:
            return k
    return lo


def countdown(img, t, c0, c1, y):
    d = ImageDraw.Draw(img)
    n = max(1, min(3, 3 - int((t - c0) / ((c1 - c0) / 3))))
    k = back(((t - c0) * 3 / (c1 - c0)) % 1)
    d.text((540, y), str(n), font=inter(int(130 * (0.7 + 0.3 * k)), "Black"), fill=YEL, anchor="mm")


# ---- A : Heures creuses, possible ou interdit ? ------------------------------
SRC_A = "Règles Enedis (10 nov. 2026) · ton fournisseur choisit tes 8 h"
QA = [
    (14, "POSSIBLE", "*11 h – 17 h* : créneau\nautorisé en hiver."),
    (19, "INTERDIT", "*17 h – 21 h* : jamais\nd'heure creuse en hiver."),
    (8, "INTERDIT", "*7 h – 11 h* : interdit\naussi en hiver."),
    (3, "POSSIBLE", "La nuit : au moins\n*5 h creuses d'affilée*."),
]
RT = 3.4
CD0, REV = 0.9, 2.1


def round_scene(i):
    h, ans, expl = QA[i]

    def scene(img, t):
        img.paste(bg_laverie())
        pill(img, f"HORAIRE {i + 1}/4", RED if i == 3 else MAG, 150, WHITE, 40)
        d = ImageDraw.Draw(img)
        rich(d, 540, 245, "En hiver, une heure creuse\npeut tomber à…", inter(54, "Bold"), WHITE, YEL, None, 68)
        s = back(t / 0.3)
        clk = horloge(h, 0, GREEN if (t >= REV and ans == "POSSIBLE") else (RED if t >= REV else CYAN), 300)
        paste(img, clk, 120, 400 + (1 - s) * 40)
        d = ImageDraw.Draw(img)
        d.text((700, 550), f"{h}{NB}h", font=inter(170, "Black"), fill=WHITE, anchor="mm")
        rev = t >= REV
        for k, lab in enumerate(("POSSIBLE", "INTERDIT")):
            p = back((t - 0.15 - k * 0.12) / 0.3)
            if p <= 0:
                continue
            good = rev and lab == ans
            x = 90 + k * 460
            base = (40, 160, 110) if k == 0 else (200, 60, 90)
            col = (GREEN if good else (70, 72, 92)) if rev else base
            bb, gg = glow_box(420, 140, 30, col, WHITE if good else col, 24 if good else 10)
            paste(img, bb, x - gg, 760 + (1 - p) * 300 - gg)
            d = ImageDraw.Draw(img)
            sym = "✓" if k == 0 else "×"
            d.text((x + 210, 830 + (1 - p) * 300), f"{sym} {lab}", font=inter(60, "Black"),
                   fill=NAVY if good else (WHITE if not rev else (150, 150, 170)), anchor="mm")
        if not rev and t >= CD0:
            countdown(img, t, CD0, REV, 1030)
        elif not rev:
            ImageDraw.Draw(img).text((540, 1030), "Possible ou interdit ?", font=inter(62, "Black"),
                                     fill=WHITE, anchor="mm")
        else:
            rich(ImageDraw.Draw(img), 540, 965, expl, inter(56, "Bold"), WHITE, YEL, None, 72)
        ImageDraw.Draw(img).text((540, 1185), SRC_A, font=inter(30, "Medium"), fill=(190, 200, 225), anchor="mm")
        happy = rev and ans == "POSSIBLE"
        ex = "happy" if happy else ("panic" if rev else "calm")
        paste(img, scaled(machine_perso(ex, talk(t) if rev else 0, int(t * 8) % 24 * 15), 0.5),
              660, 1235 + math.sin(t * 9) * (6 if rev and not happy else 2))
        brand_tag(img, 40, 1420)
        if rev:
            tint(img, GREEN if ans == "POSSIBLE" else RED, 0.2 * max(0, 1 - (t - REV) / 0.25))

    return scene


def ahook(img, t, variant=False):
    img.paste(bg_laverie())
    pill(img, "QUIZ · HEURES CREUSES", RED, 150, WHITE, 40)
    d = ImageDraw.Draw(img)
    if variant:
        rich(d, 540, 270, "Ta machine à laver\ntourne *à 19 h* ?", inter(96, "Black"), WHITE, YEL, None, 120)
        rich(d, 540, 540, "Nouvelles heures creuses :\n*4 horaires* à deviner.", inter(62, "Bold"), WHITE, YEL, None, 80)
    else:
        rich(d, 540, 255, "Heures creuses :\n*9,3 millions* de foyers\nchangent d'horaires.", inter(84, "Black"),
             WHITE, YEL, None, 104)
        rich(d, 540, 590, "Possible ou interdit ?\n*4 horaires* à deviner.", inter(62, "Bold"), WHITE, YEL, None, 80)
    d.text((540, 790), "Dès le 1er décembre, petit à petit jusqu'à fin 2027 (Enedis)", font=inter(32, "Medium"),
           fill=(200, 210, 235), anchor="mm")
    paste(img, scaled(machine_perso("panic", talk(t), int(t * 10) % 24 * 15), 0.9), 380, 880 + math.sin(t * 12) * 5)
    paste(img, horloge(19, 0, RED, 240), 90, 1010)
    punch_in(img, t)


def ahook_v(img, t):
    ahook(img, t, True)


def atwist(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    pill(img, "LE PIÈGE", MAG, 150, WHITE, 42)
    rich(d, 540, 260, "Ton compteur *Linky* passe\naux nouveaux horaires\nà distance.", inter(64, "Bold"),
         WHITE, GREEN, None, 82)
    if t > 0.9:
        rich(d, 540, 560, "Ta *machine à laver*, non :\nreprogramme-la.", inter(70, "Black"), WHITE, YEL, None, 88)
    if t > 1.8:
        rich(d, 540, 790, "Ton fournisseur te prévient\nenviron *un mois avant*.", inter(52, "Bold"),
             WHITE, GREEN, None, 66)
    ex = "panic" if t < 1.8 else "happy"
    paste(img, scaled(machine_perso(ex, talk(t) if 0.9 < t < 1.8 else 0, int(t * 8) % 24 * 15), 0.62), 403, 980)
    d = ImageDraw.Draw(img)
    d.text((540, 1340), "Source : Enedis, via socialmag.news (10 nov. 2026)", font=inter(30, "Medium"),
           fill=GREY, anchor="mm")


def abrand(img, t):
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 160, "Et pour ne pas finir le mois\n*dans le flou* : un repère\n*Électricité*.", inter(62),
         WHITE, GREEN, None, 80)
    x, y, w, h = phone(img, 480, 860)
    d = ImageDraw.Draw(img)
    d.text((x + 50, y + 100), "Budgets · Novembre", font=inter(42), fill=WHITE)
    bars(img, t, x + 50, y + 210, w - 100,
         [("Électricité", 48, 60, GREEN), ("Courses", 214, 250, YEL), ("Loisirs", 62, 80, GREEN)], 0.3)
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + 760), "Montants d'exemple", font=inter(28, "Medium"), fill=(140, 150, 160), anchor="mm")
    if t > 1.2:
        s = back((t - 1.2) / 0.35)
        sz = max(20, int(100 * s))
        paste(img, logo(sz), 250 - sz / 2, 1440 - sz / 2)
        d.text((320, 1440), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")


def aend(img, t):
    img.paste(bg_laverie())
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 200, "Et toi, ta machine,\ntu la lances\n*à quelle heure* ?", inter(96, "Black"), WHITE, YEL, None, 116)
    d.text((540, 600), "Dis-le en commentaire", font=inter(56, "Bold"), fill=WHITE, anchor="mm")
    paste(img, logo(100), 210, 670)
    d.text((330, 720), "BudgetLoyer.com", font=inter(60), fill=YEL, anchor="lm")
    paste(img, scaled(machine_perso("happy", talk(t), int(t * 8) % 24 * 15), 0.7), 386, 860)
    paste(img, horloge(19, 0, CYAN, 200), 120, 1200)


A = [(ahook, 2.8)] + [(round_scene(i), RT) for i in range(4)] + [(atwist, 3.0), (abrand, 2.6), (aend, 2.0)]
AV = [(ahook_v, 2.8)] + A[1:]


def music_a(total, path, music=True, scenes=None):
    cuts = list(np.cumsum([0] + [d for _, d in (scenes or A)]))
    m = Track(total, style="jeu_tele", key="Bb", bpm=114, seed=8945, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[6], end_at=cuts[7] + 0.1)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(4):
        q0 = cuts[1 + i]
        for k in range(2):
            m.pop(q0 + 0.15 + k * 0.12, 0.16)
        for k in range(3):
            m.tick(q0 + CD0 + k * (REV - CD0) / 3)
        m.reveal(q0 + REV, good=QA[i][1] == "POSSIBLE")
    m.pop(cuts[5] + 0.9, 0.18)
    m.pop(cuts[5] + 1.8, 0.16)
    m.pop(cuts[6] + 0.3, 0.14)
    m.jingle(cuts[7] + 0.1)
    m.end(path)


def music_av(total, path, music=True):
    music_a(total, path, music, AV)


# ---- B : Survie fin de mois, Partie 1/2 --------------------------------------
def sky(img, hour):
    """Ciel sans soleil, assombri pour que le texte jaune et blanc reste lisible."""
    img.paste(bg_sky(hour, False))
    tint(img, NAVY, 0.42)


def p1(img, t, expr, y=1010, k=0.6, mouth=None):
    m = talk(t) if mouth is None else mouth
    paste(img, scaled(p1_bust(expr, m), k), 540 - 760 * k / 2, y + math.sin(t * 4) * 5)


def choice_buttons(img, t, a, b, pick, rev, y=700, final=False):
    for k, (lab, txt) in enumerate((("A", a), ("B", b))):
        p = back((t - 0.2 - k * 0.12) / 0.3)
        if p <= 0:
            continue
        on = rev is not None and t >= rev
        good = on and pick == lab
        x = 80 + k * 470
        base = (60, 90, 230) if k == 0 else (200, 70, 160)
        col = (GREEN if good else (70, 72, 92)) if on else base
        bb, gg = glow_box(450, 190, 30, col, WHITE if good else col, 24 if good else 10)
        paste(img, bb, x - gg, y + (1 - p) * 300 - gg)
        d = ImageDraw.Draw(img)
        fg = NAVY if good else (WHITE if not on else (150, 150, 170))
        d.text((x + 50, y + 95 + (1 - p) * 300), lab, font=inter(96, "Black"), fill=fg, anchor="mm")
        l1, l2 = txt.split("\n")
        fs = fit(l1, 330, 46, "Black")
        d.text((x + 108, y + 70 + (1 - p) * 300), l1, font=inter(fs, "Black"), fill=fg, anchor="lm")
        d.text((x + 108, y + 128 + (1 - p) * 300), l2, font=inter(44, "Bold"),
               fill=fg if on else YEL, anchor="lm")


def bhook(img, t):
    sky(img, 8)
    pill(img, "SURVIE · FIN DE MOIS · PARTIE 1/2", RED, 150, WHITE, 38)
    hud_budget(img, 84, 17, 250)
    d = ImageDraw.Draw(img)
    rich(d, 540, 500, "Il te reste *84 €*\net *17 jours*\navant la paie.", inter(100, "Black"), WHITE, YEL, None, 120)
    d.text((540, 905), "C'est toi le héros. Chaque choix compte.", font=inter(46, "Bold"), fill=WHITE, anchor="mm")
    p1(img, t, "worry", 980, 0.6, 0)
    punch_in(img, t)


def bchoice1(img, t):
    sky(img, 13)
    pill(img, "12:30 · CHOIX 1", MAG, 150, WHITE, 40)
    hud_budget(img, 84, 17, 250)
    speech(img, "Tes collègues commandent\ndes *sushis* à emporter.", 480, WHITE, 54)
    choice_buttons(img, t, f"Je commande\n-13{NB}€", f"Ma gamelle\n0{NB}€", "B", 2.4)
    if 1.2 <= t < 2.4:
        countdown(img, t, 1.2, 2.4, 1000)
    elif t >= 2.4:
        rich(ImageDraw.Draw(img), 540, 935, "Tu prends *la gamelle*.\nRespect.", inter(60, "Bold"), WHITE, YEL, None, 76)
    p1(img, t, "happy" if t >= 2.4 else "worry", 1130, 0.46, talk(t) if t >= 2.4 else 0)


def bevent(img, t):
    sky(img, 19)
    pill(img, "18:40 · IMPRÉVU", RED, 150, WHITE, 40)
    f = ease((t - 0.6) / 0.25) * max(0, 1 - (t - 2.0) / 0.6) if t >= 0.6 else 0
    hud_budget(img, 84 if t < 0.6 else 74.01, 17, 250, f, -9.99)
    speech(img, "Ton abonnement vidéo\nse *renouvelle* aujourd'hui.", 480, WHITE, 54)
    if t > 0.9:
        rich(ImageDraw.Draw(img), 540, 720, "Tu l'avais *oublié*,\ncelui-là.", inter(70, "Black"), WHITE, YEL, None, 88)
    p1(img, t, "shout" if t > 0.6 else "worry", 960, 0.6, 0)


def bchoice2(img, t):
    sky(img, 22)
    pill(img, "21:00 · CHOIX 2", MAG, 150, WHITE, 40)
    f = ease((t - 2.5) / 0.25) * max(0, 1 - (t - 3.6) / 0.6) if t >= 2.5 else 0
    hud_budget(img, 74.01 if t < 2.5 else 49.01, 17, 250, f, -25)
    speech(img, "Tes potes : « Bar ce soir ? »", 480, WHITE, 56)
    choice_buttons(img, t, f"J'y vais\n-25{NB}€", f"Pâtes chez moi\n-3{NB}€", "A", 2.4, 640)
    if 1.2 <= t < 2.4:
        countdown(img, t, 1.2, 2.4, 950)
    elif t >= 2.4:
        rich(ImageDraw.Draw(img), 540, 880, "Tu dis *oui*.\nÉvidemment.", inter(64, "Bold"), WHITE, YEL, None, 80)
    p1(img, t, "happy", 1110, 0.48, talk(t) if t >= 2.4 else 0)


def bcliff(img, t):
    sky(img, 11)
    pill(img, "DEMAIN · CHOIX 3 · À TOI", RED, 150, WHITE, 40)
    hud_budget(img, 49.01, 16, 250)
    speech(img, "Samedi : l'anniversaire\nde ta *meilleure amie*.", 480, WHITE, 54)
    choice_buttons(img, t, f"Cadeau acheté\n-30{NB}€", f"Fait main\n-5{NB}€", None, None, 690)
    d = ImageDraw.Draw(img)
    if 1.0 <= t < 2.2:
        countdown(img, t, 1.0, 2.2, 1000)
    elif t >= 2.2:
        k = back((t - 2.2) / 0.3)
        sz = int(76 * max(0.3, k))
        d.text((540, 975), "À TOI DE CHOISIR", font=inter(sz, "Black"), fill=YEL, anchor="mm")
        if t > 2.7:
            rich(d, 540, 1050, "*A ou B* en commentaire.\nPartie 2 demain : *les deux fins*.", inter(50, "Bold"),
                 WHITE, YEL, None, 64)
    p1(img, t, "worry", 1190, 0.4, 0)
    if t >= 2.2:
        tint(img, (255, 255, 255), 0.35 * max(0, 1 - (t - 2.2) / 0.2))


def bend(img, t):
    img.paste(bg_end())
    d = ImageDraw.Draw(img)
    hud_budget(img, 49.01, 16, 250)
    rich(d, 540, 520, "Il te reste *49 €*\net *16 jours*.\nTu choisis *A ou B* ?", inter(92, "Black"),
         WHITE, YEL, None, 112)
    s = back(t / 0.35)
    sz = max(20, int(110 * s))
    paste(img, logo(sz), 250 - sz / 2, 1000 - sz / 2)
    d.text((325, 1000), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 1130), "Montants d'exemple · histoire inventée", font=inter(32, "Medium"), fill=GREY, anchor="mm")


B = [(bhook, 2.8), (bchoice1, 4.2), (bevent, 2.8), (bchoice2, 4.2), (bcliff, 4.6), (bend, 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="suspense", key="E", bpm=96, seed=1313, music=music, cuts=cuts)
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
    m.pop(cuts[3] + 2.5, 0.18)
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


TIMES_A = {0: 0.0, 1: 1.6, 2: 3.2, 3: 3.2, 4: 3.2, 5: 2.8, 6: 2.4, 7: 1.8}
TIMES_B = {0: 0.0, 1: 3.6, 2: 1.2, 3: 2.8, 4: 3.6, 5: 1.8}


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("av", AV[:1], {0: 0.0})
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_heures_creuses_quiz", A, music_a)
        if which in ("av", "all"):
            render("budgetloyer_heures_creuses_quiz_trial", AV, music_av)
        if which in ("b", "all"):
            render("budgetloyer_survie_fin_de_mois_p1", B, music_b)
