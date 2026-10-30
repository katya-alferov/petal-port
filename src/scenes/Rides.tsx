// The interactive rides inside the attractions (game-systems §31). Every ride is kind: a miss only says
// "try again", and a ride always ends with a stamp. Nothing here takes coins away.
import { useEffect, useRef, useState } from 'react';
import { BellRide, BurstArt, CarouselRide, FountainRide, WheelRide } from '../art/scenes/Attractions';
import { LIGHT_COLORS, LIGHT_NAMES, LIGHT_NOTES, RIDE_TEXT, WISHES } from '../content/trips';
import { inZone, LIGHT_ROUNDS, LIGHTS, lightSequence, markerAt, rightLight, STOP_ROUNDS, zoneStart } from '../game/trips';
import { play, playNote } from '../platform/audio';
import { TEST_HOOKS_ENABLED } from '../platform/hooks';
import { Button } from '../ui/kit';

const HIT_WORDS = ['Got it!', 'Perfect!', 'Wow!', 'Yes!', 'Super!'];

/** Seed for a ride: the same ride is always the same set of rounds. */
const seedOf = (key: string) => [...key].reduce((n, c) => n * 31 + c.charCodeAt(0), 7) % 100000;

// ---- Stop rides: carousel ring, big wheel photo, strong bell ----------------------------------------------

export function StopRide({ rideKey, onDone }: { rideKey: string; onDone: (hits: number) => void }) {
  const kind = rideKey.split('.')[1] as 'carousel' | 'wheel' | 'bell';
  const seed = seedOf(rideKey);
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [phase, setPhase] = useState<'play' | 'show'>('play');
  const [ok, setOk] = useState<boolean | null>(null);
  const [frozen, setFrozen] = useState(0);
  const [m, setM] = useState(0);
  const [log, setLog] = useState<boolean[]>([]);
  const start = useRef(performance.now());
  const zone = zoneStart(seed, round);

  useEffect(() => {
    if (phase !== 'play') return;
    start.current = performance.now();
    let raf = 0;
    const tick = () => {
      setM(markerAt((performance.now() - start.current) / 1000));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, round]);

  const go = () => {
    if (phase !== 'play') return;
    const at = markerAt((performance.now() - start.current) / 1000);
    const hit = inZone(at, zone);
    setFrozen(at);
    setOk(hit);
    setPhase('show');
    setLog([...log, hit]);
    const nextHits = hits + (hit ? 1 : 0);
    if (hit) {
      setHits(nextHits);
      playNote(LIGHT_NOTES[Math.min(3, nextHits - 1)]);
      play('chime');
    } else play('soft');
    window.setTimeout(() => {
      if (round + 1 >= STOP_ROUNDS) {
        onDone(nextHits);
        return;
      }
      setRound(round + 1);
      setOk(null);
      setPhase('play');
    }, 950);
  };

  const shown = phase === 'show' ? frozen : m;
  const Art = kind === 'carousel' ? CarouselRide : kind === 'wheel' ? WheelRide : BellRide;
  const t = RIDE_TEXT[rideKey];
  return (
    <div className="ride" data-testid="stop-ride" data-kind={kind}>
      <div
        className="ride-art"
        style={{ maxWidth: kind === 'bell' ? 240 : 380 }}
        data-testid="ride-stage"
        data-inzone={TEST_HOOKS_ENABLED && phase === 'play' ? String(inZone(shown, zone)) : undefined}
      >
        <Art m={shown} zone={zone} ok={ok} />
      </div>
      <div className="ride-dots" aria-label={`Round ${Math.min(round + 1, STOP_ROUNDS)} of ${STOP_ROUNDS}`} data-testid="ride-round">
        {Array.from({ length: STOP_ROUNDS }, (_, i) => (
          <span key={i} className="ride-dot" data-state={log[i] === undefined ? (i === round ? 'now' : 'todo') : log[i] ? 'hit' : 'miss'} />
        ))}
      </div>
      <p className="panel ride-status" role="status" data-testid="ride-status">
        {ok === null ? t.how : ok ? HIT_WORDS[(round + hits) % HIT_WORDS.length] : 'So close! The next one is yours.'}
      </p>
      <div className="ride-foot">
        <Button tone="primary" icon="star" onClick={go} testId="ride-go">
          {t.go}
        </Button>
      </div>
    </div>
  );
}

// ---- Light rides: fireworks and neon lights -----------------------------------------------------------------

export function LightsRide({ rideKey, onDone }: { rideKey: string; onDone: () => void }) {
  const seed = seedOf(rideKey);
  const [round, setRound] = useState(0);
  const [mode, setMode] = useState<'watch' | 'play' | 'cheer'>('watch');
  const [lit, setLit] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [note, setNote] = useState('Watch the lights…');
  const [burst, setBurst] = useState<number | null>(null);
  const [replay, setReplay] = useState(0);
  const timers = useRef<number[]>([]);
  const seq = lightSequence(seed, round);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    setMode('watch');
    setStep(0);
    setNote('Watch the lights…');
    seq.forEach((l, i) => {
      later(700 + i * 800, () => {
        setLit(l);
        setBurst(l);
        playNote(LIGHT_NOTES[l]);
      });
      later(700 + i * 800 + 500, () => {
        setLit(null);
        setBurst(null);
      });
    });
    later(700 + seq.length * 800, () => {
      setMode('play');
      setNote('Your turn! Tap them in the same order.');
    });
    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      setLit(null);
      setBurst(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, replay]);

  const tapLight = (l: number) => {
    if (mode !== 'play') return;
    playNote(LIGHT_NOTES[l]);
    setLit(l);
    setBurst(l);
    later(350, () => {
      setLit(null);
      setBurst(null);
    });
    if (!rightLight(seq, step, l)) {
      play('soft');
      setNote('Oops! Let’s watch again.');
      later(900, () => setReplay((n) => n + 1));
      setMode('watch');
      return;
    }
    if (step + 1 >= seq.length) {
      setMode('cheer');
      play('chime');
      setNote(round + 1 >= LIGHT_ROUNDS ? 'You did it! What a show!' : 'Wonderful! A longer one next…');
      later(1300, () => {
        if (round + 1 >= LIGHT_ROUNDS) onDone();
        else setRound(round + 1);
      });
      return;
    }
    setStep(step + 1);
  };

  const t = RIDE_TEXT[rideKey];
  return (
    <div className="ride" data-testid="lights-ride" data-mode={mode}>
      <div className="ride-art" data-testid="lights-stage" data-seq={TEST_HOOKS_ENABLED ? seq.join(',') : undefined}>
        <BurstArt
          color={burst === null ? (mode === 'cheer' ? '#FFC94A' : null) : LIGHT_COLORS[burst]}
          active={burst !== null || mode === 'cheer'}
        />
      </div>
      <div className="ride-dots" aria-label={`Round ${round + 1} of ${LIGHT_ROUNDS}`} data-testid="ride-round">
        {Array.from({ length: LIGHT_ROUNDS }, (_, i) => (
          <span key={i} className="ride-dot" data-state={i < round ? 'hit' : i === round ? 'now' : 'todo'} />
        ))}
      </div>
      <p className="panel ride-status" role="status" data-testid="lights-status">
        {mode === 'watch' && lit === null && step === 0 && note === 'Watch the lights…' ? t.how : note}
      </p>
      <div className="pads" role="group" aria-label="Lights">
        {Array.from({ length: LIGHTS }, (_, l) => (
          <button
            key={l}
            type="button"
            className="pad"
            style={{ background: LIGHT_COLORS[l] }}
            data-lit={lit === l}
            aria-label={`${LIGHT_NAMES[l]} light`}
            aria-disabled={mode !== 'play'}
            data-testid={`pad-${l}`}
            onClick={() => tapLight(l)}
          >
            <span aria-hidden="true">{['★', '♥', '●', '◆'][l]}</span>
          </button>
        ))}
      </div>
      <div className="ride-foot">
        <Button onClick={() => (play('pop'), setReplay((n) => n + 1))} testId="lights-replay" icon="wave">
          Watch again
        </Button>
      </div>
    </div>
  );
}

