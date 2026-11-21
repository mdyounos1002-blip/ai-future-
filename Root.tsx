import React from "react";
import {Composition} from "remotion";
import {AIVideo} from "./AIVideo";
import {FPS, H, TOTAL, W} from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="AIFutureNow" component={AIVideo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
