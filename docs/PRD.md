# PRD: Petalport v0.1 "First Day"

**Status:** Draft for approval · **Date:** 25 Oct 2026 · **Phase:** 2 (product definition, no code)
**Companion specs:** [game-systems.md](game-systems.md) · [data-model.md](data-model.md) · [visual-design.md](visual-design.md) · [implementation-plan.md](implementation-plan.md) · [plan-review.md](plan-review.md)
**Built on:** [research.md](research.md) · [game-concept.md](game-concept.md) · [technical-options.md](technical-options.md) · [roadmap.md](roadmap.md)

> **Revision 2 (after the independent review in [plan-review.md](plan-review.md) and your answers):** public release, real kids as playtesters, and future AI-agent testing are now in scope. Main changes: Paris ticket 250 → 400; Crêpes replaces Fruit Salad; café gets an opt-in Challenge mode, a thank-you sticker per shift and a café makeover coin sink; an M0 iPhone risk spike; HTTPS hosting from the start; photos survive backups; first kid playtest moves to the end of M3. The disposition of every finding is in plan-review.md §Disposition.

---

## 1. Product vision

A colorful, modern virtual-life game where a child creates a character who feels like *her*, makes a home, works a fun job, cooks, shops, and flies to Paris to take a photo she can keep (in her album, in backups, and on her device). It runs in iPhone Safari, works offline, collects no data and sells nothing.

**The interaction promise:** every primary action shown to the player produces a visible, meaningful result: something changes, something is made, or something is kept. No dead taps, no "coming soon" buttons, no button that just hands out coins.

## 2. Audience

