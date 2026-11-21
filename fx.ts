import {Easing, random} from "remotion";

export const CL = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBn = (v: number | string) => String(v).replace(/[0-9]/g, (d) => BN[Number(d)]);

/** Indian-style digit grouping in Bengali numerals: ২,৪৮,৫৬,৭৩২ */
export const bnGroup = (n: number) => {
  const s = String(Math.floor(n));
  if (s.length <= 3) return toBn(s);
  const last = s.slice(-3);
  let rest = s.slice(0, -3);
  const parts: string[] = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) parts.unshift(rest);
  return toBn(parts.join(",") + "," + last);
};

/** Deterministic camera shake. */
export const shake = (frame: number, start: number, dur: number, amp: number) => {
  if (frame < start || frame >= start + dur) return {x: 0, y: 0};
  const k = 1 - (frame - start) / dur;
  return {x: (random(`sx${frame}`) - 0.5) * 2 * amp * k, y: (random(`sy${frame}`) - 0.5) * 2 * amp * k};
};
