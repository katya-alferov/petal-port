// Back walls for the two small restaurants (Bun & Bite, Sweet Spot), in the same style as the Sunny
// Café's: canvas 1170×1400 anchored to the bottom, with a menu board, window, shelf and a bright awning.
import type React from 'react';
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Pennants({ colors, y = 40 }: { colors: string[]; y?: number }) {
  return (
    <g>
      <path d={`M0,${y} Q585,${y + 100} 1170,${y}`} fill="none" stroke={OUTLINE} strokeWidth={4} />
      {Array.from({ length: 11 }, (_, i) => {
        const x = 50 + i * 106;
        const yy = y + Math.sin((x / 1170) * Math.PI) * 50;
        return (
          <path
            key={i}
            d={`M${x - 30},${yy} L${x + 30},${yy} L${x},${yy + 60} Z`}
            fill={colors[i % colors.length]}
            {...sw}
            strokeWidth={4}
          />
        );
      })}
    </g>
  );
}

function Window({ x, y, sea = true }: { x: number; y: number; sea?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={320} height={340} rx={30} fill="#BDE8EC" {...sw} strokeWidth={10} />
      {sea && (
        <path
          d={`M${x},${y + 240} C${x + 100},${y + 220} ${x + 220},${y + 250} ${x + 320},${y + 230} L${x + 320},${y + 340} L${x},${y + 340} Z`}
          fill="#3BB7C4"
        />
      )}
      <circle cx={x + 250} cy={y + 80} r={36} fill="#FFC94A" stroke={OUTLINE} strokeWidth={5} />
      <path d={`M${x + 160},${y} L${x + 160},${y + 340} M${x},${y + 170} L${x + 320},${y + 170}`} stroke={OUTLINE} strokeWidth={8} />
    </g>
  );
}

function Counter({ top, front, stripe }: { top: string; front: string; stripe: string }) {
  return (
    <g>
      <rect x={0} y={1060} width={1170} height={340} fill={front} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={30 + i * 145} y={1120} width={110} height={240} rx={14} fill={stripe} stroke={OUTLINE} strokeWidth={4} />
      ))}
      <rect x={0} y={1040} width={1170} height={50} rx={10} fill={top} {...sw} />
    </g>
  );
}

export function BurgerShopBackdrop() {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={1170} height={1400} fill="#FFE2CF" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 100} y={0} width={50} height={1400} fill="#FFD3BB" />
      ))}
      <Pennants colors={['#FF7B6B', '#FFC94A', '#FFF7EC']} />
      {/* menu board with a burger */}
      <rect x={70} y={230} width={360} height={290} rx={20} fill="#3F3A48" stroke="#8B5E3C" strokeWidth={18} />
      <text x={250} y={290} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize={46} fill="#FFF7EC">
        Burgers
      </text>
      <path d="M170,400 C170,340 330,340 330,400 Z" fill="#F2B45B" stroke="#FFF7EC" strokeWidth={5} />
      <rect x={165} y={408} width={170} height={20} rx={10} fill="#8A5A3C" stroke="#FFF7EC" strokeWidth={5} />
      <path d="M165,438 L335,438 L325,468 Q250,482 175,468 Z" fill="#F2B45B" stroke="#FFF7EC" strokeWidth={5} strokeLinejoin="round" />
      <Window x={780} y={200} />
      {/* shelf with ketchup and mustard */}
      <rect x={60} y={660} width={1050} height={22} rx={8} fill="#C98F5E" {...sw} strokeWidth={5} />
      {[140, 250, 860, 970].map((x, i) => (
        <g key={x}>
          <rect x={x - 28} y={578} width={56} height={82} rx={16} fill={i % 2 ? '#FFC94A' : '#E8503A'} {...sw} strokeWidth={5} />
          <rect x={x - 12} y={552} width={24} height={30} rx={8} fill="#FFF7EC" {...sw} strokeWidth={4} />
        </g>
      ))}
      {/* grill */}
      <rect x={470} y={500} width={230} height={160} rx={18} fill="#6C6577" {...sw} />
      <rect x={490} y={520} width={190} height={30} rx={10} fill="#3F3A48" />
      {[515, 560, 605, 650].map((x) => (
        <path key={x} d={`M${x},${540} L${x},${640}`} stroke="#B9B2C4" strokeWidth={8} strokeLinecap="round" />
      ))}
      <circle cx={585} cy={510} r={8} fill="#FFC94A" />
      <Counter top="#FFF7EC" front="#E8503A" stripe="#C94430" />
    </svg>
  );
}

