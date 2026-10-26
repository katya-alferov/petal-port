import { useEffect, useState } from 'react';
import { BoutiqueScene } from '../scenes/BoutiqueScene';
import { CafeScene } from '../scenes/CafeScene';
import { DebugOverlay } from '../scenes/DebugOverlay';
import { GalleryScene } from '../scenes/GalleryScene';
import { HomeScene } from '../scenes/HomeScene';
import { KitchenScene } from '../scenes/KitchenScene';
import { MeScene } from '../scenes/MeScene';
import { TitleScene } from '../scenes/TitleScene';
import { TownScene } from '../scenes/TownScene';
import { PetShopScene } from '../scenes/PetShopScene';
import { ShowScene } from '../scenes/ShowScene';
import { SalonScene } from '../scenes/SalonScene';
import { GardenScene } from '../scenes/GardenScene';
import { PetScene } from '../scenes/PetScene';
import { BoardScene } from '../scenes/BoardScene';
import { AlbumScene } from '../scenes/AlbumScene';
import { setSfxEnabled } from '../platform/audio';
import { testParam } from '../platform/hooks';
import { useGame, type SceneId } from '../state/store';
import { MathGate, Toast } from '../ui/kit';

export function App() {
  const scene = useGame((s) => s.scene);
  const toast = useGame((s) => s.toast);
  const clearToast = useGame((s) => s.clearToast);
  const sfx = useGame((s) => s.save.settings.sfx);
  const motion = useGame((s) => s.save.settings.reducedMotion);
  const [gate, setGate] = useState(false);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    void useGame
      .getState()
      .boot(testParam('fixture'))
      .then(() => {
        const s = testParam('scene') as SceneId | null;
        if (s) useGame.getState().setScene(s);
      });
  }, []);

  useEffect(() => setSfxEnabled(sfx), [sfx]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion === 'on' ? 'reduced' : motion === 'off' ? 'full' : '';
  }, [motion]);

  return (
    <div className="backdrop">
      <main className="stage" data-scene={scene}>
        {scene === 'title' && <TitleScene onOpenDebug={() => setGate(true)} />}
        {scene === 'town' && <TownScene />}
        {scene === 'cafe' && <CafeScene />}
        {scene === 'boutique' && <BoutiqueScene />}
        {scene === 'kitchen' && <KitchenScene />}
        {scene === 'me' && <MeScene />}
        {scene === 'home' && <HomeScene />}
        {scene === 'petshop' && <PetShopScene />}
        {scene === 'show' && <ShowScene />}
        {scene === 'salon' && <SalonScene />}
        {scene === 'garden' && <GardenScene />}
        {scene === 'pet' && <PetScene />}
        {scene === 'board' && <BoardScene />}
        {scene === 'album' && <AlbumScene />}
        {scene === 'gallery' && <GalleryScene />}
        {toast && <Toast key={toast.id} message={toast.message} icon={toast.icon} onDone={clearToast} />}
        {gate && (
          <MathGate
            onCancel={() => setGate(false)}
            onPass={() => {
              setGate(false);
              setDebug(true);
            }}
          />
        )}
        {debug && <DebugOverlay onClose={() => setDebug(false)} />}
      </main>
      <div className="landscape-card" role="alert">
        <div className="panel">
          <p className="display">Turn me upright!</p>
          <p>Petalport plays best with your phone standing tall.</p>
        </div>
      </div>
    </div>
  );
}
