// Glow Nails (game-systems §18): four clients per shift. Copy the nails in the picture: pick a polish (or a
// gem), tap a nail, then check. A wrong nail wobbles and is named; fix it as often as you like.
import { useRef, useState } from 'react';
import { GemIcon, HandArt, PolishBottle } from '../art/scenes/Nails';
import { NailShopBackdrop } from '../art/scenes/Restaurants';
import { REGULARS } from '../content/cafe';
import { NAIL_POLISH } from '../content/nails';
import {
  CLIENTS_PER_SHIFT,
  emptyWork,
  NAIL_COLORS,
  NAIL_NAMES,
  NAILS_SHIFT_BONUS,
  nailOrders,
  nailsPay,
  wrongNails,
  type NailColor,
  type NailWork,
} from '../game/nails';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

type Tool = NailColor | 'gem' | 'wipe';
const hex = (c: string | null) => (c ? NAIL_POLISH[c].hex : null);
const rim = (c: string | null) => (c ? NAIL_POLISH[c].shade : null);

export function NailsScene() {
  const [run, setRun] = useState(0);
  return <NailsShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function NailsShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const shifts = useGame((s) => s.save.progress.nails.shifts);
  const nailsServed = useGame((s) => s.nailsServed);
  const nailsShiftDone = useGame((s) => s.nailsShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const orders = useRef(nailOrders(shiftNo)).current;
  const [idx, setIdx] = useState(0);
  const [work, setWork] = useState<NailWork>(emptyWork);
  const [tool, setTool] = useState<Tool>('rose');
  const [wrong, setWrong] = useState<number[]>([]);
  const [clean, setClean] = useState(true);
  const [served, setServed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [over, setOver] = useState(false);

  const order = orders[Math.min(idx, orders.length - 1)];
  const client = REGULARS[(shiftNo * 4 + idx + 2) % REGULARS.length];

  const paint = (i: number) => {
    if (served || over) return;
    setWrong([]);
    play('pop');
    setWork((w) => {
      const colors = [...w.colors];
      const gems = [...w.gems];
      if (tool === 'gem') gems[i] = !gems[i];
      else if (tool === 'wipe') {
        colors[i] = null;
        gems[i] = false;
      } else colors[i] = tool;
      return { colors, gems };
    });
  };

  const check = () => {
    const bad = wrongNails(order, work);
    if (bad.length === 0) {
      play('chime');
      setWrong([]);
      setEarned((e) => e + nailsServed(clean));
      setServed(true);
      return;
    }
    play('soft');
    setClean(false);
    setWrong(bad);
  };

  const next = () => {
    if (idx + 1 >= CLIENTS_PER_SHIFT) {
      setEarned((e) => e + nailsShiftDone());
      setOver(true);
      play('chime');
      return;
    }
    setIdx(idx + 1);
    setWork(emptyWork());
    setWrong([]);
    setClean(true);
    setServed(false);
  };

  const names = wrong.map((i) => NAIL_NAMES[i]);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];

  return (
    <section className="scene" aria-label="Glow Nails" style={{ background: '#F3E8FF' }}>
      <div className="scene-art">
        <NailShopBackdrop />
      </div>
      <ActivityBar title="Glow Nails" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="nails-progress">
          {Math.min(idx + 1, CLIENTS_PER_SHIFT)}/{CLIENTS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div
          key={idx}
          className="customer-in"
          style={{ position: 'absolute', left: '0%', bottom: '18%', height: 'min(50%, 270px)', aspectRatio: '320 / 470' }}
        >
          <Character
            appearance={client.appearance}
            outfit={client.outfit}
            crop="40 0 320 470"
            title={client.name}
            pose={served ? 'wave' : 'idle'}
          />
        </div>
        <div className="bubble nail-bubble" data-testid="nails-card" data-order={JSON.stringify(order)}>
          <b>{client.name} would like:</b>
          <div className="nail-preview" aria-label="The nails to copy" role="img">
            <HandArt colors={order.colors.map(hex)} shade={order.colors.map(rim)} gems={order.gems} />
          </div>
        </div>
        <div className="counter counter-nails" />
        <div className="nail-hand" data-testid="nail-hand">
          <HandArt
            colors={work.colors.map(hex)}
            shade={work.colors.map(rim)}
            gems={work.gems}
            onTap={paint}
            wobble={wrong}
            names={[...NAIL_NAMES]}
          />
        </div>
      </div>
      {wrong.length > 0 && (
        <p role="status" className="panel salon-wrong" style={{ position: 'static', margin: '0 12px 6px' }} data-testid="nails-wrong">
          Look again at the {list}. Does it match the picture?
        </p>
      )}
      <div className="tray" style={{ flex: '0 0 auto' }}>
        {served ? (
          <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }} data-testid="nails-served">
              Gorgeous! +{nailsPay(clean)} coins{clean ? ' with a tip' : ''}
            </p>
            <Button tone="primary" icon="star" onClick={next} testId="nails-next">
              {idx + 1 >= CLIENTS_PER_SHIFT ? 'Finish shift' : 'Next client'}
            </Button>
          </div>
        ) : (
          <>
            <div className="nail-tools" role="group" aria-label="Polish and gems">
              {NAIL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="burger-part"
                  aria-pressed={tool === c}
                  data-testid={`polish-${c}`}
                  onClick={() => (play('swap'), setTool(c))}
                >
                  <span className="burger-icon" style={{ height: 30 }}>
                    <PolishBottle color={NAIL_POLISH[c].hex} shade={NAIL_POLISH[c].shade} />
                  </span>
                  {NAIL_POLISH[c].name}
                </button>
              ))}
              <button
                type="button"
                className="burger-part"
                aria-pressed={tool === 'gem'}
                data-testid="polish-gem"
                onClick={() => (play('swap'), setTool('gem'))}
              >
                <span className="burger-icon" style={{ height: 30 }}>
                  <GemIcon />
                </span>
                Gem
              </button>
              <button
                type="button"
                className="burger-part"
                aria-pressed={tool === 'wipe'}
                data-testid="polish-wipe"
                onClick={() => (play('swap'), setTool('wipe'))}
              >
                <span className="burger-icon" style={{ height: 30, display: 'grid', placeItems: 'center' }}>
                  <span style={{ width: 24, height: 24, display: 'block' }}>
                    <Icon name="close" />
                  </span>
                </span>
                Wipe
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
              <Button tone="primary" icon="star" onClick={check} testId="nails-check">
                All done!
              </Button>
            </div>
          </>
        )}
      </div>
      {over && (
        <div className="card-center card-low" role="dialog" aria-label="Nails shift complete">
          <div className="panel pop-in" data-testid="nails-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Sparkly shift!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Includes a +{NAILS_SHIFT_BONUS} shift bonus. Your flowers grew too!</p>
            <Button tone="primary" onClick={onAgain} testId="nails-again">
              Another shift
            </Button>
            <Button onClick={() => setScene('town')} testId="nails-leave">
              Back to town
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
