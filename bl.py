"""Moteur des vidéos BudgetLoyer : deux DA (sketch jeu vidéo, tuto sombre)."""
import math
import os
import random
import re
import subprocess
import sys
import wave
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
S = 3
GREEN = (32, 227, 136)
YEL = (255, 214, 64)
RED = (240, 66, 66)
CYAN = (54, 214, 240)
MAG = (232, 40, 190)
WHITE = (255, 255, 255)
NAVY = (10, 14, 44)
INTER = "/usr/share/fonts/opentype/inter/Inter-%s.otf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
EMOJI = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
NB = " "


@lru_cache(maxsize=None)
def inter(size, w="ExtraBold"):
    return ImageFont.truetype(INTER % w, size)


@lru_cache(maxsize=None)
def mono(size):
    return ImageFont.truetype(MONO, size)


def ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def back(x):
    x = max(0.0, min(1.0, x))
    return 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2


@lru_cache(maxsize=None)
def emoji(ch, size):
    f = ImageFont.truetype(EMOJI, 109)
    im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((10, 10), ch, font=f, embedded_color=True)
    return im.crop(im.getbbox()).resize((size, size), Image.LANCZOS)


class P:
    """Toile sur-échantillonnée pour des formes lissées."""

    def __init__(s, w, h):
        s.w, s.h = w, h
        s.im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0))
        s.d = ImageDraw.Draw(s.im)

    def e(s, cx, cy, rx, ry, c):
        s.d.ellipse(((cx - rx) * S, (cy - ry) * S, (cx + rx) * S, (cy + ry) * S), fill=c)

    def p(s, pts, c):
        s.d.polygon([(x * S, y * S) for x, y in pts], fill=c)

    def r(s, x0, y0, x1, y1, rad, c=None, o=None, w=0):
        s.d.rounded_rectangle((x0 * S, y0 * S, x1 * S, y1 * S), rad * S, fill=c, outline=o, width=w * S)

    def l(s, pts, c, w):
        s.d.line([(x * S, y * S) for x, y in pts], fill=c, width=w * S, joint="curve")

    def arc(s, cx, cy, rx, ry, a0, a1, c, w):
        s.d.arc(((cx - rx) * S, (cy - ry) * S, (cx + rx) * S, (cy + ry) * S), a0, a1, fill=c, width=w * S)

    def t(s, xy, txt, f, c, anchor="mm"):
        s.d.text((xy[0] * S, xy[1] * S), txt, font=f(S), fill=c, anchor=anchor)

    def out(s):
        return s.im.resize((s.w, s.h), Image.LANCZOS)


def box(w, h, rad, fill, outline=None, bw=0):
    p = P(w, h)
    p.r(bw / 2, bw / 2, w - bw / 2, h - bw / 2, rad, fill, outline, int(bw))
    return p.out()


@lru_cache(maxsize=None)
def glow_box(w, h, rad, fill, border, glow=26):
    """Boîte néon, ombre lumineuse comprise."""
    m = glow * 2
    base = Image.new("RGBA", (w + m, h + m), (0, 0, 0, 0))
    b = box(w, h, rad, border + (255,))
    halo = Image.new("RGBA", base.size, (0, 0, 0, 0))
    halo.paste(b, (glow, glow), b)
    halo = halo.filter(ImageFilter.GaussianBlur(glow / 2))
    base.alpha_composite(halo)
    base.alpha_composite(box(w, h, rad, fill + (255,), border + (255,), 5), (glow, glow))
    return base, glow


# Personnages ------------------------------------------------------------
@lru_cache(maxsize=None)
def p1_bust(expr="happy", mouth=0):
    p = P(760, 820)
    skin, hair = (243, 197, 156), (28, 24, 58)
    hood, hood2 = (92, 72, 200), (72, 54, 170)
    p.r(90, 520, 670, 1000, 150, hood)
    p.p([(270, 520), (490, 520), (450, 640), (310, 640)], hood2)
    p.r(320, 440, 440, 560, 40, (222, 172, 134))
    p.l([(335, 610), (335, 690)], WHITE, 10)
    p.l([(425, 610), (425, 690)], WHITE, 10)
    p.t((380, 755), "P1", lambda k: inter(92 * k), (235, 232, 255))
    p.e(380, 300, 155, 170, skin)
    p.arc(380, 300, 180, 195, 190, 350, (30, 34, 60), 16)
    spikes = [(215, 250), (205, 170), (250, 185), (255, 105), (310, 150), (345, 70), (390, 135),
              (440, 75), (465, 150), (520, 110), (515, 185), (555, 170), (545, 250), (495, 200),
              (430, 225), (360, 195), (290, 225)]
    p.p(spikes, hair)
    p.r(198, 255, 240, 365, 18, CYAN)
    p.r(520, 255, 562, 365, 18, CYAN)
    if expr == "happy":
        p.arc(315, 305, 34, 30, 200, 340, (40, 30, 30), 9)
        p.arc(445, 305, 34, 30, 200, 340, (40, 30, 30), 9)
        p.e(275, 355, 28, 17, (250, 165, 165))
        p.e(485, 355, 28, 17, (250, 165, 165))
    else:
        p.e(315, 300, 24, 26, WHITE)
        p.e(445, 300, 24, 26, WHITE)
        p.e(315, 303, 12, 14, (35, 30, 30))
        p.e(445, 303, 12, 14, (35, 30, 30))
        if expr == "worry":
            p.l([(280, 262), (345, 245)], hair, 11)
            p.l([(415, 245), (480, 262)], hair, 11)
        elif expr == "shout":
            p.l([(280, 245), (345, 272)], hair, 13)
            p.l([(415, 272), (480, 245)], hair, 13)
    if expr == "shout" or mouth:
        c = (120, 30, 40)
        ry = 46 if expr == "shout" else 26
        p.e(380, 402, 48 if expr == "shout" else 36, ry, c)
    elif expr == "happy":
        p.d.chord((320 * S, 355 * S, 440 * S, 440 * S), 0, 180, fill=(120, 30, 40))
        p.r(345, 396, 415, 408, 3, WHITE)
    else:
        p.arc(380, 425, 34, 22, 200, 340, (120, 60, 50), 8)
    return p.out()


