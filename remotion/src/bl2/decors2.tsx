// Décors et éléments 2.5D (27 nov. 2026). Chaque décor est découpé en couches (`Layer`) pour la parallaxe :
// fond lointain, plan moyen, plan des personnages (d=1), premier plan flou.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useInstant} from '../bl/anim';
import {rand} from '../bl/theme';
import {Bokeh, C, DISPLAY, Layer} from './studio';

const K = '#16121F';

/** Salle à manger de Noël la nuit, en 4 couches. Utiliser `SalleFond` derrière les personnages et `SalleAvant`
 *  (table au premier plan + bokeh flou) devant. `lit` : bougies et lustre allumés. */
export const SalleFond: React.FC<{snow?: boolean}> = ({snow = true}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer d={0.15}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#2B0E2E 0%,#4A1538 45%,#5E1B3A 70%,#3A1026 100%)'}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <pattern id="damas" width="90" height="120" patternUnits="userSpaceOnUse">
              <path d="M45 10 Q60 40 45 60 Q30 40 45 10 Z M45 70 Q58 92 45 110 Q32 92 45 70 Z" fill="#FFD9A0" opacity="0.06" />
              <circle cx="0" cy="60" r="6" fill="#FFD9A0" opacity="0.05" /><circle cx="90" cy="60" r="6" fill="#FFD9A0" opacity="0.05" />
            </pattern>
            <linearGradient id="nuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1650" /><stop offset="1" stopColor="#24307A" /></linearGradient>
            <radialGradient id="lune" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF6D8" /><stop offset="0.6" stopColor="#FFE9A8" />
              <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="1080" height="1300" fill="url(#damas)" />
          {/* fenêtre en arc */}
          <path d="M330 1080 L330 640 Q540 420 750 640 L750 1080 Z" fill="url(#nuit)" stroke="#2A0E1E" strokeWidth="22" />
          <circle cx="640" cy="640" r="80" fill="url(#lune)" />
          {snow ? Array.from({length: 26}, (_, i) => {
            const y = 520 + ((f * (1.3 + rand(i) * 1.6) + rand(i + 9) * 560) % 560);
            const x = 345 + rand(i + 2) * 390 + Math.sin(f / 14 + i) * 9;
            return <circle key={i} cx={x} cy={y} r={3 + rand(i + 4) * 5} fill="white" opacity={0.85} />;
          }) : null}
          <path d="M540 470 L540 1080 M330 820 L750 820" stroke="#2A0E1E" strokeWidth="14" />
          <rect x="300" y="1070" width="480" height="34" rx="8" fill="#E8D2B0" stroke="#2A0E1E" strokeWidth="8" />
          {/* rideaux */}
          <path d="M250 430 Q300 760 270 1150 L180 1150 Q210 760 170 430 Z" fill="#9E1630" stroke="#2A0E1E" strokeWidth="8" />
          <path d="M830 430 Q780 760 810 1150 L900 1150 Q870 760 910 430 Z" fill="#9E1630" stroke="#2A0E1E" strokeWidth="8" />
          <rect x="140" y="410" width="800" height="34" rx="14" fill="#C8952A" stroke="#2A0E1E" strokeWidth="8" />
          {/* cadres */}
          <rect x="40" y="560" width="110" height="140" rx="8" fill="#F3D9A8" stroke="#6A3A1A" strokeWidth="12" />
          <circle cx="95" cy="618" r="26" fill="#C25B6A" /><rect x="70" y="646" width="50" height="40" rx="12" fill="#C25B6A" />
        </svg>
      </Layer>
      <Layer d={0.35} blur={2}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M -40 360 Q 270 470 540 380 Q 810 470 1120 360" fill="none" stroke="#1E3A1E" strokeWidth="26" />
          <path d="M -40 360 Q 270 470 540 380 Q 810 470 1120 360" fill="none" stroke="#2F6B34" strokeWidth="16" strokeDasharray="10 14" />
        </svg>
        <Bokeh n={13} seed={4} y0={330} y1={470} size={[22, 46]} blur={3} opacity={0.95} />
      </Layer>
      <Layer d={0.6}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {/* sol */}
          <path d="M -200 1180 L 1280 1180 L 1500 1920 L -420 1920 Z" fill="#5A3020" />
          {Array.from({length: 9}, (_, i) => <path key={i} d={`M ${-200 + i * 185} 1180 L ${-420 + i * 240} 1920`} stroke="#45241A" strokeWidth="6" />)}
          <path d="M -200 1180 L 1280 1180" stroke="#2A1410" strokeWidth="14" />
          {/* lustre */}
          <line x1="540" y1="0" x2="540" y2="150" stroke="#3A2A1A" strokeWidth="8" />
          <path d="M 420 170 Q 540 240 660 170" fill="none" stroke="#C8952A" strokeWidth="14" />
          {[420, 480, 540, 600, 660].map((x, i) => <g key={i}>
            <circle cx={x} cy={i % 2 ? 196 : 176} r={46} fill="#FFD27A" opacity={0.18 + 0.05 * Math.sin(f / 5 + i)} />
            <ellipse cx={x} cy={i % 2 ? 196 : 176} rx={10} ry={16} fill="#FFE9B0" />
          </g>)}
        </svg>
      </Layer>
    </>
  );
};

