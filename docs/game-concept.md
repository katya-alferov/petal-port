# Game Concept: **Petalport** (working title)

*A pocket seaside city where you dress up, work fun jobs, make a home, and travel the world, then turn it all into scenes and memories.*

> **Name check.** A quick web search on 25 Oct 2026 found no game called "Petalport". That is not a trademark search; do a formal one before publishing.
> **Fallback names:** *Postcard Lane*, *Sunny Pier*, *Ribbon Bay*.

Evidence tags follow [research.md](research.md): **[V]** verified, **[H]** hypothesis, **[R]** recommendation.

---

## 1. Positioning: what makes it different

| Classic virtual cities gave us… | Modern risks we avoid | Petalport's twist |
|---|---|---|
| A doll that stands for *you*, a plaza of shops, a room you own | Open chat, VIP paywalls, loot boxes, ads [V] | **Fully offline, single-player, nothing to buy.** Every item is earnable at a visible price. |
| Shopping as the main verb | Consumerism critique [V] | **Making is the main verb.** You *cook*, *style*, *arrange*, *photograph*; shopping supports it. |
| Contests judged by other players | Appearance pressure, social ranking [V] | **NPC friends with briefs** ("a rainy-day picnic look"). They reward creativity and matching the brief, never "prettiest". |
| Extra locations sold as DLC | Locations that feel samey [V] | **Travel as a journey.** Each destination has its own *verb*, outfit set, recipe and souvenirs that physically fill your home's **Memory Shelf**. [H] This loop is underexplored in the games examined. |

**One-line pitch:** *Toca-level freedom to touch everything, Stardoll-level fashion depth, Animal Crossing-style collections you can see, all wrapped in a postcard-bright seaside city with no strangers, no shop button and no timers.*

---

## 2. Design principles

1. **Everything you see, you can touch.** Every scene has ≥ 3 interactive objects with sound or animation feedback. Decoration that does nothing is background only.
2. **Making over buying.** Currency exists to *unlock materials for creativity*, not as the goal. Every activity ends with something the player made (a dish, an outfit, a bouquet, a photo).
3. **Kind progression.** Known prices, no randomness for rewards, no streaks, no energy, nothing expires, and absence is never punished. Return motivation comes from autonomy, competence and relatedness [V, SDT], not FOMO.
4. **Readable without reading.** Icon + color + motion carry meaning, and text is a bonus. Big targets (≥ 56 px primary). One clear primary action per screen.
5. **Private by design.** No accounts, no network after load, no data leaves the device. Photos are saved only when the player chooses.

---

## 3. Core gameplay loop

```
          ┌──────────────── EXPRESS ────────────────┐
          │  dress up · decorate · stage a photo     │
          ▼                                          │
   GET A BRIEF ──► GO SOMEWHERE ──► DO (30–90 s) ──► EARN ──► COLLECT ──┘
   (NPC friend,    (city map:       (job mini-game,  (coins +   (shop items,
    job order,      café, boutique,  cooking, travel  a sticker  souvenirs,
    postcard)       park, airport)   activity)        or recipe) Memory Shelf)
```

- **Micro loop (1–2 min):** pick a job or request, play a short skill mini-game, earn coins and a small guaranteed reward.
- **Session loop (10–20 min):**
  - complete 2–4 activities
  - buy a chosen item at a known price
  - restyle your character or room
  - snap a photo
- **Long loop (weeks):**
  - Job ranks unlock *new verbs*. For example, Café rank 3 adds latte art; Boutique rank 3 lets you design fabric patterns.
  - Saving for a plane ticket unlocks a new destination.
  - Collections fill the Memory Shelf and the Sticker Album.

### Return hooks (non-manipulative)

| Hook | How it works | Why it's okay |
|---|---|---|
| **Weekly Post Box** | One free gift appears each week. It waits forever and gifts don't stack pressure. | Inspired by Toca's Friday Post Office [V]. No streak. |
| **Friends' briefs** | 3 open requests on a notice board, refreshed when completed (not on a timer). | Gives direction, not obligation. |
| **Savings goals** | The player pins an item and a progress ring shows coins toward it. | Self-chosen goal = autonomy. |
| **Visible collections** | Souvenir shelf, recipe book, sticker album with silhouettes. | Completion drive, all deterministic. |
| **Day and weather** | The city changes with the device clock (morning/evening, seasons). Purely cosmetic. | Novelty without a deadline. |

### Explicitly excluded

Loot boxes, spin wheels, gacha, energy, countdown timers, daily streaks, leaderboards, public sharing, chat, ads, IAP, accounts, location, camera, mic.

---

## 4. The world

**Petalport** is a hilly seaside town drawn as a single vertical-scrolling **illustrated map** that feels like a pop-up book. Districts unlock gradually.

