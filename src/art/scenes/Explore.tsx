// Art for the explore places (game-systems §30): tide pool creatures and rocks, the starry sky.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Creature({ id }: { id: string }) {
  const eyes = (x: number, y: number, gap = 12) => (
    <g>
      <circle cx={x - gap / 2} cy={y} r={3.2} fill="#FFFFFF" {...sw} strokeWidth={2} />
      <circle cx={x + gap / 2} cy={y} r={3.2} fill="#FFFFFF" {...sw} strokeWidth={2} />
      <circle cx={x - gap / 2} cy={y} r={1.4} fill={OUTLINE} />
      <circle cx={x + gap / 2} cy={y} r={1.4} fill={OUTLINE} />
    </g>
  );
  let body;
  switch (id) {
    case 'crab':
      body = (
        <g>
          <path d="M22,44 L10,34 M78,44 L90,34 M26,54 L12,58 M74,54 L88,58" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
          <circle cx={12} cy={30} r={8} fill="#FF7A5C" {...sw} />
          <circle cx={88} cy={30} r={8} fill="#FF7A5C" {...sw} />
          <ellipse cx={50} cy={50} rx={30} ry={20} fill="#FF7A5C" {...sw} />
          <path d="M42,32 L42,24 M58,32 L58,24" stroke={OUTLINE} strokeWidth={3} />
          {eyes(50, 22, 16)}
          <path d="M44,56 Q50,62 56,56" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
      break;
    case 'hermit':
      body = (
        <g>
          <ellipse cx={30} cy={62} rx={22} ry={11} fill="#FFB38A" {...sw} />
          <path d="M44,64 C44,30 84,26 84,56 C84,70 60,72 44,64 Z" fill="#FFE2B8" {...sw} />
          <path d="M52,60 C54,44 70,42 72,54 M60,62 C62,52 70,50 72,56" fill="none" stroke="#E8B27A" strokeWidth={3} />
          <path d="M22,50 L22,38 M36,50 L36,40" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
          {eyes(29, 36, 14)}
        </g>
      );
      break;
    case 'snail':
      body = (
        <g>
          <path d="M14,66 C30,60 56,60 80,66 C84,70 12,72 14,66 Z" fill="#B7E1C4" {...sw} />
          <circle cx={56} cy={42} r={22} fill="#FFC94A" {...sw} />
          <path d="M56,42 m-12,0 a12,12 0 1,1 12,12 a6,6 0 1,1 -6,-6" fill="none" stroke="#D9A022" strokeWidth={3.5} />
          <path d="M18,62 L16,44 M28,62 L30,44" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
          <circle cx={16} cy={42} r={3.5} fill="#FFFFFF" {...sw} strokeWidth={2} />
          <circle cx={30} cy={42} r={3.5} fill="#FFFFFF" {...sw} strokeWidth={2} />
        </g>
      );
      break;
    case 'urchin':
      body = (
        <g>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M${50 + Math.cos(a) * 18},${46 + Math.sin(a) * 18} L${50 + Math.cos(a) * 34},${46 + Math.sin(a) * 34}`}
                stroke={OUTLINE}
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={50} cy={46} r={22} fill="#B692F6" {...sw} />
          {eyes(50, 44, 14)}
          <path d="M45,53 Q50,57 55,53" fill="none" stroke={OUTLINE} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
      break;
    case 'octopus':
      body = (
        <g>
          {[16, 32, 48, 64, 80].map((x, i) => (
            <path
              key={x}
              d={`M${x + 4},50 C${x - 8},64 ${x + 8},66 ${x - 2},76`}
              fill="none"
              stroke={OUTLINE}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={i % 2 ? 1 : 1}
            />
          ))}
          {[16, 32, 48, 64, 80].map((x) => (
            <path
              key={`i${x}`}
              d={`M${x + 4},50 C${x - 8},64 ${x + 8},66 ${x - 2},76`}
              fill="none"
              stroke="#FF8FB8"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          ))}
          <path d="M24,50 C20,10 80,10 76,50 Z" fill="#FF8FB8" {...sw} />
          {eyes(50, 38, 22)}
          <path d="M44,46 Q50,51 56,46" fill="none" stroke={OUTLINE} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
      break;
    case 'seastar':
      body = (
        <g>
          <path d="M50,6 L61,32 L90,34 L68,52 L76,78 L50,63 L24,78 L32,52 L10,34 L39,32 Z" fill="#FF9E57" {...sw} />
          {eyes(50, 38, 12)}
          <path d="M46,48 Q50,52 54,48" fill="none" stroke={OUTLINE} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
      break;
    case 'clam':
      body = (
        <g>
          <path d="M12,56 C12,16 88,16 88,56 C88,72 12,72 12,56 Z" fill="#FFADCA" {...sw} />
          <path d="M50,20 L50,66 M32,24 L36,66 M68,24 L64,66" fill="none" stroke="#E07BA0" strokeWidth={3} />
          <path d="M16,56 C30,50 70,50 84,56" fill="none" stroke={OUTLINE} strokeWidth={3} />
          <circle cx={50} cy={50} r={6} fill="#FFFFFF" {...sw} strokeWidth={2.5} />
        </g>
      );
      break;
    default:
      body = (
        <g>
          <path d="M16,50 C16,28 44,22 64,36 C74,30 82,32 88,40 C84,50 76,56 66,56 C46,66 16,66 16,50 Z" fill="#FFA08A" {...sw} />
          <path d="M30,52 C44,58 58,56 66,50" fill="none" stroke="#E9694F" strokeWidth={3} />
          <path d="M22,42 L10,30 M26,36 L18,22" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
          <circle cx={30} cy={42} r={3.5} fill="#FFFFFF" {...sw} strokeWidth={2} />
          <circle cx={30} cy={42} r={1.4} fill={OUTLINE} />
        </g>
      );
  }
  return body;
}

/** A tide pool creature in a 100×80 box. */
export function CreatureArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <Creature id={id} />
    </svg>
  );
}

/** A rock in a 100×80 box: closed, or tipped over to show what is under it. */
export function RockArt({ open, under }: { open: boolean; under: string | null }) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <ellipse cx={50} cy={64} rx={44} ry={12} fill="#F2D9A8" stroke={OUTLINE} strokeWidth={3} />
      {open ? (
        <g>
          {under && (
            <g transform="translate(18 -2) scale(0.64)">
              <Creature id={under} />
            </g>
          )}
          <path d="M60,44 C64,28 90,30 94,46 C96,58 62,62 60,44 Z" fill="#B7B0C4" {...sw} />
        </g>
      ) : (
        <g>
          <path d="M12,60 C8,24 40,12 66,18 C90,24 96,44 88,60 C60,68 30,68 12,60 Z" fill="#B7B0C4" {...sw} />
          <path d="M26,34 C32,26 44,24 52,26" fill="none" stroke="#E3DFEC" strokeWidth={5} strokeLinecap="round" />
          <path d="M60,46 L68,40 M50,52 L56,48" stroke="#8E86A0" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** The night sky for Starlight Hill (viewBox 390×560, anchored to the bottom). */
export function SkyArt() {
  const dots: [number, number][] = [
    [30, 40],
    [90, 120],
    [150, 60],
    [250, 90],
    [330, 50],
    [360, 150],
    [60, 210],
    [310, 240],
    [200, 30],
    [20, 300],
    [370, 330],
  ];
  return (
    <svg
      viewBox="0 0 390 560"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F2A6B" />
          <stop offset="1" stopColor="#7A5FB8" />
        </linearGradient>
      </defs>
      <rect width={390} height={560} fill="url(#sky-grad)" />
      {dots.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.5} fill="#FFF7EC" opacity={0.7} />
      ))}
      <circle cx={320} cy={92} r={30} fill="#FFF3C4" stroke={OUTLINE} strokeWidth={3.5} />
      <circle cx={332} cy={84} r={26} fill="#2F2A6B" opacity={0.0} />
      <path d="M0,520 C80,480 160,500 240,486 C300,476 350,490 390,480 L390,560 L0,560 Z" fill="#3E7D6A" stroke={OUTLINE} strokeWidth={4} />
    </svg>
  );
}
