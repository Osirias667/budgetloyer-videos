// 22 nov. 2026 · A : « Le défi des 5 dimanches » (résultat d'abord, bocal qui se remplit, 3 niveaux, boucle « jour 1 ») ;
// B : « L'addition arrive » (« tous les groupes de potes quand… », 6 profils numérotés, le n°6 c'est toi).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-22.py.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Pop, SceneIn, Scenes, Instant, useFonts} from '../bl/anim';
import {DarkBg, MoodBg, RestoBg} from '../bl/decors';
import {Bocal, Collegue, P1} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL} from '../bl/theme';
import {Addition, Brand, Caption, Cases, Check, EndLogo, Feuille, Pill, Stamp, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : Le défi des 5 dimanches ===============================
const PILL_A = 'DÉFI · 5 DIMANCHES';
const DIMS = [
  {jour: 'DIM.', num: '22', mois: 'NOV.', top: '22/11', val: '10 €', add: 10},
  {jour: 'DIM.', num: '29', mois: 'NOV.', top: '29/11', val: '20 €', add: 20},
  {jour: 'DIM.', num: '6', mois: 'DÉC.', top: '6/12', val: '30 €', add: 30},
  {jour: 'DIM.', num: '13', mois: 'DÉC.', top: '13/12', val: '40 €', add: 40},
  {jour: 'DIM.', num: '20', mois: 'DÉC.', top: '20/12', val: '50 €', add: 50},
];
const ITEMS = DIMS.map((d) => ({top: d.top, val: d.val}));
const ENVOIE_A = <>Envoie ça au pote qui fait<br />ses cadeaux le 24 au soir.</>;

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <DarkBg />
      <Pill txt={PILL_A} col={GREEN} fg={NAVY} />
      <Txt y={235} size={74}>Le 20 décembre,<br />ce bocal contient <Y c={GREEN}>150 €</Y>.</Txt>
      <Bocal x={540} y={370} w={440} level={1} label="150 €" expr="happy" />
      <Txt y={930} size={56}>Le défi commence<br /><Y>aujourd'hui</Y>, dimanche.</Txt>
      <Cases items={ITEMS} filled={5} y={1110} />
      <Caption y={1290} size={40} color={YEL}>{ENVOIE_A}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Rewind: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="◀◀ RETOUR AU JOUR 1" col={CYAN} fg={NAVY} />
    <Txt y={240} size={68}>Dimanche 22 novembre.<br />Le bocal est <Y c={RED}>vide</Y>.</Txt>
    <Bocal x={540} y={390} w={480} level={0} label="0 €" expr="worry" delay={2} />
    <Txt y={1000} size={50} weight={800} delay={8}>La règle : chaque dimanche,<br />10 € de plus que la semaine d'avant.</Txt>
    <Cases items={ITEMS} filled={0} y={1190} />
    <Brand />
  </SceneIn>
);

type Semaine = {i: number; titre: React.ReactNode; expr: any; shake?: number; col: string};

const Dimanche: React.FC<Semaine> = ({i, titre, expr, shake = 0, col}) => {
  const d = DIMS[i];
  const before = DIMS.slice(0, i).reduce((a, x) => a + x.add, 0);
  const after = before + d.add;
  return (
    <SceneIn>
      <DarkBg />
      <Pill txt={`${PILL_A} · ${i + 1}/5`} col={GREEN} fg={NAVY} size={34} />
      <Feuille jour={d.jour} num={d.num} mois={d.mois} x={80} y={250} w={250} col={col} />
      <Pop delay={4} style={{position: 'absolute', left: 380, top: 280, width: 620, textAlign: 'center'}}>
        <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: GREEN, lineHeight: 1,
          textShadow: `0 0 30px ${GREEN}88, 0 6px 0 rgba(0,0,0,0.45)`}}>+{d.add} €</div>
      </Pop>
      <Txt y={500} size={46} weight={800} delay={8}>{titre}</Txt>
      <Bocal x={540} y={440} w={520} level={after / 150} label={`${after} €`} expr={expr} shake={shake} drop={6} talk={i === 4} />
      <Cases items={ITEMS} filled={i + 1} y={1150} at={14} />
      <Brand />
    </SceneIn>
  );
};

const Resultat: React.FC = () => (
  <SceneIn>
    <MoodBg col={GREEN} dark={0.6} />
    <Pill txt="20 DÉCEMBRE" col={YEL} fg={NAVY} />
    <Txt y={250} size={60}>10 + 20 + 30 + 40 + 50 =</Txt>
    <Txt y={350} size={150} delay={4}><Y c={GREEN}>150 €</Y></Txt>
    <Bocal x={540} y={470} w={500} level={1} label="150 €" expr="happy" talk />
    <Stamp txt="DÉFI RÉUSSI" y={1120} delay={14} col={GREEN} size={80} />
    <Brand />
  </SceneIn>
);

