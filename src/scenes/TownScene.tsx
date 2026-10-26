import { useEffect, useRef, useState } from 'react';
import { MAP_H, PLACE_Y, TownMap, type PlaceId } from '../art/scenes/TownMap';
import { JOURNEY_COINS, JOURNEY_STEPS } from '../content/recipes';
import { WEARABLES, priceOf } from '../content/wearables';
import { play } from '../platform/audio';
import { currentWeek, liveState, useGame, type SceneId } from '../state/store';
import { Button, IconButton, Sheet } from '../ui/kit';
import { isReady } from '../game/requests';
import { regular } from '../content/cafe';
import { Character, FurnitureThumb, MainDock, PetFigure, SLOT_CROP, TopBar, useFindShell } from './common';
import { shellsIn } from '../content/show';
import { letterWaiting, type LetterDef } from '../game/mail';
import { stage } from '../game/garden';
import { seasonFor } from '../game/season';
import { SeasonDrift } from '../art/Season';

const PLACES: Record<PlaceId, { name: string; line: string; go?: SceneId; soon?: string }> = {
  boutique: { name: 'Ribbon Boutique', line: 'New clothes and things for your home. Try them on first!', go: 'boutique' },
  cafe: { name: 'Sunny Café', line: 'Make drinks for customers and earn coins.', go: 'cafe' },
  home: { name: 'Harbour Loft', line: 'Your cozy home. Cook, decorate and relax.', go: 'home' },
  airport: { name: 'Airport', line: 'Fly to faraway places and take photos.', soon: 'Paris trips are coming soon!' },
  park: { name: 'Petal Park', line: 'The ducks say quack! Picnics are coming soon.', soon: 'Picnics are coming soon!' },
  cottage: { name: 'Meadow Cottage', line: 'Your neighbour’s cottage on the hill.', soon: 'Nobody is home right now.' },
  petshop: { name: 'Paw Parlour', line: 'Adopt a pet friend, and find cute accessories for them.', go: 'petshop' },
  board: { name: 'Petal Notes', line: 'Townsfolk pin notes here when they need a hand. Help them and make friends!', go: 'board' },
  postbox: { name: 'Post Box', line: 'Friends send a letter every week.' },
  salon: { name: 'Glam Salon', line: 'Wash and style your clients’ hair, then show them the mirror!', go: 'salon' },
  garden: { name: 'Petal Garden', line: 'Plant free seeds. They grow every time you finish something fun!', go: 'garden' },
  stage: { name: 'Starlight Stage', line: 'Dress up for a theme, walk the runway, and wow the judges!', go: 'show' },
};

let lastScroll: number | null = null;

