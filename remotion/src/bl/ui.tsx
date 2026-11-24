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

/** Feuille de calendrier (22 nov. 2026) : bandeau rouge avec le jour de la semaine, grand numéro, mois. */
export const Feuille: React.FC<{jour: string; num: string; mois: string; x: number; y: number; w?: number; col?: string; delay?: number}> = (
  {jour, num, mois, x, y, w = 260, col = RED, delay = 0},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: w, borderRadius: 24, overflow: 'hidden', background: 'white',
    border: '7px solid #16121F', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
    <div style={{background: col, ...font(900, w * 0.15), color: 'white', padding: '6px 0'}}>{jour}</div>
    <div style={{...font(900, w * 0.42), color: '#16121F', lineHeight: 1.05}}>{num}</div>
    <div style={{...font(800, w * 0.13), color: '#16121F', paddingBottom: 10}}>{mois}</div>
  </Pop>
);

/** Rangée de cases qui se remplissent (22 nov. 2026, mécanisme « liste vide qui se remplit ») : `filled` cases pleines,
 *  la case `filled - 1` s'allume à l'image `at`. */
export const Cases: React.FC<{items: {top: string; val: string}[]; filled: number; y: number; at?: number; col?: string}> = (
  {items, filled, y, at = 0, col = GREEN},
) => {
  const f = useCurrentFrame();
  const n = items.length;
  const w = 152, gap = 12;
  const x0 = (1080 - (n * w + (n - 1) * gap)) / 2;
  return (
    <>
      {items.map((it, i) => {
        const on = i < filled && (i < filled - 1 || f >= at);
        const just = i === filled - 1 && at > 0;
        const k = just ? interpolate(f - at, [0, 4, 10], [1, 1.18, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * (w + gap), top: y, width: w, height: 150, borderRadius: 22,
            boxSizing: 'border-box', border: `6px solid ${on ? col : '#3A4060'}`, background: on ? 'rgba(10,14,44,0.95)' : 'rgba(10,14,44,0.7)',
            boxShadow: on ? `0 0 22px ${col}88` : undefined, textAlign: 'center', transform: `scale(${k})`}}>
            <div style={{...font(800, 28), color: GREY, marginTop: 14}}>{it.top}</div>
            <div style={{...font(900, 54), color: on ? col : '#5A6080', marginTop: 8}}>{on ? it.val : '?'}</div>
          </div>
        );
      })}
    </>
  );
};

/** Addition de restaurant (22 nov. 2026) : petit ticket blanc posé en biais, montant en gros. */
export const Addition: React.FC<{total: string; sub?: string; x?: number; y?: number; w?: number; delay?: number; rot?: number}> = (
  {total, sub, x = 340, y = 600, w = 400, delay = 0, rot = -4},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: w}}>
    <div style={{transform: `rotate(${rot}deg)`, background: '#FFFDF4', border: '7px solid #16121F', borderRadius: 14,
      boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '18px 26px 24px', textAlign: 'center'}}>
      <div style={{...font(900, 36), color: '#16121F', letterSpacing: 4}}>ADDITION</div>
      <div style={{borderTop: '4px dashed #16121F', margin: '10px 0'}} />
      {sub ? <div style={{...font(700, 30), color: '#555'}}>{sub}</div> : null}
      <div style={{...font(900, 92), color: RED, lineHeight: 1.1}}>{total}</div>
    </div>
  </Pop>
);

/** Compteur de jeu de la série « Survie » (23 nov. 2026) : « IL TE RESTE » qui défile, jours restants et repère par jour.
 *  Élément de jeu, pas un écran de l'app (règle 11). */
export const HudSurvie: React.FC<{a: number; b: number; jours: number; parJour: number; y?: number; delay?: number; col?: string}> = (
  {a, b, jours, parJour, y = 260, delay = 0, col = GREEN},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: 110, top: y, width: 860, height: 190, borderRadius: 30,
    background: 'rgba(10,14,44,0.93)', border: `6px solid ${col}`, boxShadow: `0 0 28px ${col}77`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px'}}>
    <div>
      <div style={{...font(900, 34), color: col, letterSpacing: 2}}>IL TE RESTE</div>
      <div style={{...font(900, 96), color: 'white', lineHeight: 1.05}}><Roll a={a} b={b} /></div>
    </div>
    <div style={{textAlign: 'right'}}>
      <div style={{...font(900, 50), color: YEL}}>{jours} jours</div>
      <div style={{...font(800, 40), color: 'white', marginTop: 8}}>{eur(parJour)}<span style={{color: GREY}}>/jour</span></div>
    </div>
  </Pop>
);

