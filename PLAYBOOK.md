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
Format 1080x1920, 30 fps, 20 à 40 s, h264 + aac.

**Moteur vidéo : Remotion (décision du propriétaire, 18 nov. 2026).** Les nouvelles vidéos se font dans `remotion/` (React), avec les personnages vectoriels animés de `remotion/src/bl/persos.tsx` (P1, Monsieur Découvert, Manette, Ton compte : ils clignent des yeux, parlent, respirent, rebondissent). Mode d'emploi complet, installation comprise : `remotion/README.md`. Chaque épisode a deux fichiers : `episodes/AAAA-MM-JJ.py` (découpage des scènes, musique, faits et sources ; il importe `bl.py`) et `remotion/src/episodes/AAAA-MM-JJ.tsx` (les scènes), rendus par `outils/rendu_remotion.py`. Envelopper l'accroche dans `<Instant.Provider value>` : tout y est visible dès l'image 0. Améliorer et enrichir les personnages et décors de `remotion/src/bl/` (nouveaux personnages, poses, expressions) plutôt que ceux de `bl.py`. Si Remotion ne s'installe pas (réseau), revenir à `bl.py` pour ne pas bloquer la publication et le noter dans le journal. Licence Remotion : gratuite tant que l'entreprise compte 3 personnes au plus (1 au 18 nov. 2026). `bl.py` et `videos.py` restent la référence des anciennes vidéos.

**Nouvelle DA « cartoon premium 2.5D » (décision du propriétaire, 27 nov. 2026 : l'ancienne était « beaucoup trop simpliste »).** Bibliothèque `remotion/src/bl2/` : caméra virtuelle (`Cam`, zooms et panoramiques doux, léger mouvement à l'épaule), décors en couches avec parallaxe et profondeur de champ (`Layer`, premier plan flou), lumière et étalonnage (`Grade` : halo chaud, reflet, vignette, grain ; `Bokeh`), personnages avec lumière de contour, ombre portée et mise au point sur celui qui parle (`Hero`), titres en relief en Baloo 2 (`Headline`, `Chip`, `Big`), cartes en verre inclinées (`Glass`, `Row`), colonnes isométriques (`Pillar`), transitions filé / zoom / iris (`Scenes2`, `Flash`), sous-titres karaoké (`Subs`), carte de fin `EndCard`. Le texte et l'interface vont dans une couche peu profonde (`Layer d={0.12}`) pour rester dans la zone y=150-1500 malgré les zooms. Plus aucune nouvelle vidéo dans l'ancienne DA plate (src/bl/ reste la source des personnages). Exemple de référence : `remotion/src/episodes/2026-11-27-v2.tsx`. Chaque semaine, enrichir bl2 (nouveaux décors en couches, poses, effets).

**Carte blanche créative (décision du propriétaire).** Les seuls repères sont le site et la DA des comptes. Innover est attendu : nouveaux formats, concepts, personnages, rythmes, séries récurrentes, faux formats télé ou jeux, quiz, classements, pastiches génériques, cliffhangers, etc. La seule contrainte visuelle est de rester en animation, avec la palette, le logo et le ton BudgetLoyer reconnaissables. Tester au moins un format jamais vu par semaine, le noter dans `journal.md`, puis garder ce qui dépasse la médiane des vues. Étendre la bibliothèque `remotion/src/bl/` avec de nouveaux décors et personnages quand c'est utile.

Les règles de fiabilité ne bougent pas : fonctionnalités citables, faits sourcés, neutralité politique, pas de personnage protégé ni de personne réelle, descriptions, hashtags et réglages de publication.

Les deux familles déjà installées servent de base, pas de limite :
- **Sketch** : personnages plats (P1 à capuche et casque, boss monstres, colocs, etc.), décors colorés, étiquette de rôle + bandeau de dialogue néon avec texte tapé, scènes courtes, puis tableau de bord BudgetLoyer et carte de fin (logo vert, BudgetLoyer.com en jaune, confettis). Thèmes déjà utilisés : jeu vidéo, garde à vue, procès de coloc, vampire, zombie, boss de fin, ski, Gaston contre Rémi. En inventer de nouveaux.
- **Tuto** : fond sombre, gros texte blanc avec mots en vert #20E388, téléphone avec écrans de l'app, « Étape 1/2/3 », écran vert « Spoiler », fin « Lien en bio ».

**Audio (consigne du propriétaire, 10 nov. 2026) : jamais agressif.** Pas d'ondes carrées stridentes ni d'effets qui claquent : ondes douces (sinus, triangle), passe-bas vers 3,5 kHz, effets sonores discrets, aucun pic soudain. Viser environ -20 LUFS, crête maximale -3 dBFS, LRA de 5 LU au plus. Mesurer avant publication avec `ffmpeg -af ebur128=peak=true`. Utiliser `SoftMix` de `bl.py` : `tri`/`sn` pour la musique, `pop` à chaque texte ou objet qui apparaît, `whoosh` doux à chaque changement de plan, et `jingle` (signature sonore BudgetLoyer, toujours la même) au moment où le logo apparaît. `end` filtre et normalise.

