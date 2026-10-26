// The vertical town map (game-systems §5.1): hill, town, harbour, airport, top to bottom. Canvas 1170×3200.
import type { ReactNode } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';

export type PlaceId = 'boutique' | 'park' | 'cafe' | 'home' | 'airport' | 'cottage';

export const MAP_W = 1170;
export const MAP_H = 3200;

/** Where each place sits, so the scene can scroll to it. */
export const PLACE_Y: Record<PlaceId, number> = { cottage: 420, boutique: 1000, park: 1380, cafe: 1880, home: 2160, airport: 2860 };

const sh = (base: string, shadow: string, highlight: string): Shade => ({ base, shadow, highlight });
const PINK = sh('#FF7BA9', '#D86094', '#FFADCA');
const CREAM = sh('#FFF7EC', '#E3D3CC', '#FFFFFF');
const SUN = sh('#FFC94A', '#D6A246', '#FFDE8D');
const SEA = sh('#3BB7C4', '#2F8E9F', '#8AD3DA');
const LILAC = sh('#B39DFF', '#9A82D8', '#D0C2FF');
const CORAL = sh('#FF8A65', '#D86A58', '#FFB89E');
const MINT = sh('#7ED6A7', '#5FAF8A', '#AEE6C6');
const LEAF = sh('#5FA67A', '#3F7F5A', '#8CCB9E');
const WOOD = sh('#C98F5E', '#9E6A42', '#E3B183');
const GREY = sh('#D9D3E0', '#B4ABBF', '#F1EEF5');

const rect = (x: number, y: number, w: number, h: number) => `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;

function Window({ x, y, w = 70, h = 80, lit = false }: { x: number; y: number; w?: number; h?: number; lit?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={lit ? '#FFE08A' : '#BDE8EC'} stroke={OUTLINE} strokeWidth={4} />
      <path d={`M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}`} stroke={OUTLINE} strokeWidth={3} />
      <path d={`M${x + 10},${y + 26} L${x + 22},${y + 12}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </g>
  );
}

function Awning({ x, y, w, a, b }: { x: number; y: number; w: number; a: string; b: string }) {
  const n = Math.round(w / 50);
  const sw = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <path
          key={i}
          d={`M${x + i * sw},${y} L${x + (i + 1) * sw},${y} L${x + (i + 1) * sw},${y + 50} Q${x + (i + 0.5) * sw},${y + 76} ${x + i * sw},${y + 50} Z`}
          fill={i % 2 ? b : a}
          stroke={OUTLINE}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={-10} width={24} height={70} rx={8} fill={WOOD.base} stroke={OUTLINE} strokeWidth={4} />
      <Shaded d={scallopCircle(0, -60, 70, 10, 10)} shade={LEAF} depth={10} shine={[-24, -90, 18, 12]} />
    </g>
  );
}

function Flowers({ x, y, n = 5 }: { x: number; y: number; n?: number }) {
  const colors = ['#FF7BA9', '#FFC94A', '#B39DFF', '#FF8A65', '#FFFFFF'];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <circle cx={x + i * 26} cy={y + (i % 2) * 8} r={10} fill={colors[i % colors.length]} stroke={OUTLINE} strokeWidth={2.5} />
          <circle cx={x + i * 26} cy={y + (i % 2) * 8} r={3.5} fill="#FFC94A" />
        </g>
      ))}
    </g>
  );
}

