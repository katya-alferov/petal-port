// Sweet Spot (game-systems §13): decorate each customer's cupcake to match the card, then serve it.
// No timer; a wrong look says what to change. New designs join the album's Treats page.
import { useRef, useState } from 'react';
import { CupcakeArt } from '../art/scenes/Sweets';
import { REGULARS } from '../content/cafe';
import { frosting, FROSTINGS, nameOf, SWEET_MENU, SWEET_TOPPINGS, SWIRLS, type SweetOption } from '../content/sweets';
import { checkCupcake, CUSTOMERS_PER_SHIFT, sweetOrders, SWEET_SHIFT_BONUS, type Cupcake, type SweetPart } from '../game/sweets';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Tabs } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, FriendFace } from './common';

const LABEL: Record<SweetPart, string> = { frosting: 'Frosting', swirl: 'Swirl', topping: 'Topping' };
const OPTIONS: Record<SweetPart, SweetOption[]> = { frosting: FROSTINGS, swirl: SWIRLS, topping: SWEET_TOPPINGS };
const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0]);

function Cake({ c, size }: { c: Cupcake; size?: number }) {
  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={size ? size * 1.1 : undefined}
      aria-hidden="true"
      style={size ? undefined : { width: '100%', height: '100%' }}
    >
      <CupcakeArt frosting={frosting(c.frosting)?.color ?? '#FFF1D0'} swirl={c.swirl} topping={c.topping} />
    </svg>
  );
}

export function SweetsScene() {
  const [run, setRun] = useState(0);
  return <SweetShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function SweetShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const shifts = useGame((s) => s.save.progress.sweets.shifts);
  const sweetServed = useGame((s) => s.sweetServed);
  const sweetShiftDone = useGame((s) => s.sweetShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const orders = useRef(sweetOrders(shiftNo, SWEET_MENU)).current;
  const [idx, setIdx] = useState(0);
  const want = orders[Math.min(idx, orders.length - 1)];
  const customer = REGULARS[(shiftNo * 2 + idx + 5) % REGULARS.length];
  // The cupcake starts different from the card in every part.
  const start: Cupcake = {
    frosting: SWEET_MENU.frostings[(SWEET_MENU.frostings.indexOf(want.frosting) + 1) % SWEET_MENU.frostings.length],
    swirl: SWEET_MENU.swirls[(SWEET_MENU.swirls.indexOf(want.swirl) + 1) % SWEET_MENU.swirls.length],
    topping: SWEET_MENU.toppings[(SWEET_MENU.toppings.indexOf(want.topping) + 1) % SWEET_MENU.toppings.length],
  };
  const [look, setLook] = useState<Partial<Cupcake>>({});
  const have: Cupcake = { ...start, ...look };
  const [part, setPart] = useState<SweetPart>('frosting');
  const [wrong, setWrong] = useState<SweetPart[] | null>(null);
  const [clean, setClean] = useState(true);
  const [served, setServed] = useState<{ coins: number; isNew: boolean } | null>(null);
  const [earned, setEarned] = useState(0);
  const [done, setDone] = useState(false);

  const pick = (p: SweetPart, id: string) => {
    if (served) return;
    play('swap');
    setLook({ ...look, [p]: id });
    setWrong(null);
  };

  const serve = () => {
    const r = checkCupcake(want, have);
    if (!r.correct) {
      play('soft');
      setWrong(r.wrong);
      setClean(false);
      setPart(r.wrong[0]);
      return;
    }
    play('chime');
    const res = sweetServed(have, clean);
    setEarned((e) => e + res.coins);
    setServed(res);
  };

  const next = () => {
    if (idx + 1 >= CUSTOMERS_PER_SHIFT) {
      setEarned((e) => e + sweetShiftDone());
      setDone(true);
      play('chime');
      return;
    }
    setIdx(idx + 1);
    setLook({});
    setWrong(null);
    setClean(true);
    setServed(null);
    setPart('frosting');
  };

  return (
    <section className="scene" aria-label="Sweet Spot" style={{ background: 'linear-gradient(#E3FBF1, #FFF0F6 60%, #FFE3EE)' }}>
      <ActivityBar title="Sweet Spot" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="sweet-progress">
          {Math.min(idx + 1, CUSTOMERS_PER_SHIFT)}/{CUSTOMERS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div className="burger-top">
        <div className="face" style={{ width: 64, height: 64, flex: 'none' }} aria-hidden="true">
          <FriendFace id={customer.id} />
        </div>
        <div className="panel burger-card" data-testid="sweet-card" data-want={JSON.stringify(want)}>
          <b>{customer.name} wants:</b>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontWeight: 800, lineHeight: 1.25 }}>
            <li>{nameOf(FROSTINGS, want.frosting)}</li>
            <li>{nameOf(SWIRLS, want.swirl)}</li>
            <li>{nameOf(SWEET_TOPPINGS, want.topping)}</li>
          </ul>
        </div>
        <div className="sweet-preview" role="img" aria-label="The cupcake on the card">
          <Cake c={want} />
        </div>
      </div>
      <div className="sweet-stage" key={`${idx}-${wrong ? 'w' : 'ok'}`} data-wobble={!!wrong} data-testid="sweet-stage">
        <Cake c={have} />
      </div>
      {wrong && !served && (
        <p role="status" className="panel salon-wrong" style={{ position: 'static', margin: '0 12px 6px' }} data-testid="sweet-wrong">
          Almost! Check the {list(wrong.map((w) => LABEL[w].toLowerCase()))} on the card.
        </p>
      )}
      <div className="tray" style={{ flex: '0 0 auto' }}>
        {served ? (
          <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }} data-testid="sweet-served">
              Yum! +{served.coins} coins{clean ? ' with a tip' : ''}
              {served.isNew ? ' · new design in your Treats!' : ''}
            </p>
            <Button tone="primary" icon="star" onClick={next} testId="sweet-next">
              {idx + 1 >= CUSTOMERS_PER_SHIFT ? 'Finish shift' : 'Next customer'}
            </Button>
          </div>
        ) : (
          <>
            <Tabs<SweetPart>
              label="Cupcake choices"
              value={part}
              onChange={(p) => (play('pop'), setPart(p))}
              tabs={(['frosting', 'swirl', 'topping'] as SweetPart[]).map((p) => ({
                id: p,
                label: wrong?.includes(p) ? `${LABEL[p]} ●` : LABEL[p],
              }))}
            />
            <div className="chip-row wrap" role="group" aria-label={LABEL[part]} style={{ justifyContent: 'center' }}>
              {OPTIONS[part].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="chip"
                  aria-pressed={have[part] === o.id}
                  data-testid={`sweet-opt-${o.id}`}
                  onClick={() => pick(part, o.id)}
                >
                  {o.color && <span className="swatch-dot" style={{ background: o.color }} aria-hidden="true" />}
                  {o.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button tone="primary" icon="sparkle" onClick={serve} testId="sweet-serve">
                Serve it!
              </Button>
            </div>
          </>
        )}
      </div>
      {done && (
        <div className="card-center card-low" role="dialog" aria-label="Sweet Spot shift complete">
          <div className="panel pop-in" data-testid="sweet-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Shift done!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Includes a +{SWEET_SHIFT_BONUS} shift bonus. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="sweet-again">
              Another shift
            </Button>
            <Button onClick={() => setScene('town')} testId="sweet-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
