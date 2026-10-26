// Petal Garden (game-systems §10.2): six beds. Plant a free seed; every finished activity elsewhere
// in the game makes every flower grow a step. Flowers never wilt. Pick a bloom for coins and to
// add that flower kind to the collection.
import { useState } from 'react';
import { FlowerArtStage } from '../art/scenes/Garden';
import { SEEDS, seed } from '../content/wavec';
import { BLOOM_AT, PICK_COINS, stage, toBloom } from '../game/garden';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';

const STAGE_NAME = { seed: 'Seed', sprout: 'Sprout', bud: 'Bud', bloom: 'In bloom!' } as const;

export function GardenScene() {
  const setScene = useGame((s) => s.setScene);
  const garden = useGame((s) => s.save.progress.garden);
  const plantSeed = useGame((s) => s.plantSeed);
  const pickFlower = useGame((s) => s.pickFlower);
  const showToast = useGame((s) => s.showToast);
  const [choose, setChoose] = useState<number | null>(null);
  const [picked, setPicked] = useState<{ seed: string; first: boolean } | null>(null);

  const onBed = (i: number) => {
    const bed = garden.beds[i];
    if (!bed) {
      play('pop');
      setChoose(i);
      return;
    }
    if (stage(bed.growth) === 'bloom') {
      const r = pickFlower(i);
      if (!r) return;
      play('chime');
      setPicked({ seed: r.seed, first: r.first });
      return;
    }
    play('soft');
    const def = seed(bed.seed);
    const left = toBloom(bed);
    showToast(`${def?.name ?? 'Your flower'} needs ${left} more thing${left === 1 ? '' : 's'} done in town to bloom.`, 'sparkle');
  };

  const planted = garden.beds.filter(Boolean).length;
  const pickedSeed = picked ? seed(picked.seed) : undefined;

  return (
    <section className="scene" aria-label="Petal Garden" style={{ background: 'linear-gradient(#CDEEEA, #DFF5EC 55%, #B8E6C4)' }}>
      <ActivityBar title="Petal Garden" onBack={() => setScene('town')} />
      <p
        className="panel"
        style={{ margin: '0 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}
        data-testid="garden-intro"
      >
        {planted === 0
          ? 'Tap a bed to plant a free seed!'
          : 'Flowers grow when you finish things in town: café shifts, dishes, shows, notes and pet care.'}
      </p>
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: 12 }}>
        <div className="garden-grid">
          {garden.beds.map((bed, i) => {
            const def = bed ? seed(bed.seed) : undefined;
            const st = bed ? stage(bed.growth) : null;
            return (
              <button
                key={i}
                type="button"
                className="garden-bed"
                data-testid={`bed-${i}`}
                data-stage={st ?? 'empty'}
                onClick={() => onBed(i)}
              >
                <svg viewBox="0 0 200 240" aria-hidden="true">
                  {bed && def ? (
                    <FlowerArtStage stage={st!} art={def.art} petal={def.petal} center={def.center} />
                  ) : (
                    <g>
                      <ellipse cx={100} cy={204} rx={70} ry={20} fill="#9E6A42" stroke="#5B4A6E" strokeWidth={4} />
                      <ellipse cx={86} cy={198} rx={20} ry={5} fill="#C98F5E" />
                      <path d="M100,150 L100,176 M87,163 L113,163" stroke="#FFF7EC" strokeWidth={9} strokeLinecap="round" />
                    </g>
                  )}
                </svg>
                <span className="garden-label">
                  {bed && def ? (
                    <>
                      <b>{def.name}</b>
                      <span>{st === 'bloom' ? `Pick it! +${PICK_COINS}` : `${bed.growth}/${BLOOM_AT} · ${STAGE_NAME[st!]}`}</span>
                    </>
                  ) : (
                    <b>Plant a seed</b>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <h2 className="display" style={{ fontSize: '1.2rem', margin: '14px 0 6px' }}>
          Flower collection
        </h2>
        <ul className="garden-collection" data-testid="garden-collection">
          {SEEDS.map((sd) => {
            const got = garden.bloomed.includes(sd.id);
            return (
              <li key={sd.id} data-got={got}>
                <svg viewBox="0 0 200 240" aria-hidden="true" style={{ opacity: got ? 1 : 0.3 }}>
                  <FlowerArtStage stage="bloom" art={sd.art} petal={got ? sd.petal : '#B4ABBF'} center={got ? sd.center : '#8F86A0'} />
                </svg>
                <span>{got ? sd.name : '???'}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {choose !== null && (
        <Sheet title="Pick a seed" onClose={() => setChoose(null)}>
          <div className="item-grid" style={{ marginBottom: 8 }}>
            {SEEDS.map((sd) => (
              <button
                key={sd.id}
                type="button"
                className="shop-tile"
                data-testid={`seed-${sd.id}`}
                onClick={() => {
                  play('swap');
                  plantSeed(choose, sd.id);
                  setChoose(null);
                  showToast(`${sd.name} planted! It grows as you play.`, 'sparkle');
                }}
              >
                <span className="thumb">
                  <svg viewBox="0 0 200 240" aria-hidden="true">
                    <FlowerArtStage stage="bloom" art={sd.art} petal={sd.petal} center={sd.center} />
                  </svg>
                </span>
                {sd.name}
                {garden.bloomed.includes(sd.id) && <span className="owned">Collected</span>}
              </button>
            ))}
          </div>
        </Sheet>
      )}
      {picked && pickedSeed && (
        <div className="card-center card-low" role="dialog" aria-label="Flower picked">
          <div className="panel pop-in" data-testid="garden-picked">
            <p className="display" style={{ fontSize: '1.5rem', margin: 0 }}>
              {picked.first ? 'A new flower!' : 'Beautiful!'}
            </p>
            <svg viewBox="0 0 200 240" width={140} height={168} aria-hidden="true">
              <FlowerArtStage stage="bloom" art={pickedSeed.art} petal={pickedSeed.petal} center={pickedSeed.center} />
            </svg>
            <p style={{ margin: 0 }}>
              <b>{pickedSeed.name}</b> {picked.first ? 'joins your flower collection.' : 'smells lovely.'}
            </p>
            <span className="price-tag">
              <Icon name="coin" />+{PICK_COINS}
            </span>
            <Button tone="primary" onClick={() => setPicked(null)} testId="garden-picked-ok">
              Plant another!
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