/** Signpost pin: icon dot + name on a sticker label. */
function Sign({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const w = label.length * 25 + 84;
  return (
    <g>
      <path d={`M${x},${y + 40} L${x},${y + 88}`} stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      <rect x={x - w / 2} y={y - 34} width={w} height={74} rx={37} fill="#3A2E4F" opacity={0.18} transform="translate(0 8)" />
      <rect x={x - w / 2} y={y - 34} width={w} height={74} rx={37} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={x - w / 2 + 38} cy={y + 3} r={20} fill={color} stroke={OUTLINE} strokeWidth={4} />
      <text x={x - w / 2 + 68} y={y + 16} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={40} fill="#3A2E4F">
        {label}
      </text>
    </g>
  );
}

function Place({
  id,
  label,
  onTap,
  badge,
  children,
}: {
  id: PlaceId;
  label: string;
  onTap?: (id: PlaceId) => void;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      data-testid={`place-${id}`}
      style={{ cursor: 'pointer' }}
      onClick={() => onTap?.(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap?.(id)}
    >
      {children}
      {badge}
    </g>
  );
}

function Badge({ x, y, kind }: { x: number; y: number; kind: 'coin' | 'new' }) {
  return (
    <g className="map-badge">
      <circle cx={x} cy={y} r={30} fill={kind === 'coin' ? '#FFC94A' : '#FF7BA9'} stroke={OUTLINE} strokeWidth={5} />
      {kind === 'coin' ? (
        <path
          d={`M${x},${y - 14} L${x + 4},${y - 4} L${x + 14},${y - 3} L${x + 6},${y + 4} L${x + 9},${y + 14} L${x},${y + 8} L${x - 9},${y + 14} L${x - 6},${y + 4} L${x - 14},${y - 3} L${x - 4},${y - 4} Z`}
          fill="#FFF7EC"
        />
      ) : (
        <path
          d={`M${x},${y - 16} Q${x + 3},${y - 3} ${x + 16},${y} Q${x + 3},${y + 3} ${x},${y + 16} Q${x - 3},${y + 3} ${x - 16},${y} Q${x - 3},${y - 3} ${x},${y - 16} Z`}
          fill="#FFF7EC"
        />
      )}
    </g>
  );
}

export interface TownMapProps {
  onTap?: (id: PlaceId) => void;
  onCat?: () => void;
  badges?: Partial<Record<PlaceId, 'coin' | 'new'>>;
  homeName?: string;
}

export function TownMap({ onTap, onCat, badges = {}, homeName = 'Harbour Loft' }: TownMapProps) {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      role="group"
      aria-label="Map of Petalport"
      data-testid="town-map"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="tm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9B8FF" />
          <stop offset="1" stopColor="#BDE8EC" />
        </linearGradient>
        <linearGradient id="tm-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5CC6D0" />
          <stop offset="1" stopColor="#2F8E9F" />
        </linearGradient>
      </defs>

      {/* Sky and the hill */}
      <rect width={MAP_W} height={700} fill="url(#tm-sky)" />
      <g opacity={0.95}>
        <path d={scallopCircle(200, 140, 56, 9, 8)} fill="#FFF7EC" />
        <path d={scallopCircle(270, 160, 42, 8, 6)} fill="#FFF7EC" />
        <path d={scallopCircle(930, 110, 50, 8, 7)} fill="#FFF7EC" />
      </g>
      <path
        d="M0,420 C240,300 520,340 700,380 C880,330 1040,320 1170,370 L1170,3200 L0,3200 Z"
        fill="#8CCB9E"
        stroke={OUTLINE}
        strokeWidth={5}
      />
      <path d="M0,560 C300,500 700,540 1170,500 L1170,3200 L0,3200 Z" fill="#A5DDB4" />

      {/* Windmill (scenery) */}
      <g>
        <Shaded d="M880,520 L900,330 L960,330 L980,520 Z" shade={CREAM} depth={8} />
        <path d="M900,330 L930,290 L960,330 Z" fill={CORAL.base} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        <rect x={914} y={460} width={32} height={60} rx={14} fill={WOOD.base} stroke={OUTLINE} strokeWidth={4} />
        <g className="windmill" style={{ transformOrigin: '930px 340px' }}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a} 930 340)`}>
              <path d="M930,340 L930,200" stroke={OUTLINE} strokeWidth={6} />
              <rect x={932} y={204} width={38} height={120} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
            </g>
          ))}
          <circle cx={930} cy={340} r={12} fill={SUN.base} stroke={OUTLINE} strokeWidth={4} />
        </g>
      </g>
      {/* Meadow Cottage (neighbour's, scenery) */}
      <g>
        <Shaded d={rect(170, 380, 220, 160)} shade={sh('#FFE7C2', '#E6C29A', '#FFF7EC')} depth={8} />
        <Shaded d="M150,384 L280,280 L410,384 Z" shade={CORAL} depth={6} />
        <Window x={196} y={420} w={60} h={60} />
        <rect x={290} y={450} width={56} height={90} rx={24} fill={MINT.base} stroke={OUTLINE} strokeWidth={4} />
        <Flowers x={176} y={560} n={7} />
      </g>

      {/* Winding path */}
      <path
        d="M560,560 C420,700 760,820 600,980 C440,1140 360,1300 560,1460 C760,1620 820,1760 600,1960 C420,2120 520,2300 600,2440 C680,2580 600,2700 600,2800"
        fill="none"
        stroke="#F2DCC0"
        strokeWidth={90}
        strokeLinecap="round"
      />
      <path
        d="M560,560 C420,700 760,820 600,980 C440,1140 360,1300 560,1460 C760,1620 820,1760 600,1960 C420,2120 520,2300 600,2440 C680,2580 600,2700 600,2800"
        fill="none"
        stroke="#E6C29A"
        strokeWidth={6}
        strokeDasharray="2 34"
        strokeLinecap="round"
      />

      {/* Ribbon Boutique */}
      <Place
        id="boutique"
        label="Ribbon Boutique"
        onTap={onTap}
        badge={badges.boutique && <Badge x={990} y={800} kind={badges.boutique} />}
      >
        <Shaded d={rect(700, 820, 320, 300)} shade={PINK} depth={10} />
        <Shaded d="M680,830 C680,760 760,740 860,740 C960,740 1040,760 1040,830 Z" shade={LILAC} depth={8} />
        <Awning x={690} y={930} w={340} a="#FFF7EC" b="#FF7BA9" />
        <Window x={730} y={1010} w={110} h={100} />
        <rect x={880} y={1010} width={100} height={110} rx={30} fill={CREAM.base} stroke={OUTLINE} strokeWidth={4} />
        <path
          d="M860,800 C830,770 800,780 812,804 C800,828 830,834 860,808 C890,834 920,828 908,804 C920,780 890,770 860,800 Z"
          fill="#FFF7EC"
          stroke={OUTLINE}
          strokeWidth={4}
        />
        <circle cx={860} cy={804} r={10} fill={PINK.base} stroke={OUTLINE} strokeWidth={3} />
        <Sign x={860} y={1190} label="Ribbon Boutique" color="#FF7BA9" />
      </Place>
      <Tree x={170} y={900} s={1.1} />
      <Tree x={330} y={1010} s={0.8} />

      {/* Petal Park (scenery: pond and ducks) */}
      <Place id="park" label="Petal Park" onTap={onTap}>
        <ellipse cx={260} cy={1400} rx={200} ry={90} fill="#5CC6D0" stroke={OUTLINE} strokeWidth={5} />
        <ellipse cx={220} cy={1385} rx={70} ry={16} fill="#FFFFFF" opacity={0.4} />
        {[
          [200, 1400],
          [300, 1420],
        ].map(([x, y]) => (
          <g key={x} className="duck">
            <ellipse cx={x} cy={y} rx={26} ry={16} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3.5} />
            <circle cx={x + 18} cy={y - 16} r={11} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3.5} />
            <path d={`M${x + 27},${y - 16} l12,3 l-12,4 Z`} fill="#FF8A65" stroke={OUTLINE} strokeWidth={2} />
          </g>
        ))}
        <Tree x={90} y={1260} s={0.9} />
        <Tree x={470} y={1300} s={0.7} />
        <path d="M380,1520 L480,1480 L540,1540 L440,1580 Z" fill="#FF8A65" stroke={OUTLINE} strokeWidth={4} />
        <path d="M400,1528 L500,1490 M420,1550 L520,1510" stroke="#FFF7EC" strokeWidth={8} />
        <Flowers x={90} y={1530} n={6} />
      </Place>

      {/* The harbour */}
      <rect x={0} y={2280} width={MAP_W} height={460} fill="url(#tm-sea)" />
      <path
        d="M0,2280 C200,2300 400,2270 600,2290 C800,2310 1000,2280 1170,2290 L1170,2320 L0,2320 Z"
        fill="#E6C29A"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      {[2380, 2470, 2560, 2650].map((y, i) => (
        <path
          key={y}
          d={`M${60 + i * 140},${y} q30,-14 60,0 q30,14 60,0`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={5}
          opacity={0.6}
          strokeLinecap="round"
        />
      ))}
      <g className="map-boat">
        <path d="M800,2460 L1000,2460 L960,2510 L840,2510 Z" fill={CORAL.base} stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M900,2450 L900,2330 L980,2440 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* Lighthouse */}
      <g>
        <Shaded d="M80,2300 L110,2060 L170,2060 L200,2300 Z" shade={CREAM} depth={8}>
          <rect x={60} y={2120} width={160} height={36} fill="#FF7BA9" />
          <rect x={60} y={2210} width={160} height={36} fill="#FF7BA9" />
        </Shaded>
        <rect x={100} y={2010} width={80} height={50} rx={10} fill="#FFE08A" stroke={OUTLINE} strokeWidth={5} />
        <path d="M92,2012 L140,1970 L188,2012 Z" fill={SEA.base} stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>

      {/* Sunny Café */}
      <Place id="cafe" label="Sunny Café" onTap={onTap} badge={badges.cafe && <Badge x={1010} y={1640} kind={badges.cafe} />}>
        <rect x={930} y={1600} width={44} height={80} fill={CORAL.base} stroke={OUTLINE} strokeWidth={4} />
        <g className="steam">
          <path
            d="M952,1590 c-14,-20 14,-30 0,-50 c-14,-20 14,-30 0,-50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.8}
          />
        </g>
        <Shaded d={rect(640, 1700, 360, 260)} shade={SUN} depth={10} />
        <Shaded d="M620,1708 L820,1620 L1020,1708 Z" shade={CORAL} depth={6} />
        <Awning x={630} y={1790} w={380} a="#FFF7EC" b="#3BB7C4" />
        <Window x={670} y={1870} w={120} h={80} lit />
        <rect x={850} y={1860} width={100} height={100} rx={30} fill={SEA.base} stroke={OUTLINE} strokeWidth={4} />
        <circle cx={820} cy={1740} r={34} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
        <path d="M804,1732 L836,1732 L832,1756 C830,1762 810,1762 808,1756 Z" fill="#8B5E3C" stroke={OUTLINE} strokeWidth={3} />
        <rect x={640} y={1970} width={60} height={30} rx={10} fill={WOOD.base} stroke={OUTLINE} strokeWidth={3} />
        <circle cx={670} cy={1966} r={22} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
        <Sign x={820} y={2040} label="Sunny Café" color="#FFC94A" />
      </Place>

      {/* Harbour Loft (home) */}
      <Place id="home" label={`Home: ${homeName}`} onTap={onTap}>
        <Shaded d={rect(270, 1980, 240, 290)} shade={SEA} depth={10} />
        <Shaded d="M250,1988 L390,1880 L530,1988 Z" shade={SUN} depth={6} />
        <Window x={300} y={2020} w={70} h={70} lit />
        <Window x={410} y={2020} w={70} h={70} />
        <Window x={300} y={2120} w={70} h={70} />
        <rect x={400} y={2160} width={80} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
        <Flowers x={290} y={2240} n={4} />
        <Sign x={390} y={1830} label={homeName} color="#3BB7C4" />
      </Place>

      {/* Cat on a wall: tap for a meow (ambient easter egg) */}
      <g role="button" tabIndex={0} aria-label="A sleepy cat" data-testid="place-cat" style={{ cursor: 'pointer' }} onClick={onCat}>
        <rect x={40} y={1720} width={220} height={40} rx={8} fill={GREY.base} stroke={OUTLINE} strokeWidth={4} />
        <ellipse cx={150} cy={1700} rx={46} ry={26} fill="#FF8A65" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={112} cy={1680} r={24} fill="#FF8A65" stroke={OUTLINE} strokeWidth={4} />
        <path
          d="M94,1666 L98,1644 L110,1660 M118,1658 L128,1644 L132,1666"
          fill="#FF8A65"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M102,1682 q4,4 8,0 M116,1682 q4,4 8,0" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
        <path
          className="cat-tail"
          d="M194,1706 C230,1700 236,1670 220,1650"
          fill="none"
          stroke={OUTLINE}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          className="cat-tail"
          d="M194,1706 C230,1700 236,1670 220,1650"
          fill="none"
          stroke="#FF8A65"
          strokeWidth={7}
          strokeLinecap="round"
        />
      </g>

      {/* Airport on the point */}
      <path d="M0,2740 C300,2700 800,2720 1170,2700 L1170,3200 L0,3200 Z" fill="#A5DDB4" stroke={OUTLINE} strokeWidth={5} />
      <Place id="airport" label="Airport" onTap={onTap}>
        <path d="M120,3080 L1060,2980 L1080,3060 L140,3160 Z" fill="#8E86A0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M200,3110 L1000,3024" stroke="#FFF7EC" strokeWidth={8} strokeDasharray="40 30" />
        <Shaded d={rect(700, 2800, 300, 150)} shade={CREAM} depth={8} />
        <path d="M700,2800 C760,2750 940,2750 1000,2800 Z" fill={SEA.base} stroke={OUTLINE} strokeWidth={5} />
        {[720, 800, 880].map((x) => (
          <Window key={x} x={x} y={2840} w={60} h={50} />
        ))}
        <rect x={940} y={2700} width={30} height={100} fill={GREY.base} stroke={OUTLINE} strokeWidth={4} />
        <rect x={918} y={2672} width={74} height={40} rx={12} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={4} />
        <g className="plane">
          <path
            d="M240,2960 C240,2940 270,2930 300,2930 L520,2930 C560,2930 580,2944 580,2960 C580,2976 560,2990 520,2990 L300,2990 C270,2990 240,2980 240,2960 Z"
            fill="#FFF7EC"
            stroke={OUTLINE}
            strokeWidth={5}
          />
          <path d="M380,2960 L330,3040 L380,3040 L450,2960 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M260,2934 L240,2880 L280,2880 L310,2932 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          {[420, 460, 500].map((x) => (
            <circle key={x} cx={x} cy={2952} r={9} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={3} />
          ))}
        </g>
        <Sign x={650} y={2700} label="Airport" color="#B39DFF" />
      </Place>
    </svg>
  );
}
