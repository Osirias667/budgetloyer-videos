// 19 nov. 2026 · A : « Survie · À deux · Épisode 1/2 » ; B : « Ding dong · Calendrier des pompiers » (vue par le judas).
// Découpage (secondes), musique, faits et sources : episodes/2026-11-19.py.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Instant, Pop, SceneIn, Scenes, useFonts} from '../bl/anim';
import {DarkBg, Judas, MoodBg, PorteBg} from '../bl/decors';
import {P1, Pompier, Sam} from '../bl/persos';
import {CYAN, GREEN, GREY, MAG, NAVY, RED, VIOLET, YEL, eur} from '../bl/theme';
import {Brand, Bulle, Caption, Card, Check, EndLogo, Pill, Roll, Stamp, T, Txt, Y} from '../bl/ui';

const Note: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500,
    fontSize: 32, color: GREY}}>{children}</div>
);

// =============================== A : Survie · À deux ===============================
const PILL_A = 'SURVIE · À DEUX · ÉPISODE 1/2';

/** Compteur du pot commun (élément de jeu, pas un écran de l'app). */
const Pot: React.FC<{a: number; b: number; y?: number}> = ({a, b, y = 250}) => (
  <div style={{position: 'absolute', top: y, left: 190, width: 700, height: 190, borderRadius: 30, background: 'rgba(10,14,44,0.9)',
    border: `6px solid ${YEL}`, boxShadow: `0 0 30px ${YEL}77`, textAlign: 'center', boxSizing: 'border-box', paddingTop: 16}}>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: YEL, letterSpacing: 2}}>POT COMMUN</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 100, color: 'white', lineHeight: 1.1}}><Roll a={a} b={b} /></div>
  </div>
);

const Duo: React.FC<{y?: number; w?: number; e1?: any; e2?: any; t1?: boolean; t2?: boolean; l1?: string; l2?: string; delay?: number}> = (
  {y = 880, w = 420, e1 = 'neutral', e2 = 'neutral', t1, t2, l1, l2, delay = 0},
) => (
  <>
    <P1 x={290} y={y} w={w} expr={e1} talk={t1} look={1} delay={delay} />
    <Sam x={790} y={y} w={w} expr={e2} talk={t2} look={-1} label={l2} delay={delay + 3} />
    {l1 ? (
      <div style={{position: 'absolute', left: 290 - 150, top: y + w * 1.08 - 92, width: 300, textAlign: 'center'}}>
        <span style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: YEL, background: '#16121F', borderRadius: 20,
          padding: '6px 22px'}}>{l1}</span>
      </div>
    ) : null}
  </>
);

const AHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <MoodBg col={VIOLET} dark={0.55} />
      <Pill txt={PILL_A} col={GREEN} fg={NAVY} />
      <Txt y={250} size={84}>Premier mois à deux.<br /><Y>Qui paie quoi ?</Y></Txt>
      <Duo y={560} w={430} e1="happy" e2="happy" />
      <Txt y={1090} size={54}>Toi : <Y>1&nbsp;900&nbsp;€</Y> · Sam : <Y>1&nbsp;300&nbsp;€</Y></Txt>
      <Caption y={1200} size={44} color={YEL}>À envoyer à la personne avec qui tu vis.</Caption>
      <Note y={1300}>Montants d'exemple · histoire inventée</Note>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const Day: React.FC<{day: string; lab: string; amt: number; a: number; who: 'p1' | 'sam'; line: string; e1: any; e2: any}> = (
  {day, lab, amt, a, who, line, e1, e2},
) => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <MoodBg col={VIOLET} dark={0.62} />
      <Pill txt={PILL_A} col={GREEN} fg={NAVY} size={36} />
      <Pot a={a} b={a + amt} />
      <Card x={140} y={480} w={800} h={120} col={RED} delay={2}>
        <T size={lab.length > 10 ? 42 : 50}>{day} · {lab}</T><T size={56} color={RED}>+{eur(amt, 0)}</T>
      </Card>
      <Bulle x={who === 'p1' ? 70 : 290} y={650} w={640} size={46} tail={who === 'p1' ? 0.3 : 0.7} delay={14}>{line}</Bulle>
      <Duo y={860} w={460} e1={e1} e2={e2} t1={who === 'p1' && f > 14 && f < 60} t2={who === 'sam' && f > 14 && f < 60} />
      <Brand />
    </SceneIn>
  );
};

