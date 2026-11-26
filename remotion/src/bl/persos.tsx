// Personnages vectoriels BudgetLoyer (18 nov. 2026) : ils clignent des yeux, parlent, respirent, rebondissent.
// P1 (héros récurrent), Monsieur Découvert, la Manette, Ton compte. Tous génériques : aucun personnage protégé.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useSpring} from './anim';
import {CYAN, GREEN, RED, YEL, rand} from './theme';

export type Expr = 'happy' | 'neutral' | 'worry' | 'sad' | 'angry' | 'shock' | 'cool';
const K = '#16121F';

// ---- visage commun -----------------------------------------------------------
/** Visage SVG : yeux qui clignent et suivent `look`, sourcils et bouche selon l'expression, bouche qui parle. */
export const Face: React.FC<{cx: number; cy: number; s?: number; expr?: Expr; talk?: boolean; look?: number; seed?: number;
  gap?: number; blush?: boolean}> = ({cx, cy, s = 1, expr = 'neutral', talk = false, look = 0, seed = 1, gap = 50, blush = true}) => {
  const f = useCurrentFrame();
  const period = 80 + Math.floor(rand(seed) * 50);
  const ph = (f + Math.floor(rand(seed + 3) * period)) % period;
  const blink = ph < 4 ? [0.15, 0.08, 0.15, 0.6][ph] : 1;
  const ex = gap * s;
  const eyeR = (expr === 'shock' ? 24 : 19) * s;
  const pupil = (expr === 'shock' ? 6 : 9) * s;
  const lx = look * 6 * s;
  const brow = (side: number) => {
    const x0 = cx + side * (ex - 26 * s), x1 = cx + side * (ex + 22 * s);
    const y = cy - 38 * s;
    const d = {angry: [12, -10], worry: [-12, 6], sad: [-12, 6], shock: [-14, -14], neutral: [0, 0], happy: [-4, -4], cool: [0, 0]}[expr];
    return <line x1={x0} y1={y + d[0] * s} x2={x1} y2={y + d[1] * s} stroke={K} strokeWidth={9 * s} strokeLinecap="round" />;
  };
  // bouche
  const my = cy + 52 * s;
  const open = talk ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.75 + seed)) : 0;
  let mouth: React.ReactNode;
  if (talk || expr === 'shock') {
    const h = expr === 'shock' && !talk ? 26 * s : (8 + 26 * open) * s;
    const w = expr === 'shock' && !talk ? 20 * s : (26 + 6 * open) * s;
    mouth = (
      <g>
        <ellipse cx={cx} cy={my} rx={w} ry={h} fill="#7A1E2E" stroke={K} strokeWidth={5 * s} />
        <ellipse cx={cx} cy={my + h * 0.45} rx={w * 0.55} ry={h * 0.35} fill="#E86A7A" />
      </g>
    );
  } else if (expr === 'happy') {
    mouth = (
      <g>
        <path d={`M ${cx - 40 * s} ${my - 10 * s} Q ${cx} ${my + 44 * s} ${cx + 40 * s} ${my - 10 * s} Z`} fill="#7A1E2E" stroke={K}
          strokeWidth={5 * s} strokeLinejoin="round" />
        <path d={`M ${cx - 30 * s} ${my - 6 * s} L ${cx + 30 * s} ${my - 6 * s} L ${cx + 26 * s} ${my + 4 * s} L ${cx - 26 * s} ${my + 4 * s} Z`} fill="white" />
      </g>
    );
  } else if (expr === 'sad') {
    mouth = <path d={`M ${cx - 26 * s} ${my + 12 * s} Q ${cx} ${my - 12 * s} ${cx + 26 * s} ${my + 12 * s}`} fill="none" stroke={K} strokeWidth={7 * s} strokeLinecap="round" />;
  } else if (expr === 'worry') {
    mouth = <path d={`M ${cx - 28 * s} ${my + 4 * s} q ${9 * s} ${-10 * s} ${18 * s} 0 t ${18 * s} 0 t ${18 * s} 0`} fill="none" stroke={K} strokeWidth={7 * s} strokeLinecap="round" />;
  } else if (expr === 'angry') {
    mouth = (
      <g>
        <rect x={cx - 32 * s} y={my - 10 * s} width={64 * s} height={22 * s} rx={8 * s} fill="white" stroke={K} strokeWidth={5 * s} />
        <line x1={cx - 30 * s} y1={my + 1 * s} x2={cx + 30 * s} y2={my + 1 * s} stroke={K} strokeWidth={3 * s} />
      </g>
    );
  } else if (expr === 'cool') {
    mouth = <path d={`M ${cx - 20 * s} ${my + 2 * s} Q ${cx + 10 * s} ${my + 16 * s} ${cx + 34 * s} ${my - 8 * s}`} fill="none" stroke={K} strokeWidth={7 * s} strokeLinecap="round" />;
  } else {
    mouth = <path d={`M ${cx - 26 * s} ${my - 4 * s} Q ${cx} ${my + 18 * s} ${cx + 26 * s} ${my - 4 * s}`} fill="none" stroke={K} strokeWidth={7 * s} strokeLinecap="round" />;
  }
  let eyes: React.ReactNode;
  if (expr === 'happy') {
    eyes = [-1, 1].map((sd) => (
      <path key={sd} d={`M ${cx + sd * ex - 20 * s} ${cy + 6 * s} Q ${cx + sd * ex} ${cy - 22 * s} ${cx + sd * ex + 20 * s} ${cy + 6 * s}`}
        fill="none" stroke={K} strokeWidth={8 * s} strokeLinecap="round" />
    ));
  } else if (expr === 'cool') {
    eyes = (
      <g>
        <rect x={cx - ex - 40 * s} y={cy - 26 * s} width={80 * s} height={50 * s} rx={18 * s} fill={K} />
        <rect x={cx + ex - 40 * s} y={cy - 26 * s} width={80 * s} height={50 * s} rx={18 * s} fill={K} />
        <rect x={cx - ex + 30 * s} y={cy - 16 * s} width={2 * ex - 60 * s} height={10 * s} fill={K} />
        <line x1={cx - ex - 24 * s} y1={cy - 14 * s} x2={cx - ex} y2={cy - 14 * s} stroke="#8C8CB4" strokeWidth={6 * s} strokeLinecap="round" />
        <line x1={cx + ex - 24 * s} y1={cy - 14 * s} x2={cx + ex} y2={cy - 14 * s} stroke="#8C8CB4" strokeWidth={6 * s} strokeLinecap="round" />
      </g>
    );
  } else {
    eyes = [-1, 1].map((sd) => (
      <g key={sd}>
        <ellipse cx={cx + sd * ex} cy={cy} rx={eyeR * 0.88} ry={eyeR * blink} fill="white" stroke={K} strokeWidth={5 * s} />
        {blink > 0.5 ? <circle cx={cx + sd * ex + lx} cy={cy + 2 * s} r={pupil} fill={K} /> : null}
        {blink > 0.5 ? <circle cx={cx + sd * ex + lx + 3 * s} cy={cy - 3 * s} r={pupil * 0.32} fill="white" /> : null}
      </g>
    ));
  }
  return (
    <g>
      {blush && (expr === 'happy' || expr === 'neutral') ? (
        <g opacity={0.55}>
          <ellipse cx={cx - ex - 30 * s} cy={cy + 34 * s} rx={22 * s} ry={13 * s} fill="#FF8FA3" />
          <ellipse cx={cx + ex + 30 * s} cy={cy + 34 * s} rx={22 * s} ry={13 * s} fill="#FF8FA3" />
        </g>
      ) : null}
      {eyes}
      {expr !== 'happy' && expr !== 'cool' ? [brow(-1), brow(1)] : null}
      {mouth}
    </g>
  );
};

