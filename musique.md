# Musique : registre et évolution

Consigne du propriétaire (12 nov. 2026) : **les musiques doivent varier, et s'améliorer de vidéo en vidéo.**
Le moteur est `musique.py` (classe `Track`). La règle audio douce du PLAYBOOK s'applique toujours.

## Règles
1. **Varier** : chaque vidéo prend un style absent des 6 dernières lignes du registre, et une tonalité absente des 4 dernières. Lancer `python3 musique.py next 2` pour obtenir deux réglages (style, tonalité, tempo, graine), puis choisir celui dont l'ambiance colle au sujet (quiz → `jeu_tele` ou `chiptune_doux`, cliffhanger → `suspense`, coloc ou tranche de vie → `lofi` ou `bossa`, etc.). Jamais deux fois la même graine.
2. **Coller au montage** : passer `cuts` à `Track`, `compose(layers_at=…, break_at=…, end_at=<moment du jingle>)` pour que la 2e couche entre au milieu, que la batterie respire avant la carte de fin et que la musique se résolve sur la tonique au logo. Utiliser `tick`, `reveal`, `pop`, `whoosh` (accordés à la tonalité) au lieu de notes codées en do.
3. **Améliorer** : au moins une amélioration du moteur par semaine (nouveau style, nouvel instrument, meilleure mélodie, meilleur mixage), notée dans « Versions » ci-dessous avec son numéro. Ne jamais casser les épisodes existants : ajouter, ne pas supprimer.
4. **Mesurer** : à chaque analyse, reporter dans la colonne « Résultat » la durée moyenne vue Instagram et les vues TikTok à 48 h, puis, une fois 3 vidéos par style, garder les styles au-dessus de la médiane et retravailler les autres.
5. **Vérifier** avant publication : `ffmpeg -af ebur128=peak=true` (≈ -20 LUFS, crête ≤ -3 dBFS, LRA ≤ 5 LU) ; écouter n'est pas possible ici, donc contrôler aussi la répartition spectrale (pas plus de 65 % de l'énergie sous 150 Hz : les haut-parleurs de téléphone ne la rendent pas).
7. **Airs connus** (demande du propriétaire, 17 nov. 2026) : au moins une vidéo sur deux prend un air du domaine public avec `theme=` (`python3 musique.py themes`), pas le même air sur les 4 dernières lignes, noté « style + air » dans la colonne Style. Jamais de tube récent ni de chanson sous droits.
6. Instagram avec son du catalogue : export `_ig` avec `music=False` (bruitages et jingle seuls), comme avant.

