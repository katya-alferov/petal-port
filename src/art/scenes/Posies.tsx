// Petal Posies art (game-systems §19): flower heads, and a wrapped bouquet that fans out up to 8 flowers.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** One flower head centred at (0,0), about 56 units wide. */
export function FlowerHead({ id }: { id: string }) {
  switch (id) {
    case 'rose':
      return (
        <g>
          <circle r={26} fill="#FF7BA9" {...sw} />
          <path
            d="M-14,-4 C-14,-18 14,-18 14,-4 C14,10 -8,14 -8,2 C-8,-6 6,-6 6,2"
            fill="none"
            stroke="#C94C8A"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx={-9} cy={-12} r={4} fill="#FFFFFF" opacity={0.5} />
        </g>
      );
    case 'tulip':
      return (
        <g>
          <path d="M-22,-14 L-22,6 C-22,24 22,24 22,6 L22,-14 L10,-4 L0,-20 L-10,-4 Z" fill="#FF8A65" {...sw} />
          <path d="M-8,-4 L0,-20 L8,-4 L0,18 Z" fill="#FFB199" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      );
    case 'daisy':
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cx={0} cy={-17} rx={7} ry={13} fill="#FFFFFF" {...sw} strokeWidth={2.5} transform={`rotate(${i * 36})`} />
          ))}
          <circle r={9} fill="#FFC94A" {...sw} />
        </g>
      );
    case 'sunflower':
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx={0} cy={-20} rx={7} ry={13} fill="#FFC94A" {...sw} strokeWidth={2.5} transform={`rotate(${i * 30})`} />
          ))}
          <circle r={13} fill="#8A5A3C" {...sw} />
          <circle cx={-4} cy={-4} r={3} fill="#B07A52" />
        </g>
      );
    case 'lilac':
      return (
        <g>
          {[
            [0, -22],
            [-12, -10],
            [12, -10],
            [-6, 2],
            [8, 2],
            [0, 14],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={9} fill="#B692F6" {...sw} strokeWidth={2.5} />
          ))}
        </g>
      );
    default:
      return (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path
              key={i}
              d="M0,0 C-10,-12 -8,-28 0,-30 C8,-28 10,-12 0,0 Z"
              fill="#FFB3D1"
              {...sw}
              strokeWidth={2.5}
              transform={`rotate(${i * 60})`}
            />
          ))}
          <circle r={5} fill="#FFC94A" stroke={OUTLINE} strokeWidth={2.5} />
        </g>
      );
  }
}

const SPOTS = [
  [150, 70, -8],
  [100, 98, -22],
  [200, 98, 22],
  [64, 138, -34],
  [236, 138, 34],
  [124, 132, -12],
  [176, 132, 12],
  [150, 112, 0],
];

/** A wrapped bouquet (viewBox 0 0 300 330). `wrap` is the paper color; null shows plain brown paper. */
export function BouquetArt({ flowers, wrap }: { flowers: readonly string[]; wrap: { main: string; accent: string } | null }) {
  const paper = wrap?.main ?? '#D9B98C';
  const edge = wrap?.accent ?? '#EBD3AE';
  return (
    <svg viewBox="0 0 300 330" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      {flowers.slice(0, SPOTS.length).map((_, i) => {
        const [x, y] = SPOTS[i];
        return (
          <path
            key={i}
            d={`M150,230 C150,200 ${x},${y + 60} ${x},${y + 20}`}
            fill="none"
            stroke="#5FA67A"
            strokeWidth={6}
            strokeLinecap="round"
          />
        );
      })}
      {flowers.slice(0, SPOTS.length).map((f, i) => {
        const [x, y, r] = SPOTS[i];
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} className="pop-in">
            <FlowerHead id={f} />
          </g>
        );
      })}
      <path d="M70,190 L230,190 L172,318 L128,318 Z" fill={paper} {...sw} strokeWidth={5} />
      <path d="M70,190 L230,190 L214,224 L86,224 Z" fill={edge} {...sw} strokeWidth={4} />
      <path d="M128,318 L150,236 L172,318" fill="none" stroke={OUTLINE} strokeWidth={3} opacity={0.35} />
      <path d="M134,226 C120,246 118,256 132,262 L150,246 L168,262 C182,256 180,246 166,226 Z" fill="#FF7BA9" {...sw} strokeWidth={4} />
    </svg>
  );
}
