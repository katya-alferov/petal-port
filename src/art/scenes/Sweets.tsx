// A cupcake for Sweet Spot (game-systems §13), 200×220 box. Frosting color is a prop.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function CupcakeArt({ frosting, swirl, topping }: { frosting: string; swirl: string; topping: string }) {
  const top = swirl === 'swirl' ? 40 : 84;
  return (
    <g>
      {/* liner */}
      <path d="M44,120 L156,120 L142,200 Q100,210 58,200 Z" fill="#FFB3D0" {...sw} />
      {[70, 90, 110, 130].map((x) => (
        <path
          key={x}
          d={`M${x},124 L${x - 6 + (x - 100) * 0.1},196`}
          stroke="#FF7BA9"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.7}
        />
      ))}
      {/* frosting */}
      {swirl === 'swirl' ? (
        <g>
          <path d="M34,126 C26,96 60,84 70,92 C70,66 120,66 118,88 C150,82 170,104 164,126 Z" fill={frosting} {...sw} />
          <path d="M60,100 C84,112 120,104 140,94" fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
          <path d="M80,84 C100,92 120,80 124,72" fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.45} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d="M34,126 C30,98 60,88 100,88 C140,88 170,98 166,126 Z" fill={frosting} {...sw} />
          <path d="M56,104 C80,96 110,96 130,100" fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
        </g>
      )}
      {/* topping */}
      {topping === 'cherry' && (
        <g>
          <path d={`M100,${top + 2} Q108,${top - 22} 122,${top - 28}`} fill="none" stroke="#5FA67A" strokeWidth={4} strokeLinecap="round" />
          <circle cx={100} cy={top + 2} r={15} fill="#E8335A" {...sw} />
          <circle cx={95} cy={top - 3} r={4} fill="#FFFFFF" opacity={0.7} />
        </g>
      )}
      {topping === 'sprinkles' && (
        <g strokeWidth={5} strokeLinecap="round">
          {[
            [72, 104, '#FFC94A', 20],
            [100, 98, '#7ED6A7', -30],
            [128, 106, '#8EC9FF', 40],
            [86, 118, '#FF7BA9', -10],
            [116, 120, '#B692F6', 25],
            [104, top + 24, '#FFC94A', 60],
          ].map(([x, y, c, a], i) => (
            <path key={i} d={`M${x},${y} l10,0`} stroke={String(c)} transform={`rotate(${a} ${x} ${y})`} />
          ))}
        </g>
      )}
      {topping === 'star' && (
        <path
          d={`M100,${top - 14} L108,${top + 4} L128,${top + 6} L113,${top + 18} L118,${top + 38} L100,${top + 27} L82,${top + 38} L87,${top + 18} L72,${top + 6} L92,${top + 4} Z`}
          fill="#FFC94A"
          {...sw}
        />
      )}
      {topping === 'heart' && (
        <path
          d={`M100,${top + 34} C70,${top + 12} 72,${top - 8} 88,${top - 8} C95,${top - 8} 99,${top - 2} 100,${top + 2} C101,${top - 2} 105,${top - 8} 112,${top - 8} C128,${top - 8} 130,${top + 12} 100,${top + 34} Z`}
          fill="#FF4F86"
          {...sw}
        />
      )}
      {topping === 'candle' && (
        <g>
          <rect x={92} y={top - 14} width={16} height={46} rx={5} fill="#FFF7EC" {...sw} />
          <path d={`M92,${top + 2} l16,8 M92,${top + 14} l16,8`} stroke="#8EC9FF" strokeWidth={4} />
          <path
            d={`M100,${top - 40} C110,${top - 26} 108,${top - 18} 100,${top - 16} C92,${top - 18} 90,${top - 28} 100,${top - 40} Z`}
            fill="#FFC94A"
            {...sw}
          />
        </g>
      )}
    </g>
  );
}