// ---- enveloppe commune : position, entrée à ressort, respiration, tremblement, ombre ----------------------------
export type PersoProps = {x: number; y: number; w: number; delay?: number; shake?: number; flip?: boolean; bob?: number};

export const Perso: React.FC<PersoProps & {ratio: number; children: React.ReactNode; seed?: number}> = (
  {x, y, w, delay = 0, shake = 0, flip = false, bob = 1, ratio, seed = 1, children},
) => {
  const f = useCurrentFrame();
  const s = useSpring(delay, {damping: 9, stiffness: 140});
  const breath = Math.sin(f / 7 + seed);
  const sq = 1 + 0.025 * breath * bob;
  const sx = shake ? Math.sin(f * 2.3) * shake : 0;
  const h = w * ratio;
  return (
    <div style={{position: 'absolute', left: x - w / 2 + sx, top: y + breath * 6 * bob + (1 - s) * 420, width: w, height: h,
      transform: `scale(${(flip ? -1 : 1) * (2 - sq)}, ${sq})`, transformOrigin: 'bottom center'}}>
      <div style={{position: 'absolute', left: '15%', right: '15%', bottom: -24, height: 36, borderRadius: '50%',
        background: 'rgba(0,0,0,0.4)', filter: 'blur(10px)'}} />
      {children}
    </div>
  );
};

// ---- P1 ----------------------------------------------------------------------------------------------
/** P1, héros récurrent : sweat à capuche violet, cheveux en pics, casque cyan. `wave` : lève la main. */
export const P1: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; wave?: boolean}> = (
  {expr = 'neutral', talk, look = 0, wave, ...p},
) => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f / 11) * 2 + (talk ? Math.sin(f / 3) * 1.5 : 0);
  const arm = wave ? Math.sin(f / 3) * 14 : 0;
  return (
    <Perso {...p} ratio={820 / 760} seed={7}>
      <svg viewBox="0 0 760 820" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="p1hood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6E58E0" /><stop offset="1" stopColor="#4A36B4" />
          </linearGradient>
          <radialGradient id="p1skin" cx="0.45" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#FFD9B5" /><stop offset="1" stopColor="#EDB98E" />
          </radialGradient>
        </defs>
        {/* buste */}
        <path d="M 90 820 L 90 690 Q 90 540 250 520 L 510 520 Q 670 540 670 690 L 670 820 Z" fill="url(#p1hood)" stroke={K} strokeWidth={10} />
        <path d="M 265 520 Q 380 600 495 520 L 470 640 Q 380 690 290 640 Z" fill="#3B2A9A" stroke={K} strokeWidth={8} />
        <line x1={335} y1={610} x2={325} y2={700} stroke="white" strokeWidth={10} strokeLinecap="round" />
        <line x1={425} y1={610} x2={435} y2={700} stroke="white" strokeWidth={10} strokeLinecap="round" />
        <circle cx={325} cy={708} r={9} fill="white" /><circle cx={435} cy={708} r={9} fill="white" />
        <text x={380} y={800} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={92} fill="#EAE6FF">P1</text>
        {wave ? (
          <g transform={`rotate(${-20 + arm} 640 640)`}>
            <path d="M 600 660 Q 720 570 735 440" fill="none" stroke={K} strokeWidth={104} strokeLinecap="round" />
            <path d="M 600 660 Q 720 570 735 440" fill="none" stroke="#5A46CC" strokeWidth={86} strokeLinecap="round" />
            <circle cx={738} cy={392} r={50} fill="url(#p1skin)" stroke={K} strokeWidth={8} />
          </g>
        ) : null}
        {/* tête */}
        <g transform={`rotate(${tilt} 380 470)`}>
          <rect x={330} y={440} width={100} height={110} rx={36} fill="#DDA77C" stroke={K} strokeWidth={8} />
          <ellipse cx={380} cy={300} rx={158} ry={172} fill="url(#p1skin)" stroke={K} strokeWidth={10} />
          <path d="M 222 255 L 208 170 L 255 188 L 258 100 L 312 150 L 345 62 L 392 132 L 442 70 L 468 150 L 522 106 L 518 186 L 560 170 L 548 258 Q 500 196 430 222 Q 380 180 330 214 Q 280 190 222 255 Z"
            fill="#1C183A" stroke={K} strokeWidth={8} strokeLinejoin="round" />
          <path d="M 205 300 Q 205 105 380 105 Q 555 105 555 300" fill="none" stroke="#24283E" strokeWidth={18} />
          <rect x={190} y={250} width={50} height={118} rx={20} fill={CYAN} stroke={K} strokeWidth={8} />
          <rect x={520} y={250} width={50} height={118} rx={20} fill={CYAN} stroke={K} strokeWidth={8} />
          <Face cx={380 + look * 6} cy={310} s={1.55} expr={expr} talk={talk} look={look} seed={7} gap={50} />
        </g>
      </svg>
    </Perso>
  );
};