/** Option de choix A / B (23 nov. 2026). `pick` : l'option choisie s'allume à l'image `at`, l'autre s'éteint ;
 *  sans `pick`, les deux restent allumées (choix laissé au public). */
export const Option: React.FC<{x: number; y: number; w: number; h: number; letter: string; title: string; sub: string; col: string;
  state?: 'on' | 'pick' | 'off'; at?: number; delay?: number}> = (
  {x, y, w, h, letter, title, sub, col, state = 'on', at = 0, delay = 0},
) => {
  const f = useCurrentFrame();
  const done = f >= at;
  const dim = state === 'off' && done;
  const lit = state === 'pick' && done;
  const k = lit ? interpolate(f - at, [0, 4, 10], [1, 1.08, 1], {extrapolateRight: 'clamp'}) : 1;
  return (
    <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div style={{width: '100%', height: '100%', borderRadius: 26, boxSizing: 'border-box', padding: '18px 24px',
        background: 'rgba(10,14,44,0.93)', border: `6px solid ${dim ? '#3A4060' : col}`, opacity: dim ? 0.45 : 1,
        boxShadow: lit ? `0 0 40px ${col}` : `0 0 16px ${col}55`, transform: `scale(${k})`, textAlign: 'center', position: 'relative'}}>
        <div style={{...font(900, 44), color: dim ? GREY : col}}>{letter}</div>
        <div style={{...font(900, 44), color: 'white', lineHeight: 1.1, marginTop: 4}}>{title}</div>
        <div style={{...font(700, 32), color: GREY, marginTop: 6, lineHeight: 1.15}}>{sub}</div>
        {lit ? <div style={{position: 'absolute', top: -30, right: -20}}><Check size={72} /></div> : null}
      </div>
    </Pop>
  );
};

/** Étiquette de prix (24 nov. 2026, « vraie ou fausse promo ? ») : carton blanc percé, produit, badge de réduction,
 *  prix barré et nouveau prix. `verdict` : tampon VRAIE / FAUSSE posé dessus à l'image `at`. */
export const Etiquette: React.FC<{x: number; y: number; w?: number; num?: number; produit: string; avant: number; apres: number;
  pct: number; rot?: number; delay?: number; verdict?: 'vraie' | 'fausse'; at?: number; dim?: boolean}> = (
  {x, y, w = 300, num, produit, avant, apres, pct, rot = 0, delay = 0, verdict, at = 0, dim = false},
) => {
  const f = useCurrentFrame();
  const s = w / 300;
  const stamp = verdict && f >= at;
  const k = stamp ? interpolate(f - at, [0, 5, 10], [1.8, 0.92, 1], {extrapolateRight: 'clamp'}) : 1;
  return (
    <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: w}}>
      <div style={{transform: `rotate(${rot}deg)`, opacity: dim ? 0.45 : 1, position: 'relative'}}>
        <div style={{background: '#FFFDF4', border: `${7 * s}px solid #16121F`, borderRadius: 22 * s, padding: `${44 * s}px ${18 * s}px ${20 * s}px`,
          textAlign: 'center', boxShadow: '0 12px 0 rgba(0,0,0,0.35)', position: 'relative'}}>
          <div style={{position: 'absolute', left: '50%', top: 12 * s, width: 22 * s, height: 22 * s, marginLeft: -11 * s, borderRadius: '50%',
            background: '#1E1236', border: `${5 * s}px solid #16121F`}} />
          {num ? <div style={{position: 'absolute', left: 14 * s, top: 8 * s, ...font(900, 34 * s), color: '#16121F'}}>{num}</div> : null}
          <div style={{...font(800, 34 * s), color: '#16121F', lineHeight: 1.1}}>{produit}</div>
          <div style={{...font(700, 38 * s), color: '#7A7A86', textDecoration: 'line-through', textDecorationThickness: 4 * s,
            marginTop: 8 * s}}>{eur(avant, 0)}</div>
          <div style={{...font(900, 74 * s), color: RED, lineHeight: 1.05}}>{eur(apres, 0)}</div>
          <div style={{position: 'absolute', right: -22 * s, top: -26 * s, background: RED, color: 'white', ...font(900, 38 * s),
            padding: `${6 * s}px ${14 * s}px`, borderRadius: 16 * s, border: `${5 * s}px solid #16121F`, transform: 'rotate(8deg)'}}>
            -{pct}&nbsp;%</div>
        </div>
        {stamp ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: '42%', display: 'flex', justifyContent: 'center'}}>
            <div style={{transform: `rotate(-12deg) scale(${k})`, background: verdict === 'vraie' ? GREEN : RED,
              color: verdict === 'vraie' ? '#0A0E2C' : 'white', ...font(900, 48 * s), padding: `${4 * s}px ${20 * s}px`,
              borderRadius: 14 * s, border: `${6 * s}px solid white`, boxShadow: '0 0 24px rgba(0,0,0,0.5)'}}>
              {verdict === 'vraie' ? 'VRAIE' : 'FAUSSE'}</div>
          </div>
        ) : null}
      </div>
    </Pop>
  );
};

