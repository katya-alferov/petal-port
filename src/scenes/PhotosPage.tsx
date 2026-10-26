// Album page for Paris photos and souvenirs (game-systems §7.4).
import { useState } from 'react';
import { SouvenirArt } from '../art/travel';
import { SOUVENIRS } from '../content/travel';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { PhotoView } from './PhotoView';

export function PhotosPage() {
  const setScene = useGame((s) => s.setScene);
  const travel = useGame((s) => s.save.progress.travel);
  const player = useGame((s) => s.save.player);
  const deletePhoto = useGame((s) => s.deletePhoto);
  const [open, setOpen] = useState<number | null>(null);
  const [confirm, setConfirm] = useState(false);
  const shown = [...travel.photos.keys()].reverse();
  const photo = open !== null ? travel.photos[open] : undefined;

  return (
    <>
      {travel.photos.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', display: 'grid', gap: 8, justifyItems: 'center' }} data-testid="photos-empty">
          <p style={{ margin: 0, fontWeight: 800 }}>Your first photo is waiting in Paris!</p>
          <Button tone="primary" icon="star" onClick={() => (play('pop'), setScene('airport'))} testId="photos-to-airport">
            To the airport
          </Button>
        </div>
      ) : (
        <ul className="polaroid-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }} data-testid="photo-grid">
          {shown.map((i) => (
            <li key={i}>
              <button
                type="button"
                className="polaroid"
                data-testid={`photo-${i}`}
                onClick={() => (play('pop'), setOpen(i))}
                aria-label={`Photo ${i + 1} from Paris`}
              >
                <PhotoView photo={travel.photos[i]} appearance={player.appearance} outfit={player.outfit} />
                <span>Paris</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2 className="display" style={{ fontSize: '1.2rem', margin: '14px 0 6px' }}>
        Souvenir shelf
      </h2>
      <ul className="album-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }} data-testid="souvenir-shelf">
        {SOUVENIRS.map((d) => {
          const got = travel.souvenirs.includes(d.id);
          return (
            <li key={d.id} className="album-slot" data-testid={`shelf-${d.id}`} data-earned={got}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={got ? undefined : { opacity: 0.3 }}>
                <SouvenirArt kind={d.art} color={got ? d.color : '#B4ABBF'} />
              </svg>
              <span>{got ? d.name : d.price === 0 ? 'Take a photo' : 'Paris kiosk'}</span>
            </li>
          );
        })}
      </ul>
      {photo && open !== null && (
        <Sheet title="Paris photo" onClose={() => (setOpen(null), setConfirm(false))}>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <div className="polaroid big">
              <PhotoView photo={photo} appearance={player.appearance} outfit={player.outfit} />
              <span>{new Date(photo.at).toLocaleDateString()}</span>
            </div>
            {confirm ? (
              <Button
                onClick={() => {
                  deletePhoto(open);
                  setOpen(null);
                  setConfirm(false);
                }}
                testId="photo-remove-yes"
              >
                Yes, remove it
              </Button>
            ) : (
              <Button onClick={() => (play('soft'), setConfirm(true))} testId="photo-remove">
                Remove
              </Button>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}
