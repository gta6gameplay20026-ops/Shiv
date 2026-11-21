#!/usr/bin/env python3
"""Build the 30 s Kadamba dynasty Instagram Reel (1080x1920, 9:16).

What it does:
  1. Makes a guide Kannada voice-over (espeak-ng) for every subtitle line,
     or uses your own recording at voice/voiceover.wav|mp3 if present.
  2. Times the 6 scenes to the voice so the whole reel is exactly 30 s.
  3. Writes Kannada subtitles (output/captions_kn.srt + .ass).
  4. Synthesises an epic historical music bed (drone + war drums),
     or uses music/music.mp3|wav if present.
  5. For each scene uses clips/sceneN.mp4 (your AI clip) if present,
     otherwise an animated placeholder, then burns subtitles and mixes audio.

Run:  python3 build.py           -> output/kadamba_reel.mp4
Needs: ffmpeg (with libass), espeak-ng (only for the guide voice).
"""
import json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "output")
TMP = os.path.join(OUT, "_work")
W, H, FPS, TOTAL = 1080, 1920, 30, 30.0

# (scene, caption shown on screen, text spoken by the guide voice)
LINES = [
    (1, "ಸುಮಾರು 1700 ವರ್ಷಗಳ ಹಿಂದೆ...", "ಸುಮಾರು ಸಾವಿರದ ಏಳುನೂರು ವರ್ಷಗಳ ಹಿಂದೆ"),
    (1, "ಕರ್ನಾಟಕದ ಇತಿಹಾಸದಲ್ಲಿ\nಹೊಸ ಅಧ್ಯಾಯ ಆರಂಭವಾಯಿತು!", "ಕರ್ನಾಟಕದ ಇತಿಹಾಸದಲ್ಲಿ ಹೊಸ ಅಧ್ಯಾಯ ಆರಂಭವಾಯಿತು"),
    (2, "ಕ್ರಿ.ಶ. 345ರ ಸುಮಾರಿಗೆ", "ಕ್ರಿಸ್ತ ಶಕ ಮುನ್ನೂರ ನಲವತ್ತೈದರ ಸುಮಾರಿಗೆ"),
    (2, "ಮಯೂರಶರ್ಮ ಎಂಬ ಧೈರ್ಯಶಾಲಿ ನಾಯಕ\nಕದಂಬ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದನು.", "ಮಯೂರಶರ್ಮ ಎಂಬ ಧೈರ್ಯಶಾಲಿ ನಾಯಕ ಕದಂಬ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದನು"),
    (3, "ಪಲ್ಲವರ ವಿರುದ್ಧ ಹೋರಾಡಿ\nಸ್ವತಂತ್ರ ರಾಜ್ಯವನ್ನು ನಿರ್ಮಿಸಿದನು.", "ಪಲ್ಲವರ ವಿರುದ್ಧ ಹೋರಾಡಿ ಸ್ವತಂತ್ರ ರಾಜ್ಯವನ್ನು ನಿರ್ಮಿಸಿದನು"),
    (4, "ಬನವಾಸಿಯನ್ನು ತನ್ನ\nರಾಜಧಾನಿಯನ್ನಾಗಿ ಮಾಡಿಕೊಂಡನು.", "ಬನವಾಸಿಯನ್ನು ತನ್ನ ರಾಜಧಾನಿಯನ್ನಾಗಿ ಮಾಡಿಕೊಂಡನು"),
    (5, "ಕಾಕುಸ್ಥವರ್ಮನ ಕಾಲದಲ್ಲಿ", "ಕಾಕುಸ್ಥವರ್ಮನ ಕಾಲದಲ್ಲಿ"),
    (5, "ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ\nಮತ್ತಷ್ಟು ಬಲಿಷ್ಠವಾಯಿತು.", "ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತಷ್ಟು ಬಲಿಷ್ಠವಾಯಿತು"),
    (6, "ಕನ್ನಡ ನಾಡಿನ ಇತಿಹಾಸದಲ್ಲಿ\nಅಚ್ಚಳಿಯದ ಗುರುತು ಮೂಡಿಸಿದ ಕದಂಬರು...", "ಕನ್ನಡ ನಾಡಿನ ಇತಿಹಾಸದಲ್ಲಿ ಅಚ್ಚಳಿಯದ ಗುರುತು ಮೂಡಿಸಿದ ಕದಂಬರು"),
    (6, "ಇವರೇ ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ\nಸ್ಥಳೀಯ ರಾಜವಂಶಗಳಲ್ಲಿ ಪ್ರಮುಖರು!", "ಇವರೇ ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಸ್ಥಳೀಯ ರಾಜವಂಶಗಳಲ್ಲಿ ಪ್ರಮುಖರು"),
    (6, "ಜೈ ಕರ್ನಾಟಕ!", "ಜೈ ಕರ್ನಾಟಕ"),
]

