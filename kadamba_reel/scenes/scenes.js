// Procedural cinematic scenes for the Kadamba reel (1080x1920 canvas).
// drawScene(k, t, d): scene k (1..6), local time t seconds, scene length d.
const W = 1080, H = 1920, TAU = Math.PI * 2;
const c = document.getElementById('c'), ctx = c.getContext('2d');

function R(seed) { let s = seed >>> 0; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => { t = clamp(t); return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
function vgrad(stops, y0 = 0, y1 = H) { const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [o, col] of stops) g.addColorStop(o, col); return g; }
function fillAll(style) { ctx.fillStyle = style; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
function glow(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(0.3, rgba(col, a * 0.35)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
function additive(fn) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; fn(); ctx.restore(); }
function cam(z, fx = W / 2, fy = H / 2, dx = 0, dy = 0) { ctx.translate(fx + dx, fy + dy); ctx.scale(z, z); ctx.translate(-fx, -fy); }

function ridge(base, amp, seed, fill, shift = 0, tree = 0, freq = 90) {
  ctx.beginPath(); ctx.moveTo(-300, H * 2);
  for (let x = -300; x <= W + 300; x += 5) {
    const u = (x + shift) / W;
    let y = base - amp * (0.5 * Math.sin(u * 2.1 + seed) + 0.3 * Math.sin(u * 5.3 + seed * 2.7) + 0.2 * Math.sin(u * 11.7 + seed * 1.3));
    if (tree) y -= tree * Math.pow(Math.abs(Math.sin(u * freq + seed * 5)), 0.6) * (0.65 + 0.35 * Math.sin(u * 23 + seed));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W + 300, H * 2); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function mist(y, h, col, a) { const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(-300, y - h / 2, W + 600, h); }
function particles(seed, n, t, o) {
  const r = R(seed); const [x0, y0, x1, y1] = o.area; const w = x1 - x0, h = y1 - y0;
  additive(() => {
    for (let i = 0; i < n; i++) {
      const px = r(), py = r(), sz = o.size * (0.4 + r()), ph = r() * TAU;
      let x = x0 + ((px * w + o.vx * t * (0.5 + px)) % w + w) % w;
      const y = y0 + ((py * h + o.vy * t * (0.5 + py)) % h + h) % h;
      x += Math.sin(t * 1.3 + ph) * 14;
      const a = o.alpha * (o.flicker ? 0.45 + 0.55 * Math.abs(Math.sin(t * 6 + ph * 3)) : 1);
      glow(x, y, sz * 4, o.col, a);
    }
  });
}
function rays(cx, cy, n, len, t, col, a, spread = TAU, start = 0, spin = 0.05) {
  additive(() => {
    for (let i = 0; i < n; i++) {
      const ang = start + spread * (i / n) + t * spin + Math.sin(i * 7.1) * 0.05;
      const wd = 0.025 + 0.025 * Math.abs(Math.sin(i * 3.3));
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, len);
      g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, len, ang - wd, ang + wd); ctx.closePath(); ctx.fill();
    }
  });
}
function vignette(s = 0.75) { const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.22, W / 2, H * 0.5, H * 0.72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${s})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function grade(col, a) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(col, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }

// ---------- figures ----------
function limb(x0, y0, a, l1, a2, l2) {
  const x1 = x0 + Math.sin(a) * l1, y1 = y0 + Math.cos(a) * l1;
  const x2 = x1 + Math.sin(a + a2) * l2, y2 = y1 + Math.cos(a + a2) * l2;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); return [x2, y2];
}
function poly(pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }

// Profile human, feet at (0,0), ~190 units tall, facing +x.
function person(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = o.blur || 25; }
  ctx.fillStyle = ctx.strokeStyle = o.color || '#0a0604'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.rotate(o.lean || 0);
  ctx.lineWidth = 12;
  if (o.seated) { limb(0, -92, 1.5, 40, -1.5, 44); limb(4, -92, 1.4, 40, -1.4, 44); }
  else if (o.run != null) {
    const ph = o.run, a = Math.sin(ph) * 0.75;
    limb(0, -92, a, 46, Math.cos(ph) > 0 ? -0.15 : -1.0, 46);
    limb(0, -92, -a, 46, Math.cos(ph) > 0 ? -1.0 : -0.15, 46);
  } else { limb(-5, -92, 0.12, 46, -0.05, 46); limb(5, -92, -0.12, 46, 0.06, 46); }
  if (!o.seated) poly([[-18, -102], [18, -102], [28, -52], [-26, -55]]);
  poly([[-22, -150], [22, -150], [16, -97], [-16, -97]]);
  circle(-20, -146, 8); circle(20, -146, 8);
  ctx.fillRect(-5, -160, 10, 14);
  circle(2, -170, 15);
  if (o.knot) circle(-8, -186, 9);
  ctx.lineWidth = 9;
  const hl = limb(-12, -146, o.armL ?? -0.2, 34, o.elbL ?? 0.3, 32);
  const hr = limb(12, -146, o.armR ?? 0.25, 34, o.elbR ?? 0.3, 32);
  if (o.weapon === 'sword') {
    const a = (o.armR ?? 0.25) + (o.elbR ?? 0.3) + (o.swordOff ?? 0);
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hr[0], hr[1]); ctx.lineTo(hr[0] + Math.sin(a) * 90, hr[1] + Math.cos(a) * 90); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hr[0] - Math.cos(a) * 10, hr[1] + Math.sin(a) * 10); ctx.lineTo(hr[0] + Math.cos(a) * 10, hr[1] - Math.sin(a) * 10); ctx.stroke();
  }
  if (o.weapon === 'spear') {
    const a = o.spearA ?? 2.0;
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hr[0] - Math.sin(a) * 70, hr[1] - Math.cos(a) * 70); ctx.lineTo(hr[0] + Math.sin(a) * 190, hr[1] + Math.cos(a) * 190); ctx.stroke();
    const tx = hr[0] + Math.sin(a) * 190, ty = hr[1] + Math.cos(a) * 190;
    poly([[tx + Math.sin(a) * 22, ty + Math.cos(a) * 22], [tx + Math.cos(a) * 6, ty - Math.sin(a) * 6], [tx - Math.cos(a) * 6, ty + Math.sin(a) * 6]]);
  }
  if (o.shield) { circle(hl[0] + 6, hl[1] - 6, 28); }
  if (o.book) { ctx.save(); ctx.translate(hl[0], hl[1]); ctx.rotate(-0.3); ctx.fillRect(-4, -6, 46, 12); ctx.restore(); }
  if (o.crown) {
    ctx.fillStyle = o.crown; if (o.crownGlow) { ctx.shadowColor = o.crownGlow; ctx.shadowBlur = 40; }
    poly([[-14, -180], [16, -180], [18, -200], [11, -192], [6, -212], [0, -194], [-5, -210], [-10, -192], [-16, -202]]);
  }
  ctx.restore();
}
function horse(x, y, s, ph, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip ? -s : s, s);
  ctx.fillStyle = ctx.strokeStyle = o.color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = 10;
  for (const [lx, off] of [[48, 0], [34, 1.3], [-44, 2.6], [-58, 3.9]]) {
    const a = Math.sin(ph + off) * 0.75;
    limb(lx, -100, a, 40, (lx > 0 ? 0.9 : -0.9) * Math.max(0, Math.sin(ph + off + 1.2)), 42);
  }
  ctx.beginPath(); ctx.ellipse(0, -122, 74, 32, 0, 0, TAU); ctx.fill();
  poly([[38, -140], [66, -108], [100, -186], [76, -200]]);
  poly([[74, -202], [98, -194], [130, -152], [120, -140], [88, -168]]);
  poly([[80, -200], [86, -222], [92, -198]]);
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-70, -132); ctx.quadraticCurveTo(-110, -125 + Math.sin(ph * 2) * 10, -120, -80); ctx.stroke();
  for (let i = 0; i < 5; i++) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(78 - i * 6, -196 + i * 16); ctx.lineTo(62 - i * 6 - Math.sin(ph + i) * 6, -190 + i * 16); ctx.stroke(); }
  ctx.restore();
  if (o.rider) person(x + (o.flip ? -10 : 10) * s, y - 150 * s + 92 * s * 0.85, s * 0.85, { color: o.color, seated: true, flip: o.flip, weapon: 'sword', armR: 2.6 + Math.sin(ph) * 0.3, elbR: 0.2, armL: 0.6, shield: true, lean: 0.15 });
}
function elephant(x, y, s, ph, col, flip) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s); ctx.fillStyle = ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = 34;
  for (const [lx, o2] of [[-70, 0], [-30, 1.5], [40, 3], [75, 4.5]]) { const a = Math.sin(ph + o2) * 0.2; ctx.beginPath(); ctx.moveTo(lx, -110); ctx.lineTo(lx + Math.sin(a) * 100, -110 + 100 * Math.cos(a)); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(0, -160, 115, 78, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(110, -180, 52, 58, 0, 0, TAU); ctx.fill();
  ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(150, -165); ctx.quadraticCurveTo(170, -90 + Math.sin(ph) * 12, 140, -30); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(82, -175, 32, 48, 0.2, 0, TAU); ctx.fill();
  ctx.fillRect(-60, -275, 90, 45); poly([[-72, -272], [-15, -315], [42, -272]]);
  ctx.restore();
}
function temple(x, y, s, col, lit) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.fillRect(-100, -30, 200, 30); ctx.fillRect(-75, -130, 150, 100);
  let w = 170, yy = -130;
  for (let i = 0; i < 6; i++) { ctx.fillRect(-w / 2, yy - 10, w, 10); poly([[-w / 2 + 8, yy - 10], [-w / 2 + 20, yy - 38], [w / 2 - 20, yy - 38], [w / 2 - 8, yy - 10]]); yy -= 38; w *= 0.8; }
  ctx.beginPath(); ctx.ellipse(0, yy - 14, 24, 17, 0, 0, TAU); ctx.fill(); ctx.fillRect(-3, yy - 52, 6, 30); circle(0, yy - 54, 7);
  ctx.fillRect(-215, -90, 120, 12); for (let i = 0; i < 4; i++) ctx.fillRect(-208 + i * 32, -80, 10, 50); ctx.fillRect(-220, -32, 130, 32);
  if (lit) { ctx.fillStyle = lit; ctx.fillRect(-16, -95, 32, 65); }
  ctx.restore();
}
function palace(x, y, s, col, lit) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (lit) { ctx.fillStyle = lit; ctx.fillRect(-250, -150, 500, 110); ctx.fillRect(-150, -290, 300, 90); }
  ctx.fillStyle = col;
  ctx.fillRect(-300, -40, 600, 40);
  for (let i = 0; i <= 12; i++) ctx.fillRect(-260 + i * 42, -160, 14, 120);
  ctx.fillRect(-280, -175, 560, 22); poly([[-300, -175], [-240, -215], [240, -215], [300, -175]]);
  ctx.fillRect(-180, -215, 360, 15); for (let i = 0; i <= 8; i++) ctx.fillRect(-160 + i * 40, -300, 12, 90);
  ctx.fillRect(-180, -310, 360, 18); poly([[-200, -310], [-120, -360], [120, -360], [200, -310]]);
  poly([[-60, -360], [0, -420], [60, -360]]); circle(0, -428, 10);
  ctx.restore();
}
function palm(x, y, h, lean, col, t, seed) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = h * 0.035; ctx.beginPath(); ctx.moveTo(x, y);
  const tx = x + lean * h, ty = y - h; ctx.quadraticCurveTo(x + lean * h * 0.15, y - h * 0.6, tx, ty); ctx.stroke();
  ctx.lineWidth = h * 0.022;
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU + Math.sin(t * 1.5 + i + seed) * 0.07, L = h * 0.36;
    ctx.beginPath(); ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.4 - L * 0.3, tx + Math.cos(a) * L, ty + Math.sin(a) * L * 0.45 + L * 0.2); ctx.stroke();
  }
  ctx.restore();
}
function tree(x, y, h, col, seed, t) {
  const r = R(seed); ctx.save(); ctx.fillStyle = ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = h * 0.06; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.05, y - h * 0.4, x - h * 0.02, y - h * 0.6); ctx.stroke();
  for (let i = 0; i < 4; i++) { ctx.lineWidth = h * 0.02; ctx.beginPath(); ctx.moveTo(x, y - h * 0.45); ctx.lineTo(x + (r() - 0.5) * h * 0.7, y - h * (0.65 + r() * 0.2)); ctx.stroke(); }
  for (let i = 0; i < 26; i++) { const a = r() * TAU, d = Math.sqrt(r()) * h * 0.42; circle(x + Math.cos(a) * d * 1.2 + Math.sin(t + i) * 2, y - h * 0.78 + Math.sin(a) * d * 0.6, h * (0.1 + r() * 0.1)); }
  ctx.restore();
}
function flag(x, y, pole, w, h, t, colors, poleCol = '#140a04') {
  ctx.save(); ctx.strokeStyle = poleCol; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - pole); ctx.stroke();
  const top = y - pole, n = colors.length;
  for (let k = 0; k < n; k++) {
    ctx.beginPath();
    const y0 = top + k * h / n, y1 = top + (k + 1) * h / n;
    for (let i = 0; i <= 24; i++) { const u = i / 24; ctx.lineTo(x + u * w, y0 + Math.sin(u * 5 - t * 6) * u * h * 0.2); }
    for (let i = 24; i >= 0; i--) { const u = i / 24; ctx.lineTo(x + u * w, y1 + Math.sin(u * 5 - t * 6) * u * h * 0.2); }
    ctx.closePath(); ctx.fillStyle = colors[k]; ctx.fill();
  }
  ctx.restore();
}
function lion(x, y, s, o) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = ctx.strokeStyle = o.color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.rim) { ctx.shadowColor = o.rim; ctx.shadowBlur = o.blur || 40; }
  const sw = Math.sin(o.t * 2) * 6;
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-120, -40); ctx.bezierCurveTo(-200, -30, -215, -150, -165, -190 + sw); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-162, -200 + sw, 16, 26, 0.4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-75, -75, 78, 76, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-135, -40); ctx.lineTo(-110, -140); ctx.quadraticCurveTo(-20, -190, 60, -235); ctx.lineTo(115, -150); ctx.lineTo(100, -40); ctx.lineTo(60, 0); ctx.lineTo(-145, 0); ctx.closePath(); ctx.fill();
  ctx.fillRect(40, -150, 34, 150); ctx.fillRect(80, -150, 32, 150);
  ctx.beginPath(); ctx.ellipse(70, -9, 28, 12, 0, 0, TAU); ctx.ellipse(116, -9, 28, 12, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-20, -11, 42, 13, 0, 0, TAU); ctx.fill();
  const hx = 78, hy = -258;
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = (i % 2 ? 102 : 72) + Math.sin(i * 2.3) * 9; ctx.lineTo(hx - 18 + Math.cos(a) * r * 0.92, hy + 5 + Math.sin(a) * r); }
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + 22, hy, 56, 48, 0, 0, TAU); ctx.fill();
  poly([[hx + 40, hy - 32], [hx + 112, hy - 18], [hx + 122, hy + 6], [hx + 50, hy + 12]]);
  ctx.save(); ctx.translate(hx + 50, hy + 8); ctx.rotate(o.jaw || 0); poly([[0, -2], [64, 6], [58, 24], [0, 28]]); ctx.restore();
  poly([[hx + 2, hy - 40], [hx + 14, hy - 78], [hx + 32, hy - 42]]);
  ctx.restore();
  if (o.eye) additive(() => { glow(x + (hx + 62) * s, y + (hy - 14) * s, 26 * s, [255, 200, 80], o.eye); });
}

