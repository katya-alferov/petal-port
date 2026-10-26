# Visual Design & Interface Spec: Petalport v0.1

**Status:** Draft for approval · **Date:** 25 Oct 2026
Extends game-concept §7 ("Sunlit postcard pop") into concrete rules for screens, components, art and motion. Mobile-first for iPhone Safari; usable on desktop. Revision 2 adds the art-consistency controls in §13 (from [plan-review.md](plan-review.md)).

---

## 1. Style in one paragraph

A premium picture book you can touch. Flat shapes with **three-tone shading** (base, shadow, highlight), one light from the top-left, a **warm plum outline** (never black), rounded geometry everywhere, and UI panels that look like thick paper stickers with a hard soft-colored drop shadow. Bright but not neon; cozy but not babyish. It must not resemble Stardoll, Toca Boca, MovieStarPlanet or any anime/gacha style.

**Litmus test for every new asset:** put it next to the character rig and the Harbour Loft. If it looks like it came from a different game, it's wrong.

---

## 2. Screen hierarchy & navigation

### 2.1 Scene tree

```
Title
 ├─ (first run) Creator → Lifestyle & Home → Home (tutorial pointers)
 └─ (returning) Home
Home  ⇄  Map  (the two hubs)
 ├─ Home: Closet · Cooking · Decorate · Shelf/Album
 └─ Map: Café · Boutique · Airport → Flight → Paris → Photo
Overlays (any hub): Album · Welcome Journey · Settings (child) → Parent area (gated)
Special: Recovery (boot only)
```

### 2.2 Persistent chrome

| Element | Where | Visible in | Behavior |
|---|---|---|---|
| **Dock** | Bottom, above the home indicator | Home, Map, Closet, Album, Paris | 4 buttons: **Map · Home · Closet · Album**. Current one is raised and filled |
| **Coin pill** | Top-right | Everywhere except Title, Creator, Photo | Coins + savings-goal ring. Tapping it opens the savings goal (info only, never a shop) |
| **Journey notebook** | Top-left | Home and Map | Opens the Welcome Journey; hides itself after completion |
| **Back** | Top-left | Every non-hub scene | Returns to the previous hub. In activities asks once if progress would be lost |
| **Settings gear** | Top bar on Home and Map (next to the coin pill) | Home, Map | Child settings + "For grown-ups" |
| **Version label** | Title screen corner; parent area | Title, parent area | Small `--ink-muted` text, e.g. `v0.1.0-m3+abc123` |

**Activities (Café shift, Cooking, Photo) hide the dock** to give the play area full height. Only Back and the coin pill remain.

### 2.3 Navigation rules

- Max depth from a hub: 2 (Map → Airport → Paris, Paris → Photo is a mode, not a level).
- Back always works and is always top-left. The iOS swipe-back gesture maps to Back.
- Never more than **one primary button** per screen.
- Keyboard: Tab order follows reading order; Enter/Space activate; Esc = Back; arrow keys move within carousels.

---

## 3. Color

### 3.1 UI tokens (from game-concept §7, unchanged)

| Token | Hex | Use |
|---|---|---|
| `--sea` | `#3BB7C4` | Primary buttons, sea, brand |
| `--sea-deep` | `#1F6F8B` | Headers, cool outlines; the only fill that may carry white text |
| `--petal` | `#FF7BA9` | Accent, hearts, favorite looks |
| `--sunshine` | `#FFC94A` | Coins, stars, "new" badges |
| `--mint` | `#7ED6A7` | Success, confirm, parks |
| `--lilac` | `#B39DFF` | Travel, magic, secondary accent |
| `--coral` | `#FF8A65` | Warm alerts and error cards (never red) |
| `--cream` | `#FFF7EC` | Panels, paper |
| `--paper-2` | `#FFEBD2` | Pressed / selected panel, carousel tray *(new)* |
| `--ink` | `#3A2E4F` | All body text |
| `--ink-muted` | `#6B5C7E` | Secondary text on cream only *(new)* |
| `--outline` | `#5B4A6E` | Illustration and sticker outlines |
| `--night` | `#2B2950` | Night sky (cosmetic) |
| `--lantern` | `#FFE08A` | Lit windows at night |

### 3.2 Contrast (computed with the WCAG 2 formula)

