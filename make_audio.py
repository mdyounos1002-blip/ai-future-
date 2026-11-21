#!/usr/bin/env python3
"""Synthesises the cinematic score + all sound effects (numpy only) into public/audio/.
Also creates silent placeholder voiceover files in public/vo/ (never overwrites real ones)."""
import os, wave
import numpy as np

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
AUDIO = os.path.join(ROOT, "public", "audio")
VO = os.path.join(ROOT, "public", "vo")
os.makedirs(AUDIO, exist_ok=True)
os.makedirs(VO, exist_ok=True)
rng = np.random.default_rng(7)


def T(d): return np.arange(int(SR * d)) / SR
def noise(d): return rng.standard_normal(int(SR * d))


def lp(x, fc, order=4):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))


def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(x, hi) - lp(x, lo)


def fade(x, a=0.005, b=0.02):
    n = len(x)
    e = np.ones(n)
    na, nb = int(a * SR), int(b * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nb: e[-nb:] = np.linspace(1, 0, nb)
    return x * e


def norm(x, peak=0.9): return x / (np.max(np.abs(x)) + 1e-9) * peak


def save(path, x):
    x = np.atleast_2d(x)
    if x.shape[0] == 1: x = np.vstack([x, x])
    pcm = (np.clip(x.T, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("wrote", os.path.relpath(path, ROOT))


def saw(f, t, n=8):
    return sum(np.sin(2 * np.pi * k * f * t) / k for k in range(1, n + 1))


# ------------------------------------------------------------ SFX
def whoosh(d=1.1):
    t = T(d); n = noise(d); out = np.zeros_like(t)
    centers = np.geomspace(250, 7000, 10)
    for i, c in enumerate(centers):
        pos = i / (len(centers) - 1)
        env = np.exp(-((t / d - (0.25 + 0.5 * pos)) ** 2) / (2 * 0.12 ** 2))
        out += bp(n, c * 0.8, c * 1.25) * env
    return fade(norm(out), 0.02, 0.1)


def impact(d=2.8):
    t = T(d)
    f = 35 + 55 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    burst = lp(noise(d), 2500) * np.exp(-t * 7) * 0.8
    tail = lp(noise(d), 800) * np.exp(-t * 1.2) * 0.3
    metal = (np.sin(2 * np.pi * 1200 * t) + np.sin(2 * np.pi * 1810 * t)) * np.exp(-t * 3) * 0.05
    return fade(norm(boom + burst + tail + metal), 0.001, 0.4)


def riser(d=1.0):
    t = T(d); k = (t / d)
    n = hp(noise(d), 1500) * k ** 2
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1600 * k ** 2) / SR) * k ** 2 * 0.4
    return fade(norm(n + sweep), 0.01, 0.003)


def glitch(d=0.35):
    out = np.zeros(int(SR * d)); i = 0
    while i < len(out):
        seg = min(int(SR * rng.uniform(0.02, 0.045)), len(out) - i)
        fq = rng.uniform(200, 4000)
        tt = np.arange(seg) / SR
        out[i:i + seg] = np.sign(np.sin(2 * np.pi * fq * tt)) * rng.uniform(0.2, 1.0) * (rng.random() > 0.2)
        i += seg
    out += hp(noise(d), 3000) * 0.3
    return fade(norm(out) * np.linspace(1, 0.2, len(out)), 0.002, 0.05)


def tone(fq, d, decay): t = T(d); return np.sin(2 * np.pi * fq * t) * np.exp(-t * decay)


def blip():
    x = np.zeros(int(SR * 0.2)); a = tone(1320, 0.06, 40); b = tone(1980, 0.12, 30)
    x[:len(a)] += a; x[int(SR * 0.06):int(SR * 0.06) + len(b)] += b
    return fade(norm(x, 0.8), 0.001, 0.02)


def hit(d=0.5):
    t = T(d)
    thump = np.sin(2 * np.pi * np.cumsum(45 + 40 * np.exp(-t * 30)) / SR) * np.exp(-t * 9)
    click = hp(noise(d), 2500) * np.exp(-t * 60) * 0.5
    return fade(norm(thump + click), 0.001, 0.05)


def sparkle(d=2.5):
    out = np.zeros(int(SR * d))
    for _ in range(26):
        st = rng.uniform(0, d * 0.7); fq = rng.uniform(2000, 6500)
        tt = T(1.0); s = np.sin(2 * np.pi * fq * tt) * np.exp(-tt * 5) * rng.uniform(0.3, 1)
        i = int(st * SR); n = min(len(s), len(out) - i); out[i:i + n] += s[:n]
    return fade(norm(out, 0.7), 0.002, 0.5)


# ------------------------------------------------------------ MUSIC (30 s, A minor)
def music(D=30.0):
    t = T(D); N = len(t)
    L = np.zeros(N); R = np.zeros(N)
    chords = [  # start, end, bass, pad notes
        (0, 8, 55.0, [110, 164.81, 220, 261.63, 329.63]),
        (8, 15, 43.65, [87.31, 130.81, 174.61, 220, 261.63]),
        (15, 22, 36.71, [73.42, 110, 146.83, 174.61, 220]),
        (22, 30, 55.0, [110, 164.81, 220, 261.63, 329.63]),
    ]
    bright_gain = np.interp(t, [0, 3, 22, 27, 30], [0.0, 0.2, 1.0, 1.0, 0.6])
    for s, e, bass, notes in chords:
        env = np.interp(t, [s - 0.8, s + 0.4, e - 0.4, e + 0.8], [0, 1, 1, 0])
        if env.max() == 0: continue
        for ch, det in ((0, 0.997), (1, 1.003)):
            pad = sum(saw(n * det, t + 0.13 * ch, 8) for n in notes) / len(notes)
            dark = lp(pad, 500); bright = lp(pad, 2400)
            (L if ch == 0 else R)[:] += (dark * 0.6 + bright * 0.5 * bright_gain) * env
        b = np.tanh(1.6 * np.sin(2 * np.pi * bass * t)) * 0.45 + np.sin(2 * np.pi * bass * 2 * t) * 0.12
        L += b * env * 0.8; R += b * env * 0.8
    gain = np.interp(t, [0, 1, 3, 8, 15, 22, 27, 28, 30], [0, 0.25, 0.4, 0.5, 0.6, 0.85, 0.8, 0.6, 0])
    L *= gain; R *= gain

    # plucked arpeggio (8th notes @120 bpm), pan alternating
    arp_l = np.zeros(N); arp_r = np.zeros(N)
    pat = [0, 2, 1, 3, 2, 4, 3, 1]
    for k, ts in enumerate(np.arange(3.0, 29.5, 0.25)):
        if ts >= 27.0 and (int(round((ts - 27) / 0.25)) % 2): continue  # sparse resolve
        notes = next(c[3] for c in chords if c[0] <= ts < c[1])
        fq = notes[pat[k % 8] % len(notes)] * 2
        tt = T(0.5)
        p = (np.sin(2 * np.pi * fq * tt) + 0.4 * np.sin(4 * np.pi * fq * tt)) * np.exp(-tt * 9)
        g = np.interp(ts, [3, 10, 22, 27, 29.5], [0.04, 0.12, 0.2, 0.22, 0.08])
        i = int(ts * SR); n = min(len(p), N - i)
        (arp_l if k % 2 == 0 else arp_r)[i:i + n] += p[:n] * g
    for arr in (arp_l, arp_r):
        d1 = np.roll(arr, int(0.375 * SR)) * 0.4; d2 = np.roll(arr, int(0.75 * SR)) * 0.2
        arr += d1 + d2
    L += arp_l; R += arp_r

    # kicks + hats
    drums = np.zeros(N)
    kick = lambda: np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-T(0.4) * 28)) / SR) * np.exp(-T(0.4) * 9)
    kk = kick()
    for ts in np.arange(15.0, 22.0, 1.0):
        i = int(ts * SR); drums[i:i + len(kk)] += kk * np.interp(ts, [15, 22], [0.2, 0.45])
    for ts in np.arange(22.0, 27.0, 0.5):
        i = int(ts * SR); drums[i:i + len(kk)] += kk * 0.9
    for ts in np.arange(22.25, 27.0, 0.5):
        h = hp(noise(0.08), 7000) * np.exp(-T(0.08) * 60) * 0.25
        i = int(ts * SR); drums[i:i + len(h)] += h
    L += drums; R += drums

    # riser into the drop
    ts0, ts1 = 19.5, 22.0
    m = (t >= ts0) & (t < ts1); k = np.zeros(N); k[m] = ((t[m] - ts0) / (ts1 - ts0))
    r = hp(noise(D), 1200) * k ** 2 * 0.5 + np.sin(2 * np.pi * np.cumsum(150 + 1250 * k ** 2) / SR) * k ** 2 * 0.15 * (k > 0)
    L += r; R += r

    out = np.vstack([L, R])
    out = np.tanh(1.15 * out)
    return norm(out, 0.85)


if __name__ == "__main__":
    for name, fn in [("whoosh", whoosh), ("impact", impact), ("riser", riser), ("glitch", glitch),
                     ("blip", blip), ("hit", hit), ("sparkle", sparkle)]:
        save(os.path.join(AUDIO, f"{name}.wav"), fn())
    save(os.path.join(AUDIO, "music.wav"), music())
    for i in range(1, 7):  # silent placeholders so the project renders before voiceover exists
        p = os.path.join(VO, f"vo{i}.wav")
        if not os.path.exists(p):
            save(p, np.zeros(SR))
