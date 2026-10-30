// Sunny Café "Order Up!" (game-systems §3): 5 customers, picture orders, no timer, nothing lost on a mistake.
import { useMemo, useState } from 'react';
import { CafeBackdrop, CafeIcon, DRINK_VIEWBOX, DrinkArt, PastryArt } from '../art/cafe';
import { CAFE_INGREDIENTS, CAFE_MENU, RANK_GIFTS, REGULARS, ingredient } from '../content/cafe';
import { wearable } from '../content/wearables';
import { addToBuilt, checkOrder, LATTE_BASE, ORDERS_PER_SHIFT, RANK_NAMES, shiftOrders, type Built, type Check } from '../game/cafe';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Tabs } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character, ShellSpots } from './common';

type TrayTab = 'drinks' | 'toppings' | 'bakery' | 'latte';
const EMPTY: Built = { toppings: [] };

function Icons({ ids, mark }: { ids: string[]; mark?: 'missing' | 'extra' }) {
  return (
    <>
      {ids.map((id) => (
        <span key={id} className={`diff-icon ${mark ?? ''}`} title={ingredient(id)?.name}>
          <CafeIcon id={id} />
          {mark === 'extra' && <b aria-hidden="true">✕</b>}
        </span>
      ))}
    </>
  );
}

function Jar({ id, on, add }: { id: string; on: boolean; add: (id: string) => void }) {
  return (
    <button type="button" className="jar" aria-pressed={on} onClick={() => add(id)} data-testid={`jar-${id}`}>
      <CafeIcon id={id} />
      {CAFE_INGREDIENTS.find((i) => i.id === id)?.name}
    </button>
  );
}

