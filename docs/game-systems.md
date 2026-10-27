# Game Systems: Petalport v0.1

**Status:** Draft for approval · **Date:** 25 Oct 2026
The rules behind every feature in [PRD.md](PRD.md). **This file is the single source for counts and numbers**; PRD acceptance criteria reference it. Revision 2 applies [plan-review.md](plan-review.md). Numbers here are the source of truth for the content files described in [data-model.md](data-model.md). If a number changes, change it here and in `content/` together.

---

## 1. Character creator & wardrobe

### 1.1 Appearance options (v0.1)

| Part        | Options                                                            | Notes                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skin tone   | 10                                                                 | Warm and cool undertones across the range. Displayed in a 2-row grid in a mixed order, never light→dark. Each tone defines base, shadow and blush colors.                          |
| Hairstyle   | 8                                                                  | Coily puff, curly shoulder, wavy bob, long straight, box braids, two space buns, pixie, hijab (head covering, worn instead of hair; tintable). Each style has back + front layers. |
| Hair color  | 10                                                                 | 7 natural (black, dark brown, chestnut, auburn, copper, honey blonde, platinum) + 3 fantasy (lilac, petal pink, sea teal). Each defines base / shadow / shine.                     |
| Eye style   | 6                                                                  | Round, almond, sleepy, sparkle, monolid, wide. Drawn as shapes, not "beauty" variants.                                                                                             |
| Eye color   | 8                                                                  | Brown, dark brown, hazel, green, blue, grey, amber, violet (fantasy).                                                                                                              |
| Brows       | 3                                                                  | Soft, straight, arched. Color follows hair.                                                                                                                                        |
| Extras      | freckles on/off, glasses (as eyewear slot items, 2 starter frames) |                                                                                                                                                                                    |
| Expressions | 4                                                                  | Smile (default), big grin, wink, surprised. Used in photo mode and reactions.                                                                                                      |

**Roadmap (v0.2):** body shapes, wheelchair (needs a seated variant of every pose), hearing aids, vitiligo, more styles. The wheelchair is flagged as a committed v0.2 item rather than silently dropped.

### 1.2 Slots and layering

The rig renders layers in this fixed order (back to front):

```
1  hair-back
2  body (skin, face base)
3  bottom          ┐ hidden when a dress is worn
4  shoes
5  top             ┘ hidden when a dress is worn
5' dress           (replaces 3 + 5)
6  back arm + sleeve (arm behind the body in the current pose)
7  outerwear       (body part; outerwear sleeves are drawn by the arm layers)
8  bag             (strap + bag)
9  neck            (scarf, necklace)
10 front arm + sleeve (above outerwear, bag and neck so poses with hands in front stay visible)
11 face features   (eyes, brows, mouth, freckles)
12 eyewear
13 hair-front
14 headwear        (hats hide hair-front parts tagged `underHat`)
15 held prop       (photo mode only, in the front hand)
```

| Slot      | Group     | Can be empty?             | Starter count | Boutique count                            |
| --------- | --------- | ------------------------- | ------------- | ----------------------------------------- |
| top       | clothing  | Only when a dress is worn | 3             | 5                                         |
| bottom    | clothing  | Only when a dress is worn | 2             | 4                                         |
| dress     | clothing  | Yes                       | 1             | 3                                         |
| outerwear | clothing  | Yes                       | 1             | 2                                         |
| shoes     | clothing  | No                        | 2             | 3                                         |
| headwear  | accessory | Yes                       | 1             | 2 (+ beret in Paris, + café cap reward)   |
| eyewear   | accessory | Yes                       | 2             | 0                                         |
| neck      | accessory | Yes                       | 0             | 2                                         |
| bag       | accessory | Yes                       | 1             | 1                                         |
| **Total** |           |                           | **13**        | **22** (+ 3 elsewhere) = **38 wearables** |

### 1.3 Procedural sleeves (the key art-saving rule)

Poses only move the **arms**; legs and torso stay fixed. Instead of drawing every top in every pose, each top, dress and outerwear item declares a `sleeve` type (`none`, `cap`, `short`, `long`, `puff`), takes both its `main` and `accent` tints, and may set a `sleeveTrim` (`cuff`, `stripe`, or none) drawn in the accent tint. The arm layers draw the sleeve shape for the current pose. Outerwear sleeves draw over the top's sleeves. So 38 items × 5 poses needs **5 poses × 5 sleeve shapes × front/back = 50 small arm drawings** (each is one simple path plus a trim path), not 190 item drawings. `none` is the bare arm.

**Fit matrix (tested in the gallery):** every headwear × every hairstyle (4 × 8 = 32), and every pose × every outerwear (5 × 3).

### 1.4 Tinting

- Items may declare up to 2 tint regions (`main`, `accent`).
- Each region draws from the shared 12-swatch **Fashion Palette** (visual-design §3.3) or a restricted subset defined on the item.
- Tints are free and unlimited. Changing color is expression, never a purchase.

### 1.5 Favorite looks

- 4 slots. A look stores every equipped slot with its tint, plus the hairstyle and hair color (so "beach day" can include space buns).
- Wearing a look never changes skin, eyes or brows.
- A look referring to an unowned or removed item falls back per slot to the starter item for that slot (AC-F3-6).

### 1.6 "Surprise me"

Picks a random owned item per required slot, a 50% chance per optional slot, and a random tint from each item's allowed swatches. It's a cosmetic shuffle with no reward attached. The RNG is injected (`game/rng.ts`) like everywhere else, so tests are repeatable.

---

## 2. Home & lifestyle

### 2.1 Lifestyles and starter homes

|                         | **Urban: Harbour Loft**                                                                                         | **Countryside: Meadow Cottage**                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Picture                 | Brick loft above the harbour street; big arched window with boats and the café sign outside                     | Timber cottage at the edge of the hill; round window with a meadow, a fence and a windmill                                    |
| Map position            | Downtown, next to the Café                                                                                      | Top of the hill path; a small bus trundles down when you leave (cosmetic)                                                     |
| Starter furniture       | Modern sofa, round rug, framed harbour print, arc lamp, fiddle-leaf plant, bistro table, floating shelf, blinds | Rattan armchair, braided rug, pressed-flower frame, oil-style lamp, herb pot, farmhouse table, wooden shelf, gingham curtains |
| Color themes (choose 1) | Seaside (sea + cream), Sunset (coral + lilac), Night Market (sea-deep + sunshine)                               | Daisy (sunshine + mint), Berry (petal + cream), Orchard (mint + coral)                                                        |
| Ambient sound           | Gulls, distant tram bell                                                                                        | Birds, breeze                                                                                                                 |