const Niveau: React.FC<{y: number; nom: string; col: string; suite: string; total: string; delay: number}> = (
  {y, nom, col, suite, total, delay},
) => (
  <Pop delay={delay} from={80} style={{position: 'absolute', left: 80, top: y, width: 920, height: 190, borderRadius: 28,
    background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, boxShadow: `0 0 26px ${col}88`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px'}}>
    <div>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: col}}>{nom}</div>
      <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 34, color: 'white'}}>{suite}</div>
    </div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: 'white'}}>{total}</div>
  </Pop>
);

const Niveaux: React.FC = () => (
  <SceneIn>
    <DarkBg />
    <Pill txt="CHOISIS TON NIVEAU" col={MAG} />
    <Txt y={250} size={68}>Tu prends<br />quel niveau ?</Txt>
    <Niveau y={500} nom="FACILE" col={CYAN} suite="5, 10, 15, 20, 25 €" total="75 €" delay={4} />
    <Niveau y={730} nom="NORMAL" col={GREEN} suite="10, 20, 30, 40, 50 €" total="150 €" delay={10} />
    <Niveau y={960} nom="BOSS" col={RED} suite="20, 40, 60, 80, 100 €" total="300 €" delay={16} />
    <Caption y={1220} size={48} color={YEL} delay={22}>Réponds : facile, normal ou boss.</Caption>
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <DarkBg />
    <Caption y={190} size={76}>Jour 1 :<br /><Y c={GREEN}>aujourd'hui</Y>.</Caption>
    <Caption y={410} size={44} delay={3}>{ENVOIE_A}</Caption>
    <Bocal x={540} y={470} w={480} level={0} label="0 €" expr="happy" />
    <EndLogo y={1150} note="Défi d'exemple · montants à adapter à ton budget" />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.6, 2.8, 2.0];

export const DefiCinqDimanches: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />, <Rewind />,
        <Dimanche i={0} titre="Semaine 1 : facile." expr="happy" col={RED} />,
        <Dimanche i={1} titre="Black Friday passé : le bocal tient." expr="cool" col={RED} />,
        <Dimanche i={2} titre="Semaine 3 : ça pique un peu." expr="neutral" col={RED} />,
        <Dimanche i={3} titre="Semaine 4 : le bocal transpire." expr="worry" shake={6} col={RED} />,
        <Dimanche i={4} titre={<>Semaine 5 : <Y c={RED}>BOSS FINAL</Y>.</>} expr="shock" shake={3} col={RED} />,
        <Resultat />, <Niveaux />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : L'addition arrive ===============================
const PILL_B = 'RESTO ENTRE POTES';
const TAG_B = <>Tag le pote qui<br />« te fait un virement demain ».</>;

type Pote = {n: number; who: React.ReactNode};

const Num: React.FC<{n: number | string; x: number; y: number; col?: string; delay?: number}> = ({n, x, y, col = YEL, delay = 0}) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: 110, height: 110, borderRadius: 55, background: col,
    border: '7px solid #16121F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter',
    fontWeight: 900, fontSize: 62, color: NAVY, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>{n}</Pop>
);

// Les 6 potes (personnages génériques), du n°1 au n°5 ; le n°6, c'est P1 (toi).
const POTE: Record<number, (p: {x: number; y: number; w: number; expr?: any; talk?: boolean; delay?: number; look?: number}) => React.ReactNode> = {
  1: (p) => <Collegue {...p} hair="court" hairCol="#2A1A14" top="#E0533D" seed={71} />,
  2: (p) => <Collegue {...p} hair="chignon" hairCol="#6B3A1E" top="#36B37E" acc="lunettes" skin={['#F2C9A0', '#D9A77A']} seed={72} />,
  3: (p) => <Collegue {...p} hair="boucles" hairCol="#16121F" top="#F2A93B" skin={['#B07A52', '#8E5A36']} seed={73} />,
  4: (p) => <Collegue {...p} hair="chauve" top="#3D7BE0" skin={['#E8B48A', '#C98E62']} seed={74} />,
  5: (p) => <Collegue {...p} hair="court" hairCol="#C9A23A" top="#9B59D0" acc="bonnet" seed={75} />,
};

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <RestoBg />
      <Pill txt={PILL_B} col={YEL} fg={NAVY} />
      <Txt y={235} size={70}>Tous les groupes de potes<br />quand <Y>l'addition</Y> arrive :</Txt>
      <Addition total="186 €" sub="6 couverts" x={330} y={430} w={420} />
      {[1, 2, 3, 4, 5].map((n, i) => (
        <React.Fragment key={n}>{POTE[n]({x: 130 + i * 205, y: 880, w: 220, expr: 'neutral', look: 0})}</React.Fragment>
      ))}
      <Txt y={1150} size={52}>Il y en a 6. Le n°6,<br />c'est <Y>toujours le même</Y>.</Txt>
      <Caption y={1310} size={38} color={YEL}>Tag le pote qui « te fait un virement demain ».</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Profil: React.FC<{n: number; phrase: React.ReactNode; detail: React.ReactNode; expr: any; col: string; ok: boolean | null}> = (
  {n, phrase, detail, expr, col, ok},
) => (
  <SceneIn>
    <RestoBg tint={0.15} />
    <Pill txt={`${PILL_B} · N°${n}`} col={YEL} fg={NAVY} size={34} />
    <Num n={n} x={60} y={240} />
    <Pop delay={2} style={{position: 'absolute', left: 200, top: 240, width: 820}}>
      <div style={{background: 'white', borderRadius: 34, padding: '20px 28px', border: '7px solid #16121F',
        boxShadow: '0 10px 0 rgba(0,0,0,0.35)', fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: '#16121F',
        lineHeight: 1.15, textAlign: 'center'}}>{phrase}</div>
    </Pop>
    {POTE[n]({x: 540, y: 500, w: 620, expr, talk: true, delay: 2})}
    <Pop delay={12} from={80} style={{position: 'absolute', left: 80, top: 1215, width: 920, minHeight: 150, borderRadius: 24,
      background: 'rgba(10,14,44,0.94)', border: `5px solid ${col}`, boxShadow: `0 0 26px ${col}88`, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', gap: 26, padding: '18px 34px'}}>
      {ok === null ? null : <Check ok={ok} size={76} />}
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: 'white', lineHeight: 1.2}}>{detail}</div>
    </Pop>
    <Brand />
  </SceneIn>
);

