# Implementation Plan: Petalport v0.1

**Status:** Draft for approval (revision 2, after [plan-review.md](plan-review.md)) · **Date:** 25 Oct 2026
How to build [PRD.md](PRD.md) in milestones, with a prioritized task list, the asset budget, the testing strategy, accessibility and performance requirements, the public-release checklist, and how an AI agent will test the game. **Nothing here starts until you approve.**

---

## 1. Approach

- **Risk first.** Milestone 0 ends with you checking two things on your iPhone: the art bar, and an iOS risk spike that proves the fragile browser pieces (photos, storage, updates, audio, swipe-back) before any game system depends on them.
- **Vertical slices.** Each milestone ends with something playable on the phone.
- **Rules and balance are unit-tested** from the first day they exist.
- **One review gate per milestone.** Every milestone deploys to an HTTPS GitHub Pages URL with a visible build version. You play it, then approve the next milestone.
- **Kids early.** The first child playtest is at the end of M3, before the travel content is built.

## 2. Milestones

| M      | Name                            | Delivers                                                                                                                                                                                                                                                                                 | Gate (you check on iPhone)                                                                  | Rough size*  |
| ------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| **M0** | Foundations, art bar, iOS spike | Repo + CI + Pages deploy, tokens, sticker UI kit, `CharacterRig` (front/back arms, sleeves with accent + trim, 2 poses, 3 outfits), construction kit, art lint, golden references, Harbour Loft (art only), persistence adapter, debug log, version label, PWA shell, **iOS risk spike** | "Yes, this is the quality bar", and every spike check passes or has a written workaround    | 4–6 sessions |
| **M1** | Me                              | Title, Creator, Closet (9 slots, tints, 4 looks), 38 wearables drawn, all 5 poses, fit matrix                                                                                                                                                                                            | Make a character and change outfits; reload keeps everything                                | 5–7 sessions |
| **M2** | Home                            | Lifestyle choice, both homes × 3 themes, hotspots, decorate mode, cooking engine + Pancakes + Crêpes                                                                                                                                                                                     | Cook, see the dish on the table, redecorate                                                 | 4–6 sessions |
| **M3** | Town                            | Map, Café (3 ranks, Challenge mode, thank-you stickers, makeover), Boutique, economy, unlocks, Welcome Journey, savings goal, parent area basics                                                                                                                                         | Earn coins, buy and wear something, rank up. **First kid playtest**                         | 5–7 sessions |
| **M4** | Travel                          | Airport, flight, Paris, photo mode, album, souvenirs, passport                                                                                                                                                                                                                           | Fly to Paris, take a photo, find it in the album after reload and after a backup round-trip | 4–6 sessions |
| **M5** | Ship v0.1                       | Backup/restore with photos, Safari → Home Screen transfer, offline, accessibility and performance passes, credits, privacy notice, release checklist                                                                                                                                     | **Second kid playtest** + release checklist (§11)                                           | 3–5 sessions |

\*A "session" is one focused Claude Code working session. These are rough guesses, not measurements: art iteration is the main unknown and your plan's usage limits may set the pace more than your review time. Re-estimated at every gate. Total: roughly 25–37 sessions plus your reviews.

## 3. Prioritized task list

P0 = needed for a playable v0.1. P1 = needed for the v0.1 gate. P2 = cut first. Tasks are in build order within each milestone.

### M0. Foundations, art bar, iOS spike