// ---------- scenes ----------
function s1(t, d) { // aerial forest sunrise
  const p = t / d;
  fillAll(vgrad([[0, '#0a1424'], [0.25, '#2c2f4c'], [0.42, '#b9643a'], [0.5, '#f7b45c'], [0.56, '#d98a4a'], [1, '#0c1a10']]));
  const sunY = 930 - p * 110;
  additive(() => { glow(540, sunY, 800, [255, 160, 70], 0.5); glow(540, sunY, 150, [255, 240, 205], 1); });
  rays(540, sunY, 26, 1700, t, [255, 200, 130], 0.07);
  ctx.save(); cam(1 + 0.14 * ease(p), 540, 1000);
  const L = [[1000, 50, '#6a5868', 0.4], [1060, 80, '#41474f', 1], [1160, 110, '#283a2e', 1.8], [1320, 140, '#182a1a', 3], [1540, 170, '#0b160b', 5]];
  L.forEach(([b, a, col, par], i) => {
    ridge(b, a, i * 1.7 + 1, col, t * 18 * par, i ? 12 + i * 7 : 0, 60 + i * 22);
    mist(b + 10, 110, [255, 205, 165], 0.22 / (1 + i * 0.4));
  });
  // birds
  ctx.strokeStyle = '#120c0a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const bx = 120 + i * 95 + t * 60 + Math.sin(i) * 30, by = 640 + Math.sin(i * 2.1) * 70 - t * 8, f = Math.sin(t * 9 + i) * 10, sz = 14 + (i % 3) * 4;
    ctx.beginPath(); ctx.moveTo(bx - sz, by - f); ctx.quadraticCurveTo(bx - sz / 2, by - 4, bx, by); ctx.quadraticCurveTo(bx + sz / 2, by - 4, bx + sz, by - f); ctx.stroke();
  }
  ctx.restore();
  particles(11, 50, t, { area: [0, 700, W, 1500], size: 3, vx: 12, vy: -6, alpha: 0.25, col: [255, 220, 170] });
  grade([255, 170, 80], 0.25); vignette(0.7);
}

