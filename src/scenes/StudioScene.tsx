// Art Studio (game-systems §24): a coloring book. Pick a picture, pick a paint, tap the parts. Any color is
// right. Hang the finished picture in the gallery (first time per picture pays).
import { useState } from 'react';
import { ColoringArt } from '../art/scenes/Coloring';
import { PAINT_HEX } from '../content/studio';
import { blank, FIRST_PICTURE_COINS, finished, PAINTS, PICTURES, type Paint } from '../game/studio';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

const hexOf = (id: string | null) => (id ? (PAINT_HEX[id]?.hex ?? '#FFFFFF') : null);

export function StudioScene() {
  const setScene = useGame((s) => s.setScene);
  const st = useGame((s) => s.save.progress.studio);
  const [pic, setPic] = useState<string | null>(null);
  const [gallery, setGallery] = useState(false);

  if (pic) return <Painting key={pic} pic={pic} onBack={() => setPic(null)} />;
  return (
    <section className="scene" aria-label="Art Studio" style={{ background: 'linear-gradient(#FFF1D8, #FFE3EE)' }}>
      <ActivityBar title="Art Studio" onBack={() => setScene('town')} />
      <div style={{ padding: 16, display: 'grid', gap: 12, alignContent: 'start' }}>
        <h2 className="display" style={{ fontSize: '1.5rem' }}>
          What shall we paint?
        </h2>
        {PICTURES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="shop-tile park-tile"
            style={{ gridTemplateColumns: '84px 1fr' }}
            data-testid={`pic-${p.id}`}
            onClick={() => (play('chime'), setPic(p.id))}
          >
            <span className="park-icon" style={{ width: 76, height: 76 }}>
              <ColoringArt id={p.id} colors={blank(p.id).map(() => null)} />
            </span>
            <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
              <b style={{ fontSize: '1.2rem' }}>{p.name}</b>
              <span>{st.made.includes(p.id) ? 'Hung in your gallery' : `New! +${FIRST_PICTURE_COINS} coins the first time`}</span>
            </span>
          </button>
        ))}
        <Button onClick={() => (play('pop'), setGallery(true))} testId="studio-gallery" icon="album">
          My gallery ({st.works.length})
        </Button>
      </div>
      {gallery && (
        <Sheet title="My gallery" onClose={() => setGallery(false)}>
          {st.works.length === 0 ? (
            <p style={{ margin: 0 }}>Nothing hung up yet. Paint a picture and hang it here!</p>
          ) : (
            <div className="gallery-grid" data-testid="gallery-works">
              {st.works.map((w, i) => (
                <div key={i} className="gallery-frame">
                  <ColoringArt id={w.pic} colors={w.colors.map(hexOf)} />
                </div>
              ))}
            </div>
          )}
        </Sheet>
      )}
    </section>
  );
}

function Painting({ pic, onBack }: { pic: string; onBack: () => void }) {
  const hang = useGame((s) => s.hangPicture);
  const [colors, setColors] = useState<(Paint | null)[]>(() => blank(pic));
  const [paint, setPaint] = useState<Paint>('rose');
  const [earned, setEarned] = useState<number | null>(null);
  const done = finished(colors);
  const name = PICTURES.find((p) => p.id === pic)?.name ?? 'Picture';

  const tap = (i: number) => {
    if (earned !== null) return;
    play('pop');
    setColors((c) => c.map((x, k) => (k === i ? paint : x)));
  };

  return (
    <section className="scene" aria-label={`Painting: ${name}`} style={{ background: 'linear-gradient(#FFF1D8, #FFE3EE)' }}>
      <ActivityBar title={name} onBack={onBack} />
      <div style={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', padding: '4px 16px' }}>
        <div className="studio-canvas" data-testid="canvas" data-done={done}>
          <ColoringArt id={pic} colors={colors.map(hexOf)} onTap={tap} />
        </div>
      </div>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <div className="paint-row" role="group" aria-label="Paints">
          {PAINTS.map((p) => (
            <button
              key={p}
              type="button"
              className="paint"
              aria-pressed={paint === p}
              aria-label={PAINT_HEX[p].name}
              data-testid={`paint-${p}`}
              style={{ background: PAINT_HEX[p].hex }}
              onClick={() => (play('swap'), setPaint(p))}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <Button onClick={() => (play('swap'), setColors(blank(pic)))} testId="studio-clear">
            Clear
          </Button>
          <Button
            tone="primary"
            icon="star"
            disabledReason={done ? undefined : 'Paint every part first!'}
            onClick={() => {
              play('chime');
              setEarned(hang(pic, colors as string[]));
            }}
            testId="studio-hang"
          >
            Hang it up!
          </Button>
        </div>
      </div>
      {earned !== null && (
        <div className="card-center card-low" role="dialog" aria-label="Picture hung">
          <div className="panel pop-in" data-testid="studio-done">
            <p className="display" style={{ fontSize: '1.6rem', margin: 0 }}>
              Beautiful!
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
              {earned > 0 ? (
                <>
                  <Icon name="coin" />+{earned} coins (first time)
                </>
              ) : (
                'It is in your gallery now.'
              )}
            </p>
            <Button tone="primary" onClick={onBack} testId="studio-again">
              Paint another
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
