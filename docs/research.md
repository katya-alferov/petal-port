# Research Report: Virtual-Life & Dress-Up Game for Ages 7–13

**Date of research:** 25 October 2026
**Phase:** Discovery only. No application code was written and no dependencies were installed.
**Companion docs:** [game-concept.md](game-concept.md) · [technical-options.md](technical-options.md) · [roadmap.md](roadmap.md)

---

## 1. Methodology

**What I did**

- Ran web searches, then opened the primary or best available source for each claim: App Store listings, Common Sense Media reviews, official docs (WebKit, MDN, Phaser, PixiJS, Playwright, web.dev, GitHub Docs), regulators (UK ICO, plus a law-firm summary of the FTC COPPA amendments), peer-reviewed research (JAMA Network Open, *Motivation and Emotion*), and the license pages of asset sources.
- Looked up current package versions and licenses straight from the npm registry (`registry.npmjs.org/<pkg>/latest`), on 25 Oct 2026.
- Marked every statement as one of three kinds:
  - **[V] Verified:** I read it in the cited source during this session.
  - **[H] Hypothesis:** my inference, not tested.
  - **[R] Recommendation:** a design or technical choice I am proposing.

**Limits (stated honestly)**

- **No hands-on play.** I could not install or play the games. My game observations come from store listings, reviews and encyclopedia entries, not my own play.
- **Pages I could not read:**
  - Barbie Dreamhouse Adventures App Store page (client error)
  - PubMed Central copy of the JAMA paper (CAPTCHA). I used the Michigan Medicine summary and the deceptive.design index instead.
  - Wikimedia Commons reuse guide (not found)
  - Font Squirrel license page (robots-blocked)
  - Full NN/g children's report (paywalled). I used the free NN/g summary article.
