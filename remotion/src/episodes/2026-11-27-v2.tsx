// 27 nov. 2026 · B (v2) : « Réveillon · Cette année, c'est chez toi », refait dans la DA « cartoon premium 2.5D »
// (src/bl2/) avec voix off de personnages (Monsieur Découvert raconte, la famille parle). Découpage, voix, musique :
// episodes/2026-11-27.py (B2, B2_PROPS, music_b2).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Instant} from '../bl/anim';
import {Collegue, Decouvert, P1} from '../bl/persos';
import {Big, Brand2, C, Cam, Chip, EndCard, Flash, Grade, Headline, Hero, Layer, Line, Note2, Scenes2, Subs,
  useFonts2} from '../bl2/studio';
import {Glass, Pillar, Row, SalleAvant, SalleFond} from '../bl2/decors2';

const FPS = 30;
const LinesCtx = React.createContext<{lines: Line[]; starts: number[]}>({lines: [], starts: []});
/** Image (relative à la scène `si`) où le mot `w` est prononcé dans la réplique n°`li`. */
const useAt = (si: number, li: number, w?: string) => {
  const {lines, starts} = React.useContext(LinesCtx);
  const l = lines[li];
  if (!l) return 0;
  const k = w ? Math.max(0, l.text.indexOf(w)) / l.text.length : 0;
  return Math.round((l.t + k * l.d) * FPS) - starts[si];
};

type Ex = 'happy' | 'cool' | 'shock' | 'worry' | 'sad' | 'neutral' | 'angry';
type PP = {x: number; y: number; w: number; expr?: Ex; talk?: boolean; delay?: number; shake?: number};
const Tata: React.FC<PP> = (p) => <Collegue {...p} hair="chignon" hairCol="#7A4A2A" top="#2FA86A" acc="lunettes" seed={71} />;
const Tonton: React.FC<PP> = (p) => <Collegue {...p} hair="chauve" top="#3D5BD0" acc="cravate" skin={['#E0A878', '#C08458']} seed={73} />;
const Cousin: React.FC<PP> = (p) => <Collegue {...p} hair="court" top="#E0812A" acc="bonnet" seed={75} />;
const Mamie: React.FC<PP> = (p) => <Collegue {...p} hair="chignon" hairCol="#E4E4EC" top="#B04AC8" acc="lunettes" seed={79} />;
const Frere: React.FC<PP> = (p) => <Collegue {...p} hair="boucles" hairCol="#2A1A10" top="#1F1F2E" skin={['#C88A5A', '#A86A3C']} seed={77} />;

/** Voile sombre en haut de l'image pour détacher le titre du décor. */
const Scrim: React.FC<{h?: number}> = ({h = 760}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h,
    background: 'linear-gradient(180deg, rgba(14,4,24,0.82) 0%, rgba(14,4,24,0.55) 70%, transparent 100%)'}} />
);
const ENVOIE = 'Envoie ça à celui qui reçoit cette année.';

// ---- 0 · accroche (tout visible à l'image 0) ----
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Instant.Provider value>
      <Cam keys={[{f: 0, z: 1.12, y: 40}, {f: 120, z: 1.0, y: 0}]}>
        <SalleFond />
        <Layer d={1}>
          <Hero dim={false}><P1 x={560} y={760} w={420} expr="worry" look={-1} /></Hero>
          <Hero rim="#FF9A9A"><Decouvert x={210} y={900} w={250} expr="happy" talk={f > 6 && f < 60} label="" /></Hero>
        </Layer>
        <SalleAvant />
        <Scrim />
        <Layer d={0.12}>
          <Chip txt="RÉVEILLON DE NOËL" col={C.red} y={150} />
          <Headline y={225} size={98} words={['Cette', 'année,', '\n', 'le', 'réveillon,', '\n', "c'est", {t: 'chez toi.', c: C.yel}]} />
          <div style={{position: 'absolute', top: 560, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
            fontSize: 44, color: 'white', textShadow: '0 4px 0 rgba(0,0,0,0.6)'}}>
            Tout le monde « apporte un truc ».<br /><span style={{color: C.red}}>Devine qui paie le reste.</span>
          </div>
          <div style={{position: 'absolute', top: 680, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800,
            fontSize: 36, color: C.yel, textShadow: '0 3px 0 rgba(0,0,0,0.8)'}}>{ENVOIE}</div>
        </Layer>
      </Cam>
    </Instant.Provider>
  );
};

