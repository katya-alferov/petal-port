import { useMemo, useState } from 'react';
import { DishArt } from '../art/kitchen';
import { resolveRoom } from '../content/resolve';
import { type PoseId } from '../art/CharacterRig';
import { FLOOR_Y, HarbourLoft } from '../art/scenes/HarbourLoft';
import { furnitureFor, HARBOUR_LOFT } from '../content/furniture';
import { WINDOW_VIEWS } from '../content/views';
import { viewUnlocked } from '../game/views';
import { HOME_SLOTS, type HomeSlot } from '../content/types';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
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
  const setHomeView = useGame((s) => s.setHomeView);
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const placeFurniture = useGame((s) => s.placeFurniture);
  const [lampOn, setLampOn] = useState(true);
  const [pose, setPose] = useState<PoseId>('idle');
  const [editing, setEditing] = useState(false);
  const [pickSlot, setPickSlot] = useState<HomeSlot | null>(null);
  const [colors, setColors] = useState(false);
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
    <section className="scene" aria-label="Home" style={{ background: room.floor.base }}>
      {/* The room fills the space above the buttons, so nothing covers the player, the pet or a slot. */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div className="scene-art">
          <HarbourLoft
            room={room}
            lampOn={lampOn}
            onSlotTap={onSlotTap}
            tappable={editing ? HOME_SLOTS : ['lamp', 'plant', 'seat', 'table']}
            editing={editing}
            view={save.home.view}
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
        {editing && (
          <p
            className="panel"
            style={{ position: 'relative', zIndex: 5, margin: '0 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}
          >
            Tap anything to swap it!
          </p>
        )}
        <ShellSpots scene="home" />
      </div>
      <div style={{ position: 'relative', zIndex: 5, padding: '8px 12px 10px', display: 'flex', gap: 8, justifyContent: 'center' }}>
        {editing && (
          <Button onClick={() => (play('pop'), setColors(true))} testId="home-colors" icon="palette">
            Colors
          </Button>
        )}
        <Button
          onClick={() => (play('pop'), setEditing((v) => !v))}
          testId="home-decorate"
          icon={editing ? undefined : 'palette'}
          tone={editing ? 'confirm' : undefined}
        >
          {editing ? 'Done' : 'Decorate'}
        </Button>
        {!editing && (
          <Button tone="primary" onClick={() => (play('chime'), setScene('kitchen'))} testId="home-cook" icon="pan">
            Cook
          </Button>
        )}
      </div>
      {colors && (
        <Sheet title="Room colors" onClose={() => setColors(false)}>
          <div className="chip-row wrap" role="group" aria-label="Room colors" style={{ marginBottom: 8 }}>
            {HARBOUR_LOFT.themes.map((t) => (
              <button
                key={t.id}
                type="button"
                className="chip"
                aria-pressed={theme.id === t.id}
                data-testid={`theme-${t.id}`}
                onClick={() => (play('swap'), setTheme(t.id))}
              >
                <span className="swatch-dot" style={{ background: t.walls }} aria-hidden="true" />
                {t.name}
              </button>
            ))}
          </div>
          <h3 className="display" style={{ fontSize: '1.05rem', margin: '4px 0 6px' }}>
            Window view
          </h3>
          <div className="chip-row wrap" role="group" aria-label="Window view" style={{ marginBottom: 8 }}>
            {WINDOW_VIEWS.map((v) => {
              const open = viewUnlocked(v, save.progress);
              return (
                <button
                  key={v.id}
                  type="button"
                  className="chip"
                  aria-pressed={(save.home.view ?? 'harbour') === v.id}
                  aria-disabled={!open}
                  data-testid={`view-${v.id}`}
                  data-locked={!open}
                  onClick={() => {
                    if (open) {
                      play('swap');
                      setHomeView(v.id);
                    } else {
                      play('soft');
                      showToast(`To open ${v.name}: ${v.hint}`, 'sparkle');
                    }
                  }}
                >
                  {open ? v.name : `${v.name} (locked)`}
                </button>
              );
            })}
          </div>
        </Sheet>
      )}
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
