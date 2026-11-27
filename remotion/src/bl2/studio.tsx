// DA « Cartoon premium 2.5D » (décision du propriétaire, 27 nov. 2026) : caméra qui bouge dans un décor en couches
// (parallaxe + profondeur de champ), lumière et étalonnage (vignette, halo, grain, reflets), typographie cinétique
// en relief, sous-titres karaoké synchronisés à la voix off des personnages, transitions (filé, zoom, iris).
// Remplace la DA plate de src/bl/ pour les nouvelles vidéos ; src/bl/ reste disponible (personnages réutilisés).
import React, {useContext, useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {useInstant} from '../bl/anim';
import {rand} from '../bl/theme';

// ---- palette 2.5D (charte BudgetLoyer + ombres et lumières) ---------------------------------------------------
export const C = {
  green: '#20E388', greenD: '#0C9C5A', yel: '#FFD640', yelD: '#D98A0B', red: '#F04242', redD: '#9E1630',
  cyan: '#36D6F0', cyanD: '#127C9C', violet: '#6B55E0', violetD: '#33238F', navy: '#0A0E2C', ink: '#16121F',
  cream: '#FFF4E0', warm: '#FFB45A',
};
export const DISPLAY = 'Baloo2';

/** Charge Inter (texte) et Baloo 2 (titres en relief, licence OFL) avant la première image. */
export const useFonts2 = () => {
  const [handle] = useState(() => delayRender('polices 2.5D'));
  useEffect(() => {
    const faces = [
      ...([['Black', 900], ['ExtraBold', 800], ['Bold', 700], ['Medium', 500]] as const).map(
        ([w, n]) => new FontFace('Inter', `url(${staticFile(`fonts/Inter-${w}.otf`)})`, {weight: String(n)})),
      new FontFace(DISPLAY, `url(${staticFile('fonts/Baloo2-ExtraBold.woff2')})`, {weight: '800'}),
      new FontFace(DISPLAY, `url(${staticFile('fonts/Baloo2-Bold.woff2')})`, {weight: '700'}),
    ];
    Promise.all(faces.map((f) => f.load())).then((fs) => {
      fs.forEach((f) => (document as any).fonts.add(f));
      continueRender(handle);
    });
  }, [handle]);
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

// ---- caméra et couches --------------------------------------------------------------------------------------
type CamState = {x: number; y: number; z: number; r: number};
const CamCtx = React.createContext<CamState>({x: 0, y: 0, z: 1, r: 0});
export type CamKey = {f: number; x?: number; y?: number; z?: number; r?: number};

/** Caméra virtuelle : clés (image, x, y, zoom, rotation) interpolées en douceur + léger mouvement « à l'épaule ».
 *  Les `Layer` lisent la caméra et bougent selon leur profondeur (parallaxe). */
export const Cam: React.FC<{keys: CamKey[]; hand?: number; children: React.ReactNode}> = ({keys, hand = 1, children}) => {
  const f = useCurrentFrame();
  const val = (k: 'x' | 'y' | 'z' | 'r', def: number) => {
    const ks = keys.map((q) => ({f: q.f, v: q[k] ?? def}));
    if (ks.length === 1) return ks[0].v;
    return interpolate(f, ks.map((q) => q.f), ks.map((q) => q.v), {...clamp, easing: io});
  };
  const st: CamState = {
    x: val('x', 0) + hand * (Math.sin(f / 17) * 4 + Math.sin(f / 7.3) * 1.5),
    y: val('y', 0) + hand * (Math.cos(f / 19) * 3 + Math.sin(f / 9.1) * 1.2),
    z: val('z', 1),
    r: val('r', 0) + hand * Math.sin(f / 23) * 0.3,
  };
  return <CamCtx.Provider value={st}><AbsoluteFill style={{overflow: 'hidden'}}>{children}</AbsoluteFill></CamCtx.Provider>;
};

/** Couche de décor à la profondeur `d` (0 = fond lointain, 1 = plan des personnages, > 1 = premier plan).
 *  `blur` : flou de profondeur de champ. */
export const Layer: React.FC<{d: number; blur?: number; children: React.ReactNode; style?: React.CSSProperties}> = (
  {d, blur = 0, children, style},
) => {
  const c = useContext(CamCtx);
  const s = 1 + (c.z - 1) * d;
  return (
    <AbsoluteFill style={{transform: `translate(${-c.x * d}px, ${-c.y * d}px) scale(${s}) rotate(${c.r * d}deg)`,
      transformOrigin: '540px 960px', filter: blur ? `blur(${blur}px)` : undefined, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

// ---- lumière et étalonnage ----------------------------------------------------------------------------------
/** Étalonnage final : vignette, halo de lumière chaude qui respire, reflet qui dérive, grain de film animé. */
export const Grade: React.FC<{warm?: string; leak?: string; vignette?: number; grain?: number}> = (
  {warm = '#FFB45A', leak = '#FF5FA0', vignette = 0.62, grain = 0.07},
) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 12;
  const lx = 200 + Math.sin(f / 50) * 160, ly = 380 + Math.cos(f / 60) * 120;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 700px at 540px 300px, ${warm}33, transparent 70%)`,
        mixBlendMode: 'screen', opacity: 0.8 + 0.2 * Math.sin(f / 13)}} />
      <AbsoluteFill style={{background: `radial-gradient(520px 520px at ${lx}px ${ly}px, ${leak}2E, transparent 70%)`,
        mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 78% 62% at 50% 46%, transparent 52%, rgba(6,4,18,${vignette}) 100%)`}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: grain, mixBlendMode: 'overlay'}}>
        <filter id={`grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Bokeh : disques de lumière flous qui flottent (au fond ou au premier plan selon la couche). */
export const Bokeh: React.FC<{n?: number; seed?: number; y0?: number; y1?: number; size?: [number, number]; blur?: number;
  colors?: string[]; opacity?: number}> = ({n = 14, seed = 1, y0 = 0, y1 = 1920, size = [30, 110], blur = 10,
  colors = [C.yel, C.warm, C.red, C.cyan, C.green], opacity = 0.55}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const r = size[0] + rand(seed + i * 3) * (size[1] - size[0]);
        const x = rand(seed + i * 7) * 1080 + Math.sin(f / (40 + i * 3) + i) * 14;
        const y = y0 + rand(seed + i * 11) * (y1 - y0) + Math.cos(f / (50 + i * 2) + i) * 10;
        const tw = 0.7 + 0.3 * Math.sin(f / (9 + i % 5) + i);
        const col = colors[i % colors.length];
        return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
          background: `radial-gradient(circle at 45% 40%, ${col}, ${col}88 55%, transparent 72%)`, filter: `blur(${blur}px)`,
          opacity: opacity * tw, mixBlendMode: 'screen'}} />;
      })}
    </>
  );
};

// ---- personnages : relief, lumière de contour, mise au point -------------------------------------------------
/** Habille un personnage de src/bl/persos (déjà animé) : lumière de contour chaude, ombre portée douce,
 *  ombre de contact au sol ; `speak` : il se penche vers la caméra ; `dim` : hors mise au point (flou + sombre). */
export const Hero: React.FC<{speak?: boolean; dim?: boolean; rim?: string; children: React.ReactNode}> = (
  {speak = false, dim = false, rim = '#FFD9A0', children},
) => {
  const f = useCurrentFrame();
  const k = speak ? 1.04 + Math.sin(f / 3.2) * 0.008 : 1;
  return (
    <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: '540px 1300px',
      filter: `drop-shadow(-6px -5px 0 ${rim}AA) drop-shadow(10px 28px 24px rgba(0,0,0,0.5))${dim ? ' blur(3px) brightness(0.62)' : ''}`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---- typographie cinétique en relief -------------------------------------------------------------------------
export type Word = string | {t: string; c?: string};
const extrude = (deep: string, n = 7, step = 2.2) =>
  [...Array.from({length: n}, (_, k) => `0 ${(k + 1) * step}px 0 ${deep}`), `0 ${n * step + 10}px 26px rgba(0,0,0,0.5)`].join(', ');

/** Titre en relief (police Baloo 2) : chaque mot arrive en basculant en 3D, avec un ressort. Mots colorés : {t, c}.
 *  Dans l'accroche (`Instant`), tout est déjà en place à l'image 0. `\n` dans la liste = retour à la ligne. */
export const Headline: React.FC<{words: Word[]; y: number; size?: number; delay?: number; stagger?: number; color?: string;
  deep?: string; width?: number}> = ({words, y, size = 96, delay = 0, stagger = 3, color = 'white', deep = '#2A1840',
  width = 960}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  let i = 0;
  const lines: Word[][] = [[]];
  words.forEach((w) => (w === '\n' ? lines.push([]) : lines[lines.length - 1].push(w)));
  return (
    <div style={{position: 'absolute', top: y, left: (1080 - width) / 2, width, textAlign: 'center', perspective: 900}}>
      {lines.map((ln, li) => (
        <div key={li} style={{lineHeight: 1.02, marginBottom: size * 0.04}}>
          {ln.map((w, wi) => {
            const t = typeof w === 'string' ? w : w.t;
            const c = typeof w === 'string' ? color : (w.c ?? C.yel);
            const dp = typeof w === 'string' ? deep : shade(c);
            const s = instant ? 1 : spring({frame: f - delay - (i++) * stagger, fps, config: {damping: 11, stiffness: 150}});
            return (
              <span key={wi} style={{display: 'inline-block', margin: `0 ${size * 0.12}px`, fontFamily: DISPLAY, fontWeight: 800,
                fontSize: size, color: c, textShadow: extrude(dp), opacity: Math.min(1, s * 1.6),
                transform: `translateY(${(1 - s) * 70}px) rotateX(${(1 - s) * -75}deg) scale(${0.8 + 0.2 * s})`,
                transformOrigin: '50% 100%'}}>{t}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
const SHADES: Record<string, string> = {[C.yel]: '#B8650A', [C.red]: '#7E1028', [C.green]: '#0A7A46', [C.cyan]: '#0E6A88',
  white: '#2A1840', [C.cream]: '#7A4A2A', [C.warm]: '#9A4A0A'};
const shade = (c: string) => SHADES[c] ?? '#2A1840';

/** Étiquette de rubrique en relief qui se balance légèrement (remplace Pill). */
export const Chip: React.FC<{txt: string; col?: string; fg?: string; y?: number; size?: number; delay?: number}> = (
  {txt, col = C.red, fg = 'white', y = 150, size = 40, delay = 0},
) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  const s = instant ? 1 : spring({frame: f - delay, fps, config: {damping: 10, stiffness: 170}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `rotate(${-2 + Math.sin(f / 20) * 1}deg) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 2),
        background: `linear-gradient(180deg, ${col}, ${shade(col) === '#2A1840' ? col : shade(col)})`, color: fg,
        fontFamily: DISPLAY, fontWeight: 800, fontSize: size, padding: '4px 30px 0', borderRadius: 18,
        boxShadow: `0 6px 0 ${shade(col)}, 0 14px 26px rgba(0,0,0,0.45), inset 0 3px 0 rgba(255,255,255,0.35)`,
        letterSpacing: 1}}>{txt}</div>
    </div>
  );
};

