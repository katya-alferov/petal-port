// Kitchen art: ingredients, bowl, pan, pancakes/crêpes and the decorated dish.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';

const sh = (base: string, shadow: string, highlight: string): Shade => ({ base, shadow, highlight });
const BOWL = sh('#8AD3DA', '#3BB7C4', '#CDEEEA');
const PAN = sh('#5B5566', '#3F3A48', '#7E778C');
const BATTER = '#FCE7B4';

export type Cook = 'raw' | 'pale' | 'golden' | 'toasty';
const COOK_SHADE: Record<Cook, Shade> = {
  raw: sh('#FCE7B4', '#EED39A', '#FFF5D9'),
  pale: sh('#F7DC9C', '#E6C47E', '#FFF0C8'),
  golden: sh('#E9A956', '#C98436', '#F6CB86'),
  toasty: sh('#B9743A', '#8E5426', '#D49A5E'),
};

/** Ingredient and topping icons (viewBox 0 0 100 100). */
export function KitchenIcon({ id }: { id: string }): ReactElement {
  const body = ((): ReactElement => {
    switch (id) {
      case 'ing.flour':
        return (
          <g>
            <path d="M24,30 L76,30 L82,90 L18,90 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M24,30 L32,16 L68,16 L76,30" fill="#E3D3CC" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M38,56 C40,44 60,44 62,56 C64,68 36,68 38,56 Z" fill="#FFC94A" stroke={OUTLINE} strokeWidth={3} />
          </g>
        );
      case 'ing.egg':
        return (
          <Shaded
            d="M50,14 C70,14 82,46 82,64 C82,82 68,92 50,92 C32,92 18,82 18,64 C18,46 30,14 50,14 Z"
            shade={sh('#FFF7EC', '#E8D9C8', '#FFFFFF')}
            depth={6}
            shine={[38, 36, 7, 12]}
          />
        );
      case 'ing.milk':
        return (
          <g>
            <path d="M26,34 L50,14 L74,34 L74,92 L26,92 Z" fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M26,52 L74,52 L74,76 L26,76 Z" fill="#3BB7C4" stroke={OUTLINE} strokeWidth={3} />
            <path d="M44,20 L56,20 L56,8 L44,8 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={3} />
          </g>
        );
      case 'ing.butter':
        return (
          <g>
            <path d="M14,56 L60,40 L88,52 L42,70 Z" fill="#FFF3B8" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M14,56 L42,70 L42,88 L14,74 Z" fill="#F2D67A" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M42,70 L88,52 L88,70 L42,88 Z" fill="#FFE08A" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          </g>
        );
      case 'ing.carrot':
        return (
          <g>
            <path
              d="M30,30 C40,26 56,30 60,40 L30,92 C24,70 22,44 30,30 Z"
              fill="#FF8A65"
              stroke={OUTLINE}
              strokeWidth={4}
              strokeLinejoin="round"
              transform="rotate(-20 45 60)"
            />
            <path d="M44,22 L40,6 M50,24 L58,8 M38,26 L26,14" stroke="#5FA67A" strokeWidth={6} strokeLinecap="round" />
          </g>
        );
      case 'ing.fish':
        return (
          <g>
            <path d="M14,50 C30,26 64,26 76,50 C64,74 30,74 14,50 Z" fill="#8AD3DA" stroke={OUTLINE} strokeWidth={4} />
            <path d="M74,50 L92,34 L92,66 Z" fill="#8AD3DA" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={32} cy={46} r={4} fill={OUTLINE} />
          </g>
        );
      default:
        return <Topping id={id} x={50} y={54} s={1.6} />;
    }
  })();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {body}
    </svg>
  );
}

