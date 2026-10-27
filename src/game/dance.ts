// Dance Studio (game-systems §15): watch the coach's routine, then repeat the moves. There is no
// beat to hit and no timer: a wrong move wobbles and the coach shows the routine again.
import { makeRng } from './rng';

export type Move = 'wave' | 'hips' | 'cheer' | 'jump' | 'twirl';
export const MOVES: readonly Move[] = ['wave', 'hips', 'cheer', 'jump', 'twirl'];

export const ROUTINES_PER_SHIFT = 4;
export const DANCE_PAY = 14;
/** Paid on top when the routine was repeated without a wrong move. */
export const DANCE_TIP = 4;
export const DANCE_SHIFT_BONUS = 12;

/** The routines for a shift, seeded by the shift number: 3, 4, 5 then 6 moves, never the same move 3 times in a row. */
export function danceOrders(shift: number): Move[][] {
  const rng = makeRng(shift * 6151 + 17);
  return Array.from({ length: ROUTINES_PER_SHIFT }, (_, i) => {
    const out: Move[] = [];
    while (out.length < i + 3) {
      const m = MOVES[Math.floor(rng() * MOVES.length)];
      const n = out.length;
      if (n >= 2 && out[n - 1] === m && out[n - 2] === m) continue;
      out.push(m);
    }
    return out;
  });
}

export type Step = { ok: true; done: boolean } | { ok: false; expected: Move };

export function stepMove(routine: readonly Move[], done: number, move: Move): Step {
  const expected = routine[done];
  if (move !== expected) return { ok: false, expected };
  return { ok: true, done: done + 1 >= routine.length };
}

export const dancePay = (clean: boolean) => DANCE_PAY + (clean ? DANCE_TIP : 0);
