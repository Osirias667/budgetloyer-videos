#!/usr/bin/env python3
"""humanize_fr.py : retire d'un texte français les tournures creuses et caractères invisibles.

Adapté de humanize.py (instagram-agent-skill, MIT) avec slop_fr.json. Garde la
typographie française (« », ’, …, espaces insécables). Les structures (trio rythmé,
« ce n'est pas juste X, c'est Y »…) sont signalées, jamais réécrites automatiquement.

Usage
  python3 humanize_fr.py brouillon.txt --report
  python3 humanize_fr.py brouillon.txt -o propre.txt
"""
import os
import re

import fr_common as F

H = F.load_original("ig-human", "humanize")
H.LEX = os.path.join(F.HERE, "slop_fr.json")
H.SENT_RE = re.compile(r"[^.!?\n]+[.!?]*")

_restore = H.restore_capitals


def restore_capitals(original, text):
    """Même règle que l'original, avec les majuscules accentuées."""
    starts = re.findall(r"(?:^|[.!?]\s+|\n)\s*([A-Za-zÀ-ÖØ-öø-ÿ])", original)
    if not starts or sum(1 for c in starts if c.isupper()) * 2 < len(starts):
        return text
    return re.sub(r"(?:^|(?<=[.!?] )|(?<=[.!?]\n)|(?<=\n))\s*([a-zà-öø-ÿ])",
                  lambda m: m.group(0)[:-1] + m.group(1).upper(), text)


H.restore_capitals = restore_capitals

_lexical = H.pass_lexical


def pass_lexical(text, lex):
    """Nettoyage d'origine, puis ponctuation française : « mot. , suite » et espace avant ! ? ;"""
    text, hits = _lexical(text, lex)
    text = re.sub(r"([.!?])\s*,\s*", r"\1 ", text)
    text = re.sub(r"(?<=[A-Za-zÀ-ÖØ-öø-ÿ»)0-9€%])[ \u00a0\u202f]*([!?;])", lambda m: "\u202f" + m.group(1), text)
    text = re.sub(r"(?<=[A-Za-zÀ-ÖØ-öø-ÿ»)])[ \u00a0\u202f]*:(?=\s)", "\u00a0:", text)
    return text, hits


H.pass_lexical = pass_lexical

if __name__ == "__main__":
    H.main()
