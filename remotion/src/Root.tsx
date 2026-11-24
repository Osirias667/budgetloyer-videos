// Registre des compositions. Chaque épisode reçoit ses durées de scène (secondes) et sa piste audio en props,
// passées par outils/rendu_remotion.py depuis le fichier Python de l'épisode (même découpage que la musique).
import React from 'react';
import {Composition} from 'remotion';
import {totalFrames} from './bl/anim';
import {GTA_DURATIONS, Gta6CompteurHeure} from './episodes/2026-11-18';
import {A_DURATIONS, B_DURATIONS, CalendrierPompiers, SurvieADeux1} from './episodes/2026-11-19';
import {A_DURATIONS as A20, B_DURATIONS as B20, SecretSantaTirage, SurvieADeux2} from './episodes/2026-11-20';
import {A_DURATIONS as A21, B_DURATIONS as B21, MarcheNoelTotal, SamediJeSorsPas} from './episodes/2026-11-21';
import {A_DURATIONS as A22, B_DURATIONS as B22, AdditionArrive, DefiCinqDimanches} from './episodes/2026-11-22';
import {A_DURATIONS as A23, B_DURATIONS as B23, PovDecouvert, SurvieEtudiant1} from './episodes/2026-11-23';
import {A_DURATIONS as A24, B_DURATIONS as B24, BlackFridayVraieFausse, SurvieEtudiant2} from './episodes/2026-11-24';
import {A_DURATIONS as A25, B_DURATIONS as B25, SapinMatch, SpeedrunListeNoel} from './episodes/2026-11-25';
import {Galerie} from './Galerie';

type EpProps = {durations: number[]; audio?: string};

const ep = (id: string, component: React.FC<EpProps>, durations: number[]) => (
  <Composition key={id} id={id} component={component} fps={30} width={1080} height={1920}
    durationInFrames={totalFrames(durations)} defaultProps={{durations, audio: undefined} as EpProps}
    calculateMetadata={({props}) => ({durationInFrames: totalFrames(props.durations)})} />
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="galerie" component={Galerie} fps={30} width={1080} height={1920} durationInFrames={60} />
    {ep('gta6-compteur-heure', Gta6CompteurHeure, GTA_DURATIONS)}
    {ep('survie-a-deux-1', SurvieADeux1, A_DURATIONS)}
    {ep('calendrier-pompiers', CalendrierPompiers, B_DURATIONS)}
    {ep('survie-a-deux-2', SurvieADeux2, A20)}
    {ep('secret-santa-tirage', SecretSantaTirage, B20)}
    {ep('marche-noel-total', MarcheNoelTotal, A21)}
    {ep('samedi-je-sors-pas', SamediJeSorsPas, B21)}
    {ep('defi-cinq-dimanches', DefiCinqDimanches, A22)}
    {ep('addition-arrive', AdditionArrive, B22)}
    {ep('pov-decouvert', PovDecouvert, A23)}
    {ep('survie-etudiant-1', SurvieEtudiant1, B23)}
    {ep('survie-etudiant-2', SurvieEtudiant2, A24)}
    {ep('black-friday-vraie-fausse', BlackFridayVraieFausse, B24)}
    {ep('sapin-match', SapinMatch, A25)}
    {ep('speedrun-liste-noel', SpeedrunListeNoel, B25)}
  </>
);
