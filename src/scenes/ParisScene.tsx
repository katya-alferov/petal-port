// Paris (game-systems §7.2): five friendly hotspots. The photo spot opens photo mode and the
// kiosk sells three souvenirs; the rest are just for fun.
import { useRef, useState } from 'react';
import { ParisBackdrop, type ParisSpot } from '../art/scenes/Paris';
import { SouvenirArt } from '../art/travel';
import { SOUVENIRS } from '../content/travel';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

export function ParisScene() {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const player = useGame((s) => s.save.player);
  const coins = useGame((s) => s.save.wallet.coins);
  const souvenirs = useGame((s) => s.save.progress.travel.souvenirs);
  const buySouvenir = useGame((s) => s.buySouvenir);
  const [kiosk, setKiosk] = useState(false);
  const [painting, setPainting] = useState(0);
  const [flap, setFlap] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const tap = (id: ParisSpot) => {
    if (id === 'photo') {
      play('pop');
      setScene('photo');
    } else if (id === 'kiosk') {
      play('pop');
      setKiosk(true);
    } else if (id === 'cafe') {
      play('chime');
      showToast('Ding! The waiter waves hello.', 'sparkle');
    } else if (id === 'pigeon') {
      play('soft');
      setFlap(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setFlap(false), 700);
      showToast('Coo coo! The pigeon flutters.', 'sparkle');
    } else {
      play('pop');
      const next = Math.min(5, painting + 1);
      setPainting(next);
      showToast(next >= 5 ? 'The painter finished a tiny tower painting!' : 'The painter adds a stroke.', 'sparkle');
    }
  };

  return (
    <section className="scene" aria-label="Paris" style={{ background: '#FFD9B0' }}>
      <ActivityBar title="Paris" onBack={() => setScene('town')} />
      <div className="paris-stage">
        <ParisBackdrop onTap={tap} painting={painting} pigeon={flap} />
        <div className="paris-doll" aria-hidden="true">
          <Character appearance={player.appearance} outfit={player.outfit} pose="wave" title="You" />
        </div>
      </div>
      <p className="panel" style={{ margin: '0 12px 10px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}>
        Tap the painted star on the path to take a photo!
      </p>
      {kiosk && (
        <Sheet title="Souvenir kiosk" onClose={() => setKiosk(false)}>
          <div className="item-grid" style={{ marginBottom: 8 }} data-testid="kiosk-card">
            {SOUVENIRS.filter((d) => d.price > 0).map((d) => {
              const own = souvenirs.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  className="shop-tile"
                  data-testid={`souvenir-${d.id}`}
                  aria-disabled={!own && coins < d.price}
                  onClick={() => {
                    if (own) {
                      showToast('It is already on your souvenir shelf.', 'sparkle');
                    } else if (buySouvenir(d.id)) {
                      play('chime');
                      showToast(`${d.name} is yours!`, 'sparkle');
                    } else {
                      play('soft');
                      showToast(`You need ${d.price - coins} more coins.`, 'sparkle');
                    }
                  }}
                >
                  <span className="thumb">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <SouvenirArt kind={d.art} color={d.color} />
                    </svg>
                  </span>
                  {d.name}
                  {own ? (
                    <span className="owned">Yours</span>
                  ) : (
                    <span className="price-tag">
                      <Icon name="coin" />
                      {d.price}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Sheet>
      )}
    </section>
  );
}
