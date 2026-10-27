// Home cooking (game-systems §4): add → mix → pour → heat → (fold) → decorate. Nothing can fail.
import { useEffect, useRef, useState } from 'react';
import { BowlArt, DishArt, dishKind, KitchenIcon, PanArt, toppingTop, WhiskIcon, type Cook } from '../art/kitchen';
import { kitchenItem, recipeName, RECIPES } from '../content/recipes';
import { doneness, isRecipeUnlocked, MAX_DECORATIONS, stars as starsFor, type Doneness, type RecipeDef } from '../game/cooking';
import type { DishTopping } from '../game/save';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, ProgressRing } from '../ui/kit';
import { ActivityBar, ShellSpots } from './common';

const MIX_TAPS = 6;
const POUR_MS = 1600;

export function KitchenScene() {
  const setScene = useGame((s) => s.setScene);
  const recipes = useGame((s) => s.save.progress.recipes);
  const [recipe, setRecipe] = useState<RecipeDef | null>(null);
  const [run, setRun] = useState(0);

  if (!recipe)
    return (
      <section className="scene" aria-label="Kitchen" style={{ background: 'linear-gradient(#DFF5EC, #FFF7EC 60%)' }}>
        <ShellSpots scene="kitchen" />
        <ActivityBar title="Kitchen" onBack={() => setScene('home')} />
        <div style={{ padding: 16, display: 'grid', gap: 14, alignContent: 'start' }}>
          <h2 className="display" style={{ fontSize: '1.5rem' }}>
            What shall we cook?
          </h2>
          {RECIPES.map((r) => {
            const rec = recipes[r.id];
            const open = isRecipeUnlocked(r, recipes);
            return (
              <button
                key={r.id}
                type="button"
                className="shop-tile"
                style={{
                  gridTemplateColumns: '110px 1fr',
                  justifyItems: 'start',
                  alignItems: 'center',
                  textAlign: 'left',
                  padding: 10,
                  fontSize: '1rem',
                }}
                data-testid={`recipe-${r.id}`}
                aria-disabled={!open}
                onClick={() => {
                  if (!open) {
                    play('soft');
                    useGame.getState().showToast(`Cook ${recipeName(r.unlockAfter)} first to learn ${r.name}!`, 'pan');
                    return;
                  }
                  play('chime');
                  setRecipe(r);
                }}
              >
                <svg viewBox="0 40 300 160" style={{ width: 110, opacity: open ? 1 : 0.35 }} aria-hidden="true">
                  <DishArt recipe={r.id} cook="golden" toppings={[]} />
                </svg>
                <span style={{ display: 'grid', gap: 4 }}>
                  <b style={{ fontSize: '1.15rem' }}>{r.name}</b>
                  <span className="stars" style={{ fontSize: '1.4rem' }} aria-label={`${rec?.stars ?? 0} of 3 stars`}>
                    {'★'.repeat(rec?.stars ?? 0)}
                    <span style={{ opacity: 0.25 }}>{'★'.repeat(3 - (rec?.stars ?? 0))}</span>
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {open
                      ? rec
                        ? `Cooked ${rec.cooked}×`
                        : 'New! +20 coins the first time'
                      : `🔒 Cook ${recipeName(r.unlockAfter)} once to unlock`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );

  return <Cooking key={run} recipe={recipe} onAgain={() => setRun((n) => n + 1)} onPick={() => setRecipe(null)} />;
}

function Cooking({ recipe, onAgain, onPick }: { recipe: RecipeDef; onAgain: () => void; onPick: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const cookDone = useGame((s) => s.cookDone);
  const [step, setStep] = useState(0);
  const [added, setAdded] = useState<string[]>([]);
  const [wrongAdds, setWrongAdds] = useState(0);
  const [bounce, setBounce] = useState<string | null>(null);
  const [mixTaps, setMixTaps] = useState(0);
  const [pour, setPour] = useState(0);
  const [heatStart, setHeatStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Doneness | null>(null);
  const [folds, setFolds] = useState(0);
  const [toppings, setToppings] = useState<DishTopping[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [finish, setFinish] = useState<{ stars: 1 | 2 | 3; coins: number } | null>(null);
  const pourTimer = useRef<number | null>(null);
  const poured = useRef(false);

  const s = recipe.steps[step];
  const kind = dishKind(recipe.id);
  // Advances only from the step that asked, so extra taps can never skip a step.
  const next = () => {
    const from = step;
    setStep((n) => (n === from ? n + 1 : n));
  };

  // Heat: start the clock when the step begins, tick while waiting for Flip.
  useEffect(() => {
    if (s.type !== 'heat' || result) return;
    const t0 = performance.now();
    setHeatStart(t0);
    setNow(t0);
    const id = window.setInterval(() => setNow(performance.now()), 100);
    return () => window.clearInterval(id);
  }, [s.type, result]);

  const heatSecs = heatStart ? (now - heatStart) / 1000 : 0;
  const liveCook: Cook =
    result ??
    (s.type === 'heat' ? (heatSecs < recipe.golden[0] ? 'raw' : doneness(heatSecs, recipe.golden)) : s.type === 'pour' ? 'raw' : 'raw');

  const addItem = (id: string) => {
    const want = s.items ?? [];
    if (want.includes(id) && !added.includes(id)) {
      play('pop');
      const nextAdded = [...added, id];
      setAdded(nextAdded);
      if (want.every((w) => nextAdded.includes(w))) window.setTimeout(next, 500);
    } else if (!want.includes(id)) {
      play('soft');
      setWrongAdds((n) => n + 1);
      setBounce(id);
      window.setTimeout(() => setBounce(null), 500);
    }
  };

  const whisk = () => {
    if (mixTaps >= MIX_TAPS) return;
    play('swap');
    const n = mixTaps + 1;
    setMixTaps(n);
    if (n >= MIX_TAPS) window.setTimeout(next, 400);
  };

  const startPour = () => {
    if (poured.current || pourTimer.current) return;
    const start = performance.now() - pour * POUR_MS;
    pourTimer.current = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / POUR_MS);
      setPour(p);
      if (p >= 1) stopPour();
    }, 50);
  };
  const stopPour = () => {
    if (poured.current) return;
    poured.current = true;
    if (pourTimer.current) window.clearInterval(pourTimer.current);
    pourTimer.current = null;
    // A quick tap auto-pours to the ring; a long hold that stops early is fine too (§4.2: can't fail).
    setPour(1);
    play('pop');
    window.setTimeout(next, 500);
  };

  const flip = () => {
    if (result) return;
    const d = doneness(heatSecs, recipe.golden);
    setResult(d);
    play(d === 'golden' ? 'chime' : 'pop');
    window.setTimeout(next, 1400);
  };

  const fold = () => {
    if (folds >= 2) return;
    play('swap');
    const n = folds + 1;
    setFolds(n);
    if (n >= 2) window.setTimeout(next, 500);
  };

  const place = (x: number, y: number, id = chosen) => {
    if (!id || toppings.length >= MAX_DECORATIONS) return;
    play('pop');
    setToppings([...toppings, { id, x, y }]);
  };

  const done = () => {
    const st = starsFor(wrongAdds, result ?? 'golden');
    const coins = cookDone({ recipeId: recipe.id, doneness: result ?? 'golden', toppings }, st);
    play('chime');
    setFinish({ stars: st, coins });
  };

  const stepNames: Record<string, string> = { add: 'Add', mix: 'Mix', pour: 'Pour', heat: 'Cook', fold: 'Fold', decorate: 'Decorate' };
  const cookLine =
    result === 'pale' ? 'A bit pale, still tasty!' : result === 'golden' ? 'Golden! ✨' : result === 'toasty' ? 'Extra toasty!' : null;

  return (
    <section className="scene" aria-label={`Cooking ${recipe.name}`} style={{ background: 'linear-gradient(#DFF5EC, #FFF7EC 60%)' }}>
      <ActivityBar title={recipe.name} onBack={() => setScene('home')} />
      <ol className="steps" aria-label="Steps">
        {recipe.steps.map((st, i) => (
          <li key={i} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : ''}>
            {i < step ? '✓' : i + 1} {stepNames[st.type]}
          </li>
        ))}
      </ol>
      <div
        style={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', position: 'relative', padding: '0 12px' }}
        data-testid={`step-${s.type}`}
      >
        {(s.type === 'add' || s.type === 'mix') && (
          <svg
            viewBox="0 0 300 220"
            style={{ width: '86%' }}
            role="img"
            aria-label="Mixing bowl"
            className={s.type === 'mix' && mixTaps ? 'squash' : undefined}
            key={mixTaps}
          >
            <BowlArt count={added.length} mix={s.type === 'mix' ? mixTaps / MIX_TAPS : 0} />
          </svg>
        )}
        {(s.type === 'pour' || s.type === 'heat' || s.type === 'fold') && (
          <div style={{ width: '90%', display: 'grid', justifyItems: 'center', gap: 6 }}>
            <svg viewBox="0 0 300 220" style={{ width: '100%' }} role="img" aria-label="Frying pan">
              <PanArt
                size={s.type === 'pour' ? pour : 1}
                cook={liveCook}
                bubbles={s.type === 'heat' && !result && heatSecs >= recipe.golden[0]}
                folded={folds}
                kind={kind}
              />
            </svg>
            {s.type === 'heat' && !result && (
              <span className="panel" role="status" style={{ padding: '4px 12px', fontWeight: 800 }}>
                {heatSecs < recipe.golden[0]
                  ? 'Sizzle… watch for bubbles!'
                  : heatSecs < recipe.golden[1]
                    ? 'Bubbles! Flip now! ✨'
                    : 'Getting toasty!'}
              </span>
            )}
            {cookLine && (
              <span className="panel pop-in" role="status" style={{ padding: '4px 12px', fontWeight: 800 }} data-testid="cook-result">
                {cookLine}
              </span>
            )}
          </div>
        )}
        {s.type === 'decorate' && (
          <svg
            viewBox="0 40 300 160"
            style={{ width: '96%', cursor: chosen ? 'copy' : 'default' }}
            role="img"
            aria-label="Your dish. Tap a topping, then tap the dish."
            data-testid="dish"
            onClick={(e) => {
              const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 300;
              const y = 40 + ((e.clientY - r.top) / r.height) * 160;
              place(Math.max(0, Math.min(1, (x - 80) / 140)), Math.max(0, Math.min(1, (y - toppingTop(kind)) / 30)));
            }}
          >
            <DishArt recipe={recipe.id} cook={result ?? 'golden'} toppings={toppings} />
          </svg>
        )}
      </div>

      <div className="tray">
        {s.type === 'add' && (
          <>
            <p style={{ fontWeight: 800, margin: 0 }}>
              Put in:{' '}
              {(s.items ?? []).map((id) => (
                <span key={id} style={{ marginRight: 8, opacity: added.includes(id) ? 0.5 : 1 }}>
                  {added.includes(id) ? '✓' : '○'} {kitchenItem(id)?.name}
                </span>
              ))}
            </p>
            <div className="jar-row" role="group" aria-label="Shelf">
              {recipe.shelf.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`jar ${bounce === id ? 'wrong' : ''}`}
                  aria-pressed={added.includes(id)}
                  onClick={() => addItem(id)}
                  data-testid={`ing-${id}`}
                >
                  <KitchenIcon id={id} />
                  {kitchenItem(id)?.name}
                </button>
              ))}
            </div>
            {bounce && (
              <p role="status" style={{ margin: 0 }}>
                Boing! That doesn’t go in {recipe.name.toLowerCase()}.
              </p>
            )}
          </>
        )}
        {s.type === 'mix' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <button type="button" className="jar" style={{ width: 110 }} onClick={whisk} data-testid="whisk">
              <WhiskIcon />
              Tap to whisk!
            </button>
            <ProgressRing value={mixTaps / MIX_TAPS} size={56} />
          </div>
        )}
        {s.type === 'pour' && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ justifySelf: 'center' }}
            data-testid="pour"
            onPointerDown={startPour}
            onPointerUp={stopPour}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), stopPour())}
          >
            Hold to pour (or tap)
          </button>
        )}
        {s.type === 'heat' && (
          <span style={{ justifySelf: 'center' }}>
            <Button tone="primary" onClick={result ? undefined : flip} testId="flip">
              {result ? 'Flipped!' : 'Flip!'}
            </Button>
          </span>
        )}
        {s.type === 'fold' && (
          <span style={{ justifySelf: 'center' }}>
            <Button tone="primary" onClick={fold} testId="fold">
              {folds === 0 ? 'Fold in half' : 'Fold again'}
            </Button>
          </span>
        )}
        {s.type === 'decorate' && (
          <>
            <div className="jar-row" role="group" aria-label="Toppings">
              {recipe.toppings.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="jar"
                  aria-pressed={chosen === id}
                  data-testid={`deco-${id}`}
                  onClick={() => {
                    play('pop');
                    setChosen(id);
                    // Tapping a topping also drops one on the dish, so younger kids never get stuck.
                    place(0.1 + ((0.3 + toppings.length * 0.618) % 1) * 0.8, 0.15 + ((0.5 + toppings.length * 0.382) % 1) * 0.7, id);
                  }}
                >
                  <KitchenIcon id={id} />
                  {kitchenItem(id)?.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={() => (play('swap'), setToppings(toppings.slice(0, -1)))} testId="deco-undo">
                Undo
              </Button>
              <span style={{ fontWeight: 800 }}>
                {toppings.length}/{MAX_DECORATIONS}
              </span>
              <Button tone="primary" onClick={done} testId="deco-done">
                Ta-da!
              </Button>
            </div>
          </>
        )}
      </div>

      {finish && (
        <div className="card-center" role="dialog" aria-label="Dish done">
          <div className="panel pop-in" data-testid="cook-card">
            <p className="display" style={{ fontSize: '1.6rem' }}>
              Ta-da!
            </p>
            <svg viewBox="0 40 300 160" style={{ width: '80%' }} aria-hidden="true">
              <DishArt recipe={recipe.id} cook={result ?? 'golden'} toppings={toppings} />
            </svg>
            <div className="stars" aria-label={`${finish.stars} of 3 stars`}>
              {'★'.repeat(finish.stars)}
              <span style={{ opacity: 0.25 }}>{'★'.repeat(3 - finish.stars)}</span>
            </div>
            <p style={{ margin: 0 }}>
              {finish.stars < 2
                ? 'Tip: only the recipe things go in the bowl.'
                : finish.stars < 3
                  ? 'Tip: flip when the bubbles appear for golden!'
                  : 'Perfect chef!'}
            </p>
            {finish.coins > 0 && <p style={{ fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>+{finish.coins} coins</p>}
            <p style={{ margin: 0 }}>Your dish is on your table at home.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button onClick={onPick} testId="cook-other">
                Recipes
              </Button>
              <Button onClick={onAgain} testId="cook-again">
                Cook again
              </Button>
              <Button tone="primary" onClick={() => setScene('home')} testId="cook-home">
                See it at home
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
