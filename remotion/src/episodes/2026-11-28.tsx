// 28 nov. 2026 · DA « cartoon premium 2.5D » (src/bl2/) + voix off de personnages (ElevenLabs par le connecteur).
// A : « Inflation · Le podium des hausses » (Insee, estimation provisoire du 27 nov. 2026).
// B : « Paie · Les 72 premières heures » (histoire à l'horloge, montants d'exemple).
// Découpage, voix, musique : episodes/2026-11-28.py (A, A_PROPS, music_a ; B, B_PROPS, music_b).
import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Instant} from '../bl/anim';
import {Collegue, Decouvert, P1, Radiateur, Tele, Tomate} from '../bl/persos';
import {rand} from '../bl/theme';
import {Big, Brand2, C, Cam, Chip, EndCard, Flash, Grade, Headline, Hero, Layer, Line, Note2, Scenes2, Subs,
  useFonts2} from '../bl2/studio';
import {AppartAvant, AppartFond, Horloge2, Jauge2, Medaille, PlateauAvant, PlateauFond, Podium} from '../bl2/decors2';

const FPS = 30;
const K = '#16121F';
const LinesCtx = React.createContext<{lines: Line[]; starts: number[]}>({lines: [], starts: []});
/** Image (relative à la scène `si`) où le mot `w` est prononcé dans la réplique n°`li`. */
const useAt = (si: number, li: number, w?: string) => {
  const {lines, starts} = React.useContext(LinesCtx);
  const l = lines[li];
  if (!l) return 0;
  const k = w ? Math.max(0, l.text.indexOf(w)) / l.text.length : 0;
  return Math.round((l.t + k * l.d) * FPS) - (starts[si] ?? 0);
};
/** Vrai pendant la réplique n°li (relative à la scène si). */
const useTalk = (si: number, li: number) => {
  const f = useCurrentFrame();
  const {lines} = React.useContext(LinesCtx);
  const a = useAt(si, li);
  const d = lines[li] ? Math.round(lines[li].d * FPS) : 0;
  return f >= a && f < a + d;
};

const Txt: React.FC<{y: number; size?: number; col?: string; children: React.ReactNode; w?: number}> = (
  {y, size = 44, col = 'white', children, w = 900},
) => (
  <div style={{position: 'absolute', top: y, left: (1080 - w) / 2, width: w, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
    fontSize: size, color: col, lineHeight: 1.15, textShadow: '0 4px 0 rgba(0,0,0,0.65), 0 0 18px rgba(0,0,0,0.5)'}}>{children}</div>
);

/** Voile sombre en haut de l'image pour détacher les titres du décor. */
const Scrim: React.FC<{h?: number}> = ({h = 720}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h,
    background: 'linear-gradient(180deg, rgba(10,6,30,0.85) 0%, rgba(10,6,30,0.6) 70%, transparent 100%)'}} />
);

// ===================================== A · LE PODIUM DES HAUSSES =====================================
const ENVOIE_A = 'Envoie ça à celui qui dit « tout augmente ».';
const SRC_A = 'Insee, estimation provisoire du 27/11/2026 · sur un an';

