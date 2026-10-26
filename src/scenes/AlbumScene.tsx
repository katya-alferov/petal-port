// Sticker album (game-systems §8.5): earned stickers shine; the rest show a silhouette and a hint.
import { useState } from 'react';
import { StickerArt } from '../art/stickers';
import { STICKERS } from '../content/town';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Sheet } from '../ui/kit';
import { ActivityBar } from './common';

export function AlbumScene() {
  const setScene = useGame((s) => s.setScene);
  const earned = useGame((s) => s.save.progress.stickers);
  const [open, setOpen] = useState<string | null>(null);
  const def = STICKERS.find((d) => d.id === open);
  const have = new Set(earned);

  return (
    <section className="scene" aria-label="Sticker album" style={{ background: 'linear-gradient(#E9DEFF, #FFF0F6 60%)' }}>
      <ActivityBar title="Sticker Album" onBack={() => setScene('town')} />
      <p
        className="panel"
        style={{ margin: '0 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}
        data-testid="album-count"
      >
        {have.size} of {STICKERS.length} stickers
      </p>
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: 12 }}>
        <div className="album-grid">
          {STICKERS.map((s) => {
            const got = have.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className="album-slot"
                data-testid={`sticker-${s.id}`}
                data-earned={got}
                onClick={() => (play('pop'), setOpen(s.id))}
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <StickerArt motif={s.motif} color={s.color} locked={!got} />
                </svg>
                <span>{got ? s.name : '???'}</span>
              </button>
            );
          })}
        </div>
      </div>
      {def && (
        <Sheet title={have.has(def.id) ? def.name : 'Still to find'} onClose={() => setOpen(null)}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg viewBox="0 0 100 100" width={140} height={140} aria-hidden="true" className={have.has(def.id) ? 'pop-in' : undefined}>
              <StickerArt motif={def.motif} color={def.color} locked={!have.has(def.id)} />
            </svg>
            <p style={{ margin: 0, textAlign: 'center' }}>
              {have.has(def.id) ? `You earned this: ${def.hint.toLowerCase()}.` : `How to get it: ${def.hint}.`}
            </p>
          </div>
        </Sheet>
      )}
    </section>
  );
}
