import { useRef, useState } from 'react';
import { Waterfront } from '../art/scenes/Waterfront';
import { play, unlockAudio } from '../platform/audio';
import { APP_VERSION } from '../platform/version';
import { useGame } from '../state/store';

export function TitleScene({ onOpenDebug }: { onOpenDebug: () => void }) {
  const setScene = useGame((s) => s.setScene);
  const ready = useGame((s) => s.ready);
  const [sailing, setSailing] = useState(false);
  const press = useRef<number | undefined>(undefined);

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
        <Waterfront sailing={sailing} />
      </div>
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
        <button
          type="button"
          className="caption"
          data-testid="version-label"
          aria-label={`Version ${APP_VERSION}. Grown-ups: press and hold for the debug log.`}
          onPointerDown={() => {
            press.current = window.setTimeout(onOpenDebug, 900);
          }}
          onPointerUp={() => window.clearTimeout(press.current)}
          onPointerLeave={() => window.clearTimeout(press.current)}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            marginTop: 14,
            background: 'rgba(255,247,236,0.85)',
            border: 'none',
            borderRadius: 999,
            padding: '4px 12px',
            color: 'var(--ink)',
            font: 'inherit',
            fontSize: '0.9375rem',
            minHeight: 32,
          }}
        >
          {APP_VERSION}
        </button>
      </div>
    </section>
  );
}