/** Table du réveillon au premier plan (perspective) avec assiettes, verres et bougies qui vacillent, + bokeh flou. */
export const SalleAvant: React.FC<{full?: boolean; y?: number}> = ({full = false, y = 1210}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer d={1.15}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="nappe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4E0" /><stop offset="1" stopColor="#D9C6A6" /></linearGradient>
            <radialGradient id="flamme" cx="0.5" cy="0.6" r="0.5"><stop offset="0" stopColor="#FFF3B0" /><stop offset="1" stopColor="#FFB03A" stopOpacity="0" /></radialGradient>
          </defs>
          <path d={`M -120 ${y} L 1200 ${y} L 1380 1920 L -300 1920 Z`} fill="url(#nappe)" stroke={K} strokeWidth="8" />
          <path d={`M -120 ${y} L 1200 ${y} L 1210 ${y + 40} Q 540 ${y + 80} -130 ${y + 40} Z`} fill="#9E1630" stroke={K} strokeWidth="6" />
          {[[130, y + 190, 1], [430, y + 200, 1.05], [720, y + 200, 1.05], [990, y + 190, 1]].map(([x, yy, s], i) => (
            <g key={i} transform={`translate(${x} ${yy}) scale(${s})`}>
              <ellipse cx="0" cy="0" rx="120" ry="44" fill="white" stroke={K} strokeWidth="6" />
              <ellipse cx="0" cy="0" rx="78" ry="26" fill={full ? '#E8A84A' : '#EFE6D6'} stroke="#C8B89A" strokeWidth="3" />
              {full ? <ellipse cx="-10" cy="-4" rx="30" ry="10" fill="#7A3A1A" opacity="0.6" /> : null}
            </g>
          ))}
          {[285, 860].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={y + 18} r={70 + Math.sin(f / 4 + i) * 6} fill="url(#flamme)" opacity="0.8" />
              <rect x={x - 14} y={y + 30} width="28" height="96" rx="6" fill="#FFF8EC" stroke={K} strokeWidth="5" />
              <path d={`M ${x} ${y - 14 + Math.sin(f / 3 + i) * 3} Q ${x + 12} ${y + 10} ${x} ${y + 28} Q ${x - 12} ${y + 10} ${x} ${y - 14 + Math.sin(f / 3 + i) * 3} Z`}
                fill="#FFD640" stroke={K} strokeWidth="4" />
            </g>
          ))}
          {[580, 330, 780].map((x, i) => (
            <g key={i} opacity="0.9">
              <path d={`M ${x - 22} ${y + 70} L ${x + 22} ${y + 70} L ${x + 14} ${y + 120} L ${x - 14} ${y + 120} Z`} fill="#BFE8FF" opacity="0.5"
                stroke={K} strokeWidth="4" />
              <line x1={x} y1={y + 120} x2={x} y2={y + 150} stroke={K} strokeWidth="5" />
            </g>
          ))}
        </svg>
      </Layer>
      <Layer d={1.5} blur={12}>
        <Bokeh n={7} seed={21} y0={1500} y1={1900} size={[60, 130]} blur={4} opacity={0.5} />
      </Layer>
    </>
  );
};