// ---- Monsieur Découvert ----------------------------------------------------------------------------------------
/** Monsieur Découvert, petit monstre rouge récurrent. `label` : montant sur le ventre. */
export const Decouvert: React.FC<PersoProps & {expr?: Expr; talk?: boolean; label?: string; look?: number}> = (
  {expr = 'angry', talk, label = '-50 €', look = 0, ...p},
) => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 4) * 4;
  return (
    <Perso {...p} ratio={300 / 320} seed={13} bob={1.6}>
      <svg viewBox="0 0 320 300" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <radialGradient id="dec" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#FF6B6B" /><stop offset="1" stopColor="#C42A3A" /></radialGradient>
        </defs>
        <path d={`M 64 76 L ${30 + wob} -36 L 126 40 Z`} fill="#7A1426" stroke={K} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M 256 76 L ${290 - wob} -36 L 194 40 Z`} fill="#7A1426" stroke={K} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={160} cy={156} rx={148} ry={126} fill="url(#dec)" stroke={K} strokeWidth={9} />
        <ellipse cx={120} cy={90} rx={40} ry={18} fill="white" opacity={0.25} />
        <Face cx={160} cy={118} s={0.85} expr={expr} talk={talk} look={look} seed={13} gap={48} blush={false} />
        <text x={160} y={250} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={46} fill={YEL} stroke={K}
          strokeWidth={6} paintOrder="stroke">{label}</text>
      </svg>
    </Perso>
  );
};

// ---- Manette ---------------------------------------------------------------------------------------------------
/** Manette de jeu générique (aucune marque) ; les boutons s'allument à tour de rôle ; `label` sur l'écran du haut. */
export const Manette: React.FC<PersoProps & {expr?: Expr; talk?: boolean; label?: string}> = (
  {expr = 'neutral', talk, label, ...p},
) => {
  const f = useCurrentFrame();
  const lit = Math.floor(f / 8) % 4;
  return (
    <Perso {...p} ratio={420 / 620} seed={3}>
      <svg viewBox="0 0 620 420" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="man" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B4CC4" /><stop offset="1" stopColor="#3A2E96" /></linearGradient>
        </defs>
        {label ? (
          <g>
            <rect x={200} y={30} width={220} height={74} rx={18} fill={K} />
            <rect x={208} y={38} width={204} height={58} rx={12} fill="#141A28" />
            <text x={310} y={80} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={36} fill={YEL}>{label}</text>
          </g>
        ) : null}
        <path d="M 130 110 L 490 110 Q 590 110 600 230 L 610 330 Q 612 410 530 410 Q 470 410 440 340 L 180 340 Q 150 410 90 410 Q 8 410 10 330 L 20 230 Q 30 110 130 110 Z"
          fill="url(#man)" stroke={K} strokeWidth={12} strokeLinejoin="round" />
        <ellipse cx={200} cy={150} rx={90} ry={16} fill="white" opacity={0.15} />
        <rect x={98} y={170} width={40} height={100} rx={8} fill={K} />
        <rect x={68} y={200} width={100} height={40} rx={8} fill={K} />
        {[[482, 168, GREEN], [526, 212, RED], [438, 212, CYAN], [482, 256, YEL]].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={y as number} r={23} fill={K} />
            <circle cx={x as number} cy={y as number} r={17} fill={c as string} opacity={lit === i ? 1 : 0.75} />
            {lit === i ? <circle cx={x as number} cy={y as number} r={30} fill={c as string} opacity={0.3} /> : null}
          </g>
        ))}
        <Face cx={310} cy={212} s={0.95} expr={expr} talk={talk} seed={3} gap={50} />
      </svg>
    </Perso>
  );
};

// ---- Ton compte ------------------------------------------------------------------------------------------------
/** « Ton compte » : tirelire-écran verte, bandeau sur le front (`label`, ex. « 1 850 € », « ??? »). */
export const Compte: React.FC<PersoProps & {expr?: Expr; talk?: boolean; label?: string; look?: number}> = (
  {expr = 'neutral', talk, label = '', look = 0, ...p},
) => {
  const labCol = ['neutral', 'happy', 'cool'].includes(expr) ? GREEN : ['worry', 'sad'].includes(expr) ? YEL : RED;
  const drops = expr === 'shock' || expr === 'worry';
  const f = useCurrentFrame();
  return (
    <Perso {...p} ratio={600 / 560} seed={21}>
      <svg viewBox="0 0 560 600" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="cpt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2FD99A" /><stop offset="1" stopColor="#1BA56E" /></linearGradient>
        </defs>
        <rect x={230} y={18} width={100} height={36} rx={14} fill={K} />
        <rect x={24} y={44} width={512} height={530} rx={118} fill="url(#cpt)" stroke={K} strokeWidth={14} />
        <ellipse cx={170} cy={120} rx={90} ry={22} fill="white" opacity={0.2} />
        <rect x={100} y={92} width={360} height={84} rx={30} fill={K} />
        {label ? <text x={280} y={152} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={54} fill={labCol}>{label}</text> : null}
        <Face cx={280} cy={320} s={1.9} expr={expr} talk={talk} look={look} seed={21} gap={50} />
        {drops ? (
          <g transform={`translate(0 ${(f % 30) * 1.5})`} opacity={1 - (f % 30) / 30}>
            <path d="M 476 214 L 456 262 A 22 22 0 1 0 496 262 Z" fill="#78C8FF" />
          </g>
        ) : null}
      </svg>
    </Perso>
  );
};

// ---- Sam (19 nov. 2026) ----------------------------------------------------------------------------------------
/** Sam, la personne avec qui P1 vit (série « Survie · À deux ») : bonnet orange, veste verte, prénom neutre. */
export const Sam: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; label?: string}> = (
  {expr = 'neutral', talk, look = 0, label, ...p},
) => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f / 13 + 1) * 2 + (talk ? Math.sin(f / 3) * 1.5 : 0);
  return (
    <Perso {...p} ratio={820 / 760} seed={31}>
      <svg viewBox="0 0 760 820" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="samjk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2FBF9B" /><stop offset="1" stopColor="#1C8C72" />
          </linearGradient>
          <radialGradient id="samskin" cx="0.45" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#C68B5E" /><stop offset="1" stopColor="#A86E45" />
          </radialGradient>
        </defs>
        <path d="M 90 820 L 90 690 Q 90 540 250 520 L 510 520 Q 670 540 670 690 L 670 820 Z" fill="url(#samjk)" stroke={K} strokeWidth={10} />
        <path d="M 300 520 L 380 640 L 460 520 Z" fill="#F4F1E8" stroke={K} strokeWidth={8} strokeLinejoin="round" />
        <line x1={380} y1={640} x2={380} y2={820} stroke={K} strokeWidth={8} />
        {label ? (
          <g>
            <rect x={200} y={690} width={360} height={90} rx={24} fill={K} />
            <text x={380} y={752} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={54} fill={YEL}>{label}</text>
          </g>
        ) : null}
        <g transform={`rotate(${tilt} 380 470)`}>
          <rect x={330} y={440} width={100} height={110} rx={36} fill="#9A6440" stroke={K} strokeWidth={8} />
          <ellipse cx={380} cy={300} rx={158} ry={172} fill="url(#samskin)" stroke={K} strokeWidth={10} />
          {/* cheveux bouclés qui dépassent du bonnet */}
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <circle cx={380 + sd * 150} cy={250} r={34} fill="#2A1A14" stroke={K} strokeWidth={7} />
              <circle cx={380 + sd * 160} cy={300} r={28} fill="#2A1A14" stroke={K} strokeWidth={7} />
            </g>
          ))}
          {/* bonnet */}
          <path d="M 214 238 Q 220 92 380 88 Q 540 92 546 238 Z" fill="#FF8A3D" stroke={K} strokeWidth={10} strokeLinejoin="round" />
          <rect x={204} y={210} width={352} height={58} rx={26} fill="#E86A1E" stroke={K} strokeWidth={9} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={240 + i * 56} y1={218} x2={240 + i * 56} y2={260} stroke="#C2560F" strokeWidth={8} strokeLinecap="round" />
          ))}
          <circle cx={380} cy={78} r={34} fill="#FFD640" stroke={K} strokeWidth={8} />
          <Face cx={380 + look * 6} cy={322} s={1.5} expr={expr} talk={talk} look={look} seed={31} gap={52} />
        </g>
      </svg>
    </Perso>
  );
};

// ---- Pompier (19 nov. 2026) ------------------------------------------------------------------------------------
/** Sapeur-pompier générique (aucun écusson réel) : casque argenté, tenue bleu marine à bandes, calendrier en main.
 *  `silhouette` : uniquement l'ombre (vue par le judas avant la révélation). */
export const Pompier: React.FC<PersoProps & {expr?: Expr; talk?: boolean; silhouette?: boolean; year?: string}> = (
  {expr = 'happy', talk, silhouette, year = '2027', ...p},
) => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f / 12) * 1.6;
  const S = silhouette ? '#05060F' : undefined;
  return (
    <Perso {...p} ratio={880 / 760} seed={41}>
      <svg viewBox="0 0 760 880" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="pmpcasque" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2F5FA" /><stop offset="0.5" stopColor="#B9C2D0" /><stop offset="1" stopColor="#7D8899" />
          </linearGradient>
          <radialGradient id="pmpskin" cx="0.45" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#FFD9B5" /><stop offset="1" stopColor="#EDB98E" />
          </radialGradient>
        </defs>
        {/* buste : veste bleu marine, bandes réfléchissantes */}
        <path d="M 80 880 L 80 730 Q 80 580 250 560 L 510 560 Q 680 580 680 730 L 680 880 Z" fill={S ?? '#1E2A5A'} stroke={K} strokeWidth={10} />
        {!silhouette ? (
          <g>
            <rect x={84} y={760} width={592} height={30} fill="#D8E04A" stroke={K} strokeWidth={6} />
            <rect x={84} y={792} width={592} height={14} fill="#C8CCD4" />
            <path d="M 300 560 L 380 650 L 460 560" fill="none" stroke="#F04242" strokeWidth={16} strokeLinejoin="round" />
          </g>
        ) : null}
        {/* calendrier tenu devant */}
        <g transform="rotate(-6 560 700)">
          <rect x={470} y={600} width={210} height={250} rx={14} fill={S ?? 'white'} stroke={K} strokeWidth={9} />
          {!silhouette ? (
            <g>
              <rect x={470} y={600} width={210} height={70} rx={14} fill="#F04242" stroke={K} strokeWidth={9} />
              <text x={575} y={650} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={44} fill="white">{year}</text>
              {Array.from({length: 12}, (_, i) => (
                <rect key={i} x={492 + (i % 4) * 44} y={694 + Math.floor(i / 4) * 44} width={30} height={30} rx={5}
                  fill={i === 10 ? '#20E388' : '#DCE2EC'} />
              ))}
            </g>
          ) : null}
          <circle cx={480} cy={740} r={40} fill={S ?? 'url(#pmpskin)'} stroke={K} strokeWidth={8} />
        </g>
        {/* tête + casque */}
        <g transform={`rotate(${tilt} 380 500)`}>
          <rect x={330} y={470} width={100} height={110} rx={36} fill={S ?? '#DDA77C'} stroke={K} strokeWidth={8} />
          <ellipse cx={380} cy={350} rx={150} ry={160} fill={S ?? 'url(#pmpskin)'} stroke={K} strokeWidth={10} />
          {!silhouette ? <Face cx={380} cy={372} s={1.45} expr={expr} talk={talk} seed={41} gap={50} /> : null}
          <path d="M 196 300 Q 196 96 380 90 Q 564 96 564 300 Z" fill={S ?? 'url(#pmpcasque)'} stroke={K} strokeWidth={11} strokeLinejoin="round" />
          <path d="M 380 92 L 380 296" stroke={S ?? '#8F9AAA'} strokeWidth={22} />
          <rect x={176} y={282} width={408} height={42} rx={20} fill={S ?? '#5A6474'} stroke={K} strokeWidth={9} />
          {!silhouette ? <ellipse cx={300} cy={160} rx={46} ry={22} fill="white" opacity={0.55} /> : null}
          {!silhouette ? <rect x={250} y={296} width={260} height={16} rx={8} fill="#F04242" /> : null}
        </g>
      </svg>
    </Perso>
  );
};

// ---- Collègue (20 nov. 2026) -----------------------------------------------------------------------------------
/** Collègue de bureau générique, déclinable : coiffure, couleur du haut, peau, accessoire. Pour les sketchs au travail
 *  (Secret Santa, pot de départ, cagnotte…). Aucun personnage réel ni protégé. */
export type Coiffure = 'court' | 'chignon' | 'chauve' | 'boucles';
export const Collegue: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; hair?: Coiffure; hairCol?: string;
  top?: string; skin?: [string, string]; acc?: 'lunettes' | 'cravate' | 'badge' | 'bonnet' | 'none'; seed?: number}> = (
  {expr = 'neutral', talk, look = 0, hair = 'court', hairCol = '#3A2418', top = '#3D7BE0', skin = ['#FFD9B5', '#EDB98E'],
    acc = 'none', seed = 51, ...p},
) => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f / 12 + seed) * 2 + (talk ? Math.sin(f / 3) * 1.5 : 0);
  const id = `col${seed}`;
  return (
    <Perso {...p} ratio={820 / 760} seed={seed}>
      <svg viewBox="0 0 760 820" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <radialGradient id={`${id}skin`} cx="0.45" cy="0.4" r="0.7">
            <stop offset="0" stopColor={skin[0]} /><stop offset="1" stopColor={skin[1]} />
          </radialGradient>
        </defs>
        <path d="M 90 820 L 90 690 Q 90 540 250 520 L 510 520 Q 670 540 670 690 L 670 820 Z" fill={top} stroke={K} strokeWidth={10} />
        <path d="M 300 520 L 380 600 L 460 520 Z" fill="#F4F1E8" stroke={K} strokeWidth={8} strokeLinejoin="round" />
        {acc === 'cravate' ? (
          <path d="M 362 596 L 398 596 L 410 760 L 380 800 L 350 760 Z" fill={RED} stroke={K} strokeWidth={8} strokeLinejoin="round" />
        ) : null}
        {acc === 'badge' ? (
          <g>
            <line x1={330} y1={530} x2={300} y2={690} stroke={CYAN} strokeWidth={8} />
            <rect x={240} y={680} width={120} height={84} rx={12} fill="white" stroke={K} strokeWidth={7} />
            <rect x={256} y={700} width={40} height={40} rx={6} fill={CYAN} />
          </g>
        ) : null}
        <g transform={`rotate(${tilt} 380 470)`}>
          <rect x={330} y={440} width={100} height={110} rx={36} fill={skin[1]} stroke={K} strokeWidth={8} />
          {hair === 'chignon' ? <circle cx={380} cy={110} r={66} fill={hairCol} stroke={K} strokeWidth={9} /> : null}
          {hair === 'boucles' ? [-1, 1].map((sd) => (
            <g key={sd}>
              <circle cx={380 + sd * 150} cy={230} r={46} fill={hairCol} stroke={K} strokeWidth={8} />
              <circle cx={380 + sd * 166} cy={300} r={40} fill={hairCol} stroke={K} strokeWidth={8} />
            </g>
          )) : null}
          <ellipse cx={380} cy={300} rx={158} ry={172} fill={`url(#${id}skin)`} stroke={K} strokeWidth={10} />
          {hair === 'court' ? (
            <path d="M 224 270 Q 210 120 380 118 Q 552 120 538 270 Q 520 200 450 196 Q 380 170 300 200 Q 240 206 224 270 Z"
              fill={hairCol} stroke={K} strokeWidth={9} strokeLinejoin="round" />
          ) : null}
          {hair === 'chignon' || hair === 'boucles' ? (
            <path d="M 222 280 Q 214 128 380 124 Q 548 128 540 280 Q 470 190 380 210 Q 290 190 222 280 Z"
              fill={hairCol} stroke={K} strokeWidth={9} strokeLinejoin="round" />
          ) : null}
          {hair === 'chauve' ? <ellipse cx={330} cy={170} rx={50} ry={22} fill="white" opacity={0.4} /> : null}
          {acc === 'bonnet' ? (
            <g>
              <path d="M 214 230 Q 230 70 400 80 Q 520 90 560 200 L 600 150" fill={RED} stroke={K} strokeWidth={10} strokeLinejoin="round" />
              <rect x={204} y={204} width={352} height={56} rx={26} fill="white" stroke={K} strokeWidth={9} />
              <circle cx={606} cy={146} r={30} fill="white" stroke={K} strokeWidth={8} />
            </g>
          ) : null}
          <Face cx={380 + look * 6} cy={322} s={1.5} expr={expr} talk={talk} look={look} seed={seed} gap={52} />
          {acc === 'lunettes' ? (
            <g fill="none" stroke={K} strokeWidth={9}>
              <circle cx={302} cy={308} r={46} /><circle cx={458} cy={308} r={46} />
              <line x1={348} y1={304} x2={412} y2={304} />
            </g>
          ) : null}
        </g>
      </svg>
    </Perso>
  );
};

