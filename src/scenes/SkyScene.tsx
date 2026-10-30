// Starlight Hill (game-systems §30): tap the numbered stars in order to draw a constellation. A wrong star
// only wobbles; after two misses the next star glows. Any shape is a finished picture, nothing is lost.
import { useEffect, useRef, useState } from 'react';
import { SkyArt } from '../art/scenes/Explore';
import { CONSTELLATION_NAMES } from '../content/explore';
import { CONSTELLATIONS, STAR_FIRST, STAR_PAY } from '../game/explore';
import { play, playNote } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

const NOTES = [262, 294, 330, 349, 392, 440, 494, 523, 587];

export function SkyScene() {
  const done = useGame((s) => s.save.progress.sky.done);
  const first = CONSTELLATIONS.find((c) => !done.includes(c.id)) ?? CONSTELLATIONS[0];
  const [pick, setPick] = useState(first.id);
  const [round, setRound] = useState(0);
  return <SkyRound key={`${pick}-${round}`} id={pick} onPick={setPick} onAgain={() => setRound((r) => r + 1)} />;
}

function SkyRound({ id, onPick, onAgain }: { id: string; onPick: (id: string) => void; onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const done = useGame((s) => s.save.progress.sky.done);
  const skyDone = useGame((s) => s.skyDone);
  const c = CONSTELLATIONS.find((x) => x.id === id) ?? CONSTELLATIONS[0];
  const [next, setNext] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wobble, setWobble] = useState<number | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const paid = useRef(false);
  const finished = next >= c.stars.length;

  useEffect(() => {
    if (!finished || paid.current) return;
    paid.current = true;
    setCoins(skyDone(c.id));
    play('chime');
  }, [finished, c.id, skyDone]);

  const tapStar = (i: number) => {
    if (finished) return;
    if (i === next) {
      playNote(NOTES[i % NOTES.length]);
      setNext(next + 1);
      setMisses(0);
    } else if (i > next) {
      play('soft');
      setMisses(misses + 1);
      setWobble(i);
      window.setTimeout(() => setWobble(null), 500);
    }
  };

  const pts = c.stars.map(([x, y]) => `${x},${y}`);
  const drawn = c.stars.slice(0, next);
  return (
    <section className="scene" aria-label="Starlight Hill" style={{ background: '#2F2A6B' }}>
      <div className="scene-art">
        <SkyArt />
      </div>
      <ActivityBar title="Starlight Hill" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="sky-progress">
          {Math.min(next, c.stars.length)}/{c.stars.length}
        </span>
      </ActivityBar>
      <div className="sky-picks" role="group" aria-label="Constellations">
        {CONSTELLATIONS.map((k) => (
          <button
            key={k.id}
            type="button"
            className="sky-pick"
            aria-pressed={k.id === c.id}
            data-testid={`sky-pick-${k.id}`}
            onClick={() => (play('pop'), onPick(k.id))}
          >
            {done.includes(k.id) ? '✓ ' : ''}
            {CONSTELLATION_NAMES[k.id]}
          </button>
        ))}
      </div>
      <p
        className="panel"
        role="status"
        style={{ margin: '0 12px', textAlign: 'center', fontWeight: 800, position: 'relative', zIndex: 2 }}
        data-testid="sky-note"
      >
        {finished
          ? `A ${CONSTELLATION_NAMES[c.id]}! Beautiful!`
          : misses >= 2
            ? `Look for the glowing star: number ${next + 1}`
            : `Tap star number ${next + 1}`}
      </p>
      <div className="sky-stage" data-testid="sky-stage" data-done={finished}>
        <svg viewBox="0 0 100 100" className="sky-lines" aria-hidden="true">
          {drawn.slice(1).map(([x, y], i) => (
            <line key={i} x1={drawn[i][0]} y1={drawn[i][1]} x2={x} y2={y} stroke="#FFE08A" strokeWidth={1.6} strokeLinecap="round" />
          ))}
          {finished && c.closed && (
            <line
              x1={c.stars[c.stars.length - 1][0]}
              y1={c.stars[c.stars.length - 1][1]}
              x2={c.stars[0][0]}
              y2={c.stars[0][1]}
              stroke="#FFE08A"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          )}
          {misses >= 2 && !finished && next > 0 && (
            <line
              x1={c.stars[next - 1][0]}
              y1={c.stars[next - 1][1]}
              x2={c.stars[next][0]}
              y2={c.stars[next][1]}
              stroke="#FFFFFF"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.7}
            />
          )}
        </svg>
        {c.stars.map(([x, y], i) => (
          <button
            key={`${c.id}${pts[i]}`}
            type="button"
            className="sky-star"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`Star ${i + 1}`}
            data-testid={`star-${i}`}
            data-lit={i < next}
            data-glow={misses >= 2 && i === next}
            data-wobble={wobble === i}
            onClick={() => tapStar(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {coins !== null && (
        <div className="card-center card-low" role="dialog" aria-label="Constellation complete">
          <div className="panel pop-in" data-testid="sky-done" style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
            <p className="display" style={{ fontSize: '1.5rem', margin: 0 }}>
              {CONSTELLATION_NAMES[c.id]} drawn!
            </p>
            <p
              style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}
              data-testid="sky-coins"
            >
              <Icon name="coin" />+{coins} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              {STAR_PAY} each time, +{STAR_FIRST} the first time for each shape. Your flowers grew too!
            </p>
            <Button tone="primary" onClick={onAgain} testId="sky-again">
              Draw it again
            </Button>
            <Button onClick={() => setScene('town')} testId="sky-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
