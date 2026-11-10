# BudgetLoyer : règles de production vidéo

Objectif : 2 vidéos originales par jour, le plus de vues possible sur TikTok, YouTube Shorts et Instagram Reels.

## Marque
- Site : BudgetLoyer.com. Application de gestion de budget personnel, sans tableur ni synchronisation bancaire.
- Slogans : « Ton budget, en plus léger. », « Ne finis plus le mois dans le flou. »
- Ton des vidéos : tutoiement, humour, situations du quotidien.

## Fonctionnalités citables (et seulement celles-ci)
- Vue d'ensemble du mois : revenus, dépenses, « Il te reste ce mois ».
- Saisie rapide des dépenses (date, catégorie, montant), recherche, filtrage.
- Repères de budget par catégorie, avec suggestions à partir des dépenses saisies.
- Alertes avant un dépassement de budget ou un découvert (confirmé par le propriétaire).
- Objectif d'épargne et suivi de progression.
- Prévisions : budget estimé contre solde déclaré, repère quotidien jusqu'au prochain revenu.
- Mode Foyer : frais communs partagés, membres invités sans abonnement.
- Bilan mensuel téléchargeable.
- Tarifs : 7 €/mois après 7 jours d'essai gratuit, Foyer 11,99 €/mois, sans engagement. Revérifier sur budgetloyer.com/pricing avant de citer un prix.
- Ne pas dire « synchronisation bancaire », « automatique » ou « temps réel ». Ne pas promettre d'économies chiffrées.

## Direction artistique
Format 1080x1920, 30 fps, 20 à 40 s, h264 + aac. `bl.py` contient le moteur, `videos.py` deux exemples complets.

**Carte blanche créative (décision du propriétaire).** Les seuls repères sont le site et la DA des comptes. Innover est attendu : nouveaux formats, concepts, personnages, rythmes, séries récurrentes, faux formats télé ou jeux, quiz, classements, pastiches génériques, cliffhangers, etc. La seule contrainte visuelle est de rester en animation, avec la palette, le logo et le ton BudgetLoyer reconnaissables. Tester au moins un format jamais vu par semaine, le noter dans `journal.md`, puis garder ce qui dépasse la médiane des vues. Étendre `bl.py` avec de nouveaux décors et personnages quand c'est utile.

Les règles de fiabilité ne bougent pas : fonctionnalités citables, faits sourcés, neutralité politique, pas de personnage protégé ni de personne réelle, descriptions, hashtags et réglages de publication.

Les deux familles déjà installées servent de base, pas de limite :
- **Sketch** : personnages plats (P1 à capuche et casque, boss monstres, colocs, etc.), décors colorés, étiquette de rôle + bandeau de dialogue néon avec texte tapé, scènes courtes, puis tableau de bord BudgetLoyer et carte de fin (logo vert, BudgetLoyer.com en jaune, confettis). Thèmes déjà utilisés : jeu vidéo, garde à vue, procès de coloc, vampire, zombie, boss de fin, ski, Gaston contre Rémi. En inventer de nouveaux.
- **Tuto** : fond sombre, gros texte blanc avec mots en vert #20E388, téléphone avec écrans de l'app, « Étape 1/2/3 », écran vert « Spoiler », fin « Lien en bio ».

**Audio (consigne du propriétaire, 10 nov. 2026) : jamais agressif.** Pas d'ondes carrées stridentes ni d'effets qui claquent : ondes douces (sinus, triangle), passe-bas vers 3,5 kHz, effets sonores discrets, aucun pic soudain. Viser environ -20 LUFS, crête maximale -3 dBFS, LRA de 5 LU au plus. Mesurer avant publication avec `ffmpeg -af ebur128=peak=true`. Utiliser `SoftMix` de `bl.py` : `tri`/`sn` pour la musique, `pop` à chaque texte ou objet qui apparaît, `whoosh` doux à chaque changement de plan, et `jingle` (signature sonore BudgetLoyer, toujours la même) au moment où le logo apparaît. `end` filtre et normalise.

**Voix** : les prises du propriétaire sont dans `voix/` (liste et consignes dans `voix/A_ENREGISTRER.md`). Les ajouter avec `SoftMix.voice`, qui baisse automatiquement la musique dessous. Quand des prises existent, chaque vidéo en utilise au moins une : la question finale ou la marque, et une réaction ou un mot de format si ça colle. Pour Monsieur Découvert, abaisser la prise d'environ 4 demi-tons (`asetrate`/`atempo` dans ffmpeg). Ne jamais utiliser de voix de synthèse réaliste : TikTok et YouTube imposeraient alors une mention IA.

