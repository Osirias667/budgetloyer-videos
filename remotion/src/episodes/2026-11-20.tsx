// 20 nov. 2026 · A : « Survie · À deux · Épisode 2/2 » (suite promise le 19 nov.) ;
// B : « Secret Santa · Le tirage » (format inédit : ouverture de cartes à rareté).
// Découpage (secondes), musique, faits et sources : episodes/2026-11-20.py.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {BureauBg, DarkBg, MoodBg} from '../bl/decors';
import {Collegue, P1, Sam} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL, eur} from '../bl/theme';
import {Brand, Caption, Card, CarteRare, EndLogo, Gauge, Pill, Roll, Stamp, T, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : Survie · À deux · Épisode 2/2 ===============================
const PILL_A = 'SURVIE · À DEUX · ÉPISODE 2/2';

const Duo: React.FC<{y?: number; w?: number; e1?: any; e2?: any; t1?: boolean; t2?: boolean; shake?: number; delay?: number}> = (
  {y = 880, w = 420, e1 = 'neutral', e2 = 'neutral', t1, t2, shake = 0, delay = 0},
) => (
  <>
    <P1 x={290} y={y} w={w} expr={e1} talk={t1} look={1} delay={delay} shake={shake} />
    <Sam x={780} y={y} w={w} expr={e2} talk={t2} look={-1} delay={delay + 3} shake={shake} />
  </>
);

/** Compteur « il reste à … » (élément de jeu, pas un écran de l'app). */
const Reste: React.FC<{x: number; who: string; a: number; b: number; col: string; y?: number; delay?: number}> = (
  {x, who, a, b, col, y = 420, delay = 0},
) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: y, width: 430, height: 230, borderRadius: 28,
    background: 'rgba(10,14,44,0.92)', border: `6px solid ${col}`, boxShadow: `0 0 26px ${col}88`, textAlign: 'center',
    boxSizing: 'border-box', paddingTop: 22}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 36, color: col, letterSpacing: 1}}>IL RESTE À {who}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: 'white', lineHeight: 1.25}}>
      <Roll a={a} b={b} f0={delay + 8} f1={delay + 32} />
    </div>
  </Pop>
);

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <MoodBg col={VIOLET} dark={0.55} />
      <Pill txt={PILL_A} col={GREEN} fg={NAVY} />
      <Txt y={250} size={80}>50/50 ou selon les salaires ?<br /><Y>Voici les deux fins.</Y></Txt>
      <Duo y={540} w={430} e1="happy" e2="worry" />
      <Txt y={1070} size={54}>Toi : <Y>1&nbsp;900&nbsp;€</Y> · Sam : <Y>1&nbsp;300&nbsp;€</Y></Txt>
      <Txt y={1150} size={48} weight={700}>Pot commun : 1&nbsp;300&nbsp;€ par mois</Txt>
      <Caption y={1240} size={42} color={YEL}>À envoyer à la personne avec qui tu vis.</Caption>
      <Note y={1320}>Montants d'exemple · histoire inventée</Note>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Fin: React.FC<{tag: string; col: string; line: React.ReactNode; t1: number; t2: number; e1: any; e2: any}> = (
  {tag, col, line, t1, t2, e1, e2},
) => (
  <SceneIn>
    <MoodBg col={col === GREEN ? VIOLET : MAG} dark={0.65} />
    <Pill txt={tag} col={col} fg={NAVY} />
    <Txt y={260} size={64}>{line}</Txt>
    <Reste x={80} who="TOI" a={1900} b={t1} col={col} />
    <Reste x={570} who="SAM" a={1300} b={t2} col={col} delay={6} />
    <Duo y={760} w={420} e1={e1} e2={e2} delay={4} />
    <Brand />
  </SceneIn>
);

const Imprevu: React.FC = () => (
  <SceneIn>
    <MoodBg col={RED} dark={0.6} />
    <Pill txt="JOUR 20 · IMPRÉVU" col={RED} />
    <Card x={110} y={270} w={860} h={150} col={RED} delay={2}>
      <T size={52}>Lave-linge en panne</T><T size={64} color={RED}>+160 €</T>
    </Card>
    <Txt y={470} size={56} delay={10}>Même panne dans <Y>les deux fins</Y>.</Txt>
    <Txt y={570} size={42} weight={700} delay={14}>Payée par le pot commun, avec la règle choisie.</Txt>
    <Duo y={720} w={460} e1="shock" e2="shock" shake={5} />
    <Brand />
  </SceneIn>
);

