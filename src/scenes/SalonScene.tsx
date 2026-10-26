// Glam Salon (game-systems §10.1): a second job. Each client has a style card; wash the foam away,
// pick the style, color and extra, then show the mirror. No timer, nothing is lost on a mistake.
import { useEffect, useRef, useState } from 'react';
import { BUBBLE_SPOTS, Cape, Foam, SalonBackdrop } from '../art/scenes/Salon';
import { HAIR_COLORS, HAIR_STYLES } from '../content/appearance';
import { REGULARS } from '../content/cafe';
import { SALON_MENU } from '../content/wavec';
import { wearable } from '../content/wearables';
import { CLIENTS_PER_SHIFT, checkLook, clientPay, SALON_SHIFT_BONUS, salonOrders, WASH_BUBBLES, type SalonLook } from '../game/salon';
import type { Appearance, Outfit } from '../game/save';
import { equip } from '../game/wardrobe';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Tabs } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character, FriendFace } from './common';

type Phase = 'wash' | 'style' | 'mirror';
type Part = 'style' | 'color' | 'accessory';
const styleName = (id: string) => HAIR_STYLES.find((h) => h.id === id)?.name ?? id;
const colorName = (id: string) => HAIR_COLORS.find((c) => c.id === id)?.name ?? id;
const accName = (id: string) => wearable(id)?.name ?? id;
const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0]);
const PART_LABEL: Record<Part, string> = { style: 'Style', color: 'Color', accessory: 'Extra' };

