# Data Model & Technical Architecture: Petalport v0.1

**Status:** Draft for approval · **Date:** 25 Oct 2026
Covers data models, state management, persistence, component boundaries, asset loading and error handling. Revision 2 applies [plan-review.md](plan-review.md). Testing, accessibility and performance requirements are in [implementation-plan.md](implementation-plan.md). Rules and numbers come from [game-systems.md](game-systems.md).

**Stack (from technical-options §3, unchanged):** React 19 + TypeScript + Vite · SVG art as React components · Zustand · idb-keyval (IndexedDB) · Motion · vite-plugin-pwa · Vitest + Testing Library · Playwright (WebKit + Chromium). No router library, no schema library, no backend.

---

## 1. Principles

1. **Content is data.** Every item, recipe, menu, location and destination is a typed entry in `src/content/`. Adding a hat means one catalog entry + one SVG component + one thumbnail, and zero changes elsewhere.
2. **Rules are pure.** `src/game/` holds pure functions with no React, no DOM, no storage. They take state + content and return new state or a result.
3. **One persisted store.** A single Zustand store holds the `SaveGame`. Transient activity state (a café shift in progress, a half-made pancake) lives in the activity's own reducer and is never persisted.
4. **IDs are forever.** Content IDs are stable strings. Renaming an ID requires a save migration.
5. **Fail soft.** Unknown IDs, bad saves and missing art degrade to a safe fallback; they never crash the game.

---

## 2. Content model (`src/content/`)

### 2.1 Shared types

```ts
type ItemId = string; // e.g. "top.sailor-tee", "furn.arc-lamp"
type SwatchId = string; // e.g. "sea", "petal", "denim"
type Coins = number; // integer >= 0

type UnlockCondition =
  | { kind: 'always' }
  | { kind: 'cafeRank'; rank: 2 | 3 }
  | { kind: 'recipeCooked'; recipeId: RecipeId; times: number }
  | { kind: 'destinationVisited'; destinationId: DestinationId }
  | { kind: 'photoTaken'; destinationId: DestinationId }
  | { kind: 'shiftsCompleted'; count: number }
  | { kind: 'allPurchasablesOwned' }
  | { kind: 'journeyComplete' };

type Source =
  | { kind: 'starter'; lifestyle?: Lifestyle } // given at start (optionally lifestyle-specific)
  | { kind: 'shop'; shop: 'boutique-clothes' | 'boutique-home' | 'cafe-makeover' | DestinationShopId; price: Coins }
  | { kind: 'reward'; unlock: UnlockCondition }; // granted automatically when the condition is met

interface TintRegion {
  id: 'main' | 'accent';
  default: SwatchId;
  allowed?: SwatchId[]; // omitted = whole Fashion Palette
}
```

### 2.2 Wearables

```ts
type WearSlot = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'headwear' | 'eyewear' | 'neck' | 'bag';

type SleeveType = 'none' | 'cap' | 'short' | 'long' | 'puff';

interface WearableDef {
  id: ItemId;
  type: 'wearable';
  slot: WearSlot;
  name: string; // string key in content/strings.ts in practice
  source: Source;
  tags: string[]; // 'cozy', 'sporty', 'paris', 'cafe' ... used by NPC generation and future briefs
  tints: TintRegion[]; // 0–2
  sleeve?: SleeveType; // required for top, dress, outerwear
  sleeveTrim?: 'cuff' | 'stripe'; // drawn on the sleeve in the accent tint
  hidesHairFront?: boolean; // hats
  art: string; // key into the art registry: "wear/top/sailor-tee"
}
```

**Example**

```ts
{
  id: 'top.sailor-tee', type: 'wearable', slot: 'top', name: 'Sailor Tee',
  source: { kind: 'shop', shop: 'boutique-clothes', price: 40 },
  tags: ['harbour', 'casual'],
  tints: [{ id: 'main', default: 'cream' }, { id: 'accent', default: 'sea-deep' }],
  sleeve: 'short', art: 'wear/top/sailor-tee',
}
```

### 2.3 Appearance parts

