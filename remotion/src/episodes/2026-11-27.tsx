// 27 nov. 2026 · A : « Chauffage · Le match : Pull contre Radiateur » (3 rounds, score, pari à 3 réponses avant le round 3) ;
// B : « Réveillon · Cette année, c'est chez toi » (liste qui se remplit, invités contre hôte, chute qui boucle).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-27.py.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {MoodBg, ReveillonBg, SalonNoelBg} from '../bl/decors';
import {Collegue, P1, Pull, Radiateur} from '../bl/persos';
import {CYAN, GREEN, GREY, NAVY, RED, VIOLET, YEL} from '../bl/theme';
import {Brand, Caption, EndLogo, Option, Pill, Roll, Score, Splits, Stamp, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 30, color: GREY, textShadow: '0 2px 0 rgba(0,0,0,0.6)'}}>{children}</div>
);

const Tag: React.FC<{x: number; y: number; col: string; children: React.ReactNode}> = ({x, y, col, children}) => (
  <div style={{position: 'absolute', left: x - 170, top: y, width: 340, textAlign: 'center'}}>
    <span style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: NAVY, background: col, padding: '6px 20px',
      borderRadius: 14, boxShadow: `0 0 22px ${col}99`}}>{children}</span>
  </div>
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

// =============================== A : Chauffage · Pull contre Radiateur ===============================
const LX = 300, RX = 760; // centres des deux personnages (loin du bord droit)
const ENVOIE_A = 'Envoie ça à celui qui monte le chauffage.';
const SRC_GAZ = 'Prix repère du gaz, CRE · via choisir.com, 26 nov. 2026';
const SRC_ADEME = 'ADEME, guide « Hiver tout confort »';

const Thermo: React.FC<{a: number; b: number; f0: number; f1: number; y: number}> = ({a, b, f0, f1, y}) => {
  const f = useCurrentFrame();
  const v = f < f0 ? a : f >= f1 ? b : a + (b - a) * (f - f0) / (f1 - f0);
  return (
    <div style={{position: 'absolute', left: 340, top: y, width: 400, height: 170, borderRadius: 40, background: '#0A0E2C',
      border: `7px solid ${f >= f1 ? GREEN : YEL}`, boxShadow: `0 0 30px ${f >= f1 ? GREEN : YEL}88`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 110, color: 'white'}}>
      {Math.round(v)} °C
    </div>
  );
};

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <SalonNoelBg />
      <Pill txt="CHAUFFAGE · LE MATCH" col={RED} size={44} />
      <Txt y={232} size={58}>Pull ou chauffage à fond :<br />qui gagne le match<br />de <Y>la facture</Y> ?</Txt>
      <Pull x={LX} y={560} w={330} expr="cool" look={1} cozy />
      <Radiateur x={RX} y={560} w={320} expr="angry" look={-1} heat={0.9} />
      <div style={{position: 'absolute', left: 470, top: 700, width: 140, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
        fontSize: 86, color: YEL, textShadow: `0 0 30px ${YEL}, 0 6px 0 rgba(0,0,0,0.5)`}}>VS</div>
      <Tag x={LX} y={1000} col={GREEN}>LE PULL</Tag>
      <Tag x={RX} y={1000} col={RED}>LE RADIATEUR</Tag>
      <Caption y={1090} size={46}>Le gaz augmente <Y>le 1er décembre</Y>.</Caption>
      <Caption y={1190} size={50}>3 rounds. <Y>Réponse au 3e.</Y></Caption>
      <Caption y={1290} size={38} color={YEL}>{ENVOIE_A}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Actu: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.3} />
    <Pill txt="ROUND 1 · L'ACTU" col={YEL} fg={NAVY} size={44} />
    <Score left="PULL" right="RADIATEUR" a={1} b={0} y={240} hit="L" at={40} colR={RED} />
    <Pop delay={4} style={{position: 'absolute', left: 0, right: 0, top: 460, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: 'white'}}>Prix repère du gaz au 1er décembre</div>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 130, color: RED, lineHeight: 1.05,
        textShadow: `0 0 40px ${RED}88, 0 6px 0 rgba(0,0,0,0.5)`}}>+5,8 %</div>
    </Pop>
    <Pull x={LX} y={720} w={260} expr="happy" talk />
    <Radiateur x={RX} y={720} w={260} expr="shock" heat={0.9} shake={3} />
    <Caption y={1030} size={46} delay={20}>≈ <Y c={RED}>16 € de plus</Y> sur la facture<br />de décembre <Y>(offres indexées)</Y>.</Caption>
    <Note y={1230}>{SRC_GAZ}</Note>
    <Brand />
  </SceneIn>
);

