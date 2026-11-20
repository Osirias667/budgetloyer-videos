// Éléments d'interface BudgetLoyer : pastilles, textes, signature, carte de fin, jauge, compteur, tampon.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Pop, useSpring} from './anim';
import {GREEN, GREY, RED, YEL, eur} from './theme';

const font = (weight: number, size: number): React.CSSProperties => ({fontFamily: 'Inter', fontWeight: weight, fontSize: size});

/** Pastille de rubrique en haut de l'écran (y=150 par défaut). */
export const Pill: React.FC<{txt: string; col: string; fg?: string; size?: number; y?: number}> = (
  {txt, col, fg = 'white', size = 40, y = 150},
) => (
  <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
    <Pop from={-40}>
      <div style={{...font(900, size), background: col, color: fg, padding: '10px 28px', borderRadius: 16,
        boxShadow: `0 0 28px ${col}AA`, letterSpacing: 0.5}}>{txt}</div>
    </Pop>
  </div>
);

/** Bloc de texte centré, gras, avec ombre ; garde 60 px de marge de chaque côté. */
export const Txt: React.FC<{y: number; size: number; weight?: number; delay?: number; color?: string; children: React.ReactNode}> = (
  {y, size, weight = 900, delay = 0, color = 'white', children},
) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center'}}>
    <Pop delay={delay}>
      <div style={{...font(weight, size), color, lineHeight: 1.18, textShadow: '0 5px 0 rgba(0,0,0,0.4)'}}>{children}</div>
    </Pop>
  </div>
);

/** Mot mis en valeur (jaune par défaut), avec halo. */
export const Y: React.FC<{c?: string; children: React.ReactNode}> = ({c = YEL, children}) => (
  <span style={{color: c, textShadow: `0 0 26px ${c}88, 0 5px 0 rgba(0,0,0,0.45)`}}>{children}</span>
);

/** Légende à contour noir (format « visage muet + légende »). */
export const Caption: React.FC<{y: number; size: number; color?: string; delay?: number; children: React.ReactNode}> = (
  {y, size, color = 'white', delay = 0, children},
) => (
  <div style={{position: 'absolute', top: y, left: 50, right: 50, textAlign: 'center'}}>
    <Pop delay={delay}>
      <span style={{...font(900, size), color, lineHeight: 1.2, WebkitTextStroke: `${Math.max(6, size / 7)}px black`,
        paintOrder: 'stroke fill'}}>{children}</span>
    </Pop>
  </div>
);

/** Petite signature de marque pendant la vidéo (règle 11 : discrète). */
export const Brand: React.FC<{x?: number; y?: number}> = ({x = 40, y = 1430}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 14}}>
    <Img src={staticFile('logo.png')} style={{width: 56, height: 56}} />
    <div style={{...font(700, 34), color: YEL}}>BudgetLoyer.com</div>
  </div>
);

/** Logo + BudgetLoyer.com qui rebondit (carte de fin, 2 s maximum). */
export const EndLogo: React.FC<{y: number; note?: string}> = ({y, note}) => {
  const s = useSpring(0, {damping: 10, stiffness: 160});
  return (
    <>
      <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        alignItems: 'center', gap: 20, transform: `scale(${0.6 + 0.4 * s})`}}>
        <Img src={staticFile('logo.png')} style={{width: 100, height: 100}} />
        <span style={{...font(800, 60), color: YEL}}>BudgetLoyer.com</span>
      </div>
      {note ? (
        <div style={{position: 'absolute', top: y + 140, left: 0, right: 0, textAlign: 'center', ...font(500, 32), color: GREY}}>
          {note}
        </div>
      ) : null}
    </>
  );
};

