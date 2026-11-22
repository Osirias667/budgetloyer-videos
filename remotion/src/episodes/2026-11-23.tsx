// 23 nov. 2026 · A : « POV : tu es Monsieur Découvert » (format inédit : POV du méchant, 4 pièges numérotés, n°4 caché,
// retournement « …sauf que ») ; B : « Survie · Étudiant · Épisode 1/2 » (4e saison de Survie, choix A/B laissé au public).
// Découpage (secondes), musique, calculs et sources : episodes/2026-11-23.py.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Instant, SceneIn, Scenes, useFonts} from '../bl/anim';
import {ChambreBg, MoodBg, PlanBg} from '../bl/decors';
import {Compte, Decouvert, P1} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL, eur} from '../bl/theme';
import {Brand, Bulle, Caption, Card, CarteRare, Check, EndLogo, HudSurvie, Option, Pill, Stamp, T, Total, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : POV, tu es Monsieur Découvert ===============================
const PILL_A = 'POV : TU ES MONSIEUR DÉCOUVERT';
const ENVOIE_A = 'Envoie ça au pote qui n\'ouvre jamais son appli bancaire.';

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <PlanBg />
      <Pill txt={PILL_A} col={RED} size={40} />
      <Txt y={240} size={74}>J-8 avant la paie.<br />Mon plan en <Y>4 pièges</Y><br />pour vider ton compte.</Txt>
      <Decouvert x={340} y={590} w={470} expr="cool" label="J-8" />
      <Compte x={790} y={720} w={290} expr="worry" label="214 €" look={-1} />
      <Caption y={1110} size={54}>Le n°4 marche <Y>à tous les coups</Y>.</Caption>
      <Caption y={1215} size={40} color={YEL}>{ENVOIE_A}</Caption>
      <Note y={1340}>Montants d'exemple · histoire inventée</Note>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Piege: React.FC<{n: number; titre: string; lab: string; amt: number; a: number; line: string; expr: any}> = (
  {n, titre, lab, amt, a, line, expr},
) => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <PlanBg tint={0.15} />
      <Pill txt={`PIÈGE N°${n}`} col={RED} size={46} />
      <Txt y={250} size={70}>{titre}</Txt>
      <Card x={130} y={400} w={820} h={120} col={RED} delay={3}>
        <T size={lab.length > 18 ? 40 : 46}>{lab}</T><T size={58} color={RED}>-{eur(amt, 0)}</T>
      </Card>
      <Bulle x={70} y={570} w={620} size={46} tail={0.32} delay={10}>{line}</Bulle>
      <Decouvert x={320} y={790} w={430} expr="happy" talk={f > 10 && f < 62} label={`-${eur(amt, 0)}`} />
      <Compte x={790} y={860} w={270} expr={expr} label={eur(a - amt, 0)} look={-1} shake={f > 24 ? 2 : 0} />
      <Total a={a} b={a - amt} label="TON COMPTE" y={1215} col={RED} f0={22} f1={42} />
    </SceneIn>
  );
};

const Teaser: React.FC = () => (
  <SceneIn>
    <PlanBg tint={0.2} />
    <Pill txt="PIÈGE N°4 · MON PRÉFÉRÉ" col={MAG} size={44} />
    <Txt y={250} size={68}>Celui-là, <Y>personne</Y><br />ne le voit venir.</Txt>
    <CarteRare x={310} y={470} w={460} h={600} col={MAG} rarity="N°4" shake={7} />
    <Decouvert x={540} y={1090} w={300} expr="cool" label="J-8" talk />
    <Brand />
  </SceneIn>
);

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <MoodBg col={MAG} dark={0.62} />
      <Pill txt="PIÈGE N°4" col={MAG} size={46} />
      <Txt y={250} size={72}>Que tu ne regardes <Y>jamais</Y><br />ce qu'il te reste.</Txt>
      <Stamp txt="PAS VU, PAS PRIS" y={500} delay={8} size={70} col={RED} />
      <Decouvert x={330} y={720} w={460} expr="happy" talk={f > 14 && f < 70} label="J-8" />
      <Compte x={790} y={800} w={280} expr="shock" label="???" look={-1} shake={3} />
      <Caption y={1230} size={52}>Ton compte ? <Y c={RED}>Aucune idée.</Y></Caption>
      <Brand />
    </SceneIn>
  );
};

