// Dance Studio (game-systems §15): the coach dances a routine, then you repeat it. No beat to hit, no
// timer. A wrong move wobbles and the coach shows the routine again; nothing is lost but that routine's tip.
import { useEffect, useRef, useState } from 'react';
import { DanceBackdrop, MoveIcon } from '../art/scenes/Dance';
import type { PoseId } from '../art/CharacterRig';
import { REGULARS } from '../content/cafe';
import { DANCE_SHIFT_BONUS, danceOrders, dancePay, MOVES, ROUTINES_PER_SHIFT, stepMove, type Move } from '../game/dance';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

const MOVE_NAME: Record<Move, string> = { wave: 'Wave', hips: 'Hips', cheer: 'Arms up', jump: 'Big jump', twirl: 'Twirl' };
const MOVE_POSE: Record<Move, PoseId> = { wave: 'wave', hips: 'hips', cheer: 'cheer', jump: 'hips', twirl: 'idle' };
const STEP_MS = 850;

type Phase = 'watch' | 'echo' | 'served';

export function DanceScene() {
  const [run, setRun] = useState(0);
  return <DanceShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function DanceShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const player = useGame((s) => s.save.player);
  const shifts = useGame((s) => s.save.progress.dance.shifts);
  const danceServed = useGame((s) => s.danceServed);
  const danceShiftDone = useGame((s) => s.danceShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const routines = useRef(danceOrders(shiftNo)).current;
  const [idx, setIdx] = useState(0);
  const routine = routines[Math.min(idx, routines.length - 1)];
  const coach = REGULARS[(shiftNo * 5 + 2) % REGULARS.length];
  const [phase, setPhase] = useState<Phase>('watch');
  const [lit, setLit] = useState(-1);
  const [coachMove, setCoachMove] = useState<Move | null>(null);
  const [mine, setMine] = useState<Move | null>(null);
  const [done, setDone] = useState(0);
  const [clean, setClean] = useState(true);
  const [oops, setOops] = useState<Move | null>(null);
  const [earned, setEarned] = useState(0);
  const [over, setOver] = useState(false);
  const [watchKey, setWatchKey] = useState(0);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  // The coach dances the routine whenever `watchKey` changes (a new routine or "Watch again").
  useEffect(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setPhase('watch');
    setDone(0);
    setLit(-1);
    routine.forEach((m, i) => {
      later(
        () => {
          play('pop');
          setLit(i);
          setCoachMove(m);
        },
        600 + i * STEP_MS,
      );
    });
    later(
      () => {
        setCoachMove(null);
        setLit(-1);
        setPhase('echo');
      },
      600 + routine.length * STEP_MS,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey, idx]);

  const dance = (m: Move) => {
    if (phase !== 'echo') return;
    setMine(m);
    later(() => setMine(null), 700);
    const r = stepMove(routine, done, m);
    if (!r.ok) {
      play('soft');
      setOops(r.expected);
      setPhase('watch');
      setClean(false);
      later(() => {
        setOops(null);
        setWatchKey((k) => k + 1);
      }, 1100);
      return;
    }
    play('swap');
    setOops(null);
    setDone(done + 1);
    if (r.done) {
      play('chime');
      setEarned((e) => e + danceServed(clean));
      later(() => setPhase('served'), 700);
    }
  };

  const next = () => {
    if (idx + 1 >= ROUTINES_PER_SHIFT) {
      setEarned((e) => e + danceShiftDone());
      setOver(true);
      play('chime');
      return;
    }
    setClean(true);
    setIdx(idx + 1);
  };

  const label = phase === 'watch' ? 'Watch the coach!' : phase === 'echo' ? 'Your turn! Repeat the moves.' : 'Great dancing!';
  return (
    <section className="scene" aria-label="Dance Studio" style={{ background: '#3A2E4F' }}>
      <div className="scene-art">
        <DanceBackdrop />
      </div>
      <ActivityBar title="Dance Studio" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="dance-progress">
          {Math.min(idx + 1, ROUTINES_PER_SHIFT)}/{ROUTINES_PER_SHIFT}
        </span>
      </ActivityBar>
      <p
        className="panel"
        style={{ margin: '0 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800, position: 'relative', zIndex: 3 }}
        data-testid="dance-line"
        data-routine={JSON.stringify(routine)}
        data-phase={phase}
      >
        {oops ? `Not that one! The coach shows it again.` : label}
      </p>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div className="dancer" data-move={coachMove ?? 'none'} style={{ left: '2%' }}>
          <Character
            appearance={coach.appearance}
            outfit={coach.outfit}
            crop="40 0 320 800"
            pose={coachMove ? MOVE_POSE[coachMove] : 'idle'}
            animate={false}
            title={`${coach.name}, the coach`}
          />
          <span className="panel dancer-tag">{coachMove ? `${MOVE_NAME[coachMove]}!` : `Coach ${coach.name}`}</span>
        </div>
        <div className="dancer" data-move={mine ?? 'none'} style={{ right: '2%' }} data-testid="dancer-you">
          <Character
            appearance={player.appearance}
            outfit={player.outfit}
            crop="40 0 320 800"
            pose={mine ? MOVE_POSE[mine] : 'idle'}
            animate={false}
            title="You"
          />
          <span className="panel dancer-tag">{mine ? `${MOVE_NAME[mine]}!` : 'You'}</span>
        </div>
        <ol className="dance-steps" aria-label="Routine steps">
          {routine.map((_, i) => (
            <li key={i} data-state={phase === 'watch' ? (i === lit ? 'lit' : 'todo') : i < done ? 'done' : 'todo'} />
          ))}
        </ol>
      </div>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        {phase === 'served' ? (
          <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }} data-testid="dance-served">
              Wow! +{dancePay(clean)} coins{clean ? ' with a tip' : ''}
            </p>
            <Button tone="primary" icon="star" onClick={next} testId="dance-next">
              {idx + 1 >= ROUTINES_PER_SHIFT ? 'Finish shift' : 'Next routine'}
            </Button>
          </div>
        ) : (
          <>
            <div className="move-row" role="group" aria-label="Dance moves">
              {MOVES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="move-btn"
                  data-testid={`move-${m}`}
                  aria-disabled={phase !== 'echo'}
                  onClick={() => dance(m)}
                >
                  <span className="move-icon">
                    <MoveIcon move={m} />
                  </span>
                  {MOVE_NAME[m]}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button icon="wave" onClick={() => (play('pop'), setWatchKey((k) => k + 1))} testId="dance-replay">
                Watch again
              </Button>
            </div>
          </>
        )}
      </div>
      {over && (
        <div className="card-center card-low" role="dialog" aria-label="Dance shift complete">
          <div className="panel pop-in" data-testid="dance-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Dance party!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Includes a +{DANCE_SHIFT_BONUS} shift bonus. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="dance-again">
              Another shift
            </Button>
            <Button onClick={() => setScene('town')} testId="dance-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
