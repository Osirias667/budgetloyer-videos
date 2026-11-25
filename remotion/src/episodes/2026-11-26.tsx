// 26 nov. 2026 · A : « Les guirlandes de ton père · Devine la facture » (3 réponses, pari, les 3 sont bonnes, boss gonflable) ;
// B : « Calendrier de l'Avent · Ton coloc a tout ouvert » (retour en arrière, portes à la chaîne, compteur d'euros).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-26.py.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts, useTween} from '../bl/anim';
import {FacadeBg, MoodBg, SalonNoelBg} from '../bl/decors';
import {Calendrier, Collegue, Gonflable, P1} from '../bl/persos';
import {CYAN, GREEN, GREY, NAVY, RED, VIOLET, YEL, eur} from '../bl/theme';
import {Brand, Caption, EndLogo, Feuille, Horloge, Option, Pill, Roll, Stamp, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 30, color: GREY, textShadow: '0 2px 0 rgba(0,0,0,0.6)'}}>{children}</div>
);

const Decompte: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const n = f < 12 ? null : f < 24 ? 3 : f < 36 ? 2 : 1;
  if (n === null) return null;
  const k = interpolate((f - 12) % 12, [0, 4, 12], [1.4, 1, 0.95], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${k})`, fontFamily: 'Inter',
      fontWeight: 900, fontSize: 130, color: YEL, textShadow: `0 0 40px ${YEL}88, 0 8px 0 rgba(0,0,0,0.5)`}}>{n}</div>
  );
};

// =============================== A : Les guirlandes de ton père ===============================
const SRC_A = 'Estimations Selectra · kWh à 0,1952 €';
const ENVOIE_A = 'Envoie ça à ton père.';
const Papa: React.FC<{x: number; y: number; w: number; expr?: 'happy' | 'cool' | 'shock' | 'worry' | 'neutral'; talk?: boolean;
  shake?: number}> = ({x, y, w, expr = 'cool', talk, shake}) => (
  <Collegue x={x} y={y} w={w} expr={expr} talk={talk} shake={shake} hair="chauve" acc="lunettes" top="#C8263A"
    skin={['#F2C9A0', '#DDA57A']} seed={57} />
);
const OPTS: [string, string, string][] = [['A', '≈ 1 €', CYAN], ['B', '≈ 12 €', YEL], ['C', '≈ 40 €', RED]];
const Opts: React.FC<{y: number; lit?: number[]; h?: number}> = ({y, lit, h = 150}) => (
  <>
    {OPTS.map(([l, t, c], i) => (
      <Option key={l} x={70 + i * 320} y={y} w={300} h={h} letter={l} title={t} sub="" col={c}
        state={lit ? (lit.includes(i) ? 'pick' : 'off') : 'on'} at={lit ? 6 : 0} />
    ))}
  </>
);

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <FacadeBg mode="ampoules" />
      <Pill txt="DÉCO DE NOËL · DEVINE LA FACTURE" col={YEL} fg={NAVY} size={40} />
      <Txt y={228} size={56}>Ton père et ses guirlandes :<br /><Y>combien sur la facture</Y><br />d'électricité pour 1 mois ?</Txt>
      <Opts y={470} h={130} />
      <Papa x={540} y={760} w={420} expr="cool" />
      <Caption y={1240} size={44} color={YEL}>{ENVOIE_A}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const APari: React.FC = () => (
  <SceneIn>
    <FacadeBg mode="ampoules" tint={0.55} />
    <Pill txt="TON PARI ?" col={VIOLET} size={44} />
    <Txt y={240} size={46}>Un sapin + 2 guirlandes<br />allumés <Y>de 17 h à 1 h</Y>, pendant 31 jours.</Txt>
    <Opts y={440} />
    <Decompte y={640} />
    <Papa x={540} y={860} w={360} expr="happy" talk />
    <Brand />
  </SceneIn>
);

const Reveal: React.FC<{mode: 'led' | 'ampoules' | 'jardin'; idx: number; pill: string; col: string; big: React.ReactNode;
  line: React.ReactNode; expr: 'cool' | 'shock' | 'worry'; note: string; stamp?: string}> = (
  {mode, idx, pill, col, big, line, expr, note, stamp},
) => (
  <SceneIn>
    <FacadeBg mode={mode} tint={0.35} />
    <Pill txt={pill} col={col} fg={col === RED ? 'white' : NAVY} size={42} />
    <Opts y={240} lit={[idx]} h={120} />
    <Pop delay={6} style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 112, color: 'white', lineHeight: 1,
        textShadow: `0 0 40px ${col}, 0 6px 0 rgba(0,0,0,0.5)`}}>{big}</div>
    </Pop>
    <Caption y={560} size={46} delay={12}>{line}</Caption>
    <Papa x={300} y={860} w={340} expr={expr} talk={expr === 'cool'} shake={expr === 'shock' ? 4 : 0} />
    {stamp ? <Stamp txt={stamp} col={GREEN} y={1150} delay={30} size={64} /> : null}
    <Note y={1350}>{note}</Note>
    <Brand />
  </SceneIn>
);

const AGonflable: React.FC = () => (
  <SceneIn>
    <FacadeBg mode="jardin" tint={0.45} />
    <Pill txt="LE BOSS FINAL" col={RED} size={44} />
    <Txt y={240} size={52}>Le Père Noël gonflable<br />allumé <Y c={RED}>24 h/24</Y> :</Txt>
    <Pop delay={8} style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 104, color: 'white', textShadow: `0 0 40px ${RED}`}}>
        près de 15 €
      </div>
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: YEL}}>à lui tout seul, sur le mois</div>
    </Pop>
    <Gonflable x={330} y={640} w={380} expr="happy" talk />
    <Papa x={800} y={900} w={300} expr="shock" shake={3} />
    <Caption y={1260} size={42} delay={30}>8 h par jour : <Y c={GREEN}>3 à 5 €</Y>.</Caption>
    <Note y={1350}>{SRC_A}</Note>
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <FacadeBg mode="led" tint={0.45} />
    <Caption y={170} size={60}>Chez toi, c'est plutôt<br /><Y c={CYAN}>A</Y>, <Y>B</Y> ou <Y c={RED}>C</Y> ?</Caption>
    <Caption y={380} size={42} color={YEL}>Réponds avec une lettre.</Caption>
    <Papa x={540} y={520} w={300} expr="happy" />
    <Caption y={900} size={40}>{ENVOIE_A}</Caption>
    <EndLogo y={1060} note={SRC_A} />
  </SceneIn>
);

export const A_DURATIONS = [3.2, 2.4, 2.6, 2.6, 2.6, 2.8, 2.0];

export const GuirlandesPapa: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />, <APari />,
        <Reveal mode="led" idx={0} pill="TOUT EN LED" col={CYAN} big="0,96 €" expr="cool"
          line={<>15 à 20 W en tout. <Y c={CYAN}>Moins de 1 € le mois.</Y></>} note={SRC_A} />,
        <Reveal mode="ampoules" idx={1} pill="LES VIEILLES AMPOULES" col={YEL} big="12,10 €" expr="worry"
          line={<>Jusqu'à 250 W : <Y>12 fois plus</Y>.</>} note={SRC_A} />,
        <Reveal mode="jardin" idx={2} pill="JARDIN + PROJECTEURS" col={RED} big="30 à 40 €" expr="shock"
          line={<>Halogènes et guirlandes partout.</>} note={SRC_A} stamp="LES 3 SONT BONNES" />,
        <AGonflable />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Calendrier de l'Avent · Ton coloc a tout ouvert ===============================
const SRC_B = 'Prix médian de 129 calendriers 2026 · touteslesbox.fr';
const ENVOIE_B = 'Envoie ça au coloc qui ouvre tout le 1er.';
const Coloc: React.FC<{x: number; y: number; w: number; expr?: 'happy' | 'cool' | 'shock' | 'worry' | 'sad' | 'neutral';
  talk?: boolean; shake?: number}> = ({x, y, w, expr = 'happy', talk, shake}) => (
  <Collegue x={x} y={y} w={w} expr={expr} talk={talk} shake={shake} hair="boucles" hairCol="#5A2E1A" top="#3D7BE0"
    skin={['#E0A878', '#C08458']} acc="bonnet" seed={63} />
);
// Miettes de chocolat sur la joue du coloc
const Miettes: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg width={80} height={60} style={{position: 'absolute', left: x, top: y}}>
    <circle cx={20} cy={20} r={9} fill="#6B3A1E" /><circle cx={44} cy={34} r={7} fill="#6B3A1E" /><circle cx={60} cy={16} r={5} fill="#6B3A1E" />
  </svg>
);

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <SalonNoelBg tint={0.3} />
      <Pill txt="MARDI 1ER DÉCEMBRE · 7 H 12" col={RED} size={42} />
      <Txt y={232} size={58}>Ton coloc a ouvert<br /><Y>les 24 cases</Y> du calendrier<br />de l'Avent.</Txt>
      <Calendrier x={300} y={560} w={380} opened={24} eaten expr="shock" />
      <Coloc x={790} y={700} w={360} expr="happy" />
      <Miettes x={760} y={840} />
      <Caption y={1170} size={52}>59 € partis <Y c={RED}>en 4 minutes</Y>.</Caption>
      <Caption y={1260} size={38} color={YEL}>{ENVOIE_B}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Rewind: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <SalonNoelBg tint={0.45} />
      <Pill txt="◀◀ 5 JOURS AVANT" col={VIOLET} size={44} />
      <Feuille jour="JEUDI" num="26" mois="NOVEMBRE" x={760} y={560} w={200} delay={2} />
      <Txt y={290} size={50}>Le calendrier arrive.<br /><Y>59 €</Y>, pile le prix médian.</Txt>
      <Calendrier x={400} y={520} w={380} opened={0} expr="happy" talk label="59 €" />
      <Coloc x={880} y={980} w={260} expr="happy" talk={f > 30} />
      <Caption y={1230} size={42} delay={30}>« Une case par jour. Promis. »</Caption>
      <Note y={1340}>{SRC_B}</Note>
      <Brand />
    </SceneIn>
  );
};

const Calcul: React.FC = () => (
  <SceneIn>
    <MoodBg col={GREEN} dark={0.65} />
    <Pill txt="LE CALCUL" col={GREEN} fg={NAVY} size={44} />
    <Txt y={250} size={64}>59 € ÷ 24 cases</Txt>
    <Pop delay={10} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: 'white', lineHeight: 1,
        textShadow: `0 0 40px ${GREEN}`}}><Roll a={0} b={2.46} f0={10} f1={34} dec={2} /></div>
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 48, color: GREEN}}>la case</div>
    </Pop>
    <Calendrier x={540} y={660} w={300} opened={1} expr="cool" />
    <Caption y={1130} size={40} delay={30}>En médiane : chocolat <Y>1,62 €</Y> · beauté <Y>3,94 €</Y></Caption>
    <Note y={1260}>Une case coûte en médiane 2,46 € · touteslesbox.fr, 2026</Note>
    <Brand />
  </SceneIn>
);

const Case1: React.FC = () => {
  const o = useTween(20, 34, 0, 1);
  return (
    <SceneIn>
      <SalonNoelBg tint={0.35} />
      <Horloge h="07:08" jour="MAR. 1ER DÉC." x={350} y={220} col={GREEN} />
      <Calendrier x={330} y={500} w={380} opened={o} expr="happy" />
      <Coloc x={800} y={720} w={340} expr="happy" talk />
      <Caption y={1180} size={54} delay={4}>« Juste <Y>la case 1</Y>. »</Caption>
      <Brand />
    </SceneIn>
  );
};

const Frenzy: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 64], [1, 24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const h = f < 22 ? '07:09' : f < 42 ? '07:10' : f < 60 ? '07:11' : '07:12';
  return (
    <SceneIn>
      <SalonNoelBg tint={0.35} />
      <Horloge h={h} jour="MAR. 1ER DÉC." x={350} y={220} col={f < 60 ? YEL : RED} />
      <Calendrier x={330} y={500} w={380} opened={o} eaten={f > 66} expr="shock" shake={f < 64 ? 3 : 0} />
      <Coloc x={800} y={720} w={340} expr={f < 64 ? 'happy' : 'shock'} talk={f < 64} shake={f < 64 ? 2 : 0} />
      {f > 40 ? <Miettes x={770} y={860} /> : null}
      <Caption y={1080} size={48}>« …et la 2, pour goûter. »</Caption>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1180, height: 130, borderRadius: 26, background: 'rgba(10,14,44,0.94)',
        border: `6px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
        boxSizing: 'border-box', fontFamily: 'Inter', fontWeight: 900}}>
        <span style={{fontSize: 46, color: RED}}>{Math.floor(o)}/24</span>
        <span style={{fontSize: 80, color: 'white'}}>{eur(Math.floor(o) * 59 / 24, 2)}</span>
      </div>
      <Brand />
    </SceneIn>
  );
};