@lru_cache(maxsize=None)
def p1_small():
    p = P(170, 310)
    p.r(52, 215, 80, 300, 8, (60, 50, 150))
    p.r(90, 215, 118, 300, 8, (60, 50, 150))
    p.r(32, 110, 138, 235, 22, (92, 72, 200))
    p.t((85, 172), "P1", lambda k: inter(34 * k), WHITE)
    p.e(85, 62, 42, 46, (243, 197, 156))
    p.p([(42, 58), (50, 12), (85, 26), (120, 12), (128, 58), (85, 40)], (28, 24, 58))
    p.e(70, 66, 5, 6, (30, 30, 30))
    p.e(100, 66, 5, 6, (30, 30, 30))
    p.arc(85, 80, 12, 8, 200, 340, (120, 60, 50), 3)
    return p.out()


@lru_cache(maxsize=None)
def boss(mouth=0):
    p = P(760, 900)
    K = (22, 18, 30)
    p.arc(380, 215, 130, 150, 180, 360, K, 22)
    p.p([(120, 300), (70, 110), (240, 240)], WHITE)
    p.p([(640, 300), (690, 110), (520, 240)], WHITE)
    p.r(90, 215, 670, 880, 26, K)
    p.r(104, 229, 656, 866, 18, (222, 56, 44))
    p.r(104, 229, 656, 300, 18, (176, 34, 34))
    p.p([(380, 110), (470, 165), (470, 255), (290, 255), (290, 165)], YEL)
    p.t((380, 200), "-70%", lambda k: inter(56 * k, "Black"), K)
    p.e(255, 430, 88, 92, WHITE)
    p.e(505, 430, 88, 92, WHITE)
    p.e(280, 445, 36, 40, K)
    p.e(480, 445, 36, 40, K)
    p.p([(150, 330), (345, 410), (345, 450), (140, 375)], K)
    p.p([(610, 330), (415, 410), (415, 450), (620, 375)], K)
    my = 545
    mh = 120 if mouth else 72
    p.r(190, my, 570, my + mh, 40, K)
    for x in range(222, 540, 74):
        p.p([(x, my + 4), (x + 52, my + 4), (x + 26, my + 54)], WHITE)
    if mouth:
        for x in range(258, 500, 74):
            p.p([(x, my + mh - 4), (x + 52, my + mh - 4), (x + 26, my + mh - 50)], WHITE)
    p.r(104, 745, 656, 838, 8, K)
    p.t((380, 792), "BLACK FRIDAY", lambda k: mono(62 * k), YEL)
    return p.out()


@lru_cache(maxsize=None)
def card_minion(mouth=0):
    p = P(620, 430)
    K = (20, 16, 40)
    p.r(10, 10, 610, 420, 44, K)
    p.r(24, 24, 596, 406, 34, (88, 66, 230))
    p.r(24, 80, 596, 130, 0, (30, 22, 90))
    p.r(60, 165, 170, 245, 14, YEL)
    p.t((450, 345), "4X", lambda k: inter(100 * k, "Black"), YEL)
    p.e(255, 215, 40, 44, WHITE)
    p.e(385, 215, 40, 44, WHITE)
    p.e(268, 225, 18, 21, K)
    p.e(372, 225, 18, 21, K)
    p.l([(215, 165), (295, 186)], K, 12)
    p.l([(425, 165), (345, 186)], K, 12)
    if mouth:
        p.e(320, 310, 42, 30, (130, 20, 60))
    else:
        p.arc(320, 285, 62, 44, 25, 155, K, 11)
    return p.out()


@lru_cache(maxsize=None)
def price_tag(txt):
    p = P(300, 150)
    K = (24, 20, 30)
    p.p([(6, 12), (220, 12), (294, 75), (220, 138), (6, 138)], K)
    p.p([(16, 22), (216, 22), (280, 75), (216, 128), (16, 128)], YEL)
    p.e(70, 54, 15, 16, WHITE)
    p.e(130, 54, 15, 16, WHITE)
    p.e(74, 57, 7, 8, K)
    p.e(126, 57, 7, 8, K)
    p.l([(50, 34), (88, 46)], K, 6)
    p.l([(150, 34), (112, 46)], K, 6)
    p.t((110, 105), txt, lambda k: inter(35 * k, "Black"), (200, 30, 30))
    return p.out()


@lru_cache(maxsize=None)
def logo(size):
    p = P(240, 240)
    D = (10, 40, 32)
    p.r(0, 0, 240, 240, 52, GREEN)
    p.p([(120, 42), (206, 116), (34, 116)], D)
    p.r(58, 110, 182, 196, 8, D)
    p.t((120, 148), "€", lambda k: inter(64 * k, "Black"), GREEN)
    return p.out().resize((size, size), Image.LANCZOS)


# Décors -----------------------------------------------------------------
def grad(top, bottom, h0=0, h1=H):
    out = np.zeros((H, W, 3), np.uint8)
    for y in range(H):
        x = min(1, max(0, (y - h0) / max(1, h1 - h0)))
        out[y] = [int(top[i] + (bottom[i] - top[i]) * x) for i in range(3)]
    return out


