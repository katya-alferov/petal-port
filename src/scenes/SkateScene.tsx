// Skate Park (game-systems §16): roll along a gentle course and tap Jump (or press Space) as each
// obstacle reaches you. A bump only makes you wobble; the run always finishes and nothing is taken away.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board, GROUND_Y, SkateBackdrop, SkateObstacle } from '../art/scenes/Skate';
import {
  cleared,
  course,
  JUMP_SECONDS,
  OBSTACLES,
  reachTime,
  runEnd,
  SKATE_CLEAR,
  SKATE_PAY,
  SKATE_PERFECT,
  SKATER_X,
  SPEED,
} from '../game/skate';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

type Phase = 'ready' | 'run' | 'over';

export function SkateScene() {
  const [run, setRun] = useState(0);
  return <SkateRun key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function SkateRun({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const player = useGame((s) => s.save.player);
  const runs = useGame((s) => s.save.progress.skate.runs);
  const skateDone = useGame((s) => s.skateDone);

  const [runNo] = useState(() => runs + 1);
  const track = useRef(course(runNo)).current;
  const [phase, setPhase] = useState<Phase>('ready');
  const [t, setT] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [bump, setBump] = useState(false);
  const [okCount, setOkCount] = useState(0);
  const [note, setNote] = useState('');
  const [coins, setCoins] = useState(0);
  const [size, setSize] = useState({ w: 375, h: 330 });
  const stage = useRef<HTMLDivElement>(null);
  const startAt = useRef(0);
  const jumpStart = useRef<number | null>(null);
  const judged = useRef(new Set<number>());
  const cleared$ = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const read = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = size.h / 400;
  const unitsWide = size.w / scale;
  const end = runEnd(track);

  const finish = useCallback(() => {
    setPhase('over');
    setCoins(skateDone(cleared$.current));
    play('chime');
  }, [skateDone]);

  useEffect(() => {
    if (phase !== 'run') return;
    const tick = () => {
      const now = (performance.now() - startAt.current) / 1000;
      setT(now);
      track.forEach((o, i) => {
        if (judged.current.has(i) || now < reachTime(o)) return;
        judged.current.add(i);
        if (cleared(o, jumpStart.current)) {
          cleared$.current += 1;
          setOkCount(cleared$.current);
          setNote('Nice!');
          play('chime');
        } else {
          setNote('Oops! Roll on.');
          setBump(true);
          play('soft');
          window.setTimeout(() => setBump(false), 600);
        }
      });
      if (now >= end) {
        finish();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    startAt.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, track, end, finish]);

  const jump = useCallback(() => {
    if (phase !== 'run') return;
    const now = (performance.now() - startAt.current) / 1000;
    if (jumpStart.current !== null && now < jumpStart.current + JUMP_SECONDS) return;
    jumpStart.current = now;
    setJumping(true);
    play('pop');
    window.setTimeout(() => setJumping(false), JUMP_SECONDS * 1000);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump]);

  const skaterPx = SKATER_X * scale;
  const dollH = 190 * scale;
  return (
    <section className="scene" aria-label="Skate Park" style={{ background: '#BFE6FF' }}>
      <ActivityBar title="Skate Park" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="skate-progress">
          {okCount}/{OBSTACLES}
        </span>
      </ActivityBar>
      <div
        ref={stage}
        className="skate-stage"
        data-testid="skate-stage"
        data-phase={phase}
        onPointerDown={phase === 'run' ? jump : undefined}
      >
        <svg viewBox={`0 0 ${unitsWide} 400`} className="skate-track" aria-hidden="true">
          <SkateBackdrop width={unitsWide} />
          {track.map((o, i) => {
            const x = o.at - t * SPEED;
            return x > -200 && x < unitsWide + 50 ? <SkateObstacle key={i} kind={o.kind} x={x} /> : null;
          })}
        </svg>
        <div
          className="skater"
          data-jumping={jumping}
          data-bump={bump}
          style={{ left: skaterPx - dollH * 0.18, bottom: (400 - GROUND_Y) * scale - 4, height: dollH, width: dollH * 0.36 }}
          data-testid="skater"
        >
          <div className="skater-body" style={{ transform: undefined }}>
            <Character
              appearance={player.appearance}
              outfit={player.outfit}
              crop="100 20 200 780"
              pose={jumping ? 'cheer' : 'hips'}
              animate={false}
              title="You"
            />
          </div>
          <div className="skater-board">
            <Board />
          </div>
        </div>
        {note && phase === 'run' && (
          <p className="panel skate-note" role="status" key={note + okCount + (bump ? 'b' : '')}>
            {note}
          </p>
        )}
        {phase === 'ready' && (
          <p className="panel skate-note" style={{ top: '30%' }}>
            Tap Jump when an obstacle reaches you!
          </p>
        )}
      </div>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {phase === 'ready' ? (
            <Button tone="primary" icon="star" onClick={() => (play('chime'), setPhase('run'))} testId="skate-start">
              Start rolling
            </Button>
          ) : (
            <Button tone="primary" icon="wave" onClick={jump} testId="skate-jump">
              Jump!
            </Button>
          )}
        </div>
      </div>
      {phase === 'over' && (
        <div className="card-center card-low" role="dialog" aria-label="Skate run complete">
          <div className="panel pop-in" data-testid="skate-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              {okCount >= OBSTACLES ? 'Perfect run!' : 'Nice run!'}
            </p>
            <p style={{ margin: 0, fontWeight: 800 }}>
              {okCount} of {OBSTACLES} obstacles cleared
            </p>
            <p
              style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}
              data-testid="skate-coins"
            >
              <Icon name="coin" />+{coins} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              {SKATE_PAY} for rolling, +{SKATE_CLEAR} per obstacle{okCount >= OBSTACLES ? `, +${SKATE_PERFECT} perfect bonus` : ''}. Your
              flowers grew too!
            </p>
            <Button tone="primary" onClick={onAgain} testId="skate-again">
              Skate again
            </Button>
            <Button onClick={() => setScene('town')} testId="skate-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
