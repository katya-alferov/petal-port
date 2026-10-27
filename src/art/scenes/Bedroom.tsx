// Bedroom (game-systems §17): canvas 1170×1400 anchored to the bottom. Wall, bedding, lamp, picture and
// rug come from the player's choices; colors arrive as props.
import type { ReactNode } from 'react';
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export interface BedroomColors {
  wall: string;
  stripe: string;
  floor: string;
  main: string;
  accent: string;
}
export type BedroomSpot = 'lamp' | 'picture' | 'window' | 'bed';

function Picture({ id }: { id: string }) {
  const f = { x: 130, y: 260, w: 280, h: 240 };
  return (
    <g>
      <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={14} fill="#FFF7EC" {...sw} strokeWidth={10} />
      <clipPath id="bed-pic">
        <rect x={f.x + 14} y={f.y + 14} width={f.w - 28} height={f.h - 28} rx={6} />
      </clipPath>
      <g clipPath="url(#bed-pic)">
        {id === 'sunset' && (
          <>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#FFB38A" />
            <circle cx={270} cy={400} r={50} fill="#FFE08A" />
            <path d="M130,420 C200,396 340,430 410,410 L410,500 L130,500 Z" fill="#7B5EA7" />
          </>
        )}
        {id === 'flowers' && (
          <>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#DFF5EC" />
            {[
              [190, 380, '#FF7BA9'],
              [270, 350, '#FFC94A'],
              [350, 390, '#B692F6'],
            ].map(([x, y, c]) => (
              <g key={String(x)}>
                <path d={`M${x},${y} L${x},470`} stroke="#3F9E63" strokeWidth={8} />
                <circle cx={Number(x)} cy={Number(y)} r={26} fill={String(c)} stroke={OUTLINE} strokeWidth={4} />
                <circle cx={Number(x)} cy={Number(y)} r={9} fill="#FFF7EC" />
              </g>
            ))}
          </>
        )}
        {id === 'stars' && (
          <>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#2B2950" />
            {[
              [190, 330],
              [260, 400],
              [330, 320],
              [370, 440],
              [210, 450],
            ].map(([x, y]) => (
              <path
                key={`${x}${y}`}
                d={`M${x},${y - 18} L${x + 6},${y - 6} L${x + 18},${y} L${x + 6},${y + 6} L${x},${y + 18} L${x - 6},${y + 6} L${x - 18},${y} L${x - 6},${y - 6} Z`}
                fill="#FFE08A"
              />
            ))}
          </>
        )}
        {id === 'boat' && (
          <>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#BDE8EC" />
            <rect x={f.x} y={400} width={f.w} height={110} fill="#3BB7C4" />
            <path d="M220,420 L320,420 L305,455 L235,455 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d="M270,414 L270,330 L315,410 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          </>
        )}
        {id === 'cat' && (
          <>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#FFE9F2" />
            <ellipse cx={270} cy={450} rx={80} ry={40} fill="#FF9F68" stroke={OUTLINE} strokeWidth={4} />
            <circle cx={220} cy={420} r={32} fill="#FF9F68" stroke={OUTLINE} strokeWidth={4} />
            <path
              d="M196,396 L200,368 L220,388 M240,388 L254,368 L250,400"
              fill="#FF9F68"
              stroke={OUTLINE}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <path d="M206,420 q8,6 16,0 M230,420 q8,6 16,0" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
          </>
        )}
      </g>
    </g>
  );
}

function Lamp({ id, on }: { id: string; on: boolean }) {
  const glow = on ? '#FFE9A8' : '#E8E1D6';
  return (
    <g>
      <rect x={846} y={1010} width={22} height={70} fill="#8E86A0" {...sw} strokeWidth={5} />
      <ellipse cx={857} cy={1086} rx={44} ry={12} fill="#6C6577" {...sw} strokeWidth={5} />
      {id === 'dome' && <path d="M800,1016 C800,940 914,940 914,1016 Z" fill={glow} {...sw} />}
      {id === 'star' && (
        <path
          d="M857,900 L877,950 L930,954 L890,988 L902,1040 L857,1012 L812,1040 L824,988 L784,954 L837,950 Z"
          fill={on ? '#FFD84A' : '#E8D9A0'}
          {...sw}
        />
      )}
      {id === 'cloud' && (
        <path
          d="M806,1010 C780,1010 780,970 810,968 C812,934 862,934 868,962 C896,950 922,978 906,1010 Z"
          fill={on ? '#FFFFFF' : '#E8E1D6'}
          {...sw}
        />
      )}
      {id === 'tulip' && (
        <path
          d="M806,1016 C800,960 820,930 840,960 C848,930 866,930 874,960 C894,930 914,960 908,1016 Z"
          fill={on ? '#FFB3D0' : '#E8D3DC'}
          {...sw}
        />
      )}
    </g>
  );
}