function s2(t, d) { // Mayurasharma: scholar -> king
  const p = t / d;
  fillAll(vgrad([[0, '#1a0a06'], [0.3, '#6a2810'], [0.48, '#e98a36'], [0.55, '#ffd07a'], [0.62, '#7a3812'], [1, '#120604']]));
  additive(() => { glow(600, 1000, 900, [255, 140, 50], 0.45); glow(600, 1000, 180, [255, 235, 190], 0.9); });
  rays(600, 1000, 30, 1800, t, [255, 190, 110], 0.08);
  ctx.save(); cam(1 + 0.14 * ease(p), 600, 900);
  ridge(1080, 50, 3.3, '#5a2a18', t * 6, 0);
  // distant fort with battlements
  ctx.fillStyle = '#3e1c10'; ctx.fillRect(700, 960, 330, 120);
  for (let i = 0; i < 12; i++) ctx.fillRect(700 + i * 28, 940, 16, 22);
  ctx.fillRect(760, 880, 60, 90); ctx.fillRect(930, 890, 50, 80);
  flag(790, 880, 90, 60, 36, t, ['#ffcc1f', '#c0262a'], '#3e1c10');
  ridge(1200, 60, 7.1, '#2a0e06', t * 10, 14, 120);
  tree(150, 1460, 900, '#140604', 5, t);
  // cliff
  ctx.fillStyle = '#0c0402'; poly([[-100, 1560], [300, 1500], [760, 1520], [1180, 1640], [1180, 2000], [-100, 2000]]);
  const raise = ease((p - 0.12) / 0.45);
  const crown = clamp((p - 0.55) / 0.12);
  person(640, 1525, 3.5, {
    color: '#0c0503', rim: '#ffb347', blur: 30, knot: crown < 0.5, weapon: 'sword', book: true,
    armR: 0.25 + raise * 2.75, elbR: 0.25 - raise * 0.25, armL: 0.45, elbL: 1.1,
    crown: crown > 0 ? `rgba(255,205,90,${crown})` : null, crownGlow: '#ffd060'
  });
  if (crown > 0 && crown < 1) additive(() => glow(647, 900, 450, [255, 210, 120], Math.sin(crown * Math.PI) * 0.8));
  // sword glint
  if (raise > 0.95) additive(() => glow(605, 600, 130, [255, 240, 200], 0.6 + 0.3 * Math.sin(t * 10)));
  ctx.restore();
  particles(22, 70, t, { area: [0, 300, W, 1900], size: 3.5, vx: 15, vy: -120, alpha: 0.55, col: [255, 150, 50], flicker: true });
  grade([255, 140, 60], 0.3); vignette(0.75);
}