- **Primary:** girls aged 7–13 (the user's stated audience), playing alone on an iPhone.
- **Design split:** 7–9 year olds must be able to play every core flow without reading. 10–13 year olds must not find it babyish ("mature look, simple controls", research §6).
- **Secondary:** the parent who installs it, manages saves, and needs to trust it.

## 3. Goals and non-goals

### Goals for v0.1

1. A **15–20 minute first session** that a child wants to repeat.
2. Prove the **core loop**: express (dress, decorate) → do (job, cook) → earn → choose (buy at a known price) → remember (photo, souvenir).
3. Prove the **art bar** on a real iPhone: one coherent original style across character, home, map, café and Paris.
4. Prove **safe persistence**: nothing a child makes is lost on reload, and a parent can back it up.

### Non-goals for v0.1 (explicit)

- Backend, accounts, cloud save, multiplayer, chat, sharing to other players.
- Ads, in-app purchases, premium currency, loot boxes, spin wheels, energy, streaks, countdown offers.
- Analytics or any network call after the first load.
- Free-drag furniture placement, pattern designer, pets, seasons, multiple destinations, a second job.
- Localisation (strings are externalised so it can come later).

## 4. Design principles (carried from game-concept §2, sharpened)

1. **Everything you see, you can touch.** Every scene has at least 3 hotspots that give feedback. Non-interactive art is background only and never looks like a button.
2. **Making over buying.** Every activity ends with something made: an outfit, a dish, a room, a photo.
3. **Kind progression.** Known prices, deterministic rewards, nothing expires, no penalty for leaving, no failure states that take things away.
4. **Readable without reading.** Icon + color + motion carry meaning. Text supports.
5. **Private by design.** Nothing leaves the device. Photos go to the device only when the player chooses.

## 5. Scope of v0.1

### 5.1 What is in

| # | Feature | Summary | Priority |
|---|---|---|---|
| F1 | Title & boot | Animated waterfront, "Tap to start" unlocks audio, loads save | P0 |
| F2 | Character creator | 10 skin tones, 8 hairstyles × 10 colors, 6 eye styles × 8 colors, 3 brows, freckles, glasses; live preview | P0 |
| F3 | Wardrobe (Closet) | 9 slots (5 clothing + 4 accessory), tints, 4 saved favorite looks, live preview | P0 |
| F4 | Lifestyle & starter home | Choose Urban "Harbour Loft" or Countryside "Meadow Cottage", then 1 of 3 color themes | P0 |
| F5 | Home scene | Illustrated room, 6 hotspots, slot-based decorating with 8 slots | P0 |
| F6 | Cooking (home activity) | Step-based recipes at the home kitchen: Pancakes (start), Crêpes (unlocked after Pancakes) | P0 |
| F7 | Town map | Illustrated vertical map (~2 screens), 4 working locations + 2 visible roadmap places | P0 |
| F8 | Sunny Café job | "Order Up!" assembly mini-game, 5-customer shifts, 3 ranks, opt-in Challenge mode, thank-you stickers, café makeover | P0 (Challenge: P1) |
| F9 | Ribbon Boutique | Known-price shop with Clothes and Home tabs, fitting-room try-on, savings goal | P0 |
| F10 | Economy & progression | Coins, prices, rewards, unlocks, Welcome Journey | P0 |
| F11 | Save & restore | Autosave to IndexedDB, backup slot, migrations, parent-gated export/import | P0 |
| F12 | Airport → Paris | Buy a ticket once, fly, illustrated Paris scene with an original Eiffel Tower | P1 |
| F13 | Photo mode & album | Pose, expression, prop, sticker, shutter → saved to the local album, optional save to device | P1 |
| F14 | Souvenirs & passport | Paris kiosk (3 souvenirs), passport stamp, souvenirs placeable at home | P1 |
| F15 | Parent area & settings | Two-step grown-up gate, sound, reduced motion, export/import, reset, credits, privacy notice, version + update, debug log | P0 |
| F16 | Install & offline | PWA offline cache, "Add to Home Screen" card on first run, Safari → Home Screen save transfer | P0 |
| F17 | Fruit Salad recipe | Moved to v0.2 (needs 2 new step types); listed so nobody re-adds it by accident | v0.2 |

P0 = the game is not playable without it. P1 = required for the v0.1 gate but can slip one milestone. P2 = cut if behind.

### 5.2 Locations: v0.1 vs roadmap

| Location | v0.1? | What it opens |
|---|---|---|
| **Home** (Harbour Loft or Meadow Cottage) | **Yes** | Home scene: decorate, cook, closet, nap, album, souvenir shelf |
| **Ribbon Boutique & Home** | **Yes** | Shop + fitting room |
| **Sunny Café** (the workplace) | **Yes** | "Order Up!" job |
| **Airport** | **Yes** (P1) | Ticket desk → flight → Paris |
| Petal Park | Roadmap v0.2 | Picnic, ducks, kite, photo spot. Shown on the map as scenery, no hotspot |
| Bloom Florist (2nd job) | Roadmap v0.3 | Bouquet job. Shown as scenery with scaffolding, no hotspot |
| Pet Salon, Photo Studio, Bakery | Roadmap v0.3+ | Not drawn in v0.1 |

**Rule:** roadmap places may appear as painted scenery, but they are never styled like a hotspot (no sign-pin, no pulse, no hover state). Tapping scenery does nothing *by design* and is not counted as a dead tap because nothing invited the tap.

### 5.3 What changed from game-concept §6, and why

| Change | Reason |
|---|---|
| **Added** lifestyle choice, cooking, airport, Paris, photo album | Explicitly requested in Phase 2. |
| **Cut** Boutique styling job and the notice-board briefs (moved to v0.2) | Two jobs plus cooking plus Paris is too much art and logic for a first playable. One deep job beats two shallow ones. |
| **Merged** Market into the Boutique ("Clothes" and "Home" tabs) | One fewer location to draw; the map stays honest (every pin works). |
| **Changed** free-drag furniture to **slot-based** decorating | Free drag needs z-ordering, collision, and art that looks good anywhere. Slots give a composed, premium room and far less code. Free drag stays on the roadmap (v0.2). |
| **Changed** photo mode from "3 backdrops, 4 poses" at home to the Paris photo spot | Paris is where a photo means something. Home photos come in v0.2 by reusing the same engine. |
| **Swapped** Fruit Salad for Crêpes (after review) | Crêpes reuse the pancake steps, so a second recipe costs mostly art, not new mechanics. |

## 6. Core user journeys

### J1. First session (15–20 min)

1. Title → tap → **Character creator** (≈3 min).
2. **Choose lifestyle** (urban / countryside) and a color theme → arrive **Home**. A gentle pointer shows the kitchen.
3. **Cook Pancakes** (≈2 min) → dish appears on the table, first-recipe bonus coins, Welcome Journey step ticks.
4. Dock → **Map** → **Sunny Café** → play 2–4 **shifts** (≈4–6 min). Each shift also gives a customer thank-you sticker.
5. **Boutique** → try on, buy a first item, equip it, save a favorite look.
6. **Airport** (ticket 400 coins). A first session earns about 250–390 coins on top of the 120 start, and most children spend some in the Boutique, so most won't afford it yet; the savings goal ring shows progress. This is deliberate: a reason to come back that the player chose. A child who saves everything can fly in session 1, and that's fine too.
7. Optional: decorate a slot at home.

### J2. Second/third session

1. Load straight to Home (no title replay beyond the tap).
2. 2–3 shifts → buy the ticket → **fly to Paris** → pose → photo → **album** + **souvenir** + **stamp**.
3. Place the souvenir on the home shelf. Cook Crêpes. Try the café Challenge mode (older players).

### J3. Parent backup

1. Settings gear → math gate → **Back up game** → file download or share sheet.
2. On a new device or after data loss: **Restore from backup** → validates → loads.

## 7. Feature requirements and acceptance criteria

Each criterion is testable. "E2E" means covered by a Playwright test; "Unit" by Vitest; "Manual" by the device checklist in [implementation-plan.md §6](implementation-plan.md#6-testing-strategy). Detailed rules live in [game-systems.md](game-systems.md).

### F1. Title & boot

- **AC-F1-1** The title scene renders within 3 s over a throttled 4G profile on first load and within 1 s from the offline cache. *(Playwright WebKit with network throttling + one stopwatch check on the real iPhone)*
- **AC-F1-5** The build version (e.g. `v0.1.0-m3+abc123`) shows small on the title and in the parent area. *(E2E)*
- **AC-F1-2** The first tap creates or resumes the AudioContext; SFX play on the next tap. *(Manual on iPhone)*
- **AC-F1-3** With no save: the tap leads to the creator. With a valid save: it leads to Home. With a corrupt save: it leads to the recovery screen (F11). *(E2E)*
- **AC-F1-4** The title has a visible mute toggle that persists. *(E2E)*

### F2. Character creator

- **AC-F2-1** Tabs: Skin, Hair, Eyes, Face (brows, freckles, glasses). Each option is a thumbnail, not a word. *(E2E)*
- **AC-F2-2** Every tap updates the live preview within 100 ms with a small bounce. *(Manual + E2E asserting DOM change)*
- **AC-F2-3** Counts: 10 skin tones, 8 hairstyles covering coily, curly, wavy and straight textures plus braids and a head covering, 10 hair colors, 6 eye styles, 8 eye colors, 3 brows. *(Unit: content count test)*
- **AC-F2-4** Skin tones are shown in a non-ranked order (not light→dark). *(Review)*
- **AC-F2-5** A "Surprise me" button produces a random *valid* look; it never grants items. *(Unit)*
- **AC-F2-6** Name is optional, max 12 characters, letters/spaces only, with 6 suggested names. Empty is allowed. *(Unit + E2E)*
- **AC-F2-7** "Done" saves the appearance; it can be re-edited later from the Closet ("Change me" button). *(E2E)*

### F3. Wardrobe (Closet)

- **AC-F3-1** Slots: clothing = top, bottom, dress, outerwear, shoes; accessories = headwear, eyewear, neck, bag. *(Unit)*
- **AC-F3-2** Equipping a dress unequips top and bottom; equipping a top or bottom unequips a dress. The previous items stay owned. *(Unit)*
- **AC-F3-3** Slots that allow "none" (outerwear and all accessories) show a "none" tile. Top+bottom or dress can never both be empty (no undressed character). *(Unit)*
- **AC-F3-4** Items with tint regions show up to 12 swatches; the chosen tint is stored per equipped item and per saved look. *(Unit + E2E)*
- **AC-F3-5** 4 favorite-look slots. Tapping an empty slot saves the current look with a heart animation; tapping a filled slot wears it; a small edit button lets the player overwrite or clear it. *(E2E)*
- **AC-F3-6** If a saved look references an item no longer in the catalog, that slot falls back to the starter item and the look still loads. *(Unit)*
- **AC-F3-7** Empty category shows the empty state with a "Visit the Boutique" button that navigates there. *(E2E)*

### F4. Lifestyle & starter home

- **AC-F4-1** After the creator, the player sees two illustrated postcards (Harbour Loft, Meadow Cottage) and picks one with one tap; a second tap on "Move in!" confirms. *(E2E)*
- **AC-F4-2** Then 3 color themes for that home, previewed live on the room illustration. *(E2E)*
- **AC-F4-3** The choice sets the home scene, the starter furniture, and where the Home pin sits on the map. *(Unit)*
- **AC-F4-4** The player can move later for free from Home → Settings tile "Move house". Owned furniture is kept; slots are re-filled from owned items where compatible. *(Unit)*

### F5. Home scene

- **AC-F5-1** The home is a full-bleed illustration, not a menu. *(Review)*
- **AC-F5-2** Six hotspots, each with feedback within 100 ms: **Closet** (opens wardrobe), **Kitchen** (opens cooking), **Bed** (nap: sky goes dusk and back, character yawns), **Lamp** (toggles on/off; the room lighting changes), **Plant** (water: leaves bounce, a bloom appears for the session), **Shelf** (opens the souvenir shelf and album). *(E2E: each hotspot changes DOM state)*
- **AC-F5-3** "Decorate" mode highlights 8 slots (wall art, window, sofa/seat, rug, table, lamp, plant, shelf). Tapping a slot opens a carousel of owned compatible items; tapping one swaps it in place with a plop animation. *(E2E)*
- **AC-F5-4** Each slot accepts only items whose `homeSlot` matches; incompatible items never appear in that carousel. *(Unit)*
- **AC-F5-5** The character stands in the room wearing the current outfit and does an idle animation. *(Manual)*

### F6. Cooking

- **AC-F6-1** The recipe book shows unlocked recipes as cards and locked ones as silhouettes that state the unlock condition in icon + words. *(E2E)*
- **AC-F6-2** Pancakes has 5 steps: add (3 ingredients), mix, pour, flip at the right moment, decorate. Crêpes has 6: add, mix, pour thin (tilt the pan), flip, fold, decorate. *(Unit: recipe definitions)*
- **AC-F6-3** A wrong ingredient bounces back out with a gentle "boing" and the correct one wiggles. Nothing is lost and the step can't fail. *(E2E)*
- **AC-F6-4** The flip step always succeeds; timing only changes the result (pale / golden / toasty) and the star. *(Unit)*
- **AC-F6-5** Every drag in cooking has a tap alternative: tap ingredient, then tap bowl. *(E2E with taps only)*
- **AC-F6-6** Stars 1–3 follow the rules in game-systems §4.3; rewards follow §6.3. Repeat cooks give the dish but no coins. *(Unit)*
- **AC-F6-7** The finished dish appears on the home table slot and persists until the player taps it and chooses "Eat" (happy animation) or replaces it with another dish. *(E2E)*
- **AC-F6-8** The latest dish is available as a prop in photo mode, so cooking again changes what you can photograph. *(E2E)*

### F7. Town map

- **AC-F7-1** The map is one illustrated vertical scene, about 2 screens tall on a 390×844 viewport, scrollable by drag and by mouse wheel. *(Manual + E2E)*
- **AC-F7-2** 4 location hotspots (Home, Café, Boutique, Airport), each with a sign showing icon + name. Hit area ≥ 120×120 CSS px. Ambient hotspots (the cat) are in addition. *(Unit on layout data + E2E)*
- **AC-F7-3** Tapping a location shows a preview card (name, picture, 1-line "what you do", big "Go" button). "Go" plays the zoom transition and opens the scene. *(E2E)*
- **AC-F7-4** A locked location (Airport before the ticket) still opens: the ticket desk is the activity. Nothing on the map is a dead end. *(E2E)*
- **AC-F7-5** The map remembers its scroll position for the session. *(E2E)*
- **AC-F7-6** Ambient life: at least 3 animated details (boat, birds, café steam) that respect reduced motion. *(Manual)*

### F8. Sunny Café job

- **AC-F8-1** A shift has 5 customers. Each shows an order bubble made of pictures only. *(E2E)*
- **AC-F8-2** The player builds the order by tapping ingredients (drag also works). The cup/plate shows each addition. *(E2E)*
- **AC-F8-3** Serving a correct order: customer cheers, coins arc to the counter, order pay is added. Serving a wrong order: the customer shows which part differs (highlighted icon); the player fixes it and serves again with no pay lost except the first-try tip. *(Unit + E2E)*
- **AC-F8-4** The bin clears the current order with no penalty other than losing the first-try tip. *(Unit)*
- **AC-F8-5** No timer or patience meter in standard mode. Customers never leave angry. *(Review + Unit)*
- **AC-F8-6** Leaving mid-shift asks once; coins for orders already served are kept. *(E2E)*
- **AC-F8-7** End-of-shift card shows orders served, coins earned, rank progress, and a "Play again" / "Map" choice. *(E2E)*
- **AC-F8-8** Rank 2 and 3 thresholds, new order types and unlock gifts follow game-systems §3.4. *(Unit)*
- **AC-F8-9** Customers are built from the same character rig and wardrobe catalog with seeded variety. *(Unit)*
- **AC-F8-10** Every completed shift gives the next uncollected customer thank-you sticker (24 in v0.1), shown on the shift card and in the sticker page of the album. After all 24, the shift card shows a "Café Star" sticker count instead. *(Unit + E2E)*
- **AC-F8-11** Challenge mode is opt-in from the café door at any rank, off by default, and follows game-systems §3.8. Turning it off is always one tap. *(Unit + E2E)*
- **AC-F8-12** The café makeover board lists 5 café decor items with prices; bought items appear in the café scene immediately and persist. *(E2E)*
- **AC-F8-13** When every purchasable item in the game is owned, the Boutique and map show a "You've collected everything!" celebration once, and shifts still award stickers and count toward Café Star. *(Unit + E2E)*

### F9. Ribbon Boutique

- **AC-F9-1** Two tabs: Clothes and Home. Every item shows its price; owned items show a check and no price. *(E2E)*
- **AC-F9-2** Tapping a clothing item puts it on the character in the fitting room immediately, owned or not ("try before you buy"). *(E2E)*
- **AC-F9-3** "Buy" is enabled only when coins ≥ price; otherwise it shows how many more coins are needed and offers "Save for it" (sets the savings goal). *(Unit + E2E)*
- **AC-F9-4** Purchases are atomic: coins and inventory change together or not at all, and are saved immediately. *(Unit)*
- **AC-F9-5** After buying a wearable, "Wear it now" equips it; after buying furniture, "Place it" jumps to Home decorate mode with that slot open. *(E2E)*
- **AC-F9-6** Leaving the fitting room with unbought items on reverts them to the last owned outfit with a friendly "back on the rack!" animation. *(E2E)*
- **AC-F9-7** No sale timers, no "limited", no random stock. *(Review)*

### F10. Economy & progression

- **AC-F10-1** Starting coins, prices, rewards and unlocks match game-systems §6 exactly; they live in content files, not in code. *(Unit: snapshot of balance table)*
- **AC-F10-2** Coins can never go negative and never exceed 99,999. *(Unit, property test)*
- **AC-F10-3** Every item in the catalog is obtainable: purchasable, a starter item, or tied to a reachable unlock. *(Unit: reachability test)*
- **AC-F10-4** No single item costs more than the coins from 6 typical rank-1 shifts (6 × 69 = 414), i.e. about 1.5 typical sessions of 4 shifts. *(Unit)*
- **AC-F10-7** A simulated J1 player (2 shifts, 1 purchase) cannot afford the ticket in session 1; a simulated 4-shift saver can by mid-session 2. *(Unit balance simulation)*
- **AC-F10-5** The Welcome Journey shows 6 steps with icons; each step ticks once and pays once. *(Unit + E2E)*
- **AC-F10-6** The savings goal ring in the HUD shows coins / price for the pinned item and celebrates when affordable. *(E2E)*

### F11. Save & restore

- **AC-F11-1** Every committed change (purchase, equip, decorate, reward, settings) is saved within 1 s. Reloading the page restores it exactly. *(E2E)*
- **AC-F11-2** Writes go to `current` after copying the old value to `previous`. A failed validation of `current` loads `previous` and tells the player gently. *(Unit)*
- **AC-F11-3** Saves carry `schemaVersion`; migrations from every older version are unit-tested. *(Unit)*
- **AC-F11-4** If IndexedDB is unavailable (private mode, quota), the game still plays and shows a "Saving is paused on this device" banner with a link to the parent area. *(E2E with storage mocked)*
- **AC-F11-5** Export produces a file `petalport-backup-YYYY-MM-DD.json`; import validates it, shows a summary (name, coins, items, photos) and asks to confirm before replacing. Invalid files show a friendly error and change nothing. The file picker accepts `.json,application/json`. *(E2E round-trip)*
- **AC-F11-6** `navigator.storage.persist()` is requested once after the first meaningful action; the result is shown in the parent area. *(Unit with mock)*
- **AC-F11-7** The backup includes each photo's *scene record* (pose, outfit, props, stickers; about 1 KB each), not the image. On import, photos are re-rendered from their records into the album. *(E2E round-trip: album count and thumbnails match)*

### F12. Airport → Paris

- **AC-F12-1** The airport ticket desk shows the Paris ticket (400 coins) as a big illustrated ticket. Buying it is one-time; afterwards flights are free. *(Unit + E2E)*
- **AC-F12-6** The Airport has the 3 hotspots in game-systems §7.1 (ticket desk, departures board, luggage trolley). *(E2E)*
- **AC-F12-2** Before the ticket is affordable, the desk shows the coins still needed and a "Save for it" button. *(E2E)*
- **AC-F12-3** The flight is a skippable 1.2 s plane-and-clouds transition. *(E2E)*
- **AC-F12-4** The Paris scene shows an original stylized Eiffel Tower in daylight or golden hour, plus the 5 hotspots listed in game-systems §7.2. *(E2E + art review)*
- **AC-F12-5** A "Fly home" button is always visible and returns to the map. *(E2E)*

### F13. Photo mode & album

- **AC-F13-1** Photo mode offers 4 poses, 3 expressions, 5 props (none, beret, croissant, balloon, your latest dish), and up to 6 stickers (drag, or tap sticker then tap spot; keyboard places at the next default spot). Each choice updates the viewfinder within 100 ms. *(E2E)*
- **AC-F13-7** The saved photo's colors match the viewfinder exactly, including tinted clothes and the home theme (pixel-sampled at 5 points). *(E2E + real-iPhone check in the M0 spike)*
- **AC-F13-2** The shutter plays a flash and a polaroid-drop animation and saves a 1080×1350 image plus a 270×338 thumbnail to the local album. *(E2E: album count +1)*
- **AC-F13-3** The album shows photos newest first and survives reload. *(E2E)*
- **AC-F13-4** "Save to my device" uses the share sheet where file sharing is supported, otherwise a download, otherwise opens the image so a long-press can save it. *(Manual on iPhone + E2E for download)*
- **AC-F13-5** The album holds up to 60 photos. At the limit it shows a friendly "Album full: remove one to add more" state; it never deletes silently. *(Unit + E2E)*
- **AC-F13-6** No photo content leaves the device unless the player uses "Save to my device". *(Review: no network code)*

### F14. Souvenirs & passport

- **AC-F14-1** The first Paris photo grants the Paris passport stamp and the free "Paris Postcard" souvenir with a celebration. *(Unit + E2E)*
- **AC-F14-2** The kiosk sells Mini Tower (40), Beret (35, wearable), Macaron Box (30). *(Unit)*
- **AC-F14-3** Souvenirs that are furniture go into the home Shelf slot; the shelf shows up to 3 at once and the player picks which. *(E2E)*
- **AC-F14-4** The passport (in the album) shows a stamp for each visited destination and empty dashed outlines for future ones without naming unreleased places. *(E2E)*

### F15. Parent area & settings

- **AC-F15-1** Child-facing settings (no gate): music on/off, sound effects on/off. *(E2E)*
- **AC-F15-2** Parent area behind a two-step gate: hold the "For grown-ups" button 2 s, then type the answer to a 2-digit × 1-digit sum written in words ("fourteen times six"). Wrong answers just shake; no lockout. *(E2E)*
- **AC-F15-3** Parent area: back up, restore, storage status, reduced motion override, reset game (double confirm), credits & licenses, privacy notice ("This game collects nothing"), version + "Update now" when an update is waiting, and the debug log with "Copy log". *(E2E)*
- **AC-F15-4** Child settings include "No sound? Check your phone isn't on silent" next to the sound toggles. *(Review)*

### F16. Install & offline

- **AC-F16-1** After the first full load, the game works in airplane mode, including fonts, sounds and all v0.1 scenes. *(E2E with offline context + Manual)*
- **AC-F16-2** In Safari (not standalone), the "Add to Home Screen" card with an illustrated 2-step guide appears **on first run, before the creator** (skippable), and again from the parent area. It's never shown during an activity. *(E2E)*
- **AC-F16-3** A waiting update applies the next time the title screen shows, never mid-activity, never discards the save, and can be forced from the parent area. The version label proves which build is running. *(E2E + Manual)*
- **AC-F16-4** If the game starts in Home Screen mode with no save, it offers "Bring your game from Safari": a 3-step guide (export in Safari → open the file here → confirm). *(E2E for the import half; Manual on iPhone)*

### F17. Fruit Salad (v0.2)

Not in v0.1. Crêpes is the second recipe (AC-F6-2).

### Cross-cutting acceptance criteria

- **AC-X-1 No dead taps.** Every element styled as interactive produces visible or audible feedback within 100 ms. Every hotspot is registered in a scene's hotspot list, and a test taps each one. *(E2E)*
- **AC-X-2 Targets.** All interactive targets ≥ 44×44 CSS px; primary actions ≥ 56 px tall. *(E2E measuring bounding boxes)*
- **AC-X-3 Contrast.** All text meets WCAG AA (4.5:1, or 3:1 for ≥ 24 px). *(Unit on token pairs + axe in E2E)*
- **AC-X-4 Reduced motion.** With `prefers-reduced-motion: reduce`, no transform animation exceeds 150 ms and there are no zooms or flights; cross-fades replace them. *(E2E)*
- **AC-X-5 Safe areas.** No hotspot or text lies under the notch, Dynamic Island, or home indicator in portrait on iPhone SE, 13/14/15, and Pro Max sizes. *(E2E with injected fake safe-area insets, since emulation reports zero insets, plus a real-iPhone screenshot at each gate)*
- **AC-X-6 Desktop.** All flows complete with mouse only and with keyboard only (Tab, Enter/Space, Esc = back). Free placement (stickers, toppings) uses "place at next default spot" from the keyboard. *(E2E)*
- **AC-X-7 Zero network.** After first load, the app makes no network requests except service-worker update checks for its own files. *(E2E asserting request log)*
- **AC-X-8 Licenses.** Every third-party asset is listed in `content/credits.ts` and shown on the credits screen. Our own art is credited as "original, AI-assisted". *(Unit: every asset file has a credits entry)*
- **AC-X-9 Agent-testable.** Every hotspot and primary control has a stable `data-testid`; preview builds accept `?seed=` and `?fixture=` (load a named test save); the game exposes no test hooks in the production build. *(Unit + E2E)*

## 8. Success metrics (playtest gate, no analytics)

Measured by watching your children play on an iPhone, with a parent present. **Two rounds:** a first playtest at the end of M3 (Me + Home + Café + Boutique) and the full gate at M5. Each round should include at least one child aged 7–9 and, if possible, one aged 10–13; results are recorded per age band.

| Metric | Target |
|---|---|
| Completes creator → home → first cook → first shift without adult help | ≥ 2 of 3 children |
| Dead taps observed (tap on something that looked tappable and did nothing) | 0 |
| Changes outfit unprompted | ≥ 2 times per child |
| Reaches Paris by end of session 2 | ≥ 2 of 3 |
| Asks to play again, or names something they want to buy next | ≥ 1 child |
| A 10–13 player chooses another café shift (or Challenge mode) unprompted after shift 3 | Yes |
| Describes what they *made* (dish, look, photo) when asked "what did you do?" | Most answers |
| Smoothness on the user's iPhone during map scroll and transitions | No visible stutter; debug overlay ≥ 50 fps with Low Power Mode off |

## 9. Constraints

- **Budget:** zero paid services. Free/open-source tools, original art, CC0 or credited CC-BY audio, OFL fonts.
- **Platform:** iPhone Safari (iOS 17+) first, including Home Screen mode; desktop Chrome, Safari, Firefox and Edge (latest 2) must work.
- **Privacy:** no accounts, no analytics, no network after load, no camera/mic/location.
- **Tech:** per technical-options §3: React + TypeScript + Vite, SVG art, Zustand, IndexedDB, service worker.
- **Release:** public, via a public GitHub repo and GitHub Pages (HTTPS). The release checklist is in implementation-plan §11.
- **Content legality:** original art only for signature content. The Eiffel Tower is drawn as an original stylized daytime illustration with no official logo, and not as the night-time light show (see visual-design §8).

## 10. Assumptions (the Phase 1 questions are still unanswered)

| Question | Answer / assumption |
|---|---|
| Family project or public release? | **Public release (your answer).** Adds the release checklist in implementation-plan §11: privacy notice, a legal review of the children's-privacy posture, a trademark search for "Petalport", a cultural review of Paris, and a likeness check of signature art. |
| Do you have a Mac? | **Still unanswered; no Mac assumed.** Debugging relies on Playwright WebKit plus the in-app debug log. |
| Real children to playtest? | **Yes (your answer).** Two playtest rounds (§8). |
| GitHub repo? | **Public GitHub repo** (being set up in the research thread). Every milestone deploys to GitHub Pages over HTTPS, which the service worker, sharing and storage APIs need. |
| Automated testing by an AI agent later? | **Yes (your answer).** Designed in from M0: stable test IDs, seeded runs, fixture saves, scripted journeys and screenshots an agent can run (implementation-plan §12). |
| Character framing | Feminine-styled defaults with every option open to everyone (as recommended in Phase 1). |
| Language | English only, strings externalised. |

## 11. Risks (top 5; full review in [plan-review.md](plan-review.md))

| Risk | Mitigation in this spec |
|---|---|
| Art volume is the bottleneck (≈ 275 SVG pieces, implementation-plan §4) | Slot decorating, one rig, procedural sleeves, NPCs reuse the rig, Paris is P1 and can slip. Asset budget in implementation-plan §4. |
| Café job feels repetitive | Picture orders that grow in complexity by rank, first-try tips, customer variety, and a shift of only 5. |
| Safari data loss | Backup slot, export/import, persist(), Home Screen card. |
| Scope creep from Paris and photos | Strict P0/P1/P2 tiers; Paris has one scene only; cut order is defined. |
| Pose × outfit art explosion | Poses change arms only; sleeves are drawn by front/back arm layers from the top's sleeve type and tints. |
| AI-drafted art drifts in style | Construction kit, golden references, automated art lint, batch reviews, pre-agreed fallback style (visual-design §13). |
| iOS browser quirks (photo colors, separate Home Screen storage, stale updates, audio, swipe-back) | M0 iOS risk spike on your iPhone before any system depends on them (implementation-plan §3.1). |
