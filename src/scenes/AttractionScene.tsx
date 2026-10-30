// Paid attractions (game-systems §31): Storybook Kingdom near Paris and the Boardwalk Funfair near New York.
// A day pass at the gate, a hub with three tappable rides, a passport that fills with stamps, prizes for
// some rides, and a finale when the passport is full. Rides are in Rides.tsx.
import { useState } from 'react';
import { FunfairHub, StorybookHub } from '../art/scenes/Attractions';
import { SouvenirArt } from '../art/travel';
import { ATTRACTION_TEXT, RIDE_TEXT } from '../content/trips';
import { souvenir } from '../content/travel';
import { ATTRACTION_FEE, attraction, stampKey, stopStars, type AttractionId } from '../game/trips';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';
import { LightsRide, StopRide, WishRide } from './Rides';

type View = { at: 'gate' } | { at: 'hub' } | { at: 'ride'; ride: string } | { at: 'done'; ride: string; stars: number | null };

export function AttractionScene({ id }: { id: AttractionId }) {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const coins = useGame((s) => s.save.wallet.coins);
  const stamps = useGame((s) => s.save.progress.travel.stamps);
  const enterAttraction = useGame((s) => s.enterAttraction);
  const finishRide = useGame((s) => s.finishRide);
  const [view, setView] = useState<View>({ at: 'gate' });
  const [prizes, setPrizes] = useState<{ prize: string | null; finale: string | null; first: boolean }>({
    prize: null,
    finale: null,
    first: false,
  });
  const def = attraction(id)!;
  const text = ATTRACTION_TEXT[id];
  const complete = def.rides.every((r) => stamps.includes(stampKey(id, r.id)));
  const missing = Math.max(0, ATTRACTION_FEE - coins);

  const finish = (ride: string, stars: number | null) => {
    const r = finishRide(id, ride);
    setPrizes({ prize: r.prize, finale: r.finale, first: r.first });
    setView({ at: 'done', ride, stars });
  };

  const back = () => {
    if (view.at === 'ride') setView({ at: 'hub' });
    else if (view.at === 'done') setView({ at: 'hub' });
    else setScene(text.back);
  };

  const Hub = id === 'storybook' ? StorybookHub : FunfairHub;
  const open = (ride: string) => {
    play('pop');
    setView({ at: 'ride', ride });
  };

  return (
    <section className="scene" aria-label={text.name} style={{ background: id === 'storybook' ? '#9ED8FF' : '#8EC9FF' }}>
      <ActivityBar title={text.name} onBack={back} />
      {view.at !== 'ride' && (
        <>
          <div className="passport panel" data-testid="passport" aria-label="Passport stamps">
            {def.rides.map((r) => {
              const got = stamps.includes(stampKey(id, r.id));
              return (
                <span key={r.id} className="stamp" data-got={got} data-testid={`stamp-${r.id}`}>
                  <span aria-hidden="true">{got ? '★' : '○'}</span> {RIDE_TEXT[stampKey(id, r.id)].name}
                </span>
              );
            })}
          </div>
          <div className="park-stage" {...(view.at === 'gate' ? { inert: true } : {})} data-testid="park-stage">
            <Hub stamps={stamps} lit={complete} onTap={(spot: string) => open(spot)} />
          </div>
        </>
      )}
      {view.at === 'hub' && (
        <p
          className="panel"
          style={{ margin: '8px 12px 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}
          data-testid="park-line"
        >
          {complete
            ? 'Your passport is full! Ride anything again, it is always free here.'
            : 'Tap a ride to play it. Every ride gives a stamp!'}
        </p>
      )}
      {view.at === 'ride' && (
        <div className="ride-wrap" data-testid="ride-view">
          <h2 className="display ride-title">{RIDE_TEXT[stampKey(id, view.ride)].name}</h2>
          {(() => {
            const r = def.rides.find((x) => x.id === view.ride)!;
            const key = stampKey(id, view.ride);
            if (r.kind === 'stop') return <StopRide key={key} rideKey={key} onDone={(hits) => finish(view.ride, stopStars(hits))} />;
            if (r.kind === 'lights') return <LightsRide key={key} rideKey={key} onDone={() => finish(view.ride, null)} />;
            return <WishRide key={key} onDone={() => finish(view.ride, null)} />;
          })()}
        </div>
      )}
      {view.at === 'gate' && (
        <div className="card-center card-low" role="dialog" aria-label="Day pass">
          <div
            className="panel pop-in"
            data-testid="gate-card"
            style={{ display: 'grid', gap: 8, justifyItems: 'center', textAlign: 'center' }}
          >
            <p className="display" style={{ fontSize: '1.4rem', margin: 0 }}>
              {text.name}
            </p>
            <p style={{ margin: 0, fontWeight: 800 }}>{text.place}</p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{text.gate}</p>
            <span className="price-tag">
              <Icon name="coin" />
              {ATTRACTION_FEE}
            </span>
            <Button
              tone="primary"
              icon="coin"
              disabledReason={missing > 0 ? `You need ${missing} more coins for the day pass.` : undefined}
              testId="gate-pay"
              onClick={() => {
                if (enterAttraction(id)) {
                  play('chime');
                  showToast('Welcome! Have a wonderful day.', 'sparkle');
                  setView({ at: 'hub' });
                }
              }}
            >
              Buy a day pass
            </Button>
            <Button onClick={() => setScene(text.back)} testId="gate-leave">
              {text.backLabel}
            </Button>
          </div>
        </div>
      )}
      {view.at === 'done' && (
        <div className="card-center card-low" role="dialog" aria-label="Ride complete">
          <div
            className="panel pop-in"
            data-testid="ride-done"
            style={{ display: 'grid', gap: 8, justifyItems: 'center', textAlign: 'center' }}
          >
            <p className="display" style={{ fontSize: '1.5rem', margin: 0 }}>
              {prizes.finale ? 'Grand finale!' : 'Ride complete!'}
            </p>
            {view.stars !== null && (
              <p style={{ margin: 0, fontSize: '1.6rem' }} aria-label={`${view.stars} stars`} data-testid="ride-stars">
                {'★'.repeat(view.stars)}
                {'☆'.repeat(3 - view.stars)}
              </p>
            )}
            <p style={{ margin: 0, fontWeight: 800 }}>
              {prizes.first ? 'A new stamp in your passport!' : 'Your stamp is already in your passport.'}
            </p>
            {[prizes.prize, prizes.finale].map((sid) => {
              const d = sid ? souvenir(sid) : undefined;
              return d ? (
                <div key={d.id} className="prize" data-testid={`prize-${d.id}`}>
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <SouvenirArt kind={d.art} color={d.color} />
                  </svg>
                  <b>{d.name}</b>
                </div>
              ) : null;
            })}
            {prizes.finale && <p style={{ margin: 0 }}>The whole park lights up for you tonight!</p>}
            <Button tone="primary" onClick={() => (play('pop'), setView({ at: 'hub' }))} testId="ride-back">
              Back to the park
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