| ID    | Task                                                                                                                                                                                                                                                    | P   | Acceptance                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | -------------------------------------------------------------------------------------------- |
| T0.1  | Public GitHub repo, Vite + React + TS (strict), ESLint import boundaries (data-model §7), Prettier, Vitest, Playwright (WebKit iPhone 13, WebKit 375×667, Chromium desktop), GitHub Actions CI (free for public repos), Pages deploy per push to `main` | P0  | CI green; Pages URL loads over HTTPS on your iPhone                                          |
| T0.2  | Build version label (`vX.Y.Z-mN+sha`) on title and parent area                                                                                                                                                                                          | P0  | AC-F1-5                                                                                      |
| T0.3  | Design tokens + contrast unit test (visual-design §3.2)                                                                                                                                                                                                 | P0  | AC-X-3                                                                                       |
| T0.4  | Stage shell: safe areas, `100dvh` on a fixed non-scrolling stage, desktop portrait stage, landscape card, `touch-action` rules                                                                                                                          | P0  | E2E with injected fake insets at 375×667, 390×844, 430×932, 1280×800; real-iPhone screenshot |
| T0.5  | Sticker UI kit (Button, IconButton, Panel, Sheet, virtualized Carousel, Tabs, Toast, ProgressRing, Badge) + gallery page                                                                                                                                | P0  | AC-X-2 sizes in component tests                                                              |
| T0.6  | **Construction kit + style sheet + art lint** (visual-design §13)                                                                                                                                                                                       | P0  | Lint runs in CI and fails on a planted bad asset                                             |
| T0.7  | `CharacterRig`: layer order with back/front arms, sleeves (main + accent + trim), 2 poses, tint via `colors` prop; 3 test outfits                                                                                                                       | P0  | Gallery: 3 outfits × 2 poses, no clipping, hands visible in front poses                      |
| T0.8  | Harbour Loft room art with 8 slot anchors + starter furniture                                                                                                                                                                                           | P0  | Art gate                                                                                     |
| T0.9  | Save types, `validate`, `sanitize`, `migrate` skeleton, idb-keyval adapter (current/previous, write queue, flush on `pagehide`)                                                                                                                         | P0  | AC-F11-1/2/3 unit tests                                                                      |
| T0.10 | Debug log + overlay (ships in prod behind the grown-up gate), Copy log                                                                                                                                                                                  | P0  | Visible on the deployed build                                                                |
| T0.11 | PWA shell (precache, manifest, icons) + update control (apply on title; "Update now")                                                                                                                                                                   | P0  | Offline reload works on Pages; version changes after "Update now"                            |
| T0.12 | Test hooks for preview builds: `?seed=`, `?fixture=<name>`, `data-testid` convention; stripped from the production build                                                                                                                                | P0  | AC-X-9                                                                                       |
| T0.13 | **iOS risk spike** (§3.1) on your iPhone                                                                                                                                                                                                                | P0  | Each check passes or has a recorded workaround                                               |
| T0.14 | **Art gate review** with golden references chosen; fallback-style trigger agreed                                                                                                                                                                        | P0  | Your approval                                                                                |

#### 3.1 iOS risk spike (throwaway page inside the M0 build, `/spike`)

| #   | Check                                                       | Pass when                                                                                                        |
| --- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| S1  | Tinted rig → PNG through the photo pipeline (data-model §6) | Saved PNG colors match the screen at 5 sampled points                                                            |
| S2  | Photo bytes stored as ArrayBuffer in IndexedDB              | Readable after a full app kill and relaunch                                                                      |
| S3  | Safari vs Home Screen storage                               | We know whether a Home Screen install sees Safari's save (expected: no) and the transfer guide works             |
| S4  | Service-worker update in Home Screen mode                   | A new deploy shows its version after "Update now" and after the title-screen apply                               |
| S5  | Audio                                                       | Plays after first tap; behavior with the silent switch on is known; resumes after backgrounding and after a call |
| S6  | Swipe-back with the sentinel history entry                  | A swipe-back mid-activity shows the leave prompt and never loses saved progress                                  |
| S7  | `100dvh` and safe areas                                     | No content under the notch or home indicator, in Safari and standalone, toolbar collapsed and expanded           |
| S8  | Share sheet with a PNG file + download fallback             | Image lands in Photos or Files                                                                                   |
| S9  | `storage.persist()` result in Safari and standalone         | Recorded; parent-area text matches reality                                                                       |

### M1. Me