const Sauf: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <MoodBg col={GREEN} dark={0.66} />
      <Pill txt="…SAUF QUE" col={GREEN} fg={NAVY} size={48} />
      <Txt y={250} size={74}>Cette fois, <Y c={GREEN}>tu regardes</Y>.</Txt>
      <Card x={110} y={400} w={860} h={140} col={GREEN} delay={4}>
        <T size={46}>214 € pour 8 jours</T><T size={56} color={GREEN}>26,75 €/j</T>
      </Card>
      <Card x={110} y={570} w={860} h={120} col={GREEN} delay={12}>
        <T size={46}>Abonnement oublié</T><span style={{display: 'flex', alignItems: 'center', gap: 14}}><T size={44} color={GREEN}>coupé</T><Check size={60} /></span>
      </Card>
      <P1 x={320} y={760} w={420} expr="cool" />
      <Decouvert x={790} y={900} w={290} expr="shock" label="J-8" shake={f > 18 ? 6 : 0} talk={f > 20} />
      <Caption y={1240} size={64} color={RED} delay={20}>« NOOON ! »</Caption>
      <Brand />
    </SceneIn>
  );
};

const AEnd: React.FC = () => (
  <SceneIn>
    <PlanBg tint={0.25} />
    <Caption y={180} size={74}>Lequel <Y>t'a déjà eu</Y> ?</Caption>
    <Caption y={290} size={56} color={YEL}>Réponds 1, 2, 3 ou 4.</Caption>
    <Caption y={410} size={44}>{ENVOIE_A}</Caption>
    <Bulle x={440} y={560} w={560} size={44} tail={0.12}>J-8… je reviens le mois prochain.</Bulle>
    <Decouvert x={280} y={800} w={330} expr="angry" label="J-8" talk />
    <EndLogo y={1180} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 2.6, 2.6, 2.6, 2.2, 2.6, 3.0, 2.2];

export const PovDecouvert: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />,
        <Piege n={1} titre="L'abonnement oublié" lab="Essai gratuit terminé" amt={13} a={214} line="Il ne lit jamais ses mails." expr="worry" />,
        <Piege n={2} titre={'« C\'est que 3 € »'} lab="3 € par jour × 8 jours" amt={24} a={201} line="Petit. Discret. Tous les jours." expr="worry" />,
        <Piege n={3} titre="La livraison du dimanche" lab="Dimanche soir, canapé" amt={27} a={177} line="Le canapé est mon meilleur allié." expr="sad" />,
        <Teaser />, <Reveal />, <Sauf />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Survie · Étudiant · Épisode 1/2 ===============================
const PILL_B = 'SURVIE · ÉTUDIANT · ÉPISODE 1/2';

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <ChambreBg />
      <Pill txt={PILL_B} col={GREEN} fg={NAVY} size={40} />
      <Txt y={235} size={68}>Budget étudiant :<br />après le loyer, il te reste</Txt>
      <HudSurvie a={320} b={320} jours={31} parJour={320 / 31} y={430} />
      <P1 x={540} y={700} w={400} expr="worry" />
      <Note y={640}>Montants d'exemple · histoire inventée</Note>
      <Caption y={1150} size={50}>Tu tiens <Y>jusqu'au 31 décembre</Y> ?</Caption>
      <Caption y={1245} size={44} color={YEL}>Envoie ça à ton pote étudiant.</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

