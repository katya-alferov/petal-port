// Renders the Petalport flower into every icon size the Android app, the PWA manifest and the
// Google Play listing need. Run with `node scripts/store-assets.mjs` (uses the dev Playwright Chromium).
// Store screenshots come from `node scripts/store-screens.mjs`.
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const SEA = '#3BB7C4';
const CREAM = '#FFF7EC';
const FLOWER = `<g stroke="#5B4A6E" stroke-width="3" stroke-linejoin="round">
  <path d="M32 10c7 6 7 14 0 20-7-6-7-14 0-20z" fill="#FF7BA9"/>
  <path d="M54 32c-6 7-14 7-20 0 6-7 14-7 20 0z" fill="#FFC94A"/>
  <path d="M32 54c-7-6-7-14 0-20 7 6 7 14 0 20z" fill="#7ED6A7"/>
  <path d="M10 32c6-7 14-7 20 0-6 7-14 7-20 0z" fill="#B39DFF"/>
  <circle cx="32" cy="32" r="6" fill="${CREAM}"/></g>`;

// scale: how much of the canvas the 64-unit flower box fills (the flower itself is ~75% of that box).
function svg({ bg, rx = 0, scale = 1 }) {
  const off = (64 - 64 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    ${bg ? `<rect width="64" height="64" rx="${rx}" fill="${bg}"/>` : ''}
    <g transform="translate(${off} ${off}) scale(${scale})">${FLOWER}</g></svg>`;
}

const out = [];
const add = (path, size, opts) => out.push({ path, w: size, h: size, html: svg(opts) });

// PWA: a maskable icon keeps the flower inside the 80% safe circle.
add('public/icon-maskable-512.png', 512, { bg: SEA, scale: 0.78 });

// Android launcher: legacy square icon per density, and the adaptive-icon foreground (108dp canvas,
// art inside the middle 66dp) over a sea-coloured background layer.
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(dens)) {
  add(`android/app/src/main/res/mipmap-${d}/ic_launcher.png`, 48 * k, { bg: SEA, rx: 14, scale: 0.92 });
  add(`android/app/src/main/res/mipmap-${d}/ic_launcher_foreground.png`, 108 * k, { scale: 0.68 });
}
add('android/app/src/main/res/drawable/splash.png', 384, { scale: 1 });

// Google Play listing icon: 512×512, square (Play rounds the corners itself).
add('store/play/icon-512.png', 512, { bg: SEA, scale: 0.92 });

// Feature graphic 1024×500.
out.push({
  path: 'store/play/feature-graphic.png',
  w: 1024,
  h: 500,
  html: `<div style="width:1024px;height:500px;display:flex;align-items:center;gap:40px;padding:0 70px;box-sizing:border-box;
      background:linear-gradient(160deg,#8EE3EA 0%,${SEA} 55%,#2A8FA0 100%);font-family:'Fredoka',sans-serif;">
    <div style="width:300px;height:300px;flex:none;background:${CREAM};border-radius:72px;border:6px solid #5B4A6E;
        box-shadow:0 14px 0 rgba(91,74,110,.25)">${svg({ scale: 0.9 })}</div>
    <div style="color:#2E2340">
      <div style="font-size:112px;font-weight:700;line-height:1;color:${CREAM};-webkit-text-stroke:4px #5B4A6E;paint-order:stroke fill">
        Petal<span style="color:#FFC94A">port</span></div>
      <div style="margin-top:22px;font-size:38px;font-weight:600;white-space:nowrap;background:${CREAM};display:inline-block;
          padding:10px 24px;border-radius:999px;border:4px solid #5B4A6E">Your pocket seaside town</div>
      <div style="margin-top:18px;font-size:30px;font-weight:500;color:#2E2340">Dress up · Decorate · Cook · Travel</div>
    </div></div>`,
});

const fontCss = (w) =>
  `@font-face{font-family:'Fredoka';font-weight:${w};src:url(data:font/woff2;base64,${readFileSync(
    `node_modules/@fontsource/fredoka/files/fredoka-latin-${w}-normal.woff2`,
  ).toString('base64')})}`;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const o of out) {
  await page.setViewportSize({ width: o.w, height: o.h });
  await page.setContent(
    `<style>${[500, 600, 700].map(fontCss).join('')}html,body{margin:0;width:${o.w}px;height:${o.h}px;overflow:hidden;background:transparent}svg{display:block}</style>${o.html}`,
  );
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(o.path), { recursive: true });
  await page.screenshot({ path: o.path, omitBackground: true });
  console.log(o.path, `${o.w}×${o.h}`);
}
await browser.close();
