// The vertical town map (game-systems §5.1): hill, town, harbour, airport, top to bottom. Canvas 1170×3860.
import type { ReactNode } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';
import { ShellArt } from '../shells';

export type PlaceId =
  | 'studio'
  | 'puzzle'
  | 'fishing'
  | 'tide'
  | 'sky'
  | 'nails'
  | 'posies'
  | 'dance'
  | 'skate'
  | 'boutique'
  | 'park'
  | 'cafe'
  | 'home'
  | 'airport'
  | 'cottage'
  | 'petshop'
  | 'board'
  | 'postbox'
  | 'stage'
  | 'salon'
  | 'garden'
  | 'burger'
  | 'sweets';

export const MAP_W = 1170;
/** Sparkle Street (Glam Salon and Petal Garden) sits between the harbour and the airport. */
const STREET = 3780;
export const MAP_H = 3200 + STREET;

/** Where each place sits, so the scene can scroll to it. */
export const PLACE_Y: Record<PlaceId, number> = {
  cottage: 420,
  petshop: 880,
  boutique: 1000,
  board: 1380,
  park: 1380,
  cafe: 1880,
  home: 2160,
  postbox: 2160,
  stage: 2480,
  salon: 3000,
  garden: 3000,
  burger: 3500,
  sweets: 3500,
  dance: 4020,
  skate: 4020,
  nails: 4540,
  studio: 5060,
  puzzle: 5060,
  fishing: 5580,
  tide: 6030,
  sky: 6030,
  posies: 4540,
  airport: 2860 + STREET,
};

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
function Sign({ x, y, label, color, post = 'down' }: { x: number; y: number; label: string; color: string; post?: 'down' | 'up' }) {
  const w = label.length * 25 + 84;
  return (
    <g>
      <path
        d={post === 'down' ? `M${x},${y + 40} L${x},${y + 88}` : `M${x},${y - 34} L${x},${y - 80}`}
        stroke={OUTLINE}
        strokeWidth={8}
        strokeLinecap="round"
      />
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
  hit,
  children,
}: {
  id: PlaceId;
  label: string;
  onTap?: (id: PlaceId) => void;
  badge?: ReactNode;
  hit: [number, number, number, number];
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
      {/* Invisible hit area so gaps between the building and its sign still count (§5.1). */}
      <rect x={hit[0]} y={hit[1]} width={hit[2]} height={hit[3]} rx={40} fill="transparent" />
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
  /** The player's pet, drawn by the scene, sitting outside home. */
  pet?: ReactNode;
  /** A letter is waiting: the Post Box flag is up. */
  mail?: boolean;
  /** Secret shells still to find on the map (game-systems §9.2). */
  /** A flower is ready to pick in the Petal Garden. */
  bloomsReady?: boolean;
  shells?: readonly { id: string; kind: string; color: string; x: number; y: number }[];
  onShell?: (id: string) => void;
}

export function TownMap({
  onTap,
  onCat,
  badges = {},
  homeName = 'Harbour Loft',
  pet,
  mail = false,
  bloomsReady = false,
  shells = [],
  onShell,
}: TownMapProps) {
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
        d="M0,420 C240,300 520,340 700,380 C880,330 1040,320 1170,370 L1170,3900 L0,3900 Z"
        fill="#8CCB9E"
        stroke={OUTLINE}
        strokeWidth={5}
      />
      <path d="M0,560 C300,500 700,540 1170,500 L1170,3900 L0,3900 Z" fill="#A5DDB4" />

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
        hit={[670, 730, 380, 500]}
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
        <Sign x={860} y={1190} label="Ribbon Boutique" color="#FF7BA9" post="up" />
      </Place>
      {/* Paw Parlour */}
      <Place
        id="petshop"
        hit={[90, 640, 400, 480]}
        label="Paw Parlour"
        onTap={onTap}
        badge={badges.petshop && <Badge x={430} y={720} kind={badges.petshop} />}
      >
        <Shaded d={rect(140, 790, 280, 200)} shade={CREAM} depth={10} />
        <Shaded d="M120,800 C120,730 190,700 280,700 C370,700 440,730 440,800 Z" shade={MINT} depth={8} />
        <Awning x={130} y={880} w={300} a="#FFF7EC" b="#7ED6A7" />
        <Window x={164} y={940} w={110} h={42} />
        <rect x={310} y={920} width={80} height={70} rx={26} fill={CORAL.base} stroke={OUTLINE} strokeWidth={4} />
        {/* Paw emblem */}
        <circle cx={280} cy={770} r={40} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
        <path
          d="M280,768 C292,768 300,780 298,788 C296,796 288,792 280,792 C272,792 264,796 262,788 C260,780 268,768 280,768 Z"
          fill="#FF9BBE"
          stroke={OUTLINE}
          strokeWidth={2.5}
        />
        {[
          [258, 762],
          [270, 750],
          [290, 750],
          [302, 762],
        ].map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx={6} ry={8} fill="#FF9BBE" stroke={OUTLINE} strokeWidth={2.5} />
        ))}
        {/* A kitten peeking from the window */}
        <path
          d="M196,982 L196,962 L204,950 L212,960 L228,960 L236,950 L244,962 L244,982 Z"
          fill="#F4A15D"
          stroke={OUTLINE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <circle cx={212} cy={970} r={3} fill={OUTLINE} />
        <circle cx={228} cy={970} r={3} fill={OUTLINE} />
        <Sign x={280} y={1060} label="Paw Parlour" color="#7ED6A7" />
      </Place>
      <Tree x={1110} y={1330} s={0.6} />

      {/* Petal Notes board */}
      <Place
        id="board"
        hit={[560, 1260, 380, 400]}
        label="Notice Board"
        onTap={onTap}
        badge={badges.board && <Badge x={860} y={1290} kind={badges.board} />}
      >
        <rect x={650} y={1380} width={16} height={110} fill={WOOD.shadow} stroke={OUTLINE} strokeWidth={4} />
        <rect x={834} y={1380} width={16} height={110} fill={WOOD.shadow} stroke={OUTLINE} strokeWidth={4} />
        <Shaded d={rect(630, 1290, 240, 150)} shade={WOOD} depth={6} />
        <rect x={646} y={1306} width={208} height={118} rx={6} fill="#E3B183" stroke={OUTLINE} strokeWidth={3} />
        {[
          [664, 1316, -4, '#FFDE8D'],
          [726, 1322, 3, '#FFADCA'],
          [790, 1314, -2, '#AEE6C6'],
        ].map(([x, y, r, c]) => (
          <g key={x as number} transform={`rotate(${r} ${(x as number) + 26} ${(y as number) + 40})`}>
            <rect x={x as number} y={y as number} width={52} height={66} fill={c as string} stroke={OUTLINE} strokeWidth={2.5} />
            <path
              d={`M${(x as number) + 10},${(y as number) + 24} h32 M${(x as number) + 10},${(y as number) + 36} h32 M${(x as number) + 10},${(y as number) + 48} h20`}
              stroke={OUTLINE}
              strokeWidth={2.5}
            />
            <circle cx={(x as number) + 26} cy={(y as number) + 6} r={6} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2} />
          </g>
        ))}
        <path d="M624,1292 L750,1240 L876,1292 Z" fill={CORAL.base} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        <Sign x={750} y={1540} label="Notice Board" color="#FF7BA9" />
      </Place>

      {/* Post Box */}
      <Place
        id="postbox"
        hit={[860, 1900, 300, 380]}
        label={mail ? 'Mail: a letter is waiting' : 'Mail'}
        onTap={onTap}
        badge={badges.postbox && <Badge x={1120} y={2080} kind={badges.postbox} />}
      >
        <rect x={1062} y={2170} width={18} height={90} fill={WOOD.shadow} stroke={OUTLINE} strokeWidth={4} />
        <Shaded
          d="M1010,2180 L1010,2120 C1010,2090 1030,2076 1070,2076 C1110,2076 1130,2090 1130,2120 L1130,2180 Z"
          shade={PINK}
          depth={6}
        />
        <rect x={1040} y={2134} width={60} height={10} rx={5} fill={OUTLINE} />
        <path d="M1070,2100 C1066,2094 1058,2096 1060,2104 L1070,2112 L1080,2104 C1082,2096 1074,2094 1070,2100 Z" fill="#FFF7EC" />
        <g style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }} className={mail ? 'flag-up' : undefined}>
          <rect x={1130} y={mail ? 2060 : 2120} width={8} height={mail ? 70 : 40} fill={GREY.shadow} stroke={OUTLINE} strokeWidth={3} />
          <path
            d={mail ? 'M1138,2060 L1168,2070 L1138,2082 Z' : 'M1138,2120 L1162,2128 L1138,2138 Z'}
            fill={SUN.base}
            stroke={OUTLINE}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
        <Sign x={1066} y={1990} label="Mail" color="#FFC94A" />
      </Place>

      {/* Petal Park (scenery: pond and ducks) */}
      <Place
        id="park"
        hit={[50, 1200, 500, 520]}
        label="Petal Park"
        onTap={onTap}
        badge={badges.park && <Badge x={500} y={1230} kind={badges.park} />}
      >
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
        <Sign x={290} y={1650} label="Petal Park" color="#7ED6A7" />
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

      {/* Starlight Stage: a little show stage on a pier (game-systems §9.1) */}
      <Place
        id="stage"
        hit={[60, 2330, 500, 360]}
        label="Starlight Stage"
        onTap={onTap}
        badge={badges.stage && <Badge x={500} y={2370} kind={badges.stage} />}
      >
        {[110, 230, 370, 490].map((x) => (
          <rect key={x} x={x - 10} y={2580} width={20} height={70} fill={WOOD.shadow} stroke={OUTLINE} strokeWidth={4} />
        ))}
        <Shaded d={rect(70, 2520, 460, 70)} shade={WOOD} depth={6} />
        <Shaded d="M110,2524 L110,2430 C110,2340 490,2340 490,2430 L490,2524 Z" shade={LILAC} depth={8} />
        <path d="M150,2524 L150,2440 C150,2390 450,2390 450,2440 L450,2524 Z" fill="#3A2E4F" stroke={OUTLINE} strokeWidth={4} />
        {[0, 1].map((side) => (
          <path
            key={side}
            transform={side ? 'translate(600 0) scale(-1 1)' : undefined}
            d="M150,2524 L150,2440 C150,2410 180,2396 226,2392 C206,2436 196,2484 214,2524 Z"
            fill={PINK.base}
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        ))}
        <path d="M232,2400 L272,2524 L328,2524 L368,2400 Z" fill="#FFE08A" opacity={0.35} />
        <path d="M272,2524 L328,2524 L348,2588 L252,2588 Z" fill={PINK.highlight} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * (0.08 + (i * 0.84) / 8);
          return (
            <circle
              key={i}
              cx={300 - Math.cos(a) * 172}
              cy={2440 - Math.sin(a) * 74}
              r={9}
              fill="#FFE08A"
              stroke={OUTLINE}
              strokeWidth={3}
            />
          );
        })}
        <path
          d="M300,2304 L310,2328 L336,2330 L316,2346 L322,2372 L300,2358 L278,2372 L284,2346 L264,2330 L290,2328 Z"
          fill={SUN.base}
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <Sign x={270} y={2650} label="Starlight Stage" color="#FF7BA9" />
      </Place>

      {/* Sunny Café */}
      <Place
        id="cafe"
        hit={[610, 1540, 420, 540]}
        label="Sunny Café"
        onTap={onTap}
        badge={badges.cafe && <Badge x={1010} y={1640} kind={badges.cafe} />}
      >
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
      <Place id="home" hit={[240, 1780, 300, 500]} label={`Home: ${homeName}`} onTap={onTap}>
        <Shaded d={rect(270, 1980, 240, 290)} shade={SEA} depth={10} />
        <Shaded d="M250,1988 L390,1880 L530,1988 Z" shade={SUN} depth={6} />
        <Window x={300} y={2020} w={70} h={70} lit />
        <Window x={410} y={2020} w={70} h={70} />
        <Window x={300} y={2120} w={70} h={70} />
        <rect x={400} y={2160} width={80} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
        <Flowers x={290} y={2240} n={4} />
        <Sign x={390} y={1830} label={homeName} color="#3BB7C4" />
      </Place>
      {pet && (
        <g transform="translate(500 2150) scale(0.42)" pointerEvents="none">
          {pet}
        </g>
      )}

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

      {/* Sparkle Street: a pink-and-lilac row of new places (game-systems §10) */}
      <path d="M0,2740 C300,2715 800,2735 1170,2712 L1170,7320 L0,7320 Z" fill="#B8E6C4" stroke={OUTLINE} strokeWidth={5} />
      <path d="M0,3190 L1170,3190 L1170,3240 L0,3240 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
      <path d="M0,3215 L1170,3215" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />

      {/* Glam Salon */}
      <Place
        id="salon"
        hit={[90, 2820, 460, 440]}
        label="Glam Salon"
        onTap={onTap}
        badge={badges.salon && <Badge x={520} y={2880} kind={badges.salon} />}
      >
        <Shaded d={rect(150, 2920, 340, 250)} shade={PINK} depth={10} />
        <Shaded d="M130,2930 L320,2830 L510,2930 Z" shade={LILAC} depth={6} />
        <Awning x={140} y={3000} w={360} a="#FFF7EC" b="#B39DFF" />
        <rect x={180} y={3090} width={110} height={80} rx={10} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={4} />
        <path d="M200,3110 L218,3096" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <rect x={350} y={3076} width={96} height={94} rx={34} fill={LILAC.base} stroke={OUTLINE} strokeWidth={4} />
        <circle cx={320} cy={2895} r={36} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
        <path d="M304,2880 L336,2912 M336,2880 L304,2912" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        <circle cx={302} cy={2918} r={8} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={3} />
        <circle cx={338} cy={2918} r={8} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={3} />
        <Flowers x={160} y={3180} n={4} />
        <Sign x={320} y={3250} label="Glam Salon" color="#B39DFF" />
      </Place>

      {/* Petal Garden: a fenced plot that shows how many flowers are ready */}
      <Place
        id="garden"
        hit={[620, 2820, 500, 440]}
        label={bloomsReady ? 'Petal Garden: a flower is ready' : 'Petal Garden'}
        onTap={onTap}
        badge={badges.garden && <Badge x={1090} y={2880} kind={badges.garden} />}
      >
        <path d="M640,2960 L1100,2960 L1100,3170 L640,3170 Z" fill="#9E6A42" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <g key={`${c}-${r}`} transform={`translate(${700 + c * 150} ${3010 + r * 90})`}>
              <ellipse cx={0} cy={36} rx={52} ry={16} fill="#7A4F2E" stroke={OUTLINE} strokeWidth={3} />
              <path d="M0,34 L0,10" stroke="#5FA67A" strokeWidth={6} strokeLinecap="round" />
              <circle cx={0} cy={0} r={13} fill={['#FF7BA9', '#FFC94A', '#B39DFF'][(c + r) % 3]} stroke={OUTLINE} strokeWidth={3} />
              <circle cx={0} cy={0} r={4} fill="#FFF7EC" />
            </g>
          )),
        )}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <rect x={632 + i * 51} y={2926} width={22} height={64} rx={8} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
            <rect x={632 + i * 51} y={3144} width={22} height={64} rx={8} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
          </g>
        ))}
        <path d="M640,2950 L1100,2950 M640,3160 L1100,3160" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        <Tree x={1110} y={2900} s={0.5} />
        <Sign x={880} y={3250} label="Petal Garden" color="#7ED6A7" />
      </Place>

      {/* Snack Street: Bun & Bite Burger Bar (game-systems §12) */}
      <path d="M0,3690 L1170,3690 L1170,3740 L0,3740 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
      <path d="M0,3715 L1170,3715" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />
      <Place
        id="burger"
        hit={[90, 3330, 520, 420]}
        label="Bun & Bite"
        onTap={onTap}
        badge={badges.burger && <Badge x={590} y={3390} kind={badges.burger} />}
      >
        <Shaded d={rect(140, 3430, 420, 250)} shade={SUN} depth={10} />
        <Shaded d="M120,3440 L350,3340 L580,3440 Z" shade={PINK} depth={6} />
        <Awning x={130} y={3510} w={440} a="#FFF7EC" b="#FF7BA9" />
        <rect x={170} y={3590} width={150} height={90} rx={10} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={4} />
        <path d="M190,3610 L210,3596" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <rect x={380} y={3580} width={110} height={100} rx={36} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
        <path d="M300,3410 C300,3350 400,3350 400,3410 Z" fill="#F2B45B" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        <path
          d="M296,3418 q13,-12 26,0 q13,12 26,0 q13,-12 26,0 q13,12 26,0"
          fill="none"
          stroke="#7ED6A7"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <rect x={298} y={3426} width={104} height={14} rx={7} fill="#8A5A3C" stroke={OUTLINE} strokeWidth={4} />
        <path
          d="M298,3446 L402,3446 L396,3462 Q350,3470 304,3462 Z"
          fill="#F2B45B"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <Sign x={350} y={3750} label="Bun & Bite" color="#FF7BA9" />
      </Place>
      {/* Sweet Spot: a mint cupcake shop */}
      <Place
        id="sweets"
        hit={[640, 3330, 490, 420]}
        label="Sweet Spot"
        onTap={onTap}
        badge={badges.sweets && <Badge x={1100} y={3390} kind={badges.sweets} />}
      >
        <Shaded d={rect(680, 3430, 380, 250)} shade={MINT} depth={10} />
        <Shaded d="M660,3440 L870,3340 L1080,3440 Z" shade={LILAC} depth={6} />
        <Awning x={670} y={3510} w={400} a="#FFF7EC" b="#FF9EC4" />
        <rect x={710} y={3590} width={130} height={90} rx={10} fill="#BDE8EC" stroke={OUTLINE} strokeWidth={4} />
        <path d="M728,3610 L748,3596" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <rect x={900} y={3580} width={100} height={100} rx={34} fill={LILAC.base} stroke={OUTLINE} strokeWidth={4} />
        <path
          d="M840,3425 L900,3425 L894,3395 Q870,3388 846,3395 Z"
          fill="#FFB3D0"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d="M838,3400 C830,3372 858,3366 864,3374 C864,3356 888,3358 886,3374 C906,3372 910,3392 902,3400 Z"
          fill="#FF9EC4"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <circle cx={875} cy={3356} r={9} fill="#E8335A" stroke={OUTLINE} strokeWidth={3} />
        <Sign x={870} y={3750} label="Sweet Spot" color="#B39DFF" />
      </Place>
      <Tree x={1140} y={3640} s={0.5} />
      <Flowers x={620} y={3660} n={3} />

      {/* Fun Street: Dance Studio and Skate Park (game-systems §15, §16) */}
      <path d="M0,4210 L1170,4210 L1170,4260 L0,4260 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
      <path d="M0,4235 L1170,4235" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />
      <Place
        id="dance"
        hit={[90, 3830, 480, 420]}
        label="Dance Studio"
        onTap={onTap}
        badge={badges.dance && <Badge x={560} y={3890} kind={badges.dance} />}
      >
        <Shaded d={rect(140, 3950, 400, 250)} shade={LILAC} depth={10} />
        <Shaded d="M120,3960 L340,3860 L560,3960 Z" shade={PINK} depth={6} />
        <Awning x={130} y={4030} w={420} a="#FFF7EC" b="#7A5FC0" />
        <rect x={170} y={4100} width={190} height={100} rx={12} fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} />
        <path d="M190,4180 L240,4112 M260,4190 L300,4130" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
        <rect x={400} y={4090} width={100} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
        <circle cx={340} cy={3915} r={38} fill="#E7E1F2" stroke={OUTLINE} strokeWidth={4} />
        <path d="M326,3924 L326,3896 L356,3890 L356,3916" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        <circle cx={321} cy={3926} r={7} fill={OUTLINE} />
        <circle cx={351} cy={3920} r={7} fill={OUTLINE} />
        <Sign x={340} y={4270} label="Dance Studio" color="#B39DFF" />
      </Place>
      <Place
        id="skate"
        hit={[620, 3830, 500, 420]}
        label="Skate Park"
        onTap={onTap}
        badge={badges.skate && <Badge x={1090} y={3890} kind={badges.skate} />}
      >
        <path
          d="M640,4190 L640,4060 C700,4180 860,4190 920,4190 Z"
          fill="#DAD3E6"
          stroke={OUTLINE}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path
          d="M920,4190 C980,4190 1040,4150 1100,4030 L1100,4190 Z"
          fill="#DAD3E6"
          stroke={OUTLINE}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect x={680} y={4150} width={420} height={40} fill="#B9B2C4" stroke={OUTLINE} strokeWidth={5} />
        <path d="M740,4126 L900,4126" stroke={OUTLINE} strokeWidth={9} strokeLinecap="round" />
        <path d="M760,4130 L760,4160 M880,4130 L880,4160" stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${650 + i * 70},3960 L${650 + i * 70},4050`} stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        ))}
        <path d="M640,3960 L1100,3960 M640,4000 L1100,4000" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        <path d="M660,3985 L1080,3985" stroke="#3BB7C4" strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <path d="M940,4160 C940,4120 960,4112 990,4112" fill="none" stroke="none" />
        <Sign x={880} y={4270} label="Skate Park" color="#3BB7C4" />
      </Place>

      {/* Glow Street: Glow Nails and Petal Posies (game-systems §18, §19), drawn at Fun Street coordinates and shifted down */}
      <g transform="translate(0 520)">
        <path d="M0,4210 L1170,4210 L1170,4260 L0,4260 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
        <path d="M0,4235 L1170,4235" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />
      </g>
      <Place
        id="nails"
        hit={[90, 4350, 480, 420]}
        label="Glow Nails"
        onTap={onTap}
        badge={badges.nails && <Badge x={560} y={4410} kind={badges.nails} />}
      >
        <g transform="translate(0 520)">
          <Shaded d={rect(140, 3950, 400, 250)} shade={PINK} depth={10} />
          <Shaded d="M120,3960 L340,3860 L560,3960 Z" shade={LILAC} depth={6} />
          <Awning x={130} y={4030} w={420} a="#FFF7EC" b="#FF7BA9" />
          <rect x={170} y={4100} width={190} height={100} rx={12} fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} />
          <rect x={230} y={4118} width={26} height={60} rx={13} fill="#FFEDE0" stroke={OUTLINE} strokeWidth={3} />
          <rect x={236} y={4124} width={14} height={22} rx={7} fill="#B692F6" />
          <rect x={290} y={4128} width={26} height={50} rx={13} fill="#FFEDE0" stroke={OUTLINE} strokeWidth={3} />
          <rect x={296} y={4134} width={14} height={20} rx={7} fill="#FFC94A" />
          <rect x={400} y={4090} width={100} height={110} rx={34} fill={LILAC.base} stroke={OUTLINE} strokeWidth={4} />
          <circle cx={340} cy={3915} r={38} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
          <rect x={314} y={3910} width={52} height={38} rx={12} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={4} />
          <rect x={329} y={3888} width={22} height={24} rx={5} fill="#5B4A6E" />
          <Sign x={340} y={4270} label="Glow Nails" color="#FF7BA9" />
        </g>
      </Place>
      <Place
        id="posies"
        hit={[620, 4350, 500, 420]}
        label="Petal Posies"
        onTap={onTap}
        badge={badges.posies && <Badge x={1090} y={4410} kind={badges.posies} />}
      >
        <g transform="translate(0 520)">
          <Shaded d={rect(670, 3950, 400, 250)} shade={MINT} depth={10} />
          <Shaded d="M650,3960 L870,3860 L1090,3960 Z" shade={LEAF} depth={6} />
          <Awning x={660} y={4030} w={420} a="#FFF7EC" b="#5FA67A" />
          <rect x={700} y={4090} width={150} height={110} rx={12} fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} />
          <rect x={940} y={4090} width={100} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
          {[
            [720, '#FF7BA9'],
            [790, '#FFC94A'],
            [860, '#B692F6'],
          ].map(([x, c]) => (
            <g key={String(x)}>
              <path d={`M${x},4210 L${x},4170`} stroke="#3F7F5A" strokeWidth={5} strokeLinecap="round" />
              <circle cx={Number(x)} cy={4160} r={17} fill={String(c)} stroke={OUTLINE} strokeWidth={4} />
              <circle cx={Number(x)} cy={4160} r={5} fill="#FFF7EC" />
              <path
                d={`M${Number(x) - 22},4200 L${Number(x) + 22},4200 L${Number(x) + 16},4228 L${Number(x) - 16},4228 Z`}
                fill={WOOD.base}
                stroke={OUTLINE}
                strokeWidth={4}
                strokeLinejoin="round"
              />
            </g>
          ))}
          <circle cx={870} cy={3915} r={38} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx={870}
              cy={3903}
              rx={9}
              ry={13}
              fill="#FF7BA9"
              stroke={OUTLINE}
              strokeWidth={3}
              transform={`rotate(${r} 870 3915)`}
            />
          ))}
          <circle cx={870} cy={3915} r={8} fill="#FFC94A" stroke={OUTLINE} strokeWidth={3} />
          <Sign x={870} y={4270} label="Petal Posies" color="#5FA67A" />
        </g>
      </Place>

      {/* Hobby Street: Art Studio and Puzzle Shop (game-systems §24, §25), then the Fishing Dock (§26) */}
      <g transform="translate(0 1040)">
        <path d="M0,4210 L1170,4210 L1170,4260 L0,4260 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
        <path d="M0,4235 L1170,4235" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />
      </g>
      <Place
        id="studio"
        hit={[90, 4870, 480, 420]}
        label="Art Studio"
        onTap={onTap}
        badge={badges.studio && <Badge x={560} y={4930} kind={badges.studio} />}
      >
        <g transform="translate(0 1040)">
          <Shaded d={rect(140, 3950, 400, 250)} shade={SUN} depth={10} />
          <Shaded d="M120,3960 L340,3860 L560,3960 Z" shade={CORAL} depth={6} />
          <Awning x={130} y={4030} w={420} a="#FFF7EC" b="#FF8A65" />
          <rect x={170} y={4100} width={190} height={100} rx={12} fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} />
          <rect x={200} y={4112} width={64} height={76} rx={6} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={3} />
          <circle cx={222} cy={4140} r={10} fill="#FF7BA9" />
          <circle cx={246} cy={4160} r={10} fill="#5BB8F0" />
          <path d="M290,4190 L310,4120 L330,4190" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
          <rect x={400} y={4090} width={100} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
          <circle cx={340} cy={3915} r={38} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
          {[
            [322, 3905, '#FF7BA9'],
            [346, 3896, '#5BB8F0'],
            [358, 3920, '#7ED6A7'],
            [330, 3928, '#FFC94A'],
          ].map(([x, y, c]) => (
            <circle key={String(x)} cx={Number(x)} cy={Number(y)} r={8} fill={String(c)} stroke={OUTLINE} strokeWidth={2.5} />
          ))}
          <Sign x={340} y={4270} label="Art Studio" color="#FF8A65" />
        </g>
      </Place>
      <Place
        id="puzzle"
        hit={[620, 4870, 500, 420]}
        label="Puzzle Shop"
        onTap={onTap}
        badge={badges.puzzle && <Badge x={1090} y={4930} kind={badges.puzzle} />}
      >
        <g transform="translate(0 1040)">
          <Shaded d={rect(670, 3950, 400, 250)} shade={SEA} depth={10} />
          <Shaded d="M650,3960 L870,3860 L1090,3960 Z" shade={LILAC} depth={6} />
          <Awning x={660} y={4030} w={420} a="#FFF7EC" b="#3BB7C4" />
          <rect x={700} y={4100} width={190} height={100} rx={12} fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} />
          {[
            [716, 4116, '#FF7BA9'],
            [770, 4116, '#FFC94A'],
            [824, 4116, '#B692F6'],
            [716, 4156, '#7ED6A7'],
            [770, 4156, '#FF8A65'],
          ].map(([x, y, c]) => (
            <rect
              key={`${x}${y}`}
              x={Number(x)}
              y={Number(y)}
              width={44}
              height={34}
              rx={6}
              fill={String(c)}
              stroke={OUTLINE}
              strokeWidth={3}
            />
          ))}
          <rect x={940} y={4090} width={100} height={110} rx={34} fill={PINK.base} stroke={OUTLINE} strokeWidth={4} />
          <circle cx={870} cy={3915} r={38} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
          <path
            d="M846,3930 L846,3906 L862,3906 C858,3896 876,3896 872,3906 L894,3906 L894,3930 Z"
            fill="#FFC94A"
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <Sign x={870} y={4270} label="Puzzle Shop" color="#3BB7C4" />
        </g>
      </Place>
      <Place
        id="fishing"
        hit={[90, 5390, 990, 420]}
        label="Fishing Dock"
        onTap={onTap}
        badge={badges.fishing && <Badge x={1000} y={5460} kind={badges.fishing} />}
      >
        <g transform="translate(0 1560)">
          <path
            d="M70,4040 C70,3880 330,3850 585,3850 C840,3850 1100,3880 1100,4040 C1100,4170 840,4210 585,4210 C330,4210 70,4170 70,4040 Z"
            fill="#3BB7C4"
            stroke={OUTLINE}
            strokeWidth={5}
          />
          <path d="M160,3980 C260,3960 360,3990 460,3972" stroke="#BDEBF0" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d="M700,4090 C800,4070 900,4100 1000,4080" stroke="#BDEBF0" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d="M120,4120 L560,4120 L560,4170 L120,4170 Z" fill="#C98F5E" stroke={OUTLINE} strokeWidth={5} />
          <path d="M200,4120 L200,4170 M290,4120 L290,4170 M380,4120 L380,4170 M470,4120 L470,4170" stroke="#9E6A42" strokeWidth={5} />
          <rect x={130} y={4170} width={16} height={50} fill="#9E6A42" stroke={OUTLINE} strokeWidth={4} />
          <rect x={534} y={4170} width={16} height={50} fill="#9E6A42" stroke={OUTLINE} strokeWidth={4} />
          <path d="M240,4120 L360,3990" stroke="#9E6A42" strokeWidth={9} strokeLinecap="round" />
          <path d="M360,3990 L430,4070" stroke={OUTLINE} strokeWidth={3} fill="none" />
          <circle cx={430} cy={4068} r={11} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={4} />
          <path d="M760,3990 C780,3950 830,3950 850,3990 C830,4030 780,4030 760,3990 Z" fill="#FFA94D" stroke={OUTLINE} strokeWidth={4} />
          <path d="M848,3990 L880,3965 L880,4015 Z" fill="#FF8A3D" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={782} cy={3984} r={5} fill={OUTLINE} />
          <path d="M830,4120 L1010,4120 L990,4170 L850,4170 Z" fill="#FF8A65" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <Sign x={585} y={4270} label="Fishing Dock" color="#5BB8F0" />
        </g>
      </Place>

      {/* Explorer Street: Tide Pools and Starlight Hill (game-systems §30) */}
      <g transform="translate(0 1670)">
        <path d="M0,4210 L1170,4210 L1170,4260 L0,4260 Z" fill="#F2E3D2" stroke={OUTLINE} strokeWidth={4} />
        <path d="M0,4235 L1170,4235" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="44 36" />
      </g>
      <Place
        id="tide"
        hit={[90, 5910, 480, 420]}
        label="Tide Pools"
        onTap={onTap}
        badge={badges.tide && <Badge x={560} y={5990} kind={badges.tide} />}
      >
        <g transform="translate(0 2080)">
          <path d="M120,4190 C100,3990 200,3890 340,3890 C480,3890 580,3990 560,4190 Z" fill="#F2D9A8" stroke={OUTLINE} strokeWidth={5} />
          <ellipse cx={250} cy={4070} rx={90} ry={44} fill="#5CC6D0" stroke={OUTLINE} strokeWidth={5} />
          <ellipse cx={430} cy={4120} rx={70} ry={34} fill="#5CC6D0" stroke={OUTLINE} strokeWidth={5} />
          <path
            d="M200,4060 C230,4050 260,4064 290,4056 M400,4116 C420,4110 440,4120 460,4114"
            stroke="#BDEBF0"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
          <path d="M150,4170 C140,4120 190,4110 210,4150 C220,4180 160,4190 150,4170 Z" fill="#B7B0C4" stroke={OUTLINE} strokeWidth={5} />
          <path d="M470,4180 C460,4130 520,4120 540,4160 C546,4190 480,4196 470,4180 Z" fill="#B7B0C4" stroke={OUTLINE} strokeWidth={5} />
          <path d="M330,4180 C320,4150 350,4140 366,4160 C374,4184 340,4192 330,4180 Z" fill="#B7B0C4" stroke={OUTLINE} strokeWidth={5} />
          <path
            d="M340,3990 L352,3960 L364,3990 L394,3992 L370,4010 L378,4040 L352,4022 L326,4040 L334,4010 L310,3992 Z"
            fill="#FF9E57"
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <Sign x={340} y={4270} label="Tide Pools" color="#3BB7C4" />
        </g>
      </Place>
      <Place
        id="sky"
        hit={[620, 5910, 500, 420]}
        label="Starlight Hill"
        onTap={onTap}
        badge={badges.sky && <Badge x={1090} y={5990} kind={badges.sky} />}
      >
        <g transform="translate(0 2080)">
          <path d="M620,4200 C640,4000 780,3930 870,3930 C960,3930 1100,4000 1120,4200 Z" fill="#7BC595" stroke={OUTLINE} strokeWidth={5} />
          <Shaded d="M800,4000 C800,3900 940,3900 940,4000 L940,4090 L800,4090 Z" shade={LILAC} depth={8} />
          <path d="M800,4000 C800,3900 940,3900 940,4000 Z" fill="#8F7AE0" stroke={OUTLINE} strokeWidth={5} />
          <path d="M850,3990 L900,3990" stroke="#FFE08A" strokeWidth={8} strokeLinecap="round" />
          <path d="M910,4060 L990,4020" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
          <path d="M910,4060 L990,4020" stroke="#FFC94A" strokeWidth={7} strokeLinecap="round" />
          <path d="M910,4090 L940,4130 M900,4090 L880,4130" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
          {[
            [700, 3980],
            [740, 3930],
            [1040, 3950],
            [1080, 4010],
          ].map(([x, y]) => (
            <path
              key={`${x}${y}`}
              d={`M${x},${y - 14} L${x + 5},${y - 4} L${x + 15},${y} L${x + 5},${y + 4} L${x},${y + 14} L${x - 5},${y + 4} L${x - 15},${y} L${x - 5},${y - 4} Z`}
              fill="#FFC94A"
              stroke={OUTLINE}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ))}
          <Sign x={870} y={4270} label="Starlight Hill" color="#8F7AE0" />
        </g>
      </Place>

      <g transform={`translate(0 ${STREET})`}>
        {/* Airport on the point */}
        <path d="M0,2740 C300,2700 800,2720 1170,2700 L1170,3200 L0,3200 Z" fill="#A5DDB4" stroke={OUTLINE} strokeWidth={5} />
        <Place id="airport" hit={[110, 2640, 980, 530]} label="Airport" onTap={onTap}>
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
      </g>
      {/* Secret shells: small treasures with a big invisible hit area (game-systems §9.2) */}
      {shells.map((sh) => (
        <g
          key={sh.id}
          role="button"
          tabIndex={0}
          aria-label="A shiny shell"
          data-testid={`shell-${sh.id}`}
          style={{ cursor: 'pointer' }}
          onClick={() => onShell?.(sh.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onShell?.(sh.id)}
        >
          <rect x={sh.x - 70} y={sh.y - 70} width={140} height={140} rx={70} fill="transparent" />
          <g transform={`translate(${sh.x - 42} ${sh.y - 46}) scale(0.84)`} pointerEvents="none">
            <g className="shell-spot">
              <ShellArt kind={sh.kind} color={sh.color} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
