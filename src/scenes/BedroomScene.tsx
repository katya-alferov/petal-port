// Bedroom (game-systems §17): pick walls, bedding, lamp, picture and rug; tap the lamp to switch it on or off.
import { useState } from 'react';
import { BedroomArt, type BedroomSpot } from '../art/scenes/Bedroom';
import { BEDDINGS, bedding, cabinet, LAMPS, PICTURES, RUGS, WALLS, WARDROBES, wallColor, type Choice } from '../content/bedroom';
import { DEFAULT_BEDROOM, type BedroomPart } from '../game/bedroom';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Tabs } from '../ui/kit';
import { ActivityBar } from './common';

const TABS: { id: BedroomPart; label: string }[] = [
  { id: 'walls', label: 'Walls' },
  { id: 'bedding', label: 'Bed' },
  { id: 'lamp', label: 'Lamp' },
  { id: 'picture', label: 'Picture' },
  { id: 'rug', label: 'Rug' },
  { id: 'wardrobe', label: 'Closet' },
];
const SPOT_TAB: Record<BedroomSpot, BedroomPart | null> = {
  lamp: null,
  picture: 'picture',
  window: 'walls',
  bed: 'bedding',
  wardrobe: 'wardrobe',
};

export function BedroomScene() {
  const setScene = useGame((s) => s.setScene);
  const saved = useGame((s) => s.save.home.bedroom);
  const setPart = useGame((s) => s.setBedroomPart);
  const look = { ...DEFAULT_BEDROOM, ...saved };
  const [tab, setTab] = useState<BedroomPart>('walls');
  const [lampOn, setLampOn] = useState(true);
  const w = wallColor(look.walls);
  const b = bedding(look.bedding);
  const cab = cabinet(look.wardrobe);

  const tap = (spot: BedroomSpot) => {
    if (spot === 'lamp') {
      setLampOn((v) => !v);
      play('pop');
      return;
    }
    const to = SPOT_TAB[spot];
    if (to) setTab(to);
    play('pop');
  };
  const pick = (part: BedroomPart, id: string) => {
    play('swap');
    setPart(part, id);
  };
  const choices: Choice[] = tab === 'lamp' ? LAMPS : tab === 'picture' ? PICTURES : RUGS;

  return (
    <section className="scene" aria-label="Your bedroom">
      <ActivityBar title="My bedroom" onBack={() => setScene('home')} />
      <div className="bedroom-stage">
        <BedroomArt
          colors={{
            wall: w.wall,
            stripe: w.stripe,
            floor: w.floor,
            main: b.main,
            accent: b.accent,
            cabinet: cab.body,
            cabinetDoor: cab.door,
          }}
          lamp={look.lamp}
          picture={look.picture}
          rug={look.rug}
          lampOn={lampOn}
          onTap={tap}
        />
      </div>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} label="Bedroom parts" />
        <div className="chip-row wrap" role="group" aria-label={TABS.find((t) => t.id === tab)?.label} style={{ marginTop: 8 }}>
          {tab === 'walls' &&
            WALLS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={look.walls === c.id}
                data-testid={`bedroom-walls-${c.id}`}
                onClick={() => pick('walls', c.id)}
              >
                <span className="swatch-dot" style={{ background: c.wall }} aria-hidden="true" />
                {c.name}
              </button>
            ))}
          {tab === 'bedding' &&
            BEDDINGS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={look.bedding === c.id}
                data-testid={`bedroom-bedding-${c.id}`}
                onClick={() => pick('bedding', c.id)}
              >
                <span className="swatch-dot" style={{ background: c.main }} aria-hidden="true" />
                {c.name}
              </button>
            ))}
          {tab === 'wardrobe' &&
            WARDROBES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={look.wardrobe === c.id}
                data-testid={`bedroom-wardrobe-${c.id}`}
                onClick={() => pick('wardrobe', c.id)}
              >
                <span className="swatch-dot" style={{ background: c.body }} aria-hidden="true" />
                {c.name}
              </button>
            ))}
          {(tab === 'lamp' || tab === 'picture' || tab === 'rug') &&
            choices.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={look[tab] === c.id}
                data-testid={`bedroom-${tab}-${c.id}`}
                onClick={() => pick(tab, c.id)}
              >
                {c.name}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