const Six: React.FC = () => (
  <SceneIn>
    <MoodBg col={RED} dark={0.6} />
    <Pill txt="ET LE N°6 ?" col={YEL} fg={NAVY} />
    <Txt y={240} size={62}>Celui qui a avancé<br />les <Y>186 €</Y> avec sa carte…</Txt>
    <Num n={6} x={60} y={520} col={GREEN} delay={4} />
    <P1 x={560} y={480} w={420} expr="sad" talk delay={2} />
    <div style={{position: 'absolute', top: 960, left: 90, right: 90}}>
      {([['N°1', '31 €', true], ['N°2', '14,50 €', true], ['N°3', '« demain »', false], ['N°4', 'disparu', false],
        ['N°5', '« la prochaine »', false]] as const).map(([l, v, ok], i) => (
        <Pop key={l} delay={8 + i * 3} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 6,
          fontFamily: 'Inter', fontWeight: 800, fontSize: 42, color: 'white'}}>
          <Check ok={ok} size={50} /><span style={{width: 120}}>{l}</span>
          <span style={{color: ok ? GREEN : RED, marginLeft: 'auto'}}>{v}</span>
        </Pop>
      ))}
    </div>
    <Caption y={1300} size={48} color={YEL} delay={26}>Il te manque 140,50 €.</Caption>
    <Brand />
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <RestoBg tint={0.3} />
    <Caption y={190} size={72}>T'es lequel ?</Caption>
    <Caption y={300} size={54} color={YEL} delay={2}>Réponds avec son numéro.</Caption>
    <Caption y={400} size={42} delay={4}>{TAG_B}</Caption>
    <Addition total="186 €" sub="6 couverts" x={330} y={560} w={420} delay={2} />
    <EndLogo y={1150} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const B_DURATIONS = [2.8, 2.4, 2.4, 2.4, 2.4, 2.4, 2.8, 2.2];

export const AdditionArrive: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />,
        <Profil n={1} phrase={<>« On divise par 6,<br />c'est plus simple. »</>} expr="happy" col={GREEN} ok
          detail={<>A pris le plat le plus cher.<br /><span style={{color: GREEN}}>Rembourse 31 €.</span></>} />,
        <Profil n={2} phrase={<>« Moi, j'ai pris<br />qu'une salade. »</>} expr="angry" col={CYAN} ok
          detail={<>Calcule au centime.<br /><span style={{color: GREEN}}>Rembourse 14,50 €.</span></>} />,
        <Profil n={3} phrase={<>« Pas de liquide, je te fais<br />un virement demain. »</>} expr="cool" col={RED} ok={false}
          detail={<>Le virement de « demain »…<br /><span style={{color: RED}}>toujours en attente.</span></>} />,
        <Profil n={4} phrase={<>« Je reviens,<br />je vais aux toilettes. »</>} expr="worry" col={RED} ok={false}
          detail={<>Revient quand<br /><span style={{color: RED}}>tout est payé.</span></>} />,
        <Profil n={5} phrase={<>« Laisse, la prochaine,<br />c'est moi ! »</>} expr="happy" col={RED} ok={false}
          detail={<>La prochaine<br /><span style={{color: RED}}>n'arrive jamais.</span></>} />,
        <Six />, <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