export function CafeScene() {
  const [run, setRun] = useState(0);
  return <CafeShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function CafeShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const cafe = useGame((s) => s.save.progress.cafe);
  const appearance = useGame((s) => s.save.player.appearance);
  const cafeServed = useGame((s) => s.cafeServed);
  const cafeShiftDone = useGame((s) => s.cafeShiftDone);

  // The shift is fixed when it starts: number and rank don't change mid-shift.
  const [shift] = useState(() => ({ no: cafe.shifts + 1, rank: cafe.rank }));
  const orders = useMemo(() => shiftOrders(shift.no, shift.rank, CAFE_MENU), [shift]);
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<Built>(EMPTY);
  const [binUsed, setBinUsed] = useState(false);
  const [wrong, setWrong] = useState<Check | null>(null);
  const [tab, setTab] = useState<TrayTab>('drinks');
  const [wobble, setWobble] = useState(0);
  const [cheer, setCheer] = useState<{ n: number; text: string } | null>(null);
  const [earned, setEarned] = useState(0);
  const [rankUp, setRankUp] = useState<2 | 3 | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [rank, setRank] = useState(shift.rank);

  const order = orders[idx];
  const regular = REGULARS[(shift.no * 3 + idx) % REGULARS.length];
  const sticker = REGULARS[(shift.no - 1) % REGULARS.length];

  const add = (id: string) => {
    const kind = ingredient(id)?.kind;
    if (!kind) return;
    const next = addToBuilt(built, kind, id);
    if (!next) {
      play('soft');
      setWobble((n) => n + 1);
      return;
    }
    play('pop');
    setBuilt(next);
    setWrong(null);
  };

  const serve = () => {
    const check = checkOrder(order, built);
    if (!check.correct) {
      play('soft');
      setWrong(check);
      return;
    }
    const firstTry = !binUsed && !wrong;
    const r = cafeServed(firstTry, order.drink.base);
    play('chime');
    setEarned((e) => e + r.coins);
    setCheer({ n: idx, text: firstTry ? `Perfect! +${r.coins} (tip!)` : `Yum! +${r.coins}` });
    if (r.rankUp) {
      setRankUp(r.rankUp);
      setRank(r.rankUp);
    }
    window.setTimeout(() => {
      setCheer(null);
      setBuilt(EMPTY);
      setBinUsed(false);
      setWrong(null);
      if (idx + 1 >= ORDERS_PER_SHIFT) {
        const bonus = cafeShiftDone();
        setEarned((e) => e + bonus);
        setDone(bonus);
      } else setIdx(idx + 1);
    }, 1100);
  };

  const bin = () => {
    play('swap');
    setBuilt(EMPTY);
    setBinUsed(true);
    setWrong(null);
  };

  const jars: Record<TrayTab, string[]> = {
    drinks: [...CAFE_MENU.cups, ...CAFE_MENU.bases],
    toppings: [...CAFE_MENU.toppings, ...(shift.rank >= 2 ? CAFE_MENU.rank2Toppings : [])],
    bakery: [...CAFE_MENU.pastries],
    latte: [LATTE_BASE, ...CAFE_MENU.stencils],
  };
  const tabs: { id: TrayTab; label: string }[] = [
    { id: 'drinks', label: 'Cups' },
    { id: 'toppings', label: 'Toppings' },
    ...(shift.rank >= 2 ? [{ id: 'bakery' as const, label: 'Bakery' }] : []),
    ...(shift.rank >= 3 ? [{ id: 'latte' as const, label: 'Latte art' }] : []),
  ];
  const isOn = (id: string) => [built.cup, built.base, built.pastry, built.stencil].includes(id) || built.toppings.includes(id);

  return (
    <section className="scene" aria-label="Sunny Café" style={{ background: '#FFE7C2' }}>
      <ShellSpots scene="cafe" />
      <div className="scene-art">
        <CafeBackdrop />
      </div>
      <ActivityBar title="Sunny Café" onBack={() => setScene('town')}>
        <span className="panel" style={{ padding: '4px 10px', fontWeight: 800 }} data-testid="cafe-progress">
          {Math.min(idx + 1, ORDERS_PER_SHIFT)}/{ORDERS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {/* Customer behind the counter */}
        <div
          key={idx}
          className="customer-in"
          style={{ position: 'absolute', left: '0%', bottom: '18%', height: 'min(74%, 330px)', aspectRatio: '320 / 470' }}
        >
          <Character
            appearance={regular.appearance}
            outfit={regular.outfit}
            crop="40 0 320 470"
            title={regular.name}
            pose={cheer ? 'wave' : 'idle'}
          />
        </div>
        {/* Order bubble */}
        <div
          className="bubble"
          data-testid="order-bubble"
          data-order={JSON.stringify(order)}
          style={{ right: '4%', top: '4%', width: '50%', display: 'grid', gap: 4, justifyItems: 'center' }}
        >
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{regular.name} wants:</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, width: '100%', justifyContent: 'center' }}>
            <svg viewBox={DRINK_VIEWBOX} style={{ width: order.pastry ? '55%' : '70%' }} role="img" aria-label="The drink to make">
              <DrinkArt {...order.drink} />
            </svg>
            {order.pastry && (
              <svg viewBox="0 60 200 160" style={{ width: '42%' }} role="img" aria-label={ingredient(order.pastry)?.name}>
                <PastryArt id={order.pastry} />
              </svg>
            )}
          </div>
          {wrong && (
            <div className="diff" role="status" data-testid="order-diff">
              <span style={{ fontWeight: 800 }}>Almost!</span>
              <Icons ids={wrong.missing} mark="missing" />
              <Icons ids={wrong.extra} mark="extra" />
            </div>
          )}
        </div>
        {cheer && (
          <div className="hearts" style={{ left: '4%', top: '2%', zIndex: 6 }} key={`cheer-${cheer.n}`}>
            💖{' '}
            <span className="panel" style={{ fontSize: '1rem', padding: '4px 10px' }}>
              {cheer.text}
            </span>
          </div>
        )}
        {/* Counter: what the player is building */}
        <div className="counter" />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '36%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 8,
            padding: '0 12px 6px',
          }}
        >
          <button
            type="button"
            className="icon-btn"
            aria-label="Empty the cup"
            onClick={bin}
            data-testid="cafe-bin"
            style={{ alignSelf: 'center', flexShrink: 0 }}
          >
            <Icon name="bin" />
          </button>
          <svg
            key={wobble}
            viewBox={DRINK_VIEWBOX}
            className={wobble ? 'wobble' : undefined}
            style={{ height: '100%', maxHeight: 200, minWidth: 0, flex: '0 1 auto' }}
            role="img"
            aria-label="Your drink"
            data-testid="built-drink"
          >
            <DrinkArt {...built} />
          </svg>
          {shift.rank >= 2 && (
            <svg viewBox="0 60 200 160" style={{ height: '70%' }} role="img" aria-label="Your plate">
              <PastryArt id={built.pastry} />
            </svg>
          )}
          <span style={{ alignSelf: 'center', flexShrink: 0 }}>
            <Button tone="primary" onClick={serve} testId="cafe-serve" icon="bell">
              Serve
            </Button>
          </span>
        </div>
      </div>
      <div className="tray">
        {tabs.length > 1 && <Tabs<TrayTab> label="Counter" value={tab} onChange={(t) => (play('pop'), setTab(t))} tabs={tabs} />}
        {tab === 'drinks' ? (
          <div className="jar-split">
            {(
              [
                ['Cups', CAFE_MENU.cups],
                ['Drinks', CAFE_MENU.bases],
              ] as const
            ).map(([label, ids]) => (
              <div key={label} className="jar-section">
                <span className="jar-label">{label}</span>
                <div className="jar-row" role="group" aria-label={label}>
                  {ids.map((id) => (
                    <Jar key={id} id={id} on={isOn(id)} add={add} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`jar-row${jars[tab].length > 4 ? ' jar-row-wide' : ''}`} role="group" aria-label="Ingredients">
            {jars[tab].map((id) => (
              <Jar key={id} id={id} on={isOn(id)} add={add} />
            ))}
          </div>
        )}
      </div>

      {rankUp && (
        <div className="card-center" role="dialog" aria-label="Rank up">
          <div className="panel pop-in">
            <p className="display" style={{ fontSize: '1.6rem' }}>
              🎉 You’re now a {RANK_NAMES[rankUp]}!
            </p>
            <div style={{ width: 140, aspectRatio: '1 / 2' }}>
              <Character
                appearance={appearance}
                outfit={{
                  top: { itemId: 'top.sailor-tee' },
                  bottom: { itemId: 'bottom.wide-trousers' },
                  shoes: { itemId: 'shoes.sneakers' },
                  ...Object.fromEntries(RANK_GIFTS[rankUp].items.map((id) => [wearable(id)?.slot, { itemId: id }])),
                }}
                animate={false}
              />
            </div>
            <p>{RANK_GIFTS[rankUp].line} Find it in your closet.</p>
            <Button tone="primary" onClick={() => setRankUp(null)} testId="rankup-ok">
              Yay!
            </Button>
          </div>
        </div>
      )}

      {done !== null && !rankUp && (
        <div className="card-center" role="dialog" aria-label="Shift complete">
          <div className="panel pop-in" data-testid="shift-card">
            <p className="display" style={{ fontSize: '1.6rem' }}>
              Shift complete!
            </p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>+{earned} coins</p>
            <div
              className="panel"
              style={{ display: 'grid', justifyItems: 'center', gap: 4, background: '#FFF7EC', transform: 'rotate(-3deg)' }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #5B4A6E',
                  background: '#BDE8EC',
                }}
              >
                <Character
                  appearance={sticker.appearance}
                  outfit={sticker.outfit}
                  crop="100 20 200 200"
                  animate={false}
                  title={sticker.name}
                />
              </div>
              <b>{sticker.name}</b>
              <span>“{sticker.thanks}”</span>
            </div>
            <p style={{ fontSize: '0.9rem' }}>
              {RANK_NAMES[rank]} · {cafe.correctOrders} drinks served
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button onClick={() => setScene('town')} testId="shift-town">
                To town
              </Button>
              <Button tone="primary" onClick={onAgain} testId="shift-again">
                Another shift
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
