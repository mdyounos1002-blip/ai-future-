# AI — ভবিষ্যৎ এখন  (30s · 9:16 · 1080×1920 · 30fps · Remotion)

## Run it
```bash
npm install
npm run audio     # synthesises music + sound effects (already generated in public/audio)
npm run voice     # Bangla voiceover via edge-tts (needs internet) -> public/vo/vo1..6.wav
npm run dev       # live preview in Remotion Studio
npm run render    # -> out/ai-future-now.mp4  (H.264, CRF 16, AAC audio)
npm run thumb     # -> out/thumbnail.png
```
Requires Node 18+ and Python 3 (numpy for `npm run audio`). Fonts (Noto Sans Bengali) load from Google Fonts at render time.
The project renders without `npm run voice` (silent placeholders), but you want the voice.

## Timeline (frames @30fps)
| Time | Frames | Scene | Voiceover |
|---|---|---|---|
| 0–3s | 0–90 | Light line → flare → impact → glowing "AI — ভবিষ্যৎ এখন", RGB glitch, shockwaves | ভবিষ্যৎ… এখন। |
| 3–8s | 90–240 | AI interface: neural network, HUD rings, data panels, camera push-in | কৃত্রিম বুদ্ধিমত্তা, প্রতি সেকেন্ডে কোটি কোটি তথ্য বিশ্লেষণ করছে। |
| 8–15s | 240–450 | Healthcare (DNA + ECG) → smart city (AI vision) → AI assistant phone | চিকিৎসা, যাতায়াত, শিক্ষা, আমাদের প্রতিদিনের জীবন বদলে দিচ্ছে। |
| 15–22s | 450–660 | Kinetic Bangla typography: শেখে / সাহায্য করে / সিদ্ধান্তে সহায়তা / মানুষের হাতে | এটি শেখে, সাহায্য করে, সিদ্ধান্তে সহায়তা করে। কিন্তু নিয়ন্ত্রণ থাকে মানুষের হাতে। |
| 22–27s | 660–810 | Dramatic drop: rotating data globe, beat-synced pulses, shockwave | সুযোগ অসীম। ঝুঁকিও বাস্তব। |
| 27–30s | 810–900 | Final title with light sweep, fade to black | প্রযুক্তিকে জানুন, দায়িত্ব নিয়ে ব্যবহার করুন। |

## Tuning
* Voice start times / ducking windows: `VO` in `src/theme.ts`. `npm run voice` prints whether each clip fits its slot.
* Sound-effect cues: `SFX` list in `src/Soundtrack.tsx`. Vignette timing: `LIFE` in `src/theme.ts`.
* Music/SFX are synthesised (original, royalty-free). Replace `public/audio/music.wav` with any track you like.
* Visuals are fully procedural (no stock footage), so there are no missing assets.
