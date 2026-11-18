// 18 nov. 2026 · « Le compteur €/heure » (GTA 6), refait avec Remotion et la manette vectorielle.
// Découpage (secondes) et musique : episodes/2026-11-18.py (A). Faits : voir le docstring du fichier Python.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Instant, SceneIn, Scenes, useFonts} from '../bl/anim';
import {NeonBg} from '../bl/decors';
import {Manette} from '../bl/persos';
import {CYAN, GREEN, MAG, NAVY, RED, YEL, eur} from '../bl/theme';
import {Brand, Card, Compteur, EndLogo, Gauge, Pill, Stamp, T, Txt, Y} from '../bl/ui';

const PRICE = 79.99;

const Hook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <NeonBg />
      <Pill txt="LE COMPTEUR €/HEURE" col={MAG} />
      <Txt y={260} size={96}><Y>GTA 6</Y> sort jeudi.<br /><Y>79,99&nbsp;€</Y>.</Txt>
      <Txt y={560} size={52} weight={700}>Ton pote qui a posé son jeudi :<br />« rentabilisé en une soirée ».</Txt>
      <Txt y={710} size={80}><Y c={GREEN}>Vrai ?</Y></Txt>
      <Manette x={540} y={930} w={560} expr="happy" label={eur(PRICE)} />
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const ROUNDS = [
  {lab: '1/4 · UNE SOIRÉE', col: RED, fg: 'white', h: 4, expr: 'sad', a: '20 € de l\'heure.', b: 'Pas vraiment rentabilisé.', lvl: 0.12},
  {lab: '2/4 · UN WEEK-END', col: YEL, fg: NAVY, h: 16, expr: 'neutral', a: '5 € de l\'heure.', b: 'Ça descend…', lvl: 0.4},
  {lab: '3/4 · 2 H PAR SOIR JUSQU\'À NOËL', col: CYAN, fg: NAVY, h: 72, expr: 'happy', a: '1,11 € de l\'heure.', b: 'Là, ça devient rentable.', lvl: 0.78},
  {lab: '4/4 · LE POTE QUI Y PASSE 200 H', col: GREEN, fg: NAVY, h: 200, expr: 'cool', a: '0,40 € de l\'heure.', b: 'Imbattable.', lvl: 0.97},
] as const;

const Round: React.FC<{i: number}> = ({i}) => {
  const r = ROUNDS[i];
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <NeonBg tint={0.15} />
      <Pill txt={r.lab} col={r.col} fg={r.fg} />
      <Compteur hours={r.h} price={PRICE} y={330} />
      {f >= 42 ? <Txt y={640} size={64}><Y>{r.a}</Y><br />{r.b}</Txt> : null}
      <Manette x={540} y={940} w={470} expr={f >= 40 ? r.expr : 'shock'} talk={f >= 42 && f < 62} label={`${r.h} h`} />
      <Gauge level={r.lvl} col={r.col} label="RENTABILITÉ" />
      <Brand />
    </SceneIn>
  );
};

const Twist: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <NeonBg />
      <Pill txt="LE PIRE CAS" col={RED} size={44} />
      <Txt y={250} size={80}>L'édition <Y>à 99,99&nbsp;€</Y>…<br />jouée <Y>3&nbsp;h</Y>.</Txt>
      <Sequence from={15} layout="none"><Compteur hours={3} price={99.99} y={560} start={0} /></Sequence>
      <Stamp txt="AÏE" y={840} delay={54} />
      <Manette x={540} y={1040} w={440} expr={f >= 48 ? 'angry' : 'shock'} talk={f >= 60 && f < 80} label={'3 h'}
        shake={f >= 48 && f < 70 ? 10 : 0} />
      <AbsoluteFill style={{background: RED, opacity: f >= 48 && f < 62 ? 0.28 * (1 - (f - 48) / 14) : 0}} />
      <Brand />
    </SceneIn>
  );
};

const LADDER: [string, number, string][] = [
  ['Ultimate, 3 h', 33.33, RED], ['Une soirée', 20, RED], ['Un week-end', 5, YEL], ['Jusqu\'à Noël', 1.11, GREEN],
  ['200 h', 0.4, GREEN],
];

const Ladder: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <NeonBg tint={0.3} />
      <Pill txt="TON POTE, IL EST OÙ ?" col={MAG} size={42} />
      {LADDER.map(([lab, v, c], i) => (
        <Card key={lab} x={110} y={290 + i * 190} w={820} h={150} col={c} delay={3 + i * 5}>
          <T size={52}>{lab}</T><T size={58} color={c}>{eur(v)}/h</T>
        </Card>
      ))}
      {f >= 39 ? <Txt y={1290} size={52}>Réponds avec <Y>ton nombre d'heures</Y>.</Txt> : null}
      <Brand />
    </SceneIn>
  );
};

const End: React.FC = () => (
  <SceneIn>
    <NeonBg tint={0.2} />
    <Txt y={190} size={84}>Toi, tu vas y jouer<br />combien d'heures<br /><Y>avant Noël</Y> ?</Txt>
    <Txt y={600} size={60} delay={4}>Envoie ça au pote<br />qui a posé <Y c={GREEN}>son jeudi</Y>.</Txt>
    <Manette x={540} y={850} w={370} expr="happy" talk label={eur(PRICE)} delay={2} />
    <EndLogo y={1170} note="Prix éditeur annoncés · heures : exemples" />
  </SceneIn>
);

export const GTA_DURATIONS = [2.8, 3, 3, 3, 3, 3.2, 2.8, 2.2];

export const Gta6CompteurHeure: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations}
        scenes={[<Hook />, ...ROUNDS.map((_, i) => <Round i={i} />), <Twist />, <Ladder />, <End />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