| ID   | Task                                                                                                                            | P   | Acceptance                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------ |
| T1.1 | Appearance content: 10 skin tones, 8 hairstyles × front/back, 10 hair colors, 6 eyes, 8 eye colors, 3 brows, 4 mouths, freckles | P0  | AC-F2-3                              |
| T1.2 | Title scene + audio unlock + boot read pipeline + first-run install card                                                        | P0  | AC-F1-1..5, AC-F16-2                 |
| T1.3 | Creator scene (tabs, live preview, surprise me, optional name)                                                                  | P0  | AC-F2-1..7                           |
| T1.4 | Wearables catalog + art: 13 starter + 22 boutique + 3 reward (apron, barista cap, beret) = 38                                   | P0  | Content lint + art lint pass         |
| T1.5 | `game/wardrobe`: equip rules, required slots, tints, looks, fallback                                                            | P0  | AC-F3-2/3/6                          |
| T1.6 | Closet scene: slot tabs, virtualized carousel, swatches, 4 favorite looks, "Change me"                                          | P0  | AC-F3-1..7                           |
| T1.7 | Remaining 3 poses (5 total), all sleeve variants, **fit matrix** (4 hats × 8 hairstyles, 5 poses × 3 outerwear)                 | P1  | Gallery matrix reviewed as one batch |

### M2. Home

| ID   | Task                                                                                                           | P   | Acceptance                |
| ---- | -------------------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| T2.1 | Lifestyle scene with 2 postcards and 3 themes each                                                             | P0  | AC-F4-1..3                |
| T2.2 | Meadow Cottage room art + starter furniture                                                                    | P0  | Matches golden references |
| T2.3 | Home scene: character placement, 6 hotspots + dish                                                             | P0  | AC-F5-1,2,5               |
| T2.4 | Decorate mode + `game/home.place` + furniture catalog (16 starter + 10 shop) + shelf keepsake spots            | P0  | AC-F5-3,4                 |
| T2.5 | Cooking engine: step reducer for add / mix / pour / heat / fold / decorate, with tap and keyboard alternatives | P0  | AC-F6-3..5                |
| T2.6 | Pancakes + Crêpes content and art                                                                              | P0  | AC-F6-2                   |
| T2.7 | Stars, rewards, dish on table, eat/keep, dish as photo prop data                                               | P0  | AC-F6-6..8                |
| T2.8 | Move house (with one-time starter-set gift)                                                                    | P1  | AC-F4-4                   |

### M3. Town

| ID    | Task                                                                                                  | P   | Acceptance                           |
| ----- | ----------------------------------------------------------------------------------------------------- | --- | ------------------------------------ |
| T3.1  | Map scene art (~2 screens) + 4 location hotspots + cat + preview sheet + scroll memory + ambient life | P0  | AC-F7-1..6                           |
| T3.2  | `game/economy` + `content/balance.ts`                                                                 | P0  | AC-F10-1..4, AC-F10-7                |
| T3.3  | `game/unlocks.reconcile` + `game/journey`                                                             | P0  | AC-F10-5, game-systems §6.6 as tests |
| T3.4  | `game/cafe`: seeded order generator, scoring, diff for wrong serves, ranks, stickers                  | P0  | AC-F8-3,4,5,8,10                     |
| T3.5  | Café scene: counter with per-rank tabs, customers from the rig, feedback, shift card                  | P0  | AC-F8-1..9                           |
| T3.6  | Thank-you stickers (24 small portraits) + album sticker page                                          | P0  | AC-F8-10                             |
| T3.7  | Boutique scene: tabs, try-on, buy, wear-now / place-it, revert on exit                                | P0  | AC-F9-1..7                           |
| T3.8  | HUD coin pill + savings goal ring + map badges + settings gear                                        | P0  | AC-F10-6                             |
| T3.9  | Grown-up gate + child settings + parent area (version, update, debug log, storage status)             | P0  | AC-F15-1..4                          |
| T3.10 | Café rank 3: stencil latte                                                                            | P1  | Rank-3 orders playable               |
| T3.11 | **Challenge mode**                                                                                    | P1  | AC-F8-11                             |
| T3.12 | Café makeover (5 decor items in the café scene) + "collected everything" state                        | P1  | AC-F8-12,13                          |
| T3.13 | **Kid playtest #1** (M1–M3 content) + fixes                                                           | P0  | PRD §8 metrics recorded per age band |

