#!/usr/bin/env python3
"""beats_fr.py : minute un script de voix française en feuille de rythme (beats.py, MIT).

Une ligne = un temps. Signale une accroche de plus de 3 s, un temps de plus de 4 s,
trois temps de suite sans rien de concret, et l'absence de boucle avec la première ligne.
Débit par défaut : 175 mots par minute (mots comptés avec les élisions coupées).

Usage
  python3 beats_fr.py script.txt --target 25
  python3 beats_fr.py script.txt --wpm 190
"""
import sys

import fr_common as F

B = F.load_original("ig-reel", "beats")
B.WORD_RE = F.WORD_RE
B.CONCRETE_RE = F.CONCRETE_RE
B.STOPWORDS = F.STOPWORDS

if __name__ == "__main__":
    if "--wpm" not in sys.argv:
        sys.argv += ["--wpm", "175"]
    B.main()
