// Which home window views are open (game-systems §10.5). Pure.
import type { WindowViewDef } from '../content/views';
import type { Progress } from './save';

export function viewUnlocked(v: WindowViewDef, p: Pick<Progress, 'garden' | 'shows' | 'shells'>): boolean {
  switch (v.unlock.kind) {
    case 'free':
      return true;
    case 'blooms':
      return p.garden.bloomed.length >= v.unlock.n;
    case 'shows':
      return p.shows.done >= v.unlock.n;
    case 'shells':
      return p.shells.length >= v.unlock.n;
  }
}