function s3(t, d) { // battle with the Pallavas
  const p = t / d;
  const dx = Math.sin(t * 37) * 7, dy = Math.cos(t * 29) * 6;
  fillAll(vgrad([[0, '#1e0604'], [0.3, '#7a200c'], [0.5, '#e2702c'], [0.56, '#f3a55a'], [0.62, '#5a1a0a'], [1, '#0a0201']]));
  additive(() => { glow(820, 1030, 700, [255, 110, 40], 0.5); glow(820, 1030, 120, [255, 220, 170], 0.9); });
  ctx.save(); cam(1.05 + 0.08 * p, 540, 1100, dx, dy);
  ridge(1120, 40, 2.2, '#5a1e10', 0, 10, 140);
  mist(1130, 160, [255, 170, 100], 0.35);
  // Pallava army in the distance, moving left
  const r = R(7);
  for (let i = 0; i < 2; i++) elephant(((260 + i * 520 - t * 40) % 1300 + 1300) % 1300 - 100, 1190, 0.42, t * 4 + i, '#4a1a10', true);
  for (let i = 0; i < 28; i++) {
    const bx = ((r() * 1300 - t * 90) % 1300 + 1300) % 1300 - 110;
    person(bx, 1195 + r() * 20, 0.75 + r() * 0.15, { color: '#43170d', flip: true, run: t * 12 + i, weapon: 'spear', spearA: 2.3, armR: 1.4, elbR: 0.5, shield: r() > 0.5 });
  }
  flag(200 - t * 40, 1180, 160, 70, 40, t, ['#7a2a10']); flag(780 - t * 40, 1180, 170, 70, 40, t + 1, ['#7a2a10']);
  mist(1250, 200, [240, 140, 80], 0.4);
  // Kadamba warriors charging right
  const r2 = R(19);
  for (let i = 0; i < 16; i++) {
    const bx = ((r2() * 1500 + t * 300) % 1500 + 1500) % 1500 - 200;
    const sc = 1.7 + r2() * 0.5;
    person(bx, 1470 + r2() * 60, sc, { color: '#1e0804', run: t * 14 + i * 1.7, lean: 0.12, weapon: r2() > 0.4 ? 'sword' : 'spear', armR: 2.4 + Math.sin(t * 8 + i) * 0.4, elbR: 0.3, spearA: 1.9, armL: 0.8, shield: true });
  }
  flag(((300 + t * 300) % 1500) - 200, 1470, 330, 120, 70, t, ['#ffcc1f', '#c0262a'], '#1e0804');
  ridge(1560, 20, 4.4, '#140402', 0, 0);
  mist(1560, 220, [200, 110, 60], 0.45);
  // cavalry in the foreground
  for (let i = 0; i < 3; i++) horse(((i * 620 + t * 560) % 1860) - 400, 1960, 3.1, t * 13 + i * 2, { color: '#080201', rider: true });
  ctx.restore();
  // arrows
  ctx.strokeStyle = 'rgba(20,6,2,0.9)'; ctx.lineWidth = 4;
  const r3 = R(31);
  for (let i = 0; i < 14; i++) {
    const ph = ((t * 0.9 + r3()) % 1), x0 = 1150 - ph * 1300, y0 = 500 + r3() * 300 + Math.pow(ph - 0.5, 2) * 500;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + 60, y0 - 12); ctx.stroke();
  }
  particles(41, 90, t, { area: [0, 900, W, 1900], size: 6, vx: 200, vy: -20, alpha: 0.18, col: [255, 170, 100] });
  particles(42, 50, t, { area: [0, 400, W, 1900], size: 3, vx: 60, vy: -150, alpha: 0.6, col: [255, 130, 40], flicker: true });
  grade([255, 90, 40], 0.35); vignette(0.8);
}