```ts
interface SkinToneDef {
  id: string;
  base: string;
  shadow: string;
  blush: string;
}
interface HairColorDef {
  id: string;
  base: string;
  shadow: string;
  shine: string;
  fantasy: boolean;
}
interface HairStyleDef {
  id: string;
  art: string;
  texture: 'coily' | 'curly' | 'wavy' | 'straight' | 'braids' | 'covering';
  tintable: 'hairColor' | 'fashionPalette';
} // a hijab tints from the Fashion Palette
interface EyeStyleDef {
  id: string;
  art: string;
}
interface EyeColorDef {
  id: string;
  iris: string;
}
interface BrowDef {
  id: string;
  art: string;
}
```

### 2.4 Furniture & souvenirs

```ts
type HomeSlot = 'wall' | 'window' | 'seat' | 'rug' | 'table' | 'lamp' | 'plant' | 'shelf';

interface KeepsakeDef {
  // sits in one of the shelf's 3 keepsake spots
  id: ItemId;
  type: 'keepsake';
  name: string;
  source: Source;
  art: string; // "keep/espresso-machine"
}

interface CafeDecorDef {
  // café makeover (game-systems §3.10)
  id: ItemId;
  type: 'cafeDecor';
  name: string;
  source: Source;
  art: string;
  spot: 'bunting' | 'window-boxes' | 'chalkboard' | 'display-case' | 'lights';
}

interface FurnitureDef {
  id: ItemId;
  type: 'furniture';
  slot: HomeSlot;
  name: string;
  source: Source;
  tints: TintRegion[];
  art: string; // "furn/lamp/arc"
}

interface SouvenirDef {
  id: ItemId;
  type: 'souvenir';
  destinationId: DestinationId;
  name: string;
  source: Source; // shop at the destination, or reward
  wearableId?: ItemId; // the beret is both a souvenir and a wearable
  art: string;
}
```

Souvenirs and trophies (like the espresso machine) are both shown as keepsakes: every shelf has 3 keepsake spots chosen by the player, and keepsakes never consume a `HomeSlot`.

### 2.5 Homes

```ts
type Lifestyle = 'urban' | 'countryside';

interface HomeDef {
  id: 'harbour-loft' | 'meadow-cottage';
  lifestyle: Lifestyle;
  art: string; // room background component
  themes: { id: string; walls: string; floor: string; trim: string }[]; // 3 each
  slotAnchors: Record<HomeSlot, { x: number; y: number; w: number; h: number; z: number }>;
  hotspots: HotspotDef[];
  starterFurniture: Record<HomeSlot, ItemId>;
  mapPin: string; // id of the map hotspot
}
```

### 2.6 Recipes

```ts
type RecipeId = 'pancakes' | 'crepes'; // 'fruit-salad' arrives in v0.2

type CookStep =
  | { kind: 'add'; ingredients: IngredientId[]; distractors: IngredientId[] }
  | { kind: 'mix'; taps: number }
  | { kind: 'pour'; target: 'regular' | 'thin' } // thin = tilt the pan
  | { kind: 'heat'; paleUntilMs: number; goldenUntilMs: number } // pancakes 2500/5500, crêpes 2000/4500
  | { kind: 'fold'; folds: 2 }
  | { kind: 'decorate'; toppings: IngredientId[]; max: number }; // max 8

interface RecipeDef {
  id: RecipeId;
  name: string;
  unlock: UnlockCondition;
  steps: CookStep[];
  dishArt: string;
  rewards: { firstCook: Coins; firstThreeStar: Coins }; // 20 / 20
}
```

### 2.7 Café

