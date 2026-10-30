// New York (game-systems §31): a sunset street with a taxi, a snack cart, a street musician and the harbour
// statue far away. A ferry button leads to the Boardwalk Funfair. Original stylized drawing.
import { useRef, useState } from 'react';
import { NewYorkArt, type NySpot } from '../art/scenes/Attractions';
import { SouvenirArt } from '../art/travel';
import { SOUVENIRS } from '../content/travel';
import { play, playNote } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character } from './common';

const RIFF = [392, 440, 523, 440, 392, 330];

export function NewYorkScene() {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const player = useGame((s) => s.save.player);
  const coins = useGame((s) => s.save.wallet.coins);
  const souvenirs = useGame((s) => s.save.progress.travel.souvenirs);
  const buySouvenir = useGame((s) => s.buySouvenir);
  const [cart, setCart] = useState(false);
  const [torch, setTorch] = useState(false);
  const [cabGo, setCabGo] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const tap = (id: NySpot) => {
    if (id === 'statue') {
      play('chime');
      setTorch((t) => !t);
      showToast(torch ? 'The torch rests.' : 'The torch glows over the harbour!', 'sparkle');
    } else if (id === 'cab') {
      play('pop');
      setCabGo(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCabGo(false), 1700);
      showToast('Beep beep! The yellow cab zooms off.', 'sparkle');
    } else if (id === 'cart') {
      play('pop');
      setCart(true);
    } else if (id === 'musician') {
      RIFF.forEach((f, i) => window.setTimeout(() => playNote(f), i * 220));
      showToast('♪ The saxophone plays a happy tune.', 'sparkle');
    } else {
      play('pop');
      setScene('funfair');
    }
  };

  return (
    <section className="scene" aria-label="New York" style={{ background: '#FFD9A8' }}>
      <ActivityBar title="New York" onBack={() => setScene('town')} />
      <div className="paris-stage">
        <NewYorkArt onTap={tap} torch={torch} cabGo={cabGo} />
        <div className="paris-doll" aria-hidden="true" style={{ left: '37%', height: '38%' }}>
          <Character appearance={player.appearance} outfit={player.outfit} pose="wave" title="You" />
        </div>
      </div>
      <p className="panel" style={{ margin: '0 12px 8px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}>
        Tap the cab, the cart or the musician. Or catch the ferry to the funfair!
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px 12px' }}>
        <Button tone="primary" icon="star" onClick={() => (play('chime'), setScene('funfair'))} testId="ny-ferry">
          Ferry to the Funfair
        </Button>
      </div>
      {cart && (
        <Sheet title="Snack cart" onClose={() => setCart(false)}>
          <div className="item-grid" style={{ marginBottom: 8 }} data-testid="cart-card">
            {SOUVENIRS.filter((d) => d.price > 0 && d.place === 'newyork').map((d) => {
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