const Confort: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.3} />
    <Pill txt="ROUND 2 · LE CONFORT" col={YEL} fg={NAVY} size={44} />
    <Score left="PULL" right="RADIATEUR" a={1} b={1} y={240} hit="R" at={26} colR={RED} />
    <Pull x={LX} y={500} w={290} expr="worry" />
    <Radiateur x={RX} y={500} w={290} expr="happy" talk heat={0.8} />
    <Caption y={890} size={52} delay={6}>Les mains gelées ?<br /><Y c={RED}>Le radiateur</Y> gagne.</Caption>
    <Caption y={1080} size={42} delay={22} color={GREY}>…et le pull gratte un peu.</Caption>
    <Brand />
  </SceneIn>
);

const OPTS: [string, string, string][] = [['A', '1 %', CYAN], ['B', '7 %', YEL], ['C', '20 %', RED]];
const Opts: React.FC<{y: number; lit?: number; h?: number}> = ({y, lit, h = 150}) => (
  <>
    {OPTS.map(([l, t, c], i) => (
      <Option key={l} x={70 + i * 320} y={y} w={300} h={h} letter={l} title={t} sub="" col={c}
        state={lit === undefined ? 'on' : lit === i ? 'pick' : 'off'} at={lit === undefined ? 0 : 4} />
    ))}
  </>
);

const Pari: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="ROUND 3 · 1 °C EN MOINS" col={RED} size={44} />
    <Txt y={250} size={54}>Baisser le chauffage <Y>d'1 °C</Y> :<br />combien d'énergie économisée ?</Txt>
    <Opts y={460} />
    <Caption y={690} size={62}>Ton pari ?</Caption>
    <Decompte y={800} />
    <Brand />
  </SceneIn>
);

const Round3: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.4} />
    <Pill txt="ROUND 3 · 1 °C EN MOINS" col={RED} size={44} />
    <Opts y={240} lit={1} h={120} />
    <Thermo a={20} b={19} f0={6} f1={14} y={410} />
    <Pop delay={14} style={{position: 'absolute', left: 0, right: 0, top: 610, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 120, color: 'white', lineHeight: 1,
        textShadow: `0 0 40px ${GREEN}, 0 6px 0 rgba(0,0,0,0.5)`}}>−7 %</div>
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 42, color: GREEN}}>d'énergie pour le chauffage</div>
    </Pop>
    <Score left="PULL" right="RADIATEUR" a={2} b={1} y={880} hit="L" at={48} colR={RED} />
    <Caption y={1110} size={44} delay={50}>Le pull permet de <Y c={GREEN}>baisser d'1 °C</Y>.</Caption>
    <Note y={1230}>« 1 °C en moins = 7 % d'économie » · {SRC_ADEME}</Note>
    <Brand />
  </SceneIn>
);

const Verdict: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.3} />
    <Pill txt="SCORE FINAL · 2-1" col={YEL} fg={NAVY} size={44} />
    <Txt y={240} size={54}>Le vrai combo de l'hiver :<br /><Y c={GREEN}>le pull</Y> + <Y>19 °C</Y>.</Txt>
    <Pull x={230} y={520} w={250} expr="cool" cozy />
    <P1 x={540} y={560} w={280} expr="happy" talk />
    <Radiateur x={850} y={560} w={220} expr="happy" heat={0.4} />
    <Caption y={950} size={46} delay={14}>Le radiateur reste.<br />Il travaille juste <Y>un peu moins</Y>.</Caption>
    <Note y={1170}>19 °C en hiver pour les pièces occupées · info.gouv.fr</Note>
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.35} />
    <Caption y={170} size={58}>Chez toi, le thermostat<br />est sur <Y>combien</Y> ?</Caption>
    <Caption y={380} size={42} color={YEL}>Réponds avec un chiffre.</Caption>
    <Pull x={360} y={520} w={240} expr="happy" talk />
    <Radiateur x={720} y={540} w={220} expr="cool" heat={0.5} />
    <Caption y={900} size={40}>{ENVOIE_A}</Caption>
    <EndLogo y={1060} note="Sources : CRE via choisir.com · ADEME" />
  </SceneIn>
);