// ---- Le Bocal (22 nov. 2026) -----------------------------------------------------------------------------------
/** Bocal d'épargne en verre, avec un visage : pièces qui montent selon `level` (0-1), étiquette du montant.
 *  `drop` : image où 3 pièces tombent dedans (−1 : aucune). Objet générique, aucun personnage protégé. */
export const Bocal: React.FC<PersoProps & {expr?: Expr; talk?: boolean; level?: number; label?: string; drop?: number;
  look?: number}> = ({expr = 'happy', talk, level = 0, label, drop = -1, look = 0, ...p}) => {
  const f = useCurrentFrame();
  const lv = Math.max(0, Math.min(1, level));
  const top = 300, bottom = 900;
  const surf = bottom - 20 - lv * (bottom - top - 60);
  const rows = Math.round(lv * 14);
  return (
    <Perso {...p} ratio={1000 / 760} seed={61}>
      <svg viewBox="0 0 760 1000" width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="bocalglass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#BFEFFF" stopOpacity={0.55} /><stop offset="0.5" stopColor="#E8FAFF" stopOpacity={0.3} />
            <stop offset="1" stopColor="#9FDDF2" stopOpacity={0.55} />
          </linearGradient>
          <clipPath id="bocalclip"><rect x={130} y={top} width={500} height={bottom - top} rx={90} /></clipPath>
        </defs>
        {/* pièces */}
        <g clipPath="url(#bocalclip)">
          {lv > 0 ? <rect x={120} y={surf} width={520} height={bottom - surf + 20} fill="#E8A92A" /> : null}
          {Array.from({length: rows}, (_, r) => Array.from({length: 6}, (_, c) => {
            const cx = 170 + c * 84 + (r % 2) * 40;
            const cy = bottom - 40 - r * ((bottom - top - 60) / 14);
            return <ellipse key={`${r}-${c}`} cx={cx} cy={cy} rx={40} ry={16} fill="#FFD640" stroke="#B87A10" strokeWidth={5} />;
          }))}
        </g>
        {/* verre */}
        <rect x={130} y={top} width={500} height={bottom - top} rx={90} fill="url(#bocalglass)" stroke={K} strokeWidth={12} />
        <path d="M 180 380 Q 170 560 186 760" fill="none" stroke="white" strokeWidth={18} strokeLinecap="round" opacity={0.7} />
        {/* col et couvercle */}
        <rect x={190} y={230} width={380} height={86} rx={22} fill="#20E388" stroke={K} strokeWidth={10} />
        <rect x={210} y={250} width={340} height={18} rx={9} fill="#7FF5BE" />
        <rect x={330} y={190} width={100} height={44} rx={10} fill={K} />
        {/* visage */}
        <Face cx={380 + look * 6} cy={460} s={1.45} expr={expr} talk={talk} look={look} seed={61} gap={60} />
        {/* étiquette */}
        {label ? (
          <g>
            <rect x={200} y={600} width={360} height={120} rx={26} fill="white" stroke={K} strokeWidth={9} />
            <text x={380} y={683} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={label.length > 6 ? 66 : 76}
              fill={K}>{label}</text>
          </g>
        ) : null}
        {/* pièces qui tombent */}
        {drop >= 0 ? [0, 1, 2].map((i) => {
          const t = (f - drop - i * 4) / 14;
          if (t < 0 || t > 1) return null;
          const y = -120 + t * (surf + 140);
          return (
            <g key={i} transform={`translate(${330 + i * 50} ${y}) rotate(${t * 300 + i * 40})`}>
              <circle r={42} fill="#FFD640" stroke="#B87A10" strokeWidth={7} />
              <text y={18} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={50} fill="#B87A10">€</text>
            </g>
          );
        }) : null}
      </svg>
    </Perso>
  );
};