const Col: React.FC<{x: number; tag: string; col: string; toi: number; sam: number; delay: number}> = ({x, tag, col, toi, sam, delay}) => (
  <Pop delay={delay} style={{position: 'absolute', left: x, top: 270, width: 440, height: 470, borderRadius: 30,
    background: 'rgba(10,14,44,0.92)', border: `6px solid ${col}`, boxShadow: `0 0 26px ${col}88`, textAlign: 'center',
    boxSizing: 'border-box', paddingTop: 20}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: col}}>{tag}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: GREY, marginTop: 24}}>Toi</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: 'white'}}>{eur(toi, 0)}</div>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: GREY, marginTop: 12}}>Sam</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: 'white'}}>{eur(sam, 0)}</div>
  </Pop>
);

const Compare: React.FC = () => (
  <SceneIn>
    <DarkBg />
    <Pill txt="APRÈS LA PANNE · IL RESTE…" col={YEL} fg={NAVY} />
    <Col x={80} tag="A · 50/50" col={GREEN} toi={1170} sam={570} delay={2} />
    <Col x={560} tag="B · SALAIRES" col={MAG} toi={1033} sam={707} delay={8} />
    <Txt y={790} size={54} delay={18}>Écart entre vous :<br /><Y c={GREEN}>600 €</Y> en A · <Y c={MAG}>326 €</Y> en B</Txt>
    <Duo y={1010} w={330} e1="neutral" e2="worry" />
    <Brand />
  </SceneIn>
);

const Vraie: React.FC = () => (
  <SceneIn>
    <MoodBg col={CYAN} dark={0.65} />
    <Pill txt="LA VRAIE FIN" col={CYAN} fg={NAVY} />
    <Txt y={260} size={66}>Aucune règle n'est<br />«&nbsp;la bonne&nbsp;» pour tous.</Txt>
    <Txt y={520} size={66} delay={10}>La bonne, c'est celle<br />dont vous parlez<br /><Y>avant le jour 1</Y>.</Txt>
    <Duo y={860} w={440} e1="happy" e2="happy" t2 />
    <Brand />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Caption y={190} size={76}>Après les deux fins,<br />tu votes <Y>A ou B</Y> ?</Caption>
    <Caption y={440} size={52} delay={3}>Envoie ça à la personne<br />avec qui tu partages <Y c={GREEN}>le loyer</Y>.</Caption>
    <Duo y={680} w={330} e1="happy" e2="happy" t1 />
    <EndLogo y={1180} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 3.0, 3.0, 2.6, 3.4, 2.8, 2.0];

export const SurvieADeux2: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />,
        <Fin tag="FIN A · 50/50" col={GREEN} line={<>Chacun met <Y>650&nbsp;€</Y>.</>} t1={1250} t2={650} e1="happy" e2="worry" />,
        <Fin tag="FIN B · SELON LES SALAIRES" col={MAG} line={<>Toi <Y>772&nbsp;€</Y> · Sam <Y>528&nbsp;€</Y></>} t1={1128} t2={772} e1="neutral" e2="happy" />,
        <Imprevu />, <Compare />, <Vraie />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Secret Santa · Le tirage ===============================
const RAR: [string, string][] = [['COMMUN', '#B8C4D0'], ['RARE', CYAN], ['ÉPIQUE', MAG], ['LÉGENDAIRE', YEL]];
const ENVOIE_B = <>Envoie ça au collègue<br />qui organise le tirage.</>;

const Dos4: React.FC<{y: number; w?: number; shake?: number}> = ({y, w = 210, shake = 0}) => (
  <>
    {RAR.map(([r, c], i) => (
      <React.Fragment key={r}>
        <CarteRare x={70 + i * 240} y={y} w={w} h={w * 1.4} col={c} rarity={r} shake={i === 3 ? shake : 0} />
        <div style={{position: 'absolute', left: 70 + i * 240 - 20, top: y + w * 1.4 + 18, width: w + 40, textAlign: 'center',
          fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: c}}>{r}</div>
      </React.Fragment>
    ))}
  </>
);

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <BureauBg tint={0.5} />
      <Pill txt="SECRET SANTA · LE TIRAGE" col={RED} />
      <Txt y={240} size={68}>Secret Santa au bureau.<br />Budget : <Y>15&nbsp;€</Y>.<br />Tu as tiré qui ?</Txt>
      <Dos4 y={525} shake={3} />
      <Txt y={905} size={58}>La légendaire est <Y>la pire</Y>.</Txt>
      <Caption y={1000} size={46} color={YEL}>{ENVOIE_B}</Caption>
      <P1 x={680} y={1140} w={320} expr="worry" />
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

