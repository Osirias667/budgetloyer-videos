// Planche des personnages (contrôle visuel) : `npx remotion still src/index.ts galerie --frame=20`.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useFonts} from './bl/anim';
import {DarkBg} from './bl/decors';
import {Compte, Decouvert, Expr, Manette, P1} from './bl/persos';

const EX: Expr[] = ['happy', 'neutral', 'worry', 'angry', 'shock', 'cool'];

export const Galerie: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill>
      <DarkBg />
      {EX.slice(0, 3).map((e, i) => <P1 key={e} x={190 + i * 350} y={60} w={300} expr={e} wave={i === 0} />)}
      {EX.slice(3).map((e, i) => <P1 key={e} x={190 + i * 350} y={420} w={300} expr={e} talk={i === 0} />)}
      {EX.slice(0, 3).map((e, i) => <Decouvert key={e} x={190 + i * 350} y={800} w={260} expr={e} />)}
      {EX.slice(1, 4).map((e, i) => <Manette key={e} x={190 + i * 350} y={1100} w={300} expr={e} label={i === 0 ? '79,99 €' : undefined} />)}
      {['zen', 'worry', 'shock'].map((e, i) => (
        <Compte key={e} x={190 + i * 350} y={1440} w={280} expr={(e === 'zen' ? 'happy' : e) as Expr} label={['1 850 €', '???', '-12 €'][i]} />
      ))}
    </AbsoluteFill>
  );
};
