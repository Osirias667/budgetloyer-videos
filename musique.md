# Musique : registre et évolution

Consigne du propriétaire (12 nov. 2026) : **les musiques doivent varier, et s'améliorer de vidéo en vidéo.**
Le moteur est `musique.py` (classe `Track`). La règle audio douce du PLAYBOOK s'applique toujours.

## Règles
1. **Varier** : chaque vidéo prend un style absent des 6 dernières lignes du registre, et une tonalité absente des 4 dernières. Lancer `python3 musique.py next 2` pour obtenir deux réglages (style, tonalité, tempo, graine), puis choisir celui dont l'ambiance colle au sujet (quiz → `jeu_tele` ou `chiptune_doux`, cliffhanger → `suspense`, coloc ou tranche de vie → `lofi` ou `bossa`, etc.). Jamais deux fois la même graine.
2. **Coller au montage** : passer `cuts` à `Track`, `compose(layers_at=…, break_at=…, end_at=<moment du jingle>)` pour que la 2e couche entre au milieu, que la batterie respire avant la carte de fin et que la musique se résolve sur la tonique au logo. Utiliser `tick`, `reveal`, `pop`, `whoosh` (accordés à la tonalité) au lieu de notes codées en do.
3. **Améliorer** : au moins une amélioration du moteur par semaine (nouveau style, nouvel instrument, meilleure mélodie, meilleur mixage), notée dans « Versions » ci-dessous avec son numéro. Ne jamais casser les épisodes existants : ajouter, ne pas supprimer.
4. **Mesurer** : à chaque analyse, reporter dans la colonne « Résultat » la durée moyenne vue Instagram et les vues TikTok à 48 h, puis, une fois 3 vidéos par style, garder les styles au-dessus de la médiane et retravailler les autres.
5. **Vérifier** avant publication : `ffmpeg -af ebur128=peak=true` (≈ -20 LUFS, crête ≤ -3 dBFS, LRA ≤ 5 LU) ; écouter n'est pas possible ici, donc contrôler aussi la répartition spectrale (pas plus de 65 % de l'énergie sous 150 Hz : les haut-parleurs de téléphone ne la rendent pas).
6. Instagram avec son du catalogue : export `_ig` avec `music=False` (bruitages et jingle seuls), comme avant.

## Versions du moteur
- **v1** (9-12 nov. 2026) : `chords_music` / `SoftMix` de `bl.py`. Accords plaqués en sinus, kick, petit arpège triangle. Même son pour toutes les vidéos, seuls le tempo et la grille changeaient. Gardé pour les anciens épisodes.
- **v2.0** (12 nov. 2026) : `musique.py`. 8 styles (lofi, jeu_tele, synthwave, bossa, swing, chiptune_doux, house_light, suspense), instruments synthétisés doux (piano électrique FM, guitare Karplus-Strong, marimba, vibraphone, triangle, nappe, basse ronde, balais, claps, shaker), swing, mélodie composée par motifs (AABA'), contre-chant en 2e couche, respiration et résolution finales, stéréo, réverbération, compression douce, bruitages accordés, jingle inchangé avec la musique effacée dessous. Démo : 12 s par style (`python3 musique.py demo`).
- Pistes pour les prochaines versions : variations de batterie (fills) aux changements de plan, accords de passage, thème mélodique propre à chaque série (thermostat, Carte contre Billet) repris d'un épisode à l'autre, intro « signature » de 1 s.

## Registre
| Date | Vidéo | Style | Tonalité | BPM | Graine | Moteur | Résultat |
|---|---|---|---|---|---|---|---|
| 2026-11-09 | Noël tuto | v1 accords doux | C | 112 | - | v1 | TikTok 255 vues |
| 2026-11-09 | Black Friday sketch | v1 chiptune carré (jugé agressif) | A | 150 | - | v1 | TikTok 260 vues |
| 2026-11-10 | Défi 0 € | v1 accords plaqués | - | - | - | v1 | TikTok 738 vues |
| 2026-11-10 | Vrai ou faux découvert | v1 accords plaqués | - | - | - | v1 | TikTok 780 vues |
| 2026-11-11 | Devine le prix | v1 accords plaqués | C | 116 | - | v1 | TikTok 536 vues (11 h), Instagram en son du catalogue |
| 2026-11-11 | Thermostat partie 1 | v1 accords plaqués | G | 104 | - | v1 | à mesurer |
| 2026-11-12 | Carte ou billet | v1 accords plaqués | A | 120 | - | v1 | à mesurer (Instagram en son du catalogue) |
| 2026-11-12 | Thermostat partie 2 | v1 accords plaqués | G | 104 | - | v1 | à mesurer |