/** A topping centred at (x, y), base size ~24 units times s. */
export function Topping({ id, x, y, s = 1 }: { id: string; x: number; y: number; s?: number }): ReactElement | null {
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (id) {
    case 'deco.berries':
      return (
        <g transform={t}>
          {[
            [-7, 3],
            [7, 3],
            [0, -8],
          ].map(([dx, dy]) => (
            <g key={`${dx}${dy}`}>
              <circle cx={dx} cy={dy} r={8} fill="#5B6FD6" stroke={OUTLINE} strokeWidth={2.5} />
              <circle cx={dx - 2.5} cy={dy - 2.5} r={2} fill="#FFFFFF" opacity={0.7} />
            </g>
          ))}
        </g>
      );
    case 'deco.banana':
      return (
        <g transform={t}>
          <circle r={12} fill="#FFF3B8" stroke={OUTLINE} strokeWidth={2.5} />
          <circle r={4} fill="#E6C47E" />
        </g>
      );
    case 'deco.syrup':
      return (
        <g transform={t}>
          <path
            d="M-14,-6 C-6,-14 6,-14 14,-6 C16,4 6,14 0,10 C-6,14 -16,4 -14,-6 Z"
            fill="#C9772E"
            stroke={OUTLINE}
            strokeWidth={2.5}
            opacity={0.9}
          />
          <ellipse cx={-4} cy={-6} rx={4} ry={2} fill="#FFFFFF" opacity={0.6} />
        </g>
      );
    case 'deco.cream':
      return (
        <g transform={t}>
          <path d={scallopCircle(0, 2, 11, 6, 3)} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2.5} />
          <path d="M-6,-4 C-2,-14 2,-14 4,-16 C6,-10 8,-8 6,-4 Z" fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2.5} />
        </g>
      );
    case 'deco.sprinkles':
      return (
        <g transform={t}>
          {['#FF7BA9', '#FFC94A', '#7ED6A7', '#B39DFF', '#3BB7C4', '#FF8A65'].map((c, i) => (
            <rect
              key={c}
              x={-12 + (i % 3) * 9}
              y={-8 + Math.floor(i / 3) * 10}
              width={8}
              height={3.5}
              rx={1.7}
              fill={c}
              transform={`rotate(${i * 50} ${-8 + (i % 3) * 9} ${-6 + Math.floor(i / 3) * 10})`}
            />
          ))}
        </g>
      );
    case 'deco.lemon':
      return (
        <g transform={t}>
          <path d="M-13,4 A13,13 0 0 1 13,4 Z" fill="#FFE08A" stroke={OUTLINE} strokeWidth={2.5} />
          <path d="M-9,3 A9,9 0 0 1 9,3 Z" fill="#FFF3B8" />
        </g>
      );
    case 'deco.sugar':
      return (
        <g transform={t}>
          {[
            [-8, -4],
            [0, 4],
            [8, -2],
            [-4, 8],
            [6, 8],
            [2, -8],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={2.6} fill="#FFFFFF" stroke="#D9D3E0" strokeWidth={1} />
          ))}
        </g>
      );
    case 'deco.strawberry':
      return (
        <g transform={t}>
          <path d="M0,14 C-14,6 -14,-8 -6,-10 C-2,-11 2,-11 6,-10 C14,-8 14,6 0,14 Z" fill="#E5484D" stroke={OUTLINE} strokeWidth={2.5} />
          <path d="M-6,-10 L0,-16 L6,-10 L0,-8 Z" fill="#5FA67A" stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" />
          {[
            [-4, -2],
            [4, -2],
            [0, 5],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={1.4} fill="#FFF3B8" />
          ))}
        </g>
      );
    case 'deco.chocolate':
      return (
        <g transform={t}>
          <rect x={-12} y={-9} width={24} height={18} rx={3} fill="#6B4430" stroke={OUTLINE} strokeWidth={2.5} />
          <path d="M0,-9 L0,9 M-12,0 L12,0" stroke="#523222" strokeWidth={2} />
        </g>
      );
    default:
      return null;
  }
}

/** Mixing bowl (viewBox 0 0 300 220). `mix` 0..1 smooths the batter; `count` is how many things went in. */
export function BowlArt({ count, mix }: { count: number; mix: number }) {
  const lumps = mix < 1 ? Math.round((1 - mix) * 7) : 0;
  return (
    <g>
      {count > 0 && <ellipse cx={150} cy={86} rx={108} ry={22} fill={mix > 0 ? BATTER : '#FFF7EC'} stroke={OUTLINE} strokeWidth={3} />}
      {count > 0 &&
        Array.from({ length: lumps }, (_, i) => (
          <circle
            key={i}
            cx={80 + ((i * 47) % 140)}
            cy={80 + ((i * 7) % 12)}
            r={7}
            fill={i % 2 ? '#F2D67A' : '#FFF7EC'}
            stroke={OUTLINE}
            strokeWidth={2}
          />
        ))}
      {mix >= 1 && <path d="M110,84 C130,74 160,94 190,82" fill="none" stroke="#EED39A" strokeWidth={5} strokeLinecap="round" />}
      <Shaded d="M30,80 L270,80 C270,150 220,200 150,200 C80,200 30,150 30,80 Z" shade={BOWL} depth={8} shine={[70, 110, 10, 24]} />
      <ellipse cx={150} cy={80} rx={120} ry={22} fill="none" stroke={OUTLINE} strokeWidth={4} />
    </g>
  );
}