| Pair | Ratio | | Pair | Ratio |
|---|---|---|---|---|
| ink / cream | 11.7 | | ink / coral | 5.4 |
| ink / sea | 5.2 | | ink / mint | 7.2 |
| ink / petal | 5.1 | | ink / lilac | 5.5 |
| ink / sunshine | 8.1 | | ink-muted / cream | 5.7 |
| white / sea-deep | 5.7 | | outline / cream | 7.5 |
| lantern / night | 10.6 | | white on sea or petal | **2.4 ✗** |

**Rule:** bright fills always carry `--ink` labels. White text only on `--sea-deep` or `--ink`.

### 3.3 Fashion Palette (tint swatches, 12)

`cream #FFF7EC` · `charcoal #3F3A48` · `denim #4A6FA5` · `sea #3BB7C4` · `mint #7ED6A7` · `olive #8A9A5B` · `sunshine #FFC94A` · `coral #FF8A65` · `petal #FF7BA9` · `berry #B23A6B` · `lilac #B39DFF` · `cocoa #8B5E3C`

Each swatch also defines a shadow (≈ 18% darker, hue shifted toward plum) and highlight (≈ 12% lighter) for three-tone shading, generated once in `content/palette.ts`.

### 3.4 Scene palettes

| Scene | Dominant | Accents |
|---|---|---|
| Harbour (map, loft, café) | sea, cream | coral awnings, sunshine flags |
| Hill / Meadow Cottage | mint, sunshine | petal flowers, cocoa wood |
| Boutique | cream, petal | lilac, gold trim |
| Airport | sea-deep, cream | sunshine signage, lilac sky |
| Paris | see §8 | |

---

## 4. Typography

All OFL-1.1, self-hosted WOFF2, Latin subset.

| Role | Font | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| Display XL (title, rank-up) | Fredoka | 40 / 44 | 600 | Max 3 words |
| Display (scene titles) | Fredoka | 28 / 32 | 600 | |
| Button primary | Fredoka | 22 / 24 | 600 | |
| Label (buttons, tabs, signs) | Nunito | 20 / 24 | 800 | |
| Body | Nunito | 17 / 24 | 600 | Minimum for any player-facing text |
| Caption (parent area only) | Nunito | 15 / 20 | 600 | Never in child-facing UI |
| Coins / numbers | Fredoka, tabular | 22 / 24 | 600 | Count-up animation |

- Text sizes are in `rem`; **UI panels and text** must survive 150% text zoom without overlap (implementation-plan §7). Scene illustrations don't scale with text zoom; their signs are live text in panels that do.
- No text baked into illustrations except the stylized logo; signs on buildings use an icon + live text overlay so they stay accessible.

---

## 5. Layout, touch targets, safe areas

### 5.1 Reference viewports

| Device class | CSS viewport | Notes |
|---|---|---|
| Small: iPhone SE (2nd/3rd gen) | 375 × 667 | No notch; Safari bars take ~110 px |
| **Reference: iPhone 13/14/15** | **390 × 844** | Dynamic Island / notch; home indicator |
| Large: Pro Max / Plus | 430 × 932 | |
| Desktop | ≥ 1024 wide | Centered stage, see §5.5 |

### 5.2 Safe areas

- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Scene art is **full-bleed** behind the notch and home indicator.
- All chrome and hotspots sit inside `env(safe-area-inset-*)` padding, plus 8 px.
- Use `100dvh` for the stage height; listen to `visualViewport` resize for Safari's collapsing toolbar.
- `touch-action: manipulation` on the app; `touch-action: none` only on drag surfaces (stickers, toppings, map pan area handled by native scroll).
- Disable text selection and the iOS callout on game surfaces (`user-select: none; -webkit-touch-callout: none`), but not in the parent area.

### 5.3 Touch targets & spacing

| Element | Visual size | Minimum hit area |
|---|---|---|
| Primary button | 64 h × ≥ 180 w | 64 × 180 |
| Secondary button | 56 h | 56 × 120 |
| Icon button (Back, gear) | 48 × 48 | 48 × 48 |
| Dock button | 64 × 64 with label below | 64 × 72 |
| Carousel tile | 88 × 88 (SE: 76 × 76) | same |
| Swatch | 40 × 40 visual | 48 × 48 (padding) |
| Map location | Building + sign | ≥ 120 × 120 |
| Scene hotspot | Object | ≥ 64 × 64; bigger objects use their shape |
| Shutter | 72 × 72 | 80 × 80 |

- Minimum 12 px between adjacent targets (8 px within swatch rows).
- Primary actions live in the **bottom 40%** of the screen (thumb zone).

