// 24 nov. 2026 · A : « Survie · Étudiant · Épisode 2/2 » (suite promise le 23 nov. : les deux fins, même imprévu, vraie fin) ;
// B : « Black Friday · Vraie ou fausse promo ? » (jeu à 3 étiquettes, courbe du prix sur 30 jours révélée après le pari).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-24.py.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {ChambreBg, MoodBg, VitrineBg} from '../bl/decors';
import {Decouvert, P1} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL, eur} from '../bl/theme';
import {Brand, Bulle, Caption, Card, CourbePrix, EndLogo, Etiquette, HudSurvie, Option, Pill, Roll, Stamp, T, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : Survie · Étudiant · Épisode 2/2 ===============================
const PILL_A = 'SURVIE · ÉTUDIANT · ÉPISODE 2/2';

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <ChambreBg />
      <Pill txt={PILL_A} col={GREEN} fg={NAVY} size={40} />
      <Txt y={235} size={64}>Budget étudiant : train à 55 €<br />ou covoit à 30 € ?</Txt>
      <HudSurvie a={212} b={212} jours={18} parJour={212 / 18} y={420} col={YEL} />
      <Option x={80} y={650} w={440} h={220} letter="A" title="Train · 55 €" sub="départ à 14 h" col={CYAN} />
      <Option x={560} y={650} w={440} h={220} letter="B" title="Covoit · 30 €" sub={'départ à 5 h du mat\''} col={MAG} />
      <P1 x={540} y={900} w={240} expr="worry" />
      <Caption y={1170} size={56}>Voici <Y>les deux fins</Y>.</Caption>
      <Caption y={1265} size={40} color={YEL}>Envoie ça à ton pote étudiant.</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Fin: React.FC<{letter: 'A' | 'B'; titre: string; b: number; col: string; expr: any; line: string; sub: string}> = (
  {letter, titre, b, col, expr, line, sub},
) => (
  <SceneIn>
    <ChambreBg tint={0.2} />
    <Pill txt={`FIN ${letter} · ${titre}`} col={col} fg={NAVY} size={44} />
    <HudSurvie a={212} b={b} jours={18} parJour={b / 18} y={250} col={col} />
    <Txt y={480} size={52}>{sub}</Txt>
    <P1 x={300} y={700} w={380} expr={expr} talk />
    <Bulle x={470} y={720} w={500} size={42} tail={0.15} delay={24}>{line}</Bulle>
    <Note y={1160}>Montants d'exemple · histoire inventée</Note>
    <Brand />
  </SceneIn>
);

const Imprevu: React.FC = () => (
  <SceneIn>
    <ChambreBg tint={0.3} />
    <Pill txt="JOUR 20 · POUR A ET B" col={RED} size={44} />
    <Txt y={260} size={58}>Même imprévu<br />pour <Y>les deux fins</Y> :</Txt>
    <Card x={110} y={470} w={860} h={170} col={RED} delay={4}>
      <T size={42}>Chargeur d'ordi HS,<br />la veille du dernier rendu</T><T size={64} color={RED}>-45&nbsp;€</T>
    </Card>
    <P1 x={540} y={700} w={420} expr="shock" shake={3} />
    <Caption y={1190} size={54} delay={10}>Le rendu, c'est <Y c={RED}>demain 8 h</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const Colonne: React.FC<{x: number; letter: string; titre: string; a: number; b: number; col: string; delay: number}> = (
  {x, letter, titre, a, b, col, delay},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: 430, width: 430, height: 430, borderRadius: 30, boxSizing: 'border-box',
    background: 'rgba(10,14,44,0.94)', border: `6px solid ${col}`, boxShadow: `0 0 26px ${col}77`, textAlign: 'center', paddingTop: 26}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 60, color: col}}>{letter}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 38, color: 'white'}}>{titre}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: col, marginTop: 26, letterSpacing: 2}}>IL TE RESTE</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: 'white', lineHeight: 1.05}}>
      <Roll a={a} b={b} f0={delay + 8} f1={delay + 30} />
    </div>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: YEL, marginTop: 12}}>
      {eur(b / 12)}<span style={{color: GREY}}>/jour</span></div>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color: GREY, marginTop: 6}}>12 jours restants</div>
  </Pop>
);

const Compare: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="JOUR 20 · RÉSULTAT" col={YEL} fg={NAVY} size={44} />
    <Txt y={250} size={58}>Après le chargeur :</Txt>
    <Colonne x={70} letter="A" titre="train" a={157} b={112} col={CYAN} delay={2} />
    <Colonne x={580} letter="B" titre="covoit" a={182} b={137} col={MAG} delay={8} />
    <Caption y={950} size={54} delay={30}>B garde <Y>2,09 € de plus</Y><br />par jour.</Caption>
    <Caption y={1130} size={46} delay={40} color={YEL}>A tient aussi… mais au riz.</Caption>
    <Brand />
  </SceneIn>
);

