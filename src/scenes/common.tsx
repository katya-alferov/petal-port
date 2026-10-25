import { useMemo } from 'react';
import { CharacterRig, type CharacterRigProps } from '../art/CharacterRig';
import { resolveRig } from '../content/resolve';
import type { Appearance, Outfit } from '../game/save';
import { CoinPill, Dock } from '../ui/kit';
import { useGame, type SceneId } from '../state/store';
import { play } from '../platform/audio';

const DOCK = [
  { id: 'me', label: 'Me', icon: 'closet' },
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'gallery', label: 'Gallery', icon: 'palette' },
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
