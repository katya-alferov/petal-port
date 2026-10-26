// Starlight Stage runway (game-systems §9.1). Canvas 1170×1400, anchored to the bottom so the
// runway floor always shows; the scene draws the player on top of it.
import { OUTLINE, Shaded, scallopCircle } from '../kit';

const CURTAIN = { base: '#FF7BA9', shadow: '#D86094', highlight: '#FFADCA' };
const FLOOR_Y = 1000;

export function Runway({ light }: { light: string }) {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="The Starlight Stage runway"
      data-testid="runway"
    >
      <defs>
        <linearGradient id="rw-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2E4F" />
          <stop offset="1" stopColor="#6B4E8C" />
        </linearGradient>
        <linearGradient id="rw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B39DFF" />
          <stop offset="1" stopColor="#8E78D8" />
        </linearGradient>
      </defs>
      {/* Back wall with twinkles */}
      <rect width={1170} height={FLOOR_Y} fill="url(#rw-back)" />
      {[
        [180, 260],
        [320, 140],
        [860, 180],
        [990, 300],
        [585, 90],
        [740, 330],
        [420, 360],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x},${y - 18} L${x + 5},${y - 5} L${x + 18},${y} L${x + 5},${y + 5} L${x},${y + 18} L${x - 5},${y + 5} L${x - 18},${y} L${x - 5},${y - 5} Z`}
          fill="#FFF7EC"
          opacity={0.8}
        />
      ))}
      {/* Big star sign */}
      <path d={scallopCircle(585, 250, 120, 14, 10)} fill={light} stroke={OUTLINE} strokeWidth={6} opacity={0.95} />
      <path
        d="M585,170 L606,226 L666,228 L619,264 L636,322 L585,288 L534,322 L551,264 L504,228 L564,226 Z"
        fill="#FFF7EC"
        stroke={OUTLINE}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* Spotlight beams in the theme color */}
      <path d={`M140,0 L260,0 L700,${FLOOR_Y + 300} L420,${FLOOR_Y + 300} Z`} fill={light} opacity={0.18} />
      <path d={`M1030,0 L910,0 L470,${FLOOR_Y + 300} L750,${FLOOR_Y + 300} Z`} fill={light} opacity={0.18} />
      {/* Curtains */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? 'translate(1170 0) scale(-1 1)' : undefined}>
          <Shaded d={`M0,0 L230,0 C200,300 170,600 200,${FLOOR_Y} L0,${FLOOR_Y} Z`} shade={CURTAIN} depth={10} />
          {[60, 120, 175].map((x) => (
            <path
              key={x}
              d={`M${x},20 C${x - 20},300 ${x - 30},600 ${x - 10},${FLOOR_Y - 20}`}
              fill="none"
              stroke={CURTAIN.shadow}
              strokeWidth={6}
            />
          ))}
          <path
            d={`M180,${FLOOR_Y * 0.55} C140,${FLOOR_Y * 0.58} 60,${FLOOR_Y * 0.6} 0,${FLOOR_Y * 0.58}`}
            fill="none"
            stroke="#FFC94A"
            strokeWidth={14}
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Marquee bulbs */}
      <rect x={0} y={0} width={1170} height={60} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={50 + i * 97} cy={30} r={14} fill="#FFE08A" stroke={OUTLINE} strokeWidth={4} />
      ))}
      {/* Stage floor and the runway carpet */}
      <rect y={FLOOR_Y} width={1170} height={400} fill="url(#rw-floor)" />
      <path d={`M0,${FLOOR_Y} L1170,${FLOOR_Y}`} stroke={OUTLINE} strokeWidth={6} />
      <path
        d={`M470,${FLOOR_Y} L700,${FLOOR_Y} L880,1400 L290,1400 Z`}
        fill="#FFADCA"
        stroke={OUTLINE}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d={`M500,${FLOOR_Y} L670,${FLOOR_Y} L820,1400 L350,1400 Z`} fill="#FFD3E2" />
      {[1080, 1180, 1300].map((y) => (
        <circle key={y} cx={585} cy={y} r={8 + (y - FLOOR_Y) / 40} fill="#FFF7EC" opacity={0.85} />
      ))}
      {/* Footlights */}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <ellipse cx={90 + i * 165} cy={1370} rx={40} ry={20} fill="#FFE08A" stroke={OUTLINE} strokeWidth={4} />
          <ellipse cx={80 + i * 165} cy={1364} rx={14} ry={6} fill="#FFFFFF" opacity={0.8} />
        </g>
      ))}
    </svg>
  );
}