const Vraie: React.FC = () => (
  <SceneIn>
    <MoodBg col={GREEN} dark={0.62} />
    <Pill txt="LA VRAIE FIN" col={GREEN} fg={NAVY} size={46} />
    <Txt y={260} size={58}>A ou B, tu tiens<br />jusqu'au 31 parce que<br />tu savais <Y>dès le jour 1</Y> :</Txt>
    <Pop delay={10} style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center'}}>
      <span style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 130, color: 'white', textShadow: `0 0 40px ${GREEN}`}}>
        {eur(320 / 31)}</span>
      <span style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 56, color: GREY}}> /jour</span>
    </Pop>
    <P1 x={540} y={780} w={360} expr="cool" />
    <Caption y={1200} size={50} delay={18}>Le chiffre compte <Y>plus que le choix</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <ChambreBg tint={0.25} />
    <Caption y={180} size={70}>Après les deux fins :<br /><Y>A ou B</Y> ?</Caption>
    <Caption y={400} size={48}>Envoie ça à ton <Y c={GREEN}>pote étudiant</Y>.</Caption>
    <P1 x={540} y={520} w={420} expr="happy" wave />
    <EndLogo y={1080} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 2.8, 2.8, 2.8, 3.0, 2.6, 2.0];

export const SurvieEtudiant2: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />,
        <Fin letter="A" titre="TRAIN" b={157} col={CYAN} expr="happy" sub={<>Train · <Y>-55 €</Y> · départ 14 h</> as any}
          line={'Confort. Mais 8,72\u00a0€ par jour…'} />,
        <Fin letter="B" titre="COVOIT" b={182} col={MAG} expr="worry" sub={<>Covoit · <Y>-30 €</Y> · départ 5 h</> as any}
          line={'Réveil à 4\u00a0h\u00a020… mais 10,11\u00a0€ par jour.'} />,
        <Imprevu />, <Compare />, <Vraie />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Black Friday, vraie ou fausse promo ? ===============================
const PILL_B = 'BLACK FRIDAY · VENDREDI 27';
const ENVOIE_B = 'Envoie ça au pote qui achète tout dès que c\'est -50\u00a0%.';

type Prod = {produit: string; avant: number; apres: number; pct: number};
const P: Prod[] = [
  {produit: 'Casque', avant: 120, apres: 60, pct: 50},
  {produit: 'Baskets', avant: 90, apres: 63, pct: 30},
  {produit: 'Aspirateur', avant: 199, apres: 149, pct: 25},
];
const CASQUE = [...Array(20).fill(120), ...Array(10).fill(65), 60];
const BASKETS = [...Array(30).fill(90), 63];
const ASPI = [...Array(25).fill(149), ...Array(5).fill(199), 149];
const VERDICTS: ('vraie' | 'fausse')[] = ['fausse', 'vraie', 'fausse'];

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <VitrineBg />
      <Pill txt={PILL_B} col={MAG} size={42} />
      <Txt y={240} size={76}>Vraie ou <Y c={RED}>fausse</Y> promo&nbsp;?</Txt>
      <Txt y={350} size={46}>3 étiquettes. <Y>La n°3 est un piège.</Y></Txt>
      {P.map((p, i) => (
        <Etiquette key={i} x={50 + i * 320} y={490} w={280} num={i + 1} {...p} rot={[-5, 2, -2][i]} />
      ))}
      <Caption y={820} size={52}>Trouve les fausses<br /><Y>avant la courbe</Y>.</Caption>
      <Caption y={990} size={40} color={YEL}>{ENVOIE_B}</Caption>
      <Note y={1200}>Produits et prix d'exemple</Note>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Regle: React.FC = () => (
  <SceneIn>
    <VitrineBg tint={0.45} />
    <Pill txt="LA RÈGLE" col={GREEN} fg={NAVY} size={46} />
    <Txt y={260} size={60}>Le prix barré doit être<br />le <Y>prix le plus bas</Y><br />des <Y>30 jours</Y> avant la promo.</Txt>
    <Decouvert x={540} y={620} w={360} expr="angry" label="-50 %" />
    <Caption y={1060} size={52} delay={14}>Sinon, la réduction<br />est <Y c={RED}>gonflée</Y>.</Caption>
    <Note y={1270}>Règle du prix de référence · d'après Que Choisir</Note>
    <Brand />
  </SceneIn>
);

