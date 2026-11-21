# ಕರ್ನಾಟಕದ ಮೊದಲ ರಾಜವಂಶ – ಕದಂಬರು (30 s Instagram Reel)

Kannada history reel, 9:16, 1080×1920, 30 s, in the style of the Katheyache reference reel.

## What's here
| Path | What it is |
|------|------------|
| `SCENE_PROMPTS.md` | Six AI image/video prompts with timings, camera moves, negative prompt and settings |
| `build.py` | Builds the finished reel: voice + music + Kannada subtitles + your clips |
| `output/kadamba_reel.mp4` | Current animatic (placeholder visuals, guide voice, music, burned-in Kannada subtitles) |
| `output/captions_kn.srt` / `.ass` | Kannada subtitles, timed to the narration |
| `output/voice_guide.wav` | Robotic guide voice (espeak-ng) for timing only; re-record with a real voice |
| `output/music_bed.wav` | Synthesised drone + war-drum bed (placeholder for epic music) |
| `fonts/` | Noto Sans Kannada (SIL OFL) for correctly shaped Kannada subtitles |

## Make the final reel
1. Generate the six clips from `SCENE_PROMPTS.md` and save them as `clips/scene1.mp4` … `clips/scene6.mp4`.
2. *(Recommended)* Record the narration with a deep male Kannada voice and save it as `voice/voiceover.wav`
   (or `.mp3`). Keep it under 28.5 s so "ಜೈ ಕರ್ನಾಟಕ!" can land at the end.
3. *(Optional)* Put your licensed epic music in `music/music.mp3`.
4. Run:
   ```bash
   python3 build.py
   ```
   Output: `output/kadamba_reel.mp4`, ready for Instagram Reels. Missing clips stay as placeholders.

Requirements: `ffmpeg` (with libass) and `espeak-ng` (only for the guide voice).

## Facts check
- The Kadamba dynasty was founded by Mayurasharma around 345 CE, after he clashed with the Pallavas at Kanchi.
- The capital was Banavasi (Uttara Kannada).
- The kingdom was at its strongest under Kakusthavarma (c. 405–430 CE). The Halmidi inscription, the earliest known
  long Kannada inscription, dates from roughly this period.
- 345 CE is about 1,680 years ago, so "ಸುಮಾರು 1700 ವರ್ಷಗಳ ಹಿಂದೆ" is a fair approximation.