/** Carte « verre » en perspective (liste, tableau) : bord lumineux, reflet, légère inclinaison 3D qui respire. */
export const Glass: React.FC<{x: number; y: number; w: number; col?: string; tilt?: number; delay?: number;
  children: React.ReactNode}> = ({x, y, w, col = C.cyan, tilt = 1, delay = 0, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  const s = instant ? 1 : spring({frame: f - delay, fps, config: {damping: 12, stiffness: 140}});
  const ry = (-7 + Math.sin(f / 30) * 2) * tilt, rx = (5 + Math.cos(f / 36) * 1.5) * tilt;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, perspective: 1400}}>
      <div style={{transform: `rotateY(${ry}deg) rotateX(${rx}deg) translateY(${(1 - s) * 120}px) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.6), borderRadius: 30, padding: '20px 32px', boxSizing: 'border-box',
        background: 'linear-gradient(160deg, rgba(40,30,90,0.88), rgba(12,10,36,0.92))', border: `3px solid ${col}`,
        boxShadow: `0 0 0 6px rgba(255,255,255,0.05), 0 0 36px ${col}55, 0 30px 50px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.25)`,
        position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -80, left: -120, width: 400, height: 200, transform: 'rotate(-20deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)'}} />
        {children}
      </div>
    </div>
  );
};

/** Ligne de liste qui « tombe » à sa place à l'image `at` (avant : « … » et « ? € »). */
export const Row: React.FC<{name: string; val: string; at: number; bad?: boolean; size?: number; h?: number}> = (
  {name, val, at, bad, size = 44, h = 70},
) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const on = f >= at;
  const s = on ? spring({frame: f - at, fps, config: {damping: 10, stiffness: 200}}) : 0;
  return (
    <div style={{height: h, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '2px solid rgba(255,255,255,0.08)', position: 'relative'}}>
      <span style={{fontFamily: 'Inter', fontWeight: 800, fontSize: size, color: on ? (bad ? C.red : 'white') : 'rgba(255,255,255,0.3)',
        transform: `translateX(${(1 - s) * -30}px)`, opacity: on ? Math.min(1, s * 1.5) : 1}}>{on ? name : '…'}</span>
      <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 1.12, color: on ? (bad ? C.red : C.yel) : 'rgba(255,255,255,0.3)',
        transform: `scale(${on ? 0.6 + 0.4 * s : 1})`, textShadow: on ? '0 3px 0 rgba(0,0,0,0.5)' : 'none'}}>{on ? val : '? €'}</span>
    </div>
  );
};

/** Colonne isométrique qui monte (comparaison de montants). */
export const Pillar: React.FC<{x: number; base: number; h: number; w?: number; col: string; dark: string; delay?: number;
  label: string; value: React.ReactNode}> = ({x, base, h, w = 260, col, dark, delay = 0, label, value}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14, stiffness: 90}});
  const hh = Math.max(8, h * s), dd = 60;
  return (
    <div style={{position: 'absolute', left: x, top: 0}}>
      <svg width={w + dd + 10} height={base + 20} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M 0 ${base - hh} L ${w} ${base - hh} L ${w} ${base} L 0 ${base} Z`} fill={col} stroke={K} strokeWidth="6" />
        <path d={`M ${w} ${base - hh} L ${w + dd} ${base - hh - dd * 0.55} L ${w + dd} ${base - dd * 0.55} L ${w} ${base} Z`} fill={dark} stroke={K} strokeWidth="6" />
        <path d={`M 0 ${base - hh} L ${dd} ${base - hh - dd * 0.55} L ${w + dd} ${base - hh - dd * 0.55} L ${w} ${base - hh} Z`}
          fill="white" opacity="0.35" stroke={K} strokeWidth="6" />
        <rect x="16" y={base - hh + 14} width="22" height={Math.max(0, hh - 28)} rx="10" fill="white" opacity="0.25" />
      </svg>
      <div style={{position: 'absolute', left: 0, width: w, top: base - hh - 150, textAlign: 'center', fontFamily: DISPLAY,
        fontWeight: 800, fontSize: 96, color: 'white', textShadow: `0 4px 0 ${dark}, 0 8px 0 ${dark}, 0 16px 20px rgba(0,0,0,0.5)`,
        opacity: interpolate(s, [0.3, 0.8], [0, 1])}}>{value}</div>
      <div style={{position: 'absolute', left: -20, width: w + 40, top: base + 20, textAlign: 'center', fontFamily: DISPLAY,
        fontWeight: 800, fontSize: 40, color: col}}>{label}</div>
    </div>
  );
};

