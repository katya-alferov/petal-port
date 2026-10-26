import { useMemo, useState } from 'react';
import { DishArt } from '../art/kitchen';
import { resolveRoom } from '../content/resolve';
import { type PoseId } from '../art/CharacterRig';
import { FLOOR_Y, HarbourLoft } from '../art/scenes/HarbourLoft';
import { furnitureFor, HARBOUR_LOFT } from '../content/furniture';
import { HOME_SLOTS, type HomeSlot } from '../content/types';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet, Tabs } from '../ui/kit';
import { regular } from '../content/cafe';
import { Character, FurnitureThumb, MainDock, PetFigure, ShellSpots, TopBar } from './common';

const CHAR_H = 1316; // 52% of the 2532 scene height (visual-design §7.2)

const SLOT_NAMES: Record<HomeSlot, string> = {
  wall: 'Wall picture',
  window: 'Window',
  seat: 'Sofa',
  rug: 'Rug',
  table: 'Table',
  lamp: 'Lamp',
  plant: 'Plant',
  shelf: 'Shelf',
};

export function HomeScene() {
  const save = useGame((s) => s.save);
  const setTheme = useGame((s) => s.setTheme);
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const placeFurniture = useGame((s) => s.placeFurniture);
  const [lampOn, setLampOn] = useState(true);
  const [pose, setPose] = useState<PoseId>('idle');
  const [editing, setEditing] = useState(false);
  const [pickSlot, setPickSlot] = useState<HomeSlot | null>(null);
  const theme = HARBOUR_LOFT.themes.find((t) => t.id === save.home.themeId) ?? HARBOUR_LOFT.themes[0];
  const room = useMemo(() => resolveRoom(HARBOUR_LOFT, save.home.themeId, save.home.slots), [save.home.themeId, save.home.slots]);
  const dish = save.progress.dish;
  const pet = save.progress.pet;
  const visitor = save.progress.visitor ? regular(save.progress.visitor) : undefined;
  const [visitLine, setVisitLine] = useState(0);
  const charX = visitor ? 470 : 585;

  const onSlotTap = (slot: HomeSlot) => {
    if (editing) {
      play('pop');
      setPickSlot(slot);
    } else if (slot === 'lamp') {
      play('soft');
      setLampOn((v) => !v);
    } else if (slot === 'plant') {
      play('chime');
      showToast('Ahh, the plant loves water!', 'sparkle');
    } else if (slot === 'seat') {
      play('soft');
      showToast('So comfy!', 'sparkle');
    } else if (slot === 'table') {
      play('pop');
      if (dish) showToast('Mmm, yummy! You made this.', 'sparkle');
      else setScene('kitchen');
    }
  };

  return (
    <section className="scene" aria-label="Home">
      <ShellSpots scene="home" />
      <div className="scene-art">
        <HarbourLoft
          room={room}
          lampOn={lampOn}
          onSlotTap={onSlotTap}
          tappable={editing ? HOME_SLOTS : ['lamp', 'plant', 'seat', 'table']}
          editing={editing}
          onTable={dish && <DishArt recipe={dish.recipeId} cook={dish.doneness} toppings={dish.toppings} />}
        >
          <g
            role="button"
            tabIndex={0}
            aria-label="Say hi"
            data-testid="home-character"
            style={{ cursor: 'pointer', opacity: editing ? 0.35 : 1 }}
            pointerEvents={editing ? 'none' : undefined}
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
              frame={{ x: charX - CHAR_H / 4, y: FLOOR_Y + 470 - CHAR_H * 0.975, width: CHAR_H / 2, height: CHAR_H }}
            />
          </g>
          {visitor && !editing && (
            <g
              role="button"
              tabIndex={0}
              aria-label={`${visitor.name} is visiting`}
              data-testid="home-visitor"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                play('pop');
                showToast(`${visitor.name}: “${visitor.visit[visitLine % visitor.visit.length]}”`, 'heart');
                setVisitLine((n) => n + 1);
              }}
            >
              <Character
                appearance={visitor.appearance}
                outfit={visitor.outfit}
                title={visitor.name}
                frame={{ x: 860 - CHAR_H / 4, y: FLOOR_Y + 470 - CHAR_H * 0.95, width: CHAR_H / 2, height: CHAR_H * 0.975 }}
              />
            </g>
          )}
          {pet && !editing && (
            <g
              role="button"
              tabIndex={0}
              aria-label={`Play with ${pet.name}`}
              data-testid="home-pet"
              style={{ cursor: 'pointer' }}
              onClick={() => (play('pop'), setScene('pet'))}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setScene('pet')}
            >
              <g transform={`translate(${visitor ? 20 : 90} ${FLOOR_Y - 60}) scale(1.05)`}>
                <rect width={300} height={300} fill="transparent" />
                <PetFigure pet={pet} mood="happy" />
              </g>
            </g>
          )}
        </HarbourLoft>
      </div>
      <TopBar title="Harbour Loft" />
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', zIndex: 5, padding: '0 12px 10px', display: 'grid', gap: 8 }}>
        {editing ? (
          <>
            <p className="panel" style={{ margin: 0, padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}>
              Tap anything to swap it!
            </p>
            <Tabs
              label="Room colors"
              value={theme.id}
              onChange={(id) => {
                play('swap');
                setTheme(id);
              }}
              tabs={HARBOUR_LOFT.themes.map((t) => ({ id: t.id, label: t.name }))}
            />
          </>
        ) : null}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={() => (play('pop'), setEditing((v) => !v))} testId="home-decorate" icon="palette">
            {editing ? 'Done' : 'Decorate'}
          </Button>
          {!editing && (
            <Button tone="primary" onClick={() => (play('chime'), setScene('kitchen'))} testId="home-cook" icon="pan">
              Cook
            </Button>
          )}
        </div>
      </div>
      <MainDock current="home" />
      {pickSlot && (
        <Sheet title={SLOT_NAMES[pickSlot]} onClose={() => setPickSlot(null)}>
          <div className="item-grid" style={{ marginBottom: 12 }}>
            {furnitureFor(pickSlot)
              .filter((f) => save.inventory.owned[f.id])
              .map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="shop-tile"
                  aria-pressed={save.home.slots[pickSlot] === f.id}
                  data-testid={`place-${f.id}`}
                  onClick={() => {
                    play('swap');
                    placeFurniture(pickSlot, f.id);
                    setPickSlot(null);
                  }}
                >
                  <span className="thumb">
                    <FurnitureThumb id={f.id} />
                  </span>
                  {f.name}
                </button>
              ))}
          </div>
          <Button onClick={() => (setPickSlot(null), setScene('boutique'))} icon="bag">
            Find more at the Boutique
          </Button>
        </Sheet>
      )}
    </section>
  );
}