**Musique variée et de mieux en mieux (consigne du propriétaire, 12 nov. 2026).** Depuis le 12 nov., la musique se compose avec `musique.py` (classe `Track`, même interface que `SoftMix`) et non plus avec `chords_music`. Chaque vidéo prend un style, une tonalité, un tempo et une graine différents des précédentes (`python3 musique.py next 2`), choisis selon l'ambiance du sujet, et s'inscrit dans le registre `musique.md`. Le moteur reçoit au moins une amélioration par semaine, notée dans `musique.md` ; les styles sont gardés ou retravaillés selon les stats. Le jingle de marque reste toujours le même.

**Vraies musiques (accord du propriétaire, 18 nov. 2026).** Les musiques peuvent sonner comme de vraies musiques. Depuis le 18 nov., `musique.py` v3.0 joue la partition avec de vrais instruments échantillonnés : `Track(..., sf2=True)` (banque GeneralUser GS, installée par `npm install` dans `remotion/` ; licence : usage libre, y compris commercial, pour créer de la musique). Le faire sur chaque nouvelle vidéo. Styles pensés pour ces instruments : `pop_piano` et `pizzicato`, en plus des 8 autres. Un enregistrement extérieur (morceau déjà produit) n'est utilisable que si sa licence autorise clairement l'usage commercial sur TikTok, YouTube et Instagram : le ranger dans `musique/libres/` avec sa source et sa licence, et le noter dans `musique.md`. Jamais un tube ni une chanson sous droits dans le fichier vidéo (droit d'auteur ; les plateformes coupent le son ou bloquent la vidéo) : pour un tube du moment, seulement le son ajouté par la plateforme (catalogue Instagram, ou son ajouté à la main dans l'app TikTok par le propriétaire). Les règles audio douces ci-dessus s'appliquent toujours.

