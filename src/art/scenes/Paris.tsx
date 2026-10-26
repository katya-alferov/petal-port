// Paris garden path (game-systems §7.2): an original, stylized golden-hour drawing with a lattice
// tower behind a tree-lined path, a café terrace on the left and a souvenir kiosk on the right.
// Canvas 1170×1500, anchored to the bottom. Hotspots are SVG buttons; the player is drawn on top.
import type { ReactNode } from 'react';
import { OUTLINE } from '../kit';

export const PATH_Y = 1180;
const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export type ParisSpot = 'kiosk' | 'cafe' | 'pigeon' | 'easel' | 'photo';

function Tower() {
  const iron = '#C98F6B';
  const dark = '#A66F52';
  return (
    <g>
      {/* legs */}
      <path
        d="M470,1060 C500,880 540,760 575,560 L595,560 C630,760 670,880 700,1060 L650,1060 C630,960 612,900 585,880 C558,900 540,960 520,1060 Z"
        fill={iron}
        {...sw}
      />
      {/* lower platform and arch */}
      <rect x={515} y={800} width={140} height={26} rx={8} fill={dark} {...sw} />
      <path d="M525,1060 C530,960 560,910 585,910 C610,910 640,960 645,1060" fill="none" stroke={OUTLINE} strokeWidth={4} />
      {/* middle section */}
      <path d="M548,800 C556,700 566,640 578,560 L592,560 C604,640 614,700 622,800 Z" fill={iron} {...sw} />
      <rect x={545} y={640} width={80} height={20} rx={7} fill={dark} {...sw} />
      {/* lattice cross-bars */}
      {[830, 870, 920, 980].map((y) => (
        <path
          key={y}
          d={`M${520 + (1060 - y) * 0.02},${y} L${650 - (1060 - y) * 0.02},${y - 30} M${650 - (1060 - y) * 0.02},${y} L${520 + (1060 - y) * 0.02},${y - 30}`}
          stroke={OUTLINE}
          strokeWidth={3}
          opacity={0.55}
          fill="none"
        />
      ))}
      {/* top and spire */}
      <path d="M580,560 C582,520 584,490 585,440 C586,490 588,520 590,560 Z" fill={dark} {...sw} />
      <circle cx={585} cy={436} r={8} fill="#FFE08A" {...sw} />
    </g>
  );
}