/** Grand nombre en relief avec reflet qui balaie (montants, scores). */
export const Big: React.FC<{children: React.ReactNode; y: number; size?: number; col?: string; delay?: number; sub?: string}> = (
  {children, y, size = 220, col = 'white', delay = 0, sub},
) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  const s = instant ? 1 : spring({frame: f - delay, fps, config: {damping: 9, stiffness: 140}});
  const sweep = interpolate((f - delay) % 60, [0, 30], [-30, 130], clamp);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.4 + 0.6 * s})`,
      opacity: Math.min(1, s * 2)}}>
      <div style={{display: 'inline-block', position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: size,
        lineHeight: 1, color: col, textShadow: extrude(shade(col), 9, 2.6)}}>
        {children}
        <span style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 12}%,
          rgba(255,255,255,0.75) ${sweep}%, transparent ${sweep + 12}%)`, WebkitBackgroundClip: 'text', color: 'transparent',
          textShadow: 'none'}}>{children}</span>
      </div>
      {sub ? <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.24, color: C.yel, marginTop: 8,
        textShadow: extrude('#7A3A0A', 4, 1.6)}}>{sub}</div> : null}
    </div>
  );
};

// ---- sous-titres karaoké synchronisés à la voix ---------------------------------------------------------------
export type Line = {t: number; d: number; who: string; text: string};
export const VOICES: Record<string, {name: string; col: string}> = {
  decouvert: {name: 'Monsieur Découvert', col: C.red}, p1: {name: 'Toi', col: C.violet}, narrateur: {name: '', col: C.green},
  tata: {name: 'Tata', col: C.green}, tonton: {name: 'Tonton', col: C.cyan}, cousin: {name: 'Ton cousin', col: C.warm},
  mamie: {name: 'Mamie', col: '#C25BE0'}, frere: {name: 'Ton frère', col: '#5A8CFF'}, sam: {name: 'Sam', col: C.cyan},
  objet: {name: '', col: C.yel}, objet_grave: {name: '', col: C.cyan},
};