function s4(t, d) { // Banavasi capital
  const p = t / d;
  const water = 1330;
  fillAll(vgrad([[0, '#13283a'], [0.3, '#6a6a6a'], [0.5, '#f0a050'], [0.62, '#ffd890'], [0.7, '#2a3a30'], [1, '#081008']]));
  additive(() => { glow(230, 960, 700, [255, 170, 70], 0.55); glow(230, 960, 110, [255, 240, 200], 1); });
  rays(230, 960, 22, 1600, t, [255, 210, 140], 0.07);
  ctx.save(); cam(1.08 + 0.06 * p, 540, 1150);
  const city = (alpha) => {
    ridge(1150, 60, 1.4, `rgba(60,80,70,${alpha})`, t * 15, 14, 100);
    const sh = -t * 70;
    ctx.save(); ctx.translate(sh, 0);
    const lit = 'rgba(255,190,90,0.9)';
    temple(80, 1300, 1.1, '#18110a', lit); temple(820, 1300, 0.85, '#1a120a', lit); temple(1180, 1300, 1.0, '#18110a', lit);
    palace(470, 1300, 1.05, '#120b06', 'rgba(255,170,70,0.75)');
    flag(330, 1100, 120, 80, 46, t, ['#ffcc1f', '#c0262a'], '#120b06'); flag(610, 1100, 120, 80, 46, t + 0.5, ['#ffcc1f', '#c0262a'], '#120b06');
    for (let i = 0; i < 9; i++) palm(-150 + i * 160 + (i % 2) * 40, 1320, 200 + (i % 3) * 50, (i % 2 ? 0.12 : -0.1), '#0c0a06', t, i);
    ctx.fillStyle = '#0c0a06'; ctx.fillRect(-300, 1300, W + 900, 40);
    ctx.restore();
  };
  city(1);
  // reflection in the Varada river
  ctx.save(); ctx.beginPath(); ctx.rect(-300, water, W + 600, H); ctx.clip();
  ctx.fillStyle = vgrad([[0, '#c08040'], [0.4, '#4a3a2a'], [1, '#0a0c08']], water, H); ctx.fillRect(-300, water, W + 600, H);
  ctx.save(); ctx.globalAlpha = 0.45; ctx.translate(0, water * 2 + 20); ctx.scale(1, -1); city(0.5); ctx.restore();
  ctx.strokeStyle = 'rgba(255,215,150,0.35)'; ctx.lineWidth = 3;
  for (let i = 0; i < 40; i++) { const y = water + 20 + i * 14 + (i * i) % 7; const x = ((i * 137 + t * 40) % 1300) - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60 + (i % 5) * 20, y); ctx.stroke(); }
  ctx.restore();
  // foreground palms (fast parallax)
  palm(-60 - t * 140 + 200, 1950, 700, 0.18, '#040402', t, 3); palm(1150 - t * 140, 1950, 760, -0.2, '#040402', t, 9);
  ctx.restore();
  particles(51, 40, t, { area: [0, 800, W, 1400], size: 3, vx: -20, vy: -10, alpha: 0.3, col: [255, 220, 160] });
  grade([255, 180, 90], 0.25); vignette(0.7);
}