// ---- 1 · les invités ----
const INV = [
  {name: 'Tata · le pain', val: '4 €'}, {name: 'Tonton · « le vin »', val: '9 €'}, {name: 'Ton cousin · les glaçons', val: '2 €'},
  {name: 'Mamie · sa bonne humeur', val: '0 €'}, {name: 'Ton frère · la playlist', val: '0 €'},
];
const GUESTS = [Tata, Tonton, Cousin, Mamie, Frere];
const Invites: React.FC = () => {
  const f = useCurrentFrame();
  const at = [2, 3, 4, 5, 6].map((li) => useAt(1, li));
  const who = at.filter((a) => f >= a - 4).length - 1;
  const G = GUESTS[Math.max(0, who)];
  const punch = at.map((a) => ({f: a, z: 1.06})).flatMap((k, i) => [{f: k.f - 6, z: 1.0 + (i % 2) * 0.02, x: (i % 2 ? 20 : -20)}, k]);
  return (
    <Cam keys={[{f: 0, z: 1.0}, ...punch]}>
      <SalleFond />
      <Layer d={1}>
        <Sequence from={Math.max(0, at[Math.max(0, who)] - 6)} key={who} layout="none">
          <Hero speak><G x={540} y={700} w={430} expr="happy" talk /></Hero>
        </Sequence>
      </Layer>
      <SalleAvant />
      <Layer d={0.12}>
        <Chip txt="CE QU'APPORTENT LES INVITÉS" col={C.cyan} fg={C.navy} y={150} size={36} />
        <Glass x={110} y={225} w={800} col={C.cyan}>
          {INV.map((r, i) => <Row key={i} name={r.name} val={r.val} at={at[i] + 4} size={40} h={64} />)}
        </Glass>
      </Layer>
      <Brand2 />
    </Cam>
  );
};

// ---- 2 · total des invités ----
const TotalInv: React.FC = () => (
  <Cam keys={[{f: 0, z: 1.15}, {f: 60, z: 1.05}]}>
    <SalleFond />
    <Layer d={1}><Hero><Decouvert x={540} y={820} w={330} expr="happy" talk label="" /></Hero></Layer>
    <SalleAvant />
    <Layer d={0.12}>
      <Chip txt="TOTAL DES INVITÉS" col={C.cyan} fg={C.navy} />
      <Big y={300} size={260} sub="pour 5 personnes">15 €</Big>
    </Layer>
    <Brand2 />
  </Cam>
);

// ---- 3 · toi, qui reçois ----
const HOTE = [
  ['apéro', "L'apéro", '25 €'], ['entrée', "L'entrée", '30 €'], ['plat', 'Le plat', '60 €'], ['fromages', 'Les fromages', '25 €'],
  ['bûche', 'La bûche', '20 €'], ['déco', 'La déco de table', '15 €'], ['vrai vin', 'Le vrai vin', '30 €'],
] as const;
const Hote: React.FC = () => {
  const f = useCurrentFrame();
  const at = HOTE.map(([w]) => useAt(3, 8, w));
  const tot = useAt(3, 9);
  const shown = HOTE.reduce((a, [, , v], i) => a + (f >= at[i] ? parseInt(v, 10) : 0), 0);
  return (
    <Cam keys={[{f: 0, z: 1.0, y: -20}, {f: tot, z: 1.04, y: 30}, {f: tot + 20, z: 1.12, y: 60}]}>
      <SalleFond />
      <Layer d={1}><Hero><P1 x={560} y={980} w={330} expr={f < tot ? 'worry' : 'shock'} shake={f > tot ? 4 : 0} /></Hero></Layer>
      <SalleAvant full />
      <Layer d={0.12}>
        <Chip txt="TOI, QUI REÇOIS" col={C.red} />
        <Glass x={110} y={225} w={800} col={C.red}>
          {HOTE.map(([, n, v], i) => <Row key={i} name={n} val={v} at={at[i]} bad={i === 6} size={38} h={58} />)}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8,
            borderTop: `4px solid ${C.red}`}}>
            <span style={{fontFamily: 'Baloo2', fontWeight: 800, fontSize: 52, color: C.red}}>TOTAL</span>
            <span style={{fontFamily: 'Baloo2', fontWeight: 800, fontSize: 80, color: 'white', lineHeight: 1,
              transform: `scale(${f >= tot ? 1.15 : 1})`, textShadow: '0 4px 0 #7E1028'}}>{shown} €</span>
          </div>
        </Glass>
      </Layer>
      <Brand2 />
    </Cam>
  );
};

// ---- 4 · le bilan ----
const Bilan: React.FC = () => {
  const l2 = useAt(4, 11);
  return (
    <Cam keys={[{f: 0, z: 1.0}, {f: l2, z: 1.05, x: 30}, {f: l2 + 90, z: 1.1, x: 40}]}>
      <SalleFond />
      <Layer d={0.3}>
        <Chip txt="LE BILAN" col={C.yel} fg={C.navy} />
        <Pillar x={130} base={900} h={70} col={C.cyan} dark={C.cyanD} label="LES 5 INVITÉS" value="15 €" delay={4} />
        <Pillar x={560} base={900} h={480} col={C.red} dark={C.redD} label="TOI" value="205 €" delay={12} />
      </Layer>
      <Layer d={1}><Hero speak={false}><Decouvert x={300} y={1010} w={230} expr="happy" talk label="" delay={l2 - 10} /></Hero></Layer>
      <SalleAvant full />
      <Layer d={0.12}>
        <Sequence from={30} layout="none">
          <div style={{position: 'absolute', top: 1015, left: 470, right: 120, textAlign: 'center'}}>
            <span style={{display: 'inline-block', background: C.yel, color: C.navy, fontFamily: 'Baloo2', fontWeight: 800,
              fontSize: 46, padding: '6px 22px 0', borderRadius: 18, boxShadow: '0 6px 0 #B8650A'}}>À 6 : 36,67 € chacun</span>
          </div>
        </Sequence>
        <Note2 y={1120}>Montants d'exemple</Note2>
      </Layer>
      <Brand2 />
    </Cam>
  );
};