export function SweetShopBackdrop() {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={1170} height={1400} fill="#FFE9F2" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 100} y={0} width={50} height={1400} fill="#FFDCEB" />
      ))}
      <Pennants colors={['#FF9EC4', '#9BE3C2', '#C8B3FF']} />
      {/* menu board with a cupcake */}
      <rect x={70} y={230} width={360} height={290} rx={20} fill="#6B4E8C" stroke="#8B5E3C" strokeWidth={18} />
      <text x={250} y={290} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize={46} fill="#FFF7EC">
        Cupcakes
      </text>
      <path d="M200,440 L300,440 L288,500 Q250,508 212,500 Z" fill="#FFB3D0" stroke="#FFF7EC" strokeWidth={5} strokeLinejoin="round" />
      <path
        d="M192,446 C180,400 220,384 232,392 C232,360 270,362 268,392 C300,386 316,420 308,446 Z"
        fill="#FF9EC4"
        stroke="#FFF7EC"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <circle cx={250} cy={362} r={13} fill="#E8335A" stroke="#FFF7EC" strokeWidth={4} />
      <Window x={780} y={200} sea={false} />
      {/* glass display case with cupcakes */}
      <rect x={470} y={470} width={230} height={190} rx={18} fill="#E8F8FF" {...sw} />
      <rect x={486} y={486} width={198} height={120} rx={10} fill="#FFFFFF" opacity={0.55} />
      {[
        [520, '#FF9EC4'],
        [585, '#9BE3C2'],
        [650, '#C8B3FF'],
      ].map(([x, c]) => (
        <g key={String(x)}>
          <path
            d={`M${Number(x) - 24},${600} L${Number(x) + 24},${600} L${Number(x) + 18},${630} L${Number(x) - 18},${630} Z`}
            fill="#FFB3D0"
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path
            d={`M${Number(x) - 26},${602} C${Number(x) - 30},${566} ${Number(x) + 30},${566} ${Number(x) + 26},${602} Z`}
            fill={String(c)}
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* shelf with jars */}
      <rect x={60} y={660} width={1050} height={22} rx={8} fill="#C98F5E" {...sw} strokeWidth={5} />
      {[140, 250, 860, 970].map((x, i) => (
        <g key={x}>
          <rect x={x - 30} y={576} width={60} height={84} rx={16} fill="#FFFFFF" opacity={0.85} {...sw} strokeWidth={5} />
          <rect x={x - 24} y={610} width={48} height={44} rx={10} fill={['#FF9EC4', '#9BE3C2', '#C8B3FF', '#FFC94A'][i]} />
          <rect x={x - 22} y={558} width={44} height={22} rx={8} fill="#FF7BA9" {...sw} strokeWidth={4} />
        </g>
      ))}
      <Counter top="#FFF7EC" front="#FF9EC4" stripe="#E883AC" />
    </svg>
  );
}

const Frame = ({ children, wall, stripe }: { children: React.ReactNode; wall: string; stripe: string }) => (
  <svg
    viewBox="0 0 1170 1400"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
    style={{ width: '100%', height: '100%', display: 'block' }}
  >
    <rect width={1170} height={1400} fill={wall} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={i * 100} y={0} width={50} height={1400} fill={stripe} />
    ))}
    {children}
  </svg>
);