/** Boîte grise « TABAC » posée sur la marche 3 (pas de personnage : pas de pub). */
const BoiteTabac: React.FC = () => (
  <div style={{position: 'absolute', left: 725, top: 880, width: 190, height: 130, borderRadius: 18, background: '#8A8698',
    border: `6px solid ${K}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
    <div style={{fontFamily: 'Baloo2', fontWeight: 800, fontSize: 44, color: 'white', lineHeight: 1}}>TABAC</div>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 20, color: '#E8E4F4'}}>pas de personnage</div>
  </div>
);
const OnTomate: React.FC<{talk?: boolean; expr?: 'happy' | 'cool'}> = ({talk, expr = 'happy'}) => (
  <Hero speak={talk}><Tomate x={275} y={712} w={260} expr={expr} talk={talk} /></Hero>
);
const OnRadiateur: React.FC<{talk?: boolean}> = ({talk}) => (
  <Hero speak={talk} rim="#FFB0A0"><Radiateur x={555} y={598} w={262} heat={1} expr="happy" talk={talk} /></Hero>
);
const Host: React.FC<{talk: boolean; expr?: 'happy' | 'shock' | 'cool'; x?: number; y?: number; w?: number}> = (
  {talk, expr = 'happy', x = 150, y = 560, w = 190},
) => <Hero speak={talk} rim="#FF9A9A"><Decouvert x={x} y={y} w={w} expr={expr} talk={talk} label="" /></Hero>;

const Confettis: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame() - from;
  if (f < 0) return null;
  return (
    <>
      {Array.from({length: 40}, (_, i) => {
        const x = rand(i + 3) * 1080 + Math.sin(f / 8 + i) * 30;
        const y = -40 + f * (9 + rand(i) * 8) - rand(i + 7) * 300;
        if (y > 1500) return null;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 16, height: 26, borderRadius: 4,
          background: [C.yel, C.red, C.cyan, C.green, '#FFFFFF'][i % 5], transform: `rotate(${f * 12 + i * 40}deg)`}} />;
      })}
    </>
  );
};

const AHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Instant.Provider value>
      <Cam keys={[{f: 0, z: 1.1, y: 30}, {f: 200, z: 1.0, y: 0}]}>
        <PlateauFond title="" />
        <Layer d={1}>
          <Podium />
          <Host talk={f > 4 && f < 196} x={190} y={1040} w={230} />
        </Layer>
        <PlateauAvant />
        <Layer d={0.12}>
          <Chip txt="INFLATION · NOVEMBRE 2026" col={C.violet} y={150} />
          <Headline y={225} size={104} words={['Le', {t: 'podium', c: C.yel}, '\n', 'des', 'hausses']} />
          <Txt y={462} size={48}>Inflation : <span style={{color: C.yel}}>2,9 %</span> sur un an.</Txt>
          <Txt y={526} size={48} col={C.red}>Devine qui prend l'or.</Txt>
          <Txt y={600} size={34} col={C.cyan}>{ENVOIE_A}</Txt>
          <Note2 y={1195}>{SRC_A}</Note2>
        </Layer>
      </Cam>
    </Instant.Provider>
  );
};

const AN3: React.FC = () => {
  const talk = useTalk(1, 2);
  return (
    <Cam keys={[{f: 0, z: 1.0}, {f: 40, z: 1.12, x: 160, y: 60}, {f: 170, z: 1.15, x: 170, y: 70}]}>
      <PlateauFond title="" />
      <Layer d={1}>
        <Podium lit={[3]} />
        <BoiteTabac />
        <Medaille x={820} y={1030} rank={3} txt="" delay={14} size={0.6} />
      </Layer>
      <PlateauAvant />
      <Layer d={0.12}>
        <Chip txt="3e PLACE · TABAC" col="#E0975A" />
        <Big y={250} size={200} col={C.warm} delay={8}>+3,2 %</Big>
        <Host talk={talk} />
        <Note2 y={1195}>{SRC_A}</Note2>
      </Layer>
    </Cam>
  );
};

const AN2: React.FC = () => {
  const t1 = useTalk(2, 3), t2 = useTalk(2, 4);
  const jump = useAt(2, 3, 'produits');
  const f = useCurrentFrame();
  return (
    <Cam keys={[{f: 0, z: 1.05, x: -60}, {f: jump + 20, z: 1.14, x: -160, y: 40}, {f: 230, z: 1.18, x: -170, y: 50}]}>
      <PlateauFond title="" />
      <Layer d={1}>
        <Podium lit={[2, 3]} />
        <BoiteTabac />
        {f >= jump ? <OnTomate talk={t2} /> : null}
        <Medaille x={260} y={985} rank={2} txt="" delay={jump + 10} size={0.65} />
      </Layer>
      <PlateauAvant />
      <Layer d={0.12}>
        <Chip txt="2e PLACE · PRODUITS FRAIS" col={C.cyan} fg={C.navy} />
        {f >= jump ? <Big y={250} size={200} delay={jump}>+9,4 %</Big> : null}
        <Host talk={t1} x={900 - 60} y={560} />
        <Note2 y={1195}>{SRC_A}</Note2>
      </Layer>
    </Cam>
  );
};

const APari: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const talk = useTalk(3, 5);
  const marks = [useAt(3, 5, 'trois'), useAt(3, 5, 'deux'), useAt(3, 5, 'un…')];
  const cur = marks.filter((m) => f >= m).length;
  const s = cur ? spring({frame: f - marks[cur - 1], fps, config: {damping: 8, stiffness: 200}}) : 0;
  return (
    <Cam keys={[{f: 0, z: 1.0}, {f: 120, z: 1.22, y: 120}]} hand={1.6}>
      <PlateauFond title="" />
      <Layer d={1}>
        <Podium lit={[2, 3]} />
        <BoiteTabac />
        <OnTomate expr="cool" />
        <div style={{position: 'absolute', left: 300, top: 300, width: 480, height: 900, opacity: 0.35 + 0.15 * Math.sin(f / 3),
          background: 'linear-gradient(180deg, rgba(255,214,64,0) 0%, rgba(255,214,64,0.55) 100%)',
          clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)', mixBlendMode: 'screen'}} />
      </Layer>
      <PlateauAvant />
      <Layer d={0.12}>
        <Chip txt="MÉDAILLE D'OR" col={C.yel} fg={C.navy} />
        <Headline y={225} size={92} words={['Qui', 'prend', {t: "l'or ?", c: C.yel}]} stagger={2} />
        {cur ? <div style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontFamily: 'Baloo2',
          fontWeight: 800, fontSize: 260, color: 'white', transform: `scale(${0.5 + 0.5 * s})`, opacity: Math.min(1, s * 2),
          textShadow: `0 8px 0 ${C.violetD}, 0 0 40px ${C.yel}`}}>{4 - cur}</div> : null}
        <Host talk={talk} x={880} y={600} w={170} />
      </Layer>
    </Cam>
  );
};

const AN1: React.FC = () => {
  const t2 = useTalk(4, 7);
  const t1 = useTalk(4, 6);
  return (
    <Cam keys={[{f: 0, z: 1.25, y: 140}, {f: 30, z: 1.08, y: 40}, {f: 180, z: 1.04, y: 20}]} hand={1.3}>
      <PlateauFond title="" />
      <Layer d={1}>
        <Podium lit={[1, 2, 3]} />
        <BoiteTabac />
        <OnTomate expr="cool" />
        <OnRadiateur talk={t2} />
        <Medaille x={540} y={880} rank={1} txt="" delay={6} size={0.7} />
      </Layer>
      <PlateauAvant />
      <Confettis from={2} />
      <Layer d={0.12}>
        <Chip txt="1re PLACE · ÉNERGIE" col={C.yel} fg={C.navy} />
        <Big y={250} size={220} col={C.yel} delay={2}>+19,2 %</Big>
        <Host talk={t1} x={880} y={560} w={170} />
        <Note2 y={1195}>{SRC_A}</Note2>
      </Layer>
    </Cam>
  );
};

const ATwist: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = useTalk(5, 8), t2 = useTalk(5, 9);
  const enter = useAt(5, 9);
  const k = interpolate(f, [enter - 6, enter + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Cam keys={[{f: 0, z: 1.0}, {f: enter, z: 1.06, y: 30}, {f: 200, z: 1.12, y: 50}]}>
      <PlateauFond title="" beams={[C.green, C.cyan, C.green, C.cyan]} />
      <Layer d={1}>
        <AbsoluteFill style={{opacity: 0.4, filter: 'blur(3px)'}}>
          <Podium lit={[1, 2, 3]} />
          <BoiteTabac />
          <Tomate x={275} y={712} w={260} expr="shock" />
          <Radiateur x={555} y={598} w={262} heat={1} expr="shock" />
        </AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - k) * 700}px) rotate(${(1 - k) * 12}deg)`}}>
          <Hero speak={t2}><Tele x={540} y={760} w={400} expr={f > enter + 60 ? 'happy' : 'cool'} talk={t2} /></Hero>
        </div>
      </Layer>
      <PlateauAvant />
      <Layer d={0.12}>
        <Chip txt={f >= enter ? 'LE SEUL QUI BAISSE' : 'ATTENDS…'} col={C.green} fg={C.navy} />
        {f >= enter ? <Big y={250} size={210} col={C.green} delay={enter + 4} sub="produits manufacturés">-0,2 %</Big> : null}
        <Host talk={t1} expr={f < enter ? 'shock' : 'happy'} />
        <Note2 y={1195}>{SRC_A}</Note2>
      </Layer>
    </Cam>
  );
};