const Addition: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <MoodBg col={RED} dark={0.6} />
      <Pill txt="JOUR 30 · L'ADDITION" col={RED} />
      <Txt y={260} size={70}>Le pot commun du mois :</Txt>
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
        fontSize: 190, color: YEL, WebkitTextStroke: '8px black', paintOrder: 'stroke fill', textShadow: `0 0 40px ${YEL}99`}}>
        1&nbsp;300&nbsp;€
      </div>
      <Txt y={590} size={46} weight={700} delay={6}>Loyer 900 € + courses 290 € + énergie et box 110 €</Txt>
      <Duo y={740} w={400} e1="shock" e2="shock" />
      <Stamp txt="ET MAINTENANT ?" y={1215} delay={16} size={70} col={MAG} />
    </SceneIn>
  );
};

const Choix: React.FC = () => (
  <SceneIn>
    <MoodBg col={CYAN} dark={0.65} />
    <Pill txt="TON CHOIX" col={YEL} fg={NAVY} />
    <Txt y={250} size={74}>Comment on partage<br /><Y>les 1&nbsp;300&nbsp;€</Y> ?</Txt>
    <Pop delay={6} style={{position: 'absolute', left: 80, top: 500, width: 920, height: 250, borderRadius: 30,
      background: 'rgba(10,14,44,0.92)', border: `6px solid ${GREEN}`, boxShadow: `0 0 26px ${GREEN}88`, boxSizing: 'border-box',
      padding: '26px 40px'}}>
      <T size={64} color={GREEN}>A · 50/50</T><br /><T size={56}>650 € chacun</T>
    </Pop>
    <Pop delay={14} style={{position: 'absolute', left: 80, top: 790, width: 920, height: 300, borderRadius: 30,
      background: 'rgba(10,14,44,0.92)', border: `6px solid ${MAG}`, boxShadow: `0 0 26px ${MAG}88`, boxSizing: 'border-box',
      padding: '26px 40px'}}>
      <T size={64} color={MAG}>B · Selon les salaires</T><br /><T size={56}>Toi 772 € · Sam 528 €</T><br />
      <T size={34} weight={500} color={GREY}>(chacun paie sa part du total des salaires, arrondi)</T>
    </Pop>
    <Txt y={1160} size={60} delay={22}>Toi, tu votes <Y>A ou B</Y> ?</Txt>
    <Brand />
  </SceneIn>
);

const France: React.FC = () => (
  <SceneIn>
    <DarkBg />
    <Pill txt="ET EN FRANCE ?" col={MAG} />
    <Card x={110} y={280} w={860} h={200} col={GREEN} delay={2}>
      <T size={120} color={GREEN}>50 %</T><T size={50}>font<br />moitié-moitié</T>
    </Card>
    <Card x={110} y={520} w={860} h={200} col={MAG} delay={10}>
      <T size={120} color={MAG}>30 %</T><T size={50}>partagent<br />au prorata</T>
    </Card>
    <Txt y={790} size={62} delay={20}>Chez les 18-24 ans :<br /><Y>41 % au prorata</Y>.</Txt>
    <Note y={950}>Enquête Cité de l'Économie et Institut Bona fidé, 2026</Note>
    <Duo y={1110} w={300} e1="cool" e2="worry" />
  </SceneIn>
);

