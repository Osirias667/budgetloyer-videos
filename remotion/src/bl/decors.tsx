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

/** Restaurant le soir (22 nov. 2026) : mur brique chaud, suspensions qui oscillent, grande table en bois au premier plan. */
export const RestoBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#5A2318 0%,#7A3422 70%,#3A1A12 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 22}, (_, r) => Array.from({length: 7}, (_, c) => (
          <rect key={`${r}-${c}`} x={(r % 2) * -80 + c * 170} y={r * 60} width={160} height={52} rx={6}
            fill={rand(r * 7 + c) > 0.5 ? '#8A3D28' : '#7E3624'} opacity={0.75} />
        )))}
        {[200, 540, 880].map((x, i) => {
          const sw = Math.sin(f / 22 + i) * 4;
          return (
            <g key={x} transform={`rotate(${sw} ${x} 0)`}>
              <line x1={x} y1={0} x2={x} y2={150} stroke="#16121F" strokeWidth={6} />
              <path d={`M ${x - 80} 220 Q ${x} 110 ${x + 80} 220 Z`} fill="#20E388" stroke="#16121F" strokeWidth={7} />
              <ellipse cx={x} cy={232} rx={46} ry={20} fill="#FFF2B0" style={{filter: 'drop-shadow(0 0 30px #FFE27A)'}} />
            </g>
          );
        })}
        <rect x={-20} y={1180} width={1120} height={760} fill="#A8693A" stroke="#16121F" strokeWidth={10} />
        {Array.from({length: 6}, (_, i) => (
          <line key={i} x1={0} y1={1240 + i * 110} x2={1080} y2={1240 + i * 110} stroke="#8A5228" strokeWidth={6} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 900,
        background: 'radial-gradient(ellipse at 50% 15%, rgba(255,220,140,0.25), rgba(0,0,0,0) 60%)'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Chambre d'étudiant (23 nov. 2026, série « Survie · Étudiant ») : mur bleu nuit, fenêtre étoilée, étagère de livres,
 *  bureau avec lampe et pile de cours. Tout le haut reste calme pour le texte. */
export const ChambreBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2350 0%,#27306A 60%,#1B2350 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* fenêtre */}
        <rect x={-20} y={560} width={250} height={380} rx={10} fill="#0B1030" stroke="#16121F" strokeWidth={10} />
        {Array.from({length: 9}, (_, i) => (
          <circle key={i} cx={20 + rand(i + 3) * 190} cy={600 + rand(i + 11) * 300} r={3 + rand(i) * 3} fill="#FFF6C8"
            opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />
        ))}
        <line x1={105} y1={560} x2={105} y2={940} stroke="#16121F" strokeWidth={8} />
        {/* étagère */}
        <rect x={830} y={640} width={280} height={18} fill="#8A5A34" stroke="#16121F" strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={850 + i * 44} y={520 + (i % 2) * 18} width={36} height={120 - (i % 2) * 18} rx={4}
            fill={['#E85D5D', '#36D6F0', '#FFD640', '#20E388', '#B07CFF'][i]} stroke="#16121F" strokeWidth={5} />
        ))}
        {/* bureau */}
        <rect x={-20} y={1330} width={1120} height={40} fill="#B07A4A" stroke="#16121F" strokeWidth={9} />
        <rect x={-20} y={1370} width={1120} height={600} fill="#8A5A34" />
        {/* lampe */}
        <path d="M 900 1330 L 900 1180 L 960 1120" fill="none" stroke="#16121F" strokeWidth={12} strokeLinecap="round" />
        <path d="M 920 1080 L 1010 1110 L 990 1170 Z" fill="#FFD640" stroke="#16121F" strokeWidth={7} strokeLinejoin="round" />
        {/* pile de cours */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={60 + i * 6} y={1300 - i * 26} width={220} height={26} rx={4}
            fill={['#F4F1E8', '#E85D5D', '#36D6F0'][i]} stroke="#16121F" strokeWidth={5} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 600, top: 900, width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,214,64,0.16) 0%, rgba(0,0,0,0) 65%)'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Repaire de Monsieur Découvert (23 nov. 2026, format « POV du méchant ») : mur rouge sombre, tableau de liège avec
 *  fiches et fils rouges, ampoule qui se balance. */
