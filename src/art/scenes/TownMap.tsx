// The vertical town map (game-systems §5.1): hill, town, harbour, airport, top to bottom. Canvas 1170×3200.
import type { ReactNode } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';
import { ShellArt } from '../shells';

export type PlaceId = 'boutique' | 'park' | 'cafe' | 'home' | 'airport' | 'cottage' | 'petshop' | 'board' | 'postbox' | 'stage';

export const MAP_W = 1170;
export const MAP_H = 3200;

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
  airport: 2860,
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
  shells?: readonly { id: string; kind: string; color: string; x: number; y: number }[];
  onShell?: (id: string) => void;
}

export function TownMap({ onTap, onCat, badges = {}, homeName = 'Harbour Loft', pet, mail = false, shells = [], onShell }: TownMapProps) {
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
        <Sign x={860} y={1190} label="Ribbon Boutique" color="#FF7BA9" />
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
        hit={[600, 1260, 300, 270]}
        label="Petal Notes board"
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
      </Place>

      {/* Post Box */}
      <Place
        id="postbox"
        hit={[990, 2060, 170, 220]}
        label={mail ? 'Post Box: a letter is waiting' : 'Post Box'}
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
      </Place>

      {/* Petal Park (scenery: pond and ducks) */}
      <Place id="park" hit={[50, 1200, 500, 400]} label="Petal Park" onTap={onTap}>
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

      {/* Secret shells: small treasures with a big invisible hit area (game-systems §9.2) */}
      {shells.map((sh) => (
        <g
          key={sh.id}
          role="button"
          tabIndex={0}
          aria-label="A shiny shell"
          data-testid={`shell-${sh.id}`}
          className="shell-spot"
          style={{ cursor: 'pointer' }}
          onClick={() => onShell?.(sh.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onShell?.(sh.id)}
        >
          <rect x={sh.x - 70} y={sh.y - 70} width={140} height={140} rx={70} fill="transparent" />
          <g transform={`translate(${sh.x - 42} ${sh.y - 46}) scale(0.84)`}>
            <ShellArt kind={sh.kind} color={sh.color} />
          </g>
        </g>
      ))}
    </svg>
  );
}