/** Glow Nails: a lilac-and-pink studio with a mirror and a rack of polish bottles. */
export function NailShopBackdrop() {
  return (
    <Frame wall="#F3E8FF" stripe="#EADBFF">
      <Pennants colors={['#C8B3FF', '#FF9EC4', '#FFF7EC']} />
      <rect x={70} y={220} width={300} height={400} rx={150} fill="#E8F8FF" {...sw} strokeWidth={14} />
      <path d="M130,360 C170,300 230,300 270,360" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.8} />
      <rect x={480} y={330} width={620} height={22} rx={8} fill="#C98F5E" {...sw} strokeWidth={5} />
      <rect x={480} y={470} width={620} height={22} rx={8} fill="#C98F5E" {...sw} strokeWidth={5} />
      {['#FF7BA9', '#C94C8A', '#5BB8F0', '#5FD3A0', '#FFC94A', '#B692F6', '#FF7BA9', '#5BB8F0'].map((c, i) => (
        <g key={i}>
          <rect x={505 + i * 72} y={266} width={46} height={64} rx={14} fill={c} {...sw} strokeWidth={4} />
          <rect x={518 + i * 72} y={246} width={20} height={24} rx={6} fill="#5B4A6E" />
        </g>
      ))}
      {['#B692F6', '#FFC94A', '#5FD3A0', '#C94C8A', '#5BB8F0', '#FF7BA9', '#FFC94A', '#B692F6'].map((c, i) => (
        <g key={i}>
          <rect x={505 + i * 72} y={406} width={46} height={64} rx={14} fill={c} {...sw} strokeWidth={4} />
          <rect x={518 + i * 72} y={386} width={20} height={24} rx={6} fill="#5B4A6E" />
        </g>
      ))}
      <Counter top="#FFF7EC" front="#B692F6" stripe="#9A78DB" />
    </Frame>
  );
}

/** Petal Posies: a leafy green shop with a flower stand and buckets. */
export function PosyShopBackdrop() {
  return (
    <Frame wall="#E4F8E6" stripe="#D5F1D8">
      <Pennants colors={['#FF9EC4', '#FFC94A', '#B692F6']} />
      <Window x={780} y={200} sea={false} />
      <rect x={70} y={230} width={360} height={290} rx={20} fill="#3F6B4F" stroke="#8B5E3C" strokeWidth={18} />
      <text x={250} y={300} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize={50} fill="#FFF7EC">
        Fresh Posies
      </text>
      {[
        ['#FF7BA9', 150],
        ['#FFC94A', 250],
        ['#B692F6', 350],
      ].map(([c, x]) => (
        <g key={String(x)}>
          <path d={`M${x},470 L${x},400`} stroke="#6CC38A" strokeWidth={8} strokeLinecap="round" />
          <circle cx={Number(x)} cy={380} r={26} fill={String(c)} stroke="#FFF7EC" strokeWidth={5} />
          <circle cx={Number(x)} cy={380} r={8} fill="#FFF7EC" opacity={0.8} />
        </g>
      ))}
      <rect x={470} y={620} width={620} height={22} rx={8} fill="#C98F5E" {...sw} strokeWidth={5} />
      {['#FF7BA9', '#FFC94A', '#B692F6', '#FF8A65', '#FFFFFF'].map((c, i) => (
        <g key={i}>
          <path d={`M${520 + i * 110},620 L${520 + i * 110},520`} stroke="#6CC38A" strokeWidth={8} strokeLinecap="round" />
          <circle cx={520 + i * 110} cy={500} r={30} fill={c} {...sw} strokeWidth={4} />
          <circle cx={520 + i * 110} cy={500} r={9} fill="#FFC94A" />
        </g>
      ))}
      <Counter top="#FFF7EC" front="#6CC38A" stripe="#4FAE70" />
    </Frame>
  );
}