// ---- Les Sapins (25 nov. 2026) ---------------------------------------------------------------------------------
/** Sapin de Noël avec un visage. `kind="naturel"` : vert profond, branches irrégulières, bûche en pied, aiguilles qui
 *  tombent si `needles` ; `kind="plastique"` : vert vif uniforme, coutures droites, posé dans son carton « SAPIN ».
 *  `label` : pastille de prix accrochée. Objets génériques, aucun personnage protégé. */
export const Sapin: React.FC<PersoProps & {kind?: 'naturel' | 'plastique'; expr?: Expr; talk?: boolean; look?: number;
  needles?: boolean; label?: string}> = ({kind = 'naturel', expr = 'happy', talk, look = 0, needles = false, label, ...p}) => {
  const f = useCurrentFrame();
  const nat = kind === 'naturel';
  const dark = nat ? '#14703E' : '#2FB868';
  const mid = nat ? '#1E8F4E' : '#3FCB7A';
  const lite = nat ? '#34B062' : '#7FE5A6';
  const tier = (y0: number, y1: number, half: number, i: number) => {
    if (!nat) {
      return <path key={i} d={`M 300 ${y0} L ${300 + half} ${y1} L ${300 - half} ${y1} Z`} fill={mid} stroke={K} strokeWidth={10}
        strokeLinejoin="round" />;
    }
    const pts: string[] = [`300 ${y0}`];
    const n = 5;
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      pts.push(`${300 + half * t + (k % 2 ? 22 : -6)} ${y0 + (y1 - y0) * t + (k % 2 ? -14 : 0)}`);
    }
    for (let k = n; k >= 1; k--) {
      const t = k / n;
      pts.push(`${300 - half * t - (k % 2 ? 22 : -6)} ${y0 + (y1 - y0) * t + (k % 2 ? -14 : 0)}`);
    }
    return <path key={i} d={`M ${pts.join(' L ')} Z`} fill={mid} stroke={K} strokeWidth={10} strokeLinejoin="round" />;
  };
  const balls = [[230, 330, RED], [370, 300, YEL], [190, 560, CYAN], [420, 600, RED], [300, 700, YEL], [470, 450, CYAN]];
  return (
    <Perso {...p} ratio={1000 / 600} seed={nat ? 71 : 73}>
      <svg viewBox="0 0 600 1000" width="100%" height="100%" style={{overflow: 'visible'}}>
        {/* pied */}
        {nat ? (
          <g>
            <rect x={262} y={740} width={76} height={90} fill="#7A4A26" stroke={K} strokeWidth={9} />
            <ellipse cx={300} cy={850} rx={150} ry={46} fill="#9B6234" stroke={K} strokeWidth={10} />
            <ellipse cx={300} cy={840} rx={110} ry={26} fill="#C88B52" />
          </g>
        ) : (
          <g>
            <rect x={286} y={740} width={28} height={70} fill="#4A4A55" stroke={K} strokeWidth={7} />
            <rect x={110} y={790} width={380} height={190} rx={8} fill="#C9935A" stroke={K} strokeWidth={10} />
            <path d="M 110 790 L 70 730 L 250 730 L 290 790" fill="#B37E48" stroke={K} strokeWidth={9} strokeLinejoin="round" />
            <path d="M 490 790 L 530 730 L 350 730 L 310 790" fill="#B37E48" stroke={K} strokeWidth={9} strokeLinejoin="round" />
            <text x={300} y={915} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={70} fill={K}>SAPIN</text>
          </g>
        )}
        {/* étages */}
        {tier(250, 770, 270, 0)}
        {tier(150, 560, 210, 1)}
        {tier(60, 360, 150, 2)}
        {nat ? [0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M ${170 + i * 52} ${420 + (i % 3) * 110} l 18 -24 l 18 24`} fill="none" stroke={lite} strokeWidth={7}
            strokeLinecap="round" />
        )) : [0, 1, 2].map((i) => (
          <line key={i} x1={300} y1={[90, 190, 290][i]} x2={300} y2={[350, 550, 760][i]} stroke={dark} strokeWidth={6} />
        ))}
        {/* boules */}
        {balls.map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={y as number} r={24} fill={c as string} stroke={K} strokeWidth={6} />
            <circle cx={(x as number) - 8} cy={(y as number) - 8} r={6} fill="white" opacity={0.7} />
          </g>
        ))}
        {/* étoile */}
        <g transform={`translate(300 48) rotate(${Math.sin(f / 10) * 8})`}>
          <path d="M 0 -62 L 17 -20 L 62 -18 L 27 10 L 39 55 L 0 30 L -39 55 L -27 10 L -62 -18 L -17 -20 Z" fill={YEL}
            stroke={K} strokeWidth={8} strokeLinejoin="round" />
        </g>
        {/* visage */}
        <Face cx={300 + look * 6} cy={440} s={1.25} expr={expr} talk={talk} look={look} seed={nat ? 71 : 73} gap={58} />
        {/* étiquette de prix */}
        {label ? (
          <g transform="rotate(-8 300 640)">
            <line x1={240} y1={560} x2={210} y2={610} stroke={K} strokeWidth={5} />
            <rect x={110} y={600} width={380} height={110} rx={20} fill="white" stroke={K} strokeWidth={9} />
            <text x={300} y={680} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={label.length > 7 ? 64 : 74}
              fill={K}>{label}</text>
          </g>
        ) : null}
        {/* aiguilles qui tombent */}
        {needles ? Array.from({length: 10}, (_, i) => {
          const t = ((f + i * 9) % 40) / 40;
          const x = 140 + rand(i + 5) * 320 + Math.sin(f / 6 + i) * 14;
          const y = 380 + t * 470;
          return <line key={i} x1={x} y1={y} x2={x + 14} y2={y + 20} stroke="#6E8F3A" strokeWidth={6} strokeLinecap="round"
            opacity={1 - t * 0.6} />;
        }) : null}
      </svg>
    </Perso>
  );
};

// ---- Le Calendrier de l'Avent (26 nov. 2026) -------------------------------------------------------------------
/** Calendrier de l'Avent avec un visage : boîte rouge, 24 portes numérotées (dans le désordre, comme les vrais).
 *  `opened` : nombre de portes ouvertes (0-24, peut être fractionnaire pour animer) ; une porte ouverte montre un
 *  chocolat, sauf si `eaten` (case vide). `label` : pastille de prix. Objet générique, aucune marque. */
const ORDRE_AVENT = [7, 19, 3, 14, 22, 10, 1, 16, 5, 24, 12, 8, 20, 2, 17, 11, 23, 6, 13, 4, 21, 9, 15, 18];
export const Calendrier: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; opened?: number; eaten?: boolean;
  label?: string}> = ({expr = 'happy', talk, look = 0, opened = 0, eaten = false, label, ...p}) => {
  const f = useCurrentFrame();
  return (
    <Perso {...p} ratio={900 / 640} seed={83}>
      <svg viewBox="0 0 640 900" width="100%" height="100%" style={{overflow: 'visible'}}>
        <rect x={20} y={20} width={600} height={860} rx={36} fill="#C8263A" stroke={K} strokeWidth={12} />
        <rect x={44} y={44} width={552} height={200} rx={24} fill="#A11A2C" />
        {/* houx */}
        <g transform="translate(560 70)">
          <ellipse cx={-18} cy={0} rx={26} ry={12} fill={GREEN} stroke={K} strokeWidth={5} transform="rotate(-30)" />
          <ellipse cx={18} cy={0} rx={26} ry={12} fill={GREEN} stroke={K} strokeWidth={5} transform="rotate(30)" />
          <circle cx={0} cy={8} r={10} fill={RED} stroke={K} strokeWidth={4} />
        </g>
        <Face cx={320 + look * 6} cy={140} s={1.05} expr={expr} talk={talk} look={look} seed={83} gap={70} />
        {ORDRE_AVENT.map((n, i) => {
          const c = i % 4, r = Math.floor(i / 4);
          const x = 58 + c * 134, y = 268 + r * 100;
          const k = Math.max(0, Math.min(1, opened - (n - 1)));
          const open = k > 0;
          return (
            <g key={n}>
              <rect x={x} y={y} width={120} height={86} rx={12} fill="#2A0E16" stroke={K} strokeWidth={6} />
              {open && !eaten ? (
                <g>
                  <rect x={x + 34} y={y + 22} width={52} height={42} rx={8} fill="#6B3A1E" stroke={K} strokeWidth={4} />
                  <line x1={x + 60} y1={y + 24} x2={x + 60} y2={y + 62} stroke="#8E5530" strokeWidth={4} />
                </g>
              ) : null}
              {/* porte qui pivote vers la gauche */}
              <g transform={`translate(${x} ${y}) scale(${1 - 0.85 * k} 1)`}>
                <rect x={0} y={0} width={120} height={86} rx={12} fill={(n + Math.floor(f / 40)) % 5 === 0 ? '#FFE27A' : YEL}
                  stroke={K} strokeWidth={6} />
                {k < 0.5 ? (
                  <text x={60} y={62} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={50} fill={K}>{n}</text>
                ) : null}
              </g>
            </g>
          );
        })}
        {label ? (
          <g transform="rotate(-6 320 860)">
            <rect x={150} y={800} width={340} height={104} rx={20} fill="white" stroke={K} strokeWidth={9} />
            <text x={320} y={876} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={68} fill={K}>{label}</text>
          </g>
        ) : null}
      </svg>
    </Perso>
  );
};

// ---- Le Père Noël gonflable (26 nov. 2026) ---------------------------------------------------------------------
/** Décoration gonflable de jardin (Père Noël générique, folklore) : se balance, ventilateur qui tourne au pied,
 *  `glow` : halo quand il est allumé. Aucun personnage protégé. */
export const Gonflable: React.FC<PersoProps & {expr?: Expr; talk?: boolean; glow?: boolean}> = (
  {expr = 'happy', talk, glow = true, ...p},
) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 9) * 5;
  return (
    <Perso {...p} ratio={1000 / 600} seed={89} bob={1.6}>
      <svg viewBox="0 0 600 1000" width="100%" height="100%" style={{overflow: 'visible'}}>
        {glow ? <ellipse cx={300} cy={520} rx={330} ry={480} fill={YEL} opacity={0.12 + 0.05 * Math.sin(f / 4)} /> : null}
        {/* ventilateur */}
        <rect x={230} y={900} width={140} height={70} rx={14} fill="#4A4A55" stroke={K} strokeWidth={8} />
        <g transform={`translate(300 935) rotate(${f * 40})`}>
          <line x1={-24} y1={0} x2={24} y2={0} stroke={GREY_K} strokeWidth={8} />
          <line x1={0} y1={-24} x2={0} y2={24} stroke={GREY_K} strokeWidth={8} />
        </g>
        <path d="M 370 950 Q 470 980 560 940" fill="none" stroke={K} strokeWidth={6} />
        <g transform={`rotate(${sway} 300 900)`}>
          {/* corps */}
          <ellipse cx={300} cy={650} rx={230} ry={270} fill="#E02D3C" stroke={K} strokeWidth={12} />
          <rect x={80} y={640} width={440} height={56} rx={20} fill={K} />
          <rect x={262} y={636} width={76} height={64} rx={10} fill={YEL} stroke={K} strokeWidth={6} />
          {/* bras */}
          <ellipse cx={70} cy={560} rx={70} ry={120} fill="#E02D3C" stroke={K} strokeWidth={10} transform="rotate(25 70 560)" />
          <ellipse cx={530} cy={560} rx={70} ry={120} fill="#E02D3C" stroke={K} strokeWidth={10} transform="rotate(-25 530 560)" />
          <circle cx={40} cy={660} r={40} fill="white" stroke={K} strokeWidth={8} />
          <circle cx={560} cy={660} r={40} fill="white" stroke={K} strokeWidth={8} />
          {/* tête */}
          <circle cx={300} cy={300} r={170} fill="#FFD9B5" stroke={K} strokeWidth={12} />
          <path d="M 140 330 Q 160 520 300 540 Q 440 520 460 330 Q 400 400 300 392 Q 200 400 140 330 Z" fill="white" stroke={K}
            strokeWidth={10} strokeLinejoin="round" />
          <path d="M 130 230 Q 170 40 330 50 Q 470 70 520 170 L 560 120" fill="#E02D3C" stroke={K} strokeWidth={12}
            strokeLinejoin="round" />
          <rect x={120} y={200} width={360} height={66} rx={30} fill="white" stroke={K} strokeWidth={10} />
          <circle cx={566} cy={112} r={36} fill="white" stroke={K} strokeWidth={9} />
          <Face cx={300} cy={300} s={1.25} expr={expr} talk={talk} seed={89} gap={58} />
        </g>
      </svg>
    </Perso>
  );
};
const GREY_K = '#9AA0B0';

// ---- Le Pull de Noël (27 nov. 2026) -------------------------------------------------------------------------------
/** Pull de Noël tricoté (motif générique : losanges, flocons, sapin) qui parle ; les manches bougent.
 *  `cozy` : petites vapeurs de chaleur au-dessus. Aucun personnage protégé. */
export const Pull: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; cozy?: boolean; label?: string}> = (
  {expr = 'happy', talk, look = 0, cozy = false, label, ...p},
) => {
  const f = useCurrentFrame();
  const arm = Math.sin(f / 8) * 6 + (talk ? Math.sin(f / 3) * 4 : 0);
  const R = '#C8263A', D = '#8E1426', W = '#F4F1EA';
  return (
    <Perso {...p} ratio={720 / 760} seed={97}>
      <svg viewBox="0 0 760 720" width="100%" height="100%" style={{overflow: 'visible'}}>
        {cozy ? [0, 1, 2].map((i) => {
          const t = ((f + i * 14) % 42) / 42;
          return <path key={i} d={`M ${300 + i * 80} ${70 - t * 70} q 18 -22 0 -44 q -18 -22 0 -44`} fill="none" stroke="white"
            strokeWidth={10} strokeLinecap="round" opacity={0.6 * (1 - t)} />;
        }) : null}
        {/* manches */}
        <g transform={`rotate(${-arm} 170 200)`}>
          <path d="M 170 170 L 40 470 L 140 510 L 230 300 Z" fill={R} stroke={K} strokeWidth={10} strokeLinejoin="round" />
          <rect x={30} y={455} width={120} height={50} rx={14} fill={D} stroke={K} strokeWidth={8} transform="rotate(22 90 480)" />
        </g>
        <g transform={`rotate(${arm} 590 200)`}>
          <path d="M 590 170 L 720 470 L 620 510 L 530 300 Z" fill={R} stroke={K} strokeWidth={10} strokeLinejoin="round" />
          <rect x={610} y={455} width={120} height={50} rx={14} fill={D} stroke={K} strokeWidth={8} transform="rotate(-22 670 480)" />
        </g>
        {/* corps */}
        <path d="M 170 150 Q 260 110 300 110 Q 380 160 460 110 Q 500 110 590 150 L 600 660 Q 380 690 160 660 Z" fill={R}
          stroke={K} strokeWidth={12} strokeLinejoin="round" />
        <rect x={160} y={620} width={440} height={60} rx={16} fill={D} stroke={K} strokeWidth={9} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <line key={i} x1={185 + i * 40} y1={628} x2={185 + i * 40} y2={672}
          stroke={K} strokeWidth={4} opacity={0.5} />)}
        <path d="M 300 110 Q 380 170 460 110 L 450 135 Q 380 195 310 135 Z" fill={D} stroke={K} strokeWidth={8} />
        {/* bandes de motif */}
        <rect x={165} y={200} width={430} height={56} fill={W} stroke={K} strokeWidth={5} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M ${185 + i * 54} 228 l 18 -18 l 18 18 l -18 18 Z`} fill={GREEN} />)}
        <rect x={165} y={540} width={430} height={56} fill={W} stroke={K} strokeWidth={5} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M ${185 + i * 54} 568 l 18 -18 l 18 18 l -18 18 Z`} fill={R} />)}
        {/* flocons */}
        {[[220, 300], [540, 300], [230, 500], [530, 500]].map(([x, y], i) => (
          <g key={i} stroke={W} strokeWidth={7} strokeLinecap="round">
            <line x1={x - 22} y1={y} x2={x + 22} y2={y} /><line x1={x} y1={y - 22} x2={x} y2={y + 22} />
            <line x1={x - 16} y1={y - 16} x2={x + 16} y2={y + 16} /><line x1={x - 16} y1={y + 16} x2={x + 16} y2={y - 16} />
          </g>
        ))}
        <Face cx={380} cy={400} s={1.35} expr={expr} talk={talk} look={look} seed={97} gap={52} />
        {label ? <text x={380} y={760} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={64} fill={YEL}
          stroke={K} strokeWidth={10} paintOrder="stroke">{label}</text> : null}
      </svg>
    </Perso>
  );
};

// ---- Le Radiateur (27 nov. 2026) ---------------------------------------------------------------------------------
/** Radiateur à ailettes qui parle. `heat` (0-1) : rougeoie et ondule de chaleur ; `frost` : givré (éteint). */
export const Radiateur: React.FC<PersoProps & {expr?: Expr; talk?: boolean; look?: number; heat?: number; frost?: boolean;
  label?: string}> = ({expr = 'cool', talk, look = 0, heat = 0.6, frost = false, label, ...p}) => {
  const f = useCurrentFrame();
  const body = frost ? '#CFE6F2' : heat > 0.7 ? '#F2A08A' : '#E8ECF2';
  const fins = 6;
  return (
    <Perso {...p} ratio={760 / 760} seed={101} bob={0.6}>
      <svg viewBox="0 0 760 760" width="100%" height="100%" style={{overflow: 'visible'}}>
        {heat > 0 && !frost ? [0, 1, 2, 3].map((i) => {
          const t = ((f + i * 10) % 40) / 40;
          return <path key={i} d={`M ${170 + i * 140} ${130 - t * 90} q 22 -24 0 -48 q -22 -24 0 -48`} fill="none" stroke={RED}
            strokeWidth={10} strokeLinecap="round" opacity={heat * 0.8 * (1 - t)} />;
        }) : null}
        {heat > 0 && !frost ? <ellipse cx={380} cy={420} rx={360} ry={300} fill={RED} opacity={heat * 0.18} /> : null}
        {/* pieds */}
        <rect x={140} y={660} width={50} height={80} rx={10} fill="#9AA0B0" stroke={K} strokeWidth={8} />
        <rect x={570} y={660} width={50} height={80} rx={10} fill="#9AA0B0" stroke={K} strokeWidth={8} />
        {/* ailettes */}
        {Array.from({length: fins}, (_, i) => (
          <rect key={i} x={100 + i * 95} y={150} width={85} height={540} rx={40} fill={body} stroke={K} strokeWidth={10} />
        ))}
        <rect x={90} y={200} width={580} height={40} rx={14} fill={body} stroke={K} strokeWidth={8} />
        <rect x={90} y={600} width={580} height={40} rx={14} fill={body} stroke={K} strokeWidth={8} />
        {frost ? [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${120 + i * 120} 150 l 14 34 l 14 -34`} fill="white" stroke={K}
          strokeWidth={4} />) : null}
        {/* robinet thermostatique */}
        <rect x={660} y={560} width={60} height={110} rx={20} fill="white" stroke={K} strokeWidth={8} />
        <text x={690} y={630} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill={K}>{frost ? '0' : heat > 0.7 ? '5' : '3'}</text>
        <rect x={210} y={300} width={340} height={250} rx={40} fill="white" opacity={0.85} stroke={K} strokeWidth={8} />
        <Face cx={380} cy={410} s={1.3} expr={expr} talk={talk} look={look} seed={101} gap={60} />
        {label ? <text x={380} y={800} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={64} fill={YEL}
          stroke={K} strokeWidth={10} paintOrder="stroke">{label}</text> : null}
      </svg>
    </Perso>
  );
};