## Versions du moteur
- **v1** (9-12 nov. 2026) : `chords_music` / `SoftMix` de `bl.py`. Accords plaqués en sinus, kick, petit arpège triangle. Même son pour toutes les vidéos, seuls le tempo et la grille changeaient. Gardé pour les anciens épisodes.
- **v2.0** (12 nov. 2026) : `musique.py`. 8 styles (lofi, jeu_tele, synthwave, bossa, swing, chiptune_doux, house_light, suspense), instruments synthétisés doux (piano électrique FM, guitare Karplus-Strong, marimba, vibraphone, triangle, nappe, basse ronde, balais, claps, shaker), swing, mélodie composée par motifs (AABA'), contre-chant en 2e couche, respiration et résolution finales, stéréo, réverbération, compression douce, bruitages accordés, jingle inchangé avec la musique effacée dessous. Démo : 12 s par style (`python3 musique.py demo`).
- **v2.1** (17 nov. 2026) : `Track.fill(at, beats)` : petit roulement doux (balais + toms ronds descendants) qui finit pile sur un changement de plan. Fait partie de la musique (absent des exports `_ig`). Première utilisation : vidéos du 17 nov.
- **v2.2** (17 nov. 2026) : airs connus du domaine public (`THEMES` : roi_montagne, marche_turque, ode_joie, vive_le_vent, frere_jacques), joués par l'instrument principal du style avec un contre-chant à la tierce, sur leurs propres accords ; `python3 musique.py themes` et `demo_themes`. Les musiques sans thème ne changent pas.
- **v3.0** (18 nov. 2026, accord du propriétaire : « les musiques peuvent être des vraies musiques ») : `Track(..., sf2=True)` joue la même partition (styles, airs connus, fills, batterie) avec de vrais instruments échantillonnés via FluidSynth et la banque GeneralUser GS (paquet npm `generaluser`, licence libre y compris commerciale pour créer de la musique) : piano, piano électrique, guitares, marimba, vibraphone, cordes, pizzicati, clarinette, basses, kits de batterie standard et balais. Correspondance instrument → General MIDI dans `GM_DEFAULT` et la clé `gm` de chaque style ; jamais de lead carré (règle douce). Deux styles ajoutés : `pop_piano` (piano, guitare, cordes, batterie) et `pizzicato` (pizzicati, clarinette, cordes). Les épisodes existants (`sf2` absent) sonnent exactement comme avant (vérifié par empreinte du son). Premier usage : test Remotion du compteur €/heure (18 nov.).
- Pistes pour les prochaines versions : variations de batterie (fills, faites en v2.1) aux changements de plan, accords de passage, thème mélodique propre à chaque série (thermostat, Carte contre Billet) repris d'un épisode à l'autre, intro « signature » de 1 s.

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
| 2026-11-13 | Heures creuses quiz (+ Trial Reel) | jeu_tele | Bb | 114 | 8945 | v2.0 | TikTok 755 vues, Instagram 4,0 s vues |
| 2026-11-13 | Survie fin de mois p1 | suspense | E | 96 | 1313 | v2.0 | TikTok 817 vues, Instagram 10,2 s vues |
| 2026-11-14 | Courses attente vs réalité | chiptune_doux | D | 122 | 9485 | v2.0 | TikTok 728 vues, Instagram 4,8 s vues |
| 2026-11-14 | Survie fin de mois p2 | synthwave | F | 100 | 2206 | v2.0 | TikTok 745 vues, Instagram 6,9 s vues |
| 2026-11-15 | Raclette devine qui | house_light | C | 120 | 6495 | v2.0 | TikTok 773 vues (~35 h), Instagram 6,3 s vues |
| 2026-11-15 | Classement phrases avant de craquer | lofi | A | 86 | 6370 | v2.0 | TikTok 688 vues (~27 h), Instagram 6,1 s vues |
| 2026-11-16 | Survie premier appart é1 | swing | G | 140 | 1794 | v2.0 | à mesurer |
| 2026-11-16 | 3 phrases pour refuser une sortie | bossa | Bb | 128 | 4514 | v2.0 | à mesurer |
| 2026-11-17 | Survie premier appart é2 | suspense | D | 97 | 9993 | v2.1 | à mesurer |
| 2026-11-17 | Échelle de panique de ton compte | jeu_tele | Eb | 109 | 9803 | v2.1 | à mesurer |
| 2026-11-18 | Compteur €/heure (GTA 6) | synthwave + marche_turque | C | 102 | 4681 | v2.2 | à mesurer |
| 2026-11-18 | Salaire loading | chiptune_doux + frere_jacques | F | 119 | 2832 | v2.2 | à mesurer |
| 2026-11-19 | Survie à deux é1 | pop_piano | E | 107 | 7706 | v3.0 (sf2) | à mesurer |
| 2026-11-19 | Calendrier des pompiers | pizzicato + vive_le_vent | G | 106 | 5006 | v3.0 (sf2) | à mesurer |
| 2026-11-20 | Survie à deux é2 | bossa | D | 124 | 6724 | v3.0 (sf2) | à mesurer |
| 2026-11-20 | Secret Santa, le tirage | swing + roi_montagne | A | 139 | 6204 | v3.0 (sf2) | à mesurer |
| 2026-11-21 | Marché de Noël, devine le total | lofi | Eb | 92 | 6267 | v3.0 (sf2) | à mesurer |
| 2026-11-21 | Samedi soir, je sors pas | house_light + marche_turque | Bb | 123 | 3845 | v3.0 (sf2) | à mesurer |
| 2026-11-22 | Défi des 5 dimanches | chiptune_doux + ode_joie | E | 122 | 3837 | v3.0 (sf2) | à mesurer |
| 2026-11-22 | L'addition arrive | synthwave | F | 105 | 8952 | v3.0 (sf2) | à mesurer |
