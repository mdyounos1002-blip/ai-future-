#!/usr/bin/env bash
# Generates the Bangla voiceover (6 clips) with Microsoft Edge neural TTS -> public/vo/vo1..6.wav
# Requires: python3 + pip, internet. Voice: bn-BD-PradeepNeural (male, documentary tone).
# For a female voice change VOICE to bn-BD-NabanitaNeural.
set -e
cd "$(dirname "$0")/.."
VOICE="bn-BD-PradeepNeural"
pip install --quiet edge-tts
mkdir -p tmp public/vo

say() { # index, rate, text
  python3 -m edge_tts --voice "$VOICE" --rate="$2" --pitch="-3Hz" --text "$3" --write-media "tmp/vo$1.mp3"
  if command -v ffmpeg >/dev/null 2>&1; then
    ffmpeg -y -loglevel error -i "tmp/vo$1.mp3" -ar 44100 -ac 2 "public/vo/vo$1.wav"
  else
    npx remotion ffmpeg -y -i "tmp/vo$1.mp3" -ar 44100 -ac 2 "public/vo/vo$1.wav"
  fi
}

say 1 "-5%"  "ভবিষ্যৎ... এখন।"
say 2 "+0%"  "কৃত্রিম বুদ্ধিমত্তা, প্রতি সেকেন্ডে কোটি কোটি তথ্য বিশ্লেষণ করছে।"
say 3 "-2%"  "চিকিৎসা, যাতায়াত, শিক্ষা, আমাদের প্রতিদিনের জীবন বদলে দিচ্ছে।"
say 4 "+0%"  "এটি শেখে, সাহায্য করে, সিদ্ধান্তে সহায়তা করে। কিন্তু নিয়ন্ত্রণ থাকে মানুষের হাতে।"
say 5 "-5%"  "সুযোগ অসীম। ঝুঁকিও বাস্তব।"
say 6 "+10%" "প্রযুক্তিকে জানুন, দায়িত্ব নিয়ে ব্যবহার করুন।"
rm -rf tmp

# Timing check: each clip must finish before the next one starts / before its slot ends.
python3 - <<'PY'
import wave
slots = {1: (36, 99), 2: (99, 252), 3: (252, 462), 4: (462, 660), 5: (675, 810), 6: (810, 900)}
for i, (start, limit) in slots.items():
    w = wave.open(f"public/vo/vo{i}.wav"); sec = w.getnframes() / w.getframerate()
    end = start + sec * 30
    print(f"vo{i}: {sec:4.1f}s  starts f{start} ends f{end:.0f}  limit f{limit}  {'OK' if end <= limit else '!! too long: raise --rate or shift VO[].at in src/theme.ts'}")
PY