function Rug({ id, color }: { id: string; color: string }) {
  if (id === 'star')
    return (
      <path
        d="M585,1190 L620,1262 L700,1272 L640,1326 L658,1404 L585,1362 L512,1404 L530,1326 L470,1272 L550,1262 Z"
        fill={color}
        {...sw}
      />
    );
  if (id === 'heart')
    return (
      <path
        d="M585,1400 C440,1300 450,1190 520,1200 C556,1204 580,1230 585,1250 C590,1230 614,1204 650,1200 C720,1190 730,1300 585,1400 Z"
        fill={color}
        {...sw}
      />
    );
  return (
    <g>
      <ellipse cx={585} cy={1290} rx={250} ry={78} fill={color} {...sw} />
      <ellipse cx={585} cy={1290} rx={160} ry={46} fill="#FFFFFF" opacity={0.35} />
    </g>
  );
}

export function BedroomArt({
  colors,
  lamp,
  picture,
  rug,
  lampOn = true,
  onTap,
  children,
}: {
  colors: BedroomColors;
  lamp: string;
  picture: string;
  rug: string;
  lampOn?: boolean;
  onTap?: (spot: BedroomSpot) => void;
  children?: ReactNode;
}) {
  const hot = (spot: BedroomSpot, label: string, box: [number, number, number, number], body: ReactNode) => (
    <g
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      aria-label={onTap ? label : undefined}
      data-testid={onTap ? `bed-${spot}` : undefined}
      style={onTap ? { cursor: 'pointer' } : undefined}
      onClick={onTap ? () => onTap(spot) : undefined}
      onKeyDown={onTap ? (e) => (e.key === 'Enter' || e.key === ' ') && onTap(spot) : undefined}
    >
      <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill="transparent" />
      {body}
    </g>
  );
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      role={onTap ? 'group' : undefined}
      aria-label={onTap ? 'Your bedroom' : undefined}
      aria-hidden={onTap ? undefined : true}
      data-testid={onTap ? 'bedroom-art' : undefined}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={1170} height={1400} fill={colors.wall} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 100} y={0} width={50} height={1010} fill={colors.stripe} />
      ))}
      <rect x={0} y={1000} width={1170} height={400} fill={colors.floor} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 100},1000 L${i * 100 - 120 + i * 24},1400`} stroke="#00000022" strokeWidth={4} />
      ))}
      <rect x={0} y={984} width={1170} height={26} fill="#FFF7EC" {...sw} strokeWidth={5} />
      {hot('picture', 'Wall picture', [110, 240, 320, 280], <Picture id={picture} />)}
      {hot(
        'window',
        'Window',
        [740, 200, 360, 460],
        <g>
          <rect x={780} y={230} width={280} height={380} rx={26} fill="#BDE8EC" {...sw} strokeWidth={10} />
          <circle cx={990} cy={310} r={32} fill="#FFE08A" stroke={OUTLINE} strokeWidth={4} />
          <path d="M780,520 C860,500 960,530 1060,510 L1060,610 L780,610 Z" fill="#7ED6A7" />
          <path d="M920,230 L920,610 M780,420 L1060,420" stroke={OUTLINE} strokeWidth={8} />
          <path d="M760,220 C800,300 800,420 770,640 L840,640 C850,460 850,300 830,220 Z" fill={colors.accent} {...sw} strokeWidth={5} />
          <path
            d="M1080,220 C1040,300 1040,420 1070,640 L1000,640 C990,460 990,300 1010,220 Z"
            fill={colors.accent}
            {...sw}
            strokeWidth={5}
          />
        </g>,
      )}
      <Rug id={rug} color={colors.main} />
      {hot(
        'bed',
        'Bed',
        [40, 700, 700, 400],
        <g>
          <rect x={60} y={700} width={90} height={380} rx={26} fill={colors.main} {...sw} />
          <rect x={90} y={870} width={620} height={190} rx={22} fill="#FFF7EC" {...sw} />
          <rect x={100} y={940} width={600} height={140} rx={22} fill={colors.main} {...sw} />
          <rect x={100} y={940} width={600} height={34} rx={14} fill={colors.accent} {...sw} strokeWidth={5} />
          <rect x={120} y={850} width={190} height={74} rx={34} fill="#FFFFFF" {...sw} />
          <path d="M150,886 q40,-16 80,0" fill="none" stroke={colors.accent} strokeWidth={8} strokeLinecap="round" />
          <rect x={110} y={1076} width={26} height={44} rx={8} fill="#8E6B50" {...sw} strokeWidth={5} />
          <rect x={664} y={1076} width={26} height={44} rx={8} fill="#8E6B50" {...sw} strokeWidth={5} />
          {[200, 300, 400, 500, 600].map((x) => (
            <circle key={x} cx={x} cy={1010} r={9} fill="#FFFFFF" opacity={0.7} />
          ))}
        </g>,
      )}
      {/* nightstand and lamp */}
      <rect x={780} y={1070} width={150} height={150} rx={14} fill="#C98F5E" {...sw} />
      <rect x={800} y={1110} width={110} height={26} rx={8} fill="#B57D4E" {...sw} strokeWidth={4} />
      {hot('lamp', 'Lamp', [770, 880, 190, 220], <Lamp id={lamp} on={lampOn} />)}
      {lampOn ? (
        <circle cx={857} cy={980} r={230} fill="#FFE9A8" opacity={0.2} pointerEvents="none" />
      ) : (
        <rect width={1170} height={1400} fill="#1F1B3F" opacity={0.38} pointerEvents="none" />
      )}
      {children}
    </svg>
  );
}
