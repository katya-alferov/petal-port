import { useState } from 'react';
import { type PoseId } from '../art/CharacterRig';
import { EYE_COLORS, HAIR_COLORS, HAIR_STYLES, SKIN_TONES } from '../content/appearance';
import { TEST_OUTFITS } from '../content/outfits';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Carousel, Swatch, Tabs, Tile } from '../ui/kit';
import { Icon } from '../ui/icons';
import { Character, MainDock, TopBar } from './common';

type Tab = 'looks' | 'skin' | 'hair' | 'eyes';

const sameOutfit = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);

export function MeScene() {
  const save = useGame((s) => s.save);
  const setAppearance = useGame((s) => s.setAppearance);
  const setOutfit = useGame((s) => s.setOutfit);
  const [tab, setTab] = useState<Tab>('looks');
  const [pose, setPose] = useState<PoseId>('idle');
  const [twirl, setTwirl] = useState(0);
  const { appearance, outfit } = save.player;

  const change = (fn: () => void) => {
    fn();
    play('swap');
    setTwirl((n) => n + 1);
  };

  const wave = () => {
    play('pop');
    setPose('wave');
    window.setTimeout(() => setPose('idle'), 1400);
  };

  return (
    <section className="scene" aria-label="Me" style={{ background: 'linear-gradient(#FFEBD2, #FFF7EC 60%)' }}>
      <TopBar title="Me" />
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'grid', placeItems: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '70%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: '#FFE7C2',
            border: '3px dashed #F2C48E',
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
            { id: 'looks', label: 'Outfits' },
            { id: 'skin', label: 'Skin' },
            { id: 'hair', label: 'Hair' },
            { id: 'eyes', label: 'Eyes' },
          ]}
        />
        <div style={{ minHeight: 112 }}>
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
