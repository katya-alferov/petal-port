import { useRef, useState } from 'react';
import { BOARDWALK_Y, Waterfront } from '../art/scenes/Waterfront';
import { play, unlockAudio } from '../platform/audio';
import { APP_VERSION } from '../platform/version';
import { useGame } from '../state/store';
import { GlamBackdrop } from '../ui/kit';
import { Character } from './common';

const DOLL_H = 960;
const DOLL_X = 880;

export function TitleScene({ onOpenDebug }: { onOpenDebug: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const ready = useGame((s) => s.ready);
  const [sailing, setSailing] = useState(false);
  const press = useRef<number | undefined>(undefined);
  const player = useGame((s) => s.save.player);

  const start = () => {
    if (!ready || sailing) return;
    unlockAudio();
    play('chime');
    setSailing(true);
    // New players make their character first; returning players land in town.
    const first = !useGame.getState().save.progress.journey.includes('journey.character');
    window.setTimeout(() => setScene(first ? 'me' : 'town'), 700);
  };

  return (
    <section className="scene" aria-label="Title">
      <div className="scene-art">
        <Waterfront sailing={sailing}>
          {/* The player waves from the boardwalk, feet on the planks above the start button. */}
          <g aria-hidden="true">
            <Character
              appearance={player.appearance}
              outfit={player.outfit}
              pose="wave"
              title=""
              frame={{ x: DOLL_X - DOLL_H / 4, y: BOARDWALK_Y + 200 - DOLL_H * 0.975, width: DOLL_H / 2, height: DOLL_H }}
            />
          </g>
        </Waterfront>
      </div>
      <GlamBackdrop />
      <div className="safe" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="panel pop-in" style={{ marginTop: '9vh', textAlign: 'center', padding: '18px 28px', transform: 'rotate(-2deg)' }}>
          <h1 className="logo">
            Petal<span>port</span>
          </h1>
          <p style={{ margin: '6px 0 0', fontWeight: 800 }}>Your pocket seaside town</p>
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="btn btn-primary tap-hint" onClick={start} data-testid="title-start" aria-disabled={!ready}>
          {ready ? 'Tap to start' : 'Loading…'}
        </button>
        <div style={{ height: 'max(14px, env(safe-area-inset-bottom))' }} />
      </div>
      {/* Grown-ups only: a quiet version tag; press and hold opens the debug log. */}
      <button
        type="button"
        className="version-tag"
        data-testid="version-label"
        data-version={APP_VERSION}
        aria-label={`Version ${APP_VERSION}. Grown-ups: press and hold for the debug log.`}
        onPointerDown={() => {
          press.current = window.setTimeout(onOpenDebug, 900);
        }}
        onPointerUp={() => window.clearTimeout(press.current)}
        onPointerLeave={() => window.clearTimeout(press.current)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {APP_VERSION.replace(/^(v\d+\.\d+)\..*$/, '$1')}
      </button>
    </section>
  );
}
