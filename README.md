# Petalport

A colorful, offline, single-player virtual-life game for children aged 7–13: dress up, decorate your home, work fun jobs, cook and travel. It runs in iPhone Safari and on desktop. It has no ads, no chat, no accounts and no purchases, and nothing leaves the device.

**Status:** Milestone 0 (foundations and art bar). See [`docs/implementation-plan.md`](docs/implementation-plan.md).

## Play

- **Live build:** GitHub Pages (deployed from `main` by CI).
- **On your iPhone:** open the Pages link in Safari, then Share → Add to Home Screen. Saves are kept on the device; Safari can clear site data after 7 days without a visit unless the game is on the Home Screen.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # unit, content, architecture and art-lint tests (Vitest)
npm run e2e            # Playwright: WebKit iPhone 13 / iPhone SE, Chromium desktop
npm run build          # production build (PWA, offline)
```

`npm run e2e` saves screenshots of every main scene to `test-results/screens/<project>/`, so a person or an AI agent can review how the game looks at iPhone size. CI uploads them as the `e2e-screens` artifact on every push.

Preview builds (`npm run build:preview`) accept test hooks: `?fixture=fresh` (start from a new save) and `?scene=me|home|gallery` (jump to a scene). Production builds compile them out.

## Docs

The specs are in [`docs/`](docs/): PRD, game systems, data model, visual design, implementation plan and the research behind them. [`CLAUDE.md`](CLAUDE.md) holds the rules for anyone (human or AI) changing the code.

## Credits

All characters, clothing, rooms and scenes are original SVG art made for Petalport. Fonts: Fredoka and Nunito (SIL Open Font License 1.1), self-hosted via Fontsource.
