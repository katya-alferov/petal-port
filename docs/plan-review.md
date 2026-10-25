# Plan Review: Petalport v0.1

**Reviewer:** independent review (game design, frontend engineering, production) · **Date:** 25 Oct 2026 · **Reviewed:** PRD.md, game-systems.md, data-model.md, visual-design.md, implementation-plan.md, CLAUDE.md (background: game-concept, roadmap, technical-options, research)

**Verdict: approve with changes, not as written.** The spec is unusually thorough, the safety rules are sound, and the architecture (pure rules, content as data, SVG rig, IndexedDB with a backup slot) is the right shape. But v0.1 is really roadmap stages 1, 3 and 4 compressed into one release, and the riskiest iPhone-specific pieces (photo rasterization, Home Screen storage, service-worker updates, secure-context APIs) are scheduled last or not tested on a real device until it is expensive to change course. The economy runs out of things to buy after roughly 22 café shifts (about 35 minutes of café play), the café has no challenge for a 12-year-old, and the documented session math is wrong in a way that undermines the "reason to come back" design. The review path itself is broken: "local Wi-Fi" over plain HTTP disables the service worker, `crypto.randomUUID()`, `navigator.storage` and `navigator.share`, and if Claude Code runs in a cloud sandbox there is no LAN server at all. Fix the items in the last section before M0 starts.

---

## Findings

Ordered by severity. "Uncertain" marks browser behavior I believe is true but that must be verified on the owner's iPhone.

