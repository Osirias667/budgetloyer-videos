"""Carrousel photo TikTok du 11 novembre 2026 : « Le jour de la paie, t'es lequel ? ».

Premier test du format carrousel : TikTok ajoute lui-même une musique tendance (autoAddMusic).
Images JPG 1080x1920, texte entre y=150 et y=1500, loin du bord droit.
"""
import math
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from bl import *  # noqa: E402,F403

OUT = os.path.join(os.path.dirname(__file__), "..", "videos", "2026-11", "carrousel_paie")

PROFILS = [
    ("Le Flambeur", "🍾", "Paie à 9 h.\nTournée générale à 21 h.", "« On ne vit qu'une fois. »", "shout", MAG),
    ("Le Fantôme", "👻", "N'ouvre jamais\nl'appli de sa banque.", "« Si je regarde pas,\nça compte pas. »", "worry", CYAN),
    ("L'Écureuil", "🐿️", "Met de côté\navant même de dépenser.", "Connaît son solde\nau centime près.", "happy", YEL),
    ("Le Généreux", "🎁", "Rembourse tout le monde\nle jour même.", "« Laisse, c'est pour moi. »", "happy", RED),
    ("Le Planificateur", "📊", "Chaque euro a déjà\nun rôle avant la fin du mois.", "Sait ce qu'il lui reste,\nà tout moment.", "happy", GREEN),
]


def badge(img, txt, col, y=170):
    f = inter(44, "Black")
    w = int(f.getlength(txt)) + 60
    paste(img, box(w, 80, 40, col + (255,)), 540 - w / 2, y)
    ImageDraw.Draw(img).text((540, y + 40), txt, font=f, fill=NAVY, anchor="mm")


def cover():
    img = Image.new("RGB", (W, H))
    img.paste(bg_grid())
    title_neon(img, 0, "JOUR DE PAIE", 260, YEL, 104)
    d = ImageDraw.Draw(img)
    rich(d, 540, 400, "Le jour de la paie,\n*t'es lequel ?*", inter(104), WHITE, GREEN, None, 130)
    rich(d, 540, 700, "5 profils. Sois honnête.", inter(62, "Bold"), WHITE, YEL, None, 80)
    x0 = (W - (5 * 140 + 4 * 30)) // 2
    for i, (_, em, _, _, _, col) in enumerate(PROFILS):
        x = x0 + i * 170
        paste(img, box(140, 140, 30, col + (255,)), x, 860)
        paste(img, emoji(em, 96), x + 22, 882)
    f = inter(70, "Black")
    tw = f.getlength("Glisse")
    d.text((540 - 40, 1100), "Glisse", font=f, fill=YEL, anchor="mm")
    ax = 540 - 40 + tw / 2 + 30
    d.polygon([(ax, 1084), (ax + 40, 1084), (ax + 40, 1066), (ax + 80, 1100), (ax + 40, 1134),
               (ax + 40, 1116), (ax, 1116)], fill=YEL)
    paste(img, p1_bust("happy", 0), 160, 1200)
    return img


def profil(i):
    name, em, desc, signe, expr, col = PROFILS[i]
    img = Image.new("RGB", (W, H))
    img.paste(bg_tuto())
    badge(img, f"PROFIL {i + 1}/5", col)
    d = ImageDraw.Draw(img)
    paste(img, emoji(em, 230), 425, 290)
    d.text((540, 620), name, font=inter(104, "Black"), fill=col, anchor="mm")
    rich(d, 540, 710, desc, inter(62, "Bold"), WHITE, YEL, None, 80)
    b, g = glow_box(900, 220, 26, NAVY, col, 18)
    paste(img, b, 90 - g, 900 - g)
    d = ImageDraw.Draw(img)
    d.text((540, 940), "SIGNE DISTINCTIF", font=inter(34, "Black"), fill=col, anchor="mm")
    rich(d, 540, 980, signe, inter(52, "Bold"), WHITE, YEL, None, 64)
    paste(img, p1_bust(expr, 1 if expr == "shout" else 0), 160, 1130)
    return img


def fin():
    img = Image.new("RGB", (W, H))
    img.paste(bg_tuto())
    d = ImageDraw.Draw(img)
    rich(d, 540, 170, "Pour devenir\n*le n°5* :", inter(84), WHITE, GREEN, None, 104)
    dashboard(img, 5.0, 430)
    paste(img, logo(104), 180, 1133)
    d.text((305, 1185), "BudgetLoyer.com", font=inter(64), fill=YEL, anchor="lm")
    f = inter(62, "Bold")
    d.text((540, 1340), "Et toi, t'es lequel ?", font=f, fill=WHITE, anchor="mm")
    line = "Dis-le en commentaire"
    tw = f.getlength(line)
    d.text((540 - 40, 1420), line, font=f, fill=YEL, anchor="mm")
    paste(img, emoji("👇", 66), 540 - 40 + tw / 2 + 16, 1387)
    return img


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    slides = [cover()] + [profil(i) for i in range(5)] + [fin()]
    sheet = Image.new("RGB", (len(slides) * 276, 486), WHITE)
    for i, im in enumerate(slides):
        im.save(os.path.join(OUT, f"{i + 1:02d}.jpg"), quality=92)
        sheet.paste(im.resize((270, 480)), (i * 276, 3))
    os.makedirs("preview", exist_ok=True)
    sheet.save("preview/carrousel_paie_sheet.png")
    print(len(slides), "images")