/** Frying pan with the pancake (viewBox 0 0 300 220). `size` 0..1 is how far the batter has spread. */
export function PanArt({
  size,
  cook,
  bubbles,
  folded = 0,
  crepe = false,
}: {
  size: number;
  cook: Cook;
  bubbles: boolean;
  folded?: number;
  crepe?: boolean;
}) {
  const r = 96 * size;
  const shade = COOK_SHADE[cook];
  return (
    <g>
      <path d="M250,118 L300,96" stroke={OUTLINE} strokeWidth={22} strokeLinecap="round" />
      <path d="M250,118 L300,96" stroke="#C98F5E" strokeWidth={14} strokeLinecap="round" />
      <Shaded
        d="M20,120 C20,80 80,62 140,62 C200,62 260,80 260,120 C260,160 200,180 140,180 C80,180 20,160 20,120 Z"
        shade={PAN}
        depth={6}
      />
      <ellipse cx={140} cy={116} rx={104} ry={46} fill="#2E2A36" />
      <ellipse
        cx={140}
        cy={116}
        rx={98}
        ry={42}
        fill="none"
        stroke="#FFF7EC"
        strokeWidth={3}
        strokeDasharray="8 8"
        opacity={size < 0.95 ? 0.7 : 0}
      />
      {size > 0 && folded === 0 && (
        <g>
          <ellipse cx={140} cy={crepe ? 118 : 112} rx={r} ry={r * 0.44} fill={shade.shadow} stroke={OUTLINE} strokeWidth={3} />
          {!crepe && <ellipse cx={136} cy={106} rx={r * 0.92} ry={r * 0.38} fill={shade.base} />}
          <ellipse cx={120} cy={102} rx={r * 0.3} ry={r * 0.08} fill={shade.highlight} opacity={0.7} />
          {bubbles &&
            [
              [110, 110],
              [150, 100],
              [170, 118],
              [130, 122],
              [96, 100],
            ].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="none" stroke={shade.shadow} strokeWidth={2} />)}
        </g>
      )}
      {folded > 0 && (
        <Shaded
          d={
            folded === 1 ? 'M50,116 C50,90 100,76 140,76 C180,76 230,90 230,116 Z' : 'M90,116 C90,92 120,80 140,80 C160,80 190,92 190,116 Z'
          }
          shade={shade}
          depth={5}
        />
      )}
    </g>
  );
}

export interface DishToppingSpot {
  id: string;
  x: number;
  y: number;
}

/** The finished dish on a plate (viewBox 0 0 300 200). Topping x/y are 0..1 across the food. */
export function DishArt({ recipe, cook, toppings }: { recipe: string; cook: Cook; toppings: DishToppingSpot[] }) {
  const shade = COOK_SHADE[cook];
  const crepe = recipe === 'recipe.crepes';
  return (
    <g>
      <ellipse cx={150} cy={150} rx={140} ry={44} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={150} cy={146} rx={100} ry={28} fill="#F1E7EF" />
      {crepe ? (
        <Shaded d="M70,150 C70,110 110,88 150,88 C190,88 230,110 230,150 C200,140 100,140 70,150 Z" shade={shade} depth={6} />
      ) : (
        [0, 1, 2].map((i) => (
          <g key={i}>
            <ellipse cx={150} cy={142 - i * 18} rx={92} ry={26} fill={shade.shadow} stroke={OUTLINE} strokeWidth={3} />
            <ellipse cx={146} cy={137 - i * 18} rx={86} ry={20} fill={shade.base} />
          </g>
        ))
      )}
      {toppings.map((t, i) => (
        <Topping key={i} id={t.id} x={80 + t.x * 140} y={(crepe ? 104 : 88) + t.y * 30} s={1.4} />
      ))}
    </g>
  );
}

/** Whisk icon for the mix step. */
export function WhiskIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50,92 L50,58" stroke={OUTLINE} strokeWidth={10} strokeLinecap="round" />
      <path d="M50,92 L50,58" stroke="#C98F5E" strokeWidth={5} strokeLinecap="round" />
      {[-16, -6, 6, 16].map((dx) => (
        <path key={dx} d={`M50,58 C${50 + dx * 2},40 ${50 + dx},12 50,10`} fill="none" stroke="#B4ABBF" strokeWidth={4} />
      ))}
    </svg>
  );
}
