// Animations communes : entrées à ressort, accroche visible dès l'image 0, enchaînement des scènes.
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/** Dans l'accroche (règle 1 du PLAYBOOK), tout est visible et en place dès l'image 0 : `<Instant.Provider value>`. */
export const Instant = React.createContext(false);
export const useInstant = () => React.useContext(Instant);

/** Charge Inter avant le rendu de la première image. */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('polices'));
  useEffect(() => {
    const faces = ([['Black', 900], ['ExtraBold', 800], ['Bold', 700], ['Medium', 500]] as const).map(
      ([w, n]) => new FontFace('Inter', `url(${staticFile(`fonts/Inter-${w}.otf`)})`, {weight: String(n)}),
    );
    Promise.all(faces.map((f) => f.load())).then((fs) => {
      fs.forEach((f) => (document as any).fonts.add(f));
      continueRender(handle);
    });
  }, [handle]);
};

/** Ressort 0 → 1 démarrant à `delay` (en images). Vaut 1 dans l'accroche. */
export const useSpring = (delay = 0, config = {damping: 12, stiffness: 160}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const instant = useInstant();
  return instant ? 1 : spring({frame: f - delay, fps, config});
};

/** Fait apparaître ses enfants avec un petit rebond (montée + léger zoom). */
export const Pop: React.FC<{delay?: number; from?: number; style?: React.CSSProperties; children: React.ReactNode}> = (
  {delay = 0, from = 60, style, children},
) => {
  const s = useSpring(delay);
  return (
    <div style={{...style, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * from}px) scale(${0.85 + 0.15 * s})`}}>
      {children}
    </div>
  );
};

/** Entrée de scène : léger zoom et flou qui se dissipe. `first` : zoom arrière de l'accroche (texte déjà lisible). */
export const SceneIn: React.FC<{first?: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  const k = first
    ? interpolate(f, [0, 18], [1.07, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})
    : interpolate(f, [0, 8], [1.04, 1], {extrapolateRight: 'clamp'});
  const blur = first ? 0 : interpolate(f, [0, 6], [8, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `scale(${k})`, filter: blur ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>;
};

/** Valeur qui va de a à b entre les images f0 et f1 (courbe douce). */
export const useTween = (f0: number, f1: number, a = 0, b = 1) => {
  const f = useCurrentFrame();
  return interpolate(f, [f0, f1], [a, b], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)});
};

/** Enchaîne les scènes ; les durées (en secondes) viennent du fichier Python de l'épisode (même découpage que la musique). */
export const Scenes: React.FC<{scenes: React.ReactNode[]; durations: number[]; fps?: number}> = ({scenes, durations, fps = 30}) => {
  let at = 0;
  return (
    <>
      {scenes.map((node, i) => {
        const d = Math.round((durations[i] ?? 2) * fps);
        const from = at;
        at += d;
        return <Sequence key={i} from={from} durationInFrames={d}>{node}</Sequence>;
      })}
    </>
  );
};

export const totalFrames = (durations: number[], fps = 30) => durations.reduce((a, d) => a + Math.round(d * fps), 0);