const AFin: React.FC<{len: number}> = ({len}) => {
  const f = useCurrentFrame();
  const end = len - 60;
  const talk = useTalk(6, 10);
  return (
    <Cam keys={[{f: 0, z: 1.08}, {f: len, z: 0.98}]}>
      <PlateauFond title="" />
      <Layer d={1}>
        <Podium lit={[1, 2, 3]} />
        <BoiteTabac />
        <OnTomate />
        <OnRadiateur />
        <Tele x={930} y={1010} w={190} expr="cool" />
        <Host talk={talk} x={130} y={1000} w={200} />
      </Layer>
      <PlateauAvant />
      <Layer d={0.12}>
        <Headline y={160} size={86} stagger={2} words={['Tu', 'avais', 'deviné', '\n', 'le', {t: 'n°1 ?', c: C.yel}]} />
        <Txt y={360} size={44} col={C.yel}>Réponds oui ou non.</Txt>
        {f >= end ? (
          <>
            <Txt y={440} size={34} col={C.cyan}>{ENVOIE_A}</Txt>
            <EndCard y={500} />
          </>
        ) : null}
      </Layer>
    </Cam>
  );
};

export const A_DURATIONS = [6.92, 6.06, 7.47, 4.13, 5.97, 6.08, 4.2];

export const InflationPodium: React.FC<{durations: number[]; audio?: string; lines?: Line[]}> = ({durations, audio, lines = []}) => {
  useFonts2();
  const starts: number[] = [];
  durations.reduce((a, d) => { starts.push(a); return a + Math.round(d * FPS); }, 0);
  const last = Math.round(durations[6] * FPS);
  return (
    <LinesCtx.Provider value={{lines, starts}}>
      <AbsoluteFill style={{background: '#0E0624'}}>
        <Scenes2 durations={durations} trans={['cut', 'whip', 'whip', 'zoom', 'iris', 'whip', 'zoom']} scenes={[
          <AHook />, <AN3 />, <AN2 />, <APari />, <AN1 />, <ATwist />, <AFin len={last} />,
        ]} />
        <Flash at={starts.slice(1)} />
        <Subs lines={lines} y={1290} names={{tata: 'La Tomate', tonton: 'Le Radiateur', frere: 'La Télé'}} />
        <Grade warm="#B08AFF" leak="#FF5FA0" />
        {audio ? <Audio src={staticFile(audio)} /> : null}
      </AbsoluteFill>
    </LinesCtx.Provider>
  );
};

