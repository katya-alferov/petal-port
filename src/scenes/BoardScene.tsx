// Petal Notes board (game-systems §8.2–8.3): requests from townsfolk, and the friends they become.
import { useEffect, useState } from 'react';
import { REGULARS, regular } from '../content/cafe';
import { FURNITURE } from '../content/furniture';
import { noteHint, noteText } from '../content/town';
import { WEARABLES } from '../content/wearables';
import { GIFT_AT, isReady, need, NOTE_PAY, VISIT_AT } from '../game/requests';
import { MAX_HEARTS, type RequestNote } from '../game/save';
import { play } from '../platform/audio';
import { liveState, useGame } from '../state/store';
import { Button, Tabs } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar, Character, FurnitureThumb, SLOT_CROP } from './common';

const FACE = '100 50 200 190';
type Tab = 'notes' | 'friends';

function Face({ id }: { id: string }) {
  const r = regular(id);
  if (!r) return null;
  return <Character appearance={r.appearance} outfit={r.outfit} crop={FACE} animate={false} title={r.name} />;
}

function Hearts({ n }: { n: number }) {
  return (
    <span className="heart-row" aria-label={`${n} of ${MAX_HEARTS} hearts`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <span key={i} data-on={i < n} aria-hidden="true">
          ♥
        </span>
      ))}
    </span>
  );
}

function GiftThumb({ id }: { id: string }) {
  const w = WEARABLES.find((x) => x.id === id);
  if (w)
    return (
      <Character
        appearance={useGame.getState().save.player.appearance}
        outfit={{ [w.slot]: { itemId: w.id } }}
        crop={SLOT_CROP[w.slot]}
        animate={false}
        title={w.name}
      />
    );
  return <FurnitureThumb id={id} />;
}

const itemName = (id: string) => WEARABLES.find((w) => w.id === id)?.name ?? FURNITURE.find((f) => f.id === id)?.name ?? id;

export function BoardScene() {
  const setScene = useGame((s) => s.setScene);
  const save = useGame((s) => s.save);
  const refreshBoard = useGame((s) => s.refreshBoard);
  const deliverNote = useGame((s) => s.deliverNote);
  const swapNote = useGame((s) => s.swapNote);
  const inviteFriend = useGame((s) => s.inviteFriend);
  const showToast = useGame((s) => s.showToast);
  const [tab, setTab] = useState<Tab>('notes');
  const [thanks, setThanks] = useState<{ friend: string; coins: number; hearts: number; gift: string | null; visit: boolean } | null>(null);

  useEffect(() => refreshBoard(), [refreshBoard]);

  const live = liveState(save);
  const pet = save.progress.pet;

  const give = (n: RequestNote) => {
    const r = deliverNote(n.no);
    if (!r) return;
    play('chime');
    setThanks({ friend: n.friend, ...r });
  };

  return (
    <section className="scene" aria-label="Petal Notes" style={{ background: 'linear-gradient(#F2DCC0, #FFF7EC 70%)' }}>
      <ActivityBar title="Petal Notes" onBack={() => setScene('town')} />
      <div style={{ padding: '0 12px' }}>
        <Tabs<Tab>
          label="Board"
          value={tab}
          onChange={(t) => (play('pop'), setTab(t))}
          tabs={[
            { id: 'notes', label: 'Notes' },
            { id: 'friends', label: 'Friends' },
          ]}
        />
      </div>
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: 12, display: 'grid', gap: 12, alignContent: 'start' }}>
        {tab === 'notes' &&
          save.progress.requests.board.map((n, i) => {
            const r = regular(n.friend);
            const ready = isReady(n, live);
            const counted = n.goal.kind === 'cafe';
            return (
              <article
                key={n.no}
                className="note-card"
                style={{ rotate: `${[-1.5, 1, -0.5][i % 3]}deg` }}
                data-testid={`note-${i}`}
                data-ready={ready}
              >
                <span className="pin" aria-hidden="true" />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="face">
                    <Face id={n.friend} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <b>{r?.name}</b>
                    <p style={{ margin: '2px 0 0' }}>{noteText(n.goal, pet?.name)}</p>
                  </div>
                </div>
                <p className="caption" style={{ margin: 0 }}>
                  {ready ? '✓ Ready to give!' : noteHint(n.goal)} {counted && `(${Math.min(n.have, need(n.goal))}/${need(n.goal)})`} Reward:{' '}
                  {NOTE_PAY[n.goal.kind]} coins + ♥
                </p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    tone={ready ? 'confirm' : 'secondary'}
                    icon="heart"
                    onClick={() => give(n)}
                    testId={`note-give-${i}`}
                    disabledReason={ready ? undefined : 'Not yet! ' + noteHint(n.goal)}
                  >
                    Give
                  </Button>
                  <Button onClick={() => (play('swap'), swapNote(n.no))} testId={`note-swap-${i}`}>
                    New note
                  </Button>
                </div>
              </article>
            );
          })}
        {tab === 'notes' && <p style={{ margin: 0, textAlign: 'center' }}>Notes never run out and never expire. Pick the ones you like!</p>}
        {tab === 'friends' &&
          REGULARS.map((r) => {
            const h = save.progress.friends[r.id] ?? 0;
            return (
              <article key={r.id} className="panel friend-row" data-testid={`friend-${r.id}`}>
                <div className="face">
                  <Face id={r.id} />
                </div>
                <div style={{ flex: 1, display: 'grid', gap: 2 }}>
                  <b>{r.name}</b>
                  <Hearts n={h} />
                  <span className="caption">
                    {h < GIFT_AT
                      ? `${GIFT_AT - h} more ♥ for a gift: ${itemName(r.gift)}`
                      : h < VISIT_AT
                        ? `${VISIT_AT - h} more ♥ until ${r.name} can visit you`
                        : h < MAX_HEARTS
                          ? `Close friends! ${MAX_HEARTS - h} more ♥ to be best friends`
                          : 'Best friends forever!'}
                  </span>
                </div>
                {h >= VISIT_AT && (
                  <Button
                    onClick={() => {
                      play('chime');
                      const on = save.progress.visitor !== r.id;
                      inviteFriend(on ? r.id : null);
                      showToast(on ? `${r.name} is visiting your home!` : `${r.name} waved goodbye.`, 'home');
                    }}
                    testId={`invite-${r.id}`}
                  >
                    {save.progress.visitor === r.id ? 'Say bye' : 'Invite'}
                  </Button>
                )}
              </article>
            );
          })}
      </div>

      {thanks && (
        <div className="card-center" role="dialog" aria-label="Thank you">
          <div className="panel pop-in" data-testid="thanks-card" style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
            <div className="face" style={{ width: 88, height: 88 }}>
              <Face id={thanks.friend} />
            </div>
            <p className="display" style={{ fontSize: '1.4rem', margin: 0 }}>
              Thank you so much!
            </p>
            <p style={{ margin: 0, display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="price-tag">
                <Icon name="coin" />+{thanks.coins}
              </span>
              and a friendship heart ♥ ({thanks.hearts})
            </p>
            {thanks.gift && (
              <>
                <div style={{ width: 96, height: 96 }}>
                  <GiftThumb id={thanks.gift} />
                </div>
                <p style={{ margin: 0 }}>
                  {regular(thanks.friend)?.name} gave you a gift: <b>{itemName(thanks.gift)}</b>!
                </p>
              </>
            )}
            {thanks.visit && <p style={{ margin: 0 }}>{regular(thanks.friend)?.name} can visit your home now! Invite them from Friends.</p>}
            <Button tone="primary" onClick={() => setThanks(null)} testId="thanks-ok">
              Yay!
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