| # | Area | Severity | Finding | Recommendation |
|---|---|---|---|---|
| 1 | Hidden cost / Tech | High | **The review path does not work as planned.** implementation-plan §1 and §10 say the owner reviews "over local Wi-Fi (`vite --host`) or a free static host, decide at M0". Over `http://192.168.x.x` the page is not a secure context, so the service worker, `crypto.randomUUID()` (used for photo IDs, data-model §3.1), `navigator.storage.persist()` and `navigator.share` are unavailable. Offline, photos, persist status and backup sharing all fail or need special-casing. Separately, if Claude Code runs in a cloud sandbox (as this review does), there is no dev server on the owner's Wi-Fi at all. | Decide hosting **before** M0, not at M0. Default: free HTTPS static hosting with a deploy per milestone (GitHub Pages needs a public repo; check whether Cloudflare Pages or Netlify free tiers work with a private repo and no card, unverified). Add a dev-only `?seed=` and build label to every deploy. Drop "local Wi-Fi" as the primary path. |
| 2 | Tech / Persistence | High | **Installing to the Home Screen likely starts a fresh, empty game.** On iOS, Home Screen web apps have storage separate from Safari (uncertain, widely reported; verify). PRD AC-F16-2 shows the install card "once per 3 sessions", i.e. after the child has built a character, home and coins. Following the advice the game gives her would appear to delete her world. This is the single most likely "my game is gone" moment. | Verify in the M0 spike. If confirmed: offer the Home Screen card on first run, before the creator; and when running standalone with no save, show "Bring your game from Safari?" that walks the parent through export in Safari then import in the app. Add an AC for this. |
| 3 | Tech / Photo | High | **Photo rasterization will drop tints.** Tinting and home themes use CSS custom properties (visual-design §3.3, §12; data-model §2.1; technical-options §3). `XMLSerializer` → SVG Blob → `<img>` → canvas (data-model §6) renders the SVG as a standalone image without the page's stylesheet or inherited `var(--…)` values, so tinted fills render as defaults or black. Mid-animation transforms (idle breathing, Motion springs) are also serialized as-is. The pipeline sits in M4, after ~150 assets are already drawn around CSS variables. | Move a rasterization spike to M0: render the rig with 2 tinted items to PNG on the owner's iPhone. Expected fix: before serializing, clone the SVG and inline resolved hex colors (or have art components take colors as props in photo mode), freeze animations, and include gradients/defs in the same SVG. Add "photo colors match the viewfinder" as an AC. Use `img.onload` as a fallback if `Image.decode()` rejects for SVG blob URLs (uncertain). |
| 4 | Gameplay / Constraint | High | **Content runs out fast, then the job becomes a coin button.** Recomputed below: everything purchasable costs ≈ 2,100–2,200 coins; one-off income is ≈ 290; the rest takes ≈ 21–22 shifts ≈ 30–35 min of café play. Rank 3 (the last new verb) arrives at shift 8, i.e. during session 2 at the documented 4 shifts/session. After that, shifts produce coins with nothing to spend them on and no new mechanics, which conflicts with the owner's rule that every primary action produces a meaningful result. game-systems §6.3 waves this off ("revisit if a playtester buys everything"). | Plan the end state now: (a) give each shift a non-coin keepsake (e.g. a customer thank-you sticker for the album, a "drink of the day" polaroid) so the job "makes" something per principle 2; (b) add a deterministic, visible coin sink (e.g. café decor you see in the café, or a "help build Petal Park" project that visibly adds pieces); (c) add an "You've collected everything!" state. Add an AC: "after all items are owned, a shift still ends with something new." |
| 5 | Gameplay | High | **The café has no challenge for 10–13.** Orders are pictures, order of adding doesn't matter, no timer, wrong serves cost only a 3-coin tip, and the pastry/stencil "new verbs" are just more taps (game-systems §3.3–3.4). A 12-year-old will get every tip on every order; after 2–3 shifts it is a matching chore. The only skill option, Rush hour, is P2 and second on the cut list (implementation-plan §3). | Promote one opt-in challenge to P1 at rank 1: Rush hour (already non-punitive) or a "memory order" mode where the bubble hides after 3 s and a "peek" costs only the tip. At rank 2 serve 2 customers at once. Add a playtest metric per age band: "10–13 player chooses a further shift unprompted after shift 3." |
| 6 | Art pipeline | High | **AI-drafted SVG at a "premium picture book" bar across ~230 pieces has no fallback and no consistency tooling.** M0 tests the bar, but if it fails there is no plan B (no artist budget). Style drift across months of sessions is likely: stroke widths, shading direction, corner radii, face proportions. The only control is the owner eyeballing a gallery (visual-design §12.9). "20 items a minute" (implementation-plan §4) is optimistic for judging quality on a phone; with 1–2 revision rounds the owner will do roughly 500+ asset looks. | At M0 produce: a construction kit (shared primitives for heads, hands, folds, shadows), a 1-page style sheet with 6 "golden" reference pieces, and an automated art lint (fills only from palette or tint vars, outline color and widths per canvas, viewBox, node-count ceiling, light direction by convention). Pre-agree a simpler fallback style that hand-written SVG hits reliably (e.g. flatter "paper cut-out" with fewer curves) and what triggers switching to it. Batch reviews by group with side-by-side lineups, not item by item. |
| 7 | Art / Rig | High | **The layer order breaks front-facing poses.** game-systems §1.2 draws arms (6) under outerwear (7), bag (8) and neck (9). In "heart hands", "hips" and "pointing" the hands come in front of the torso, so a jacket body, bag strap or scarf would cover them. Also, procedural sleeves (§1.3) take only the item's main tint, so accent details (sailor stripes, cuffs) vanish from sleeves and the torso and sleeve won't match. Hats must also fit 8 very different hairstyles (puff, space buns, hijab). | Split arms into back-arm and front-arm layers, with front arms above bag/neck/outerwear bodies. Let sleeve drawings take main + accent tint and an optional cuff/stripe flag. Add gallery tests for every hat × hairstyle (4 hats × 8 styles = 32 combos) and every pose × outerwear. Do this in M0's rig (T0.5), not at T1.7. |
| 8 | Scope | High | **v0.1 is not small.** 17 features, 2 homes × 3 themes, a 7-step-type cooking engine for 2 recipes, 3 café ranks, Boutique, Airport, Flight, Paris, photo pipeline, album, passport, parent area, backup, PWA, full keyboard play, axe, VoiceOver, 150% zoom. The original roadmap put cooking at v0.3 and the airport at v0.4. The only child playtest is at M5 (T5.11), after all art is made. | Keep the owner-requested features but stage them: run the first child playtest at the end of M3 (Me + Home + Café + Boutique), then build M4. Trim inside features (see #15, #16, #20). Make M4's cut path real: if M4 slips, Paris ships in v0.2 instead of the "photo at home stopgap", which still needs the full pipeline and new backdrops. |
| 9 | Tech / Updates | High | **Owners will review stale builds.** AC-F16-3 says a new version activates "on next launch, never mid-session". On iOS, Home Screen apps are usually suspended rather than relaunched, so a waiting service worker may not activate for days (uncertain; verify). For the owner reviewing milestone builds this means seeing the old version and reporting fixed bugs. | Show the build version on the title and in the parent area. Add a parent-area "Update now" button when an update is waiting. Use auto-update (skipWaiting on next title screen, never mid-activity) during development. Add to the manual checklist: "version label matches the deploy." |
| 10 | Persistence / Vision | Medium | **"A photo she keeps forever" (PRD §1) is not delivered.** Photos are not in the backup (AC-F11-7) and live in IndexedDB, which Safari may evict after 7 days of Safari use without visiting (research §4). Storing Blobs in WebKit IndexedDB has had bugs in past versions (uncertain for current iOS). | Store photo images as ArrayBuffer, not Blob. Since `PhotoRecord.scene` already holds the full composition (~1 KB), include those scene records in the backup and re-render photos on import. Change the vision line or the AC so they agree. |
| 11 | Tech / Navigation | Medium | **Swipe-back mapping is fragile.** data-model §4.1 maps the iOS back gesture to `pop` via `history.pushState`. `popstate` cannot be cancelled, so "leaving mid-shift asks once" (AC-F8-6) needs a re-push trick; Safari animates a snapshot of the "previous page" during the swipe; a swipe at the root leaves the app; left-edge drags (stickers, toppings) can trigger it; Home Screen mode may have no back gesture at all (uncertain). Manual checklist §6.5.3 will likely fail. | Use a single sentinel history entry: on `popstate`, immediately re-push and run in-game Back (with the confirm). Keep drag surfaces 24 px away from the left edge. Reword the check to "a swipe-back never loses progress" rather than "never leaves the app". Test in the M0 spike. |
| 12 | Tech / Audio | Medium | **Sound will often seem broken.** Web Audio on iPhone is muted by the ring/silent switch by default (uncertain but widely reported; Safari 17 added `navigator.audioSession` to change this). The AudioContext also becomes "interrupted"/suspended after backgrounding or calls. AC-F1-2 only covers the first tap. | Decide whether the game should respect the silent switch (probably yes for a kids' game) and say so in Settings ("Is your phone on silent?"). Resume the context on every `visibilitychange` and next tap. Add both to the manual checklist. |
| 13 | Testability | Medium | **Several ACs can't be tested as labeled.** AC-X-5 (safe areas via E2E screenshots): Playwright device emulation reports zero safe-area insets, so the notch is never simulated. AC-F1-1 (Lighthouse on a mid-range iPhone): Lighthouse doesn't run on iOS. PRD §8 "debug overlay ≥ 50 fps": iPhones in Low Power Mode cap rendering at about 30 fps (uncertain), failing the gate spuriously. AC-X-6 keyboard-only for free placement of toppings and stickers needs extra UI. 150% text zoom (§7) on a fixed illustrated stage is ill-defined. Playwright WebKit on Linux is not iOS Safari. | Inject fake insets via a CSS override in E2E and keep a real-device screenshot step. Replace Lighthouse with "Playwright WebKit + throttled network" plus one real-device stopwatch check. Record Low Power Mode state on the FPS overlay. Limit keyboard placement to "place at next default spot". Scope 150% zoom to panels and text, not scene art. |
| 14 | Economy / Docs | Medium | **The documented session math is wrong.** PRD J1 has 1–2 shifts in session 1; game-systems §6.5 assumes 4 shifts and reports "~300 first session, ~280 later"; AC-F10-4 calls 5 shifts "≈ one session". Recomputed (below), session 1 yields 253–391 earned coins plus 120 starting, so the 250 ticket is affordable in session 1 for most children who don't buy 2+ items. PRD J1 step 6 ("most first sessions will not afford it, deliberate") is false. | Pick the intent. If Paris should be a session-2 goal, raise the ticket to ~400 or pay the Journey step on purchase only once. If session-1 Paris is fine, rewrite J1/§6.5. Fix "≈ 4 shifts" vs "5 shifts ≈ one session". Make the balance test simulate both J1 and the 4-shift player. |
| 15 | Gameplay / Cooking | Medium | **Cooking has little replay for either age.** Two recipes; no step can fail; Fruit Salad's ★★★ is automatic when using the tap alternative (game-systems §4.4); repeats pay nothing and the dish only sits on the table (home photos are v0.2). The 3-second golden window with a cue is trivial for 12-year-olds. Fruit Salad alone needs 2 new step types (`chop`, `drizzle`) and its own props, while Crêpes reuses pancake steps. | If cooking needs trimming, cut Fruit Salad to v0.2 and ship Crêpes (unlocked by cooking Pancakes once, or by Paris). Give repeat cooks a reason: let a dish be used as a Paris photo prop or a café "special" a customer may ask for. Give ★★★ a real condition for every recipe. |
| 16 | Scope / Art | Medium | **Large scenes are over-budgeted for what they hold.** Map is ~3 screens tall for 4 pins (AC-F7-1). Airport is a full scene whose only activity is one purchase, and no doc specifies its ≥ 3 hotspots (PRD §4 principle 1; content lint "every scene has ≥ 3 hotspots" in implementation-plan §6.3 will fail for Airport, Flight, Creator, Lifestyle). Café and Boutique hotspots beyond the activity are also unspecified. | Shrink the map to ~2 screens. Either make the Airport a ticket-desk sheet on the map plus the flight transition, or specify its 3 hotspots. Limit the lint rule to "explorable" scenes and list them. |
| 17 | Art / Gameplay | Medium | **Café UI does not scale with rank.** visual-design §5.4 lays out 9 jars (1 row of 8 + 1; SE: 2 rows of 4 = 8). Rank 2 adds a plate and 3 pastries, rank 3 adds a Petal Latte base and 3 stencils: ~16 tools. It's unspecified whether the cup and plate are built at the same time, and whether the stencil is shown in the order or chosen by the player (§3.4 "chosen from 3 stencils"). Rank-2 gift "sprinkles colors" duplicates `sprinkles`, already a rank-1 topping. | Specify a counter layout per rank (tabs or a second shelf) for 375 px. State that the order bubble shows the stencil and cup+plate are separate targets. Replace the duplicate gift with a real new ingredient. |
| 18 | Contradiction | Medium | **Where souvenirs go is defined three ways.** PRD AC-F14-3 "souvenirs go into the home Shelf slot"; data-model §2.4 "souvenirs don't consume a HomeSlot"; game-systems §3.4 makes the rank-3 Espresso machine `shelf` decor, which would replace the shelf that displays the souvenirs. | Shelf slot holds a shelf; the shelf has 3 souvenir spots; the Espresso machine becomes `table` or `wall` decor (or a fourth shelf-spot object). |
| 19 | Debugging | Medium | **The debug overlay is dev-only in the plan but needed in production.** T0.8 says "visible via long-press in a dev build"; data-model §9 puts it in the parent area. With no Mac, the overlay on the deployed build is the only way to see errors. | Ship the overlay in every build behind the parent gate. Add "copy log" output that the owner can paste to Claude. |
| 20 | Performance | Medium | **Closet and creator may stutter.** data-model §8 renders carousel thumbnails live from full-size SVG and puts all wearables in the main bundle. 9 slot tabs × up to 13 live SVG tiles plus the live rig is a lot of DOM on an iPhone; memoizing doesn't reduce nodes. Hand-written SVG for ~70 rig pieces could also push initial JS past 250 KB gzip, though the title doesn't need any of it. | Virtualize carousels (render visible tiles only). Load wearables after the title. If tiles stutter, pre-render thumbnails to WebP at build time with Playwright (already a dev dependency). Note that pre-rasterizing backgrounds (data-model §8 fallback) also needs a build tool. |
| 21 | Hidden cost | Medium | **No time or usage estimate.** "Sizing by scope, not calendar" (implementation-plan §2) gives the owner no way to plan. Art iteration is token-heavy (long path data, repeated revisions), and plan usage limits will set the calendar more than review time. The full E2E suite across 3 Playwright projects for nearly every AC is a large maintenance load, and screenshot tests break on every art tweak. | Estimate in Claude sessions per milestone and re-estimate at each gate. Limit screenshot tests to layout checks (safe areas, overlap), not art. Keep E2E to journeys plus the hotspot sweep, and move the rest to unit and component tests. |
| 22 | Gameplay / Home | Medium | **Decorating is thin and Move house is ambiguous.** 10 shop items across 8 slots means about one alternative per slot. AC-F4-4 / game-systems §2.1 fill slots "with the new home's starter item", which implies granting the other home's 8 starter items for free; not stated. | State whether moving grants the other starter set (recommended: yes, once, so moving is a gift, not a loss). Prefer more cheap small furniture over a second full room's worth of starter pieces if art time runs short. |
| 23 | Data model | Low | **Unlock types miss a case.** The postcard and stamp unlock on "first Paris photo", which `UnlockCondition` can't express. `JourneyStepId`, `IngredientId`, `StencilId`, `PoseId`, `PropId`, `StickerId`, `NpcLook` are undefined. Rewards apron/cap/beret aren't in any drawing task (T1.4 covers 35 items; T1.7 expects 38). | Add `{ kind: 'photoTaken'; destinationId }`. Define the missing types. Add the 3 reward wearables to T1.4 or T3.5/T4.7. |
| 24 | Contradiction | Low | **Small number mismatches.** Arm drawings 25 (game-systems §1.3) vs ~30 "6 sleeve states incl. bare" (implementation-plan §4; `none` already is bare). Home hotspots 6 (AC-F5-2) vs 8 (game-systems §2.3). Map hotspots 4 (AC-F7-2) vs the cat easter egg "counts as a hotspot" (§5.2). Paris hotspots 3 (AC-F12-4) vs 5 (§7.2) vs 4 (T4.4). Tower "top third" (§7.2) vs "top 70%" (visual-design §7.2). "Café cap" vs "Barista cap". | Make game-systems the single source for counts and have PRD/ACs reference it. |
| 25 | Contradiction | Low | game-systems §1.6 "Surprise me uses `Math.random`" vs CLAUDE.md "`src/game/` has no `Math.random()`". Settings location given three ways (visual-design §2.2 Album header and Home; game-systems "Home settings tile"; PRD J3 "Settings gear"). | Inject the RNG. Put one gear on Home and Map. |
| 26 | Safety / Parent | Low | The math gate (two numbers 3–9) is solved instantly by most 9–13-year-olds, and it guards Reset and Restore. | Use a two-step gate (e.g. 2-digit × 1-digit, or hold a button 3 s then answer). Keep "no lockout". |
| 27 | Legal | Low | AI-drafted art may not be protectable by copyright, and generated art can echo training data. Neither breaks the owner's rules for a family build. | Note it in credits as "original, AI-assisted". Before any public release: trademark search (already noted) and a likeness check of signature pieces. |
| 28 | Tech | Low | `<input accept="application/json">` may grey out `.json` files in the iOS Files picker depending on how the file was saved (uncertain). M4A/AAC decoding may fail in Firefox on some Linux setups (uncertain). `100dvh` plus a `visualViewport` resize listener is double handling. | Use `accept=".json,application/json"`. Test SFX in desktop Firefox. Pick one viewport strategy (`100dvh` on a fixed, non-scrolling stage) and verify in Safari and standalone. |

---

## Economy recheck (my own math)

Inputs from game-systems §3.5, §4.5, §6.2–6.4. "Typical" = 3 of 5 first-try tips; older children will get all 5.

**Per shift**

| Rank | Typical (3 tips) | Max (5 tips) | Reached at |
|---|---|---|---|
| R1 | 5×10 + 3×3 + 10 = **69** | 75 | start |
| R2 | 5×12 + 9 + 10 = **79** | 85 | 15 correct = after shift 3 |
| R3 | 5×14 + 9 + 10 = **89** | 95 | 40 correct = after shift 8 |

The doc's 69 / 75 / 85 / 95 are correct. Its "~280 later sessions" is low: 4 shifts at R2–R3 is 316–356.

**Session 1 income (coins earned, excluding the 120 start)**

| Source | J1 as written (2 shifts) | Balance table (4 shifts) |
|---|---|---|
| Journey steps 1–5 (15 each) | 75 | 75 |
| Pancakes first cook + ★★★ (golden window is generous) | 40 | 40 |
| Shifts at R1 typical | 138 | 276 |
| **Earned** | **253** | **391** (doc says ~300) |
| **Wallet before spending** (+120 start) | **373** | **511** |

Ticket = 250. After one typical item (~45) the J1 player has 328; after a dress (80) still 293. **The ticket is affordable in session 1 unless the child buys 2+ items.** PRD J1 step 6 and game-systems §6.5 ("usually during session 2") are not supported.

**Total purchasable cost**

| Group | Calculation | Coins |
|---|---|---|
| Wearables (22) | tops 5×45 + bottoms 4×42.5 + dresses 3×80 + outer 2×70 + shoes 3×50 + head 2×32.5 + neck 2×27.5 + bag 37.5 | ≈ 1,083 |
| Furniture (10) | doc uses 65 avg; band midpoint is 75 | 650–750 |
| Paris ticket | | 250 |
| Souvenirs | 40 + 35 + 30 | 105 |
| **Total** | | **≈ 2,090–2,190** (doc: ≈ 2,100, consistent) |

**Runway**

- One-off income for the whole game: 120 start + 90 Journey + 80 cooking (+40 Crêpes) = **290–330**.
- Needed from shifts: ≈ 1,800–1,900.
- Typical player: shifts 1–3 = 207, shifts 4–8 = 395 (602 total), then 89/shift → ≈ 14 more → **≈ 22 shifts**. Perfect player (likely for 10–13): **≈ 21 shifts**.
- At 60–120 s per shift (game-systems §3.1): **≈ 22–44 min of café play buys everything.** At 4 shifts per session that is ≈ 6 sessions (doc: 7–8), so about 1.5–2 hours of total play.
- All café progression (rank 3) is done at shift 8: **≈ 12 minutes of café play**, i.e. in session 2.
- After that, there is no coin sink, and the 99,999 cap is unreachable in any meaningful sense.

**AC-F10-4 check:** 250 ≤ 5 × 69 = 345 passes. But "5 shifts ≈ one session" contradicts §6.5 "≈ 4 shifts per session".

**Conclusion:** the per-shift numbers are internally correct; the session narrative and runway claims are not. Either accept session-1 Paris and say so, or raise the ticket to ~400 (affordable mid-session 2 for both scenarios). Either way, add the non-coin shift keepsake and a coin sink from finding #4, or the café loses its purpose about 2 hours in.

---

## Contradictions & gaps between docs

**Contradictions**

1. Session length: PRD J1 (1–2 shifts) vs game-systems §6.5 (≈ 4 shifts) vs AC-F10-4 (5 shifts ≈ one session).
2. Ticket timing: PRD J1.6 "most first sessions will not afford it" vs the math above.
3. Souvenir placement: PRD AC-F14-3 vs data-model §2.4 vs game-systems §3.4 (Espresso machine as `shelf`).
4. Debug overlay: implementation-plan T0.8 (dev build) vs data-model §9 (parent area).
5. Arm drawings: 25 (game-systems §1.3) vs ~30 (implementation-plan §4).
6. Hotspot counts: Home 6 vs 8; Map 4 vs 5 with the cat; Paris 3 vs 4 vs 5.
7. Tower size: "top third" (game-systems §7.2) vs "top 70% of the frame" (visual-design §7.2).
8. RNG purity: game-systems §1.6 vs CLAUDE.md.
9. Vision vs scope: "a photo she keeps forever" (PRD §1) vs photos excluded from backup (AC-F11-7) and evictable.
10. Sprinkles: rank-1 topping and rank-2 "new ingredient".
11. Cut order item 6 (photo at Home as stopgap) vs PRD §5.3 (home photos need v0.2 work); the stopgap isn't cheaper.

**Gaps (missing or untestable acceptance criteria)**

- No AC for the Safari → Home Screen save transfer (#2).
- No AC that photo colors match the viewfinder (#3).
- No AC for the "everything owned" state or for what a shift yields afterwards (#4).
- No age-split playtest metric; PRD §8 can pass with three 7-year-olds and say nothing about 10–13 (#5).
- No hotspot spec for Airport, Café, Boutique, Creator, Lifestyle, while the lint demands ≥ 3 per scene (#16).
- No café layout for ranks 2–3 on 375 px; stencil choice undefined (#17).
- No AC for Move house ownership (#22).
- No AC for the build version being visible, or for updates reaching a Home Screen install (#9).
- Untestable as labeled: AC-X-5 (E2E safe areas), AC-F1-1 (Lighthouse on iPhone), the ≥ 50 fps gate in Low Power Mode, AC-X-6 for free placement, 150% zoom on scene art (#13).
- AC-F16-3 "never mid-session" has no way to verify on device without a visible version.
- Hosting is "decide at M0" while T0.9 (PWA) and every gate depend on it (#1).

---

## What's good and should stay (brief)

- Hard safety rules (no timers, no random rewards, no network, kind failure) are concrete and enforceable.
- Pure `game/` rules, content as data, a single `reconcile()` for unlocks, and balance as unit tests.
- Save design: `current` + `previous`, validate before write, never auto-overwrite an unreadable save, migrations with fixtures.
- Procedural sleeves, slot-based decorating and NPCs from the same rig are the right art-saving moves.
- Art gate first (M0), and the gallery page for phone review.
- Tap alternatives for every drag, picture-only orders, a generous golden window: right for 7–9.
- Eiffel Tower rules (original, daytime, no logos) and the cultural-review field on destinations.
- Clear P0/P1/P2 tiers and an explicit cut order.

---

## Recommended changes before approval (prioritized)

1. **Pick HTTPS hosting now** and deploy every milestone there; show the build version on title and parent area; add "Update now". (#1, #9)
2. **Add an M0 iOS risk spike** on the owner's iPhone, pass/fail before M1: tinted rig → PNG; ArrayBuffer photo write/read after reload; Safari vs Home Screen storage; service-worker update in standalone; audio with the silent switch and after backgrounding; swipe-back with the sentinel pattern; `100dvh` in Safari and standalone. (#2, #3, #9, #10, #11, #12)
3. **Fix the rig in M0:** split front/back arms, sleeves with accent tint, hat × hairstyle and pose × outerwear gallery matrix. (#7)
4. **Add art controls in M0:** construction kit, golden references, automated art lint, and a pre-agreed fallback style with a trigger to use it. (#6)
5. **Give the café depth and an end state:** promote one opt-in challenge mode to P1, add a non-coin keepsake per shift, define a coin sink and an "everything collected" state. (#4, #5)
6. **Correct the economy docs** and decide when Paris should be affordable (ticket ~400 if session 2 is intended); make the balance test simulate both J1 and the 4-shift player. (#14)
7. **Move the first child playtest to the end of M3**, with at least one child aged 10–13 and an age-split metric. (#8, #5)
8. **Trim scope:** map to ~2 screens; Airport as a sheet or a specified 3-hotspot scene; Fruit Salad to v0.2 in favor of Crêpes if cooking needs cutting; keyboard placement limited to default spots; 150% zoom limited to UI. (#15, #16, #13)
9. **Resolve the contradictions list** (souvenir shelf, hotspot counts, overlay in production, RNG, settings location) and add the missing ACs. (#18, #19, #23–25)
10. **Give a rough estimate in Claude sessions per milestone** and reduce E2E/screenshot scope to journeys, the hotspot sweep and layout checks. (#21)

---

## Disposition (added by the spec author after the review)

All 28 findings were accepted, most in full. Revision 2 of the specs applies them, together with the owner's answers: public release, their own kids as playtesters, and future AI-agent testing.

| # | Outcome | Where |
|---|---|---|
| 1 | Accepted. HTTPS GitHub Pages from a public repo, decided now; LAN review dropped | implementation-plan §10, T0.1 |
| 2 | Accepted. Install card on first run; "Bring your game from Safari" guide; spike S3 | PRD AC-F16-2/4, data-model §5.5 |
| 3 | Accepted. `colors` prop + resolved hex in photo mode, frozen animations, `var(` lint; spike S1 | data-model §6, PRD AC-F13-7 |
| 4 | Accepted. 24 thank-you stickers per shift then Café Stars; café makeover sink (510); "collected everything" state | game-systems §3.9–3.10, PRD AC-F8-10/12/13 |
| 5 | Accepted. Challenge mode promoted to P1 (hidden bubble + peek, 2 customers from rank 2, sparkle bonus); age-split playtest metric | game-systems §3.8, PRD §8 |
| 6 | Accepted. Construction kit, golden references, art lint, batch lineups, fallback style with trigger | visual-design §13, T0.6 |
| 7 | Accepted. Back/front arm layers, accent + trim sleeves, fit matrix, moved into M0 | game-systems §1.2–1.3, T0.7, T1.7 |
| 8 | Accepted in part. Features kept (owner-requested), but kid playtest #1 moves to end of M3 and M4 slips as a whole if needed | implementation-plan §2–3 |
| 9 | Accepted. Version label, apply-on-title, "Update now"; spike S4 | PRD AC-F1-5, AC-F16-3 |
| 10 | Accepted. ArrayBuffer storage; photo scene records in backups, re-rendered on import | data-model §3.1, §5.5 |
| 11 | Accepted. Single sentinel entry; reworded check; drag surfaces off the left edge; spike S6 | data-model §4.1 |
| 12 | Accepted. Respect the silent switch with a hint; resume on visibility/tap; spike S5 | data-model §9, PRD AC-F15-4 |
| 13 | Accepted. Injected insets + device screenshot, throttled WebKit instead of Lighthouse, Low Power note, keyboard default spots, 150% zoom scoped to UI | PRD AC-X-5/6, AC-F1-1, implementation-plan §7–8 |
| 14 | Accepted. Ticket 250 → 400; session math corrected; balance test simulates both players | game-systems §6.5, PRD J1 |
| 15 | Accepted. Fruit Salad → v0.2, Crêpes in (reuses steps, adds fold, tighter window); dish becomes a photo prop; ★★★ always real | game-systems §4 |
| 16 | Accepted. Map ~2 screens; Airport hotspots specified; lint limited to explorable scenes | game-systems §5.1, §7.1, implementation-plan §6.3 |
| 17 | Accepted. Per-rank counter tabs; stencil shown in the bubble; caramel replaces the duplicate sprinkles gift | game-systems §3.4 |
| 18 | Accepted. Shelf has 3 keepsake spots; espresso machine is a keepsake | game-systems §2.2, data-model §2.4 |
| 19 | Accepted. Debug overlay in every build behind the grown-up gate, with Copy log | data-model §9, T0.10 |
| 20 | Accepted. Virtualized carousels; art chunk after the title; WebP thumbnail fallback | data-model §8 |
| 21 | Accepted. Rough estimate in sessions per milestone; E2E and screenshots trimmed | implementation-plan §2, §6.1 |
| 22 | Accepted. First move gifts the other starter set | game-systems §2.1 |
| 23 | Accepted. `photoTaken`, `shiftsCompleted`, `allPurchasablesOwned` unlocks; missing types defined; reward wearables in T1.4 | data-model §2 |
| 24 | Accepted. game-systems declared the single source for counts; numbers aligned | game-systems header, PRD ACs |
| 25 | Accepted. RNG injected; settings gear on Home and Map | game-systems §1.6, visual-design §2.2 |
| 26 | Accepted. Hold 2 s + 2-digit × 1-digit written in words | PRD AC-F15-2 |
| 27 | Accepted. "Original, AI-assisted" credit; likeness check in the release checklist | implementation-plan §11 |
| 28 | Accepted. `accept=".json,application/json"`; one viewport strategy (`100dvh` on a fixed stage); Firefox SFX check left to M5 | data-model §5.5, T0.4 |