| Place | Interaction (verb) | Unlock |
|---|---|---|
| **Your Home** (starter studio → bigger homes) | Drag-and-place furniture, recolor walls and floors, Memory Shelf | Start |
| **Wardrobe / Dressing Room** | Layered dress-up, color swatches, save 6 looks | Start |
| **Sunny Café** (job) | Assemble orders: drag ingredients in sequence; later, latte art tracing | Start |
| **Ribbon Boutique** (job) | Style an NPC to a brief using shop stock, scored on matching tags and color harmony | Start |
| **Market Street** (shops) | Clothes, furniture, ingredients at fixed visible prices | Start |
| **Photo Studio** | Choose backdrop, pose, props, stickers, frame → save PNG | Session 2 |
| **Bloom Florist** (job) | Arrange a bouquet in a vase (drag, rotate) | v0.3 |
| **Petal Park** | Picnic scenes, kite, feed ducks (pure play + photo spot) | v0.3 |
| **Airport** | Spend saved coins on tickets → destinations | v0.4 |
| **Pet Salon** (job) | Wash, brush, accessorize | Later |

### Destinations

Each destination is **inspired-by, never a replica** of a real place, and each has one signature verb, a local outfit set, a recipe and 6 souvenirs.

| Destination | Signature activity | Souvenirs (examples) |
|---|---|---|
| **Paris-inspired "Rue Lumière"** | Pâtisserie: decorate macarons | Mini tower, beret, postcard, macaron box |
| **Tokyo-inspired "Sakura Lane"** | Bento arrangement | Lucky cat, fan, origami crane |
| **Caribbean-inspired "Coral Cay"** | Snorkel photo hunt: tap to photograph fish | Shell, coral-print fabric, steel-pan ornament |
| **Alpine "Snowpeak"** | Hot cocoa + sledge minigame | Snow globe, knitted scarf pattern |
| **Moroccan-inspired "Spice Market"** | Pattern tile matching | Lantern, rug pattern, mint-tea set |

**[R] Cultural care:**
- Research each destination respectfully.
- Avoid stereotypes and costumes-as-caricature.
- Prefer everyday contemporary life (food, markets, nature, architecture) over "traditional costume" dress-up.
- Ideally, ask someone from that culture to review the content before it ships.

---

## 5. Character creator & dress-up

- **Body:**
  - 3 body shapes, 12+ skin tones (not lightness-ordered), freckles, vitiligo option
  - glasses, hearing aids, wheelchair option, which works in every scene
- **Face:** eye shapes and colours, brows, mouth expressions (used in photos). Make-up is optional and subtle; we avoid "beauty" framing.
- **Hair:** 15+ styles across textures (coily, curly, wavy, straight), protective styles, hijab and head coverings, 20 colours including fantasy.
- **Clothing layers:** base, bottom, top, dress (replaces top+bottom), outerwear, socks, shoes, bag, headwear, jewelry, held item.
- **Color system:** each item has 2 tintable regions plus a curated palette of about 16 swatches. Later, a **pattern designer** (stripes, dots, florals) for older players.
- **Saved looks:** 6 slots, with a "random outfit" dice. The dice is deterministic fun, not a reward roll.
- **Default framing:** "you" are a girl-styled character by default, with all options open to everyone and no gender gates on items.

**[V] Toca shows inclusive creators are praised. [H] For this age group, adaptive and hair-texture options especially increase "that's me" moments.**

---

## 6. First playable version (v0.1 "Petalport: First Day")

**Goal:** a 15–20 minute session that a 9-year-old *wants to repeat*. It should be small but genuinely fun.

**Scope:**

1. **Title screen** with "Tap to start". This unlocks audio and plays an animated waterfront.
2. **Character creator:** 1 body rig, 8 skin tones, 8 hairstyles × 10 colors, eyes and expressions.
3. **Wardrobe:** about 40 items across categories, each with tint swatches. Includes a satisfying "spin" preview animation.
4. **Home:**
   - studio apartment with 12 placeable furniture items
   - drag, drop and flip
   - 6 wall and 6 floor styles
5. **City map** with 4 tappable places: Home, Café, Boutique, Market.
6. **Two jobs:**
   - **Café** (order assembly, 3 difficulty tiers)
   - **Boutique** (style an NPC to a brief)
   - Each takes 60–90 s, pays coins, and adds a sticker.
7. **Market:** 30 purchasable items (clothes and furniture), known prices, savings-goal pin.
8. **Notice board:** 3 friend briefs that rotate on completion.
9. **Photo mode (lite):** 3 backdrops, 4 poses, save PNG to the device.
10. **Persistence:** autosave to IndexedDB, plus save export/import code, plus an "Add to Home Screen" hint.

