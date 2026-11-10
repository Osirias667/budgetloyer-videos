# instagram-agent-fr

Version française des outils d'[instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) (MIT, Jake Schincariol), adaptée à BudgetLoyer le 10 novembre 2026. L'original reste intact dans `../instagram-agent-skill/`. Chaque script français importe le script d'origine et ne remplace que le vocabulaire et quelques règles : la logique et les sorties sont les mêmes, et les messages de sortie restent en anglais.

| Fichier | Rôle | Adaptation |
|---|---|---|
| `hooks_fr.json` | 26 formules d'accroche | Traduites, exemples BudgetLoyer, regex françaises (chaque exemple est reconnu par sa formule) |
| `hookscore_fr.py` | Note une accroche sur 5 propriétés | Mots accentués, nombres en lettres, mots d'enjeu, débuts mous (« salut », « dans cette vidéo »…), tutoiement et vouvoiement, fenêtre de 5 à 14 mots |
| `beats_fr.py` | Minute un script de voix | Mots accentués, mots vides français, nombres en lettres comptés comme concrets, 175 mots par minute par défaut |
| `caption_fr.py` | Vérifie une description | Appels à l'action français, et le format du compte (`#fyp`/`#shorts`/`#reels`, « (lien en bio) », une seule ligne) n'est plus signalé comme une erreur |
| `slop_fr.json`, `humanize_fr.py`, `detect_fr.py` | Retire et repère les tournures creuses | Lexique français (70 mots, 50 expressions, 14 structures). Guillemets « », ’, … et espaces insécables gardés. Espace fine avant `! ? ;` |

## Usage

```bash
python3 hookscore_fr.py accroches.txt                       # une accroche par ligne
python3 beats_fr.py script.txt --target 25                  # voix off
python3 caption_fr.py description.txt --keywords "découvert bancaire"
python3 humanize_fr.py brouillon.txt -o propre.txt --report
python3 detect_fr.py brouillon.txt propre.txt
python3 ../instagram-agent-skill/skills/ig-viral/swipe.py releve.tsv --hooks hooks_fr.json
```

## Ce qui a été vérifié

- Sur 10 accroches de test, les 4 accroches volontairement mauvaises (salutation, préambule, phrase vague) finissent en bas, sous 33/100. Les accroches du compte finissent entre 55 et 87.
- Sur les 10 premières lignes de description déjà publiées, le score ne suit pas les vues TikTok (corrélation de rang d'environ -0,3, avec des vues toutes entre 237 et 366). Comme l'auteur l'avait mesuré sur l'original, l'outil repère les accroches faibles mais ne désigne pas les gagnantes. Ne jamais bloquer une publication sur un score.