// ---- The wishing fountain ----------------------------------------------------------------------------------

const COINS = ['#FFC94A', '#C9D6E8', '#E8A66A'];

export function WishRide({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'pick' | 'toss' | 'wish'>('pick');
  const [coin, setCoin] = useState<number | null>(null);
  const [wished, setWished] = useState<number | null>(null);
  const t = RIDE_TEXT['storybook.fountain'];
  return (
    <div className="ride" data-testid="wish-ride" data-phase={phase}>
      <div className="ride-art" data-testid="ride-stage">
        <FountainRide phase={phase} />
      </div>
      <p className="panel ride-status" role="status" data-testid="wish-status">
        {phase === 'pick'
          ? coin === null
            ? t.how
            : 'A lovely coin! Now toss it in.'
          : phase === 'toss'
            ? 'Plop! Watch the ripples…'
            : wished === null
              ? 'Close your eyes and make a wish!'
              : `Your wish: ${WISHES[wished]}. ✨`}
      </p>
      {phase === 'pick' && (
        <div className="coin-row" role="group" aria-label="Coins">
          {COINS.map((c, i) => (
            <button
              key={c}
              type="button"
              className="coin-pick"
              aria-pressed={coin === i}
              aria-label={`Coin ${i + 1}`}
              data-testid={`coin-${i}`}
              style={{ background: c }}
              onClick={() => (play('pop'), setCoin(i))}
            />
          ))}
        </div>
      )}
      {phase === 'wish' && (
        <div className="wish-row" role="group" aria-label="Wishes">
          {WISHES.map((w, i) => (
            <button
              key={w}
              type="button"
              className="wish-card"
              aria-pressed={wished === i}
              data-testid={`wish-${i}`}
              onClick={() => {
                if (wished !== null) return;
                play('chime');
                setWished(i);
                window.setTimeout(onDone, 1300);
              }}
            >
              {w}
            </button>
          ))}
        </div>
      )}
      <div className="ride-foot">
        {phase === 'pick' && (
          <Button
            tone="primary"
            icon="coin"
            disabledReason={coin === null ? 'Pick a coin first!' : undefined}
            onClick={() => {
              play('pop');
              setPhase('toss');
              window.setTimeout(() => {
                play('chime');
                setPhase('wish');
              }, 1100);
            }}
            testId="wish-toss"
          >
            Toss it in!
          </Button>
        )}
      </div>
    </div>
  );
}
