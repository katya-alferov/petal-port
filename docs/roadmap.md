# Roadmap: Petalport

**Staged plan from a tiny iPhone prototype to a rich world.**

- Each stage ends with a **playtest gate**. Don't move on until the gate passes.
- Stages are sized by scope, not calendar, since pace depends on your review time.
- Concept: [game-concept.md](game-concept.md) · Tech: [technical-options.md](technical-options.md) · Evidence: [research.md](research.md)

---

## Stage 0: Foundations (no gameplay yet)

**Goal:** lock the look and the rig before building features, because art is the biggest risk.

- Art style guide:
  - palette tokens
  - type scale
  - button and panel "sticker" components
  - outline and shading rules
- **Character rig v1:** one SVG body, layer slots, 3 test outfits, recolour working.
- One illustrated scene mock (the waterfront title) to prove the "premium postcard" feel.
- Project scaffold:
  - Vite + React + TS
  - lint and test setup
  - PWA shell
  - persistence adapter with save versioning
  - debug overlay
- **Gate:** you look at the character and title scene on your iPhone and say "yes, that's the quality bar".

## Stage 1: v0.1 "First Day" (first playable)

**Goal:** 15–20 fun minutes. Scope as in game-concept §6:

- creator
- wardrobe (~40 items)
- studio home (12 furniture items)
- map with 4 places
- Café and Boutique jobs
- Market with known prices and savings pin
- notice-board briefs
- photo mode lite
- autosave + save code
- Home Screen hint

**Gate:**
- 1–3 children aged 7–13 play unaided.
- No dead taps.
- They change outfits unprompted.
- At least one asks to play again.
- 60 fps feel on your iPhone during drag and transitions (subjective plus debug overlay).

## Stage 2: v0.2 "Make It Mine"

- **Hair:** textures and head coverings, 15+ styles. Expanded creator (body shapes, adaptive options).
- **Pattern designer:** stripes, dots, florals on tintable regions. This gives older players depth.
- **Home:** wall/floor sets, 30+ furniture, rotate/flip, layers, "cozy score" feedback that is *descriptive* ("so bright and plant-y!"), never a grade.
- **Job ranks** that unlock new verbs (e.g., latte art at Café rank 3).
- **Sticker Album** with silhouettes for uncollected items.
- **Weekly Post Box** gift.
- **Gate:** play sessions over a week show voluntary return (ask the parents), and kids describe what they *made*, not what they *bought*.

## Stage 3: v0.3 "Around Town"

- Bloom Florist job, Petal Park (play + photo spot), Bakery/cooking station.
- **Cooking system:** recipes as drag-sequence mini-games, with the dishes placeable in your home.
- **Photo Studio full:** poses, expressions, props, stickers, frames, multiple characters (NPC friends) in one shot.
- **Day/night and seasons** tied to the device clock (cosmetic only).
- A bigger home to unlock with saved coins (a second floor or balcony).

## Stage 4: v0.4 "Passport" (the differentiator)

- **Airport** and a plane-ticket savings goal.
- **First destination** (e.g., "Rue Lumière"):
  - its own illustrated scene
  - a signature activity (macaron decorating)
  - a local outfit set
  - a recipe
  - 6 souvenirs
- **Memory Shelf** at home that visibly fills with souvenirs, and a **Passport** with stamps.
- **Postcards:** compose a photo + a stamp + preset messages, saved as a PNG.
- **Gate:** kids want the *next* destination. Souvenir display gets noticed and talked about.

## Stage 5: v0.5+ "Wide World"

- 1 new destination per content drop: Sakura Lane, Coral Cay, Snowpeak, Spice Market, each with a cultural review.
- Pet companion (care-light, no neglect penalties).
- More jobs (Pet Salon, Photographer, Set Designer).
- Accessibility pass: VoiceOver labels audit, switch-friendly navigation, high-contrast option.
- Optional localisation (Spanish first?), with strings already externalised.

## Stage 6: "Maybe later" (each needs a separate decision)

| Idea | Why it's deferred |
|---|---|
| Sibling/friend sharing via offline "visit codes" (room or outfit encoded as text) | Low risk, no server. Needs a careful UX so codes can't carry free text. |
| Native app wrapper | Apple Developer Program cost; review requirements for kids' apps |
| Any online feature (cloud save, visiting, gifting) | Requires backend, accounts, parental consent, moderation. **Out of budget and against the safety charter.** |

---

## Cross-cutting tracks (every stage)

- **Content pipeline:** add items as typed catalog entries plus SVG components; a preview gallery page to review art quickly on your phone.
- **Balance:** a spreadsheet-style table in `content/` (prices vs. job pay) with unit tests so no item takes more than about 3 sessions to afford [R].
- **Safety charter check** before each release:
  - no network calls
  - no new data collected
  - no randomness in rewards
  - no timers that punish
  - no ads or IAP
- **Performance budget:** first load under ~3 MB before caching [H target]; every interaction responds within 100 ms.
- **Credits screen** listing every CC-BY asset and the license notices for icons and fonts.

---

## Proposed immediate next step

**Stage 0, part 1:**
1. Draft the art style guide.
2. Build the **character rig + 3 outfits + the title scene** as a tiny standalone preview you can open on your iPhone.

This tests the single biggest risk (can we hit a premium look with original SVG?) before investing in game systems. It's about one focused session of work and is easy to throw away if the look isn't right.

*Awaiting your approval before any code is written.*