type Tirage = {n: number; who: string; idee: string; prix: number; perso: React.ReactNode; note?: string};

const Revele: React.FC<Tirage> = ({n, who, idee, prix, perso, note}) => {
  const [r, c] = RAR[n - 1];
  const ok = prix <= 15;
  return (
    <SceneIn>
      <BureauBg tint={0.35} />
      <Pill txt={`CARTE ${n}/4`} col={c} fg={NAVY} />
      <CarteRare x={230} y={240} w={620} h={700} col={c} rarity={r} flipAt={6}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 470}}>{perso}</div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 490, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
          fontSize: who.length > 24 ? 44 : 50, color: 'white', lineHeight: 1.15}}>{who}</div>
      </CarteRare>
      <Card x={110} y={970} w={860} h={120} col={ok ? GREEN : RED} delay={20}>
        <T size={idee.length > 20 ? 40 : 46}>{idee}</T><T size={54} color={ok ? GREEN : RED}>{eur(prix, 0)}</T>
      </Card>
      <Gauge level={Math.min(1, prix / 15)} col={ok ? GREEN : RED} y={1120} start={26}
        label={ok ? `BUDGET : ${prix} € / 15 € ✔` : `HORS BUDGET : +${prix - 15} €`} />
      {note ? <Txt y={1250} size={40} weight={700} delay={32}>{note}</Txt> : null}
      <Brand />
    </SceneIn>
  );
};

const Suspense: React.FC = () => (
  <SceneIn>
    <BureauBg tint={0.55} />
    <Pill txt="CARTE 4/4" col={YEL} fg={NAVY} />
    <CarteRare x={230} y={300} w={620} h={700} col={YEL} rarity="LÉGENDAIRE" shake={10} />
    <Txt y={1050} size={70}>Dernière carte…<br /><Y>légendaire</Y>.</Txt>
    <Brand />
  </SceneIn>
);

const Legendaire: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <MoodBg col={YEL} dark={0.6} />
      <Pill txt="CARTE 4/4" col={YEL} fg={NAVY} />
      <CarteRare x={230} y={240} w={620} h={700} col={YEL} rarity="LÉGENDAIRE" flipAt={0}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 470}}>
          <P1 x={310} y={30} w={370} expr="shock" shake={f < 30 ? 4 : 0} />
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 490, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
          fontSize: 54, color: 'white', lineHeight: 1.15}}>Toi.<br />Ton propre nom.</div>
      </CarteRare>
      <Stamp txt="RETIRAGE !" y={1000} delay={14} col={RED} size={96} />
      <Txt y={1200} size={46} weight={700} delay={24}>Et on remet les 4 cartes dans le bonnet…</Txt>
      <Brand />
    </SceneIn>
  );
};

const BEnd: React.FC = () => (
  <SceneIn>
    <BureauBg tint={0.55} />
    <Caption y={180} size={70}>Ton budget Secret Santa<br />cette année ?</Caption>
    <Caption y={370} size={56} color={YEL} delay={2}>Réponds avec un montant.</Caption>
    <Caption y={480} size={46} delay={4}>{ENVOIE_B}</Caption>
    <Dos4 y={680} w={190} />
    <EndLogo y={1180} note="Montants d'exemple · tirage inventé" />
  </SceneIn>
);

export const B_DURATIONS = [2.8, 2.8, 2.8, 3.2, 1.6, 2.8, 2.0];

export const SecretSantaTirage: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <BHook />,
        <Revele n={1} who="Le collègue du café" idee="Un paquet de café" prix={9}
          perso={<Collegue x={310} y={50} w={400} expr="happy" hair="court" top="#3D7BE0" acc="badge" seed={52} />} />,
        <Revele n={2} who="Le stagiaire arrivé lundi" idee="Des chocolats" prix={12}
          note="Tu ne connais pas encore son prénom."
          perso={<Collegue x={310} y={50} w={400} expr="worry" hair="boucles" hairCol="#1E1410" top="#F08A24"
            skin={['#C68B5E', '#A86E45']} seed={53} />} />,
        <Revele n={3} who="Ta cheffe" idee="Un coffret chic" prix={40}
          note="« Pour impressionner. » Mais 15 €, c'est 15 € pour tout le monde."
          perso={<Collegue x={310} y={50} w={400} expr="cool" hair="chignon" hairCol="#6B3A1E" top="#2A2F45" acc="lunettes"
            seed={54} />} />,
        <Suspense />, <Legendaire />, <BEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
