// Bun & Bite Burger Bar (game-systems §12): four customers per shift. Stack the burger in the order on
// the card. A wrong tap wobbles the plate and names the next ingredient; nothing is lost.
import { useRef, useState } from 'react';
import { BurgerShopBackdrop } from '../art/scenes/Restaurants';
import { BurgerStack, IngredientIcon, LAYER_NAMES } from '../art/scenes/Burger';
import { REGULARS } from '../content/cafe';
import { BURGER_SHIFT_BONUS, burgerOrders, burgerPay, CUSTOMERS_PER_SHIFT, tapPart, type BurgerPart } from '../game/burger';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

const PARTS: BurgerPart[] = ['bun-bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'pickle', 'bun-top'];

export function BurgerScene() {
  const [run, setRun] = useState(0);
  return <BurgerShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function BurgerShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const shifts = useGame((s) => s.save.progress.burger.shifts);
  const burgerServed = useGame((s) => s.burgerServed);
  const burgerShiftDone = useGame((s) => s.burgerShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const orders = useRef(burgerOrders(shiftNo)).current;
  const [idx, setIdx] = useState(0);
  const [stack, setStack] = useState<BurgerPart[]>([]);
  const [slip, setSlip] = useState<BurgerPart | null>(null);
  const [clean, setClean] = useState(true);
  const [served, setServed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [done, setDone] = useState(false);
  const [wobble, setWobble] = useState(0);

  const order = orders[Math.min(idx, orders.length - 1)];
  const customer = REGULARS[(shiftNo * 3 + idx + 1) % REGULARS.length];

  const add = (part: BurgerPart) => {
    if (served || done) return;
    const r = tapPart(order, stack.length, part);
    if (!r.ok) {
      play('soft');
      setSlip(r.next);
      setClean(false);
      setWobble((w) => w + 1);
      return;
    }
    play('pop');
    setSlip(null);
    setStack([...stack, part]);
    if (r.done) {
      play('chime');
      const coins = burgerServed(clean);
      setEarned((e) => e + coins);
      setServed(true);
    }
  };

  const next = () => {
    if (idx + 1 >= CUSTOMERS_PER_SHIFT) {
      setEarned((e) => e + burgerShiftDone());
      setDone(true);
      play('chime');
      return;
    }
    setIdx(idx + 1);
    setStack([]);
    setSlip(null);
    setClean(true);
    setServed(false);
  };

  return (
    <section className="scene" aria-label="Bun and Bite" style={{ background: '#FFE2CF' }}>
      <div className="scene-art">
        <BurgerShopBackdrop />
      </div>
      <ActivityBar title="Bun & Bite" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="burger-progress">
          {Math.min(idx + 1, CUSTOMERS_PER_SHIFT)}/{CUSTOMERS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div
          key={idx}
          className="customer-in"
          style={{ position: 'absolute', left: '0%', bottom: '18%', height: 'min(70%, 320px)', aspectRatio: '320 / 470' }}
        >
          <Character
            appearance={customer.appearance}
            outfit={customer.outfit}
            crop="40 0 320 470"
            title={customer.name}
            pose={served ? 'wave' : 'idle'}
          />
        </div>
        <div className="bubble burger-bubble" data-testid="burger-card" data-order={JSON.stringify(order)}>
          <b>{customer.name} would like:</b>
          <div className="burger-bubble-body">
            <ol>
              {[...order].reverse().map((p, i) => {
                const level = order.length - 1 - i;
                return (
                  <li key={i} data-state={level < stack.length ? 'done' : level === stack.length ? 'next' : 'todo'}>
                    {LAYER_NAMES[p]}
                  </li>
                );
              })}
            </ol>
            <div className="burger-preview" aria-hidden="true">
              <BurgerStack parts={order} />
            </div>
          </div>
        </div>
        <div className="counter counter-burger" />
        <div className="burger-plate" key={`w${wobble}`} data-wobble={wobble > 0 && !served} data-testid="burger-plate">
          <BurgerStack parts={stack} />
        </div>
      </div>
      {slip && (
        <p role="status" className="panel salon-wrong" style={{ position: 'static', margin: '0 12px 6px' }} data-testid="burger-wrong">
          Not yet! Next comes the {LAYER_NAMES[slip].toLowerCase()}.
        </p>
      )}
      <div className="tray" style={{ flex: '0 0 auto' }}>
        {served ? (
          <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }} data-testid="burger-served">
              Yum! +{burgerPay(clean)} coins{clean ? ' with a tip' : ''}
            </p>
            <Button tone="primary" icon="star" onClick={next} testId="burger-next">
              {idx + 1 >= CUSTOMERS_PER_SHIFT ? 'Finish shift' : 'Next customer'}
            </Button>
          </div>
        ) : (
          <div className="burger-parts" role="group" aria-label="Ingredients">
            {PARTS.map((p) => (
              <button key={p} type="button" className="burger-part" data-testid={`part-${p}`} onClick={() => add(p)}>
                <span className="burger-icon">
                  <IngredientIcon id={p} />
                </span>
                {LAYER_NAMES[p]}
              </button>
            ))}
          </div>
        )}
      </div>
      {done && (
        <div className="card-center card-low" role="dialog" aria-label="Burger shift complete">
          <div className="panel pop-in" data-testid="burger-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Shift done!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Includes a +{BURGER_SHIFT_BONUS} shift bonus. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="burger-again">
              Another shift
            </Button>
            <Button onClick={() => setScene('town')} testId="burger-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