**Airs connus (demande du propriétaire, 17 nov. 2026).** Au moins une vidéo sur deux a pour mélodie un air connu, rejoué par `musique.py` dans le style choisi : `Track(..., theme="<air>")`, liste avec `python3 musique.py themes` (Grieg, Mozart, Beethoven, Vive le vent, Frère Jacques…). Seulement des airs du domaine public (compositeur mort depuis plus de 70 ans ou air traditionnel), joués par notre moteur : jamais un enregistrement extérieur, jamais un tube récent ni une chanson sous droits, même réécrit note à note (droit d'auteur, et TikTok, YouTube et Instagram coupent le son ou bloquent la vidéo). Choisir l'air selon l'ambiance (roi de la montagne → panique ou montée, marche turque → jeu, ode à la joie → victoire, Vive le vent → Noël), ne pas reprendre le même air sur les 4 dernières vidéos, et l'écrire dans la colonne Style du registre (`jeu_tele + marche_turque`). Pour un tube du moment, la seule voie reste le son ajouté par la plateforme : catalogue Instagram (voir Publication) ou son ajouté à la main dans l'app TikTok par le propriétaire.

**Voix off de personnages (décision du propriétaire, 27 nov. 2026, remplace l'abandon du 10 nov.).** Chaque nouvelle vidéo a une voix off : les personnages parlent avec leur propre voix (`voix.py` : Kokoro v1.0, licence Apache 2.0, voix française `ff_siwis`, jeu de données SIWIS CC BY 4.0, transposée par personnage : `decouvert`, `p1`, `tata`, `tonton`, `cousin`, `mamie`, `frere`, `sam`, `objet`, `objet_grave`, `narrateur`). Voix générique, jamais le clone d'une personne réelle. Monsieur Découvert peut servir de narrateur. Script court, une idée par réplique ; les durées de scène découlent des répliques (`dire()` renvoie la durée) ; voix posée dans la musique avec `Track.voice()` (musique baissée dessous, voix non filtrée) ; sous-titres karaoké `Subs` à l'écran (beaucoup regardent sans le son). Les montants dits à voix haute restent exacts (dire « presque trente-sept euros » si l'écran affiche 36,67 €). Mention IA : la voix est une voix de personnage de dessin animé, pas une personne réaliste ; garder `isAigc: false` sauf nouvelle consigne du propriétaire. Ancienne note : la voix avait été abandonnée par le propriétaire le 10 nov. 2026. Pas de voix enregistrée et pas de voix de synthèse : les vidéos reposent sur le texte à l'écran, la musique douce, les bruitages et le jingle. Le code `SoftMix.voice` reste disponible si le propriétaire change d'avis.

**Image 1 en mouvement** : avec Remotion, `<SceneIn first>` ; avec `bl.py`, appeler `punch_in(img, t)` à la fin de la première scène, pour un léger zoom arrière pendant 0,6 s. L'accroche reste complète et lisible dès l'image 0.

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
- Son du catalogue Instagram (accord du propriétaire, 10 nov. 2026) : sur Instagram seulement, `instagramData.audioConfiguration` avec `audioId` (un titre et un artiste précis, sinon la requête est refusée et renvoie les candidats), `audioVolume` 60 à 80 et `videoVolume` 100. La vidéo Instagram est alors un export `_ig` rendu avec `SoftMix(music=False)` : bruitages, jingle et voix gardés, sans notre musique, pour éviter deux mélodies superposées. Choisir un titre populaire en ce moment et dont l'ambiance colle à la vidéo, jamais de paroles qui contredisent le message. Cela ne marche que pour un compte professionnel relié à une page Facebook : si Metricool refuse, publier sans son du catalogue et le noter dans le journal. Compte relié le 10 nov. 2026 (page Facebook connectée à la marque et Instagram reconnecté via Facebook). Le catalogue de l'API est une bibliothèque libre de droits : une recherche par titre renvoie des candidats, puis passer l'`audioId` numérique choisi.
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

**Pour sortir du plafond TikTok de ~750 vues (décision du propriétaire, 17 nov. 2026)** : sur 15 vidéos, 14 font 733 à 819 vues, avec 0 partage. TikTok montre chaque vidéo à un premier groupe puis s'arrête : il faut plus de partages, de commentaires et de revisionnages dans ce groupe. Trois règles s'ajoutent, sur chaque vidéo :
11. **Moins de pub, plus de contenu.** La vidéo doit valoir le coup sans la marque. Pendant la vidéo, la marque n'est qu'une petite signature (`brand_tag`). Au plus un plan d'app (tableau de bord, téléphone, widget « Il te reste ») de 2,5 s maximum, et seulement s'il sert l'histoire ; au moins une vidéo sur deux n'en montre aucun. Pas de phrase de vente à l'écran (« Pose un repère… dans BudgetLoyer ») : la carte de fin (2 s maximum) garde le logo et BudgetLoyer.com. Les descriptions gardent leur format (règle du propriétaire), sans changement.
12. **Un destinataire précis.** Chaque vidéo est écrite pour être envoyée à quelqu'un de nommé : « ton coloc qui… », « ton pote qui emménage », « la personne avec qui tu partages les courses », « ta sœur qui… ». Il apparaît dans l'accroche ou les 3 premières secondes, et la carte de fin dit « Envoie ça à <lui> ». Choisir le sujet d'abord pour ce critère (premier partage du compte : premier appart, « le pote qui emménage »).
13. **Faire participer.** Chaque jour, au moins une vidéo demande une action simple : défi à refaire chez soi (le défi 0 € est la seule vidéo repartie après coup, 742 puis 990 vues), réponse d'un mot ou d'un chiffre (« réponds avec ton niveau »), choix de camp, ou « tag la personne qui… ». Au moins un défi par semaine. La question finale reste une vraie question, sans faux témoignage ni fausse urgence.

Interdits : faux engagement, achats de vues, commentaires inventés, accroche trompeuse que la vidéo ne tient pas, fausse urgence présentée comme réelle. Une accroche forte doit rester vraie.

### Veille sur le viral
À chaque session, lire une ou deux sources récentes sur les formats courts qui marchent en France ou dans la finance personnelle (tendances du mois, analyses). Noter le mécanisme qui fonctionne (structure, rythme, type d'accroche) et l'adapter en animation BudgetLoyer. S'inspirer de mécanismes, jamais copier une vidéo, un scénario, un personnage ou un son précis.

### Outils d'accroche et de description (`outils/instagram-agent-fr/`, adaptés le 10 nov. 2026)
Version française d'instagram-agent-skill (MIT). L'original anglais reste dans `outils/instagram-agent-skill/`. Voir le README du dossier. À chaque vidéo :
1. Écrire 3 accroches de formules différentes, prises dans `hooks_fr.json`, et les noter avec `hookscore_fr.py`. Éliminer celles sous 50 ou qui ont un « dealbreaker ». Entre les autres, choisir selon `apprentissage.md`, pas selon le score.
2. Si une voix est prévue : `beats_fr.py script.txt --target <durée>` (accroche de 3 s maximum, pas de temps de plus de 4 s).
3. Description : `humanize_fr.py` puis `caption_fr.py --keywords "<mots-clés>"`. Les 125 premiers caractères doivent accrocher seuls et contenir le mot-clé principal.
4. Tous les scores sont indicatifs : ne jamais bloquer une publication dessus. Le PLAYBOOK l'emporte sur les outils (emojis, `#fyp`, format des descriptions).
Bonnes pratiques à reprendre de l'original : `skills/ig-carousel/SKILL.md` (numéroter les images, une image récapitulative à envoyer) et `skills/ig-audit/SKILL.md` (multiple de la médiane, partages par compte touché).

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