export const PlanBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 18) * 5;
  const pins = [[260, 700], [520, 640], [800, 720], [360, 920], [700, 940]];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#2A0A14 0%,#40101E 55%,#1C060E 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={150} y={560} width={780} height={480} rx={14} fill="#A8743E" stroke="#16121F" strokeWidth={12} opacity={0.55} />
        {pins.map(([x, y], i) => (
          <g key={i} opacity={0.6}>
            <rect x={x - 62} y={y - 44} width={124} height={88} fill="#F4F1E8" stroke="#16121F" strokeWidth={4}
              transform={`rotate(${(rand(i + 5) - 0.5) * 14} ${x} ${y})`} />
            <circle cx={x} cy={y - 38} r={10} fill="#F04242" stroke="#16121F" strokeWidth={3} />
          </g>
        ))}
        <polyline points={pins.map(([x, y]) => `${x},${y - 38}`).join(' ')} fill="none" stroke="#F04242" strokeWidth={5} opacity={0.6} />
        <g transform={`rotate(${sw} 540 0)`}>
          <line x1={540} y1={0} x2={540} y2={130} stroke="#16121F" strokeWidth={5} />
          <circle cx={540} cy={150} r={26} fill="#FFE9A0" style={{filter: 'drop-shadow(0 0 40px #FFD640)'}} />
        </g>
      </svg>
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Rayon de magasin un soir de promos (24 nov. 2026, Black Friday « vraie ou fausse promo ? ») : mur sombre, étagères,
 *  guirlande de fanions et néon « PROMO » générique qui clignote doucement. Aucune enseigne réelle. */
export const VitrineBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const glow = 0.75 + 0.25 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#120A22 0%,#1E1236 60%,#0E0818 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* fanions */}
        <path d="M -20 70 Q 540 150 1100 70" fill="none" stroke="#16121F" strokeWidth={5} />
        {Array.from({length: 12}, (_, i) => {
          const x = 20 + i * 92;
          const y = 70 + 80 * Math.sin((x / 1080) * Math.PI) * 0.95;
          return <path key={i} d={`M ${x} ${y} L ${x + 56} ${y + 4} L ${x + 30} ${y + 62} Z`}
            fill={['#F04242', '#FFD640', '#E828BE', '#36D6F0'][i % 4]} stroke="#16121F" strokeWidth={4} opacity={0.85} />;
        })}
        {/* étagères */}
        {[1060, 1290].map((y, r) => (
          <g key={y}>
            <rect x={-20} y={y} width={1120} height={22} fill="#4A3A6A" stroke="#16121F" strokeWidth={6} />
            {Array.from({length: 7}, (_, i) => (
              <rect key={i} x={30 + i * 150 + rand(i + r * 9) * 20} y={y - 70 - rand(i + 4 + r) * 40} width={90}
                height={70 + rand(i + 4 + r) * 40} rx={10} fill={['#2E2650', '#3A2E60', '#28224A'][(i + r) % 3]}
                stroke="#16121F" strokeWidth={5} />
            ))}
          </g>
        ))}
        <rect x={-20} y={1500} width={1120} height={440} fill="#0B0714" />
      </svg>
      {/* néon générique */}
      <div style={{position: 'absolute', right: 60, top: 1560, transform: 'rotate(-6deg)', fontFamily: 'Inter', fontWeight: 900,
        fontSize: 64, color: '#FFB0EC', opacity: 0.25 + 0.2 * glow, textShadow: `0 0 ${24 * glow}px #E828BE`, letterSpacing: 6}}>PROMO</div>
      <div style={{position: 'absolute', left: 140, top: 500, width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,40,190,0.16) 0%, rgba(0,0,0,0) 65%)'}} />
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Salon de Noël (25 nov. 2026) : mur bordeaux, fenêtre où la neige tombe, guirlande lumineuse qui clignote, parquet.
 *  Le haut reste calme pour le texte. */
