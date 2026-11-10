#!/usr/bin/env python3
"""hookscore_fr.py : note une accroche française sur les 5 propriétés de hookscore.py.

Même logique et même sortie que l'original (instagram-agent-skill, MIT), avec un
vocabulaire français : mots accentués, nombres dits en lettres, mots d'enjeu,
débuts mous, impératifs, tutoiement et vouvoiement.

Ce n'est pas un prédicteur de vues : il repère les accroches faibles (salutation,
préambule, rien de concret, trop long), il ne départage pas deux bonnes accroches.

Usage
  python3 hookscore_fr.py accroches.txt          # une accroche par ligne, classées
  python3 hookscore_fr.py --hook "Le 20 novembre, ton découvert change."
"""
import re

import fr_common as F

H = F.load_original("ig-reel", "hookscore")

H.WORD_RE = F.WORD_RE
H.NUMBER_RE = F.NUMBER_RE
H.PROPER_RE = F.PROPER_RE
H.SPOKEN_NUMBERS = F.SPOKEN_NUMBERS
H.MONEY_WORDS = F.MONEY_WORDS
H.STAKES = F.STAKES
H.WEAK_OPENERS = F.WEAK_OPENERS
H.IMPERATIVES = F.IMPERATIVES
H.DEALBREAKERS = [
    (re.compile(r"(?i)^\s*(?:arrête(?:z)? de scroller|ne scrolle(?:z)? pas|stop au scroll)"),
     "Commence par « arrête de scroller ». Demander l'attention prouve qu'on ne l'a pas méritée."),
    (re.compile(r"(?i)\b(?:dans (?:cette|la) vidéo|aujourd'?hui (?:je vais|on va)|je vais (?:vous|te) montrer)\b"),
     "Préambule de vidéo. Le supprimer et commencer par la réponse."),
    (re.compile(r"(?i)^\s*(?:salut|coucou|bonjour|hello|hey|bienvenue)\b"),
     "Salutation. Personne n'est venu dans le fil pour être salué."),
    (H.HASHTAG_RE, "Hashtag dans l'accroche. Les hashtags vont en bas de la description."),
    (H.EMOJI_RE, "Emoji dans l'accroche. À taille d'accroche, il y a la place pour des mots ou pour un emoji, pas les deux."),
]

_LENGTH = H.check_length


def check_length(text):
    """Le français a plus de petits mots que l'anglais : fenêtre de 5 à 14 mots."""
    w = H.words(text)
    n = len(w)
    secs = n / 2.9
    chars = len(text.strip())
    if 5 <= n <= 14:
        score = 100.0
    elif n < 5:
        score = H.clamp(100 - (5 - n) * 20)
    else:
        score = H.clamp(100 - (n - 14) * 10)
    if chars > 70:
        score -= 12
    return H.clamp(score), f"{n} mots, {chars} caractères, ~{secs:.1f} s à l'oral (viser 5 à 14 mots)"


def check_address(text):
    """Adressé à une personne, ou dans le vide."""
    low = text.lower()
    w = [x.lower() for x in H.words(text)]
    if re.search(r"\b(?:tu|toi|ton|ta|tes|te|t|vous|votre|vos)\b", low.replace("’", "'").replace("'", " ")):
        return 100.0, "parle au spectateur"
    if w and w[0] in H.IMPERATIVES:
        return 90.0, f"commence par un impératif (« {w[0]} »)"
    if re.search(r"\b(?:je|j|moi|mon|ma|mes|on|nous|notre|nos)\b", low.replace("'", " ")):
        return 70.0, "première personne, spectateur non nommé"
    return 35.0, "troisième personne, personne dans la pièce"


H.check_length = check_length
H.check_address = check_address

if __name__ == "__main__":
    H.main()