type Opt = {title: string; sub: string};
const Jour: React.FC<{day: string; lab: string; a: number; b: number; jours: number; A: Opt; B: Opt; pick: 'A' | 'B'; expr: any; line: string}> = (
  {day, lab, a, b, jours, A, B, pick, expr, line},
) => (
  <SceneIn>
    <ChambreBg tint={0.2} />
    <Pill txt={PILL_B} col={GREEN} fg={NAVY} size={34} />
    <HudSurvie a={a} b={b} jours={jours} parJour={b / jours} y={240} />
    <Txt y={470} size={54}><Y>{day}</Y> · {lab}</Txt>
    <Option x={80} y={570} w={440} h={240} letter="A" title={A.title} sub={A.sub} col={CYAN} state={pick === 'A' ? 'pick' : 'off'} at={24} delay={2} />
    <Option x={560} y={570} w={440} h={240} letter="B" title={B.title} sub={B.sub} col={MAG} state={pick === 'B' ? 'pick' : 'off'} at={24} delay={6} />
    <P1 x={300} y={880} w={360} expr={expr} talk />
    <Bulle x={470} y={930} w={480} size={42} tail={0.15} delay={30}>{line}</Bulle>
    <Brand />
  </SceneIn>
);

const Imprevu: React.FC = () => (
  <SceneIn>
    <ChambreBg tint={0.3} />
    <Pill txt="JOUR 12 · PAS LE CHOIX" col={RED} size={40} />
    <HudSurvie a={272} b={212} jours={20} parJour={212 / 20} y={240} col={RED} />
    <Card x={130} y={490} w={820} h={130} col={RED} delay={2}>
      <T size={46}>Courses, 2 semaines</T><T size={58} color={RED}>-60&nbsp;€</T>
    </Card>
    <P1 x={540} y={700} w={430} expr="sad" shake={2} />
    <Caption y={1200} size={56}>Le frigo était <Y c={RED}>vide</Y>.</Caption>
    <Brand />
  </SceneIn>
);

const BChoix: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Pill txt="JOUR 14 · TON CHOIX" col={YEL} fg={NAVY} size={44} />
    <HudSurvie a={212} b={212} jours={18} parJour={212 / 18} y={240} col={YEL} />
    <Txt y={470} size={58}>Rentrer pour <Y>Noël</Y> :</Txt>
    <Option x={80} y={580} w={440} h={270} letter="A" title="Train · 55 €" sub="confort, départ à 14 h" col={CYAN} delay={4} />
    <Option x={560} y={580} w={440} h={270} letter="B" title="Covoit · 30 €" sub={'départ à 5 h du mat\''} col={MAG} delay={10} />
    <P1 x={540} y={900} w={330} expr="worry" />
    <Caption y={1260} size={60} delay={18}>Tu prends <Y>A ou B</Y> ?</Caption>
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <ChambreBg tint={0.25} />
    <Caption y={180} size={78}>Réponds <Y>A ou B</Y>.</Caption>
    <Caption y={300} size={50} color={YEL}>Épisode 2 demain : les deux fins.</Caption>
    <Caption y={450} size={52}>Envoie ça à ton <Y c={GREEN}>pote étudiant</Y>.</Caption>
    <P1 x={540} y={580} w={400} expr="happy" wave />
    <EndLogo y={1080} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const B_DURATIONS = [2.8, 2.6, 2.4, 2.6, 2.4, 3.4, 2.2];

export const SurvieEtudiant1: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />,
        <Jour day="JOUR 3" lab="le manuel du partiel" a={320} b={305} jours={29} A={{title: 'Neuf', sub: '45 €'}}
          B={{title: 'Occasion', sub: '15 €'}} pick="B" expr="cool" line="Stabilo déjà inclus." />,
        <Jour day="JOUR 6" lab="raclette chez ta coloc" a={305} b={297} jours={26} A={{title: 'J\'y vais', sub: 'ta part : 8 €'}}
          B={{title: 'Je révise', sub: '0 €'}} pick="A" expr="happy" line="Le fromage, c'est révisé." />,
        <Jour day="JOUR 9" lab="soirée de fin de partiels" a={297} b={272} jours={23} A={{title: 'Grosse soirée', sub: '25 €'}}
          B={{title: 'Soirée pâtes', sub: '5 €'}} pick="A" expr="happy" line="On ne fête ça qu'une fois !" />,
        <Imprevu />, <BChoix />, <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
