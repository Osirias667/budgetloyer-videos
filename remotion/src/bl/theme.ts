// Charte BudgetLoyer (mêmes couleurs que bl.py)
export const GREEN = '#20E388';
export const YEL = '#FFD640';
export const RED = '#F04242';
export const CYAN = '#36D6F0';
export const MAG = '#E828BE';
export const NAVY = '#0A0E2C';
export const GREY = '#96A5AF';
export const VIOLET = '#5C48C8';
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const NB = ' ';

/** Montant en euros à la française : 1 234,50 € (espaces insécables). */
export const eur = (v: number, dec = 2) => {
  const [i, d] = Math.abs(v).toFixed(dec).split('.');
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
  return (v < 0 ? '-' : '') + int + (dec ? ',' + d : '') + NB + '€';
};

/** Petit générateur pseudo-aléatoire déterministe (même rendu à chaque image). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
