# Technical Options & Recommended Architecture

**Date:** 25 Oct 2026
**Versions:** package versions and licenses come from the npm registry on that date.
**Tags:** **[V]** verified in a cited source, **[H]** hypothesis, **[R]** recommendation. Sources are listed in [research.md §9](research.md#9-sources-all-accessed-25-oct-2026).

---

## 1. What the game actually needs to render

Before choosing tools, here is the workload, so we don't pick an engine because "games use engines":

| Feature                                  | Rendering need                                           | Interaction need                |
| ---------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| Dress-up                                 | ~15 stacked vector layers on one character, recolourable | Tap swatches, carousels         |
| Home decorating                          | ~10–40 objects in a 2D room                              | Drag, drop, flip, z-order       |
| City map                                 | One large illustrated scene, scroll/pan, ~10 hotspots    | Tap, scroll                     |
| Job mini-games (café, boutique, florist) | Tens of objects, simple tweens                           | Drag-and-drop, sequence, timing |
| Photo studio                             | Compose layers → export PNG                              | Tap, drag stickers              |
| Menus, shop, album, settings             | Text, grids, buttons                                     | Accessible UI                   |

**[H] Conclusion:** this is overwhelmingly **UI + layered vector art + drag-and-drop**. Nothing in v1 needs physics, hundreds of moving sprites, tilemaps or shaders. That is the territory where a DOM/SVG approach is strongest and a canvas engine adds cost.

---

## 2. Options compared

### Option A: React + TypeScript + SVG/CSS (recommended)

- **Stack:**
  - React 19.3 (MIT)
  - TypeScript 7.0 (Apache-2.0)
  - Vite 8.3 (MIT)
  - Characters and scenes as inline SVG components
  - Motion via CSS transforms and the Motion library 14.6 (MIT)
- **Pros:**
  - Text, layout, buttons and accessibility come free.
  - Each clothing item is an SVG `<g>` whose fills bind to CSS variables, so recolouring is trivial.
  - Hit-testing on irregular shapes is native (`pointer-events` on paths).
  - Fastest iteration with Claude Code [H].
  - Smallest dependency surface.
- **Cons:**
  - Performance degrades with very many simultaneously animated nodes or heavy SVG filters.
  - Must stick to transform/opacity animations and avoid animating filters or blur on iPhone [H].
  - Particle-heavy effects need a small canvas overlay.

### Option B: Phaser 4 (+ React shell)

- **Facts:**
  - Phaser 4.2.1 (MIT) [V npm].
  - Vendor claims a new GPU renderer with large sprite throughput, and a Phaser 3-compatible API [V phaser.io, vendor claim].
  - Includes a scale manager (FIT/RESIZE/EXPAND), input, tweens, physics, particles and cameras [V source].
  - Official React template exists (Phaser 3 era) [V].
- **Pros:**
  - Batteries included for arcade mini-games.
  - Consistent frame-based animation.
- **Cons for us:**
  - The canvas output is opaque to screen readers.
  - Text input, scroll lists and inventory grids are clumsy in canvas, so the app becomes two worlds (React UI + Phaser scenes) bridged by events.
  - The npm package is very large (~107 MB unpacked, though tree-shaken builds are much smaller [H]).
  - Its fullscreen helper can't fix iPhone, which lacks the Fullscreen API [V].
- **Verdict:** not justified for v1. Keep as an option for a specific later mini-game.

### Option C: PixiJS 8 (+ @pixi/react)

- **Facts:** pixi.js 8.22 (MIT); @pixi/react 8.0.5 (MIT) [V npm]. A fast 2D renderer, _not_ a full engine.
- **Pros:** an excellent renderer for sprite-heavy scenes and effects.
- **Cons:**
  - Same accessibility and UI problems as Phaser.
  - Vector art must be rasterised to textures, losing easy runtime recolouring.
- **Verdict:** a better fit than Phaser if we ever need a canvas layer for effects. Not needed for v1.

### Option D: Other lightweight engines

- KAPLAY 3001 (MIT) and Excalibur 0.32 (BSD-2) [V npm].
- Fine for arcade games, but they share the canvas trade-offs above and add nothing for dress-up and decorating.

### Option E: Plain DOM/CSS without React (or Svelte/Preact)

- Viable and smaller.
- React is chosen for ecosystem depth (testing, Motion), the many examples Claude Code knows well, and long-term maintainability [H].
- Svelte would be a reasonable alternative if you have a preference.

### Comparison table

| Criterion                     | A: React+SVG                          | B: Phaser 4                 | C: PixiJS 8            |
| ----------------------------- | ------------------------------------- | --------------------------- | ---------------------- |
| iPhone Safari compat          | ✔ Standard DOM/SVG                    | ✔ WebGL/Canvas              | ✔ WebGL                |
| Touch / drag-and-drop         | Pointer Events + Motion drag          | Built-in input              | Built-in events        |
| Animation perf (our workload) | Good (transform/opacity) [H]          | Excellent                   | Excellent              |
| Runtime recolour of clothes   | Trivial (CSS vars on fills)           | Tint only (multiplicative)  | Tint only              |
| Text, menus, forms            | Native                                | Rebuild in canvas           | Rebuild or DOM overlay |
| Accessibility                 | Strong                                | Weak                        | Weak                   |
| Asset pipeline                | SVG components, sprite-free           | Texture atlases             | Texture atlases        |
| Photo export                  | SVG → canvas → PNG                    | `renderer.snapshot`         | `extract` API          |
| Testing                       | Vitest + Testing Library + Playwright | Harder (canvas pixels)      | Harder                 |
| Maintainability               | High; one paradigm                    | Two paradigms with React UI | Two paradigms          |
| Cost                          | Free (MIT/Apache)                     | Free (MIT)                  | Free (MIT)             |

---

## 3. Recommended architecture

```
┌──────────────────────── iPhone Safari / Home Screen PWA ───────────────────────┐
│  React app (Vite build, static files)                                          │
│                                                                                │
│  ui/        Dock, Panels, Carousel, Button (sticker style), Toasts             │
│  scenes/    TitleScene, MapScene, HomeScene, WardrobeScene, CafeJob, ...       │
│  art/       SVG components: CharacterRig, items/{tops,hair,...}, furniture/    │
│  game/      Pure TypeScript rules: economy, jobs scoring, unlocks, briefs      │
│  state/     Zustand store (single source of truth)  ──► persistence adapter    │
│  content/   JSON/TS catalogs: items, prices, recipes, destinations             │
│  audio/     Web Audio wrapper (unlock on first tap, SFX pool, music bus)       │
│  platform/  storage.persist(), install hint, save export/import, debug overlay │
│                                                                                │
│  Service worker (vite-plugin-pwa / Workbox): precache all assets → offline     │
│  IndexedDB (idb-keyval): save slots, settings, photo thumbnails                │
└────────────────────────────────────────────────────────────────────────────────┘
          No backend · no analytics · no network calls after first load
```

### Key decisions

- **Content as data [R].** Items, prices, recipes and briefs live in typed catalogs. This allows new content without code changes and makes game balance testable.
- **Pure game logic [R].** `game/` has no React imports. Economy and scoring are unit-tested with Vitest 5 (MIT).
- **State:** Zustand 5 (MIT, ~93 KB unpacked) [V npm]. It is tiny, works outside React for tests, and has a persist middleware with a custom IndexedDB adapter.
- **Persistence [V → R]:**
  - Write to IndexedDB through `idb-keyval` 6.3 (Apache-2.0).
  - Call `navigator.storage.persist()`. WebKit grants it by heuristic, e.g., for Home Screen apps [V].
  - Because Safari can evict script-written data after 7 days of browsing without visiting the site [V], show a friendly **"Put Petalport on your Home Screen"** card and offer a **Save Code** (compressed JSON as a downloadable file or copyable text) under a parent-gated settings screen.
  - Save data carries a `version` field plus migrations.
- **Offline:** vite-plugin-pwa 2.0 (MIT) generates a Workbox precache manifest [H: Workbox details not re-verified this session]. Fonts are self-hosted from `@fontsource/fredoka` and `@fontsource/nunito` (OFL-1.1).
- **Character rendering [R]:**
  - One `<CharacterRig>` SVG with a fixed viewBox and ordered layer slots: back-hair, body, socks, shoes, bottom, top, outerwear, front-hair, headwear, accessories.
  - Each item component receives `{ palette }` props mapped to CSS custom properties.
  - Mouth and eyes are swappable for expressions.
- **Drag and drop:** Pointer Events with `touch-action: none` on draggable layers, Motion's drag for spring physics, and snapping to a grid in the room [H: exact Motion API to confirm at build].
- **Animation budget [R]:**
  - Animate only `transform` and `opacity`.
  - No animated SVG filters or blur.
  - Cap simultaneous particle sprites; if more are needed, use a small `<canvas>` overlay.
  - Respect `prefers-reduced-motion` [V].
- **Audio [V → R]:**
  - Create or resume the AudioContext on the title-screen tap [V].
  - Decode short SFX (OGG/M4A) into buffers.
  - Keep music on a separate gain node.
  - Howler 2.2 (MIT) is an option if cross-format handling becomes painful.
- **iPhone layout [V → R]:**
  - No Fullscreen API on iPhone [V].
  - Use `viewport-fit=cover`, `env(safe-area-inset-*)`, `100dvh`, and `apple-mobile-web-app-capable`-style manifest settings for standalone mode.
  - Disable double-tap zoom on game surfaces with `touch-action: manipulation`.
- **Photo export:**
  - Serialize the composed SVG, draw it to a `<canvas>`, call `toBlob('image/png')`, then trigger a download or the Web Share sheet.
  - Avoid `<foreignObject>` (HTML inside SVG) in exported scenes, because it complicates rasterisation [H].
- **Accessibility:**
  - Real `<button>` elements with accessible names.
  - SVG items get `<title>`.
  - Focus states are visible.
  - Text is not baked into images.
  - Colour is never the only signal.
  - 44 px minimum targets, 56 px for primary actions [V/R].

### Testing & debugging (all free)

| Layer             | Tool                                                                                | Notes                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Rules / economy   | Vitest 5 (MIT)                                                                      | Pure functions, property tests for "no negative coins", unlock order                 |
| Components        | Vitest + Testing Library (jsdom)                                                    | Accessible queries double as a11y checks                                             |
| End-to-end        | Playwright 1.64 (Apache-2.0) with **WebKit** + `devices['iPhone 13']` emulation [V] | Emulation is _not_ real iOS Safari [H]. Treat it as a smoke test.                    |
| Real device       | iPhone on the same Wi-Fi hitting `vite --host`; or a free static deploy             | Safari Web Inspector remote debugging needs a Mac [H, widely known; not re-verified] |
| No-Mac fallback   | In-app debug overlay (FPS, storage status, last error), hidden behind a long-press  | Built into `platform/`                                                               |
| Visual regression | Playwright screenshots                                                              | Optional, later                                                                      |

### Hosting (free)

- **GitHub Pages:** free for **public** repositories on GitHub Free. Private repos need a paid plan [V GitHub Docs].
- **Your options:**
  - make the repo public
  - only play locally over Wi-Fi
  - use another free static host (not evaluated this session; check whether it requires a credit card)

---

## 4. Budget check: what fits "no paid services"

| Need                          | Free solution                                                    | Fits?                  |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Build tools, framework, tests | Vite, React, TS, Vitest, Playwright                              | ✔                      |
| Storage                       | IndexedDB on device                                              | ✔                      |
| Offline                       | Service worker                                                   | ✔                      |
| Hosting                       | GitHub Pages (public repo) or local Wi-Fi                        | ✔ (public repo caveat) |
| Art                           | Original SVG (Claude-drafted + your direction), CC0 placeholders | ✔ (time-intensive)     |
| Sound/music                   | Kenney CC0, Freesound CC0/CC-BY, Incompetech CC-BY               | ✔ (credits screen)     |
| Fonts/icons                   | OFL fonts, MIT/ISC icons                                         | ✔                      |

### Features that **cannot** realistically meet the zero-cost, zero-data constraints

- **Cloud saves / play across devices.** This needs a backend and accounts, which brings COPPA consent duties. Free tiers usually need sign-up and may need a card. **Substitute:** save-file export/import.
- **Multiplayer, visiting friends' homes, gifting between players.** This needs servers, moderation and safety staff. **Substitute:** export a "home postcard" image, or a local "visit code" that encodes a room layout as text for siblings to import offline.
- **AI-generated clothing or art at runtime.** This needs paid image APIs. **Substitute:** procedural patterns (stripes, florals) generated in SVG.
- **Voice-over in many languages.** Professional VO costs money. Browser text-to-speech exists, but quality varies [H]. **Substitute:** icon-first UI plus SFX.
- **Native App Store release.** Apple's developer program is a paid membership [H, not re-verified]. **Substitute:** stay a PWA.
- **Push notifications / reminders.** These also conflict with the no-nudge principle; excluded by design.
- **Analytics on how kids play.** Excluded by privacy design. **Substitute:** in-person playtests.

---

## 5. Decisions to revisit later

| Trigger                                          | Revisit                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| A mini-game needs physics or 100+ moving sprites | Lazy-load PixiJS or Phaser for _that scene only_, mounted inside a React route |
| SVG perf issues on older iPhones                 | Pre-rasterise static backgrounds to WebP; keep characters SVG                  |
| Content > ~500 items                             | Code-split catalogs by district; lazy-load art                                 |
| Localisation                                     | Add an i18n layer early (strings out of components) even if English only       |
