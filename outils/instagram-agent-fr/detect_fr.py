#!/usr/bin/env python3
"""detect_fr.py : panneau de 5 vérifications sur un texte français (detect.py, MIT, adapté).

Rythme des phrases, précision (chiffres, €, noms), densité de tournures creuses
(slop_fr.json), empreinte (caractères invisibles et tiret cadratin seulement : « »,
’ et … sont normaux en français), et voix (oralité, tutoiement, structures).
Heuristiques locales : ce n'est pas un détecteur d'IA du commerce.

Usage
  python3 detect_fr.py texte.txt
  python3 detect_fr.py avant.txt apres.txt
"""
import os
import re
import unicodedata

import fr_common as F

D = F.load_original("ig-human", "detect")
D.LEX = os.path.join(F.HERE, "slop_fr.json")
D.WORD_RE = re.compile(rf"[{F.LETTERS}']+")
D.NUMBERS = re.compile(r"\b\d[\d  ,.]*\s?(?:%|€)?|€")
D.PROPER = re.compile(r"(?<![.!?]\s)(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b", re.MULTILINE)
# Marques d'oral en français : élisions familières et mots du langage parlé.
D.CONTRACTIONS = re.compile(
    r"(?i)\b(?:t'(?:es|as|étais|inquiète)|j'(?:suis|sais)|y'a|chuis|ouais|bah|genre|grave|"
    r"trop|franchement|du coup|en vrai|t'façon|ça)\b")
D.PRONOUNS = re.compile(r"(?i)\b(?:je|j|moi|mon|ma|mes|on|nous|notre|tu|toi|ton|ta|tes|te|t|vous|votre|vos)\b")


def check_fingerprint(text):
    """Caractères qu'un clavier de téléphone ne produit pas, hors typographie française."""
    invisible = sum(1 for c in text if unicodedata.category(c) == "Cf")
    em = text.count("—")
    total = invisible * 4 + em * 2
    per1k = total * 1000 / max(len(text), 1)
    score = D.scale(per1k, human=0.0, machine=12.0)
    return score, f"{invisible} invisible(s), {em} tiret(s) cadratin(s)"


D.check_fingerprint = check_fingerprint

if __name__ == "__main__":
    D.main()
