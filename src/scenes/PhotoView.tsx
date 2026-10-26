// One photo, drawn from its recipe (game-systems §7.3). The same view is used in the viewfinder and
// in the album: nothing is captured from the screen, so photos cost a few bytes and never go stale.
import { useMemo } from 'react';
import { ParisBackdrop } from '../art/scenes/Paris';
import { PhotoStickerArt, PropArt } from '../art/travel';
import { STICKER_SPOTS } from '../content/travel';
import { wearable } from '../content/wearables';
import type { PhotoRecipe } from '../game/travel';
import type { Appearance, Outfit } from '../game/save';
import { equip } from '../game/wardrobe';
import { Character } from './common';

export function PhotoView({
  photo,
  appearance,
  outfit,
  title = 'A photo from Paris',
}: {
  photo: Pick<PhotoRecipe, 'pose' | 'prop' | 'stickers'>;
  appearance: Appearance;
  outfit: Outfit;
  title?: string;
}) {
  const dressed = useMemo(() => {
    const beret = photo.prop === 'beret' ? wearable('headwear.beret') : undefined;
    return beret ? equip(outfit, beret) : outfit;
  }, [outfit, photo.prop]);
  return (
    <div className="photo-view" role="img" aria-label={title}>
      <div className="photo-bg">
        <ParisBackdrop />
      </div>
      <div className="photo-doll">
        <Character appearance={appearance} outfit={dressed} pose={photo.pose} animate={false} title="You" />
      </div>
      {(photo.prop === 'croissant' || photo.prop === 'balloon') && (
        <svg className="photo-prop" data-prop={photo.prop} viewBox="0 0 100 100" aria-hidden="true">
          <PropArt id={photo.prop} />
        </svg>
      )}
      {photo.stickers.map((id, i) =>
        id ? (
          <svg
            key={i}
            className="photo-sticker"
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{ left: `${STICKER_SPOTS[i][0]}%`, top: `${STICKER_SPOTS[i][1]}%` }}
          >
            <PhotoStickerArt id={id} />
          </svg>
        ) : null,
      )}
    </div>
  );
}
