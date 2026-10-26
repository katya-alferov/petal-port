// Starlight Stage (game-systems §9.1): pick a theme, dress from your wardrobe, walk the runway,
// and three friends judge. Stars come only from pieces that fit the theme; every walk earns a star.
import { useEffect, useRef, useState } from 'react';
import { Runway } from '../art/scenes/Runway';
import type { PoseId } from '../art/CharacterRig';
import { REGULARS, regular } from '../content/cafe';
import { SHOW_THEMES } from '../content/show';
import type { WearableDef } from '../content/types';
import { WEARABLES, wearable } from '../content/wearables';
import { FIRST_STARS_BONUS, fits, fitting, judgesFor, SHOW_PAY, showStars, themeFor } from '../game/show';
import { equip, unequip } from '../game/wardrobe';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character, FriendFace, SLOT_CROP, ShellSpots } from './common';

type Step = 'theme' | 'dress' | 'walk' | 'result';
const PLAIN = { top: { itemId: 'top.long-tee' }, bottom: { itemId: 'bottom.wide-trousers' }, shoes: { itemId: 'shoes.sneakers' } };
const FALLBACK = { top: { itemId: 'top.sailor-tee' }, bottom: { itemId: 'bottom.a-line-skirt' } };
const SLOT_ORDER = ['dress', 'top', 'bottom', 'outerwear', 'shoes', 'headwear', 'eyewear', 'neck', 'bag'];
const PRAISE = ['I love the {item}!', 'That {item} is perfect for {theme}!', 'Ooh, the {item}! So pretty!'];
const KIND = ['What a fun walk!', 'You looked so happy up there!', 'Tip: {theme} loves {loves} clothes!'];
const TITLES = { 1: 'Lovely walk!', 2: 'Super stylish!', 3: 'Fabulous!' } as const;

