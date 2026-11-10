"""Vocabulaire français partagé par les outils adaptés d'instagram-agent-skill (MIT)."""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(HERE, "..", "instagram-agent-skill", "skills")


def load_original(folder, module):
    """Importe un script d'origine (ig-reel/hookscore.py…) pour en remplacer les constantes."""
    path = os.path.join(ORIG, folder)
    if path not in sys.path:
        sys.path.insert(0, path)
    return __import__(module)


LETTERS = "A-Za-zÀ-ÖØ-öø-ÿŒœÆæ"
# L'apostrophe coupe les élisions : « l'erreur » donne « l » et « erreur ».
WORD_RE = re.compile(rf"[{LETTERS}0-9$€%-]+")
PROPER_RE = re.compile(r"(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b")
NUMBER_RE = re.compile(
    r"\d[\d  ]*(?:[.,]\d+)?\s?(?:€|euros?\b|%|k\b|h\b|heures?\b|min\b|minutes?\b"
    r"|jours?\b|semaines?\b|mois\b|ans?\b|fois\b)?",
    re.IGNORECASE)

SPOKEN_NUMBERS = {
    "zéro", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
    "onze", "douze", "quinze", "vingt", "trente", "quarante", "cinquante", "soixante",
    "cent", "cents", "mille", "million", "millions", "milliard", "moitié", "double",
    "triple", "dizaine", "centaine", "quart",
}
MONEY_WORDS = {
    "euro", "euros", "balles", "salaire", "loyer", "découvert", "smic", "paie", "paye",
    "agios", "frais", "dette", "dettes", "crédit", "épargne", "prélèvement", "abonnement",
    "abonnements", "facture", "factures", "budget", "argent", "compte", "banque",
}
STAKES = {
    "arrête", "arrêtez", "stop", "jamais", "faux", "erreur", "erreurs", "perdu", "perdre",
    "perds", "perte", "coûte", "coûté", "cher", "fauché", "fauchée", "ruiné", "raté",
    "échec", "rien", "personne", "pas", "plus", "interdit", "interdite", "illégal", "pire",
    "déteste", "gaspillé", "gaspiller", "arnaque", "mensonge", "menti", "vérité", "secret",
    "caché", "volé", "avant", "mais", "sauf", "problème", "risque", "danger", "attention",
    "regret", "dois", "devrais", "encore", "déjà", "seulement", "sans", "contre", "vraiment",
    "gratuit", "payé", "payer", "viré", "supprimé", "remplacé", "économisé", "rouge", "vide",
    "fin", "piège", "change", "changent", "vrai", "dernier", "dernière", "craques", "craque",
}
WEAK_OPENERS = [
    "alors", "bon", "ok", "okay", "salut", "coucou", "hello", "hey", "bonjour", "bienvenue",
    "aujourd", "donc", "en fait", "voilà", "écoute", "écoutez", "euh", "juste", "je voulais",
    "je vais", "on va", "dans cette", "dans la", "il y", "c est", "est ce", "vous savez",
    "tu sais", "quand on", "petit", "petite", "allez",
]
IMPERATIVES = {
    "arrête", "arrêtez", "vole", "volez", "copie", "supprime", "essaie", "essayez", "regarde",
    "regardez", "lis", "enregistre", "utilise", "fais", "faites", "écris", "envoie", "prends",
    "commence", "quitte", "jamais", "toujours", "mets", "lance", "vérifie", "note", "garde",
    "évite", "compte", "imagine", "devine",
}
STOPWORDS = {
    "le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "et", "ou", "mais", "si",
    "à", "a", "au", "aux", "en", "dans", "sur", "pour", "par", "avec", "que", "qu", "qui",
    "ce", "cet", "cette", "ces", "c", "est", "sont", "était", "être", "ça", "il", "elle",
    "on", "nous", "vous", "tu", "te", "t", "toi", "ton", "ta", "tes", "je", "j", "me", "m",
    "moi", "mon", "ma", "mes", "ils", "elles", "leur", "leurs", "se", "s", "son", "sa",
    "ses", "ne", "n", "pas", "plus", "y", "fait", "faire", "as", "ai", "avez", "ont",
}


# Concret = un chiffre, un €, un nom propre, ou un nombre dit en lettres (« huit heures douze »).
CONCRETE_RE = re.compile(
    r"\d|€|(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b|(?i:\b(?:" + "|".join(
        sorted(SPOKEN_NUMBERS | {"midi", "minuit", "euro", "euros"}, key=len, reverse=True)) + r")\b)",
    re.MULTILINE)