// ===================================== B · PAIE : LES 72 PREMIÈRES HEURES =====================================
const ENVOIE_B = 'Envoie ça au pote qui a été payé cette semaine.';
const Cousin: React.FC<{x: number; y: number; w: number; talk?: boolean; expr?: 'happy' | 'cool'}> = (p) => (
  <Collegue {...p} hair="court" top="#E0812A" acc="bonnet" skin={['#B07A50', '#8E5A34']} seed={75} />
);

/** Pastille « Il te reste » dont le montant bascule à l'image `at`. */
const Reste: React.FC<{from: number; to: number; at: number; y?: number}> = ({from, to, at, y = 330}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = f >= at ? to : from;
  const s = f >= at ? spring({frame: f - at, fps, config: {damping: 8, stiffness: 220}}) : 1;
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(10,8,28,0.85)', border: `4px solid ${C.green}`, borderRadius: 26, padding: '6px 30px 0',
        display: 'flex', alignItems: 'baseline', gap: 16, boxShadow: `0 0 26px ${C.green}55`}}>
        <span style={{fontFamily: 'Baloo2', fontWeight: 800, fontSize: 40, color: 'white'}}>Il te reste</span>
        <span style={{fontFamily: 'Baloo2', fontWeight: 800, fontSize: 76, color: C.green, display: 'inline-block',
          transform: `scale(${1.25 - 0.25 * s})`}}>{v} €</span>
      </div>
    </div>
  );
};
/** Tampon rouge du montant dépensé. */
const Tampon: React.FC<{txt: string; at: number; y?: number}> = ({txt, at, y = 440}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 9, stiffness: 260}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center'}}>
      <span style={{display: 'inline-block', fontFamily: 'Baloo2', fontWeight: 800, fontSize: 120, color: C.red, padding: '0 34px',
        border: `10px solid ${C.red}`, borderRadius: 26, background: 'rgba(255,255,255,0.92)', transform: `rotate(-8deg) scale(${2.2 - 1.2 * s})`,
        opacity: Math.min(1, s * 2), lineHeight: 1.1}}>{txt}</span>
    </div>
  );
};
const Sacs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {[[250, 930, C.red, -6], [830, 920, C.cyan, 5], [930, 990, C.yel, 9]].map(([x, y, c, r], i) => (
        <g key={i} transform={`translate(${x as number} ${(y as number) + Math.sin(f / 6 + i) * 6}) rotate(${r as number})`}>
          <path d="M -40 -70 Q 0 -130 40 -70" fill="none" stroke={K} strokeWidth={10} />
          <rect x={-75} y={-70} width={150} height={170} rx={14} fill={c as string} stroke={K} strokeWidth={8} />
          <path d="M -30 0 l 30 -26 l 30 26 l -30 26 Z" fill="white" opacity={0.7} />
        </g>
      ))}
    </svg>
  );
};
const BoitePizza: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 640, top: 900 + Math.sin(f / 7) * 5, width: 300, height: 120, transform: 'rotate(6deg)'}}>
      <div style={{position: 'absolute', inset: 0, background: '#E8C890', border: `7px solid ${K}`, borderRadius: 14,
        boxShadow: '0 12px 0 rgba(0,0,0,0.35)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: 'Baloo2', fontWeight: 800, fontSize: 48,
        color: C.redD}}>LIVRAISON</div>
    </div>
  );
};
const BadgePromo: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 8, stiffness: 160}});
  const pts = Array.from({length: 24}, (_, i) => {
    const r = i % 2 ? 120 : 150, a = (i / 24) * Math.PI * 2;
    return `${150 + r * Math.cos(a)},${150 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <div style={{position: 'absolute', left: 690, top: 600, width: 300, height: 300, transform: `rotate(${f * 1.5}deg) scale(${s})`}}>
      <svg viewBox="0 0 300 300" width={300} height={300}><polygon points={pts} fill={C.yel} stroke={K} strokeWidth={8} /></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Baloo2',
        fontWeight: 800, fontSize: 84, color: C.red, transform: `rotate(${-f * 1.5}deg)`}}>-40 %</div>
    </div>
  );
};

const BHook: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = useTalk(0, 1);
  return (
    <Instant.Provider value>
      <Cam keys={[{f: 0, z: 1.1, y: 30}, {f: 260, z: 1.0, y: 0}]}>
        <AppartFond />
        <Layer d={1}><Hero speak={p1}><P1 x={540} y={760} w={400} expr={p1 ? 'cool' : 'happy'} talk={p1} /></Hero></Layer>
        <AppartAvant />
        <Scrim />
        <Layer d={0.12}>
          <Horloge2 day="VENDREDI" time="18:00" since="+0 h" />
          <Headline y={322} size={100} words={['Ta', 'paie', {t: 'tombe.', c: C.green}]} />
          <Txt y={446} size={52}>Après le loyer : <span style={{color: C.green}}>930 €</span></Txt>
          <Txt y={520} size={50} col={C.yel}>Elle tient combien d'heures ?</Txt>
          <Txt y={590} size={34} col={C.cyan}>{ENVOIE_B}</Txt>
          {f > 4 ? null : null}
        </Layer>
      </Cam>
    </Instant.Provider>
  );
};

const BResto: React.FC = () => {
  const c = useTalk(1, 3);
  const at = useAt(1, 4);
  return (
    <Cam keys={[{f: 0, z: 1.0, x: -40}, {f: at, z: 1.08, x: 40}, {f: 130, z: 1.12, x: 50}]}>
      <AppartFond tint="#3A1446" />
      <Layer d={1}>
        <Hero speak={c} dim={!c}><Cousin x={320} y={700} w={380} talk={c} expr="happy" /></Hero>
        <Hero dim={c}><P1 x={790} y={740} w={340} expr="happy" /></Hero>
      </Layer>
      <AppartAvant />
      <Layer d={0.12}>
        <Horloge2 day="VENDREDI" time="20:30" since="+2 h 30" />
        <Reste from={930} to={892} at={at} />
        <Tampon txt="-38 €" at={at} />
        <Note2 y={1150}>Montants d'exemple</Note2>
      </Layer>
      <Brand2 />
    </Cam>
  );
};

const BCadeaux: React.FC = () => {
  const p = useTalk(2, 5);
  const at = useAt(2, 6);
  return (
    <Cam keys={[{f: 0, z: 1.12, y: 40}, {f: 100, z: 1.02}]}>
      <AppartFond tint="#14305A" />
      <Layer d={1}>
        <Sacs />
        <Hero speak={p}><P1 x={540} y={720} w={400} expr={p ? 'happy' : 'cool'} talk={p} /></Hero>
      </Layer>
      <AppartAvant />
      <Layer d={0.12}>
        <Horloge2 day="SAMEDI" time="15:00" since="+21 h" col={C.yel} />
        <Reste from={892} to={797} at={at} />
        <Tampon txt="-95 €" at={at} />
      </Layer>
      <Brand2 />
    </Cam>
  );
};

const BLivraison: React.FC = () => {
  const p = useTalk(3, 7);
  const at = useAt(3, 8);
  return (
    <Cam keys={[{f: 0, z: 1.0, x: 30}, {f: 127, z: 1.1, x: -30, y: 30}]}>
      <AppartFond tint="#0E0A2E" />
      <Layer d={1}>
        <Hero speak={p}><P1 x={430} y={760} w={400} expr={p ? 'sad' : 'happy'} talk={p} /></Hero>
        <BoitePizza />
      </Layer>
      <AppartAvant />
      <Layer d={0.12}>
        <Horloge2 day="DIMANCHE" time="21:00" since="+51 h" col={C.violet} />
        <Reste from={797} to={773} at={at} />
        <Tampon txt="-24 €" at={at} />
      </Layer>
      <Brand2 />
    </Cam>
  );
};

const BCyber: React.FC = () => {
  const p = useTalk(4, 9);
  const at = useAt(4, 10);
  return (
    <Cam keys={[{f: 0, z: 1.15, x: 60}, {f: at, z: 1.05}, {f: 142, z: 1.08}]} hand={1.4}>
      <AppartFond tint="#3A0E2A" />
      <Layer d={1}>
        <BadgePromo at={4} />
        <Hero speak={p}><P1 x={420} y={740} w={400} expr={p ? 'shock' : 'happy'} talk={p} /></Hero>
      </Layer>
      <AppartAvant />
      <Layer d={0.12}>
        <Horloge2 day="LUNDI · CYBER MONDAY" time="12:30" since="+66 h 30" col={C.red} />
        <Reste from={773} to={714} at={at} />
        <Tampon txt="-59 €" at={at} />
      </Layer>
      <Brand2 />
    </Cam>
  );
};

const BBilan: React.FC = () => {
  const t1 = useTalk(5, 11), t2 = useTalk(5, 12);
  const j = useAt(5, 12, 'Lundi');
  return (
    <Cam keys={[{f: 0, z: 1.15}, {f: 60, z: 1.04}, {f: 313, z: 1.08, y: 20}]}>
      <AppartFond tint="#1A1446" />
      <Layer d={1}>
        <Hero speak={t1 || t2} rim="#FF9A9A"><Decouvert x={360} y={820} w={330} expr="happy" talk={t1 || t2} label="" /></Hero>
        <Hero dim><P1 x={790} y={800} w={320} expr="shock" /></Hero>
      </Layer>
      <AppartAvant />
        <Scrim />
      <Layer d={0.12}>
        <Horloge2 day="LUNDI" time="18:00" since="72 h" col={C.green} />
        <Big y={320} size={170} col={C.green} delay={8} sub="il te reste">714 €</Big>
        <Jauge2 y={610} from={30} to={25.5} max={30} a={j} b={j + 24} />
        <Note2 y={1150}>Prochaine paie : 28 déc. · montants d'exemple</Note2>
      </Layer>
    </Cam>
  );
};

const BFin: React.FC<{len: number}> = ({len}) => {
  const f = useCurrentFrame();
  const end = len - 60;
  const p = useTalk(6, 13);
  const d = useTalk(6, 14);
  return (
    <Cam keys={[{f: 0, z: 1.1}, {f: len, z: 1.0}]}>
      <AppartFond />
      <Layer d={1}>
        <Hero speak={p}><P1 x={540} y={760} w={380} expr={p ? 'worry' : 'cool'} talk={p} /></Hero>
        <Hero speak={d} rim="#FF9A9A"><Decouvert x={190} y={1000} w={200} expr="happy" talk={d} label="" /></Hero>
      </Layer>
      <AppartAvant />
        <Scrim />
      <Layer d={0.12}>
        <Headline y={160} size={84} stagger={2} words={['Ta', 'paie', 'tient', '\n', {t: "combien d'heures ?", c: C.yel}]} />
        <Txt y={360} size={44} col={C.green}>Réponds en heures.</Txt>
        {f >= end ? (
          <>
            <Txt y={440} size={34} col={C.cyan}>{ENVOIE_B}</Txt>
            <EndCard y={500} note="Montants d'exemple" />
          </>
        ) : null}
      </Layer>
    </Cam>
  );
};

export const B_DURATIONS = [8.82, 3.84, 3.37, 4.24, 4.74, 10.43, 5.51];

export const Paie72Heures: React.FC<{durations: number[]; audio?: string; lines?: Line[]}> = ({durations, audio, lines = []}) => {
  useFonts2();
  const starts: number[] = [];
  durations.reduce((a, d) => { starts.push(a); return a + Math.round(d * FPS); }, 0);
  const last = Math.round(durations[6] * FPS);
  return (
    <LinesCtx.Provider value={{lines, starts}}>
      <AbsoluteFill style={{background: '#12061A'}}>
        <Scenes2 durations={durations} trans={['cut', 'whip', 'whip', 'zoom', 'whip', 'iris', 'zoom']} scenes={[
          <BHook />, <BResto />, <BCadeaux />, <BLivraison />, <BCyber />, <BBilan />, <BFin len={last} />,
        ]} />
        <Flash at={starts.slice(1)} />
        <Subs lines={lines} y={1225} names={{cousin: 'Ton pote'}} />
        <Grade />
        {audio ? <Audio src={staticFile(audio)} /> : null}
      </AbsoluteFill>
    </LinesCtx.Provider>
  );
};