function Stars({ n, label }: { n: number; label?: string }) {
  return (
    <span className="show-stars" aria-label={label ?? `${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} data-on={i <= n} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export function ShowScene() {
  const save = useGame((s) => s.save);
  const setScene = useGame((s) => s.setScene);
  const setOutfit = useGame((s) => s.setOutfit);
  const showDone = useGame((s) => s.showDone);
  const [skip, setSkip] = useState(0);
  const [step, setStep] = useState<Step>('theme');
  const [revealed, setRevealed] = useState(0);
  const [pose, setPose] = useState<PoseId>('wave');
  const [reward, setReward] = useState<{ coins: number; firstStars: boolean } | null>(null);
  // The walk is frozen when it starts: finishing a show moves the theme list along.
  const [walked, setWalked] = useState<{ themeIdx: number; stars: 1 | 2 | 3; judges: string[]; fit: string[] } | null>(null);
  const timers = useRef<number[]>([]);

  const done = save.progress.shows.done;
  const theme = walked ? SHOW_THEMES[walked.themeIdx] : themeFor(done, skip, SHOW_THEMES);
  const { appearance, outfit } = save.player;
  const worn = Object.values(outfit)
    .map((e) => e && wearable(e.itemId))
    .filter((w): w is WearableDef => Boolean(w));
  const fit = fitting(worn, theme);
  const stars = showStars(fit.length);
  const judges = judgesFor(
    done,
    REGULARS.map((r) => r.id),
  );
  const best = save.progress.shows.best[theme.id] ?? 0;

  const wardrobe = WEARABLES.filter((w) => save.inventory.owned[w.id]).sort(
    (a, b) => Number(fits(b, theme)) - Number(fits(a, theme)) || SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot),
  );
  const canFit = new Set(wardrobe.filter((w) => fits(w, theme)).map((w) => w.slot)).size;

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const toggle = (w: WearableDef) => {
    play('swap');
    const on = outfit[w.slot]?.itemId === w.id;
    setOutfit(on ? unequip(outfit, w.slot, FALLBACK) : equip(outfit, w));
  };

  const walk = () => {
    setWalked({ themeIdx: SHOW_THEMES.indexOf(theme), stars, judges, fit: fit.map((w) => w.name) });
    play('chime');
    setStep('walk');
    setPose('idle');
    setRevealed(0);
    later(1800, () => (setPose('hips'), play('pop')));
    for (let i = 1; i <= judges.length; i++) later(1900 + i * 700, () => (setRevealed(i), play('soft')));
    later(1900 + judges.length * 700 + 900, () => {
      setReward(showDone(theme.id, stars));
      setPose('cheer');
      play('chime');
      setStep('result');
    });
  };

  const line = (i: number) => {
    const names = walked?.fit ?? [];
    const item = names.length ? names[i % names.length] : '';
    const tpl = names.length ? PRAISE[i % PRAISE.length] : KIND[i % KIND.length];
    return tpl.replace('{item}', item).replace('{theme}', theme.name).replace('{loves}', theme.loves.join(' or '));
  };

  const next = () => {
    play('pop');
    setSkip(0);
    setReward(null);
    setWalked(null);
    setPose('wave');
    setStep('theme');
  };

  const onStage = step === 'walk' || step === 'result';

  return (
    <section className="scene" aria-label="Starlight Stage" style={{ background: '#3A2E4F' }}>
      <ActivityBar title="Starlight Stage" onBack={() => setScene('town')} />
      <div className="show-stage" data-on-stage={onStage} style={{ flex: onStage ? 1 : step === 'theme' ? '0 0 46%' : '0 0 40%' }}>
        <div className="scene-art">
          <Runway light={theme.color} />
        </div>
        <div
          key={step === 'walk' ? 'walk' : 'still'}
          className={`show-doll${step === 'walk' ? ' runway-walk' : ''}`}
          data-testid="show-doll"
        >
          <Character appearance={appearance} outfit={outfit} pose={pose} title="You on the runway" />
        </div>
        {step !== 'walk' && step !== 'result' && <ShellSpots scene="show" />}
        {onStage && (
          <div className="judges" aria-live="polite">
            {judges.map((id, i) => (
              <div key={id} className="panel judge-card" data-show={i < revealed || step === 'result'} data-testid={`judge-${i}`}>
                <div className="face">
                  <FriendFace id={id} />
                </div>
                <Stars n={stars} label={`${regular(id)?.name}: ${stars} stars`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {step === 'theme' && (
        <div className="tray" style={{ flex: 1, minHeight: 0, gridTemplateRows: 'minmax(0, 1fr) auto' }}>
          <div className="scroll-y" style={{ display: 'grid', alignContent: 'start', gap: 8 }}>
            <h2 className="display show-theme" style={{ margin: 0, borderColor: theme.color }} data-testid="show-theme-name">
              <small>Today’s theme</small>
              {theme.name}
            </h2>
            <p style={{ margin: 0 }}>{theme.blurb}</p>
            <p style={{ margin: 0, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              Judges love
              {theme.loves.map((l) => (
                <span key={l} className="chip" style={{ minHeight: 0, padding: '2px 10px' }}>
                  ✨ {l}
                </span>
              ))}
              {best > 0 && (
                <>
                  · Best <Stars n={best} />
                </>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button onClick={() => (play('pop'), setSkip((n) => n + 1))} testId="show-another">
              New theme
            </Button>
            <Button tone="primary" icon="closet" onClick={() => (play('pop'), setStep('dress'))} testId="show-dress">
              Get dressed!
            </Button>
          </div>
        </div>
      )}

      {step === 'dress' && (
        <div className="tray" style={{ flex: 1, minHeight: 0, gridTemplateRows: 'auto minmax(0, 1fr) auto' }}>
          <div className="show-meter" data-testid="show-meter" data-stars={stars}>
            <b>{theme.name}</b>
            <Stars n={stars} />
            <span>
              {stars === 3
                ? 'The judges will love this!'
                : canFit > fit.length
                  ? `Wear ${(stars === 1 ? 2 : 4) - fit.length} more ✨ piece${(stars === 1 ? 2 : 4) - fit.length === 1 ? '' : 's'} for ${stars + 1} stars.`
                  : `Find more ${theme.loves.join(' or ')} clothes at the Ribbon Boutique!`}
            </span>
          </div>
          <div className="scroll-y">
            <div className="item-grid">
              {wardrobe.map((w) => {
                const on = outfit[w.slot]?.itemId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    className="shop-tile"
                    aria-pressed={on}
                    data-testid={`show-item-${w.id}`}
                    onClick={() => toggle(w)}
                  >
                    <span className="thumb">
                      <Character appearance={appearance} outfit={equip(PLAIN, w)} crop={SLOT_CROP[w.slot]} animate={false} title={w.name} />
                    </span>
                    {w.name}
                    {fits(w, theme) && <span className="owned show-fit">✨ Theme</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button tone="primary" icon="star" onClick={walk} testId="show-walk">
              Walk the runway!
            </Button>
          </div>
        </div>
      )}

      {step === 'result' && reward && (
        <div className="card-center card-low" role="dialog" aria-label="Show results">
          <div
            className="panel pop-in"
            data-testid="show-result"
            data-stars={stars}
            style={{ display: 'grid', gap: 8, justifyItems: 'center' }}
          >
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              {TITLES[stars]}
            </p>
            <Stars n={stars} />
            <ul className="judge-lines">
              {judges.map((id, i) => (
                <li key={id}>
                  <b>{regular(id)?.name}:</b> “{line(i)}”
                </li>
              ))}
            </ul>
            <p style={{ margin: 0, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="price-tag">
                <Icon name="coin" />+{reward.coins}
              </span>
              {reward.firstStars && <span>Includes a +{FIRST_STARS_BONUS} first-time 3-star bonus!</span>}
              {!reward.firstStars && stars < 3 && <span>3 stars pays {SHOW_PAY[3]}.</span>}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button onClick={() => (play('pop'), setScene('town'))} testId="show-done">
                Back to town
              </Button>
              <Button tone="primary" icon="star" onClick={next} testId="show-again">
                Another show!
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