@lru_cache(maxsize=None)
def bg_synth():
    a = grad((12, 3, 44), (70, 16, 118), 0, 1150)
    im = Image.fromarray(a)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle((0, 1150, W, H), fill=(14, 3, 40, 255))
    sun = P(620, 620)
    for y in range(620):
        x = y / 620
        col = (255, int(205 - 150 * x), int(95 + 75 * x))
        hw = math.sqrt(max(0, 310 ** 2 - (y - 310) ** 2))
        p_gap = y > 300 and (y // 34) % 2 == 1
        if not p_gap:
            sun.r(310 - hw, y, 310 + hw, y + 1, 0, col)
    im.paste(sun.out(), (230, 560), sun.out())
    for i in range(14):
        y = 1150 + (i / 14) ** 2 * 770
        d.line((0, y, W, y), fill=(230, 40, 200, 170), width=3)
    for i in range(-14, 15):
        d.line((540 + i * 34, 1150, 540 + i * 190, H), fill=(230, 40, 200, 140), width=3)
    return im


def ground(im):
    d = ImageDraw.Draw(im)
    d.rectangle((0, 1700, W, H), fill=(138, 98, 62))
    d.rectangle((0, 1700, W, 1722), fill=(70, 196, 120))
    for r, y in enumerate(range(1730, H, 52)):
        d.line((0, y, W, y), fill=(92, 62, 40), width=5)
        for x in range(-60 + 60 * (r % 2), W, 120):
            d.line((x, y, x, y + 52), fill=(92, 62, 40), width=5)


@lru_cache(maxsize=None)
def bg_grid():
    """Fond rétro sans soleil, pour que le texte reste lisible en accroche."""
    a = grad((12, 3, 44), (70, 16, 118), 0, 1150)
    im = Image.fromarray(a)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle((0, 1150, W, H), fill=(14, 3, 40, 255))
    for i in range(14):
        y = 1150 + (i / 14) ** 2 * 770
        d.line((0, y, W, y), fill=(230, 40, 200, 170), width=3)
    for i in range(-14, 15):
        d.line((540 + i * 34, 1150, 540 + i * 190, H), fill=(230, 40, 200, 140), width=3)
    return im


@lru_cache(maxsize=None)
def bg_day():
    im = Image.fromarray(grad((74, 26, 170), (250, 120, 170), 0, 1700))
    d = ImageDraw.Draw(im, "RGBA")
    rng = random.Random(4)
    for x in range(-20, W, 130):
        h = rng.randint(180, 330)
        d.rectangle((x, 1700 - h, x + 112, 1700), fill=(150, 90, 150, 130))
        for wy in range(1700 - h + 20, 1680, 46):
            for wx in range(x + 16, x + 96, 32):
                d.rectangle((wx, wy, wx + 16, wy + 24), fill=(255, 220, 170, 70))
    for x, y, w in ((70, 500, 200), (760, 580, 170)):
        d.rectangle((x, y, x + w, y + 34), fill=(240, 236, 255, 255))
        d.rectangle((x + 30, y - 30, x + w - 30, y), fill=(240, 236, 255, 255))
    ground(im)
    return im


@lru_cache(maxsize=None)
def bg_shop():
    im = Image.fromarray(grad((208, 224, 244), (240, 244, 250), 0, 1700))
    d = ImageDraw.Draw(im)
    items = "📺🎧👟🎮📱🧥🛍️🕶️⌚🎒💻👜"
    arr = [c for c in re.findall(r".️?", items)]
    rng = random.Random(8)
    for y in (980, 1240, 1500):
        rng.shuffle(arr)
        for i, ch in enumerate(arr[:7]):
            e = emoji(ch, 104)
            im.paste(e, (28 + i * 150, y - 112), e)
        d.rectangle((0, y, W, y + 14), fill=(112, 124, 150))
    ground(im)
    return im


@lru_cache(maxsize=None)
def bg_rays():
    im = Image.new("RGB", (W, H), (20, 26, 92))
    d = ImageDraw.Draw(im)
    for i in range(0, 360, 20):
        a, b = math.radians(i), math.radians(i + 10)
        d.polygon([(540, 1050), (540 + 2400 * math.cos(a), 1050 + 2400 * math.sin(a)),
                   (540 + 2400 * math.cos(b), 1050 + 2400 * math.sin(b))], fill=(116, 104, 118))
    ground(im)
    return im


@lru_cache(maxsize=None)
def bg_tuto():
    a = np.zeros((H, W, 3), np.float32)
    a[:] = (9, 13, 20)
    yy, xx = np.mgrid[0:H, 0:W]
    a[:, :, 1] += 26 * np.exp(-(((xx - 880) / 520) ** 2 + ((yy - 130) / 420) ** 2))
    a[:, :, 2] += 32 * np.exp(-(((xx - 880) / 520) ** 2 + ((yy - 130) / 420) ** 2))
    a[:, :, 1] += 34 * np.exp(-(((xx - 130) / 480) ** 2 + ((yy - 1780) / 400) ** 2))
    a[:, :, 2] += 14 * np.exp(-(((xx - 130) / 480) ** 2 + ((yy - 1780) / 400) ** 2))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


@lru_cache(maxsize=None)
def bg_end():
    im = Image.new("RGB", (W, H), (6, 3, 26))
    d = ImageDraw.Draw(im)
    rng = random.Random(3)
    for _ in range(90):
        x, y = rng.randint(0, W), rng.randint(0, H)
        d.ellipse((x, y, x + 4, y + 4), fill=(150, 150, 210))
    return im


# Éléments ---------------------------------------------------------------
def paste(img, spr, x, y):
    img.paste(spr, (int(x), int(y)), spr)


def parse(txt):
    """*mot* colore le segment. Renvoie [(caractère, surligné)]."""
    out, on = [], False
    for ch in txt:
        if ch == "*":
            on = not on
        else:
            out.append((ch, on))
    return out


def rich(d, cx, y, txt, f, col, hi, n=None, lh=None):
    """Texte centré multi-lignes avec segments colorés et révélation progressive."""
    lines = txt.split("\n")
    lh = lh or int(f.size * 1.22)
    left = 10 ** 9 if n is None else n
    for li, line in enumerate(lines):
        chars = parse(line)
        tw = f.getlength("".join(c for c, _ in chars))
        x = cx - tw / 2
        run, flag = "", None
        for c, h in chars[: max(0, left)] + [(None, None)]:
            if h != flag or c is None:
                if run:
                    d.text((x, y + li * lh), run, font=f, fill=hi if flag else col)
                    x += f.getlength(run)
                run, flag = "", h
            if c is not None:
                run += c
        left -= len(chars)


def typing(t, start, cps=34):
    return int(max(0, t - start) * cps)


def dialog(img, t, tag, tagcol, text, h=None, size=56):
    """Bandeau de dialogue néon avec étiquette de rôle."""
    d = ImageDraw.Draw(img)
    nl = text.count("\n") + 1
    bh = h or 56 + nl * int(size * 1.22)
    bw = 980
    b, g = glow_box(bw, bh, 12, NAVY, CYAN)
    paste(img, b, 50 - g, 214 - g)
    tagf = inter(30, "Bold")
    tw = int(tagf.getlength(tag)) + 44
    pill = box(tw, 50, 8, tagcol + (255,))
    paste(img, pill, 540 - tw / 2, 150)
    d = ImageDraw.Draw(img)
    d.text((540, 175), tag, font=tagf, fill=WHITE if tagcol != YEL else NAVY, anchor="mm")
    rich(d, 540, 214 + 26, text, mono(size), WHITE, YEL, typing(t, 0.05))


def panel(img, t, lines, y, start=0.0, border=MAG, size=52):
    p = ease((t - start) / 0.25)
    if p <= 0:
        return
    h = 56 + len(lines) * int(size * 1.5)
    b, g = glow_box(900, h, 12, NAVY, border)
    paste(img, b, 90 - g, y - g + (1 - p) * 60)
    d = ImageDraw.Draw(img)
    for i, (em, txt, col) in enumerate(lines):
        ly = y + 30 + i * int(size * 1.5) + (1 - p) * 60
        x = 134
        if em:
            e = emoji(em, size)
            paste(img, e, x, ly + 4)
            x += size + 26
        d.text((x, ly), txt, font=mono(size), fill=col)


def title_neon(img, t, txt, y, col=MAG, size=120):
    layer = Image.new("RGBA", (W, 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((540, 130), txt, font=mono(size), fill=col + (255,), anchor="mm")
    halo = layer.filter(ImageFilter.GaussianBlur(14))
    paste(img, halo, 0, y - 130)
    paste(img, layer, 0, y - 130)


def dashboard(img, t, y, count_start=0.3):
    b, g = glow_box(960, 640, 26, (14, 20, 30), (28, 90, 74), 34)
    paste(img, b, 60 - g, y - g)
    d = ImageDraw.Draw(img)
    d.ellipse((96, y + 30, 114, y + 48), fill=GREEN)
    d.text((130, y + 22), "budgetloyer.com", font=inter(32, "Medium"), fill=(150, 165, 175))
    d.line((60, y + 76, 1020, y + 76), fill=(38, 50, 62), width=3)
    lg = logo(70)
    paste(img, lg, 96, y + 106)
    d.text((184, y + 118), "BudgetLoyer", font=inter(48), fill=WHITE)
    cell = box(450, 330, 24, (24, 32, 44, 255))
    paste(img, cell, 96, y + 222)
    d.text((132, y + 258), "Il te reste ce mois", font=inter(34, "Medium"), fill=(170, 182, 190))
    p = ease((t - count_start) / 1.0)
    d.text((132, y + 316), f"{round(312 * p)}{NB}€", font=inter(112), fill=GREEN)
    d.rounded_rectangle((132, y + 480, 510, y + 500), 10, fill=(50, 60, 72))
    d.rounded_rectangle((132, y + 480, 132 + max(20, 256 * p), y + 500), 10, fill=GREEN)
    rows = [("Loyer", "650", GREEN), ("Courses", "210", (70, 140, 250)),
            ("Factures", "138", YEL), ("Abonnements", "42", (150, 110, 240))]
    for i, (n, v, c) in enumerate(rows):
        yy = y + 238 + i * 76
        d.ellipse((588, yy + 12, 612, yy + 36), fill=c)
        d.text((628, yy), n, font=inter(34, "Bold"), fill=WHITE)
        d.text((984, yy + 2), f"{v}{NB}€", font=inter(34, "Bold"), fill=WHITE, anchor="ra")


def notif(img, t, start, msg, y):
    p = back((t - start) / 0.35)
    if t < start:
        return
    n = box(880, 170, 28, WHITE + (255,))
    x, yy = 100, y - (1 - p) * 300
    paste(img, n, x, yy)
    d = ImageDraw.Draw(img)
    d.ellipse((x + 30, yy + 50, x + 106, yy + 126), fill=(235, 60, 60))
    d.text((x + 68, yy + 88), "!", font=inter(58, "Black"), fill=WHITE, anchor="mm")
    d.text((x + 132, yy + 34), "BudgetLoyer · maintenant", font=inter(30, "Medium"), fill=(110, 110, 120))
    d.text((x + 132, yy + 82), msg, font=inter(40), fill=(20, 20, 26))


CONF_COLS = [GREEN, YEL, MAG, CYAN, (150, 110, 240), RED]
CONF = [(random.Random(i).randint(0, W), random.Random(i * 7).random(), random.Random(i * 3).choice(CONF_COLS))
        for i in range(70)]


def confetti(img, t):
    d = ImageDraw.Draw(img)
    for x, ph, c in CONF:
        y = ((ph * 2.4 + t * 0.34) % 1.15 - 0.1) * H
        xx = x + math.sin(t * 2 + ph * 9) * 34
        d.rectangle((xx, y, xx + 18, y + 10), fill=c)


def phone(img, y=640, h=1040):
    w = 560
    b, g = glow_box(w, h, 62, (10, 15, 22), (38, 78, 72), 40)
    x = 540 - w / 2
    paste(img, b, x - g, y - g)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((470, y + 22, 610, y + 58), 18, fill=(0, 0, 0))
    return int(x), int(y), w, h


def bars(img, t, x, y, w, rows, start=0.2):
    d = ImageDraw.Draw(img)
    for i, (name, val, cap, col) in enumerate(rows):
        yy = y + i * 150
        p = ease((t - start - i * 0.16) / 0.7)
        cur = round(val * p)
        d.text((x, yy), name, font=inter(40), fill=WHITE)
        vc = RED if cur > cap else GREEN
        d.text((x + w, yy), f"{cur} / {cap}{NB}€", font=inter(38), fill=vc, anchor="ra")
        d.rounded_rectangle((x, yy + 66, x + w, yy + 90), 12, fill=(36, 46, 58))
        d.rounded_rectangle((x, yy + 66, x + max(24, w * min(1, val / cap) * p), yy + 90), 12, fill=col)


# Ajouts des épisodes -----------------------------------------------------
@lru_cache(maxsize=None)
def stamp(txt, col, size=120, angle=-9):
    """Tampon incliné à bord épais, posé par-dessus une carte."""
    f = inter(size, "Black")
    tw = int(f.getlength(txt))
    w, h = tw + 110, int(size * 1.75)
    p = P(w, h)
    p.r(6, 6, w - 6, h - 6, 26, col + (235,))
    p.r(18, 18, w - 18, h - 18, 18, None, WHITE, 7)
    p.t((w / 2, h / 2 + 4), txt, lambda k: inter(size * k, "Black"), WHITE)
    return p.out().rotate(angle, resample=Image.BICUBIC, expand=True)


SKY = {8: ((252, 170, 130), (150, 205, 250)), 11: ((88, 170, 245), (190, 228, 250)),
       13: ((64, 150, 240), (170, 218, 250)), 16: ((246, 150, 80), (250, 208, 150)),
       19: ((120, 70, 180), (246, 130, 150)), 22: ((14, 16, 60), (46, 40, 112)),
       0: ((6, 6, 30), (22, 20, 70))}


@lru_cache(maxsize=None)
def bg_sky(hour, sun=True):
    """Ciel plat dont la couleur et l'astre suivent l'heure, skyline en bas. sun=False : sans astre."""
    top, bot = SKY[hour]
    im = Image.fromarray(grad(top, bot, 0, 1180))
    d = ImageDraw.Draw(im, "RGBA")
    night = hour in (22, 0)
    a = math.pi * (hour - 6) / 14 if not night else math.pi * 0.72
    cx, cy = 540 + 440 * math.cos(math.pi - a), 900 - 560 * math.sin(a)
    if not sun:
        pass
    elif night:
        d.ellipse((cx - 70, cy - 70, cx + 70, cy + 70), fill=(238, 238, 214, 255))
        d.ellipse((cx - 36, cy - 86, cx + 90, cy + 42), fill=top + (255,))
        rng = random.Random(hour + 5)
        for _ in range(60):
            x, y = rng.randint(0, W), rng.randint(0, 1050)
            d.ellipse((x, y, x + 5, y + 5), fill=(235, 235, 255, 180))
    else:
        d.ellipse((cx - 90, cy - 90, cx + 90, cy + 90), fill=(255, 226, 120, 255))
    rng = random.Random(21)
    build = (30, 26, 76) if night else (72, 52, 120)
    for x in range(-30, W, 150):
        h = rng.randint(380, 620)
        y0 = 1920 - h
        d.rectangle((x, y0, x + 136, 1920), fill=build + (255,))
        for wy in range(y0 + 24, 1900, 62):
            for wx in range(x + 18, x + 118, 40):
                lit = night and rng.random() > 0.35
                c = (255, 222, 130, 255) if lit else (255, 230, 190, 60)
                d.rectangle((wx, wy, wx + 22, wy + 34), fill=c)
    return im


def speech(img, txt, y, col=WHITE, size=52, fill=NAVY, border=CYAN):
    """Bulle néon large, texte centré, sans frappe progressive."""
    n = txt.count("\n") + 1
    h = 44 + n * int(size * 1.25)
    b, g = glow_box(940, h, 18, fill, border)
    paste(img, b, 70 - g, y - g)
    d = ImageDraw.Draw(img)
    rich(d, 540, y + 22, txt, inter(size, "Bold"), col, YEL, None, int(size * 1.25))


@lru_cache(maxsize=None)
def blob_decouvert(mouth=0):
    """Monsieur Découvert, petit monstre rouge récurrent."""
    p = P(320, 280)
    K = (24, 12, 30)
    p.e(160, 150, 150, 124, K)
    p.e(160, 150, 138, 112, (225, 54, 54))
    p.p([(62, 60), (40, 6), (112, 44)], K)
    p.p([(258, 60), (280, 6), (208, 44)], K)
    p.e(112, 118, 28, 30, WHITE)
    p.e(208, 118, 28, 30, WHITE)
    p.e(118, 124, 12, 14, K)
    p.e(202, 124, 12, 14, K)
    if mouth:
        p.e(160, 182, 34, 20, K)
    else:
        p.arc(160, 168, 34, 22, 20, 160, K, 7)
    p.t((160, 232), "-50 €", lambda k: inter(46 * k, "Black"), YEL)
    return p.out()


def buzzer(img, x, y, w, h, label, col, active, dim, pulse=0):
    """Gros buzzer de jeu, actif (éclaté) ou éteint après la réponse."""
    f = inter(92, "Black")
    if dim:
        c = (70, 72, 92)
    else:
        c = col
    grow = 16 if active else 0
    b, g = glow_box(w + grow * 2, h + grow, 34, c, WHITE if active else c, 26 if active else 14)
    paste(img, b, x - grow - g, y - grow + pulse - g)
    d = ImageDraw.Draw(img)
    d.text((x + w / 2, y + h / 2 - grow / 2 + pulse), label, font=f,
           fill=WHITE if not dim else (140, 140, 160), anchor="mm")


@lru_cache(maxsize=None)
def thermostat(temp, expr="calm", mouth=0):
    """Thermostat mural rond, personnage du POV (11 nov. 2026). expr : calm, panic, sleep."""
    p = P(420, 460)
    K = (24, 20, 40)
    p.r(20, 20, 400, 440, 70, K)
    p.r(32, 32, 388, 428, 60, (236, 238, 248))
    hot = temp >= 23
    ring = RED if hot else (GREEN if temp <= 19 else YEL)
    p.e(210, 205, 150, 150, K)
    p.e(210, 205, 138, 138, ring)
    p.e(210, 205, 112, 112, (18, 22, 44))
    p.t((210, 196), f"{temp}°", lambda k: inter(92 * k, "Black"), WHITE)
    # visage sous l'écran
    ey = 385
    if expr == "sleep":
        p.arc(150, ey, 22, 12, 20, 160, K, 7)
        p.arc(270, ey, 22, 12, 20, 160, K, 7)
    else:
        r = 22 if expr == "panic" else 16
        p.e(150, ey, r, r + 2, WHITE)
        p.e(270, ey, r, r + 2, WHITE)
        p.e(150, ey + 2, 8, 9, K)
        p.e(270, ey + 2, 8, 9, K)
        p.arc(150, ey, r + 1, r + 3, 0, 360, K, 4)
        p.arc(270, ey, r + 1, r + 3, 0, 360, K, 4)
    if mouth or expr == "panic":
        p.e(210, 412, 20, 12, (130, 30, 50))
    else:
        p.arc(210, 404, 18, 10, 20, 160, K, 5)
    return p.out()


@lru_cache(maxsize=None)
def coloc_bust(hair, top, expr="happy", mouth=0, skin=(243, 197, 156), acc=None):
    """Coloc générique plat (buste). acc : 'plaid' ou 'bonnet'."""
    p = P(420, 520)
    K = (30, 24, 40)
    p.r(50, 330, 370, 560, 110, top)
    p.r(170, 280, 250, 350, 26, tuple(max(0, c - 22) for c in skin))
    p.e(210, 190, 112, 124, skin)
    p.e(210, 108, 118, 72, hair)
    p.r(98, 100, 128, 210, 14, hair)
    p.r(292, 100, 322, 210, 14, hair)
    if acc == "bonnet":
        p.e(210, 92, 124, 62, RED)
        p.r(86, 92, 334, 128, 16, WHITE)
        p.e(210, 26, 26, 26, WHITE)
    if expr == "happy":
        p.arc(168, 196, 20, 16, 200, 340, K, 6)
        p.arc(252, 196, 20, 16, 200, 340, K, 6)
    else:
        p.e(168, 194, 15, 17, WHITE)
        p.e(252, 194, 15, 17, WHITE)
        p.e(168, 197, 7, 9, K)
        p.e(252, 197, 7, 9, K)
        if expr == "angry":
            p.l([(146, 166), (190, 180)], K, 7)
            p.l([(274, 166), (230, 180)], K, 7)
        elif expr == "worry":
            p.l([(146, 178), (190, 164)], K, 7)
            p.l([(274, 178), (230, 164)], K, 7)
    if mouth or expr == "angry":
        p.e(210, 252, 26, 16, (130, 30, 50))
    elif expr == "worry":
        p.arc(210, 262, 22, 12, 200, 340, K, 6)
    else:
        p.arc(210, 236, 26, 18, 20, 160, K, 6)
    if acc == "plaid":
        p.r(30, 360, 390, 520, 50, (220, 60, 90))
        for x in range(60, 380, 60):
            p.l([(x, 365), (x, 515)], (250, 200, 210), 6)
        p.l([(40, 440), (380, 440)], (250, 200, 210), 6)
    return p.out()


@lru_cache(maxsize=None)
def advent_cal(mouth=0, open_door=0):
    """Calendrier de l'Avent avec un visage, personnage du quiz (11 nov. 2026)."""
    p = P(460, 560)
    K = (24, 16, 30)
    p.r(10, 40, 450, 550, 34, K)
    p.r(22, 52, 438, 538, 26, (196, 40, 62))
    p.r(150, 0, 310, 70, 20, K)
    p.r(162, 12, 298, 58, 14, GREEN)
    p.t((230, 35), "24", lambda k: inter(34 * k, "Black"), NAVY)
    n = 1
    for row in range(4):
        for col in range(4):
            x, y = 52 + col * 92, 250 + row * 70
            if row == 0 and col in (1, 2):
                n += 1
                continue
            c = YEL if n == open_door else (236, 200, 120)
            p.r(x, y, x + 76, y + 56, 8, c)
            p.t((x + 38, y + 29), str(n), lambda k: inter(26 * k, "Black"), (120, 30, 40))
            n += 1
    p.e(150, 150, 36, 40, WHITE)
    p.e(310, 150, 36, 40, WHITE)
    p.e(156, 158, 16, 18, K)
    p.e(304, 158, 16, 18, K)
    if mouth:
        p.e(230, 222, 34, 20, K)
    else:
        p.arc(230, 206, 40, 22, 20, 160, K, 8)
    return p.out()


def brand_tag(img, x=40, y=1430):
    """Petite signature de marque (logo + nom) présente pendant la vidéo."""
    paste(img, logo(56), x, y)
    ImageDraw.Draw(img).text((x + 70, y + 28), "BudgetLoyer.com", font=inter(34, "Bold"), fill=YEL, anchor="lm")


def punch_in(img, t, amt=0.07, dur=0.6):
    """Zoom arrière rapide sur la première image : l'accroche bouge dès 0 s."""
    if t >= dur:
        return
    k = 1 + amt * (1 - ease(t / dur))
    w, h = int(W / k), int(H / k)
    x0, y0 = (W - w) // 2, (H - h) // 2
    img.paste(img.crop((x0, y0, x0 + w, y0 + h)).resize((W, H), Image.BICUBIC))


class SoftMix:
    """Mixeur audio doux (règle audio du PLAYBOOK).

    Ondes triangle et sinus, bruitages légers (pop, whoosh), jingle de marque,
    passe-bas 3,5 kHz, compression douce, puis normalisation à -20 LUFS.
    """

    def __init__(s, total, sr=44100, music=True):
        s.sr, s.total, s.music = sr, total, music
        s.out = np.zeros(int(total * sr) + sr)
        s.mus = np.zeros_like(s.out)
        s.duck = np.ones_like(s.out)

    def add_music(s, sig, at, g):
        """Musique de fond : coupée pour la version Instagram avec son du catalogue."""
        if not s.music:
            return
        a = int(at * s.sr)
        e = min(len(s.mus), a + len(sig))
        if a < e:
            s.mus[a:e] += sig[: e - a] * g

    def voice(s, path, at, g=1.0):
        """Ajoute une prise de voix (voix/*.m4a, .wav…) et baisse la musique dessous."""
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(s.sr),
                              "-af", "highpass=f=80,afftdn,loudnorm=I=-16:TP=-2", "-f", "f32le", "-"],
                             check=True, capture_output=True).stdout
        v = np.frombuffer(raw, np.float32).astype(np.float64)
        s.add(v * 2.2, at, g)
        a, e = int(at * s.sr), min(len(s.duck), int(at * s.sr) + len(v))
        fade = int(0.15 * s.sr)
        s.duck[max(0, a - fade):e + fade] = np.minimum(s.duck[max(0, a - fade):e + fade], 0.35)
        return len(v) / s.sr

    def x(s, l):
        return np.arange(int(l * s.sr)) / s.sr

    def add(s, sig, at, g):
        a = int(at * s.sr)
        e = min(len(s.out), a + len(sig))
        if a < e:
            s.out[a:e] += sig[: e - a] * g

    def tri(s, f, l, dec=6):
        x = s.x(l)
        return (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f * x)) * np.exp(-x * dec) * np.minimum(1, x / 0.006)

    def sn(s, f, l, dec=4):
        x = s.x(l)
        return np.sin(2 * np.pi * f * x) * np.exp(-x * dec) * np.minimum(1, x / 0.004)

    def kick(s):
        x = s.x(0.17)
        return np.sin(2 * np.pi * (52 * x + 42 * (1 - np.exp(-x * 34)) / 34)) * np.exp(-x * 20)

    def pop(s, at, g=0.22):
        """Petit « pop » rond pour un texte ou un objet qui apparaît."""
        x = s.x(0.09)
        f = 520 + 380 * np.exp(-x * 40)
        s.add(np.sin(2 * np.pi * np.cumsum(f) / s.sr) * np.exp(-x * 35), at, g)

    def whoosh(s, at, g=0.12, l=0.35):
        """Souffle doux pour un changement de plan, centré sur `at`."""
        x = s.x(l)
        n = np.random.default_rng(int(at * 100)).normal(0, 1, len(x))
        n = np.convolve(n, np.ones(24) / 24, mode="same")
        env = np.sin(np.pi * x / l) ** 2
        s.add(n * env, at - l / 2, g)

    def jingle(s, at, g=0.3):
        """Signature BudgetLoyer : trois notes douces montantes (do, mi, sol) puis do aigu."""
        for k, f in enumerate((523.3, 659.3, 784.0)):
            s.add(s.sn(f, 0.5, 5) + 0.3 * s.sn(f * 2, 0.5, 8), at + k * 0.11, g)
        s.add(s.sn(1046.5, 0.7, 4) + 0.2 * s.sn(1568, 0.7, 7), at + 0.33, g * 0.9)

    def end(s, path):
        k2 = np.ones(int(0.08 * s.sr)) / int(0.08 * s.sr)
        duck = np.convolve(s.duck, k2, mode="same")
        a = (s.out + s.mus * duck)[: int(s.total * s.sr)].copy()
        k = math.exp(-2 * math.pi * 3500 / s.sr)
        y = np.empty_like(a)
        acc = 0.0
        for i in range(len(a)):
            acc = (1 - k) * a[i] + k * acc
            y[i] = acc
        y = np.tanh(y / (np.max(np.abs(y)) + 1e-9) * 1.6)
        tmp = path + ".raw.wav"
        write_wav(y, tmp)
        subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af",
                               "loudnorm=I=-20:TP=-3:LRA=5", "-ar", "44100", path])