/** Sous-titres de la voix off : la réplique en cours, le mot prononcé surligné (temps répartis selon la longueur
 *  des mots), étiquette du personnage qui parle. Placé hors des scènes (temps absolus en secondes). */
export const Subs: React.FC<{lines: Line[]; y?: number; names?: Record<string, string>}> = ({lines, y = 1255, names = {}}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const ln = lines.find((l) => t >= l.t - 0.05 && t < l.t + l.d + 0.25);
  if (!ln) return null;
  const words = ln.text.split(' ');
  const tot = words.reduce((a, w) => a + w.length + 2, 0);
  let acc = 0;
  const v = VOICES[ln.who] ?? {name: '', col: C.green};
  const name = names[ln.who] ?? v.name;
  const enter = interpolate(t - ln.t, [-0.05, 0.12], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', top: y, left: 60, right: 140, display: 'flex', flexDirection: 'column',
      alignItems: 'center', transform: `translateY(${(1 - enter) * 30}px)`, opacity: enter}}>
      {name ? <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: 'white', background: v.col,
        padding: '2px 18px 0', borderRadius: 12, marginBottom: -10, zIndex: 2, boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>{name}</div> : null}
      <div style={{background: 'rgba(10,8,28,0.78)', border: `3px solid ${v.col}`, borderRadius: 26, padding: '18px 28px 12px',
        textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
        {words.map((w, i) => {
          const a = ln.t + (acc / tot) * ln.d;
          acc += w.length + 2;
          const on = t >= a;
          const cur = on && t < ln.t + (acc / tot) * ln.d;
          return <span key={i} style={{display: 'inline-block', margin: '0 7px', fontFamily: 'Inter', fontWeight: 900,
            fontSize: 46, lineHeight: 1.2, color: cur ? C.yel : on ? 'white' : 'rgba(255,255,255,0.45)',
            transform: `scale(${cur ? 1.08 : 1})`}}>{w}</span>;
        })}
      </div>
    </div>
  );
};

