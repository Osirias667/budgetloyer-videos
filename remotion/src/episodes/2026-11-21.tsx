// 21 nov. 2026 · A : « Marché de Noël · Devine le total » (« on passe juste 5 minutes », total qui monte) ;
// B : « Samedi soir · Je sors pas » (refus puis capitulation, horloge, total révélé à la fin, boucle dimanche).
// Découpage (secondes), musique, faits et sources : episodes/2026-11-21.py.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {MarcheNoelBg, MoodBg, SoireeBg} from '../bl/decors';
import {P1, Sam} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL} from '../bl/theme';
import {Brand, Bulle, Caption, Card, EndLogo, Horloge, Pill, Stamp, T, Total, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : Marché de Noël · Devine le total ===============================
const PILL_A = 'MARCHÉ DE NOËL · DEVINE LE TOTAL';
const NOTE_A = "Prix d'exemple, dans les fourchettes de marches-de-noel.fr";

const Duo: React.FC<{y?: number; w?: number; x1?: number; x2?: number; e1?: any; e2?: any; t1?: boolean; t2?: boolean; delay?: number}> = (
  {y = 760, w = 340, x1 = 300, x2 = 760, e1 = 'happy', e2 = 'happy', t1, t2, delay = 0},
) => (
  <>
    <P1 x={x1} y={y} w={w} expr={e1} talk={t1} look={1} delay={delay} />
    <Sam x={x2} y={y} w={w} expr={e2} talk={t2} look={-1} delay={delay + 3} />
  </>
);

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <MarcheNoelBg tint={0.45} />
      <Pill txt={PILL_A} col={RED} />
      <Txt y={240} size={84}>« On passe juste<br /><Y>5 minutes</Y>. »</Txt>
      <Txt y={460} size={60}>Marché de Noël, à deux.<br />Devine le total.</Txt>
      <Horloge h="18:00" jour="SAMEDI" x={50} y={680} />
      <P1 x={600} y={650} w={300} expr="happy" talk look={1} />
      <Sam x={870} y={650} w={300} expr="happy" look={-1} />
      <Caption y={1000} size={44} color={YEL}>Envoie ça à la personne qui dit<br />« juste 5 minutes ».</Caption>
      <Total a={0} b={0} unknown y={1150} />
      <Note y={1365}>Prix d'exemple · réponds avec un nombre</Note>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

type Achat = {h: string; titre: string; detail: React.ReactNode; a: number; b: number; e1?: any; e2?: any; col: string};

const Etape: React.FC<Achat> = ({h, titre, detail, a, b, e1 = 'happy', e2 = 'happy', col}) => (
  <SceneIn>
    <MarcheNoelBg tint={0.5} />
    <Pill txt={PILL_A} col={RED} size={34} />
    <Horloge h={h} x={350} y={230} col={col} />
    <Txt y={440} size={70} delay={2}>{titre}</Txt>
    <Card x={90} y={560} w={900} h={130} col={col} delay={6}>{detail}</Card>
    <Duo y={740} w={330} e1={e1} e2={e2} t2 delay={3} />
    <Total a={a} b={b} y={1150} f0={12} f1={34} />
    <Brand />
  </SceneIn>
);

const Gobelets: React.FC = () => (
  <SceneIn>
    <MarcheNoelBg tint={0.55} />
    <Pill txt="19:35 · LA SORTIE" col={CYAN} fg={NAVY} />
    <Txt y={250} size={68}>Et les gobelets consignés,<br />on les rend ?</Txt>
    <Bulle x={560} y={470} w={460} size={46} tail={0.6} delay={8}>Ils sont trop mignons…<br />on les garde.</Bulle>
    <Duo y={720} w={340} e1="worry" e2="happy" t2 />
    <Card x={90} y={1150} w={900} h={150} col={RED} delay={18}>
      <T size={44}>Consigne pas rendue</T><T size={56} color={RED}>4 € partis</T>
    </Card>
    <Brand />
  </SceneIn>
);

const Reponse: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="LA RÉPONSE" col={YEL} fg={NAVY} />
    <Txt y={250} size={74}>« Juste 5 minutes »<br />=&nbsp;<Y>1 h 35</Y> et…</Txt>
    <Total a={0} b={57} y={480} f0={4} f1={26} />
    <Txt y={710} size={42} weight={700} delay={20}>Avec les gobelets rendus : 53 €.</Txt>
    <Bulle x={80} y={800} w={560} size={44} tail={0.75} delay={26}>On repasse demain ?<br />Juste 5 minutes.</Bulle>
    <Duo y={960} w={300} x1={330} x2={790} e1="shock" e2="happy" t2 />
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <MarcheNoelBg tint={0.55} />
    <Caption y={190} size={72}>Ton total à toi,<br />c'était combien ?</Caption>
    <Caption y={390} size={56} color={YEL} delay={2}>Réponds avec un nombre.</Caption>
    <Caption y={500} size={44} delay={4}>Envoie ça à la personne<br />qui dit « juste 5 minutes ».</Caption>
    <Duo y={700} w={300} e1="happy" e2="happy" />
    <EndLogo y={1150} note={NOTE_A} />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 2.6, 2.6, 2.6, 2.4, 2.8, 2.8, 2.0];

