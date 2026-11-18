# Remotion : moteur vidéo BudgetLoyer (depuis le 18 nov. 2026)

Décision du propriétaire (18 nov. 2026) : les vidéos se font avec Remotion (React), testé sur « Le compteur €/heure ».
Licence : gratuite pour une entreprise de 3 personnes au plus (BudgetLoyer : 1 personne). À revoir si l'équipe grandit.

## Installer (une fois par session)

Le registre npm passe par le proxy de la session ; il faut forcer son usage :

```bash
cd remotion
export NO_PROXY=localhost no_proxy=localhost npm_config_noproxy=localhost npm_config_proxy=$HTTPS_PROXY
npm install --no-audit --no-fund
pip install --break-system-packages -q pyfluidsynth   # vrais instruments de musique.py v3
```

`npm install` installe aussi la banque d'instruments GeneralUser GS (paquet `generaluser`, licence : usage libre,
y compris commercial, pour créer de la musique), utilisée par `musique.py` en mode `sf2=True`.
Le rendu utilise le Chromium déjà présent (`/opt/pw-browsers/...`) : rien à télécharger.

## Faire un épisode

1. `episodes/AAAA-MM-JJ.py` (Python) : découpage `A = [(nom_ou_fonction, durée_s), …]`, musique `music_a(total, path)`
   avec `Track(..., sf2=True)`, faits et sources dans le docstring. Il importe toujours `bl.py`.
2. `remotion/src/episodes/AAAA-MM-JJ.tsx` : les scènes, dans le même ordre ; enregistrer la composition dans
   `src/Root.tsx` (`ep('mon-id', Composant, DUREES_PAR_DEFAUT)`).
3. Contrôle à pleine taille (l'image 0 doit montrer l'accroche complète) :
   `python3 outils/rendu_remotion.py stills episodes/AAAA-MM-JJ.py A mon-id 0,90,300 /chemin/stills`
4. Rendu (musique générée puis vidéo) :
   `python3 outils/rendu_remotion.py render episodes/AAAA-MM-JJ.py A music_a mon-id budgetloyer_nom /chemin/sortie`
5. Vérifier comme avant : `ffprobe` (1080x1920, h264, audio), `ebur128`, images extraites du fichier final.

## Bibliothèque (`src/bl/`)

- `anim.tsx` : `Instant` (tout visible dès l'image 0, à mettre autour de l'accroche), `Pop`, `SceneIn`, `useSpring`,
  `useTween`, `Scenes`, `useFonts`.
- `ui.tsx` : `Pill`, `Txt`, `Y` (mot surligné), `Caption` (légende à contour), `Brand` (signature discrète),
  `EndLogo` (carte de fin), `Gauge`, `Compteur`, `Stamp`, `Card`, `T`.
- `decors.tsx` : `NeonBg` (grille rétro qui défile), `DarkBg` (famille Tuto), `MoodBg` (rayons d'ambiance).
- `persos.tsx` : personnages vectoriels animés (clignent des yeux, parlent avec `talk`, respirent, rebondissent,
  tremblent avec `shake`) : `P1` (`wave` pour saluer), `Decouvert` (Monsieur Découvert), `Manette`, `Compte`
  (« Ton compte »). Expressions : happy, neutral, worry, sad, angry, shock, cool.
- Planche de contrôle : composition `galerie`.

Règles inchangées : zone utile y=150 à 1500, rien près du bord droit, aucun personnage protégé ni logo tiers.
