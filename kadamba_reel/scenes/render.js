// Render procedural scenes to MP4 with headless Chromium.
// usage: node render.js <outDir> <dur1> <dur2> ... <dur6>   (or "k=dur" pairs, or "--still" for preview PNGs)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const FPS = 30;
(async () => {
  const [outDir, ...rest] = process.argv.slice(2);
  const still = rest.includes('--still');
  const durs = rest.filter(a => a !== '--still').map(Number);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<canvas id="c" width="1080" height="1920"></canvas>');
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, 'scenes.js'), 'utf8') });
  for (let k = 1; k <= durs.length; k++) {
    const d = durs[k - 1];
    if (still) {
      for (const f of [0.1, 0.5, 0.9]) {
        const b64 = await page.evaluate(([k, t, d]) => { drawScene(k, t, d); return c.toDataURL('image/jpeg', 0.85).split(',')[1]; }, [k, d * f, d]);
        fs.writeFileSync(path.join(outDir, `scene${k}_${f}.jpg`), Buffer.from(b64, 'base64'));
      }
      continue;
    }
    const out = path.join(outDir, `scene${k}.mp4`);
    const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(d * FPS);
    for (let f = 0; f < n; f++) {
      const b64 = await page.evaluate(([k, t, d]) => { drawScene(k, t, d); return c.toDataURL('image/jpeg', 0.92).split(',')[1]; }, [k, f / FPS, d]);
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
    process.stdout.write(`rendered scene${k} (${n} frames)\n`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