// ---- enchaînement avec transitions ----------------------------------------------------------------------------
export type Trans = 'whip' | 'zoom' | 'iris' | 'cut';
const T = 8;
const Wrap: React.FC<{len: number; inT: Trans | null; outT: Trans | null; children: React.ReactNode}> = ({len, inT, outT, children}) => {
  const f = useCurrentFrame();
  let tr = '', op = 1, blur = 0, clip: string | undefined;
  if (inT && f < T) {
    const p = Easing.out(Easing.cubic)(f / T);
    if (inT === 'whip') { tr = `translateX(${(1 - p) * 900}px)`; blur = (1 - p) * 26; }
    if (inT === 'zoom') { tr = `scale(${1.5 - 0.5 * p})`; op = p; blur = (1 - p) * 14; }
    if (inT === 'iris') { clip = `circle(${p * 1200}px at 540px 900px)`; }
  }
  if (outT && f >= len - T) {
    const p = Easing.in(Easing.cubic)((f - (len - T)) / T);
    if (outT === 'whip') { tr = `translateX(${-p * 900}px)`; blur = p * 26; }
    if (outT === 'zoom') { tr = `scale(${1 + 0.25 * p})`; op = 1 - p; }
  }
  return <AbsoluteFill style={{transform: tr || undefined, opacity: op, filter: blur ? `blur(${blur}px)` : undefined,
    clipPath: clip}}>{children}</AbsoluteFill>;
};