const Lendemain: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.5} />
    <Feuille jour="MERCREDI" num="2" mois="DÉCEMBRE" x={760} y={470} w={200} delay={2} />
    <Txt y={260} size={52}>Il reste <Y>22 jours</Y>…<br />et <Y c={RED}>0 case</Y>.</Txt>
    <Calendrier x={330} y={520} w={340} opened={24} eaten expr="sad" />
    <Coloc x={800} y={780} w={300} expr="sad" />
    <Caption y={1120} size={46} delay={18}>Ton budget de décembre,<br />c'est <Y>pareil</Y> : tout ouvrir le 1er…</Caption>
    <Caption y={1290} size={42} delay={34} color={RED}>…et le 2, il ne reste rien.</Caption>
    <Brand />
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.35} />
    <Caption y={170} size={60}>Team <Y c={GREEN}>une case par jour</Y><br />ou team <Y c={RED}>tout le 1er</Y> ?</Caption>
    <Caption y={380} size={42} color={YEL}>Réponds 1 ou 24.</Caption>
    <Calendrier x={540} y={500} w={260} opened={24} eaten expr="shock" />
    <Caption y={900} size={38}>{ENVOIE_B}</Caption>
    <EndLogo y={1060} note={SRC_B} />
  </SceneIn>
);

export const B_DURATIONS = [3.0, 2.6, 2.6, 2.6, 2.8, 2.8, 2.0];

export const CalendrierAventColoc: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[<BHook />, <Rewind />, <Calcul />, <Case1 />, <Frenzy />, <Lendemain />, <BEnd />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