export const SalonNoelBg: React.FC<{tint?: number}> = ({tint = 0}) => {
  const f = useCurrentFrame();
  const bulbs = ['#FFD640', '#F04242', '#36D6F0', '#20E388'];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#3A1430 0%,#5A1E3E 58%,#3A1430 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* fenêtre et neige */}
        <rect x={360} y={600} width={360} height={420} rx={14} fill="#0E1640" stroke="#16121F" strokeWidth={12} />
        {Array.from({length: 16}, (_, i) => {
          const y = 610 + ((f * (1.6 + rand(i) * 1.4) + rand(i + 9) * 400) % 400);
          const x = 375 + rand(i + 2) * 330 + Math.sin(f / 12 + i) * 8;
          return <circle key={i} cx={x} cy={y} r={4 + rand(i + 4) * 4} fill="white" opacity={0.85} />;
        })}
        <line x1={540} y1={600} x2={540} y2={1020} stroke="#16121F" strokeWidth={10} />
        <line x1={360} y1={810} x2={720} y2={810} stroke="#16121F" strokeWidth={10} />
        <rect x={340} y={1010} width={400} height={26} rx={6} fill="#E9D6B8" stroke="#16121F" strokeWidth={7} />
        {/* guirlande */}
        <path d="M -20 560 Q 270 640 540 560 Q 810 640 1100 560" fill="none" stroke="#16121F" strokeWidth={5} />
        {Array.from({length: 13}, (_, i) => {
          const x = -10 + i * 90;
          const t = (x + 20) / 560;
          const y = 560 + Math.sin(Math.PI * (t % 1)) * 58 + 18;
          const on = Math.floor(f / 8 + i) % 3 !== 0;
          const c = bulbs[i % 4];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={30} fill={c} opacity={on ? 0.25 : 0} />
              <ellipse cx={x} cy={y} rx={11} ry={16} fill={c} opacity={on ? 1 : 0.35} stroke="#16121F" strokeWidth={4} />
            </g>
          );
        })}
        {/* parquet */}
        <rect x={-20} y={1360} width={1120} height={600} fill="#7A4A2A" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={-20} y1={1420 + i * 110} x2={1100} y2={1420 + i * 110} stroke="#5E3820" strokeWidth={6} />
        ))}
        <rect x={-20} y={1340} width={1120} height={26} fill="#4A2A18" />
      </svg>
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Façade de maison la nuit (26 nov. 2026, « les guirlandes de ton père ») : toit, balcon, fenêtre avec un sapin.
 *  `mode` : 'off' (rien d'allumé), 'led' (petites LED froides qui scintillent), 'ampoules' (grosses ampoules
 *  chaudes à fort halo), 'jardin' (ampoules + projecteurs dont les faisceaux balaient). Le haut reste calme pour le texte. */
