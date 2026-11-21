import React from "react";
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {fontFamily} from "./fonts";
import {C} from "./theme";
import {CL, easeOut} from "./fx";

/* ---------- Particles (deterministic, depth-parallax) ---------- */
export const Particles: React.FC<{count?: number; speed?: number; color?: string; seed?: string}> = ({
  count = 60,
  speed = 1,
  color = C.cyan,
  seed = "p",
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(count).fill(0).map((_, i) => {
        const depth = random(`${seed}-d-${i}`);
        const x0 = random(`${seed}-x-${i}`) * width;
        const y0 = random(`${seed}-y-${i}`) * height;
        const size = 1.5 + depth * 4.5;
        const v = (0.3 + depth * 1.4) * speed;
        const y = (((y0 - frame * v * 2.2) % height) + height) % height;
        const x = x0 + Math.sin(frame / 40 + i) * 12 * depth;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 25 + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: (0.25 + depth * 0.6) * tw,
              boxShadow: `0 0 ${size * 4}px ${color}`,
              filter: depth < 0.25 ? "blur(2px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Kinetic typography (word mask reveal + blur-to-focus) ---------- */
type KP = {
  text: string;
  start?: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  accent?: number[];
  accentColor?: string;
  exit?: number;
  align?: "center" | "flex-start";
  style?: React.CSSProperties;
};

export const Kinetic: React.FC<KP> = ({
  text,
  start = 0,
  stagger = 5,
  size,
  weight = 800,
  color = "#fff",
  accent = [],
  accentColor = C.cyan,
  exit,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(" ");
  const ex =
    exit === undefined
      ? 0
      : interpolate(frame, [exit, exit + 10], [0, 1], {...CL, easing: Easing.in(Easing.cubic)});
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        columnGap: size * 0.26,
        fontFamily,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.35,
        color,
        opacity: 1 - ex,
        transform: `translateY(${-ex * 50}px)`,
        filter: ex > 0 ? `blur(${ex * 14}px)` : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({frame: frame - start - i * stagger, fps, config: {damping: 15, stiffness: 120, mass: 0.9}});
        const sc = Math.max(0, Math.min(1, s));
        const hl = accent.includes(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              padding: `${size * 0.2}px ${size * 0.06}px`,
              margin: `${-size * 0.2}px ${-size * 0.06}px`,
              filter: hl
                ? `drop-shadow(0 0 14px ${accentColor}) drop-shadow(0 0 42px ${accentColor}99)`
                : "drop-shadow(0 0 18px rgba(79,216,255,0.28))",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * 115}%) scale(${0.92 + 0.08 * sc})`,
                opacity: Math.min(1, sc * 2.2),
                filter: `blur(${(1 - sc) * 14}px)`,
                color: hl ? accentColor : color,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Glass HUD panel ---------- */
export const Panel: React.FC<{x: number; y: number; w: number; delay?: number; children: React.ReactNode}> = ({
  x,
  y,
  w,
  delay = 0,
  children,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 16, stiffness: 110}});
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "22px 26px",
        borderRadius: 22,
        background: "linear-gradient(135deg, rgba(14,50,120,0.5), rgba(4,14,40,0.6))",
        border: "1.5px solid rgba(79,216,255,0.5)",
        boxShadow: "0 0 40px rgba(30,144,255,0.35), inset 0 0 30px rgba(30,144,255,0.12)",
        backdropFilter: "blur(10px)",
        opacity: Math.min(1, s),
        transform: `translateY(${(1 - s) * 60}px)`,
        fontFamily,
        color: C.ice,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Documentary lower-third ---------- */
export const LowerThird: React.FC<{idx: string; title: string; sub: string; start?: number; top?: number}> = ({
  idx,
  title,
  sub,
  start = 6,
  top = 1390,
}) => {
  const f = useCurrentFrame();
  const bar = interpolate(f, [start, start + 14], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: "absolute", left: 80, right: 80, top}}>
      <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 6}}>
        <div style={{fontFamily, fontWeight: 700, fontSize: 40, color: C.cyan}}>{idx}</div>
        <div
          style={{
            height: 3,
            width: 300 * bar,
            background: `linear-gradient(90deg, ${C.cyan}, transparent)`,
            boxShadow: `0 0 14px ${C.cyan}`,
          }}
        />
      </div>
      <Kinetic text={title} start={start + 4} size={104} align="flex-start" />
      <Kinetic text={sub} start={start + 14} size={44} weight={500} color={C.dim} stagger={3} align="flex-start" style={{marginTop: 8}} />
    </div>
  );
};

/* ---------- Scene shell: blur-in on enter, push-blur on exit ---------- */
export const SceneFade: React.FC<{children: React.ReactNode; first?: boolean; last?: boolean}> = ({
  children,
  first,
  last,
}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const inO = first ? 1 : interpolate(f, [0, 8], [0.2, 1], CL);
  const inB = first ? 0 : interpolate(f, [0, 8], [16, 0], CL);
  const outB = last ? 0 : interpolate(f, [d - 6, d], [0, 18], CL);
  const outO = last ? 1 : interpolate(f, [d - 5, d], [1, 0.3], CL);
  const outS = last ? 1 : interpolate(f, [d - 6, d], [1, 1.06], {...CL, easing: easeOut});
  return (
    <AbsoluteFill style={{opacity: inO * outO, filter: `blur(${inB + outB}px)`, transform: `scale(${outS})`}}>
      {children}
    </AbsoluteFill>
  );
};