### 5.4 Small-screen rules (375 × 667)

- Dock buttons stay 64 px with labels; the dock loses its top padding.
- Carousels show 3.5 tiles instead of 4.5.
- Creator/Closet: preview takes 45% of height (55% on reference), options below.
- Café counter: ingredient shelf becomes 2 rows of 4 instead of 1 row of 8 + 1.
- Landscape on phones: show a friendly "Turn me upright!" card with a rotating-phone illustration. Landscape is not supported on phones in v0.1 (keeps every scene to one composition).

### 5.5 Desktop

- The game renders in a **portrait stage**: width `min(100vw, 480px)`, height `min(100dvh, 960px)`, centered.
- Outside the stage: a soft illustrated pattern (sea waves and petals in `--cream` / `--sea` at low contrast) so it never looks like a website.
- Mouse: hover lifts buttons by 2 px; cursor is a pointer on hotspots. Wheel scrolls the map.
- Drag works with the mouse; every drag has a tap alternative anyway.

---

## 6. Components (the "sticker" UI kit)

| Component | Spec |
|---|---|
| Panel / Card | `--cream` fill, 3 px `--outline` stroke, radius 24, shadow `0 4px 0 rgba(58,46,79,.18)` |
| Primary button | `--sea` fill, ink label, radius 999, 3 px outline, bottom shadow 4 px; pressed: translateY(3px) + shadow 1 px + scale .97 |
| Secondary button | `--cream` fill, ink label, same shape |
| Confirm (success) | `--mint` fill |
| Disabled | 50% saturation, label still ≥ 4.5:1, never hidden; tapping it explains why (e.g. "Need 15 more coins") |
| Bottom sheet | Slides up 280 ms, rounded top 28, grabber bar, dismiss by swipe down, tap outside or Back |
| Carousel | Horizontal, snap per tile, next tile peeks 40%, arrow buttons on desktop |
| Tabs | Pill segmented control, icons + labels, 56 px tall |
| Toast | Top-center under the HUD, 2.5 s, ink on cream with an icon; never covers primary buttons |
| Progress ring | 4 px stroke, sunshine on paper-2 |
| Badge | 22 px sunshine dot with ink glyph, on a corner |

---

## 7. Character & environment proportions

### 7.1 Character rig

- **ViewBox 400 × 800.** Feet baseline at y = 780, head top at y ≈ 40.
- **≈ 4.5 heads tall** (head ≈ 165 px of 740). Stylized "storybook fashion": big readable head and hair, slim but not elongated body, soft rounded hands with 4 fingers, simple oval eyes with a highlight.
- Torso and legs are fixed; **arms have 5 poses** (idle, wave, hips, heart, point), each split into a **back arm** and a **front arm** layer. Sleeves (main + accent tint, optional cuff/stripe) are drawn by the arm layers (game-systems §1.2–1.3).
- Outline 3.5 px at rig scale (scales with the character); interior detail lines 2 px in a darker shade of the fill, not outline color.
- Faces: eyes placed at 55% of head height, small nose shape, 4 mouths. No makeup by default.
- Idle: 2 px chest rise + 1 blink every 3–5 s (random interval; cosmetic).

### 7.2 Scene scale

| Scene | Character height as % of scene height | Notes |
|---|---|---|
| Creator / Closet preview | 80% | Feet visible, centered |
| Home | 52% | Door frame = 1.35 × character; table top at 0.42 × |
| Café (customer at counter) | 60% from the waist up | Counter hides the legs |
| Boutique fitting room | 70% | Mirror frame behind |
| Paris | 45% | Tower occupies the upper 70% of the frame, tip ≈ 8% below the top |
| Map | Not shown (a small head-icon marker on the Home pin) | |

### 7.3 Environment art

- Scenes designed at **1170 × 2532 logical** (iPhone 3× reference), with a central "safe composition" area of 1170 × 1800 where all hotspots live. Top and bottom bleed areas are decorative so taller and shorter phones crop gracefully.
- Depth with 3 planes: back (sky, far buildings: low contrast, no outline), mid (buildings, furniture: outline), front (counters, foliage: outline + slightly darker).
- Interactive objects get a **1 px brighter rim light** and full outline; background objects have no outline. This is how a child can tell what is touchable without a glowing UI.
- Max 4 shades per object (base, shadow, highlight, line).

---