- Both homes share **the same 8 slot types**, so every furniture item fits either home. Only the starter set differs.
- Themes change wall, floor and trim colors through CSS variables on the room SVG. No extra art.
- **Move house:** free, any time, from the Home settings tile. Furniture already owned stays owned. The first move to the other home also **gifts its 8 starter items** (moving is a gift, not a loss). Slots are then filled with the new home's starter items, and the player can redecorate.

### 2.2 Home slots

| Slot     | Accepts             | Notes                                                                                                                                       |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `wall`   | framed art, posters |                                                                                                                                             |
| `window` | curtains, blinds    | Window view is part of the room art                                                                                                         |
| `seat`   | sofas, armchairs    | Character stands beside it                                                                                                                  |
| `rug`    | rugs                | Under everything                                                                                                                            |
| `table`  | tables              | Dishes from cooking sit on top                                                                                                              |
| `lamp`   | lamps               | Lamp hotspot toggles it                                                                                                                     |
| `plant`  | plants              | Plant hotspot waters it                                                                                                                     |
| `shelf`  | shelves             | Every shelf has 3 **keepsake spots** that hold souvenirs and trophies (e.g. the espresso machine). Keepsakes never occupy a slot themselves |

### 2.3 Hotspots (6 always active, plus the dish when there is one)

| Hotspot                | Tap result                                                      | Feedback                   |
| ---------------------- | --------------------------------------------------------------- | -------------------------- |
| Closet door            | Opens the Closet                                                | Door swings, hanger jingle |
| Kitchen counter        | Opens the recipe book                                           | Steam puff                 |
| Bed / sofa             | Nap: 1.5 s fade to dusk and back, character yawns and stretches | Lullaby chime              |
| Lamp                   | Light on/off; the room gets a warm glow overlay                 | Click                      |
| Plant                  | Water: leaves bounce and a bloom opens (stays for the session)  | Water drop sound           |
| Shelf                  | Opens the Souvenir Shelf picker / Album                         | Little sparkle             |
| Dish on table (if any) | Choose "Eat" (happy animation, dish cleared) or "Keep"          | Munch                      |

The **Decorate** button in the HUD is a UI control, not a scene hotspot. It enters decorate mode, where slots are outlined with pulsing dashed borders.

### 2.4 Decorate mode

1. Tap **Decorate** → the 8 slots show dashed outlines and a small icon.
2. Tap a slot → bottom carousel of owned items for that slot (current one marked).
3. Tap an item → it plops in with a bounce and sparkle. Instant, no confirm.
4. Tap **Done** (or a slot again) → leave decorate mode. Changes are already saved.
5. Empty carousel (only the current item owned) → "More in the Boutique" tile that jumps to the Home tab.

---

## 3. Sunny Café job: "Order Up!"

### 3.1 Fantasy and goal

You're the barista at the busiest café on the harbour. Customers (townsfolk drawn with the same rig) come to the counter with a **picture order**. Build it and serve it. A shift is 5 customers and takes 60–120 seconds.

### 3.2 Player actions

| Action                  | Input                                      | Alternative          |
| ----------------------- | ------------------------------------------ | -------------------- |
| Pick a cup size / plate | Tap cup on shelf                           | —                    |
| Add an ingredient       | Tap ingredient jar (it flies into the cup) | Drag jar onto cup    |
| Clear the order         | Tap bin                                    | Drag cup to bin      |
| Serve                   | Tap the bell / "Serve" button (64 px)      | Drag cup to customer |
| Leave shift             | Back button → confirm                      | —                    |

### 3.3 Rules

- **Order generation:** a seeded generator (seed = shift number) picks orders from the menu allowed at the current rank. Variety rule: no two identical orders in a row.
- **Correctness:** an order is correct when the cup/plate contains exactly the required items. **Order of adding doesn't matter** (7-year-olds shouldn't fail on sequence).
- **Max ingredients per cup:** 4. The 5th tap shakes the cup and doesn't add.
- **Wrong serve:** the customer's bubble re-appears with the mismatched item(s) circled (missing = dashed outline, extra = little ✕). The cup stays as built so the player can fix it. Nothing is deducted.
- **No time pressure** in standard mode. Customers idle-animate (look at phone, hum, wave) and never leave.
- **First-try tip:** served correctly on the first serve, without using the bin.

### 3.4 Menu and ranks

| Rank             | Unlocks at                     | Orders contain                                                                                                                                                      | Pay per correct order | Rank-up gift                                                                    |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| 1 "New Barista"  | Start                          | 1 drink: cup (small/large) + base (cocoa, lemonade, berry tea) + 0–1 topping (cream, marshmallow, lemon slice, sprinkles)                                           | 10                    | —                                                                               |
| 2 "Barista"      | 15 correct orders (≈ 3 shifts) | Drink as above with 0–2 toppings, **plus** 50% chance of a pastry plate (croissant, cupcake, cookie). Cup and plate are separate targets on the counter             | 12                    | **Café apron** (outerwear) + new topping: **caramel drizzle**                   |
| 3 "Head Barista" | 40 correct orders (≈ 8 shifts) | Any rank-2 order, **plus** 30% chance of a "Petal Latte" whose order bubble shows a cocoa-dust _shape_ (heart, star, flower); the player picks the matching stencil | 14                    | **Barista cap** (headwear) + **Espresso machine** (keepsake for the home shelf) |

**Counter layout:** the bottom shelf always shows cups + bases + toppings (one row of up to 8 jars; on 375 px, two rows of 4). From rank 2, a second tray tab "Bakery" holds plate + pastries; from rank 3, a "Latte" tab holds the petal-latte base + 3 stencils. Tabs are 56 px tall with icons.

Rank 3 is the v0.1 cap. Ranks 4–5 (latte-art tracing, custom drink invention) are roadmap v0.2.

### 3.5 Rewards per shift

| Source                              | Coins                    |
| ----------------------------------- | ------------------------ |
| Correct order                       | 10 / 12 / 14 by rank     |
| First-try tip                       | +3 per order             |
| Shift complete (all 5 served)       | +10                      |
| **Typical shift (R1, 3 first-try)** | 5×10 + 3×3 + 10 = **69** |
| **Max shift (R1 / R2 / R3)**        | 75 / 85 / 95             |

Leaving mid-shift keeps coins from served orders but not the shift bonus.

### 3.6 Feedback

