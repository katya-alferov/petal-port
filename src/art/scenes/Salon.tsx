// Glam Salon art (game-systems §10.1): the room behind the chair, the client's cape, and wash bubbles.
// The backdrop uses the 1170×2532 scene canvas, anchored to the top; cape and bubbles share the
// client's cropped rig box (viewBox "40 0 320 470").
import { OUTLINE, Shaded, scallopCircle } from '../kit';

const PINK = { base: '#FF9BBE', shadow: '#E07AA0', highlight: '#FFC2D6' };
const LILAC = { base: '#C7B4FF', shadow: '#A08ADB', highlight: '#E2D8FF' };

export function SalonBackdrop() {
  return (
    <svg
      viewBox="0 0 1170 2532"
      preserveAspectRatio="xMidYMin slice"
      role="img"
      aria-label="Inside the Glam Salon"
      data-testid="salon-backdrop"
    >
      <rect width={1170} height={2532} fill="#FFE3EE" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 130} y={0} width={60} height={2532} fill="#FFD3E2" />
      ))}
      {/* Big mirror with bulbs */}
      <rect x={250} y={260} width={670} height={900} rx={320} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={10} />
      <rect x={290} y={300} width={590} height={820} rx={290} fill="#DDF4F6" />
      <path d="M380,420 C420,360 480,330 540,320" fill="none" stroke="#FFFFFF" strokeWidth={22} strokeLinecap="round" opacity={0.85} />
      {Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI * (1 + i / 10);
        return (
          <circle
            key={i}
            cx={585 + Math.cos(a) * 360}
            cy={600 + Math.sin(a) * 360}
            r={26}
            fill="#FFE08A"
            stroke={OUTLINE}
            strokeWidth={6}
          />
        );
      })}
      {/* Shelf with bottles */}
      <Shaded d="M0,1300 L230,1300 L230,1340 L0,1340 Z" shade={LILAC} depth={4} />
      {[30, 90, 150].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={1200 - i * 20}
            width={44}
            height={100 + i * 20}
            rx={12}
            fill={['#7ED6A7', '#FF7BA9', '#FFC94A'][i]}
            stroke={OUTLINE}
            strokeWidth={5}
          />
          <rect x={x + 12} y={1180 - i * 20} width={20} height={24} rx={4} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
        </g>
      ))}
      <Shaded d="M940,1300 L1170,1300 L1170,1340 L940,1340 Z" shade={LILAC} depth={4} />
      <path d={scallopCircle(1050, 1230, 60, 9, 8)} fill="#7ED6A7" stroke={OUTLINE} strokeWidth={5} />
      <rect x={1010} y={1240} width={80} height={60} rx={10} fill="#FF8A65" stroke={OUTLINE} strokeWidth={5} />
      {/* Chair back peeking out behind the client */}
      <Shaded d="M330,1240 C330,1100 840,1100 840,1240 L840,1900 L330,1900 Z" shade={PINK} depth={10} />
      <path d="M380,1260 C380,1170 790,1170 790,1260" fill="none" stroke={PINK.highlight} strokeWidth={18} strokeLinecap="round" />
    </svg>
  );
}

/** A salon cape over the client's clothes, in the client's cropped rig box. */
export function Cape() {
  return (
    <g>
      <path
        d="M200,236 C150,236 110,250 96,270 L30,470 L370,470 L304,270 C290,250 250,236 200,236 Z"
        fill="#B39DFF"
        stroke={OUTLINE}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M150,300 L120,470 M200,300 L200,470 M250,300 L280,470" stroke="#9A82D8" strokeWidth={4} />
      <path d="M160,242 C180,256 220,256 240,242" fill="none" stroke="#FFF7EC" strokeWidth={10} strokeLinecap="round" />
      {[
        [130, 360],
        [270, 400],
        [210, 440],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x},${y - 10} L${x + 3},${y - 3} L${x + 10},${y} L${x + 3},${y + 3} L${x},${y + 10} L${x - 3},${y + 3} L${x - 10},${y} L${x - 3},${y - 3} Z`}
          fill="#FFF7EC"
        />
      ))}
    </g>
  );
}

/** Where the foam sits on the client's head, in rig units. */
export const BUBBLE_SPOTS: [number, number][] = [
  [140, 82],
  [200, 54],
  [260, 82],
  [122, 140],
  [278, 140],
];

export function Foam({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x - 12} cy={y + 6} r={16} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={x + 12} cy={y + 4} r={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={x} cy={y - 10} r={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={x - 4} cy={y - 14} r={5} fill="#BDE8EC" />
    </g>
  );
}