// ======== 28 nov. 2026 : plateau télé (podium), salon de nuit, horloge, jauge ===================================

/** Plateau de jeu télé en couches : fond violet, écran géant en arc, faisceaux de projecteurs qui balaient,
 *  public en bokeh. `title` : texte de l'écran du fond. */
export const PlateauFond: React.FC<{title?: string; beams?: string[]}> = ({title = 'PODIUM', beams = [C.yel, C.cyan, C.red, C.green]}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer d={0.12}>
        <AbsoluteFill style={{background: 'radial-gradient(1200px 900px at 540px 520px, #4A2A9A 0%, #24124E 45%, #0E0624 100%)'}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {/* écran en arc */}
          <path d="M 120 760 L 120 420 Q 540 250 960 420 L 960 760 Z" fill="#120A30" stroke="#6B55E0" strokeWidth="14" />
          {Array.from({length: 18}, (_, i) => Array.from({length: 7}, (__, j) => {
            const on = (Math.sin(f / 6 + i * 0.7 + j * 1.3) + 1) / 2;
            return <circle key={`${i}-${j}`} cx={170 + i * 44} cy={470 + j * 42} r={9} fill={beams[(i + j) % beams.length]} opacity={0.12 + on * 0.25} />;
          }))}
          <text x={540} y={640} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={88} fill="white" opacity={0.16}>{title}</text>
        </svg>
      </Layer>
      <Layer d={0.3}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
          <defs>
            {beams.map((c, i) => (
              <linearGradient key={i} id={`beam${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={c} stopOpacity="0.55" /><stop offset="1" stopColor={c} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {beams.map((_, i) => {
            const x = 140 + i * 270;
            const a = Math.sin(f / (22 + i * 4) + i * 1.7) * 18;
            return <path key={i} d={`M ${x} 60 L ${x - 170} 1500 L ${x + 170} 1500 Z`} fill={`url(#beam${i})`}
              transform={`rotate(${a} ${x} 60)`} opacity={0.6} />;
          })}
          {beams.map((c, i) => <circle key={`l${i}`} cx={140 + i * 270} cy={60} r={34} fill={c} opacity={0.9} />)}
        </svg>
      </Layer>
      <Layer d={0.6}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M -300 1160 L 1380 1160 L 1600 1920 L -520 1920 Z" fill="#1A0E3A" />
          <ellipse cx={540} cy={1230} rx={620} ry={110} fill="#6B55E0" opacity={0.25} />
          {Array.from({length: 12}, (_, i) => <line key={i} x1={-300 + i * 150} y1={1160} x2={-520 + i * 190} y2={1920}
            stroke="#2C1A5E" strokeWidth={5} />)}
          <path d="M -300 1160 L 1380 1160" stroke="#8C78FF" strokeWidth={8} opacity={0.7} />
        </svg>
      </Layer>
    </>
  );
};

/** Avant-scène du plateau : rampe lumineuse et public flou au premier plan. */
export const PlateauAvant: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer d={1.2}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={-100} y={1560} width={1280} height={60} fill="#0E0624" />
          {Array.from({length: 16}, (_, i) => <circle key={i} cx={-40 + i * 75} cy={1590} r={12}
            fill={[C.yel, C.cyan, C.red, C.green][i % 4]} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 5 + i))} />)}
        </svg>
      </Layer>
      <Layer d={1.5} blur={10}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 9}, (_, i) => <ellipse key={i} cx={60 + i * 125} cy={1830 + Math.sin(f / 9 + i) * 8} rx={70} ry={90}
            fill="#0A0418" />)}
        </svg>
        <Bokeh n={6} seed={33} y0={1620} y1={1900} size={[40, 90]} blur={3} opacity={0.4} />
      </Layer>
    </>
  );
};