## 8. Paris & the Eiffel Tower (legal and visual rules)

- **Original drawing only.** No tracing photos, no stock illustration, no clip art.
- **Recognizable through structure:** the four arched legs, the first-floor arch band, the tapering lattice suggested with 3–4 levels of cross-hatching (not every girder), the observation tops. Simplified to ~20 shapes.
- **Daytime or golden hour only.** The tower's night-time lighting display is protected by its operator's rights; v0.1 never draws the sparkling or illuminated tower at night. [H: widely reported; confirm before any public release.]
- **No logos or trademarks** (no "Tour Eiffel" wordmarks, no official souvenir designs).
- Tower color: bronze-taupe `#8C6E54` with highlight `#B8977A` and shadow `#5E4A3B`.
- **Paris palette:** zinc roofs `#9FB3C8`, limestone `#EADBC4`, awning red-coral `#E8665A` (decor only; never as an error color), chestnut tree green `#5FA67A`, sky gold `#FFD9A0` → lilac `#C9B8FF`.
- Everyday life over stereotype: a café terrace, a painter, a pigeon, a kiosk. No mime, no stripy "French person" caricature.

---

## 9. Motion

### 9.1 Timing tokens

| Token | Duration | Easing | Use |
|---|---|---|---|
| `tap` | 120 ms | spring (stiffness 600, damping 30) | Press squash 0.94 → 1.0 overshoot |
| `swap` | 200 ms | spring | Item swap twirl, decor plop |
| `sheet` | 280 ms | ease-out | Bottom sheets, cards |
| `scene` | 400 ms | ease-in-out | Map ⇄ location "postcard zoom" |
| `flight` | 1200 ms | custom, skippable | Plane + clouds wipe |
| `reward` | 600 ms | ease-out arc | Coins fly to the counter, count up |

### 9.2 Signature transitions

- **Map → location:** the tapped building scales up from its position and cross-fades into the scene (postcard zoom).
- **Location → map:** reverse; the map returns to the previous scroll.
- **Home ⇄ Map via dock:** page-turn wipe (300 ms).
- **Equip item:** quick twirl (character rotates ±8° and back) + sparkle.
- **Purchase:** item thumbnail jumps into a shopping-bag icon, then the bag pops.
- **Rank up / first photo:** confetti (≤ 40 particles, CSS transforms) + card.

### 9.3 Rules

- Animate **only `transform` and `opacity`**. No animated filters, blur, or box-shadow.
- ≤ 40 simultaneously animating elements; particles beyond that use a canvas overlay (not needed in v0.1).
- **Reduced motion:** zooms, flights, twirls and confetti become 150 ms cross-fades and color flashes; idle breathing stops; map ambient animations pause.

---

## 10. States

| State | Where | Design |
|---|---|---|
| **Boot loading** | Title | Waterfront with a little boat sailing left → right as the progress bar; "Tap to start" appears when ready |
| **Scene loading** (lazy chunk, normally < 300 ms) | Any | Keep the old scene, show a spinning petal on the tapped pin after 200 ms; never a blank screen |
| **Empty: closet category** | Closet | Hanger illustration: "Nothing here yet!" + "Visit the Boutique" |
| **Empty: album** | Album | Blank polaroid: "Your first photo is waiting in Paris!" + "Go to the Airport" |
| **Empty: shelf** | Home shelf | Dotted outlines: "Souvenirs from your trips go here" |
| **Empty: decor carousel** | Decorate | "More in the Boutique" tile |
| **Locked** | Recipe, rank gift, ticket | Silhouette + lock + condition as icon + words ("Cook Pancakes once") |
| **Not enough coins** | Boutique, Airport | Disabled-looking Buy that still responds: "Need 25 more" + "Save for it" |
| **Success** | Any reward | Mint flash, sparkle, chime, coin arc; a short word ("Yum!", "Perfect!", "Saved!") |
| **Soft mistake** | Café, cooking | Wobble + gentle sound + highlight of the right answer. Never red, never ✗ on the player |
| **Error** | Error boundary, save, photo | Coral card with a friendly character pose, one sentence, one button |
| **Offline** | Anywhere | Nothing: the game is offline-first. Only the parent area mentions update status |
| **Saving paused** | Banner | Cream banner with coral icon at the top, dismissible for the session |

---

## 11. Sound (summary)

