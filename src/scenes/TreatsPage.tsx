// Album page for every different cupcake design served at Sweet Spot (game-systems §13).
import { CupcakeArt } from '../art/scenes/Sweets';
import { frosting, nameOf, SWEET_TOPPINGS, SWIRLS } from '../content/sweets';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button } from '../ui/kit';

export function TreatsPage() {
  const setScene = useGame((s) => s.setScene);
  const made = useGame((s) => s.save.progress.sweets.made);
  if (made.length === 0)
    return (
      <div className="panel" style={{ textAlign: 'center', display: 'grid', gap: 8, justifyItems: 'center' }} data-testid="treats-empty">
        <p style={{ margin: 0, fontWeight: 800 }}>Every cupcake design you serve at Sweet Spot is kept here!</p>
        <Button tone="primary" icon="star" onClick={() => (play('pop'), setScene('town'))} testId="treats-to-town">
          To the town
        </Button>
      </div>
    );
  return (
    <ul className="album-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }} data-testid="treats-grid">
      {made.map((k) => {
        const [f, sw, t] = k.split('|');
        return (
          <li key={k} className="album-slot" data-earned="true" data-testid={`treat-${k}`}>
            <svg viewBox="0 0 200 220" aria-hidden="true">
              <CupcakeArt frosting={frosting(f)?.color ?? '#FFF1D0'} swirl={sw} topping={t} />
            </svg>
            <span>
              {nameOf(SWEET_TOPPINGS, t)}, {nameOf(SWIRLS, sw).toLowerCase()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
