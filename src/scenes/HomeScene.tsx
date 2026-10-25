import { useMemo, useState } from 'react';
import { resolveRoom } from '../content/resolve';
import { type PoseId } from '../art/CharacterRig';
import { FLOOR_Y, HarbourLoft } from '../art/scenes/HarbourLoft';
import { HARBOUR_LOFT } from '../content/furniture';
import type { HomeSlot } from '../content/types';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Tabs } from '../ui/kit';
import { Character, MainDock, TopBar } from './common';

const CHAR_H = 1316; // 52% of the 2532 scene height (visual-design §7.2)

export function HomeScene() {
  const save = useGame((s) => s.save);
  const setTheme = useGame((s) => s.setTheme);
  const showToast = useGame((s) => s.showToast);
  const [lampOn, setLampOn] = useState(true);
  const [pose, setPose] = useState<PoseId>('idle');
  const theme = HARBOUR_LOFT.themes.find((t) => t.id === save.home.themeId) ?? HARBOUR_LOFT.themes[0];
  const room = useMemo(() => resolveRoom(HARBOUR_LOFT, save.home.themeId, save.home.slots), [save.home.themeId, save.home.slots]);

  const onSlotTap = (slot: HomeSlot) => {
    if (slot === 'lamp') {
      play('soft');
      setLampOn((v) => !v);
    } else if (slot === 'plant') {
      play('chime');
      showToast('Ahh, the plant loves water!', 'sparkle');
    } else if (slot === 'seat') {
      play('soft');
      showToast('So comfy!', 'sparkle');
    }
  };

  return (
    <section className="scene" aria-label="Home">
      <div className="scene-art">
        <HarbourLoft room={room} lampOn={lampOn} onSlotTap={onSlotTap} tappable={['lamp', 'plant', 'seat']}>
          <g
            role="button"
            tabIndex={0}
            aria-label="Say hi"
            data-testid="home-character"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              play('pop');
              setPose('wave');
              window.setTimeout(() => setPose('idle'), 1400);
            }}
          >
            <Character
              appearance={save.player.appearance}
              outfit={save.player.outfit}
              pose={pose}
              frame={{ x: 585 - CHAR_H / 4, y: FLOOR_Y + 470 - CHAR_H * 0.975, width: CHAR_H / 2, height: CHAR_H }}
            />
          </g>
        </HarbourLoft>
      </div>
      <TopBar title="Harbour Loft" />
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', zIndex: 5, padding: '0 12px 10px' }}>
        <Tabs
          label="Room colors"
          value={theme.id}
          onChange={(id) => {
            play('swap');
            setTheme(id);
          }}
          tabs={HARBOUR_LOFT.themes.map((t) => ({ id: t.id, label: t.name }))}
        />
      </div>
      <MainDock current="home" />
    </section>
  );
}