export const A_DURATIONS = [3.2, 2.8, 2.4, 2.4, 2.8, 2.6, 2.0];

export const ChauffageMatch: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[<AHook />, <Actu />, <Confort />, <Pari />, <Round3 />, <Verdict />, <AEnd />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Réveillon · Cette année, c'est chez toi ===============================
const ENVOIE_B = 'Envoie ça à celui qui reçoit cette année.';
const EX = 'Montants d\'exemple';
type Ex = 'happy' | 'cool' | 'shock' | 'worry' | 'sad' | 'neutral';
const Tata: React.FC<{x: number; y: number; w: number; expr?: Ex; talk?: boolean; delay?: number}> = (p) => (
  <Collegue {...p} hair="chignon" hairCol="#7A4A2A" top="#2FA86A" acc="lunettes" seed={71} />
);
const Tonton: React.FC<{x: number; y: number; w: number; expr?: Ex; talk?: boolean; delay?: number}> = (p) => (
  <Collegue {...p} hair="chauve" top="#3D5BD0" acc="cravate" skin={['#E0A878', '#C08458']} seed={73} />
);
const Mamie: React.FC<{x: number; y: number; w: number; expr?: Ex; talk?: boolean; delay?: number}> = (p) => (
  <Collegue {...p} hair="chignon" hairCol="#D8D8E0" top="#B04AC8" acc="lunettes" seed={79} />
);

const LIST_INV = [
  {name: 'Tata : le pain', val: '4 €'},
  {name: 'Tonton : « le vin »', val: '9 €'},
  {name: 'Ton cousin : les glaçons', val: '2 €'},
  {name: 'Mamie : sa bonne humeur', val: '0 €'},
  {name: 'Ton frère : la playlist', val: '0 €'},
];
const LIST_HOTE = [
  {name: "L'apéro", val: '25 €'}, {name: "L'entrée", val: '30 €'}, {name: 'Le plat', val: '60 €'},
  {name: 'Les fromages', val: '25 €'}, {name: 'La bûche', val: '20 €'}, {name: 'La déco de table', val: '15 €'},
  {name: 'Le vrai vin', val: '30 €', bad: true},
];

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <ReveillonBg tint={0.35} empty />
      <Pill txt="RÉVEILLON · CETTE ANNÉE, C'EST CHEZ TOI" col={RED} size={38} />
      <Txt y={228} size={54}>Tout le monde <Y>« apporte un truc »</Y>.<br />Devine qui paie <Y c={RED}>le reste</Y>.</Txt>
      <Splits rows={LIST_INV} at={[999, 999, 999, 999, 999]} y={420} rowH={70} dim={0.6} />
      <P1 x={540} y={820} w={260} expr="worry" />
      <Caption y={1110} size={38} color={YEL}>{ENVOIE_B}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Invites: React.FC = () => {
  const f = useCurrentFrame();
  const who = f < 15 ? 0 : f < 30 ? 1 : f < 45 ? 2 : f < 60 ? 3 : 4;
  return (
    <SceneIn>
      <ReveillonBg tint={0.35} empty />
      <Pill txt="LES INVITÉS" col={CYAN} fg={NAVY} size={44} />
      <Splits rows={LIST_INV} at={[6, 21, 36, 51, 66]} y={240} rowH={70} />
      {who === 0 ? <Tata x={540} y={720} w={300} expr="happy" talk /> : null}
      {who === 1 ? <Tonton x={540} y={720} w={300} expr="cool" talk /> : null}
      {who === 2 ? <Collegue x={540} y={720} w={300} expr="happy" talk hair="court" top="#E0812A" seed={75} /> : null}
      {who === 3 ? <Mamie x={540} y={720} w={300} expr="happy" talk /> : null}
      {who === 4 ? <Collegue x={540} y={720} w={300} expr="cool" talk hair="boucles" hairCol="#2A1A10" top="#1F1F2E" seed={77} /> : null}
      <Note y={1140}>{EX}</Note>
      <Brand />
    </SceneIn>
  );
};

const TotalInv: React.FC = () => (
  <SceneIn>
    <ReveillonBg tint={0.35} empty />
    <Pill txt="TOTAL DES INVITÉS" col={CYAN} fg={NAVY} size={44} />
    <Pop delay={4} style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 200, color: 'white', lineHeight: 1,
        textShadow: `0 0 40px ${CYAN}`}}><Roll a={0} b={15} f0={6} f1={24} /></div>
      <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: CYAN}}>à 5 personnes</div>
    </Pop>
    <P1 x={540} y={700} w={300} expr="neutral" />
    <Caption y={1080} size={50} delay={20}>Et maintenant… <Y>ta liste</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const Hote: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <ReveillonBg tint={0.4} />
      <Pill txt="TOI, QUI REÇOIS" col={RED} size={44} />
      <Splits rows={LIST_HOTE} at={[4, 15, 26, 37, 48, 59, 70]} y={240} rowH={64}
        total={{a: 0, b: 205, f0: 4, f1: 76, col: RED, steps: [25, 30, 60, 25, 20, 15, 30]}} />
      <P1 x={540} y={1010} w={250} expr={f < 60 ? 'worry' : 'shock'} shake={f > 70 ? 3 : 0} />
      <Note y={850}>{EX}</Note>
      <Brand />
    </SceneIn>
  );
};