| Event              | Visual                                                           | Sound                        | Text (optional)         |
| ------------------ | ---------------------------------------------------------------- | ---------------------------- | ----------------------- |
| Ingredient added   | Jar tilts, item arcs into cup, cup squashes 0.94 → 1             | Pop (pitch rises per item)   | —                       |
| Cup full (5th tap) | Cup wobbles side to side                                         | Soft "nuh-uh" boop           | —                       |
| Serve correct      | Customer cheers, hearts float, coins arc to HUD counter          | Cheerful chime + coin clinks | "Perfect!" / "Yum!"     |
| First-try tip      | Extra golden coin with a sparkle                                 | Higher chime                 | "Tip!"                  |
| Serve wrong        | Customer tilts head, bubble re-opens with the difference circled | Gentle two-note "hmm?"       | "Almost!"               |
| Bin                | Cup empties with a swirl                                         | Whoosh                       | —                       |
| Rank up            | Full-screen confetti card with the gift item on the character    | Fanfare                      | "You're now a Barista!" |

### 3.7 Progression contribution

- The main coin source (≈ 69–95 coins per 90 s; up to 105 in Challenge mode).
- Ranks add **new verbs** (pastry plating, stencil latte, two customers at once in Challenge), not just more pay.
- Every shift adds a thank-you sticker (§3.9), and coins can make over the café itself (§3.10).
- Rank gifts are wearables and decor you can show at home and in photos.
- Welcome Journey step "Work a café shift".

### 3.8 Challenge mode (P1, opt-in)

For players who want a skill test (mostly 10–13). A toggle on the café door, off by default, available from rank 1.