const AEnd: React.FC = () => (
  <SceneIn>
    <MoodBg col={VIOLET} dark={0.55} />
    <Caption y={190} size={80}>Réponds <Y>A ou B</Y>.</Caption>
    <Caption y={330} size={52} color={YEL}>Épisode 2 demain : ce qu'il reste à chacun.</Caption>
    <Caption y={560} size={56} delay={3}>Envoie ça à la personne<br />avec qui tu partages <Y c={GREEN}>le loyer</Y>.</Caption>
    <Duo y={780} w={330} e1="happy" e2="happy" t2 />
    <EndLogo y={1210} note="Montants d'exemple · histoire inventée" />
  </SceneIn>
);

export const A_DURATIONS = [2.8, 2.6, 2.6, 2.6, 2.4, 3.2, 2.8, 2.0];

export const SurvieADeux1: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations} scenes={[
        <AHook />,
        <Day day="JOUR 1" lab="LOYER" amt={900} a={0} who="sam" line="On fait les comptes à la fin du mois ?" e1="happy" e2="happy" />,
        <Day day="JOUR 6" lab="COURSES" amt={290} a={900} who="p1" line="Je paie tout, on verra après !" e1="cool" e2="neutral" />,
        <Day day="JOUR 12" lab="ÉNERGIE + BOX" amt={110} a={1190} who="sam" line="Euh… on en est où, là ?" e1="worry" e2="worry" />,
        <Addition />, <Choix />, <France />, <AEnd />,
      ]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

// =============================== B : Calendrier des pompiers ===============================
const ENVOIE = 'Envoie ça au coloc qui n\'a jamais de liquide.';

const BHook: React.FC = () => (
  <Instant.Provider value>
    <SceneIn first>
      <Judas cy={900} r={380}>
        <Pompier x={380} y={150} w={560} silhouette />
      </Judas>
      <Pill txt="DING DONG !" col={RED} size={46} />
      <Txt y={250} size={78}><Y>Calendrier des pompiers.</Y><br />Tu donnes combien ?</Txt>
      <Caption y={1320} size={46} color={YEL}>{ENVOIE}</Caption>
      <Brand />
    </SceneIn>
  </Instant.Provider>
);

const ITEMS: [string, string][] = [['2,40 € en pièces', YEL], ['1 ticket de caisse', 'white'], ['0 billet', RED]];

const Fouille: React.FC = () => (
  <SceneIn>
    <PorteBg tint={0.35} />
    <Pill txt="FOUILLE EXPRESS" col={YEL} fg={NAVY} />
    <Txt y={250} size={62}>Tes poches, <Y>en 3 secondes</Y> :</Txt>
    {ITEMS.map(([t, c], i) => (
      <Card key={t} x={150} y={380 + i * 150} w={780} h={120} col={c === 'white' ? CYAN : c} delay={6 + i * 12}>
        <T size={56} color={c}>{t}</T>
      </Card>
    ))}
    <P1 x={600} y={880} w={500} expr="shock" shake={6} />
    <Brand />
  </SceneIn>
);

const Revelation: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneIn>
      <Judas cy={900} r={380}>
        <Pompier x={380} y={150} w={560} expr="happy" talk={f > 10 && f < 50} />
      </Judas>
      <Pill txt="BONNE NOUVELLE" col={GREEN} fg={NAVY} />
      <Bulle x={150} y={250} w={780} size={62} tail={0.5} delay={8}>Le don est <span style={{color: '#0E9E5C'}}>libre</span> !</Bulle>
      <Stamp txt="PRIX LIBRE" y={1190} delay={22} col={GREEN} size={90} />
      <Brand />
    </SceneIn>
  );
};