### M4. Travel

| ID   | Task                                                                                          | P   | Acceptance                              |
| ---- | --------------------------------------------------------------------------------------------- | --- | --------------------------------------- |
| T4.1 | Destination content model + Paris; planned destinations as `status: 'planned'`                | P1  | Unit: only released destinations listed |
| T4.2 | Airport scene: ticket desk, departures board, luggage trolley, gate                           | P1  | AC-F12-1,2,6                            |
| T4.3 | Flight transition (skippable, reduced-motion variant)                                         | P1  | AC-F12-3                                |
| T4.4 | Paris scene art with original Eiffel Tower + 5 hotspots + Fly home                            | P1  | AC-F12-4,5; visual-design §8            |
| T4.5 | Photo mode on the pipeline proven in S1/S2                                                    | P1  | AC-F13-1,2,7                            |
| T4.6 | Album: grid, full view, save to device, remove, cap 60, empty state, passport + sticker pages | P1  | AC-F13-3..5                             |
| T4.7 | Souvenir kiosk, stamp, postcard reward, shelf keepsake picker                                 | P1  | AC-F14-1..4                             |

### M5. Ship v0.1

| ID    | Task                                                                  | P   | Acceptance                                  |
| ----- | --------------------------------------------------------------------- | --- | ------------------------------------------- |
| T5.1  | Backup export/import incl. photo scene records and re-render          | P0  | AC-F11-5,7                                  |
| T5.2  | Storage persist + "Saving paused" banner + Recovery scene             | P0  | AC-F11-4,6, AC-F1-3                         |
| T5.3  | Safari → Home Screen transfer guide                                   | P0  | AC-F16-4                                    |
| T5.4  | Offline verification + update behavior                                | P0  | AC-F16-1,3                                  |
| T5.5  | SFX set (CC0) + optional music loop + credits screen + privacy notice | P1  | AC-X-8, AC-F15-3                            |
| T5.6  | Accessibility pass (§7)                                               | P0  | All §7 checks green                         |
| T5.7  | Performance pass on your iPhone (§8)                                  | P0  | All §8 budgets met                          |
| T5.8  | No-dead-taps sweep across every scene's hotspot list                  | P0  | AC-X-1                                      |
| T5.9  | **Kid playtest #2** (full game) + fixes                               | P0  | PRD §8                                      |
| T5.10 | Public-release checklist (§11)                                        | P0  | Every item done or explicitly waived by you |

### Cut order if we fall behind

1. T3.12 Café makeover (stickers alone keep shifts meaningful)
2. T3.10 Café rank 3 (ship ranks 1–2)
3. Home themes: 3 → 1 per home
4. T1.7 poses: ship 3 instead of 5 (photo mode gets 3)
5. **M4 slips to v0.2 as a whole.** Paris, photos and the album ship together in v0.2; v0.1 releases without travel. (The earlier "photo at Home" stopgap is dropped: it needs the same pipeline and new backdrops, so it saves nothing.)

Not on the cut list: the lifestyle choice and cooking (explicitly requested), Challenge mode (the only depth for 10–13), the iOS spike, and anything safety- or save-related.

## 4. Asset budget (original SVG, AI-assisted)

