// Petal Park (game-systems §21, §22): a hub with two things to play. Picnic Pairs is a memory game; the
// Bandstand has a piano with a song book. No timers; nothing is taken away.
import { useEffect, useRef, useState } from 'react';
import { ParkBackdrop } from '../art/scenes/Park';
import { StickerArt } from '../art/stickers';
import { BOARDS, deal, isMatch, SHARP_BONUS, sharp, type Symbol } from '../game/pairs';
import { KEY_FREQ, KEY_NAMES, KEYS, press, SONG_PAY, SONGS, type Song } from '../game/piano';
import { play, playNote } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

type Mode = 'hub' | 'pairs' | 'piano';

const SYMBOL_COLOR: Record<Symbol, string> = {
  cupcake: '#FF9EC4',
  flower: '#FFC94A',
  star: '#B692F6',
  burger: '#FF8A65',
  pancake: '#E9A956',
  music: '#5BB8F0',
};
const KEY_COLORS = ['#FF7BA9', '#FF8A65', '#FFC94A', '#7ED6A7', '#5BB8F0', '#B692F6', '#C94C8A', '#FF7BA9'];

export function ParkScene() {
  const setScene = useGame((s) => s.setScene);
  const [mode, setMode] = useState<Mode>('hub');
  const back = () => (mode === 'hub' ? setScene('town') : setMode('hub'));
  return (
    <section className="scene" aria-label="Petal Park" style={{ background: '#CDEBFF' }}>
      <div className="scene-art">
        <ParkBackdrop />
      </div>
      <ActivityBar title={mode === 'pairs' ? 'Picnic Pairs' : mode === 'piano' ? 'Bandstand' : 'Petal Park'} onBack={back} />
      {mode === 'hub' && <Hub onPick={setMode} />}
      {mode === 'pairs' && <Pairs />}
      {mode === 'piano' && <Piano />}
    </section>
  );
}

function Hub({ onPick }: { onPick: (m: Mode) => void }) {
  const park = useGame((s) => s.save.progress.park);
  return (
    <div style={{ flex: 1, display: 'grid', alignContent: 'end', gap: 12, padding: 16, position: 'relative', zIndex: 3 }}>
      <button type="button" className="shop-tile park-tile" data-testid="park-pairs" onClick={() => (play('chime'), onPick('pairs'))}>
        <span className="park-icon">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <StickerArt motif="cards" color="#7ED6A7" />
          </svg>
        </span>
        <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
          <b style={{ fontSize: '1.2rem' }}>Picnic Pairs</b>
          <span>Find the matching cards. {park.games === 0 ? 'New!' : `Played ${park.games}×`}</span>
        </span>
      </button>
      <button type="button" className="shop-tile park-tile" data-testid="park-piano" onClick={() => (play('chime'), onPick('piano'))}>
        <span className="park-icon">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <StickerArt motif="music" color="#8EC9FF" />
          </svg>
        </span>
        <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
          <b style={{ fontSize: '1.2rem' }}>Bandstand Piano</b>
          <span>
            Play songs and tunes. {park.songs.length} of {SONGS.length} songs learned.
          </span>
        </span>
      </button>
    </div>
  );
}

function Pairs() {
  const [level, setLevel] = useState<number | null>(null);
  if (level === null)
    return (
      <div style={{ flex: 1, display: 'grid', alignContent: 'end', gap: 10, padding: 16, position: 'relative', zIndex: 3 }}>
        <p className="panel" style={{ margin: 0, textAlign: 'center', fontWeight: 800 }}>
          Pick a board size
        </p>
        {BOARDS.map((b, i) => (
          <Button key={i} tone={i === 0 ? 'primary' : undefined} onClick={() => (play('pop'), setLevel(i))} testId={`pairs-level-${i}`}>
            {b.pairs} pairs: {b.pay} coins
          </Button>
        ))}
      </div>
    );
  return <PairsGame key={level} level={level} onChange={() => setLevel(null)} />;
}