**Image 1 en mouvement** : appeler `punch_in(img, t)` à la fin de la première scène, pour un léger zoom arrière pendant 0,6 s. L'accroche reste complète et lisible dès l'image 0.

Le texte doit être lisible dès la première image, avec une accroche forte. Garder le contenu entre y=150 et y=1500 et loin du bord droit (interface TikTok).

## Actualité
Partir de l'actualité budget, logement, conso ou culture populaire en France, datée de moins de 7 jours, ou d'un temps fort à venir.
- Tout chiffre ou fait vient d'une source consultée pendant la session. Citer l'étude dans la vidéo ou la légende. Noter la source dans `journal.md`.
- Montants de démonstration de l'app ou promos fictives : uniquement comme mise en scène, jamais présentés comme des données réelles.
- Rester neutre : pas de parti, de candidat, de gouvernement ni de mouvement social comme sujet ou cible.
- Ne jamais se moquer d'un drame, d'un décès ou d'une catastrophe.
- Pas de personne réelle, de marque tierce mise en cause, de personnage protégé, de logo tiers, ni de musique externe dans le fichier vidéo. Exception : la musique du catalogue Instagram, ajoutée par Instagram au moment de la publication (voir Publication). Citer une enseigne seulement si c'est nécessaire et factuel.

## Publication (Metricool, blogId 7967267, Europe/Paris)
Chaque vidéo part sur les trois réseaux, en trois posts séparés (6 posts par jour).

| Vidéo | TikTok | YouTube Shorts | Instagram Reels |
|---|---|---|---|
| Vidéo 1 | 10:00 | 10:00 | 10:00 |
| Vidéo 2 | 18:00 | 16:00 | 18:00 |

- Média : `https://raw.githubusercontent.com/Osirias667/budgetloyer-videos/videos/videos/AAAA-MM/fichier.mp4` (branche `videos`, pousser avant de programmer).
- `autoPublish: true`, `draft: false`.
- TikTok : `title` obligatoire, `commercialContentOwnBrand: true`, `isAigc: false` (consigne du propriétaire : ne plus afficher de mention IA, ni dans les réglages ni dans les descriptions), `privacyOption: PUBLIC_TO_EVERYONE`.
- YouTube : `type: short`, `privacy: public`, `madeForKids: false`, `title`, `tags`, `category: HOWTO_STYLE`. `isAiGeneratedContent: false`.
- Cette absence de mention vaut pour les animations clairement dessinées, seules vidéos autorisées ici. Ne jamais produire de scène ou de personne d'aspect réaliste : TikTok et YouTube exigent alors une mention.
- Instagram : `instagramData: {type: REEL, showReelOnFeed: true, isAiGenerated: false}`.
- Premier commentaire : `firstCommentText` porte la question finale de la vidéo sur les 3 réseaux, par exemple « Alors, tu as eu combien sur 4 ? 👇 Réponds en commentaire ! ». Une vraie question, jamais un faux témoignage.
- Couverture : en test depuis le 10 nov. sur TikTok uniquement, `videoCoverMilliseconds` sur l'image de l'accroche (environ 300). Ne pas l'étendre à YouTube ou Instagram avant d'avoir vérifié qu'il ne fait pas rejeter le post.
- Son du catalogue Instagram (accord du propriétaire, 10 nov. 2026) : sur Instagram seulement, `instagramData.audioConfiguration` avec `audioId` (un titre et un artiste précis, sinon la requête est refusée et renvoie les candidats), `audioVolume` 60 à 80 et `videoVolume` 100. La vidéo Instagram est alors un export `_ig` rendu avec `SoftMix(music=False)` : bruitages, jingle et voix gardés, sans notre musique, pour éviter deux mélodies superposées. Choisir un titre populaire en ce moment et dont l'ambiance colle à la vidéo, jamais de paroles qui contredisent le message. Cela ne marche que pour un compte professionnel relié à une page Facebook : si Metricool refuse, publier sans son du catalogue et le noter dans le journal.
- Carrousels photo TikTok (demande du propriétaire, 10 nov. 2026) : une fois par semaine au moins, en plus des 2 vidéos, sur un créneau libre (13:00 par défaut). 5 à 8 images JPG 1080x1920 dans `videos/AAAA-MM/<nom>/01.jpg…`, générées par un script `episodes/` qui importe `bl.py` (modèle : `episodes/2026-11-11_carrousel.py`). L'image 1 porte l'accroche complète et « Glisse ➜ ». La dernière image montre la marque et la question finale. Formats qui s'y prêtent : « t'es lequel ? », classements, vrai ou faux, avant/après. Réglages : TikTok seul, `tiktokData.autoAddMusic: true` (TikTok ajoute une musique tendance, impossible sur une vidéo), `photoCoverIndex: 0`, `title`, `firstCommentText` avec la question. Mêmes règles de description et de hashtags que les vidéos.
- Trial Reels : une fois par semaine, programmer en plus une variante d'accroche en `instagramData.type: TRIAL_REEL` (montrée d'abord aux non-abonnés), sur un créneau sans autre Reel. Noter dans le journal quelle accroche gagne.

