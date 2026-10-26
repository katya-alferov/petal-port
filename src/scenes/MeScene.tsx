import { useState } from 'react';
import { type PoseId } from '../art/CharacterRig';
import { EYE_COLORS, HAIR_COLORS, HAIR_STYLES, SKIN_TONES } from '../content/appearance';
import { STARTER_OUTFIT, TEST_OUTFITS } from '../content/outfits';
import { FASHION_SWATCHES, SWATCHES } from '../content/palette';
import type { WearableDef, WearSlot } from '../content/types';
import { WEARABLES } from '../content/wearables';
import type { EquippedItem, Outfit } from '../game/save';
import { equip, unequip } from '../game/wardrobe';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Carousel, Swatch, Tabs, Tile, GlamBackdrop } from '../ui/kit';
import { Icon } from '../ui/icons';
import { Character, MainDock, SLOT_CROP, TopBar } from './common';

type Tab = 'closet' | 'looks' | 'skin' | 'hair' | 'eyes';

const CLOSET_SLOTS: { slot: WearSlot; label: string }[] = [
  { slot: 'top', label: 'Tops' },
  { slot: 'bottom', label: 'Bottoms' },
  { slot: 'dress', label: 'Dresses' },
  { slot: 'outerwear', label: 'Jackets' },
  { slot: 'shoes', label: 'Shoes' },
  { slot: 'headwear', label: 'Hats' },
  { slot: 'eyewear', label: 'Glasses' },
  { slot: 'neck', label: 'Necklaces' },
  { slot: 'bag', label: 'Bags' },
];
const REMOVABLE: WearSlot[] = ['dress', 'outerwear', 'headwear', 'eyewear', 'neck', 'bag'];

/** Equip, then make sure the outfit is still complete (a top needs a bottom once the dress comes off). */
function wear(outfit: Outfit, def: WearableDef, tint?: EquippedItem['tint']): Outfit {
  const next = equip(outfit, def, tint);
  if (!next.dress) {
    next.top = next.top ?? STARTER_OUTFIT.top;
    next.bottom = next.bottom ?? STARTER_OUTFIT.bottom;
  }
  return next;
}

const sameOutfit = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);