const Combien: React.FC = () => {
  const f = useCurrentFrame();
  const fill = Math.min(1, Math.max(0, (f - 10) / 20));
  return (
    <SceneIn>
      <DarkBg />
      <Pill txt="COMBIEN DONNENT LES GENS ?" col={CYAN} fg={NAVY} />
      <Txt y={260} size={70}>Le plus souvent :</Txt>
      <div style={{position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900,
        fontSize: 150, color: GREEN, WebkitTextStroke: '7px black', paintOrder: 'stroke fill', textShadow: `0 0 40px ${GREEN}88`}}>
        5 à 20&nbsp;€
      </div>
      {/* règle de 0 à 30 € avec la zone 5-20 € */}
      <div style={{position: 'absolute', left: 120, top: 640, width: 840, height: 60, borderRadius: 30, background: '#242840'}}>
        <div style={{position: 'absolute', left: 840 * 5 / 30, top: 0, height: 60, width: 840 * 15 / 30 * fill, borderRadius: 30,
          background: GREEN, boxShadow: `0 0 26px ${GREEN}`}} />
      </div>
      {[0, 5, 10, 20, 30].map((v) => (
        <div key={v} style={{position: 'absolute', top: 720, left: 120 + 840 * v / 30 - 60, width: 120, textAlign: 'center',
          fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: v === 5 || v === 20 ? GREEN : 'white'}}>{v} €</div>
      ))}
      <Note y={800}>D'après des amicales de sapeurs-pompiers (Infos Yvelines, nov. 2026)</Note>
      <Pompier x={540} y={900} w={400} expr="happy" />
      <Brand />
    </SceneIn>
  );
};

const SERT: string[] = ['La vie de l\'amicale', 'Les jeunes sapeurs-pompiers', 'L\'entraide aux familles'];

const Sert: React.FC = () => (
  <SceneIn>
    <DarkBg />
    <Pill txt="TON BILLET, IL VA OÙ ?" col={MAG} />
    {SERT.map((t, i) => (
      <Card key={t} x={110} y={280 + i * 170} w={860} h={140} col={[GREEN, CYAN, YEL][i]} delay={4 + i * 10}>
        <T size={46}>{t}</T><Check />
      </Card>
    ))}
    <Card x={110} y={800} w={860} h={140} col={RED} delay={36}>
      <T size={52}>Les secours ?</T><Check ok={false} />
    </Card>
    <Txt y={980} size={50} weight={700} delay={44}>Eux, c'est le budget public.</Txt>
    <Pompier x={540} y={1080} w={330} expr="happy" />
    <Brand />
  </SceneIn>
);

const VRAI: [string, boolean][] = [['Tenue officielle + écusson', true], ['Carte sur demande', true],
  ['Calendrier au nom de la caserne', true], ['Prix imposé', false]];

const Vrai: React.FC = () => (
  <SceneIn>
    <PorteBg tint={0.5} />
    <Pill txt="VRAI POMPIER ? 4 INDICES" col={YEL} fg={NAVY} />
    {VRAI.map(([t, ok], i) => (
      <Card key={t} x={110} y={270 + i * 165} w={860} h={135} col={ok ? GREEN : RED} delay={4 + i * 11}>
        <T size={44}>{t}</T><Check ok={ok} />
      </Card>
    ))}
    <Txt y={960} size={56} delay={50}>Un doute ? Appelle <Y>la caserne</Y>.</Txt>
    <P1 x={620} y={1060} w={340} expr="cool" />
    <Brand />
  </SceneIn>
);

const BEnd: React.FC = () => (
  <SceneIn>
    <PorteBg tint={0.45} />
    <Caption y={180} size={80}>Et toi, tu donnes<br /><Y>combien</Y> ?</Caption>
    <Caption y={420} size={54} color={YEL}>Réponds avec ton montant.</Caption>
    <Caption y={560} size={52} delay={3}>{ENVOIE}</Caption>
    <Pompier x={540} y={740} w={360} expr="happy" talk />
    <EndLogo y={1220} note="Sources : Infos Yvelines, MoneyVox (nov. 2026)" />
  </SceneIn>
);

export const B_DURATIONS = [2.8, 2.6, 3.0, 3.0, 3.0, 3.2, 2.0];

export const CalendrierPompiers: React.FC<{durations: number[]; audio?: string}> = ({durations, audio}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Scenes durations={durations}
        scenes={[<BHook />, <Fouille />, <Revelation />, <Combien />, <Sert />, <Vrai />, <BEnd />]} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
