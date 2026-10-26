// Paw Parlour (game-systems §8.1): adopt one pet for free, then buy it accessories.
import { useState } from 'react';
import { PET_ACCESSORIES, PET_COLORS, PET_KINDS, petKind } from '../content/pets';
import { priceOf } from '../content/wearables';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, PetThumb, ShellSpots } from './common';

type Step = 'kind' | 'color' | 'name';

export function PetShopScene() {
  const setScene = useGame((s) => s.setScene);
  const pet = useGame((s) => s.save.progress.pet);
  return (
    <section className="scene" aria-label="Paw Parlour" style={{ background: 'linear-gradient(#FFE3C9, #FFF7EC 60%)' }}>
      <ShellSpots scene="petshop" />
      <ActivityBar title="Paw Parlour" onBack={() => setScene('town')} />
      {pet ? <Accessories /> : <Adopt />}
    </section>
  );
}

function Adopt() {
  const adoptPet = useGame((s) => s.adoptPet);
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const [step, setStep] = useState<Step>('kind');
  const [kind, setKind] = useState(PET_KINDS[0].id);
  const [color, setColor] = useState(PET_COLORS[0].id);
  const [name, setName] = useState('');
  const [hop, setHop] = useState(0);
  const k = petKind(kind);

  const cheer = () => (play('pop'), setHop((n) => n + 1));

  return (
    <>
      {/* Speech bubble sits above the pet in the flow so it never covers the ears. */}
      <div style={{ flex: '0 0 36%', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 16px 0' }}>
        <div className="panel bubble" style={{ position: 'relative', alignSelf: 'stretch', textAlign: 'center', marginBottom: 18 }}>
          {step === 'kind'
            ? 'Every pet here needs a loving home. Who will you take home?'
            : step === 'color'
              ? 'Pick a fur color!'
              : 'What’s their name?'}
        </div>
        <div key={hop} className="pet-hop" style={{ flex: 1, minHeight: 0, aspectRatio: '1' }} data-testid="adopt-preview">
          <PetThumb pet={{ kind, color, accessory: null }} label={k.name} mood={hop ? 'happy' : 'idle'} />
        </div>
      </div>
      <div className="tray" style={{ flex: 1, minHeight: 0, alignContent: 'start', gap: 12 }}>
        <ol className="steps" aria-label="Adoption steps">
          {(['kind', 'color', 'name'] as Step[]).map((s, i) => (
            <li key={s} aria-current={s === step ? 'step' : undefined}>
              {i + 1}. {s === 'kind' ? 'Pet' : s === 'color' ? 'Color' : 'Name'}
            </li>
          ))}
        </ol>
        {step === 'kind' && (
          <div className="item-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {PET_KINDS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="shop-tile"
                aria-pressed={kind === p.id}
                data-testid={`adopt-kind-${p.id}`}
                onClick={() => (setKind(p.id), cheer())}
              >
                <span className="thumb">
                  <PetThumb pet={{ kind: p.id, color, accessory: null }} label={p.name} />
                </span>
                {p.name}
              </button>
            ))}
          </div>
        )}
        {step === 'color' && (
          <div className="item-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {PET_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="shop-tile"
                aria-pressed={color === c.id}
                data-testid={`adopt-color-${c.id}`}
                onClick={() => (setColor(c.id), cheer())}
              >
                <span className="thumb">
                  <PetThumb pet={{ kind, color: c.id, accessory: null }} label={c.name} />
                </span>
                {c.name}
              </button>
            ))}
          </div>
        )}
        {step === 'name' && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="chip-row" role="group" aria-label="Name ideas">
              {k.names.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="chip"
                  aria-pressed={name === n}
                  data-testid={`adopt-name-${n}`}
                  onClick={() => (setName(n), cheer())}
                >
                  {n}
                </button>
              ))}
            </div>
            <label style={{ display: 'grid', gap: 4, fontWeight: 800 }}>
              Or type a name
              <input
                className="text-input"
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value)}
                data-testid="adopt-name-input"
                autoComplete="off"
              />
            </label>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 'auto' }}>
          {step !== 'kind' && (
            <Button onClick={() => (play('pop'), setStep(step === 'name' ? 'color' : 'kind'))} testId="adopt-back">
              Back
            </Button>
          )}
          {step !== 'name' ? (
            <Button tone="primary" onClick={() => (play('pop'), setStep(step === 'kind' ? 'color' : 'name'))} testId="adopt-next">
              Next
            </Button>
          ) : (
            <Button
              tone="primary"
              icon="paw"
              testId="adopt-done"
              disabledReason={name.trim() ? undefined : 'Pick or type a name first'}
              onClick={() => {
                adoptPet(kind, color, name.trim());
                play('chime');
                showToast(`Welcome home, ${name.trim()}!`, 'heart');
                setScene('pet');
              }}
            >
              Take me home!
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function Accessories() {
  const save = useGame((s) => s.save);
  const buy = useGame((s) => s.buy);
  const setPetAccessory = useGame((s) => s.setPetAccessory);
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const pet = save.progress.pet!;
  const [picked, setPicked] = useState<string | null>(null);
  const def = PET_ACCESSORIES.find((a) => a.id === picked);
  const price = def ? (priceOf(def) ?? 0) : 0;
  const owned = picked ? Boolean(save.inventory.owned[picked]) : false;
  const short = price - save.wallet.coins;

  return (
    <>
      {/* Top padding keeps the pet's ears clear of toasts. */}
      <div style={{ flex: '0 0 38%', minHeight: 0, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '64px 12px 8px' }}>
        <div style={{ width: '46%', maxHeight: '100%', aspectRatio: '1' }} data-testid="petshop-preview">
          <PetThumb pet={{ ...pet, accessory: picked ?? pet.accessory }} label={pet.name} mood={picked ? 'happy' : 'idle'} />
        </div>
        <div className="panel" style={{ flex: 1, display: 'grid', gap: 8, justifyItems: 'start' }}>
          {def ? (
            <>
              <b style={{ fontSize: '1.1rem' }}>{def.name}</b>
              {owned ? (
                <Button
                  tone="confirm"
                  testId="petshop-wear"
                  onClick={() => (play('swap'), setPetAccessory(def.id), showToast(`${pet.name} looks adorable!`, 'heart'))}
                >
                  Put it on
                </Button>
              ) : (
                <>
                  <span className="price-tag">
                    <Icon name="coin" />
                    {price}
                  </span>
                  <Button
                    tone="primary"
                    testId="petshop-buy"
                    disabledReason={short > 0 ? `${short} more coins. Work at the café!` : undefined}
                    onClick={() => {
                      if (!buy(def.id)) return;
                      play('chime');
                      setPetAccessory(def.id);
                      showToast(`It’s yours! ${def.name}`, 'sparkle');
                    }}
                  >
                    Buy
                  </Button>
                </>
              )}
            </>
          ) : (
            <span>Hi {pet.name}! Tap an accessory to try it on.</span>
          )}
        </div>
      </div>
      <div className="tray" style={{ flex: 1, minHeight: 0, gridTemplateRows: 'auto minmax(0, 1fr) auto' }}>
        <h2 className="display" style={{ margin: 0, fontSize: '1.2rem' }}>
          Accessories
        </h2>
        <div className="scroll-y">
          <div className="item-grid">
            {PET_ACCESSORIES.map((a) => (
              <button
                key={a.id}
                type="button"
                className="shop-tile"
                aria-pressed={picked === a.id}
                data-testid={`petshop-${a.id}`}
                onClick={() => (play('pop'), setPicked(a.id))}
              >
                <span className="thumb">
                  <PetThumb pet={{ ...pet, accessory: a.id }} label={a.name} />
                </span>
                {a.name}
                {save.inventory.owned[a.id] ? (
                  <span className="owned">{pet.accessory === a.id ? 'Wearing' : 'Owned'}</span>
                ) : (
                  <span className="price-tag">
                    <Icon name="coin" />
                    {priceOf(a)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button tone="primary" icon="paw" testId="petshop-visit" onClick={() => (play('pop'), setScene('pet'))}>
            Visit {pet.name}
          </Button>
        </div>
      </div>
    </>
  );
}