const Decompte: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const n = f < 12 ? null : f < 24 ? 3 : f < 36 ? 2 : 1;
  if (n === null) return null;
  const k = interpolate((f - 12) % 12, [0, 4, 12], [1.4, 1, 0.95], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${k})`, fontFamily: 'Inter',
      fontWeight: 900, fontSize: 150, color: YEL, textShadow: `0 0 40px ${YEL}88, 0 8px 0 rgba(0,0,0,0.5)`}}>{n}</div>
  );
};

const Question: React.FC<{i: number; teaser?: boolean}> = ({i, teaser}) => (
  <SceneIn>
    <VitrineBg tint={0.25} />
    <Pill txt={`ÉTIQUETTE ${i + 1}/3`} col={teaser ? RED : MAG} size={46} />
    {teaser ? <Txt y={250} size={54}>Le <Y c={RED}>piège</Y>…</Txt> : null}
    <Etiquette x={300} y={teaser ? 360 : 310} w={480} {...P[i]} rot={-3} />
    <Caption y={1000} size={64}>Vraie ou <Y c={RED}>fausse</Y> ?</Caption>
    <Decompte y={1100} />
    <Brand />
  </SceneIn>
);

const Reponse: React.FC<{i: number; prices: number[]; lowLabel: string; children: React.ReactNode; verdictLine: React.ReactNode}> = (
  {i, prices, lowLabel, children, verdictLine},
) => (
  <SceneIn>
    <VitrineBg tint={0.5} />
    <Pill txt={`ÉTIQUETTE ${i + 1}/3 · LA COURBE`} col={CYAN} fg={NAVY} size={40} />
    <Etiquette x={70} y={260} w={300} {...P[i]} rot={-4} verdict={VERDICTS[i]} at={44} />
    <div style={{position: 'absolute', left: 420, right: 70, top: 300, textAlign: 'center'}}>{children}</div>
    <CourbePrix prices={prices} y={690} f0={4} f1={30} lowAt={32} lowLabel={lowLabel} />
    <Caption y={1210} size={50} delay={46}>{verdictLine}</Caption>
    <Brand />
  </SceneIn>
);

const Big: React.FC<{c?: string; s?: number; children: React.ReactNode}> = ({c = 'white', s = 52, children}) => (
  <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: s, color: c, lineHeight: 1.15}}>{children}</div>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <VitrineBg tint={0.3} />
    <Caption y={170} size={68}>T'en as eu combien<br /><Y>sur 3</Y> ?</Caption>
    <Caption y={380} size={44} color={YEL}>Réponds avec un chiffre.</Caption>
    {P.map((p, i) => (
      <Etiquette key={i} x={90 + i * 310} y={520} w={250} num={i + 1} {...p} rot={[-5, 2, -2][i]} verdict={VERDICTS[i]} at={6 + i * 5} />
    ))}
    <Caption y={890} size={38}>{ENVOIE_B}</Caption>
    <EndLogo y={1080} note="Produits et prix d'exemple" />
  </SceneIn>
);

export const B_DURATIONS = [3.0, 2.6, 2.0, 2.8, 1.8, 2.4, 2.2, 3.0, 2.2];

export const BlackFridayVraieFausse: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />, <Regle />,
        <Question i={0} />,
        <Reponse i={0} prices={CASQUE} lowLabel="Le plus bas sur 30 jours : 65 €"
          verdictLine={<>Prix barré <Y c={RED}>pas le bon</Y>.</>}>
          <Big>Annoncé :</Big><Big c={RED} s={64}>-50 %</Big><Big>Réel :</Big><Big c={YEL} s={64}>-8 %</Big>
        </Reponse>,
        <Question i={1} />,
        <Reponse i={1} prices={BASKETS} lowLabel="Le plus bas sur 30 jours : 90 €"
          verdictLine={<>Celle-là est <Y c={GREEN}>vraie</Y>.</>}>
          <Big>Annoncé :</Big><Big c={RED} s={64}>-30 %</Big><Big>Réel :</Big><Big c={GREEN} s={64}>-30 %</Big>
        </Reponse>,
        <Question i={2} teaser />,
        <Reponse i={2} prices={ASPI} lowLabel="Le plus bas sur 30 jours : 149 €"
          verdictLine={<>Monté à 199 € <Y c={RED}>5 jours avant</Y>.<br />Réduction réelle : <Y>0 €</Y>.</>}>
          <Big>Annoncé :</Big><Big c={RED} s={64}>-25 %</Big><Big>Réel :</Big><Big c={YEL} s={64}>0 %</Big>
        </Reponse>,
        <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