const Col: React.FC<{x: number; titre: string; v: number; col: string; delay: number; big?: boolean}> = ({x, titre, v, col, delay, big}) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: 260, width: 400, height: 330, borderRadius: 30, boxSizing: 'border-box',
    background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, boxShadow: big ? `0 0 46px ${col}` : `0 0 18px ${col}55`,
    textAlign: 'center', paddingTop: 34}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: col}}>{titre}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 120, color: 'white', lineHeight: 1.3}}>
      <Roll a={0} b={v} f0={delay + 4} f1={delay + 22} />
    </div>
  </Pop>
);

const Compare: React.FC = () => (
  <SceneIn>
    <ReveillonBg tint={0.45} />
    <Pill txt="LE BILAN" col={YEL} fg={NAVY} size={44} />
    <Col x={90} titre="LES 5 INVITÉS" v={15} col={CYAN} delay={2} />
    <Col x={560} titre="TOI" v={205} col={RED} delay={8} big />
    <Caption y={660} size={48} delay={26}>Partagé à 6 :<br /><Y>36,67 € chacun</Y>.</Caption>
    <Caption y={880} size={42} delay={40} color={GREY}>Le total, ça se dit<br /><Y c={GREEN}>avant</Y> d'envoyer les invitations.</Caption>
    <Note y={1100}>{EX}</Note>
    <Brand />
  </SceneIn>
);

const Twist: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <ReveillonBg tint={0.3} empty />
      <Pill txt="MINUIT · FIN DU REPAS" col={VIOLET} size={44} />
      <Mamie x={300} y={560} w={330} expr="happy" talk={f < 50} />
      <P1 x={760} y={600} w={300} expr={f < 34 ? 'happy' : 'shock'} shake={f > 34 ? 4 : 0} />
      <Caption y={260} size={52} delay={4}>« C'était parfait !<br />L'an prochain… »</Caption>
      <Stamp txt="ON REFAIT CHEZ TOI !" col={RED} y={1030} delay={30} size={64} />
      <Brand />
    </SceneIn>
  );
};

const BEnd: React.FC = () => (
  <SceneIn>
    <ReveillonBg tint={0.4} empty />
    <Caption y={170} size={54}>Toi, t'es plutôt <Y>pain</Y>,<br /><Y>glaçons</Y>, <Y>playlist</Y>…<br />ou <Y c={RED}>celui qui reçoit</Y> ?</Caption>
    <Caption y={480} size={42} color={YEL}>Réponds avec un mot.</Caption>
    <P1 x={540} y={580} w={260} expr="cool" />
    <Caption y={900} size={40}>{ENVOIE_B}</Caption>
    <EndLogo y={1030} note={EX} />
  </SceneIn>
);

export const B_DURATIONS = [3.0, 3.2, 2.2, 3.4, 2.6, 2.4, 2.0];

export const ReveillonChezToi: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[<BHook />, <Invites />, <TotalInv />, <Hote />, <Compare />, <Twist />, <BEnd />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