export function TownScene() {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const coins = useGame((s) => s.save.wallet.coins);
  const owned = useGame((s) => s.save.inventory.owned);
  const [open, setOpen] = useState<PlaceId | null>(null);
  const [journey, setJourney] = useState(false);
  const journeyDone = useGame((s) => s.save.progress.journey);
  const scroller = useRef<HTMLDivElement>(null);
  const save = useGame((s) => s.save);
  const openMail = useGame((s) => s.openMail);
  const [letter, setLetter] = useState<{ letter: LetterDef; gift: { item: string } | { coins: number } } | null>(null);
  const mailWaiting = letterWaiting(save.progress.mail, currentWeek());
  const findShell = useFindShell();
  const bloomsReady = save.progress.garden.beds.some((b) => b && stage(b.growth) === 'bloom');
  const noteReady = save.progress.requests.board.some((n) => isReady(n, liveState(save)));

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // First visit centers on Home (§5.1); later visits keep where the player was.
    el.scrollTop = lastScroll ?? (PLACE_Y.home / MAP_H) * el.scrollHeight - el.clientHeight / 2;
    return () => {
      lastScroll = el.scrollTop;
    };
  }, []);

  const affordableNew = WEARABLES.some((w) => !owned[w.id] && (priceOf(w) ?? Infinity) <= coins);
  const place = open ? PLACES[open] : null;

  return (
    <section className="scene" aria-label="Town" style={{ background: '#A5DDB4' }}>
      <div ref={scroller} className="map-scroll" data-testid="map-scroll">
        <TownMap
          badges={{
            cafe: 'coin',
            boutique: affordableNew ? 'new' : undefined,
            petshop: save.progress.pet ? undefined : 'new',
            board: noteReady || save.progress.requests.made === 0 ? 'new' : undefined,
            postbox: mailWaiting ? 'new' : undefined,
            stage: save.progress.shows.done === 0 ? 'new' : undefined,
            salon: save.progress.salon.shifts === 0 ? 'new' : undefined,
            garden: bloomsReady ? 'new' : save.progress.garden.beds.every((b) => b === null) ? 'new' : undefined,
          }}
          bloomsReady={bloomsReady}
          shells={shellsIn('town').filter((sh) => !save.progress.shells.includes(sh.id))}
          onShell={findShell}
          mail={mailWaiting}
          pet={save.progress.pet && <PetFigure pet={save.progress.pet} mood="happy" />}
          onTap={(id) => {
            play('pop');
            setOpen(id);
          }}
          onCat={() => {
            play('chime');
            showToast('Mrrrow! The cat likes you.', 'sparkle');
          }}
        />
      </div>
      <SeasonDrift season={seasonFor(new Date().getMonth())} />
      <TopBar title="Petalport" />
      <div style={{ position: 'relative', zIndex: 5, padding: '0 12px', alignSelf: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton icon="flag" label="Welcome Journey" onClick={() => (play('pop'), setJourney(true))} testId="journey-open" />
          <IconButton icon="album" label="Sticker Album" onClick={() => (play('pop'), setScene('album'))} testId="album-open" />
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <MainDock current="town" />
      {journey && (
        <Sheet title="Welcome Journey" onClose={() => setJourney(false)}>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 8 }} data-testid="journey-list">
            {JOURNEY_STEPS.map((st) => {
              const done = journeyDone.includes(st.id);
              return (
                <li
                  key={st.id}
                  className="panel"
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    background: done ? '#DFF5EC' : '#fff',
                    boxShadow: 'none',
                    borderWidth: 2,
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{done ? '✅' : '⬜'}</span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{st.label}</span>
                  <span style={{ fontWeight: 800 }}>{done ? 'Done!' : `+${JOURNEY_COINS}`}</span>
                </li>
              );
            })}
          </ul>
          <p style={{ margin: 0 }}>Do them in any order. There’s no rush!</p>
        </Sheet>
      )}
      {open === 'postbox' && (
        <Sheet title="Post Box" onClose={() => (setOpen(null), setLetter(null))}>
          {letter ? (
            <div className="letter pop-in" data-testid="letter">
              <p style={{ marginTop: 0 }}>Dear friend,</p>
              <p>{letter.letter.text}</p>
              <p style={{ textAlign: 'right' }}>Love, {regular(letter.letter.from)?.name}</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                {'item' in letter.gift ? (
                  <>
                    <div style={{ width: 90, height: 90 }}>
                      <GiftThumb id={letter.gift.item} />
                    </div>
                    <b>You got a gift!</b>
                  </>
                ) : (
                  <b>You got {letter.gift.coins} coins!</b>
                )}
              </div>
            </div>
          ) : mailWaiting ? (
            <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
              <p style={{ margin: 0 }}>A letter is waiting for you!</p>
              <Button
                tone="primary"
                icon="mail"
                testId="mail-open"
                onClick={() => {
                  const r = openMail();
                  if (!r) return;
                  play('chime');
                  setLetter(r);
                }}
              >
                Open the letter
              </Button>
            </div>
          ) : (
            <p style={{ margin: 0 }} data-testid="mail-empty">
              No new letter yet. Friends write once a week, and your letter will wait here for you. You’ve read {save.progress.mail.opened}{' '}
              {save.progress.mail.opened === 1 ? 'letter' : 'letters'}.
            </p>
          )}
        </Sheet>
      )}
      {place && open && open !== 'postbox' && (
        <Sheet title={place.name} onClose={() => setOpen(null)}>
          <p style={{ marginBottom: 16 }}>{place.line}</p>
          <Button
            tone="primary"
            testId="place-go"
            disabledReason={place.soon}
            onClick={() => {
              play('chime');
              setOpen(null);
              if (place.go) setScene(place.go);
            }}
          >
            Go!
          </Button>
        </Sheet>
      )}
    </section>
  );
}

function GiftThumb({ id }: { id: string }) {
  const appearance = useGame((s) => s.save.player.appearance);
  const w = WEARABLES.find((x) => x.id === id);
  if (w)
    return (
      <Character appearance={appearance} outfit={{ [w.slot]: { itemId: w.id } }} crop={SLOT_CROP[w.slot]} animate={false} title={w.name} />
    );
  return <FurnitureThumb id={id} />;
}
