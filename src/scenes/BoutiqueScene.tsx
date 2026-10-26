// Ribbon Boutique (game-systems §6.4): try anything on for free, buy with coins, wear or place it right away.
import { useMemo, useState } from 'react';
import { FURNITURE } from '../content/furniture';
import type { FurnitureDef, WearableDef, WearSlot } from '../content/types';
import { priceOf, WEARABLES } from '../content/wearables';
import { equip } from '../game/wardrobe';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, GlamBackdrop, Tabs } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character, FurnitureThumb, SLOT_CROP } from './common';

type Dept = 'clothes' | 'home';
const SLOT_ORDER: WearSlot[] = ['dress', 'top', 'bottom', 'outerwear', 'shoes', 'headwear', 'neck', 'bag'];
const PLAIN = { top: { itemId: 'top.long-tee' }, bottom: { itemId: 'bottom.wide-trousers' }, shoes: { itemId: 'shoes.sneakers' } };

const forSale = <T extends WearableDef | FurnitureDef>(list: T[]) =>
  list.filter((d) => priceOf(d) !== null).sort((a, b) => (priceOf(a) ?? 0) - (priceOf(b) ?? 0));

function Price({ value }: { value: number }) {
  return (
    <span className="price-tag">
      <Icon name="coin" />
      {value}
    </span>
  );
}

export function BoutiqueScene() {
  const setScene = useGame((s) => s.setScene);
  const save = useGame((s) => s.save);
  const buy = useGame((s) => s.buy);
  const setOutfit = useGame((s) => s.setOutfit);
  const placeFurniture = useGame((s) => s.placeFurniture);
  const showToast = useGame((s) => s.showToast);
  const [dept, setDept] = useState<Dept>('clothes');
  const [picked, setPicked] = useState<string | null>(null);

  const clothes = useMemo(() => forSale(WEARABLES).sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot)), []);
  const homeItems = useMemo(() => forSale(FURNITURE), []);
  const { appearance, outfit } = save.player;
  const pickedWear = WEARABLES.find((w) => w.id === picked);
  const pickedFurn = FURNITURE.find((f) => f.id === picked);
  const pickedDef = pickedWear ?? pickedFurn;
  const price = pickedDef ? (priceOf(pickedDef) ?? 0) : 0;
  const owned = picked ? Boolean(save.inventory.owned[picked]) : false;
  const preview = pickedWear ? equip(outfit, pickedWear) : outfit;
  const short = price - save.wallet.coins;

  const onBuy = () => {
    if (!picked || !buy(picked)) return;
    play('chime');
    showToast(`It’s yours! ${pickedDef?.name}`, 'sparkle');
    if (pickedWear) setOutfit(equip(outfit, pickedWear));
  };

  return (
    <section className="scene" aria-label="Ribbon Boutique" style={{ background: 'linear-gradient(#FFD6E6, #FFF0F6 55%)' }}>
      <ActivityBar title="Ribbon Boutique" onBack={() => setScene('town')} />
      <div style={{ position: 'relative', flex: '0 0 38%', display: 'flex', alignItems: 'stretch', gap: 8, padding: '0 12px' }}>
        <GlamBackdrop />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 0,
            height: 26,
            borderRadius: 999,
            background: '#F7B6CF',
            border: '3px solid #5B4A6E',
          }}
        />
        <div style={{ height: '100%', aspectRatio: '1 / 2', position: 'relative' }} data-testid="boutique-preview">
          {pickedFurn ? (
            <div style={{ position: 'absolute', inset: '20% -40% 8% 0' }}>
              <FurnitureThumb id={pickedFurn.id} />
            </div>
          ) : (
            <Character appearance={appearance} outfit={preview} title="Trying it on" />
          )}
        </div>
        <div className="panel" style={{ flex: 1, alignSelf: 'center', display: 'grid', gap: 8, justifyItems: 'start' }}>
          {pickedDef ? (
            <>
              <b style={{ fontSize: '1.1rem' }} data-testid="picked-name">
                {pickedDef.name}
              </b>
              {owned ? <span>You own this!</span> : <Price value={price} />}
              {owned ? (
                pickedWear ? (
                  <Button tone="confirm" onClick={() => (play('swap'), setOutfit(preview))} testId="boutique-wear">
                    Wear it
                  </Button>
                ) : (
                  <Button
                    tone="confirm"
                    onClick={() => (
                      play('swap'),
                      placeFurniture(pickedFurn!.slot, pickedFurn!.id),
                      showToast('Placed in your home!', 'home')
                    )}
                    testId="boutique-place"
                  >
                    Put in my home
                  </Button>
                )
              ) : (
                <Button
                  tone="primary"
                  onClick={onBuy}
                  testId="boutique-buy"
                  disabledReason={short > 0 ? `${short} more coins. Work at the café!` : undefined}
                >
                  Buy
                </Button>
              )}
            </>
          ) : (
            <span>Tap anything to try it on. Trying is free!</span>
          )}
        </div>
      </div>
      <div className="tray" style={{ flex: 1, minHeight: 0, gridTemplateRows: 'auto 1fr' }}>
        <Tabs<Dept>
          label="Departments"
          value={dept}
          onChange={(d) => (play('pop'), setDept(d), setPicked(null))}
          tabs={[
            { id: 'clothes', label: 'Clothes' },
            { id: 'home', label: 'Home' },
          ]}
        />
        <div className="scroll-y">
          <div className="item-grid">
            {(dept === 'clothes' ? clothes : homeItems).map((d) => (
              <button
                key={d.id}
                type="button"
                className="shop-tile"
                aria-pressed={picked === d.id}
                data-testid={`shop-${d.id}`}
                onClick={() => (play('pop'), setPicked(d.id))}
              >
                <span className="thumb">
                  {d.type === 'wearable' ? (
                    <Character appearance={appearance} outfit={equip(PLAIN, d)} crop={SLOT_CROP[d.slot]} animate={false} title={d.name} />
                  ) : (
                    <FurnitureThumb id={d.id} />
                  )}
                </span>
                {d.name}
                {save.inventory.owned[d.id] ? <span className="owned">Owned</span> : <Price value={priceOf(d) ?? 0} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