function kingFront(x, y, s, col, gold, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.shadowColor = gold; ctx.shadowBlur = 30;
  ctx.fillRect(-60, -10, 120, 30); // lap
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-35, 10); ctx.lineTo(-40, 110); ctx.moveTo(35, 10); ctx.lineTo(42, 110); ctx.stroke();
  poly([[-62, -150], [62, -150], [48, 0], [-48, 0]]);
  circle(-62, -140, 20); circle(62, -140, 20);
  ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-70, -135); ctx.lineTo(-95, -60); ctx.lineTo(-100, 0); ctx.moveTo(70, -135); ctx.lineTo(95, -60); ctx.lineTo(80, -10); ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(85, 20); ctx.lineTo(115, -170); ctx.stroke(); // sceptre
  ctx.fillRect(-12, -175, 24, 30); circle(0, -200, 34);
  ctx.fillStyle = gold; poly([[-34, -222], [34, -222], [38, -258], [24, -240], [14, -275], [0, -246], [-14, -275], [-24, -240], [-38, -258]]);
  circle(115, -178, 10);
  ctx.restore();
}
function s5(t, d) { // Kakusthavarma's court
  const p = t / d, vx = 540, vy = 980;
  fillAll('#0e0603');
  additive(() => glow(vx, 900, 760, [255, 170, 60], 0.55));
  ctx.save(); cam(1 + 0.2 * ease(p), vx, 960);
  // floor and carpet
  ctx.fillStyle = vgrad([[0, '#3a1e0a'], [1, '#0a0402']], vy, H); ctx.fillRect(-300, vy, W + 600, H);
  ctx.fillStyle = '#4a0a0a'; poly([[vx - 70, vy], [vx + 70, vy], [vx + 420, H + 100], [vx - 420, H + 100]]);
  ctx.strokeStyle = 'rgba(255,190,80,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(vx - 60, vy); ctx.lineTo(vx - 400, H + 100); ctx.moveTo(vx + 60, vy); ctx.lineTo(vx + 400, H + 100); ctx.stroke();
  // back wall arch and halo
  ctx.fillStyle = '#2a1206'; ctx.fillRect(vx - 330, vy - 520, 660, 520);
  additive(() => { glow(vx, vy - 230, 380, [255, 200, 90], 0.75); });
  ctx.strokeStyle = 'rgba(255,210,110,0.85)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(vx, vy - 230, 150 + Math.sin(t * 2) * 3, 0, TAU); ctx.stroke();
  // dais and throne
  ctx.fillStyle = '#1a0a04'; for (let i = 0; i < 3; i++) ctx.fillRect(vx - 200 + i * 30, vy - 30 + i * 12 - 36, 400 - i * 60, 14);
  ctx.fillStyle = '#100602'; ctx.beginPath(); ctx.moveTo(vx - 120, vy - 60); ctx.lineTo(vx - 120, vy - 330); ctx.quadraticCurveTo(vx, vy - 440, vx + 120, vy - 330); ctx.lineTo(vx + 120, vy - 60); ctx.fill();
  ctx.fillRect(vx - 160, vy - 170, 40, 110); ctx.fillRect(vx + 120, vy - 170, 40, 110);
  kingFront(vx, vy - 150, 0.95, '#0a0402', '#ffc84a', t);
  // pillars in perspective with lamps
  for (let i = 5; i >= 0; i--) {
    const z = 1 + i * 0.75, xo = 780 / z, floor = vy + 940 / z, ph = 2100 / z, w = 120 / z;
    for (const side of [-1, 1]) {
      const px = vx + side * xo;
      ctx.fillStyle = '#0a0402'; ctx.fillRect(px - w / 2, floor - ph, w, ph);
      ctx.fillRect(px - w * 0.8, floor - ph * 0.62, w * 1.6, 18 / z); ctx.fillRect(px - w * 0.8, floor - 30 / z, w * 1.6, 30 / z);
      ctx.fillStyle = 'rgba(255,180,80,0.35)'; ctx.fillRect(side < 0 ? px + w / 2 - 6 / z : px - w / 2, floor - ph, 6 / z, ph);
      const fl = 0.75 + 0.25 * Math.sin(t * 11 + i * 3 + side);
      additive(() => { glow(px - side * w * 0.9, floor - ph * 0.45, 160 / z, [255, 160, 60], 0.8 * fl); glow(px - side * w * 0.9, floor - ph * 0.45, 22 / z, [255, 240, 200], fl); });
      if (i < 4) person(vx + side * (xo - 150 / z), floor, 2.6 / z, { color: '#080301', flip: side > 0, armR: 0.5, elbR: 0.9, armL: 0.2 });
    }
  }
  ctx.restore();
  rays(vx, 0, 7, 1500, 0, [255, 220, 150], 0.09, 0.5, Math.PI / 2 - 0.25, 0);
  particles(61, 60, t, { area: [200, 200, 880, 1500], size: 2.5, vx: 8, vy: -12, alpha: 0.35, col: [255, 220, 150] });
  grade([255, 170, 60], 0.3); vignette(0.8);
}