/** Podium à 3 marches (2 · 1 · 3) en relief. `lit` : marches allumées (1, 2, 3) ; `q` : « ? » sur les marches éteintes. */
export const Podium: React.FC<{y?: number; lit?: number[]; q?: boolean}> = ({y = 1180, lit = [], q = true}) => {
  const f = useCurrentFrame();
  const steps = [
    {n: 2, x: 120, w: 280, h: 220, col: '#C9D3E0', dark: '#8A96A8'},
    {n: 1, x: 400, w: 280, h: 320, col: C.yel, dark: C.yelD},
    {n: 3, x: 680, w: 280, h: 160, col: '#E0975A', dark: '#9A5A2A'},
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {steps.map((s) => {
        const on = lit.includes(s.n);
        const top = y - s.h;
        return (
          <g key={s.n}>
            {on ? <ellipse cx={s.x + s.w / 2} cy={top} rx={s.w * 0.7} ry={40} fill={s.col} opacity={0.25 + 0.1 * Math.sin(f / 4)} /> : null}
            <path d={`M ${s.x} ${top} L ${s.x + 30} ${top - 34} L ${s.x + s.w + 30} ${top - 34} L ${s.x + s.w} ${top} Z`}
              fill={on ? 'white' : '#4A3A7A'} opacity={on ? 0.85 : 1} stroke={K} strokeWidth={6} />
            <rect x={s.x} y={top} width={s.w} height={s.h} fill={on ? s.col : '#3A2A6A'} stroke={K} strokeWidth={6} />
            <path d={`M ${s.x + s.w} ${top} L ${s.x + s.w + 30} ${top - 34} L ${s.x + s.w + 30} ${y - 34} L ${s.x + s.w} ${y} Z`}
              fill={on ? s.dark : '#2A1A52'} stroke={K} strokeWidth={6} />
            <text x={s.x + s.w / 2} y={top + Math.min(130, s.h - 20)} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800}
              fontSize={110} fill={on ? 'white' : '#6A5AA0'} stroke={K} strokeWidth={on ? 8 : 0} paintOrder="stroke">{s.n}</text>
            {!on && q ? <text x={s.x + s.w / 2} y={top - 70} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={120}
              fill="white" opacity={0.75 + 0.25 * Math.sin(f / 5 + s.n)} stroke={K} strokeWidth={8} paintOrder="stroke">?</text> : null}
          </g>
        );
      })}
    </svg>
  );
};