```ts
interface CafeRankDef {
  rank: 1 | 2 | 3;
  ordersRequired: number; // 0, 15, 40
  payPerOrder: Coins; // 10, 12, 14
  menu: {
    bases: IngredientId[];
    toppings: IngredientId[];
    maxToppings: number;
    pastries: IngredientId[];
    pastryChance: number;
    stencils: StencilId[];
    stencilChance: number;
  };
  gifts: ItemId[];
}

interface CafeConfig {
  customersPerShift: 5;
  firstTryTip: 3;
  shiftBonus: 10;
  maxIngredientsPerCup: 4;
  ranks: CafeRankDef[];
  challenge: { bubbleVisibleMs: 3000; sparkleMs: 20000; sparkleBonus: 2; twoCustomersFromRank: 2 };
  thankYouStickers: StickerId[]; // 24, awarded in this order
}

// Generated per order, transient
interface CafeOrder {
  cup: 'small' | 'large';
  base: IngredientId;
  toppings: IngredientId[];
  pastry?: IngredientId;
  stencil?: StencilId;
  customer: NpcLook;
}

// Small ID unions and helpers referenced above
type IngredientId = string; // 'cocoa', 'marshmallow', 'flour', ... defined in content/ingredients.ts
type StencilId = 'heart' | 'star' | 'flower';
type PoseId = 'idle' | 'wave' | 'hips' | 'heart' | 'point';
type PropId = 'beret' | 'croissant' | 'balloon' | 'dish';
type StickerId = string; // 'paris.heart', 'thanks.03', ...
type JourneyStepId = 'make-me' | 'first-cook' | 'first-shift' | 'first-buy' | 'first-look' | 'paris-photo';
interface NpcLook {
  appearance: Appearance;
  outfit: Outfit;
} // generated from the seeded RNG
```

### 2.8 Map, scenes and hotspots

```ts
type SceneId =
  | 'title'
  | 'creator'
  | 'lifestyle'
  | 'home'
  | 'closet'
  | 'cooking'
  | 'map'
  | 'cafe'
  | 'boutique'
  | 'airport'
  | 'flight'
  | `dest:${DestinationId}`
  | 'photo'
  | 'album'
  | 'parent'
  | 'recovery';

interface HotspotDef {
  id: string;
  label: string; // accessible name, also the sign text
  icon: string;
  shape: { x: number; y: number; w: number; h: number } | { path: string };
  action: HotspotAction;
}

type HotspotAction =
  | { kind: 'goto'; scene: SceneId }
  | { kind: 'preview'; locationId: LocationId } // map: opens preview card
  | { kind: 'effect'; effect: string }; // local reaction: 'lamp-toggle', 'pigeon-flutter'

interface LocationDef {
  id: 'home' | 'cafe' | 'boutique' | 'airport';
  name: string;
  blurb: string;
  icon: string;
  scene: SceneId;
  hotspot: HotspotDef;
}
```

`hotspots` lists drive the **no-dead-taps test**: the test enumerates every scene's hotspot list, taps each and asserts a DOM change or an audio event.

### 2.9 Destinations (ready for Paris, Tokyo, London, New York)

```ts
type DestinationId = 'paris' | 'tokyo' | 'london' | 'new-york';
type DestinationShopId = `kiosk:${DestinationId}`;

interface DestinationDef {
  id: DestinationId;
  name: string; // "Paris"
  status: 'released' | 'planned'; // only 'released' are shown; 'planned' appear as blank passport outlines
  ticket: { price: Coins; oneTime: true };
  palette: Record<string, string>; // scene accents, see visual-design §8
  scenes: DestinationSceneDef[]; // v0.1 Paris: 1 scene
  souvenirs: ItemId[];
  stickers: StickerId[];
  stampArt: string;
  unlocksRecipe?: RecipeId; // Paris → crepes (P2)
  culturalReview: { reviewer?: string; date?: string; notes?: string }; // required before 'released' (except Paris v0.1 family build)
}

interface DestinationSceneDef {
  id: string;
  art: string;
  hotspots: HotspotDef[];
  photoSpot: { characterAnchor: { x: number; y: number; scale: number }; backdropArt: string };
  poses: PoseId[];
  props: PropId[];
}
```

### 2.10 Strings & credits

- `content/strings.ts`: every player-facing string, keyed. English only in v0.1.
- `content/credits.ts`: `{ file: string; author: string; license: 'CC0' | 'CC-BY-4.0' | 'OFL-1.1' | 'MIT' | 'ISC' | 'original'; url?: string }[]`. A unit test fails if any file under `public/audio`, `public/fonts` or `src/art` lacks an entry.

---

## 3. Save model (persisted)

