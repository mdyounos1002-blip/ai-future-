export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 900; // 30s

export const C = {
  bg: "#02040a",
  blue: "#1e90ff",
  cyan: "#4fd8ff",
  ice: "#d6ecff",
  deep: "#0b3dff",
  red: "#ff4d5e",
  dim: "rgba(214,236,255,0.66)",
};

/** Scene boundaries (global frames). Used for transitions + SFX. */
export const CUTS = [90, 240, 450, 660, 810];

/** Voiceover clips: start frame (global) + approximate length. Tune after `npm run voice`. */
export const VO = [
  {at: 36, len: 60, src: "vo/vo1.wav"},
  {at: 99, len: 140, src: "vo/vo2.wav"},
  {at: 252, len: 170, src: "vo/vo3.wav"},
  {at: 462, len: 200, src: "vo/vo4.wav"},
  {at: 675, len: 70, src: "vo/vo5.wav"},
  {at: 810, len: 88, src: "vo/vo6.wav"},
];

/** Everyday-life vignettes (local frames inside scene 3). */
export const LIFE = [0, 62, 125, 210];