/** Médaille (or, argent, bronze) qui tombe et se balance, avec un texte (ex. « +19,2 % »). */
export const Medaille: React.FC<{x: number; y: number; rank: 1 | 2 | 3; txt: string; delay?: number; size?: number}> = (
  {x, y, rank, txt, delay = 0, size = 1},
) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  const s = instant ? 1 : spring({frame: f - delay, fps, config: {damping: 8, stiffness: 120}});
  const col = rank === 1 ? [C.yel, C.yelD] : rank === 2 ? ['#E6ECF4', '#8A96A8'] : ['#E8A060', '#9A5A2A'];
  const sw = Math.sin((f - delay) / 7) * 6 * Math.max(0, 1 - (f - delay) / 120);
  return (
    <div style={{position: 'absolute', left: x - 120 * size, top: y - (1 - s) * 500, width: 240 * size, opacity: Math.min(1, s * 2),
      transform: `rotate(${sw}deg)`, transformOrigin: '50% 0%'}}>
      <svg viewBox="0 0 240 330" width="100%" style={{overflow: 'visible'}}>
        <path d="M 70 0 L 110 120 L 130 120 L 170 0 Z" fill={rank === 1 ? C.red : rank === 2 ? C.cyan : C.violet} stroke={K} strokeWidth={6} />
        <circle cx={120} cy={210} r={100} fill={col[0]} stroke={K} strokeWidth={8} />
        <circle cx={120} cy={210} r={76} fill="none" stroke={col[1]} strokeWidth={8} />
        <text x={120} y={240} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={90} fill={col[1]}>{rank}</text>
      </svg>
      <div style={{textAlign: 'center', marginTop: -6 * size, fontFamily: DISPLAY, fontWeight: 800, fontSize: 64 * size, color: 'white',
        textShadow: `0 4px 0 ${K}, 0 0 20px ${col[0]}`}}>{txt}</div>
    </div>
  );
};

/** Salon de nuit en couches : fenêtre sur la ville (lumières qui scintillent), lampe chaude, étagère, cadre. */
export const AppartFond: React.FC<{tint?: string}> = ({tint = '#1A1446'}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer d={0.15}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${tint} 0%, #2A1E5A 55%, #3A2456 100%)`}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={420} y={420} width={520} height={620} rx={18} fill="#0A1240" stroke="#120C2A" strokeWidth={22} />
          {Array.from({length: 9}, (_, i) => {
            const h = 120 + rand(i + 40) * 300;
            return <g key={i}>
              <rect x={432 + i * 58} y={1030 - h} width={52} height={h} fill="#141C54" />
              {Array.from({length: Math.floor(h / 40)}, (__, j) => <rect key={j} x={442 + i * 58 + (j % 2) * 18} y={1040 - h + j * 36} width={12} height={16}
                fill={C.yel} opacity={rand(i * 9 + j) > 0.45 ? 0.45 + 0.4 * Math.sin(f / 15 + i + j) : 0.06} />)}
            </g>;
          })}
          <circle cx={830} cy={520} r={40} fill="#FFF3C8" opacity={0.9} />
          <path d="M 680 420 L 680 1040 M 420 730 L 940 730" stroke="#120C2A" strokeWidth={16} />
          <rect x={400} y={1030} width={560} height={30} rx={8} fill="#E8D2B0" stroke="#120C2A" strokeWidth={8} />
          {/* étagère + cadre */}
          <rect x={60} y={600} width={260} height={22} rx={6} fill="#8A5A3A" stroke="#120C2A" strokeWidth={6} />
          <rect x={80} y={520} width={50} height={80} rx={6} fill={C.cyan} stroke="#120C2A" strokeWidth={5} />
          <rect x={140} y={500} width={40} height={100} rx={6} fill={C.red} stroke="#120C2A" strokeWidth={5} />
          <circle cx={250} cy={560} r={36} fill="#3CC25A" stroke="#120C2A" strokeWidth={5} />
          <rect x={70} y={330} width={200} height={140} rx={10} fill="#F3D9A8" stroke="#6A3A1A" strokeWidth={12} />
          <path d="M 90 450 L 150 380 L 190 420 L 220 390 L 250 450 Z" fill="#5A8CFF" />
        </svg>
      </Layer>
      <Layer d={0.45}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {/* lampe sur pied */}
          <circle cx={150} cy={820} r={170} fill="#FFC870" opacity={0.16 + 0.03 * Math.sin(f / 9)} />
          <path d="M 90 760 L 210 760 L 180 860 L 120 860 Z" fill="#FFE2A0" stroke="#120C2A" strokeWidth={8} />
          <line x1={150} y1={860} x2={150} y2={1180} stroke="#120C2A" strokeWidth={12} />
        </svg>
      </Layer>
      <Layer d={0.6}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d="M -200 1180 L 1280 1180 L 1500 1920 L -420 1920 Z" fill="#4A2E3A" />
          <path d="M -200 1180 L 1280 1180" stroke="#24141E" strokeWidth={14} />
          <ellipse cx={540} cy={1400} rx={460} ry={120} fill="#7A3A5A" opacity={0.5} />
        </svg>
      </Layer>
    </>
  );
};