export const FacadeBg: React.FC<{tint?: number; mode?: 'off' | 'led' | 'ampoules' | 'jardin'}> = ({tint = 0, mode = 'led'}) => {
  const f = useCurrentFrame();
  const big = mode === 'ampoules' || mode === 'jardin';
  const cols = ['#FFD640', '#F04242', '#36D6F0', '#20E388', '#FF9A3D'];
  const line = (x0: number, y0: number, x1: number, y1: number, sag: number, n: number, key: string) => (
    <g key={key}>
      <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}`} fill="none" stroke="#0B0B14" strokeWidth={4} />
      {mode === 'off' ? null : Array.from({length: n}, (_, i) => {
        const t = (i + 0.5) / n;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + x1) / 2 + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1;
        const c = big ? cols[(i + key.length) % 5] : (i % 2 ? '#E8F6FF' : '#9FE8FF');
        const tw = 0.6 + 0.4 * Math.sin(f / (big ? 9 : 4) + i * 1.7);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={big ? 34 : 14} fill={c} opacity={(big ? 0.35 : 0.25) * tw} />
            <circle cx={x} cy={y} r={big ? 11 : 5} fill={c} opacity={0.6 + 0.4 * tw} />
          </g>
        );
      })}
    </g>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#070A22 0%,#141A46 55%,#1C1F3A 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 26}, (_, i) => (
          <circle key={i} cx={rand(i + 40) * 1080} cy={60 + rand(i + 70) * 440} r={1.5 + rand(i) * 2.5} fill="white"
            opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
        ))}
        {/* maison */}
        <path d="M 120 760 L 540 520 L 960 760 Z" fill="#3A2A3A" stroke="#0B0B14" strokeWidth={12} strokeLinejoin="round" />
        <rect x={160} y={760} width={760} height={620} fill="#5B4A62" stroke="#0B0B14" strokeWidth={12} />
        {/* fenêtre avec sapin */}
        <rect x={210} y={820} width={250} height={250} rx={10} fill={mode === 'off' ? '#1A2050' : '#F7C66A'} stroke="#0B0B14" strokeWidth={10} />
        <path d="M 335 850 L 395 1050 L 275 1050 Z" fill="#1E8F4E" stroke="#0B0B14" strokeWidth={6} />
        <line x1={335} y1={820} x2={335} y2={1070} stroke="#0B0B14" strokeWidth={7} />
        {/* porte */}
        <rect x={600} y={1110} width={170} height={270} rx={12} fill="#2C1E26" stroke="#0B0B14" strokeWidth={10} />
        <circle cx={745} cy={1250} r={10} fill="#FFD640" />
        <circle cx={685} cy={1180} r={46} fill="none" stroke="#20B868" strokeWidth={16} />
        {/* balcon */}
        <rect x={560} y={1010} width={300} height={16} fill="#0B0B14" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={570 + i * 46} y1={1026} x2={570 + i * 46} y2={1090} stroke="#0B0B14" strokeWidth={8} />)}
        <rect x={560} y={1086} width={300} height={10} fill="#0B0B14" />
        <rect x={600} y={830} width={220} height={170} rx={8} fill={mode === 'off' ? '#1A2050' : '#E9B85E'} stroke="#0B0B14" strokeWidth={10} />
        {/* guirlandes */}
        {line(120, 762, 540, 524, 40, big ? 9 : 18, 'toitg')}
        {line(540, 524, 960, 762, 40, big ? 9 : 18, 'toitd')}
        {line(560, 1012, 860, 1012, 40, big ? 6 : 12, 'bal')}
        {line(200, 1090, 470, 1090, 30, big ? 5 : 10, 'fen')}
        {/* jardin */}
        <rect x={-20} y={1380} width={1120} height={560} fill="#0F2A1E" />
        {mode === 'jardin' ? [180, 900].map((x, i) => {
          const a = Math.sin(f / 18 + i * 2) * 14;
          return (
            <g key={i}>
              <path d={`M ${x} 1400 L ${x - 160} 700 L ${x + 160} 700 Z`} fill="#FFF3B0" opacity={0.16}
                transform={`rotate(${a} ${x} 1400)`} />
              <rect x={x - 34} y={1392} width={68} height={40} rx={8} fill="#2A2A33" stroke="#0B0B14" strokeWidth={6} />
            </g>
          );
        }) : null}
      </svg>
      <AbsoluteFill style={{background: NAVY, opacity: tint}} />
    </AbsoluteFill>
  );
};

/** Réveillon (27 nov. 2026) : le salon de Noël avec une grande table dressée au premier plan (nappe bordeaux, bougies,
 *  assiettes). Le haut reste calme pour le texte ; la table occupe y≈1180-1500. */
export const ReveillonBg: React.FC<{tint?: number; empty?: boolean}> = ({tint = 0, empty = false}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SalonNoelBg tint={tint} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={-20} y={1200} width={1120} height={300} fill="#7E1424" stroke="#16121F" strokeWidth={8} />
        <path d="M -20 1200 L 1100 1200 L 1100 1240 Q 540 1270 -20 1240 Z" fill="#F3EEE2" stroke="#16121F" strokeWidth={6} />
        {[150, 400, 680, 930].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={1340} rx={92} ry={34} fill="white" stroke="#16121F" strokeWidth={6} />
            <ellipse cx={x} cy={1340} rx={58} ry={20} fill={empty ? '#EDE6D6' : '#E8B04A'} stroke="#16121F" strokeWidth={4} />
          </g>
        ))}
        {[275, 805].map((x, i) => (
          <g key={i}>
            <rect x={x - 12} y={1250} width={24} height={70} rx={6} fill="white" stroke="#16121F" strokeWidth={5} />
            <ellipse cx={x} cy={1238 + Math.sin(f / 4 + i) * 2} rx={10} ry={18} fill="#FFD640" stroke="#16121F" strokeWidth={4} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
