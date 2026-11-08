# BudgetLoyer : règles de production vidéo

Objectif : 2 vidéos originales par jour, le plus de vues possible sur TikTok et YouTube Shorts.

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
Alterner chaque jour les deux familles :
- **Sketch** : personnages plats (P1 à capuche et casque, boss monstres, colocs, etc.), décors colorés, étiquette de rôle + bandeau de dialogue néon avec texte tapé, scènes courtes, puis tableau de bord BudgetLoyer et carte de fin (logo vert, BudgetLoyer.com en jaune, confettis). Thèmes déjà utilisés : jeu vidéo, garde à vue, procès de coloc, vampire, zombie, boss de fin, ski, Gaston contre Rémi. En inventer de nouveaux.
- **Tuto** : fond sombre, gros texte blanc avec mots en vert #20E388, téléphone avec écrans de l'app, « Étape 1/2/3 », écran vert « Spoiler », fin « Lien en bio ».

Le texte doit être lisible dès la première image, avec une accroche forte. Garder le contenu entre y=150 et y=1500 et loin du bord droit (interface TikTok).

## Actualité
Partir de l'actualité budget, logement, conso ou culture populaire en France, datée de moins de 7 jours, ou d'un temps fort à venir.
- Tout chiffre ou fait vient d'une source consultée pendant la session. Citer l'étude dans la vidéo ou la légende. Noter la source dans `journal.md`.
- Montants de démonstration de l'app ou promos fictives : uniquement comme mise en scène, jamais présentés comme des données réelles.
- Rester neutre : pas de parti, de candidat, de gouvernement ni de mouvement social comme sujet ou cible.
- Ne jamais se moquer d'un drame, d'un décès ou d'une catastrophe.
- Pas de personne réelle, de marque tierce mise en cause, de personnage protégé, de logo tiers, ni de musique externe. Citer une enseigne seulement si c'est nécessaire et factuel.

## Publication (Metricool, blogId 7967267, Europe/Paris)
Chaque vidéo part sur les deux réseaux, en deux posts séparés.

| Vidéo | TikTok | YouTube Shorts |
|---|---|---|
| Vidéo 1 | 10:00 | 10:00 |
| Vidéo 2 | 18:00 | 16:00 |

- Média : `https://raw.githubusercontent.com/Osirias667/budgetloyer-videos/videos/videos/AAAA-MM/fichier.mp4` (branche `videos`, pousser avant de programmer).
- `autoPublish: true`, `draft: false`.
- TikTok : `title` obligatoire, `commercialContentOwnBrand: true`, `isAigc: true`, `privacyOption: PUBLIC_TO_EVERYONE`.
- YouTube : `type: short`, `privacy: public`, `madeForKids: false`, `title`, `tags`, `category: HOWTO_STYLE`. `isAiGeneratedContent: true` seulement si le contenu est réaliste (pas pour ces animations).

## Descriptions (obligatoire : même style que les posts existants du compte)
Même texte sur TikTok et YouTube. Tout sur une seule ligne, sans retours à la ligne, en tutoiement. Dans cet ordre :
1. Accroche avec un emoji au début et « … » : `🎿 Les vacances au ski approchent… mais ton budget, lui, est-il prêt à dévaler les pistes ? ❄️`
2. Une phrase de contexte liée au thème de la vidéo, qui finit par « ! » et un emoji.
3. `Avec BudgetLoyer, <verbe> :` puis 3 ou 4 bénéfices courts, chacun précédé d'un emoji, à l'impératif (🎯 📊 🚨 💰 📅 🏠).
4. Une chute drôle qui file la métaphore de la vidéo : `Parce que les seules choses qui devraient déraper au ski, ce sont tes skis, pas tes finances ! ⛷️`
5. `👉 Découvre BudgetLoyer.com (lien en bio).` Sur YouTube, retirer « (lien en bio) ».
6. 10 à 13 hashtags : `#BudgetLoyer`, 2 ou 3 sur le thème, puis `#GestionBudget #FinancesPersonnelles #Budget #Argent #Epargne #FinDeMois`, et pour finir `#TikTokFrance` sur TikTok ou `#Shorts` sur YouTube.

Exemple complet de référence :
`🚨 Votre salaire est en garde à vue… et il a beaucoup de choses à expliquer ! 1 800 € sur le compte au départ… mais entre le loyer, les factures et les dépenses du quotidien, où passe tout cet argent ? 🧐 Avec BudgetLoyer, fini les disparitions inexpliquées : 💸 Suis tes dépenses 📊 Visualise ce qu'il te reste vraiment 🚨 Anticipe les dépassements de budget 🎯 Garde le contrôle de ton épargne Ton salaire mérite mieux que de disparaître sans laisser de traces ! 🔍 👉 Passe à l'action sur BudgetLoyer.com (lien en bio). #BudgetLoyer #Salaire #GestionBudget #FinancesPersonnelles #Budget #FinDeMois #argent #Depenses #Epargne #PouvoirDAchat #ConseilsBudget #Humour #TikTokFrance`

Avant de programmer, relire aussi les 5 dernières descriptions du compte (métrique TKPO05) pour rester dans le ton.

## Apprentissage
Avant de créer, lire les stats TikTok des 14 derniers jours (métriques TKPO02, 05, 06, 07, 08, 09, 10) et `journal.md`. Refaire les angles et formats qui dépassent la médiane, abandonner ceux qui sont en dessous. Ne jamais répéter un sujet des 14 derniers jours.

## Journal
Ajouter à `journal.md`, pour chaque vidéo : date, famille, sujet, accroche, sources, ids Metricool.