function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${PATH_Y - 60}) scale(${s})`}>
      <rect x={-12} y={-160} width={24} height={170} rx={8} fill="#A06A48" {...sw} />
      <circle cx={0} cy={-220} r={92} fill="#6FCB8F" {...sw} />
      <circle cx={-52} cy={-170} r={58} fill="#58B87B" {...sw} />
      <circle cx={56} cy={-176} r={56} fill="#7ED6A7" {...sw} />
      <circle cx={-20} cy={-250} r={26} fill="#A6E8C0" opacity={0.7} />
    </g>
  );
}

function Hot({
  id,
  label,
  box,
  onTap,
  children,
}: {
  id: ParisSpot;
  label: string;
  box: [number, number, number, number];
  onTap?: (id: ParisSpot) => void;
  children?: ReactNode;
}) {
  const [x, y, w, h] = box;
  return (
    <g
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      aria-label={onTap ? label : undefined}
      data-testid={onTap ? `paris-${id}` : undefined}
      style={onTap ? { cursor: 'pointer' } : undefined}
      onClick={() => onTap?.(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap?.(id)}
    >
      <rect x={x} y={y} width={w} height={h} fill="transparent" />
      {children}
    </g>
  );
}

export function ParisBackdrop({
  onTap,
  painting = 0,
  pigeon = false,
}: {
  onTap?: (id: ParisSpot) => void;
  painting?: number;
  pigeon?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1170 1500"
      preserveAspectRatio="xMidYMax slice"
      role="group"
      aria-label="A garden path in Paris"
      data-testid="paris-art"
    >
      <defs>
        <linearGradient id="paris-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EC9FF" />
          <stop offset="0.6" stopColor="#FFD9B0" />
          <stop offset="1" stopColor="#FFC2A0" />
        </linearGradient>
      </defs>
      <rect width={1170} height={1240} fill="url(#paris-sky)" />
      <circle cx={900} cy={420} r={90} fill="#FFE9A8" opacity={0.85} />
      {[
        [170, 300, 1],
        [760, 220, 0.8],
        [980, 520, 0.7],
      ].map(([x, y, k]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
          <path d="M0,40 q-10,-40 36,-34 q14,-44 70,-22 q54,-10 58,36 q40,6 34,44 L10,64 q-34,0 -10,-24 Z" fill="#FFF7EC" opacity={0.95} />
        </g>
      ))}
      <path d="M0,1060 C200,1000 400,1030 600,1000 C800,970 1000,1010 1170,980 L1170,1240 L0,1240 Z" fill="#B9E8B4" />
      <Tower />
      <Tree x={160} s={1.15} />
      <Tree x={1010} s={1.2} />
      <Tree x={330} s={0.8} />
      <Tree x={850} s={0.82} />
      {/* path */}
      <path d="M0,1500 L0,1140 C300,1110 500,1100 585,1100 C700,1100 900,1110 1170,1140 L1170,1500 Z" fill="#F3D9B1" />
      <path d="M470,1500 L545,1100 L625,1100 L700,1500 Z" fill="#EBC995" />
      <path d="M0,1140 C300,1110 500,1100 585,1100 C700,1100 900,1110 1170,1140" fill="none" stroke={OUTLINE} strokeWidth={4} />
      {/* painted photo mark on the path */}
      <Hot id="photo" label="Photo spot" box={[440, 1260, 290, 130]} onTap={onTap}>
        <ellipse cx={585} cy={1330} rx={120} ry={34} fill="#FFF7EC" stroke="#FF7BA9" strokeWidth={6} strokeDasharray="14 10" />
        <path
          d="M585,1318 l5,10 l11,2 l-8,8 l2,11 l-10,-5 l-10,5 l2,-11 l-8,-8 l11,-2 Z"
          fill="#FF7BA9"
          stroke={OUTLINE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </Hot>
      {/* café terrace (left) */}
      <g>
        <rect x={40} y={1010} width={220} height={150} rx={14} fill="#FFF7EC" {...sw} />
        <path d="M30,1010 L270,1010 L250,950 L50,950 Z" fill="#FF7BA9" {...sw} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${50 + i * 40},950 L${50 + i * 40 + 20},950 L${40 + i * 40 + 20},1010 L${40 + i * 40},1010 Z`}
            fill="#FFF7EC"
            opacity={0.9}
          />
        ))}
        <rect x={70} y={1050} width={60} height={110} rx={10} fill="#8EC9FF" {...sw} />
        <circle cx={190} cy={1130} r={30} fill="#FFC94A" {...sw} />
        <rect x={186} y={1130} width={8} height={30} fill={OUTLINE} />
      </g>
      <Hot id="cafe" label="Café bell" box={[20, 930, 270, 250]} onTap={onTap}>
        <circle cx={246} cy={1075} r={22} fill="#FFC94A" {...sw} />
        <path d="M236,1085 q10,12 20,0" fill="none" stroke={OUTLINE} strokeWidth={3} />
      </Hot>
      {/* street painter's easel */}
      <Hot id="easel" label="Painter's easel" box={[290, 1030, 150, 200]} onTap={onTap}>
        <path d="M330,1210 L350,1060 M410,1210 L390,1060 M370,1210 L370,1090" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
        <rect x={322} y={1040} width={96} height={80} rx={6} fill="#FFF7EC" {...sw} />
        {painting >= 1 && (
          <path
            d="M334,1100 C350,1080 366,1100 380,1084 C392,1072 402,1090 408,1086"
            stroke="#8EC9FF"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {painting >= 2 && <path d="M336,1060 q16,-10 32,0" stroke="#FFC94A" strokeWidth={6} fill="none" strokeLinecap="round" />}
        {painting >= 3 && <path d="M390,1058 q10,0 12,12" stroke="#FF7BA9" strokeWidth={6} fill="none" strokeLinecap="round" />}
        {painting >= 4 && <path d="M350,1112 l14,-6" stroke="#6FCB8F" strokeWidth={6} fill="none" strokeLinecap="round" />}
        {painting >= 5 && (
          <path
            d="M370,1052 L364,1100 L376,1100 Z M360,1100 L380,1100"
            fill={OUTLINE}
            stroke={OUTLINE}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        )}
      </Hot>
      {/* souvenir kiosk (right) */}
      <Hot id="kiosk" label="Souvenir kiosk" box={[860, 960, 290, 240]} onTap={onTap}>
        <rect x={890} y={1020} width={220} height={150} rx={14} fill="#B692F6" {...sw} />
        <path d="M876,1020 L1124,1020 L1104,950 L896,950 Z" fill="#FFC94A" {...sw} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${896 + i * 42},950 L${896 + i * 42 + 21},950 L${886 + i * 42 + 21},1020 L${886 + i * 42},1020 Z`}
            fill="#FFF7EC"
            opacity={0.9}
          />
        ))}
        <rect x={912} y={1050} width={176} height={60} rx={8} fill="#FFF7EC" {...sw} />
        <path d="M930,1100 L942,1070 L954,1100 Z" fill="#C98F6B" {...sw} />
        <circle cx={990} cy={1086} r={14} fill="#FF7BA9" {...sw} />
        <circle cx={1040} cy={1086} r={14} fill="#B692F6" {...sw} />
      </Hot>
      {/* pigeon */}
      <Hot id="pigeon" label="Pigeon" box={[730, 1170, 120, 90]} onTap={onTap}>
        <g className={pigeon ? 'pigeon-flap' : undefined}>
          <ellipse cx={790} cy={1228} rx={34} ry={22} fill="#C9C2D6" {...sw} />
          <circle cx={816} cy={1208} r={15} fill="#C9C2D6" {...sw} />
          <path d="M830,1208 l12,4 l-12,4 Z" fill="#FFC94A" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={820} cy={1205} r={3} fill={OUTLINE} />
          <path d="M760,1228 q-22,-6 -30,-18 q22,2 34,8 Z" fill="#AFA7C2" {...sw} />
          <path d="M780,1250 l0,10 M798,1250 l0,10" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
        </g>
      </Hot>
    </svg>
  );
}
