// Petal Posies (game-systems §19): four customers per shift. Pick the flowers and the wrapping paper the
// customer asked for, in any order, then check. Checking names what is missing or extra; nothing is lost.
import { useRef, useState } from 'react';
import { PosyShopBackdrop } from '../art/scenes/Restaurants';
import { BouquetArt, FlowerHead } from '../art/scenes/Posies';
import { REGULARS } from '../content/cafe';
import { FLOWER_NAMES, WRAP_COLORS } from '../content/nails';
import {
  checkPosy,
  CUSTOMERS_PER_SHIFT,
  FLOWERS,
  MAX_FLOWERS,
  POSY_SHIFT_BONUS,
  posyOrders,
  posyPay,
  WRAPS,
  type Flower,
  type Wrap,
} from '../game/posies';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

const nameOf = (f: Flower, n: number) => (n === 1 ? FLOWER_NAMES[f].one : FLOWER_NAMES[f].many);

export function PosiesScene() {
  const [run, setRun] = useState(0);
  return <PosiesShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function PosiesShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const shifts = useGame((s) => s.save.progress.posies.shifts);
  const posyServed = useGame((s) => s.posyServed);
  const posyShiftDone = useGame((s) => s.posyShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const orders = useRef(posyOrders(shiftNo)).current;
  const [idx, setIdx] = useState(0);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [wrap, setWrap] = useState<Wrap | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [wobble, setWobble] = useState(0);
  const [clean, setClean] = useState(true);
  const [served, setServed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [over, setOver] = useState(false);

  const order = orders[Math.min(idx, orders.length - 1)];
  const customer = REGULARS[(shiftNo * 5 + idx + 1) % REGULARS.length];
  const wanted = FLOWERS.filter((f) => order.counts[f]);

  const add = (f: Flower) => {
    if (served || over || flowers.length >= MAX_FLOWERS) return;
    play('pop');
    setHint(null);
    setFlowers([...flowers, f]);
  };

  const check = () => {
    const { gaps, wrapOk } = checkPosy(order, flowers, wrap);
    if (gaps.length === 0 && wrapOk) {
      play('chime');
      setHint(null);
      setEarned((e) => e + posyServed(clean));
      setServed(true);
      return;
    }
    play('soft');
    setClean(false);
    setWobble((w) => w + 1);
    const parts = gaps.map((g) =>
      g.need > 0 ? `${g.need} more ${nameOf(g.flower, g.need)}` : `${-g.need} fewer ${nameOf(g.flower, -g.need)}`,
    );
    if (!wrapOk) parts.push(`${WRAP_COLORS[order.wrap].name.toLowerCase()} wrapping`);
    setHint(`Almost! It needs ${parts.join(', ')}.`);
  };

  const next = () => {
    if (idx + 1 >= CUSTOMERS_PER_SHIFT) {
      setEarned((e) => e + posyShiftDone());
      setOver(true);
      play('chime');
      return;
    }
    setIdx(idx + 1);
    setFlowers([]);
    setWrap(null);
    setHint(null);
    setClean(true);
    setServed(false);
  };

  return (
    <section className="scene" aria-label="Petal Posies" style={{ background: '#E4F8E6' }}>
      <div className="scene-art">
        <PosyShopBackdrop />
      </div>
      <ActivityBar title="Petal Posies" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="posies-progress">
          {Math.min(idx + 1, CUSTOMERS_PER_SHIFT)}/{CUSTOMERS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div
          key={idx}
          className="customer-in"
          style={{ position: 'absolute', left: '0%', bottom: '18%', height: 'min(62%, 290px)', aspectRatio: '320 / 470' }}
        >
          <Character
            appearance={customer.appearance}
            outfit={customer.outfit}
            crop="40 0 320 470"
            title={customer.name}
            pose={served ? 'wave' : 'idle'}
          />
        </div>
        <div className="bubble posy-bubble" data-testid="posies-card" data-order={JSON.stringify(order)}>
          <b>{customer.name} would like:</b>
          <ul>
            {wanted.map((f) => (
              <li key={f}>
                {order.counts[f]} {nameOf(f, order.counts[f]!)}
              </li>
            ))}
            <li>{WRAP_COLORS[order.wrap].name} wrapping</li>
          </ul>
        </div>
        <div className="counter counter-posies" />
        <div className="posy-bouquet" key={`w${wobble}`} data-wobble={wobble > 0 && !served} data-testid="posy-bouquet">
          <BouquetArt flowers={flowers} wrap={wrap ? WRAP_COLORS[wrap] : null} />
        </div>
      </div>
      {hint && (
        <p role="status" className="panel salon-wrong" style={{ position: 'static', margin: '0 12px 6px' }} data-testid="posies-wrong">
          {hint}
        </p>
      )}
      <div className="tray" style={{ flex: '0 0 auto' }}>
        {served ? (
          <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }} data-testid="posies-served">
              Lovely! +{posyPay(clean)} coins{clean ? ' with a tip' : ''}
            </p>
            <Button tone="primary" icon="star" onClick={next} testId="posies-next">
              {idx + 1 >= CUSTOMERS_PER_SHIFT ? 'Finish shift' : 'Next customer'}
            </Button>
          </div>
        ) : (
          <>
            <div className="posy-row" role="group" aria-label="Flowers">
              {FLOWERS.map((f) => (
                <button key={f} type="button" className="burger-part" data-testid={`flower-${f}`} onClick={() => add(f)}>
                  <svg viewBox="-34 -34 68 68" className="burger-icon" style={{ height: 30 }} aria-hidden="true">
                    <FlowerHead id={f} />
                  </svg>
                  {FLOWER_NAMES[f].one[0].toUpperCase() + FLOWER_NAMES[f].one.slice(1)}
                </button>
              ))}
            </div>
            <div className="wrap-row" role="group" aria-label="Wrapping paper">
              {WRAPS.map((w) => (
                <button
                  key={w}
                  type="button"
                  className="chip"
                  aria-pressed={wrap === w}
                  data-testid={`wrap-${w}`}
                  onClick={() => (play('swap'), setWrap(w))}
                >
                  <span className="swatch-dot" style={{ background: WRAP_COLORS[w].main }} aria-hidden="true" />
                  {WRAP_COLORS[w].name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button onClick={() => (play('swap'), setFlowers(flowers.slice(0, -1)))} testId="posies-undo">
                Undo
              </Button>
              <Button tone="primary" icon="star" onClick={check} testId="posies-check">
                All done!
              </Button>
            </div>
          </>
        )}
      </div>
      {over && (
        <div className="card-center card-low" role="dialog" aria-label="Posies shift complete">
          <div className="panel pop-in" data-testid="posies-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Blooming shift!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Includes a +{POSY_SHIFT_BONUS} shift bonus. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="posies-again">
              Another shift
            </Button>
            <Button onClick={() => setScene('town')} testId="posies-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