// ---- 5 · le retournement ----
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const hein = useAt(5, 13);
  const k = interpolate(f, [hein - 4, hein + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Cam keys={[{f: 0, z: 1.1, x: -120}, {f: hein - 6, z: 1.18, x: -150}, {f: hein, z: 1.35, x: 160, y: 40}]} hand={1.5}>
      <SalleFond />
      <Layer d={1}>
        <Hero speak={f < hein} dim={f >= hein}><Mamie x={300} y={720} w={420} expr="happy" talk={f < hein - 4} /></Hero>
        <Hero speak={f >= hein} dim={f < hein}><P1 x={790} y={760} w={400} expr={f < hein ? 'happy' : 'shock'} shake={f >= hein ? 6 : 0} /></Hero>
      </Layer>
      <SalleAvant full />
      <Layer d={0.12}>
        <Chip txt="MINUIT · FIN DU REPAS" col={C.violet} />
        <div style={{position: 'absolute', top: 1040, left: 0, right: 0, textAlign: 'center', opacity: k,
          transform: `rotate(-6deg) scale(${0.6 + 0.4 * k})`}}>
          <span style={{display: 'inline-block', background: C.red, color: 'white', fontFamily: 'Baloo2', fontWeight: 800, fontSize: 64,
            padding: '6px 30px 0', borderRadius: 20, border: '6px solid white', boxShadow: `0 0 40px ${C.red}`}}>ON REFAIT CHEZ TOI !</span>
        </div>
      </Layer>
    </Cam>
  );
};

// ---- 6 · question + carte de fin ----
const Fin: React.FC<{len: number}> = ({len}) => {
  const f = useCurrentFrame();
  const end = len - 60;
  return (
    <Cam keys={[{f: 0, z: 1.08}, {f: len, z: 1.0}]}>
      <SalleFond />
      <Layer d={1}><Hero><P1 x={540} y={650} w={300} expr="cool" /></Hero></Layer>
      <SalleAvant full />
      <Layer d={0.12}>
        <Headline y={170} size={76} stagger={2} words={["T'es", 'plutôt', {t: 'pain,', c: C.yel}, '\n', {t: 'glaçons,', c: C.cyan},
          {t: 'playlist…', c: C.green}, '\n', 'ou', {t: 'celui qui reçoit ?', c: C.red}]} />
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
          fontSize: 40, color: C.yel, textShadow: '0 3px 0 rgba(0,0,0,0.7)'}}>Réponds avec un mot.</div>
        {f >= end ? (
          <Sequence from={end} layout="none">
            <div style={{position: 'absolute', top: 1000, left: 60, right: 120, textAlign: 'center', fontFamily: 'Inter',
              fontWeight: 800, fontSize: 36, color: 'white', textShadow: '0 3px 0 rgba(0,0,0,0.7)'}}>{ENVOIE}</div>
            <EndCard y={1080} note="Montants d'exemple" />
          </Sequence>
        ) : null}
      </Layer>
    </Cam>
  );
};

export const B2_DURATIONS = [4.0, 6.67, 2.15, 6.44, 7.07, 3.65, 4.2];

export const ReveillonChezToi2: React.FC<{durations: number[]; audio?: string; lines?: Line[]}> = ({durations, audio, lines = []}) => {
  useFonts2();
  const starts: number[] = [];
  durations.reduce((a, d) => { starts.push(a); return a + Math.round(d * FPS); }, 0);
  const last = Math.round(durations[6] * FPS);
  return (
    <LinesCtx.Provider value={{lines, starts}}>
      <AbsoluteFill style={{background: '#12061A'}}>
        <Scenes2 durations={durations} trans={['cut', 'whip', 'zoom', 'whip', 'iris', 'zoom', 'whip']} scenes={[
          <Hook />, <Invites />, <TotalInv />, <Hote />, <Bilan />, <Twist />, <Fin len={last} />,
        ]} />
        <Flash at={starts.slice(1)} />
        <Subs lines={lines} y={1225} />
        <Grade />
        {audio ? <Audio src={staticFile(audio)} /> : null}
      </AbsoluteFill>
    </LinesCtx.Provider>
  );
};