/** Premier plan du salon : dossier de canapé flou + bokeh chaud. */
export const AppartAvant: React.FC = () => (
  <>
    <Layer d={1.2}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M -60 1560 Q 540 1500 1140 1560 L 1140 1920 L -60 1920 Z" fill="#5A3A8A" stroke={K} strokeWidth={8} />
        <path d="M -60 1560 Q 540 1500 1140 1560" fill="none" stroke="#7A5AB0" strokeWidth={14} />
        <rect x={40} y={1590} width={200} height={130} rx={40} fill="#E0812A" stroke={K} strokeWidth={8} transform="rotate(-8 140 1650)" />
      </svg>
    </Layer>
    <Layer d={1.5} blur={12}>
      <Bokeh n={6} seed={51} y0={1650} y1={1900} size={[50, 110]} blur={4} opacity={0.45} colors={[C.warm, C.yel, C.red]} />
    </Layer>
  </>
);

/** Panneau horloge : jour + heure (gros chiffres) et chrono écoulé (« +21 h »). Les chiffres basculent à chaque
 *  changement de valeur. */
export const Horloge2: React.FC<{day: string; time: string; since: string; y?: number; col?: string}> = (
  {day, time, since, y = 150, col = C.cyan},
) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  const s = instant ? 1 : spring({frame: f, fps, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18,
      transform: `scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 2)}}>
      <div style={{background: 'rgba(10,8,28,0.85)', border: `4px solid ${col}`, borderRadius: 24, padding: '8px 26px 2px',
        boxShadow: `0 0 30px ${col}66, 0 10px 0 rgba(0,0,0,0.4)`, textAlign: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: col, letterSpacing: 2, lineHeight: 1}}>{day}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, color: 'white', lineHeight: 1, textShadow: `0 0 18px ${col}`}}>{time}</div>
      </div>
      <div style={{alignSelf: 'center', background: C.red, color: 'white', fontFamily: DISPLAY, fontWeight: 800, fontSize: 52,
        padding: '6px 22px 0', borderRadius: 20, boxShadow: `0 6px 0 ${C.redD}`, transform: `rotate(4deg)`}}>{since}</div>
    </div>
  );
};

/** Jauge horizontale « par jour jusqu'à la paie » : barre qui se vide de `from` à `to` (en euros) entre `a` et `b`. */
export const Jauge2: React.FC<{y: number; from: number; to: number; max: number; a?: number; b?: number; label?: string}> = (
  {y, from, to, max, a = 0, b = 30, label = "PAR JOUR JUSQU'À LA PAIE"},
) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const k = v / max;
  const col = k > 0.9 ? C.green : k > 0.75 ? C.yel : C.red;
  const txt = v.toFixed(2).replace('.', ',') + ' €';
  return (
    <div style={{position: 'absolute', top: y, left: 110, width: 800}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8}}>
        <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: 'white', textShadow: '0 3px 0 rgba(0,0,0,0.6)'}}>{label}</span>
        <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 64, color: col, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.6)'}}>{txt}</span>
      </div>
      <div style={{height: 46, borderRadius: 23, background: 'rgba(10,8,28,0.85)', border: '4px solid white', overflow: 'hidden',
        boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
        <div style={{width: `${Math.max(0, Math.min(1, k)) * 100}%`, height: '100%', background: `linear-gradient(180deg, ${col}, ${col}AA)`,
          borderRadius: 20}} />
      </div>
    </div>
  );
};
