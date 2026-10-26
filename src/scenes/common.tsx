import { useMemo } from 'react';
import { CharacterRig, type CharacterRigProps } from '../art/CharacterRig';
import { FURN_ART } from '../art/furn';
import { resolveFurniture, resolveRig } from '../content/resolve';
import type { WearSlot } from '../content/types';
import type { Appearance, Outfit } from '../game/save';
import { CoinPill, Dock, IconButton } from '../ui/kit';
import { useGame, type SceneId } from '../state/store';
import { play } from '../platform/audio';

const DOCK = [
  { id: 'town', label: 'Town', icon: 'map' },
  { id: 'me', label: 'Me', icon: 'closet' },
  { id: 'home', label: 'Home', icon: 'home' },
];

export function TopBar({ title }: { title: string }) {
  const coins = useGame((s) => s.save.wallet.coins);
  return (
    <header className="top-bar">
      <h1 className="panel scene-title-chip" style={{ margin: 0 }}>
        {title}
      </h1>
      <CoinPill coins={coins} />
    </header>
  );
}

export function MainDock({ current }: { current: SceneId }) {
  const setScene = useGame((s) => s.setScene);
  return (
    <Dock
      items={DOCK}
      current={current}
      onSelect={(id) => {
        play('pop');
        setScene(id as SceneId);
      }}
    />
  );
}

/** Resolves appearance + outfit into colors, then draws the rig. */
export function Character({ appearance, outfit, ...rest }: { appearance: Appearance; outfit: Outfit } & Omit<CharacterRigProps, 'spec'>) {
  const spec = useMemo(() => resolveRig(appearance, outfit), [appearance, outfit]);
  return <CharacterRig spec={spec} {...rest} />;
}

/** Top bar for activities: a back button instead of the dock (activities are full-screen). */
export function ActivityBar({ title, onBack, children }: { title: string; onBack: () => void; children?: React.ReactNode }) {
  const coins = useGame((s) => s.save.wallet.coins);
  return (
    <header className="activity-bar">
      <IconButton icon="back" label="Back" onClick={onBack} testId="activity-back" />
      <h1 className="panel scene-title-chip" style={{ margin: 0, fontSize: '1.1rem' }}>
        {title}
      </h1>
      <span className="grow" />
      {children}
      <CoinPill coins={coins} />
    </header>
  );
}

export function FurnitureThumb({ id }: { id: string }) {
  const spec = resolveFurniture(id);
  const Art = spec && FURN_ART[spec.art];
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={spec?.name}>
      {Art && <Art main={spec.main} accent={spec.accent} />}
    </svg>
  );
}

/** Thumbnail crop of the rig (viewBox) that frames each wear slot. */
export const SLOT_CROP: Record<WearSlot, string> = {
  top: '90 200 220 220',
  bottom: '80 370 240 240',
  dress: '60 210 280 380',
  outerwear: '80 200 240 260',
  shoes: '130 650 140 140',
  headwear: '60 0 280 240',
  eyewear: '110 80 180 130',
  neck: '120 180 160 160',
  bag: '140 220 160 240',
};
