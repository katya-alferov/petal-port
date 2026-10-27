// Glow Nails (game-systems §18): a nail-art job. Each client shows the nails they'd like; paint yours the
// same way and check. A wrong nail wobbles and is named; you can fix it as often as you like. No timer;
// only the tip is missed when the first check wasn't perfect.
import { makeRng } from './rng';

export const NAIL_COLORS = ['rose', 'berry', 'sky', 'mint', 'sun', 'lilac'] as const;
export type NailColor = (typeof NAIL_COLORS)[number];
export const NAIL_NAMES = ['pinky', 'ring finger', 'middle finger', 'pointer', 'thumb'] as const;
export const NAILS = 5;

export interface NailOrder {
  colors: NailColor[];
  gems: boolean[];
}
export type NailWork = { colors: (NailColor | null)[]; gems: boolean[] };

export const CLIENTS_PER_SHIFT = 4;
export const NAILS_PAY = 14;
/** Paid on top when the first check was right. */
export const NAILS_TIP = 4;
export const NAILS_SHIFT_BONUS = 12;

export const emptyWork = (): NailWork => ({ colors: Array(NAILS).fill(null), gems: Array(NAILS).fill(false) });

/** The clients for a shift, seeded by the shift number: one color, two, three, then three plus gems. */
export function nailOrders(shift: number): NailOrder[] {
  const rng = makeRng(shift * 4421 + 9);
  return Array.from({ length: CLIENTS_PER_SHIFT }, (_, i) => {
    const pool = [...NAIL_COLORS];
    const kinds = i === 0 ? 1 : i === 1 ? 2 : 3;
    const chosen: NailColor[] = [];
    for (let k = 0; k < kinds; k++) chosen.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    const colors: NailColor[] = Array.from({ length: NAILS }, (_, n) => chosen[n % kinds]);
    // Mix the order a little so the pattern isn't always the same, but keep every chosen color in use.
    if (kinds > 1 && rng() < 0.5) colors.reverse();
    const gems: boolean[] = Array(NAILS).fill(false);
    if (i === CLIENTS_PER_SHIFT - 1) {
      const a = Math.floor(rng() * NAILS);
      gems[a] = true;
      gems[(a + 2) % NAILS] = true;
    }
    return { colors, gems };
  });
}

/** Indexes of nails that don't match the order yet. Empty means the nails are right. */
export function wrongNails(order: NailOrder, work: NailWork): number[] {
  const out: number[] = [];
  for (let i = 0; i < NAILS; i++) if (work.colors[i] !== order.colors[i] || work.gems[i] !== order.gems[i]) out.push(i);
  return out;
}

export const nailsPay = (clean: boolean) => NAILS_PAY + (clean ? NAILS_TIP : 0);