- Marimba / ukulele / glockenspiel palette. Every tap: a soft pop with ±2 semitone variation.
- Separate music and SFX toggles. Default: SFX on, music on at 40%.
- Sources: CC0 first (Kenney), CC-BY only with a credits entry.

---

## 12. Art production checklist (per asset)

1. Drawn on the correct canvas (rig 400×800, scenes 1170×2532, furniture on a 300×300 slot box).
2. Takes its colors through the `colors` prop (CSS variables in normal play, resolved hex in photo mode); fixed colors only from palette, skin or hair defs. Never a hard-coded hex that isn't in a def.
3. Outline color `--outline`, correct width for scale.
4. Light from top-left, three tones.
5. Named groups for tint regions (`data-tint="main"`), sleeves via `sleeve` field, hat hair-hiding via `hidesHairFront`.
6. Readable as a 64 px thumbnail.
7. No `<foreignObject>`, no filters, no external images.
8. Credits entry added (`original` for our art).
9. Built from the construction kit (§13) where a kit part exists.
10. Passes the automated art lint (§13).
11. Reviewed in the art gallery page next to the rig and the Harbour Loft, in a batch lineup (§13).

---

## 13. Art consistency controls (added after review)

~230 pieces drafted over many sessions will drift unless consistency is enforced by tools, not memory.

| Control | What it is | When |
|---|---|---|
| **Construction kit** | Shared SVG primitives in `src/art/kit/`: head shapes, hands per pose, fabric fold strokes, shadow shapes, rim light, wood/fabric/metal swatches, standard corner radius. New items compose these instead of drawing from scratch | M0 |
| **Golden references** | 6 approved pieces (rig in starter outfit, one top, one hat on coily hair, one furniture item, one café prop, a room corner) frozen in the gallery as the comparison row for every review | M0 gate |
| **Style sheet** | One gallery page: palette, outline widths per canvas, shading example, do/don't pairs | M0 |
| **Automated art lint** (Vitest over `src/art`) | Fills only from `colors` props or palette defs; outline color `--outline`; stroke widths within ±0.5 px of the canvas rule; correct viewBox; node count ≤ 120 per wearable and ≤ 2,000 per scene; no filters/foreignObject/external refs; every tint region has `data-tint` | Every commit |
| **Batch lineups** | Review by group (all tops side by side on the rig, all hats on all hair) rather than item by item; each batch is one gallery URL | Each milestone |
| **Fallback style** | A pre-agreed flatter "paper cut-out" variant: same palette and proportions, fewer curves, no interior fold lines, shading as one flat shadow shape. Switch if (a) the M0 gate fails twice, or (b) more than 1 in 4 items in a batch needs a third revision | Decided at the M0 gate |

## 14. 2009 doll glam (owner's direction, Oct 2026)

The owner asked for the look of the 2009 Israeli virtual-city "dolls". We keep crisp vector art (sharp on iPhone, tintable) and borrow the style, never the images:

- **Eyes:** larger, two-tone glassy iris (dark under the lashes, bright glow at the bottom), a big top-left highlight plus a four-point white glint, a thick winged lash line with three lashes.
- **Mouth and cheeks:** glossy pink open smile with a row of teeth and a shine dot; pink blush with white hatch shine.
- **Hair:** a glossy halo of strand glints across the crown; "Doll curls" style with volume, ringlet ends and a flower clip (new default).
- **Backdrops:** `GlamBackdrop` (glossy bubbles, hearts, twinkling sparkles; decorative, never tappable, reduced-motion aware) on Title, Me and the Boutique; pink-lilac gradients.
- **Rooms:** Candy Doll (polka dots) and Lilac Dream (tufted quilting) themes.

## 15. Layout guardrails from the Oct 2026 review

- **Nothing covers a face or ears.** Speech bubbles sit in the layout flow above characters and pets, never absolutely on top of them. Areas where toasts appear (below the top bar) are kept clear of heads, or reserved as a bubble band.
- **Characters stand on something.** A character drawn over a scene sits inside the scene SVG (via the rig's `frame` prop) so its feet stay on the floor at every screen shape. The title doll stands on the boardwalk, which is tall enough to show on 375×667 and 390×844; the title art is anchored to the bottom (`xMidYMax slice`).
- **Grown-up details stay quiet.** The build version is a tiny, faint "v0.2" tag in a corner (full version in `data-version` and the debug overlay; press and hold opens the log).
- **Secret shells** look like treasure (gloss, twinkle, gentle scale animation), never like scenery, and always have a 44 px+ target.
