import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {CL} from "./fx";
import {CUTS} from "./theme";
import {Particles} from "./ui";

/** Persistent layer behind every scene: deep gradient, perspective grid, two particle depths. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 30, 90, 450, 660, 690, 810, 900], [0.2, 0.5, 0.45, 0.5, 0.55, 0.9, 0.7, 0.35]);
  const cx = 50 + Math.sin(frame / 90) * 12;
  const off = (frame * 2.4) % 100;
  const mask = "linear-gradient(to top, rgba(0,0,0,0.9), transparent 85%)";
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at ${cx}% 42%, rgba(20,90,255,${0.32 * glow}) 0%, rgba(5,20,70,${0.2 * glow}) 40%, transparent 75%), linear-gradient(180deg,#02040a 0%,#030818 55%,#02040a 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-60%",
          right: "-60%",
          bottom: -40,
          height: 900,
          transformOrigin: "50% 100%",
          transform: "perspective(700px) rotateX(64deg)",
          backgroundImage:
            "linear-gradient(rgba(60,140,255,0.5) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(60,140,255,0.5) 1.5px, transparent 1.5px)",
          backgroundSize: "100px 100px",
          backgroundPosition: `0 ${off}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: 0.32,
        }}
      />
      <Particles count={50} seed="far" speed={0.5} color="#2f7dff" />
      <Particles count={34} seed="near" speed={1.2} color="#8fe6ff" />
    </AbsoluteFill>
  );
};

/** Top layer: vignette + animated film grain. */
export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = (frame * 53) % 220;
  const gy = (frame * 97) % 220;
  const noise =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 45%, rgba(0,0,0,0.78) 100%)"}} />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: "overlay", backgroundImage: noise, backgroundPosition: `${gx}px ${gy}px`}} />
    </AbsoluteFill>
  );
};

/** Light-streak + flash that hides every scene cut. */
export const Transitions: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {CUTS.map((c) => {
        const l = frame - c;
        if (l < -10 || l > 10) return null;
        const p = (l + 10) / 20;
        const x = -0.3 * width + 1.6 * width * p;
        const flash = interpolate(l, [-3, 0, 10], [0, 0.55, 0], {...CL, easing: Easing.out(Easing.quad)});
        return (
          <React.Fragment key={c}>
            <div
              style={{
                position: "absolute",
                top: -100,
                bottom: -100,
                left: x - 120,
                width: 240,
                transform: "skewX(-18deg)",
                background:
                  "linear-gradient(90deg, transparent, rgba(79,216,255,.55), rgba(255,255,255,.9), rgba(79,216,255,.55), transparent)",
                filter: "blur(18px)",
              }}
            />
            <AbsoluteFill style={{background: "#9fd8ff", opacity: flash, mixBlendMode: "screen"}} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