| Group                                        | Pieces           | Notes                                                                          |
| -------------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| Rig body, head                               | ~4               |                                                                                |
| Arms: 5 poses × 5 sleeve shapes × front/back | 50 small         | One path + one trim path each; biggest consistency risk, so built from the kit |
| Faces: eyes 6, brows 3, mouths 4, freckles 1 | 14               |                                                                                |
| Hair: 8 styles × back/front                  | 16               |                                                                                |
| Wearables                                    | 38               |                                                                                |
| Furniture, keepsakes, souvenirs              | 33               | 16 starter + 10 shop + poster + espresso machine + 4 souvenirs + spare         |
| Café makeover decor                          | 5                |                                                                                |
| Large scenes                                 | 9                | Title, 2 homes, map, café, boutique, airport, flight, Paris                    |
| Café props                                   | ~24              | Cups, bases, toppings, caramel, pastries, stencils, jars, bin, bell, tabs      |
| Cooking props                                | ~20              | Ingredients, bowl, whisk, pan, jug, 2 dishes × 3 result states                 |
| Stickers, stamp, frame                       | 31               | 24 thank-you portraits (small rig heads) + 6 Paris + stamp                     |
| UI icons                                     | ~30              | Phosphor "fill" (MIT) restyled, or drawn                                       |
| **Total**                                    | **≈ 275 pieces** | Many are small; the 9 scenes and 38 wearables carry most of the effort         |

**Your review load:** reviews are batched (all tops in one lineup, all hats on all hair in one matrix), roughly 15–20 batch reviews across v0.1, each a single gallery link. Expect 1–2 revision rounds per batch.

## 5. Definition of done (every task)

- Acceptance criteria pass with the named test type.
- Unit tests for any `game/` change; E2E only where §6.1 says so.
- Works at 375×667 and 390×844 portrait and on desktop (mouse + keyboard).
- Reduced motion checked.
- No new network requests; no new dependency without a note in `CLAUDE.md`.
- New art passes the art lint, is credited in `content/credits.ts`, and follows visual-design §12.
- Deployed to Pages; the version label matches the commit.

## 6. Testing strategy

### 6.1 Layers (kept lean so the suite stays maintainable)

| Layer              | Tool                                   | What it covers                                                                                                                                                                                  |
| ------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit (rules)       | Vitest                                 | Everything in `game/`: economy, wardrobe, home, café generation/scoring/ranks/stickers, cooking stars, unlocks, journey, save validate/sanitize/migrate, color resolution for photos            |
| Property tests     | Vitest + small hand-written generators | Coins stay in 0–99,999 after any action sequence; reconcile is idempotent; every save produced by actions validates                                                                             |
| Content + art lint | Vitest                                 | §6.3 and visual-design §13                                                                                                                                                                      |
| Balance            | Vitest                                 | §6.4                                                                                                                                                                                            |
| Component          | Vitest + Testing Library (jsdom)       | UI kit behavior, accessible names, disabled-but-explains buttons, carousel keyboard nav, test IDs present                                                                                       |
| End-to-end         | Playwright (3 projects)                | **Only:** journeys J1–J3, the no-dead-taps sweep, reload persistence, backup round-trip with photos, offline, zero-network assertion, axe scan per scene, safe-area layout with injected insets |
| Screenshots        | Playwright                             | **Layout only** (overlap, safe areas, 375 px fit), with tolerant thresholds. Never pixel-exact art, so art tweaks don't break CI                                                                |
| Real device        | Your iPhone on the Pages URL           | Manual checklist §6.5 at every gate                                                                                                                                                             |

Playwright WebKit on Linux is not iOS Safari; it's a smoke test. Anything iOS-specific is confirmed on the device.

### 6.2 Seeded determinism

Café orders, NPC looks and "Surprise me" use the injected RNG (`game/rng.ts`). Preview builds accept `?seed=` so tests and agents get the same orders every run.

### 6.3 Content lint

- IDs unique and namespaced (`top.`, `furn.`, `keep.`, …).
- Every `art` key resolves; wearables have `sleeve` where required.
- Every item has a `Source`; shop prices inside their band (game-systems §6.4).
- Every item is reachable (starter, shop, or a satisfiable reward).
- Every **explorable** scene (Home, Map, Café, Boutique, Airport, Paris) has ≥ 3 hotspots with labels and test IDs. Flow scenes (Title, Creator, Lifestyle, Flight, Photo, Album, Parent, Recovery) are exempt.
- Every asset file has a credits entry.
- Photo-scene art contains no `foreignObject`, `filter`, external `href`, or `var(` once resolved.

