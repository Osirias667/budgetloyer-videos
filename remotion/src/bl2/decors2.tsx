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
