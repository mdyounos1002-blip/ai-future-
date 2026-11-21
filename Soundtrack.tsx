import React from "react";
import {Audio, Sequence, interpolate, staticFile} from "remotion";
import {CUTS, TOTAL, VO} from "./theme";

/** [file, global start frame, volume] — every sound is tied to a visual beat. */
const SFX: [string, number, number][] = [
  ["riser", 0, 0.7],
  ["glitch", 20, 0.45],
  ["impact", 30, 1],
  ["glitch", 31, 0.5],
  ["glitch", 64, 0.35],
  // whooshes lead each cut by ~0.5s
  ...CUTS.map((c): [string, number, number] => ["whoosh", c - 16, 0.75]),
  // scene 2 – interface blips
  ...[100, 112, 127, 140, 158, 176, 196].map((f): [string, number, number] => ["blip", f, 0.35]),
  // scene 3 – vignette swipes
  ["whoosh", 290, 0.4],
  ["whoosh", 353, 0.4],
  // scene 4 – typography hits
  ...[454, 488, 520, 570].map((f): [string, number, number] => ["hit", f, 0.7]),
  // scene 5 – drop + glitch on "ঝুঁকিও বাস্তব"
  ["impact", 660, 1],
  ["glitch", 710, 0.55],
  // scene 6 – resolve
  ["impact", 810, 0.55],
  ["sparkle", 812, 0.6],
];

const duck = (f: number) => {
  let d = 1;
  for (const v of VO) {
    const k = interpolate(f, [v.at - 8, v.at, v.at + v.len, v.at + v.len + 14], [1, 0.5, 0.5, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    d = Math.min(d, k);
  }
  return d;
};

export const Soundtrack: React.FC = () => (
  <>
    <Audio
      src={staticFile("audio/music.wav")}
      volume={(f) => 0.6 * duck(f) * interpolate(f, [0, 12, TOTAL - 36, TOTAL], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}
    />
    {SFX.map(([name, at, vol], i) => (
      <Sequence key={i} from={at}>
        <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
    {VO.map((v, i) => (
      <Sequence key={`vo${i}`} from={v.at}>
        <Audio src={staticFile(v.src)} volume={1} />
      </Sequence>
    ))}
  </>
);