/** Jauge horizontale qui se remplit jusqu'à `level` (0-1). */
export const Gauge: React.FC<{level: number; col: string; label: string; y?: number; start?: number}> = (
  {level, col, label, y = 1260, start = 12},
) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 28], [0, level], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 140, top: y, width: 800}}>
      <div style={{...font(900, 34), color: 'white', marginBottom: 12}}>{label}</div>
      <div style={{height: 42, borderRadius: 21, background: '#242840', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${Math.max(5, p * 100)}%`, borderRadius: 21, background: col, boxShadow: `0 0 24px ${col}`}} />
      </div>
    </div>
  );
};

/** Compteur « prix ÷ heures = prix de l'heure » : le résultat descend en douceur puis claque. */
export const Compteur: React.FC<{hours: number; price: number; y: number; start?: number; unit?: string}> = (
  {hours, price, y, start = 10, unit = 'h'},
) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)});
  const h = Math.max(1, Math.round(1 + (hours - 1) * p));
  const v = price / h;
  const col = v >= 10 ? RED : v >= 2 ? YEL : GREEN;
  const done = p >= 1;
  const punch = done ? interpolate(f - start - 30, [0, 4, 10], [1, 1.12, 1], {extrapolateRight: 'clamp'}) : 1;
  return (
    <>
      <Txt y={y - 40} size={64}>{eur(price)} ÷ {h}{' '}{unit} =</Txt>
      <div style={{position: 'absolute', top: y + 60, left: 0, right: 0, textAlign: 'center', transform: `scale(${punch})`}}>
        <span style={{...font(900, 128), color: col, WebkitTextStroke: '6px black', paintOrder: 'stroke fill',
          textShadow: `0 0 ${done ? 50 : 20}px ${col}AA`}}>{eur(v)} / {unit}</span>
      </div>
    </>
  );
};

/** Tampon incliné qui s'écrase sur l'écran. */
export const Stamp: React.FC<{txt: string; col?: string; y: number; delay?: number; size?: number}> = (
  {txt, col = RED, y, delay = 0, size = 110},
) => {
  const s = useSpring(delay, {damping: 8, stiffness: 220});
  const f = useCurrentFrame();
  if (f < delay) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `rotate(-8deg) scale(${0.3 + 0.7 * s})`, opacity: Math.min(1, s * 2), background: col,
        color: 'white', ...font(900, size), padding: '6px 44px', borderRadius: 26, border: '8px solid white',
        boxShadow: `0 0 40px ${col}`}}>{txt}</div>
    </div>
  );
};

/** Carte arrondie avec bordure lumineuse. */
export const Card: React.FC<{x: number; y: number; w: number; h: number; col: string; delay?: number; children: React.ReactNode}> = (
  {x, y, w, h, col, delay = 0, children},
) => (
  <Pop delay={delay} from={80} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 24,
    background: 'rgba(10,14,44,0.92)', border: `5px solid ${col}`, boxShadow: `0 0 26px ${col}88`, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between', padding: '0 44px', boxSizing: 'border-box'}}>
    {children}
  </Pop>
);

export const T: React.FC<{size: number; color?: string; weight?: number; children: React.ReactNode}> = (
  {size, color = 'white', weight = 900, children},
) => <span style={{...font(weight, size), color}}>{children}</span>;

/** Bulle de dialogue blanche avec pointe (19 nov. 2026). `tail` : position horizontale de la pointe (0-1). */
export const Bulle: React.FC<{x: number; y: number; w: number; size?: number; tail?: number; delay?: number; children: React.ReactNode}> = (
  {x, y, w, size = 48, tail = 0.5, delay = 0, children},
) => (
  <Pop delay={delay} from={30} style={{position: 'absolute', left: x, top: y, width: w}}>
    <div style={{position: 'relative', background: 'white', borderRadius: 34, padding: '22px 30px', border: '7px solid #16121F',
      boxShadow: '0 10px 0 rgba(0,0,0,0.35)', textAlign: 'center', ...font(900, size), color: '#16121F', lineHeight: 1.15}}>
      {children}
      <div style={{position: 'absolute', left: `calc(${tail * 100}% - 22px)`, bottom: -34, width: 0, height: 0,
        borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '34px solid #16121F'}} />
      <div style={{position: 'absolute', left: `calc(${tail * 100}% - 14px)`, bottom: -22, width: 0, height: 0,
        borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '22px solid white'}} />
    </div>
  </Pop>
);

/** Pastille ronde « oui » (coche verte) ou « non » (croix rouge), dessinée en SVG. */
export const Check: React.FC<{ok?: boolean; size?: number}> = ({ok = true, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink: 0}}>
    <circle cx={32} cy={32} r={29} fill={ok ? GREEN : RED} stroke="#16121F" strokeWidth={5} />
    {ok ? <path d="M 18 33 L 28 43 L 46 22" fill="none" stroke="#16121F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M 21 21 L 43 43 M 43 21 L 21 43" stroke="white" strokeWidth={8} strokeLinecap="round" />}
  </svg>
);

/** Nombre qui défile de `a` à `b` entre les images f0 et f1 (montants en euros). */
export const Roll: React.FC<{a: number; b: number; f0?: number; f1?: number; dec?: number}> = ({a, b, f0 = 8, f1 = 30, dec = 0}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [f0, f1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <>{eur(a + (b - a) * p, dec)}</>;
};

/** Carte à collectionner avec rareté (20 nov. 2026, format « ouverture de cartes »). Dos à motif BudgetLoyer jusqu'à
 *  l'image `flipAt`, puis retournement en 10 images et halo de la couleur de rareté. `flipAt` < 0 : toujours de dos ;
 *  0 : déjà retournée. `shake` : la carte tremble avant le retournement (suspense). */
export const CarteRare: React.FC<{x: number; y: number; w: number; h: number; col: string; rarity: string; flipAt?: number;
  shake?: number; children?: React.ReactNode}> = ({x, y, w, h, col, rarity, flipAt = -1, shake = 0, children}) => {
  const f = useCurrentFrame();
  const p = flipAt < 0 ? 0 : flipAt === 0 ? 1 : interpolate(f, [flipAt, flipAt + 10], [0, 1], {extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const front = p >= 0.5;
  const sx = Math.abs(Math.cos(p * Math.PI));
  const shk = shake && p === 0 ? Math.sin(f * 1.9) * shake : 0;
  const glow = front ? 30 + 18 * Math.sin(f / 5) : 18 + 8 * Math.sin(f / 6);
  const shine = ((f * 14) % (w * 3)) - w;
  return (
    <div style={{position: 'absolute', left: x + shk, top: y, width: w, height: h, transform: `scaleX(${Math.max(0.02, sx)}) rotate(${shk * 0.4}deg)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', border: `8px solid ${col}`,
        boxShadow: `0 0 ${glow}px ${col}, 0 12px 0 rgba(0,0,0,0.35)`,
        background: front ? 'linear-gradient(180deg,#1A1F4A 0%,#0A0E2C 100%)'
          : `repeating-linear-gradient(45deg, ${col}33 0 22px, #0A0E2C 22px 44px)`}}>
        {front ? (
          <>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 64, background: col, display: 'flex',
              alignItems: 'center', justifyContent: 'center', ...font(900, 38), color: '#0A0E2C', letterSpacing: 2}}>{rarity}</div>
            <div style={{position: 'absolute', top: 64, left: 0, right: 0, bottom: 0}}>{children}</div>
          </>
        ) : (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: w * 0.42, height: w * 0.42, borderRadius: '50%', background: '#0A0E2C', border: `6px solid ${col}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', ...font(900, w * 0.24), color: col}}>?</div>
          </div>
        )}
        <div style={{position: 'absolute', top: -40, bottom: -40, left: shine, width: 60, transform: 'rotate(18deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))'}} />
      </div>
    </div>
  );
};

/** Horloge numérique (21 nov. 2026) : heure en gros chiffres verts, petite mention de jour au-dessus. */
export const Horloge: React.FC<{h: string; jour?: string; x?: number; y?: number; col?: string; delay?: number}> = (
  {h, jour, x = 620, y = 260, col = GREEN, delay = 0},
) => {
  const f = useCurrentFrame();
  const colon = Math.floor(f / 15) % 2 === 0;
  const [hh, mm] = h.split(':');
  return (
    <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: 380, borderRadius: 26, background: '#0B0F22',
      border: `6px solid ${col}`, boxShadow: `0 0 28px ${col}88`, textAlign: 'center', padding: '10px 0 14px'}}>
      {jour ? <div style={{...font(800, 30), color: GREY, letterSpacing: 2}}>{jour}</div> : null}
      <div style={{...font(900, 110), color: col, lineHeight: 1, textShadow: `0 0 22px ${col}`}}>
        {hh}<span style={{opacity: colon ? 1 : 0.25}}>:</span>{mm}
      </div>
    </Pop>
  );
};

/** Ticket « total » qui défile (21 nov. 2026) : grand montant dans un cadre, libellé au-dessus. */
export const Total: React.FC<{a: number; b: number; label?: string; x?: number; y?: number; w?: number; col?: string;
  f0?: number; f1?: number; delay?: number; unknown?: boolean}> = (
  {a, b, label = 'TOTAL', x = 90, y = 1180, w = 900, col = YEL, f0 = 10, f1 = 30, delay = 0, unknown = false},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: w, height: 190, borderRadius: 28,
    background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, boxShadow: `0 0 26px ${col}88`, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', boxSizing: 'border-box'}}>
    <span style={{...font(900, 54), color: col}}>{label}</span>
    <span style={{...font(900, 104), color: 'white'}}>{unknown ? '? €' : <Roll a={a} b={b} f0={f0} f1={f1} />}</span>
  </Pop>
);
