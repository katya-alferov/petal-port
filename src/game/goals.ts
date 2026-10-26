// "Next up" ideas (game-systems §14): a short list of things the player could do next, picked from
// what they have not tried yet. Only suggestions: nothing expires, nothing is owed. Pure.
import type { SaveGame } from './save';
import { PARIS_TICKET } from './travel';
import { BLOOM_AT } from './garden';

export interface Goal {
  id: string;
  text: string;
  /** Scene to open when tapped. */
  go: 'airport' | 'paris' | 'garden' | 'salon' | 'burger' | 'sweets' | 'show' | 'petshop' | 'board' | 'cafe' | 'kitchen' | 'album';
}

export const SHELLS_TOTAL = 10;

export function nextGoals(save: SaveGame, max = 3): Goal[] {
  const p = save.progress;
  const out: Goal[] = [];
  const add = (g: Goal) => out.push(g);

  const bloomReady = p.garden.beds.some((b) => b && b.growth >= BLOOM_AT);
  if (bloomReady) add({ id: 'pick', text: 'A flower is ready to pick in the Petal Garden', go: 'garden' });
  if (!p.travel.ticket) {
    add({
      id: 'ticket',
      text:
        save.wallet.coins >= PARIS_TICKET
          ? 'You can buy your Paris ticket now!'
          : `Save for the Paris ticket: ${save.wallet.coins} of ${PARIS_TICKET} coins`,
      go: 'airport',
    });
  } else if (p.travel.photos.length === 0) {
    add({ id: 'photo', text: 'Fly to Paris and take your first photo', go: 'paris' });
  }
  if (p.garden.beds.every((b) => b === null)) add({ id: 'plant', text: 'Plant a free flower in the Petal Garden', go: 'garden' });
  if (p.shows.done === 0) add({ id: 'show', text: 'Walk the runway at Starlight Stage', go: 'show' });
  if (p.salon.shifts === 0) add({ id: 'salon', text: 'Style a client at the Glam Salon', go: 'salon' });
  if (p.burger.shifts === 0) add({ id: 'burger', text: 'Stack burgers at Bun & Bite', go: 'burger' });
  if (p.sweets.shifts === 0) add({ id: 'sweets', text: 'Decorate cupcakes at Sweet Spot', go: 'sweets' });
  if (p.pet === null) add({ id: 'pet', text: 'Adopt a pet friend at Paw Parlour', go: 'petshop' });
  if (p.requests.done === 0) add({ id: 'notes', text: 'Help someone with a Petal Note', go: 'board' });
  if (p.shells.length < SHELLS_TOTAL)
    add({ id: 'shells', text: `Find secret shells around town: ${p.shells.length} of ${SHELLS_TOTAL}`, go: 'album' });
  if (p.sweets.made.length > 0 && p.sweets.made.length < 10)
    add({ id: 'designs', text: `Serve different cupcake designs: ${p.sweets.made.length} of 10`, go: 'sweets' });
  return out.slice(0, max);
}
