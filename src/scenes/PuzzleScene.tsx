// Puzzle Shop (game-systems §25): pick a picture and a size, then tap two pieces to swap them until the
// picture is whole. Pieces in the right place get a green rim. No timer, nothing taken away.
import { useRef, useState } from 'react';
import { PuzzleArt, PuzzlePiece } from '../art/scenes/Puzzle';
import { PUZZLE_NAMES } from '../content/studio';
import { PUZZLES, puzzlePay, shuffle, SIZES, solved, swap } from '../game/puzzle';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

export function PuzzleScene() {
  const setScene = useGame((s) => s.setScene);
  const done = useGame((s) => s.save.progress.puzzle.done);
  const [pic, setPic] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const back = () => (size !== null ? setSize(null) : pic ? setPic(null) : setScene('town'));

  return (
    <section className="scene" aria-label="Puzzle Shop" style={{ background: 'linear-gradient(#E6F3FF, #FFF1D8)' }}>
      <ActivityBar title="Puzzle Shop" onBack={back} />
      {!pic && (
        <div style={{ padding: 16, display: 'grid', gap: 12, alignContent: 'start' }}>
          <h2 className="display" style={{ fontSize: '1.5rem' }}>
            Pick a puzzle
          </h2>
          {PUZZLES.map((p) => (
            <button
              key={p}
              type="button"
              className="shop-tile park-tile"
              style={{ gridTemplateColumns: '84px 1fr' }}
              data-testid={`puzzle-${p}`}
              onClick={() => (play('chime'), setPic(p))}
            >
              <span className="park-icon" style={{ width: 76, height: 76 }}>
                <svg viewBox="0 0 300 300" aria-hidden="true" style={{ width: '100%', height: '100%', borderRadius: 12 }}>
                  <PuzzleArt id={p} />
                </svg>
              </span>
              <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
                <b style={{ fontSize: '1.2rem' }}>{PUZZLE_NAMES[p]}</b>
                <span>{SIZES.filter((_, i) => done.includes(`${p}-${i}`)).length} of 3 sizes done</span>
              </span>
            </button>
          ))}
        </div>
      )}
      {pic && size === null && (
        <div style={{ padding: 16, display: 'grid', gap: 10, alignContent: 'start' }}>
          <p className="panel" style={{ margin: 0, textAlign: 'center', fontWeight: 800 }}>
            How many pieces?
          </p>
          {SIZES.map((s, i) => (
            <Button key={i} tone={i === 0 ? 'primary' : undefined} onClick={() => (play('pop'), setSize(i))} testId={`puzzle-size-${i}`}>
              {s.cols * s.rows} pieces: {s.pay} coins {done.includes(`${pic}-${i}`) ? '✓' : ''}
            </Button>
          ))}
        </div>
      )}
      {pic && size !== null && <Board key={`${pic}${size}`} pic={pic} size={size} onBack={() => setSize(null)} />}
    </section>
  );
}

function Board({ pic, size, onBack }: { pic: string; size: number; onBack: () => void }) {
  const games = useGame((s) => s.save.progress.puzzle.games);
  const puzzleDone = useGame((s) => s.puzzleDone);
  const { cols, rows } = SIZES[size];
  const [order, setOrder] = useState(() => shuffle(size, games + 1));
  const [sel, setSel] = useState<number | null>(null);
  const [earned, setEarned] = useState<number | null>(null);
  const paid = useRef(false);

  const tap = (slot: number) => {
    if (earned !== null) return;
    if (sel === null) {
      play('pop');
      setSel(slot);
      return;
    }
    if (sel === slot) {
      setSel(null);
      return;
    }
    play('swap');
    const next = swap(order, sel, slot);
    setOrder(next);
    setSel(null);
    if (solved(next) && !paid.current) {
      paid.current = true;
      play('chime');
      setEarned(puzzleDone(pic, size));
    }
  };

  const right = order.filter((v, i) => v === i).length;
  return (
    <>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', padding: '4px 16px' }}>
        <div
          className="puzzle-grid"
          data-testid="puzzle-board"
          data-order={JSON.stringify(order)}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, aspectRatio: `${cols} / ${rows}` }}
        >
          {order.map((part, slot) => (
            <button
              key={slot}
              type="button"
              className="puzzle-piece"
              data-selected={sel === slot}
              data-right={part === slot}
              data-testid={`slot-${slot}`}
              aria-label={`Piece ${slot + 1}${part === slot ? ', in the right place' : ''}`}
              aria-pressed={sel === slot}
              onClick={() => tap(slot)}
            >
              <PuzzlePiece id={pic} col={part % cols} row={Math.floor(part / cols)} cols={cols} rows={rows} />
            </button>
          ))}
        </div>
      </div>
      <p className="panel" style={{ margin: '0 12px 10px', textAlign: 'center', fontWeight: 800 }} data-testid="puzzle-status">
        {right} of {order.length} pieces in place. Tap two pieces to swap them.
      </p>
      {earned !== null && (
        <div className="card-center card-low" role="dialog" aria-label="Puzzle complete">
          <div className="panel pop-in" data-testid="puzzle-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Puzzle solved!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Your flowers grew too!</p>
            <Button tone="primary" onClick={onBack} testId="puzzle-again">
              Another puzzle
            </Button>
          </div>
        </div>
      )}
      <span hidden>{puzzlePay(size)}</span>
    </>
  );
}