function s6(t, d) { // Kadamba lion emblem finale
  const p = t / d, cx = 560, cy = 760;
  fillAll(vgrad([[0, '#2a0404'], [0.3, '#a01a10'], [0.45, '#f08a2a'], [0.52, '#ffd060'], [0.62, '#7a1a08'], [1, '#100202']]));
  additive(() => { glow(cx, cy, 950, [255, 150, 40], 0.6); glow(cx, cy, 200, [255, 240, 190], 0.9); });
  rays(cx, cy, 36, 1900, t, [255, 210, 110], 0.1, TAU, 0, 0.08);
  ctx.save(); cam(1 + 0.12 * ease(p), 540, 1100);
  ridge(1180, 30, 6.6, '#4a0e06', 0, 0);
  palace(540, 1240, 1.25, '#200604', 'rgba(255,170,60,0.6)');
  flag(120, 1300, 520, 200, 120, t, ['#ffcc1f', '#c0262a'], '#140402');
  flag(940, 1300, 560, 200, 120, t + 0.7, ['#ffcc1f', '#c0262a'], '#140402');
  mist(1230, 160, [255, 160, 80], 0.35);
  // pedestal
  ctx.fillStyle = '#120402';
  ctx.fillRect(250, 1380, 580, 70); ctx.fillRect(220, 1450, 640, 80); ctx.fillRect(170, 1530, 740, 500);
  ctx.fillStyle = 'rgba(255,190,90,0.35)'; ctx.fillRect(250, 1380, 580, 5); ctx.fillRect(220, 1450, 640, 5); ctx.fillRect(170, 1530, 740, 5);
  const roar = clamp((p - 0.15) / 0.12) - clamp((p - 0.45) / 0.15) * 0.7;
  lion(470, 1382, 2.3, { color: '#120402', rim: '#ffb040', blur: 55, t, jaw: 0.08 + roar * 0.42, eye: 0.6 + 0.4 * Math.sin(t * 3) });
  ctx.restore();
  particles(71, 90, t, { area: [0, 200, W, 1900], size: 3.5, vx: 20, vy: -90, alpha: 0.5, col: [255, 200, 80], flicker: true });
  if (p > 0.82) additive(() => glow(540, 960, 1100, [255, 200, 90], (p - 0.82) / 0.18 * 0.35));
  grade([255, 120, 40], 0.3); vignette(0.75);
}

const SCENES = [null, s1, s2, s3, s4, s5, s6];
function drawScene(k, t, d) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  SCENES[k](t, d);
}