# Small label at the top of the frame (like the reference reel) + placeholder colours.
SCENES = {
    1: ("ಪ್ರಾಚೀನ ಕರ್ನಾಟಕ", ("0x0b2a12", "0x2f6b2a", "0xe8a33c", "0x103d1d")),
    2: ("ಕ್ರಿ.ಶ. 345 · ಮಯೂರಶರ್ಮ", ("0x2a1405", "0x8a4b12", "0xf2b84b", "0x3b1d08")),
    3: ("ಕದಂಬ × ಪಲ್ಲವ ಯುದ್ಧ", ("0x2b0b06", "0x8b2a10", "0xd9853b", "0x40140a")),
    4: ("ಬನವಾಸಿ · ಕದಂಬ ರಾಜಧಾನಿ", ("0x0d2a1f", "0x3f7a3a", "0xf0c56a", "0x173f2a")),
    5: ("ಕಾಕುಸ್ಥವರ್ಮ · ರಾಜಸಭೆ", ("0x2a1a04", "0x9a6a12", "0xffd76a", "0x3a2406")),
    6: ("ಕದಂಬ ರಾಜಲಾಂಛನ · ಸಿಂಹ", ("0x3a0606", "0xc0262a", "0xffcc1f", "0x5a0a0a")),
}

GAP = 0.18  # pause between voice lines (s)


def run(cmd, **kw):
    subprocess.run(cmd, check=True, **kw)


def ff(*args):
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "json", path])
    return float(json.loads(out)["format"]["duration"])


def find(folder, names):
    for n in names:
        p = os.path.join(ROOT, folder, n)
        if os.path.exists(p):
            return p
    return None


