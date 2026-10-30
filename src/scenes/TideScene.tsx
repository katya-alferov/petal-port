// Tide Pools (game-systems §30): turn over the rocks to find the four creatures on your list. Rocks hide
// the list, two other creatures and some bare sand. Nothing is ever lost; a visit always ends in a find.
import { useEffect, useMemo, useRef, useState } from 'react';
import { CreatureArt, RockArt } from '../art/scenes/Explore';
import { CREATURE_NAMES } from '../content/explore';
import { CREATURE_IDS, ROCKS, TARGETS, tidePools } from '../game/explore';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

export function TideScene() {
  const [visit, setVisit] = useState(0);
  return <TideVisit key={visit} onAgain={() => setVisit((v) => v + 1)} />;
}

function TideVisit({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const td = useGame((s) => s.save.progress.tide);
  const tideDone = useGame((s) => s.tideDone);
  const [visitNo] = useState(() => td.visits + 1);
  const [have] = useState(() => td.found);
  const pools = useMemo(() => tidePools(visitNo, have), [visitNo, have]);
  const [open, setOpen] = useState<number[]>([]);
  const [note, setNote] = useState('Tap a rock to look underneath!');
  const [coins, setCoins] = useState<number | null>(null);
  const [book, setBook] = useState(false);
  const paid = useRef(false);

  const found = open.map((i) => pools.rocks[i]).filter((c): c is string => c !== null);
  const got = pools.targets.filter((t) => found.includes(t));

  useEffect(() => {
    if (got.length < TARGETS || paid.current) return;
    paid.current = true;
    setCoins(tideDone(found));
    play('chime');
  }, [got.length, found, tideDone]);

  const peek = (i: number) => {
    if (open.includes(i) || coins !== null) return;
    const c = pools.rocks[i];
    setOpen([...open, i]);
    if (c === null) {
      play('soft');
      setNote('Just sand. Try another rock!');
    } else if (pools.targets.includes(c)) {
      play('chime');
      setNote(`Found a ${CREATURE_NAMES[c]}!`);
    } else {
      play('pop');
      setNote(`Hello, ${CREATURE_NAMES[c]}! Not on your list, but nice to meet you.`);
    }
  };

  return (
    <section className="scene" aria-label="Tide Pools" style={{ background: 'linear-gradient(#BDEBF0, #F6E3B8 70%)' }}>
      <ActivityBar title="Tide Pools" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="tide-progress">
          {got.length}/{TARGETS}
        </span>
      </ActivityBar>
      <div className="panel tide-list" data-testid="tide-list" style={{ margin: '0 12px' }}>
        <b>Find:</b>
        {pools.targets.map((t) => (
          <span key={t} className="tide-want" data-found={got.includes(t)} data-testid={`tide-want-${t}`}>
            <CreatureArt id={t} />
            <span>{got.includes(t) ? '✓' : CREATURE_NAMES[t]}</span>
          </span>
        ))}
      </div>
      <div className="tide-grid" data-testid="tide-grid">
        {Array.from({ length: ROCKS }, (_, i) => (
          <button
            key={i}
            type="button"
            className="tide-rock"
            aria-label={open.includes(i) ? `Rock ${i + 1}, looked` : `Rock ${i + 1}`}
            data-testid={`rock-${i}`}
            data-open={open.includes(i)}
            data-under={open.includes(i) ? (pools.rocks[i] ?? 'sand') : undefined}
            onClick={() => peek(i)}
          >
            <RockArt open={open.includes(i)} under={pools.rocks[i]} />
          </button>
        ))}
      </div>
      <p className="panel" role="status" style={{ margin: '0 12px', textAlign: 'center', fontWeight: 800 }} data-testid="tide-note">
        {note}
      </p>
      <div style={{ flex: 1 }} />
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={() => (play('pop'), setBook(true))} testId="tide-book" icon="album">
            My finds
          </Button>
        </div>
      </div>
      {coins !== null && (
        <div className="card-center card-low" role="dialog" aria-label="Tide pool visit complete">
          <div className="panel pop-in" data-testid="tide-done" style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
            <p className="display" style={{ fontSize: '1.5rem', margin: 0 }}>
              You found them all!
            </p>
            <p
              style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}
              data-testid="tide-coins"
            >
              <Icon name="coin" />+{coins} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>12 for the visit, +4 for each new creature. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="tide-again">
              Explore again
            </Button>
            <Button onClick={() => setScene('town')} testId="tide-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
      {book && (
        <Sheet title={`My finds: ${[...new Set([...td.found, ...found])].length} of ${CREATURE_IDS.length}`} onClose={() => setBook(false)}>
          <div className="tank-grid" data-testid="tide-book-grid">
            {CREATURE_IDS.map((c) => {
              const have$ = td.found.includes(c) || found.includes(c);
              return (
                <div key={c} className="tank-cell" data-have={have$} data-testid={`finds-${c}`}>
                  <div
                    style={{
                      width: '100%',
                      height: 48,
                      filter: have$ ? undefined : 'grayscale(1) brightness(0.55)',
                      opacity: have$ ? 1 : 0.45,
                    }}
                  >
                    <CreatureArt id={c} />
                  </div>
                  <span>{have$ ? CREATURE_NAMES[c] : '?'}</span>
                </div>
              );
            })}
          </div>
        </Sheet>
      )}
    </section>
  );
}