# Rendu ------------------------------------------------------------------
def frame(fn, t):
    img = Image.new("RGB", (W, H), (0, 0, 0))
    fn(img, t)
    return img


def render(name, scenes, music_fn):
    os.makedirs(f"parts_{name}", exist_ok=True)
    pd = f"parts_{name}"
    for i, (fn, dur) in enumerate(scenes):
        tmp, out = f"{pd}/s{i}.tmp.mp4", f"{pd}/s{i}.mp4"
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
               "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "20",
               "-preset", "veryfast", "-pix_fmt", "yuv420p", tmp]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for k in range(round(dur * FPS)):
            p.stdin.write(frame(fn, k / FPS).tobytes())
        p.stdin.close()
        if p.wait():
            sys.exit(f"échec scène {i}")
        os.rename(tmp, out)
    with open(f"{pd}/list.txt", "w") as f:
        for i in range(len(scenes)):
            f.write(f"file 's{i}.mp4'\n")
    total = sum(d for _, d in scenes)
    music_fn(total, f"{pd}/m.wav")
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i",
                           f"{pd}/list.txt", "-i", f"{pd}/m.wav", "-map", "0:v", "-map", "1:a", "-c:v",
                           "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart",
                           f"{name}.mp4"])


def preview(name, scenes, times=None):
    os.makedirs("preview", exist_ok=True)
    ims = []
    for i, (fn, dur) in enumerate(scenes):
        t = (times or {}).get(i, dur - 0.05)
        im = frame(fn, t)
        im.save(f"preview/{name}_{i}.png")
        ims.append(im.resize((270, 480)))
    cols = min(6, len(ims))
    rows = math.ceil(len(ims) / cols)
    sheet = Image.new("RGB", (cols * 276, rows * 486), WHITE)
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * 276, (i // cols) * 486))
    sheet.save(f"preview/{name}_sheet.png")


def write_wav(out, path, sr=44100):
    out = out / max(1e-6, np.max(np.abs(out))) * 0.7
    fade = int(0.35 * sr)
    out[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


# Ajouts du 12 nov. 2026 ----------------------------------------------------
@lru_cache(maxsize=None)
def carte_perso(expr="happy", mouth=0):
    """Carte bancaire générique avec un visage (série Carte contre Billet, 12 nov. 2026)."""
    p = P(440, 300)
    K = (20, 16, 40)
    p.r(6, 6, 434, 294, 34, K)
    p.r(16, 16, 424, 284, 26, (60, 90, 230))
    p.r(16, 200, 424, 240, 0, (40, 64, 190))
    p.r(46, 52, 116, 106, 10, YEL)
    p.l([(46, 79), (116, 79)], (200, 150, 30), 4)
    p.l([(81, 52), (81, 106)], (200, 150, 30), 4)
    for k in range(4):
        p.t((70 + k * 100, 262), "••••", lambda s: inter(26 * s, "Black"), (210, 220, 255))
    _face(p, 290, 112, expr, mouth, K)
    return p.out()


@lru_cache(maxsize=None)
def billet_perso(expr="happy", mouth=0):
    """Billet générique avec un visage (pas de reproduction d'un vrai billet)."""
    p = P(460, 260)
    K = (20, 40, 30)
    p.r(6, 6, 454, 254, 18, K)
    p.r(16, 16, 444, 244, 12, (150, 214, 160))
    p.r(32, 32, 428, 228, 8, None, (90, 160, 110), 5)
    p.e(96, 130, 52, 52, (110, 190, 130))
    p.t((96, 132), "€", lambda s: inter(64 * s, "Black"), K)
    p.t((390, 62), "€", lambda s: inter(40 * s, "Black"), (60, 120, 80))
    _face(p, 290, 112, expr, mouth, K)
    return p.out()


def _face(p, cx, cy, expr, mouth, K):
    """Visage commun aux objets parlants : yeux, sourcils, bouche."""
    if expr == "happy":
        p.arc(cx - 50, cy, 20, 16, 200, 340, K, 7)
        p.arc(cx + 50, cy, 20, 16, 200, 340, K, 7)
    else:
        p.e(cx - 50, cy, 20, 22, WHITE)
        p.e(cx + 50, cy, 20, 22, WHITE)
        p.e(cx - 50, cy + 3, 9, 11, K)
        p.e(cx + 50, cy + 3, 9, 11, K)
        if expr == "angry":
            p.l([(cx - 76, cy - 34), (cx - 28, cy - 20)], K, 7)
            p.l([(cx + 76, cy - 34), (cx + 28, cy - 20)], K, 7)
        elif expr == "sad":
            p.l([(cx - 76, cy - 20), (cx - 28, cy - 34)], K, 7)
            p.l([(cx + 76, cy - 20), (cx + 28, cy - 34)], K, 7)
    if mouth:
        p.e(cx, cy + 58, 24, 16, (130, 30, 50))
    elif expr == "sad":
        p.arc(cx, cy + 70, 26, 14, 200, 340, K, 6)
    else:
        p.arc(cx, cy + 44, 28, 18, 20, 160, K, 6)


@lru_cache(maxsize=None)
def bg_ring():
    """Ring de match plat : projecteurs, cordes, tapis (12 nov. 2026)."""
    im = Image.fromarray(grad((16, 8, 46), (60, 18, 90), 0, 1500))
    d = ImageDraw.Draw(im, "RGBA")
    for cx in (180, 540, 900):
        d.polygon([(cx - 30, 0), (cx + 30, 0), (cx + 260, 1500), (cx - 260, 1500)], fill=(255, 240, 200, 18))
    rng = random.Random(12)
    for _ in range(140):
        x, y = rng.randint(0, W), rng.randint(1180, 1480)
        d.ellipse((x, y, x + 10, y + 10), fill=(255, 255, 255, rng.randint(30, 90)))
    d.rectangle((0, 1500, W, H), fill=(36, 60, 150, 255))
    d.polygon([(0, 1500), (W, 1500), (W, 1560), (0, 1560)], fill=(26, 44, 120, 255))
    for k, c in enumerate((RED, WHITE, CYAN)):
        y = 1310 + k * 62
        d.line((0, y, W, y), fill=c + (255,), width=12)
    for x in (40, W - 60):
        d.rectangle((x, 1280, x + 20, 1560), fill=(200, 200, 210, 255))
    return im


# Ajouts du 13 nov. 2026 ----------------------------------------------------
@lru_cache(maxsize=None)
def machine_perso(expr="happy", mouth=0, spin=0):
    """Machine à laver générique avec un visage (quiz heures creuses, 13 nov. 2026).

    spin : angle (en degrés, multiple de 15) du linge dans le hublot.
    """
    p = P(440, 520)
    K = (24, 22, 40)
    p.r(10, 10, 430, 510, 40, K)
    p.r(22, 22, 418, 498, 32, (236, 240, 250))
    p.r(22, 22, 418, 120, 32, (206, 214, 232))
    p.r(40, 52, 200, 92, 12, (40, 50, 80))
    p.t((120, 72), "23:00", lambda k: mono(30 * k), GREEN)
    p.e(300, 72, 26, 26, K)
    p.e(300, 72, 18, 18, (150, 160, 190))
    p.e(370, 72, 14, 14, CYAN)
    # hublot
    p.e(220, 320, 150, 150, K)
    p.e(220, 320, 136, 136, (170, 180, 200))
    p.e(220, 320, 112, 112, (60, 140, 220))
    for k, col in enumerate(((255, 120, 150), YEL, GREEN)):
        a = math.radians(spin + k * 120)
        p.e(220 + 54 * math.cos(a), 320 + 54 * math.sin(a), 34, 26, col)
    p.arc(220, 320, 92, 92, 200, 250, (230, 240, 255), 10)
    # visage sur le bandeau du bas
    ey = 478
    if expr == "happy":
        p.arc(170, ey, 16, 12, 200, 340, K, 6)
        p.arc(270, ey, 16, 12, 200, 340, K, 6)
    else:
        p.e(170, ey - 4, 13, 14, WHITE)
        p.e(270, ey - 4, 13, 14, WHITE)
        p.e(170, ey - 2, 6, 7, K)
        p.e(270, ey - 2, 6, 7, K)
        p.arc(170, ey - 4, 14, 15, 0, 360, K, 3)
        p.arc(270, ey - 4, 14, 15, 0, 360, K, 3)
    if mouth or expr == "panic":
        p.e(220, 486, 16, 10, (130, 30, 50))
    else:
        p.arc(220, 478, 16, 10, 20, 160, K, 5)
    return p.out()


@lru_cache(maxsize=None)
def horloge(h, m=0, col=CYAN, size=360):
    """Horloge murale plate, aiguilles à l'heure donnée."""
    p = P(size, size)
    K = (20, 18, 36)
    c = size / 2
    p.e(c, c, c - 4, c - 4, K)
    p.e(c, c, c - 18, c - 18, col)
    p.e(c, c, c - 34, c - 34, (246, 246, 252))
    for k in range(12):
        a = math.radians(k * 30)
        r0, r1 = c - 52, c - (70 if k % 3 else 84)
        p.l([(c + r0 * math.sin(a), c - r0 * math.cos(a)), (c + r1 * math.sin(a), c - r1 * math.cos(a))], K,
            8 if k % 3 == 0 else 4)
    ah = math.radians((h % 12) * 30 + m * 0.5)
    am = math.radians(m * 6)
    p.l([(c, c), (c + (c * 0.42) * math.sin(ah), c - (c * 0.42) * math.cos(ah))], K, 14)
    p.l([(c, c), (c + (c * 0.62) * math.sin(am), c - (c * 0.62) * math.cos(am))], K, 9)
    p.e(c, c, 14, 14, RED)
    return p.out()


@lru_cache(maxsize=None)
def bg_laverie():
    """Buanderie plate : carrelage bleu nuit, étagère, sol (13 nov. 2026)."""
    im = Image.fromarray(grad((18, 30, 72), (34, 60, 120), 0, 1600))
    d = ImageDraw.Draw(im, "RGBA")
    for y in range(0, 1600, 120):
        d.line((0, y, W, y), fill=(255, 255, 255, 22), width=3)
    for x in range(0, W, 120):
        d.line((x, 0, x, 1600), fill=(255, 255, 255, 22), width=3)
    d.rectangle((0, 1600, W, H), fill=(26, 34, 60, 255))
    d.rectangle((0, 1600, W, 1616), fill=(80, 110, 190, 255))
    return im


def hud_budget(img, reste, jours, y=150, flash=0.0, delta=None):
    """Widget BudgetLoyer « Il te reste » + repère par jour jusqu'à la paie (série Survie)."""
    b, g = glow_box(940, 190, 26, (14, 20, 30), (28, 90, 74), 22)
    paste(img, b, 70 - g, y - g)
    d = ImageDraw.Draw(img)
    paste(img, logo(54), 100, y + 22)
    d.text((168, y + 49), "Il te reste", font=inter(34, "Medium"), fill=(170, 182, 190), anchor="lm")
    col = RED if flash > 0 and delta and delta < 0 else GREEN
    txt = f"{reste:.2f}".replace(".", ",") + f"{NB}€"
    d.text((100, y + 140), txt, font=inter(78, "Black"), fill=col, anchor="lm")
    d.text((980, y + 49), f"Paie dans {jours}{NB}j", font=inter(34, "Bold"), fill=WHITE, anchor="rm")
    per = reste / max(1, jours)
    d.text((980, y + 106), "Repère / jour", font=inter(30, "Medium"), fill=(170, 182, 190), anchor="rm")
    d.text((980, y + 150), f"{per:.2f}".replace(".", ",") + f"{NB}€", font=inter(48, "Black"),
           fill=YEL if per < 4 else WHITE, anchor="rm")
    if delta and flash > 0:
        s = f"{delta:+.2f}".replace(".", ",") + f"{NB}€"
        d.text((430, y + 118 - 30 * (1 - flash)), s, font=inter(50, "Black"),
               fill=RED if delta < 0 else GREEN, anchor="lm")