def ass_time(t):
    cs = int(round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def build_voice():
    """Return (voice_wav, [(start, end) per line])."""
    custom = find("voice", ["voiceover.wav", "voiceover.mp3", "voiceover.m4a"])
    if custom:
        # Your own recording: spread captions proportionally to text length.
        d = min(duration(custom), TOTAL - 0.5)
        weights = [len(l[2]) for l in LINES]
        tot, t, times = sum(weights), 0.4, []
        for w in weights:
            seg = (d - 0.4) * w / tot
            times.append((t, t + seg))
            t += seg
        dst = os.path.join(TMP, "voice.wav")
        ff("-i", custom, "-t", str(TOTAL), "-ac", "2", "-ar", "48000", dst)
        return dst, times

    if not shutil.which("espeak-ng"):
        sys.exit("espeak-ng not found: install it or put your recording at voice/voiceover.wav")
    parts = []
    for i, (_, _, spoken) in enumerate(LINES):
        p = os.path.join(TMP, f"line{i:02d}.wav")
        # deep, slow, serious male narration
        run(["espeak-ng", "-v", "kn+m3", "-s", "135", "-p", "22", "-a", "190", "-w", p, spoken])
        parts.append(p)
    raw = sum(duration(p) for p in parts) + GAP * (len(parts) - 1) + 0.6
    tempo = max(1.0, raw / (TOTAL - 1.6))  # keep ~1.5 s free so "ಜೈ ಕರ್ನಾಟಕ!" can land
    times, t, inputs, flt = [], 0.4, [], []
    for i, p in enumerate(parts):
        d = duration(p) / tempo
        times.append((t, t + d))
        inputs += ["-i", p]
        ms = int(t * 1000)
        flt.append(f"[{i}:a]atempo={tempo:.4f},aresample=48000,"
                   f"aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
        t += d + GAP
    mix = "".join(f"[v{i}]" for i in range(len(parts)))
    flt.append(f"{mix}amix=inputs={len(parts)}:normalize=0,"
               # warm it up a bit: bass boost + slight room echo
               f"bass=g=6:f=120,aecho=0.8:0.5:40:0.18,apad,atrim=0:{TOTAL}[out]")
    dst = os.path.join(TMP, "voice.wav")
    ff(*inputs, "-filter_complex", ";".join(flt), "-map", "[out]", dst)
    return dst, times


def scene_bounds(times):
    """Scene k runs from its first line start to the next scene's first line start."""
    firsts = {}
    for (scene, _, _), (s, _) in zip(LINES, times):
        firsts.setdefault(scene, s)
    starts = [0.0] + [firsts[k] - 0.15 for k in range(2, 7)]
    ends = starts[1:] + [TOTAL]
    return list(zip(starts, ends))


def build_music():
    custom = find("music", ["music.mp3", "music.wav", "music.m4a"])
    dst = os.path.join(TMP, "music.wav")
    if custom:
        ff("-stream_loop", "-1", "-i", custom, "-t", str(TOTAL),
           "-af", f"afade=t=in:d=1,afade=t=out:st={TOTAL - 2}:d=2", "-ac", "2", "-ar", "48000", dst)
        return dst
    # Drone in D (tanpura-like) with slow swell, and war drums every 0.75 s,
    # getting stronger from the battle scene onwards.
    drone = ("0.16*(sin(2*PI*73.42*t)+0.6*sin(2*PI*110*t)+0.45*sin(2*PI*146.83*t)"
             "+0.2*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.25*t)))*min(1,t/3)")
    m = "mod(t,0.75)"
    drum = f"(0.25+0.5*min(1,t/10))*sin(2*PI*(48+90*exp(-25*{m}))*{m})*exp(-7*{m})"
    m2 = "mod(t+0.375,1.5)"
    drum2 = f"0.25*min(1,t/12)*sin(2*PI*(70+120*exp(-30*{m2}))*{m2})*exp(-10*{m2})"
    expr = f"{drone}+{drum}+{drum2}"
    ff("-f", "lavfi", "-i", f"aevalsrc='{expr}|{expr}':s=48000:d={TOTAL}",
       "-af", f"lowpass=f=3500,aecho=0.8:0.6:120:0.25,afade=t=in:d=1.5,"
              f"afade=t=out:st={TOTAL - 2.5}:d=2.5,alimiter=limit=0.8", dst)
    return dst


def write_subs(times, bounds, has_clips):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Noto Sans Kannada,70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,6,3,5,60,60,0,1
Style: Label,Noto Sans Kannada,44,&H00FFFFFF,&H00FFFFFF,&HA0000000,&HA0000000,-1,0,0,0,100,100,0,0,3,10,0,8,60,60,150,1
Style: Jai,Noto Sans Kannada,120,&H0000D7FF,&H0000D7FF,&H001A1AC8,&H96000000,-1,0,0,0,100,100,0,0,1,8,4,5,40,40,0,1
Style: Note,DejaVu Sans,30,&H80FFFFFF,&H80FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,2,60,60,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev, srt = [], []
    for i, ((scene, cap, _), (s, e)) in enumerate(zip(LINES, times)):
        end = times[i + 1][0] - 0.05 if i + 1 < len(times) else TOTAL
        txt = cap.replace("\n", "\\N")
        if cap.startswith("ಜೈ"):
            ev.append(f"Dialogue: 2,{ass_time(s)},{ass_time(end)},Jai,,0,0,0,,"
                      f"{{\\pos(540,960)\\fad(150,300)\\t(0,350,\\fscx112\\fscy112)}}{txt}")
        else:
            ev.append(f"Dialogue: 1,{ass_time(s)},{ass_time(end)},Cap,,0,0,0,,"
                      f"{{\\pos(540,1240)\\fad(180,150)}}{txt}")
        srt.append(f"{i + 1}\n{srt_time(s)} --> {srt_time(end)}\n{cap}\n")
    for k, (s, e) in enumerate(bounds, start=1):
        ev.append(f"Dialogue: 0,{ass_time(s + 0.2)},{ass_time(e - 0.1)},Label,,0,0,0,,"
                  f"{{\\fad(250,200)}}{SCENES[k][0]}")
        if not has_clips[k - 1]:
            ev.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Note,,0,0,0,,"
                      f"SCENE {k} PLACEHOLDER - put clips/scene{k}.mp4")
    ass = os.path.join(TMP, "captions.ass")
    with open(ass, "w", encoding="utf-8") as f:
        f.write(head + "\n".join(ev) + "\n")
    with open(os.path.join(OUT, "captions_kn.srt"), "w", encoding="utf-8") as f:
        f.write("\n".join(srt))
    shutil.copy(ass, os.path.join(OUT, "captions_kn.ass"))
    return ass


def build_scene(k, d):
    dip = f",fade=t=in:d={0.6 if k == 1 else 0.25}"
    dst = os.path.join(TMP, f"scene{k}.mp4")
    clip = find("clips", [f"scene{k}.mp4", f"scene{k}.mov", f"scene{k}.webm"])
    fit = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
           f"fps={FPS},setsar=1,format=yuv420p")
    gen = os.path.join(TMP, "gen", f"scene{k}.mp4")
    if not clip and os.path.exists(gen):
        ff("-i", gen, "-t", f"{d:.3f}", "-vf", f"{fit}{dip}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", dst)
        return dst, True
    if clip:
        # loop if the AI clip is shorter than the slot; slow push-in for life
        ff("-stream_loop", "-1", "-i", clip, "-t", f"{d:.3f}", "-an",
           "-vf", f"{fit},zoompan=z='1+0.04*on/({d * FPS:.0f})':x='iw/2-iw/zoom/2':"
                  f"y='ih/2-ih/zoom/2':d=1:s={W}x{H}:fps={FPS}{dip}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", dst)
    else:
        c = SCENES[k][1]
        src = (f"gradients=s={W}x{H}:r={FPS}:d={d:.3f}:c0={c[0]}:c1={c[1]}:c2={c[2]}:"
               f"c3={c[3]}:nb_colors=4:speed=0.012:type=radial")
        ff("-f", "lavfi", "-i", src,
           "-vf", f"noise=alls=3:allf=t,vignette=angle=PI/3.2,format=yuv420p{dip}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "20", dst)
    return dst, bool(clip)


def render_generated(bounds):
    """Draw the built-in cinematic scenes (scenes/scenes.js) for slots without an AI clip."""
    if os.environ.get("NO_GENERATED") or not shutil.which("node"):
        return
    gen = os.path.join(TMP, "gen")
    shutil.rmtree(gen, ignore_errors=True)
    env = dict(os.environ)
    try:
        env["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
    except Exception:
        pass
    durs = [f"{e - s + 0.05:.3f}" for s, e in bounds]
    try:
        run(["node", os.path.join(ROOT, "scenes", "render.js"), gen, *durs], env=env)
    except subprocess.CalledProcessError:
        print("Scene renderer failed (needs Playwright + Chromium); using placeholders.")


def main():
    os.makedirs(TMP, exist_ok=True)
    voice, times = build_voice()
    bounds = scene_bounds(times)
    music = build_music()
    render_generated(bounds)
    scenes = [build_scene(k, e - s) for k, (s, e) in enumerate(bounds, start=1)]
    ass = write_subs(times, bounds, [c for _, c in scenes])

    # hard cuts keep exact sync; each scene fades in from black (see build_scene).
    lst = os.path.join(TMP, "list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{p}'\n" for p, _ in scenes)
    fonts = os.path.join(ROOT, "fonts")
    final = os.path.join(OUT, "kadamba_reel.mp4")
    ff("-f", "concat", "-safe", "0", "-i", lst, "-i", voice, "-i", music,
       "-filter_complex",
       f"[0:v]fade=t=out:st={TOTAL - 0.6}:d=0.6,"
       f"ass='{ass}':fontsdir='{fonts}'[v];"
       f"[2:a]volume=0.55[m];[m][1:a]sidechaincompress=threshold=0.05:ratio=4:release=300[duck];"
       f"[duck][1:a]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[a]",
       "-map", "[v]", "-map", "[a]", "-t", str(TOTAL), "-r", str(FPS),
       "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-maxrate", "8M", "-bufsize", "16M", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", final)
    shutil.copy(music, os.path.join(OUT, "music_bed.wav"))
    shutil.copy(voice, os.path.join(OUT, "voice_guide.wav"))
    print("Scene timings (use these lengths when generating clips):")
    for k, (s, e) in enumerate(bounds, start=1):
        print(f"  scene{k}: {s:5.2f}s -> {e:5.2f}s  ({e - s:.2f}s)  clip={'yes' if scenes[k-1][1] else 'placeholder'}")
    print("Wrote", final)


if __name__ == "__main__":
    main()