- **No market data.** I found no reliable, accessible market-size or player statistics for this niche, so none are included. Figures that are cited (for example Club Penguin's 200M accounts) come from the named source.
- **Copies vary by country.** App Store prices and labels are the US storefront on the research date and differ by region.
- **Not legal advice.** The legal summaries below are not legal advice. A lawyer should review the game before any public launch.

---

## 2. Relevant games: verified observations

| Game | Status / age signal | Monetization | Social | What it does well (for us) |
|---|---|---|---|---|
| **Stardoll** (2005–) | [V] Still releasing updates "as of 2026" per Wikipedia. Flash-era; core membership described as 13+. | [V] Free; real-money "Superstar" and "Royalty" tiers gate stores and features. | [V] Suites visited by others; daily "Covergirl" voting contests. | Deep dress-up, "MeDoll" self-avatar, shopping plaza as a place. |
| **MovieStarPlanet 2** | [V] App Store **13+**. Common Sense rates it **16+**. | [V] VIP $5.99/wk–$14.99/mo; Diamond packs up to $44.99. | [V] Chat, friends, user-generated content. Common Sense says the chat filter is easily bypassed. | Fit Check outfit sharing, movie maker, weekly collections, seasonal events. |
| **Toca Boca World** | [V] App Store **4+**, "made for ages 6–8". Common Sense **4+**. | [V] Paid location/furniture packs ($0.99–$4.99 listed). Common Sense notes the always-visible cart icon. | [V] Single-player, no chat with strangers. | Open-ended roleplay, Home Designer, free Character Creator with diverse skin tones; "characters are nonbinary by default" (Common Sense); weekly Friday gift at the Post Office; offline play. |
| **Avakin Life** | [V] App Store **13+** (suggestive themes, simulated gambling, loot boxes). Common Sense **17+**. | [V] Currency packs up to $19.99; monthly VIP. | [V] Open chat with anyone in a room. Privacy labels list tracking across apps. | Rich 3D homes, fashion, travel-style locations (space, Amazon). **A clear example of what not to put in front of 7–13s.** |
| **Club Penguin** (2005–2017) | [V] Designed for ages 6–14. | [V] Membership; ~90% of players never paid; **no advertising**. | [V] "Ultimate Safe Chat" (preset phrases only) and paid moderators. | Igloo decorating, pets (puffles), minigames earning coins, seasonal parties. Its strong safety reputation reassured parents. Critics noted a "caste system" between paying and free players. |
| **Webkinz** (2005–) | [V] Active, with a new browser version announced Oct 2025. | [V] Plush codes, Deluxe membership, eStore. | [V] Friends and trading. | Pet care, room decorating, earning currency through minigames and quizzes. |
| **Neopets** (1999–) | [V] Audience now mostly adults (nostalgia). | [V] Premium currency; past "immersive advertising" criticized. | [V] Moderated boards and mail. | Themed lands on a world map, 100+ games with earning caps, shops. Cautionary: banned under-13s from casino-style games after a 2004 report. |
| **Animal Crossing: Pocket Camp** | [V] Online version ended 28 Nov 2024. **Complete** is a paid, offline, no-microtransaction version ($19.99). | [V] The original had loot-box "fortune cookies"; access was revoked in Belgium in 2019. | n/a | Villager requests lead to crafting, decorating and relationships. Proof that the loop survives **without** microtransactions. |
| **Animal Crossing: New Horizons** (museum) | [V] Per Nookipedia. | n/a | n/a | Donated collections visibly **fill** museum exhibits ("tanks are filled... as more fish are donated"). An excellent model for souvenir collections. |
| **Gacha Life** | [V] Common Sense **9+**. | [V] Gem packs; Common Sense notes that currency and stamina drain pushes purchases; ads. | [V] Unmoderated chat. | Studio mode for making **scenes and skits** with dressed characters. That is a strong self-expression feature. |

### Cross-cutting observations

1. **[V] The best-loved mechanics are expressive, not competitive.** Across reviews, the most praised features are character creation, decorating, and storytelling or scene tools: Toca's Home Designer, Gacha's Studio, MSP's movie maker. Contest and voting systems (Stardoll Covergirl, MSP Fit Check) bring social pressure along with them.
2. **[V] Older-skewing titles fail on safety.** Every game aimed at teens with open chat (MSP, Avakin, Gacha) gets an expert age rating far above its store rating, and the concerns are chat, strangers and spending.
3. **[V] Paywalls around self-expression create resentment.** MSP reviews repeatedly mention VIP-only clothes, and Club Penguin critics described a paid/free caste system.
4. **[V] A no-ads, no-chat, single-player design is commercially viable and loved.** Toca Boca World and Pocket Camp Complete both show this.
5. **[H] The "virtual city" nostalgia is about *place*.** The feeling of a map of shops, a plaza, and a home you return to, with your doll as your stand-in, matters more than any single mechanic. Stardoll's Starplaza, Neopets' lands and Club Penguin's island all share this.
6. **[H] Travel and souvenirs are underserved.** In the products examined, travel shows up only as extra locations to buy (Avakin, Toca). No game I looked at builds **collecting real-world-inspired souvenirs into a visible album or home display** as a core loop. That is a differentiation opportunity, but I have not surveyed the whole market.

### What players can actually interact with vs. what is decorative

- **[V] Toca:** almost everything can be picked up and moved between locations. This is the gold standard for "everything is touchable".
- **[V] Toca's weakness:** Common Sense notes locations "feel similar, with different scenery but much of the same content". Breadth without new verbs reads as repetitive.
- **[R] Rule for us:** every scene ships with at least **three interactive objects that produce feedback** (sound, animation or reward). Purely decorative art is allowed only as background layers.

---

## 3. Design patterns

### Adopt

| Pattern | Evidence | Why |
|---|---|---|
| Layered, mix-and-match avatar with inclusive defaults | [V] Toca: free creator, range of skin tones | Self-expression is the core motivation; inclusion keeps it from being a paywall. |
| A home you decorate freely | [V] Toca, Club Penguin igloos, Webkinz rooms | Ownership and a place to return to. |
| Earn soft currency through short activities | [V] Club Penguin minigames, Webkinz games | Gives jobs meaning and makes purchases feel earned. |
| **Known-price shop**, never random | [R], from the loot-box evidence below | Children can plan and save. No gambling mechanics. |
| Visible collection that fills a space | [V] ACNH museum | Progress you can *see* motivates without timers. |
| Requests from friendly NPCs | [V] Pocket Camp villager requests | Gives direction ("what should I do?") without a quest log. |
| Scene / photo studio | [V] Gacha Studio, MSP movie maker | The highest-expression feature, and it works offline with no sharing needed. |
| Gentle weekly surprise that isn't a streak | [V] Toca Friday Post Office gift | A reason to return without punishing absence. |
| Preset-only messaging (if ever social) | [V] Club Penguin Ultimate Safe Chat | Proven safe pattern if social features are ever added. |

### Avoid

| Pattern | Evidence |
|---|---|
| Open chat, friend requests, user-generated content shared publicly | [V] Common Sense on MSP/Avakin/Gacha; FTC v. Epic (default-on chat ruled an "unfair practice") |
| Loot boxes, gacha, spin wheels, random paid rewards | [V] Avakin rated for simulated gambling; Pocket Camp loot boxes pulled in Belgium; Neopets casino games banned for under-13s |
| Parasocial pressure ("character cries if you leave"), fabricated time pressure, roadblocks, lures to return | [V] Radesky et al., JAMA Netw Open 2022: 80% of apps used by 3–5 year olds contained manipulative design |
| Energy or stamina that drains | [V] Common Sense on Gacha Life |
| Always-visible shop or cart; premium-gated fashion | [V] Common Sense on Toca; MSP reviews |
| Popularity voting and public ranking of looks | [V] Stardoll Covergirl, MSP Fit Check competitions; [H] social comparison around appearance is risky for this age |
| Ads of any kind | [V] NN/g: children cannot tell ads from content |

---

## 4. Recommended technical architecture (summary)

Full analysis is in [technical-options.md](technical-options.md).

| Criterion | **React + TS + SVG/CSS (recommended)** | Phaser 4 (canvas/WebGL) | PixiJS 8 (+ @pixi/react) |
|---|---|---|---|
| Fit for dress-up, menus, decorating | Excellent: DOM/SVG layers, native text | Fair: UI must be rebuilt in canvas | Good for scenes, but UI still DOM |
| Accessibility (screen readers, text scaling) | Strong (semantic HTML + SVG titles) | Weak (canvas output is opaque) | Weak in canvas |
| Animation performance | Good for tens to low hundreds of animated elements (CSS transforms) [H] | Excellent at sprite scale [V vendor claim] | Excellent |
| Physics / arcade minigames | Possible but hand-rolled | Built in | Rendering only |
| Bundle / complexity | Smallest | Large framework | Medium |
| Claude Code iteration speed | Highest [H] | Medium | Medium |
| License | MIT (React), Apache-2.0 (TypeScript) [V npm] | MIT [V npm] | MIT [V npm] |

**[R] Verdict:** React + TypeScript + Vite, with characters and scenes as layered SVG, CSS transforms for motion, and Motion (MIT) for gestures. Save game in IndexedDB. Offline via a service worker. **Do not add Phaser for v1.** Revisit only if a specific minigame needs physics or hundreds of sprites. If that happens, lazy-load it for that one minigame.

### Key iPhone Safari facts that shape the architecture

- **[V] Data can be deleted after 7 days.** Safari deletes script-written storage (localStorage, IndexedDB) for an origin with no user interaction in **7 days of Safari use**. Home Screen web apps keep a separate counter and are effectively exempt (MDN; Search Engine Land summarizing WebKit).
- **[R] Consequences:** encourage "Add to Home Screen", call `navigator.storage.persist()`, and offer **save export/import** so a child never loses her world.
- **[V] Quotas are generous.** Since iOS 17 / Safari 17, an origin may use up to about 60% of disk in the browser app (WebKit blog, Aug 2023).
- **[V] No fullscreen on iPhone.** The Fullscreen API is unsupported on iPhone (iPad only). Design for Safari chrome being visible, or use Home Screen standalone mode.
- **[V] Audio waits for a tap.** An AudioContext must be created or resumed inside a user gesture (MDN). The first "Tap to play" screen doubles as the audio unlock.
- **[V] Reduced motion is supported.** `prefers-reduced-motion` works in Safari 10.1+ (web.dev).
- **[V] Touch targets:** Apple recommends at least 44×44 pt and WCAG 2.5.5 (AAA) asks for 44×44 CSS px (Adrian Roselli summary). **[R]** For ages 7–9, use ≥ 56 px for primary actions.

---

## 5. Free asset sources & license notes

**Principle [R]:** the game's signature art (characters, clothing, hair, homes, city, destinations) should be **original SVG drawn for this project**. No free library I found matches a premium, cohesive fashion-doll style. Mixing sources would look like a template. Use third-party assets for **UI sounds, icons, fonts, and prototyping placeholders**.

| Source | URL | Asset types / style | License [V] | Commercial? | Attribution | Limitations |
|---|---|---|---|---|---|---|
| **Kenney** | https://kenney.nl/support · e.g. https://kenney.nl/assets/tiny-city | Game art (2D/3D), UI, audio. Many packs are pixel or low-poly. | CC0 | Yes | Not required | Kenney logo reserved. Style is game-generic, not fashion. Tiny City is 16×16 pixel art. |
| **Kenney UI Pack** | https://kenney-assets.itch.io/ui-pack | 400+ UI sprites in 5 colors, with vector sources | CC0 1.0 | Yes | Not required | Generic look; restyle needed. |
| **Kenney Interface Sounds** | (Godot listing) https://godotengine.org/asset-library/asset/edit/2754 | 100 clicks, snaps, confirms | CC0 | Yes | Not required | Confirm on kenney.nl before download (I verified via the Godot listing). |
| **Open Peeps** (Pablo Stanley) | https://www.openpeeps.com/ | Hand-drawn people, mix-and-match, PNG/SVG, "584,688 combinations" | CC0 | Yes | Not required | Black-line doodle style, adult proportions. Good for **prototyping layering logic**, not final art. |
| **Openclipart** | https://openclipart.org/faq | Vector clip art (very mixed quality) | CC0 1.0 | Yes | Not required | Check the "pd_issue" tag. Inconsistent style. |
| **OpenGameArt** | https://opengameart.org/content/faq | Everything | Per asset: CC0, CC-BY, CC-BY-SA, OGA-BY, GPL | Yes | Required unless CC0 | **Filter to CC0.** CC-BY-SA/GPL carry share-alike duties. |
| **LPC clothes & hair** | https://opengameart.org/content/lpc-clothes-and-hair | Pixel-art sprite clothing | CC-BY-SA 3.0 / GPL / OGA-BY 3.0 | Yes | Required (multiple artists) | Pixel-RPG style that does not fit our direction. Listed only to flag the share-alike/attribution burden. |
| **Freesound** | https://freesound.org (licenses per Wikipedia) | Sound effects, ambience | Per sound: CC0, CC BY, **CC BY-NC**, Sampling+ | Only CC0 / CC BY | CC BY needs credit | Account required. **Exclude NC and Sampling+.** |
| **Incompetech** (Kevin MacLeod) | https://wiki.creativecommons.org/wiki/Case_Studies/Kevin_MacLeod | Music, many genres | CC BY (version not stated on the source I read) | Yes | Required (paid no-credit option exists) | Widely used, so tracks may feel familiar. Keep a credits screen. |
| **Pixabay** | https://pixabay.com/en/service/license/ | Photos, illustrations, music, SFX | Pixabay Content License (**not CC0**) | Yes, with limits | Not required | No standalone redistribution. No trademark or recognizable-person commercial use. **Use sparingly; prefer CC0.** |
| **Lucide icons** | https://lucide.dev/license | Line icons | ISC (Feather-derived subset MIT) | Yes | Keep license notice in source | Line style needs bold restyling for kids. |
| **Phosphor / Tabler icons** | npm `@phosphor-icons/core`, `@tabler/icons` | Icons (Phosphor has a "fill" and "duotone" weight) | MIT [V npm] | Yes | Keep license notice | — |
| **Twemoji** | npm `@twemoji/svg` | Emoji SVG | Package MIT [V npm]. **Artwork license not verified this session.** | Verify | Verify | Check the graphics license (historically CC BY 4.0) before use. |
| **OpenMoji** | https://openmoji.org/faq | Emoji/icons, flat outlined | **CC BY-SA 4.0** | Yes | Required ("All emojis designed by OpenMoji…") | Share-alike on modified emoji. |
| **DiceBear** | https://npmjs.com/package/@dicebear/micah | Avatar generator | Code MIT. **Each style has its own art license** (Micah = CC BY 4.0). | Yes | Per style | Check every style's license. Generic avatar look. |
| **Fonts: Fredoka, Nunito, Baloo 2** | npm `@fontsource/*` | Rounded, friendly display and body fonts | OFL-1.1 [V npm] | Yes | Not in-game; keep the OFL file | Cannot sell the font by itself. Self-host for offline use. |
| **jsfxr / ZzFX** | npm `jsfxr`, `zzfx` | Generate retro SFX in code | ZzFX MIT. jsfxr: **no license field on npm, verify** | Yes (ZzFX) | Keep notice | 8-bit timbre; good for prototypes only. |

**Not recommended:**

- Paid stock libraries.
- Anything "free for personal use".
- Assets extracted from Stardoll, Toca, MSP or any other game.
- Images of branded fashion or recognizable landmarks with trademark issues.
- Wikimedia Commons photos as game art. Licenses vary per file, and I could not read the reuse guide this session.

**Travel destinations:** I found **no** cohesive, permissively licensed illustration set of world destinations. **[R]** Draw stylized original SVG landmarks ("a Paris-like café street", not the Eiffel Tower logo of any brand). Generic landmark depictions are generally fine, but a lawyer should confirm before commercial launch.

---

## 6. Usability & safety considerations

### Children's UX

- **[V] Design for narrow age bands (NN/g).** The bands are 6–8 and 9–12. Kids notice "babyish" content. **[R]** Use one visual style that reads as "cool" to 12s but stays operable for 7s: a *mature look, simple controls*.
- **[V] Reading:** young children read tentatively and skip instructions (NN/g). **[R]** Use icons + short labels + optional voice or sound cues, and **never put critical info in text alone**. Use 16–18 px minimum body text and 20+ px for labels.
- **[V] Scrolling:** young children avoid scrolling unless the cues are clear (NN/g). **[R]** Use horizontal carousels with a peeking next item, and keep primary actions always visible.
- **[V] Children enjoy sound and animation and expect taps to do something (NN/g).** **[R]** Every tap gives feedback within 100 ms.
- **[V] Gestures:** young kids do best with large, simple actions (NN/g). **[R]** Use tap and drag only. No pinch, long-press-only, or multi-finger gestures in core flows.

### Privacy & safety (legal context, not legal advice)

- **[V] COPPA (US)** applies to operators collecting personal info from under-13s.
  - The 2025 amendments became effective 23 June 2025, with compliance due 22 April 2026.
  - They add data-retention limits and separate parental consent for third-party disclosure (White & Case summary).
- **[V] UK Age Appropriate Design Code** has 15 standards, including:
  - high-privacy defaults
  - data minimisation
  - geolocation off by default
  - profiling off by default
  - no nudges that weaken privacy
  - age-band guidance for 6–9 and 10–12 (ICO code PDF)
- **[V] FTC v. Epic (Dec 2022):** a $275M COPPA penalty and $245M in refunds, over default-on chat and dark-pattern purchases (Engadget).
- **[R] Our posture: collect nothing.**
  - No accounts, no analytics, no ads, no network calls after load.
  - No location, camera or microphone.
  - Name entry is optional, stays on-device, and is pre-filled with fun suggestions.
  - Photos are saved only to the device by the player's own action.
- **[H] Legal scope:** if no personal information is collected or transmitted, COPPA's consent obligations likely don't trigger. A legal review is still needed before any public release.

### Healthy engagement

- **[V]** Self-Determination Theory research (Ryan, Rigby & Przybylski 2006) links game enjoyment to satisfying **autonomy, competence, relatedness**. **[R]** Build return motivation from these, not from streaks or FOMO.
- **[R]** No timers that punish absence, no expiring offers, and no "come back tomorrow or lose it".
- **[R]** Offer optional soft session cues, such as the day turning to evening in-game, with no hard lockouts.

---

## 7. Major risks & unresolved questions

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | **Art production is the bottleneck.** A premium look needs a lot of consistent original SVG; free assets won't carry it. | High | A tight style guide plus a modular part system (one body rig, swappable layers). Start with fewer, better items. Claude can draft SVG, but **human art direction and iteration are essential** [H]. |
| 2 | **Safari data loss** wipes a child's world. | High | Home Screen install prompt, `storage.persist()`, export/import save code, autosave. |
| 3 | **Repetitive jobs** become clicking chores. | Med-High | Each job is a real mini-game with ranks that unlock *new verbs*, not just higher pay. Cap daily earnings softly. |
| 4 | **Age span 7–13** is wide; 12–13s may find it childish. | Medium | Mature visual style, an optional "Pro" difficulty in mini-games, more creative depth (pattern and colour editors). |
| 5 | **Body-image / appearance pressure** in a fashion game. | Medium | Multiple body shapes and abilities (e.g., wheelchair, glasses, hearing aids), no ratings of looks, NPCs praise *creativity* not beauty. |
| 6 | **Scope creep** toward an MMO. | Medium | Single-player and offline by charter. Social only via exported photos. |
| 7 | **Name / trademark** conflicts for the working title. | Low now | Formal search before publishing. |
| 8 | **No Mac** means Safari Web Inspector debugging is unavailable. | Unknown | Playwright WebKit emulation plus an in-app debug overlay. Ask the user. |

**Open questions for you:**

1. Is this a personal or family project, or will it be published publicly? This changes legal review and hosting.
2. Do you have a Mac, for Safari remote debugging on iPhone?
3. Should the player character be "a girl" only, or include broader options? (I recommend an inclusive creator with feminine-styled defaults.)
4. Is it English only at first?
5. Do you have any real children who can playtest? Even 2–3 testers change everything.

---

## 8. Prioritized recommendations

| Priority | Recommendation | Impact | Effort |
|---|---|---|---|
| P0 | Write the art style guide + modular SVG character rig before any features | Very high | Medium |
| P0 | Zero-data, offline, no-account architecture (React + SVG + IndexedDB + PWA) | Very high | Low-Med |
| P0 | Dress-up studio with ≥ 40 quality items and instant feedback | Very high | Medium |
| P1 | Home decorating with drag-and-place furniture | High | Medium |
| P1 | 2 jobs as real mini-games (Café, Boutique stylist) with known-price shop | High | Medium |
| P1 | Save export/import + Home Screen install guidance | High | Low |
| P1 | Photo studio (pose + backdrop + stickers → save PNG) | High | Medium |
| P2 | Travel: 1 destination with souvenirs and a filling souvenir shelf | High (differentiator) | Medium |
| P2 | NPC requests ("Mia needs a picnic outfit") | Medium | Low-Med |
| P3 | Cooking expansion, more destinations, pets, seasons | Medium | High (content) |

---

## 9. Sources (all accessed 25 Oct 2026)

**Games**
- Stardoll, Wikipedia: https://en.wikipedia.org/wiki/Stardoll. History, Superstar/Royalty paywall, 2026 status, contests.
- MovieStarPlanet 2, App Store: https://apps.apple.com/us/app/-/id1464895545. 13+, VIP prices, chat, Fit Check.
- MovieStarPlanet, Common Sense Media: https://www.commonsensemedia.org/app-reviews/moviestarplanet. 16+, chat filter bypass, VIP pressure.
- Toca Boca World, App Store: https://apps.apple.com/us/app/-/id1208138685. 4+, ages 6–8, IAP list, no chat, Friday gifts.
- Toca Life World, Common Sense Media: https://www.commonsensemedia.org/app-reviews/toca-life-world. Inclusive creator, cart icon, repetition.
- Avakin Life, App Store: https://apps.apple.com/app/avakin-life-3d-avatar-creator/id740737088. 13+, gambling and loot-box descriptors, tracking.
- Avakin Life, Common Sense Media: https://www.commonsensemedia.org/app-reviews/avakin-life. 17+, open chat concerns.
- Club Penguin, Wikipedia: https://en.wikipedia.org/wiki/Club_Penguin. Ages 6–14, Ultimate Safe Chat, no ads, membership.
- Webkinz, Wikipedia: https://en.wikipedia.org/wiki/Webkinz. Pet care and decorating loop, 2025 status.
- Neopets, Wikipedia: https://en.wikipedia.org/wiki/Neopets. Lands, earning caps, advertising and gambling criticism.
- Animal Crossing: Pocket Camp, Wikipedia: https://en.wikipedia.org/wiki/Animal_Crossing:_Pocket_Camp. Requests loop, loot boxes, Complete offline version.
- Museum, Nookipedia: https://nookipedia.com/wiki/Museum. Collections visibly filling exhibits.
- Gacha Life, Common Sense Media: https://www.commonsensemedia.org/app-reviews/gacha-life. Studio mode, stamina and spend pressure.

**Child design, safety, law**
- NN/g, Children's UX: https://www.nngroup.com/articles/childrens-websites-usability-issues/. Age bands, reading, scrolling, ads, gestures.
- UK ICO, Age Appropriate Design Code v2.1 (PDF): https://ico.org.uk/media/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services-2-1.pdf. The 15 standards and age bands.
- White & Case, COPPA amendments: https://www.whitecase.com/insight-alert/unpacking-ftcs-coppa-amendments-what-you-need-know. Dates and new requirements.
- Engadget, FTC v. Epic: https://www.engadget.com/epic-games-ftc-settlement-fortnite-170857237.html. Default chat and dark patterns.
- Michigan Medicine, Radesky et al. summary: https://michiganmedicine.org/health-lab/design-tricks-commonly-used-monetize-young-childrens-app-use. Manipulative design examples.
- deceptive.design index of the JAMA paper: https://deceptive.design/articles/prevalence-and-characteristics-of-manipulative-design-in-mobile-applications-used-by-children. Citation, 80% figure, categories.
- ScienceDaily, Ryan/Rigby/Przybylski: https://www.sciencedaily.com/releases/2006/12/061226134706.htm. SDT and game motivation.
- UNICEF RITEC: https://www.unicef.org/innovation/responsible-innovation-technology-children-ritec. Framework exists; the 8 components were not listed on the pages I accessed.
- Adrian Roselli, target size: https://adrianroselli.com/2019/06/target-size-and-2-5-5.html. 44 px / 44 pt / 48 px guidance.

**Technical**
- WebKit, "Updates to Storage Policy": https://webkit.org/?p=14403. Quotas, eviction, `persist()`.
- MDN, Storage quotas & eviction: https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria. Safari 7-day proactive eviction.
- Search Engine Land, Safari 7-day cap: https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519. Home Screen exemption.
- Fullscreen support table: https://docs.w3cub.com/browser_support_tables/fullscreen. iPhone unsupported.
- MDN, Web Audio best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices. Gesture unlock.
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- Phaser 4: https://phaser.io/phaser4 and ScaleManager source https://app.unpkg.com/phaser@4.2.1/files/src/scale/ScaleManager.js
- Phaser + React template news: https://phaser.io/news/2024/02/official-phaser-3-and-react-template
- PixiJS June 2026 update: https://pixijs.com/blog/june-2026
- Playwright emulation: https://playwright.dev/python/docs/emulation
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site. Free for public repos.
- npm registry metadata for versions and licenses (react 19.3.1, vite 8.3.5, typescript 7.0.2, phaser 4.2.1, pixi.js 8.22.0, motion 14.6.0, zustand 5.0.16, idb-keyval 6.3.0, vite-plugin-pwa 2.0.0, vitest 5.0.5, @playwright/test 1.64.1, gsap 3.15.0 "Standard no-charge license").

**Assets**
- Kenney support: https://kenney.nl/support · Tiny City: https://kenney.nl/assets/tiny-city · UI Pack: https://kenney-assets.itch.io/ui-pack · Interface Sounds (Godot listing): https://godotengine.org/asset-library/asset/edit/2754
- Open Peeps: https://www.openpeeps.com/
- Openclipart FAQ: https://openclipart.org/faq
- OpenGameArt FAQ: https://opengameart.org/content/faq · LPC clothes: https://opengameart.org/content/lpc-clothes-and-hair
- Freesound licenses, Wikipedia: https://en.wikipedia.org/wiki/Freesound
- Kevin MacLeod, CC case study: https://wiki.creativecommons.org/wiki/Case_Studies/Kevin_MacLeod
- Pixabay license: https://pixabay.com/en/service/license/
- Lucide license: https://lucide.dev/license
- OpenMoji FAQ: https://openmoji.org/faq
- DiceBear Micah: https://npmjs.com/package/@dicebear/micah
- Secondary list (not relied on for license claims): https://app.cinevva.com/guides/game-assets-guide.html