### 6.4 Balance tests

- Max price ≤ 6 typical rank-1 shifts (414).
- First purchase possible with starting coins.
- Simulated J1 player (2 shifts + 1 purchase) can't afford the ticket in session 1; a 4-shift saver can by mid-session 2.
- Simulated typical player owns everything in 7–9 sessions.
- Total purchasable cost snapshot-tested so changes are deliberate.

### 6.5 Manual iPhone checklist (each gate)

1. Version label matches the deploy you were told about.
2. First load; then airplane-mode reload works.
3. Audio after the first tap; mute persists; behavior on silent is as documented.
4. Swipe-back mid-activity shows the leave prompt; saved progress is never lost.
5. Nothing under the notch or home indicator, in Safari and Home Screen mode.
6. Map scroll and transitions smooth (overlay ≥ 50 fps, Low Power Mode off).
7. Photo "Save to my device" lands the image in Photos or Files (from M4).
8. Kill Safari mid-shift and reopen: lands at Home with coins from served orders.
9. Landscape shows the "Turn me upright!" card.
10. Copy log works and pastes into a message to Claude.

## 7. Accessibility requirements

| Requirement                                                                                                                                 | How it's checked                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Every interactive element is a real `<button>` (or SVG hotspot with `role="button"`, `tabIndex=0` and key handlers) with an accessible name | Component tests + axe                 |
| Visible focus ring (3 px `--sea-deep` + 2 px cream offset)                                                                                  | E2E keyboard journey                  |
| Full keyboard play for every flow; free placement uses "next default spot"                                                                  | AC-X-6                                |
| No drag-only interactions                                                                                                                   | AC-F6-5 + café journey with taps only |
| Color never the only signal                                                                                                                 | Review checklist                      |
| Text contrast AA                                                                                                                            | AC-X-3                                |
| Reduced motion (system + parent override)                                                                                                   | AC-X-4                                |
| UI panels and text survive 150% text zoom on 390×844 (scene art excluded)                                                                   | E2E layout screenshot                 |
| Decorative SVG `aria-hidden`; meaningful items have `<title>`                                                                               | Content lint                          |
| Sound never the only feedback                                                                                                               | Review checklist                      |
| Live region announces rewards and café orders ("Large cocoa with marshmallow")                                                              | VoiceOver spot-check at M5            |
| No time limits in standard play (Challenge mode is opt-in and never punishes)                                                               | AC-F8-5, AC-F8-11                     |

## 8. Performance requirements

| Budget                                           | Target                                                                 | How measured                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Initial JS before the title is interactive       | ≤ 250 KB gzip (art chunks load after)                                  | Build report in CI                                                    |
| Total precache                                   | ≤ 3 MB gzip                                                            | Build report in CI                                                    |
| First load to "Tap to start"                     | ≤ 3 s on throttled 4G                                                  | Playwright WebKit with throttling + one stopwatch check on the iPhone |
| Repeat load (offline cache)                      | ≤ 1 s                                                                  | iPhone stopwatch                                                      |
| Tap feedback                                     | ≤ 100 ms                                                               | Playwright trace on key buttons                                       |
| Scene transition                                 | ≤ 500 ms incl. prefetched chunk                                        | Playwright timing                                                     |
| Frame rate during map scroll, transitions, drags | ≥ 50 fps, Low Power Mode off                                           | Debug overlay on your iPhone                                          |
| Simultaneous animated elements                   | ≤ 40                                                                   | Code review                                                           |
| Album memory                                     | Grid shows thumbnails only; full images on demand, object URLs revoked | Code review                                                           |
| Save write                                       | ≤ 20 ms main-thread work                                               | Unit benchmark                                                        |

