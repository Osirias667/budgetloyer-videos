"""Épisodes du 17 novembre 2026.

Vidéo A : « Survie · Premier appart », Épisode 2/2 (suite promise le 16 nov.) : les deux fins du choix 3
(A déco à fond -150 €, B déco récup -15 €), même imprévu pour les deux, puis « la vraie fin ».
Fiction : montants d'exemple, aucun chiffre réel.
Vidéo B : « L'échelle de panique de ton compte » (format inédit : visage muet + légende, échelle de 1 à 6,
réponse en un chiffre). Mécanisme : « silent face caption », format en tête des vues relevées par
ppl.studio/viral-formats/2026-11 (mesuré le 15 nov. 2026). Fiction : montants d'exemple.
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
appart, p1 = ep16.appart, ep16.p1
GREY = (150, 165, 175)


def flash(t, t0, hold=1.2):
    return ease((t - t0) / 0.25) * max(0, 1 - (t - t0 - hold) / 0.6) if t >= t0 else 0


# ---- A : Survie · Premier appart, Épisode 2/2 -------------------------------
def ahook(img, t):
    appart(img)
    pill(img, "SURVIE · PREMIER APPART · ÉPISODE 2/2", RED, 150, WHITE, 36)
    hud_budget(img, 540, 24, 250)
    d = ImageDraw.Draw(img)
    rich(d, 540, 490, "Déco à fond à *150 €*\nou récup à *15 €* ?", inter(92, "Black"), WHITE, YEL, None, 112)
    rich(d, 540, 750, "Voici *les deux fins*.\nUne seule tient jusqu'à la paie.", inter(54, "Bold"), WHITE, YEL, None, 70)
    p1(img, t, "worry", 960, 0.6, 0)
    punch_in(img, t)


def arecap(img, t):
    appart(img, True, 0.35)
    pill(img, "ÉPISODE 1 EN 2 SECONDES", MAG, 150, WHITE, 40)
    hud_budget(img, 540, 24, 250)
    panel(img, t, [("🛋️", f"Canapé d'occasion : -80{NB}€", (255, 120, 120)),
                   ("🛒", f"Premières courses : -120{NB}€", (255, 120, 120)),
                   ("🎉", f"Crémaillère : -90{NB}€", (255, 120, 120))], 500, 0.1, MAG, 46)
    if t > 1.0:
        rich(ImageDraw.Draw(img), 540, 860, "Et les murs sont\n*tout blancs*.", inter(60, "Black"), WHITE, YEL, None, 76)
    p1(img, t, "worry", 1080, 0.5, 0)


def afin_a(img, t):
    appart(img, False, 0.5)
    pill(img, "FIN A · DÉCO À FOND", (60, 90, 230), 150, WHITE, 42)
    hud_budget(img, 540 if t < 0.5 else 390, 24, 250, flash(t, 0.5), -150, 520)
    speech(img, "Plantes, cadres, guirlande…\nL'appart est *magnifique*.", 480, WHITE, 54)
    if t > 1.6:
        rich(ImageDraw.Draw(img), 540, 720, "Repère : *16,25 € par jour*\njusqu'à la paie.", inter(62, "Black"),
             WHITE, YEL, None, 78)
    p1(img, t, "happy", 960, 0.6, talk(t) if t < 1.6 else 0)


def afin_a2(img, t):
    appart(img, True, 0.35)
    pill(img, "FIN A · JOUR 15", (60, 90, 230), 150, WHITE, 42)
    hud_budget(img, 260 if t < 0.6 else 150, 16, 250, flash(t, 0.6), -110, 520)
    speech(img, "Première facture\n*énergie + box* : -110 €.", 480, WHITE, 56)
    notif(img, t, 1.2, "Dépassement de budget en vue", 700)
    if t > 2.0:
        rich(ImageDraw.Draw(img), 540, 930, "Fin A : *pâtes*\njusqu'à la paie.", inter(70, "Black"), WHITE, YEL, None,
             86)
    p1(img, t, "shout" if t > 0.6 else "worry", 1120, 0.5, 0)
    if t >= 0.6:
        tint(img, RED, 0.18 * max(0, 1 - (t - 0.6) / 0.3))


def afin_b(img, t):
    appart(img, False, 0.5)
    pill(img, "FIN B · DÉCO RÉCUP", (200, 70, 160), 150, WHITE, 42)
    hud_budget(img, 540 if t < 0.5 else 525, 24, 250, flash(t, 0.5), -15, 520)
    speech(img, "Cadres chinés, plante bouturée,\nguirlande de mamie.", 480, WHITE, 52)
    if t > 1.6:
        rich(ImageDraw.Draw(img), 540, 720, "Repère : *21,88 € par jour*\njusqu'à la paie.", inter(62, "Black"),
             WHITE, YEL, None, 78)
    p1(img, t, "happy", 960, 0.6, talk(t) if t < 1.6 else 0)


def afin_b2(img, t):
    appart(img, True, 0.35)
    pill(img, "FIN B · JOUR 15", (200, 70, 160), 150, WHITE, 42)
    hud_budget(img, 350 if t < 0.6 else 240, 16, 250, flash(t, 0.6), -110, 520)
    speech(img, "Même facture :\n*-110 €*.", 480, WHITE, 56)
    if t > 1.5:
        rich(ImageDraw.Draw(img), 540, 720, "Fin B : *15 € par jour*.\nÇa passe. Et c'est joli.", inter(66, "Black"),
             WHITE, GREEN, None, 82)
    p1(img, t, "happy" if t > 1.5 else "worry", 1010, 0.56, talk(t) if t > 1.5 else 0)


def avraie(img, t):
    img.paste(bg_tuto())
    pill(img, "LA VRAIE FIN", GREEN, 150, NAVY, 46)
    d = ImageDraw.Draw(img)
    rich(d, 540, 250, "Le vrai héros savait\n*combien il lui restait*\navant de décorer.", inter(68, "Black"),
         WHITE, GREEN, None, 84)
    if t > 0.7:
        hud_budget(img, 240, 16, 560)
    if t > 1.3:
        rich(ImageDraw.Draw(img), 540, 810, "Repère par jour jusqu'à la paie.\nAlerte *avant* un dépassement.",
             inter(50, "Bold"), WHITE, GREEN, None, 66)
    brand_tag(img, 40, 1450)
    p1(img, t, "happy", 1010, 0.5, 0)


def aend(img, t):
    img.paste(bg_end())
    confetti(img, t)
    d = ImageDraw.Draw(img)
    rich(d, 540, 220, "Et toi, sois honnête :\ntu aurais pris\n*A ou B* ?", inter(86, "Black"), WHITE, YEL, None, 108)
    rich(d, 540, 590, "Envoie ça au pote\nqui *emménage*.", inter(58, "Bold"), WHITE, GREEN, None, 72)
    s = back(t / 0.35)
    sz = max(20, int(110 * s))
    paste(img, logo(sz), 250 - sz / 2, 840 - sz / 2)
    d.text((325, 840), "BudgetLoyer.com", font=inter(62), fill=YEL, anchor="lm")
    d.text((540, 960), "Montants d'exemple · histoire inventée", font=inter(32, "Medium"), fill=GREY, anchor="mm")
    p1(img, t, "happy", 1040, 0.48, talk(t))


A = [(ahook, 2.8), (arecap, 2.2), (afin_a, 3.4), (afin_a2, 3.4), (afin_b, 3.4), (afin_b2, 3.2), (avraie, 3.0),
     (aend, 2.4)]


def music_a(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in A]))
    m = Track(total, style="suspense", key="D", bpm=97, seed=9993, music=music, cuts=cuts)
    m.compose(layers_at=cuts[2], break_at=cuts[6], end_at=cuts[7] + 0.15)
    m.pop(0.05)
    m.pop(0.3)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for c in (cuts[2], cuts[4]):
        m.fill(c, 1.0)
    for k in range(3):
        m.pop(cuts[1] + 0.15 + k * 0.12, 0.15)
    m.pop(cuts[1] + 1.0, 0.16)
    m.reveal(cuts[2] + 0.5, good=False)
    m.pop(cuts[2] + 1.6, 0.16)
    m.reveal(cuts[3] + 0.6, good=False)
    m.pop(cuts[3] + 1.2, 0.2)
    m.pop(cuts[3] + 2.0, 0.16)
    m.reveal(cuts[4] + 0.5, good=True)
    m.pop(cuts[4] + 1.6, 0.16)
    m.reveal(cuts[5] + 0.6, good=False)
    m.reveal(cuts[5] + 1.5, good=True)
    m.pop(cuts[6] + 0.7, 0.16)
    m.pop(cuts[6] + 1.3, 0.16)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


# ---- B : L'échelle de panique de ton compte ---------------------------------
LEVELS = [
    # (expression, bandeau, couleur d'ambiance, légende)
    ("zen", f"1{NB}850{NB}€", GREEN, "Le jour\nde la *paie*."),
    ("happy", f"1{NB}790{NB}€", (60, 200, 230), "« Allez, un resto,\nje l'ai *mérité*. »"),
    ("side", "???", YEL, "Tu n'as pas ouvert\nl'appli depuis *6 jours*."),
    ("worry", "???", (250, 150, 60), "Notif : « *Prélèvement* ».\nTu ne sais pas lequel."),
    ("panic", "???", RED, "Le *20* du mois.\nLa paie, c'est le *30*."),
]
LV = 2.3
LV6 = 3.4


def face_grid(img, t, y0, k=0.26, start=0.0, hide6=True, hl=None):
    """Grille 3 x 2 des 6 visages numérotés ; le n°6 est caché par défaut."""
    exprs = [e for e, *_ in LEVELS] + ["cool"]
    labels = [lab for _, lab, *_ in LEVELS] + [f"312{NB}€"]
    fw, fh = int(560 * k), int(600 * k)
    gx = (W - 3 * fw - 2 * 60) // 2
    for i in range(6):
        p = back((t - start - i * 0.06) / 0.3)
        if p <= 0:
            continue
        x = gx + (i % 3) * (fw + 60)
        y = y0 + (i // 3) * (fh + 90) + (1 - p) * 80
        if i == 5 and hide6:
            b = box(fw, fh, int(120 * k), (40, 44, 70, 255), WHITE + (255,), 4)
            paste(img, b, x, y)
            ImageDraw.Draw(img).text((x + fw / 2, y + fh / 2), "?", font=inter(int(fh * 0.6), "Black"), fill=YEL,
                                     anchor="mm")
        else:
            paste(img, scaled(compte_perso(exprs[i], labels[i]), k), x, y)
        guess_badge(img, x + fw - 14, y + 14, str(i + 1), [GREEN, CYAN, YEL, (250, 150, 60), RED, MAG][i], 66,
                    hl is None or hl == i)


def bhook(img, t):
    img.paste(bg_mood(MAG, 0.7))
    pill(img, "ÉCHELLE DE PANIQUE · TON COMPTE", MAG, 160, WHITE, 38)
    caption(img, "Ton compte en banque\nfait quelle tête\n*en ce moment* ?", 250, 76)
    face_grid(img, t, 600, 0.31, -1)
    caption(img, "Réponds avec *un chiffre*.", 1330, 56)
    caption(img, "La n°6 n'est pas celle que tu crois.", 1420, 44, YEL)
    punch_in(img, t)


def level_scene(i):
    expr, lab, col, cap = LEVELS[i]

    def scene(img, t):
        img.paste(bg_mood(col, 0.62))
        pill(img, f"NIVEAU {i + 1}/6", col if i != 1 else (30, 140, 200), 160, NAVY if col in (GREEN, YEL) else WHITE, 44)
        caption(img, cap, 260, 70)
        s = back(t / 0.28)
        k = 0.95 * (0.8 + 0.2 * max(0.2, s))
        shake = math.sin(t * 50) * 6 * (i - 2) if i >= 3 else 0
        bob = math.sin(t * 3) * 8
        fc = scaled(compte_perso(expr, lab), k)
        paste(img, fc, 540 - fc.width / 2 + shake, 600 + bob)
        guess_badge(img, 540 + fc.width / 2 - 20, 620, str(i + 1), col, 110)
        # jauge de panique qui monte de niveau en niveau
        gauge(img, t, 140, 1260, 800, (i + 1) / 5, 0.0, "NIVEAU DE PANIQUE")
        brand_tag(img, 40, 1420)
    return scene


def blevel6(img, t):
    img.paste(bg_mood(GREEN, 0.66))
    pill(img, "NIVEAU 6/6 · LE NIVEAU CACHÉ", MAG, 160, WHITE, 42)
    caption(img, "Tu sais *exactement*\nce qu'il te reste.", 260, 80)
    s = back(t / 0.3)
    fc = scaled(compte_perso("cool", f"312{NB}€"), 0.72 * (0.8 + 0.2 * max(0.2, s)))
    paste(img, fc, 540 - fc.width / 2, 520 + math.sin(t * 3) * 6)
    guess_badge(img, 540 + fc.width / 2 - 20, 540, "6", MAG, 110)
    if t > 0.9:
        hud_budget(img, 312, 9, 1010)
    if t > 1.6:
        caption(img, "Un repère par jour jusqu'à la paie.\nUne *alerte avant* de dépasser.", 1250, 48, WHITE, GREEN)
    brand_tag(img, 40, 1420)
    tint(img, (255, 255, 255), 0.3 * max(0, 1 - t / 0.2))


def bend(img, t):
    img.paste(bg_mood(MAG, 0.7))
    caption(img, "Ton compte, il est\nà quel niveau ? *1 à 6*", 200, 76)
    face_grid(img, t, 480, 0.26, -1, hide6=False)
    caption(img, "Envoie ça au pote\nqui est au *niveau 5*.", 1130, 60)
    s = back(t / 0.35)
    sz = max(20, int(90 * s))
    paste(img, logo(sz), 270 - sz / 2, 1380 - sz / 2)
    ImageDraw.Draw(img).text((330, 1380), "BudgetLoyer.com", font=inter(56), fill=YEL, anchor="lm")


B = [(bhook, 2.6)] + [(level_scene(i), LV) for i in range(5)] + [(blevel6, LV6), (bend, 2.2)]


def music_b(total, path, music=True):
    cuts = list(np.cumsum([0] + [d for _, d in B]))
    m = Track(total, style="jeu_tele", key="Eb", bpm=109, seed=9803, music=music, cuts=cuts)
    m.compose(layers_at=cuts[3], break_at=cuts[6], end_at=cuts[7] + 0.15)
    for k in range(6):
        m.pop(0.05 + k * 0.06, 0.12)
    for c in cuts[1:-1]:
        m.whoosh(c)
    for i in range(5):
        m.pop(cuts[1 + i] + 0.05, 0.18)
        m.tick(cuts[1 + i] + 0.4, 0.12 + 0.02 * i)
    m.fill(cuts[6], 1.0)
    m.reveal(cuts[6] + 0.1, good=True)
    m.pop(cuts[6] + 0.9, 0.16)
    m.pop(cuts[6] + 1.6, 0.16)
    m.jingle(cuts[7] + 0.15)
    m.end(path)


TIMES_A = {0: 0.0, 1: 2.0, 2: 3.0, 3: 2.6, 4: 3.0, 5: 3.0, 6: 2.8, 7: 1.8}
TIMES_B = {0: 0.0, 1: 2.0, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.0, 6: 3.2, 7: 1.8}


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "preview":
        preview("a", A, TIMES_A)
        preview("b", B, TIMES_B)
    elif what == "render":
        which = sys.argv[2] if len(sys.argv) > 2 else "all"
        if which in ("a", "all"):
            render("budgetloyer_survie_premier_appart_e2", A, music_a)
        if which in ("b", "all"):
            render("budgetloyer_echelle_panique_compte", B, music_b)
