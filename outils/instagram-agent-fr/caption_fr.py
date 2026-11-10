#!/usr/bin/env python3
"""caption_fr.py : vérifie une description BudgetLoyer (caption.py, MIT, adapté).

Montre les ~125 premiers caractères visibles avant « … plus » sur Instagram, compte
les hashtags (5 maximum), cherche les mots-clés, les liens morts et les appels à
l'action français. Adapté au format du compte : #fyp, #shorts et #reels en dernier
hashtag ne sont pas des erreurs, ni « (lien en bio) », ni une description sur une
seule ligne qui dépasse la fenêtre visible.

Usage
  python3 caption_fr.py description.txt --keywords "découvert bancaire,budget"
"""
import re

import fr_common as F

C = F.load_original("ig-caption", "caption")

C.CONCRETE_RE = F.CONCRETE_RE
C.FILLER_TAGS = {"#viral", "#explore", "#explorepage", "#foryou", "#foryoupage", "#pourtoi",
                 "#trending", "#instagood", "#love", "#follow", "#like4like", "#viralreels",
                 "#instadaily", "#tiktokfrance"}
C.ASKS = [
    (re.compile(r"(?i)\bcommente (?:le mot |\")?[A-Z0-9]{2,}\b"), "commenter un mot-clé"),
    (re.compile(r"(?i)\b(?:écris|envoie)-moi\b|\ben (?:dm|mp)\b"), "écrire en privé"),
    (re.compile(r"(?i)\benregistre(?:-la|-le| cette| ce)?\b"), "enregistrer"),
    (re.compile(r"(?i)\b(?:envoie|partage)(?:-la|-le)? (?:ça |cette vidéo |à )"), "envoyer à quelqu'un"),
    (re.compile(r"(?i)\babonne-toi\b|\bsuis-moi\b"), "s'abonner"),
    (re.compile(r"(?i)\b(?:découvre|essaie|teste|rendez-vous sur|passe à l'action sur)\b[^.!?]{0,40}budgetloyer\.com"),
     "aller sur le site"),
    (re.compile(r"(?i)\b(?:dis-le|dis-moi|réponds?)\b[^.!?]{0,30}\bcommentaire|\bt'es (?:plutôt )?(?:team|lequel|laquelle)\b|\bet toi\b"),
     "répondre en commentaire"),
]

_analyse = C.analyse


def analyse(text, cut=C.TRUNCATE, keywords=None):
    a = _analyse(text, cut, keywords)
    for c in a["checks"]:
        # Le format du compte tient sur une ligne : seul compte ce qui est visible avant la coupe.
        if c["check"] == "FIRST LINE" and c["status"] == "WARN":
            c["status"], c["detail"] = "PASS", (
                f"description sur une ligne, coupée à {cut} : vérifier que la fenêtre ci-dessus accroche")
        # « (lien en bio) » et « BudgetLoyer.com » sont voulus par le PLAYBOOK.
        if c["check"] == "LINKS" and c["status"] == "WARN" and all(
                "budgetloyer" in l.lower() for l in a["links"]):
            c["status"], c["detail"] = "PASS", "seul lien : BudgetLoyer.com, voulu par le PLAYBOOK"
        if c["check"] == "ONE ASK" and c["status"] == "WARN" and len(a["asks"]) == 2 \
                and "aller sur le site" in a["asks"]:
            c["status"], c["detail"] = "PASS", "une question + le renvoi vers le site, format du compte"
    fails = sum(1 for c in a["checks"] if c["status"] == "FAIL")
    warns = sum(1 for c in a["checks"] if c["status"] == "WARN")
    a["verdict"] = "FIX" if fails else ("REVIEW" if warns else "READY")
    return a


C.analyse = analyse

if __name__ == "__main__":
    C.main()