export const MarcheNoelTotal: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />,
        <Etape h="18:05" titre="2 vins chauds" col={RED} a={0} b={12}
          detail={<><T size={44}>2 × 4 € + gobelets 2 × 2 €</T><T size={56} color={YEL}>12 €</T></>} />,
        <Etape h="18:25" titre="2 cônes raclette" col={YEL} a={12} b={30}
          detail={<><T size={48}>2 × 9 €</T><T size={56} color={YEL}>+18 €</T></>} />,
        <Etape h="18:50" titre="La grande roue" col={CYAN} a={30} b={46}
          detail={<><T size={44}>« Juste un tour » · 2 × 8 €</T><T size={56} color={YEL}>+16 €</T></>} />,
        <Etape h="19:20" titre="Du pain d'épices" col={GREEN} a={46} b={57} e1="worry"
          detail={<><T size={44}>« C'est pour mamie »</T><T size={56} color={YEL}>+11 €</T></>} />,
        <Gobelets />, <Reponse />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Samedi soir · Je sors pas ===============================
const PILL_B = 'SAMEDI SOIR';
const ENVOIE_B = <>Envoie ça au pote<br />qui « sort pas ce soir ».</>;

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <SoireeBg tint={0.35} sign={false} />
      <Pill txt={PILL_B} col={MAG} />
      <Txt y={240} size={96}>« Ce soir,<br /><Y>je sors pas</Y>. »</Txt>
      <Horloge h="19:00" jour="SAMEDI" x={60} y={520} col={MAG} />
      <P1 x={760} y={500} w={400} expr="cool" look={-1} />
      <Txt y={960} size={60}>Combien coûte une soirée<br />« je sors pas » ?</Txt>
      <Total a={0} b={0} unknown label="SOIRÉE" y={1120} col={MAG} />
      <Caption y={1335} size={40} color={YEL}>Envoie ça au pote qui « sort pas ce soir ».</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

type Moment = {h: string; msg: React.ReactNode; rep: React.ReactNode; expr: any; a: number; b: number; ligne?: React.ReactNode};

const Instantane: React.FC<Moment> = ({h, msg, rep, expr, a, b, ligne}) => (
  <SceneIn>
    <SoireeBg tint={0.4} />
    <Pill txt={PILL_B} col={MAG} size={34} />
    <Horloge h={h} x={350} y={230} col={MAG} />
    <Bulle x={60} y={460} w={660} size={48} tail={0.8}>{msg}</Bulle>
    <P1 x={760} y={600} w={380} expr={expr} talk look={-1} delay={2} />
    <Pop delay={10} style={{position: 'absolute', left: 60, top: 720, width: 520}}>
      <div style={{background: MAG, borderRadius: 30, padding: '20px 26px', border: '7px solid #16121F', textAlign: 'center',
        fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: 'white', boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>{rep}</div>
    </Pop>
    {ligne ? <Txt y={1000} size={44} weight={700} delay={16}>{ligne}</Txt> : null}
    <Total a={a} b={b} label="SOIRÉE" y={1120} col={MAG} f0={14} f1={34} />
    <Brand />
  </SceneIn>
);

const BReponse: React.FC = () => (
  <SceneIn>
    <MoodBg col={MAG} dark={0.6} />
    <Pill txt="LA RÉPONSE" col={YEL} fg={NAVY} />
    <Txt y={250} size={70}>Une soirée<br />« je sors pas » :</Txt>
    <Total a={0} b={66} label="TOTAL" y={470} col={YEL} f0={2} f1={22} />
    <div style={{position: 'absolute', top: 700, left: 120, right: 120}}>
      {([['1 verre', '7 €'], ['La tournée', '28 €'], ['Le kebab', '9 €'], ['Le taxi', '22 €']] as const).map(([l, v], i) => (
        <Pop key={l} delay={8 + i * 4} style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter',
          fontWeight: 800, fontSize: 48, color: 'white', marginBottom: 14}}>
          <span>{l}</span><span style={{color: YEL}}>{v}</span>
        </Pop>
      ))}
    </div>
    <Stamp txt="CRAQUÉ À 20 H 58" y={1080} delay={26} col={RED} size={70} />
    <Brand />
  </SceneIn>
);

const Dimanche: React.FC = () => (
  <SceneIn>
    <SoireeBg dawn tint={0.2} />
    <Pill txt="LE LENDEMAIN" col={CYAN} fg={NAVY} />
    <Horloge h="11:00" jour="DIMANCHE" x={350} y={240} col={CYAN} />
    <P1 x={540} y={560} w={420} expr="sad" talk />
    <Caption y={1050} size={84}>« Ce soir,<br /><Y>je sors pas</Y>. »</Caption>
    <Brand />
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <SoireeBg tint={0.5} sign={false} />
    <Caption y={190} size={72}>Et toi, tu craques<br />à quelle heure ?</Caption>
    <Caption y={390} size={56} color={YEL} delay={2}>Réponds avec l'heure.</Caption>
    <Caption y={500} size={44} delay={4}>{ENVOIE_B}</Caption>
    <P1 x={540} y={680} w={330} expr="happy" />
    <EndLogo y={1150} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const B_DURATIONS = [2.8, 2.2, 2.6, 2.4, 2.2, 2.4, 2.6, 2.4, 2.0];

export const SamediJeSorsPas: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />,
        <Instantane h="19:47" msg={<>« Juste UN verre ? »</>} rep="Non." expr="angry" a={0} b={0} />,
        <Instantane h="20:58" msg={<>«&nbsp;C'est mon anniv…&nbsp;»</>} rep="…Bon. UN verre." expr="worry" a={0} b={7} />,
        <Instantane h="22:30" msg={<>«&nbsp;On remet ça&nbsp;?&nbsp;»</>} rep={<>C'est ma tournée&nbsp;!</>} expr="happy" a={7} b={35}
          ligne="4 verres × 7 €" />,
        <Instantane h="00:40" msg={<>« Kebab ? »</>} rep="…Évidemment." expr="cool" a={35} b={44} />,
        <Instantane h="02:15" msg={<>« Plus de bus. »</>} rep="Taxi." expr="sad" a={44} b={66} />,
        <BReponse />, <Dimanche />, <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
