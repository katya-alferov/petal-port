// Window views for the home (game-systems §10.5). The harbour is free; the others open as the player
// explores, never expire and never cost coins.
export type ViewId = 'harbour' | 'meadow' | 'lights' | 'snow';

export interface WindowViewDef {
  id: ViewId;
  name: string;
  /** What to do to open it (shown when it is still locked). */
  hint: string;
  unlock: { kind: 'free' } | { kind: 'blooms' | 'shows' | 'shells'; n: number };
}

export const WINDOW_VIEWS: WindowViewDef[] = [
  { id: 'harbour', name: 'Harbour', hint: '', unlock: { kind: 'free' } },
  { id: 'meadow', name: 'Meadow', hint: 'Pick your first flower in the Petal Garden.', unlock: { kind: 'blooms', n: 1 } },
  { id: 'lights', name: 'City lights', hint: 'Walk the runway in a Starlight Stage show.', unlock: { kind: 'shows', n: 1 } },
  { id: 'snow', name: 'Snowfall', hint: 'Find 5 secret shells.', unlock: { kind: 'shells', n: 5 } },
];

export function windowView(id: string | undefined): WindowViewDef {
  return WINDOW_VIEWS.find((v) => v.id === id) ?? WINDOW_VIEWS[0];
}