export function MeScene() {
  const save = useGame((s) => s.save);
  const setAppearance = useGame((s) => s.setAppearance);
  const setOutfit = useGame((s) => s.setOutfit);
  const [tab, setTab] = useState<Tab>('closet');
  const [slot, setSlot] = useState<WearSlot>('top');
  const [pose, setPose] = useState<PoseId>('idle');
  const [twirl, setTwirl] = useState(0);
  const { appearance, outfit } = save.player;

  const change = (fn: () => void) => {
    fn();
    useGame.getState().completeJourney('journey.character');
    play('swap');
    setTwirl((n) => n + 1);
  };

  const wave = () => {
    play('pop');
    setPose('wave');
    window.setTimeout(() => setPose('idle'), 1400);
  };

  return (
    <section className="scene" aria-label="Me" style={{ background: 'linear-gradient(#FFD6E6, #FFF0F6 45%, #FFF7EC 75%)' }}>
      <TopBar title="Me" />
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'grid', placeItems: 'center' }}>
        <GlamBackdrop />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '70%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FFFFFF, #FFE3EE 55%, #FFC9DD)',
            border: '3px dashed #FF9BBE',
          }}
        />
        <button
          type="button"
          onClick={wave}
          aria-label="Say hi"
          data-testid="me-character"
          style={{ all: 'unset', cursor: 'pointer', height: '100%', aspectRatio: '1 / 2', position: 'relative' }}
        >
          <div key={twirl} className="twirl" style={{ height: '100%' }}>
            <Character appearance={appearance} outfit={outfit} pose={pose} className="me-rig" />
          </div>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Wave"
          onClick={wave}
          style={{ position: 'absolute', right: 14, bottom: 14 }}
          data-testid="me-wave"
        >
          <Icon name="wave" />
        </button>
      </div>
      <div className="options">
        <Tabs<Tab>
          label="Customize"
          value={tab}
          onChange={(t) => {
            play('pop');
            setTab(t);
          }}
          tabs={[
            { id: 'closet', label: 'Closet' },
            { id: 'looks', label: 'Looks' },
            { id: 'skin', label: 'Skin' },
            { id: 'hair', label: 'Hair' },
            { id: 'eyes', label: 'Eyes' },
          ]}
        />
        <div style={{ minHeight: 112 }}>
          {tab === 'closet' && (
            <div style={{ display: 'grid', gap: 6 }}>
              <div className="chip-row" role="group" aria-label="Clothes type">
                {CLOSET_SLOTS.map((c) => (
                  <button
                    key={c.slot}
                    type="button"
                    className="chip"
                    aria-pressed={slot === c.slot}
                    onClick={() => (play('pop'), setSlot(c.slot))}
                    data-testid={`slot-${c.slot}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <Carousel label="Your clothes">
                {REMOVABLE.includes(slot) && (
                  <Tile
                    label="None"
                    selected={!outfit[slot]}
                    onClick={() => change(() => setOutfit(unequip(outfit, slot, STARTER_OUTFIT)))}
                    testId="wear-none"
                  >
                    <span style={{ fontSize: '2rem', fontWeight: 800 }}>∅</span>
                  </Tile>
                )}
                {WEARABLES.filter((w) => w.slot === slot && save.inventory.owned[w.id]).map((w) => (
                  <Tile
                    key={w.id}
                    label={w.name}
                    selected={outfit[slot]?.itemId === w.id}
                    onClick={() => change(() => setOutfit(wear(outfit, w)))}
                    testId={`wear-${w.id}`}
                  >
                    <Character
                      appearance={appearance}
                      outfit={equip(STARTER_OUTFIT, w)}
                      animate={false}
                      crop={SLOT_CROP[w.slot]}
                      title={w.name}
                    />
                  </Tile>
                ))}
              </Carousel>
              {outfit[slot] && (
                <div className="swatches" role="group" aria-label="Color">
                  {FASHION_SWATCHES.map((c) => {
                    const eq = outfit[slot]!;
                    const def = WEARABLES.find((w) => w.id === eq.itemId);
                    const current = eq.tint?.main ?? def?.tints[0]?.default;
                    return (
                      <Swatch
                        key={c}
                        color={SWATCHES[c].base}
                        label={c}
                        selected={current === c}
                        onClick={() => def && change(() => setOutfit(wear(outfit, def, { ...eq.tint, main: c })))}
                      />
                    );
                  })}
                </div>
              )}
              {!WEARABLES.some((w) => w.slot === slot && save.inventory.owned[w.id]) && (
                <p style={{ margin: 0 }}>Nothing here yet. Visit the Ribbon Boutique!</p>
              )}
            </div>
          )}
          {tab === 'looks' && (
            <Carousel label="Outfits">
              {TEST_OUTFITS.map((o) => (
                <Tile
                  key={o.id}
                  label={o.name}
                  selected={sameOutfit(o.outfit, outfit)}
                  onClick={() => change(() => setOutfit(o.outfit))}
                  testId={`look-${o.id}`}
                >
                  <Character appearance={appearance} outfit={o.outfit} animate={false} crop="60 200 280 600" title={o.name} />
                </Tile>
              ))}
            </Carousel>
          )}
          {tab === 'skin' && (
            <div className="swatches" role="group" aria-label="Skin tone">
              {SKIN_TONES.map((t) => (
                <Swatch
                  key={t.id}
                  color={t.base}
                  label={t.name}
                  selected={appearance.skinTone === t.id}
                  onClick={() => change(() => setAppearance({ skinTone: t.id }))}
                />
              ))}
            </div>
          )}
          {tab === 'hair' && (
            <div style={{ display: 'grid', gap: 6 }}>
              <Carousel label="Hairstyle">
                {HAIR_STYLES.map((h) => (
                  <Tile
                    key={h.id}
                    label={h.name}
                    selected={appearance.hairStyle === h.id}
                    onClick={() => change(() => setAppearance({ hairStyle: h.id }))}
                    testId={`hair-${h.id}`}
                  >
                    <Character
                      appearance={{ ...appearance, hairStyle: h.id }}
                      outfit={{}}
                      animate={false}
                      crop="80 0 240 260"
                      title={h.name}
                    />
                  </Tile>
                ))}
              </Carousel>
              <div className="swatches" role="group" aria-label="Hair color">
                {HAIR_COLORS.map((c) => (
                  <Swatch
                    key={c.id}
                    color={c.base}
                    label={c.name}
                    selected={appearance.hairColor === c.id}
                    onClick={() => change(() => setAppearance({ hairColor: c.id }))}
                  />
                ))}
              </div>
            </div>
          )}
          {tab === 'eyes' && (
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="swatches" role="group" aria-label="Eye color">
                {EYE_COLORS.map((c) => (
                  <Swatch
                    key={c.id}
                    color={c.iris}
                    label={c.name}
                    selected={appearance.eyeColor === c.id}
                    onClick={() => change(() => setAppearance({ eyeColor: c.id }))}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-pressed={appearance.eyeStyle === 'eyes.almond'}
                  onClick={() =>
                    change(() => setAppearance({ eyeStyle: appearance.eyeStyle === 'eyes.round' ? 'eyes.almond' : 'eyes.round' }))
                  }
                >
                  {appearance.eyeStyle === 'eyes.round' ? 'Round eyes' : 'Almond eyes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-pressed={appearance.freckles}
                  onClick={() => change(() => setAppearance({ freckles: !appearance.freckles }))}
                >
                  Freckles {appearance.freckles ? 'on' : 'off'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <MainDock current="me" />
    </section>
  );
}
