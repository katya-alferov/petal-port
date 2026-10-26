// Art gallery + style sheet (visual-design §13): review many pieces in a minute on the phone.
import { POSES } from '../art/CharacterRig';
import { FURN_ART } from '../art/furn';
import { HAIR_COLORS, HAIR_STYLES, SKIN_TONES } from '../content/appearance';
import { FURNITURE } from '../content/furniture';
import { DEFAULT_APPEARANCE, TEST_OUTFITS } from '../content/outfits';
import { equip } from '../game/wardrobe';
import { FASHION_SWATCHES, SWATCHES, TOKENS } from '../content/palette';
import { resolveFurniture } from '../content/resolve';
import { WEARABLES } from '../content/wearables';
import { STARTER_OUTFIT } from '../content/outfits';
import { Button, Panel, ProgressRing, Tile } from '../ui/kit';
import { Character, MainDock, TopBar } from './common';

const PLAIN = { top: STARTER_OUTFIT.top, bottom: STARTER_OUTFIT.bottom, shoes: STARTER_OUTFIT.shoes };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel style={{ display: 'grid', gap: 10 }}>
      <h2 className="display" style={{ fontSize: '1.375rem' }}>
        {title}
      </h2>
      {children}
    </Panel>
  );
}

export function GalleryScene() {
  return (
    <section className="scene" aria-label="Gallery" style={{ background: 'var(--paper-2)' }}>
      <TopBar title="Gallery" />
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 16px', display: 'grid', gap: 14, alignContent: 'start' }}
        data-testid="gallery-scroll"
      >
        <Section title="Outfits × poses">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {POSES.flatMap((p) =>
              TEST_OUTFITS.map((o, i) => (
                <div key={o.id + p} style={{ aspectRatio: '1 / 2' }}>
                  <Character
                    appearance={{
                      ...DEFAULT_APPEARANCE,
                      hairStyle: HAIR_STYLES[i].id,
                      skinTone: SKIN_TONES[i * 3 + 1].id,
                      hairColor: HAIR_COLORS[i * 2 + 1].id,
                    }}
                    outfit={o.outfit}
                    pose={p}
                    animate={false}
                    title={`${o.name}, ${p}`}
                  />
                </div>
              )),
            )}
          </div>
        </Section>
        <Section title="Hairstyles">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {HAIR_STYLES.map((h, i) => (
              <Character
                key={h.id}
                appearance={{
                  ...DEFAULT_APPEARANCE,
                  hairStyle: h.id,
                  hairColor: HAIR_COLORS[(i * 3) % 10].id,
                  skinTone: SKIN_TONES[(i * 7) % 10].id,
                }}
                outfit={STARTER_OUTFIT}
                animate={false}
                crop="60 0 280 420"
                title={h.name}
              />
            ))}
          </div>
        </Section>
        <Section title="Every wearable">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {WEARABLES.map((w) => (
              <div key={w.id} style={{ aspectRatio: '1 / 2' }}>
                <Character appearance={DEFAULT_APPEARANCE} outfit={equip(PLAIN, w)} animate={false} title={w.name} />
              </div>
            ))}
          </div>
        </Section>
        <Section title="Hat × hairstyles">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {HAIR_STYLES.map((h, i) => (
              <Character
                key={h.id}
                appearance={{
                  ...DEFAULT_APPEARANCE,
                  hairStyle: h.id,
                  hairColor: HAIR_COLORS[(i + 4) % 10].id,
                  skinTone: SKIN_TONES[(i + 5) % 10].id,
                }}
                outfit={{ headwear: { itemId: 'headwear.sun-hat' } }}
                animate={false}
                crop="60 0 280 280"
                title={`Sun hat on ${h.name}`}
              />
            ))}
          </div>
        </Section>
        <Section title="Skin tones">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
            {SKIN_TONES.map((t) => (
              <Character
                key={t.id}
                appearance={{ ...DEFAULT_APPEARANCE, skinTone: t.id }}
                outfit={{}}
                animate={false}
                crop="100 30 200 200"
                title={t.name}
              />
            ))}
          </div>
        </Section>
        <Section title="Furniture">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {FURNITURE.map((f) => {
              const Art = FURN_ART[f.art];
              const spec = resolveFurniture(f.id)!;
              return (
                <Tile key={f.id} label={f.name}>
                  <svg viewBox="0 0 300 300" role="img" aria-label={f.name}>
                    <Art main={spec.main} accent={spec.accent} />
                  </svg>
                </Tile>
              );
            })}
          </div>
        </Section>
        <Section title="Palette">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(TOKENS).map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center', width: 64 }}>
                <div style={{ height: 40, borderRadius: 12, background: v, border: '3px solid var(--outline)' }} />
                <small>{k}</small>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {FASHION_SWATCHES.map((id) => (
              <div
                key={id}
                style={{ display: 'flex', border: '3px solid var(--outline)', borderRadius: 12, overflow: 'hidden' }}
                title={id}
              >
                {(['highlight', 'base', 'shadow'] as const).map((k) => (
                  <span key={k} style={{ width: 16, height: 36, background: SWATCHES[id][k] }} />
                ))}
              </div>
            ))}
          </div>
        </Section>
        <Section title="Sticker UI kit">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button tone="primary">Primary</Button>
            <Button>Secondary</Button>
            <Button tone="confirm">Confirm</Button>
            <Button disabledReason="Need 15 more coins">Buy</Button>
            <ProgressRing value={0.6} size={44} />
          </div>
        </Section>
      </div>
      <MainDock current="gallery" />
    </section>
  );
}
