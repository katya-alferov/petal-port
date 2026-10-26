// Pet corner (game-systems §8.1): feed, bath, catch and tricks. Every activity is a small game;
// nothing ever goes down, and the pet is always happy to see you.
import { useRef, useState } from 'react';
import { FoodArt, PET_SPOTS, PetBowlArt, type PetMood } from '../art/pets';
import { PET_FOODS, TRICK_NAMES, petFood, petKind } from '../content/pets';
import { ballSpot, bowls, CATCHES, careToNextTrick, TRICK_AT, tricksKnown, wantedFood } from '../game/pets';
import type { PetAction } from '../game/save';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { ActivityBar, PetFigure } from './common';

type Mode = 'menu' | 'feed' | 'bath' | 'play' | 'tricks';
const TRICK_CLASS = ['pet-sit', 'pet-spin', 'pet-paw', 'pet-dance', 'pet-roll'];

export function PetScene() {
  const setScene = useGame((s) => s.setScene);
  const pet = useGame((s) => s.save.progress.pet);
  const petCared = useGame((s) => s.petCared);
  const [mode, setMode] = useState<Mode>('menu');
  const [mood, setMood] = useState<PetMood>('happy');
  const [anim, setAnim] = useState<{ cls: string; n: number } | null>(null);
  const [say, setSay] = useState<string | null>(null);
  const [wrongBowl, setWrongBowl] = useState<string | null>(null);
  const [mud, setMud] = useState<boolean[]>([]);
  const [catches, setCatches] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [learned, setLearned] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  if (!pet) {
    return (
      <section className="scene" aria-label="Pet">
        <ActivityBar title="Pet" onBack={() => setScene('home')} />
        <div className="card-center">
          <div className="panel">
            <p>You don’t have a pet yet. Visit the Paw Parlour in town!</p>
            <Button tone="primary" onClick={() => setScene('petshop')} testId="pet-go-shop">
              Go to Paw Parlour
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const kind = petKind(pet.kind);
  const known = tricksKnown(pet);
  const toNext = careToNextTrick(pet);
  const want = wantedFood(pet, kind.favourites);

  const animate = (cls: string, ms = 1000, after?: () => void) => {
    setAnim((a) => ({ cls, n: (a?.n ?? 0) + 1 }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAnim(null);
      after?.();
    }, ms);
  };

  const finish = (action: PetAction, line: string) => {
    const trick = petCared(action);
    play('chime');
    setMood('happy');
    setHearts((h) => h + 1);
    setSay(line);
    setMode('menu');
    if (trick !== null) setLearned(trick);
  };

  const start = (m: Mode) => {
    play('pop');
    setSay(null);
    setWrongBowl(null);
    setMode(m);
    setMood('idle');
    if (m === 'bath') setMud(PET_SPOTS.map(() => true));
    if (m === 'play') setCatches(0);
    if (m === 'feed') setSay(`I’d love some ${petFood(want)?.name.toLowerCase()}!`);
    if (m === 'tricks') setMood('happy');
  };

  const feed = (food: string) => {
    if (food !== want) {
      play('soft');
      setWrongBowl(food);
      setSay(`Hmm, not that one. ${pet.name} wants the ${petFood(want)?.name.toLowerCase()}!`);
      animate('pet-no', 600);
      return;
    }
    play('pop');
    setMood('eat');
    setSay('Nom nom nom…');
    animate('pet-chew', 1200, () => finish('feed', 'Yum! Thank you!'));
  };

  const scrub = (i: number) => {
    if (!mud[i]) return;
    play('pop');
    setMud((m) => m.map((d, j) => (j === i ? false : d)));
  };

  const scrubAt = (e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'bath' || e.buttons === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 300;
    const y = ((e.clientY - r.top) / r.height) * 300;
    PET_SPOTS.forEach(([sx, sy], i) => {
      if (Math.hypot(sx - x, sy - y) < 30) scrub(i);
    });
  };

  const rinse = () => {
    play('swap');
    setMud([]);
    animate('pet-shake', 900, () => finish('wash', 'Squeaky clean!'));
  };

  const ball = ballSpot(pet, catches);
  const catchBall = () => {
    play('pop');
    const n = catches + 1;
    setCatches(n);
    setMood('happy');
    animate('pet-jump', 700, () => {
      if (n >= CATCHES) finish('play', 'That was so fun!');
    });
  };

  const doTrick = (i: number) => {
    play('chime');
    setMood(i === 2 ? 'paw' : 'happy');
    setSay(`${TRICK_NAMES[i]}!`);
    animate(TRICK_CLASS[i], 1200, () => setMood('happy'));
  };

  return (
    <section
      className="scene"
      aria-label={`${pet.name} the ${kind.name.toLowerCase()}`}
      style={{ background: 'linear-gradient(#CDEEEA, #FFF7EC 70%)' }}
    >
      <ActivityBar title={pet.name} onBack={() => setScene('home')} />
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* The bubble has its own band above the pet (toasts use the same band), so the ears stay visible. */}
        <div style={{ flex: '0 0 auto', minHeight: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {say && (
            <div
              className="panel bubble pop-in"
              role="status"
              style={{ position: 'relative', maxWidth: '86%', textAlign: 'center' }}
              data-testid="pet-say"
            >
              {mode === 'feed' && (
                <svg viewBox="0 0 100 100" width={44} height={44} aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: 6 }}>
                  <FoodArt id={want} x={50} y={52} />
                </svg>
              )}
              {say}
            </div>
          )}
        </div>
        <svg
          viewBox="0 0 300 300"
          style={{ flex: '1 1 0', minHeight: 0, width: 'min(92%, 46dvh)', touchAction: mode === 'bath' ? 'none' : undefined }}
          role="img"
          aria-label={pet.name}
          onPointerMove={scrubAt}
          onPointerDown={scrubAt}
          data-testid="pet-stage"
        >
          <ellipse cx={150} cy={286} rx={140} ry={22} fill={mode === 'bath' ? '#8AD3DA' : '#F2DCC0'} stroke="#5B4A6E" strokeWidth={3} />
          <g
            key={anim?.n ?? 0}
            className={anim?.cls ?? 'pet-idle'}
            role="button"
            tabIndex={0}
            aria-label={`Pat ${pet.name}`}
            data-testid="pet-pat"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', cursor: 'pointer' }}
            onClick={() => {
              if (mode !== 'menu') return;
              play('soft');
              setMood('happy');
              setHearts((h) => h + 1);
              setSay(['Purr-fect!', 'I love you!', 'Hehe, that tickles!'][hearts % 3]);
              animate('pet-wiggle', 600);
            }}
          >
            <PetFigure pet={pet} mood={mood} mud={mode === 'bath' ? mud : undefined} />
          </g>
          {mode === 'bath' &&
            PET_SPOTS.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={24}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={`Scrub spot ${i + 1}`}
                data-testid={`mud-${i}`}
                data-clean={!mud[i]}
                onClick={() => scrub(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrub(i)}
              />
            ))}
          {mode === 'play' && catches < CATCHES && !anim && (
            <g
              role="button"
              tabIndex={0}
              aria-label="Throw the ball"
              data-testid="ball"
              className="ball-bounce"
              style={{ cursor: 'pointer' }}
              onClick={catchBall}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && catchBall()}
            >
              <circle cx={ball.x * 300} cy={ball.y * 300} r={30} fill="transparent" />
              <circle cx={ball.x * 300} cy={ball.y * 300} r={18} fill="#FF7BA9" stroke="#5B4A6E" strokeWidth={3.5} />
              <path
                d={`M${ball.x * 300 - 17},${ball.y * 300} Q${ball.x * 300},${ball.y * 300 + 10} ${ball.x * 300 + 17},${ball.y * 300}`}
                fill="none"
                stroke="#FFF7EC"
                strokeWidth={4}
              />
            </g>
          )}
        </svg>
        {hearts > 0 && (
          <span key={hearts} className="hearts" aria-hidden="true" style={{ left: '50%', top: '30%', color: '#FF7BA9' }}>
            ♥
          </span>
        )}
      </div>

      <div className="tray" style={{ flex: '0 0 auto', gap: 10 }}>
        {mode === 'menu' && (
          <>
            <div className="pet-actions">
              <Button icon="heart" onClick={() => start('feed')} testId="pet-feed">
                Feed
              </Button>
              <Button icon="sparkle" onClick={() => start('bath')} testId="pet-bath">
                Bath
              </Button>
              <Button icon="star" onClick={() => start('play')} testId="pet-play">
                Catch
              </Button>
              <Button icon="paw" onClick={() => start('tricks')} testId="pet-tricks">
                Tricks
              </Button>
            </div>
            <p style={{ margin: 0, textAlign: 'center' }} data-testid="pet-progress">
              {toNext === null
                ? `${pet.name} knows every trick! What a star.`
                : `${toNext} more ${toNext === 1 ? 'care' : 'cares'} until ${pet.name} learns ${TRICK_NAMES[known]}!`}
            </p>
          </>
        )}
        {mode === 'feed' && (
          <div className="pet-actions" role="group" aria-label="Food bowls">
            {bowls(
              pet,
              kind.favourites,
              PET_FOODS.map((f) => f.id),
            ).map((f) => (
              <button
                key={f}
                type="button"
                className={`bowl-btn${wrongBowl === f ? ' wobble' : ''}`}
                aria-label={petFood(f)?.name}
                data-testid={`bowl-${f}`}
                onClick={() => feed(f)}
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <PetBowlArt food={f} />
                </svg>
                {petFood(f)?.name}
              </button>
            ))}
          </div>
        )}
        {mode === 'bath' && (
          <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
            <p style={{ margin: 0 }}>{mud.some(Boolean) ? 'Tap or rub every muddy spot!' : 'All soapy! Time to rinse.'}</p>
            {!mud.some(Boolean) && mud.length > 0 && (
              <Button tone="primary" onClick={rinse} testId="bath-rinse">
                Rinse
              </Button>
            )}
          </div>
        )}
        {mode === 'play' && (
          <p style={{ margin: 0, textAlign: 'center' }}>
            Tap the ball to throw it! {catches}/{CATCHES}
          </p>
        )}
        {mode === 'tricks' && (
          <div className="chip-row" role="group" aria-label="Tricks">
            {TRICK_NAMES.map((t, i) => (
              <Button
                key={t}
                onClick={() => doTrick(i)}
                testId={`trick-${i}`}
                disabledReason={i < known ? undefined : `Learns after ${TRICK_AT[i]} cares`}
              >
                {i < known ? t : `🔒 ${t}`}
              </Button>
            ))}
          </div>
        )}
        {mode !== 'menu' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => (play('pop'), setMode('menu'), setSay(null), setMood('happy'))} testId="pet-done">
              {mode === 'tricks' ? 'Done' : 'Maybe later'}
            </Button>
          </div>
        )}
      </div>

      {learned !== null && (
        <div className="card-center" role="dialog" aria-label="New trick">
          <div className="panel pop-in" data-testid="trick-card">
            <h2 className="display">New trick!</h2>
            <p>
              {pet.name} learned <b>{TRICK_NAMES[learned]}</b>!
            </p>
            <Button
              tone="primary"
              testId="trick-ok"
              onClick={() => {
                const t = learned;
                setLearned(null);
                setMode('tricks');
                doTrick(t);
              }}
            >
              Show me!
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