## Descriptions (obligatoire : même style que les posts existants du compte)
Même texte sur TikTok, YouTube et Instagram. Tout sur une seule ligne, sans retours à la ligne, en tutoiement. Dans cet ordre :
0. Mots-clés : la première phrase et le texte de l'image 1 contiennent les mots que les gens tapent dans la recherche TikTok ou YouTube (« découvert bancaire », « budget étudiant », « colocation », « fin de mois »…).
1. Accroche avec un emoji au début et « … » : `🎿 Les vacances au ski approchent… mais ton budget, lui, est-il prêt à dévaler les pistes ? ❄️`
2. Une phrase de contexte liée au thème de la vidéo, qui finit par « ! » et un emoji.
3. `Avec BudgetLoyer, <verbe> :` puis 3 ou 4 bénéfices courts, chacun précédé d'un emoji, à l'impératif (🎯 📊 🚨 💰 📅 🏠).
4. Une chute drôle qui file la métaphore de la vidéo : `Parce que les seules choses qui devraient déraper au ski, ce sont tes skis, pas tes finances ! ⛷️`
5. `👉 Découvre BudgetLoyer.com (lien en bio).` Sur YouTube, retirer « (lien en bio) ». Le garder sur Instagram.
6. Exactement 5 hashtags, pas plus (TikTok est annoncé comme limité à 5 par publication depuis août 2025), minuscules sauf nom propre, sans accents, tous en rapport avec la vidéo, dans cet ordre :
   - 1 ou 2 sur le sujet précis de la vidéo, parmi les termes les plus utilisés pour ce sujet (`#BlackFriday`, `#noel`, `#colocation`, `#loyer`…).
   - 2 ou 3 très larges et en rapport : `#budget`, `#argent`, `#epargne`, `#humour` (sketch), `#finance`.
   - Le dernier est `#fyp` sur TikTok, `#shorts` sur YouTube, `#reels` sur Instagram.
   Ne jamais mettre un hashtag populaire sans lien avec la vidéo.

Exemple complet de référence :
`🚨 Votre salaire est en garde à vue… et il a beaucoup de choses à expliquer ! 1 800 € sur le compte au départ… mais entre le loyer, les factures et les dépenses du quotidien, où passe tout cet argent ? 🧐 Avec BudgetLoyer, fini les disparitions inexpliquées : 💸 Suis tes dépenses 📊 Visualise ce qu'il te reste vraiment 🚨 Anticipe les dépassements de budget 🎯 Garde le contrôle de ton épargne Ton salaire mérite mieux que de disparaître sans laisser de traces ! 🔍 👉 Passe à l'action sur BudgetLoyer.com (lien en bio). #salaire #budget #argent #humour #fyp`

Avant de programmer, relire aussi les 5 dernières descriptions du compte (métrique TKPO05) pour rester dans le ton.

## Amélioration continue
But : chaque semaine, faire mieux que la semaine précédente, en vues et en rétention. `apprentissage.md` est la mémoire du compte : le lire avant de créer, le mettre à jour après chaque analyse.

### Ce que les algorithmes récompensent (synthèse de guides 2026, à revérifier chaque mois)
Les plateformes ne publient pas leurs poids exacts : ce sont des repères, les stats du compte priment.
- **Partout** : test sur un petit public, puis diffusion élargie si les gens restent. Les 2 à 3 premières secondes décident.
- **TikTok** : durée de visionnage et taux de complétion d'abord, puis revisionnages, partages, enregistrements, commentaires.
- **Instagram Reels** : durée de visionnage, envois en message privé (surtout pour toucher des non-abonnés), likes par personne atteinte, originalité.
- **YouTube Shorts** : part de « regardé » contre « balayé », pourcentage regardé, boucles, satisfaction.

