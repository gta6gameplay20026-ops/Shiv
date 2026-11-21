# ಕರ್ನಾಟಕದ ಮೊದಲ ರಾಜವಂಶ – ಕದಂಬರು · AI Scene Prompts

**Format:** 9:16 · 1080×1920 · 30 fps · 30 s total · Realistic 3D AI cinematic history

**Style to match the reference reel (Katheyache):** painterly, semi-realistic 3D characters,
warm golden-hour light, deep jungle greens against saffron/orange skies, carved-stone detail,
strong rim light, shallow depth of field. Centre of frame stays clear because Kannada subtitles
sit in the middle-lower third and a small label sits at the top.

Add this to **every** prompt:

> vertical 9:16 composition, realistic 3D cinematic, Indian historical epic, golden-hour volumetric light,
> film grain, shallow depth of field, ultra-detailed, 4K, slow cinematic camera motion

**Negative prompt (all scenes):** text, letters, watermark, logo, modern objects, buildings with glass,
guns, armour from Europe/Rome/Mughal era, turbans of later periods, extra fingers, deformed faces,
cartoon, anime, blurry, low-resolution

Clip lengths below follow the narration. Generate each clip **at least** this long (6 s is safe;
`build.py` trims longer clips and loops shorter ones).

| # | Time | Length | Voice line(s) | Top label |
|---|------|--------|---------------|-----------|
| 1 | 0.0–5.5 s | ~5.5 s | ಸುಮಾರು 1700 ವರ್ಷಗಳ ಹಿಂದೆ... ಕರ್ನಾಟಕದ ಇತಿಹಾಸದಲ್ಲಿ ಹೊಸ ಅಧ್ಯಾಯ ಆರಂಭವಾಯಿತು! | ಪ್ರಾಚೀನ ಕರ್ನಾಟಕ |
| 2 | 5.5–11.6 s | ~6 s | ಕ್ರಿ.ಶ. 345ರ ಸುಮಾರಿಗೆ ಮಯೂರಶರ್ಮ ... ಸ್ಥಾಪಿಸಿದನು. | ಕ್ರಿ.ಶ. 345 · ಮಯೂರಶರ್ಮ |
| 3 | 11.6–14.5 s | ~3 s | ಪಲ್ಲವರ ವಿರುದ್ಧ ಹೋರಾಡಿ ಸ್ವತಂತ್ರ ರಾಜ್ಯವನ್ನು ನಿರ್ಮಿಸಿದನು. | ಕದಂಬ × ಪಲ್ಲವ ಯುದ್ಧ |
| 4 | 14.5–17.4 s | ~3 s | ಬನವಾಸಿಯನ್ನು ತನ್ನ ರಾಜಧಾನಿಯನ್ನಾಗಿ ಮಾಡಿಕೊಂಡನು. | ಬನವಾಸಿ · ಕದಂಬ ರಾಜಧಾನಿ |
| 5 | 17.4–21.4 s | ~4 s | ಕಾಕುಸ್ಥವರ್ಮನ ಕಾಲದಲ್ಲಿ ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತಷ್ಟು ಬಲಿಷ್ಠವಾಯಿತು. | ಕಾಕುಸ್ಥವರ್ಮ · ರಾಜಸಭೆ |
| 6 | 21.4–30.0 s | ~8.5 s | ಕನ್ನಡ ನಾಡಿನ ... ಪ್ರಮುಖರು! ಜೈ ಕರ್ನಾಟಕ! | ಕದಂಬ ರಾಜಲಾಂಛನ · ಸಿಂಹ |

> Timings are from the guide voice. If you record your own voice-over, run `build.py` again and use the
> lengths it prints.

---

## Scene 1 · Ancient Karnataka at sunrise
**Image / video prompt:**
Cinematic aerial drone shot over ancient Karnataka in the 4th century, endless dense green
Western Ghats forests and mist-filled valleys, a winding river catching the first sunrise light,
small ancient Indian villages with thatched roofs and smoke rising, saffron and gold sky,
god rays through the mist, realistic historical documentary.

**Camera:** slow forward drone glide, slight descent.

## Scene 2 · Mayurasharma – scholar becomes king
**Prompt:**
Mayurasharma, a young ancient Indian Brahmin scholar-warrior from the 4th century, sacred thread
across bare chest, simple white dhoti, tied hair, holding a palm-leaf manuscript in one hand and
gripping a sword with the other, determined fiery eyes; behind him a half-built stone fort and
a kadamba tree in bloom; dramatic warm side light, embers floating in the air,
realistic 3D cinematic portrait.

**Camera:** slow push-in on the face, sword rises into frame.
**Tip:** generate two halves (scholar → king with gold armlets and crown) and use a morph/transition if your tool supports it.

## Scene 3 · Kadambas vs Pallavas
**Prompt:**
Epic ancient Indian battlefield in the 4th century, Kadamba warriors in saffron and red cloth
with round shields and curved swords charging against Pallava soldiers with spears and
war elephants in the distance, galloping horses, dust and smoke, sunset backlight,
banners with a lion emblem, cinematic historical realism, intense action.

**Camera:** low-angle tracking shot moving with the charge, motion blur.

## Scene 4 · Banavasi, the Kadamba capital
**Prompt:**
Ancient Banavasi city as the Kadamba capital beside the Varada river, early stone and wooden
temples with sloped roofs, a royal palace complex with pillared halls, banners with a lion emblem,
people and bullock carts on the streets, lush green paddy fields and areca palms around,
golden-hour light, historical reconstruction, cinematic drone shot.

**Camera:** sweeping drone orbit, revealing the river and the palace.
**Note:** Kadamba-era buildings were simpler than later Hoysala/Vijayanagara temples — avoid huge gopurams.

## Scene 5 · King Kakusthavarma's court
**Prompt:**
Kadamba King Kakusthavarma seated on a magnificent carved ancient Indian throne with lion armrests,
gold crown, gold jewellery, royal silk garments, ministers and scholars standing on both sides,
oil lamps and pillared hall, an inscribed stone tablet in the court, rich golden cinematic
lighting, regal and powerful, realistic 3D.

**Camera:** slow dolly from the hall entrance towards the throne.

## Scene 6 · The Kadamba lion and finale
**Prompt:**
Majestic carved stone lion, the royal emblem of the Kadamba dynasty, roaring on a high pedestal,
ancient Karnataka palace and fluttering yellow-and-red flags in the background, sun bursting
behind the lion, cinematic golden light and drifting dust, dramatic heroic ending,
historical documentary.

**Camera:** slow low-angle push-in, ending on a strong centred frame (big “ಜೈ ಕರ್ನಾಟಕ!” appears in the middle for the last 1.5 s — keep the centre uncluttered).

---

## Cloud AI video settings
- Aspect ratio **9:16**, resolution **1080×1920**, 30 fps
- Clip length **5–8 s** each (see table)
- Style: realistic cinematic; motion strength medium-low (keeps faces stable)
- Voice: Kannada male deep voice (gambhira niroopane)
- Music: epic historical background (veena/tanpura drone + war drums)
- Captions: Kannada subtitles → use `output/captions_kn.srt`