/** Comme Scenes, avec transitions qui se chevauchent (`trans[i]` = entrée de la scène i). Durées en secondes. */
export const Scenes2: React.FC<{scenes: React.ReactNode[]; durations: number[]; trans?: Trans[]; fps?: number}> = (
  {scenes, durations, trans = [], fps = 30},
) => {
  let at = 0;
  return (
    <>
      {scenes.map((node, i) => {
        const d = Math.round((durations[i] ?? 2) * fps);
        const inT = i > 0 && (trans[i] ?? 'whip') !== 'cut' ? (trans[i] ?? 'whip') : null;
        const nx = trans[i + 1] ?? 'whip';
        const outT = i < scenes.length - 1 && nx !== 'cut' && nx !== 'iris' ? nx : null;
        const from = at - (inT ? T : 0);
        at += d;
        const len = d + (inT ? T : 0);
        return (
          <Sequence key={i} from={Math.max(0, from)} durationInFrames={len}>
            <Wrap len={len} inT={inT} outT={outT}>{node}</Wrap>
          </Sequence>
        );
      })}
    </>
  );
};

/** Flash blanc très court au changement de plan (souligne la transition). */
export const Flash: React.FC<{at: number[]}> = ({at}) => {
  const f = useCurrentFrame();
  const o = Math.max(0, ...at.map((a) => interpolate(f, [a - 2, a, a + 5], [0, 0.22, 0], clamp)));
  return o ? <AbsoluteFill style={{background: 'white', opacity: o, mixBlendMode: 'screen'}} /> : null;
};

// ---- signature et carte de fin ---------------------------------------------------------------------------------
export const Brand2: React.FC<{y?: number}> = ({y = 1462}) => (
  <div style={{position: 'absolute', left: 40, top: y, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.92}}>
    <Img src={staticFile('logo.png')} style={{width: 50, height: 50, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'}} />
    <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.yel, textShadow: '0 3px 0 #7A3A0A'}}>BudgetLoyer.com</div>
  </div>
);

export const EndCard: React.FC<{y: number; note?: string}> = ({y, note}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 9, stiffness: 150}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.5 + 0.5 * s})`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: 'rgba(10,8,28,0.7)', padding: '16px 34px',
        borderRadius: 30, border: `3px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`}}>
        <Img src={staticFile('logo.png')} style={{width: 92, height: 92}} />
        <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 66, color: C.yel, textShadow: extrude('#7A3A0A', 5, 2)}}>
          BudgetLoyer.com</span>
      </div>
      {note ? <div style={{fontFamily: 'Inter', fontWeight: 500, fontSize: 28, color: '#B8B0D0', marginTop: 18}}>{note}</div> : null}
    </div>
  );
};

/** Petite note de source / mention (gris clair, lisible). */
export const Note2: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 70, right: 140, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600,
    fontSize: 28, color: 'rgba(235,228,255,0.8)', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{children}</div>
);
