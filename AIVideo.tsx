import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";
import {Background, Overlay, Transitions} from "./Background";
import {Soundtrack} from "./Soundtrack";
import {SceneFade} from "./ui";
import {CL} from "./fx";
import {TOTAL} from "./theme";
import {Opening} from "./scenes/Opening";
import {Interface} from "./scenes/Interface";
import {Life} from "./scenes/Life";
import {Typo} from "./scenes/Typo";
import {Power} from "./scenes/Power";
import {Finale} from "./scenes/Finale";

const SCENES = [
  {from: 0, dur: 90, Comp: Opening},
  {from: 90, dur: 150, Comp: Interface},
  {from: 240, dur: 210, Comp: Life},
  {from: 450, dur: 210, Comp: Typo},
  {from: 660, dur: 150, Comp: Power},
  {from: 810, dur: 90, Comp: Finale},
];

export const AIVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [TOTAL - 14, TOTAL], [0, 1], CL);
  return (
    <AbsoluteFill style={{background: "#02040a"}}>
      <Background />
      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <SceneFade first={i === 0} last={i === SCENES.length - 1}>
            <s.Comp />
          </SceneFade>
        </Sequence>
      ))}
      <Transitions />
      <Overlay />
      <AbsoluteFill style={{background: "#000", opacity: fadeOut}} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
