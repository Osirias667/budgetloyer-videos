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

/** Open space le soir des fêtes (20 nov. 2026) : mur bleu nuit, fenêtres, guirlande lumineuse qui clignote, bureaux. */
export const BureauBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const cols = ['#FFD640', '#E828BE', '#20E388', '#36D6F0', '#F04242'];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2152 0%,#262D6B 62%,#3A2F5E 62%,#2A2246 100%)'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', top: 330, left: 90 + i * 330, width: 240, height: 360, borderRadius: 12,
          background: 'linear-gradient(180deg,#0E1336,#1C2A6A)', border: '10px solid #3A4290'}}>
          {Array.from({length: 6}, (_, k) => (
            <div key={k} style={{position: 'absolute', left: 20 + ((k * 53 + i * 31) % 190), top: 30 + ((k * 71 + i * 17) % 290),
              width: 6, height: 6, borderRadius: 3, background: 'white', opacity: 0.4 + 0.4 * Math.sin(f / 9 + k + i)}} />
          ))}
        </div>
      ))}
      <svg width={1080} height={200} style={{position: 'absolute', left: 0, top: 230}}>
        <path d="M -20 30 Q 270 130 540 40 Q 810 130 1100 30" fill="none" stroke="#0E1230" strokeWidth={6} />
        {Array.from({length: 18}, (_, i) => {
          const t = i / 17;
          const xx = -20 + t * 1120;
          const seg = t < 0.5 ? t * 2 : (t - 0.5) * 2;
          const yy = 30 + 4 * seg * (1 - seg) * 95;
          const on = (Math.floor(f / 8) + i) % 3 !== 0;
          const c = cols[i % cols.length];
          return <circle key={i} cx={xx} cy={yy + 16} r={13} fill={c} opacity={on ? 1 : 0.35}
            style={{filter: on ? `drop-shadow(0 0 10px ${c})` : undefined}} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1460, height: 60, background: '#5A4A8A', borderTop: '8px solid #16121F'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Marché de Noël le soir (21 nov. 2026) : chalets en bois à toits enneigés, guirlande, sapin, neige qui tombe. */
export const MarcheNoelBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const cols = ['#FFD640', '#F04242', '#20E388', '#36D6F0'];
  const chalet = (x: number, w: number, col: string, k: number) => (
    <g key={k}>
      <rect x={x} y={760} width={w} height={420} fill={col} stroke="#16121F" strokeWidth={8} />
      {Array.from({length: Math.floor(w / 36)}, (_, i) => (
        <line key={i} x1={x + 18 + i * 36} y1={764} x2={x + 18 + i * 36} y2={1176} stroke="rgba(0,0,0,0.18)" strokeWidth={4} />
      ))}
      <rect x={x + 30} y={880} width={w - 60} height={150} fill="#FFE7A8" stroke="#16121F" strokeWidth={7} opacity={0.95} />
      <rect x={x + 18} y={1030} width={w - 36} height={34} fill="#6B3A1E" stroke="#16121F" strokeWidth={6} />
      <path d={`M ${x - 40} 770 L ${x + w / 2} 600 L ${x + w + 40} 770 Z`} fill="#7A3B1E" stroke="#16121F" strokeWidth={8} strokeLinejoin="round" />
      <path d={`M ${x - 40} 770 L ${x + w / 2} 600 L ${x + w + 40} 770 L ${x + w + 10} 780 Q ${x + w / 2} 700 ${x - 10} 780 Z`}
        fill="#F4F8FF" stroke="#16121F" strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1240 0%,#1E2A6E 55%,#2A3570 70%,#D8E2F2 70%,#B8C6DE 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {chalet(-60, 380, '#A0582C', 1)}
        {chalet(370, 340, '#8E4A24', 2)}
        {chalet(760, 380, '#A0582C', 3)}
        <path d="M 1000 1340 L 1060 1340 L 1030 1180 Z" fill="#1E7A4A" />
        <path d="M -20 610 Q 270 700 540 620 Q 810 700 1100 610" fill="none" stroke="#0E1230" strokeWidth={6} />
        {Array.from({length: 20}, (_, i) => {
          const t = i / 19;
          const xx = -20 + t * 1120;
          const seg = t < 0.5 ? t * 2 : (t - 0.5) * 2;
          const yy = 610 + 4 * seg * (1 - seg) * 75;
          const on = (Math.floor(f / 8) + i) % 3 !== 0;
          const c = cols[i % cols.length];
          return <circle key={i} cx={xx} cy={yy + 14} r={12} fill={c} opacity={on ? 1 : 0.35}
            style={{filter: on ? `drop-shadow(0 0 10px ${c})` : undefined}} />;
        })}
      </svg>
      {Array.from({length: 46}, (_, i) => {
        const x = (rand(i + 3) * 1080 + Math.sin(f / 20 + i) * 20) % 1080;
        const y = ((rand(i + 70) * 1920 + f * (2 + rand(i + 11) * 2.5)) % 1920);
        const r = 5 + rand(i + 5) * 8;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r,
          background: 'rgba(255,255,255,0.85)'}} />;
      })}
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Ville la nuit (21 nov. 2026) : immeubles aux fenêtres allumées, enseigne néon de bar, lune. `dawn` : lumière de jour. */
export const SoireeBg: React.FC<{tint?: number; dawn?: boolean; sign?: boolean}> = ({tint = 0, dawn = false, sign = true}) => {
  const f = useCurrentFrame();
  const sky = dawn ? 'linear-gradient(180deg,#7CC6F0 0%,#BFE6FA 60%,#E8D9B8 60%,#D4C29C 100%)'
    : 'linear-gradient(180deg,#07082A 0%,#1A1450 60%,#241B4A 60%,#151034 100%)';
  const blds = [[-20, 520, 260], [230, 420, 220], [440, 560, 260], [690, 460, 200], [880, 600, 230]];
  return (
    <AbsoluteFill style={{background: sky}}>
      {!dawn ? <div style={{position: 'absolute', left: 60, top: 200, width: 110, height: 110, borderRadius: 65,
        background: '#FFF4C8', boxShadow: '0 0 60px #FFF4C8'}} /> : null}
      {blds.map(([x, top, w], i) => (
        <div key={i} style={{position: 'absolute', left: x, top, width: w, height: 1152 - top,
          background: dawn ? '#8A92B8' : '#20204E', border: '8px solid #16121F', borderBottom: 'none'}}>
          {Array.from({length: 18}, (_, k) => {
            const on = dawn ? false : rand(i * 31 + k + Math.floor(f / 45)) > 0.45;
            return <div key={k} style={{position: 'absolute', left: 22 + (k % 3) * ((w - 60) / 3), top: 30 + Math.floor(k / 3) * 90,
              width: 34, height: 48, background: on ? '#FFD86B' : dawn ? '#C8D4F0' : '#14143A',
              boxShadow: on ? '0 0 14px #FFD86B' : undefined}} />;
          })}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1152, height: 12, background: '#16121F'}} />
      {!dawn && sign ? (
        <div style={{position: 'absolute', left: 300, top: 1040, padding: '6px 26px', borderRadius: 16, border: '6px solid #E828BE',
          fontFamily: 'Inter', fontWeight: 900, fontSize: 44, color: '#FFB8F0',
          opacity: Math.floor(f / 6) % 9 === 0 ? 0.4 : 1, boxShadow: '0 0 30px #E828BE', textShadow: '0 0 16px #E828BE'}}>BAR</div>
      ) : null}
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};
