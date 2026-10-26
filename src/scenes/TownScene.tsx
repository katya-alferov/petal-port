import { useEffect, useRef, useState } from 'react';
import { MAP_H, PLACE_Y, TownMap, type PlaceId } from '../art/scenes/TownMap';
import { JOURNEY_COINS, JOURNEY_STEPS } from '../content/recipes';
import { WEARABLES, priceOf } from '../content/wearables';
import { play } from '../platform/audio';
import { useGame, type SceneId } from '../state/store';
import { Button, IconButton, Sheet } from '../ui/kit';
import { MainDock, TopBar } from './common';

const PLACES: Record<PlaceId, { name: string; line: string; go?: SceneId; soon?: string }> = {
  boutique: { name: 'Ribbon Boutique', line: 'New clothes and things for your home. Try them on first!', go: 'boutique' },
  cafe: { name: 'Sunny Café', line: 'Make drinks for customers and earn coins.', go: 'cafe' },
  home: { name: 'Harbour Loft', line: 'Your cozy home. Cook, decorate and relax.', go: 'home' },
  airport: { name: 'Airport', line: 'Fly to faraway places and take photos.', soon: 'Paris trips are coming soon!' },
  park: { name: 'Petal Park', line: 'The ducks say quack! Picnics are coming soon.', soon: 'Picnics are coming soon!' },
  cottage: { name: 'Meadow Cottage', line: 'Your neighbour’s cottage on the hill.', soon: 'Nobody is home right now.' },
};

let lastScroll: number | null = null;

export function TownScene() {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const coins = useGame((s) => s.save.wallet.coins);
  const owned = useGame((s) => s.save.inventory.owned);
  const [open, setOpen] = useState<PlaceId | null>(null);
  const [journey, setJourney] = useState(false);
  const journeyDone = useGame((s) => s.save.progress.journey);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // First visit centers on Home (§5.1); later visits keep where the player was.
    el.scrollTop = lastScroll ?? (PLACE_Y.home / MAP_H) * el.scrollHeight - el.clientHeight / 2;
    return () => {
      lastScroll = el.scrollTop;
    };
  }, []);

  const affordableNew = WEARABLES.some((w) => !owned[w.id] && (priceOf(w) ?? Infinity) <= coins);
  const place = open ? PLACES[open] : null;

  return (
    <section className="scene" aria-label="Town" style={{ background: '#A5DDB4' }}>
      <div ref={scroller} className="map-scroll" data-testid="map-scroll">
        <TownMap
          badges={{ cafe: 'coin', boutique: affordableNew ? 'new' : undefined }}
          onTap={(id) => {
            play('pop');
            setOpen(id);
          }}
          onCat={() => {
            play('chime');
            showToast('Mrrrow! The cat likes you.', 'sparkle');
          }}
        />
      </div>
      <TopBar title="Petalport" />
      <div style={{ position: 'relative', zIndex: 5, padding: '0 12px', alignSelf: 'flex-start' }}>
        <IconButton icon="album" label="Welcome Journey" onClick={() => (play('pop'), setJourney(true))} testId="journey-open" />
      </div>
      <div style={{ flex: 1 }} />
      <MainDock current="town" />
      {journey && (
        <Sheet title="Welcome Journey" onClose={() => setJourney(false)}>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 8 }} data-testid="journey-list">
            {JOURNEY_STEPS.map((st) => {
              const done = journeyDone.includes(st.id);
              return (
                <li
                  key={st.id}
                  className="panel"
                  style={{ padding: '8px 12px', display: 'flex', gap: 10, alignItems: 'center', background: done ? '#DFF5EC' : '#fff' }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{done ? '✅' : '⬜'}</span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{st.label}</span>
                  <span style={{ fontWeight: 800 }}>{done ? 'Done!' : `+${JOURNEY_COINS}`}</span>
                </li>
              );
            })}
          </ul>
          <p style={{ margin: 0 }}>Do them in any order. There’s no rush!</p>
        </Sheet>
      )}
      {place && open && (
        <Sheet title={place.name} onClose={() => setOpen(null)}>
          <p style={{ marginBottom: 16 }}>{place.line}</p>
          <Button
            tone="primary"
            testId="place-go"
            disabledReason={place.soon}
            onClick={() => {
              play('chime');
              setOpen(null);
              if (place.go) setScene(place.go);
            }}
          >
            Go!
          </Button>
        </Sheet>
      )}
    </section>
  );
}
