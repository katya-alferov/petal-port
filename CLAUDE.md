# CLAUDE.md: Petalport

A colorful, offline, single-player virtual-life game (dress-up, home, café job, cooking, travel, photos) for children aged 7–13, built as a mobile-first web app for iPhone Safari that also works on desktop.

**Specs (read before changing behavior):** `docs/PRD.md` (scope + acceptance criteria) · `docs/game-systems.md` (rules and numbers) · `docs/data-model.md` (types, state, persistence, architecture) · `docs/visual-design.md` (UI and art rules) · `docs/implementation-plan.md` (milestones, tasks, tests). Background research: `docs/research.md`, `docs/game-concept.md`, `docs/technical-options.md`, `docs/roadmap.md`.

## Status

Phase 2 spec (revision 2) is awaiting the owner's approval. **Don't write application code beyond an approved milestone.** Work one milestone at a time (M0 → M5) and stop at each gate for review. Target: **public release** from a public GitHub repo on GitHub Pages; the owner's children playtest at M3 and M5; future AI agents will test it (implementation-plan §12).

## Hard rules (never break)

- **No network after first load, except optional cloud save** (owner-approved, `docs/accounts.md`: nickname + password only, guests make zero calls, only `src/platform/cloud.ts` touches the network). No analytics, ads, other external APIs, CDNs, or paid services. Fonts and assets are self-hosted.
- **No monetization or manipulation:** no IAP, premium currency, loot boxes, spin wheels, random rewards, energy, streaks, countdowns, expiring offers, or "come back or lose it".
- **No chat, sharing to others, camera, mic, or location.** Photos leave the device only via the player's "Save to my device".
- **Original art only** for characters, clothing, homes, scenes and landmarks. No traced photos, no assets from other games, no third-party characters. Third-party audio/icons/fonts only if CC0, CC-BY (credited), OFL, MIT or ISC, and listed in `src/content/credits.ts`.
- **Eiffel Tower:** original stylized drawing, daytime or golden hour, no logos, never the illuminated night display.
- **Every element that looks tappable must do something** (feedback ≤ 100 ms). Scenery must not look tappable.
- **Jobs and activities are real gameplay**, never a button that grants coins.
- **Kind failure:** mistakes wobble and show the right answer; nothing is taken away; no time limits in standard play.

## Architecture

- React + TypeScript (strict) + Vite. Art is SVG React components. Zustand store. IndexedDB via idb-keyval. Motion for gestures/springs. vite-plugin-pwa for offline.
- Folders and import rules (lint-enforced): `scenes → ui, art, state, game, content, platform`; `state → game, content, platform`; `game` and `art` import only types from `content`; `ui` knows nothing about the game.
- `src/game/` is **pure**: no React, DOM, storage, `Date.now()` or `Math.random()` (inject time and a seeded RNG).
- **Content is data:** items, prices, recipes, menus, locations and destinations live in `src/content/`. Numbers must match `docs/game-systems.md`; change both together.
- Content IDs are permanent. Renaming or removing one needs a save migration plus a fixture test.
- Only `SaveGame` (plus the photo store) is persisted. Activity state (shift, recipe, photo) stays in scene reducers. Photo bytes are stored as ArrayBuffer, not Blob.
- Art components take colors via a `colors` prop. Photo mode renders with resolved hex values (no `var(`) because CSS variables are lost when SVG is drawn to canvas.
- Rig layers: back arm under torso clothing, front arm above outerwear/bag/neck (`docs/game-systems.md` §1.2).
- Swipe-back: one sentinel history entry; on `popstate` re-push it and run in-game Back.
- Test hooks (`?seed=`, `?fixture=`) exist only in preview builds. Every hotspot and primary control has a stable `data-testid`.
- Saves: debounced write to `save:current` after copying to `save:previous`; validate before every write; never overwrite an unreadable save automatically.

## UI & art rules (short form of `docs/visual-design.md`)

- Tokens only: use CSS variables from the palette; bright fills carry `--ink` text; white text only on `--sea-deep` or `--ink`.
- Fonts: Fredoka (display, buttons), Nunito (labels, body). Body ≥ 17 px, labels ≥ 20 px.
- Targets ≥ 44 px; primary actions ≥ 56 px and in the bottom 40%. One primary button per screen.
- Respect safe areas (`viewport-fit=cover`, `env(safe-area-inset-*)`, `100dvh`). Portrait only on phones; portrait stage on desktop.
- Animate only `transform` and `opacity`; honor `prefers-reduced-motion` and the parent override.
- Every drag has a tap and keyboard alternative. Color is never the only signal.
- Art: plum outline `#5B4A6E`, three-tone shading, light from the top-left, rounded shapes. Rig viewBox 400×800; scenes 1170×2532. No `<foreignObject>`, filters or external images in art used by photo mode.
- Build art from `src/art/kit/`, compare against the golden references, and keep the art lint green (`docs/visual-design.md` §13). Credit our art as "original, AI-assisted".

## Commands (once scaffolded in M0)

- `npm run dev` (desktop only; the iPhone reviews the HTTPS Pages deploy, because plain-HTTP LAN isn't a secure context)
- `npm test` (Vitest: rules, content lint, balance, components)
- `npm run e2e` (Playwright: WebKit iPhone 13, WebKit 375×667, Chromium desktop)
- `npm run build` (must stay within the budgets in `docs/implementation-plan.md` §8)
- `npm run screens` (screenshots of every scene for review by the owner or an agent)

## Definition of done

Acceptance criteria pass with the named test type; works at 375×667, 390×844 and desktop (mouse + keyboard); reduced motion checked; no new network calls; new art passes the art lint and is credited; deployed to Pages with a matching version label.

## Allowed dependencies

Runtime: react, react-dom, zustand, idb-keyval, motion, @fontsource/fredoka, @fontsource/nunito.
Dev: vite, typescript, @vitejs/plugin-react, vite-plugin-pwa, vitest, @testing-library/react, jsdom, @playwright/test, @axe-core/playwright, eslint, prettier.
CI/hosting: GitHub Actions + GitHub Pages (free for public repos). The repo is public, so never commit secrets or personal data.
Adding anything else needs the owner's OK and an update here.

## Working with the owner

- The owner reviews on an iPhone via the Pages URL; assume no Mac (no Safari Web Inspector). The owner can paste you the debug overlay's Copy log output.
- Stop at every milestone gate, summarize what changed, and ask before starting the next milestone.
- When a spec is ambiguous, follow the PRD, then game-systems; note the choice in your summary.