## 9. Tooling & dependencies (all free; re-check versions at scaffold time)

Runtime: `react`, `react-dom`, `zustand`, `idb-keyval`, `motion`, `@fontsource/fredoka`, `@fontsource/nunito`.
Dev: `vite`, `typescript`, `@vitejs/plugin-react`, `vite-plugin-pwa`, `vitest`, `@testing-library/react`, `jsdom`, `@playwright/test`, `@axe-core/playwright` (MPL-2.0, dev-only), `eslint`, `prettier`.
CI/hosting: GitHub Actions + GitHub Pages (free for public repositories).
Nothing else without updating `CLAUDE.md`.

## 10. Hosting (decided)

- **Public GitHub repo + GitHub Pages**, deployed from CI on every push to `main`. HTTPS is required: the service worker, `crypto.randomUUID()`, `navigator.storage` and file sharing only work in a secure context, so plain-HTTP local Wi-Fi is not used for reviews.
- Optional: a `preview` branch deployed to a second Pages path for milestone candidates, so your kids' copy on `main` stays stable.
- The repo is public, so nothing secret ever goes in it (there are no secrets in this design anyway).

## 11. Public-release checklist (M5, before sharing the link beyond family)

Not legal advice; items marked ⚖ should be confirmed by a lawyer before a wide release.

| #   | Item                                                                                                                                                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Privacy notice in the parent area and the repo README: collects nothing, no network after load, photos stay on the device. ⚖ Confirm that a no-collection design keeps COPPA and UK Children's Code duties minimal (research §6) |
| R2  | Trademark search for "Petalport"; switch to a fallback name if needed ⚖                                                                                                                                                          |
| R3  | Credits screen complete: every CC0/CC-BY/OFL/MIT/ISC asset, our art marked "original, AI-assisted"                                                                                                                               |
| R4  | Likeness check: signature art (rig, Eiffel Tower, homes) doesn't resemble a specific existing game or protected design. Tower drawn in daytime, no logos (visual-design §8) ⚖                                                    |
| R5  | Cultural review of the Paris content by someone familiar with Paris (destination `culturalReview` field filled)                                                                                                                  |
| R6  | Safety charter check: no network calls, no new data, no random rewards, no punishing timers, no ads or IAP (roadmap cross-cutting track)                                                                                         |
| R7  | Zero-network E2E green on the release build                                                                                                                                                                                      |
| R8  | Repo license chosen by you (e.g. MIT for code; art license decided separately) and `LICENSE` added                                                                                                                               |
| R9  | Both kid playtests done; findings fixed or logged                                                                                                                                                                                |

## 12. AI-agent testing (designed in from M0)

You want an AI agent to check the game in future. This plan makes that possible without adding services:

| Building block                                                                                                                                             | What it gives an agent                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Stable `data-testid`s** on every hotspot and primary control, plus the per-scene hotspot lists in `content/`                                             | The agent can enumerate and tap everything, and knows what each tap should do            |
| **`?seed=` and `?fixture=<name>`** in preview builds (fixtures in `src/test/fixtures/`: new player, mid-game, rich player, everything owned, corrupt save) | Reproducible starting states and orders for every run                                    |
| **Scripted journeys** (`npm run e2e`) and the **no-dead-taps sweep**                                                                                       | A one-command regression check                                                           |
| **`npm run screens`**: a Playwright script that walks every scene at 375×667, 390×844 and desktop and saves screenshots to `artifacts/screens/`            | An agent with vision can review layout and art consistency against the golden references |
| **CI on every push** with test reports and screenshots attached as GitHub Actions artifacts                                                                | An agent (or you) can read results from the PR without running anything                  |
| **Copy log** from the debug overlay                                                                                                                        | Real-device bugs can be pasted to an agent with context                                  |
| **`CLAUDE.md`**                                                                                                                                            | Persistent rules so any future Claude session or agent follows the same constraints      |

None of the test hooks ship in the production build (AC-X-9).
