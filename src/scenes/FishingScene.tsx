// Fishing Dock (game-systems §26): cast, wait for the splash, reel in. An early or late tap only means "cast
// again". Every catch pays a little, and the next fish is always a new one until the aquarium is full.
import { useEffect, useRef, useState } from 'react';
import { DockArt, FishArt } from '../art/scenes/Fishing';
import { FISH_NAMES } from '../content/studio';
import { BITE_MS, biteDelay, FISH_IDS } from '../game/fishing';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

type Phase = 'idle' | 'wait' | 'bite' | 'result' | 'missed';

export function FishingScene() {
  const setScene = useGame((s) => s.setScene);
  const player = useGame((s) => s.save.player);
  const fs = useGame((s) => s.save.progress.fishing);
  const catchFish = useGame((s) => s.catchFish);
  const [phase, setPhase] = useState<Phase>('idle');
  const [note, setNote] = useState('Tap Cast to throw your line!');
  const [got, setGot] = useState<{ fish: string; coins: number; isNew: boolean } | null>(null);
  const [tank, setTank] = useState(false);
  const cast = useRef(fs.catches);
  const timers = useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const doCast = () => {
    clear();
    play('pop');
    cast.current += 1;
    setGot(null);
    setPhase('wait');
    setNote('Wait for the splash…');
    timers.current.push(
      window.setTimeout(() => {
        play('soft');
        setPhase('bite');
        setNote('Splash! Reel in now!');
        timers.current.push(
          window.setTimeout(() => {
            setPhase('missed');
            setNote('It swam away. Cast again!');
          }, BITE_MS),
        );
      }, biteDelay(cast.current)),
    );
  };

  const reel = () => {
    if (phase === 'wait') {
      clear();
      setPhase('idle');
      setNote('Too early! Wait for the splash, then reel in.');
      return;
    }
    if (phase !== 'bite') return;
    clear();
    const r = catchFish();
    play('chime');
    setGot(r);
    setPhase('result');
    setNote(r.isNew ? `A new fish: ${FISH_NAMES[r.fish]}!` : `You caught a ${FISH_NAMES[r.fish]}!`);
  };

  return (
    <section className="scene" aria-label="Fishing Dock" style={{ background: '#CDEBFF' }}>
      <div className="scene-art">
        <DockArt phase={phase} />
      </div>
      <ActivityBar title="Fishing Dock" onBack={() => setScene('town')}>
        <span className="panel salon-count" data-testid="fish-count">
          {fs.fish.length}/{FISH_IDS.length}
        </span>
      </ActivityBar>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }} data-testid="fish-stage" data-phase={phase}>
        <div style={{ position: 'absolute', left: '0%', bottom: '2%', height: 'min(58%, 300px)', aspectRatio: '320 / 470', zIndex: 2 }}>
          <Character
            appearance={player.appearance}
            outfit={player.outfit}
            crop="40 0 320 470"
            pose={phase === 'result' ? 'cheer' : 'idle'}
            title="You"
          />
        </div>
        {got && (
          <div className="panel pop-in fish-card" data-testid="fish-card" data-fish={got.fish}>
            <div className="fish-big">
              <FishArt id={got.fish} />
            </div>
            <b>{FISH_NAMES[got.fish]}</b>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontWeight: 800 }}>
              <Icon name="coin" />+{got.coins}
            </span>
          </div>
        )}
      </div>
      <p
        className="panel"
        role="status"
        style={{ margin: '0 12px 8px', textAlign: 'center', fontWeight: 800, position: 'relative', zIndex: 3 }}
        data-testid="fish-note"
      >
        {note}
      </p>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={() => (play('pop'), setTank(true))} testId="fish-tank" icon="album">
            My fish
          </Button>
          {phase === 'wait' || phase === 'bite' ? (
            <Button tone="primary" icon="wave" onClick={reel} testId="fish-reel">
              Reel in!
            </Button>
          ) : (
            <Button tone="primary" icon="star" onClick={doCast} testId="fish-cast">
              {phase === 'idle' ? 'Cast!' : 'Cast again'}
            </Button>
          )}
        </div>
      </div>
      {tank && (
        <Sheet title={`My fish: ${fs.fish.length} of ${FISH_IDS.length}`} onClose={() => setTank(false)}>
          <div className="tank-grid" data-testid="tank">
            {FISH_IDS.map((f) => {
              const have = fs.fish.includes(f);
              return (
                <div key={f} className="tank-cell" data-have={have} data-testid={`tank-${f}`}>
                  <FishArt id={f} dim={!have} />
                  <span>{have ? FISH_NAMES[f] : '?'}</span>
                </div>
              );
            })}
          </div>
        </Sheet>
      )}
    </section>
  );
}
