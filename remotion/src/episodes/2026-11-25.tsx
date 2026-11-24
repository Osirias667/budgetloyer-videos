// 25 nov. 2026 · A : « Sapin de Noël · Le match » (naturel contre plastique, 3 rounds, score, pari avant le round 3) ;
// B : « Speedrun · Liste de Noël » (défi : ta liste en 60 s, chrono de speedrun + splits, total caché, strat des pros).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-25.py.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {MoodBg, SalonNoelBg} from '../bl/decors';
import {P1, Sapin} from '../bl/persos';
import {CYAN, GREEN, GREY, NAVY, RED, VIOLET, YEL} from '../bl/theme';
import {Brand, Caption, Card, Chrono, EndLogo, Option, Pill, Roll, Score, Splits, T, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 30, color: GREY}}>{children}</div>
);

const Tag: React.FC<{x: number; y: number; col: string; children: React.ReactNode}> = ({x, y, col, children}) => (
  <div style={{position: 'absolute', left: x - 170, top: y, width: 340, textAlign: 'center'}}>
    <span style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: NAVY, background: col, padding: '6px 20px',
      borderRadius: 14, boxShadow: `0 0 22px ${col}99`}}>{children}</span>
  </div>
);

const Decompte: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const n = f < 12 ? null : f < 24 ? 3 : f < 36 ? 2 : 1;
  if (n === null) return null;
  const k = interpolate((f - 12) % 12, [0, 4, 12], [1.4, 1, 0.95], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${k})`, fontFamily: 'Inter',
      fontWeight: 900, fontSize: 140, color: YEL, textShadow: `0 0 40px ${YEL}88, 0 8px 0 rgba(0,0,0,0.5)`}}>{n}</div>
  );
};

// =============================== A : Sapin de Noël · Le match ===============================
const NX = 300, PX = 760; // centres des deux sapins (loin du bord droit)
const SRC_A = 'Prix moyens payés en 2024 · Kantar pour Valhor et FranceAgriMer';
const ENVOIE_A = 'Envoie ça à la personne avec qui tu fais le sapin.';

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <SalonNoelBg />
      <Pill txt="SAPIN DE NOËL · LE MATCH" col={GREEN} fg={NAVY} size={42} />
      <Txt y={232} size={58}>Sapin naturel ou en plastique :<br />lequel coûte <Y>le moins cher</Y><br />sur 3 Noëls ?</Txt>
      <Sapin kind="naturel" x={NX} y={540} w={300} expr="cool" look={1} />
      <Sapin kind="plastique" x={PX} y={540} w={300} expr="angry" look={-1} />
      <div style={{position: 'absolute', left: 470, top: 760, width: 140, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
        fontSize: 86, color: YEL, textShadow: `0 0 30px ${YEL}, 0 6px 0 rgba(0,0,0,0.5)`}}>VS</div>
      <Tag x={NX} y={1080} col={GREEN}>NATUREL</Tag>
      <Tag x={PX} y={1080} col={CYAN}>PLASTIQUE</Tag>
      <Caption y={1165} size={50}>3 rounds. <Y>Réponse au 3e.</Y></Caption>
      <Caption y={1262} size={38} color={YEL}>{ENVOIE_A}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Round1: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.25} />
    <Pill txt="ROUND 1 · LE PRIX" col={YEL} fg={NAVY} size={44} />
    <Score left="NATUREL" right="PLASTIQUE" a={1} b={0} y={240} hit="L" at={40} colR={CYAN} />
    <Sapin kind="naturel" x={NX} y={480} w={300} expr="happy" talk label="32,70 €" />
    <Sapin kind="plastique" x={PX} y={480} w={300} expr="worry" label="46,50 €" />
    <Caption y={1050} size={54} delay={30}>Le naturel est moins cher<br /><Y>la 1re année</Y>.</Caption>
    <Note y={1235}>{SRC_A}</Note>
    <Brand />
  </SceneIn>
);

const Round2: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.25} />
    <Pill txt="ROUND 2 · L'ODEUR" col={YEL} fg={NAVY} size={44} />
    <Score left="NATUREL" right="PLASTIQUE" a={2} b={0} y={240} hit="L" at={26} colR={CYAN} />
    <Sapin kind="naturel" x={NX} y={480} w={300} expr="happy" needles />
    <Sapin kind="plastique" x={PX} y={480} w={300} expr="sad" />
    <Caption y={1050} size={54} delay={8}>Il sent <Y c={GREEN}>la forêt</Y>.</Caption>
    <Caption y={1150} size={42} delay={22} color={GREY}>…et il sème ses aiguilles partout.</Caption>
    <Brand />
  </SceneIn>
);

const Pari: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="ROUND 3 · SUR 3 NOËLS" col={RED} size={44} />
    <Txt y={250} size={60}>Qui coûte le moins cher<br />sur <Y>3 Noëls</Y> ?</Txt>
    <Option x={80} y={470} w={440} h={230} letter="N" title="Naturel" sub="racheté chaque année" col={GREEN} />
    <Option x={560} y={470} w={440} h={230} letter="P" title="Plastique" sub="acheté une fois, gardé" col={CYAN} />
    <Caption y={780} size={64}>Ton pari ?</Caption>
    <Decompte y={900} />
    <Brand />
  </SceneIn>
);

const Colonne: React.FC<{x: number; titre: string; calc: string; a: number; b: number; col: string; delay: number; win?: boolean}> = (
  {x, titre, calc, a, b, col, delay, win},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: 470, width: 430, height: 400, borderRadius: 30, boxSizing: 'border-box',
    background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, boxShadow: win ? `0 0 46px ${col}` : `0 0 20px ${col}55`,
    textAlign: 'center', paddingTop: 26}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: col}}>{titre}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: 'white', marginTop: 14}}>{calc}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: GREY, marginTop: 30, letterSpacing: 2}}>SUR 3 NOËLS</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: win ? YEL : 'white', lineHeight: 1.1}}>
      <Roll a={a} b={b} f0={delay + 6} f1={delay + 30} dec={2} />
    </div>
  </Pop>
);

const Round3: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.45} />
    <Pill txt="ROUND 3 · SUR 3 NOËLS" col={RED} size={44} />
    <Score left="NATUREL" right="PLASTIQUE" a={2} b={1} y={240} hit="R" at={50} colR={CYAN} />
    <Colonne x={70} titre="NATUREL" calc="3 × 32,70 €" a={0} b={98.1} col={GREEN} delay={2} />
    <Colonne x={580} titre="PLASTIQUE" calc="1 × 46,50 €" a={0} b={46.5} col={CYAN} delay={10} win />
    <Caption y={920} size={54} delay={42}>Le plastique passe devant<br /><Y>dès le 2e Noël</Y>.</Caption>
    <Note y={1120}>Calcul sur les prix moyens 2024, si le plastique tient 3 ans au placard</Note>
    <Brand />
  </SceneIn>
);

const Verdict: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.3} />
    <Pill txt="SCORE FINAL · 2-1" col={YEL} fg={NAVY} size={44} />
    <Txt y={240} size={54}>Le naturel gagne <Y c={GREEN}>au cœur</Y>.<br />Le plastique gagne <Y c={CYAN}>au portefeuille</Y>.</Txt>
    <Sapin kind="naturel" x={210} y={560} w={230} expr="cool" />
    <P1 x={540} y={600} w={300} expr="shock" talk />
    <Sapin kind="plastique" x={860} y={560} w={200} expr="cool" />
    <Caption y={1060} size={52} delay={14}>Le seul perdant :<br /><Y c={RED}>celui qui achète les deux</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.35} />
    <Caption y={170} size={66}>Team <Y c={GREEN}>naturel</Y><br />ou team <Y c={CYAN}>plastique</Y> ?</Caption>
    <Caption y={380} size={44} color={YEL}>Réponds N ou P.</Caption>
    <Sapin kind="naturel" x={NX} y={480} w={240} expr="happy" />
    <Sapin kind="plastique" x={PX} y={480} w={240} expr="happy" />
    <Caption y={920} size={38}>{ENVOIE_A}</Caption>
    <EndLogo y={1080} note={SRC_A} />
  </SceneIn>
);

export const A_DURATIONS = [3.0, 2.8, 2.4, 2.4, 3.2, 2.6, 2.0];

export const SapinMatch: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[<AHook />, <Round1 />, <Round2 />, <Pari />, <Round3 />, <Verdict />, <AEnd />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Speedrun · Liste de Noël ===============================
const ENVOIE_B = 'Envoie ça à ta sœur ou ton frère.';
const ROWS = [
  {name: 'Maman', val: '40 €'},
  {name: 'Papa', val: '35 €'},
  {name: 'Mamie', val: '25 €'},
  {name: 'Ta sœur', val: '30 €'},
  {name: 'Secret Santa', val: '15 €'},
  {name: 'Les 3 potes', val: '30 €'},
  {name: 'Ta moitié', val: '60 €'},
  {name: 'Le cousin (oublié)', val: '20 €', bad: true},
  {name: 'Belle-famille (oubliée)', val: '50 €', bad: true},
];
const NEVER = 99999;
const shownUntil = (n: number, at: number[]) => ROWS.map((_, i) => (i < n ? -1 : at[i - n] ?? NEVER));

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <SalonNoelBg tint={0.35} />
      <Pill txt="DÉFI · NOËL DANS 30 JOURS" col={RED} size={42} />
      <Txt y={235} size={62}>Ta liste de Noël<br /><Y>en 60 secondes</Y>.<br />Un prix par prénom.</Txt>
      <Chrono s0={0} s1={0} y={490} label="SPEEDRUN · LISTE DE NOËL" />
      <Splits rows={[...ROWS.slice(0, 4).map((r) => ({...r, val: '? €'})), {name: '+ les oubliés…', val: '? €', bad: true}]}
        at={[-10, -10, -10, -10, -10]} y={700} rowH={74} />
      <Caption y={1150} size={52}>Le total va <Y c={RED}>te piquer</Y>.</Caption>
      <Caption y={1250} size={40} color={YEL}>{ENVOIE_B}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Run: React.FC<{pill: string; col: string; s0: number; s1: number; n0: number; at: number[]; t0: number; t1: number;
  caption: React.ReactNode; totCol?: string}> = ({pill, col, s0, s1, n0, at, t0, t1, caption, totCol}) => (
  <SceneIn>
    <SalonNoelBg tint={0.55} />
    <Pill txt={pill} col={col} fg={col === RED ? 'white' : NAVY} size={40} />
    <Chrono s0={s0} s1={s1} f0={0} f1={100} y={228} col={col} />
    <Splits rows={ROWS} at={shownUntil(n0, at)} y={420} rowH={62} total={{a: t0, b: t1, f0: at[0] ?? 0, f1: (at[at.length - 1] ?? 0) + 12,
      col: totCol}} />
    <Caption y={1190} size={50} delay={(at[at.length - 1] ?? 0) + 6}>{caption}</Caption>
    <Brand />
  </SceneIn>
);

const Finish: React.FC = () => (
  <SceneIn>
    <MoodBg col={RED} dark={0.6} />
    <Pill txt="RUN TERMINÉ" col={YEL} fg={NAVY} size={44} />
    <Chrono s0={58} s1={58} y={228} col={YEL} done />
    <Pop delay={4} style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center'}}>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: GREY, letterSpacing: 3}}>TOTAL</div>
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: 'white', lineHeight: 1,
        textShadow: `0 0 40px ${RED}`}}>305&nbsp;€</div>
    </Pop>
    <P1 x={540} y={700} w={300} expr="shock" shake={3} />
    <Caption y={1080} size={52} delay={12}>Dans ta tête : 200 €.<br />Écart : <Y c={RED}>+105 €</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const Strat: React.FC = () => (
  <SceneIn>
    <MoodBg col={GREEN} dark={0.65} />
    <Pill txt="LA STRAT DES PROS" col={GREEN} fg={NAVY} size={44} />
    <Txt y={240} size={58}>Ils font <Y>l'inverse</Y> :</Txt>
    {[
      ['1', 'Le total d\'abord', 'ex. 200 €'],
      ['2', 'Les oubliés d\'abord', 'cousin…'],
      ['3', 'Puis tu répartis', 'par prénom'],
    ].map(([n, t, s], i) => (
      <Card key={i} x={110} y={360 + i * 190} w={860} h={160} col={[YEL, RED, GREEN][i]} delay={4 + i * 10}>
        <T size={48}>{n}. {t}</T><T size={34} color={GREY}>{s}</T>
      </Card>
    ))}
    <P1 x={540} y={950} w={260} expr="cool" />
    <Caption y={1300} size={46} delay={30}>Même chrono. <Y>Zéro surprise.</Y></Caption>
    <Brand />
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <SalonNoelBg tint={0.35} />
    <Caption y={170} size={64}>Ta liste de Noël :<br /><Y>combien au total</Y> ?</Caption>
    <Caption y={380} size={44} color={YEL}>Réponds avec un nombre.</Caption>
    <Chrono s0={0} s1={0} y={500} label="RUN 2 · À TOI" />
    <Caption y={800} size={40}>{ENVOIE_B}</Caption>
    <EndLogo y={1080} note="Montants d'exemple" />
  </SceneIn>
);

export const B_DURATIONS = [3.0, 3.4, 3.0, 2.8, 2.4, 3.0, 2.0];

export const SpeedrunListeNoel: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />,
        <Run pill="SPLIT 1 · LA FAMILLE" col={GREEN} s0={0} s1={21} n0={0} at={[8, 24, 40, 56]} t0={0} t1={130}
          caption={<>Famille : <Y>130 €</Y>. Facile.</>} />,
        <Run pill="SPLIT 2 · LES AUTRES" col={CYAN} s0={21} s1={44} n0={4} at={[6, 26, 46]} t0={130} t1={235}
          caption={<>Encore <Y>16 secondes</Y>. Large.</>} />,
        <Run pill="OUPS · LES OUBLIÉS" col={RED} s0={44} s1={58} n0={7} at={[10, 32]} t0={235} t1={305} totCol={RED}
          caption={<>« Ah oui… <Y c={RED}>le cousin vient</Y>. »</>} />,
        <Finish />, <Strat />, <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
