// Bun & Bite burger layers (game-systems §12). Each layer is drawn in a 240-wide box from its
// own top edge; BurgerStack piles them from the plate up. Original drawings, plum outline.
import type { ReactNode } from 'react';
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

interface Layer {
  h: number;
  draw: (y: number) => ReactNode;
}

export const BURGER_LAYERS: Record<string, Layer> = {
  'bun-bottom': {
    h: 34,
    draw: (y) => <path d={`M20,${y} L220,${y} L212,${y + 26} Q120,${y + 40} 28,${y + 26} Z`} fill="#F2B45B" {...sw} />,
  },
  patty: {
    h: 34,
    draw: (y) => <rect x={14} y={y + 4} width={212} height={30} rx={15} fill="#8A5A3C" {...sw} />,
  },
  cheese: {
    h: 20,
    draw: (y) => (
      <path
        d={`M12,${y} L228,${y} L204,${y + 18} L180,${y + 4} L150,${y + 22} L100,${y + 6} L60,${y + 20} L30,${y + 6} Z`}
        fill="#FFD84A"
        {...sw}
      />
    ),
  },
  lettuce: {
    h: 22,
    draw: (y) => (
      <path
        d={`M10,${y + 10} q16,-14 32,0 q16,14 32,0 q16,-14 32,0 q16,14 32,0 q16,-14 32,0 q16,14 32,0 q8,-6 20,-2 L226,${y + 22} L14,${y + 22} Z`}
        fill="#7ED6A7"
        {...sw}
      />
    ),
  },
  tomato: {
    h: 24,
    draw: (y) => (
      <g>
        <rect x={22} y={y + 2} width={196} height={20} rx={10} fill="#FF6B5E" {...sw} />
        <circle cx={70} cy={y + 12} r={3} fill="#FFE0DA" />
        <circle cx={120} cy={y + 12} r={3} fill="#FFE0DA" />
        <circle cx={170} cy={y + 12} r={3} fill="#FFE0DA" />
      </g>
    ),
  },
  pickle: {
    h: 20,
    draw: (y) => (
      <g>
        {[56, 120, 184].map((x) => (
          <ellipse key={x} cx={x} cy={y + 12} rx={26} ry={9} fill="#9BD16A" {...sw} />
        ))}
      </g>
    ),
  },
  'bun-top': {
    h: 78,
    draw: (y) => (
      <g>
        <path d={`M18,${y + 78} C18,${y + 8} 222,${y + 8} 222,${y + 78} Z`} fill="#F2B45B" {...sw} />
        <path d={`M60,${y + 30} q20,-10 40,-4`} fill="none" stroke="#FFE7B8" strokeWidth={6} strokeLinecap="round" />
        {[90, 130, 160, 110].map((x, i) => (
          <ellipse
            key={i}
            cx={x + 20}
            cy={y + 34 + (i % 2) * 14}
            rx={6}
            ry={3}
            fill="#FFF7EC"
            stroke={OUTLINE}
            strokeWidth={2}
            transform={`rotate(${i * 25} ${x + 20} ${y + 34})`}
          />
        ))}
      </g>
    ),
  },
};

export const LAYER_NAMES: Record<string, string> = {
  'bun-bottom': 'Bottom bun',
  patty: 'Patty',
  cheese: 'Cheese',
  lettuce: 'Lettuce',
  tomato: 'Tomato',
  pickle: 'Pickles',
  'bun-top': 'Top bun',
};

/** The stack from the plate up. `ghost` draws layers faded (the order card's preview of what is still to come). */
export function BurgerStack({ parts, ghost = 0 }: { parts: readonly string[]; ghost?: number }) {
  const total = parts.reduce((n, p) => n + (BURGER_LAYERS[p]?.h ?? 0), 0);
  const H = Math.max(total + 30, 150);
  let y = H - 14;
  const nodes: ReactNode[] = [];
  parts.forEach((p, i) => {
    const l = BURGER_LAYERS[p];
    if (!l) return;
    y -= l.h;
    nodes.push(
      <g key={i} opacity={i >= parts.length - ghost ? 0.35 : 1}>
        {l.draw(y)}
      </g>,
    );
  });
  return (
    <svg viewBox={`0 0 240 ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <ellipse cx={120} cy={H - 8} rx={112} ry={9} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
      {nodes}
    </svg>
  );
}

/** One ingredient as a small icon. */
export function IngredientIcon({ id }: { id: string }) {
  const l = BURGER_LAYERS[id];
  if (!l) return null;
  const h = id === 'bun-top' ? 90 : 60;
  const y = id === 'bun-top' ? 6 : 14;
  return (
    <svg viewBox={`0 0 240 ${h}`} aria-hidden="true" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {l.draw(y)}
    </svg>
  );
}