```ts
interface EquippedItem {
  itemId: ItemId;
  tint?: Partial<Record<'main' | 'accent', SwatchId>>;
}

interface Appearance {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  eyeColor: string;
  brows: string;
  freckles: boolean;
}

type Outfit = Partial<Record<WearSlot, EquippedItem>>;

interface FavoriteLook {
  outfit: Outfit;
  hairStyle: string;
  hairColor: string;
  savedAt: number;
}

interface SaveGame {
  schemaVersion: 1;
  createdAt: number;
  updatedAt: number; // epoch ms

  player: {
    name: string; // '' allowed, ≤ 12 chars
    appearance: Appearance;
    outfit: Outfit;
    favoriteLooks: (FavoriteLook | null)[]; // length 4
  };

  inventory: { owned: Record<ItemId, { acquiredAt: number }> }; // wearables, furniture, keepsakes, souvenirs, café decor

  wallet: { coins: Coins; lifetimeEarned: Coins };

  home: {
    homeId: HomeDef['id'];
    themeId: string;
    slots: Record<HomeSlot, ItemId>;
    shelf: ItemId[]; // ≤ 3 keepsake ids (souvenirs or trophies)
    otherStarterGranted: boolean; // the other home's starter set was gifted on first move
    dish: {
      recipeId: RecipeId;
      result: 'pale' | 'golden' | 'toasty' | 'n/a';
      toppings: { id: IngredientId; x: number; y: number }[];
    } | null;
  };

  progress: {
    cafe: {
      correctOrders: number;
      shiftsCompleted: number;
      rank: 1 | 2 | 3;
      shiftSeed: number;
      challenge: boolean;
      bestChallengeMs?: number;
      stickers: number;
      cafeStars: number;
    };
    collectedEverythingShown: boolean;
    recipes: Partial<Record<RecipeId, { timesCooked: number; bestStars: 1 | 2 | 3 }>>;
    journey: Record<JourneyStepId, boolean>;
    destinations: Partial<Record<DestinationId, { ticket: boolean; visits: number; stamped: boolean }>>;
    savingsGoal: ItemId | 'ticket:paris' | null;
    seen: string[]; // tutorial pointers already shown
  };

  settings: { music: boolean; sfx: boolean; reducedMotion: 'system' | 'on' | 'off'; installCardDismissedAt?: number };
}
```

**Size:** a full v0.1 save is under 10 KB of JSON.

### 3.1 Album (separate store, not in `SaveGame`)

```ts
interface PhotoRecord {
  id: string; // crypto.randomUUID()
  createdAt: number;
  place: DestinationId | 'home';
  scene: {
    pose: PoseId;
    expression: string;
    prop: PropId | null;
    stickers: { id: StickerId; x: number; y: number }[];
    outfit: Outfit;
    appearance: Appearance;
  }; // lets us re-render later if needed
  image: ArrayBuffer; // 1080×1350 PNG bytes (fallback JPEG 0.9 if > 1.5 MB); stored as ArrayBuffer, not Blob
  imageType: 'image/png' | 'image/jpeg';
  thumb: ArrayBuffer; // 270×338 JPEG 0.8
}
```

The `scene` part of each record (≈ 1 KB) is also written into backups so photos can be re-rendered on import (§5.5).

---

## 4. State management

### 4.1 Store shape

```ts
interface GameStore {
  save: SaveGame; // persisted
  ui: {
    scene: SceneId;
    sceneParams?: unknown;
    history: SceneId[]; // not persisted
    toast: Toast | null;
    sheet: Sheet | null;
    saveStatus: SaveStatus;
  };
  actions: GameActions;
}
```

