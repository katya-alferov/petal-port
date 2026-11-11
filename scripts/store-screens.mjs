// Phone screenshots for the Google Play listing (1080×1920, portrait). Needs a preview build:
//   npm run build:preview && npx vite preview --port 4173 &   then   node scripts/store-screens.mjs
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const SCENES = ['title', 'me', 'town', 'home', 'cafe', 'kitchen', 'boutique', 'paris'];

mkdirSync('store/play/screenshots', { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
for (const [i, scene] of SCENES.entries()) {
  await page.goto(`${BASE}?fixture=fresh${scene === 'title' ? '' : `&scene=${scene}`}`);
  await page.waitForTimeout(1800);
  const path = `store/play/screenshots/${String(i + 1).padStart(2, '0')}-${scene}.png`;
  await page.screenshot({ path });
  console.log(path);
}
await browser.close();
