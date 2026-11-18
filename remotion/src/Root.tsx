// Registre des compositions. Chaque épisode reçoit ses durées de scène (secondes) et sa piste audio en props,
// passées par outils/rendu_remotion.py depuis le fichier Python de l'épisode (même découpage que la musique).
import React from 'react';
import {Composition} from 'remotion';
import {totalFrames} from './bl/anim';
import {GTA_DURATIONS, Gta6CompteurHeure} from './episodes/2026-11-18';
import {A_DURATIONS, B_DURATIONS, CalendrierPompiers, SurvieADeux1} from './episodes/2026-11-19';
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
  </>
);