export function SalonScene() {
  const [run, setRun] = useState(0);
  return <SalonShift key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function SalonShift({ onAgain }: { onAgain: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const shifts = useGame((s) => s.save.progress.salon.shifts);
  const salonServed = useGame((s) => s.salonServed);
  const salonShiftDone = useGame((s) => s.salonShiftDone);

  const [shiftNo] = useState(() => shifts + 1);
  const wishes = useRef(salonOrders(shiftNo, SALON_MENU)).current;
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('wash');
  const [foam, setFoam] = useState<boolean[]>(() => Array(WASH_BUBBLES).fill(true));
  const [look, setLook] = useState<Partial<SalonLook>>({});
  const [part, setPart] = useState<Part>('style');
  const [wrong, setWrong] = useState<Part[] | null>(null);
  const [tries, setTries] = useState(0);
  const [earned, setEarned] = useState(0);
  const [cheer, setCheer] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const want = wishes[idx];
  const client = REGULARS[(shiftNo * 2 + idx + 3) % REGULARS.length];
  // The client arrives with a different style and color than the card asks for.
  const startStyle = SALON_MENU.styles[(SALON_MENU.styles.indexOf(want.style) + 1) % SALON_MENU.styles.length];
  const startColor = SALON_MENU.colors[(SALON_MENU.colors.indexOf(want.color) + 2) % SALON_MENU.colors.length];
  const have: SalonLook = { style: look.style ?? startStyle, color: look.color ?? startColor, accessory: look.accessory ?? '' };

  const dressed = (l: Partial<SalonLook>, base: { appearance: Appearance; outfit: Outfit }) => {
    const appearance = { ...base.appearance, hairStyle: l.style ?? startStyle, hairColor: l.color ?? startColor };
    const acc = l.accessory ? wearable(l.accessory) : undefined;
    const { headwear: _h, ...rest } = base.outfit;
    return { appearance, outfit: acc ? equip(rest, acc) : rest };
  };
  const now = dressed(look, client);
  const target = dressed(want, client);

  const scrub = (i: number) => {
    if (phase !== 'wash' || !foam[i]) return;
    play('pop');
    const next = foam.map((f, j) => (j === i ? false : f));
    setFoam(next);
    if (next.every((f) => !f)) {
      play('chime');
      timer.current = window.setTimeout(() => setPhase('style'), 600);
    }
  };

  const pick = (p: Part, id: string) => {
    play('swap');
    setLook((l) => ({ ...l, [p]: id }));
    setWrong(null);
  };

  const showMirror = () => {
    const check = checkLook(want, have);
    setTries((n) => n + 1);
    if (!check.correct) {
      play('soft');
      setWrong(check.wrong);
      setPart(check.wrong[0]);
      return;
    }
    play('chime');
    const coins = salonServed(tries === 0);
    setEarned((e) => e + coins);
    setCheer(tries === 0 ? `Perfect! +${coins}` : `Lovely! +${coins}`);
    setPhase('mirror');
  };

  const nextClient = () => {
    play('pop');
    setCheer(null);
    if (idx + 1 >= CLIENTS_PER_SHIFT) {
      setEarned((e) => e + salonShiftDone());
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPhase('wash');
    setFoam(Array(WASH_BUBBLES).fill(true));
    setLook({});
    setWrong(null);
    setTries(0);
    setPart('style');
  };

  const options: { id: string; label: string }[] =
    part === 'style'
      ? SALON_MENU.styles.map((id) => ({ id, label: styleName(id) }))
      : part === 'color'
        ? SALON_MENU.colors.map((id) => ({ id, label: colorName(id) }))
        : SALON_MENU.accessories.map((id) => ({ id, label: accName(id) }));
  const sticker = client;

  return (
    <section className="scene" aria-label="Glam Salon" style={{ background: '#FFE3EE' }}>
      <div className="scene-art">
        <SalonBackdrop />
      </div>
      <ActivityBar title="Glam Salon" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="salon-progress">
          {Math.min(idx + 1, CLIENTS_PER_SHIFT)}/{CLIENTS_PER_SHIFT}
        </span>
      </ActivityBar>
      <div className="salon-stage">
        <div key={idx} className="customer-in salon-client" data-testid="salon-client">
          <Character
            appearance={now.appearance}
            outfit={now.outfit}
            crop="40 0 320 400"
            title={client.name}
            pose={phase === 'mirror' ? 'wave' : 'idle'}
          />
          <svg viewBox="40 0 320 400" className="salon-overlay" aria-hidden="true">
            <Cape />
          </svg>
          {phase === 'wash' && (
            <svg viewBox="40 0 320 400" className="salon-overlay salon-foam" role="group" aria-label="Foam to wash off">
              {BUBBLE_SPOTS.map(([x, y], i) =>
                foam[i] ? (
                  <g
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-label={`Wash foam ${i + 1}`}
                    data-testid={`foam-${i}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => scrub(i)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrub(i)}
                  >
                    <circle cx={x} cy={y} r={44} fill="transparent" />
                    <Foam x={x} y={y} />
                  </g>
                ) : null,
              )}
            </svg>
          )}
        </div>
        <div className="panel bubble salon-card" data-testid="salon-card" data-want={JSON.stringify(want)}>
          <b>{client.name} wants:</b>
          <div className="salon-card-body">
            <div className="face">
              <Character
                appearance={target.appearance}
                outfit={target.outfit}
                crop="100 20 200 200"
                animate={false}
                title="The style card"
              />
            </div>
            <ul>
              <li>{styleName(want.style)}</li>
              <li>{colorName(want.color)}</li>
              <li>{accName(want.accessory)}</li>
            </ul>
          </div>
        </div>
        {wrong && phase === 'style' && (
          <p role="status" className="panel salon-wrong" data-testid="salon-wrong">
            Almost! Check the {list(wrong.map((w) => PART_LABEL[w].toLowerCase()))} on the card.
          </p>
        )}
        {cheer && (
          <div className="hearts" style={{ left: '8%', top: '4%', zIndex: 6 }} key={`${idx}-cheer`}>
            💖{' '}
            <span className="panel" style={{ fontSize: '1rem', padding: '4px 10px' }}>
              {cheer}
            </span>
          </div>
        )}
      </div>

      <div className="tray" style={{ flex: '0 0 auto' }}>
        {phase === 'wash' && (
          <p style={{ margin: 0, textAlign: 'center', fontWeight: 800 }} data-testid="salon-hint">
            Tap the foam to wash it away! ({foam.filter((f) => !f).length}/{WASH_BUBBLES})
          </p>
        )}
        {phase === 'style' && (
          <>
            <Tabs<Part>
              label="Hair choices"
              value={part}
              onChange={(p) => (play('pop'), setPart(p))}
              tabs={(['style', 'color', 'accessory'] as Part[]).map((p) => ({
                id: p,
                label: wrong?.includes(p) ? `${PART_LABEL[p]} ●` : PART_LABEL[p],
              }))}
            />
            <div className="chip-row wrap" role="group" aria-label={PART_LABEL[part]} style={{ justifyContent: 'center' }}>
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="chip"
                  aria-pressed={have[part] === o.id}
                  data-testid={`salon-opt-${o.id}`}
                  onClick={() => pick(part, o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button tone="primary" icon="sparkle" onClick={showMirror} testId="salon-mirror">
                Show the mirror!
              </Button>
            </div>
          </>
        )}
        {phase === 'mirror' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button tone="primary" icon="star" onClick={nextClient} testId="salon-next">
              {idx + 1 >= CLIENTS_PER_SHIFT ? 'Finish shift' : 'Next client'}
            </Button>
          </div>
        )}
      </div>

      {done && (
        <div className="card-center card-low" role="dialog" aria-label="Salon shift complete">
          <div className="panel pop-in" data-testid="salon-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Salon shift done!
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Icon name="coin" />+{earned} coins
            </p>
            <div className="face" style={{ width: 88, height: 88 }}>
              <FriendFace id={sticker.id} />
            </div>
            <p style={{ margin: 0 }}>
              <b>{sticker.name}:</b> “{sticker.thanks}”
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Every shift pays {SALON_SHIFT_BONUS} extra, and each client {clientPay(false)}–{clientPay(true)}.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button onClick={() => (play('pop'), setScene('town'))} testId="salon-leave">
                Back to town
              </Button>
              <Button tone="primary" icon="sparkle" onClick={onAgain} testId="salon-again">
                Another shift
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
