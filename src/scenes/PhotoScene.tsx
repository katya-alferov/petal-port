// Photo mode (game-systems §7.3): pose, prop and up to 6 stickers, then the shutter. The photo is
// saved as a tiny recipe and drawn again from the same art, so nothing is captured from the screen.
import { useState } from 'react';
import { PHOTO_POSES, PHOTO_PROPS, PHOTO_STICKERS, type PhotoPose, type PhotoProp } from '../content/travel';
import { MAX_PHOTOS } from '../game/travel';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Tabs } from '../ui/kit';
import { ActivityBar } from './common';
import { PhotoView } from './PhotoView';

type Part = 'pose' | 'prop' | 'stickers';
const SPOTS = 6;

export function PhotoScene() {
  const setScene = useGame((s) => s.setScene);
  const showToast = useGame((s) => s.showToast);
  const player = useGame((s) => s.save.player);
  const count = useGame((s) => s.save.progress.travel.photos.length);
  const takePhoto = useGame((s) => s.takePhoto);
  const [part, setPart] = useState<Part>('pose');
  const [pose, setPose] = useState<PhotoPose>('wave');
  const [prop, setProp] = useState<PhotoProp>('none');
  const [stickers, setStickers] = useState<(string | null)[]>(Array(SPOTS).fill(null));
  const [flash, setFlash] = useState(false);
  const [saved, setSaved] = useState<{ first: boolean } | null>(null);

  const addSticker = (id: string) => {
    const at = stickers.findIndex((s) => s === null);
    if (at < 0) {
      play('soft');
      showToast('All 6 sticker spots are used. Tap Clear to start over.', 'sparkle');
      return;
    }
    play('pop');
    setStickers(stickers.map((s, i) => (i === at ? id : s)));
  };

  const shutter = () => {
    if (count >= MAX_PHOTOS) {
      showToast('Your album is full. Remove a photo to make space.', 'sparkle');
      return;
    }
    play('chime');
    setFlash(true);
    window.setTimeout(() => setFlash(false), 140);
    const r = takePhoto({ place: 'paris', pose, prop, stickers, at: Date.now() });
    if (r) setSaved(r);
  };

  const placed = stickers.filter(Boolean).length;
  return (
    <section className="scene" aria-label="Photo mode" style={{ background: 'linear-gradient(#FFE9F2, #FFF7EC)' }}>
      <ActivityBar title="Photo spot" onBack={() => setScene('paris')} />
      <div className="photo-frame">
        <PhotoView photo={{ pose, prop, stickers }} appearance={player.appearance} outfit={player.outfit} title="Your photo" />
        {flash && <div className="photo-flash" aria-hidden="true" />}
      </div>
      <div className="tray" style={{ flex: '0 0 auto' }}>
        <Tabs<Part>
          label="Photo choices"
          value={part}
          onChange={(p) => (play('pop'), setPart(p))}
          tabs={[
            { id: 'pose', label: 'Pose' },
            { id: 'prop', label: 'Prop' },
            { id: 'stickers', label: `Stickers ${placed}/${SPOTS}` },
          ]}
        />
        <div className="chip-row wrap" role="group" aria-label={part} style={{ justifyContent: 'center' }}>
          {part === 'pose' &&
            PHOTO_POSES.map((o) => (
              <button
                key={o.id}
                type="button"
                className="chip"
                aria-pressed={pose === o.id}
                data-testid={`pose-${o.id}`}
                onClick={() => (play('swap'), setPose(o.id))}
              >
                {o.name}
              </button>
            ))}
          {part === 'prop' &&
            PHOTO_PROPS.map((o) => (
              <button
                key={o.id}
                type="button"
                className="chip"
                aria-pressed={prop === o.id}
                data-testid={`prop-${o.id}`}
                onClick={() => (play('swap'), setProp(o.id))}
              >
                {o.name}
              </button>
            ))}
          {part === 'stickers' && (
            <>
              {PHOTO_STICKERS.map((o) => (
                <button key={o.id} type="button" className="chip" data-testid={`pstick-${o.id}`} onClick={() => addSticker(o.id)}>
                  {o.name}
                </button>
              ))}
              <button
                type="button"
                className="chip"
                data-testid="pstick-clear"
                onClick={() => (play('soft'), setStickers(Array(SPOTS).fill(null)))}
              >
                Clear
              </button>
            </>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button tone="primary" icon="album" onClick={shutter} testId="photo-shutter">
            Take photo
          </Button>
        </div>
      </div>
      {saved && (
        <div className="card-center card-low" role="dialog" aria-label="Photo saved">
          <div className="panel pop-in" data-testid="photo-saved">
            <p className="display" style={{ fontSize: '1.5rem', margin: 0 }}>
              {saved.first ? 'Your first photo!' : 'Photo saved!'}
            </p>
            <p style={{ margin: 0 }}>{saved.first ? 'It is in your album, and a Paris postcard came with it.' : 'It is in your album.'}</p>
            <Button tone="primary" onClick={() => (play('pop'), setScene('album'))} testId="photo-to-album">
              See my album
            </Button>
            <Button onClick={() => (play('pop'), setSaved(null))} testId="photo-again">
              Take another
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