| Rule              | Standard       | Challenge                                                                                                           |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Order bubble      | Always visible | Shows for 3 s, then folds away. **Peek** re-opens it for 3 s (loses that order's first-try tip, nothing else)       |
| Customers at once | 1              | 2 from rank 2 (serve either one)                                                                                    |
| Speed             | No timer       | A gentle 20 s "sparkle ring" per order; serving inside it adds **+2 coins**. When it ends the customer simply waits |
| Pay               | as §3.5        | as §3.5, plus the sparkle bonus                                                                                     |
| Personal best     | —              | Shift card shows "fastest shift" as a personal record. No leaderboard                                               |

Max Challenge shift at rank 3: 95 + 5 × 2 = 105.

### 3.9 Thank-you stickers (a keepsake every shift)

Each completed shift gives the next of **24 customer thank-you stickers** in a fixed order (deterministic, never random). Each sticker is a small portrait of one regular customer with a one-line thank-you ("Best cocoa in Petalport!"). They fill a sticker page in the album. After all 24, every shift adds to a **Café Star** count shown on the café door. So a shift always _makes_ something, even when the player owns everything.

### 3.10 Café makeover (coin sink)

A board by the café door sells 5 café decor items that appear in the café scene itself: bunting (60), flower boxes (80), chalkboard menu art (100), pastry display case (120), string lights (150). Total 510. They're visible to every customer the player serves.

---

## 4. Cooking (home activity)

### 4.1 Fantasy and goal

Cook a real-looking dish step by step in your own kitchen, then decorate it however you like. The dish sits on your table and becomes a prop you can hold in photos.

### 4.2 Step types (reusable engine)

| Step type     | What the player does                                                                        | Tap alternative                                        | Can it fail?                                                             |
| ------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `add`         | Put the right ingredients into the bowl. The recipe card shows icons with checkmarks        | Tap ingredient, then tap bowl (or just tap ingredient) | No. A wrong ingredient bounces out with a "boing"; the right one wiggles |
| `mix`         | Stir in circles over the bowl, or tap the whisk 6 times. Progress ring fills                | Tap whisk                                              | No                                                                       |
| `pour`        | Hold the jug over the pan; the batter circle grows. Release when it reaches the dotted ring | Tap once: auto-pours to the ring                       | No                                                                       |
| `heat` (flip) | Watch the pancake: bubbles appear, the edge turns golden. Tap **Flip**                      | (is a tap)                                             | No. Early = pale, on time = golden, late = toasty. All are edible        |
| `fold`        | Swipe the crêpe edge over in two moves (half, then quarter)                                 | Tap the fold arrow twice                               | No                                                                       |
| `decorate`    | Place up to 8 toppings anywhere on the dish; drag to move, tap to remove                    | Tap topping, then tap spot                             | No, and it is never scored                                               |

### 4.3 Recipes in v0.1

| Recipe              | Unlock                      | Steps                                                                                                                                                                                                                         |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fluffy Pancakes** | Start                       | add (flour, egg, milk) → mix → pour → heat/flip → decorate (berries, banana coins, syrup, cream, sprinkles)                                                                                                                   |
| **Crêpes**          | After cooking Pancakes once | add (flour, egg, milk, butter) → mix → pour (thin: tilt the pan to spread, tap alternative auto-tilts) → heat/flip (golden window 2.0–4.5 s, tighter than pancakes) → fold → decorate (lemon, sugar, strawberries, chocolate) |
| Rainbow Fruit Salad | v0.2                        | Needs new `chop` and `drizzle` steps                                                                                                                                                                                          |

### 4.4 Stars (mastery, shown in the recipe book)

| Star | Earned by                                                     |
| ---- | ------------------------------------------------------------- |
| ★    | Finishing the recipe (always)                                 |
| ★★   | No wrong ingredient added during `add` steps                  |
| ★★★  | Golden result on the `heat` step (both v0.1 recipes have one) |

Stars are a personal record shown on the recipe card. They don't rank the player against anyone.

**Golden window:** the pancake goes pale (0–2.5 s), golden (2.5–5.5 s), toasty (> 5.5 s). The 3-second golden window is deliberately generous; the visual cue (bubbles + golden edge + a little sparkle) appears at 2.5 s. With reduced motion, the cue is a color change plus a ring icon.

### 4.5 Rewards

| Event                               | Reward                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------- |
| First time cooking a recipe         | **+20 coins**, recipe sticker, Welcome Journey step (first recipe only) |
| First time reaching ★★★ on a recipe | **+20 coins**                                                           |
| Every cook                          | The dish on your table (replaces the previous one), stars updated       |
| Repeat cooks                        | No coins. Cooking is for making, not grinding                           |

Max coins from cooking in v0.1: 2 recipes × 40 = 80.

### 4.6 Feedback

- Each correct `add`: item drops in with a splash and a checkmark appears on the recipe card.
- `mix`: batter changes from lumpy to smooth in 3 visual stages.
- `heat`: bubbles pop on the surface; after flipping, the pancake shows its color with a reaction: "A bit pale, still tasty!" / "Golden!" ✨ / "Extra toasty!".
- Finish: dish slides onto a plate, a "Ta-da!" card shows the dish, stars fill one by one, coins arc if earned.
- Leaving mid-recipe: asks once, nothing is lost or kept.

---

## 5. Town map

### 5.1 Layout (top to bottom of the vertical map)

```
 ┌──────────────────────────┐
 │  Hill: Meadow Cottage    │  (Home pin if countryside; otherwise "neighbour's cottage" scenery)
 │  windmill · Bloom Florist│  (scaffolding, scenery only — roadmap)
 ├──────────────────────────┤
 │  Town: Ribbon Boutique   │  ← hotspot
 │  Petal Park (scenery)    │  ← roadmap: picnic blankets, ducks pond, no pin
 ├──────────────────────────┤
 │  Harbour: Sunny Café     │  ← hotspot (workplace)
 │  Harbour Loft            │  (Home pin if urban)
 │  boats · lighthouse      │
 ├──────────────────────────┤
 │  Airport on the point    │  ← hotspot; plane taxis (ambient)
 └──────────────────────────┘
```

- About 2 screen heights on a 390×844 viewport. Initial scroll centers on the Home pin.
- Hotspots: big building illustration + a signpost pin (icon + name). Hit area covers building + sign, ≥ 120×120 px.
- Tap → preview card (bottom sheet): picture, name, one line ("Make drinks for customers and earn coins"), primary "Go" button. Tap outside or swipe down to dismiss.
- Badges on pins: a coin icon on the Café, a ticket on the Airport when the ticket is affordable, a "new" sparkle on the Boutique when a rank gift or new stock appears. Badges inform; they never count down.
- Ambient hotspots (the cat) are extra and don't have signs.

### 5.2 Ambient life (all cosmetic, all reduced-motion aware)

Boats bob, gulls loop, café chimney steam, windmill turns, plane taxis every ~20 s, a cat on a wall flicks its tail (tap: meows, an easter egg that counts as a hotspot).

---

## 6. Economy & progression

### 6.1 Currency

- **Petal Coins** (shown as a sunshine-yellow coin with a petal). The only currency. Integer, 0–99,999.
- Earned only by playing. No purchases with real money, no premium currency, no conversion.

### 6.2 Starting state

| Item         | Value                                                  |
| ------------ | ------------------------------------------------------ |
| Coins        | **120** (enough for 2 cheap items on day one)          |
| Wearables    | 13 starter items (§1.2) incl. 2 complete outfits       |
| Furniture    | 8 starter items for the chosen home (all slots filled) |
| Recipes      | Fluffy Pancakes                                        |
| Café rank    | 1                                                      |
| Destinations | none (Paris ticket not owned)                          |
| Savings goal | none                                                   |

### 6.3 Earning (all deterministic)

| Source                   | Coins                                         | Repeatable?                  |
| ------------------------ | --------------------------------------------- | ---------------------------- |
| Café shift               | 69–95 (see §3.5), up to 105 in Challenge mode | Yes                          |
| Thank-you sticker        | 1 per shift (24 total), then Café Star count  | Yes                          |
| First cook of a recipe   | 20                                            | Once per recipe              |
| First ★★★ on a recipe    | 20                                            | Once per recipe              |
| Welcome Journey step     | 15                                            | Once per step (6 steps = 90) |
| Welcome Journey complete | "Welcome to Petalport" poster (wall decor)    | Once                         |
| Café rank-up             | Item gift (no coins)                          | Once per rank                |
| First Paris photo        | Paris Postcard souvenir + stamp               | Once                         |

**No daily cap** in v0.1. Total content is the natural limit. Revisit if a playtester buys everything in one sitting and then stops.

### 6.4 Prices

| Category             | Price band         | v0.1 items (count)                                             |
| -------------------- | ------------------ | -------------------------------------------------------------- |
| Tops                 | 35–55              | 5                                                              |
| Bottoms              | 35–50              | 4                                                              |
| Dresses              | 70–90              | 3                                                              |
| Outerwear            | 60–80              | 2                                                              |
| Shoes                | 40–60              | 3                                                              |
| Headwear             | 25–40              | 2                                                              |
| Neck                 | 20–35              | 2                                                              |
| Bag                  | 30–45              | 1                                                              |
| Furniture (Home tab) | 30–120             | 10 (at least one per slot type, plus 2 extra wall/plant items) |
| Café makeover        | 60–150             | 5 (§3.10)                                                      |
| Paris ticket         | **400** (one-time) | 1                                                              |
| Paris souvenirs      | 30–40              | 3 (Postcard is free)                                           |

**Total cost of everything purchasable:** ≈ 1,080 (22 wearables) + 650–750 (10 furniture) + 510 (café makeover) + 400 (ticket) + 105 (souvenirs) ≈ **2,750–2,850 coins**.

### 6.5 Balance check

A **typical session** is 15–20 minutes with **4 café shifts**. "Typical" shift = 3 of 5 first-try tips.

| Measure                               | Value                                                                                                                   | Rule                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Session 1 earnings (PRD J1, 2 shifts) | 75 Journey + 40 cooking + 138 shifts = **253** (+120 start = 373 wallet)                                                | —                                                             |
| Session 1 earnings (4 shifts)         | 75 + 40 + 276 = **391** (+120 = 511 wallet)                                                                             | —                                                             |
| Later sessions (4 shifts at R2–R3)    | **316–356**                                                                                                             | —                                                             |
| Most expensive item                   | 400 (ticket)                                                                                                            | ≤ 6 typical R1 shifts (414) ✔                                 |
| Ticket affordable                     | J1 player (2 shifts, buys 1 item ~45): 328 left → **session 2**. A saver doing 4 shifts can fly at the end of session 1 | Self-chosen return goal; saving hard is rewarded              |
| Shifts to buy everything              | ≈ (2,800 − 290 one-offs) / ~85 ≈ **29–30 shifts** ≈ 45–60 min of café play ≈ 7–8 sessions                               | —                                                             |
| All café ranks                        | Shift 8 (≈ session 2)                                                                                                   | After that: stickers until shift 24, Challenge mode, makeover |
| First purchase possible               | Immediately (120 start ≥ 35)                                                                                            | ✔                                                             |

These rules become unit tests (implementation-plan §6.4), which simulate both the J1 player and the 4-shift saver.

### 6.6 Unlock conditions

| Unlock                         | Condition                                 |
| ------------------------------ | ----------------------------------------- |
| Crêpes recipe                  | Pancakes cooked ×1                        |
| Café rank 2 / 3                | 15 / 40 correct orders                    |
| Café apron, caramel drizzle    | Rank 2                                    |
| Barista cap, espresso machine  | Rank 3                                    |
| Airport trip                   | Paris ticket owned                        |
| Paris souvenir kiosk           | Being in Paris                            |
| Paris stamp + Postcard         | First photo taken in Paris                |
| Thank-you sticker _n_          | Shift _n_ completed (n ≤ 24)              |
| "You've collected everything!" | Every purchasable item owned (shown once) |
| Welcome poster                 | All 6 Journey steps                       |

Every unlock is shown in advance as a silhouette with its condition in icon + words. Nothing is hidden or random.

### 6.7 Welcome Journey (first-session guide)

A small notebook icon in the HUD opens a 6-step card. Completed steps get a sticker. It's optional guidance and never blocks anything.

1. Make your character (done at creation)
2. Cook your first dish
3. Work a café shift
4. Buy something at the Boutique
5. Save a favorite look
6. Fly to Paris and take a photo

### 6.8 Savings goal

- Any unowned item (or the ticket) can be pinned with "Save for it".
- The HUD coin pill shows a progress ring around the pinned item's thumbnail.
- When coins ≥ price: the ring sparkles once and the item's pin on the map gets a badge. No nag, no push.
- One goal at a time; pinning a new one replaces it.

### 6.9 Save & restore behavior (player-facing)

| Situation                                  | What the player sees                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Normal play                                | Nothing. Saving is invisible. The parent area shows "Last saved: just now"                                                                             |
| First run in Home Screen mode with no save | "Bring your game from Safari?" guide (export there, import here) or Start new                                                                          |
| Reload / reopen                            | Lands at Home exactly as left (activities in progress are not resumed; they restart cleanly)                                                           |
| `current` save corrupt, `previous` fine    | "We found your game from a moment ago!" then Home                                                                                                      |
| Both corrupt                               | Recovery screen: Try again · Restore from backup (parent gate) · Start fresh (parent gate, double confirm)                                             |
| Storage unavailable                        | Banner: "Saving is paused on this device. Ask a grown-up to check settings." The game still plays                                                      |
| Import backup                              | Summary card (character preview, coins, item count, photo count, date) → "Replace my game?" → confirm. Photos are re-rendered from their scene records |

---

## 7. Travel & photo memories

### 7.1 Flow

```
Map → Airport → Ticket desk ──(own ticket)──► Gate → "Fly!" → plane transition → Paris scene
                    │                                                          │
                    └─(not enough coins)→ coins needed + "Save for it"          ├─ Photo spot → Photo mode → Album
                                                                                ├─ Souvenir kiosk → buy → Home shelf
                                                                                ├─ Pigeon / café terrace (fun hotspots)
                                                                                └─ "Fly home" → Map
```

**Airport hotspots (3):** ticket desk (opens the ticket card), departures board (tap: letters flip and show "PARIS: ON TIME", with future cities as blank rows), luggage trolley (tap: the suitcase pops open, showing your current outfit folded inside).

### 7.2 Paris scene (v0.1)

- **Composition:** a tree-lined garden path with a café terrace on the left, a souvenir kiosk on the right, and an **original stylized Eiffel Tower** rising behind, framed by soft clouds. Golden-hour lighting.
- **Hotspots (5):** Photo spot (painted mark on the path) · Souvenir kiosk · Pigeon (flutters, coos) · Café terrace bell (ding, waiter waves) · **Street painter's easel** (tap: the painting gains a stroke; after 5 taps it shows a tiny tower painting). All original.
- **Character:** stands on the path at ~45% of scene height; the tower occupies the upper 70% of the frame, its tip about 8% below the top edge.

### 7.3 Photo mode

| Control    | Options (v0.1)                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pose       | Wave, hands on hips, heart hands, tourist pointing at the tower                                                                                                                                                                                                                         |
| Expression | Smile, big grin, wink                                                                                                                                                                                                                                                                   |
| Prop       | None, beret (on head; temporary unless owned), croissant, balloon, your latest dish (if any)                                                                                                                                                                                            |
| Stickers   | 6 Paris stickers (heart, star, "Bonjour!" speech bubble, mini tower, macaron, sparkle); drag to place (or tap sticker, then tap spot; keyboard: next default spot), tap a placed sticker to remove; up to 6. Keep drag surfaces ≥ 24 px from the left screen edge (iOS swipe-back zone) |
| Frame      | Polaroid white (only one in v0.1)                                                                                                                                                                                                                                                       |
| Shutter    | Big 72 px round button                                                                                                                                                                                                                                                                  |

- Shutter: white flash 120 ms → the viewfinder shrinks into a polaroid that drops into the album icon.
- The photo is rendered from the same SVG scene (no screenshot APIs, no camera).
- The first Paris photo grants the stamp and postcard (§6.3).

### 7.4 Album

- Grid of polaroids (3 per row on phones), newest first; tap → full view with date, place, and buttons: **Save to my device**, **Remove** (confirm).
- Empty state: an illustrated empty polaroid: "Your first photo is waiting in Paris!" with a button to the Airport.
- Cap: 60 photos (≈ 30–60 MB worst case; see data-model §6).
- A second album page holds the **thank-you stickers** (§3.9) and the **passport**.

### 7.5 Future destinations (data model ready, content not in v0.1)

| Destination | Scene idea (original, inspired-by)                                                    | Signature activity                                           | Souvenirs                                                                            |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Paris       | Garden path + tower (v0.1)                                                            | v0.3: macaron decorating (Crêpes is the v0.1 tie-in at home) | Mini tower, beret, macaron box, postcard                                             |
| Tokyo       | Cherry-blossom street with a pagoda-style tower silhouette                            | Bento arranging (reuses `decorate` step)                     | Lucky cat, fan, origami crane                                                        |
| London      | Riverside with a clock-tower silhouette and a red bus                                 | Afternoon-tea stacking                                       | Double-decker model, umbrella, teacup                                                |
| New York    | Rooftop at sunset with a skyline and a torch-raised statue silhouette in the distance | Food-cart order job (reuses café engine)                     | Snow globe, yellow-cab model, pretzel keychain (avoid the trademarked "I ♥ NY" logo) |

Each new destination needs: 1 scene, 1 ticket price, 3–6 souvenirs, a sticker set, a stamp, and a cultural review. Activities reuse existing engines where possible.

## 8. Town life (Wave A)

Healthy-engagement rules for everything in this section: nothing expires, nothing decays, nothing is random, and nothing is lost by not playing. Every reward comes from finished gameplay.

### 8.1 Pets (Paw Parlour)

- Adopt **one pet for free**: kitten, puppy or bunny; 6 fur colors; a name from 4 ideas or typed (max 12 characters, empty → "Buddy").
- Care activities, each a small game: **Feed** (the pet asks for a food; pick it from 3 bowls; a wrong bowl gets a kind "not that one" and the right food named), **Bath** (tap or rub 5 muddy spots, then Rinse), **Catch** (tap the ball 3 times).
- Pets have no hunger, health or mood meters. Care only adds.
- Tricks are learned by total care: Sit 0, Spin 3, High five 8, Dance 15, Roll over 25.
- Feeding asks for the kind's favourites in a fixed rotation; bowl order and ball spots are fixed sequences (no randomness).
- Accessories (Paw Parlour): Big Bow 25, Bandana 30, Bell Collar 35, Tiny Crown 45.
- The pet sits next to the player at home and outside Harbour Loft on the map; tapping it at home opens the pet corner.

### 8.2 Petal Notes (request board)

- The board always holds **3 notes**, each from a different regular and of a different kind. Notes are generated from a seed (save creation time) and a running number, so they are deterministic.
- Kinds and pay: cook a recipe with a named topping **20**; serve 2 of a named drink at the café **15**; wear a named Boutique item **10**; place a named Boutique furniture item **10**; feed / bathe / play with the pet **10** (only once a pet is adopted). Cook notes only name unlocked recipes.
- Cook, café and pet notes count activities finished after the note appears. Wear and place notes are checked live.
- Notes never expire. "New note" swaps any note for a new one at no cost.

### 8.3 Friendships

- Each finished note gives that regular **1 heart** (max 10).
- At **3 hearts** the friend sends a gift: Mila Flower Crown, Theo Sunflower Pot, Grandma Rosa Patchwork Rug, Aiko Blossom Print, Sam Star Purse, Noor Heart Sunglasses, Leo Star Lamp, Zuri Bucket Hat.
- At **5 hearts** the friend can be invited home (one visitor at a time; tap them for a line). 10 hearts earns the Best Friends sticker.

### 8.4 Post Box

- One letter waits each calendar week (weeks start Monday, local time). A new player has one waiting right away.
- Missed weeks don't stack and aren't lost: the next letter just waits.
- Letters come from the regulars in a fixed order; each sends the first gift on its list the player doesn't own yet, otherwise 40–50 coins.

### 8.5 Sticker album

- 26 stickers in Wave A (31 with Wave B, §9.4), each earned by something the player did (café shifts and rank, recipes and 3-star dishes, items owned and placed, pet care and tricks, notes, hearts, friends, letters, lifetime coins 500 / 2000).
- Conditions only read counters that never go down, so stickers are never lost. A new sticker shows a toast once.
- Locked stickers show a silhouette and a hint ("How to get it").

## 9. Stage, shells and style (Wave B)

Wave B adds a dress-up goal, an exploration collection and more doll-style clothes, chosen from what keeps girls aged 6–12 coming back in Dress to Impress, Toca Boca World, Avatar World, Adopt Me and Club Penguin: themed styling with a reveal, hidden things to find, and a big wardrobe. It keeps the same guardrails: no timers, no randomness in rewards, nothing to lose.

### 9.1 Starlight Stage (fashion show)

- A stage on a pier in the harbour. Flow: **theme → get dressed → walk the runway → three judges → result**.
- 6 themes in a fixed order (Sunny Picnic, Party Princess, Cozy Day, Harbour Stroll, Smart & Chic, Sporty Star). "New theme" moves along the list at no cost; finishing a show moves to the next theme.
- Each theme names item tags (e.g. Sunny Picnic: `sunny`, `park`). A worn piece **fits** if it has any of those tags.
- **Stars:** 1 for walking, 2 for 2+ fitting pieces, 3 for 4+. The dress screen shows the stars live and says how many more pieces are needed, or that more fitting clothes are at the Boutique.
- **Pay:** 10 / 20 / 30 coins for 1 / 2 / 3 stars, plus a one-time **+20** the first time a theme gets 3 stars. The best stars per theme are saved.
- Judges are three different regulars, rotating with each show. Each praises a fitting piece by name; with no fitting pieces they cheer and give a tip naming the theme's tags. No one ever scores low or says anything unkind.
- Every theme can reach 3 stars with shop and starter clothes (unit-tested).
- Runway poses: the rig gains `hips` and `cheer` (both arms up).

### 9.2 Secret shells

- 10 shiny shells hidden around Petalport: 4 on the town map (beach, duck pond, hilltop, airport runway) and one each in Home, Ribbon Boutique, Sunny Café, Kitchen, Paw Parlour and Starlight Stage.
- A shell twinkles gently, has a 44 px+ target and disappears once tapped (chime + toast "Secret shell found! n of 10"). Shells are permanent and never come back or move.
- The album has a **Shells** page: found shells in color with their names; the rest as silhouettes with a "where to look" hint.

### 9.3 New clothes and retags

- New Boutique stock: Princess Gown **90**, Sparkle Tiara **40**, Kitty Ears **30**, Jelly Sandals **40**, Picnic Basket **35**, Star Leggings **40** (all inside the §6.4 price bands).
- Retagged so every theme has enough pieces: Heart Sunglasses +`sunny`, Star Purse +`smart`, Ruffle Blouse +`smart`, Mary Janes +`smart`, Crossbody Bag +`sporty`, Bucket Hat +`sporty`.

### 9.4 Stickers

- 5 more (31 in all): Runway Debut (1 show), Fashion Star (3 stars in a show), Style Icon (3 stars on every theme), Beachcomber (1 shell), Shell Seeker (all 10 shells).

## 10. Salon, garden and seasons (Wave C)

### 10.1 Glam Salon

- A real activity, not a coin button. A shift is **3 clients**. Each client: **wash** (pop 5 foam spots by tapping), then **style** (match the order card on hair style, hair color and accessory), then **mirror** (confirm the look).
- Orders are seeded per shift number, so they are unique within a shift and repeatable in tests. Menu: every hair style, 8 colors, 4 accessories (bow headband, flower crown, tiara, kitty ears).
- A wrong look wobbles and says what is different; nothing is taken away. Pay **12** per client, **+4** tip when the first look matches, **+10** shift bonus (max 3 x 16 + 10 = 58).
- Stickers: Glam Salon (1 shift) and Salon Star (5 shifts).

### 10.2 Petal Garden

- 6 beds, 6 free seeds (tulip, sunflower, daisy, rose, bluebell, starbloom). Planting costs nothing.
- Every finished activity elsewhere (café shift, dish, show, note, pet care, salon shift) grows every planted flower one step. Growth: seed 0, sprout 1, bud 3, **bloom 5**.
- Flowers **never wilt** and nothing expires. Picking a bloom pays **+5** coins, empties the bed, and adds that kind to the collection (first time: sticker First Bloom; all 6 kinds: sticker Garden Party).

### 10.3 Seasons

- Decoration only: gentle falling shapes on the title and town (snow-flake dots in winter, petals in spring, sunbeams in summer, leaves in autumn) chosen by the device month. No gameplay, prices or content change by season. Animation is transform and opacity only and stops under reduced motion.

### 10.4 Town map and stickers

- The map is now 1170 x 3860: "Sparkle Street" (Glam Salon and Petal Garden) sits above the airport, which moved down 660 px. Both places show a badge when there is something to do.
- 4 more stickers (35 in all): Glam Salon, Salon Star, First Bloom, Garden Party.

### 10.5 Home window views

- The home window can show 4 views, chosen in Decorate, then Colors, then Window view: Harbour (free), Meadow (pick a first flower), City lights (walk one Starlight Stage show), Snowfall (find 5 secret shells).
- Views never expire and cost nothing. A locked view says how to open it. Saves without a view show the Harbour. Stored as optional `home.view`.

## 11. Paris trip (Wave D, implements §7)

- **Airport** is now open from the map: ticket desk (Paris ticket **400 coins**, one-time, never expires), departures board (PARIS ON TIME, other rows blank), luggage trolley. With a ticket the desk shows "Fly to Paris!".
- **Paris** (original stylized golden-hour drawing; tower behind a tree-lined path, café terrace left, souvenir kiosk right): photo spot, souvenir kiosk, café bell, pigeon, painter's easel (5 taps finish a tiny tower painting).
- **Photo mode:** 4 poses (wave, hands on hips, cheer, relax), props (none, beret, croissant, balloon), up to 6 stickers (heart, star, "Bonjour!", mini tower, macaron, sparkle) put on fixed spots by tapping (no dragging, keyboard friendly). No expressions yet (the rig has none). The first photo gives the free **Paris Postcard** souvenir.
- **Photos are saved as tiny recipes** (pose, prop, stickers, date) in `progress.travel.photos`, not as image bytes. The album redraws them from the same art, so they always match the player's current look. A decision to revisit: "Save to my device" as an image is not built yet.
- **Album Photos page:** polaroid grid (cap 60, newest first), tap for a larger view and Remove (asks first), plus the **Souvenir shelf** (Postcard free; Mini Tower 40, Little Beret 30, Macaron Box 35 at the kiosk).
- 3 more stickers (38 in all): Bonjour Paris (first photo), Little Photographer (5 photos), Souvenir Shelf (all 4 souvenirs).
- Save: `progress.travel {ticket, trips, souvenirs[], photos[]}`; older saves get an empty trip.

## 12. Bun & Bite Burger Bar (Wave D)

- A third job, on a new row of the map (the map is now 1170 x 4380; the airport moved down 520 px). Real gameplay: 4 customers per shift; each order card lists the burger from the top down (bottom bun, patty, 1 to 4 different toppings from cheese, lettuce, tomato and pickles, top bun).
- Tap the ingredients in order from the bottom up. A wrong tap wobbles the plate and says what comes next ("Not yet! Next comes the bottom bun."). No timer, nothing is lost; the only cost is that burger's tip.
- Pay **14** per customer, **+4** tip when no tap was wrong, **+12** shift bonus (max 4 x 18 + 12 = 84). A finished shift also grows the garden.
- Orders are seeded by the shift number (deterministic). Toppings grow with each customer: 1, 2, 3, 4.
- Stickers (40 in all): Burger Buddy (1 shift) and Burger Chef (5 shifts). Save: optional `progress.burger {orders, shifts}`.

## 13. Sweet Spot cupcake shop (Wave D)

- A fourth job on Snack Street, next to Bun & Bite. 3 customers per shift; each card names a **frosting** (6 colors), a **swirl** (tall or smooth) and a **topping** (cherry, sprinkles, gold star, candy heart, candle). The cupcake starts different from the card in every part. Serve it: a wrong look says which parts to check; nothing is lost.
- Pay **12** per customer, **+4** tip when the first look is right, **+10** shift bonus (max 3 x 16 + 10 = 58). A finished shift grows the garden.
- **Collection:** every different design served (6 x 2 x 5 = 60 possible) is kept once in the album's **Treats** page.
- Stickers (42 in all): Sweet Helper (1 shift), Cupcake Designer (10 designs). Save: optional `progress.sweets {served, shifts, made[]}`.

## 14. Next up ideas (Wave D)

- A star button on the town map opens "Next up": up to 3 things the player has not tried yet, as tappable rows that open the place: pick a ready flower, save for or buy the Paris ticket, first Paris photo, plant a flower, runway, salon, burgers, cupcakes, adopt a pet, a Petal Note, secret shells, cupcake designs.
- Only suggestions. Nothing expires, nothing is owed, no streaks or rewards for opening it.

## 15. Dance Studio (Wave D)

- A fifth job on the new Fun Street (the map is now 1170 x 4900; the airport moved down another 520 px). Real gameplay with **no beat to hit and no timer**: the coach dances a routine (each move lights a dot and the coach does the move), then the player repeats the moves by tapping buttons.
- Five moves, each with its own icon and name (Wave, Hips, Cheer, Jump, Twirl). A shift is 4 routines of **3, 4, 5, 6** moves, seeded by the shift number, never the same move three times in a row.
- A wrong move wobbles, says "Not that one!" and the coach shows the routine again. Pay **14** per routine, **+4** tip when no move was wrong, **+12** shift bonus (max 4 x 18 + 12 = 84). A finished shift grows the garden.
- Stickers: Dance Star (1 shift), Dance Crew Captain (5 shifts). Save: optional `progress.dance {routines, shifts}`.

## 16. Skate Park (Wave D)

- A gentle skill game on Fun Street. A run is a fixed course of **8 obstacles** (cone, rail, ramp), seeded by the run number, at least 330 track units apart. The track scrolls slowly (190 units per second). Tap **Jump** (or the stage, or Space / Up arrow) as an obstacle reaches the skater; the jump lasts 0.8 s and can't be restarted mid-air.
- An obstacle is **cleared** if it reaches the skater during the jump (with a little slack). A bump only wobbles the skater ("Oops! Roll on."): the run always finishes and nothing is taken away. This is the only real-time activity; it has no countdown and never ends early.
- Pay **20** for rolling, **+3** per obstacle cleared, **+10** for clearing all 8 (max 54). A finished run grows the garden.
- Stickers: Skate Rookie (1 run), Perfect Run (all 8 in one run). Save: optional `progress.skate {runs, best}`.

## 17. Bedroom (Wave E)

- A **Bedroom** button on the Home screen (next to Decorate and Cook) opens a room the player designs. Six choices: **walls** (7 colors), **bedding** (7 colors, the curtains pick up the accent), **wardrobe** (7 colors), **lamp** (dome, star, cloud, tulip), **wall picture** (sunset, flowers, starry sky, little boat, sleepy cat) and **rug** (round, star, heart).
- Tapping the lamp switches it on or off (a glow, or a dim room); tapping the picture, window or bed jumps to the matching tab. Everything is free, nothing is locked or expires, and any choice can be changed any time.
- Stickers: Cozy Designer (change 5 parts from the starter look). Save: optional `home.bedroom` holding only the parts that differ from the starter (`walls: cream`, `bedding: pink`, `lamp: dome`, `picture: sunset`, `rug: round`, `wardrobe: white`); unknown ids fall back to the starter.

## 18. Glow Nails (Wave E)

- A sixth job on the new Glow Street (the map is now 1170 x 5420; the airport moved down another 520 px). Each client shows a hand with the nails she'd like; the player paints a bare hand to match: pick one of six polishes, a **Gem** or **Wipe**, then tap a nail (every nail has a tap and keyboard alternative; there is no drag).
- A shift is 4 clients: **one color, two colors, three colors, then three colors plus 2 gems**, seeded by the shift number. **All done!** checks the hand: wrong nails wobble and are named ("Look again at the ring finger and thumb"). Fix them as often as needed; no timer, nothing lost, only the tip is missed.
- Pay **14** per client, **+4** tip when the first check was right, **+12** shift bonus (max 4 x 18 + 12 = 84). A finished shift grows the garden.
- Stickers: Nail Artist (1 shift), Glam Hands (5 shifts). Save: optional `progress.nails {clients, shifts}`.

## 19. Petal Posies (Wave E)

- A seventh job on Glow Street: a flower shop. Each customer wants a bouquet: some flowers (of 6 kinds) and a wrapping paper color (4). **Order does not matter.** A shift is 4 customers with **3, 4, 5, then 6 flowers** of one, two, two and three kinds. Tap a flower to add it (max 8), Undo removes the last one.
- **All done!** checks the bouquet: the message says what is missing or extra ("It needs 1 more rose, 2 fewer daisies, sky wrapping"); the bouquet wobbles. Nothing is lost except the tip.
- Pay **14** per customer, **+4** tip when the first check was right, **+12** shift bonus (max 84). A finished shift grows the garden.
- Stickers: Little Florist (1 shift), Bouquet Boss (5 shifts). Save: optional `progress.posies {bouquets, shifts}`.

## 20. More home recipes (Wave E)

- The kitchen now has **five** recipes on the same step engine (add, mix, pour, cook/flip, fold, decorate), unlocked in order: Fluffy Pancakes → Crêpes → **Cheesy Omelette** (eggs, milk, cheese; folds like a crêpe; toppings tomato, herbs, mushroom, grated cheese) and **Waffles** (also unlocked by crêpes: flour, egg, milk, butter; grid top; golden window 3.0 to 6.0 s); **French Toast** (bread, egg, milk) unlocks after the omelette.
- Same rules as before: 1 star always, 2 stars with no wrong ingredient, 3 stars with a golden flip; first cook +20 coins, first 3 stars +20. New items: cheese, bread, tomato, herbs, mushroom, grated cheese. Stickers: Egg-cellent, Waffle Time, Brunch Star.

## 21. Picnic Pairs (Wave E)

- Petal Park is no longer "coming soon": tapping it opens a hub with two activities. **Picnic Pairs** is a memory game with three board sizes (3, 4 or 6 pairs). Flip two cards: a match stays face up, a mismatch turns back over after a moment (a tap on another card turns it over sooner). **No timer, no move limit, nothing taken away.**
- Pay per finished board **10 / 14 / 20** coins, **+4** "sharp eyes" bonus when the misses were no more than the number of pairs. Boards are seeded by the game number. A finished game grows the garden.
- Stickers: Picnic Pro (1 game), Sharp Eyes (the biggest board). Save: optional `progress.park {games, hard, songs}`.

## 22. Bandstand piano (Wave E)

- The second Petal Park activity: eight rainbow keys (C major scale, a soft triangle-wave note each). **Free play** is always available. A **song book** (Twinkle Star, Happy Tune, Little Lamb) glows the next key; a wrong key still plays its note, says "Try the glowing key", and the song waits. No timer.
- Each song pays **15** coins once, the first time it is played to the end (replays are free fun, no coins). Stickers: Little Pianist (1 song), Maestro (all 3). Save: `progress.park.songs` holds the song ids played to the end.

## 23. Versions and going back

- Every change is a git commit on `main` and is deployed by CI to the live site. Any older version can be restored from the commit list on GitHub ("Browse files" on a commit, or `git revert <commit>` to undo one change without losing the rest). Named restore points: see the commit list; the last commit before each wave is a safe place to return to.

## 24. Art Studio (Wave F)

- A place on the new Hobby Street (the map is now 1170 x 6460; the airport moved down again). A coloring book with three pictures (butterfly 8 parts, cupcake 6, little house 8). Pick one of 9 paints, tap a part to paint it; **any color is right**, and Clear starts over. **Hang it up!** is enabled when every part has a color (tapping it early explains) and adds the picture to **My gallery** (newest 12 kept).
- Pay **15** coins the first time each picture is hung, nothing after (repeat paintings are free creative play). Finishing grows the garden. Stickers: Little Artist (1 picture), Gallery Star (all 3). Save: optional `progress.studio {made[], works[{pic, colors[]}]}`.

## 25. Puzzle Shop (Wave F)

- Next to the Art Studio. Three small pictures (Sunny Meadow, Harbour, Castle) in three sizes (4, 6 or 9 pieces). The pieces start shuffled (never already solved); **tap two pieces to swap them**. Pieces in the right place get a green rim, and the status line counts them. No timer, nothing taken away.
- Pay **10 / 14 / 20** per solved puzzle (every time, like a job). Stickers: Puzzle Fan (1 puzzle), Puzzle Master (the 9-piece puzzle of every picture). Save: optional `progress.puzzle {games, done[]}` (`done` holds `picture-size` keys).

## 26. Fishing Dock (Wave F)

- A big pier on the row below. **Cast**, wait 1.2 to 2.8 s for the splash (seeded by the cast number), then **Reel in!** within a generous 2.2 s window. A tap too early says "Too early!" and lets you cast again; a missed splash says "It swam away" and you cast again. Nothing is lost either way.
- Every catch pays **6**, a fish you don't have yet **+10**. The fish is **always a new one while any is missing** (10 kinds), then any, so there is no luck to chase. **My fish** shows the aquarium with grey "?" for the missing ones. Stickers: Little Angler (1 fish), Aquarium Keeper (5), Ocean Friend (all 10). Save: optional `progress.fishing {catches, fish[]}`.

## 27. Home and Bedroom screen rules (Wave F)

- Decorating the living room hides the player's character until Done; the Bedroom is a button in the home button row (no door art, so nothing in the room is covered). In the Bedroom the design options (tabs and choices) appear only after pressing **Design**, and **Done** hides them again.
