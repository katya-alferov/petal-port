// Sticker album (game-systems §8.5): earned stickers shine; the rest show a silhouette and a hint.
// The Shells page (§9.2) shows the secret shells found so far, with a "where to look" hint for the rest.
import { useState } from 'react';
import { ShellArt } from '../art/shells';
import { StickerArt } from '../art/stickers';
import { SHELLS } from '../content/show';
import { SOUVENIRS } from '../content/travel';
import { PhotosPage } from './PhotosPage';
import { STICKERS } from '../content/town';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Sheet, Tabs } from '../ui/kit';
import { ActivityBar } from './common';

export function AlbumScene() {
  const setScene = useGame((s) => s.setScene);
  const earned = useGame((s) => s.save.progress.stickers);
  const shells = useGame((s) => s.save.progress.shells);
  const travel = useGame((s) => s.save.progress.travel);
  const [page, setPage] = useState<'stickers' | 'shells' | 'photos'>('stickers');
  const [open, setOpen] = useState<string | null>(null);
  const def = STICKERS.find((d) => d.id === open);
  const have = new Set(earned);

  return (
    <section className="scene" aria-label="Sticker album" style={{ background: 'linear-gradient(#E9DEFF, #FFF0F6 60%)' }}>
      <ActivityBar title="Sticker Album" onBack={() => setScene('town')} />
      <div style={{ padding: '0 12px', display: 'grid', gap: 8 }}>
        <Tabs<'stickers' | 'shells' | 'photos'>
          label="Album pages"
          value={page}
          onChange={(p) => (play('pop'), setPage(p))}
          tabs={[
            { id: 'stickers', label: 'Stickers' },
            { id: 'shells', label: 'Shells' },
            { id: 'photos', label: 'Photos' },
          ]}
        />
        <p className="panel" style={{ margin: 0, padding: '6px 12px', textAlign: 'center', fontWeight: 800 }} data-testid="album-count">
          {page === 'stickers'
            ? `${have.size} of ${STICKERS.length} stickers`
            : page === 'shells'
              ? `${shells.length} of ${SHELLS.length} secret shells`
              : `${travel.photos.length} ${travel.photos.length === 1 ? 'photo' : 'photos'} · ${travel.souvenirs.length} of ${SOUVENIRS.length} souvenirs`}
        </p>
      </div>
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: 12 }}>
        {page === 'stickers' ? (
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
        ) : page === 'photos' ? (
          <PhotosPage />
        ) : (
          <>
            <p style={{ margin: '0 0 10px', textAlign: 'center' }}>Shiny shells are hidden all around Petalport. Tap one to pick it up!</p>
            <ul className="album-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {SHELLS.map((sh) => {
                const got = shells.includes(sh.id);
                return (
                  <li key={sh.id} className="album-slot" data-testid={`album-${sh.id}`} data-earned={got}>
                    <svg viewBox="0 0 100 100" aria-hidden="true" style={got ? undefined : { opacity: 0.3 }}>
                      <ShellArt kind={sh.kind} color={got ? sh.color : '#B4ABBF'} />
                    </svg>
                    <span>{got ? sh.name : sh.hint}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
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
