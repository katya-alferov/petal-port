// Title scene: the Petalport waterfront (scene canvas 1170×2532).
import type { ReactNode } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';

// Pre-shaded palette colors (base, shadow, highlight) for the quay houses.
const HOUSE_SHADES: Shade[] = [
  { base: '#FF8A65', shadow: '#D86A58', highlight: '#FFB89E' },
  { base: '#FFC94A', shadow: '#D6A246', highlight: '#FFDE8D' },
  { base: '#7ED6A7', shadow: '#68AE92', highlight: '#AEE6C6' },
  { base: '#FF7BA9', shadow: '#D86094', highlight: '#FFADCA' },
  { base: '#B39DFF', shadow: '#9A82D8', highlight: '#D0C2FF' },
  { base: '#3BB7C4', shadow: '#3D94A8', highlight: '#8AD3DA' },
  { base: '#FFF7EC', shadow: '#D8C8CA', highlight: '#FFFBF2' },
];

function House({ x, y, w, h, color, roof }: { x: number; y: number; w: number; h: number; color: Shade; roof: Shade }) {
  return (
    <g>
      <Shaded d={`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`} shade={color} depth={8} />
      <Shaded d={`M${x - 10},${y + 2} L${x + w / 2},${y - w * 0.5} L${x + w + 10},${y + 2} Z`} shade={roof} depth={6} />
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={x + w * 0.18 + c * w * 0.4}
            y={y + h * 0.2 + r * h * 0.36}
            width={w * 0.24}
            height={h * 0.2}
            rx={6}
            fill="#BDE8EC"
            stroke={OUTLINE}
            strokeWidth={3}
          />
        )),
      )}
    </g>
  );
}

/** Top of the boardwalk the player stands on. */
export const BOARDWALK_Y = 1960;

export function Waterfront({ sailing = false, children }: { sailing?: boolean; children?: ReactNode }) {
  const houses = Array.from({ length: 9 }).map((_, i) => ({
    x: 30 + i * 128,
    w: 108,
    h: 150 + ((i * 53) % 90),
    color: HOUSE_SHADES[i % HOUSE_SHADES.length],
    roof: HOUSE_SHADES[(i + 3) % HOUSE_SHADES.length],
  }));
  return (
    <svg
      viewBox="0 0 1170 2532"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="The Petalport waterfront on a sunny morning"
      data-testid="waterfront"
    >
      <defs>
        <linearGradient id="wf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9B8FF" />
          <stop offset="0.45" stopColor="#BDE8EC" />
          <stop offset="1" stopColor="#FFE7C2" />
        </linearGradient>
        <linearGradient id="wf-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3BB7C4" />
          <stop offset="1" stopColor="#1F6F8B" />
        </linearGradient>
      </defs>
      <rect width={1170} height={1560} fill="url(#wf-sky)" />
      <circle cx={880} cy={1120} r={120} fill="#FFE08A" opacity={0.6} />
      <circle cx={880} cy={1120} r={86} fill="#FFC94A" stroke={OUTLINE} strokeWidth={4} />
      <g opacity={0.95}>
        <path d={scallopCircle(220, 760, 60, 9, 8)} fill="#FFF7EC" />
        <path d={scallopCircle(300, 790, 48, 8, 7)} fill="#FFF7EC" />
        <path d={scallopCircle(900, 640, 52, 8, 7)} fill="#FFF7EC" />
        <path d={scallopCircle(960, 670, 40, 7, 6)} fill="#FFF7EC" />
      </g>
      {/* Hills */}
      <path
        d="M0,1330 C200,1220 380,1260 560,1300 C760,1240 960,1200 1170,1290 L1170,1560 L0,1560 Z"
        fill="#8CCB9E"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      <path
        d="M0,1420 C240,1370 520,1400 760,1380 C920,1370 1060,1390 1170,1400 L1170,1560 L0,1560 Z"
        fill="#7ED6A7"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      {/* Houses along the quay */}
      {houses.map((h) => (
        <House key={h.x} x={h.x} y={1560 - h.h} w={h.w} h={h.h} color={h.color} roof={h.roof} />
      ))}
      {/* Lighthouse */}
      <g>
        <Shaded d="M1040,1200 L1100,1200 L1112,1420 L1028,1420 Z" shade={HOUSE_SHADES[6]} depth={6}>
          <rect x={1020} y={1250} width={110} height={30} fill="#FF7BA9" />
          <rect x={1020} y={1330} width={110} height={30} fill="#FF7BA9" />
        </Shaded>
        <rect x={1036} y={1160} width={68} height={44} rx={8} fill="#FFE08A" stroke={OUTLINE} strokeWidth={4} />
        <path d="M1030,1162 L1070,1126 L1110,1162 Z" fill="#FF8A65" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
      {/* Sea */}
      <rect y={1560} width={1170} height={BOARDWALK_Y - 1560 + 20} fill="url(#wf-sea)" />
      <path d="M0,1560 L1170,1560" stroke={OUTLINE} strokeWidth={5} />
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M${(i * 211) % 1100},${1610 + ((i * 97) % 300)} q24,-14 48,0 q24,14 48,0`}
          fill="none"
          stroke="#FFF7EC"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.55}
        />
      ))}
      <g className={sailing ? 'wf-boat wf-boat-go' : 'wf-boat'}>
        <path d="M460,1790 L640,1790 L612,1846 L488,1846 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M546,1782 L546,1600 L640,1774 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M536,1782 L536,1640 L470,1774 Z" fill="#FFC94A" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M546,1600 L586,1612 L546,1624 Z" fill="#3BB7C4" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {/* Boardwalk: deep enough that the player can stand on it on every screen shape */}
      <rect y={BOARDWALK_Y} width={1170} height={2532 - BOARDWALK_Y} fill="#E3B183" />
      <rect y={BOARDWALK_Y} width={1170} height={26} fill="#F2CFA6" />
      <path d={`M0,${BOARDWALK_Y} L1170,${BOARDWALK_Y}`} stroke={OUTLINE} strokeWidth={6} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M0,${BOARDWALK_Y + 80 + i * 90} L1170,${BOARDWALK_Y + 80 + i * 90}`} stroke="#C98F5E" strokeWidth={5} />
      ))}
      {[120, 1050].map((x) => (
        <g key={x}>
          <path d={`M${x},${BOARDWALK_Y + 30} L${x},${BOARDWALK_Y - 220}`} stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
          <path d={`M${x},${BOARDWALK_Y + 30} L${x},${BOARDWALK_Y - 220}`} stroke="#3F3A48" strokeWidth={8} strokeLinecap="round" />
          <circle cx={x} cy={BOARDWALK_Y - 240} r={26} fill="#FFE08A" stroke={OUTLINE} strokeWidth={5} />
        </g>
      ))}
      {[240, 520].map((x) => (
        <g key={x}>
          <rect x={x} y={BOARDWALK_Y + 10} width={90} height={40} rx={8} fill="#C98F5E" stroke={OUTLINE} strokeWidth={4} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={scallopCircle(x + 18 + i * 27, BOARDWALK_Y, 14, 6, 3)}
              fill={['#FF7BA9', '#FFC94A', '#B39DFF'][i]}
              stroke={OUTLINE}
              strokeWidth={3}
            />
          ))}
        </g>
      ))}
      {children}
    </svg>
  );
}