- **Navigation** is a tiny scene stack in `ui` (push, pop, replace). No router library: the game has ~15 scenes and no deep links.
- **Swipe-back / browser Back:** keep exactly **one sentinel history entry** above the app's entry. On `popstate`, immediately `pushState` the sentinel again and run the in-game Back (which may ask "leave the shift?"). `popstate` can't be cancelled, so this re-push is the only safe pattern. Goal: a swipe-back never loses progress (it may still leave the app from the root in some Safari versions; that's acceptable because the save is already on disk). Drag surfaces stay ≥ 24 px from the left edge.
- **Actions** are thin wrappers that call pure `game/` functions and commit the result:

```ts
buyItem(itemId)          → game/economy.purchase(save, catalog, itemId) → Result<SaveGame, 'not-enough-coins' | 'owned' | 'not-for-sale'>
equip(slot, item)        → game/wardrobe.equip(...)
saveLook(index) / wearLook(index)
placeFurniture(slot, id) → game/home.place(...)
completeShift(summary)   → game/cafe.applyShift(...)  (pay + rank + gifts)
completeRecipe(result)   → game/cooking.applyResult(...)
buyTicket(destId) / visit(destId)
completeJourneyStep(id)
setSavingsGoal(id)
```

- Every action returns a `Result`; the UI shows success or the matching friendly error.
- **Rewards and unlocks** are computed by one function, `game/unlocks.reconcile(save, content)`, run after every action. It grants any reward whose condition is now met exactly once. This makes unlock logic testable in one place.
- **Time and randomness** enter `game/` only as arguments: `now: number` and an injected seeded `rng` (`game/rng.ts`).

### 4.2 Activity state (not persisted)

| Activity        | State holder                                  | Committed to the store                                  |
| --------------- | --------------------------------------------- | ------------------------------------------------------- |
| Café shift      | `useReducer(cafeShiftReducer)` in `CafeScene` | Per served order (coins) and at shift end (bonus, rank) |
| Cooking         | `useReducer(cookingReducer)`                  | At finish only                                          |
| Photo mode      | `useReducer(photoReducer)`                    | On shutter (album write + stamp/reward)                 |
| Boutique try-on | Local `tryOn` outfit                          | On buy / wear                                           |
| Decorate        | Writes directly (each swap is a commit)       | Immediately                                             |

Coins are committed per served order so leaving mid-shift keeps them (AC-F8-6).

---

## 5. Persistence

### 5.1 Keys (IndexedDB via idb-keyval, database `petalport`)

| Store / key                          | Content                                            |
| ------------------------------------ | -------------------------------------------------- |
| `kv` / `save:current`                | `SaveGame` JSON                                    |
| `kv` / `save:previous`               | The previous good `SaveGame`                       |
| `kv` / `meta`                        | `{ lastSessionAt, persistGranted, sessionsCount }` |
| `photos` (separate idb-keyval store) | `PhotoRecord` by id                                |

### 5.2 Write path

1. Store changes `save` → subscriber marks dirty.
2. Debounce 400 ms (max wait 1 s) → `validate(save)`; if invalid, log to the debug overlay and **don't write** (protects good data from a bug).
3. Copy `save:current` → `save:previous`, then write the new `save:current`.
4. Writes are serialized through a single promise queue. Also flush on `visibilitychange: hidden` and `pagehide` (iOS may kill a backgrounded tab).

### 5.3 Read path (boot)

```
read current ─► parse ─► migrate(fromVersion→1) ─► validate ─► OK → Home
      │ fail                                              │ fail
      ▼                                                   ▼
read previous ─► same pipeline ─► OK → Home + toast "We found your game from a moment ago!"
      │ fail
      ▼
nothing stored? → new game (creator)
something stored but unreadable? → Recovery scene (never auto-overwrite)
```

### 5.4 Validation & migrations

- `validate()` is hand-written type guards (no schema dependency), unit-tested with valid, invalid and fuzzed inputs.
- After structural validation, `sanitize()` repairs soft problems: unknown item IDs dropped from inventory, empty required slots refilled with starter items, coins clamped to 0–99,999, `favoriteLooks` padded to 4.
- `migrations: Record<number, (old) => next>`. Each migration ships with a fixture save from the previous version and a test.

### 5.5 Backup file (export / import)

```ts
interface BackupFile {
  app: 'petalport';
  kind: 'backup';
  appVersion: string;
  exportedAt: string;
  save: SaveGame;
  photos: Omit<PhotoRecord, 'image' | 'thumb' | 'imageType'>[];
}
```

- Export: `JSON.stringify` → `Blob` → `navigator.share({ files })` if `navigator.canShare({ files })`, else `<a download>`.
- Import: `<input type="file" accept=".json,application/json">` → size ≤ 1 MB → parse → `app` check → migrate → validate → summary → confirm → replace → re-render each photo from its scene record into the album (progress shown: "Developing your photos… 3/12").
- No compression in v0.1: a save plus 60 photo records is < 100 KB, and plain JSON is debuggable.
- **Safari → Home Screen transfer:** iOS keeps Home Screen web-app storage separate from Safari [H: widely reported; the M0 spike verifies it]. So the install card comes on first run, and a standalone launch with no save offers the export-in-Safari / import-here guide (PRD AC-F16-4).

### 5.6 Storage durability

- Call `navigator.storage.persist()` after the first committed action (a user gesture context has happened by then); store the result in `meta`.
- Show storage status in the parent area: "Kept safely on this device" (persisted or standalone) or "Safari may clear this after 7 days without playing. Add to Home Screen or back up."

---

## 6. Photo pipeline

1. `PhotoScene` renders the composition as one `<svg>` (backdrop + character + prop + stickers + frame). Fonts on the "Bonjour!" sticker are converted to paths at build time, so no font loading is needed in the serialized SVG.
2. **Make it self-contained.** An SVG drawn into an `<img>` has no access to the page's stylesheet, so CSS variables (tints, themes) would be lost. Every art component therefore accepts a `colors` prop; in photo mode the scene renders with **resolved hex values** (`resolveColors(outfit, theme, palette)`), animations are frozen at rest pose, and all gradients/`<defs>` live inside the same SVG. A unit test serializes a tinted rig and asserts there is no `var(` in the output.
3. On shutter: serialize with `XMLSerializer` → `Blob(image/svg+xml)` → `URL.createObjectURL` → load into `Image` (`decode()`, falling back to `onload`) → draw on a 1080×1350 `<canvas>` → `canvas.toBlob('image/png')` → `arrayBuffer()`. If > 1.5 MB, re-encode as JPEG 0.9.
4. Thumbnail: draw the same image at 270×338 → JPEG 0.8.
5. Write `PhotoRecord` to the `photos` store, then commit the reward action.
6. Budget: 60 photos × ~1 MB ≈ 60 MB, well within Safari's quota (research §4). If a write fails with a quota error, show "Album full on this device" and keep the photo on screen so the player can still "Save to my device".
7. Constraint: no `<foreignObject>`, no external `href`s, no CSS filters in photo scenes (they break or slow rasterization on iOS). A unit test scans photo-scene art for these.
8. This whole pipeline is proven on the real iPhone in the **M0 risk spike** before M1 starts.

---

## 7. Component boundaries

```
src/
  app/          App.tsx (boot, scene switch, error boundaries), SceneHost, transitions
  ui/           Design-system primitives: Button, IconButton, Dock, HudCoins, Sheet, Carousel,
                Tabs, Toast, Card, ProgressRing, MathGate. No game knowledge.
  scenes/       One folder per scene: TitleScene, CreatorScene, LifestyleScene, HomeScene,
                ClosetScene, CookingScene, MapScene, CafeScene, BoutiqueScene, AirportScene,
                FlightScene, ParisScene, PhotoScene, AlbumScene, ParentScene, RecoveryScene.
                Scenes read the store via selectors and call actions. Activity reducers live here.
  art/          Pure SVG components: CharacterRig, parts/, wear/, furn/, scenes/, stickers/.
                Props in, SVG out. No store, no side effects. A registry maps art keys → lazy components.
  game/         Pure rules: economy, wardrobe, home, cafe (orderGen, scoring), cooking, unlocks,
                journey, save (validate, sanitize, migrate). No React/DOM imports (lint-enforced).
  content/      Catalogs and config: wearables, appearance, furniture, homes, recipes, cafe,
                locations, destinations, stickers, strings, credits, balance.
  state/        Zustand store, selectors, persistence adapter, write queue.
  platform/     storage.persist, install detection, share/download, audio engine, haptics no-op,
                debug log + overlay, error log ring buffer, build version, SW update control,
                test hooks (?seed, ?fixture: compiled into preview builds only).
  test/         Fixtures (saves per version), helpers.
```

**Dependency rule (enforced with ESLint `no-restricted-imports`):**

```
scenes → ui, art, state, game, content, platform
state  → game, content, platform
game   → content (types only)
art    → content (types only)
ui     → (nothing game-specific)
```

---

## 8. Asset-loading strategy

| Asset                                 | Format                                                                                                            | Loading                                                                                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Character rig, wearables, hair, faces | SVG React components                                                                                              | Separate chunk loaded during the title screen (the title itself needs none of it)                                                  |
| Home rooms (2)                        | SVG components                                                                                                    | Lazy chunk per home; the chosen one preloads during the title                                                                      |
| Map                                   | SVG component                                                                                                     | Lazy chunk, prefetched after Home renders                                                                                          |
| Café, Boutique, Airport, Paris scenes | SVG components                                                                                                    | Lazy chunk per scene; prefetched when the map preview card opens                                                                   |
| Thumbnails for carousels              | Rendered live from the same SVG at small size, memoized; carousels are **virtualized** (only visible tiles mount) | If closet scrolling stutters on the iPhone, pre-render thumbnails to WebP at build time with Playwright (already a dev dependency) |
| Fonts                                 | Fredoka 600, Nunito 600/800, subset to Latin, WOFF2, self-hosted                                                  | `font-display: swap`, preloaded                                                                                                    |
| SFX (~20 sounds)                      | M4A (AAC), mono, ≤ 30 KB each                                                                                     | Fetched and decoded after the title tap; SFX before decode completes are skipped silently                                          |
| Music (1 loop, optional)              | M4A, ≤ 600 KB                                                                                                     | Lazy after first scene                                                                                                             |
| Everything                            | Precached by the service worker                                                                                   | Offline after first visit                                                                                                          |

**Fallback:** if a static background ever drops below 50 fps on the target iPhone, pre-rasterize _that background only_ to WebP at 2× and keep characters and hotspots as SVG (technical-options §5).

**Budget:** total precache ≤ 3 MB gzip; initial JS ≤ 250 KB gzip before the title is interactive.

---

## 9. Error handling

| Failure                                                   | Detection                         | Player experience                                                                               | Recovery                                         |
| --------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Scene render error                                        | React error boundary per scene    | Coral card: "Oops! This place needs a quick tidy." [Back to Map]                                | Error logged to the ring buffer; store untouched |
| App-level crash                                           | Root error boundary               | Same card with [Restart] (reloads)                                                              | Save is on disk already                          |
| Save invalid on write                                     | `validate()`                      | Nothing visible                                                                                 | Write skipped, logged                            |
| Save unreadable on boot                                   | Read pipeline §5.3                | Previous-save toast or Recovery scene                                                           | Previous slot, backup import                     |
| IndexedDB unavailable / quota                             | Exceptions from idb-keyval        | "Saving is paused" banner                                                                       | Game keeps working in memory                     |
| Photo render fails                                        | try/catch around rasterize        | "The camera blinked! Try again."                                                                | Composition kept on screen                       |
| Share/download fails or cancelled                         | Promise rejection                 | Cancel: nothing. Error: offer "open image" fallback                                             | —                                                |
| Audio decode fails                                        | Promise rejection                 | Silent; visuals unchanged                                                                       | —                                                |
| Import file invalid                                       | Validation                        | "This doesn't look like a Petalport backup."                                                    | Nothing changed                                  |
| Service worker update                                     | `onNeedRefresh`                   | Never interrupts; applies the next time the title screen shows, or via parent-area "Update now" | Version label proves which build runs            |
| AudioContext suspended/interrupted (backgrounding, calls) | `statechange`, `visibilitychange` | Silent until next tap                                                                           | `resume()` on visibility and on the next tap     |
| Silent switch on                                          | Not detectable reliably           | Sound settings show "No sound? Check your phone isn't on silent"                                | The game respects the switch on purpose          |
| Unknown content ID in save                                | `sanitize()`                      | Nothing visible                                                                                 | Fallback to starter item                         |

**Copy rules:** never red, never "error", never blame the player, always one obvious next button.

**Debug overlay (ships in every build, behind the grown-up gate):** long-press the version label in the parent area for 2 s → FPS meter (with a Low Power Mode hint when FPS is pinned near 30), storage status, persist result, standalone yes/no, last 50 log entries, and **Copy log** so you can paste it to Claude. Nothing is ever sent anywhere.