/** Courbe du prix sur les 30 jours avant la promo (24 nov. 2026) : la ligne se trace de f0 à f1, puis le prix le plus
 *  bas des 30 jours (le prix de référence) s'affiche en pointillés à partir de `lowAt`. `prices` : 31 valeurs, de J-30
 *  à J-1, puis le prix promo (dernier point, en rouge). */
export const CourbePrix: React.FC<{prices: number[]; y: number; f0?: number; f1?: number; lowAt?: number; col?: string;
  lowLabel?: string}> = (
  {prices, y, f0 = 4, f1 = 34, lowAt = 38, col = '#36D6F0', lowLabel},
) => {
  const f = useCurrentFrame();
  const W = 900, H = 400, padL = 30, padR = 30, padT = 60, padB = 70;
  const before = prices.slice(0, -1);
  const lo = Math.min(...prices), hi = Math.max(...prices);
  const span = Math.max(1, hi - lo);
  const px = (i: number) => padL + (i / (prices.length - 1)) * (W - padL - padR);
  const py = (v: number) => padT + (1 - (v - (lo - span * 0.15)) / (span * 1.3)) * (H - padT - padB);
  const p = interpolate(f, [f0, f1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const n = Math.max(1, Math.floor(p * (prices.length - 1)));
  const pts = prices.slice(0, n + 1).map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const ref = Math.min(...before);
  const showLow = f >= lowAt;
  const lk = showLow ? interpolate(f - lowAt, [0, 8], [0, 1], {extrapolateRight: 'clamp'}) : 0;
  const last = prices.length - 1;
  return (
    <Pop style={{position: 'absolute', left: 90, top: y, width: W, height: H}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`,
        boxShadow: `0 0 26px ${col}66`}} />
      <div style={{position: 'absolute', left: 30, top: 12, ...font(900, 32), color: col, letterSpacing: 1}}>PRIX SUR 30 JOURS</div>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={padL} x2={W - padR} y1={H - padB + 10} y2={H - padB + 10} stroke="#3A4060" strokeWidth={4} />
        <polyline points={pts} fill="none" stroke="white" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        {showLow ? (
          <line x1={padL} x2={padL + (W - padL - padR) * lk} y1={py(ref)} y2={py(ref)} stroke={YEL} strokeWidth={7} strokeDasharray="18 12" />
        ) : null}
        {n >= last ? <circle cx={px(last)} cy={py(prices[last])} r={16} fill={RED} stroke="white" strokeWidth={5} /> : null}
      </svg>
      <div style={{position: 'absolute', left: 30, top: H - 56, ...font(700, 28), color: GREY}}>il y a 30 jours</div>
      <div style={{position: 'absolute', right: 30, top: H - 56, ...font(800, 28), color: RED}}>Black Friday</div>
      {showLow && lowLabel ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: H + 18, textAlign: 'center', opacity: lk, ...font(900, 44), color: YEL}}>
          {lowLabel}</div>
      ) : null}
    </Pop>
  );
};

/** Chronomètre de speedrun (25 nov. 2026) : passe de `s0` à `s1` secondes entre les images f0 et f1, format 00:00.0.
 *  `label` au-dessus (ex. « RUN · LISTE DE NOËL »). Élément de jeu, pas un écran de l'app. */
export const Chrono: React.FC<{s0: number; s1: number; f0?: number; f1?: number; y?: number; col?: string; label?: string;
  done?: boolean}> = ({s0, s1, f0 = 0, f1 = 60, y = 250, col = GREEN, label, done = false}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [f0, f1], [s0, s1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mm = Math.floor(s / 60), ss = Math.floor(s % 60), d = Math.floor((s * 10) % 10);
  const txt = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${d}`;
  const blink = done && Math.floor(f / 6) % 2 === 0;
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, borderRadius: 26, padding: '8px 40px 12px',
        boxShadow: `0 0 30px ${col}88`, textAlign: 'center'}}>
        {label ? <div style={{...font(900, 30), color: col, letterSpacing: 3}}>{label}</div> : null}
        <div style={{...font(900, 104), fontVariantNumeric: 'tabular-nums', color: 'white',
          lineHeight: 1.05, opacity: blink ? 0.45 : 1, letterSpacing: 2}}>{txt}</div>
      </div>
    </div>
  );
};

/** Liste de « splits » de speedrun (25 nov. 2026) : chaque ligne (prénom, montant) apparaît à l'image `at[i]` ;
 *  `bad` : ligne rouge (oubli). Total en bas qui défile si `total` est donné. */
export const Splits: React.FC<{rows: {name: string; val: string; bad?: boolean}[]; at: number[]; y: number;
  total?: {a: number; b: number; f0: number; f1: number; col?: string}; rowH?: number}> = ({rows, at, y, total, rowH = 74}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 110, top: y, width: 860, borderRadius: 26, boxSizing: 'border-box',
      background: 'rgba(10,14,44,0.92)', border: '5px solid #3A4070', padding: '14px 34px'}}>
      {rows.map((r, i) => {
        const on = f >= (at[i] ?? 0);
        const k = on ? interpolate(f - (at[i] ?? 0), [0, 5], [0, 1], {extrapolateRight: 'clamp'}) : 0;
        const c = r.bad ? RED : 'white';
        return (
          <div key={i} style={{height: rowH, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: i < rows.length - 1 ? '2px solid #2A3060' : 'none', opacity: on ? k : 0.18,
            transform: `translateX(${(1 - k) * -40}px)`}}>
            <span style={{...font(800, 46), color: on ? c : GREY}}>{on ? r.name : '…'}</span>
            <span style={{...font(900, 50), color: on ? (r.bad ? RED : YEL) : GREY}}>{on ? r.val : '? €'}</span>
          </div>
        );
      })}
      {total ? (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10,
          borderTop: `4px solid ${total.col ?? GREEN}`}}>
          <span style={{...font(900, 50), color: total.col ?? GREEN, letterSpacing: 2}}>TOTAL</span>
          <span style={{...font(900, 72), color: 'white'}}><Roll a={total.a} b={total.b} f0={total.f0} f1={total.f1} /></span>
        </div>
      ) : null}
    </div>
  );
};