### Règles de création qui en découlent
1. **Image 1** : accroche complète et lisible dès la toute première image, jamais de texte encore vide. Pas d'intro, de logo ni de mise en place.
2. **Boucle ouverte** : poser une question ou un enjeu dans les 2 premières secondes, ne donner la réponse qu'à la fin.
3. **Rythme** : un changement visuel toutes les 1,5 à 3 secondes, aucun temps mort. Viser 20 à 35 s, plus long seulement si l'histoire le justifie.
4. **Fin qui boucle** : la dernière image ou phrase renvoie à la première pour donner envie de revoir. Carte de fin courte (2 s maximum), avec la marque présente plus tôt dans la vidéo.
5. **Envoyable** : chaque vidéo doit donner envie de l'envoyer à quelqu'un (« ton pote qui… », coloc, couple, salaire, fin de mois). C'est le critère principal pour choisir un sujet.
6. **Conversation** : terminer sur une vraie question ou un choix de camp qui appelle un commentaire.
7. **Texte animé** : texte à l'écran permanent et animé, car beaucoup regardent sans le son.
8. **Original** : pas de filigrane ni de réutilisation d'un montage déjà publié.
9. **Séries** : P1 et Monsieur Découvert sont des personnages récurrents. Au moins une fois par semaine, un épisode en plusieurs parties (« Partie 1/2 ») qui finit sur un vrai suspense, avec la suite publiée sous 48 h, et le numéro d'épisode visible dès l'image 1.
10. **Dates à venir** : suivre le calendrier de `apprentissage.md` et préparer la vidéo la veille ou le jour même.

Interdits : faux engagement, achats de vues, commentaires inventés, accroche trompeuse que la vidéo ne tient pas, fausse urgence présentée comme réelle. Une accroche forte doit rester vraie.

### Veille sur le viral
À chaque session, lire une ou deux sources récentes sur les formats courts qui marchent en France ou dans la finance personnelle (tendances du mois, analyses). Noter le mécanisme qui fonctionne (structure, rythme, type d'accroche) et l'adapter en animation BudgetLoyer. S'inspirer de mécanismes, jamais copier une vidéo, un scénario, un personnage ou un son précis.

### Outils « instagram-agent-skill » (installés le 10 nov. 2026, licence MIT, dans `outils/instagram-agent-skill/`)
Pistes utiles, à adapter : ils sont réglés pour l'anglais.
- `skills/ig-reel/hooks.json` : 26 formules d'accroche, avec leurs pièges. S'en servir pour proposer 3 accroches de formules différentes et garder la meilleure.
- `skills/ig-caption/caption.py description.txt --keywords "mot-clé"` : montre les ~125 premiers caractères visibles avant « … plus » sur Instagram, et vérifie les mots-clés. La 1re phrase de la description doit tenir et accrocher dans cette fenêtre.
- `skills/ig-carousel/SKILL.md` et `skills/ig-audit/SKILL.md` : bonnes pratiques de carrousel (numéroter les images, une image récapitulative à envoyer) et d'analyse (multiple de la médiane, partages par compte touché).
- À ne pas utiliser comme critère bloquant : `hookscore.py`, `beats.py`, `humanize.py` et `detect.py` reposent sur des listes de mots anglais et notent mal le français.
- En cas de conflit, le PLAYBOOK l'emporte : ces outils déconseillent `#fyp` et les listes à emojis, que le format de description du compte impose.

### Boucle d'analyse à chaque session
Stats des 14 derniers jours, sur chaque réseau :
- TikTok, connecteur posts : TKPO02, 05, 06, 07, 08, 09, 10, 13, 15, 16.
- Instagram, connecteur reels : IGRE02, 03, 11, 12, 21, 23, 24, 27, 28.
- YouTube, connecteur « videos published in range » : YTVP02, 17, 06, 08, 09, 11, 12.

Méthode :
- Chaque vidéo teste **une hypothèse** notée dans le journal (type d'accroche, durée, format, thème, fin en boucle).
- Ne juger une vidéo qu'après 48 h et un format qu'après au moins 3 vidéos. Comparer à la médiane du même réseau.
- Dans `apprentissage.md`, garder la liste : ce qui marche, ce qui ne marche pas, à tester. Environ 70 % des vidéos appliquent ce qui marche, 30 % testent du nouveau.
- Chaque lundi, écrire un bilan de la semaine dans `apprentissage.md` et réviser cette section si les faits ont changé.

## Journal
Ajouter à `journal.md`, pour chaque vidéo : date, famille, sujet, accroche, sources, ids Metricool.