function PairsGame({ level, onChange }: { level: number; onChange: () => void }) {
  const games = useGame((s) => s.save.progress.park.games);
  const pairsDone = useGame((s) => s.pairsDone);
  const [game, setGame] = useState(() => games + 1);
  const cards = useRef<Symbol[]>([]);
  cards.current = deal(level, game);
  const [up, setUp] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [earned, setEarned] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const board = BOARDS[level];
  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  const flip = (i: number) => {
    if (earned !== null || matched.includes(i) || up.includes(i)) return;
    // A third tap while a mismatch is showing just turns the pair back over first.
    let current = up;
    if (up.length === 2) {
      if (timer.current) window.clearTimeout(timer.current);
      current = [];
    }
    play('pop');
    const next = [...current, i];
    setUp(next);
    if (next.length < 2) return;
    const [a, b] = next;
    if (isMatch(cards.current, a, b)) {
      const done = [...matched, a, b];
      timer.current = window.setTimeout(() => {
        play('chime');
        setMatched(done);
        setUp([]);
        if (done.length === cards.current.length) setEarned(pairsDone(level, misses));
      }, 450);
    } else {
      setMisses((m) => m + 1);
      timer.current = window.setTimeout(() => (play('soft'), setUp([])), 950);
    }
  };

  const again = () => {
    setGame((g) => g + 1);
    setUp([]);
    setMatched([]);
    setMisses(0);
    setEarned(null);
  };

  return (
    <>
      <div
        className="pairs-wrap"
        style={{ position: 'relative', zIndex: 3, flex: 1, display: 'grid', placeItems: 'center', padding: '8px 16px' }}
      >
        <div
          className="pairs-grid"
          style={{ gridTemplateColumns: `repeat(${board.cols}, 1fr)` }}
          data-testid="pairs-board"
          data-cols={board.cols}
        >
          {cards.current.map((sym, i) => {
            const shown = up.includes(i) || matched.includes(i);
            return (
              <button
                key={i}
                type="button"
                className="pair-card"
                data-shown={shown}
                data-matched={matched.includes(i)}
                data-symbol={sym}
                data-testid={`card-${i}`}
                aria-label={shown ? `Card ${i + 1}: ${sym}` : `Card ${i + 1}, face down`}
                onClick={() => flip(i)}
              >
                {shown ? (
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <StickerArt motif={sym} color={SYMBOL_COLOR[sym]} />
                  </svg>
                ) : (
                  <Icon name="sparkle" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p
        className="panel"
        style={{ position: 'relative', zIndex: 3, margin: '0 12px 8px', textAlign: 'center', fontWeight: 800 }}
        data-testid="pairs-status"
      >
        {matched.length / 2} of {board.pairs} pairs found
      </p>
      {earned !== null && (
        <div className="card-center card-low" role="dialog" aria-label="Picnic Pairs complete">
          <div className="panel pop-in" data-testid="pairs-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              All pairs found!
            </p>
            <p
              style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}
              data-testid="pairs-coins"
            >
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              {sharp(level, misses) ? `Sharp eyes bonus +${SHARP_BONUS}! ` : ''}Your flowers grew too!
            </p>
            <Button tone="primary" onClick={again} testId="pairs-again">
              Play again
            </Button>
            <Button onClick={onChange} testId="pairs-other">
              Pick another size
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Piano() {
  const songDone = useGame((s) => s.songDone);
  const learned = useGame((s) => s.save.progress.park.songs);
  const [song, setSong] = useState<Song | null>(null);
  const [played, setPlayed] = useState(0);
  const [slip, setSlip] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [won, setWon] = useState<{ song: Song; coins: number } | null>(null);

  const choose = (s: Song | null) => {
    play('swap');
    setSong(s);
    setPlayed(0);
    setSlip(null);
    setWon(null);
  };

  const hit = (k: number) => {
    playNote(KEY_FREQ[k]);
    setPressed(k);
    window.setTimeout(() => setPressed(null), 180);
    if (!song) return;
    const r = press(song, played, k);
    if (!r.ok) {
      setSlip(r.expected);
      return;
    }
    setSlip(null);
    if (r.done) {
      play('chime');
      setWon({ song, coins: songDone(song.id) });
      setPlayed(0);
    } else setPlayed(played + 1);
  };

  const next = song ? song.notes[played] : null;
  return (
    <>
      <div style={{ position: 'relative', zIndex: 3, flex: 1, display: 'grid', alignContent: 'end', gap: 8, padding: '0 12px 8px' }}>
        <p className="panel" style={{ margin: 0, textAlign: 'center', fontWeight: 800 }} data-testid="piano-line">
          {!song
            ? 'Free play! Tap the keys, or pick a song.'
            : slip !== null
              ? `Try the glowing key: ${KEY_NAMES[slip]}.`
              : `${song.name}: note ${played + 1} of ${song.notes.length}`}
        </p>
        <div className="chip-row wrap" role="group" aria-label="Songs" style={{ justifyContent: 'center' }}>
          <button type="button" className="chip" aria-pressed={!song} data-testid="song-free" onClick={() => choose(null)}>
            Free play
          </button>
          {SONGS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              aria-pressed={song?.id === s.id}
              data-testid={`song-${s.id}`}
              onClick={() => choose(s)}
            >
              {s.name}
              {learned.includes(s.id) ? ' ✓' : ''}
            </button>
          ))}
        </div>
      </div>
      <div className="piano" role="group" aria-label="Piano keys" data-testid="piano" data-next={next ?? ''}>
        {Array.from({ length: KEYS }, (_, k) => (
          <button
            key={k}
            type="button"
            className="piano-key"
            style={{ background: KEY_COLORS[k] }}
            data-glow={next === k || slip === k}
            data-pressed={pressed === k}
            data-testid={`key-${k}`}
            aria-label={`Key ${KEY_NAMES[k]}${k === 7 ? ' high' : ''}`}
            onClick={() => hit(k)}
          >
            {KEY_NAMES[k]}
          </button>
        ))}
      </div>
      {won && (
        <div className="card-center card-low" role="dialog" aria-label="Song complete">
          <div className="panel pop-in" data-testid="song-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              You played {won.song.name}!
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {won.coins >= SONG_PAY ? `+${won.coins} coins (first time!)` : `+${won.coins} coins. Beautiful again!`}
            </p>
            <Button tone="primary" onClick={() => setWon(null)} testId="song-ok">
              Keep playing
            </Button>
          </div>
        </div>
      )}
      <span hidden data-testid="song-pay">
        {SONG_PAY}
      </span>
    </>
  );
}