/** Tableau de score d'un match en rounds (25 nov. 2026) : deux noms, deux scores ; `hit` : côté qui marque (pulse). */
export const Score: React.FC<{left: string; right: string; a: number; b: number; y?: number; colL?: string; colR?: string;
  hit?: 'L' | 'R'; at?: number}> = ({left, right, a, b, y = 250, colL = GREEN, colR = '#36D6F0', hit, at = 0}) => {
  const f = useCurrentFrame();
  const pulse = (side: 'L' | 'R') => (hit === side && f >= at ? interpolate(f - at, [0, 5, 12], [1, 1.35, 1],
    {extrapolateRight: 'clamp'}) : 1);
  const shownA = hit === 'L' && f < at ? a - 1 : a;
  const shownB = hit === 'R' && f < at ? b - 1 : b;
  const box = (name: string, v: number, c: string, side: 'L' | 'R') => (
    <div style={{width: 330, textAlign: 'center'}}>
      <div style={{...font(900, 38), color: c, letterSpacing: 1}}>{name}</div>
      <div style={{...font(900, 110), color: 'white', lineHeight: 1, transform: `scale(${pulse(side)})`,
        textShadow: `0 0 30px ${c}`}}>{v}</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', top: y, left: 110, width: 860, height: 190, borderRadius: 30, boxSizing: 'border-box',
      background: 'rgba(10,14,44,0.93)', border: '5px solid #3A4070', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px'}}>
      {box(left, shownA, colL, 'L')}
      <div style={{...font(900, 60), color: YEL}}>–</div>
      {box(right, shownB, colR, 'R')}
    </div>
  );
};
