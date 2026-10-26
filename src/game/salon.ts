// Glam Salon (game-systems §10.1): a second job. Each client shows a style card (hairstyle, color,
// accessory); wash, style, then show the mirror. A wrong look just says what to change: no timer,
// nothing lost, only the first-look tip is missed.
import { makeRng, pick } from './rng';

export interface SalonMenu {
  styles: readonly string[];
  colors: readonly string[];
  accessories: readonly string[];
}

export interface SalonLook {
  style: string;
  color: string;
  accessory: string;
}

export const CLIENTS_PER_SHIFT = 3;
export const WASH_BUBBLES = 5;
export const SALON_PAY = 12;
/** Paid on top when the first mirror look is already right. */
export const SALON_TIP = 4;
export const SALON_SHIFT_BONUS = 10;

const key = (l: SalonLook) => `${l.style}|${l.color}|${l.accessory}`;

/** The clients' wishes for a shift, seeded by the shift number; never the same wish twice in a shift. */
export function salonOrders(shift: number, menu: SalonMenu): SalonLook[] {
  const rng = makeRng(shift * 4099 + 11);
  const out: SalonLook[] = [];
  while (out.length < CLIENTS_PER_SHIFT) {
    const look = { style: pick(rng, menu.styles), color: pick(rng, menu.colors), accessory: pick(rng, menu.accessories) };
    if (!out.some((o) => key(o) === key(look))) out.push(look);
  }
  return out;
}

export interface LookCheck {
  correct: boolean;
  /** The parts that still differ from the style card. */
  wrong: ('style' | 'color' | 'accessory')[];
}

export function checkLook(want: SalonLook, have: Partial<SalonLook>): LookCheck {
  const wrong = (['style', 'color', 'accessory'] as const).filter((k) => have[k] !== want[k]);
  return { correct: wrong.length === 0, wrong: [...wrong] };
}

export function clientPay(firstLook: boolean): number {
  return SALON_PAY + (firstLook ? SALON_TIP : 0);
}
