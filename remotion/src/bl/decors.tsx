// Décors animés (fonds) : grille néon, fond sombre « tuto », rayons d'ambiance.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {NAVY, rand} from './theme';

/** Grille rétro qui défile vers le spectateur, halo magenta à l'horizon. tint : voile bleu nuit (0-1). */
export const NeonBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const phase = (f / 24) % 1;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0C032C 0%,#2A0A5C 52%,#46106F 60%,#0E0328 60%)'}}>
      <div style={{position: 'absolute', left: 140, top: 640, width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,40,190,0.35) 0%, rgba(232,40,190,0) 65%)'}} />
      <svg width={1080} height={770} style={{position: 'absolute', left: 0, top: 1150}}>
        {Array.from({length: 16}, (_, i) => {
          const t = (i + phase) / 16;
          const yy = t * t * 770;
          return <line key={'h' + i} x1={0} x2={1080} y1={yy} y2={yy} stroke="rgba(232,40,190,0.8)" strokeWidth={2 + 3 * t} />;
        })}
        {Array.from({length: 29}, (_, i) => {
          const k = i - 14;
          return <line key={'v' + i} x1={540 + k * 34} y1={0} x2={540 + k * 190} y2={770} stroke="rgba(232,40,190,0.6)" strokeWidth={3} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1130, height: 40,
        background: 'linear-gradient(180deg, rgba(255,120,220,0.9), rgba(255,120,220,0))', filter: 'blur(6px)'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Fond sombre de la famille « Tuto » : halos vert et bleu qui respirent, poussières lumineuses. */
export const DarkBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const a = 0.5 + 0.12 * Math.sin(f / 40);
  return (
    <AbsoluteFill style={{background: '#090D14'}}>
      <div style={{position: 'absolute', left: 360, top: -300, width: 1040, height: 840, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(54,180,200,${0.22 * a}) 0%, rgba(0,0,0,0) 65%)`}} />
      <div style={{position: 'absolute', left: -350, top: 1380, width: 960, height: 800, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(32,227,136,${0.25 * a}) 0%, rgba(0,0,0,0) 65%)`}} />
      {Array.from({length: 26}, (_, i) => {
        const x = rand(i + 1) * 1080;
        const y = ((rand(i + 50) * 1920 - f * (0.6 + rand(i + 9))) % 1920 + 1920) % 1920;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 5, height: 5, borderRadius: 3,
          background: 'rgba(160,255,210,0.35)'}} />;
      })}
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Rayons d'ambiance qui tournent lentement, dans une couleur (calme → panique). */
export const MoodBg: React.FC<{col: string; dark?: number}> = ({col, dark = 0.6}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: col, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -900, top: -400, width: 2880, height: 2880, transform: `rotate(${f * 0.25}deg)`,
        background: `repeating-conic-gradient(from 0deg, rgba(255,255,255,0.10) 0deg 9deg, rgba(0,0,0,0) 9deg 18deg)`}} />
      <AbsoluteFill style={{background: '#000', opacity: dark}} />
    </AbsoluteFill>
  );
};

/** Entrée d'appartement vue de l'intérieur (19 nov. 2026) : mur chaud, porte avec judas, paillasson, applique. */
export const PorteBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const glow = 0.85 + 0.08 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#3A2450 0%,#2B1B3E 70%,#1E1430 100%)'}}>
      {/* lambris */}
      {Array.from({length: 12}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: i * 92, top: 0, width: 4, height: 1920, background: 'rgba(0,0,0,0.12)'}} />
      ))}
      {/* porte */}
      <div style={{position: 'absolute', left: 190, top: 170, width: 700, height: 1500, borderRadius: '24px 24px 0 0',
        background: 'linear-gradient(90deg,#8A4E2C,#A9643A 50%,#8A4E2C)', border: '14px solid #16121F', boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', left: 60, top: 70, width: 552, height: 520, border: '10px solid rgba(0,0,0,0.25)', borderRadius: 18}} />
        <div style={{position: 'absolute', left: 60, top: 700, width: 552, height: 660, border: '10px solid rgba(0,0,0,0.25)', borderRadius: 18}} />
        <div style={{position: 'absolute', left: 590, top: 760, width: 46, height: 46, borderRadius: 23, background: '#FFD640',
          border: '8px solid #16121F'}} />
      </div>
      {/* applique */}
      <div style={{position: 'absolute', left: 940, top: 520, width: 90, height: 90, borderRadius: 45,
        background: `radial-gradient(circle, rgba(255,214,64,${glow}) 0%, rgba(255,214,64,0) 70%)`}} />
      {/* paillasson */}
      <div style={{position: 'absolute', left: 260, top: 1690, width: 560, height: 70, borderRadius: 14, background: '#5C3A1E',
        border: '8px solid #16121F'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Vue par le judas : cercle « fish-eye » (léger bombé), le reste de l'écran dans le noir. */
export const Judas: React.FC<{cx?: number; cy?: number; r?: number; children: React.ReactNode}> = (
  {cx = 540, cy = 760, r = 400, children},
) => (
  <AbsoluteFill style={{background: '#04040A'}}>
    <div style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%',
      overflow: 'hidden', border: '18px solid #2A2A36', boxSizing: 'border-box',
      boxShadow: '0 0 0 10px #101018, inset 0 0 120px 40px rgba(0,0,0,0.85)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 2 * r, height: 2 * r,
        background: 'radial-gradient(circle at 50% 45%, #6E7FA8 0%, #3A4466 55%, #1A1F33 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 2 * r, height: 2 * r, transform: 'scale(1.08)'}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 0 90px 30px rgba(0,0,0,0.8)'}} />
    </div>
  </AbsoluteFill>
);