**Success criteria (playtest):**
- A child completes the first job without adult help.
- She changes her outfit unprompted at least twice.
- She asks "can I play again tomorrow?"
- No dead taps reported.

---

## 7. Visual direction

### Mood

"Sunlit postcard pop": a crisp, modern illustration style. It is flat shapes with soft gradient shading, a thin warm outline (not black), and gentle drop shadows that make UI pieces feel like tactile stickers and paper cut-outs. It should look like a premium picture book, not a dashboard and not anime-gacha.

### Palette (tokens)

| Token | Hex | Use |
|---|---|---|
| `--sea` | `#3BB7C4` | Primary brand, sea, primary buttons |
| `--sea-deep` | `#1F6F8B` | Text on light, headers, outlines on cool items |
| `--petal` | `#FF7BA9` | Accent, hearts, reward highlights |
| `--sunshine` | `#FFC94A` | Coins, stars, "new" badges |
| `--mint` | `#7ED6A7` | Success, parks, confirm |
| `--lilac` | `#B39DFF` | Magic and travel, secondary accent |
| `--coral` | `#FF8A65` | Warm alerts (never red errors) |
| `--cream` | `#FFF7EC` | Panels and background paper |
| `--ink` | `#3A2E4F` | Body text (warm plum-ink, contrast ≥ 7:1 on cream) |
| `--outline` | `#5B4A6E` | Illustration line colour |

- **Night mode:** the city shifts to `#2B2950` sky with lantern-yellow windows. This is a cosmetic time-of-day change, not a UI theme.
- **Contrast:** all text must pass WCAG AA (4.5:1). I computed these pairs with the WCAG formula:

| Pair | Ratio | Result |
|---|---|---|
| ink on cream | 11.7:1 | Pass |
| sea-deep on cream | 5.3:1 | Pass |
| ink on sea | 5.2:1 | Pass |
| ink on sunshine | 8.1:1 | Pass |
| ink on petal | 5.1:1 | Pass |
| white on sea-deep | 5.7:1 | Pass |
| **white on sea** | **2.4:1** | **Fails** |
| **white on petal** | **2.4:1** | **Fails** |

  **Rule:** bright fills (sea, petal, sunshine, mint) always carry **ink-coloured** labels. White labels only go on `--sea-deep`.

### Typography (all OFL-1.1, self-hosted [V])

- **Display / buttons:** *Fredoka* (rounded, chunky, friendly but not babyish), 600 weight.
- **Body / labels:** *Nunito*, 700 for labels and 600 for body. Minimum 17 px body and 20 px labels.
- **Numbers (coins):** *Fredoka* tabular, with a bouncy count-up animation.

### Layout principles

- **Phone-portrait first** (390×844 reference), safe-area aware (notch and home indicator).
- **Thumb zone:**
  - Primary actions sit in the bottom 40%.
  - A persistent bottom dock (Home, Map, Wardrobe, Camera) uses 64 px icon buttons.
  - Coins and the Post Box sit top-right; they are informational, not tappable shop entry points.
- **Scenes are full-bleed illustrations.** UI floats on top as rounded "sticker" panels (radius 24 px, 3 px outline, soft shadow).
- **Carousels scroll horizontally** with the next item peeking. No long vertical lists for young players.
- **One primary CTA per screen.** Secondary actions are icon buttons with labels underneath.

### Animation style

- **Springy and physical.**
  - Buttons squash on press (scale 0.94) and overshoot on release.
  - Items "plop" into place with a tiny bounce and a sparkle.
  - Clothing swaps with a quick twirl.
- **Timing:** 120–180 ms for UI feedback, 300–500 ms for scene transitions (an iris or page-turn wipe), idle "breathing" on characters (2–3 px, 3 s loop).
- **Rewards:** coins arc into the counter; stickers peel onto the album.
- **Reduced motion:** when `prefers-reduced-motion` is set, swap motion for cross-fades and colour flashes [V].

### Sound

- Soft marimba, ukulele and glockenspiel palette.
- Every tap gets a pitch-varied pop.
- Music volume and SFX volume are separate, and there is a mute switch on the title screen.

### Art direction rules

- One **character rig** at a fixed canvas (e.g., 400×800 SVG viewBox). All clothing is drawn to that rig, with named anchor groups.
- **Three-tone shading** (base, shadow, highlight) and **one** light direction (top-left).
- Rounded geometry everywhere (no sharp 90° corners in the UI).
- Big readable silhouettes. Items should be identifiable at 64 px thumbnails.
- **Never** imitate a specific existing game's character proportions or signature look (e.g., Stardoll's MeDoll or Toca's characters).
